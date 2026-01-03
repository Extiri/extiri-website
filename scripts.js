function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

// Function to handle user consent
function handleConsent() {
  const banner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');

  // Check for existing consent
  const consent = localStorage.getItem('cookie_consent');

  if (consent === 'accepted') {
    // If consent was previously accepted, update gtag
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  } else if (consent === 'declined') {
    // If consent was previously declined, update gtag
    gtag('consent', 'update', {
      'analytics_storage': 'denied'
    });
  } else {
    // No consent yet, show the banner
    banner.style.display = 'block';

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      banner.style.display = 'none';
      // Update consent status to granted
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'declined');
      banner.style.display = 'none';
      // Update consent status to denied
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    });
  }
}

// Accessible app-card expand/collapse behavior
function initCardExpanders() {
  const cards = document.querySelectorAll('.preview-card');
  let idCounter = 0;

  cards.forEach(card => {
    const p = card.querySelector('p');
    if (!p) return;

    // mark description and initial clamp
    p.classList.add('card-desc', 'clamped');

    // ensure an id for aria-controls
    if (!p.id) {
      p.id = `card-desc-${idCounter++}`;
    }

    // create wrapper for the "More" control
    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'card-more';
    moreBtn.setAttribute('aria-expanded', 'false');
    moreBtn.setAttribute('aria-controls', p.id);
    moreBtn.textContent = 'More';

    // place the button after the paragraph (subtle inline placement)
    const wrapper = document.createElement('div');
    wrapper.className = 'card-more-wrapper';
    // keep button visually inline with paragraph by inserting after it
    p.after(wrapper);
    wrapper.appendChild(moreBtn);

    // Toggle function
    function toggle(e) {
      const expanded = moreBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        // collapse
        moreBtn.setAttribute('aria-expanded', 'false');
        p.classList.remove('expanded');
        // re-enable clamping after small timeout to allow transition
        window.setTimeout(() => p.classList.add('clamped'), 260);
        moreBtn.textContent = 'More';
      } else {
        // expand
        p.classList.remove('clamped');
        // ensure layout has applied before expanding max-height
        requestAnimationFrame(() => {
          p.classList.add('expanded');
        });
        moreBtn.setAttribute('aria-expanded', 'true');
        moreBtn.textContent = 'Less';
      }
      e && e.stopPropagation();
    }

    // Click handler
    moreBtn.addEventListener('click', toggle);

    // keyboard accessibility: Enter/Space to toggle
    moreBtn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggle(ev);
      }
    });

    // Allow pressing Escape anywhere to collapse this card if focused inside
    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        if (moreBtn.getAttribute('aria-expanded') === 'true') {
          toggle(ev);
        }
      }
    });

    // Prevent accidental selection of the "More" from toggling other interactions
    // (do not collapse others — multiple open allowed)
  });

  // Global Escape: collapse all expanded cards
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      document.querySelectorAll('.card-more[aria-expanded="true"]').forEach(btn => {
        const p = document.getElementById(btn.getAttribute('aria-controls'));
        if (p) {
          p.classList.remove('expanded');
          btn.setAttribute('aria-expanded', 'false');
          // re-add clamp after a short delay for smoothness
          window.setTimeout(() => p.classList.add('clamped'), 260);
          btn.textContent = 'More';
        }
      });
    }
  });
}

