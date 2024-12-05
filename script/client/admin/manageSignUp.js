document.addEventListener('DOMContentLoaded', () => {
    const adminSignUpForm = document.getElementById('adminSignUpForm');
    
    if (adminSignUpForm) {
        adminSignUpForm.addEventListener('submit', function(e) {
            const username = this.querySelector('input[name="username"]').value;
            const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
            
            if (!usernameRegex.test(username)) {
                e.preventDefault();
                alert('Username must be 5-15 characters long and contain only letters and numbers');
            }
        });
    }
});
