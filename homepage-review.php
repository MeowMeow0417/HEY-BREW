<?php
include("php/config.php");
include("php/connection.php");

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$query = "SELECT 
    r.rating,
    r.comment,
    r.created_at,
    c.username,
    p.product_name
FROM 
    product_reviews r
JOIN 
    clients c ON r.client_id = c.client_id
JOIN 
    products p ON r.product_id = p.product_id
ORDER BY 
    r.created_at DESC";

$result = $conn->query($query);

if (!$result) {
    die(json_encode([
        "error" => "Query failed: " . $conn->error
    ]));
}

$reviews = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            'username' => $row['username'],
            'rating' => (int)$row['rating'],
            'comment' => $row['comment'],
            'product_name' => $row['product_name'],
            'created_at' => $row['created_at']
        ];
    }
}

echo json_encode($reviews);
$conn->close();
?>
