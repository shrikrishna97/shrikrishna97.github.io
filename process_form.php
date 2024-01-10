<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "shrikrishnapandey72@gmail.com";  // Replace with your email address
    $subject = "New Contact Form Submission";

    $headers = "From: $email";

    $mailBody = "Name: $name\nEmail: $email\n\n$message";

    // Send the email
    mail($to, $subject, $mailBody, $headers);
}
?>
