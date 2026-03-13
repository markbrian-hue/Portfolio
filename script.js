/**
 * Portfolio JavaScript - Level 4 Awwwards Masterclass Version
 * Features: Lenis Smooth Scroll, GSAP Animations, Three.js WebGL, 
 * Cybernetic Text, Custom Cursor, and Magnetic UI.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Functionality
    MobileMenu.init();
    ContactModal.init();
    ProjectModal.init();
    
    // 2. Custom Interactions
    InteractiveTyping.init();
    CustomCursor.init();
    MagneticElements.init();
    
    // 3. God-Tier UI Effects
    TextDecryption.init();
    UpgradedTiltAndGlare.init();
    ClickShockwave.init();

    // 4. External Dependencies (The Heavy Artillery)
    SmoothScroller.init(); // Lenis Smooth Scrolling
    GSAPAnimations.init(); // GSAP ScrollTrigger
    WebGLBackground.init(); // Three.js 3D Particles
    
    console.log('Portfolio loaded. Operating at maximum interactivity with GSAP, Lenis, and WebGL.');
});

/* ==========================================
   1. CORE FUNCTIONALITY
========================================== */

/* Mobile Menu */
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
        this.menuBtn.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    },
    close() {
        this.menuBtn.classList.remove('active');
        this.navLinks.classList.remove('active');
    }
};

/* Contact Modal + Bottom Form */
const ContactModal = {
    init() {
        this.modal = document.getElementById('contactModal');
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('formSuccess');
        this.errorMessage = document.getElementById('formError');
        this.retryBtn = document.getElementById('retryBtn');

        this.bottomForm = document.getElementById('contactFormBottom');
        this.bottomSuccess = document.getElementById('formSuccessBottom');
        this.bottomError = document.getElementById('formErrorBottom');
        this.bottomRetry = document.getElementById('retryBtnBottom');

        if (!this.modal && !this.bottomForm) return;

        document.querySelectorAll('[data-action="contact"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        if (this.modal) {
            this.modal.querySelector('.modal-close')?.addEventListener('click', () => this.close());
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e, this.form, this.successMessage, this.errorMessage));
        }

        if (this.bottomForm) {
            this.bottomForm.addEventListener('submit', (e) => this.handleSubmit(e, this.bottomForm, this.bottomSuccess, this.bottomError));
        }

        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => this.resetForm(this.form, this.successMessage, this.errorMessage, true));
        }
        if (this.bottomRetry) {
            this.bottomRetry.addEventListener('click', () => this.resetForm(this.bottomForm, this.bottomSuccess, this.bottomError, false));
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.resetForm(this.form, this.successMessage, this.errorMessage, true);
            setTimeout(() => {
                const firstInput = this.form?.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 300);
        } else {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
    },

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    resetForm(formEl, successEl, errorEl, showHeader) {
        if (formEl) {
            formEl.style.display = 'block';
            formEl.reset();
        }
        successEl?.classList.remove('show');
        errorEl?.classList.remove('show');
        if (showHeader && this.modal) {
            const header = this.modal.querySelector('.modal-header');
            if (header) header.style.display = 'block';
        }
    },

    async handleSubmit(e, formEl, successEl, errorEl) {
        e.preventDefault();
        const submitBtn = formEl.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            await this.sendEmail(formEl);
            formEl.style.display = 'none';
            successEl?.classList.add('show');
        } catch (error) {
            console.error('Email send error:', error);
            formEl.style.display = 'none';
            errorEl?.classList.add('show');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },

    sendEmail(formEl) {
        const endpoint = "https://formsubmit.co/ajax/3073cb751d6aad75499b9265ee902496";
        const formData = new FormData(formEl);

        formData.append("_subject", `Portfolio Contact: ${formData.get('subject')}`);
        formData.append("_template", "table");
        formData.append("_captcha", "false");

        return fetch(endpoint, {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        });
    }
};

