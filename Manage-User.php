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


    // calls all admin accounts
    $result = $conn -> query('SELECT * FROM admin');

    //Create new user/admin
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        // Retrieve and sanitization of form inputs
        $username = isset($_POST['username']) ? trim($_POST['username']) : '';
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';

        if(isset($_POST['signUp'])){

            //error prevenetion when signingIn
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';

            //Checks if the email already exists
            $admin = $conn -> prepare('SELECT * FROM admin WHERE admin_email = ?');
            $admin -> bind_param('s', $email);
            $admin -> execute();
            $result = $admin -> get_result();

            if ($result->num_rows > 0) {
              //  echo '<div class="error">This email is already in use. Please choose another one.</div>';
            } else {
                // Hash the password for security
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                // Prepare and execute the insert statement
                $admin = $conn->prepare("INSERT INTO admin (admin_username, admin_email, password) VALUES (?, ?, ?)");

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

    //For handling deletion
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
        $delete_id = $_POST['delete_id'];

        $stmt = $conn->prepare("DELETE FROM admin WHERE id = ?");
        $stmt->bind_param('i', $delete_id);

        if ($stmt->execute()) {
          //  echo '<div class="success">User deleted successfully!</div>';
        } else {
          //  echo '<div class="error">Error: Unable to delete user.</div>';
        }

        $stmt->close();
    }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/manageUser.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
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

                <!-- container -->
                <div class="profile-container" id="profile-container">

                    <button class="open-add-user" id="add-user">Add User</button>

                    <!-- for viewing admins -->
                    <div class="container-table">
                        <h2>User List</h2>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while($row = $result->fetch_assoc()): ?>
                                    <tr>
                                        <td><?php echo $row['id']; ?></td>
                                        <td><?php echo $row['admin_username']; ?></td>
                                        <td><?php echo $row['admin_email']; ?></td>
                                        <td>
                                            <button class="btn btn-danger" data-toggle="modal" data-target="#deleteModal" data-id="<?php echo $row['id']; ?>">Delete</button>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>


            <!-- WRITE after getting home-->

            <!-- Delete Modal -->
            <div class="delete-user modal" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modal-title">Confirm Delete</h5>
                                <a href="#" class="close"><i class="fa-solid fa-xmark"></i></a>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                Are you sure you want to delete this user?
                            </div>
                            <div class="modal-footer">
                                <form method="POST" id="deleteForm">
                                    <input type="hidden" name="delete_id" id="delete_id">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-danger">Delete</button>
                                </form>
                            </div>
                        </div>
                </div>

                <!-- User Modal -->
                <div class="user-modal" id="user-modal">
                    <div class="add-container">
                    <div class="modal-header">
                                <h5 class="modal-title" id="modal-title">Add new User</h5>
                                <a href="#" class="close"><i class="fa-solid fa-xmark"></i></a>
                            </div>
                        <label for="email">Email </label>
                        <input type="email" id="email" placeholder="Email" name="email">

                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" autofill="off" placeholder="Enter Username">

                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" autofill="off" placeholder="Enter Password">

                        <button type="submit" class="signUp"name="signUp">Add User</button>
                    </div>
                </div>

    </form>
    <script href="script/client/admin/delete.js"></script>
</body>
</html>