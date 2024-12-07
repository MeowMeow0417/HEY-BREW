<?php
    include("php/config.php");
    include("php/connection.php");
    include("php/athenticate_admin.php");


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/management/manage-analytics.css">
    <title>Hey Brew - Analytics</title>
</head>
<body>
    <div class="main-container">
        <!-- Side Navigation -->
        <div class="side-nav" id="side_nav">
            <!-- Profile Card -->
            <div class="profile-card" id="profile-card">
                <img src="style/images/category-row/profile.jpg" alt="Admin Profile">
                <div class="profile-info">
                    <h4><?php echo htmlspecialchars($manage_user); ?></h4>
                    <p>Seller</p>
                </div>
            </div>
            <!-- Navigation Buttons -->
            <form action="Manage-User.php" method="POST">
                <div class="button-col">
                    <button class="nav-button" name="products" type="submit">
                        <img src="style/images/icons/package.png" alt="Package Icon" width="24" height="24"> Products
                    </button>
                    <button class="nav-button" name="orders" type="submit">
                        <img src="style/images/icons/clipboard.png" alt="Order Icon" width="24" height="24"> Orders
                    </button>
                    <button class="nav-button" name="manage" type="submit">
                        <img src="style/images/icons/manage.png" alt="Manage Icon" width="24" height="24"> Manage
                    </button>
                    <button class="nav-button active" name="analytics" type="submit">
                        <img src="style/images/icons/analytics.png" alt="Analytics Icon" width="24" height="24"> Analytics
                    </button>
                    <button class="logOut" name="logOut" type="submit">Log Out</button>
                </div>
            </form>
        </div>

        <!-- Analytics Container -->
        <div class="container" id="container">
            <h2>Analytics Dashboard</h2>

            <!-- Detailed Analytics Section -->
            <div class="detailed-analytics">
                <div class="chart-container" id="chart-container">
                    <div class="overview" id="over">
                    <div class="overview-header">
                        <h3>Revenue Overview</h3>
                            <div class="selection" id="selection">
                                <button class="filter-day active">Day</button>
                                <button class="filter-month">Week</button>
                                <button class="filter-year">Month</button>
                            </div>
                        </div>
                    </div>

                    <!-- Example: Sales Line Chart -->
                    <canvas id="salesChart"></canvas>
                </div>
                <div class="chart-grid" id="chart-grid">
                    <div class="chart-container chart-2">
                        <h3>Review Ratings Distribution</h3>
                        <canvas id="ratingChart"></canvas>
                    </div>
                    <div class="chart-3">
                        <div class="metric-card">
                            <h4>Total Reviews</h4>
                            <p class="metric">500</p>
                        </div>
                        <div class="metric-card">
                            <h4>Average Rating</h4>
                            <p class="metric">4.5/5</p>
                        </div>
                        <div class="metric-card">
                            <h4>Most Reviewed Product</h4>
                            <p class="metric">Espresso Blend</p>
                        </div>
                    </div>
                </div>
                 <div class="chart-container chart-3">
                        <h3>Sentiment Analysis</h3>
                        <canvas id="sentimentChart"></canvas>
                    </div>
            </div>

            <!-- Analytics Overview Section -->
            <div class="analytics-overview">
                <div class="metric-card">
                    <h4>Total Sales</h4>
                    <p class="metric">₹120,000</p>
                </div>


            </div>



        </div>
    </div>

    <!-- Include JavaScript for charts (e.g., Chart.js) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script/client/admin/analytics.js"></script> <!-- JavaScript to handle chart rendering -->
</body>
</html>
