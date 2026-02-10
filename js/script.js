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
    // ==========================================
    // Optimized Scroll Handler (Throttled)
    // ==========================================
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function activeLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']'); // Note: This selector looks suspicious in original code (.nav__menu doesn't exist in HTML shown, it's .nav__list with id nav-menu), but keeping logic same for safety, just throttling.

            // Actually, let's fix the caching if possible, but for now just throttle.
            // The original code querySelector might return null if class doesn't match. 
            // We'll trust the logic works as before but run it less often.

            const link = document.querySelector('.nav__link[href*=' + sectionId + ']');
            if (link) { // Safety check
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    // Scroll optimization variables
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                activeLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();
    activeLink();

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

/* ============================================
   Moo Game Logic
   ============================================ */
// State for the game
/* ============================================
   Moo Game Logic (Data-Driven)
   ============================================ */

const MOO_GAME_DATA = {
    steps: {
        password: {
            type: 'input',
            title: 'Secret Access 🔒',
            text: 'What is Vigu\'s favourite nickname for you BESIDES Moo?<br><span style="font-size: 0.9em; opacity: 0.8;">(Hint: It ends in ose 😉)</span>',
            placeholder: 'Enter nickname...',
            correctAnswer: 'cutose', // We could base64 this but simple string compare is fine for now as per plan
            nextStep: 0,
            errorMsg: 'Access denied... only Moos allowed! 🐮'
        },
        0: {
            type: 'intro',
            title: 'Moo! 🐮',
            text: 'You\'ve found the secret cow level! Ready for a little challenge?',
            buttonText: "Let's Go!",
            nextStep: 1
        },
        1: {
            type: 'choice',
            title: 'Question 1',
            text: 'What is my favorite color?',
            options: [
                { text: 'Purple', correct: true, nextStep: 2 },
                { text: 'Pink', correct: false, errorMsg: 'Try again! 🐮' }
            ]
        },
        2: {
            type: 'choice',
            title: 'Question 2',
            text: 'What is our dream destination?',
            options: [
                { text: 'Visiting NYC & Chill', correct: false, errorMsg: 'Too chaotic! 🐮' },
                { text: 'Northern Lights in Norway', correct: true, nextStep: 3 }
            ]
        },
        3: {
            type: 'input',
            title: 'Question 3',
            text: 'What is the capital of the USA? (hehehe)',
            placeholder: 'Enter city...',
            correctAnswer: ['washington', 'washington dc', 'washington d.c.'],
            nextStep: 4,
            errorMsg: 'Hehehe... try again! 🇺🇸'
        },
        4: {
            type: 'choice',
            title: 'Question 4',
            text: 'Who is taller? 📏',
            options: [
                { text: 'Vigu', correct: true, nextStep: 5 },
                { text: 'Moo', correct: false, errorMsg: 'I wish! 🐮' }
            ]
        },
        5: {
            type: 'choice',
            title: 'Question 5',
            text: 'What are we?',
            options: [
                { text: 'Otters for life', correct: true, action: 'celebrate' }, // Special action
                { text: 'Non Chalant Peeps', correct: false, errorMsg: 'No way! 🐮' }
            ]
        }
    }
};

// Current Step State
let currentStepId = 'password';

// Helper to check answers (simple obfuscation could be added here if needed)
function checkAnswer(input, correct) {
    const normalize = str => str.trim().toLowerCase();
    if (Array.isArray(correct)) {
        return correct.some(c => normalize(input) === normalize(c));
    }
    return normalize(input) === normalize(correct);
}

// Function to render a step
function renderStep(stepId) {
    const container = document.getElementById('moo-game-content');
    if (!container) return; // Should exist

    // Handle special 'success' step which is static in HTML
    if (stepId === 'success') {
        container.innerHTML = ''; // Clear dynamic content
        const successEl = document.getElementById('game-step-success');
        if (successEl) {
            successEl.classList.remove('hidden');
            successEl.style.display = 'block'; // Ensure it's visible if hidden via CSS

            // Trigger animations
            setTimeout(() => {
                // Initialize fade-in for gallery
                const fadeElements = document.querySelectorAll('.fade-in-scroll');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                fadeElements.forEach(el => observer.observe(el));
                // Fallback
                setTimeout(() => fadeElements.forEach(el => el.classList.add('visible')), 500);
            }, 100);
        }
        return;
    }

    // Handle celebration step
    if (stepId === 'celebration') {
        container.innerHTML = '';
        const celEl = document.getElementById('game-step-celebration');
        if (celEl) {
            celEl.classList.remove('hidden');
            celEl.style.display = 'block';
        }
        return;
    }

    // Hide static success/celebration steps if they are visible
    document.querySelectorAll('.static-game-step').forEach(el => {
        el.classList.add('hidden');
        el.style.display = 'none';
    });

    const stepData = MOO_GAME_DATA.steps[stepId];
    if (!stepData) return;

    currentStepId = stepId;
    let html = `
        <div class="game-step active" id="dynamic-step-${stepId}">
            <h2 class="moo-title">${stepData.title}</h2>
            <p class="moo-text">${stepData.text}</p>
    `;

    if (stepData.type === 'input') {
        html += `
            <div class="moo-input-group">
                <input type="text" id="moo-input-${stepId}" class="moo-input" placeholder="${stepData.placeholder}">
                <button class="btn btn--moo" id="moo-submit-${stepId}">Submit</button>
            </div>
        `;
    } else if (stepData.type === 'choice') {
        html += `<div class="moo-options">`;
        stepData.options.forEach((opt, idx) => {
            const btnClass = idx === 0 ? 'btn btn--moo' : 'btn btn--moo-outline'; // Simple alternating style or based on content? 
            // Actually let's just make them all primary for consistency or use what was there.
            // Old Q1: Purple (Primary), Pink (Outline). 
            // We can just iterate.
            html += `<button class="btn btn--moo${idx % 2 !== 0 ? '-outline' : ''}" data-opt-idx="${idx}">${opt.text}</button>`;
        });
        html += `</div>`;
    } else if (stepData.type === 'intro') {
        html += `
            <button class="btn btn--moo" id="moo-action-${stepId}">${stepData.buttonText}</button>
        `;
    }

    html += `</div>`;
    container.innerHTML = html;

    // Attach Event Listeners
    if (stepData.type === 'input') {
        const btn = document.getElementById(`moo-submit-${stepId}`);
        const input = document.getElementById(`moo-input-${stepId}`);

        const handleSubmit = () => {
            if (checkAnswer(input.value, stepData.correctAnswer)) {
                window.nextStep(stepData.nextStep);
            } else {
                window.showMooModal(stepData.errorMsg);
                input.value = '';
            }
        };

        btn.addEventListener('click', handleSubmit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSubmit();
        });

        // Auto-focus logic could go here
        setTimeout(() => input.focus(), 100);
    } else if (stepData.type === 'choice') {
        const btns = container.querySelectorAll('.moo-options button');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.optIdx);
                const opt = stepData.options[idx];
                if (opt.correct) {
                    if (opt.action === 'celebrate') {
                        window.celebrate();
                    } else {
                        window.nextStep(opt.nextStep);
                    }
                } else {
                    window.showMooModal(opt.errorMsg);
                }
            });
        });
    } else if (stepData.type === 'intro') {
        const btn = document.getElementById(`moo-action-${stepId}`);
        btn.addEventListener('click', () => window.nextStep(stepData.nextStep));
    }
}

