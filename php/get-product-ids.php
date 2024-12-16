<?php
include("config.php");
include("connection.php");

header('Content-Type: application/json');

// Fetch product IDs and names from the products table
$query = "SELECT product_id, product_name FROM products"; // Query the product_id and product_name
$result = $conn->query($query);

if ($result) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Populate the products array with id and name from the table
        $products[] = [
            'id' => $row['product_id'],
            'name' => $row['product_name']
        ];
    }

    // Send the products data as a JSON response
    echo json_encode($products);
} else {
    // Handle errors if the query fails
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch product data.']);
}
?>
