<?php

    include("php/config.php");
    include("php/connection.php");
    include("php/athenticate_admin.php");

    if(isset($_POST['products'])){
        header('Location: Manage-Products.php');
        exit();
    }

    $sql =' SELECT
    c.username AS Customer,
    p.product_name AS "Order",
    o.created_at AS "Date",
    o.order_status AS "Status"
    FROM
    orders o
    JOIN
    clients c ON o.client_id = c.client_id  -- Make sure "id" exists in clients table
    JOIN
    products p ON o.product_id = p.product_id  -- Make sure "product_id" exists in products table
    ORDER BY
    o.created_at DESC;
    ';


    $result = mysqli_query($conn, $sql);

    if ($result){
        $data = [];
        while($row = mysqli_fetch_array($result)){
            $client_orders[] = $row;
        }
    }else {
        echo 'Error'. mysqli_error($conn);
    }



?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/Admin-Order-Section.css">
    <title>Food Order System</title>
</head>
<body>
    <form action="Manage-Orders.php" method="POST">
        <div class="container">

                <div class="sidebar">
                <div class="profile-card" id="profile-card">
                    <img src="images/src/auth.jpg" alt="Admin Profile">
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
                        <img src="style/images/icons/exit.png" alt="Package Icon" width="24" height="24">
                        Manage
                    </button>
                    <button class="logOut" name="logOut" type="submit">Log Out</button>
                    </nav>
                </div>

                <div class="main-content">
                    <h1>Food Order</h1>
                    <table id="orderTable">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>


                            <tr class="customer-row" data-customer-id="1">
                                <td>
                                    <div class="customer-info">
                                        <img src="style/images/products/auth.jpg" alt="Boss Seth" class="customer-avatar">
                                        <?php echo htmlspecialchars('Customer')?>
                                    </div>
                                </td>
                                <td>
                                    Sinigang na Toothpaste
                                    <br>
                                    <small>Rice Meal</small>
                                </td>
                                <td>Walk - In</td>
                                <td>
                                    <select class="status-select" data-customer-id="1">
                                        <option value="Preparing" selected>Preparing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div class="detail-order">
                    <h2>Order Detail</h2>
                    <div id="orderDetails" class="detail-card">
                        <p>Select a customer to view order details</p>
                    </div>
                </div>
            </div>

    </form>


    <script src="script/client/Admin-Order-Section.js"></script>
</body>
</html>