/* Project Modal */
const ProjectModal = {
    projects: {
        luxuryTravel: {
            title: 'Luxury Travel Website',
            image: 'images/luxury-travel.png',
            tags: 'Frontend • Custom Coding • WordPress/Wix',
            description: 'A premium, highly interactive web experience designed for a freelance client to showcase luxury travel destinations. Built with an emphasis on high-end visuals, seamless user journeys, and secure booking functionalities.',
            features: [
                'High-end custom UI/UX design tailored for luxury clientele',
                'Responsive image galleries for immersive destination viewing',
                'Interactive and secure booking inquiry forms',
                'Optimized performance for high-resolution visual assets'
            ],
            liveUrl: '',
            githubUrl: ''
        },
        cafeWeb: {
            title: '91 Cafe Website',
            image: 'images/91cafe.png', 
            tags: 'Frontend • Web Design • Vercel',
            description: 'A dedicated front-end promotional website built for 91 Cafe. Designed with a modern, sleek interface to showcase the café\'s offerings, enhance their digital footprint, and provide a seamless browsing experience for customers.',
            features: [
                'Modern, responsive, and mobile-first UI design',
                'Optimized for fast page loading and smooth transitions',
                'Engaging visual layout for product showcasing',
                'Live deployment and scalable hosting on Vercel'
            ],
            liveUrl: 'https://91-cafe.vercel.app/',
            githubUrl: ''
        },
        pos: {
            title: 'POS System',
            image: 'images/pos.png',
            tags: 'ASP.NET MVC • SQL • C#',
            description: 'A comprehensive Point of Sale system designed for retail businesses. Features smart inventory management with real-time stock tracking, automated reorder alerts, and advanced data analytics for sales forecasting and business insights.',
            features: [
                'Real-time inventory tracking and management',
                'Sales analytics with visual dashboards',
                'Automated low-stock alerts and reorder suggestions',
                'Multi-user support with role-based permissions',
                'Receipt generation and transaction history',
                'Data export and reporting features'
            ],
            liveUrl: '',
            githubUrl: 'https://github.com/markbrian-hue/91-Cafe---POS-with-Smart-Inventory-System-and-Data-Analytics'
        },
        celestia: {
            title: 'Celestia Web Application',
            image: 'images/celestia.png',
            tags: 'React • TypeScript • SQL • Node.js',
            description: 'A dynamic web platform that streamlines customer booking and user management. Built with modern technologies for optimal performance and user experience, featuring real-time updates and responsive design across all devices.',
            features: [
                'Customer booking system with calendar integration',
                'User authentication and profile management',
                'Admin dashboard for business analytics',
                'Email notifications and reminders',
                'Mobile-responsive design',
                'Real-time availability updates'
            ],
            liveUrl: 'https://thecelestiahotel.vercel.app/',
            githubUrl: ''
        },
        payment: {
            title: 'Secure Pay Integration',
            image: 'images/payment.png',
            tags: 'API • PayMongo • Node.js • Backend',
            description: 'A secure payment processing implementation using PayMongo APIs. Handles various payment methods including credit cards, e-wallets, and bank transfers with PCI-compliant security measures and comprehensive transaction management.',
            features: [
                'Multiple payment method support (Cards, GCash, Maya)',
                'Secure PCI-compliant transactions',
                'Webhook integration for real-time updates',
                'Refund and dispute management',
                'Transaction logging and reporting',
                'Error handling and retry mechanisms'
            ],
            liveUrl: '',
            githubUrl: ''
        },
        qcu: {
            title: 'QCU Food Hub',
            image: 'images/foodhub.png',
            tags: 'Vue • JavaScript • C#',
            description: 'An entrepreneurship hub platform for students to browse ventures, manage listings, and connect with opportunities in the QCU community.',
            features: [
                'Venture browsing with categorized listings',
                'Creator dashboards to add and manage opportunities',
                'Authentication and role-based actions',
                'Responsive UI for mobile and desktop',
                'Real-time data management',
                'Search and filter functionalities'
            ],
            liveUrl: '',
            githubUrl: 'https://github.com/markbrian-hue/QCU-EntrepHub'
        }
    },

    init() {
        this.modal = document.getElementById('projectModal');
        this.contentContainer = document.getElementById('projectModalContent');
        if (!this.modal) return;

        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.dataset.project;
                this.open(projectId);
            });
        });

        this.modal.querySelector('.modal-close')?.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },

    open(projectId) {
        const project = this.projects[projectId];
        if (!project) return;
        
        this.contentContainer.innerHTML = this.renderProject(project);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    },

    renderProject(project) {
        const featuresHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
        let linksHTML = '';
        if (project.liveUrl) linksHTML += `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn-primary magnetic">View Live Site</a>`;
        if (project.githubUrl) linksHTML += `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn-secondary magnetic">View Source Code</a>`;
        if (!project.liveUrl && !project.githubUrl) linksHTML = '<p style="color: var(--text-body); font-style: italic;">Project links coming soon...</p>';

        return `
            <img src="${project.image}" alt="${project.title}" class="project-modal-image" onerror="this.style.display='none'">
            <h2>${project.title}</h2>
            <p class="tech-tags">${project.tags}</p>
            <p class="description">${project.description}</p>
            <div class="project-features">
                <h4>Key Features</h4>
                <ul>${featuresHTML}</ul>
            </div>
            <div class="project-links">
                ${linksHTML}
            </div>
        `;
    }
};


