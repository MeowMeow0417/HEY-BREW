<?php

    include("php/config.php");
    include("php/connection.php");


    // Check if the user is logged in
    $isGuest = !isset($_SESSION['client_id']);


    if(!$isGuest){
        // Now you can use $client_id in your script
    $username = $_SESSION['username'];
    }



    if (isset($_POST['orderNow'])) {
        header('Location: Client-Ordering.php');
        exit();
    }


        if (isset($_POST['profile-card'])) {
            header('Location: Client-Profile.php');
            exit();
        }
        if (isset($_POST['signIn'])) {
            header('Location: SignUp-In.php');
            exit();
        }
        if (isset($_POST['signUp'])) {
            header('Location: SignUp-In.php');
            exit();
        }

        $products = [];

        // Query to fetch product details (excluding prices)
        $query = "SELECT
                    p.product_id,
                    p.image_path,
                    p.product_name,
                    p.prodDescription,
                    p.category,
                    p.type,
                    p.add_ons
                FROM
                    products p
                ORDER BY p.product_id";

        $result = mysqli_query($conn, $query);

        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $id = $row['product_id'];
                $products[$id] = [
                    'id' => $row['product_id'],
                    'image_path' => $row['image_path'],
                    'product_name' => $row['product_name'],
                    'prodDescription' => $row['prodDescription'],
                    'category' => $row['category'],
                    'type' => $row['type'],
                    'add_ons' => $row['add_ons']
                ];
            }
        } else {
            echo "Error: " . mysqli_error($conn);
        }

        // Get the selected category and search term
        $category = isset($_GET['category']) ? strtolower(trim($_GET['category'])) : 'all';
        $searchTerm = isset($_GET['search-bar']) ? strtolower(trim($_GET['search-bar'])) : '';

        // Filter products based on the selected category and search term
        $filteredProducts = array_filter($products, function ($product) use ($category, $searchTerm) {
            $productCategory = strtolower(trim($product['category']));
            $productName = strtolower($product['product_name']);

            $matchesCategory = $category === 'all' || $productCategory === $category;
            $matchesSearch = empty($searchTerm) || strpos($productName, $searchTerm) !== false;

            return $matchesCategory && $matchesSearch;
        });
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hey Brew Hide Out</title>
    <link href="https://fonts.googleapis.com/css2?family=Oleo+Script:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style/client/Client-HomePage.css">
    <link rel="stylesheet" href="style/client/Client-modal/C-H-PromptModal.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
    <form action="index.php" method="POST">
    <!-- Navigation Bar -->
    <nav id="nav">
        <div class="nav-container">
            <a href="#home" class="logo">Hey Brew Hide Out</a>
            <div class="nav-links">
                <a href="#home" class="home-btn">Home</a>
                <a href="#blog" class="blog-btn">Blog</a>
                <a href="#services" class="service-btn">Services</a>
                <a href="#about" class="about-btn">About</a>

                <div class="auth-buttons">

                    <?php if (isset($_SESSION['username'])): ?>
                         <!-- Profile -->
                            <a href="Client-Profile.php">
                                <div class="profile-card" id="profile-card" name="profile-card">
                                    <img src="style/images/category-row/profile.jpg" alt="Admin Profile">
                                    <div class="profile-info">
                                        <h4><?php echo htmlspecialchars($username); ?></h4>
                                    </div>
                                </div>
                            </a>


                            <!-- <button name="profile-card">profile</button> -->

                    <?php else: ?>
                        <button type="submit" name="signIn" class="nav-sign-in">Sign In</button>
                        <button type="submit" name="signUp" class="nav-sign-up">Sign Up</button>
                    <?php endif; ?>
                </div>
            </div>
            <button class="mobile-menu-btn">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
