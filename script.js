    // // Function to display the confirmation dialog
    // function checkRobot() {
    //     // Display a confirmation dialog
    //     var isRobot = window.confirm("Are you a robot?");
        
    //     // Check the user's response
    //     if (isRobot) {
    //         alert("Thank you for confirming that you are not a robot.");
    //     } else {
    //         alert("Sorry, we suspect you might be a robot.");
    //     }
    // }   
    // Get the textarea element
    var textarea = document.getElementById("code");

    // Initialize CodeMirror
    var editor = CodeMirror.fromTextArea(textarea, {
        mode: "javascript", // Specify the mode (e.g., JavaScript)
        theme: "default",   // Specify the theme (you can customize or use built-in themes)
        lineNumbers: true,  // Show line numbers
    });

    // Set initial code content (optional)
    editor.setValue("// Your code here");

       // Initialize the Carousel component
       var projectCarousel = new bootstrap.Carousel(document.getElementById('projectCarousel'), {
        interval: 5000, // Set the interval (in milliseconds) between slides
        pause: 'hover' // Pause the carousel on hover (optional)
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Function to handle button click and navigate to another page
        document.getElementById('golden-button').addEventListener('click', function() {
            // Replace 'educ.html' with the URL of the page you want to navigate to
            window.location.href = 'educ.html';
        });
    });
    
