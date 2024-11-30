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
      const overlay =document.querySelector('.overlay');

      deletePrompt.querySelector('p').innerText = productName; // Set the product name
      deletePrompt.classList.add('show'); // Add the show class to display it
      overlay.classList.add('show'); // Add the show class to the overlay
      console.log('Delete prompt shown for:', productName); // Debug log
  };

  // Hiding the Delete prompt
  window.hideDeletePrompt = function() {
      const deletePrompt = document.querySelector('.delete-prompt');
      const overlay = document.querySelector('.overlay');

      deletePrompt.classList.remove('show'); // Remove the show class to hide it
      overlay.classList.remove('show');
      console.log('Delete prompt hidden'); // Debug log
  };

  // Attach event listener to the cancel button
  const cancelButton = document.querySelector('.cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default button behavior
      hideDeletePrompt(); // Call the function to hide the prompt
    });
  } else {
    console.log('Cancel button not found');
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