<!-- SAMPLE -->
    <!-- Hero Section -->
    <header class="hero" id="home">
        <div class="hero-content">
            <h1>Coffee & friends make the perfect blend</h1>
            <p>A perfect place to hangout and catch up!</p>
            <div class="order-now-container">

            <button class="order-now" name="orderNow">Order Now</button>
        </div>
    </header>

    <!-- Products Section -->
    <section class="products">
        <div class="products-container">
            <!-- Product Header-->
            <div class="products-header">
                <h2>Products</h2>
                <div class="header-controls">



                    <!-- Search bar -->
                        <input name="search-bar"  class="search-bar" id="searchInput" type="text" placeholder="Search..." >


                    <div class="navigation-buttons">
                        <button class="prev-btn">&lt;</button>
                        <button class="next-btn">&gt;</button>
                    </div>
                </div>
            </div>
            <!-- Product Row // Dynamically populate using PHP -->
            <div class="product-cards">
                <?php if ($filteredProducts): ?>
                    <?php foreach ($filteredProducts as $product): ?>
                        <div class="product-card">
                            <img src="<?php echo htmlspecialchars($product['image_path']); ?>"
                                alt="<?php echo htmlspecialchars($product['product_name']); ?>">
                            <div class="product-info">
                                <h3><?php echo htmlspecialchars($product['product_name']); ?></h3>
                                <p><?php echo htmlspecialchars($product['prodDescription']); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p>No Products found.</p>
                <?php endif; ?>
            </div>



        </div>
    </section>

    <section class="blog" id="blog">
        <div class="blog-container">
            <div class="blog-content">
                <h4>Blog</h4>
                <h2>Exciting Events at Hey Brew Hideout</h2>
                <div class="print">
                <p>At Hey Brew Hideout Cafe, we believe in bringing people together for more than just great food and drinks. That's why we host exciting raffles where you can win awesome prizes! Whether you're here to relax or hang out with friends, our raffles add an extra thrill to your visit.</p>
                <p class="ifP">If you're a gamer, you won't want to miss our tournaments! Show off your skills, compete for top spots, and enjoy the friendly competition. Stay tuned for updates on upcoming events, and make sure to join in on the fun!</p>
                    </div>
            </div>
            <div class="image-container">
                <div class="blog-image">
                    <img src="style/images/blog/raffle.png" alt="Image 1">
                </div>
                <div class="blog-image">
                    <img src="style/images/blog/tourna.png" alt="Image 2">
                </div>
            </div>
        </div>
    </section>


    <section class="services" id="service">
        <div class="logo-wrapper">
            <img src="style/images/service/heybrewlogo.jpg" alt="Hey Brew Hideout Cafe Logo" class="logo">
        </div>
        <div class="container">
            <h1>Services and Limited Offers</h1>
            <p class="subtitle">Experience the offers and services of<br>our Cafe's Hideout!</p>

            <div class="services-grid">
                <div class="service-card">
                    <h2>Mango Graham Float</h2>
                    <div class="image-wrapper">
                        <img src="style/images/service/mango float.jpg" alt="Mango Graham Float">
                    </div>
                    <p>Enjoy the tropical bliss of our Mango Graham Float—layers of sweet mangoes, creamy whipped goodness, and crunchy grahams in every chilled bite!</p>
                </div>

                <div class="service-card">
                    <h2>Exclusive Events</h2>
                    <div class="image-wrapper">
                        <img src="style/images/service/rent pic.jpg" alt="Exclusive Events">
                    </div>
                    <p>Host your special moments at Heybrew Hideout! Enjoy a cozy space, exclusive menu options, and a warm ambiance for unforgettable gatherings</p>
                </div>

                <div class="service-card">
                    <h2>Mango Smoothie</h2>
                    <div class="image-wrapper">
                        <img src="style/images/service/mango smoothie.jpg" alt="Mango Smoothie">
                    </div>
                    <p>Sip the sunshine with our Mango Smoothie in a pouch—refreshingly sweet, creamy, and ready to go wherever you do!</p>
                </div>
            </div>
        </div>
    </section>



<!--About Section-->

    <section class="About" id="about">
        <div class="container-about">
            <header>
                <h1>ABOUT</h1>
            </header>

            <main>
                <section class="about-bg">
                    <h2>Welcome to Hey Brew Hideout Cafe—<br>your happy tambayan place!</h2>
                    <p class="subtitle">Catching up with friends or enjoying some me-time?<br>
                    We're here to make every moment memorable.</p>
                </section>

                <div class="info-grid">
                    <section class="location">
                        <h3>Where Are We Located?</h3>
                        <p><i style="font-size:24px" class="fa">&#xf041;</i>Ramos Street, Villa Analy, Tarlac City Philippines</p>
                    </section>

                    <section class="offerings">
                        <h3>What We Offer</h3>
                        <p>We serve up a variety of tasty treats, from filling rice meals to freshly brewed coffee and refreshing smoothies. Everything's made to satisfy your cravings without hurting your wallet, so you can enjoy great food and good vibes. And if you're looking for a little extra fun, we've got board games to keep the good times rolling!</p>
                    </section>
                </div>

                <section class="contact">
                    <h3>Contact Us</h3>
                    <div class="contact-grid">
                        <a href="tel:0917-114-6918" class="contact-item">
                            <span> <i style="font-size:24px" class="fa">&#xf095;</i>     0917-114-6918</span>
                        </a>
                        <a href="https://www.facebook.com/HeyBrewHideoutCafe/" target="_blank" class="contact-item">

                            <span> <i style="font-size:24px" class="fa">&#xf09a;</i> Hey Brew Hideout Cafe</span>
                        </a>
                        <a href="https://www.instagram.com/heybrew_hideout_cafe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="contact-item">

                            <span> <i style="font-size:24px" class="fa">&#xf16d;</i> heybrew_hideout_cafe</span>
                        </a>
                    </div>
                </section>
            </main>
        </div>
    </section>
    </form>

    <!-- Prompt Modal -->
     <?php if ($isGuest): ?>
        <form action="index.php" method="POST">
            <div class="prompt-modal" id="prompt-modal" style="display: none">
                <div class="prompt-info">
                    <h1>Welcome</h1>
                    <p>to</p>
                    <h1>HEY BREW</h1>
                    <p>Log-in or Sign-up <br> to continue</p>
                    <br>
                    <button type="submit" name="signIn" class="signIn">Sign In</button>
                    <button type="submit" name="signUp" class="signUp">Sign Up</button>
                </div>
            </div>
        </form>
    <?php endif; ?>

    <script src="script/client/Client-HomePage.js"></script>
</body>
</html>