/**
 * UI/UX Portfolio - Main JavaScript
 * Handles theme toggle, mobile menu, scroll animations, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initIntroAnimation();
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initScrollAnimations();
    initCustomCursor();
});

/**
 * Intro Animation
 * Clean startup screen with logo and progress bar
 */
function initIntroAnimation() {
    const intro = document.querySelector('.intro-overlay');
    if (!intro) return;

    // Check if user has already seen the intro this session
    if (sessionStorage.getItem('introSeen')) {
        intro.classList.add('hidden');
        document.body.classList.remove('intro-active');
        initNameScramble();
        return;
    }

    // Mark intro as active
    document.body.classList.add('intro-active');

    // Wait for progress bar to complete, then fade out
    setTimeout(() => {
        intro.classList.add('fade-out');
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-complete');

        setTimeout(() => {
            initNameScramble();
        }, 200);

        setTimeout(() => {
            intro.classList.add('hidden');
            document.body.classList.remove('intro-complete');
            sessionStorage.setItem('introSeen', 'true');
        }, 400);
    }, 1300);
}

/**
 * Custom Cursor
 * Creates a custom cursor that follows the mouse and reacts to interactive elements
 */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    // Hide default cursor
    document.body.style.cursor = 'none';

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Move main cursor immediately
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Animate follower with lag
    const animateFollower = () => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Interactive elements
    const hoverables = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .project-card, .skill-tag, .tool-item, .social-btn, .nav-link, .nav-logo');

    hoverables.forEach(el => {
        el.style.cursor = 'none';

        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            follower.classList.add('hovering');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            follower.classList.remove('hovering');
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        follower.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        follower.classList.remove('clicking');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });

    // Scroll effect
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        cursor.classList.add('scrolling');
        follower.classList.add('scrolling');

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            cursor.classList.remove('scrolling');
            follower.classList.remove('scrolling');
        }, 150);
    }, { passive: true });
}

/**
 * Name Scramble Effect
 * Periodically scrambles the nav logo text with a cool decode effect
 */
function initNameScramble() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;

    const originalText = logo.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

    const scramble = () => {
        let iterations = 0;
        const maxIterations = originalText.length;

        const interval = setInterval(() => {
            logo.textContent = originalText
                .split('')
                .map((char, index) => {
                    // Keep spaces as spaces
                    if (char === ' ') return ' ';

                    // If we've passed this index, show the real character
                    if (index < iterations) {
                        return originalText[index];
                    }

                    // Otherwise show a random character
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            iterations += 1/3; // Slow reveal

            if (iterations >= maxIterations) {
                logo.textContent = originalText;
                clearInterval(interval);
            }
        }, 30);
    };

    // Run once on load after a short delay
    setTimeout(scramble, 1000);

    // Then run periodically (every 12 seconds)
    setInterval(scramble, 12000);
}


/**
 * Theme Toggle
 * Switches between dark and light mode, saves preference to localStorage
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (!systemPrefersDark) {
        html.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Mobile Menu
 * Toggles the mobile navigation menu
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (!navToggle || !mobileMenu) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth Scroll
 * Handles smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = 100;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Scroll Animations
 * Triggers animations when elements enter viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        // Only observe elements below the fold
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            el.classList.add('scroll-animate');
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
            observer.observe(el);
        }
    });
}
