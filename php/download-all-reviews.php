<?php
// Include database connection
include('config.php');
include('connection.php');
include('athenticate_admin.php'); // Authenticate admin (if required)

if (isset($_POST['downloadAll'])) {
    // Updated query to fetch product name and client username
    $query = "SELECT
                pr.review_id,
                p.product_name,       -- Fetch product name from products table
                c.username AS client_name, -- Fetch client name
                pr.rating,
                pr.comment,
                pr.created_at
              FROM product_reviews AS pr
              INNER JOIN clients AS c ON pr.client_id = c.client_id  -- Join with clients table
              INNER JOIN products AS p ON pr.product_id = p.product_id -- Join with products table
              ORDER BY p.product_name, pr.created_at"; // Group by product name and order by creation date

    $result = $conn->query($query);

    if ($result) {
        // Set headers to force download of the CSV file
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="product_reviews_grouped.csv"');

        // Open output stream for CSV
        $output = fopen('php://output', 'w');

        // Add CSV column headers
        fputcsv($output, ['Product Name', 'Review ID', 'Client Name', 'Rating', 'Comment', 'Created At']);

        $currentProduct = null;

        // Fetch and write each row into the CSV file
        while ($row = $result->fetch_assoc()) {
            // Check if the product name changes to add a product grouping header
            if ($currentProduct !== $row['product_name']) {
                if ($currentProduct !== null) {
                    // Add an empty line to separate products
                    fputcsv($output, ['']);
                }

                // Add a header row for the product
                fputcsv($output, ['Product: ' . $row['product_name'], '', '', '', '', '']);

                // Update the current product name
                $currentProduct = $row['product_name'];
            }

            // Add review rows under the current product
            fputcsv($output, [
                '', // Leave product name column empty for grouping alignment
                $row['review_id'],
                $row['client_name'],
                $row['rating'],
                $row['comment'],
                $row['created_at']
            ]);
        }

        // Close output stream
        fclose($output);
        exit();
    } else {
        echo "Error fetching data: " . $conn->error;
    }
} else {
    echo "Invalid request.";
}
?>
