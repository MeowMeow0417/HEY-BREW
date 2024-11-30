<?php
include("php/config.php");
include("php/connection.php");
include("php/athenticate_admin.php");

// Check if any admin already exists
$adminExists = $conn->prepare('SELECT * FROM admin LIMIT 1');
$adminExists->execute();
$result = $adminExists->get_result();

// If an admin exists, redirect to login or show a message
if ($result->num_rows > 0) {
    echo '<div class="error">Admin account already exists. Please <a href="manageLogIn.php">log in here</a>.</div>';
    exit(); // Stop script execution to prevent showing the form
}

// sign-up logic
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve and sanitize form inputs
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (isset($_POST['signUp'])) {
        // Check if the email already exists
        $admin = $conn->prepare('SELECT * FROM admin WHERE email = ?');
        $admin->bind_param('s', $email);
        $admin->execute();
        $result = $admin->get_result();

        if ($result->num_rows > 0) {
            echo '<div class="error">This email is already in use. Please choose another one.</div>';
        } else {
            // Hash the password for security
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insert new admin into the database
            $admin = $conn->prepare("INSERT INTO admin (admin_username, email, password) VALUES (?, ?, ?)");

            if ($admin === false) {
                echo "Error preparing statement: " . $conn->error;
            } else {
                $admin->bind_param("sss", $username, $email, $hashedPassword);

                if ($admin->execute()) {
                    echo '<div class="success">Registration successful!</div>';
                    header('Location: manageLogIn.php'); // Redirect to login page
                    exit();
                } else {
                    echo '<div class="error">Error: Could not complete registration. ' . $admin->error . '</div>';
                }

                $admin->close();
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Sign Up</title>
</head>
<body>
    <div class="container">
        <form action="manageSignUp.php" method="POST">
            <h2>HEY BREW - Admin Sign Up</h2>

            <input type="email" id="email" placeholder="Email" name="email" required>

            <input type="text" id="username" name="username" placeholder="Enter Username" required>

            <input type="password" id="password" name="password" placeholder="Enter Password" required>

            <button type="submit" name="signUp">Sign Up</button>
        </form>
    </div>
</body>
</html>
