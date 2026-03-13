/**
 * Portfolio JavaScript - Advanced Interactive Version
 * Contact form sends emails to markbrianv229@gmail.com via FormSubmit.co
 */

document.addEventListener('DOMContentLoaded', () => {
    // Core Functionality
    MobileMenu.init();
    ContactModal.init();
    ProjectModal.init();
    SmoothScroll.init();
    FadeInOnScroll.init();
    
    // Level 1 Interactivity
    InteractiveTyping.init();
    // Removed old TiltEffect.init() here
    
    // Level 2 Advanced Interactivity
    CanvasNetwork.init();
    CustomCursor.init();
    MagneticElements.init();
    
    // Level 3 God-Tier Interactivity
    TextDecryption.init();
    UpgradedTiltAndGlare.init(); // This replaces the old tilt!
    ClickShockwave.init();
    
    console.log('Portfolio loaded successfully. Operating at maximum interactivity.');
});

/* --- CORE FUNCTIONALITY --- */

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
    },

    fallbackEmail(formEl) {
        const formData = new FormData(formEl);
        const name = formData.get('from_name');
        const email = formData.get('from_email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        const mailtoLink = `mailto:markbrianv229@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        window.location.href = mailtoLink;
        return Promise.resolve();
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
        if (!project) {
            console.error(`Project "${projectId}" not found`);
            return;
        }
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

/* Smooth Scroll */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        });
    }
};

/* Fade-in on scroll */
const FadeInOnScroll = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }
};

/* --- LEVEL 1 INTERACTIVITY --- */

/* Interactive Typing Effect for Hero Section */
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

/* 3D Tilt Effect for Cards on Mouse Move */
const TiltEffect = {
    init() {
        const elements = document.querySelectorAll('.project-card, .skill-card, .tilt-element');
        
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
    },
    handleLeave() {
        this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
};

/* --- LEVEL 2: ADVANCED AWWWARDS INTERACTIVITY --- */

/* 1. Physics-based Node Network (Canvas) */
const CanvasNetwork = {
    init() {
        this.canvas = document.getElementById('networkCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        this.createParticles();
        this.animate();
    },
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    },
    createParticles() {
        this.particles = [];
        let numberOfParticles = (this.canvas.width * this.canvas.height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = 'rgba(148, 163, 184, 0.8)'; 
            
            this.particles.push(new Particle(x, y, directionX, directionY, size, color, this.canvas, this.ctx, this.mouse));
        }
    },
    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
        this.connect();
    },
    connect() {
        let opacityValue = 1;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x))
                + ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y));
                
                if (distance < (this.canvas.width / 10) * (this.canvas.height / 10)) {
                    opacityValue = 1 - (distance / 20000);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.2})`; 
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
};

class Particle {
    constructor(x, y, directionX, directionY, size, color, canvas, ctx, mouse) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY;
        this.size = size; this.color = color; this.canvas = canvas; this.ctx = ctx; this.mouse = mouse;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.fill();
    }
    update() {
        if (this.x > this.canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > this.canvas.height || this.y < 0) this.directionY = -this.directionY;

        // Mouse collision
        let dx = this.mouse.x - this.x;
        let dy = this.mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius + this.size) {
            if (this.mouse.x < this.x && this.x < this.canvas.width - this.size * 10) this.x += 3;
            if (this.mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
            if (this.mouse.y < this.y && this.y < this.canvas.height - this.size * 10) this.y += 3;
            if (this.mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

/* 2. Custom Fluid Cursor */
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

/* 3. Magnetic UI Elements */
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

/* --- LEVEL 3: GOD-TIER INTERACTIVITY --- */

/* 1. Cybernetic Text Decryption */
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
            
            iteration += 1 / 3; // Controls the speed of the reveal
        }, 30);
    }
};

/* 2. Holographic Glare Upgraded Tilt */
const UpgradedTiltAndGlare = {
    init() {
        const elements = document.querySelectorAll('.project-card, .skill-card, .contact-info-card, .contact-form-card');
        
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
        
        // Coordinates relative to the element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Tilt Math
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; 
        const rotateY = ((x - centerX) / centerX) * 5;
        
        // Apply Tilt
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Apply Glare Tracking via CSS Variables
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
    },
    handleLeave() {
        this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        // Soft reset for glare
        this.style.setProperty('--mouse-x', `50%`);
        this.style.setProperty('--mouse-y', `50%`);
    }
};

/* 3. Tactile Click Shockwaves */
const ClickShockwave = {
    init() {
        window.addEventListener('click', (e) => {
            // Don't trigger if clicking inside a modal to prevent clipping issues
            if (e.target.closest('.modal')) return;
            
            const shockwave = document.createElement('div');
            shockwave.classList.add('click-shockwave');
            
            // Set size dynamically
            const size = 100; 
            shockwave.style.width = `${size}px`;
            shockwave.style.height = `${size}px`;
            
            // Position at exact mouse coordinates
            shockwave.style.left = `${e.clientX}px`;
            shockwave.style.top = `${e.clientY}px`;
            
            document.body.appendChild(shockwave);
            
            // Remove DOM element after animation completes
            setTimeout(() => {
                shockwave.remove();
            }, 600);
        });
    }
};