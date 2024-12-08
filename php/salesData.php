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
$orderDate = $_POST['orderDate'] ?? null;

// Validate received data
if (!$orderId || !$totalPrice || !$orderDate) {
    echo json_encode(["success" => false, "message" => "Missing orderId, totalPrice, or orderDate."]);
    exit;
}

// Log the sale into salesData table
try {
    include("config.php");
    include("connection.php");

    $stmt = $conn->prepare("INSERT INTO salesData (date, total_sales) VALUES (?, ?)");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("sd", $orderDate, $totalPrice); // Bind date (string) and total sales (decimal)
    if (!$stmt->execute()) {
        throw new Exception("Failed to insert data: " . $stmt->error);
    }

    echo json_encode(["success" => true, "message" => "Sales data recorded successfully."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    $conn->close();
}
?>