/* ==========================================
   2. CUSTOM INTERACTIONS
========================================== */

/* Interactive Typing Effect */
const InteractiveTyping = {
    init() {
        this.element = document.querySelector('#typewriter'); 
        if (!this.element || this.element.closest('.resume-sidebar')) return;

        this.words = ['Full Stack Developer', 'IoT Enthusiast', 'UI/UX Designer'];
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        
        this.element.innerHTML = '<span class="text"></span><span class="typing-cursor"></span>';
        this.textElement = this.element.querySelector('.text');
        
        this.type();
    },
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.textElement.textContent = this.txt;

        let typeSpeed = 100;
        if (this.isDeleting) typeSpeed /= 2;

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = 2000; 
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500; 
        }

        setTimeout(() => this.type(), typeSpeed);
    }
};

/* Custom Fluid Cursor */
const CustomCursor = {
    init() {
        if (!window.matchMedia("(hover: hover)").matches) return;

        this.cursor = document.querySelector('.custom-cursor');
        this.follower = document.querySelector('.cursor-follower');
        if (!this.cursor || !this.follower) return;

        this.mouseX = 0; this.mouseY = 0;
        this.followerX = 0; this.followerY = 0;

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.cursor.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0) translate(-50%, -50%)`;
        });

        const hoverElements = document.querySelectorAll('a, button, input, textarea, .magnetic');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
        });

        this.animate();
    },
    animate() {
        this.followerX += (this.mouseX - this.followerX) * 0.15;
        this.followerY += (this.mouseY - this.followerY) * 0.15;
        this.follower.style.transform = `translate3d(${this.followerX}px, ${this.followerY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(() => this.animate());
    }
};

/* Magnetic UI Elements */
const MagneticElements = {
    init() {
        if (!window.matchMedia("(hover: hover)").matches) return;
        
        const magnets = document.querySelectorAll('.magnetic');
        magnets.forEach(magnet => {
            magnet.addEventListener('mousemove', (e) => {
                const rect = magnet.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            magnet.addEventListener('mouseleave', () => {
                magnet.style.transform = 'translate(0px, 0px)';
            });
        });
    }
};


/* ==========================================
   3. GOD-TIER UI EFFECTS
========================================== */

/* Cybernetic Text Decryption */
const TextDecryption = {
    init() {
        const targets = document.querySelectorAll('.section-title');
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.decrypted) {
                    entry.target.dataset.decrypted = "true";
                    this.decrypt(entry.target, chars);
                }
            });
        }, { threshold: 0.5 });

        targets.forEach(target => {
            target.classList.add('decrypt-text');
            target.dataset.originalText = target.innerText;
            observer.observe(target);
        });
    },
    
    decrypt(element, chars) {
        const originalText = element.dataset.originalText;
        let iteration = 0;
        
        clearInterval(element.decryptionInterval);
        
        element.decryptionInterval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if(index < iteration) return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
                
            if(iteration >= originalText.length) {
                clearInterval(element.decryptionInterval);
                element.innerText = originalText;
            }
            
            iteration += 1 / 3; 
        }, 30);
    }
};