window.nextStep = function (step) {
    renderStep(step);
};

// Custom Modal Logic
window.showMooModal = function (message) {
    const modal = document.getElementById('moo-modal');
    const text = document.getElementById('moo-modal-text');
    if (modal && text) {
        text.textContent = message;
        modal.classList.remove('hidden');
    }
};

window.closeMooModal = function () {
    const modal = document.getElementById('moo-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
};

// Intermediate celebration (unlocks gallery)
window.celebrate = function () {
    window.nextStep('success');
};

// Final Proposal Action (Bottom of page)
window.finalProposal = function () {
    startConfetti();
    launchFireworks(); // Fire the new fireworks function

    // Switch to the dedicated celebration step
    window.nextStep('celebration');
};

// Fireworks Logic (Simple Canvas extension)
function launchFireworks() {
    let burstCount = 0;
    const interval = setInterval(() => {
        startConfetti(); // Ensure it's running
        burstCount++;
        if (burstCount > 5) clearInterval(interval);
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const mooTrigger = document.getElementById('moo-trigger');
    const mooGame = document.getElementById('moo-game');
    const mooClose = document.getElementById('moo-close');

    if (mooTrigger && mooGame) {
        mooTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('moo-theme');
            mooGame.classList.remove('hidden');

            // Initial render
            window.nextStep('password');
        });

        mooClose.addEventListener('click', () => {
            mooGame.classList.add('hidden');
            document.body.classList.remove('moo-theme');
            stopConfetti();

            // Reset content slightly so it's clean for next open? 
            // effectively renderStep('password') will handle it next time.
        });
    }
});

/* ============================================
   Simple Confetti Implementation
   ============================================ */
let confettiActive = false;
let animationId = null;

function startConfetti() {
    if (confettiActive) return;
    confettiActive = true;

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff8a80', '#ffcc80', '#8d6e63', '#ffffff', '#e57373'];

    for (let i = 0; i < 200; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            rotation: Math.random() * 360,
            speed: 2 + Math.random() * 4,
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            sway: Math.random() * 2 - 1
        });
    }

    function update() {
        if (!confettiActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.y += p.speed;
            p.x += Math.sin(p.y * 0.01) + p.sway;
            p.rotation += 2;

            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            ctx.restore();
        });

        animationId = requestAnimationFrame(update);
    }

    update();
}

function stopConfetti() {
    confettiActive = false;
    if (animationId) cancelAnimationFrame(animationId);

    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}


