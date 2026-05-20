/**
 * music-player.js  (Vue 2)
 *
 * Self-contained music-player widget for every page on the site.
 * Relies on:
 *   • Vue 2 CDN (vue@2.6.14 or later 2.x)
 *   • music-recommender.js (must be loaded first)
 *   • YouTube IFrame API  (loaded via <script src="https://www.youtube.com/iframe_api">)
 *
 * Drop-in usage – add before </body> on any page:
 *   <script src="https://www.youtube.com/iframe_api"></script>
 *   <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js"></script>
 *   <script src="...assets/js/music-recommender.js"></script>
 *   <script src="...assets/js/music-player.js"></script>
 *
 * SessionStorage keys (shared across pages):
 *   musicPromptAnswered  '1' once the user has seen the consent prompt
 *   musicChoice          'yes' | 'no'
 *   musicPaused          '1' when the user pressed pause (≠ declined)
 *   musicVideoId         current YouTube video ID
 *   musicTitle           current song title
 *   musicArtist          current song artist
 *   musicPosition        seconds elapsed (saved on pagehide)
 */
(function () {
    'use strict';

    /* ── Styles ──────────────────────────────────────────────────── */
    var CSS = [
        /* overlay & card */
        '.mp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);',
        '-webkit-backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;',
        'justify-content:center;animation:mpFadeIn .35s ease;}',
        '.mp-card{background:#1a2f4a;border:1px solid rgba(0,180,216,.28);border-radius:16px;',
        'padding:2rem 2.5rem;text-align:center;max-width:380px;width:90%;',
        'box-shadow:0 8px 32px rgba(0,0,0,.55);animation:mpSlideUp .35s ease;}',
        '.mp-icon{font-size:2.5rem;margin-bottom:.75rem;display:inline-block;',
        'animation:mpBounce 1.6s ease-in-out infinite;}',
        '.mp-title{color:#e0e0e0;font-weight:700;font-size:1.2rem;margin-bottom:.5rem;}',
        '.mp-text{color:#90a4ae;font-size:.92rem;margin-bottom:1.5rem;}',
        '.mp-actions{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;}',
        '.mp-btn-yes{background:#00b4d8;color:#fff;border:none;border-radius:8px;',
        'padding:.52rem 1.3rem;font-weight:600;font-size:.92rem;cursor:pointer;transition:background .2s;}',
        '.mp-btn-yes:hover{background:#2563eb;}',
        '.mp-btn-no{background:transparent;color:#90a4ae;border:1px solid rgba(0,180,216,.32);',
        'border-radius:8px;padding:.52rem 1.3rem;font-size:.92rem;cursor:pointer;',
        'transition:border-color .2s,color .2s;}',
        '.mp-btn-no:hover{border-color:#00b4d8;color:#00b4d8;}',
        /* now-playing badge */
        '.mp-badge{position:fixed;bottom:140px;right:8px;z-index:1000;max-width:240px;',
        'background:#1a2f4a;border:1px solid rgba(0,180,216,.28);border-radius:20px;',
        'padding:5px 12px;font-size:.72rem;color:#00b4d8;white-space:nowrap;overflow:hidden;',
        'text-overflow:ellipsis;box-shadow:0 2px 10px rgba(0,0,0,.3);pointer-events:none;',
        'animation:mpSlideUp .3s ease;}',
        /* floating toggle */
        '#mp-toggle{position:fixed;bottom:90px;right:24px;z-index:1000;width:44px;height:44px;',
        'border-radius:50%;background:#1a2f4a;border:1px solid rgba(0,180,216,.28);color:#00b4d8;',
        'font-size:1.25rem;cursor:pointer;display:flex;align-items:center;justify-content:center;',
        'box-shadow:0 4px 14px rgba(0,0,0,.3);transition:background .2s,transform .2s;}',
        '#mp-toggle:hover{background:rgba(0,180,216,.18);transform:scale(1.1);}',
        '#mp-toggle.mp-playing{animation:mpPulse 1.8s ease-in-out infinite;}',
        /* hidden player wrapper */
        '#mp-wrap{position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;}',
        /* keyframes */
        '@keyframes mpFadeIn{from{opacity:0}to{opacity:1}}',
        '@keyframes mpSlideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}',
        '@keyframes mpBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
        '@keyframes mpPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}'
    ].join('');

    function injectStyles() {
        if (document.getElementById('mp-styles')) return;
        var style = document.createElement('style');
        style.id = 'mp-styles';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    /* ── Static YT player container (outside Vue template) ───────── */
    function createPlayerContainer() {
        if (document.getElementById('mp-wrap')) return;
        var wrap = document.createElement('div');
        wrap.id = 'mp-wrap';
        wrap.setAttribute('aria-hidden', 'true');
        var inner = document.createElement('div');
        inner.id = 'mp-player';
        wrap.appendChild(inner);
        document.body.appendChild(wrap);
    }

    /* ── Boot the Vue app ──────────────────────────────────────────── */
    function boot() {
        injectStyles();
        createPlayerContainer();

        if (typeof Vue === 'undefined') {
            console.warn('[MusicPlayer] Vue.js not found – player disabled.');
            return;
        }

        /* Create Vue mount point if not already in the page HTML */
        if (!document.getElementById('music-app')) {
            var el = document.createElement('div');
            el.id = 'music-app';
            document.body.appendChild(el);
        }

        new Vue({
            el: '#music-app',

            /* ── Template ──────────────────────────────────────────── */
            template: [
                '<div>',
                /* Floating toggle button */
                '<button v-if="showToggle" id="mp-toggle"',
                '  :class="{\'mp-playing\': isPlaying && !isAdPlaying}"',
                '  :aria-label="toggleLabel" :title="toggleLabel"',
                '  @click="togglePlay">',
                '  <span>{{ toggleIcon }}</span>',
                '</button>',

                /* Now-playing / ad badge */
                '<div v-if="showToggle && badgeText" class="mp-badge">{{ badgeText }}</div>',

                /* ── Consent modal ─────────────────────────────────── */
                '<div v-if="showConsentModal" class="mp-overlay" role="dialog" aria-modal="true">',
                '  <div class="mp-card">',
                '    <div class="mp-icon">🎵</div>',
                '    <h3 class="mp-title">Welcome!</h3>',
                '    <p class="mp-text">{{ consentText }}</p>',
                '    <div class="mp-actions">',
                '      <button class="mp-btn-yes" @click="acceptMusic">♪ Yes, please!</button>',
                '      <button class="mp-btn-no"  @click="declineMusic">No, thanks</button>',
                '    </div>',
                '  </div>',
                '</div>',

                /* ── Song-end modal ─────────────────────────────────── */
                '<div v-if="showEndModal" class="mp-overlay" role="dialog" aria-modal="true">',
                '  <div class="mp-card">',
                '    <div class="mp-icon">🎶</div>',
                '    <h3 class="mp-title">Song finished!</h3>',
                '    <p class="mp-text">{{ endModalText }}</p>',
                '    <div class="mp-actions">',
                '      <button class="mp-btn-yes" @click="replay">↩ Replay</button>',
                '      <button class="mp-btn-no"  @click="nextSong">🎲 Next Song</button>',
                '    </div>',
                '  </div>',
                '</div>',
                '</div>'
            ].join(''),

            /* ── Data ─────────────────────────────────────────────── */
            data: function () {
                return {
                    // Player
                    ytPlayer:         null,
                    ytApiReady:       false,
                    isPlaying:        false,
                    isAdPlaying:      false,
                    expectedVideoId:  null,

                    // Current song
                    currentSong:      null,   // { id, title, artist }
                    recommendation:   null,   // from MusicRecommender.recommend()

                    // UI
                    showConsentModal: false,
                    showEndModal:     false,

                    // Persisted choices
                    musicChoice:      null,   // 'yes' | 'no' | null
                    musicWanted:      false,
                    musicPaused:      false
                };
            },

            /* ── Computed ─────────────────────────────────────────── */
            computed: {
                showToggle: function () {
                    return this.musicChoice === 'yes';
                },
                toggleIcon: function () {
                    if (this.isAdPlaying) return '📢';
                    return this.isPlaying ? '⏸' : '♪';
                },
                toggleLabel: function () {
                    if (this.isAdPlaying) return 'Ad playing…';
                    return this.isPlaying ? 'Pause music' : 'Play music';
                },
                badgeText: function () {
                    if (this.isAdPlaying) return '📢 Ad playing, please wait…';
                    if (this.isPlaying && this.currentSong) {
                        return '🎵 ' + this.currentSong.title + ' · ' + this.currentSong.artist;
                    }
                    return '';
                },
                consentText: function () {
                    return this.recommendation
                        ? 'I\'ve picked some ' + this.recommendation.label + ' for you. Want to listen while you browse?'
                        : 'Would you like to listen to some background music while browsing?';
                },
                endModalText: function () {
                    return this.currentSong
                        ? '"' + this.currentSong.title + '" by ' + this.currentSong.artist + ' has finished. What would you like to do next?'
                        : 'What would you like to do next?';
                }
            },

            /* ── Methods ──────────────────────────────────────────── */
            methods: {

                /* sessionStorage helpers */
                loadState: function () {
                    try {
                        this.musicChoice  = sessionStorage.getItem('musicChoice');
                        this.musicPaused  = sessionStorage.getItem('musicPaused') === '1';
                        var id     = sessionStorage.getItem('musicVideoId');
                        var title  = sessionStorage.getItem('musicTitle')  || '';
                        var artist = sessionStorage.getItem('musicArtist') || '';
                        if (id) { this.currentSong = { id: id, title: title, artist: artist }; }
                    } catch (e) { /* ignore */ }
                },

                persistSong: function () {
                    try {
                        if (this.currentSong) {
                            sessionStorage.setItem('musicVideoId', this.currentSong.id);
                            sessionStorage.setItem('musicTitle',   this.currentSong.title);
                            sessionStorage.setItem('musicArtist',  this.currentSong.artist);
                        }
                    } catch (e) { /* ignore */ }
                },

                savePosition: function () {
                    try {
                        if (this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
                            sessionStorage.setItem('musicPosition',
                                Math.floor(this.ytPlayer.getCurrentTime()));
                        }
                    } catch (e) { /* ignore */ }
                },

                /* Create YT player — loads into #mp-player (outside Vue template) */
                createPlayer: function (videoId, startSeconds) {
                    if (!window.YT || !YT.Player || this.ytPlayer) return;
                    var self = this;
                    this.expectedVideoId = videoId;

                    this.ytPlayer = new YT.Player('mp-player', {
                        height:  '1',
                        width:   '1',
                        videoId: videoId,
                        /* youtube-nocookie.com reduces tracking/ads */
                        host:    'https://www.youtube-nocookie.com',
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
                            },
                            onStateChange: function (e) {
                                self.handleStateChange(e);
                            },
                            onError: function () {
                                /* Video unavailable – auto-skip after a short pause */
                                self.isPlaying   = false;
                                self.isAdPlaying = false;
                                setTimeout(function () { self.nextSong(); }, 1200);
                            }
                        }
                    });
                },

                /* Ad detection: compare current playing ID with expected ID.
                   During ad playback the IFrame API typically reports either an
                   empty string or a different video_id for the playing content. */
                handleStateChange: function (e) {
                    var self = this;

                    if (e.data === YT.PlayerState.PLAYING) {
                        var data      = e.target.getVideoData ? e.target.getVideoData() : {};
                        var currentId = data.video_id || '';

                        if (currentId && currentId !== this.expectedVideoId) {
                            /* A different video is playing → ad/trailer */
                            this.isAdPlaying = true;
                            this.isPlaying   = false;
                            e.target.mute();          /* silence the ad */
                        } else {
                            /* The requested song is playing */
                            this.isAdPlaying = false;
                            this.isPlaying   = true;
                            this.musicPaused = false;
                            e.target.unMute();
                            e.target.setVolume(40);
                            try { sessionStorage.removeItem('musicPaused'); } catch (err) { /* ignore */ }
                        }

                    } else if (e.data === YT.PlayerState.PAUSED) {
                        if (!this.isAdPlaying) {
                            this.isPlaying = false;
                        }

                    } else if (e.data === YT.PlayerState.ENDED) {
                        /* Check whether the ad ended (the song is about to start)
                           or the actual song ended */
                        var data2      = e.target.getVideoData ? e.target.getVideoData() : {};
                        var endedId    = data2.video_id || '';
                        if (endedId && endedId !== this.expectedVideoId) {
                            /* Ad ended – the real song will start automatically */
                            this.isAdPlaying = false;
                            return;
                        }
                        /* Song truly ended */
                        this.isPlaying   = false;
                        this.isAdPlaying = false;
                        this.showEndModal = true;
                    }
                },

                /* Start (or restart) the player with the current song */
                startPlayer: function () {
                    if (!this.ytApiReady) return;
                    var videoId  = this.currentSong ? this.currentSong.id
                                  : (this.recommendation ? this.recommendation.song.id : null);
                    if (!videoId) return;

                    /* If no currentSong yet, set it from recommendation */
                    if (!this.currentSong && this.recommendation) {
                        this.currentSong = this.recommendation.song;
                        this.persistSong();
                    }

                    var startPos = parseInt(sessionStorage.getItem('musicPosition') || '0', 10);
                    this.createPlayer(videoId, startPos);
                },

                /* User actions */
                acceptMusic: function () {
                    this.musicChoice  = 'yes';
                    this.musicWanted  = true;
                    this.musicPaused  = false;
                    this.showConsentModal = false;
                    try {
                        sessionStorage.setItem('musicPromptAnswered', '1');
                        sessionStorage.setItem('musicChoice', 'yes');
                        sessionStorage.removeItem('musicPaused');
                    } catch (e) { /* ignore */ }
                    this.startPlayer();
                },

                declineMusic: function () {
                    this.musicChoice = 'no';
                    this.showConsentModal = false;
                    try {
                        sessionStorage.setItem('musicPromptAnswered', '1');
                        sessionStorage.setItem('musicChoice', 'no');
                    } catch (e) { /* ignore */ }
                },

                togglePlay: function () {
                    if (!this.ytPlayer) return;
                    /* Cannot pause/stop an ad via the IFrame API */
                    if (this.isAdPlaying) return;

                    var state = typeof this.ytPlayer.getPlayerState === 'function'
                        ? this.ytPlayer.getPlayerState() : -1;

                    if (state === YT.PlayerState.PLAYING) {
                        this.ytPlayer.pauseVideo();
                        this.isPlaying   = false;
                        this.musicPaused = true;
                        try {
                            sessionStorage.setItem('musicPaused', '1');
                        } catch (e) { /* ignore */ }
                    } else {
                        this.ytPlayer.playVideo();
                        this.isPlaying   = true;
                        this.musicPaused = false;
                        try {
                            sessionStorage.removeItem('musicPaused');
                            sessionStorage.setItem('musicChoice', 'yes');
                        } catch (e) { /* ignore */ }
                    }
                },

                replay: function () {
                    this.showEndModal = false;
                    if (this.ytPlayer) {
                        this.ytPlayer.seekTo(0);
                        this.ytPlayer.playVideo();
                        this.isPlaying = true;
                    }
                },

                nextSong: function () {
                    this.showEndModal = false;
                    if (typeof MusicRecommender === 'undefined') return;

                    var next = MusicRecommender.recommendNext(
                        this.currentSong ? this.currentSong.id : null
                    );
                    if (!next) return;

                    this.currentSong     = next;
                    this.expectedVideoId = next.id;

                    try {
                        sessionStorage.setItem('musicVideoId', next.id);
                        sessionStorage.setItem('musicTitle',   next.title);
                        sessionStorage.setItem('musicArtist',  next.artist);
                        sessionStorage.setItem('musicPosition', '0');
                    } catch (e) { /* ignore */ }

                    if (this.ytPlayer) {
                        this.isPlaying   = false;
                        this.isAdPlaying = false;
                        /* loadVideoById loads and auto-plays the new video */
                        this.ytPlayer.loadVideoById(next.id);
                    }
                }
            },

            /* ── Lifecycle ────────────────────────────────────────── */
            mounted: function () {
                var self = this;

                /* Restore persisted state */
                this.loadState();

                /* Get today's recommendation */
                if (typeof MusicRecommender !== 'undefined') {
                    this.recommendation = MusicRecommender.recommend();
                    if (!this.currentSong) {
                        this.currentSong = this.recommendation.song;
                    }
                }

                /* Expose global YT API ready callback — chain any pre-existing one */
                var prevYTCallback = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = function () {
                    if (typeof prevYTCallback === 'function') { prevYTCallback(); }
                    self.ytApiReady = true;
                    if (self.musicWanted && !self.musicPaused) {
                        self.startPlayer();
                    }
                };

                /* If the API script already loaded before this component mounted */
                if (window.YT && window.YT.Player) {
                    this.ytApiReady = true;
                }

                /* Decide initial state */
                var answered = sessionStorage.getItem('musicPromptAnswered');
                if (!answered) {
                    setTimeout(function () { self.showConsentModal = true; }, 900);
                } else if (this.musicChoice === 'yes' && !this.musicPaused) {
                    this.musicWanted = true;
                    if (this.ytApiReady) { this.startPlayer(); }
                }

                /* Save playback position before the browser navigates away */
                window.addEventListener('pagehide', function () { self.savePosition(); });
            }
        });
    }

    /* Boot after DOM is ready */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
