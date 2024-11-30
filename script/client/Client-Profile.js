document.addEventListener('DOMContentLoaded', function() {
    const orders = [
        { id: '696969', date: 'November 11, 2024', time: '3:30 PM', numberOfOrders: 2, total: 69.0 },
        { id: '696960', date: 'November 12, 2024', time: '3:30 PM', numberOfOrders: 2, total: 69.0 },
        { id: '696970', date: 'November 13, 2024', time: '3:30 PM', numberOfOrders: 2, total: 69.0 },
        { id: '696971', date: 'November 14, 2024', time: '3:30 PM', numberOfOrders: 2, total: 69.0 },
      
    ];

    const orderTableBody = document.getElementById('orderTableBody');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const logoutBtn = document.getElementById('logoutBtn');

    // Populate order table
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${order.time}</td>
            <td>${order.numberOfOrders}</td>
            <td>₱${order.total.toFixed(1)}</td>
        `;
        orderTableBody.appendChild(row);
    });

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


    

    // Logout functionality (placeholder)
    logoutBtn.addEventListener('click', function() {
        alert('Logout functionality to be implemented');
    });
});