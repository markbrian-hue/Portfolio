/**
 * Portfolio JavaScript - Elite Level Interaction (Upgraded)
 * Features: Repulsive Neural Network, Lerp Physics, GSAP Parallax, Native Smooth Scrolling
 * Additions: Premium card ripple, safer DOM guards, modal UX upgrades, reduced-motion support
 */

// Math Helper for Smooth Animations
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

    // 2. Advanced Interactions (No Custom Cursor)
    InteractiveTyping.init();
    SmoothMagneticElements.init();
    AdvancedTiltEffect.init();
    PremiumCardInteractions.init();

    // 3. External Libraries
    SmoothScroller.init();
    GSAPAnimations.init();
    InteractiveNeuralNetwork.init();
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
            width += Math.random() * 8;
            if (width > 100) width = 100;

            bar.style.width = `${width}%`;
            percentage.textContent = `${Math.floor(width)}%`;

            if (width === 100) {
                clearInterval(interval);
                this.finish(preloader);
            }
        }, 30);
    },

    finish(preloader) {
        setTimeout(() => {
            // If GSAP isn't loaded for some reason, fail gracefully
            if (typeof gsap === 'undefined') {
                preloader.style.display = 'none';
                return;
            }

            gsap.to(preloader, {
                yPercent: -100,
                duration: prefersReducedMotion() ? 0 : 1.2,
                ease: "power4.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    if (typeof GSAPAnimations?.playHeroAnimations === 'function') {
                        GSAPAnimations.playHeroAnimations();
                    }
                }
            });
        }, 350);
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

        // Add scroll progress bar to nav
        const progressBar = document.createElement('div');
        progressBar.style.cssText =
          'position:absolute; bottom:0; left:0; height:2px; background:var(--gradient); width:0%; transition: width 0.1s;';
        nav.appendChild(progressBar);

        const sections = document.querySelectorAll('section, header');
        const navLinks = document.querySelectorAll('.nav-links a');

        const onScroll = () => {
            // Update Progress Bar
            const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = `${(scrollPx / winHeightPx) * 100}%`;

            // Active Nav Links
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
const InteractiveTyping = {
    init() {
        const el = document.querySelector('#typewriter');
        if (!el) return;

        const words = ['Full Stack Developer', 'IoT Enthusiast', 'UI/UX Designer'];
        let i = 0, j = 0;
        let isDeleting = false;

        const type = () => {
            const current = i % words.length;
            const fullTxt = words[current];

            if (isDeleting) {
                el.textContent = fullTxt.substring(0, j - 1);
                j--;
            } else {
                el.textContent = fullTxt.substring(0, j + 1);
                j++;
            }

            let speed = isDeleting ? 40 : 80;
            if (!isDeleting && j === fullTxt.length) {
                speed = 2500;
                isDeleting = true;
            } else if (isDeleting && j === 0) {
                isDeleting = false;
                i++;
                speed = 500;
            }
            setTimeout(type, speed);
        };

        type();
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
                currentX = lerp(currentX, mouseX, 0.1);
                currentY = lerp(currentY, mouseY, 0.1);

                if (isHovering || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                    magnet.style.transform = `translate(${currentX * 0.4}px, ${currentY * 0.4}px)`;
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

                targetRotateX = ((y - centerY) / centerY) * -8;
                targetRotateY = ((x - centerX) / centerX) * 8;

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

                const scale = isHovering ? 1.02 : 1;

                if (isHovering || Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
                    el.style.transform =
                      `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
                }
                requestAnimationFrame(animate);
            };
            animate();
        });
    }
};

const PremiumCardInteractions = {
    init() {
        const cards = document.querySelectorAll('.demo-card, .project-card, .skill-card');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('pointerdown', () => {
                if (prefersReducedMotion()) return;
                // small press feel
                card.style.transform += ' scale3d(0.99,0.99,0.99)';
                setTimeout(() => {
                    card.style.transform = card.style.transform.replace(' scale3d(0.99,0.99,0.99)', '');
                }, 140);
            });

            card.addEventListener('click', (e) => {
                if (prefersReducedMotion()) return;
                if (!(card instanceof HTMLElement)) return;

                const rect = card.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                card.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            }, { passive: true });
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
            duration: 1.2,
            stagger: 0.08,
            ease: "power4.out"
        })
        .to('.fade-in-up', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.8");
    },

    parallaxImages() {
        if (prefersReducedMotion()) return;

        gsap.utils.toArray('.img-wrapper').forEach(wrapper => {
            const img = wrapper.querySelector('img');
            if (!img) return;

            gsap.fromTo(img,
                { y: '-10%', scale: 1.1 },
                {
                    y: '10%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        });
    },

    scrollReveals() {
        if (prefersReducedMotion()) return;

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: header, start: "top 85%" }
                }
            );
        });

        const skillCards = document.querySelectorAll('.skill-card');
        if (skillCards.length) {
            gsap.fromTo(skillCards,
                { opacity: 0, y: 100, rotationX: -15 },
                {
                    opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.15, ease: "back.out(1.2)",
                    scrollTrigger: { trigger: '.skills-grid', start: "top 80%" }
                }
            );
        }

        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length) {
            gsap.fromTo(projectCards,
                { opacity: 0, y: 100 },
                {
                    opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
                    scrollTrigger: { trigger: '.projects-grid', start: "top 85%" }
                }
            );
        }

        const timeline = document.querySelectorAll('.timeline-item');
        if (timeline.length) {
            gsap.fromTo('.timeline-item',
                { opacity: 0, x: -50 },
                {
                    opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power3.out",
                    scrollTrigger: { trigger: '.timeline-grid', start: "top 80%" }
                }
            );
        }
    }
};

const InteractiveNeuralNetwork = {
    init() {
        if (prefersReducedMotion()) return;

        const canvas = document.getElementById('networkCanvas');
        if (!canvas) return;
        if (typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020617, 0.03);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesCount = 150;
        const posArray = new Float32Array(particlesCount * 3);
        const colorsArray = new Float32Array(particlesCount * 3);
        const particlesData = [];

        const color1 = new THREE.Color('#3b82f6');
        const color2 = new THREE.Color('#8b5cf6');

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

            posArray[i3] = (Math.random() - 0.5) * 25;
            posArray[i3 + 1] = (Math.random() - 0.5) * 25;
            posArray[i3 + 2] = (Math.random() - 0.5) * 15;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colorsArray[i3] = mixedColor.r;
            colorsArray[i3 + 1] = mixedColor.g;
            colorsArray[i3 + 2] = mixedColor.b;

            particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.015,
                    (Math.random() - 0.5) * 0.015,
                    (Math.random() - 0.5) * 0.015
                )
            });
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x5b21b6,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });

        const linesGeometry = new THREE.BufferGeometry();
        const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
        scene.add(linesMesh);

        camera.position.z = 8;

        const mouse = new THREE.Vector2(9999, 9999);
        const mouse3D = new THREE.Vector3();

        window.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouse3D.set(mouse.x * 12, mouse.y * 12, 0);
        }, { passive: true });

        const animate = () => {
            requestAnimationFrame(animate);

            const positions = particlesMesh.geometry.attributes.position.array;
            const linePositions = [];

            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                const p = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);

                p.add(particlesData[i].velocity);

                const distToMouse = p.distanceTo(mouse3D);
                if (distToMouse < 4) {
                    const dir = p.clone().sub(mouse3D).normalize();
                    p.add(dir.multiplyScalar((4 - distToMouse) * 0.02));
                }

                if (p.x < -15 || p.x > 15) particlesData[i].velocity.x *= -1;
                if (p.y < -15 || p.y > 15) particlesData[i].velocity.y *= -1;
                if (p.z < -10 || p.z > 10) particlesData[i].velocity.z *= -1;

                positions[i3] = p.x;
                positions[i3 + 1] = p.y;
                positions[i3 + 2] = p.z;

                for (let j = i + 1; j < particlesCount; j++) {
                    const j3 = j * 3;
                    const p2 = new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2]);
                    const dist = p.distanceTo(p2);

                    if (dist < 3.5) {
                        linePositions.push(p.x, p.y, p.z, p2.x, p2.y, p2.z);
                    }
                }
            }

            particlesMesh.geometry.attributes.position.needsUpdate = true;
            linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

            camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
            camera.position.y += (mouse.y * 3 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });
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
   MODALS (Upgraded UX)
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

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        // Escape to close
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
                        `<h2 style="color:var(--primary); font-size: 2rem;">${id}</h2>
                         <p style="margin-top:10px;">Detailed case study overview loading dynamically...</p>`;
                }
                modal.classList.add('active');
            });
        });

        closeBtn?.addEventListener('click', close);

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        // Escape to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }
};