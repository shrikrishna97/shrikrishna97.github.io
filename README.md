# 🦚 Shri Krishna Pandey — Portfolio

> Live site: **[shrikrishna97.github.io](https://shrikrishna97.github.io/)**

A personal portfolio and resource hub built from scratch — no templates used.

---

## 👤 About

Hi, I'm **Shri Krishna Pandey** — IITM Alumnus, Course Instructor at IIT Madras, Full-Stack Developer, and community builder.

- 🎓 BS in Data Science & Applications from IIT Madras (CGPA 8.79) + B.Sc. (Hons.) in Mathematics
- 👨‍🏫 Course Instructor for App Dev I & II, Computational Thinking, Software Engineering (and their Lab courses)
- 🏫 Taught **5000+ students every term** (3 terms/year) and handled **18,000+ App Dev vivas**
- 🌐 Admin of IITM BS student communities — WhatsApp channel (2,500+ followers), LinkedIn group (1,500+ members), resource website with **1 lakh+ hits**
- 📚 Mentored **300+ students** in System Commands

---

## 🗂️ Structure

```
shrikrishna97.github.io/
├── index.html                    # Single-page portfolio (all sections)
├── sitemap.xml                   # SEO sitemap
├── robots.txt                    # Search engine directives
├── assets/
│   ├── css/
│   │   └── styles.css            # Dark-mode-first CSS with custom properties
│   ├── js/
│   │   ├── script.js             # Theme toggle, typing tagline, scroll-reveal,
│   │   │                         #   section indicator, back-to-top, music player
│   │   └── music-recommender.js  # Rule-based music recommender (season × time-of-day)
│   └── php/
│       └── process_form.php      # Server-side contact form handler
├── app/
│   ├── achieve.html              # Certificates & Achievements detail page
│   ├── internship.html           # Teaching & Internship detail page
│   ├── 404.html                  # Custom 404 error page
│   ├── components/
│   │   └── project-list.js       # Vue.js project-list component
│   └── education/
│       ├── educ.html             # Educational journey timeline page
│       ├── educ.css              # Styles for educational journey page
│       └── main.js               # Vue.js data for educational journey
└── static/
    └── ...                       # Profile photo, resume PDF, certificates, project images
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, dark-mode-first), Bootstrap 5 |
| Scripting | Vanilla JavaScript (ES5-compatible) |
| UI Components | Bootstrap 5 Carousel, Vue.js 2 |
| Fonts | Inter — Google Fonts |
| Icons | Font Awesome 5 · icons8 (skill pills) |
| Music | YouTube IFrame API (audio-only background player) |
| SEO | Schema.org `Person` JSON-LD · Open Graph · Twitter Card · `sitemap.xml` |
| Hosting | GitHub Pages |

---

## ✨ Features

### 🎨 Design & Theme
- **Dark-mode-first** design with a light-mode toggle persisted via `localStorage`
- Custom CSS properties (`--bg-primary`, `--accent-cyan`, `--accent-gold`, …) used throughout
- Fully responsive — mobile, tablet, and desktop

### 🧭 Navigation & Scroll
- Sticky navbar with **active-link highlighting** that updates as you scroll
- **Side section-indicator** (dot navigation) that tracks the currently visible section
- **Dynamic page title** — `document.title` updates per section as you scroll
- **Back-to-top button** that appears after scrolling 300 px

### 🖼️ Animations
- **Typing tagline** cycling through five roles with a blinking cursor
- **Scroll-reveal cards** — cards animate in when entering the viewport (IntersectionObserver)
- Bootstrap 5 **project carousel** (5-second auto-play, pauses on hover)

### 🎵 Background Music Player
- On first visit a **consent modal** appears after a short delay, describing the recommended track
- A **rule-based recommender** (`music-recommender.js`) picks a contextually fitting song based on the visitor's current **season** (spring / summer / fall / winter) and **time of day** (day / night), rotating daily so repeat visitors hear the same track in one day
- Playback is handled by a **visually-hidden YouTube IFrame player** (audio only, volume 40%)
- A **floating ♪ toggle button** and a **now-playing badge** appear once the visitor opts in
- When a song finishes a **song-end modal** asks the visitor to either **↩ Replay** the same song or pick a **🎲 Next Song** (chosen randomly from the same season/time pool, excluding the current track)

### 📄 Content Sections
| Section | Description |
|---|---|
| About | Intro, typing tagline, diploma photo with hover overlay, link to Education page |
| Experience | Two experience cards — Course Instructor & Teaching Assistant roles |
| Projects | Carousel of 6 featured projects + always-visible project-card grid |
| Achievements | Four clickable cards linking to Certifications, Internship, Degree, and Community pages |
| Skills | Skill pills organised into Languages, Frameworks & Libraries, Databases & Tools |
| Resume | Lifted-image resume preview with Open and Download PDF buttons |
| Teaching & Content | Three YouTube playlist cards (App Dev Guides, Computational Thinking, Student Resources) |
| Blogs & Articles | Six blog/resource cards linking to Google Sites, LinkedIn articles, and GitHub repos |
| Podcasts & Activities | Two embedded YouTube podcast videos with descriptions |
| Contact | Four contact cards (Email, LinkedIn, GitHub, YouTube) + Google Forms "Send a message" button |

### ⚡ Performance & SEO
- `loading="lazy"` on all images
- `passive` scroll event listener
- Schema.org `Person` structured data for rich search results
- Open Graph & Twitter Card meta tags for social sharing
- Emoji SVG favicon (no image file required)
- `sitemap.xml` and `robots.txt` for search engine indexing

---

## 📬 Contact

| Platform | Link |
|---|---|
| ✉️ Email | [shrikrishnapandey72@gmail.com](mailto:shrikrishnapandey72@gmail.com) |
| 💼 LinkedIn | [shri-krishna-pandey](https://in.linkedin.com/in/shri-krishna-pandey) |
| 🐱 GitHub | [shrikrishna97](https://github.com/shrikrishna97) |
| 📺 YouTube | [@shri_krishna_pandey](https://www.youtube.com/@shri_krishna_pandey) |
| 📸 Instagram | [shri.krishna.p](https://www.instagram.com/shri.krishna.p/) |
| 🌐 Google Sites | [sites.google.com/view/shrikrishna97](https://sites.google.com/view/shrikrishna97) |

---

Built with ❤️ for students.
