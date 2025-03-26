document.addEventListener('DOMContentLoaded', function() {
    // Setup footer height
    function setupLayout() {
        const headerHeight = document.querySelector('header').offsetHeight;
        const mainElement = document.querySelector('main');
        
        // Set main element height to take remaining space
        mainElement.style.height = `calc(100% - ${headerHeight}px)`;
    }

    // Initial call and add event listener for window resize
    setupLayout();
    window.addEventListener('resize', setupLayout);

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // For debugging - remove in production
            console.log("Login attempt:", username);
            
            // Alternative authentication method for local file system
            // Hardcoded credentials as a fallback when JSON loading fails
            const validUsers = [
                { username: "admin", password: "admin123" },
                { username: "user", password: "user123" }
            ];
            
            try {
                // Try to fetch users from JSON file
                fetch('users.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Users data loaded successfully");
                        const foundUser = data.users.find(user => 
                            user.username === username && user.password === password);
                        
                        if (foundUser) {
                            loginSuccess(username);
                        } else {
                            loginFailed();
                        }
                    })
                    .catch(error => {
                        console.error('Error loading users from JSON:', error);
                        
                        // Fallback to hardcoded credentials
                        console.log("Falling back to hardcoded credentials");
                        const foundUser = validUsers.find(user => 
                            user.username === username && user.password === password);
                            
                        if (foundUser) {
                            loginSuccess(username);
                        } else {
                            loginFailed();
                        }
                    });
            } catch (err) {
                console.error('Exception in authentication:', err);
                alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
            }
        });
    }
    
    function loginSuccess(username) {
        // Store authentication state in sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', username);
        
        // Redirect to dashboard
        console.log("Authentication successful, redirecting to dashboard");
        window.location.href = 'index.html';
    }
    
    function loginFailed() {
        // Show error message
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        
        // Clear password field
        document.getElementById('password').value = '';
        console.log("Authentication failed");
    }
});
