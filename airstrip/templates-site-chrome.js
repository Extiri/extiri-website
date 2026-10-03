(function () {
  window.toggleMobileMenu = function () {
    document.getElementById('mobile-menu').classList.toggle('open');
  };
  const appStore = 'https://apps.apple.com/pl/app/airstrip-runbook-manager/id6794710703';
  const templateFiles = {
    'app-store-release.html': 'App Store Release.airp',
    'production-rollback.html': 'Production Rollback.airp',
    'incident-response.html': 'Incident Response & Outage Mitigation.airp',
    'annual-security-audit.html': 'Annual Production Security Audit.airp',
    'engineering-onboarding.html': 'New Employee Onboarding (Engineering).airp',
    'monthly-financial-reconciliation.html': 'Monthly Financial Reconciliation.airp',
    'newsletter-dispatch.html': 'Content Marketing Newsletter Dispatch.airp',
    'credential-rotation.html': 'Production Credential Rotation.airp'
  };
  const templateDescriptions = {
    'app-store-release.html': 'Use this App Store release checklist to prepare a Mac or iOS update, validate the build, and submit it with fewer last-minute checks.',
    'production-rollback.html': 'A production rollback runbook for restoring a stable release, checking service health, and documenting recovery.',
    'incident-response.html': 'A practical incident response checklist for acknowledging an outage, reducing impact, updating customers, and planning the follow-up.',
    'annual-security-audit.html': 'Review production access, credentials, storage settings, and certificates with a focused annual security audit checklist.',
    'engineering-onboarding.html': 'Give a new engineer a dependable first day with a clear setup path for their Mac, access, codebase, and local environment.',
    'monthly-financial-reconciliation.html': 'A month-end reconciliation checklist for collecting payment, cloud, payroll, and accounting records in one repeatable routine.',
    'newsletter-dispatch.html': 'A final newsletter send checklist for checking tracking links, audience segments, test emails, and send timing.',
    'credential-rotation.html': 'A focused production credential rotation procedure for replacing sensitive keys and safely restarting dependent services.'
  };
  const chrome = `<nav class="navbar" aria-label="Primary navigation"><div class="container navbar-inner"><a href="../index.html" class="nav-logo"><img src="../images/logo.webp" alt="Extiri Logo"></a><div class="nav-links"><a href="../index.html#home" class="nav-link">Home</a><a href="../index.html#apps" class="nav-link">Apps</a><a href="library.html" class="nav-link active">Templates</a><a href="../blog/index.html" class="nav-link">Blog</a><a href="../services.html" class="nav-link">Services</a><a href="../about.html" class="nav-link">About</a><a href="${appStore}" class="btn btn-primary btn--small" style="background:var(--color-airstrip);color:#000"><i class="fa-brands fa-apple"></i> Download Airstrip</a></div><button class="mobile-menu-btn" aria-label="Toggle menu" onclick="toggleMobileMenu()"><i class="fa-solid fa-bars"></i></button></div></nav><div id="mobile-menu" class="mobile-menu"><a href="../index.html#home" class="nav-link" onclick="toggleMobileMenu()">Home</a><a href="../index.html#apps" class="nav-link" onclick="toggleMobileMenu()">Apps</a><a href="library.html" class="nav-link active" onclick="toggleMobileMenu()">Templates</a><a href="../blog/index.html" class="nav-link" onclick="toggleMobileMenu()">Blog</a><a href="../services.html" class="nav-link" onclick="toggleMobileMenu()">Services</a><a href="../about.html" class="nav-link" onclick="toggleMobileMenu()">About</a><a href="${appStore}" class="btn btn-primary btn--small" style="background:var(--color-airstrip);color:#000" onclick="toggleMobileMenu()"><i class="fa-brands fa-apple"></i> Download Airstrip</a></div>`;
  const footer = `<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="../images/logo.webp" alt="Extiri" width="100" loading="lazy"><p>Extiri is an independent software studio crafting simple, well-crafted apps for macOS, iOS, and web.</p></div><div class="footer-links"><h4>Products</h4><ul><li><a href="../codemenu.html">CodeMenu</a></li><li><a href="../resso.html">Resso</a></li><li><a href="../airstrip.html">Airstrip</a></li><li><a href="../chitneek.html">Chitneek</a></li><li><a href="../clipguru.html">ClipGuru</a></li><li><a href="../rapidool.html">Rapidool</a></li><li><a href="../slowko.html">Słówko</a></li></ul></div><div class="footer-links"><h4>Company</h4><ul><li><a href="../index.html#about">About</a></li><li><a href="../blog/index.html">Blog</a></li><li><a href="../privacy_policy.html">Privacy Policy</a></li><li><a href="mailto:wiktor.wojcik@extiri.com">Contact</a></li></ul></div></div><div class="footer-bottom"><p>&copy; 2026 Extiri. All rights reserved.</p><p><a href="https://status.extiri.com" target="_blank" rel="noopener noreferrer">System Status</a></p><p>Mac, iPhone, and iPad are trademarks of Apple Inc. macOS required.</p></div></div></footer>`;
  document.querySelector('.page').insertAdjacentHTML('afterbegin', chrome);
  // The production server removes `.html` from public URLs. Normalize both
  // forms so the enhancements work locally and on the deployed site.
  const pageSlug = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const pageKey = `${pageSlug}.html`;
  const fileName = templateFiles[pageKey];
  const hero = document.querySelector('.template-hero');
  if (fileName && hero) {
    const templateUrl = `../airstrip-templates/${encodeURIComponent(fileName)}`;
    hero.querySelector('.template-summary').textContent = templateDescriptions[pageKey];
    hero.querySelector('.template-summary').insertAdjacentHTML('afterend', `<div class="template-file-action"><a class="template-download" href="${templateUrl}" download>Download .airp template</a><a class="airstrip-download" href="${appStore}">Get Airstrip for Mac</a></div>`);
    const storageKey = `airstrip-template-progress:${fileName}`;
    let progress = {};
    try { progress = JSON.parse(window.localStorage.getItem(storageKey) || '{}'); } catch (_) { progress = {}; }

    document.querySelectorAll('.runbook-steps li').forEach((step, index) => {
      const title = step.querySelector('strong').textContent.trim();
      step.insertAdjacentHTML('afterbegin', `<label class="step-control"><input type="checkbox" aria-label="Mark ${title} complete"><span aria-hidden="true"></span></label>`);
      const checkbox = step.querySelector('input');
      checkbox.checked = Boolean(progress[index]);
      step.classList.toggle('is-complete', checkbox.checked);
      checkbox.addEventListener('change', () => {
        step.classList.toggle('is-complete', checkbox.checked);
        progress[index] = checkbox.checked;
        try { window.localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (_) { /* Storage is optional. */ }
      });
    });

    const aside = document.querySelector('.aside-card');
    if (aside) {
      aside.innerHTML = `<div class="aside-app"><img src="../images/airstrip/airstrip-icon.webp" alt="Airstrip"><span>Airstrip for Mac</span></div><h2>Turn a checklist into an active run.</h2><p>Airstrip opens <code>.airp</code> files and keeps the procedure beside the work.</p><ul><li>Set launch variables for versions, environments, and targets.</li><li>Use a floating Focus Mode window while working in your terminal or IDE.</li><li>Get contextual reminders when the relevant app or website is open.</li><li>Keep an immutable record of what you actually completed.</li></ul><a class="aside-link" href="../airstrip.html">Explore Airstrip <span>→</span></a>`;
      const heroCopy = document.createElement('div');
      heroCopy.className = 'template-hero-copy';
      while (hero.firstChild) heroCopy.appendChild(hero.firstChild);
      hero.append(heroCopy, aside);
    }
    document.querySelector('.template-layout').insertAdjacentHTML('afterend', `<section class="airstrip-showcase"><div class="airstrip-showcase-copy"><span>Built for the work around the procedure</span><h2>Keep the next step in view.</h2><p>Run the template in a focused floating window, surface it when the right context appears, and keep a reliable record once the work is complete.</p><div class="template-file-action"><a class="template-download" href="${templateUrl}" download>Download .airp template</a><a class="airstrip-download" href="${appStore}">Get Airstrip for Mac</a></div></div><div class="airstrip-bento"><img class="bento-focus" src="../images/airstrip/focus-mode-privacy-manifest-with-wallpaper.webp" alt="Airstrip Focus Mode floating over a desktop" loading="lazy"><img class="bento-widgets" src="../images/airstrip/widgets-with-background.webp" alt="Airstrip widgets and menu bar controls" loading="lazy"><img class="bento-reminder" src="../images/airstrip/contextual-reminder-with-background.webp" alt="Airstrip contextual reminder" loading="lazy"><img class="bento-procedure" src="../images/airstrip/in-work-procedure-bottom-rich-app-launch-transparent-background.webp" alt="Airstrip main window showing an active procedure" loading="lazy"></div></section>`);
  }
  document.body.insertAdjacentHTML('beforeend', footer);
}());
