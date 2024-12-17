<?php
    // Include configurations, database connection, and admin authentication
    include ('php/config.php');
    include ('php/connection.php');
    include ('php/athenticate_admin.php'); // Fixed typo in 'authenticate_admin'

    // Fetch reviews for a specific product (use GET or fallback to hardcoded product_id)
    $product_id = $_GET['product_id'] ?? 11; // Default to product ID 1 if not provided

    // Query to fetch all reviews and calculate average rating
    $query = "SELECT
                  pr.rating,
                  pr.comment,
                  pr.created_at AS review_created_at,
                  c.username
              FROM product_reviews AS pr
              INNER JOIN clients AS c ON pr.client_id = c.client_id
              WHERE pr.product_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Initialize variables
    $reviews = [];
    $totalRating = 0;

    // Fetch data and process reviews
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
        $totalRating += $row['rating'];
    }

    // Calculate total reviews and average rating
    $totalReviews = count($reviews);
    $averageRating = $totalReviews > 0 ? round($totalRating / $totalReviews, 1) : 0;

    // Function to render stars based on rating
    function renderStars($rating) {
        $fullStar = "<span class='star'>&#9733;</span>"; // Filled star
        $emptyStar = "<span class='star empty'>&#9734;</span>"; // Empty star
        $stars = str_repeat($fullStar, (int)$rating) . str_repeat($emptyStar, 5 - (int)$rating);
        return $stars;
    }

    if(isset($_POST['back'])){
        header('Location: Manage-Analytics.php');
        exit();
    }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Reviews</title>
    <link rel="stylesheet" href="style/View-reviews.css">
</head>
<body>
    <div class="container">
        <form action="Manage-reviews.php" method="POST">
            <button type="submit" name="back" class="btn btn-back">Back</button>
        </form>
        <div class="download-review">
            <form action="php/download-reviews.php" method="POST">
                <p>download reviews</p>
                <input type="hidden" name="product_id" value="<?php echo htmlspecialchars($_GET['product_id'] ?? 1); ?>">
                <button type="submit" name="dlReviews" id="downloadReviews" class="btn-dl">Download</button>
            </form>
        </div>



        <h1>Product Reviews</h1>

        <!-- Average Rating Section -->
        <div class="average-rating">
            <p>Average Rating: <strong><?php echo $averageRating; ?></strong> / 5</p>
            <div class="stars"><?php echo renderStars($averageRating); ?></div>
            <p>(<?php echo $totalReviews; ?> Reviews)</p>
        </div>

        <!-- Comments Section -->
        <div class="comments">
            <?php if ($totalReviews > 0): ?>
                <?php foreach ($reviews as $review): ?>
                    <div class="comment">
                        <p>
                            <strong><?php echo htmlspecialchars($review['username']); ?></strong> -
                            <span class="date"><?php echo htmlspecialchars($review['review_created_at']); ?></span>
                        </p>
                        <p><?php echo nl2br(htmlspecialchars($review['comment'])); ?></p>
                        <div class="stars"><?php echo renderStars($review['rating']); ?></div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No reviews available for this product.</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
