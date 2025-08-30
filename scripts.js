function toggleHamburger() {
  let menu = document.getElementById("hamburger_menu")

  if (menu.style.visibility === "hidden" || menu.style.visibility === "") {
    menu.style.visibility = "visible"
  } else {
    menu.style.visibility = "hidden"
  }
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

// Run the consent handler when the page loads and initialize card expanders
document.addEventListener('DOMContentLoaded', function() {
  handleConsent();
  initCardExpanders();
});