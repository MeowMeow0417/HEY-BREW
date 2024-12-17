function showOrderDetails(orderId) {
    const detailsDiv = document.getElementById('orderDetails');
    detailsDiv.innerHTML = `<p>Loading order details...</p>`; // Placeholder while loading

    fetch(`php/fetch_orders.php?order_id=${orderId}`)
        .then(response => response.json())
        .then(order => {
            console.log('Server Response:', order); // Log for debugging

            if (order.error) {
                detailsDiv.innerHTML = `<p>Error fetching orders: ${order.error}</p>`;
                return;
            }

            if (order && order.items && order.items.length > 0) {
                const customerName = order.client_username;
                const customerAvatar = "style/images/category-row/profile.jpg"; // Placeholder for avatar
                const orderDate = order.order_date_time;
                const orderStatus = order.status;

                // Calculate the total price dynamically
                const totalPrice = order.items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

                // Generate HTML for each order item
                const itemsHtml = order.items.map(item => `
                    <div class="order-item-card">
                        <p><strong>Product:</strong> ${item.product_name}</p>
                        <p><strong>Category:</strong> ${item.category}</p>
                        <p><strong>Size:</strong> ${item.size}</p>
                        <p><strong>Type:</strong> ${item.type}</p>
                        <p><strong>Add-Ons:</strong> ${item.add_ons}</p>
                        <p><strong>Quantity:</strong> ${item.quantity}</p>
                        <p><strong>Price:</strong> ₱${parseFloat(item.total_price).toFixed(2)}</p>
                        <hr>
                    </div>
                `).join("");

                // Update the detailsDiv with the order details and total price
                detailsDiv.innerHTML = `
                    <h3>Order Details</h3>
                    <div class="customer-details">
                        <div class="customer-info">
                            <img src="${customerAvatar}" alt="${customerName}" class="customer-avatar">
                            <strong>${customerName}</strong>
                        </div>
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Order Date:</strong> ${orderDate}</p>
                        <p><strong>Status:</strong> ${orderStatus}</p>
                        <p><strong>Total Price:</strong> ₱${totalPrice.toFixed(2)}</p>
                    </div>
                    <hr>
                    <h4>Items</h4>
                    ${itemsHtml}
                `;

                // Assign total price to the select element
                const statusSelect = document.querySelector(`select[data-order-id="${orderId}"]`);
                if (statusSelect) {
                    statusSelect.dataset.totalPrice = totalPrice.toFixed(2); // Store for later use
                }
            } else {
                detailsDiv.innerHTML = `<p>No items found for this order.</p>`;
            }
        })
        .catch(error => {
            detailsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

function updateOrderStatus(selectElement) {
    const selectedStatus = selectElement.value;
    const orderId = selectElement.dataset.orderId;
    const totalPrice = parseFloat(selectElement.dataset.totalPrice);
    const orderDate = selectElement.dataset.orderDate;

    console.log("Order ID:", orderId, "Total Price:", totalPrice, "Order Date:", orderDate);

    selectElement.disabled = true;

    axios.post('php/update_order_status.php', {
        order_id: orderId,
        status: selectedStatus
    })
    .then(response => {
        if (response.data.success) {
            console.log(`Order ${orderId} updated to ${selectedStatus}.`);

            // Send sales data only when status is 'completed'
            if (selectedStatus === 'completed') {
                const salesData = new URLSearchParams();
                salesData.append('orderId', orderId);
                salesData.append('totalPrice', totalPrice);
                salesData.append('orderDate', orderDate);

                return axios.post('php/salesData.php', salesData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            }
        } else {
            throw new Error(`Failed to update order ${orderId}.`);
        }
    })
    .then(response => {
        if (response && response.data.success) {
            console.log("Sales logged successfully:", response.data.message);
        } else if (response) {
            console.error("Failed to log sales:", response.data.message);
            alert("Failed to log the sales. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while processing the request.");
        selectElement.value = selectElement.dataset.status; // Revert on error
    })
    .finally(() => {
        selectElement.disabled = false; // Re-enable the select element
    });

    selectElement.setAttribute('data-status', capitalizeFirstLetter(selectedStatus));
}


// addition of other stuff

// Utility function to capitalize the first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Add event listeners for rows
document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.customer-row');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const customerId = row.getAttribute('data-customer-id');
            showOrderDetails(customerId);
        });
    });
});

function handleStatusChange(event) {
    if (event.target.classList.contains('status-select')) {
        const customerId = event.target.getAttribute('data-customer-id');
        const newStatus = event.target.value;

        // Update the select element's appearance
        event.target.setAttribute('data-status', newStatus);

        // Update the order detail
        showOrderDetails(customerId);
    }
}

function initializeStatusSelects() {
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        // Set initial data-status attribute
        select.setAttribute('data-status', select.value);
    });
}
