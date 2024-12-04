<?php
include("config.php");
include("connection.php");

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);
$order_id = $data['order_id'];
$new_status = $data['status'];

// Update the order status in the database
$sql = "UPDATE orders SET order_status = ? WHERE order_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $new_status, $order_id);

$response = [];

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error;
}

// Send the response back to the client
echo json_encode($response);

$stmt->close();
$conn->close();
?>
