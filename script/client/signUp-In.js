


//Animation for Sign-In and Sign-Up function
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

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
    }

    // Check hash on page load
    checkUrlHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkUrlHash);

    // Mobile responsiveness
    function adjustForMobile() {
        if (window.innerWidth <= 768) {
            container.classList.remove('active');
            const signInForm = document.querySelector('.sign-in');
            const signUpForm = document.querySelector('.sign-up');
            signInForm.style.display = 'block';
            signUpForm.style.display = 'none';

            document.querySelector('.sign-in h2').addEventListener('click', () => {
                signInForm.style.display = 'block';
                signUpForm.style.display = 'none';
            });

            document.querySelector('.sign-up h2').addEventListener('click', () => {
                signInForm.style.display = 'none';
                signUpForm.style.display = 'block';
            });
        }
    }

    // Call on load and resize
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
});