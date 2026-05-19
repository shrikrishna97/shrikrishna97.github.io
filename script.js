document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Bootstrap Carousel if the element exists
    var carouselEl = document.getElementById('projectCarousel');
    if (carouselEl) {
        new bootstrap.Carousel(carouselEl, {
            interval: 5000,
            pause: 'hover'
        });
    }

    // Initialize CodeMirror only if the target textarea exists
    var textarea = document.getElementById('code');
    if (textarea && typeof CodeMirror !== 'undefined') {
        var editor = CodeMirror.fromTextArea(textarea, {
            mode: 'javascript',
            theme: 'default',
            lineNumbers: true
        });
        editor.setValue('// Your code here');
    }

    // ── Section scroll indicator ──────────────────────────────────
    var sectionIds = ['about', 'experience', 'projects', 'achievement', 'skills-section', 'resume', 'youtube'];
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

    window.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
});

