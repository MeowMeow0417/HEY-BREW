<?php
    include("php/config.php");
    include("php/connection.php");
    include("php/authenticate_client.php");


    if(isset($_POST['back'])){
        header('Location: Client-HomePage.php');
        exit();
    }

    if(isset($_POST['profile-card'])){
        header('Location: Client-Profile.php ');
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
                    p.prodDescription,
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
    // end

    // Filter products based on the selected category and search term
    // Get the selected category from the URL (default to 'All')
    $category = isset($_GET['category']) ? strtolower(trim($_GET['category'])) : 'all';
    $searchTerm = isset($_GET['search-bar']) ? trim($_GET['search-bar']) : '';

    // Filter products based on the selected category and search term
    $filteredProducts = array_filter($products, function ($product) use ($category, $searchTerm) {
        $productCategory = isset($product['details']['category']) ? strtolower(trim($product['details']['category'])) : 'undefined';

        // Matches the category if it's 'All' or the category matches
        $matchesCategory = $category === 'all' || $productCategory === $category;

        // Matches search if search term exists in product name
        $matchesSearch = empty($searchTerm) || stripos($product['details']['product_name'], $searchTerm) !== false;

        return $matchesCategory && $matchesSearch;
    });


?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/client/Client-Ordering.css">
    <link rel="stylesheet" href="style/client/Client-modal/C-Ordering-Modal.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <title>HEY BREW - Ordering</title>
</head>
<body>
    <form action="Client-Ordering.php" method="POST">

        <div class="main-grid">
        <!-- Grid setup for top-bar  -->
        <div class="top-bar" id="top-bar">


            <div class="left-bar">
                <button class="back" name="back" id="back"><i class="fa-solid fa-caret-left"></i></button>
                <p><strong>HEY BREW</strong> Order</p>
            </div>

            <div class="middle-bar">
                <!-- Search bar -->
                <input name="search-bar" class="search-bar" id="searchInput" type="text" placeholder="Search">
            </div>


            <div class="right-bar">
                <!-- Profile -->
                 <a href="Client-Profile.php">
                    <div class="profile-card" id="profile-card" name="profile-card">
                        <img src="style/images/products/auth.jpg" alt="Admin Profile">
                        <div class="profile-info">
                            <h4><?php echo htmlspecialchars($username); ?></h4>
                        </div>
                    </div>
                </a>


            </div>
        </div>
        <!-- Category -->
            <div class="category-row" id="category-row">
                <div class="category-box categories active" data-category="All">
                    <img class="img-cat" src="" alt="product">
                    <a href="?category=All" >All Items</a>
                </div>

                <div class="category-box categories" data-category="espresso">
                    <img class="img-cat" src="" alt="product">
                    <a href="?category=espresso" >Espresso</a>
                </div>

                <div class="category-box categories" data-category="blendedBev">
                    <img class="img-cat" src="" alt="product">
                    <a href="?category=blendedBev" >Blended Beverages</a>
                </div>
                <div class="category-box categories" data-category="tea">
                    <img class="img-cat" src="" alt="product">
                    <a href="?category=tea" >Tea</a>
                </div>
                <div class="category-box categories"data-category="riceM">
                    <img class="img-cat" src="" alt="product">
                    <a href="?category=riceM" >Rice Meals</a>
                </div>
                <div class="category-box categories" data-category="pasta">
                    <img class="img-cat" src="" alt="product">
                    <a href="?category=pasta" >Pasta</a>
                </div>
                <div class="category-box categories" data-category="snacks">
                    <img class="img-cat" src="" alt="product">
                    <a href="?category=snacks" >Snacks</a>
                </div>
            </div>

            <div class="container">
            <!-- Products displayed in a grid -->
            <div class="productLine">
                    <?php if ($filteredProducts): ?>
                        <?php foreach ($filteredProducts as $product): ?>
                            <div class="product-card"
                            data-id="<?php echo htmlspecialchars($product['details']['product_id']); ?>"
                            data-name="<?php echo htmlspecialchars($product['details']['product_name']); ?>"
                            data-description="<?php echo htmlspecialchars($product['details']['prodDescription']); ?>"
                            data-image="<?php echo htmlspecialchars($product['details']['image_path']); ?>"
                            data-types="<?php echo htmlspecialchars($product['details']['type']); ?>"
                            data-addons="<?php echo htmlspecialchars($product['details']['add_ons']); ?>"
                            data-prices='<?php echo json_encode($product['prices']); ?>'>


                            <img src="<?php echo htmlspecialchars($product['details']['image_path']); ?>" alt="<?php echo htmlspecialchars($product['details']['product_name']); ?>">
                                <div class="product-info">
                                    <h4><?php echo htmlspecialchars($product['details']['product_name']); ?></h4>
                                    <div class="detail-grid">
                                        <div class="product-details">
                                        <div class="detail">
                                                <label for="size_<?php echo $product['details']['product_id']; ?>">Size & Price</label>
                                                <select class="prod-modal" id="size_<?php echo $product['details']['product_id']; ?>" name="size_price">
                                                    <?php foreach ($product['prices'] as $priceInfo) {
                                                        echo "<option value='" . htmlspecialchars($priceInfo['size']) . "'>" .
                                                            htmlspecialchars(ucfirst($priceInfo['size'])) .
                                                            " - ₱" . htmlspecialchars(number_format($priceInfo['price'], 2)) . "</option>";
                                                    }?>
                                                </select>
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

            <!-- Add to Cart / Place order -->
            <div class="place-order" id="place-order">
                <div class="order-section" id="order-section">
                    <div class="header-order" id="header-order">
                        <i class="fa-solid fa-chevron-up" id="cartArrow"></i>
                    </div>
                    <div class="product-order" id="product-order"  data-id="" data-client-id="<?php echo htmlspecialchars($client_id); ?>">
                    <!-- Poppulated Dynamically using JS-->

                    </div>

                    <div class="fixed-footer">
                    <p class="total-Price">Total: <span class="total-price" id="total-price"></span></p>
                    <button class="btn-order" id="btn-order" name="btn-order">Place Order</button>
                    </div>
                </div>
            </div>
        </div>
    </form>

<!-- Options Modal -->
<div class="options-modal" id="options-modal" data-client-id="<?php echo htmlspecialchars($client_id); ?>" data-id="<?php echo htmlspecialchars($product['details']['product_id'])?>">
    <div class="container-grid" id="container-grid">
        <div class="product-grid" id="product-grid">
            <img src="<?php echo htmlspecialchars($product['details']['image_path']); ?>" alt="Product Image">
            <h4><?php echo htmlspecialchars($product['details']['product_name']); ?></h4>

            <h5>Description:</h5>
            <p><?php echo htmlspecialchars($product['details']['prodDescription']); ?></p>
        </div>
        <a href="#" class="close"><i class="fa-solid fa-xmark"></i></a>
        <div class="detail-grid">
            <!-- Type Dropdown -->
            <div class="detail-row">
                <label for="type_<?php echo $product['details']['product_id']; ?>">Type</label>
                <select class="select-modal" id="type_<?php echo $product['details']['product_id']; ?>" name="type">
                    <?php
                    $types = explode(',', $product['details']['type']);
                    foreach ($types as $type): ?>
                        <option value="<?php echo htmlspecialchars(trim($type)); ?>">
                            <?php echo htmlspecialchars(trim($type)); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Add-Ons Dropdown -->
            <div class="detail-row">
                <label for="addOn_<?php echo $product['details']['product_id']; ?>">Add-Ons</label>
                <select class="select-modal" id="addOn_<?php echo $product['details']['product_id']; ?>" name="add_on">
                    <option value="">None</option>
                    <?php
                    $addOns = explode(',', $product['details']['add_ons']);
                    foreach ($addOns as $addOn): ?>
                        <option value="<?php echo htmlspecialchars(trim($addOn)); ?>">
                            <?php echo htmlspecialchars(trim($addOn)); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Size & Price Dropdown -->
            <div class="detail-row">
                <label for="size_<?php echo $product['details']['product_id']; ?>">Size & Price</label>
                <select class="select-modal" id="size_<?php echo $product['details']['product_id']; ?>" name="size_price">
                    <?php foreach ($product['prices'] as $priceInfo): ?>
                        <option value="<?php echo htmlspecialchars($priceInfo['size']); ?>"
                                data-price="<?php echo htmlspecialchars($priceInfo['price']); ?>">
                            <?php echo htmlspecialchars(ucfirst($priceInfo['size'])); ?> - ₱
                            <?php echo htmlspecialchars(number_format($priceInfo['price'], 2)); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <!-- Add to Cart Button -->
        <div class="corner">
            <button class="btn-cart" id="btn-cart" name="btn-cart">Add to Cart</button>
        </div>
    </div>
</div>


    <!-- RECEIPT -->
    <div class="receipt-modal">
        <h1>Receipt</h1>
        <a href="" class="close"><i class="fa-solid fa-xmark"></i></a>
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
                    <img src="<?php echo htmlspecialchars($product['image_path'])?>" alt="<?php echo htmlspecialchars($product['product_name'])?>" class="product-image">
                    <div class="product-details">
                        <p><?php echo htmlspecialchars($product['product_name'])?></p>
                        <p>Size: </p>
                        <p>Type: </p>
                        <p>AddOns: </p>
                    <p>Qty: </p>
                    <p>₱ Price</p>
                </div>
            </div>
            <div class="total-section">
                <span>Total:</span>
                <span class="total-amount">₱69.0</span>
            </div>
        </div>
    </div>

    <script src="script/client/Client-Ordering.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</body>
</html>