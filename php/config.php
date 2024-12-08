<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '', // Set your domain if needed
    'secure' => true, // Set to true if using HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start(); // Start the session
?>