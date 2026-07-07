/* Shared layout: nav, footer, floating WhatsApp. Injected on every page. */
(function () {
  const BRAND = 'Konolhi Web Solutions';
  const WA_NUMBER = '9609987899';
  const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Konolhi! I'd like to talk about a website for my business.")}`;

  const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/packages', label: 'Packages' },
    { href: '/dashboards', label: 'Dashboards' },
    { href: '/industries', label: 'Industries' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' }
  ];

  const logoMark = `
    <span class="logo-mark" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12c2.5-4 5-6 10-6s7.5 2 10 6c-2.5 4-5 6-10 6s-7.5-2-10-6Z"/>
        <path d="M2 12h20" opacity="0.55"/>
      </svg>
    </span>`;

  function currentPath() {
    let p = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  }

  function renderNav() {
    const path = currentPath();
    const links = NAV_LINKS.map((l) => {
      const active = l.href === path ? ' aria-current="page"' : '';
      return `<li><a href="${l.href}"${active}>${l.label}</a></li>`;
    }).join('');

    return `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="nav" id="nav">
      <div class="container nav-inner">
        <a href="/" class="nav-logo" aria-label="${BRAND}, home">${logoMark}${BRAND}</a>
        <nav aria-label="Main navigation">
          <ul class="nav-links" id="navLinks">
            ${links}
            <li class="nav-cta"><a href="/free-review" class="btn btn-primary btn-sm">Free Website Review</a></li>
          </ul>
        </nav>
        <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </header>`;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="nav-logo" aria-label="${BRAND}, home">${logoMark}${BRAND}</a>
            <p>Websites that bring customers, and simple dashboards that help you manage them. Proudly serving Malé, Hulhumalé and all of the Maldives.</p>
            <address style="margin-top:1rem; font-style:normal; font-size:0.86rem; color:var(--text-faint); line-height:1.6">
              H. Miraaz, Ground Floor<br>
              Burevi Magu, 20008<br>
              K. Malé City, Maldives
            </address>
          </div>
          <div>
            <h4>Build</h4>
            <ul>
              <li><a href="/services">Services</a></li>
              <li><a href="/packages">Website Packages</a></li>
              <li><a href="/dashboards">Business Dashboards</a></li>
              <li><a href="/industries">Industries</a></li>
            </ul>
          </div>
          <div>
            <h4>Learn</h4>
            <ul>
              <li><a href="/portfolio">Portfolio</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/free-review">Free Website Review</a></li>
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li><a href="tel:+9609987899">+960 998-7899</a></li>
              <li><a href="${WA_LINK}" target="_blank" rel="noopener">WhatsApp us</a></li>
              <li><a href="mailto:hello@konolhi.com">hello@konolhi.com</a></li>
              <li><a href="/contact">Start an enquiry</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${year} ${BRAND}. Malé, Republic of Maldives.</span>
          <span>Sat-Thu, 9:00-18:00 MVT</span>
        </div>
      </div>
    </footer>
    <a class="wa-float" href="${WA_LINK}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07a8.2 8.2 0 0 1-2.4-1.49 9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.56.93.95-3.47-.22-.36a9.42 9.42 0 1 1 17.4-5 9.4 9.4 0 0 1-9.42 9.42Zm8-17.42A11.32 11.32 0 0 0 12.03.75C5.8.75.73 5.82.73 12.05c0 1.99.52 3.93 1.5 5.65L.63 23.5l5.94-1.56a11.3 11.3 0 0 0 5.46 1.39h.01c6.23 0 11.3-5.07 11.3-11.3 0-3.02-1.17-5.86-3.3-8Z"/>
      </svg>
    </a>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', renderNav());
    document.body.insertAdjacentHTML('beforeend', renderFooter());

    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  window.FARU = { WA_NUMBER, WA_LINK, BRAND };
})();
