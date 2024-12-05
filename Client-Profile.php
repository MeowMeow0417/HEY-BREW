<?php
include("php/config.php");
include("php/connection.php");
include("php/authenticate_client.php");

if (isset($_POST['back'])) {
    header('Location: index.php');
    exit();
}

if (isset($_POST['logOutBtn'])) {
    header('Location: index.php');
    session_destroy();
    exit();
}

$client_id = $_SESSION['client_id'];

$query = "SELECT order_id, client_id, total_price, order_status, created_at FROM orders";
$result = mysqli_query($conn, $query);

// Initialize receipts array to prevent undefined variable error
$receipts = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $receipts[] = $row; // Append each row to the receipts array
    }
} else {
    echo "Error: " . mysqli_error($conn);
}

// Filter receipts to show only those belonging to the logged-in user
$userReceipts = array_filter($receipts, function ($receipt) use ($client_id) {
    // Use loose comparison (==) to account for type differences
    return $receipt['client_id'] == $client_id;
});





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



            <div class="profile-header">
                <div class="profile-info">
                <button class="back" name="back" id="back"><i class="fa-solid fa-caret-left"></i></button>
                    <img src="style/images/products/auth.jpg" alt="Customer profile" class="profile-image">
                    <div class="profile-name">
                        <h1><?php echo htmlspecialchars($username) ?></h1>
                        <p>CUSTOMER ID</p>
                    </div>
                </div>
            </div>
        </div>

            <!-- Order History -->
            <div class="order-history">
                <div class="order-column" id="order-column">
                    <div class="order-header">
                        <h2>Order History</h2>
                        <button id="logOutBtn" name="logOutBtn" class="logOutBtn">Log Out</button>
                    </div>
                    <div class="headings">
                        <div class="heading-1">Order Id</div>
                        <div class="heading-2">Date and Time</div>
                        <div class="heading-3">Total Price</div>
                        <div class="heading-4">Status</div>
                    </div>
                </div>

                <div class="order-scroll">
                        <!-- Dynamically added order-receipts-->
                    <?php if (!empty($userReceipts)): ?>
                        <?php foreach($userReceipts as $product):?>
                            <div class="order-receipt" id="order-receipt">
                                    <div class="Order-Id"><?php echo htmlspecialchars($product['order_id']) ?></div>
                                    <div class="Date-time"><?php echo htmlspecialchars($product['created_at']) ?></div>
                                    <div class="total-price">₱ <?php echo htmlspecialchars($product['total_price']) ?></div>
                                    <div class="order_status"><?php echo htmlspecialchars($product['order_status']) ?></div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p>No Receipts found for your Account</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- RECEIPT -->
            <div class="receipt-modal" id="receipt-modal">
            <h1>Receipt</h1>
                <div class="order-info">
                    <div class="order-id">
                        <span>Order ID</span>
                        <span class="id-number"></span>
                    </div>
                    <div class="order-time">
                        <span>Order Time</span>
                        <span></span>
                    </div>
                </div>
                <div class="product-column">
                     <!-- Dynamically populated by JS -->
                </div>
                <div class="total-section">
                    <span>Total:</span>
                    <span class="total-amount"></span>
                </div>
            </div>
        </div>
    </div>
    </form>

    <script src="script/client/Client-Profile.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</body>
</html>