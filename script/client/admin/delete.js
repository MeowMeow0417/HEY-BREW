document.addEventListener("DOMContentLoaded", function() {
    const addUserButton = document.getElementById("add-user");
    const userModal = document.getElementById("user-modal");
    const deleteModal = document.getElementById("deleteModal");

    // Open Add User Modal
    addUserButton.addEventListener("click", function() {
        userModal.style.display = "block";
    });

    // Close Modals (on close button click or outside click)
    document.querySelectorAll(".close").forEach(function(closeBtn) {
        closeBtn.addEventListener("click", function() {
            userModal.style.display = "none";
            deleteModal.style.display = "none";
        });
    });

    window.addEventListener("click", function(event) {
        if (event.target === userModal) {
            userModal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const deleteButtons = document.querySelectorAll("[data-toggle='modal']");
    const deleteForm = document.getElementById("deleteForm");

    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            const userId = button.getAttribute("data-id");
            document.getElementById("delete_id").value = userId;
            document.getElementById("deleteModal").style.display = "block";
        });
    });
});
