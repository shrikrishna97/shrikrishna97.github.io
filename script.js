document.addEventListener('DOMContentLoaded', function () {
    // ── Persist dark/light mode preference ───────────────────────
    var modeToggleCheckbox = document.getElementById('flexSwitchCheckDefault');
    if (modeToggleCheckbox) {
        var savedMode = localStorage.getItem('colorMode');
        if (savedMode === 'light') {
            document.body.classList.add('light-mode');
            modeToggleCheckbox.checked = true;
        }
        modeToggleCheckbox.addEventListener('change', function () {
            document.body.classList.toggle('light-mode', this.checked);
            localStorage.setItem('colorMode', this.checked ? 'light' : 'dark');
        });
    }

    // ── Bootstrap Carousel ────────────────────────────────────────
    var carouselEl = document.getElementById('projectCarousel');
    if (carouselEl) {
        new bootstrap.Carousel(carouselEl, {
            interval: 5000,
            pause: 'hover'
        });
    }

    // ── Section scroll indicator ──────────────────────────────────
    var sectionIds = ['about', 'experience', 'projects', 'achievement', 'skills-section', 'resume', 'youtube', 'blogs', 'activities', 'contact'];
    var dots = document.querySelectorAll('#section-indicator .sec-dot');

    function getActiveSection() {
        var scrollY = window.scrollY + window.innerHeight / 3;
        var active = sectionIds[0];
        sectionIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.offsetTop <= scrollY) {
                active = id;
            }
        });
        return active;
    }

    function updateDots() {
        var active = getActiveSection();
        dots.forEach(function (dot) {
            if (dot.dataset.section === active) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // ── Active navbar link on scroll ─────────────────────────────
    var navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');

    var sectionTitles = {
        'about':         'Shri Krishna🦚',
        'experience':    'Experience | Shri Krishna🦚',
        'projects':      'Projects | Shri Krishna🦚',
        'achievement':   'Achievements | Shri Krishna🦚',
        'skills-section':'Skills | Shri Krishna🦚',
        'resume':        'Resume | Shri Krishna🦚',
        'youtube':       'Teaching | Shri Krishna🦚',
        'blogs':         'Blogs | Shri Krishna🦚',
        'activities':    'Podcasts | Shri Krishna🦚',
        'contact':       'Contact | Shri Krishna🦚'
    };

    function updateNavLinks() {
        var active = getActiveSection();
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href').replace('#', '');
            if (href === active) {
                link.classList.add('nav-active');
            } else {
                link.classList.remove('nav-active');
            }
        });
        if (sectionTitles[active]) {
            document.title = sectionTitles[active];
        }
    }

    // ── Back-to-top button ────────────────────────────────────────
    var backToTop = document.getElementById('back-to-top');

    function handleScroll() {
        updateDots();
        updateNavLinks();
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ── Typing tagline ────────────────────────────────────────────
    var taglineEl = document.getElementById('typing-tagline');
    if (taglineEl) {
        var phrases = [
            'IITM Alumnus 🎓',
            'Course Instructor 👨‍🏫',
            'Full-Stack Developer 💻',
            'Python Programmer 🐍',
            'Community Builder 🌐'
        ];
        var phraseIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typingSpeed = 80;

        function type() {
            var current = phrases[phraseIndex];
            var cursor = '<span class="typing-cursor"></span>';
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            taglineEl.innerHTML = current.substring(0, charIndex) + cursor;

            var delay = isDeleting ? typingSpeed / 2 : typingSpeed;

            if (!isDeleting && charIndex === current.length) {
                delay = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(type, delay);
        }
        setTimeout(type, 600);
    }

    // ── Scroll-reveal animations (IntersectionObserver) ──────────
    if ('IntersectionObserver' in window) {
        var revealElements = document.querySelectorAll(
            '.card, .project-card, .blog-card, .podcast-card, .contact-card'
        );
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(function (el) {
            el.classList.add('reveal-hidden');
            revealObserver.observe(el);
        });
    }

    // ── Background music with consent modal ──────────────────────
    var bgMusic      = document.getElementById('bg-music');
    var musicModal   = document.getElementById('music-modal');
    var musicYesBtn  = document.getElementById('music-yes-btn');
    var musicNoBtn   = document.getElementById('music-no-btn');
    var musicToggle  = document.getElementById('music-toggle');
    var musicIcon    = document.getElementById('music-toggle-icon');

    function setMusicPlaying(playing) {
        if (!musicToggle) return;
        musicToggle.removeAttribute('hidden');
        if (playing) {
            musicIcon.textContent = '⏸';
            musicToggle.classList.add('playing');
            musicToggle.setAttribute('aria-label', 'Pause music');
            musicToggle.setAttribute('title', 'Pause music');
        } else {
            musicIcon.textContent = '♪';
            musicToggle.classList.remove('playing');
            musicToggle.setAttribute('aria-label', 'Play music');
            musicToggle.setAttribute('title', 'Play music');
        }
    }

    if (bgMusic && musicModal) {
        var answered = sessionStorage.getItem('musicPromptAnswered');
        // Delay lets the page finish rendering before the modal appears
        var MODAL_DELAY_MS = 900;
        if (!answered) {
            setTimeout(function () {
                musicModal.classList.remove('hidden');
            }, MODAL_DELAY_MS);
        } else {
            // Restore previous choice for this session
            if (sessionStorage.getItem('musicChoice') === 'yes') {
                bgMusic.play().catch(function () { setMusicPlaying(false); });
                setMusicPlaying(true);
            } else {
                setMusicPlaying(false);
            }
        }

        if (musicYesBtn) {
            musicYesBtn.addEventListener('click', function () {
                sessionStorage.setItem('musicPromptAnswered', '1');
                sessionStorage.setItem('musicChoice', 'yes');
                musicModal.classList.add('hidden');
                bgMusic.play().catch(function () { setMusicPlaying(false); });
                setMusicPlaying(true);
            });
        }

        if (musicNoBtn) {
            musicNoBtn.addEventListener('click', function () {
                sessionStorage.setItem('musicPromptAnswered', '1');
                sessionStorage.setItem('musicChoice', 'no');
                musicModal.classList.add('hidden');
                setMusicPlaying(false);
            });
        }

        if (musicToggle) {
            musicToggle.addEventListener('click', function () {
                if (bgMusic.paused) {
                    bgMusic.play().catch(function () { setMusicPlaying(false); });
                    sessionStorage.setItem('musicChoice', 'yes');
                    setMusicPlaying(true);
                } else {
                    bgMusic.pause();
                    sessionStorage.setItem('musicChoice', 'no');
                    setMusicPlaying(false);
                }
            });
        }
    }
});

