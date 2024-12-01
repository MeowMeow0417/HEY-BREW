<?php

include("php/config.php");
include("php/connection.php");
header('Content-Type: application/json');



// Get JSON data from request
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['client_id']) || !isset($input['order_items'])) {
    echo json_encode(["success" => false, "message" => "Invalid request data."]);
    exit;
}

$client_id = $input['client_id'];
$order_items = $input['order_items'];

if (!is_array($order_items) || count($order_items) === 0) {
    echo json_encode(["success" => false, "message" => "Order items are missing or invalid."]);
    exit;
}

// Insert order into orders table
$sql = "INSERT INTO orders (client_id, total_price) VALUES (?, 0)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Failed to prepare SQL for inserting order: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $client_id);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to insert order: " . $stmt->error]);
    exit;
}

// Get the last inserted order_id
$order_id = $conn->insert_id;

// Insert each item into order_items table and update total price
$total_price = 0;
foreach ($order_items as $item) {
    if (!isset($item['product_id'], $item['size'], $item['type'], $item['quantity'], $item['total_price'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields in order items."]);
        exit;
    }

    $sql = "INSERT INTO order_items (order_id, product_id, size, type, add_ons, quantity, item_price, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Failed to prepare SQL for inserting order items: " . $conn->error]);
        exit;
    }

    $item_price = $item['total_price'] / $item['quantity']; // Calculate item price
    $stmt->bind_param(
        "iisssiid",
        $order_id,
        $item['product_id'],
        $item['size'],
        $item['type'],
        $item['add_ons'],
        $item['quantity'],
        $item_price,
        $item['total_price']
    );

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to insert order item: " . $stmt->error]);
        exit;
    }

    $total_price += $item['total_price'];
}

// Update total price in orders table
$sql = "UPDATE orders SET total_price = ? WHERE order_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Failed to prepare SQL for updating total price: " . $conn->error]);
    exit;
}

$stmt->bind_param("di", $total_price, $order_id);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Failed to update total price: " . $stmt->error]);
    exit;
}

echo json_encode(["success" => true, "message" => "Order placed successfully!"]);
?>
