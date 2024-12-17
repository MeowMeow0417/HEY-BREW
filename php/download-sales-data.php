<?php
include('config.php'); // Database configuration
include('connection.php'); // Database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['downloadSalesData'])) {
    // Define the query to fetch all sales data
    $query = "SELECT
                s.id AS sale_id,
                s.date,
                s.total_sales,
                si.product_name,
                si.quantity,
                si.sales_amount
              FROM salesData AS s
              INNER JOIN salesData_items AS si ON s.id = si.sale_id
              ORDER BY s.id, si.product_name"; // Group by Sale ID, then sort by product name

    $result = $conn->query($query);

    if ($result) {
        // Set headers for file download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="sales_data_detailed.csv"');

        // Open output stream
        $output = fopen('php://output', 'w');

        // Add column headers to the CSV
        fputcsv($output, ['Sale ID', 'Date', 'Total Sales', 'Product Name', 'Quantity', 'Sales Amount']);

        $currentSaleID = null;

        // Fetch and write data to the CSV
        while ($row = $result->fetch_assoc()) {
            // If the Sale ID changes, insert a grouping header row
            if ($currentSaleID !== $row['sale_id']) {
                if ($currentSaleID !== null) {
                    // Add an empty row between groups
                    fputcsv($output, ['']);
                }

                // Group Header Row for a new Sale ID
                fputcsv($output, ['Sale ID: ' . $row['sale_id'], 'Date: ' . $row['date'], 'Total Sales: ₱' . number_format($row['total_sales'], 2)]);

                // Update the current Sale ID
                $currentSaleID = $row['sale_id'];
            }

            // Write detailed product data for the current Sale ID
            fputcsv($output, [
                '', // Empty column to align under Sale ID header
                '', // Empty column
                '', // Empty column
                $row['product_name'],
                $row['quantity'],
                number_format($row['sales_amount'], 2)
            ]);
        }

        // Close output stream
        fclose($output);
        exit();
    } else {
        echo "Error: Unable to fetch sales data. " . $conn->error;
    }
} else {
    echo "Invalid request.";
}
?>
