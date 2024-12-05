<?php

    include("php/config.php");
    include("php/connection.php");

    include("php/athenticate_admin.php");


    if(isset($_POST['addProd'])){
        header('Location: addProd.php');
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

    // for the product list
   // Initialize product array
   $products = [];

   // Query to fetch products with their prices
   $query = "SELECT
               p.product_id,
               p.image_path,
               p.product_name,
               p.category,
               p.type,
               p.add_ons,
               pp.size,
               pp.price
           FROM
               products p
           JOIN
               product_prices pp ON p.product_id = pp.product_id
           ORDER BY p.product_id, FIELD(pp.size, 'small', 'medium', 'large')";

   $result = mysqli_query($conn, $query);

   if ($result) {
       while ($row = mysqli_fetch_assoc($result)) {
           $products[$row['product_id']]['details'] = $row; // Store product details
           $products[$row['product_id']]['prices'][] = $row; // Store prices by size
       }
   } else {
       echo "Error: " . mysqli_error($conn);
   }

    // for showing the selected category
    $category = isset($_GET['category']) ? $_GET['category'] : 'espresso';  // Get the category from the URL

    /// Filter products based on the selected category
    $filteredProducts = array_filter($products, function($product) use ($category) {
        return $product['details']['category'] === $category; // Adjust this condition based on how your categories are defined
    });

    //deleting products
    if(isset($_POST['delete'])){
        $productName = $_POST['inputDelete'];

        // First, get the product_id
        $getProductId = $conn->prepare("SELECT product_id FROM products WHERE product_name = ?");
        $getProductId->bind_param("s", $productName);
        $getProductId->execute();
        $result = $getProductId->get_result();
        $product = $result->fetch_assoc();
        $getProductId->close();

        if ($product) {
            // Start transaction
            $conn->begin_transaction();

            try {
                // First delete from product_prices
                $deletePrices = $conn->prepare("DELETE FROM product_prices WHERE product_id = ?");
                $deletePrices->bind_param("i", $product['product_id']);
                $deletePrices->execute();
                $deletePrices->close();

                // Then delete from order_items
                $deleteOrderItems = $conn->prepare("DELETE FROM order_items WHERE product_id = ?");
                $deleteOrderItems->bind_param("i", $product['product_id']);
                $deleteOrderItems->execute();
                $deleteOrderItems->close();

                // Finally delete the product
                $deleteProduct = $conn->prepare("DELETE FROM products WHERE product_id = ?");
                $deleteProduct->bind_param("i", $product['product_id']);
                $deleteProduct->execute();

                if ($deleteProduct->affected_rows > 0) {
                    $conn->commit();
                    echo "
                    <div class='alert' id='alertBox'>
                        <div class='overlay' onclick='hideAlert()'></div>
                        <div class='alert-box'>
                            Product '<span id=\"alert-product-name\">$productName</span>' deleted successfully.
                            <button onclick='hideAlert()'>OK</button>
                        </div>
                    </div>";
                } else {
                    throw new Exception("No product found with the name '$productName'");
                }
                $deleteProduct->close();

            } catch (Exception $e) {
                $conn->rollback();
                echo "
                <div class='alert'>
                    <div class='overlay' onclick='hideAlert()'></div>
                    <div class='alert-box'>
                        Error: " . $e->getMessage() . "
                        <button onclick='hideAlert()'>OK</button>
                    </div>
                </div>";
            }
        } else {
            echo "
            <div class='alert'>
                <div class='overlay' onclick='hideAlert()'></div>
                <div class='alert-box'>
                    No product found with the name '$productName'.
                    <button onclick='hideAlert()'>OK</button>
                </div>
            </div>";
        }
    }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/manage-Products.css">
    <link rel="stylesheet" href="style/management/manage-floats/manage-floats.css">
    <title>Management</title>
</head>
<body>
    <form action="Manage-Products.php" method="POST">
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
                        <img src="style/images/icons/manage.png" alt="Package Icon" width="24" height="24">
                        Manage
                    </button>
                    <button class="logOut" name="logOut" type="submit">Log Out</button>
                </div>
            </div>

            <!-- Main content -->
            <div class="product-container">
                <nav class="top-nav">
                    <ul>
                        <li><a href="?category=espresso" class="categories active">Espresso</a></li>
                        <li><a href="?category=blendedBev" class="categories">Blended Beverages</a></li>
                        <li><a href="?category=tea" class="categories">Tea</a></li>
                        <li><a href="?category=riceM" class="categories">Rice Meals</a></li>
                        <li><a href="?category=pasta" class="categories">Pasta</a></li>
                        <li><a href="?category=snacks" class="categories">Snacks</a></li>
                        <!-- Animated selection indicator -->
                        <div class="animation"></div>
                    </ul>
                    <button class="addProd" name="addProd" type="submit">Add Product</button>
                </nav>

                <!-- Products displayed in a grid -->
                <div class="productLine">
                    <?php if ($filteredProducts): ?>
                        <?php foreach ($filteredProducts as $product): ?>
                            <div class="product-card">
                                <img src="<?php echo htmlspecialchars($product['details']['image_path']); ?>" alt="<?php echo htmlspecialchars($product['details']['product_name']); ?>">
                                <div class="product-info">
                                    <h4><?php echo htmlspecialchars($product['details']['product_name']); ?></h4>
                                    <div class="detail-grid">
                                        <div class="product-details">

                                            <!-- Type Dropdown -->
                                            <div class="detail">
                                                <label for="type_<?php echo $product['details']['product_id']; ?>">Type</label>
                                                <select id="type_<?php echo $product['details']['product_id']; ?>" name="type">
                                                    <?php $types = explode(',', $product['details']['type']);
                                                    foreach ($types as $type) {
                                                        echo "<option value='" . htmlspecialchars(trim($type)) . "'>" . htmlspecialchars(trim($type)) . "</option>";
                                                    }?>
                                                </select>
                                            </div>

                                            <!-- Add-Ons Dropdown -->
                                            <div class="detail">
                                                <label for="addOn_<?php echo $product['details']['product_id']; ?>">Add Ons</label>
                                                <select id="addOn_<?php echo $product['details']['product_id']; ?>" name="add_on">
                                                    <option value="">None</option>
                                                    <?php $addOns = explode(',', $product['details']['add_ons']);
                                                    foreach ($addOns as $addOn) {
                                                        echo "<option value='" . htmlspecialchars(trim($addOn)) . "'>" . htmlspecialchars(trim($addOn)) . "</option>";
                                                    }?>
                                                </select>
                                            </div>

                                            <!-- Size & Price Dropdown -->
                                            <div class="detail">
                                                <label for="size_<?php echo $product['details']['product_id']; ?>">Size & Price</label>
                                                <select id="size_<?php echo $product['details']['product_id']; ?>" name="size_price">
                                                    <?php foreach ($product['prices'] as $priceInfo) {
                                                        echo "<option value='" . htmlspecialchars($priceInfo['size']) . "'>" .
                                                            htmlspecialchars(ucfirst($priceInfo['size'])) .
                                                            " - ₱" . htmlspecialchars(number_format($priceInfo['price'], 2)) .
                                                            "</option>";
                                                    }?>
                                                </select>
                                            </div>

                                            <div class="buttons">
                                                <form method="POST" action="manage.php">
                                                    <input type="hidden" name="product_name" value="<?php echo htmlspecialchars($product['details']['product_name']); ?>">
                                                    <button class="delete" name="delete" type="button" onclick="showDeletePrompt('<?php echo htmlspecialchars($product['details']['product_name']); ?>')">Delete</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>

                    <?php else: ?>
                        <p>No products found.</p>
                    <?php endif; ?>
                </div>
            </div>


           <!-- Delete Prompt -->
            <div class="overlay" onclick="hideDeletePrompt()">
                <div class="delete-prompt">
                    <h6>Are you sure you want to delete this product?</h6>
                    <p><?php echo htmlspecialchars($productName); ?></p>
                    <input name="inputDelete" class="inputDelete" type="text" placeholder="Enter Product Name to Confirm">
                    <div class="button-row">
                        <button class="cancel" type="button">Cancel</button>
                        <button class="delete1" name="delete" type="submit">Delete</button>
                    </div>
                </div>
            </div>

        </div>
    </form>
    <script src="script/client/admin/manage.js"></script>
</body>
</html>