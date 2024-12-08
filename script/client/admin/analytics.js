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
        // API call to fetch sales data
        const response = await fetch(`php/get_salesData.php?action=get&filter=${filter}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.salesData && Array.isArray(data.salesData)) {
            // Extract datetime and sales values
            const labels = data.salesData.map(entry => formatDatetime(entry.datetime, filter));
            const sales = data.salesData.map(entry => entry.sales);

            // Update chart
            salesChart.data.labels = labels;
            salesChart.data.datasets[0].data = sales;
            salesChart.update();
        } else {
            console.error('Invalid sales data format:', data);
        }

        // Update Total Sales Metric
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
var ctxRatings = document.getElementById('ratingChart').getContext('2d');
var ratingChart = new Chart(ctxRatings, {
    type: 'pie',
    data: {
        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
        datasets: [{
            label: 'Review Ratings',
            data: [50, 30, 10, 5, 5],
            backgroundColor: ['#28a745', '#ffcc00', '#f39c12', '#e74c3c', '#dcdcdc']
        }]
    }
});

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
