<?php
include("php/config.php");
include("php/connection.php");
include("php/authenticate_client.php");

// Redirect if "close" button is clicked
if (isset($_POST['close'])) {
    header('Location: Client-Ordering.php');
    exit();
}

// Initialize variables
$product = [];
$errorMessage = "";

// Fetch product details if `product_id` is set
if (isset($_POST['product_id'])) {
    $productId = intval($_POST['product_id']);
    $productQuery = $conn->prepare("SELECT product_name, image_path FROM products WHERE product_id = ?");
    $productQuery->bind_param("i", $productId);
    $productQuery->execute();
    $productResult = $productQuery->get_result();

    if ($productResult->num_rows > 0) {
        $product = $productResult->fetch_assoc();
    } else {
        $errorMessage = "Product not found.";
    }
    $productQuery->close();
} else {
    $errorMessage = "No product selected for review.";
}

// Handle review submission
if (isset($_POST['stars-input'], $_POST['comments'], $_POST['product_id'])) {
    $product_id = intval($_POST['product_id']);
    $rating = intval($_POST['stars-input']);
    $comment = htmlspecialchars(trim($_POST['comments']));
    $client_id = $_SESSION['client_id']; // Ensure the user is logged in

    // Validate inputs
    if ($rating >= 1 && $rating <= 5 && !empty($comment)) {
        $query = "INSERT INTO product_reviews (product_id, client_id, rating, comment) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);

        if ($stmt) {
            $stmt->bind_param("iiis", $product_id, $client_id, $rating, $comment);
            if ($stmt->execute()) {
                echo "<p class='success'>Review submitted successfully.</p>";
            } else {
                echo "<p class='error'>Error executing the query: " . $stmt->error . "</p>";
            }
            $stmt->close(); // Close statement
        } else {
            echo "<p class='error'>Error preparing the statement: " . $conn->error . "</p>";
        }
    } else {
        $errorMessage = "Invalid rating or comment. Please provide a valid input.";
    }
}
?>

<!-- Display errors or success messages -->
<?php if (!empty($errorMessage)): ?>
    <p class="error"><?php echo $errorMessage; ?></p>
<?php endif; ?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/Client-reviews.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <title>Leave a Review</title>
</head>
<body>
    <form action="add-reviews.php" method="POST">
        <div class="floating-container">
            <div class="container">
                <header>
                    <h4><?php echo htmlspecialchars($_SESSION['username'] ?? 'Guest'); ?></h4>
                    <button type="submit" name="close" class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </header>

                <header class="nav-header">
                    <div class="product-container">
                        <?php if (!empty($product)): ?>
                            <img src="<?php echo htmlspecialchars($product['image_path']); ?>" alt="<?php echo htmlspecialchars($product['product_name']); ?>">
                            <p><?php echo htmlspecialchars($product['product_name']); ?></p>
                        <?php else: ?>
                            <p><?php echo htmlspecialchars($errorMessage); ?></p>
                        <?php endif; ?>
                    </div>
                </header>

                <div class="input-container">
                    <div class="row">
                        <label for="stars-input">Rate the product</label>
                        <select id="stars-input" name="stars-input">
                            <option value="" disabled selected>Select a rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                    <label for="comments">Enter comment</label>
                    <textarea name="comments" id="comments" placeholder="Leave a comment"></textarea>
                </div>

                <footer>
                    <button class="btn-submit" name="btn-submit" id="btn-submit">Submit</button>
                </footer>
            </div>
        </div>
        <input type="hidden" name="product_id" value="<?php echo htmlspecialchars($productId ?? ''); ?>">
    </form>
</body>
</html>
