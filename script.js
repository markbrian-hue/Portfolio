/**
 * Portfolio JavaScript
 * Contact form sends emails to markbrianv229@gmail.com via FormSubmit.co
 */

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    MobileMenu.init();
    ContactModal.init();
    ProjectModal.init();
    SmoothScroll.init();
    console.log('Portfolio loaded successfully.');
});

/**
 * Mobile Menu Module
 */
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

/**
 * Contact Modal Module
 */
const ContactModal = {
    init() {
        this.modal = document.getElementById('contactModal');
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('formSuccess');
        this.errorMessage = document.getElementById('formError');
        this.retryBtn = document.getElementById('retryBtn');
        
        if (!this.modal) return;
        
        // Open modal triggers
        document.querySelectorAll('[data-action="contact"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });
        
        // Close modal triggers
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Retry button
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => this.resetForm());
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.resetForm();
        
        setTimeout(() => {
            const firstInput = this.form?.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    },
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    resetForm() {
        if (this.form) {
            this.form.style.display = 'block';
            this.form.reset();
        }
        if (this.successMessage) {
            this.successMessage.classList.remove('show');
        }
        if (this.errorMessage) {
            this.errorMessage.classList.remove('show');
        }
        const header = this.modal.querySelector('.modal-header');
        if (header) header.style.display = 'block';
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            await this.sendEmail();
            
            this.form.style.display = 'none';
            this.modal.querySelector('.modal-header').style.display = 'none';
            this.successMessage.classList.add('show');
            
            setTimeout(() => this.close(), 4000);
            
        } catch (error) {
            console.error('Email send error:', error);
            
            this.form.style.display = 'none';
            this.modal.querySelector('.modal-header').style.display = 'none';
            this.errorMessage.classList.add('show');
            
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },
    
      sendEmail() {
        // We replaced your email with the secure token from FormSubmit
        // This prevents bots from seeing your real email address
        const endpoint = "https://formsubmit.co/ajax/3073cb751d6aad75499b9265ee902496";
        const formData = new FormData(this.form);
        
        formData.append("_subject", `Portfolio Contact: ${formData.get('subject')}`);
        formData.append("_template", "table");
        formData.append("_captcha", "false");

        return fetch(endpoint, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },
    
    fallbackEmail() {
        const formData = new FormData(this.form);
        const name = formData.get('from_name');
        const email = formData.get('from_email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        const mailtoLink = `mailto:markbrianv229@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        
        window.location.href = mailtoLink;
        return Promise.resolve();
    }
};

/**
 * Project Modal Module
 */
const ProjectModal = {
    projects: {
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
            githubUrl: ''
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
            liveUrl: '',
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
        
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
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
        const featuresHTML = project.features
            .map(feature => `<li>${feature}</li>`)
            .join('');
        
        let linksHTML = '';
        if (project.liveUrl) {
            linksHTML += `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn-primary">View Live Site</a>`;
        }
        if (project.githubUrl) {
            linksHTML += `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn-secondary">View Source Code</a>`;
        }
        if (!project.liveUrl && !project.githubUrl) {
            linksHTML = '<p style="color: var(--text-body); font-style: italic;">Project links coming soon...</p>';
        }
        
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

/**
 * Smooth Scroll Module
 */
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
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};