<?php
    include('php/config.php');
    include('php/connection.php');
    include('php/authenticate_client.php');


    if(isset($_POST['close'])){
        header('Location: Client-Ordering.php');
        exit();
    }


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/Client-reviews.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <title>Leave a Review</title>
</head>
<body>
    <form action="add-reviews.php" method="POST">
        <div class="floating-container">
            <div class="container">

                <header>
                    <h4><?php echo htmlspecialchars($username); ?></h4>
                    <button href="#" name="close" class="close"><i class="fa-solid fa-xmark"></i></button>
                </header>

                <header class="nav-header">
                    <div class="product-container">
                        <img src="" alt="product">
                        <p>product name</p>
                    </div>
                </header>


                <div class="input-container">
                    <div class="row">
                        <label for="stars-input">Rate the product</label>
                        <input type="text" id="stars-input" name="stars-input" placeholder="enter rate 1-5">
                    </div>

                    <label for="comments">Enter comment</label>
                    <!-- <input type="text" id="comments" name="comments" placeholder="Leave a comment"> -->
                    <textarea name="commens" id="comments" placeholder="Leave a comment"></textarea>
                </div>

                <footer>
                    <button class="btn-submit" name="btn-submit" id="btn-submit">Submit</button>
                </footer>
            </div>
        </div>
    </form>
</body>
</html>