<?php
    include("php/config.php");
    include("php/connection.php");

    //puts the user back to the login.page
    if(!isset($_SESSION['admin_email'])){
        header('Location: Manage-LogIn.php');
        exit();
     }

    //for the admin side
    $manage = $_SESSION['admin_username'];

    if(isset($_POST['addProd'])){
        header('Location: addProd.php');
        exit();
    }

    if(isset($_POST['products'])){
        header('Location: Manage-Products.php');
        exit();
    }

    if(isset($_POST['orders'])){
        header('Location: Manage-Orders.php');
        exit();
    }

    if(isset($_POST['manage'])){
        header('Location: Manage-User.php');
        exit();
    }

    if(isset($_POST['logOut'])){
        header('Location: Manage-LogIn.php');
        session_destroy();
        exit();
    }

    // sign-UP connection
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        // Retrieve and sanitization of form inputs
        $username = trim($_POST['username']);
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = trim($_POST['password']);

        if(isset($_POST['signUp'])){

            //error prevenetion when signingIn
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';

            //Checks if the email already exists
            $admin = $conn -> prepare('SELECT * FROM admin WHERE email = ?');
            $admin -> bind_param('s', $email);
            $admin -> execute();
            $result = $admin -> get_result();

            if ($result->num_rows > 0) {
              //  echo '<div class="error">This email is already in use. Please choose another one.</div>';
            } else {
                // Hash the password for security
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                // Prepare and execute the insert statement
                $admin = $conn->prepare("INSERT INTO admin (admin_username, email, password) VALUES (?, ?, ?)");

                if ($admin === false) {
                    $message = "Error preparing statement: " . $conn->error; // Error preparing statement
                } else {
                    $admin->bind_param("sss", $username, $email, $hashedPassword);

                    if ($admin->execute()) {
                       echo '<div class="success">Registration successful!</div>';
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
    <link rel="stylesheet" href="style/management/manageUser.css">
    <title>Manage - User</title>
</head>
<body>
    <form action="Manage-User.php" method="POST">
        <div class="main-container">
                <!-- Side nav -->
                <div class="side-nav" id="side_nav">
                    <!--Profile cards-->
                    <div class="profile-card" id="profile-card">
                        <img src="images/src/auth.jpg" alt="Admin Profile">
                        <div class="profile-info">
                            <h4><?php echo htmlspecialchars($manage); ?></h4>
                            <p>Seller</p>
                        </div>
                    </div>
                    <!-- navigation buttons -->
                    <div class="button-col">
                        <button class="nav-button active" name="products" type="submit" >
                            <img src="style/images/icons/package.png" alt="Package Icon" width="24" height="24">
                            Products
                        </button>
                        <button class="nav-button" name="orders" type="submit">
                            <img src="style/images/icons/clipboard.png" alt="Package Icon" width="24" height="24">
                            Orders
                        </button>
                        <button class="nav-button" name="manage" type="submit">
                            <img src="style/images/icons/exit.png" alt="Package Icon" width="24" height="24">
                            Manage
                        </button>
                        <button class="logOut" name="logOut" type="submit">Log Out</button>
                    </div>
                </div>

                <!-- User Management -->
                <div class="user-container" id="user-container">
                    <div class="add-container">
                        <label for="email">Email </label>
                        <input type="email" id="email" placeholder="Email" name="email">

                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" autofill="off" placeholder="Enter Username">

                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" autofill="off" placeholder="Enter Password">

                        <button type="submit" name="signUp">Add User</button>
                    </div>
                </div>

        </div>
    </form>
</body>
</html>