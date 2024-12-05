// Search function click event handler
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card'); // Select all product cards

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase(); // Get the value from the search input

        productCards.forEach(product => {
            const productName = product.querySelector('h4').textContent.toLowerCase(); // Get the product name
            // Check if the product name includes the search term
            if (productName.includes(searchTerm)) {
                product.style.display = 'block'; // Show product
            } else {
                product.style.display = 'none'; // Hide product
            }
        });
    });
});
document.querySelector('.header-order').addEventListener('click', () => {
    document.querySelector('.place-order').classList.toggle('active');
  });

// Category filter click event handler
document.addEventListener('DOMContentLoaded', () => {
    const categoryBoxes = document.querySelectorAll('.category-box'); // Select all category divs

    // Get the current category from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get("category");

    // Set the active class based on the current category
    categoryBoxes.forEach((box) => {
        const boxCategory = box.dataset.category;
        if (boxCategory === currentCategory) {
            box.classList.add('active');
        } else {
            box.classList.remove('active');
        }

        // Add click event listener
        box.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior

            // Remove "active" class from all category boxes
            categoryBoxes.forEach((cat) => cat.classList.remove('active'));

            // Add "active" class to the clicked category box
            box.classList.add('active');


            const selectedCategory = box.dataset.category;
            const url = new URL(window.location);
            url.searchParams.set("category", selectedCategory);
            window.location.href = url.toString(); // Reload the page with the selected category
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

    // Function to populate and show the modal with product details
    function showModal(card) {
        const productId = card.getAttribute('data-id');
        const productName = card.getAttribute('data-name');
        const productImage = card.getAttribute('data-image');
        const productDescription = card.getAttribute('data-description');
        const productTypes = card.getAttribute('data-types').split(',');
        const productAddOns = card.getAttribute('data-addons').split(',');
        const productPrices = JSON.parse(card.getAttribute('data-prices'));

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

        // Save products to localStorage
        saveProducts();

        // Close the modal
        modal.style.display = "none";
    });

    function handleQuantityAdjustments(productRow, productPrice) {
        const decrementButton = productRow.querySelector(".decrement");
        const incrementButton = productRow.querySelector(".increment");
        const quantityValue = productRow.querySelector(".stepper-value");
        const totalPriceElementForProduct = productRow.querySelector(".price-con #total-price");

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
            const quantity = parseInt(productRow.querySelector(".stepper-value").textContent);
            const productPrice = parseFloat(productRow.querySelector("#total-price").textContent) / quantity;
            totalPrice -= productPrice * quantity;
            if (totalPrice < 0) totalPrice = 0; // Prevent negative total price
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
        const productRows = productOrder.querySelectorAll(".product-row");
        productRows.forEach(row => {
            const id = row.getAttribute("data-id");
            const name = row.querySelector("h4").textContent;
            const size = row.querySelector(".product-info p:nth-child(2)").textContent;
            const type = row.querySelector(".product-info p:nth-child(3)").textContent;
            const quantity = parseInt(row.querySelector(".stepper-value").textContent);
            const addOns = row.querySelector(".product-info p:nth-child(4)").textContent;
            const price = parseFloat(row.querySelector("#total-price").textContent) / quantity;
            const image = row.querySelector("img").src;
            products.push({ id, name, size, type, addOns, quantity, price, image });
        });
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
                        <span class="stepper-value">${product.quantity}</span>
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
        const type = row.querySelector(".product-info p:nth-child(2)").textContent;
        const addOns = row.querySelector(".product-info p:nth-child(3)").textContent;
        const quantity = parseInt(row.querySelector(".stepper-value").textContent);
        const totalPrice = parseFloat(row.querySelector("#total-price").textContent);
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
        }, 5000);
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
