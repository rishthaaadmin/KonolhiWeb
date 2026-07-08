/* Static hero image + cursor-driven glow (circuit lines/dots light up under the pointer). */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover = window.matchMedia('(hover: none)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('topoCanvas');
    const layer = document.getElementById('topoLayer');
    if (!canvas) return;

    // Image stays static (gentle one-time fade-in only).
    canvas.style.transform = 'scale(1.04)';
    if (!reduce) {
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.transition = 'opacity 1.1s ease';
        canvas.style.opacity = '1';
      }, 150);
    }

    if (reduce || noHover || !layer) return;

    const hero = canvas.closest('.hero');
    let raf = null, mx = 0, my = 0;
    function apply() {
      raf = null;
      layer.style.setProperty('--mx', mx + 'px');
      layer.style.setProperty('--my', my + 'px');
    }
    hero.addEventListener('pointermove', (e) => {
      const rect = layer.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      layer.classList.add('glow-on');
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => layer.classList.remove('glow-on'));
  });
})();
