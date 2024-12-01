<?php
    include("php/config.php");
    include("php/connection.php");
    include("php/authenticate_client.php");

    if(isset($_POST['back'])){
        header('Location: Client-HomePage.php');
        exit();
    }

    if(isset($_POST['logOutBtn'])){
        header('Location: Client-HomePage.php');
        session_destroy();
        exit();
    }

?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Profile</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="style/client/Client-Profile.css">
</head>
<body>
    <form action="Client-Profile.php" method="POST">
         <div class="container">


        <div class="top-bar" id="top-bar">
        <button class="back" name="back" id="back"><i class="fa-solid fa-caret-left"></i></button>


            <div class="profile-header">
                <div class="profile-info">
                    <img src="style/images/products/auth.jpg" alt="Customer profile" class="profile-image">
                    <div class="profile-name">
                        <h1><?php echo htmlspecialchars($username) ?></h1>
                        <p>CUSTOMER ID</p>
                    </div>
                </div>
                <div class="profile-details">
                    <div class="info-row">
                        <p>Email:</p>
                        <span> <!-- <?php echo htmlspecialchars($email)?> --> </span>
                    </div>
                    <div class="info-row">
                        <p>Password:</p>
                        <div class="password-field">
                            <span id="password">••••••••••</span>
                            <button id="togglePassword"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


            <div class="order-history">
                <div class="order-header">
                    <h2>Order History</h2>
                    <button id="logOutBtn" name="logOutBtn" class="logOutBtn">Log Out</button>
                </div>
                <table class="Order-Table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>No. of orders</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody id="orderTableBody">
                        <!-- Order rows will be inserted here by JavaScript -->
                    </tbody>
                </table>
            </div>

            <!-- RECEIPT -->
            <div class="receipt">
                <h1>Receipt</h1>
                <div class="order-info">
                    <div class="order-id">
                        <span>Order ID</span>
                        <span class="id-number">696969</span>
                    </div>
                    <div class="order-time">
                        <span>Order Time</span>
                        <span>November 11, 2024 at 3:30 PM</span>
                    </div>
                </div>

                <div class="product-column">

                    <div class="product-section">
                        <img src="style/images/bg/drinksBg.png" alt="Coffee cup" class="product-image">
                            <div class="product-details">
                            <p>Name: </p>
                            <p>Size: </p>
                            <p>Type: </p>
                            </div>
                            <div class="details">
                            <p>AddOns: </p>
                            <p>Qty: </p>
                            <p>₱ </p>
                            </div>
                    </div>

                <div class="total-section">
                    <span>Total:</span>
                    <span class="total-amount">₱69.0</span>
                </div>
            </div>


    </div>
    </form>

    <script src="script/client/Client-Profile.js"></script>
</body>
</html>