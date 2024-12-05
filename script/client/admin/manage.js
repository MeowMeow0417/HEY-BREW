document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll(".categories");
    const animation = document.querySelector(".animation");
    const navContainer = document.querySelector(".top-nav ul");

    // Get current category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get('category') || 'espresso';

    // Set the selector to the active category
    const setActiveCategory = (category) => {
        const { offsetLeft, offsetWidth } = category;
        animation.style.left = `${offsetLeft}px`;
        animation.style.width = `${offsetWidth}px`;
    };

    // Find and set initial active category
    categories.forEach((category) => {
        const href = category.getAttribute('href');
        if (href.includes(currentCategory)) {
            category.classList.add('active');
            setActiveCategory(category);
        }

        category.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Remove active class from all categories
            categories.forEach((cat) => cat.classList.remove('active'));
            
            // Add active class to clicked category
            category.classList.add('active');
            
            // Update animation
            setActiveCategory(category);
            
            // Navigate to new category
            window.location.href = category.getAttribute('href');
        });
    });
});



// DeletePrompt
document.addEventListener('DOMContentLoaded', () => {
  // Displaying the Delete prompt
  window.showDeletePrompt = function(productName) {
      const deletePrompt = document.querySelector('.delete-prompt');
      const overlay = document.querySelector('.overlay');

      deletePrompt.querySelector('p').innerText = productName;
      deletePrompt.classList.add('show');
      overlay.classList.add('show');
  };

  // Hiding the Delete prompt
  window.hideDeletePrompt = function() {
      const deletePrompt = document.querySelector('.delete-prompt');
      const overlay = document.querySelector('.overlay');

      deletePrompt.classList.remove('show');
      overlay.classList.remove('show');
  };

  // Stop propagation on the delete prompt
  const deletePrompt = document.querySelector('.delete-prompt');
  if (deletePrompt) {
      deletePrompt.addEventListener('click', (event) => {
          event.stopPropagation(); // This prevents the click from reaching the overlay
      });
  }

  // Attach event listener to the cancel button
  const cancelButton = document.querySelector('.cancel');
  if (cancelButton) {
      cancelButton.addEventListener('click', (event) => {
          event.preventDefault();
          hideDeletePrompt();
      });
  } else {
      console.log('Cancel button not found');
  }

  // Optional: Add click handler to overlay to close when clicking outside
  const overlay = document.querySelector('.overlay');
  if (overlay) {
      overlay.addEventListener('click', () => {
          hideDeletePrompt();
      });
  }
});



//Alert Prompt
document.addEventListener('DOMContentLoaded', () => {
  // function to hide the prompt
  window.hideAlert = function(){
    const alertBox = document.querySelector('.alert');
    const overlay = document.querySelector('.overlay');

    alertBox.classList.remove('show'); // Hide alert
    overlay.classList.remove('show'); // Hide overlay
    console.log('Alert hidden');
  }

  // Example usage to show the alert (if needed dynamically via JS)
  window.showAlert = function () {
    const alertBox = document.querySelector('.alert');
    const overlay = document.querySelector('.overlay');

    alertBox.classList.add('show'); // Show alert
    overlay.classList.add('show'); // Show overlay
    console.log('Alert shown');
  };
});

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.style.display = 'none';
    }
}