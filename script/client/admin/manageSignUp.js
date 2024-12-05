document.addEventListener('DOMContentLoaded', () => {
    const adminSignUpForm = document.getElementById('adminSignUpForm');
    
    if (adminSignUpForm) {
        adminSignUpForm.addEventListener('submit', function(e) {
            const username = this.querySelector('input[name="username"]').value;
            const password = this.querySelector('input[name="password"]').value;
            
            const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
            const passwordRegex = /^.{8,}$/;  // Minimum 8 characters, any character type
            
            let isValid = true;
            let errorMessage = '';

            if (!usernameRegex.test(username)) {
                e.preventDefault();
                errorMessage = 'Username must be 5-15 characters long and contain only letters and numbers';
                isValid = false;
            }

            if (!passwordRegex.test(password)) {
                e.preventDefault();
                errorMessage = 'Password must be at least 8 characters long';
                isValid = false;
            }

            if (!isValid) {
                alert(errorMessage);
            }
        });
    }
});
