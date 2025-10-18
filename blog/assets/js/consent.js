// Simple cookie consent logic
document.addEventListener('DOMContentLoaded', function () {
  var banner = document.getElementById('cookie-consent-banner');
  if (!banner) return;

  var hasChoice = localStorage.getItem('extiri_cookie_consent');
  if (!hasChoice) {
    banner.hidden = false;
  }

  document.getElementById('consent-accept').addEventListener('click', function () {
    localStorage.setItem('extiri_cookie_consent', 'accepted');
    banner.hidden = true;
    // Dispatch an event so analytics snippet can enable tracking
    window.dispatchEvent(new CustomEvent('extiri:consent', { detail: { analytics: true } }));
  });

  document.getElementById('consent-decline').addEventListener('click', function () {
    localStorage.setItem('extiri_cookie_consent', 'declined');
    banner.hidden = true;
    window.dispatchEvent(new CustomEvent('extiri:consent', { detail: { analytics: false } }));
  });
});
