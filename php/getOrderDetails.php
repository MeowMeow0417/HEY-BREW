<?php

include("config.php");
include("connection.php");

// Check if the 'order_id' is passed in the query string
if (isset($_GET['order_id'])) {
    $order_id = $_GET['order_id'];

    // Query to fetch order details based on order_id
    $sql = "SELECT * FROM order_items WHERE order_id = $order_id";
    $result = $conn->query($sql);

    // Create an array to store the order details
    $orderDetails = [];

    // If records are found, loop through them
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orderDetails[] = $row;
        }
    }

    // Return the results as a JSON response
    echo json_encode($orderDetails);

    // Close the database connection
    $conn->close();
} else {
    // If no 'order_id' is provided, send an error message
    echo json_encode(['error' => 'No order ID provided']);
}
?>
