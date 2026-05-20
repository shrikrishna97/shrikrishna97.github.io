/**
 * music-page.js
 *
 * Drop-in music-player widget for sub-pages (achieve.html, educ.html, etc.).
 * Reads/writes the same sessionStorage keys as script.js on index.html so that
 * playback resumes seamlessly when the visitor navigates between pages.
 *
 * Required load order (add to each sub-page before </body>):
 *   <script src="https://www.youtube.com/iframe_api"></script>
 *   <script src="...assets/js/music-recommender.js"></script>
 *   <script src="...assets/js/music-page.js"></script>
 */
(function () {
    'use strict';

    /* ── State ─────────────────────────────────────────────────── */
    var _ytPlayer       = null;
    var _ytApiReady     = false;
    var _recommendation = null;
    var _musicToggleEl  = null;
    var _musicIconEl    = null;
    var _musicBadgeEl   = null;
    var _songEndModalEl = null;
    var _songEndDescEl  = null;

    /* ── UI helpers ─────────────────────────────────────────────── */
    function setMusicPlaying(playing) {
        if (!_musicToggleEl) return;
        _musicToggleEl.removeAttribute('hidden');
        if (playing) {
            _musicIconEl.textContent = '⏸';
            _musicToggleEl.classList.add('playing');
            _musicToggleEl.setAttribute('aria-label', 'Pause music');
            _musicToggleEl.setAttribute('title', 'Pause music');
            if (_musicBadgeEl && _recommendation) {
                _musicBadgeEl.textContent =
                    '🎵 ' + _recommendation.song.title + ' · ' + _recommendation.song.artist;
                _musicBadgeEl.removeAttribute('hidden');
            }
        } else {
            _musicIconEl.textContent = '♪';
            _musicToggleEl.classList.remove('playing');
            _musicToggleEl.setAttribute('aria-label', 'Play music');
            _musicToggleEl.setAttribute('title', 'Play music');
            if (_musicBadgeEl) { _musicBadgeEl.setAttribute('hidden', ''); }
        }
    }

    function showSongEndModal() {
        if (!_songEndModalEl) return;
        if (_songEndDescEl && _recommendation) {
            _songEndDescEl.textContent =
                '"' + _recommendation.song.title + '" by ' + _recommendation.song.artist +
                ' has finished. What would you like to do next?';
        }
        _songEndModalEl.classList.remove('hidden');
    }

    /* ── Save playback position before leaving the page ────────── */
    function saveState() {
        if (_ytPlayer && typeof _ytPlayer.getCurrentTime === 'function') {
            try {
                sessionStorage.setItem('musicPosition', Math.floor(_ytPlayer.getCurrentTime()));
            } catch (e) { /* ignore */ }
        }
    }

    /* ── Create YouTube player ──────────────────────────────────── */
    function createPlayer(videoId, startSeconds) {
        if (!window.YT || !YT.Player || _ytPlayer) return;
        _ytPlayer = new YT.Player('yt-player', {
            height: '1',
            width:  '1',
            videoId: videoId,
            playerVars: {
                autoplay:       1,
                controls:       0,
                disablekb:      1,
                fs:             0,
                modestbranding: 1,
                playsinline:    1,
                rel:            0,
                start:          startSeconds || 0
            },
            events: {
                onReady: function (e) {
                    e.target.setVolume(40);
                    e.target.playVideo();
                    setMusicPlaying(true);
                },
                onStateChange: function (e) {
                    if (e.data === YT.PlayerState.ENDED) {
                        setMusicPlaying(false);
                        showSongEndModal();
                    }
                },
                onError: function () {
                    setMusicPlaying(false);
                }
            }
        });
    }

    /* ── YouTube IFrame API global callback ─────────────────────── */
    window.onYouTubeIframeAPIReady = function () {
        _ytApiReady = true;
        var choice  = sessionStorage.getItem('musicChoice');
        var videoId = sessionStorage.getItem('musicVideoId');
        if (choice === 'yes' && videoId && sessionStorage.getItem('musicPaused') !== '1') {
            var pos = parseInt(sessionStorage.getItem('musicPosition') || '0', 10);
            createPlayer(videoId, pos);
        }
    };

    /* ── Inject styles ──────────────────────────────────────────── */
    function injectStyles() {
        var css = [
            '.music-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:mpFadeIn .35s ease}',
            '.music-modal-overlay.hidden{display:none}',
            '.music-modal-card{background:#1a2f4a;border:1px solid rgba(0,180,216,.25);border-radius:16px;padding:2rem 2.5rem;text-align:center;max-width:360px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:mpSlideUp .35s ease}',
            '.music-modal-icon{font-size:2.5rem;margin-bottom:.75rem;display:inline-block;animation:mpBounce 1.6s ease-in-out infinite}',
            '.music-modal-title{color:#e0e0e0;font-weight:700;font-size:1.25rem;margin-bottom:.5rem}',
            '.music-modal-text{color:#90a4ae;font-size:.95rem;margin-bottom:1.5rem}',
            '.music-modal-actions{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}',
            '.btn-music-yes{background:#00b4d8;color:#fff;border:none;border-radius:8px;padding:.55rem 1.4rem;font-weight:600;font-size:.95rem;cursor:pointer;transition:background .2s}',
            '.btn-music-yes:hover{background:#2563eb}',
            '.btn-music-no{background:transparent;color:#90a4ae;border:1px solid rgba(0,180,216,.3);border-radius:8px;padding:.55rem 1.4rem;font-weight:500;font-size:.95rem;cursor:pointer;transition:border-color .2s,color .2s}',
            '.btn-music-no:hover{border-color:#00b4d8;color:#00b4d8}',
            '.music-info-badge{position:fixed;bottom:82px;right:8px;z-index:1000;max-width:220px;background:#1a2f4a;border:1px solid rgba(0,180,216,.25);border-radius:20px;padding:5px 12px;font-size:.72rem;color:#00b4d8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 10px rgba(0,0,0,.3);pointer-events:none}',
            '#music-toggle{position:fixed;bottom:28px;right:24px;z-index:1000;width:44px;height:44px;border-radius:50%;background:#1a2f4a;border:1px solid rgba(0,180,216,.25);color:#00b4d8;font-size:1.25rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.3);transition:background .2s,transform .2s}',
            '#music-toggle:hover{background:rgba(0,180,216,.18);transform:scale(1.1)}',
            '#music-toggle.playing{animation:mpPulse 1.8s ease-in-out infinite}',
            '@keyframes mpFadeIn{from{opacity:0}to{opacity:1}}',
            '@keyframes mpSlideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}',
            '@keyframes mpBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
            '@keyframes mpPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}'
        ].join('\n');
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ── Inject HTML ────────────────────────────────────────────── */
    function injectHTML() {
        // Floating toggle button
        var toggle = document.createElement('button');
        toggle.id = 'music-toggle';
        toggle.setAttribute('aria-label', 'Play music');
        toggle.setAttribute('title', 'Play music');
        toggle.setAttribute('hidden', '');
        toggle.innerHTML = '<span id="music-toggle-icon">♪</span>';
        document.body.appendChild(toggle);

        // Now-playing badge
        var badge = document.createElement('div');
        badge.id = 'music-info-badge';
        badge.className = 'music-info-badge';
        badge.setAttribute('hidden', '');
        document.body.appendChild(badge);

        // Visually-hidden YouTube player container
        var wrap = document.createElement('div');
        wrap.id = 'yt-player-wrap';
        wrap.style.cssText = 'position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;';
        wrap.setAttribute('aria-hidden', 'true');
        wrap.innerHTML = '<div id="yt-player"></div>';
        document.body.appendChild(wrap);

        // Song-end modal
        var endModal = document.createElement('div');
        endModal.id = 'music-end-modal';
        endModal.className = 'music-modal-overlay hidden';
        endModal.setAttribute('role', 'dialog');
        endModal.setAttribute('aria-modal', 'true');
        endModal.innerHTML =
            '<div class="music-modal-card">' +
                '<div class="music-modal-icon">🎶</div>' +
                '<h3 class="music-modal-title">Song finished!</h3>' +
                '<p id="music-end-modal-desc" class="music-modal-text">What would you like to do next?</p>' +
                '<div class="music-modal-actions">' +
                    '<button id="music-replay-btn" class="btn-music-yes">↩ Replay</button>' +
                    '<button id="music-next-btn" class="btn-music-no">🎲 Next Song</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(endModal);
    }

    /* ── Boot on DOM ready ──────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        injectStyles();
        injectHTML();

        _musicToggleEl  = document.getElementById('music-toggle');
        _musicIconEl    = document.getElementById('music-toggle-icon');
        _musicBadgeEl   = document.getElementById('music-info-badge');
        _songEndModalEl = document.getElementById('music-end-modal');
        _songEndDescEl  = document.getElementById('music-end-modal-desc');

        // Restore recommendation from sessionStorage
        var savedVideoId = sessionStorage.getItem('musicVideoId');
        var savedTitle   = sessionStorage.getItem('musicTitle');
        var savedArtist  = sessionStorage.getItem('musicArtist');
        if (savedVideoId) {
            _recommendation = {
                song: { id: savedVideoId, title: savedTitle || '', artist: savedArtist || '' }
            };
        }

        var choice = sessionStorage.getItem('musicChoice');
        if (choice === 'yes' && savedVideoId) {
            _musicToggleEl.removeAttribute('hidden');
            if (sessionStorage.getItem('musicPaused') !== '1') {
                if (_ytApiReady) {
                    var pos = parseInt(sessionStorage.getItem('musicPosition') || '0', 10);
                    createPlayer(savedVideoId, pos);
                }
                // If _ytApiReady is false the onYouTubeIframeAPIReady callback (above) will
                // call createPlayer once the API has finished loading.
            }
        }

        /* ── Toggle play / pause ─────────────────────────────── */
        _musicToggleEl.addEventListener('click', function () {
            if (_ytPlayer && typeof _ytPlayer.getPlayerState === 'function' &&
                _ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                _ytPlayer.pauseVideo();
                // Use a dedicated pause flag so 'musicChoice' stays 'yes';
                // this lets other pages know the user wants music but is paused.
                sessionStorage.setItem('musicPaused', '1');
                setMusicPlaying(false);
            } else if (_ytPlayer && typeof _ytPlayer.playVideo === 'function') {
                _ytPlayer.playVideo();
                sessionStorage.removeItem('musicPaused');
                sessionStorage.setItem('musicChoice', 'yes');
                setMusicPlaying(true);
            }
        });

        /* ── Song-end: Replay ────────────────────────────────── */
        document.getElementById('music-replay-btn').addEventListener('click', function () {
            _songEndModalEl.classList.add('hidden');
            if (_ytPlayer) {
                _ytPlayer.seekTo(0);
                _ytPlayer.playVideo();
                setMusicPlaying(true);
            }
        });

        /* ── Song-end: Next Song ─────────────────────────────── */
        document.getElementById('music-next-btn').addEventListener('click', function () {
            _songEndModalEl.classList.add('hidden');
            if (typeof MusicRecommender !== 'undefined' && _ytPlayer) {
                var nextSong = MusicRecommender.recommendNext(
                    _recommendation ? _recommendation.song.id : null
                );
                if (nextSong) {
                    _recommendation = { song: nextSong };
                    sessionStorage.setItem('musicVideoId', nextSong.id);
                    sessionStorage.setItem('musicTitle',   nextSong.title);
                    sessionStorage.setItem('musicArtist',  nextSong.artist);
                    sessionStorage.setItem('musicPosition', '0');
                    _ytPlayer.loadVideoById(nextSong.id);
                    setMusicPlaying(true);
                }
            }
        });

        /* ── Save position before navigating away ────────────── */
        window.addEventListener('pagehide', saveState);
    });
}());
