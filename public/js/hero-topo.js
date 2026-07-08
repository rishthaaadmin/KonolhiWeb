/* Interactive hero background: subtle cursor parallax on a full-bleed image. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noMotion = reduce
    || window.matchMedia('(hover: none)').matches
    || window.matchMedia('(max-width: 768px)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('topoCanvas');
    const layer = document.getElementById('topoLayer');
    if (!canvas) return;

    if (noMotion) { canvas.style.transform = 'scale(1.02)'; return; }

    // Entrance
    canvas.style.opacity = '0';
    canvas.style.transform = 'scale(1.1)';
    setTimeout(() => {
      canvas.style.transition = 'opacity 1.2s ease, transform 1.6s cubic-bezier(0.16,1,0.3,1)';
      canvas.style.opacity = '1';
      canvas.style.transform = 'translate(0,0) scale(1.05)';
    }, 180);

    // Cursor parallax (rAF-throttled)
    let tx = 0, ty = 0, raf = null;
    function apply() {
      raf = null;
      canvas.style.transform = `translate(${tx}px, ${ty}px) scale(1.06)`;
      if (layer) layer.style.transform = `translate(${tx * 0.4}px, ${ty * 0.4}px)`;
    }
    window.addEventListener('mousemove', (e) => {
      tx = (window.innerWidth / 2 - e.pageX) / 18;
      ty = (window.innerHeight / 2 - e.pageY) / 18;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
  });
})();
