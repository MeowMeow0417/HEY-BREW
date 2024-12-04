document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const userModal = document.getElementById("user-modal");
    const openUserModalBtn = document.getElementById("openUserModal");
    const closeUserModalBtn = document.getElementById("closeUserModal");

    const deleteModal = document.getElementById("deleteModal");
    const deleteIdInput = document.getElementById("delete_id");
    const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    const cancelDeleteBtn = document.querySelector(".btn-secondary[data-dismiss='modal']");

    console.log("Delete buttons: ", document.querySelectorAll(".btn-danger[data-toggle='modal']"));

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

});

document.addEventListener("DOMContentLoaded", function () {
    const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    const deleteIdInput = document.getElementById("delete_id");
    const deleteModal = document.getElementById("deleteModal");
    const cancelDeleteBtn = document.querySelector(".btn.btn-secondary[data-dismiss='modal']");

    // Handle dynamic delete buttons with event delegation
    document.addEventListener("click", function (e) {
        if (e.target.matches(".btn-danger[data-toggle='modal']")) {
            e.preventDefault();
            const userId = e.target.getAttribute("data-id"); // Get the user ID
            deleteIdInput.value = userId;                   // Set the hidden input value
            deleteModal.style.display = "block";            // Show the modal
        }
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

    // Close modals when clicking outside of them
    window.addEventListener("click", (event) => {
        if (event.target === deleteModal) {
            deleteModal.style.display = "none";
        }
    });
});



document.addEventListener('DOMContentLoaded', function () {
    // Select success or error messages
    const messageBox = document.querySelector('.success, .error');

    if (messageBox) {
      // Set a timeout to fade out the message
      setTimeout(() => {
        messageBox.classList.add('hidden'); // Add the hidden class
        // After the fade-out animation completes, remove the element
        setTimeout(() => {
          messageBox.remove();
        }, 2000); // Match the CSS transition duration (2s)
      }, 2500); // Wait 3 seconds before fading out
    }
  });
