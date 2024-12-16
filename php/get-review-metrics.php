<?php
include("config.php");
include("connection.php");

header('Content-Type: application/json');

// Check if a product ID is provided and valid
if (isset($_GET['product_id']) && is_numeric($_GET['product_id'])) {
    $productId = intval($_GET['product_id']);

    // Get total reviews count for the product
    $totalReviewsQuery = $conn->prepare("SELECT COUNT(*) as total_reviews FROM product_reviews WHERE product_id = ?");
    $totalReviewsQuery->bind_param("i", $productId);
    $totalReviewsQuery->execute();
    $totalReviewsResult = $totalReviewsQuery->get_result();
    $totalReviewsRow = $totalReviewsResult->fetch_assoc();
    $totalReviews = $totalReviewsRow['total_reviews'];

    // Get average rating for the product
    $averageRatingQuery = $conn->prepare("SELECT AVG(rating) as avg_rating FROM product_reviews WHERE product_id = ?");
    $averageRatingQuery->bind_param("i", $productId);
    $averageRatingQuery->execute();
    $averageRatingResult = $averageRatingQuery->get_result();
    $averageRatingRow = $averageRatingResult->fetch_assoc();
    $averageRating = round($averageRatingRow['avg_rating'], 1); // Round to 1 decimal place

    // Get most reviewed product (this part assumes you're displaying metrics for a specific product)
    // You can skip or modify it based on your use case
    $mostReviewedProduct = ''; // Placeholder for most reviewed product logic, if needed

    // Return the calculated metrics as a JSON response
    echo json_encode([
        'totalReviews' => $totalReviews,
        'averageRating' => $averageRating,
        'mostReviewedProduct' => $mostReviewedProduct
    ]);
} else {
    // Handle invalid product ID
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing product ID.']);
}
?>
