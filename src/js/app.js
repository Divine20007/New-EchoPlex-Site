/* ============================================
   EchoPlex — Core App JavaScript
   Navigation · Footer · Animations · Search
   ============================================ */

// --- Page Registry ---
const PAGES = [
  { href: '/',              label: 'Home',         title: 'EchoPlex' },
  { href: '/ecosystem.html', label: 'Ecosystem',   title: 'The Ecosystem' },
  { href: '/creator-hub.html', label: 'Creator Hub', title: 'Creator Hub' },
  { href: '/story-hub.html',  label: 'Story Hub',   title: 'Story Hub' },
  { href: '/game-hub.html',   label: 'Game Hub',    title: 'Game Hub' },
  { href: '/marketplace.html', label: 'Marketplace', title: 'Marketplace' },
  { href: '/communities.html', label: 'Communities', title: 'Communities' },
  { href: '/tradefusion.html', label: 'TradeFusion', title: 'TradeFusion' },
  { href: '/roadmap.html',    label: 'Roadmap',     title: 'Roadmap' },
  { href: '/vision.html',     label: 'Vision',      title: 'Our Vision' },
  { href: '/about.html',      label: 'About',       title: 'About EchoPlex' },
  { href: '/contact.html',    label: 'Contact',     title: 'Contact' },
];

// --- Get current page path ---
function getCurrentPath() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html' || path.endsWith('/')) return '/';
  return path;
}

// --- Get current page index ---
function getCurrentIndex() {
  const current = getCurrentPath();
  return PAGES.findIndex(p => p.href === current);
}

// --- Build Navigation ---
function buildNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const current = getCurrentPath();

  const linksHTML = PAGES.map(p =>
    `<li><a href="${p.href}" class="nav-link ${p.href === current ? 'active' : ''}" data-link>${p.label}</a></li>`
  ).join('');

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="/" class="nav-brand" data-link>
        <span class="nav-brand-icon">E</span>
        <span>EchoPlex</span>
      </a>
      <ul class="nav-links">${linksHTML}</ul>
      <div class="nav-actions">
        <button class="nav-search" aria-label="Search" id="nav-search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <button class="nav-mobile-toggle" aria-label="Open menu" id="mobile-toggle" aria-controls="mobile-menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <ul class="mobile-menu-list">
        ${PAGES.map(p => `<li><a href="${p.href}" class="mobile-menu-link ${p.href === current ? 'active' : ''}" data-link>${p.label}</a></li>`).join('')}
      </ul>
    </div>
  `;

  // Mobile menu toggle
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  const closeMobileMenu = () => {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) menu.querySelector('a')?.focus();
  });

  // Close mobile menu on link click
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      closeMobileMenu();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && menu.classList.contains('open')) closeMobileMenu();
  });

  // Search button
  const searchBtn = document.getElementById('nav-search-btn');
  searchBtn.addEventListener('click', () => {
    alert('Search is coming soon.');
  });

  // Scrolled state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Build Breadcrumbs ---
function buildBreadcrumbs() {
  const bar = document.getElementById('breadcrumbs');
  if (!bar) return;

  const current = getCurrentPath();
  if (current === '/') {
    bar.innerHTML = '';
    return;
  }

  const page = PAGES.find(p => p.href === current);
  if (!page) return;

  bar.innerHTML = `
    <div class="breadcrumbs">
      <span class="breadcrumb-item"><a href="/" data-link>Home</a></span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">${page.label}</span>
    </div>
  `;
}

// --- Build Page Navigation (Prev / Next) ---
function buildPageNav() {
  const container = document.getElementById('page-nav');
  if (!container) return;

  const idx = getCurrentIndex();
  if (idx < 0) return;

  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

  let html = '';
  if (prev) {
    html += `
      <a href="${prev.href}" class="page-nav-link prev" data-link>
        <span class="page-nav-direction">← Previous</span>
        <span class="page-nav-title">${prev.label}</span>
      </a>`;
  } else {
    html += '<div></div>';
  }

  if (next) {
    html += `
      <a href="${next.href}" class="page-nav-link next" data-link>
        <span class="page-nav-direction">Next →</span>
        <span class="page-nav-title">${next.label}</span>
      </a>`;
  } else {
    html += '<div></div>';
  }

  container.innerHTML = html;
}

// --- Build Footer ---
function buildFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const products = PAGES.slice(2, 8);
  const company = PAGES.slice(8);

  footer.innerHTML = `
    <div class="footer-content">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-brand-name">
            <span class="nav-brand-icon">E</span>
            <span>EchoPlex</span>
          </div>
          <p class="footer-brand-desc">A unified digital entertainment ecosystem where creativity, gaming, community, and commerce grow together.</p>
        </div>
        <div class="footer-col">
          <h4>Ecosystem</h4>
          <ul>
            <li><a href="/ecosystem.html" data-link>Overview</a></li>
            ${products.map(p => `<li><a href="${p.href}" data-link>${p.label}</a></li>`).join('')}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            ${company.map(p => `<li><a href="${p.href}" data-link>${p.label}</a></li>`).join('')}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="/roadmap.html" data-link>Roadmap</a></li>
            <li><a href="/vision.html" data-link>Vision</a></li>
            <li><a href="/about.html" data-link>About</a></li>
            <li><a href="/contact.html" data-link>Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="/contact.html" data-link>Get in Touch</a></li>
            <li><a href="/communities.html" data-link>Join Community</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} EchoPlex. All rights reserved.</span>
        <span>Entertainment first. Ownership second. Rewards third.</span>
      </div>
    </div>
  `;
}

// --- Scroll-triggered Animations ---
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// --- Page Transition ---
function initPageTransitions() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
}

// --- Initialize Everything ---
function init() {
  buildNav();
  buildBreadcrumbs();
  buildPageNav();
  buildFooter();
  initScrollAnimations();
  initPageTransitions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
