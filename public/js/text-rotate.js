/* Text Rotate — minimal, robust word swap.
 * One element, one timer: fade/slide the whole word out, swap text, fade/slide in.
 * No per-character animation, so no overlap/stuck states are possible. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OUT_MS = 380; // must match the CSS transition duration

  function init(el) {
    let texts;
    try { texts = JSON.parse(el.dataset.texts); } catch { return; }
    if (!Array.isArray(texts) || !texts.length) return;

    el.textContent = texts[0];
    el.setAttribute('aria-live', 'polite');
    if (reduce || texts.length < 2) return;

    const interval = Math.max(1600, Number(el.dataset.interval) || 2600);
    let i = 0;

    window.setInterval(() => {
      el.classList.add('is-out');          // animate current word out
      window.setTimeout(() => {
        i = (i + 1) % texts.length;
        el.textContent = texts[i];         // swap while hidden
        el.classList.remove('is-out');     // animate new word in
      }, OUT_MS);
    }, interval);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.text-rotate').forEach(init);
  });
})();
