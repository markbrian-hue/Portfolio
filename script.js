/**
 * Mark Brian Viloria - Portfolio
 * Minimal, Native, Performant JS. Zero Dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Native Intersection Observer for Scroll Reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    
    // Respect user OS preferences for motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    revealElements.forEach(el => {
        if (prefersReducedMotion) {
            el.classList.add('is-visible');
        } else {
            revealObserver.observe(el);
        }
    });

    // 2. Trigger initial hero animations instantly 
    setTimeout(() => {
        document.querySelectorAll('.hero-main, .hero-sidebar').forEach(el => {
            el.classList.add('is-visible');
        });
    }, 100);

});