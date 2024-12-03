document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const userModal = document.getElementById("user-modal");
    const openUserModalBtn = document.getElementById("openUserModal");
    const closeUserModalBtn = document.getElementById("closeUserModal");

    // Get modal and buttons
    const deleteModal = document.getElementById("deleteModal");
    const deleteIdInput = document.getElementById("delete_id");

    const deleteButtons = document.querySelectorAll(".btn-danger[data-toggle='modal']");
    const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    const cancelDeleteBtn = document.querySelector(".btn-secondary[data-dismiss='modal']");

    // Open Add User Modal
    openUserModalBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default anchor behavior if any
        userModal.style.display = "block";
    });

    // Close Add User Modal
    closeUserModalBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        userModal.style.display = "none";
    });

    document.querySelector('.signUp').addEventListener('click', function() {
        location.reload(); // Refresh the page
    });

    // Open Delete Modal
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");  // Get the user ID from the button
            deleteIdInput.value = userId;                 // Set the hidden input value
            deleteModal.style.display = "block";          // Show the modal
        });
    });

    // Close Delete Modal (via Close Button)
    closeDeleteModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteModal.style.display = "none";              // Hide the modal
    });

    // Close Delete Modal (via Cancel Button)
    cancelDeleteBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";              // Hide the modal
    });

    document.querySelector('.btn-danger').addEventListener('click', function() {
        location.reload(); // Refresh the page
    });

    // Close modals when clicking outside of them
    window.addEventListener("click", (event) => {
        if (event.target === deleteModal) {
            deleteModal.style.display = "none";
        }
    });

});
