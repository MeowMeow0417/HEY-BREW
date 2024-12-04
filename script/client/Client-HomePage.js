document.addEventListener('DOMContentLoaded', () => {
    // Select various elements from the DOM
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');
    const productCards = document.querySelector('.product-cards');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const searchInput = document.querySelector('.search-bar');
    const loginContainer = document.querySelector('.login-container');

    // Mobile Menu Functionality
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any default button behavior
        e.stopPropagation(); // Stop event from bubbling up
        
        // Toggle both nav-links and login-container
        navLinks.classList.toggle('active');
        loginContainer.classList.toggle('active');
        
        // Handle hamburger animation
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navLinks.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && 
            !navLinks.contains(e.target) && 
            !loginContainer.contains(e.target)) {
            navLinks.classList.remove('active');
            loginContainer.classList.remove('active');
            
            // Reset hamburger icon
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });

    // Navigation Background on Scroll
    window.addEventListener('scroll', () => {
        const navContainer = document.getElementById('nav');
        navContainer.style.background = window.scrollY > 50 ? 'rgba(77, 44, 32, 0.95)' : 'transparent';
    });

    // Product Navigation
    if (prevBtn && nextBtn && productCards) {
        const cardWidth = productCards.querySelector('.product-card').offsetWidth;
        const scrollAmount = cardWidth * 2;

        nextBtn.addEventListener('click', () => {
            productCards.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            productCards.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        productCards.addEventListener('scroll', () => {
            const maxScroll = productCards.scrollWidth - productCards.clientWidth;
            prevBtn.style.opacity = productCards.scrollLeft > 0 ? '1' : '0.5';
            nextBtn.style.opacity = productCards.scrollLeft < maxScroll ? '1' : '0.5';
        });

        prevBtn.style.opacity = '0.5';
    }

    // Mobile Sign In/Up Redirect
    const authLinks = document.querySelectorAll('.nav-sign-in, .nav-sign-up');
    authLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const mobileHref = link.getAttribute('data-mobile-href');
                if (mobileHref) {
                    window.location.href = mobileHref;
                }
            }
        });
    });

    // Smooth Scroll Functionality
    const scrollToSection = (selector) => {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Event listeners for navigation buttons
    ['home', 'blog', 'service', 'about'].forEach(section => {
        const btn = document.querySelector(`.${section}-btn`);
        if (btn) {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                scrollToSection(`#${section}`);
            });
        }
    });

    // Logo button scroll functionality
    const logoBtn = document.querySelector('.logo');
    if (logoBtn) {
        logoBtn.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToSection('#home');
        });
    }

    // Search functionality
    if (searchInput) {
        const productCards = document.querySelectorAll('.product-card');
        
        console.log('Search initialized with:', {
            searchInput,
            productCardsCount: productCards.length
        });

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            console.log('Searching for:', searchTerm);

            productCards.forEach(product => {
                // Get product name and description
                const productName = product.querySelector('.product-info h3')?.textContent?.toLowerCase() || '';
                const productDescription = product.querySelector('.product-info p')?.textContent?.toLowerCase() || '';

                const shouldShow = productName.includes(searchTerm) || 
                productDescription.includes(searchTerm);
                product.style.display = shouldShow ? 'flex' : 'none';
            });
        });
    } else {
        console.warn('Search input not found');
    }
});
    