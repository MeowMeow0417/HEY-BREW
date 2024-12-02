document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const mobileToggleBtn = document.getElementById('mobileToggle');

    function toggleForm() {
        container.classList.toggle("active");
        updateMobileToggleText();
    }

    registerBtn.addEventListener('click', toggleForm);
    loginBtn.addEventListener('click', toggleForm);

    function updateMobileToggleText() {
        if (container.classList.contains("active")) {
            mobileToggleBtn.textContent = "Switch to Sign In";
        } else {
            mobileToggleBtn.textContent = "Switch to Sign Up";
        }
    }

    mobileToggleBtn.addEventListener('click', toggleForm);

    // Function to handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();
        // Assuming successful login/registration
        window.location.href = 'Client-HomePage.html'; // Redirect to main page
    }

    // Add event listeners to both forms
    document.querySelector('.sign-in form').addEventListener('submit', handleFormSubmit);
    document.querySelector('.sign-up form').addEventListener('submit', handleFormSubmit);

// Function to handle form submission
    /*
    function handleFormSubmit(event) {
        event.preventDefault();
        // Assuming successful login/registration
        window.location.href = '../homepage/Mainpage.html'; // Redirect to main page
    }*/

    // Add event listeners to both forms
    //document.querySelector('.sign-in form').addEventListener('submit', handleFormSubmit);
    //document.querySelector('.sign-up form').addEventListener('submit', handleFormSubmit);


    // Check URL hash on page load and switch to appropriate form
    function checkUrlHash() {
        if (window.location.hash === '#signup') {
            container.classList.add("active");
        } else {
            container.classList.remove("active");
        }
        updateMobileToggleText();
    }

    // Check hash on page load
    checkUrlHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkUrlHash);

    // Call on load and resize
    updateMobileToggleText();
    window.addEventListener('resize', updateMobileToggleText);
});