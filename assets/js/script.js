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
var _songEndModalEl = null;
var _songEndDescEl  = null;

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

function _showSongEndModal() {
    if (!_songEndModalEl) return;
    if (_songEndDescEl && _recommendation) {
        _songEndDescEl.textContent =
            '"' + _recommendation.song.title + '" by ' + _recommendation.song.artist +
            ' has finished. What would you like to do next?';
    }
    _songEndModalEl.classList.remove('hidden');
}

function _createYouTubePlayer(videoId, startSeconds) {
    if (!window.YT || !YT.Player || _ytPlayer) return;   // guard: never create twice
    // Persist the video identity so sub-pages can resume playback
    try {
        sessionStorage.setItem('musicVideoId', videoId);
        if (_recommendation) {
            sessionStorage.setItem('musicTitle',  _recommendation.song.title);
            sessionStorage.setItem('musicArtist', _recommendation.song.artist);
        }
    } catch (e) { /* ignore */ }
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
            start:           startSeconds || 0
        },
        events: {
            onReady: function (e) {
                e.target.setVolume(40);
                e.target.playVideo();
                _setMusicPlaying(true);
            },
            onStateChange: function (e) {
                if (e.data === YT.PlayerState.ENDED) {
                    _setMusicPlaying(false);
                    _showSongEndModal();
                }
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
    if (_musicWanted && _recommendation && sessionStorage.getItem('musicPaused') !== '1') {
        var savedId  = sessionStorage.getItem('musicVideoId');
        var startPos = parseInt(sessionStorage.getItem('musicPosition') || '0', 10);
        _createYouTubePlayer(savedId || _recommendation.song.id, startPos);
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
    _musicToggleEl  = document.getElementById('music-toggle');
    _musicIconEl    = document.getElementById('music-toggle-icon');
    _musicBadgeEl   = document.getElementById('music-info-badge');
    _songEndModalEl = document.getElementById('music-end-modal');
    _songEndDescEl  = document.getElementById('music-end-modal-desc');

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
            // Don't mark UI as "playing" yet — let YouTube onReady do that once the
            // player actually starts.  Just make the toggle button visible.
            _musicWanted = true;
            if (_musicToggleEl) { _musicToggleEl.removeAttribute('hidden'); }
            // Only auto-start if the user hadn't temporarily paused before navigating
            if (sessionStorage.getItem('musicPaused') !== '1' && _ytApiReady && _recommendation) {
                // Prefer saved videoId (may differ from today's recommendation if
                // the user had already clicked "Next Song" on a sub-page).
                var savedId  = sessionStorage.getItem('musicVideoId');
                var startPos = parseInt(sessionStorage.getItem('musicPosition') || '0', 10);
                _createYouTubePlayer(savedId || _recommendation.song.id, startPos);
            }
        } else {
            _setMusicPlaying(false);
        }

        if (musicYesBtn) {
            musicYesBtn.addEventListener('click', function () {
                sessionStorage.setItem('musicPromptAnswered', '1');
                sessionStorage.setItem('musicChoice', 'yes');
                sessionStorage.removeItem('musicPaused');
                musicModal.classList.add('hidden');
                _musicWanted = true;
                // Just show the toggle button — onReady will call _setMusicPlaying(true)
                // once the YouTube player is actually playing.
                if (_musicToggleEl) { _musicToggleEl.removeAttribute('hidden'); }
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
                    // Use a dedicated pause flag so 'musicChoice' stays 'yes';
                    // this lets other pages know the user wants music but is paused.
                    sessionStorage.setItem('musicPaused', '1');
                    _setMusicPlaying(false);
                } else if (_ytPlayer && typeof _ytPlayer.playVideo === 'function') {
                    _ytPlayer.playVideo();
                    sessionStorage.removeItem('musicPaused');
                    sessionStorage.setItem('musicChoice', 'yes');
                    _setMusicPlaying(true);
                } else {
                    // Player not yet created — start it now
                    _musicWanted = true;
                    sessionStorage.setItem('musicChoice', 'yes');
                    sessionStorage.removeItem('musicPaused');
                    if (_ytApiReady && _recommendation) {
                        var savedId  = sessionStorage.getItem('musicVideoId');
                        var startPos = parseInt(sessionStorage.getItem('musicPosition') || '0', 10);
                        _createYouTubePlayer(savedId || _recommendation.song.id, startPos);
                    }
                }
            });
        }
    }

    // ── Song-end prompt (Replay / Next Song) ─────────────────────
    var musicReplayBtn  = document.getElementById('music-replay-btn');
    var musicNextBtn    = document.getElementById('music-next-btn');

    if (musicReplayBtn) {
        musicReplayBtn.addEventListener('click', function () {
            if (_songEndModalEl) { _songEndModalEl.classList.add('hidden'); }
            if (_ytPlayer) {
                _ytPlayer.seekTo(0);
                _ytPlayer.playVideo();
                _setMusicPlaying(true);
            }
        });
    }

    if (musicNextBtn) {
        musicNextBtn.addEventListener('click', function () {
            if (_songEndModalEl) { _songEndModalEl.classList.add('hidden'); }
            if (typeof MusicRecommender !== 'undefined' && _ytPlayer) {
                var nextSong = MusicRecommender.recommendNext(
                    _recommendation ? _recommendation.song.id : null
                );
                if (nextSong) {
                    _recommendation = {
                        song:      nextSong,
                        season:    _recommendation ? _recommendation.season    : '',
                        timeOfDay: _recommendation ? _recommendation.timeOfDay : '',
                        label:     _recommendation ? _recommendation.label     : ''
                    };
                    // Keep sessionStorage in sync so sub-pages know the current song
                    try {
                        sessionStorage.setItem('musicVideoId', nextSong.id);
                        sessionStorage.setItem('musicTitle',   nextSong.title);
                        sessionStorage.setItem('musicArtist',  nextSong.artist);
                        sessionStorage.setItem('musicPosition', '0');
                    } catch (e) { /* ignore */ }
                    _ytPlayer.loadVideoById(nextSong.id);
                    _setMusicPlaying(true);
                }
            }
        });
    }

    // ── Save playback position before navigating away ─────────────
    window.addEventListener('pagehide', function () {
        if (_ytPlayer && typeof _ytPlayer.getCurrentTime === 'function') {
            try {
                sessionStorage.setItem('musicPosition', Math.floor(_ytPlayer.getCurrentTime()));
            } catch (e) { /* ignore */ }
        }
    });
});

