/* Text Rotate — vanilla port. Cycles words with per-character spring-in/out. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    const interval = Number(el.dataset.interval) || 2600;
    const stagger = 32; // ms per char
    let idx = 0;

    el.classList.add('text-rotate-ready');
    el.setAttribute('aria-live', 'polite');

    function render(text, animate) {
      el.innerHTML = '';
      const chars = graphemes(text);
      const spans = chars.map((c) => {
        const s = document.createElement('span');
        s.className = 'tr-char';
        s.textContent = c === ' ' ? ' ' : c;
        el.appendChild(s);
        return s;
      });
      if (reduce || !animate) { spans.forEach((s) => s.classList.add('in')); return spans; }
      // force reflow then stagger in
      void el.offsetWidth;
      spans.forEach((s, i) => { s.style.transitionDelay = (i * stagger) + 'ms'; requestAnimationFrame(() => s.classList.add('in')); });
      return spans;
    }

    let spans = render(texts[0], false);

    function rotate() {
      const cur = spans;
      if (!reduce) {
        cur.forEach((s, i) => { s.style.transitionDelay = (i * stagger) + 'ms'; s.classList.remove('in'); s.classList.add('out'); });
      }
      const delay = reduce ? 0 : (cur.length * stagger + 260);
      window.setTimeout(() => {
        idx = (idx + 1) % texts.length;
        spans = render(texts[idx], true);
      }, delay);
    }

    window.setInterval(rotate, Math.max(1500, interval));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.text-rotate').forEach(init);
  });
})();
