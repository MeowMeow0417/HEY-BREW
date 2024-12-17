document.addEventListener('DOMContentLoaded', function() {
    const fetchAndDisplayReviews = async () => {
        try {
            console.log('Fetching reviews...');
            const response = await fetch('./homepage-review.php');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('Raw response:', text);
            
            let reviews;
            try {
                reviews = JSON.parse(text);
            } catch (e) {
                console.error('JSON parsing error:', e);
                console.log('Problematic text:', text);
                return;
            }
            
            console.log('Parsed reviews:', reviews);
            
            if (!reviews || reviews.length === 0) {
                console.log('No reviews found');
                return;
            }

            const topRow = document.getElementById('marquee-top');
            const bottomRow = document.getElementById('marquee-bottom');
            
            if (!topRow || !bottomRow) {
                console.error('Could not find marquee rows');
                return;
            }

            // Clear existing content
            topRow.innerHTML = '';
            bottomRow.innerHTML = '';
            
            // Create review cards
            const createReviewCard = (review) => {
                console.log('Creating card for review:', review);
                const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                return `
                    <div class="review-card">
                        <div class="review-header">
                            <div class="avatar"></div>
                            <div class="customer-info">
                                <p class="customer-name">${review.username}</p>
                                <p class="customer-stars">${stars}</p>
                            </div>
                        </div>
                        <p class="review-text">${review.comment}</p>
                        <p class="product-name">Product: ${review.product_name}</p>
                    </div>
                `;
            };

            // Split reviews between top and bottom rows
            const midPoint = Math.ceil(reviews.length / 2);
            const topReviews = reviews.slice(0, midPoint);
            const bottomReviews = reviews.slice(midPoint);

            // Create marquee content
            const createMarqueeContent = (reviewsArray) => {
                const content = document.createElement('div');
                content.className = 'marquee-content';
                content.innerHTML = reviewsArray.map(review => createReviewCard(review)).join('');
                return content;
            };

            // Add content to rows
            const topContent = createMarqueeContent(topReviews);
            const bottomContent = createMarqueeContent(bottomReviews);

            topRow.appendChild(topContent.cloneNode(true));
            topRow.appendChild(topContent.cloneNode(true));
            bottomRow.appendChild(bottomContent.cloneNode(true));
            bottomRow.appendChild(bottomContent.cloneNode(true));

        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
        }
    };

    // Initial load
    fetchAndDisplayReviews();

    // Refresh reviews every 5 minutes
    setInterval(fetchAndDisplayReviews, 300000);
});

