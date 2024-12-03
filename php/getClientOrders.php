<?php
include("config.php");
include("connection.php");

if (isset($_GET['client_id'])) {
    $client_id = $_GET['client_id'];

    $sql = "SELECT
            orders.order_id,
            orders.total_price AS order_total_price,
            orders.order_status,
            orders.created_at,
            clients.username,
            order_items.product_id,
            order_items.size,
            order_items.type,
            order_items.add_ons,
            order_items.quantity,
            order_items.item_price,
            order_items.total_price AS item_total_price
        FROM orders
        JOIN clients ON orders.client_id = clients.client_id
        JOIN order_items ON orders.order_id = order_items.order_id
        WHERE orders.client_id = ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $client_id); // 'i' stands for integer
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $order_data = array();

        while ($row = $result->fetch_assoc()) {
            $order_data[] = $row;
        }

        echo json_encode($order_data);
    } else {
        echo json_encode(array('error' => 'No orders found for this client'));
    }

    $stmt->close();
} else {
    echo json_encode(array('error' => 'No client ID provided'));
}

$conn->close();
?>
