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
});

