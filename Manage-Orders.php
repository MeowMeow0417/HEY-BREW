<?php

    include("php/config.php");
    include("php/connection.php");
    include("php/athenticate_admin.php");

    if(isset($_POST['products'])){
        header('Location: Manage-Products.php');
        exit();
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
                    <div class="seller-info">
                        <img src="style/images/products/auth.jpg" alt="Seller Avatar" class="seller-avatar">
                        <div class="seller-name">
                            <span>Boss D
                            <br><a> Seller</a></span>
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
                    </nav>
                </div>

                <div class="main-content">
                    <h1>Food Order</h1>
                    <table id="orderTable">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Order</th>
                                <th>Payment</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="customer-row" data-customer-id="1">
                                <td>
                                    <div class="customer-info">
                                        <img src="style/images/products/auth.jpg" alt="Boss Seth" class="customer-avatar">
                                        Boss Seth
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
                            <tr class="customer-row" data-customer-id="2">
                                <td>
                                    <div class="customer-info">
                                        <img src="style/images/products/auth.jpg" alt="Boss Seth" class="customer-avatar">
                                        Boss Seth
                                    </div>
                                </td>
                                <td>
                                    Adobong Medyas
                                    <br>
                                    <small>Rice Meal</small>
                                </td>
                                <td>Walk - In</td>
                                <td>
                                    <select class="status-select" data-customer-id="2">
                                        <option value="Preparing">Preparing</option>
                                        <option value="Completed" selected>Completed</option>
                                    </select>
                                </td>
                            </tr>
                            <tr class="customer-row" data-customer-id="3">
                                <td>
                                    <div class="customer-info">
                                        <img src="style/images/products/auth.jpg" alt="Boss Seth" class="customer-avatar">
                                        Boss Seth
                                    </div>
                                </td>
                                <td>
                                    Sinangag na Chocolate
                                    <br>
                                    <small>Rice Meal</small>
                                </td>
                                <td>Walk - In</td>
                                <td>
                                    <select class="status-select" data-customer-id="3">
                                        <option value="Preparing" selected>Preparing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-order">
                    <h2>Detail Order</h2>
                    <div id="orderDetails" class="detail-card">
                        <p>Select a customer to view order details</p>
                    </div>
                </div>
            </div>

    </form>


    <script src="script/client/Admin-Order-Section.js"></script>
</body>
</html>