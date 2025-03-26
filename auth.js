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
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showError("Vui lòng nhập tên đăng nhập và mật khẩu");
                return;
            }
            
            console.log("Login attempt for:", username);
            
            // IMPORTANT: Hardcoded credentials as ultimate fallback
            // This ensures login works even if JSON or fetch fails
            const validCredentials = [
                { username: "admin", password: "admin1234" },
                { username: "user", password: "user123" }
            ];
            
            // First check hardcoded credentials
            const matchedCredential = validCredentials.find(cred => 
                cred.username === username && cred.password === password);
            
            if (matchedCredential) {
                console.log("Direct authentication successful");
                loginSuccess(username);
                return;
            }
            
            // If not matched with hardcoded credentials, try fetching users.json
            console.log("Direct authentication failed, trying JSON file...");
            try {
                const jsonUrl = new URL('users.json', window.location.href).href;
                console.log("Fetching from:", jsonUrl);
                
                fetch(jsonUrl)
                    .then(response => {
                        console.log("JSON response status:", response.status);
                        if (!response.ok) {
                            throw new Error(`Failed to load users.json: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("JSON data loaded successfully");
                        const foundUser = data.users.find(user => 
                            user.username === username && user.password === password);
                        
                        if (foundUser) {
                            loginSuccess(username);
                        } else {
                            loginFailed("Tên đăng nhập hoặc mật khẩu không đúng!");
                        }
                    })
                    .catch(err => {
                        console.error("JSON authentication error:", err);
                        loginFailed("Tên đăng nhập hoặc mật khẩu không đúng!");
                    });
            } catch (err) {
                console.error("Exception during authentication:", err);
                loginFailed("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
            }
        });
    }
    
    function loginSuccess(username) {
        // Store authentication state in sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', username);
        
        // Redirect to dashboard
        console.log(`Authentication successful for ${username}, redirecting to dashboard`);
        window.location.href = 'index.html';
    }
    
    function loginFailed(message = "Tên đăng nhập hoặc mật khẩu không đúng!") {
        // Show error message
        showError(message);
        
        // Clear password field
        document.getElementById('password').value = '';
        console.log("Authentication failed");
    }
    
    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
