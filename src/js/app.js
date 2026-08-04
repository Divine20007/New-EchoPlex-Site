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

// --- Content Index (cached search data) ---
let contentIndex = [];
let contentIndexLoaded = false;

// Build searchable content index from page HTML
async function buildContentIndex() {
  if (contentIndexLoaded) return;
  
  contentIndex = [];
  
  for (const page of PAGES) {
    try {
      const response = await fetch(page.href);
      const html = await response.text();
      
      // Parse HTML and extract text content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract meaningful text (headings, paragraphs, buttons, etc.)
      const textElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, button, a, span[data-tooltip]');
      const textContent = Array.from(textElements)
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0)
        .join(' ');
      
      if (textContent) {
        contentIndex.push({
          page: page.label,
          href: page.href,
          title: page.title,
          content: textContent.toLowerCase(),
          snippet: textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '')
        });
      }
    } catch (error) {
      console.warn(`Failed to index ${page.href}:`, error);
    }
  }
  
  contentIndexLoaded = true;
}

// Search through indexed content
function searchContent(query) {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.trim().toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/);
  
  const results = contentIndex
    .map(item => {
      // Calculate relevance score
      let score = 0;
      let matches = [];
      
      queryTerms.forEach(term => {
        // Check if term matches in different sections
        if (item.title.toLowerCase().includes(term)) score += 10;
        if (item.page.toLowerCase().includes(term)) score += 8;
        
        // Find all occurrences in content
        const regex = new RegExp(`\\b${term}\\w*`, 'gi');
        const contentMatches = item.content.match(regex) || [];
        
        if (contentMatches.length > 0) {
          score += contentMatches.length * 2;
          matches.push(...contentMatches);
        }
      });
      
      return {
        ...item,
        score,
        matches: [...new Set(matches)].slice(0, 3) // Get unique matches, limit to 3
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  return results;
}

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

// --- Site Search ---
function initSearch(searchBtn) {
  const modal = document.createElement('div');
  modal.className = 'search-modal';
  modal.id = 'site-search-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'site-search-title');
  modal.hidden = true;
  modal.innerHTML = `
    <div class="search-dialog">
      <div class="search-dialog-header">
        <div>
          <span class="search-eyebrow">Search EchoPlex</span>
          <h2 id="site-search-title">Find anything</h2>
        </div>
        <button class="search-close" type="button" aria-label="Close search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <form class="search-form" role="search">
        <label class="sr-only" for="site-search-input">Search content</label>
        <div class="search-input-wrap">
          <svg class="search-input-icon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input id="site-search-input" type="search" placeholder="Search keywords..." autocomplete="off" spellcheck="false" />
          <kbd>ESC</kbd>
        </div>
      </form>
      <div class="search-status">
        <span id="search-result-count"></span>
      </div>
      <div class="search-results" id="search-results" aria-live="polite" aria-label="Search results"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const dialog = modal.querySelector('.search-dialog');
  const form = modal.querySelector('.search-form');
  const input = modal.querySelector('#site-search-input');
  const closeBtn = modal.querySelector('.search-close');
  const resultsContainer = modal.querySelector('#search-results');
  const resultCount = modal.querySelector('#search-result-count');
  let searchResults = [];
  let closeTimer;
  let previousOverflow = '';

  const renderResults = query => {
    if (!query.trim()) {
      resultCount.textContent = '';
      resultsContainer.innerHTML = `
        <div class="search-empty">
          <span class="search-empty-mark">🔍</span>
          <strong>Start typing to search</strong>
          <span>Search by keyword across all pages</span>
        </div>
      `;
      return;
    }

    searchResults = searchContent(query);

    resultCount.textContent = `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'}`;

    if (!searchResults.length) {
      resultsContainer.innerHTML = `
        <div class="search-empty">
          <span class="search-empty-mark">—</span>
          <strong>No results found.</strong>
          <span>Try different keywords</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = searchResults.map((result, index) => `
      <a class="search-result" href="${result.href}" data-link>
        <div class="search-result-header">
          <span class="search-result-index">${String(index + 1).padStart(2, '0')}</span>
          <span class="search-result-page">${result.page}</span>
        </div>
        <div class="search-result-content">
          <strong>${result.title}</strong>
          <p class="search-result-snippet">${result.snippet}</p>
          ${result.matches.length > 0 ? `
            <div class="search-result-matches">
              ${result.matches.map(match => `<span class="match-tag">${match}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </a>
    `).join('');
  };

  const openSearch = async () => {
    window.clearTimeout(closeTimer);
    previousOverflow = document.body.style.overflow;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    
    // Load index when search opens
    if (!contentIndexLoaded) {
      resultCount.textContent = 'Loading...';
      await buildContentIndex();
    }
    
    renderResults('');
    requestAnimationFrame(() => {
      modal.classList.add('open');
      input.focus();
    });
  };

  const closeSearch = () => {
    modal.classList.remove('open');
    document.body.style.overflow = previousOverflow;
    closeTimer = window.setTimeout(() => {
      if (!modal.classList.contains('open')) modal.hidden = true;
    }, 220);
    searchBtn.focus();
  };

  searchBtn.setAttribute('aria-controls', modal.id);
  searchBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  input.addEventListener('input', event => renderResults(event.target.value));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (searchResults[0]) window.location.href = searchResults[0].href;
  });

  modal.addEventListener('click', event => {
    if (event.target === modal) closeSearch();
  });

  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeSearch();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [closeBtn, input, ...resultsContainer.querySelectorAll('a')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  dialog.addEventListener('click', event => event.stopPropagation());
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
  searchBtn.addEventListener('click', closeMobileMenu);
  initSearch(searchBtn);

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
