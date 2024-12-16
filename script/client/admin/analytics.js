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
async function fetchSalesData(filter = 'month') {
    try {
        const response = await fetch(`php/get_salesData.php?action=get&filter=${filter}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.salesData && Array.isArray(data.salesData)) {
            const labels = data.salesData.map(entry => formatDatetime(entry.datetime, filter));
            const sales = data.salesData.map(entry => entry.sales);

            if (labels.length === 0 || sales.length === 0) {
                console.warn("No data available to update the chart.");
                return;
            }

            salesChart.data.labels = labels;
            salesChart.data.datasets[0].data = sales;
            console.log("Updated Chart Data:", salesChart.data);

            salesChart.update(); // Trigger re-render
        } else {
            console.error("Invalid sales data format:", data);
        }

        if (data.totalSales !== undefined) {
            document.querySelector('.metric').textContent = `₱${data.totalSales.toLocaleString()}`;
        }
    } catch (error) {
        console.error(`Error fetching sales data for ${filter}:`, error);
    }
}

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
// Function to fetch review metrics for a product
function fetchReviewMetrics(productId) {
    if (!productId || isNaN(productId)) {
        console.error("Invalid product ID.");
        return;
    }

    axios.get(`php/get-review-metrics.php?product_id=${productId}`)
        .then(function (response) {
            if (response.status === 200 && response.data) {
                const metrics = response.data;

                // Update the Total Reviews metric
                document.querySelector('.total-reviews .metric').textContent = metrics.totalReviews;

                // Update the Average Rating metric
                document.querySelector('.average-rating .metric').textContent = `${metrics.averageRating}/5`;

                // Update the Most Reviewed Product metric (if necessary)
                if (metrics.mostReviewedProduct) {
                    document.querySelector('.most-reviewed-product .metric').textContent = metrics.mostReviewedProduct;
                }
            } else {
                console.error("Error fetching review metrics.");
            }
        })
        .catch(function (error) {
            console.error("Error fetching review metrics:", error);
        });
}

// Fetch product IDs dynamically and populate the dropdown
function fetchProductIds() {
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
                    option.value = product.id;
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

// Add event listener for product selection
document.getElementById('productSelect').addEventListener('change', function () {
    const productId = this.value;
    fetchRatings(productId); // Fetch ratings for selected product
    fetchReviewMetrics(productId); // Fetch review metrics for selected product
});

// Load product IDs and review metrics on page load
fetchProductIds();
