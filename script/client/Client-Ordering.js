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
        const productName = card.getAttribute('data-name');
        const productImage = card.getAttribute('data-image');
        const productDescription = card.getAttribute('data-description');
        const productTypes = card.getAttribute('data-types').split(',');
        const productAddOns = card.getAttribute('data-addons').split(',');
        const productPrices = JSON.parse(card.getAttribute('data-prices'));

        // Populate modal content
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

// ADD TO CART
document.addEventListener("DOMContentLoaded", () => {
    const productOrder = document.querySelector("#product-order"); // Target the Place Order section
    const totalPriceElement = document.getElementById("total-price"); // Total price display element
    const addToCartButton = document.getElementById("btn-cart"); // Add to Cart button
    const modal = document.getElementById("options-modal"); // Modal
    let totalPrice = 0; // Initialize total price

    // Get the client ID (assuming it's set as a global variable or injected in the script)
    const clientId = document.getElementById("product-order").dataset.clientId;

    // Load saved products from localStorage
    loadSavedProducts();

    console.log('Add to cart script. up and running');


    // Add to Cart Button Click Handler
    addToCartButton.addEventListener("click", () => {
   // Retrieve product details from modal
   const modalImage = modal.querySelector(".product-grid img").src;
   const modalName = modal.querySelector(".product-grid h4").textContent.trim();


   // Query the size, type, and add-ons fields from the modal
   const sizeElement = modal.querySelector("select[name='size_price']");

   const modalPrice = sizeElement.selectedOptions.length > 0
       ? parseFloat(sizeElement.selectedOptions[0].getAttribute("data-price")) || 0
       : 0;

   const selectedSize = sizeElement?.value || "Nan";

   const typeElement = modal.querySelector("select[name='type']");
   const selectedType = typeElement?.value || "Nan";

   const addOnsElement = modal.querySelector("select[name='add_on']");
   const selectedAddOns = addOnsElement?.value || "Nan";

   console.log('Selected Price', modalPrice); // Debugging: Check if price is retrieved correctly

   // Create a unique identifier for the product based on its options
   const productIdentifier = `${modalName}-${selectedSize}-${selectedType}-${selectedAddOns}`;

   // Create product object
   const product = {
       id: productIdentifier,
       name: modalName,
       image: modalImage,
       price: modalPrice, // Make sure this is the correct price
       size: selectedSize,
       type: selectedType,
       addOns: selectedAddOns,
       quantity: 1
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
                    <span class="size & price">₱<span id="total-price">${(product.price * product.quantity).toFixed(2)}</span></span>
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

    // Function to handle quantity adjustments (increase or decrease)
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

    // Function to handle product removal
    function handleRemoveProduct(productRow) {
        const removeButton = productRow.querySelector(".remove-prod");
        removeButton.addEventListener("click", (event) => {
            event.preventDefault();
            const quantity = parseInt(productRow.querySelector(".stepper-value").textContent);
            const productPrice = parseFloat(productRow.querySelector("#total-price").textContent) / quantity;
            totalPrice -= productPrice * quantity;
            productRow.remove();
            updateTotalPriceDisplay();
            saveProducts();
        });
    }

    // Function to update total price display
    function updateTotalPriceDisplay() {
        totalPriceElement.textContent = `₱${totalPrice.toFixed(2)}`;
    }

    // Function to save products to localStorage
    function saveProducts() {
        const products = [];
        const productRows = productOrder.querySelectorAll(".product-row");
        productRows.forEach(row => {
            const id = row.getAttribute("data-id");
            const name = row.querySelector("h4").textContent;
            const size = row.querySelector(".product-info p:nth-child(2)").textContent.replace("Size: ", "");
            const type = row.querySelector(".product-info p:nth-child(3)").textContent.replace("Type: ", "");
            const quantity = parseInt(row.querySelector(".stepper-value").textContent);
            const addOns = row.querySelector(".product-info").textContent.replace("Add-Ons: ", "");
            const price = parseFloat(row.querySelector("#total-price").textContent) / quantity;
            const image = row.querySelector("img").src;
            products.push({ id, name, size, type, addOns, quantity, price, image });
        });
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Function to load saved products from localStorage
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
                    <span class="size & price">₱<span id="total-price">${(product.price * product.quantity).toFixed(2)}</span></span>
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

    if (!clientId) {
        alert("Client ID is missing. Please refresh the page and try again.");
        return;
    }

    if (productOrder.length === 0) {
        alert("Your cart is empty. Please add items to your cart before checking out.");
        return;
    }

    let hasErrors = false;

    productOrder.forEach(row => {
        const id = row.getAttribute("data-id");
        const name = row.querySelector("h4").textContent;
        const size = row.querySelector(".price-con p").textContent;
        const type = row.querySelector(".product-info p:nth-child(2)").textContent;
        const addOns = row.querySelector(".product-info p:nth-child(3)").textContent;
        const quantity = parseInt(row.querySelector(".stepper-value").textContent);
        const totalPrice = parseFloat(row.querySelector("#total-price").textContent);
        const productId = id.split("-")[0]; // Assuming product_id is part of the data-id

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

    function clearCart() {
        const productOrder = document.querySelector("#product-order"); // The cart container
        const totalPriceElement = document.getElementById("total-price"); // Total price display element

        // Remove all product rows
        productOrder.innerHTML = "";

        // Reset total price
        totalPrice = 0;
        totalPriceElement.textContent = "₱0.00";

        // Clear localStorage
        localStorage.removeItem("products");
    }


    // Send data to PHP using fetch
    fetch("php/submit_order.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: clientId,
            order_items: orderData
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Order successfully placed!");
            clearCart();
        } else {
            alert("Failed to place order: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});




//Receipt Modal //DO THIS TOM
/*
document.addEventListener("DOMContentLoaded", () => {
    const productOrder = document.querySelector("#product-order"); // Target the Place Order section
    const btnOrder = document.getElementById("btn-place-order"); // Updated ID
    const receiptModal = document.querySelector(".receipt-modal"); // Receipt Modal
    const closeModal = receiptModal.querySelector(".close"); // Close button in Receipt Modal
    const receiptProductColumn = document.getElementById("receipt-product-column"); // Product Column in Receipt Modal
    const receiptTotalAmount = document.getElementById("receipt-total-amount"); // Total Amount in Receipt Modal
    const totalPriceElement = document.getElementById("total-price"); // Total price display element

    console.log('Script loaded and ready');

    let totalPrice = 0; // Initialize total price

    // Place Order Button Click Handler
    btnOrder.addEventListener("click", () => {
        if (productOrder.children.length === 0) {
            alert("No items in the order!"); // Optional: Alert if no products to order
            return;
        }

        // Clear previous receipt data
        receiptProductColumn.innerHTML = "";

        // Transfer products from the Place Order section to the Receipt Modal
        const productRows = productOrder.querySelectorAll(".product-row");
        productRows.forEach(row => {
            const productClone = row.cloneNode(true);
            receiptProductColumn.appendChild(productClone);
        });

        // Set total price in the receipt
        receiptTotalAmount.textContent = `₱${totalPrice.toFixed(2)}`;

        // Update the current time in the receipt
        updateOrderTime();

        // Show the receipt modal
        receiptModal.style.display = "block";

        // Clear the Place Order section
        productOrder.innerHTML = "";
        totalPrice = 0; // Reset the total price
        updateTotalPriceDisplay(); // Reset the displayed total
        localStorage.removeItem("products"); // Clear saved products
    });

    // Function to update the current time for the receipt
    function updateOrderTime() {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        document.getElementById("order-time").textContent = now.toLocaleDateString(undefined, options);
    }

    // Function to update total price display in the Place Order section
    function updateTotalPriceDisplay() {
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Close Receipt Modal
    closeModal.addEventListener("click", (event) => {
        event.preventDefault();
        receiptModal.style.display = "none";
    });
});*/
