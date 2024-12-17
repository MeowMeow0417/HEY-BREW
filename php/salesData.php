<?php

include 'config.php';
include 'connection.php';
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderId = $_POST['orderId'] ?? null;
    $totalPrice = $_POST['totalPrice'] ?? null;
    $orderDate = $_POST['orderDate'] ?? null;

    if (!$orderId || !$totalPrice || !$orderDate) {
        echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
        exit;
    }

    // Begin a database transaction
    $conn->begin_transaction();
    try {
        // 1. Insert into salesData table
        $stmt = $conn->prepare("INSERT INTO salesData (date, total_sales) VALUES (?, ?)");
        $stmt->bind_param("sd", $orderDate, $totalPrice);
        $stmt->execute();
        $salesDataId = $conn->insert_id;

        // 2. Fetch order items from orders table
        $itemsQuery = $conn->prepare("
            SELECT p.product_name, p.category, p.type, p.add_ons, oi.size, oi.quantity, oi.total_price
            FROM order_items AS oi
            JOIN products AS p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
        ");
        $itemsQuery->bind_param("i", $orderId);
        $itemsQuery->execute();
        $result = $itemsQuery->get_result();

        if ($result->num_rows > 0) {
            // 3. Insert each product into salesData_items
            $insertItem = $conn->prepare("
                INSERT INTO salesData_items (sale_id, product_id, product_name, quantity, sales_amount)
                VALUES (?, ?, ?, ?, ?)
            ");

            while ($row = $result->fetch_assoc()) {
                $productId = $row['product_id'] ?? 0; // Ensure product_id is fetched if needed
                $productName = $row['product_name'];
                $quantity = $row['quantity'];
                $salesAmount = $row['total_price'];

                $insertItem->bind_param("iisid", $salesDataId, $productId, $productName, $quantity, $salesAmount);
                $insertItem->execute();
            }
        }


        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Sales data logged successfully']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
