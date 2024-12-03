function showOrderDetails(orderId) {
    const detailsDiv = document.getElementById('orderDetails');
    detailsDiv.innerHTML = `<p>Loading order details...</p>`; // Placeholder while loading

    axios.get(`php/fetch_orders.php?order_id=${orderId}`)
        .then(response => {
            console.log('Server Response:', response.data); // Log to check what is returned

            const order = response.data;

            if (order.error) {
                detailsDiv.innerHTML = `<p>Error fetching orders: ${order.error}</p>`;
                return;
            }

            if (order && order.items && order.items.length > 0) {
                const customerName = order.client_username;
                const customerAvatar = "style/images/products/auth.jpg"; // Placeholder for avatar
                const orderDate = order.order_date_time;
                const orderStatus = order.status;

                let itemsHtml = order.items.map(item => `
                    <div class="order-item-card">
                        <p><strong>Product:</strong> ${item.product_name}</p>
                        <p><strong>Category:</strong> ${item.category}</p>
                        <p><strong>Size:</strong> ${item.size}</p>
                        <p><strong>Type:</strong> ${item.type}</p>
                        <p><strong>Add-Ons:</strong> ${item.add_ons}</p>
                        <p><strong>Quantity:</strong> ${item.quantity}</p>
                        <p><strong>Total Price:</strong> ₱${item.total_price}</p>
                    </div>
                `).join("");

                detailsDiv.innerHTML = `
                    <h3>Order Details</h3>
                    <div class="customer-details">
                    div.
                        <img src="${customerAvatar}" alt="${customerName}" class="customer-avatar">
                        <strong>${customerName}</strong>
                        <p><strong>Order Date:</strong> ${orderDate}</p>
                        <p><strong>Status:</strong> ${orderStatus}</p>
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