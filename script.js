/**
 * Portfolio JavaScript - Elite Level
 * Features: Spotlight Mouse Tracking, Lerp Physics, GSAP Parallax, Native Smooth Scrolling
 */

const lerp = (start, end, factor) => start + (end - start) * factor;

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader
    Preloader.init();

    // 1. Core
    MobileMenu.init();
    ContactModal.init();
    ProjectModal.init();
    ScrollSpy.init();

    // 2. Advanced Interactions
    SpotlightCards.init();
    SmoothMagneticElements.init();
    AdvancedTiltEffect.init();

    // 3. External Libraries
    SmoothScroller.init();
    GSAPAnimations.init();
});

/* ==========================================
   0. PRELOADER
========================================== */
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        const bar = document.querySelector('.loader-bar');
        const percentage = document.querySelector('.loader-percentages');

        if (!preloader || !bar || !percentage) return;

        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 12;
            if (width > 100) width = 100;

            bar.style.width = `${width}%`;
            percentage.textContent = `${Math.floor(width)}%`;

            if (width === 100) {
                clearInterval(interval);
                this.finish(preloader);
            }
        }, 20);
    },

    finish(preloader) {
        setTimeout(() => {
            if (typeof gsap === 'undefined') {
                preloader.style.display = 'none';
                return;
            }

            gsap.to(preloader, {
                opacity: 0,
                duration: prefersReducedMotion() ? 0 : 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    if (typeof GSAPAnimations?.playHeroAnimations === 'function') {
                        GSAPAnimations.playHeroAnimations();
                    }
                }
            });
        }, 300);
    }
};

/* ==========================================
   1. CORE FUNCTIONALITY
========================================== */
const MobileMenu = {
    init() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        if (this.menuBtn && this.navLinks) {
            this.menuBtn.addEventListener('click', () => this.toggle());
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.close());
            });
        }
    },
    toggle() {
        if (!this.menuBtn || !this.navLinks) return;
        this.menuBtn.classList.toggle('active');
        this.navLinks.classList.toggle('active');

        const expanded = this.menuBtn.classList.contains('active');
        this.menuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    },
    close() {
        if (!this.menuBtn || !this.navLinks) return;
        this.menuBtn.classList.remove('active');
        this.navLinks.classList.remove('active');
        this.menuBtn.setAttribute('aria-expanded', 'false');
    }
};

const ScrollSpy = {
    init() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        const progressBar = document.createElement('div');
        progressBar.style.cssText =
          'position:absolute; bottom:0; left:0; height:1px; background:var(--primary); width:0%; transition: width 0.1s;';
        nav.appendChild(progressBar);

        const sections = document.querySelectorAll('section, header');
        const navLinks = document.querySelectorAll('.nav-links a');

        const onScroll = () => {
            const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = `${(scrollPx / winHeightPx) * 100}%`;

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href')?.substring(1) === current) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
};

/* ==========================================
   2. CUSTOM INTERACTIONS
========================================== */
const SpotlightCards = {
    init() {
        if (!window.matchMedia("(hover: hover)").matches) return;
        
        const cards = document.querySelectorAll('.spotlight-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
};

const SmoothMagneticElements = {
    init() {
        if (!window.matchMedia("(hover: hover)").matches) return;
        const magnets = document.querySelectorAll('.magnetic');

        magnets.forEach(magnet => {
            let bounds = magnet.getBoundingClientRect();
            let mouseX = 0, mouseY = 0;
            let currentX = 0, currentY = 0;
            let isHovering = false;

            magnet.addEventListener('mouseenter', () => {
                isHovering = true;
                bounds = magnet.getBoundingClientRect();
            });

            magnet.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - bounds.left) - bounds.width / 2;
                mouseY = (e.clientY - bounds.top) - bounds.height / 2;
            });

            magnet.addEventListener('mouseleave', () => {
                isHovering = false;
                mouseX = 0;
                mouseY = 0;
            });

            const animate = () => {
                currentX = lerp(currentX, mouseX, 0.15);
                currentY = lerp(currentY, mouseY, 0.15);

                if (isHovering || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                    magnet.style.transform = `translate(${currentX * 0.3}px, ${currentY * 0.3}px)`;
                }
                requestAnimationFrame(animate);
            };
            animate();
        });
    }
};

