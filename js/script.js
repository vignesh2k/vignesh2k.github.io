document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const themeToggle = document.getElementById('theme-toggle');
    const contactForm = document.getElementById('contact-form');
    const terminalContact = document.getElementById('terminal-contact');
    const terminalContactOutput = document.getElementById('terminal-contact-output');
    const terminalContactInput = document.getElementById('terminal-contact-input');
    const blogPostLinks = document.querySelectorAll('.blog-post-link');
    const blogTitle = document.getElementById('blog-viewer-title');
    const blogMeta = document.getElementById('blog-viewer-meta');
    const blogSummary = document.getElementById('blog-viewer-summary');
    const blogPath = document.getElementById('blog-viewer-path');
    const blogOpen = document.getElementById('blog-viewer-open');
    const blogAddress = document.getElementById('blog-browser-address');
    const experienceWindow = document.getElementById('experience-window');
    const experienceWindowContent = document.getElementById('experience-window-content');
    const experienceWindowClose = document.getElementById('experience-window-close');
    const experienceSection = document.getElementById('experience');

    // State
    let isMenuOpen = false;

    // ==========================================
    // Theme Toggle Functionality
    // ==========================================
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    if (themeToggle) {
        themeToggle.style.display = 'none';
    }

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
    // Terminal Contact Flow
    // ==========================================
    if (terminalContact && terminalContactOutput && terminalContactInput) {
        const prompts = [
            { key: 'name', text: 'Enter your name:' },
            { key: 'email', text: 'Enter your email:' },
            { key: 'message', text: 'Enter your message:' }
        ];

        const terminalData = {};
        let promptIndex = 0;
        let readyToSend = false;
        let sending = false;
        const mooGame = document.getElementById('moo-game');

        const createLine = (text, className = '') => {
            const line = document.createElement('div');
            line.className = `terminal-line ${className}`.trim();
            line.textContent = text;
            terminalContactOutput.appendChild(line);
            terminalContactOutput.scrollTop = terminalContactOutput.scrollHeight;
        };

        const typeLine = (text, className = '') => {
            const line = document.createElement('div');
            line.className = `terminal-line ${className}`.trim();
            terminalContactOutput.appendChild(line);
            terminalContactOutput.scrollTop = terminalContactOutput.scrollHeight;

            return new Promise((resolve) => {
                let i = 0;
                const timer = setInterval(() => {
                    line.textContent += text.charAt(i);
                    i += 1;
                    terminalContactOutput.scrollTop = terminalContactOutput.scrollHeight;
                    if (i >= text.length) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 20);
            });
        };

        const promptNext = async () => {
            if (promptIndex < prompts.length) {
                await typeLine(prompts[promptIndex].text, 'terminal-line--prompt');
            } else {
                readyToSend = true;
                await typeLine('Hit RETURN to send.', 'terminal-line--prompt');
            }
        };

        const sendTerminalMessage = async () => {
            if (sending) return;
            sending = true;
            terminalContactInput.disabled = true;
            await typeLine('Sending message...', 'terminal-line--system');

            setTimeout(async () => {
                await typeLine('Message sent. Thank you.', 'terminal-line--success');
                await typeLine('Session reset. Enter your name:', 'terminal-line--prompt');
                terminalContactInput.disabled = false;
                terminalContactInput.value = '';
                terminalContactInput.focus();
                promptIndex = 0;
                readyToSend = false;
                sending = false;
            }, 650);
        };

        const launchMooFromTerminal = async () => {
            if (!mooGame) {
                await typeLine('Moo game unavailable.', 'terminal-line--error');
                return;
            }

            await typeLine('Launching Moo game...', 'terminal-line--system');
            document.body.classList.add('moo-theme');
            mooGame.classList.remove('hidden');
            if (typeof window.nextStep === 'function') {
                window.nextStep('password');
            }
        };

        createLine('CONTACT TERMINAL v1.0', 'terminal-line--system');
        promptNext();

        terminalContactInput.addEventListener('keydown', async (e) => {
            if (e.key !== 'Enter' || sending) return;
            e.preventDefault();

            const rawValue = terminalContactInput.value;
            const value = rawValue.trim();
            createLine(`> ${rawValue}`, 'terminal-line--input');
            terminalContactInput.value = '';

            if (value.toLowerCase() === 'moo') {
                await launchMooFromTerminal();
                return;
            }

            if (readyToSend) {
                await sendTerminalMessage();
                return;
            }

            if (!value) {
                await typeLine('Please enter a value.', 'terminal-line--error');
                await promptNext();
                return;
            }

            terminalData[prompts[promptIndex].key] = value;
            promptIndex += 1;
            await promptNext();
        });
    }

    // ==========================================
    // Blog Browser Loader
    // ==========================================
    if (blogPostLinks.length && blogTitle && blogMeta && blogSummary && blogPath && blogOpen && blogAddress) {
        const renderBlogPost = (button) => {
            blogPostLinks.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');

            const title = button.dataset.title || 'Untitled';
            const date = button.dataset.date || '';
            const summary = button.dataset.summary || '';
            const source = button.dataset.source || '';
            const slug = button.dataset.slug || '/blog/';

            blogTitle.textContent = title;
            blogMeta.textContent = date;
            blogSummary.textContent = summary;
            blogPath.innerHTML = `Source file: <code>${source}</code>`;
            blogOpen.setAttribute('href', slug);
            blogAddress.textContent = `blog://${slug.replace(/^\/+/, '').replace(/\/+$/, '') || 'blog'}`;
        };

        blogPostLinks.forEach((button) => {
            button.addEventListener('click', () => renderBlogPost(button));
        });
    }

    // ==========================================
    // Scroll Reveal Animation (Intersection Observer)
    // ==========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observerOptions = {
        root: null,
        rootMargin: '-6% 0px -6% 0px',
        threshold: 0.18
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    // Add animated class to sections/cards
    const elementsToReveal = document.querySelectorAll('.section__title, .about__text, .stat, .skill-card, .project-card, .contact__item, .contact__form');

    elementsToReveal.forEach(el => {
        el.classList.add('anim-on-scroll');
        observer.observe(el);
    });

    // Hero depth motion and subtle scroll-based movement (no scroll hijack)
    const heroArea = document.getElementById('hero-motion-area');
    const motionBlob = document.querySelector('.motion-blob');
    const motionAvatar = document.querySelector('.motion-avatar');

    if (!prefersReducedMotion && heroArea && motionBlob && motionAvatar) {
        const heroPointerMove = (e) => {
            const rect = heroArea.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            heroArea.style.setProperty('--pointer-x', px.toFixed(3));
            heroArea.style.setProperty('--pointer-y', py.toFixed(3));
        };

        const resetHeroPointer = () => {
            heroArea.style.setProperty('--pointer-x', '0');
            heroArea.style.setProperty('--pointer-y', '0');
        };

        heroArea.addEventListener('mousemove', heroPointerMove);
        heroArea.addEventListener('mouseleave', resetHeroPointer);
    }

    const updateScrollDepth = () => {
        const y = window.scrollY || 0;
        if (!prefersReducedMotion) {
            const heroShift = Math.min(y / 800, 1);
            document.documentElement.style.setProperty('--scroll-depth', heroShift.toFixed(3));
        }
    };

    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    updateScrollDepth();

    // ==========================================
    // Skill Cards -> Experience Window
    // ==========================================
    const interactiveSkillCards = document.querySelectorAll('.skill-card[data-exp-target]');

    const openExperienceWindow = (targetId) => {
        if (!experienceWindow || !experienceWindowContent) return;

        const sourceCard = document.getElementById(targetId);
        if (!sourceCard) return;

        if (experienceSection) {
            experienceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const clonedCard = sourceCard.cloneNode(true);
        clonedCard.removeAttribute('id');
        clonedCard.classList.remove('anim-on-scroll', 'in-view');
        experienceWindowContent.innerHTML = '';
        experienceWindowContent.appendChild(clonedCard);

        experienceWindow.classList.remove('hidden');
        experienceWindow.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeExperienceWindow = () => {
        if (!experienceWindow || !experienceWindowContent) return;
        experienceWindow.classList.add('hidden');
        experienceWindow.setAttribute('aria-hidden', 'true');
        experienceWindowContent.innerHTML = '';
        document.body.style.overflow = '';
    };

    interactiveSkillCards.forEach((card) => {
        card.classList.add('skill-card--interactive');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const targetId = card.dataset.expTarget;
        card.addEventListener('click', () => openExperienceWindow(targetId));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openExperienceWindow(targetId);
            }
        });
    });

    if (experienceWindowClose) {
        experienceWindowClose.addEventListener('click', closeExperienceWindow);
    }

    if (experienceWindow) {
        experienceWindow.addEventListener('click', (e) => {
            if (e.target === experienceWindow) {
                closeExperienceWindow();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && experienceWindow && !experienceWindow.classList.contains('hidden')) {
            closeExperienceWindow();
        }
    });

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .anim-on-scroll {
            opacity: 0;
            transform: translateY(28px) scale(0.985);
            transition: opacity 700ms cubic-bezier(.2,.65,.2,1), transform 700ms cubic-bezier(.2,.65,.2,1);
            will-change: opacity, transform;
        }
        .anim-on-scroll.in-view {
            opacity: 1;
            transform: translateY(0) scale(1);
        }`;
    if (prefersReducedMotion) {
        styleSheet.innerText += `
        .anim-on-scroll {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
        }`;
    }
    styleSheet.innerText += `
    `;
    document.head.appendChild(styleSheet);
});

/* ============================================
   Moo Game Logic
   ============================================ */

// 1. OBFUSCATED Data
const PUBLIC_OBFUSCATION_KEY = "MooMooKey";
const MOO_GAME_DATA = {
    "steps": {
        "password": {
            "type": "input",
            "title": "1e0a0c3f0a1b6b241a2e0a1c3e4f9fd4f1eb",
            "text": "1a070e394f0638452f24081a6a1c4f2d040f221a1d241b0a6b0b102e04012c020a6b03163f4f16221a4f09202a042b2a1e4f22240a46",
            "placeholder": "08011b281d4f250c1a26010e200a41654b",
            "nextStep": 0,
            "errorMsg": "0c0c0c281c1c6b011c23060a2941416545162303166d22002416592c030322180a2f4459bdf0ffe3"
        },
        "0": {
            "type": "intro",
            "title": "0000006c4f9fd4f5d7",
            "text": "14001a6a190a6b031638010b6d1b072e450a280c1d281b4f280a0e6d030a3b0a036a452b280e0b344f092417592c4f03241b1b2700592e070e21030a25021c72",
            "buttonText": "010a1b6a1c4f0c0a58",
            "nextStep": 1
        },
        "1": {
            "type": "choice",
            "title": "1c1a0a3e1b06240b597c",
            "text": "1a070e394f06384514344f092c1900390c0d284f0c220300395a",
            "options": [
                {
                    "text": "1d1a1d3d030a",
                    "correct": true,
                    "nextStep": 2
                },
                {
                    "text": "1d060126",
                    "correct": false,
                    "errorMsg": "191d166d0e082a0c176c4f9fd2ffc1"
                }
            ]
        },
        "2": {
            "type": "choice",
            "title": "1c1a0a3e1b06240b597f",
            "text": "1a070e394f06384516381d4f291d0a2a0859290a1c3906012a1110220150",
            "options": [
                {
                    "text": "1b061c241b0625025903362c6d494f080d102103",
                    "correct": false,
                    "errorMsg": "1900006d0c072a0a0d240c4e6d9ff0dbcb"
                },
                {
                    "text": "03001d39070a390b59010608251b1c6b0c176d21003f180e32",
                    "correct": true,
                    "nextStep": 3
                }
            ]
        },
        "3": {
            "type": "input",
            "title": "1c1a0a3e1b06240b597e",
            "text": "1a070e394f0638450d250a4f2e0e1f221118214f002b4f1b230059183c2e724f4723001128070a64",
            "placeholder": "08011b281d4f280c0d34414163",
            "correctAnswer": [
                "1865e4f9be9639fc76d7d4da8ee25eaa7421f6837accb67516937e69469ea7e4",
                "211be92b4add74dcb7e6c1080fdc4195804d343d461437469af792694f5dcbeb",
                "abecdf3503635c0be9eca61cddf5b25c7f8380d5aae7d73d0f62e9a38c87b70d",
                "a1ed2667544204982407a78f80038326f874646daaae450d25f736742d7e5bc1"
            ],
            "nextStep": 4,
            "errorMsg": "050a0728070a654b576d1b1d344f0e2c0410234e4fbdf0e8f195e6cad7"
        },
        "4": {
            "type": "choice",
            "title": "1c1a0a3e1b06240b5979",
            "text": "1a07006d061c6b111821030a3f504fbbfaeac2",
            "options": [
                {
                    "text": "1b060838",
                    "correct": true,
                    "nextStep": 5
                },
                {
                    "text": "000000",
                    "correct": false,
                    "errorMsg": "044f18241c076a4589d2ffc1"
                }
            ]
        },
        "5": {
            "type": "choice",
            "title": "1c1a0a3e1b06240b5978",
            "text": "1a070e394f0e3900593a0a50",
            "options": [
                {
                    "text": "021b1b281d1c6b03163f4f0324090a",
                    "correct": true,
                    "action": "celebrate"
                },
                {
                    "text": "0300016d2c072a0918231b4f1d0a0a3b16",
                    "correct": false,
                    "errorMsg": "03004f3a0e166a4589d2ffc1"
                }
            ]
        }
    }
};

// Current Step State
let currentStepId = 'password';

// ==========================================
// Crypto Helpers
// ==========================================

// Helper to decode XOR strings (UTF-8 aware)
function decodeXor(hexStr, key) {
    const bytes = [];
    for (let i = 0; i < hexStr.length; i += 2) {
        bytes.push(parseInt(hexStr.substr(i, 2), 16));
    }
    const keyBytes = new TextEncoder().encode(key);
    const decryptedBytes = bytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
    return new TextDecoder().decode(new Uint8Array(decryptedBytes));
}

// Helper to hash answer (SHA-256)
async function hashAnswer(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper to check answers
async function checkAnswer(input, correct) {
    // 1. Check Password Special Case
    if (currentStepId === 'password') {
        const validHash = "7e08385fd26b116c84fdee726df8c7410dfd2de9f74867d599a9aace8513380c"; // sha256("moojeeb")
        const inputHash = await hashAnswer(input);

        if (inputHash === validHash) {
            return true;
        }
        return false;
    }

    // Normal game flow validation
    const inputHash = await hashAnswer(input);
    if (Array.isArray(correct)) {
        return correct.includes(inputHash);
    }
    return inputHash === correct;
}

// Function to render a step
function renderStep(stepId) {
    const container = document.getElementById('moo-game-content');
    if (!container) return;

    // Handle special 'success' step which is static in HTML
    if (stepId === 'success') {
        container.innerHTML = ''; // Clear dynamic content
        const successEl = document.getElementById('game-step-success');
        if (successEl) {
            successEl.classList.remove('hidden');
            successEl.style.display = 'block';

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

    // Helper to get text content
    const getText = (str) => {
        if (!str) return '';
        // Always decode XOR for text fields in this version
        return decodeXor(str, PUBLIC_OBFUSCATION_KEY);
    };// State for the game

    const title = getText(stepData.title);
    const text = getText(stepData.text);

    let html = `
    <div class="game-step active" id="dynamic-step-${stepId}">
        <h2 class="moo-title">${title}</h2>
        <p class="moo-text">${text}</p>
`;

    if (stepData.type === 'input') {
        const placeholder = getText(stepData.placeholder);
        html += `
        <div class="moo-input-group">
            <input type="text" id="moo-input-${stepId}" class="moo-input" placeholder="${placeholder}">
            <button class="btn btn--moo" id="moo-submit-${stepId}">Submit</button>
        </div>
    `;
    } else if (stepData.type === 'choice') {
        html += `<div class="moo-options">`;
        stepData.options.forEach((opt, idx) => {
            const btnText = getText(opt.text);
            html += `<button class="btn btn--moo${idx % 2 !== 0 ? '-outline' : ''}" data-opt-idx="${idx}">${btnText}</button>`;
        });
        html += `</div>`;
    } else if (stepData.type === 'intro') {
        const btnText = getText(stepData.buttonText);
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

        const handleSubmit = async () => {
            // Check password or answer
            if (stepId === 'password') {
                // We simplified this to just check hash in checkAnswer
                const isCorrect = await checkAnswer(input.value);
                if (isCorrect) {
                    window.nextStep(stepData.nextStep);
                } else {
                    window.showMooModal(getText(stepData.errorMsg));
                    input.value = '';
                }
            } else {
                const isCorrect = await checkAnswer(input.value, stepData.correctAnswer);
                if (isCorrect) {
                    window.nextStep(stepData.nextStep);
                } else {
                    window.showMooModal(getText(stepData.errorMsg));
                    input.value = '';
                }
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
                    window.showMooModal(getText(opt.errorMsg));
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
    }

    if (mooClose && mooGame) {
        mooClose.addEventListener('click', () => {
            mooGame.classList.add('hidden');
            document.body.classList.remove('moo-theme');
            stopConfetti();
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
