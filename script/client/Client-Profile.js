document.addEventListener('DOMContentLoaded', function() {


    togglePasswordBtn.addEventListener('click', function () {
        const passwordSpan = document.getElementById('password');
        const icon = togglePasswordBtn.querySelector('i');

        if (passwordSpan.textContent === '••••••••••') {
            passwordSpan.textContent = 'password123'; // Replace with actual password
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordSpan.textContent = '••••••••••';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });

});

document.addEventListener("DOMContentLoaded", function () {
    const orderReceipts = document.querySelectorAll(".order-receipt"); // Select all receipts
    const modal = document.getElementById('receipt-modal');
    const orderInfo = modal.querySelector('.product-column');
    const OrderId = modal.querySelector(".id-number");
    const OrderTime = modal.querySelector(".order-time span:nth-child(2)");
    const TotalAmount = modal.querySelector(".total-amount");

    // Add event listener for when an order receipt is clicked
    orderReceipts.forEach(function (orderReceipt) {
        orderReceipt.addEventListener('click', function () {
            // Get the order ID from the clicked receipt
            const orderId = this.querySelector('.Order-Id').textContent.trim();
            const orderTime = this.querySelector(".Date-time").textContent.trim();
            const totalPrice = this.querySelector('.total-price').textContent.trim();

            // Use Axios to fetch the order details
            axios.get('php/getOrderDetails.php?order_id=' + orderId)
            .then(function(response) {
                console.log('Response data:', response.data); // Debug log
                const orderDetails = response.data;

                    if (orderDetails.error) {
                        console.error('Error:', orderDetails.error);
                        return;
                    }

                    // Set modal information
                    OrderId.textContent = orderId || "N/A";
                    OrderTime.textContent = orderTime || "N/A";
                    TotalAmount.textContent = totalPrice;

                    // Clear previous data
                    orderInfo.innerHTML = '';

                    // Add the new order details
                    orderDetails.forEach(function (detail) {
                        const productDiv = document.createElement('div');
                        productDiv.classList.add('product-section');

                        // Populate product details
                        productDiv.innerHTML = `
                            <div class="product-details">
                                <p>${detail.product_name}</p>
                                <p>Size: ${detail.size}</p>
                                <p>Type: ${detail.type}</p>
                            </div>
                            <div class="details">
                                <p>AddOns: ${detail.add_ons || 'None'}</p>
                                <p>Qty: ${detail.quantity}</p>
                                <p>₱ ${detail.item_price}</p>
                            </div>
                        `;
                        orderInfo.appendChild(productDiv);
                    });

                    // Show the modal
                    modal.style.display = 'block';

                })
                .catch(function(error) {
                    console.error('Error fetching order details:', error);
                });
        });
    });
});