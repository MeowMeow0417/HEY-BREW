<?php
include("php/config.php");
include("php/connection.php");

if (isset($_POST['back'])) {
    header("location: Manage-Products.php");
    exit();
}

$uploadStatus = ""; // Initialize the upload status message
$product = [];
$prices = [];

// Check if the product_id is passed from the previous page or from the form
if (isset($_POST['product_id']) || isset($_POST['prodId'])) {
    $productId = isset($_POST['product_id']) ? $_POST['product_id'] : $_POST['prodId'];

    // Fetch product details
    $productQuery = $conn->prepare("SELECT * FROM products WHERE product_id = ?");
    $productQuery->bind_param("i", $productId);
    $productQuery->execute();
    $productResult = $productQuery->get_result();
    $product = $productResult->fetch_assoc();

    // Fetch product prices
    $priceQuery = $conn->prepare("SELECT size, price FROM product_prices WHERE product_id = ?");
    $priceQuery->bind_param("i", $productId);
    $priceQuery->execute();
    $priceResult = $priceQuery->get_result();

    while ($row = $priceResult->fetch_assoc()) {
        $prices[$row['size']] = $row['price'];
    }

    $productQuery->close();
    $priceQuery->close();
}

// Handle form submission for updating the product
if (isset($_POST['updateProd'])) {
    $prodId = $_POST['prodId'];
    $prodName = $_POST['prodName'];
    $prodDesc = $_POST['prodDesc'];
    $category = $_POST['category'];
    $type = $_POST['type'];
    $addOns = $_POST['addOns'];
    $smallPrice = $_POST['smallPrice'];
    $mediumPrice = $_POST['mediumPrice'];
    $largePrice = $_POST['largePrice'];

    // Handle image upload if a new image is selected
    $targetDir = "uploads/";
    $uploadOk = 1;
    $imagePath = $product['image_path']; // Use existing image by default

    if (isset($_FILES['imagePath']) && $_FILES['imagePath']['error'] == UPLOAD_ERR_OK) {
        $imageFileType = strtolower(pathinfo($_FILES['imagePath']['name'], PATHINFO_EXTENSION));
        $uniqueFileName = uniqid("img_", true) . '.' . $imageFileType;
        $targetFilePath = $targetDir . $uniqueFileName;

        // Validate image
        $check = getimagesize($_FILES['imagePath']['tmp_name']);
        if ($check === false) {
            $uploadOk = 0;
            $uploadStatus = "File is not an image.";
        }
        if ($_FILES['imagePath']['size'] > 5000000) {
            $uploadOk = 0;
            $uploadStatus = "Sorry, your file is too large.";
        }
        if (!in_array($imageFileType, ['jpg', 'png', 'jpeg', 'gif'])) {
            $uploadOk = 0;
            $uploadStatus = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        }

        if ($uploadOk) {
            if (move_uploaded_file($_FILES['imagePath']['tmp_name'], $targetFilePath)) {
                $imagePath = $targetFilePath;
                $uploadStatus = "The file has been uploaded successfully.";
            } else {
                $uploadOk = 0;
                $uploadStatus = "Sorry, there was an error uploading your file.";
            }
        }
    }

    // Update the product details in the database
    $updateProductStmt = $conn->prepare("UPDATE products SET product_name = ?, prodDescription = ?, category = ?, type = ?, add_ons = ?, image_path = ? WHERE product_id = ?");
    $updateProductStmt->bind_param("ssssssi", $prodName, $prodDesc, $category, $type, $addOns, $imagePath, $prodId);

    if ($updateProductStmt->execute()) {
        // Update prices
        $updatePriceStmt = $conn->prepare("UPDATE product_prices SET price = ? WHERE product_id = ? AND size = ?");
        $updatePriceStmt->bind_param("dis", $price, $prodId, $size);

        // Update small price
        $size = 'small';
        $price = $smallPrice;
        $updatePriceStmt->execute();

        // Update medium price
        $size = 'medium';
        $price = $mediumPrice;
        $updatePriceStmt->execute();

        // Update large price
        $size = 'large';
        $price = $largePrice;
        $updatePriceStmt->execute();

        $updatePriceStmt->close();

        // Fetch updated product details
        $productQuery = $conn->prepare("SELECT * FROM products WHERE product_id = ?");
        $productQuery->bind_param("i", $prodId);
        $productQuery->execute();
        $productResult = $productQuery->get_result();
        $product = $productResult->fetch_assoc();

        // Fetch updated product prices
        $priceQuery = $conn->prepare("SELECT size, price FROM product_prices WHERE product_id = ?");
        $priceQuery->bind_param("i", $prodId);
        $priceQuery->execute();
        $priceResult = $priceQuery->get_result();

        $prices = [];
        while ($row = $priceResult->fetch_assoc()) {
            $prices[$row['size']] = $row['price'];
        }

        $productQuery->close();
        $priceQuery->close();

    } else {
        echo "Error: Could not update the product.";
    }

    $updateProductStmt->close();
}

