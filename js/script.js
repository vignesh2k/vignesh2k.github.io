document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const themeToggle = document.getElementById('theme-toggle');
    const contactForm = document.getElementById('contact-form');
    
    // State
    let isMenuOpen = false;
    
    // ==========================================
    // Theme Toggle Functionality
    // ==========================================
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animate icon rotation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 500);
    });
    
    // ==========================================
    // Mobile Menu Functionality
    // ==========================================
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
    
    function closeMenu() {
        isMenuOpen = false;
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    navToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // ==========================================
    // Header Scroll Effect
    // ==========================================
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // ==========================================
    // Active Navigation Link on Scroll
    // ==========================================
    function activeLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
            
            if (sectionsClass) {
                if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.nav__link[href*=' + sectionId + ']').classList.add('active');
                } else {
                    document.querySelector('.nav__link[href*=' + sectionId + ']').classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', activeLink);
    
    // ==========================================
    // Form Submission (Demo)
    // ==========================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulate sending
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = `
                    <span>Message Sent!</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                btn.style.backgroundColor = 'var(--color-accent-1)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        });
    }
    
    // ==========================================
    // Scroll Reveal Animation (Intersection Observer)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add reveal class to improved elements
    const elementsToReveal = document.querySelectorAll('.section__title, .about__text, .stat, .skill-card, .project-card, .contact__item, .contact__form');
    
    elementsToReveal.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
    
    // CSS class for reveal animation is handled via inline styles above for simplicity
    // But let's add a proper class handler
    document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
    
    // We need to actually trigger the style change when the class is added
    // Use a MutationObserver or just css transition delay
    
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
});
