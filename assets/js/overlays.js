/**
 * overlays.js — Vue 3 SPA overlay system
 *
 * Renders Education, Achievements, and Internship detail views as full-screen
 * overlay modals inside the main page.  No full-page navigation occurs, so the
 * music player keeps running uninterrupted.
 *
 * Public API:
 *   window.openOverlay('education' | 'achievements' | 'internship')
 *   window.closeOverlay()
 */
(function () {
    'use strict';

    /* ── Education data (from education/main.js) ──────────────────── */
    var EDU_JOURNEY = [
        {
            title: 'B.Sc. (Hons.) in Mathematics',
            institution: 'Govt. T.R.S College, Rewa, MP',
            year: '2015 – 2018',
            description: 'Three-year honours degree in Mathematics. Built a strong foundation in calculus, linear algebra, statistics, and real analysis.'
        },
        {
            title: 'Foundational Level Certificate',
            institution: 'IIT Madras — BS in Data Science & Applications',
            year: '2020 – 2021',
            description: 'Completed the Foundational Level of the IIT Madras BS programme, covering Statistics, Maths, Computational Thinking, and English.'
        },
        {
            title: 'Diploma in Programming',
            institution: 'IIT Madras — BS in Data Science & Applications',
            year: '2021 – 2022',
            description: 'Earned the Programming Diploma, covering System Commands, Database Management, Java, and Application Development.'
        },
        {
            title: 'Diploma in Data Science',
            institution: 'IIT Madras — BS in Data Science & Applications',
            year: '2022 – 2023',
            description: 'Earned the Data Science Diploma, covering Machine Learning Foundations, Business Data Management, Tools in Data Science, and MLT.'
        },
        {
            title: 'BS in Data Science & Applications',
            institution: 'IIT Madras',
            year: '2023 – 2024',
            description: 'Completed the full BS Degree with an overall CGPA of 8.79. Received the Diploma Certificate at SAC Auditorium, IIT Madras. Final courses included Software Engineering, Application Development II, and Capstone project.'
        }
    ];

    var EDU_EXPERIENCES = [
        {
            title: 'Course Instructor — IIT Madras',
            org: 'IIT Madras BS Program',
            period: '2024 – Present',
            description: 'Teaching Computational Thinking, Application Development I & II, Software Engineering, and their Lab Courses. Conducted on-campus offline bootcamps and workshops.',
            repos: [
                { label: '📘 Computational Thinking', url: 'https://github.com/shrikrishna97/Computational-Thinking' },
                { label: '📗 App Dev Resources', url: 'https://github.com/shrikrishna97/Resources-App-Dev' }
            ]
        },
        {
            title: 'Teaching Assistant',
            org: 'IIT Madras',
            period: '2023 – 2024',
            description: 'Taken live sessions, handled thousands of level1 vivas, taken hundreds of level1/level2 vivas for App Dev courses.',
            repos: []
        },
        {
            title: 'Teaching Assistant & Education Mentor',
            org: 'IIT Madras',
            period: '2022',
            description: 'Mentored 300+ students in System Commands. Managed a WhatsApp community (10,000+), LinkedIn group (900+ members).',
            repos: [
                { label: '💻 System Commands Notes', url: 'https://github.com/shrikrishna97/System-Commands-Notes_May22' }
            ]
        },
        {
            title: 'ML Supervised Classification Project',
            org: 'IIT Madras — Kaggle Competition',
            period: '2022',
            description: 'Achieved accuracy of 0.65 in a Sales Prediction project, ranking 42nd out of 760 teams. Used Numpy, Pandas, XGBoost, Sklearn.',
            repos: []
        },
        {
            title: 'Business Data Management Capstone',
            org: 'IIT Madras',
            period: '2022',
            description: 'Data collection, cleaning, preparation, and dashboard creation for a kirana firm. Developed a recommendation system and Streamlit app (MKP Store Analysis).',
            repos: []
        }
    ];

    var EDU_SKILLS = [
        'Python', 'Java', 'C', 'JavaScript', 'Vue.js', 'React', 'Flask', 'Django',
        'SQL', 'SQLite', 'PostgreSQL', 'Redis', 'Celery', 'Node.js',
        'Machine Learning', 'Scikit-learn', 'XGBoost', 'PyTorch',
        'Pandas', 'Numpy', 'Tableau', 'Excel',
        'Linux / Bash', 'Awk', 'Sed', 'Git', 'Bootstrap'
    ];

    /* ── Achievements / certificates data ────────────────────────── */
    var CERTIFICATES = [
        { image: 'static/certificate/Consumer Psychology_page1.png',            title: 'Consumer Psychology',            desc: 'NPTEL — IIT Guwahati' },
        { image: 'static/certificate/Data Mining.jpg',                          title: 'Data Mining',                    desc: 'NPTEL Certification' },
        { image: 'static/certificate/Programming diploma_page1.png',            title: 'Diploma in Programming',         desc: 'IIT Madras BS Programme' },
        { image: 'static/certificate/data science diploma_page1.png',           title: 'Diploma in Data Science',        desc: 'IIT Madras BS Programme' },
        { image: 'static/certificate/Foundational Level Certificate_page1.png', title: 'Foundational Level Certificate', desc: 'IIT Madras BS Programme' },
        { image: 'static/certificate/Java Introduction.png',                    title: 'Introduction to Java',           desc: 'IIT Madras / Online Course' },
        { image: 'static/certificate/Introduction to Linux.png',                title: 'Introduction to Linux',          desc: 'Linux Foundation / Online' },
        { image: 'static/certificate/Hack-O-Pitch_Certificate_Shri Krishna_Pandey_page1.png', title: 'Hack-O-Pitch Certificate', desc: 'Online Hackathon' },
        { image: 'static/certificate/Certificate fundamental of language.jpg',  title: 'Fundamentals of Language',       desc: 'Online Certification' },
        { image: 'static/certificate/1.jpg',                                    title: 'PyTorch Workshop',               desc: 'Deep Learning Workshop' }
    ];

    /* ── Internship / teaching work data ─────────────────────────── */
    var WORK_ITEMS = [
        {
            heading: '🎓 Teaching Roles — IIT Madras',
            isSection: true
        },
        {
            title: 'Course Instructor — Application Development I & II',
            org: 'IIT Madras BS Programme',
            period: '2024 – Present',
            desc: 'Delivered course content for Modern Application Development (MAD1 & MAD2) — covering Flask, Vue.js, REST APIs, testing and others.',
            bullets: [
                'Conducted live Q&A sessions and doubt-clearing workshops',
                'Created step-by-step project report guides and viva checklists',
                'Reviewed student project submissions and provided feedback'
            ],
            repos: [
                { label: '📗 Resources-App-Dev (⭐ 79)', url: 'https://github.com/shrikrishna97/Resources-App-Dev' },
                { label: '🛠️ App Dev-2 Project Repo', url: 'https://github.com/shrikrishna97/Resources-App-Dev/tree/main/App-Dev-2-Project/Jan-26' },
                { label: '💻 Youtube Resources', url: 'https://youtube.com/playlist?list=PL3o3mRooP_7pbVDSZRhyPr8B3r6WUQieP' }
            ]
        },
        {
            title: 'Course Instructor — Computational Thinking',
            org: 'IIT Madras BS Programme',
            period: 'Sep'2025',
            desc: 'Taught problem-solving, algorithmic thinking, and programming fundamentals to Foundation level students in both English and Hindi.',
            bullets: [
                'Created live session content and code demos',
                'Recorded and shared session videos on YouTube',
                'Built resources covering all weekly topics'
            ],
            repos: [
                { label: '📘 Computational Thinking Repo', url: 'https://github.com/shrikrishna97/Computational-Thinking' },
                { label: '▶️ Live Sessions', url: 'https://youtube.com/playlist?list=PL3o3mRooP_7om75sN8aC_axtnhDFABKR7' }
                { label: '▶️ CT Hindi Lectures', url: 'https://youtube.com/playlist?list=PL3o3mRooP_7pONIil88Bybu7uCiVbzNGm' }
            ]
        },
        {
            title: 'Course Instructor — Software Engineering',
            org: 'IIT Madras BS Programme',
            period: 'Sep'2025',
            desc: 'Covered software engineering principles, testing, agile methodologies, and project management for Degree level students.',
            bullets: [
                'Guided students through software design and architecture concepts',
                'Assisted with project evaluations and lab sessions'
            ],
            repos: []
        },
        {
            title: 'Online and On-Campus Offline Bootcamp — MAD1 and MAD-2',
            org: 'IIT Madras Campus',
            period: '2023 - Present',
            desc: 'Organised and conducted a hands-on bootcamp for IITM BS students on Application Development I, covering Flask project setup to deployment.',
            bullets: [],
            repos: [
                { label: '🏕️ Online Bootcamp MAD-1 video', url: 'https://youtube.com/playlist?list=PL3o3mRooP_7o_-HNP5XZPwWFvUUQxGg4K' }
            ]
        },
        {
            heading: '👨‍🏫 Teaching Assistant',
            isSection: true
        },
        {
            title: 'Teaching Assistant — System Commands and App Dev 2',
            org: 'IIT Madras BS Programme',
            period: '2022 – 2023',
            desc: 'Mentored 300+ students across multiple terms in the System Commands course, covering Linux utilities, Shell scripting, Awk, and Sed.',
            bullets: [
                'Managed a WhatsApp community channel with 2,500+ followers',
                'Admin of LinkedIn group with 1500+ members',
                'Resource website crossed over lakh+ hits',
                'Active Telegram groups for real-time student support'
            ],
            repos: [
                { label: '💻 System Commands Notes', url: 'https://github.com/shrikrishna97/System-Commands-Notes_May22' }
            ]
        },
        {
            heading: '🔬 Academic Projects',
            isSection: true
        },
        {
            title: 'MKP Store — Business Data Management Capstone',
            org: 'IIT Madras',
            period: '2023',
            desc: 'Analysed sales, inventory, and customer data for a local kirana (grocery) store. Built a data input tool and a Streamlit dashboard with actionable insights.',
            bullets: [
                'Tools: Python, Pandas, Excel, Streamlit',
                'Delivered a recommendation system for inventory management'
            ],
            repos: []
        },
        {
            title: 'Sales Prediction — ML Supervised Classification (Kaggle)',
            org: 'IIT Madras / Kaggle',
            period: '2023',
            desc: 'Ranked 42nd out of 760 teams in an ML competition. Achieved accuracy of 0.65 using ensemble methods.',
            bullets: [
                'Tools: Numpy, Pandas, XGBoost, Scikit-learn'
            ],
            repos: []
        }
    ];

    /* ── Inject overlay CSS ───────────────────────────────────────── */
    function injectStyles() {
        if (document.getElementById('overlay-styles')) return;
        var style = document.createElement('style');
        style.id = 'overlay-styles';
        style.textContent = [
            '.ov-backdrop{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.72);',
            'backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);',
            'display:flex;align-items:flex-start;justify-content:center;',
            'padding:20px 12px;overflow-y:auto;animation:ovFadeIn .25s ease;}',
            '.ov-panel{position:relative;background:#0d1b2a;border:1px solid rgba(0,180,216,.3);',
            'border-radius:14px;width:100%;max-width:860px;box-shadow:0 12px 48px rgba(0,0,0,.6);',
            'animation:ovSlideUp .28s ease;}',
            '.ov-header{display:flex;align-items:center;justify-content:space-between;',
            'padding:20px 24px 16px;border-bottom:1px solid rgba(0,180,216,.18);}',
            '.ov-header h2{margin:0;font-size:1.4rem;color:#fff;}',
            '.ov-close{background:transparent;border:1px solid rgba(0,180,216,.3);',
            'color:#90a4ae;border-radius:50%;width:34px;height:34px;font-size:1.1rem;',
            'cursor:pointer;display:flex;align-items:center;justify-content:center;',
            'transition:background .18s,color .18s;flex-shrink:0;}',
            '.ov-close:hover{background:rgba(0,180,216,.18);color:#00b4d8;}',
            '.ov-body{padding:24px;max-height:calc(100vh - 140px);overflow-y:auto;}',
            /* journey items */
            '.ov-journey-item{border-left:3px solid #00b4d8;padding:10px 0 10px 18px;',
            'margin-bottom:20px;}',
            '.ov-journey-item h3{color:#00b4d8;font-size:1rem;margin-bottom:2px;}',
            '.ov-journey-item .ov-meta{color:#90a4ae;font-size:.82rem;margin-bottom:6px;}',
            '.ov-journey-item p{color:#c5cdd6;font-size:.9rem;margin:0;}',
            /* work cards */
            '.ov-work-card{background:#1e3a5f;border:1px solid rgba(0,180,216,.2);',
            'border-radius:10px;padding:20px;margin-bottom:18px;}',
            '.ov-work-card h4{color:#00b4d8;margin-bottom:2px;font-size:1rem;}',
            '.ov-work-card .ov-org{color:#90a4ae;font-size:.82rem;margin-bottom:8px;}',
            '.ov-work-card p,.ov-work-card li{color:#c5cdd6;font-size:.9rem;}',
            '.ov-work-card ul{padding-left:18px;margin-bottom:8px;}',
            /* cert cards */
            '.ov-cert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px;}',
            '.ov-cert-card{background:#1e3a5f;border:1px solid rgba(0,180,216,.18);',
            'border-radius:8px;overflow:hidden;transition:transform .18s,box-shadow .18s;}',
            '.ov-cert-card:hover{transform:translateY(-3px);box-shadow:0 6px 24px rgba(0,180,216,.22);}',
            '.ov-cert-card img{width:100%;height:130px;object-fit:cover;display:block;}',
            '.ov-cert-card .ov-cert-info{padding:10px;}',
            '.ov-cert-card .ov-cert-title{color:#00b4d8;font-size:.82rem;font-weight:600;margin-bottom:2px;}',
            '.ov-cert-card .ov-cert-desc{color:#90a4ae;font-size:.75rem;}',
            /* section heading */
            '.ov-section-heading{color:#f4a261;font-size:.95rem;font-weight:700;',
            'border-bottom:2px solid rgba(244,162,97,.25);padding-bottom:6px;',
            'margin:24px 0 14px;}',
            '.ov-section-heading:first-child{margin-top:0;}',
            /* repo badges */
            '.ov-repos{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;}',
            '.ov-repo-badge{display:inline-block;padding:3px 13px;font-size:.78rem;',
            'border-radius:20px;background:rgba(0,180,216,.12);color:#00b4d8;',
            'border:1px solid #00b4d8;text-decoration:none;transition:background .18s,color .18s;}',
            '.ov-repo-badge:hover{background:#00b4d8;color:#0d1b2a;}',
            /* skill pills */
            '.ov-skills{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;}',
            '.ov-skill{background:rgba(0,180,216,.12);color:#00b4d8;border:1px solid #00b4d8;',
            'padding:4px 14px;border-radius:20px;font-size:.85rem;}',
            /* keyframes */
            '@keyframes ovFadeIn{from{opacity:0}to{opacity:1}}',
            '@keyframes ovSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}'
        ].join('');
        document.head.appendChild(style);
    }

    /* ── Vue 3 app template ───────────────────────────────────────── */
    var TEMPLATE = [
        '<div>',

        /* ── Education overlay ─────────────────────────────────────── */
        '<div v-if="active===\'education\'" class="ov-backdrop" @click.self="close" role="dialog" aria-modal="true" aria-label="Educational Journey">',
        '  <div class="ov-panel">',
        '    <div class="ov-header">',
        '      <h2>🎓 My Educational Journey</h2>',
        '      <button class="ov-close" @click="close" aria-label="Close">✕</button>',
        '    </div>',
        '    <div class="ov-body">',

        '      <h3 class="ov-section-heading">📚 Education</h3>',
        '      <div v-for="e in eduJourney" :key="e.title" class="ov-journey-item">',
        '        <h3>{{ e.title }}</h3>',
        '        <div class="ov-meta"><strong>{{ e.institution }}</strong> — {{ e.year }}</div>',
        '        <p>{{ e.description }}</p>',
        '      </div>',

        '      <h3 class="ov-section-heading">💼 Work Experience</h3>',
        '      <div v-for="ex in eduExperiences" :key="ex.title" class="ov-work-card">',
        '        <h4>{{ ex.title }}</h4>',
        '        <div class="ov-org">{{ ex.org }} — {{ ex.period }}</div>',
        '        <p>{{ ex.description }}</p>',
        '        <div v-if="ex.repos && ex.repos.length" class="ov-repos">',
        '          <a v-for="r in ex.repos" :key="r.url" :href="r.url" target="_blank" rel="noopener" class="ov-repo-badge">{{ r.label }}</a>',
        '        </div>',
        '      </div>',

        '      <h3 class="ov-section-heading">🛠️ Skills</h3>',
        '      <ul class="ov-skills">',
        '        <li v-for="s in eduSkills" :key="s" class="ov-skill">{{ s }}</li>',
        '      </ul>',

        '      <h3 class="ov-section-heading" style="margin-top:20px">🎯 Current Focus</h3>',
        '      <p style="color:#c5cdd6;font-size:.9rem">Software Engineering, Full-Stack Development, and teaching Data Science &amp; Application Development at IIT Madras.</p>',

        '      <h3 class="ov-section-heading">🔍 Looking For</h3>',
        '      <p style="color:#c5cdd6;font-size:.9rem">SDE / Full-Stack Developer roles or Research/Teaching positions in Computer Science and Data Science.</p>',

        '    </div>',
        '  </div>',
        '</div>',

        /* ── Achievements overlay ──────────────────────────────────── */
        '<div v-if="active===\'achievements\'" class="ov-backdrop" @click.self="close" role="dialog" aria-modal="true" aria-label="Certificates and Achievements">',
        '  <div class="ov-panel">',
        '    <div class="ov-header">',
        '      <h2>🏆 Certificates &amp; Achievements</h2>',
        '      <button class="ov-close" @click="close" aria-label="Close">✕</button>',
        '    </div>',
        '    <div class="ov-body">',
        '      <div class="ov-cert-grid">',
        '        <div v-for="c in certs" :key="c.title" class="ov-cert-card">',
        '          <img :src="c.image" :alt="c.title" loading="lazy" onerror="this.style.display=\'none\'">',
        '          <div class="ov-cert-info">',
        '            <div class="ov-cert-title">{{ c.title }}</div>',
        '            <div class="ov-cert-desc">{{ c.desc }}</div>',
        '          </div>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>',

        /* ── Internship overlay ────────────────────────────────────── */
        '<div v-if="active===\'internship\'" class="ov-backdrop" @click.self="close" role="dialog" aria-modal="true" aria-label="Teaching and Internship Work">',
        '  <div class="ov-panel">',
        '    <div class="ov-header">',
        '      <h2>👨‍🏫 Teaching &amp; Internship Work</h2>',
        '      <button class="ov-close" @click="close" aria-label="Close">✕</button>',
        '    </div>',
        '    <div class="ov-body">',
        '      <template v-for="item in workItems" :key="item.heading || item.title">',
        '        <h3 v-if="item.isSection" class="ov-section-heading">{{ item.heading }}</h3>',
        '        <div v-else class="ov-work-card">',
        '          <h4>{{ item.title }}</h4>',
        '          <div class="ov-org">{{ item.org }} — {{ item.period }}</div>',
        '          <p>{{ item.desc }}</p>',
        '          <ul v-if="item.bullets && item.bullets.length">',
        '            <li v-for="b in item.bullets" :key="b">{{ b }}</li>',
        '          </ul>',
        '          <div v-if="item.repos && item.repos.length" class="ov-repos">',
        '            <a v-for="r in item.repos" :key="r.url" :href="r.url" target="_blank" rel="noopener" class="ov-repo-badge">{{ r.label }}</a>',
        '          </div>',
        '        </div>',
        '      </template>',
        '    </div>',
        '  </div>',
        '</div>',

        '</div>'
    ].join('\n');

    /* ── Boot ─────────────────────────────────────────────────────── */
    function boot() {
        injectStyles();

        if (typeof Vue === 'undefined' || typeof Vue.createApp !== 'function') {
            console.warn('[Overlays] Vue 3 not found – overlays disabled.');
            return;
        }

        var container = document.createElement('div');
        container.id = 'overlay-root';
        document.body.appendChild(container);

        var app = Vue.createApp({
            template: TEMPLATE,
            data: function () {
                return {
                    active:         null,
                    eduJourney:     EDU_JOURNEY,
                    eduExperiences: EDU_EXPERIENCES,
                    eduSkills:      EDU_SKILLS,
                    certs:          CERTIFICATES,
                    workItems:      WORK_ITEMS
                };
            },
            methods: {
                close: function () {
                    this.active = null;
                    document.body.style.overflow = '';
                },
                open: function (name) {
                    this.active = name;
                    document.body.style.overflow = 'hidden';
                }
            },
            mounted: function () {
                var self = this;

                /* Key: Escape closes the overlay */
                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && self.active) { self.close(); }
                });

                /* Public API */
                window.openOverlay  = function (name) { self.open(name); };
                window.closeOverlay = function ()     { self.close();    };
            }
        });

        app.mount('#overlay-root');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
