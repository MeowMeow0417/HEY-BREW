<?php
include("php/config.php");
include("php/connection.php");

if (isset($_POST['back'])) {
    header('Location: Manage-Products.php');
    exit();
}

// Directory to store uploaded images
$targetDir = "uploads/";
$uploadStatus = "";

if (isset($_POST['addProd'])) {
    $uploadOk = 1;

    // Handle image upload
    if (isset($_FILES['imagePath']) && $_FILES['imagePath']['error'] == UPLOAD_ERR_OK) {
        $imageFileType = strtolower(pathinfo($_FILES['imagePath']['name'], PATHINFO_EXTENSION));
        $uniqueFileName = uniqid("img_", true) . '.' . $imageFileType;
        $targetFilePath = $targetDir . $uniqueFileName;

        // Validate if the uploaded file is an image
        $check = getimagesize($_FILES['imagePath']['tmp_name']);
        if ($check !== false) {
            $uploadOk = 1;
        } else {
            $uploadStatus = "File is not an image.";
            $uploadOk = 0;
        }

        // Validate file size (limit: 5MB)
        if ($_FILES['imagePath']['size'] > 5000000) {
            $uploadStatus = "Sorry, your file is too large.";
            $uploadOk = 0;
        }

        // Validate file format
        if (!in_array($imageFileType, ['jpg', 'png', 'jpeg', 'gif'])) {
            $uploadStatus = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            $uploadOk = 0;
        }

        // Upload the file
        if ($uploadOk == 0) {
            $uploadStatus = "Sorry, your file was not uploaded.";
        } else {
            if (move_uploaded_file($_FILES['imagePath']['tmp_name'], $targetFilePath)) {
                // Retrieve other form data
                $productName = $_POST['prodName'];
                $prodDescription = $_POST['prodDesc'];
                $category = $_POST['category'];
                $type = $_POST['type'];
                $addOns = $_POST['addOns'];
                $smallPrice = $_POST['smallPrice'];
                $mediumPrice = $_POST['mediumPrice'];
                $largePrice = $_POST['largePrice'];

                // Insert product details into the products table
                $productStmt = $conn->prepare("INSERT INTO products (product_name, prodDescription, category, type, add_ons, image_path) VALUES (?, ?, ?, ?, ?, ?)");
                $productStmt->bind_param("ssssss", $productName, $prodDescription, $category, $type, $addOns, $targetFilePath);

                if ($productStmt->execute()) {
                    $productId = $productStmt->insert_id; // Get the last inserted product ID

                    // Insert prices for different sizes into the product_prices table
                    $priceStmt = $conn->prepare("INSERT INTO product_prices (product_id, size, price) VALUES (?, ?, ?)");
                    $priceStmt->bind_param("isd", $productId, $size, $price);

                    // Insert small size price
                    $size = 'small';
                    $price = $smallPrice;
                    $priceStmt->execute();

                    // Insert medium size price
                    $size = 'medium';
                    $price = $mediumPrice;
                    $priceStmt->execute();

                    // Insert large size price
                    $size = 'large';
                    $price = $largePrice;
                    $priceStmt->execute();

                    $priceStmt->close();
                  //  $uploadStatus = "Product added successfully!"; Create a MODAL
                } else {
                    $uploadStatus = "Error: Could not add product to the database.";
                }

                $productStmt->close();
            } else {
                $uploadStatus = "Sorry, there was an error uploading your file.";
            }
        }
    } else {
        $uploadStatus = "No image file was uploaded.";
    }

    echo $uploadStatus;
}

$conn->close();
?>




<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/addProd.css">
    <title>Management - Add</title>
</head>
<body>
    <form action="addProd.php" method="POST" enctype="multipart/form-data">


        <div class="main-container">
            <div class="left-container">
            <h2>Add New Product</h2>

                <label for="imageUpload" class="drop-area" id="drop-area">
                <p>Drag and drop an image here or click to select one</p>
                    <input type="file" id="imageUpload" name="imagePath" accept="image/*" style="display: none;">
                    <p><?php echo $uploadStatus; ?></p>
                </label>


            </div>

            <div class="middle-container">
            <form id="addProductForm">
                <div class="add-grid">
                    <!-- Product Name -->
                     <div class="input-box">
                        <label for="prodName">Product Name</label>
                        <input type="text" class="prodName" id="prodName" name="prodName" placeholder="Product Name" >
                     </div>


                    <!-- Description -->
                     <div class="input-box">
                        <label for="prodDesc">Description</label>
                        <input type="text" class="prodDesc" id="prodDesc" name="prodDesc" placeholder="Description">
                     </div>


                    <!-- Category -->
                     <div class="input-box">
                        <label for="category">Category</label>
                        <select name="category" id="category" >
                            <option value="">Select Category</option>
                            <option value="espresso">Espresso</option>
                            <option value="blendedBev">Blended Beverages</option>
                            <option value="tea">Tea</option>
                            <option value="riceM">Rice Meals</option>
                            <option value="pasta">Pasta</option>
                            <option value="snacks">Snacks</option>
                        </select>
                     </div>


                    <!-- Type -->
                    <div class="input-box">
                        <label for="type">Type</label>
                        <input type="text" class="type" name="type" id="type" placeholder="e.g., HOT, COLD" >
                    </div>


                </div>
            </div>


                    <div class="right-container">
                        <form id="addProductForm">
                            <div class="add-grid">

                                <div class="input-box">
                                     <!-- Add Ons -->
                                    <label for="addOns">Add Ons</label>
                                    <input type="text" id="addOns" name="addOns" placeholder="Add Ons (e.g., Extra shot, Whipped Cream)">
                                </div>

                                <!-- Prices for Different Sizes -->
                                <div class="input-box">

                                    <label for="smallPrice">Price for Small</label>
                                    <input type="number" id="smallPrice" name="smallPrice" step="0.01" placeholder="Small Size Price" >
                                </div>

                                <div class="input-box">
                                    <label for="mediumPrice">Price for Medium</label>
                                    <input type="number" id="mediumPrice" name="mediumPrice" step="0.01" placeholder="Medium Size Price" >
                                </div>

                                <div class="input-box">
                                    <label for="largePrice">Price for Large</label>
                                    <input type="number" id="largePrice" name="largePrice" step="0.01" placeholder="Large Size Price" >
                                </div>

                            </div>
                        </form>
                    </div>
            </form>
                     <!-- Submit Button -->
                <div class="left-button">
                    <button type="submit" class="back" name="back">BACK</button>
                </div>

                <div class="right-button">
                    <button type="submit" class="cancel" name="cancel" onclick="confirmCancel()" >Cancel</button>
                    <button type="submit" class="addP" name="addProd" onclick="AddConfirm()"><Address></Address> Product</button>
                </div>


    </form>
    <script src="script/client/admin/addProd.js"></script>
</body>
</html>