/*
 * Card Stack — vanilla port of the React/framer-motion "card-stack" component.
 * Fanned, draggable, auto-advancing 3D card carousel. No dependencies.
 *
 * Usage: <div class="cardstack" data-autoadvance="4000" data-spread="42">
 *          <script type="application/json" class="cardstack-data">[{...items}]</script>
 *        </div>
 * Item: { title, description?, imageSrc?, href? }
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build(root) {
    const dataEl = root.querySelector('.cardstack-data');
    let items = [];
    try { items = JSON.parse(dataEl.textContent); } catch { return; }
    if (!items.length) return;

    const cfg = {
      maxVisible: 5,
      overlap: 0.5,
      spread: Number(root.dataset.spread) || 40,
      depth: 120,
      tiltX: 10,
      activeLift: 20,
      activeScale: 1.03,
      inactiveScale: 0.92,
      autoAdvance: Number(root.dataset.autoadvance) || 0,
      loop: true
    };
    const maxOffset = Math.floor(cfg.maxVisible / 2);
    const step = maxOffset ? cfg.spread / maxOffset : 0;

    // DOM
    root.innerHTML = '';
    const stage = el('div', 'cardstack-stage');
    const track = el('div', 'cardstack-track');
    stage.appendChild(track);
    stage.tabIndex = 0;
    root.appendChild(stage);

    const cards = items.map((item, i) => {
      const card = el('div', 'cardstack-card');
      card.innerHTML = `
        ${item.imageSrc ? `<img src="${esc(item.imageSrc)}" alt="${esc(item.title || '')}" draggable="false">` : ''}
        <div class="cs-overlay"></div>
        <div class="cs-content">
          <b>${esc(item.title || '')}</b>
          ${item.description ? `<span>${esc(item.description)}</span>` : ''}
        </div>`;
      card.addEventListener('click', (e) => {
        if (card._dragged) return;
        if (i === active) { if (item.href) window.open(item.href, '_blank', 'noopener'); }
        else setActive(i);
      });
      track.appendChild(card);
      return card;
    });

    const dotsWrap = el('div', 'cardstack-dots');
    const dots = items.map((it, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to ${it.title || 'card ' + (i + 1)}`);
      b.addEventListener('click', () => setActive(i));
      dotsWrap.appendChild(b);
      return b;
    });
    const link = document.createElement('a');
    link.className = 'cardstack-link';
    link.target = '_blank'; link.rel = 'noopener';
    link.setAttribute('aria-label', 'Open link');
    link.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
    dotsWrap.appendChild(link);
    root.appendChild(dotsWrap);

    let active = 0;

    function signedOffset(i) {
      const raw = i - active;
      if (!cfg.loop || items.length <= 1) return raw;
      const alt = raw > 0 ? raw - items.length : raw + items.length;
      return Math.abs(alt) < Math.abs(raw) ? alt : raw;
    }

    function cardWidth() { return cards[0].offsetWidth || 360; }

    function layout() {
      const spacing = Math.max(60, Math.round(cardWidth() * (1 - cfg.overlap)));
      cards.forEach((card, i) => {
        const off = signedOffset(i);
        const abs = Math.abs(off);
        if (abs > maxOffset) { card.style.opacity = '0'; card.style.pointerEvents = 'none'; card.style.visibility = 'hidden'; return; }
        const isActive = off === 0;
        const x = off * spacing;
        const y = abs * 10 + (isActive ? -cfg.activeLift : 0);
        const z = -abs * cfg.depth;
        const rotateZ = reduce ? 0 : off * step;
        const rotateX = reduce || isActive ? 0 : cfg.tiltX;
        const scale = isActive ? cfg.activeScale : cfg.inactiveScale;
        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
        card.style.zIndex = String(100 - abs);
        card.style.transform =
          `translate(-50%,-50%) translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) scale(${scale})`;
        card.classList.toggle('active', isActive);
      });
      dots.forEach((d, i) => d.classList.toggle('on', i === active));
      const cur = items[active];
      if (cur && cur.href) { link.href = cur.href; link.style.display = 'inline-flex'; }
      else link.style.display = 'none';
    }

    function setActive(i) {
      active = ((i % items.length) + items.length) % items.length;
      layout();
    }
    const next = () => setActive(active + 1);
    const prev = () => setActive(active - 1);

    // drag / swipe on active card
    let startX = null, activeCard = null;
    stage.addEventListener('pointerdown', (e) => {
      activeCard = cards[active];
      if (!activeCard.classList.contains('active')) return;
      startX = e.clientX; activeCard._dragged = false;
      activeCard.setPointerCapture?.(e.pointerId);
    });
    stage.addEventListener('pointermove', (e) => {
      if (startX == null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) activeCard._dragged = true;
      activeCard.style.transition = 'none';
      activeCard.style.transform =
        `translate(-50%,-50%) translate3d(${dx}px, ${-cfg.activeLift}px, 0) rotateZ(${dx * 0.02}deg) scale(${cfg.activeScale})`;
    });
    function endDrag(e) {
      if (startX == null) return;
      const dx = e.clientX - startX;
      startX = null;
      activeCard.style.transition = '';
      const threshold = Math.min(140, cardWidth() * 0.22);
      if (dx > threshold) prev();
      else if (dx < -threshold) next();
      else layout();
      setTimeout(() => { if (activeCard) activeCard._dragged = false; }, 0);
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // keyboard
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
    });

    // autoplay
    let timer = null, hovering = false;
    function startAuto() {
      if (!cfg.autoAdvance || reduce) return;
      stopAuto();
      timer = window.setInterval(() => { if (!hovering) next(); }, Math.max(1200, cfg.autoAdvance));
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    root.addEventListener('mouseenter', () => { hovering = true; });
    root.addEventListener('mouseleave', () => { hovering = false; });

    window.addEventListener('resize', layout, { passive: true });
    layout();
    startAuto();
  }

  function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cardstack').forEach(build);
  });
})();
