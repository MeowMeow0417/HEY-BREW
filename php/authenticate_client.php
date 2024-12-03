<?php
    // Check if the user is logged in and client_id is set
if (isset($_SESSION['client_id'])) {
    $client_id = $_SESSION['client_id'];
} else {
    // Redirect to login page if not logged in
    header('Location: signUp-In.php');
    exit();
}

// Now you can use $client_id in your script
    $username = $_SESSION['username'];
    $client_id = $_SESSION['client_id']; // Retrieve client_id from the session

?>