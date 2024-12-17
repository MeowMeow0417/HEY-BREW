document.addEventListener('DOMContentLoaded', () => {
    const categoryRow = document.querySelector('.category-row');
    const categoryBoxes = document.querySelectorAll('.category-box');

    // Restore scroll position when page loads
    const savedScrollPosition = localStorage.getItem('categoryScrollPosition');
    if (savedScrollPosition) {
        categoryRow.scrollLeft = parseInt(savedScrollPosition);
    }

    // Save scroll position when scrolling
    categoryRow.addEventListener('scroll', () => {
        localStorage.setItem('categoryScrollPosition', categoryRow.scrollLeft);
    });

    // Handle category clicks
    categoryBoxes.forEach((box) => {
        box.addEventListener('click', (e) => {
            e.preventDefault();

            // Save the current scroll position
            localStorage.setItem('categoryScrollPosition', categoryRow.scrollLeft);

            // Remove active class from all boxes
            categoryBoxes.forEach((b) => b.classList.remove('active'));

            // Add active class to clicked box
            box.classList.add('active');

            // Get category and update URL
            const category = box.dataset.category;

            // Redirect to the category URL
            window.location.href = `?category=${category}`;
        });
    });
});

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar');

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
                const productName = product.querySelector('.product-info h4')?.textContent?.toLowerCase() || '';
                const productDescription = product.querySelector('.product-grid p')?.textContent?.toLowerCase() || '';

                // Check if product name or description contains search term
                const shouldShow = productName.includes(searchTerm) ||
                                 productDescription.includes(searchTerm);

                // Show/hide the product card
                product.style.display = shouldShow ? 'flex' : 'none';
            });
        });
    } else {
        console.warn('Search input not found');
    }
});

// Options modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('options-modal'); // Select the modal
    const closeModalButton = modal.querySelector('.close'); // Select the close button
    const modalImage = modal.querySelector('.product-grid img'); // Modal image
    const modalName = modal.querySelector('.product-grid h4'); // Modal product name
    const modalDescription = modal.querySelector('.product-grid p'); // Modal product description
    const modalTypeSelect = modal.querySelector('select[name="type"]'); // Modal type dropdown
    const modalAddOnSelect = modal.querySelector('select[name="add_on"]'); // Modal add-ons dropdown
    const modalSizePriceSelect = modal.querySelector('select[name="size_price"]'); // Modal size & price dropdown
    const modalProductIdInput = modal.querySelector('input[name="product_id"]'); // Hidden product ID input
    const reviewSection = document.querySelector('.reviews-section'); // Reviews section in modal

    // Add active class on hover
    reviewSection.addEventListener('mouseenter', () => {
        reviewSection.classList.add('active');
    });

    // Remove active class when clicking outside
    document.addEventListener('click', (event) => {
        if (!reviewSection.contains(event.target)) {
            reviewSection.classList.remove('active');
        }
    });

    // Helper function to render stars
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fa-solid fa-star"></i>';
        if (halfStar) starsHTML += '<i class="fa-solid fa-star-half"></i>';
        for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="fa-regular fa-star"></i>';
        return starsHTML;
    }

    // Function to populate and show the modal with product details
    function showModal(card) {
        const productId = card.getAttribute('data-id'); // Get product ID
        const productName = card.getAttribute('data-name');
        const productImage = card.getAttribute('data-image');
        const productDescription = card.getAttribute('data-description');
        const productTypes = card.getAttribute('data-types').split(',');
        const productAddOns = card.getAttribute('data-addons').split(',');
        const productPrices = JSON.parse(card.getAttribute('data-prices'));
        const averageRating = parseFloat(card.getAttribute('data-average-rating') || 0).toFixed(1);
        const totalReviews = parseInt(card.getAttribute('data-total-reviews') || 0, 10);
        const comments = JSON.parse(card.getAttribute('data-comments') || '[]');

        // Populate modal content
        modal.dataset.id = productId; // Set modal data-id for reference
        modalProductIdInput.value = productId; // Set hidden product ID input value
        modalImage.src = productImage || '';
        modalImage.alt = productName || 'Product Image';
        modalName.textContent = productName || 'Unknown Product';
        modalDescription.textContent = productDescription || 'No description available.';

        // Populate Type Dropdown
        modalTypeSelect.innerHTML = '';
        productTypes.forEach(type => {
            modalTypeSelect.innerHTML += `<option value="${type.trim()}">${type.trim()}</option>`;
        });

        // Populate Add-Ons Dropdown
        modalAddOnSelect.innerHTML = '<option value="">None</option>';
        productAddOns.forEach(addOn => {
            modalAddOnSelect.innerHTML += `<option value="${addOn.trim()}">${addOn.trim()}</option>`;
        });

        // Populate Size & Price Dropdown with data-price attribute
        modalSizePriceSelect.innerHTML = '';
        productPrices.forEach(priceInfo => {
            modalSizePriceSelect.innerHTML += `
                <option value="${priceInfo.size}" data-price="${parseFloat(priceInfo.price).toFixed(2)}">
                    ${priceInfo.size.charAt(0).toUpperCase() + priceInfo.size.slice(1)} - ₱${parseFloat(priceInfo.price).toFixed(2)}
                </option>`;
        });

       // Populate Reviews Section
        const reviewsSection = modal.querySelector('.reviews-section');
        reviewsSection.innerHTML = `
            <div class="average-rating">
                <p>Average Rating: <strong>${averageRating}</strong> / 5</p>
                <div class="stars">${renderStars(averageRating)}</div>
                <p>(${totalReviews} Reviews)</p>
            </div>
            <div class="comments">
                ${comments.length > 0 ? comments.map(comment => `
                    <div class="comment">
                        <p><strong>${comment.user}</strong></p>
                        <p>${comment.comment}</p>
                        <div class="stars">${renderStars(comment.rating)}</div>
                    </div>`).join('') : '<p>No reviews available.</p>'}
            </div>
        `;


        modal.style.display = 'block'; // Show the modal
    }

    // Event listener for opening the modal
    document.addEventListener('click', (event) => {
        const card = event.target.closest('.product-card'); // Check if a product card was clicked
        if (card) {
            showModal(card); // Show the modal with the clicked product's details
        }
    });

    // Close the modal when the close button is clicked
    closeModalButton.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close the modal when pressing the Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});


