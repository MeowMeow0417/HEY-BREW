<?php

    // Create a new MySQLi connection
    $conn = new mysqli('localhost', 'root', "", 'HEYBREW');

    // Check for connection errors


    // if ($conn->connect_error) {
    //     die("Connection failed: " . $conn->connect_error);
    // } else {
    //     echo "Connection successful!";
    // }

     // Enable error reporting for debugging
     ini_set('display_errors', 1);
     ini_set('display_startup_errors', 1);
     error_reporting(E_ALL);
?>
