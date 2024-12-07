<?php
    include("php/config.php");
    include("php/connection.php");
    include("php/athenticate_admin.php");

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

    if(isset($_POST['analytics'])){
        header('Location: Manage-Analytics.php');
        exit();
    }

    if(isset($_POST['logOut'])){
        error_log('Products button clicked.');

        header('Location: Manage-LogIn.php');
        session_destroy();
        exit();
    }


// Calls all admin accounts
    $query = 'SELECT id, admin_username, admin_email FROM admin';

    $result = mysqli_query($conn, $query);

    $client_data = []; // Initialize an empty array to store admin data

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $client_data[] = $row;
        }
    } else {
        echo'Error'. mysqli_error( $conn );
    }



if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve and sanitize form inputs
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    if (isset($_POST['signUp'])) {
        // Check if the email already exists
        $admin = $conn->prepare('SELECT * FROM admin WHERE admin_email = ?');
        $admin->bind_param('s', $email);
        $admin->execute();
        $result = $admin->get_result();

        if ($result->num_rows > 0) {
            // Email already exists
            $_SESSION['message'] = '<div class="error">This email is already in use. Please choose another one.</div>';
        } else {
            // Hash the password for security
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Prepare and execute the insert statement
            $admin = $conn->prepare("INSERT INTO admin (admin_username, admin_email, password) VALUES (?, ?, ?)");

            if ($admin === false) {
                $_SESSION['message'] = '<div class="error">Error preparing statement: ' . $conn->error . '</div>';
            } else {
                $admin->bind_param("sss", $username, $email, $hashedPassword);

                if ($admin->execute()) {
                    $_SESSION['message'] = '<div class="success">Registration successful!.</div>';
                } else {
                    $_SESSION['message'] = '<div class="error">Error: Could not complete registration. ' . $admin->error . '</div>';
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
         echo '<div class="success">User deleted successfully!</div>';
        } else {
          echo '<div class="error">Error: Unable to delete user.</div>';
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

        <div class="main-container">
                <!-- Side nav -->
                <div class="side-nav" id="side_nav">
                    <!--Profile cards-->
                    <div class="profile-card" id="profile-card">
                        <img src="style/images/category-row/profile.jpg" alt="Admin Profile">
                        <div class="profile-info">
                            <h4><?php echo htmlspecialchars($manage_user); ?></h4>
                            <p>Seller</p>
                        </div>
                    </div>
                    <!-- navigation buttons -->
                    <form action="Manage-User.php" method="POST">
                        <div class="button-col">
                            <button class="nav-button" name="products" type="submit" >
                                <img src="style/images/icons/package.png" alt="Package Icon" width="24" height="24">
                                Products
                            </button>
                            <button class="nav-button" name="orders" type="submit">
                                <img src="style/images/icons/clipboard.png" alt="Package Icon" width="24" height="24">
                                Orders
                            </button>
                            <button class="nav-button active" name="manage" type="submit">
                                <img src="style/images/icons/manage.png" alt="Package Icon" width="24" height="24">
                                Manage
                            </button>
                            <button class="nav-button" name="analytics" type="submit">
                                <img src="style/images/icons/analytics.png" alt="Analytics Icon" width="24" height="24"> Analytics
                            </button>
                            <button class="logOut" name="logOut" type="submit">Log Out</button>
                        </div>
                    </form>
                </div>

                <!-- container -->
                <div class="profile-container" id="profile-container">

                    <button class="open-add-user" id="openUserModal">Add New Admin</button>

                    <!-- for viewing admins -->
                    <div class="container-table">
                        <h2>User List</h2>


                        <div class="table" id="table">
                            <div class="table-header" id="table-header">
                                <div class="table_id">ID</div>
                                <div class="table_name">Username</div>
                                <div class="table_email">Email</div>
                                <div class="table_action">Action</div>
                            </div>
                    </div>


                        <?php foreach ($client_data as $admin): ?>
                            <div class="table-data" id="table-data">
                            <div class="data-id"><?php echo $admin['id']; ?></div>
                            <div class="data-name"><?php echo $admin['admin_username']; ?></div>
                            <div class="data-email"><?php echo $admin['admin_email']; ?></div>
                                <div class="data-action">
                                    <button class="btn btn-danger" data-toggle="modal" data-target="#deleteModal" data-id="<?php echo $admin['id']; ?>">Delete</button>
                                </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
        </div>


            <!-- Delete Modal -->
            <div class="delete-user modal" id="deleteModal" >
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modal-title">Confirm Delete</h5>
                                <a href="#" class="close" id="closeDeleteModal"><i class="fa-solid fa-xmark"></i></a>

                            </div>
                            <div class="modal-body">
                                Are you sure you want to delete this user?
                            </div>
                            <form method="POST" id="deleteForm">
                            <div class="modal-footer">

                                    <input type="hidden" name="delete_id" id="delete_id">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-danger">Delete</button>
                            </div>
                            </form>
                        </div>
            </div>

            <form action="Manage-User.php" method="POST">
                <!-- Add NEW User Modal -->
                <div class="user-modal" id="user-modal">
                    <div class="add-container">
                    <div class="modal-header">
                                <h5 class="modal-title" id="modal-title">Add new Admin</h5>
                                <a href="#" class="close" id="closeUserModal"><i class="fa-solid fa-xmark"></i></a>
                            </div>
                        <label for="email">Email </label>
                        <input type="email" id="email" placeholder="Email" autofill="off" name="email" required>

                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" autofill="off" placeholder="Enter Username" required>

                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" autofill="off" placeholder="Enter Password" required>

                        <button type="submit" class="signUp" name="signUp">Add User</button>
                    </div>
                </div>
            </form>

    <script src="script/client/admin/Manage-User.js"></script>
</body>
</html>