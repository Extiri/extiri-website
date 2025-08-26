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

// Run the consent handler when the page loads
document.addEventListener('DOMContentLoaded', handleConsent);