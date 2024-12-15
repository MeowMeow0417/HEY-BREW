<?php
// Include database connection
include 'config.php';
include 'connection.php';


header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate order ID
    if (isset($input['orderId']) && is_numeric($input['orderId'])) {
        $orderId = intval($input['orderId']);

        // Prepare SQL query to delete the order
        $sql = "DELETE FROM orders WHERE order_id = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param('i', $orderId);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => "Order $orderId deleted successfully."]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to delete the order.']);
            }

            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to prepare the SQL statement.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid order ID.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

// Close database connection
$conn->close();
?>
