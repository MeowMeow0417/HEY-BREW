document.addEventListener('DOMContentLoaded', () => {
    const categoryRow = document.querySelector('.category-row');
    const categoryBoxes = document.querySelectorAll('.category-box');

    // Restore scroll position when page loads
    const savedScrollPosition = localStorage.getItem('categoryScrollPosition');
    if (savedScrollPosition) {
        categoryRow.scrollLeft = parseInt(savedScrollPosition);
    }

    // Save scroll position when scrolling
    categoryRow.addEventListener('scroll', () => {
        localStorage.setItem('categoryScrollPosition', categoryRow.scrollLeft);
    });

    // Handle category clicks
    categoryBoxes.forEach((box) => {
        box.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Save the current scroll position
            localStorage.setItem('categoryScrollPosition', categoryRow.scrollLeft);
            
            // Remove active class from all boxes
            categoryBoxes.forEach((b) => b.classList.remove('active'));
            
            // Add active class to clicked box
            box.classList.add('active');
            
            // Get category and update URL
            const category = box.dataset.category;
            
            // Redirect to the category URL
            window.location.href = `?category=${category}`;
        });
    });
});