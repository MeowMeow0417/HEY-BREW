// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim(); // Get the value from the search input and trim spaces

        productCards.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase(); // Get product name
            const productDescription = product.querySelector('p').textContent.toLowerCase(); // Include description in search if needed

            // Check if the product name or description includes the search term
            if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                product.style.display = 'block'; // Show product
            } else {
                product.style.display = 'none'; // Hide product
            }
        });
    });
});



// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select various elements from the DOM
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');
    const productCards = document.querySelector('.product-cards');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const searchInput = document.querySelector('.search-input');
    const loginContainer = document.querySelector('.login-container'); // Added this line

    // Mobile Menu Functionality
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle the 'active' class on navLinks to show/hide the mobile menu
        navLinks.classList.toggle('active');
        loginContainer.classList.toggle('active'); // Added this line
        // Select all spans within the mobile menu button
        const spans = mobileMenuBtn.querySelectorAll('span');
        // Transform the spans to create an 'X' icon when the menu is active
        spans.forEach((span, index) => {
            if (navLinks.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                // Reset the spans to their original state when the menu is inactive
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Navigation Background on Scroll
    window.addEventListener('scroll', () => {
        const navContainer = document.getElementById('nav');
        navContainer.style.background = window.scrollY > 50 ? 'rgba(77, 44, 32, 0.95)' : 'transparent';
    });


    // Product Navigation
    if (prevBtn && nextBtn && productCards) {
        // Calculate the width of a single product card
        const cardWidth = productCards.querySelector('.product-card').offsetWidth;
        // Set the scroll amount to twice the card width
        const scrollAmount = cardWidth * 2;

        // Add click event listener to the next button
        nextBtn.addEventListener('click', () => {
            // Scroll the product cards container to the right
            productCards.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Add click event listener to the previous button
        prevBtn.addEventListener('click', () => {
            // Scroll the product cards container to the left
            productCards.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Add scroll event listener to the product cards container
        productCards.addEventListener('scroll', () => {
            // Calculate the maximum scroll position
            const maxScroll = productCards.scrollWidth - productCards.clientWidth;
            // Update the opacity of the previous button based on scroll position
            prevBtn.style.opacity = productCards.scrollLeft > 0 ? '1' : '0.5';
            // Update the opacity of the next button based on scroll position
            nextBtn.style.opacity = productCards.scrollLeft < maxScroll ? '1' : '0.5';
        });

        // Set initial opacity of the previous button to 0.5
        prevBtn.style.opacity = '0.5';
    }


    // Mobile Sign In/Up Redirect
    const authLinks = document.querySelectorAll('.nav-sign-in, .nav-sign-up');
    authLinks.forEach(link => {
        // Add click event listener to each auth link
        link.addEventListener('click', (e) => {
            // Check if the window width is 768px or less (mobile view)
            if (window.innerWidth <= 768) {
                // Prevent the default link behavior
                e.preventDefault();
                // Get the mobile-specific href
                const mobileHref = link.getAttribute('data-mobile-href');
                if (mobileHref) {
                    // Redirect to the mobile-specific URL
                    window.location.href = mobileHref;
                }
            }
        });
    });


    //BUTTON FUNCTIONALITY


    // Service Button Scroll Functionality
    const serviceBtn = document.querySelector('.service-btn');
    if (serviceBtn) {
        // Add click event listener to the service button
        serviceBtn.addEventListener('click', (event) => {
            // Prevent default anchor behavior
            event.preventDefault();

            // Scroll to the services section
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // About Button Scroll Functionality
    const aboutBtn = document.querySelector('.about-btn');
    if (aboutBtn) {
        // Add click event listener to the about button
        aboutBtn.addEventListener('click', (event) => {
            // Prevent default anchor behavior
            event.preventDefault();

            // Scroll to the about section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    // Home Button Scroll Functionality
    const homeBtn = document.querySelector('.home-btn');
    if (homeBtn) {
        // Add click event listener to the about button
        homeBtn.addEventListener('click', (event) => {
            // Prevent default anchor behavior
            event.preventDefault();

            // Scroll to the Home section
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Home Button Scroll Functionality
    const logoBtn = document.querySelector('.logo');
    if (logoBtn) {
        // Add click event listener to the about button
        logoBtn.addEventListener('click', (event) => {
            // Prevent default anchor behavior
            event.preventDefault();

            // Scroll to the Home section
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

// Blog Button Scroll Functionality
const blogBtn = document.querySelector('.blog-btn');
if (blogBtn) {
    // Add click event listener to the blog button
    blogBtn.addEventListener('click', (event) => {
        // Prevent default anchor behavior
        event.preventDefault();

        // Scroll to the Blog section
        const blogSection = document.getElementById('blog');
        if (blogSection) {
            blogSection.scrollIntoView({ behavior: 'smooth' }); // Corrected line
        }
    });
}


});
