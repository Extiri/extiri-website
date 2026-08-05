/**
 * Umami Analytics Tracking Suite
 * Extiri Web Application
 * Provides robust tracking for CTA Click events and Scroll Depth Milestones (0%, 25%, 50%, 75%, 100%).
 */
(function () {
    'use strict';

    // --- Safe Umami Event Dispatcher (with async queue fallback) ---
    function trackEvent(eventName, eventData) {
        if (window.umami && typeof window.umami.track === 'function') {
            try {
                window.umami.track(eventName, eventData);
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
                        window.umami.track(eventName, eventData);
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

    // --- 2. CTA Click Event Tracking ---
    function getCtaLabel(el) {
        if (el.getAttribute('data-umami-event-label')) return el.getAttribute('data-umami-event-label');
        if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
        if (el.getAttribute('title')) return el.getAttribute('title');

        const text = el.textContent ? el.textContent.trim().replace(/\s+/g, ' ') : '';
        if (text && text.length > 0) return text.slice(0, 60);

        const img = el.querySelector('img');
        if (img && img.alt) return img.alt.trim();

        if (el.href) {
            try {
                const urlObj = new URL(el.href, window.location.href);
                return urlObj.pathname + urlObj.search;
            } catch (e) {}
        }

        return 'CTA Action';
    }

    function initCtaTracking() {
        document.addEventListener('click', function (e) {
            const target = e.target.closest('a, button, input[type="submit"], .btn, [data-umami-event]');
            if (!target) return;

            const isCta =
                target.hasAttribute('data-umami-event') ||
                target.classList.contains('btn') ||
                target.classList.contains('cta-btn') ||
                target.classList.contains('hero-textlink-codemenu') ||
                target.classList.contains('hero-resso-textlink') ||
                target.classList.contains('hero-scroll-down') ||
                target.closest('.hero-actions') ||
                target.closest('.hero-actions-codemenu') ||
                target.closest('.hero-slide-actions') ||
                target.closest('.hero-resso-actions') ||
                target.closest('.featured-app-card__actions') ||
                target.closest('.navbar-inner') ||
                target.closest('.footer') ||
                (target.href && (
                    target.href.includes('apps.apple.com') ||
                    target.href.includes('extiri.kit.com') ||
                    target.href.includes('github.com') ||
                    target.href.includes('status.extiri.com') ||
                    target.href.includes('mailto:')
                ));

            if (isCta) {
                const label = getCtaLabel(target);
                const url = target.href || target.getAttribute('data-url') || window.location.pathname;
                const pageTitle = document.title || window.location.pathname;

                // Track main aggregated cta_click event with metadata
                trackEvent('cta_click', {
                    label: label,
                    url: url,
                    page: pageTitle
                });

                // Track named CTA event for direct visibility in Umami Events Dashboard
                trackEvent('CTA: ' + label, {
                    url: url,
                    page: pageTitle
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
