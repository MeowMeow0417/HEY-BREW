<?php
include("config.php");
include("connection.php");

header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method. Expected GET."]);
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'get') {
    $filter = $_GET['filter'] ?? 'month'; // Default to 'month' if no filter is provided

    try {
        $query = "";
        $groupBy = "";
        $params = [];

        // Adjust query based on the filter
        switch ($filter) {
            case 'day': // Group by hour
                $query = "
                    SELECT DATE_FORMAT(date, '%Y-%m-%d %H:00:00') AS datetime, SUM(total_sales) AS sales
                    FROM salesData
                    WHERE DATE(date) = CURDATE()
                    GROUP BY HOUR(date)
                    ORDER BY datetime ASC
                ";
                break;

            case 'week': // Group by day
                $query = "
                    SELECT DATE_FORMAT(date, '%Y-%m-%d') AS datetime, SUM(total_sales) AS sales
                    FROM salesData
                    WHERE WEEK(date) = WEEK(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
                    GROUP BY DATE(date)
                    ORDER BY datetime ASC
                ";
                break;

            case 'month': // Group by day
            default:
                $query = "
                    SELECT DATE_FORMAT(date, '%Y-%m-%d') AS datetime, SUM(total_sales) AS sales
                    FROM salesData
                    WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
                    GROUP BY DATE(date)
                    ORDER BY datetime ASC
                ";
                break;
        }

        // Fetch sales data
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $salesData = [];
        while ($row = $result->fetch_assoc()) {
            $salesData[] = [
                "datetime" => $row['datetime'],
                "sales" => (float)$row['sales']
            ];
        }

        // Fetch total sales data
        $totalStmt = $conn->prepare("
            SELECT SUM(total_sales) AS total_sales
            FROM salesData
            WHERE " . ($filter === 'day' ? "DATE(date) = CURDATE()" :
                     ($filter === 'week' ? "WEEK(date) = WEEK(CURDATE()) AND YEAR(date) = YEAR(CURDATE())" :
                      "MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())"))
        );
        if (!$totalStmt) {
            throw new Exception("Failed to prepare statement for total sales: " . $conn->error);
        }

        $totalStmt->execute();
        $totalResult = $totalStmt->get_result();
        $totalSales = $totalResult->fetch_assoc()['total_sales'] ?? 0;

        echo json_encode([
            "salesData" => $salesData,
            "totalSales" => (float)$totalSales
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($stmt) && $stmt instanceof mysqli_stmt) $stmt->close();
        if (isset($totalStmt) && $totalStmt instanceof mysqli_stmt) $totalStmt->close();
        $conn->close();
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action specified."]);
}
?>
