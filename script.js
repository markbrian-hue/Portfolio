/**
 * Portfolio JavaScript
 * Contact form sends emails to markbrianv229@gmail.com via FormSubmit.co
 */

document.addEventListener('DOMContentLoaded', () => {
    MobileMenu.init();
    ContactModal.init();
    ProjectModal.init();
    SmoothScroll.init();
    FadeInOnScroll.init();
    console.log('Portfolio loaded successfully.');
});

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
        cafeWeb: {
            title: '91 Cafe Website',
            image: 'images/91cafe.png', // Ensure you save a screenshot as 91cafe.png in your images folder
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
            title: 'Payment Integration',
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
                'Real-time data powered by Supabase',
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
        if (project.liveUrl) linksHTML += `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn-primary">View Live Site</a>`;
        if (project.githubUrl) linksHTML += `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn-secondary">View Source Code</a>`;
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