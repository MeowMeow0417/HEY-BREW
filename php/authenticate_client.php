<?php
     // Check if the user is logged in
    if (!isset($_SESSION['username'])) {
        // Redirect to login page if not authenticated
        header("Location: signUp-In.php");
        exit();
    }

    $username = $_SESSION['username'];
?>