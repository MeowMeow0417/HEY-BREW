class Marquee {
    constructor(element, options = {}) {
        this.container = element;
        this.options = {
            repeat: 3,
            gap: '1.5rem',
            duration: '40s',
            ...options
        };
        
        this.init();
    }

    init() {
        const topRow = this.container.querySelector('#marquee-top');
        const bottomRow = this.container.querySelector('#marquee-bottom');

        topRow.style.setProperty('--gap', this.options.gap);
        topRow.style.setProperty('--duration', this.options.duration);
        bottomRow.style.setProperty('--gap', this.options.gap);
        bottomRow.style.setProperty('--duration', this.options.duration);
        
        // Split reviews into two groups for top and bottom rows
        const reviews = this.getReviews();
        const midPoint = Math.ceil(reviews.length / 2);
        const topReviews = reviews.slice(0, midPoint);
        const bottomReviews = reviews.slice(midPoint);

        for (let i = 0; i < this.options.repeat; i++) {
            const topDiv = document.createElement('div');
            topDiv.className = 'marquee-content';
            topDiv.innerHTML = this.generateReviewsHTML(topReviews);
            topRow.appendChild(topDiv);

            const bottomDiv = document.createElement('div');
            bottomDiv.className = 'marquee-content';
            bottomDiv.innerHTML = this.generateReviewsHTML(bottomReviews);
            bottomRow.appendChild(bottomDiv);
        }
    }

    getReviews() {
        return [
            { name: 'Andrei', stars: 5, text: 'Great product! Highly recommended. The quality exceeded my expectations.' },
            { name: 'Janina', stars: 4, text: 'Very satisfied with my purchase. Good value for money and fast shipping.' },
            { name: 'Mary', stars: 5, text: 'Excellent quality and outstanding customer service. Will definitely buy again!' },
            { name: 'Marga', stars: 4, text: 'Good product overall. A few minor issues, but nothing major to complain about.' },
            { name: 'Gilbert', stars: 5, text: 'Exceeded my expectations! This product has made a significant difference in my daily routine.' },
            { name: 'Tomas', stars: 4, text: 'Very happy with this product. It does exactly what it promises and arrived on time.' },
            { name: 'Keazer', stars: 5, text: 'Outstanding product and customer service. The team went above and beyond to ensure my satisfaction.' },
            { name: 'Gifted', stars: 5, text: 'Outstanding product and customer service. The team went above and beyond to ensure my satisfaction.' },
            { name: 'Keazer', stars: 5, text: 'Outstanding product and customer service. The team went above and beyond to ensure my satisfaction.' },
            { name: 'Dominic', stars: 4, text: 'Would definitely buy again. Great quality for the price and very user-friendly.' }
        ];
    }

    generateReviewsHTML(reviews) {
        return reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="avatar" aria-hidden="true"></div>
                    <div class="customer-info">
                        <p class="customer-name">${review.name}</p>
                        <p class="customer-stars" aria-label="${review.stars} stars">${'★'.repeat(review.stars)}</p>
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }
}

// Initialize the marquee
new Marquee(document.getElementById('marquee'), {
    repeat: 3,
    gap: '1.5rem',
    duration: '20s'
});

