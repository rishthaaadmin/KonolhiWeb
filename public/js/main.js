/* Scroll reveal + hero flow animation. */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll reveal ----
  document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      items.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min((i % 6) * 60, 300)}ms`;
        io.observe(el);
      });
    }

    initHeroFlow();
  });

  // ---- Hero flow: search → visit → enquiry → booking → dashboard → report ----
  function initHeroFlow() {
    const flow = document.getElementById('heroFlow');
    if (!flow) return;
    const steps = [...flow.querySelectorAll('.flow-step')];
    const connectors = [...flow.querySelectorAll('.flow-connector')];
    if (!steps.length) return;

    if (reduced) {
      steps.forEach((s) => s.classList.add('done'));
      connectors.forEach((c) => c.classList.add('filled'));
      steps[steps.length - 1].classList.add('active');
      return;
    }

    let i = -1;
    const STEP_MS = 1400;
    const RESET_PAUSE = 2 * STEP_MS;

    function tick() {
      i += 1;
      if (i >= steps.length) {
        // hold the finished state, then reset
        setTimeout(() => {
          steps.forEach((s) => s.classList.remove('active', 'done'));
          connectors.forEach((c) => c.classList.remove('filled'));
          i = -1;
          setTimeout(tick, 500);
        }, RESET_PAUSE);
        return;
      }
      steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
      if (i > 0) {
        steps[i - 1].classList.add('done');
        connectors[i - 1]?.classList.add('filled');
      }
      setTimeout(() => {
        steps[i]?.classList.add('done');
        setTimeout(tick, 200);
      }, STEP_MS);
    }
    tick();
  }
})();
