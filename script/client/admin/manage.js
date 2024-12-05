const categories = document.querySelectorAll(".categories");
const animation = document.querySelector(".animation");

// Set the selector to the active category on page load
const setActiveCategory = (category) => {
  const { offsetLeft, offsetWidth } = category;
  animation.style.left = `${offsetLeft}px`;
  animation.style.width = `${offsetWidth}px`;
};

// Move the selector when hovering over categories
categories.forEach((category) => {
  category.addEventListener("mouseover", () => {
    const { offsetLeft, offsetWidth } = category;
    animation.style.left = `${offsetLeft}px`;
    animation.style.width = `${offsetWidth}px`;
  });

  // Make the selector stay on the clicked category
  category.addEventListener("click", (e) => {
    categories.forEach((cat) => cat.classList.remove("active"));
    category.classList.add("active");
    setActiveCategory(category);
  });
});

// Initialize the selector position based on the active category
const activeCategory = document.querySelector(".categories.active");
if (activeCategory) {
  setActiveCategory(activeCategory);
}


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

function hideAlert() {
  const alert = document.querySelector('.alert');
  if (alert) {
      alert.style.display = 'none';
  }
}

// Automatically hide the alert after 2 seconds
document.addEventListener('DOMContentLoaded', () => {
  const alert = document.querySelector('.alert');
  if (alert) {
      setTimeout(() => {
          alert.style.display = 'none';
      }, 2000); // 2000 milliseconds = 2 seconds
  }
});