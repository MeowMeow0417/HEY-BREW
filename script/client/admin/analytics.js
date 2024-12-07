// Review Revenue (Bar Chart)
var ctxSales = document.getElementById('salesChart').getContext('2d');
    var salesChart = new Chart(ctxSales, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()), // Days 1 to 30
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

   // Fetch sales data and update the chart
   async function fetchSalesData() {
    try {
        const response = await fetch('php/get_salesData.php?action=get', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const salesData = await response.json();
        console.log('Fetched sales data:', salesData);

        if (Array.isArray(salesData)) {
            // Update chart data
            salesChart.data.datasets[0].data = salesData;
            salesChart.update();
        } else {
            console.error('Invalid sales data format:', salesData);
        }
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}

// Fetch data when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchSalesData);



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
    type: 'bar',
    data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            label: 'Sentiment Analysis',
            data: [500, 25, 15],
            backgroundColor: ['#28a745', '#f39c12', '#e74c3c']
        }]
    }
});
