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
   Moo Game Logic (Obfuscated Data)
   ============================================ */

const MOO_GAME_DATA = {
    steps: {
        password: {
            type: "input",
            title: "U2VjcmV0IEFjY2VzcyDwn5SS",
            text: "V2hhdCBpcyBWaWd1J3MgZmF2b3VyaXRlIG5pY2tuYW1lIGZvciB5b3UgQkVTSURFUyBNb28/PGJyPjxzcGFuIHN0eWxlPSJmb250LXNpemU6IDAuOWVtOyBvcGFjaXR5OiAwLjg7Ij4oSGludDogSXQgZW5kcyBpbiBvc2Ug8J+YiSk8L3NwYW4+",
            placeholder: "RW50ZXIgbmlja25hbWUuLi4=",
            correctAnswer: "Y3V0b3Nl",
            nextStep: 0,
            errorMsg: "QWNjZXNzIGRlbmllZC4uLiBvbmx5IE1vb3MgYWFsbG93ZWQhIPCfkK4="
        },
        0: {
            type: "intro",
            title: "TW9vISDwn5Cu",
            text: "WW91J3ZlIGZvdW5kIHRoZSBzZWNyZXQgY293IGxldmVsISBSZWFkeSBmb3IgYSBsaXR0bGUgY2hhbGxlbmdlPw==",
            buttonText: "TGV0J3MgR28h",
            nextStep: 1
        },
        1: {
            type: "choice",
            title: "UXVlc3Rpb24gMQ==",
            text: "V2hhdCBpcyBteSBmYXZvcml0ZSBjb2xvcj8=",
            options: [
                {
                    text: "UHVycGxl",
                    correct: true,
                    nextStep: 2
                },
                {
                    text: "UGluaw==",
                    correct: false,
                    errorMsg: "VHJ5IGFnYWluISDwn5Cu"
                }
            ]
        },
        2: {
            type: "choice",
            title: "UXVlc3Rpb24gMg==",
            text: "V2hhdCBpcyBvdXIgZHJlYW0gZGVzdGluYXRpb24/",
            options: [
                {
                    text: "VmlzaXRpbmcgTllDICYgQ2hpbGw=",
                    correct: false,
                    errorMsg: "VG9vIGNoYW90aWMhIPCfkK4="
                },
                {
                    text: "Tm9ydGhlcm4gTGlnaHRzIGluIE5vcndheQ==",
                    correct: true,
                    nextStep: 3
                }
            ]
        },
        3: {
            type: "input",
            title: "UXVlc3Rpb24gMw==",
            text: "V2hhdCBpcyB0aGUgY2FwaXRhbCBvZiB0aGUgVVNBPyAoaGVoZWhlKQ==",
            placeholder: "RW50ZXIgY2l0eS4uLg==",
            correctAnswer: [
                "d2FzaGluZ3Rvbg==",
                "d2FzaGluZ3RvbiBkYw==",
                "d2FzaGluZ3RvbiBkLmMu"
            ],
            nextStep: 4,
            errorMsg: "SGVoZWhlLi4uIHRyeSBhZ2FpbiEg8J+HuvCfh7g="
        },
        4: {
            type: "choice",
            title: "UXVlc3Rpb24gNA==",
            text: "V2hvIGlzIHRhbGxlcj8g8J+Tjw==",
            options: [
                {
                    text: "VmlndQ==",
                    correct: true,
                    nextStep: 5
                },
                {
                    text: "TW9v",
                    correct: false,
                    errorMsg: "SSB3aXNoISDwn5Cu"
                }
            ]
        },
        5: {
            type: "choice",
            title: "UXVlc3Rpb24gNQ==",
            text: "V2hhdCBhcmUgd2U/",
            options: [
                {
                    text: "T3R0ZXJzIGZvciBsaWZl",
                    correct: true,
                    action: "celebrate"
                },
                {
                    text: "Tm9uIENoYWxhbnQgUGVlcHM=",
                    correct: false,
                    errorMsg: "Tm8gd2F5ISDwn5Cu"
                }
            ]
        }
    }
};

// Current Step State
let currentStepId = 'password';

// Helper to decode Base64 strings
function decode(str) {
    try {
        return decodeURIComponent(escape(atob(str))); // Handle UTF-8 characters (emojis)
    } catch (e) {
        console.error("Decoding error", e);
        return str;
    }
}

// Helper to check answers
function checkAnswer(input, correct) {
    const normalize = str => str.trim().toLowerCase();

    // If correct is an array, check if any match matches the input
    if (Array.isArray(correct)) {
        return correct.some(c => normalize(input) === normalize(decode(c)));
    }
    return normalize(input) === normalize(decode(correct));
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

    // Decode strings for display
    const title = decode(stepData.title);
    const text = decode(stepData.text);

    let html = `
        <div class="game-step active" id="dynamic-step-${stepId}">
            <h2 class="moo-title">${title}</h2>
            <p class="moo-text">${text}</p>
    `;

    if (stepData.type === 'input') {
        const placeholder = decode(stepData.placeholder);
        html += `
            <div class="moo-input-group">
                <input type="text" id="moo-input-${stepId}" class="moo-input" placeholder="${placeholder}">
                <button class="btn btn--moo" id="moo-submit-${stepId}">Submit</button>
            </div>
        `;
    } else if (stepData.type === 'choice') {
        html += `<div class="moo-options">`;
        stepData.options.forEach((opt, idx) => {
            const btnText = decode(opt.text);
            html += `<button class="btn btn--moo${idx % 2 !== 0 ? '-outline' : ''}" data-opt-idx="${idx}">${btnText}</button>`;
        });
        html += `</div>`;
    } else if (stepData.type === 'intro') {
        const btnText = decode(stepData.buttonText);
        html += `
            <button class="btn btn--moo" id="moo-action-${stepId}">${btnText}</button>
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
                window.showMooModal(decode(stepData.errorMsg));
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
                    window.showMooModal(decode(opt.errorMsg));
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


