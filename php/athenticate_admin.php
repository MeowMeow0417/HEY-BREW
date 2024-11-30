<?php
    //puts the user back to the login.page
    if(!isset($_SESSION['admin_email'])){
        header('Location: Manage-LogIn.php');
        exit();
    }

    $manage_user = $_SESSION['admin_username'];
?>