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

$action = $_GET['action'] ?? null;

// Primary Endpoint: Aggregate Data for Graphs
if ($action === 'get') {
    $filter = $_GET['filter'] ?? 'month'; // Default to 'month' if no filter is provided

    try {
        $query = "";

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

        // Fetch aggregated sales data
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

        // Fetch total sales
        $totalStmt = $conn->prepare("
            SELECT SUM(total_sales) AS total_sales
            FROM salesData
            WHERE " . ($filter === 'day' ? "DATE(date) = CURDATE()" :
                     ($filter === 'week' ? "WEEK(date) = WEEK(CURDATE()) AND YEAR(date) = YEAR(CURDATE())" :
                      "MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())"))
        );

        if (!$totalStmt) {
            throw new Exception("Failed to prepare total sales statement: " . $conn->error);
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
        if (isset($stmt)) $stmt->close();
        if (isset($totalStmt)) $totalStmt->close();
        $conn->close();
    }
}

// Secondary Endpoint: Detailed Product-Level Data for Download
else if ($action === 'details') {
    try {
        $query = "
            SELECT s.date AS datetime, i.product_name, i.quantity, i.sales_amount
            FROM salesData AS s
            JOIN salesData_items AS i ON s.id = i.sale_id
            WHERE MONTH(s.date) = MONTH(CURDATE()) AND YEAR(s.date) = YEAR(CURDATE())
            ORDER BY s.date ASC
        ";

        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement for details: " . $conn->error);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $detailedData = [];
        while ($row = $result->fetch_assoc()) {
            $detailedData[] = [
                "datetime" => $row['datetime'],
                "product_name" => $row['product_name'],
                "quantity" => (int)$row['quantity'],
                "sales_amount" => (float)$row['sales_amount']
            ];
        }

        echo json_encode(["details" => $detailedData]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    } finally {
        if (isset($stmt)) $stmt->close();
        $conn->close();
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action specified."]);
}
?>