const AdvancedTiltEffect = {
    init() {
        if (!window.matchMedia("(hover: hover)").matches) return;
        const elements = document.querySelectorAll('.tilt-element');

        elements.forEach(el => {
            let rect, centerX, centerY;
            let targetRotateX = 0, targetRotateY = 0;
            let currentRotateX = 0, currentRotateY = 0;
            let isHovering = false;

            el.addEventListener('mouseenter', () => {
                isHovering = true;
                rect = el.getBoundingClientRect();
                centerX = rect.width / 2;
                centerY = rect.height / 2;
            });

            el.addEventListener('mousemove', (e) => {
                if (!rect) rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                targetRotateX = ((y - centerY) / centerY) * -4;
                targetRotateY = ((x - centerX) / centerX) * 4;

                // Combine with Spotlight tracking if on same element
                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
            });

            el.addEventListener('mouseleave', () => {
                isHovering = false;
                targetRotateX = 0;
                targetRotateY = 0;
            });

            const animate = () => {
                currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
                currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

                if (isHovering || Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
                    el.style.transform =
                      `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
                }
                requestAnimationFrame(animate);
            };
            animate();
        });
    }
};

/* ==========================================
   3. EXTERNAL DEPENDENCIES & ADVANCED ANIMATION
========================================== */
const GSAPAnimations = {
    init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        this.splitText();
        this.scrollReveals();
        this.parallaxImages();
    },

    splitText() {
        const target = document.querySelector('.split-text-anim');
        if (!target) return;

        const words = target.innerText.split(' ');
        target.innerHTML = '';

        words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-wrapper';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.innerText = word + '\u00A0';
            wrapper.appendChild(inner);
            target.appendChild(wrapper);
        });
    },

    playHeroAnimations() {
        if (prefersReducedMotion()) {
            document.querySelectorAll('.word-inner').forEach(el => (el.style.transform = 'translateY(0)'));
            document.querySelectorAll('.fade-in-up').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            return;
        }

        const tl = gsap.timeline();

        tl.to('.word-inner', {
            y: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out"
        })
        .to('.fade-in-up', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.6");
    },

    parallaxImages() {
        if (prefersReducedMotion()) {
            document.querySelectorAll('.img-wrapper').forEach(w => w.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)');
            return;
        }

        gsap.utils.toArray('.img-wrapper').forEach(wrapper => {
            const img = wrapper.querySelector('img');
            if (!img) return;

            // Elite clip-path reveal
            gsap.to(wrapper, {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.2,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 85%',
                }
            });

            // Scale parallax
            gsap.fromTo(img,
                { scale: 1.15 },
                {
                    scale: 1,
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top 85%',
                    }
                }
            );
        });
    },

    scrollReveals() {
        if (prefersReducedMotion()) return;

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                    scrollTrigger: { trigger: header, start: "top 85%" }
                }
            );
        });

        const revealCards = (selector) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                gsap.fromTo(elements,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out",
                        scrollTrigger: { trigger: selector, start: "top 85%" }
                    }
                );
            }
        };

        revealCards('.skill-card');
        revealCards('.project-card');
        revealCards('.demo-card');
        revealCards('.timeline-item');
    }
};

const SmoothScroller = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();

                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: prefersReducedMotion() ? "auto" : "smooth"
                    });
                }
            });
        });
    }
};

/* ==========================================
   MODALS
========================================== */
const ContactModal = {
    init() {
        const modal = document.getElementById('contactModal');
        if (!modal) return;

        const triggers = document.querySelectorAll('[data-action="contact"]');
        const closeBtn = modal.querySelector('.modal-close');

        const open = () => modal.classList.add('active');
        const close = () => modal.classList.remove('active');

        triggers.forEach(t => t.addEventListener('click', open));
        closeBtn?.addEventListener('click', close);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }
};

const ProjectModal = {
    init() {
        const modal = document.getElementById('projectModal');
        if (!modal) return;

        const triggers = document.querySelectorAll('.btn-view-details');
        const closeBtn = modal.querySelector('.modal-close');
        const content = document.getElementById('projectModalContent');

        const close = () => modal.classList.remove('active');

        triggers.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.project || 'Project';
                if (content) {
                    content.innerHTML =
                        `<h2 style="color:var(--primary); font-size: var(--text-2xl);">${id}</h2>
                         <p style="margin-top:10px; font-size: var(--text-sm);">Detailed case study overview loading dynamically...</p>`;
                }
                modal.classList.add('active');
            });
        });

        closeBtn?.addEventListener('click', close);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }
};