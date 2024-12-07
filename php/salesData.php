<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if data is received via POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

$orderId = $_POST['orderId'] ?? null;
$totalPrice = $_POST['totalPrice'] ?? null;

// Validate received data
if (empty($orderId) || empty($totalPrice)) {
    echo json_encode(["success" => false, "message" => "Missing orderId or totalPrice."]);
    exit;
}

// Log the sale into salesData table
try {
    include("config.php");
    include("connection.php");

    $stmt = $conn->prepare("INSERT INTO salesData (date, total_sales) VALUES (CURDATE(), ?)");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("d", $totalPrice);
    if (!$stmt->execute()) {
        throw new Exception("Failed to insert data: " . $stmt->error);
    }

    echo json_encode(["success" => true, "message" => "Sales data recorded successfully."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $stmt->close();
    $conn->close();
}
?>