// Scroll reveal animations using IntersectionObserver
function initScrollReveal() {
  const revealSelector = [
    '.home-hero-logo',
    '.home-hero-subtitle',
    '.home-hero-actions',
    '.apps-section-title',
    '.section-card',
    '.preview-card',
    '.stack-item',
    '.workflow-step',
    '.testimonial-card'
  ].join(',');

  const nodes = Array.from(document.querySelectorAll(revealSelector));
  if (!nodes.length) return;

  // add base class and optional stagger via CSS variable
  nodes.forEach((el, idx) => {
    el.classList.add('reveal-up');
    el.style.transitionDelay = `${Math.min((idx % 6) * 60, 240)}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.transitionDelay = entry.target.style.transitionDelay || '0ms';
        io.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  nodes.forEach(el => io.observe(el));

  // On load: give hero a head start reveal
  const heroOrder = [
    document.querySelector('.home-hero-logo'),
    document.querySelector('.home-hero-subtitle'),
    document.querySelector('.home-hero-actions')
  ];
  heroOrder.forEach((el, i) => {
    if (!el) return;
    el.style.transitionDelay = `${i * 80}ms`;
  });
}

// App filters — show/hide cards by tag
function initAppFilters() {
  const filterBar = document.querySelector('.apps-filters');
  if (!filterBar) return;
  const buttons = Array.from(filterBar.querySelectorAll('.apps-filter'));
  const cards = Array.from(document.querySelectorAll('.app.preview-card'));

  function applyFilter(tag) {
    cards.forEach(card => {
      // remove any transitional state
      card.classList.remove('is-hiding');

      if (tag === 'all') {
        card.removeAttribute('hidden');
        // re-trigger reveal for visible cards
        requestAnimationFrame(() => {
          card.classList.add('reveal-up');
          requestAnimationFrame(() => card.classList.add('is-visible'));
        });
        return;
      }
      const tags = (card.getAttribute('data-tags') || '').toLowerCase().split(/\s+/);
      if (tags.includes(tag)) {
        card.removeAttribute('hidden');
        requestAnimationFrame(() => {
          card.classList.add('reveal-up');
          requestAnimationFrame(() => card.classList.add('is-visible'));
        });
      } else {
        // quick fade-out before hiding
        card.classList.add('is-hiding');
        // after a short delay, hide fully for layout
        setTimeout(() => card.setAttribute('hidden', ''), 120);
      }
    });
  }

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.apps-filter');
    if (!btn) return;
    buttons.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
    applyFilter(btn.dataset.filter);
  });
}

// Run the consent handler when the page loads and initialize card expanders
document.addEventListener('DOMContentLoaded', function () {
  handleConsent();
  initCardExpanders();
  initScrollReveal();
  initAppFilters();
  initDownloadTracking();
  initSlideshow();
  initRecentPosts();
});

// Slideshow: cycles through .slide elements, pauses when user clicks any slide
function initSlideshow() {
  const root = document.querySelector('.app-slideshow');
  if (!root) return;

  const viewport = root.querySelector('.slideshow-viewport');
  const track = root.querySelector('.slideshow-track') || viewport;
  const slides = Array.from(root.querySelectorAll('.slide'));
  const prevBtn = root.querySelector('.slideshow-prev');
  const nextBtn = root.querySelector('.slideshow-next');
  const indicators = Array.from(root.querySelectorAll('.slideshow-indicators button'));

  let current = 0;
  let intervalId = null;
  let paused = false;
  const DELAY = 4500;

  function updateViewport() {
    if (!viewport) return;
    // ensure slides fill the viewport width (use pixel translation for block content)
    const vw = viewport.clientWidth || viewport.getBoundingClientRect().width || window.innerWidth;
    slides.forEach(s => { s.style.minWidth = vw + 'px'; s.style.flexBasis = vw + 'px'; });
    // translate track to show current slide in pixels
    if (track) track.style.transform = `translateX(${-current * vw}px)`;
    // update indicators
    indicators.forEach((btn, i) => btn.setAttribute('aria-selected', String(i === current)));
  }

  function goTo(index, { user = false } = {}) {
    current = (index + slides.length) % slides.length;
    updateViewport();
    if (user) pause();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() {
    if (intervalId || paused) return;
    intervalId = setInterval(() => { next(); }, DELAY);
  }

  function stop() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  }

  function pause() {
    paused = true;
    stop();
  }

  // click anywhere on a slide to pause (and keep that slide visible)
  slides.forEach((s, i) => {
    s.addEventListener('click', (e) => {
      // If user clicks interactive control (link/button) allow default but still pause
      pause();
      // make sure focused state is visible
      s.focus();
    });
  });

  // Prev/Next controls
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); pause(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); pause(); });

  // Indicators
  indicators.forEach((btn) => {
    const idx = Number(btn.dataset.index);
    btn.addEventListener('click', () => { goTo(idx, { user: true }); });
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); goTo(idx, { user: true }); }
    });
  });

  // Keyboard navigation for slides: left/right while focus is inside slideshow
  root.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') { prev(); pause(); }
    if (ev.key === 'ArrowRight') { next(); pause(); }
  });

  // Resize: ensure transform remains correct (useful on orientation changes)
  window.addEventListener('resize', () => updateViewport());

  // initialize viewport transition style for sliding
  if (viewport) viewport.style.transition = 'transform 420ms cubic-bezier(.22,.9,.3,1)';
  if (track) { track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.3,1)'; track.style.willChange = 'transform'; }

  // start auto-rotation
  updateViewport();
  start();
}

// Download CTA tracking: attach click handlers to download buttons on landing pages
function initDownloadTracking() {
  if (typeof document === 'undefined') return;

  function sendCTAEvent(eventName, label) {
    try {
      if (typeof gtag === 'function') {
        // use beacon transport so navigation doesn't cancel the event
        gtag('event', eventName, {
          'event_category': 'cta',
          'event_label': label || eventName,
          'transport_type': 'beacon'
        });
      }
    } catch (e) {
      // ignore
    }
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, label: label || eventName });
    } catch (e) { }
  }

  const mapping = [
    { name: 'cta-codemenu', selectors: ['a[href*="codemenu-snippets-manager"]', '.download-codemenu'] },
    { name: 'cta-chitneek', selectors: ['a[href*="chitneek-read-aloud"]', '.download-chitneek'] },
    { name: 'cta-clipguru', selectors: ['a[href*="clipguru"]', '.download-clipguru'] }
  ];

  mapping.forEach(({ name, selectors }) => {
    const sel = selectors.join(',');
    Array.from(document.querySelectorAll(sel)).forEach((el) => {
      // avoid double-binding
      if (el.__ctaTrackingAttached) return;
      el.__ctaTrackingAttached = true;

      el.addEventListener('click', (ev) => {
        // Send the CTA event. Do not block navigation; use beacon where possible.
        sendCTAEvent(name, (el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('href'))) || name);
      }, { passive: true });
    });
  });
}

// Recent posts: fetch RSS feed and display the 5 latest blog posts
function initRecentPosts() {
  const container = document.getElementById('recent-posts-container');
  if (!container) return;

  // Use relative path to avoid CORS issues - works in both dev and production
  const RSS_URL = 'blog/feed.xml';
  const MAX_POSTS = 5;

  // Format date nicely (e.g., "Oct 29, 2025")
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  // Fix link URLs (the RSS has /blog/blog/ which needs to be corrected)
  function fixLink(url) {
    return url.replace('/blog/blog/', '/blog/');
  }

  // Create a post card element
  function createPostCard(item) {
    const card = document.createElement('a');
    card.className = 'recent-post-card';
    card.href = fixLink(item.link);
    card.innerHTML = `
      <span class="recent-post-card__date">${formatDate(item.pubDate)}</span>
      <h3 class="recent-post-card__title">${item.title}</h3>
      <span class="recent-post-card__arrow">
        Read article <i class="fa-solid fa-arrow-right" style="font-size: 0.75em;"></i>
      </span>
    `;
    return card;
  }

  // Show error state
  function showError() {
    container.innerHTML = `
      <div class="recent-posts-loading">
        <p style="color: var(--text-tertiary); text-align: center;">Unable to load posts. <a href="blog/index.html" style="color: var(--brand-primary);">Visit the blog</a></p>
      </div>
    `;
  }

  // Fetch and parse RSS feed
  fetch(RSS_URL)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, 'application/xml');

      // Check for parsing errors
      const parserError = xml.querySelector('parsererror');
      if (parserError) throw new Error('XML parsing failed');

      const items = xml.querySelectorAll('item');
      const posts = [];

      // Extract post data from RSS items (up to MAX_POSTS)
      for (let i = 0; i < Math.min(items.length, MAX_POSTS); i++) {
        const item = items[i];
        posts.push({
          title: item.querySelector('title')?.textContent || 'Untitled',
          link: item.querySelector('link')?.textContent || '#',
          pubDate: item.querySelector('pubDate')?.textContent || ''
        });
      }

      // Clear loading state and render posts
      container.innerHTML = '';
      posts.forEach(post => {
        container.appendChild(createPostCard(post));
      });
    })
    .catch(err => {
      console.warn('Failed to load RSS feed:', err);
      showError();
    });
}
