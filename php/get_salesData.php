<?php
include("config.php");
include("connection.php");

header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Ensure the request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method. Expected GET."]);
    exit;
}

// Check if 'action' is 'get'
if (isset($_GET['action']) && $_GET['action'] === 'get') {
    try {
        $stmt = $conn->prepare("
            SELECT DATE_FORMAT(date, '%d') AS day, SUM(total_sales) AS sales
            FROM salesData
            WHERE MONTH(date) = MONTH(CURDATE())
            GROUP BY day
            ORDER BY day ASC
        ");

        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        // Initialize sales data array for a month (default to zero for days with no sales)
        $salesData = array_fill(0, 30, 0);

        while ($row = $result->fetch_assoc()) {
            $day = (int)$row['day'] - 1; // Zero-based index
            $salesData[$day] = (float)$row['sales'];
        }

        echo json_encode($salesData);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($stmt) && $stmt instanceof mysqli_stmt) {
            $stmt->close();
        }
        $conn->close();
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action specified."]);
}
?>
