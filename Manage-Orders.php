<?php

    include("php/config.php");
    include("php/connection.php");
    include("php/athenticate_admin.php");

    if(isset($_POST['products'])){
        header('Location: Manage-Products.php');
        exit();
    }

    if(isset($_POST['manage'])){
        header('Location: Manage-User.php');
        exit();
    }

    $sql = "SELECT
        c.client_id AS client_id,
        c.username AS client_username,
        o.order_id AS order_id,
        o.order_status AS status,
        o.created_at AS order_date_time
    FROM
        orders o
    JOIN
        clients c ON o.client_id = c.client_id
    ORDER BY
        o.created_at DESC;";

$result = mysqli_query($conn, $sql);

if ($result) {
    $client_orders = [];
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $client_orders[] = $row; // No grouping needed since we're displaying distinct orders
    }
} else {
    echo 'Error: ' . mysqli_error($conn);
}


?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/Manage-Orders.css">
    <title>Food Order System</title>
</head>
<body>
    <form action="Manage-Orders.php" method="POST">
        <div class="container">

                <div class="sidebar">
                <div class="profile-card" id="profile-card">
                    <img src="style/images/category-row/profile.jpg" alt="Admin Profile">
                    <div class="profile-info">
                        <h4><?php echo htmlspecialchars($manage_user); ?></h4>
                        <p>Seller</p>
                    </div>
                </div>
                    <nav>
                        <button class="nav-button" name="products" type="submit">
                            <img src="style/images/icons/package.png" alt="Package Icon" width="24" height="24">
                            Products
                        </button>
                        <button class="nav-button active" name="orders" type="submit">
                            <img src="style/images/icons/clipboard.png" alt="Package Icon" width="24" height="24">
                            Orders
                        </button>
                        <button class="nav-button" name="manage" type="submit">
                        <img src="style/images/icons/manage.png" alt="Package Icon" width="24" height="24">
                        Manage
                    </button>
                    <button class="logOut" name="logOut" type="submit">Log Out</button>
                    </nav>
                </div>

                <div class="main-content">
                    <h1>Food Order</h1>
                    <table class="customer-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date & Time </th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php if (!empty($client_orders)): ?>
                            <?php foreach ($client_orders as $order): ?>
                                <tr class="order-row"
                                    data-order-id="<?php echo htmlspecialchars($order['order_id']); ?>"
                                    onclick="showOrderDetails('<?php echo htmlspecialchars($order['order_id']); ?>')">
                                    <td><?php echo htmlspecialchars($order['order_id']); ?></td>
                                    <td>
                                        <div class="customer-info">
                                            <img src="style/images/products/auth.jpg" alt="Avatar" class="customer-avatar">
                                            <?php echo htmlspecialchars($order['client_username']); ?>
                                        </div>
                                    </td>
                                    <td><?php echo htmlspecialchars($order['order_date_time']); ?></td>
                                    <td>
                                        <select class="status-select" data-order-id="<?php echo htmlspecialchars($order['order_id']); ?>" data-status="<?php echo ucfirst($order['status']); ?>" onchange="updateOrderStatus(this)">
                                            <option value="pending" <?php echo $order['status'] === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                            <option value="completed" <?php echo $order['status'] === 'completed' ? 'selected' : ''; ?>>Completed</option>
                                            <option value="cancelled" <?php echo $order['status'] === 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="4">No orders found</td>
                            </tr>
                        <?php endif; ?>
                        </tbody>
                    </table>

                </div>


                <div class="detail-order">
                    <h2>Order Detail</h2>
                    <div id="orderDetails" class="detail-card">
                        <!-- Dynamically filled up by JS -->
                        <p>Select a customer to view order details</p>
                    </div>
                </div>
            </div>

    </form>


    <script src="script/client/Manage-Orders.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

</body>
</html>