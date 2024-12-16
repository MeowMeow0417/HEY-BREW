<?php
include("config.php");
include("connection.php");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow cross-origin requests
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define the log file location
$log_file = __DIR__ . '/submit_order_debug.log';

// Log the start of the request
file_put_contents($log_file, "--- Incoming Payload ---\n", FILE_APPEND);

try {
    // Read and decode JSON input
    $raw_input = file_get_contents("php://input");
    file_put_contents($log_file, "Raw POST data: " . $raw_input . "\n", FILE_APPEND);

    $input = json_decode($raw_input, true);

    // Log decoded input
    file_put_contents($log_file, "Decoded Input: " . print_r($input, true) . "\n", FILE_APPEND);

    // Validate input
    if (!$input || !isset($input['client_id']) || !isset($input['order_items']) || !is_array($input['order_items'])) {
        throw new Exception("Invalid request data.");
    }

    $client_id = $input['client_id'];
    $order_items = $input['order_items'];

    if (empty($order_items)) {
        throw new Exception("No items in the order.");
    }

    // Validate database connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Start a transaction
    $conn->begin_transaction();

    // Insert the order
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

    // Insert each order item
    foreach ($order_items as $item) {
        if (!isset($item['product_id'], $item['size'], $item['type'], $item['quantity'], $item['total_price'])) {
            throw new Exception("Missing required fields in order item: " . print_r($item, true));
        }

        $product_id = $item['product_id'];
        $size = $item['size'];
        $type = $item['type'];
        $quantity = (int)$item['quantity'];
        $total_price_item = (float)$item['total_price'];
        $item_price = $total_price_item / $quantity;
        $add_ons = $item['add_ons'] ?? null;

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

    // Update total price in the `orders` table
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
    file_put_contents($log_file, "Order placed successfully. Total price: $total_price\n", FILE_APPEND);
    echo json_encode(["success" => true, "message" => "Order placed successfully!"]);

} catch (Exception $e) {
    $conn->rollback();
    file_put_contents($log_file, "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    if (isset($stmt) && $stmt !== false) {
        $stmt->close();
    }
    $conn->close();
}
?>
