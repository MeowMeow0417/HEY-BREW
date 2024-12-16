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

        // Prepare SQL query to delete the specific order
        $sql = "DELETE FROM orders WHERE order_id = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param('i', $orderId);

            if ($stmt->execute()) {
                // Confirm deletion of the specific order
                echo json_encode(['success' => true, 'message' => "Order $orderId deleted successfully."]);

                // Add MySQL Event to automatically delete old orders daily
                $createEventSQL = "
                    CREATE EVENT IF NOT EXISTS delete_old_orders
                    ON SCHEDULE EVERY 1 DAY
                    STARTS CURRENT_DATE + INTERVAL 1 DAY
                    DO
                    DELETE FROM orders WHERE DATE(order_date) < CURDATE();
                ";

                if ($conn->query($createEventSQL) === TRUE) {
                    echo json_encode(['eventCreated' => true, 'message' => "Daily cleanup event created/verified."]);
                } else {
                    echo json_encode(['eventCreated' => false, 'message' => "Failed to create the daily cleanup event: " . $conn->error]);
                }
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
