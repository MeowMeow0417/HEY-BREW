// Initialize Chart.js (Bar Chart for Sales Data)
const ctxSales = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctxSales, {
    type: 'bar',
    data: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`), // Default: Days 1 to 30
        datasets: [{
            label: 'Sales in ₱',
            data: [], // Data will be fetched dynamically
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }
});



// Fetch and Update Sales Data
// Fetch and Update Sales Data
async function fetchSalesData(filter = 'month') {
    try {
        const response = await fetch(`php/get_salesData.php?action=get&filter=${filter}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.salesData && Array.isArray(data.salesData)) {
            detailedSalesData = data.salesData; // Store the detailed data globally

            // Update chart with new data
            const labels = data.salesData.map(entry => formatDatetime(entry.datetime, filter));
            const sales = data.salesData.map(entry => entry.sales);

            if (labels.length === 0 || sales.length === 0) {
                console.warn("No data available to update the chart.");
                return;
            }

            salesChart.data.labels = labels;
            salesChart.data.datasets[0].data = sales;

            console.log("Updated Chart Data:", salesChart.data);
            salesChart.update();

        } else {
            console.error("Invalid sales data format:", data);
        }

        // Update total sales display
        if (data.totalSales !== undefined) {
            document.querySelector('.metric').textContent = `₱${data.totalSales.toLocaleString()}`;
        }
    } catch (error) {
        console.error(`Error fetching sales data for ${filter}:`, error);
    }
}


// Initialize fetch
fetchSalesData('day');



// Initialize Filter Buttons
setupFilterButtons();

// Handle Button Clicks to Change Filters
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button styling
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Fetch data for the selected filter
            const filter = button.dataset.filter;
            fetchSalesData(filter);
        });
    });
}
fetchSalesData('day');

// Generate Labels for Chart Based on Filter
function formatDatetime(datetime, filter) {
    const dateObj = new Date(datetime);
    switch (filter) {
        case 'day': // Show hour only
            return dateObj.getHours() + ':00';
        case 'week': // Show weekday
            return dateObj.toLocaleDateString(undefined, { weekday: 'short' });
        case 'month': // Show date (e.g., Dec 7)
            return dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
        default:
            return datetime; // Fallback: full datetime
    }
}


















// Initial Data Fetch for Default Filter. Initialize the Chart.js bar chart
// Initialize the Chart.js bar chart
var ctxRatings = document.getElementById('ratingChart').getContext('2d');
var ratingChart = new Chart(ctxRatings, {
    type: 'bar',
    data: {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'], // Match server data order
        datasets: [{
            label: 'Review Ratings',
            data: [0, 0, 0, 0, 0], // Placeholder data
            backgroundColor: ['#dcdcdc', '#e74c3c', '#f39c12', '#ffcc00', '#28a745']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ratings'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Reviews'
                }
            }
        }
    }
});

/// Fetch product IDs dynamically and populate the dropdown
function fetchProductIds() {
    // Use Axios to get the product data from the PHP endpoint
    axios.get('php/get-product-ids.php') // Replace with your actual endpoint
        .then(function (response) {
            if (response.status === 200 && Array.isArray(response.data)) {
                const productSelect = document.getElementById('productSelect');
                productSelect.innerHTML = ''; // Clear existing options

                // Add a default "Select a product" option
                const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Select a Product';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                productSelect.appendChild(defaultOption);

                // Populate the dropdown with product data
                response.data.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id; // Assuming 'id' is the field name
                    option.textContent = product.name || `Product ${product.id}`;
                    productSelect.appendChild(option);
                });

                // Automatically load data for the first product (if available)
                if (response.data.length > 0) {
                    const firstProductId = response.data[0].id;
                    fetchRatings(firstProductId); // Fetch ratings for the first product
                    fetchReviewMetrics(firstProductId); // Fetch review metrics for the first product
                }
            } else {
                console.error("Invalid response format or no products available.");
            }
        })
        .catch(function (error) {
            console.error("Error fetching product IDs:", error);
        });
}
// Update the hidden input's value whenever a product is selected
function updateHiddenInput() {
    const selectedProductId = document.getElementById('productSelect').value;
    document.getElementById('hiddenProductId').value = selectedProductId;
}

