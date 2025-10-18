document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  toggle.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('nav-open', willOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
    }
  });
});
