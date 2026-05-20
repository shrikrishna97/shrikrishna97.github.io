// ── Global YouTube player state ───────────────────────────────────────────
// These must live outside DOMContentLoaded so that onYouTubeIframeAPIReady
// (a global callback fired by the YouTube IFrame API) can access them.
var _ytPlayer       = null;
var _ytApiReady     = false;
var _musicWanted    = false;
var _recommendation = null;
var _musicToggleEl  = null;
var _musicIconEl    = null;
var _musicBadgeEl   = null;

function _setMusicPlaying(playing) {
    if (!_musicToggleEl) return;
    _musicToggleEl.removeAttribute('hidden');
    if (playing) {
        _musicIconEl.textContent = '⏸';
        _musicToggleEl.classList.add('playing');
        _musicToggleEl.setAttribute('aria-label', 'Pause music');
        _musicToggleEl.setAttribute('title', 'Pause music');
        if (_musicBadgeEl && _recommendation) {
            _musicBadgeEl.textContent = '🎵 ' + _recommendation.song.title + ' · ' + _recommendation.song.artist;
            _musicBadgeEl.removeAttribute('hidden');
        }
    } else {
        _musicIconEl.textContent = '♪';
        _musicToggleEl.classList.remove('playing');
        _musicToggleEl.setAttribute('aria-label', 'Play music');
        _musicToggleEl.setAttribute('title', 'Play music');
        if (_musicBadgeEl) {
            _musicBadgeEl.setAttribute('hidden', '');
        }
    }
}

function _createYouTubePlayer(videoId) {
    if (!window.YT || !YT.Player) return;
    _ytPlayer = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: videoId,
        playerVars: {
            autoplay:        1,
            controls:        0,
            disablekb:       1,
            fs:              0,
            modestbranding:  1,
            playsinline:     1,
            rel:             0,
            loop:            1,
            playlist:        videoId   // required for loop to work
        },
        events: {
            onReady: function (e) {
                e.target.setVolume(40);
                e.target.playVideo();
                _setMusicPlaying(true);
            },
            onError: function () {
                _setMusicPlaying(false);
            }
        }
    });
}

/** Called automatically by the YouTube IFrame API once it finishes loading. */
window.onYouTubeIframeAPIReady = function () {
    _ytApiReady = true;
    if (_musicWanted && _recommendation) {
        _createYouTubePlayer(_recommendation.song.id);
    }
};

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

    // ── Background music with YouTube IFrame API ─────────────────
    _musicToggleEl = document.getElementById('music-toggle');
    _musicIconEl   = document.getElementById('music-toggle-icon');
    _musicBadgeEl  = document.getElementById('music-info-badge');

    var musicModal  = document.getElementById('music-modal');
    var musicYesBtn = document.getElementById('music-yes-btn');
    var musicNoBtn  = document.getElementById('music-no-btn');
    var modalDesc   = document.getElementById('music-modal-desc');

    // Get recommendation and update modal description
    if (typeof MusicRecommender !== 'undefined') {
        _recommendation = MusicRecommender.recommend();
        if (modalDesc && _recommendation) {
            modalDesc.textContent =
                'I\'ve picked some ' + _recommendation.label +
                ' for you. Want to listen while you browse?';
        }
    }

    if (musicModal) {
        var answered = sessionStorage.getItem('musicPromptAnswered');
        var MODAL_DELAY_MS = 900;
        if (!answered) {
            setTimeout(function () {
                musicModal.classList.remove('hidden');
            }, MODAL_DELAY_MS);
        } else if (sessionStorage.getItem('musicChoice') === 'yes') {
            _musicWanted = true;
            _setMusicPlaying(true);
            if (_ytApiReady && _recommendation) {
                _createYouTubePlayer(_recommendation.song.id);
            }
        } else {
            _setMusicPlaying(false);
        }

        if (musicYesBtn) {
            musicYesBtn.addEventListener('click', function () {
                sessionStorage.setItem('musicPromptAnswered', '1');
                sessionStorage.setItem('musicChoice', 'yes');
                musicModal.classList.add('hidden');
                _musicWanted = true;
                _setMusicPlaying(true);
                if (_ytApiReady && _recommendation) {
                    _createYouTubePlayer(_recommendation.song.id);
                }
            });
        }

        if (musicNoBtn) {
            musicNoBtn.addEventListener('click', function () {
                sessionStorage.setItem('musicPromptAnswered', '1');
                sessionStorage.setItem('musicChoice', 'no');
                musicModal.classList.add('hidden');
                _setMusicPlaying(false);
            });
        }

        if (_musicToggleEl) {
            _musicToggleEl.addEventListener('click', function () {
                if (_ytPlayer && typeof _ytPlayer.getPlayerState === 'function' &&
                    _ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                    _ytPlayer.pauseVideo();
                    sessionStorage.setItem('musicChoice', 'no');
                    _setMusicPlaying(false);
                } else if (_ytPlayer && typeof _ytPlayer.playVideo === 'function') {
                    _ytPlayer.playVideo();
                    sessionStorage.setItem('musicChoice', 'yes');
                    _setMusicPlaying(true);
                } else {
                    // Player not yet created — start it now
                    _musicWanted = true;
                    sessionStorage.setItem('musicChoice', 'yes');
                    if (_ytApiReady && _recommendation) {
                        _createYouTubePlayer(_recommendation.song.id);
                    }
                }
            });
        }
    }
});