// Ensure hidden input is updated on initial load (optional)
document.addEventListener("DOMContentLoaded", () => {
    updateHiddenInput();
});

// Function to convert data to CSV format
function convertToCSV(data, headers) {
    const rows = [];
    // Add headers
    rows.push(headers.join(","));
    // Add data rows
    data.forEach(row => {
        rows.push(row.join(","));
    });
    return rows.join("\n");
}

// Fetch ratings for a product and update the chart
function fetchRatings(productId) {
    if (!productId || isNaN(productId)) {
        console.error("Invalid product ID.");
        return;
    }

    axios.get(`php/get-ratings.php?product_id=${productId}`) // Replace with your actual endpoint
        .then(function (response) {
            if (response.status === 200 && Array.isArray(response.data)) {
                const ratings = response.data;

                // Check if all ratings are zero (i.e., no reviews exist)
                const totalRatings = ratings.reduce((sum, count) => sum + count, 0);

                if (totalRatings === 0) {
                    // Display a message or handle no reviews case
                    console.warn("This product has no reviews.");
                    ratingChart.data.datasets[0].data = [0, 0, 0, 0, 0]; // Reset chart data
                    ratingChart.update();

                    // Optionally display a message in the UI
                    document.querySelector('.no-reviews-message').textContent = "No reviews available for this product.";
                } else {
                    // Update chart data
                    document.querySelector('.no-reviews-message').textContent = ""; // Clear any existing message
                    ratingChart.data.datasets[0].data = ratings;
                    ratingChart.update();
                }
            } else {
                console.error("Unexpected data format or error fetching ratings.");
            }
        })
        .catch(function (error) {
            console.error("Error fetching ratings:", error);
        });
}

// Fetch review metrics for a product and update the page
function fetchReviewMetrics(productId) {
    if (!productId || isNaN(productId)) {
        console.error("Invalid product ID.");
        return;
    }

    axios.get(`php/get-review-metrics.php?product_id=${productId}`)
        .then(function (response) {
            if (response.status === 200 && response.data) {
                const metrics = response.data;

                // Check if total reviews are zero
                if (metrics.totalReviews === 0) {
                    console.warn("This product has no reviews.");

                    // Update the UI to reflect no reviews
                    document.querySelector('.total-reviews .metric').textContent = "0";
                    document.querySelector('.average-rating .metric').textContent = "N/A";
                    document.querySelector('.most-reviewed-product .metric').textContent = "N/A";

                    // Optionally display a message
                    document.querySelector('.no-reviews-message').textContent = "No reviews available for this product.";
                } else {
                    // Update metrics
                    document.querySelector('.total-reviews .metric').textContent = metrics.totalReviews;
                    document.querySelector('.average-rating .metric').textContent = `${metrics.averageRating}/5`;

                    // Update most reviewed product (optional)
                    if (metrics.mostReviewedProduct) {
                        document.querySelector('.most-reviewed-product .metric').textContent = metrics.mostReviewedProduct;
                    } else {
                        document.querySelector('.most-reviewed-product .metric').textContent = "N/A";
                    }

                    // Clear the "no reviews" message
                    document.querySelector('.no-reviews-message').textContent = "";
                }
            } else {
                console.error("Error fetching review metrics.");
            }
        })
        .catch(function (error) {
            console.error("Error fetching review metrics:", error);
        });
}

// Add event listener for product selection
document.getElementById('productSelect').addEventListener('change', function () {
    const productId = this.value;

    // Fetch data for the selected product
    fetchRatings(productId);
    fetchReviewMetrics(productId);
});

// Load product IDs on page load
fetchProductIds();
