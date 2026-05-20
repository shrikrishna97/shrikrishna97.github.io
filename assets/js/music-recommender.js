/**
 * music-recommender.js
 *
 * A rule-based music recommender that selects a contextually fitting,
 * globally popular (non-adult) song based on the visitor's current season
 * (derived from the calendar month) and time of day (day vs. night).
 *
 * Each song entry references a YouTube video ID so no audio files need to
 * be hosted — the YouTube IFrame API streams the track directly.
 *
 * Exposes a single global: MusicRecommender.recommend()
 */
var MusicRecommender = (function () {
    'use strict';

    // ── Curated playlist ─────────────────────────────────────────────────────
    // Dimensions: season (winter / spring / summer / fall) × time (day / night)
    // All tracks are globally trending, family-friendly, non-adult songs.
    var PLAYLIST = {
        winter: {
            day: [
                { id: 'y6Sxv-sUYtM', title: 'Happy',                       artist: 'Pharrell Williams'            },
                { id: 'nfWlot6h_JM', title: 'Shake It Off',                 artist: 'Taylor Swift'                 },
                { id: 'ru0K8uYEZWw', title: "Can't Stop the Feeling!",      artist: 'Justin Timberlake'            }
            ],
            night: [
                { id: 'yXQViqx6GMY', title: 'All I Want for Christmas Is You', artist: 'Mariah Carey'              },
                { id: 'rtOvBOTyX00', title: 'A Thousand Years',             artist: 'Christina Perri'              },
                { id: 'syFZfO_wfMQ', title: 'Night Changes',                artist: 'One Direction'                }
            ]
        },
        spring: {
            day: [
                { id: 'OPf0YbXqDm0', title: 'Uptown Funk',                  artist: 'Bruno Mars'                   },
                { id: 'CevxZvSJLk8', title: 'Roar',                         artist: 'Katy Perry'                   },
                { id: 'hT_nvWreIhg', title: 'Count on Me',                  artist: 'Bruno Mars'                   }
            ],
            night: [
                { id: '2Vv-BfVoq4g', title: 'Perfect',                      artist: 'Ed Sheeran'                   },
                { id: 'lp-EO5I60KA', title: 'Thinking Out Loud',            artist: 'Ed Sheeran'                   },
                { id: 'RgKAFK5djSk', title: 'See You Again',                artist: 'Wiz Khalifa ft. Charlie Puth' }
            ]
        },
        summer: {
            day: [
                { id: 'JGwWNGJdvx8', title: 'Shape of You',                 artist: 'Ed Sheeran'                   },
                { id: '4NRXx6U8ABQ', title: 'Blinding Lights',              artist: 'The Weeknd'                   },
                { id: 'TUVcZfQe-Kw', title: 'Levitating',                   artist: 'Dua Lipa'                     }
            ],
            night: [
                { id: 'pB-5XG-DbAA', title: 'Stay With Me',                 artist: 'Sam Smith'                    },
                { id: '09R8_2nJtjg', title: 'Sugar',                        artist: 'Maroon 5'                     },
                { id: 'lFfKIBHkZD0', title: 'Something Just Like This',     artist: 'Coldplay & The Chainsmokers'  }
            ]
        },
        fall: {
            day: [
                { id: 'OPf0YbXqDm0', title: 'Uptown Funk',                  artist: 'Bruno Mars'                   },
                { id: 'nfWlot6h_JM', title: 'Shake It Off',                 artist: 'Taylor Swift'                 },
                { id: 'ru0K8uYEZWw', title: "Can't Stop the Feeling!",      artist: 'Justin Timberlake'            }
            ],
            night: [
                { id: 'lFfKIBHkZD0', title: 'Something Just Like This',     artist: 'Coldplay & The Chainsmokers'  },
                { id: 'rtOvBOTyX00', title: 'A Thousand Years',             artist: 'Christina Perri'              },
                { id: 'RgKAFK5djSk', title: 'See You Again',                artist: 'Wiz Khalifa ft. Charlie Puth' }
            ]
        }
    };

    // ── Indian top-rated songs ────────────────────────────────────────────────
    // Mixed into the "Next Song" pool. Popular, family-friendly Bollywood tracks
    // from official T-Series / Sony Music India / Zee Music uploads.
    var INDIAN_SONGS = [
        { id: 'IJq0aryzkTw', title: 'Tum Hi Ho',               artist: 'Arijit Singh'                 },
        { id: 'kJf8FhC1fCM', title: 'Kesariya',                artist: 'Arijit Singh'                 },
        { id: 'vHUUd7S6EaA', title: 'Ik Vaari Aa',             artist: 'Arijit Singh (Raabta)'        },
        { id: 'Y2X07ABzNaA', title: 'Tujhe Kitna Chahne Lage', artist: 'Arijit Singh (Kabir Singh)'   },
        { id: 'sEGBbWVIEPM', title: 'Ae Dil Hai Mushkil',      artist: 'Arijit Singh'                 },
        { id: 'HDiPptNdDaQ', title: 'Channa Mereya',           artist: 'Arijit Singh'                 },
        { id: '34kf6M3PVr4', title: 'Raataan Lambiyan',        artist: 'Jubin Nautiyal & Asees Kaur'  },
        { id: 'BddP6PYo2gs', title: 'Agar Tum Saath Ho',       artist: 'Arijit Singh & Alka Yagnik'   },
        { id: 'pVkdQRWBLmg', title: 'Dil Diyan Gallan',        artist: 'Atif Aslam'                   },
        { id: 'xKwBSCfGG_k', title: 'Kabira',                  artist: 'Tochi Raina & Rekha Bhardwaj' }
    ];

    // ── Helpers ──────────────────────────────────────────────────────────────

    /** Returns the season name for a 0-indexed month (0 = January). */
    function getSeason(month) {
        if (month >= 2 && month <= 4) return 'spring';   // Mar–May
        if (month >= 5 && month <= 7) return 'summer';   // Jun–Aug
        if (month >= 8 && month <= 10) return 'fall';    // Sep–Nov
        return 'winter';                                  // Dec–Feb
    }

    /** Returns 'day' for 06:00–19:59, 'night' otherwise. */
    function getTimeOfDay(hour) {
        return (hour >= 6 && hour < 20) ? 'day' : 'night';
    }

    /**
     * Returns a song from the current season/time pool (plus Indian songs) that
     * is different from the one identified by currentId.
     * Falls back to any song if the pool has only one track.
     */
    function recommendNext(currentId) {
        var now       = new Date();
        var season    = getSeason(now.getMonth());
        var timeOfDay = getTimeOfDay(now.getHours());
        // Merge season/time songs with Indian songs for variety
        var songs  = PLAYLIST[season][timeOfDay].concat(INDIAN_SONGS);
        var others = songs.filter(function (s) { return s.id !== currentId; });
        var pool   = others.length ? others : songs;
        var idx    = Math.floor(Math.random() * pool.length);
        return pool[idx];
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /**
     * Returns a recommendation object:
     *   { song: { id, title, artist }, season, timeOfDay, label }
     *
     * The song rotates daily (same track for the entire day) so repeat
     * visitors in one session always hear the same recommendation.
     */
    function recommend() {
        var now        = new Date();
        var season     = getSeason(now.getMonth());
        var timeOfDay  = getTimeOfDay(now.getHours());
        var songs      = PLAYLIST[season][timeOfDay];

        // Use day-of-year (0-indexed from Jan 1) to rotate songs deterministically
        var yearStart  = new Date(now.getFullYear(), 0, 1);
        var dayOfYear  = Math.floor((now - yearStart) / 86400000);
        var song       = songs[dayOfYear % songs.length];

        var emoji = timeOfDay === 'day' ? '☀️' : '🌙';
        var label = season.charAt(0).toUpperCase() + season.slice(1) + ' ' + emoji + ' Vibes';

        return {
            song:       song,
            season:     season,
            timeOfDay:  timeOfDay,
            label:      label
        };
    }

    return { recommend: recommend, recommendNext: recommendNext };
})();
