<?php
// Include configurations, database connection, and admin authentication
include ('config.php');
include ('connection.php');
include ('athenticate_admin.php');

// Check if the download request is made
if (isset($_POST['dlReviews'])) {
    // Get the product ID
    $product_id = $_POST['product_id'] ?? 1;

    // Fetch reviews for the product
    $query = "SELECT pr.rating, pr.comment, pr.created_at, c.username
              FROM product_reviews AS pr
              INNER JOIN clients AS c ON pr.client_id = c.client_id
              WHERE pr.product_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Set the headers to serve a CSV file
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="product_reviews.csv"');

    // Open output stream
    $output = fopen('php://output', 'w');

    // Add CSV column headers
    fputcsv($output, ['Username', 'Rating', 'Comment', 'Review Date']);

    // Fetch and write the data rows
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, [
            $row['username'],
            $row['rating'],
            $row['comment'],
            $row['created_at']
        ]);
    }

    // Close output stream and database connection
    fclose($output);
    exit();
}
?>
