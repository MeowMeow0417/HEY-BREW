<?php
include("config.php");
include("connection.php");

header('Content-Type: application/json');

// Validate product_id input
if (isset($_GET['product_id']) && is_numeric($_GET['product_id'])) {
    $productId = intval($_GET['product_id']);
    $ratingCounts = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];

    // Query to fetch aggregated ratings
    $ratingQuery = $conn->prepare("SELECT rating, COUNT(*) as count FROM product_reviews WHERE product_id = ? GROUP BY rating");
    $ratingQuery->bind_param("i", $productId);
    $ratingQuery->execute();
    $ratingResult = $ratingQuery->get_result();

    // Populate the array with fetched results
    while ($row = $ratingResult->fetch_assoc()) {
        $ratingCounts[intval($row['rating'])] = intval($row['count']);
    }
    $ratingQuery->close();

    // Send JSON response
    echo json_encode(array_values($ratingCounts));
} else {
    // Handle invalid product ID
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing product ID.']);
}
?>
