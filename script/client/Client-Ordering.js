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


//Options modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('options-modal'); // Select the modal
    const closeModalButton = modal.querySelector('.close'); // Select the close button
    const modalImage = modal.querySelector('.product-grid img'); // Modal image
    const modalName = modal.querySelector('.product-grid h4'); // Modal product name
    const modalDescription = modal.querySelector('.product-grid p'); // Modal product description
    const modalTypeSelect = modal.querySelector('select[name="type"]'); // Modal type dropdown
    const modalAddOnSelect = modal.querySelector('select[name="add_on"]'); // Modal add-ons dropdown
    const modalSizePriceSelect = modal.querySelector('select[name="size_price"]'); // Modal size & price dropdown
    const reviewSection = document.querySelector('.reviews-section');

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
        const productId = card.getAttribute('data-id');
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
        modal.dataset.id = productId;
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

    // Load saved products from localStorage
    loadSavedProducts();
    console.log('Add to cart script. up and running');

    // Add to Cart Button Click Handler
    addToCartButton.addEventListener("click", () => {
        console.log("Add to Cart button clicked.");

        // Retrieve product details from modal
        const productId = modal.dataset.id;
        const modalImage = modal.querySelector(".product-grid img").src;
        const modalName = modal.querySelector(".product-grid h4").textContent.trim();
        const sizeElement = modal.querySelector("select[name='size_price']");
        const modalPrice = sizeElement.selectedOptions.length > 0
            ? parseFloat(sizeElement.selectedOptions[0].getAttribute("data-price")) || 0
            : 0;
        const selectedSize = sizeElement?.value || "N/a";
        const typeElement = modal.querySelector("select[name='type']");
        const selectedType = typeElement?.value || "N/a";
        const addOnsElement = modal.querySelector("select[name='add_on']");
        const selectedAddOns = addOnsElement?.value || "N/a";

        console.log("Product details retrieved:", {
            productId, modalName, modalPrice, selectedSize, selectedType, selectedAddOns
        });

        // Create a unique product ID using productId + size
        const uniqueProductId = `${productId}_${selectedSize}`;

        // Create product object
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

        // Check if the product already exists in the cart
        const existingProduct = productOrder.querySelector(`[data-id="${product.id}"]`);
        if (existingProduct) {
            console.log("Product already in cart, incrementing quantity.");

            // Increment the quantity if the product already exists
            const quantityElement = existingProduct.querySelector(".stepper-value");
            let quantity = parseInt(quantityElement.textContent);
            quantity += 1;
            quantityElement.textContent = quantity;

            // Update total price for this product
            const totalPriceElementForProduct = existingProduct.querySelector(".price-con #total-price");
            const updatedPrice = product.price * quantity;
            totalPriceElementForProduct.textContent = updatedPrice.toFixed(2);

            // Update overall total price
            totalPrice += product.price;
        } else {
            console.log("Adding new product to the cart:", product);

            // Add a new product row if it doesn't exist
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
                    <span class="size & price">₱<span class="total-price" id="total-price">${(product.price * product.quantity).toFixed(2)}</span></span>
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

            // Update overall total price
            totalPrice += product.price;

            // Add functionality for quantity adjustment and removing the product
            handleQuantityAdjustments(productRow, product.price);
            handleRemoveProduct(productRow);
        }

        // Update total price display
        updateTotalPriceDisplay();
        console.log("Total price after adding product:", totalPrice);


        // Save products to localStorage
        saveProducts();

        // Close the modal
        modal.style.display = "none";
    });

    function handleQuantityAdjustments(productRow, productPrice) {
        const decrementButton = productRow.querySelector(".decrement");
        const incrementButton = productRow.querySelector(".increment");
        const quantityValue = productRow.querySelector(".stepper-value");
        const totalPriceElementForProduct = productRow.querySelector(".price-con .total-price");

        if (!totalPriceElementForProduct) {
            console.error("Error: Total price element not found for the product.");
            return;
        }

        decrementButton.addEventListener("click", () => {
            let quantity = parseInt(quantityValue.textContent);
            if (quantity > 1) {
                quantity -= 1;
                quantityValue.textContent = quantity;

                // Update total price for this product
                const updatedPrice = productPrice * quantity;
                totalPriceElementForProduct.textContent = updatedPrice.toFixed(2);

                // Update overall total price
                totalPrice -= productPrice;
                if (totalPrice < 0) totalPrice = 0; // Prevent negative total price
                updateTotalPriceDisplay();
                saveProducts();
            }
        });

        incrementButton.addEventListener("click", () => {
            let quantity = parseInt(quantityValue.textContent);
            quantity += 1;
            quantityValue.textContent = quantity;

            // Update total price for this product
            const updatedPrice = productPrice * quantity;
            totalPriceElementForProduct.textContent = updatedPrice.toFixed(2);

            // Update overall total price
            totalPrice += productPrice;
            updateTotalPriceDisplay();
            saveProducts();
        });
    }


    function handleRemoveProduct(productRow) {
        const removeButton = productRow.querySelector(".remove-prod");
        removeButton.addEventListener("click", (event) => {
            event.preventDefault();

            const quantityElement = productRow.querySelector(".stepper-value");
            if (!quantityElement) {
                console.error("Error: Quantity element not found.");
                return;
            }

            const quantity = parseInt(quantityElement.textContent);
            const productPriceElement = productRow.querySelector(".total-price");
            if (!productPriceElement) {
                console.error("Error: Product price element not found in the row.");
                return;
            }

            const productPrice = parseFloat(productPriceElement.textContent) / quantity;
            if (isNaN(productPrice)) {
                console.error("Error: Product price is invalid.");
                return;
            }

            totalPrice -= productPrice * quantity;
            if (totalPrice < 0) totalPrice = 0; // Prevent negative total price

            productRow.remove();
            updateTotalPriceDisplay();
            saveProducts();
        });
    }


    function updateTotalPriceDisplay() {
        console.log("Updating total price display to:", totalPrice);
        totalPriceElement.textContent = `₱${totalPrice.toFixed(2)}`;
    }

    function saveProducts() {
        const products = [];
        const productRows = productOrder.querySelectorAll(".product-row");
        productRows.forEach(row => {
            const id = row.getAttribute("data-id");
            const name = row.querySelector("h4").textContent;
            const size = row.querySelector(".product-info p:nth-child(2)")?.textContent || "";
            const type = row.querySelector(".product-info p:nth-child(3)")?.textContent || "";
            const quantity = parseInt(row.querySelector(".stepper-value").textContent) || 0;
            const addOns = row.querySelector(".product-info p:nth-child(4)")?.textContent || "";
            const priceElement = row.querySelector("#total-price");
            const price = priceElement ? parseFloat(priceElement.textContent) / (quantity || 1) : 0; // Avoid null
            const image = row.querySelector("img").src;
            products.push({ id, name, size, type, addOns, quantity, price, image });
        });
        console.log("Saving products to localStorage:", products);
        localStorage.setItem("products", JSON.stringify(products));
    }


    function loadSavedProducts() {
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        savedProducts.forEach(product => {
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
                    <span class="size & price">₱<span class="total-price">${(product.price * product.quantity).toFixed(2)}</span></span>
                </div>
                <div class="product-function">
                    <a href="#" class="remove-prod"><i class="fa-solid fa-trash"></i></a>
                    <div class="stepper">
                        <a class="stepper-btn decrement"><i class="fa-solid fa-minus"></i></a>
                        <span type="text" class="stepper-value">${product.quantity}</span>
                        <a class="stepper-btn increment"><i class="fa-solid fa-plus"></i></a>
                    </div>
                </div>
            `;
            productOrder.appendChild(productRow);
            totalPrice += product.price * product.quantity;
            handleQuantityAdjustments(productRow, product.price);
            handleRemoveProduct(productRow);
        });
        updateTotalPriceDisplay();
    }
});

//Pushing to the database
document.getElementById("btn-order").addEventListener("click", () => {
    const productOrder = document.querySelectorAll("#product-order .product-row");
    const clientId = document.getElementById("product-order").dataset.clientId;
    const orderData = [];

    // Check for Client ID
    if (!clientId) {
        alert("Client ID is missing. Please refresh the page and try again.");
        return;
    }

    // Check for Empty Cart
    if (productOrder.length === 0) {
        alert("Your cart is empty. Please add items to your cart before checking out.");
        return;
    }

    // Build Order Data
    productOrder.forEach(row => {
        const id = row.getAttribute("data-id");
        const name = row.querySelector("h4").textContent;
        const size = row.querySelector(".price-con p").textContent;
        const type = row.querySelector(".product-info p:nth-child(2)")?.textContent.trim() || "Unknown Type";
        const addOns = row.querySelector(".product-info p:nth-child(3)")?.textContent.trim() || "No Add-Ons";
        const totalPriceElement = row.querySelector("#total-price");
        console.log(totalPriceElement);
        const totalPrice = totalPriceElement ? parseFloat(totalPriceElement.textContent) : 0; // Fallback for null
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
    });
    // Clear Cart Function
    function clearCart() {
        document.querySelector("#product-order").innerHTML = "";
        document.getElementById("total-price").textContent = "₱0.00";
        localStorage.removeItem("products");
    }

    // Submit Order Using Axios
    axios.post("http://localhost/HEY-BREW/php/submit_order.php", {
        client_id: clientId,
        order_items: orderData
    })
    .then(response => {
        clearCart();
        console.log(response.data)


        // Show the modal on successful order submission
        const modal = document.getElementById('modal');
        modal.style.display = 'block';

        // Hide the modal after 2 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 10000);
    })
    .catch(error => {
        console.error(error)
        alert("An error occurred while placing your order. Please try again later.");
    });


    //SHOWS A simple thank you note
    const modal = document.getElementById('modal');

    // Show the modal
    modal.style.display = 'block';

    // Hide the modal after 2 seconds
    setTimeout(() => {
        modal.style.display = 'none';
    }, 2000);



});