// GET PRODUCT NAME
// ADD TO CART
document.addEventListener("DOMContentLoaded", () => {
    const productOrder = document.querySelector("#product-order"); // Target the Place Order section
    const totalPriceElement = document.getElementById("total-price"); // Total price display element
    const addToCartButton = document.getElementById("btn-cart"); // Add to Cart button
    const modal = document.getElementById("options-modal"); // Modal
    let totalPrice = 0; // Initialize total price

    console.log('Add to cart script is up and running.');

    // Load saved products from localStorage
    loadSavedProducts();

    // Add to Cart Button Click Handler
    addToCartButton.addEventListener("click", () => {
        const productId = modal.dataset.id;
        const modalImage = modal.querySelector(".product-grid img")?.src || "";
        const modalName = modal.querySelector(".product-grid h4")?.textContent.trim() || "Unknown";
        const sizeElement = modal.querySelector("select[name='size_price']");
        const modalPrice = sizeElement?.selectedOptions.length > 0
            ? parseFloat(sizeElement.selectedOptions[0].getAttribute("data-price")) || 0
            : 0;
        const selectedSize = sizeElement?.value || "N/a";
        const typeElement = modal.querySelector("select[name='type']");
        const selectedType = typeElement?.value || "N/a";
        const addOnsElement = modal.querySelector("select[name='add_on']");
        const selectedAddOns = addOnsElement?.value || "N/a";

        const uniqueProductId = `${productId}_${selectedSize}`;

        const product = {
            id: uniqueProductId,
            name: modalName,
            image: modalImage,
            size: selectedSize,
            type: selectedType,
            addOns: selectedAddOns,
            quantity: 1,
            price: modalPrice
        };

        const existingProduct = productOrder.querySelector(`[data-id="${product.id}"]`);
        if (existingProduct) {
            updateExistingProduct(existingProduct, product);
        } else {
            addNewProduct(product);
        }

        updateTotalPriceDisplay();
        saveProducts();
        modal.style.display = "none";
    });

    function updateExistingProduct(existingProduct, product) {
        const quantityElement = existingProduct.querySelector(".stepper-value");
        const totalPriceElementForProduct = existingProduct.querySelector(".total-price");

        let quantity = parseInt(quantityElement.textContent) || 0;
        quantity += 1;
        quantityElement.textContent = quantity;

        const updatedPrice = product.price * quantity;
        totalPriceElementForProduct.textContent = updatedPrice.toFixed(2);

        totalPrice += product.price;
    }

    function addNewProduct(product, isLoading = false) {
        const productRow = document.createElement("div");
        productRow.classList.add("product-row");
        productRow.setAttribute("data-id", product.id);

        productRow.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.type}</p>
                <p>${product.addOns}</p>
            </div>
            <div class="price-con">
                <p>${product.size}</p>
                <span class="size-price">₱<span class="total-price">${(product.price * product.quantity).toFixed(2)}</span></span>
            </div>
            <div class="product-function">
                <a href="#" class="remove-prod"><i class="fa-solid fa-trash"></i></a>
                <div class="stepper">
                    <a class="stepper-btn decrement"><i class="fa-solid fa-minus"></i></a>
                    <span class="stepper-value">${product.quantity}</span>
                    <a class="stepper-btn increment"><i class="fa-solid fa-plus"></i></a>
                </div>
            </div>
        `;

        productOrder.appendChild(productRow);

        // Only update totalPrice when not loading from saved data
        if (!isLoading) {
            totalPrice += product.price * product.quantity;
        }

        handleQuantityAdjustments(productRow, product.price);
        handleRemoveProduct(productRow);
    }


    function handleQuantityAdjustments(productRow, productPrice) {
        const decrementButton = productRow.querySelector(".decrement");
        const incrementButton = productRow.querySelector(".increment");
        const quantityValue = productRow.querySelector(".stepper-value");
        const totalPriceElementForProduct = productRow.querySelector(".total-price");

        decrementButton.addEventListener("click", () => {
            let quantity = parseInt(quantityValue.textContent) || 1;
            if (quantity > 1) {
                quantity -= 1;
                quantityValue.textContent = quantity;

                const updatedPrice = productPrice * quantity;
                totalPriceElementForProduct.textContent = updatedPrice.toFixed(2);

                totalPrice -= productPrice;
                updateTotalPriceDisplay();
                saveProducts();
            }
        });

        incrementButton.addEventListener("click", () => {
            let quantity = parseInt(quantityValue.textContent) || 0;
            quantity += 1;
            quantityValue.textContent = quantity;

            const updatedPrice = productPrice * quantity;
            totalPriceElementForProduct.textContent = updatedPrice.toFixed(2);

            totalPrice += productPrice;
            updateTotalPriceDisplay();
            saveProducts();
        });
    }

    function handleRemoveProduct(productRow) {
        const removeButton = productRow.querySelector(".remove-prod");
        removeButton.addEventListener("click", (event) => {
            event.preventDefault();

            const quantity = parseInt(productRow.querySelector(".stepper-value")?.textContent) || 1;
            const productPrice = parseFloat(productRow.querySelector(".total-price")?.textContent) || 0;

            totalPrice -= productPrice;
            if (totalPrice < 0) totalPrice = 0;

            productRow.remove();
            updateTotalPriceDisplay();
            saveProducts();
        });
    }

    function updateTotalPriceDisplay() {
        totalPriceElement.textContent = `₱${totalPrice.toFixed(2)}`;
    }

    function saveProducts() {
        const products = [];
        const productRows = document.querySelectorAll("#product-order .product-row");

        productRows.forEach(row => {
            try {
                const id = row.getAttribute("data-id") || "unknown-id"; // Fallback for missing ID
                const name = row.querySelector("h4")?.textContent.trim() || "Unknown";
                const size = row.querySelector(".product-info p:nth-child(2)")?.textContent.trim() || "Unknown";
                const type = row.querySelector(".product-info p:nth-child(3)")?.textContent.trim() || "Unknown";
                const quantity = parseInt(row.querySelector(".stepper-value")?.textContent) || 0;
                const addOns = row.querySelector(".product-info p:nth-child(4)")?.textContent.trim() || "None";
                const totalPriceElement = row.querySelector(".total-price");
                const totalPrice = totalPriceElement ? parseFloat(totalPriceElement.textContent) || 0 : 0;
                const price = quantity > 0 ? totalPrice / quantity : 0;
                const image = row.querySelector("img")?.src || "";

                products.push({ id, name, size, type, addOns, quantity, price, image });
            } catch (error) {
                console.error("Error processing a product row:", error);
            }
        });

        localStorage.setItem("products", JSON.stringify(products));
        console.log("Products saved successfully:", products);

    }


    function loadSavedProducts() {
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        totalPrice = 0; // Reset total price before loading

        savedProducts.forEach(product => {
            addNewProduct(product, true); // Pass 'true' to prevent duplicate addition
            totalPrice += product.price * product.quantity; // Calculate total price once
        });

        updateTotalPriceDisplay();
    }

});


//Pushing to the database
// Order submission handler
async function submitOrder() {
    const productRows = document.querySelectorAll("#product-order .product-row");
    const clientId = document.getElementById("product-order").dataset.clientId;
    const orderData = [];

    // Check for Client ID
    if (!clientId) {
        alert("Client ID is missing. Please refresh the page and try again.");
        return;
    }

    // Check for Empty Cart
    if (productRows.length === 0) {
        alert("Your cart is empty. Please add items to your cart before checking out.");
        return;
    }
    console.log(productRows);
    console.log(orderData);

    // Build Order Data
    productRows.forEach(row => {
        try {
            const id = row.getAttribute("data-id");
            const name = row.querySelector(".product-info h4")?.textContent.trim() || "Unknown";
            let size = row.querySelector(".price-con p")?.textContent.trim() || "N/A";

// Convert size to lowercase for case-insensitive comparison
const validSizes = ["small", "medium", "large"];
size = size.toLowerCase();  // Convert size to lowercase

if (!validSizes.includes(size)) {
    size = "small"; // Default value
}

// Capitalize the first letter for display or storage
size = size.charAt(0).toUpperCase() + size.slice(1); // Converts to "Small", "Medium", "Large"


            const type = row.querySelector(".product-info p:nth-child(2)")?.textContent.trim() || "None";
            const addOns = row.querySelector(".product-info p:nth-child(3)")?.textContent.trim() || "None";
            const quantity = parseInt(row.querySelector(".stepper-value")?.textContent) || 1;
            const totalPrice = parseFloat(row.querySelector(".total-price")?.textContent) || 0;
            const productId = id.split("-")[0];

            orderData.push({
                product_id: productId,
                name: name,
                size: size,
                type: type,
                add_ons: addOns,
                quantity: quantity,
                total_price: totalPrice
            });
        } catch (error) {
            console.error("Error processing product row:", error);
        }
    });

    // Function to Clear Cart
    const clearCart = () => {
        document.querySelector("#product-order").innerHTML = "";
        document.getElementById("total-price").textContent = "₱0.00";
        localStorage.removeItem("products");
    };

    // Submit Order Using Axios
    try {
        const response = await axios.post("http://localhost/HEY-BREW/php/submit_order.php", {
            client_id: clientId,
            order_items: orderData
        });

        console.log(response.data);
        clearCart();

        // Show the modal on successful order submission
        const modal = document.getElementById("modal");
        modal.style.display = "block";

        // Hide the modal after 2 seconds
        setTimeout(() => {
            modal.style.display = "none";
        }, 2000);
    } catch (error) {
        console.error("Error during order submission:", error);
        alert("An error occurred while placing your order. Please try again later.");
    }
}

// Attach event listener to the order button
document.getElementById("btn-order").addEventListener("click", submitOrder);
