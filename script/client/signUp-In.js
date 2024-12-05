document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const mobileToggleBtn = document.getElementById('mobileToggle');

    // Check URL parameters for direct navigation
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action === 'signup') {
        container.classList.add("active");
    } else if (action === 'signin') {
        container.classList.remove("active");
    }

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

    // Mobile responsiveness
    function adjustForMobile() {
        if (window.innerWidth <= 768) {
            const signInForm = document.querySelector('.sign-in');
            const signUpForm = document.querySelector('.sign-up');

            if (container.classList.contains('active')) {
                signInForm.style.opacity = '0';
                signInForm.style.pointerEvents = 'none';
                signUpForm.style.opacity = '1';
                signUpForm.style.pointerEvents = 'auto';
            } else {
                signInForm.style.opacity = '1';
                signInForm.style.pointerEvents = 'auto';
                signUpForm.style.opacity = '0';
                signUpForm.style.pointerEvents = 'none';
            }
        }
    }

    mobileToggleBtn.addEventListener('click', () => {
        toggleForm();
        adjustForMobile();
    });

    // Call on load and resize
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
    updateMobileToggleText();

    // Form validation
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            const username = this.querySelector('input[name="username"]').value;
            const password = this.querySelector('input[name="password"]').value;

            const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
            const passwordRegex = /^.{8,}$/;

            let isValid = true;
            let errorMessage = '';

            if (!usernameRegex.test(username)) {
                errorMessage = 'Username must be 5-15 characters long and contain only letters and numbers';
                isValid = false;
            }

            if (!passwordRegex.test(password)) {
                errorMessage = 'Password must be at least 8 characters long';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                alert(errorMessage);
            }
        });
    }
});