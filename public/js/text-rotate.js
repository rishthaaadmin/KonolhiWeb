/* Text Rotate — cycles words with a per-character spring reveal.
 * Single self-scheduling loop (no setInterval) to avoid out/in races. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STAGGER = 32; // ms per character

  function graphemes(text) {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(seg.segment(text), (s) => s.segment);
    }
    return Array.from(text);
  }

  function init(el) {
    let texts;
    try { texts = JSON.parse(el.dataset.texts); } catch { return; }
    if (!Array.isArray(texts) || !texts.length) return;

    const interval = Math.max(1400, Number(el.dataset.interval) || 2600);
    let idx = 0;
    let spans = [];

    el.setAttribute('aria-live', 'polite');

    function build(text) {
      el.innerHTML = '';
      spans = graphemes(text).map((c, i) => {
        const s = document.createElement('span');
        s.className = 'tr-char';
        s.textContent = c === ' ' ? ' ' : c;
        s.style.transitionDelay = (i * STAGGER) + 'ms';
        el.appendChild(s);
        return s;
      });
    }

    // Double rAF guarantees the hidden initial state paints before we flip to .in
    function reveal() {
      const current = spans;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        current.forEach((s) => { s.classList.remove('out'); s.classList.add('in'); });
      }));
    }

    build(texts[0]);
    if (reduce) { spans.forEach((s) => s.classList.add('in')); return; }
    reveal();

    function cycle() {
      // animate current word out
      spans.forEach((s) => { s.classList.remove('in'); s.classList.add('out'); });
      const outMs = spans.length * STAGGER + 400;
      window.setTimeout(() => {
        idx = (idx + 1) % texts.length;
        build(texts[idx]);
        reveal();
        window.setTimeout(cycle, interval); // schedule next only after this word is shown
      }, outMs);
    }
    window.setTimeout(cycle, interval);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.text-rotate').forEach(init);
  });
})();
