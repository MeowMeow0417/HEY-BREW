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





// Initial Data Fetch for Default Filter



// Review Ratings Distribution (Pie Chart)
// Function to update the query parameter in the URL
function updateQueryParam(param, value) {
    const url = new URL(window.location.href);

    // Update or add the query parameter
    url.searchParams.set(param, value);

    // Update the browser's address bar without reloading the page
    history.replaceState(null, '', url.toString());
}

// Function to ensure the product ID is set
function ensureProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('product_id');

    if (!productId) {
        // Dynamically set a default product_id (e.g., 123)
        productId = '123'; // Replace with your logic for determining the product ID
        updateQueryParam('product_id', productId);

        console.log(`Product ID was missing. Set to default: ${productId}`);
    }

    return productId; // Return the productId for use outside the function
}

// Get the product ID on page load
const productId = ensureProductId();

if (productId) {
    // Fetch data and render the chart only if productId is valid
    axios.get(`php/get-ratings.php?product_id=${productId}`)
        .then(response => {
            console.log('Response from server:', response.data); // Log the server response
            if (response.data && Array.isArray(response.data)) {
                const ratingData = response.data;

                // Render the chart
                const ctxRatings = document.getElementById('ratingChart').getContext('2d');
                new Chart(ctxRatings, {
                    type: 'pie',
                    data: {
                        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
                        datasets: [{
                            label: 'Review Ratings',
                            data: ratingData,
                            backgroundColor: ['#28a745', '#ffcc00', '#f39c12', '#e74c3c', '#dcdcdc']
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        const count = ratingData[tooltipItem.dataIndex];
                                        return `${tooltipItem.label}: ${count} Reviews`;
                                    }
                                }
                            }
                        }
                    }
                });
            } else {
                console.error('Invalid data received from the server:', response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching rating data:', error);
        });
} else {
    console.error('Product ID is missing from the URL.');
    alert('Product ID is missing from the URL. Please include it as a query parameter, e.g., ?product_id=123');
}




// Sentiment Analysis (Bar Chart)
var ctxSentiment = document.getElementById('sentimentChart').getContext('2d');
var sentimentChart = new Chart(ctxSentiment, {
    type: 'line',
    data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            label: 'Sentiment Analysis',
            data: [500, 25, 15],
            backgroundColor: ['#28a745', '#f39c12', '#e74c3c']
        }]
    }
});
