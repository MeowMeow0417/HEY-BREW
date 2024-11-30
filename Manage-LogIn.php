<?php
    include("php/config.php");
    include("php/connection.php");

    //Log-In connection
    if(isset(($_POST['logIn']))){
        $manage_user = mysqli_real_escape_string($conn, $_POST['username']);
        $manage = mysqli_real_escape_string($conn, $_POST['email']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);

        //Preparing SQL statemnt
        $admin = $conn ->prepare('SELECT id, admin_username ,admin_email, password FROM admin WHERE admin_email = ?');


        if ($admin){
            $admin -> bind_param('s', $manage);
            $admin -> execute();
            $result = $admin -> get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                // Verify the password
                if (password_verify($password, $row['password'])) {
                    // Debugging line
                    echo "Login successful! Redirecting...";
                    session_regenerate_id(true);
                    $_SESSION['valid'] = true;
                    $_SESSION['admin_email'] = $row['admin_email'];
                    $_SESSION['admin_username'] = $row['admin_username'];
                    $_SESSION['id'] = $row['id'];
                    header("Location: Manage-Products.php");
                    exit();
                } else {
                    echo "<div class='error'>Invalid email or password.</div>";
                }
            } else {
                echo "<div class='error'>No user found with that email.</div>";
            }
            $admin->close();
        } else {
            echo "<div class='error'>Failed to prepare statement.</div>";
        }
    }
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/manage-login.css">
    <title>manage - login</title>
</head>
<body>

    <div class="container">
        <form action="Manage-LogIn.php" method="POST">

            <h2>HEY BREW</h2>

            <!-- <label for="username">Username</label> -->
            <input type="email" id="email" name="email" autofill="off" placeholder="Enter Email"required>

            <!-- <label for="password">Password</label> -->
            <input type="password" id="password" name="password" autofill="off" placeholder="Enter Password" required>

            <button type="submit" name="logIn">Log In</button>

        </form>
    </div>
</body>
</html>