/* Holographic Glare & Upgraded Tilt */
const UpgradedTiltAndGlare = {
    init() {
        const elements = document.querySelectorAll('.project-card, .skill-card, .contact-info-card, .contact-form-card, .tilt-element');
        
        if (window.matchMedia("(hover: hover)").matches) {
            elements.forEach(el => {
                el.addEventListener('mousemove', this.handleMove);
                el.addEventListener('mouseleave', this.handleLeave);
            });
        }
    },
    handleMove(e) {
        const el = this;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; 
        const rotateY = ((x - centerX) / centerX) * 5;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
    },
    handleLeave() {
        this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        this.style.setProperty('--mouse-x', `50%`);
        this.style.setProperty('--mouse-y', `50%`);
    }
};

/* Tactile Click Shockwaves */
const ClickShockwave = {
    init() {
        window.addEventListener('click', (e) => {
            if (e.target.closest('.modal') || !window.matchMedia("(hover: hover)").matches) return;
            
            const shockwave = document.createElement('div');
            shockwave.classList.add('click-shockwave');
            
            const size = 100; 
            shockwave.style.width = `${size}px`;
            shockwave.style.height = `${size}px`;
            shockwave.style.left = `${e.clientX}px`;
            shockwave.style.top = `${e.clientY}px`;
            
            document.body.appendChild(shockwave);
            
            setTimeout(() => {
                shockwave.remove();
            }, 600);
        });
    }
};


/* ==========================================
   4. EXTERNAL DEPENDENCIES (CDN)
========================================== */

/* Lenis Smooth Scrolling */
const SmoothScroller = {
    init() {
        if (typeof Lenis === 'undefined') return;

        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // GSAP Sync
        if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
            this.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0, 0);
        } else {
            const raf = (time) => {
                this.lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        }

        // Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    this.lenis.scrollTo(targetElement, { offset: -80 });
                }
            });
        });
    }
};

/* GSAP Advanced Scroll Animations */
const GSAPAnimations = {
    init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // 1. Reveal basic .fade-in elements (Headings, text, etc.)
        // We exclude the cards here so GSAP can handle them separately below
        const fadeElements = document.querySelectorAll('.fade-in:not(.skill-card):not(.project-card)');
        fadeElements.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: "top 85%", 
                toggleClass: "visible", 
                once: true 
            });
        });

        // 2. Hero Parallax
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg) {
            gsap.to(heroImg, {
                y: 100,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // 3. Staggered Skill Cards (FIXED: using fromTo)
        const skillCards = document.querySelectorAll('.skill-card');
        if (skillCards.length > 0) {
            gsap.fromTo(skillCards, 
                { opacity: 0, y: 50 }, // Start state
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    stagger: 0.15, 
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: '.skills-grid',
                        start: 'top 85%',
                    }
                } // End state
            );
        }

        // 4. Staggered Project Cards (FIXED: using fromTo)
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            gsap.fromTo(projectCards, 
                { opacity: 0, y: 50 }, // Start state
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.projects-grid',
                        start: 'top 85%',
                    }
                } // End state
            );
        }
    }
};

/* Three.js 3D WebGL Background */
const WebGLBackground = {
    init() {
        if (typeof THREE === 'undefined') return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.canvas = document.getElementById('networkCanvas');
        if(!this.canvas) return;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x3b82f6, 
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, material);
        this.scene.add(this.particlesMesh);

        this.camera.position.z = 4;
        this.mouseX = 0;
        this.mouseY = 0;

        window.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) - 0.5;
            this.mouseY = (event.clientY / window.innerHeight) - 0.5;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.clock = new THREE.Clock();
        this.animate();
    },

    animate() {
        requestAnimationFrame(() => this.animate());
        const elapsedTime = this.clock.getElapsedTime();

        this.particlesMesh.rotation.y = elapsedTime * 0.05;
        this.particlesMesh.rotation.x = elapsedTime * 0.02;

        this.particlesMesh.rotation.y += this.mouseX * 0.05;
        this.particlesMesh.rotation.x += this.mouseY * 0.05;

        this.renderer.render(this.scene, this.camera);
    }
};