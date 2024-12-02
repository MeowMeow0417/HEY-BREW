<?php
include("config.php");
include("connection.php");


header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Read and decode JSON input
$input = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (!$input || !isset($input['client_id']) || !isset($input['order_items']) || !is_array($input['order_items'])) {
    echo json_encode(["success" => false, "message" => "Invalid request data."]);
    exit;
}

$client_id = $input['client_id'];
$order_items = $input['order_items'];

// Start a database transaction
$conn->begin_transaction();

try {
    // Insert the order into the `orders` table
    $sql = "INSERT INTO orders (client_id, total_price) VALUES (?, 0.00)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare order insertion: " . $conn->error);
    }
    $stmt->bind_param("i", $client_id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to insert order: " . $stmt->error);
    }

    $order_id = $stmt->insert_id;
    $total_price = 0;

    // Insert each order item into the `order_items` table
    foreach ($order_items as $item) {
        if (!isset($item['product_id'], $item['size'], $item['type'], $item['quantity'], $item['total_price'])) {
            throw new Exception("Missing required fields in order item.");
        }

        $product_id = $item['product_id'];
        $size = $item['size'];
        $type = $item['type'];
        $quantity = (int)$item['quantity'];
        $total_price_item = (float)$item['total_price'];
        $item_price = $total_price_item / $quantity;
        $add_ons = isset($item['add_ons']) ? $item['add_ons'] : null;

        $sql = "INSERT INTO order_items (order_id, product_id, size, type, add_ons, quantity, item_price, total_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare order item insertion: " . $conn->error);
        }
        $stmt->bind_param("iisssiid", $order_id, $product_id, $size, $type, $add_ons, $quantity, $item_price, $total_price_item);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert order item: " . $stmt->error);
        }

        $total_price += $total_price_item;
    }

    // Update the total price in the `orders` table
    $sql = "UPDATE orders SET total_price = ? WHERE order_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare total price update: " . $conn->error);
    }
    $stmt->bind_param("di", $total_price, $order_id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update total price: " . $stmt->error);
    }

    // Commit the transaction
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Order placed successfully!"]);

} catch (Exception $e) {
    $conn->rollback();  // Rollback the transaction on error
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $stmt->close();
    $conn->close();
}
?>
