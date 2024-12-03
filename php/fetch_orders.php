<?php

include("config.php");
include("connection.php");

header('Content-Type: application/json'); // Ensure JSON header is set


// fetch_orders.php
if (isset($_GET['order_id'])) {
    $order_id = mysqli_real_escape_string($conn, $_GET['order_id']);

    $sql = "SELECT
                c.username AS client_username,
                p.product_name AS product_name,
                p.category AS category,
                oi.size AS size,
                oi.type AS type,
                oi.add_ons AS add_ons,
                oi.quantity AS quantity,
                oi.total_price AS total_price,
                o.order_status AS status,
                o.created_at AS order_date_time
            FROM
                orders o
            JOIN
                clients c ON o.client_id = c.client_id
            JOIN
                order_items oi ON o.order_id = oi.order_id
            JOIN
                products p ON oi.product_id = p.product_id
            WHERE
                o.order_id = '$order_id'
            ORDER BY
                o.created_at DESC;";

    $result = mysqli_query($conn, $sql);

    if ($result) {
        $orders = [];
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $orders['client_username'] = $row['client_username'];
            $orders['order_date_time'] = $row['order_date_time'];
            $orders['status'] = $row['status'];
            $orders['items'][] = [
                'product_name' => $row['product_name'],
                'category' => $row['category'],
                'size' => $row['size'],
                'type' => $row['type'],
                'add_ons' => $row['add_ons'],
                'quantity' => $row['quantity'],
                'total_price' => $row['total_price']
            ];
        }

        echo json_encode($orders);
    } else {
        echo json_encode(['error' => mysqli_error($conn)]);
    }
}




?>