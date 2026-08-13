/**
 * Umami Analytics Tracking Suite
 * Extiri Blog & Web Application
 * Provides precise tracking for Download CTA Buttons (with App Name in event title)
 * and Scroll Depth Milestones (0%, 25%, 50%, 75%, 100%).
 */
(function () {
    'use strict';

    // --- Safe Umami Event Dispatcher (with async queue fallback) ---
    function trackEvent(eventName, eventData) {
        if (window.umami && typeof window.umami.track === 'function') {
            try {
                window.umami.track(eventName, eventData || {});
            } catch (e) {
                // Ignore ad-blocker errors
            }
        } else {
            // Queue retry if Umami script is still initializing
            let attempts = 0;
            const interval = setInterval(function () {
                attempts++;
                if (window.umami && typeof window.umami.track === 'function') {
                    try {
                        window.umami.track(eventName, eventData || {});
                    } catch (e) {}
                    clearInterval(interval);
                } else if (attempts >= 10) {
                    clearInterval(interval);
                }
            }, 300);
        }
    }

    // --- 1. Scroll Depth Tracking (0%, 25%, 50%, 75%, 100%) ---
    const milestones = [0, 25, 50, 75, 100];
    const trackedMilestones = new Set();

    function getScrollPercent() {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0;
        const scrollHeight = (docEl.scrollHeight || body.scrollHeight) - window.innerHeight;

        if (scrollHeight <= 0) return 100;
        return Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
    }

    function trackMilestone(m) {
        if (trackedMilestones.has(m)) return;
        trackedMilestones.add(m);

        trackEvent('scroll_depth', { depth: m + '%', percent: m });
        trackEvent('scroll_' + m);
    }

    function checkScroll() {
        const currentPercent = getScrollPercent();

        milestones.forEach(function (m) {
            if (currentPercent >= m) {
                trackMilestone(m);
            }
        });
    }

    // --- 2. App Name & Download CTA Detection ---
    function getAppNameForElement(target) {
        // 1. Check parent card or container attributes / headings
        const card = target.closest('[data-app-name], .featured-app-card, .app-card, .hero-slide');
        if (card) {
            if (card.getAttribute('data-app-name')) return card.getAttribute('data-app-name').trim();
            const heading = card.querySelector('h2, h3, .featured-app-card__name');
            if (heading) {
                const headingText = heading.textContent.trim();
                if (headingText) return headingText;
            }
        }

        // 2. Check URL or path hints
        const href = (target.href || '').toLowerCase();
        if (href.includes('codemenu')) return 'CodeMenu';
        if (href.includes('resso')) return 'Resso';
        if (href.includes('rapidool')) return 'Rapidool';
        if (href.includes('netvis')) return 'Netvis';
        if (href.includes('chitneek') || href.includes('czytnik')) return 'Chitneek';
        if (href.includes('clipguru')) return 'ClipGuru';
        if (href.includes('slowko')) return 'Słówko';
        if (href.includes('airstrip')) return 'Airstrip';
        if (href.includes('space-train') || href.includes('space_train')) return 'Space Train';

        // 3. Check page pathname & title
        const path = window.location.pathname.toLowerCase();
        if (path.includes('codemenu')) return 'CodeMenu';
        if (path.includes('resso')) return 'Resso';
        if (path.includes('rapidool')) return 'Rapidool';
        if (path.includes('netvis')) return 'Netvis';
        if (path.includes('chitneek')) return 'Chitneek';
        if (path.includes('clipguru')) return 'ClipGuru';
        if (path.includes('slowko')) return 'Słówko';
        if (path.includes('airstrip')) return 'Airstrip';
        if (path.includes('space-train')) return 'Space Train';

        const pageTitle = document.title || '';
        const titlePart = pageTitle.split('—')[0].split('|')[0].split('–')[0].trim();
        if (titlePart && titlePart.toLowerCase() !== 'extiri') return titlePart;

        return 'Extiri App';
    }

    function isDownloadCta(target) {
        if (!target) return false;

        const tagName = target.tagName;
        if (tagName !== 'A' && tagName !== 'BUTTON') return false;

        const href = (target.href || '').toLowerCase();
        const text = (target.textContent || '').toLowerCase().trim();
        const aria = (target.getAttribute('aria-label') || '').toLowerCase();

        // Direct App Store or installer binary link
        const isAppStoreUrl = href.includes('apps.apple.com') ||
                              href.endsWith('.dmg') ||
                              href.endsWith('.pkg') ||
                              href.endsWith('.zip');

        // Explicit Download / App Store keywords in text or aria-label
        const downloadKeywords = [
            'download', 'app store', 'mac app store', 'get on mac', 'get for mac',
            'free trial', 'try free', 'buy license', 'buy now', 'install'
        ];

        const hasKeyword = downloadKeywords.some(function (kw) {
            return text.includes(kw) || aria.includes(kw);
        });

        if (!isAppStoreUrl && !hasKeyword) return false;

        // Exclude navigation bars, footer links, filter tabs, slideshow navigation, mobile menu
        if (target.closest('.nav-links, .site-header__nav, .footer-links, .apps-filter-bar, .slideshow-viewport, .slideshow-nav, .mobile-menu-btn, .faq-question')) {
            return false;
        }

        return true;
    }

    function initCtaTracking() {
        document.addEventListener('click', function (e) {
            const target = e.target.closest('a, button');
            if (!target) return;

            if (isDownloadCta(target)) {
                const appName = getAppNameForElement(target);
                const eventTitle = 'Download ' + appName;
                const url = target.href || window.location.pathname;

                // Track specific event title with App Name (e.g., "Download CodeMenu", "Download Resso")
                trackEvent(eventTitle, {
                    app: appName,
                    url: url,
                    page: window.location.pathname
                });

                // Also track aggregate download event
                trackEvent('download_click', {
                    app: appName,
                    url: url,
                    page: window.location.pathname
                });
            }
        }, { passive: true });
    }

    // Initialization
    function init() {
        checkScroll();
        window.addEventListener('scroll', checkScroll, { passive: true });
        initCtaTracking();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 150);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(init, 150);
        });
    }
})();
