<?php

    include("php/config.php");
    include("php/connection.php");


    // sign-UP connection
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        // Retrieve and sanitization of form inputs
        $username = trim($_POST['username']);
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = trim($_POST['password']);

        // Validate username length and characters
        if (isset($_POST['signUp'])) {
            if (!preg_match('/^[a-zA-Z0-9]{5,15}$/', $username)) {
                echo '<div class="error">Username must be 5-15 characters long and contain only letters and numbers.</div>';
                exit();
            }

            //error prevenetion when signingIn
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';

            //Checks if the email already exists
            $client = $conn -> prepare('SELECT * FROM clients WHERE email = ?');
            $client -> bind_param('s', $email);
            $client -> execute();
            $result = $client -> get_result();

            if ($result->num_rows > 0) {
                echo '<div class="error">This email is already in use. Please choose another one.</div>';
            } else {
                // Hash the password for security
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                // Prepare and execute the insert statement
                $client = $conn->prepare("INSERT INTO clients (username, email, password) VALUES (?, ?, ?)");

                if ($client === false) {
                    $message = "Error preparing statement: " . $conn->error; // Error preparing statement
                } else {
                    $client->bind_param("sss", $username, $email, $hashedPassword);

                    if ($client->execute()) {
                        echo '<div class="success">Registration successful!</div>';
                    } else {
                        echo '<div class="error">Error: Could not complete registration. ' . $client->error . '</div>';
                    }

                    $client->close();
                }
            }
        }

    }

    //sign-In or login connection
    if (isset($_POST['signIn'])){
        $username = mysqli_real_escape_string($conn, $_POST['username']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);

        //Prepare the SQL statement
        $client = $conn ->prepare('SELECT client_id, username, password FROM clients WHERE username = ?');

        if ($client){
            $client -> bind_param('s', $username);
            $client -> execute();
            $result = $client -> get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                // Verify the password
                if (password_verify($password, $row['password'])) {
                    // Debugging line
                    echo "Login successful! Redirecting...";
                    session_regenerate_id(true);
                    $_SESSION['valid'] = true;
                    $_SESSION['username'] = $row['username'];
                    $_SESSION['client_id'] = $row['client_id'];
                    header("Location: index.php");
                    exit();
                } else {
                    echo "<div class='error'>Invalid email or password.</div>";
                }
            } else {
                echo "<div class='error'>No user found with that email.<br><br>
                      <a href='manageSignUp.php' style='color: #8B4513; text-decoration: underline;'>Sign up as admin instead?</a></div>";
            }
            $client->close();
        } else {
            echo "<div class='error'>Failed to prepare statement.</div>";
        }
    }


    $conn -> close();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hey Brew Hideout Cafe - Sign In/Up</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="style/client/signUp.css">
</head>
<body>

    <div class="container" id="container">


        <div class="form-container sign-up">
            <form action="signUp-In.php" method="POST" id="signUpForm">
                <h2>Sign Up</h2>
                <span>or use your email for registration</span>
                <input type="email" placeholder="Email" name="email" required>
                <input type="text" placeholder="Username" name="username" pattern="^[a-zA-Z0-9]{5,15}$" title="Username must be 5-15 characters long and contain only letters and numbers" required>
                <input type="password" placeholder="Password" name="password" required>
                <button type="submit" name="signUp">SIGN UP</button>
            </form>
        </div>
        <div class="form-container sign-in">
            <form action="signUp-In.php" method="POST">
                <h2>Sign In</h2>
                <span>or use your email & password</span>
                <input type="text" placeholder="Username" name="username"  required>
                <input type="password" placeholder="Password" name="password" required>
                <a href="#">Forgot Password?</a>
                <button type="submit" name="signIn">SIGN IN</button>
            </form>
        </div>




    <div class="toggle-container">
        <div class="toggle">
            <div class="toggle-panel toggle-left">
                <h2>Welcome Back!</h2>
                <p>A perfect place to hangout and catch up!</p>
                <button class="hidden" id="login">SIGN IN</button>
            </div>
            <div class="toggle-panel toggle-right">
                <h2>Hey Brew HideOut!</h2>
                <p>A perfect place to hangout and catch up!</p>
                <button class="hidden" id="register">SIGN UP</button>
            </div>
        </div>
    </div>
</div>
    <script src="script/client/signUp-In.js"></script>
</body>
</html>