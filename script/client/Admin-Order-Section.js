function showOrderDetails(customerId) {
    const customerRow = document.querySelector(`tr[data-customer-id="${customerId}"]`);
    const detailsDiv = document.getElementById('orderDetails');
    
    if (customerRow) {
        const customerName = customerRow.querySelector('.customer-info').textContent.trim();
        const customerAvatar = customerRow.querySelector('.customer-avatar').src;
        const orderInfo = customerRow.querySelector('td:nth-child(2)').innerHTML;
        const payment = customerRow.querySelector('td:nth-child(3)').textContent;
        const status = customerRow.querySelector('.status-select').value;

        detailsDiv.innerHTML = `
            <h3>List of Orders:</h3>
            <div class="customer-info">
                <img src="${customerAvatar}" alt="${customerName}" class="customer-avatar">
                <strong>${customerName}</strong>
            </div>
            <p><strong>${orderInfo.split('<br>')[0]}</strong></p>
            <p>${orderInfo.split('<br>')[1]}</p>
            <p><strong>Payment Method:</strong> ${payment}</p>
            <p><strong>Status:</strong> ${status}</p>
        `;
    }
}

function handleStatusChange(event) {
    if (event.target.classList.contains('status-select')) {
        const customerId = event.target.getAttribute('data-customer-id');
        const newStatus = event.target.value;
        
        // Update the select element's appearance
        event.target.setAttribute('data-status', newStatus);
        
        // Update the order details
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

document.addEventListener('DOMContentLoaded', () => {
    const orderTable = document.getElementById('orderTable');
    
    orderTable.addEventListener('click', (event) => {
        const customerRow = event.target.closest('.customer-row');
        if (customerRow) {
            const customerId = customerRow.getAttribute('data-customer-id');
            showOrderDetails(customerId);
        }
    });

    orderTable.addEventListener('change', handleStatusChange);

    // Initialize status selects
    initializeStatusSelects();
});