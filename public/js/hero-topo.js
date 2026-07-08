/* 3D topographic hero: mouse parallax + entrance (vanilla port of Halide effect). */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('topoCanvas');
    const layer = document.getElementById('topoLayer');
    if (!canvas) return;

    if (reduce) { canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg)'; return; }

    // Entrance
    canvas.style.opacity = '0';
    canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.85)';
    setTimeout(() => {
      canvas.style.transition = 'transform 2.4s cubic-bezier(0.16,1,0.3,1), opacity 2.4s cubic-bezier(0.16,1,0.3,1)';
      canvas.style.opacity = '1';
      canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
    }, 250);

    // Mouse parallax (throttled via rAF)
    let tx = 0, ty = 0, raf = null;
    function apply() {
      raf = null;
      canvas.style.transform = `rotateX(${55 + ty / 2}deg) rotateZ(${-25 + tx / 2}deg) scale(1)`;
      if (layer) layer.style.transform = `translateZ(15px) translate(${tx * 0.2}px, ${ty * 0.2}px)`;
    }
    window.addEventListener('mousemove', (e) => {
      tx = (window.innerWidth / 2 - e.pageX) / 25;
      ty = (window.innerHeight / 2 - e.pageY) / 25;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
  });
})();
