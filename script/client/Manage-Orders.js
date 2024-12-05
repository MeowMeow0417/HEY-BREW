function showOrderDetails(orderId) {
    const detailsDiv = document.getElementById('orderDetails');
    detailsDiv.innerHTML = `<p>Loading order details...</p>`; // Placeholder while loading

    fetch(`php/fetch_orders.php?order_id=${orderId}`)
        .then(response => response.json())
        .then(order => {
            console.log('Server Response:', order); // Log to check what is returned

            if (order.error) {
                detailsDiv.innerHTML = `<p>Error fetching orders: ${order.error}</p>`;
                return;
            }

            if (order && order.items && order.items.length > 0) {
                const customerName = order.client_username;
                const customerAvatar = "style/images/category-row/profile.jpg"; // Placeholder for avatar
                const orderDate = order.order_date_time;
                const orderStatus = order.status;

                // Calculate the total price of all items
                const totalPrice = order.items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

                // Generate HTML for each order item
                let itemsHtml = order.items.map(item => `
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
            } else {
                detailsDiv.innerHTML = `<p>No items found for this order.</p>`;
            }
        })
        .catch(error => {
            detailsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}


// For updating the order status
function updateOrderStatus(selectElement) {
    const orderId = selectElement.getAttribute('data-order-id');
    const newStatus = selectElement.value;

    // Update the data-status attribute based on the new status
    selectElement.setAttribute('data-status', capitalizeFirstLetter(newStatus));

    // Optionally disable while updating and then enable after response
    selectElement.disabled = true;

    axios.post('php/update_order_status.php', {
        order_id: orderId,
        status: newStatus
    })
    .then(response => {
        if (response.data.success) {
            console.log(`Order ${orderId} updated to ${newStatus}.`);

        } else {
            console.error(`Failed to update order ${orderId}.`);

        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the order status.');
    })
    .finally(() => {
        selectElement.disabled = false; // Re-enable select
    });
}

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

// document.addEventListener('DOMContentLoaded', () => {
//     const orderTable = document.getElementById('orderTable');

//     orderTable.addEventListener('click', (event) => {
//         const customerRow = event.target.closest('.customer-row');
//         if (customerRow) {
//             const customerId = customerRow.getAttribute('data-customer-id');
//             showOrderDetails(customerId);
//         }
//     });

//     orderTable.addEventListener('change', handleStatusChange);

//     // Initialize status selects
//     initializeStatusSelects();
// });