$conn->close();
?>


<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/updateProd.css">
    <title>Management - Update Product</title>
</head>
<body>
    <form action="updateProd.php" method="POST" enctype="multipart/form-data">
        <div class="main-container">
            <div class="left-container">
                <h2>Update Product</h2>
                <label for="imageUpload" class="drop-area" id="drop-area">
                    <p>Drag and drop an image here or click to select one</p>
                    <input type="file" id="imageUpload" name="imagePath" accept="image/*" style="display: none;">
                    <img id="previewImage" src="<?php echo htmlspecialchars($product['image_path'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($product['product_name'], ENT_QUOTES, 'UTF-8'); ?>">
                    <p><?php echo $uploadStatus; ?></p>
                </label>
            </div>


            <div class="middle-container">
                <input type="hidden" id="prodId" name="prodId" value="<?php echo $product['product_id']; ?>">
                <div class="input-box">
                    <label for="prodName">Product Name</label>
                    <input type="text" id="prodName" name="prodName" value="<?php echo $product['product_name']; ?>">
                </div>
                <div class="input-box">
                    <label for="prodDesc">Description</label>
                    <input type="text" id="prodDesc" name="prodDesc" value="<?php echo $product['prodDescription']; ?>">
                </div>
                <div class="input-box">
                    <label for="category">Category</label>
                    <select name="category" id="category">
                        <option value="espresso" <?php if ($product['category'] == 'espresso') echo 'selected'; ?>>Espresso</option>
                        <option value="blendedBev" <?php if ($product['category'] == 'blendedBev') echo 'selected'; ?>>Blended Beverages</option>
                        <option value="tea" <?php if ($product['category'] == 'tea') echo 'selected'; ?>>Tea</option>
                        <option value="riceM" <?php if ($product['category'] == 'riceM') echo 'selected'; ?>>Rice Meals</option>
                        <option value="pasta" <?php if ($product['category'] == 'pasta') echo 'selected'; ?>>Pasta</option>
                        <option value="snacks" <?php if ($product['category'] == 'snacks') echo 'selected'; ?>>Snacks</option>
                    </select>
                </div>
                <div class="input-box">
                    <label for="type">Type</label>
                    <input type="text" id="type" name="type" value="<?php echo $product['type']; ?>">
                </div>
            </div>

            <div class="right-container">
                <div class="input-box">
                    <label for="addOns">Add Ons</label>
                    <input type="text" id="addOns" name="addOns" value="<?php echo $product['add_ons']; ?>">
                </div>
                <div class="input-box">
                    <label for="smallPrice">Price for Small</label>
                    <input type="number" id="smallPrice" name="smallPrice" step="0.01" value="<?php echo $prices['small']; ?>">
                </div>
                <div class="input-box">
                    <label for="mediumPrice">Price for Medium</label>
                    <input type="number" id="mediumPrice" name="mediumPrice" step="0.01" value="<?php echo $prices['medium']; ?>">
                </div>
                <div class="input-box">
                    <label for="largePrice">Price for Large</label>
                    <input type="number" id="largePrice" name="largePrice" step="0.01" value="<?php echo $prices['large']; ?>">
                </div>
            </div>

            <div class="left-button">
                <button type="submit" name="back">BACK</button>
            </div>
            <div class="right-button">
                <button type="submit" name="updateProd">Update Product</button>
            </div>
        </div>
    </form>
    <script src="script/client/admin/addProd.js"></script>
</body>
</html>
