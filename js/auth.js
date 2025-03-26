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
            
            // Show loading indicator
            const loginBtn = document.querySelector('.login-btn');
            const originalBtnText = loginBtn.textContent;
            loginBtn.textContent = "Đang xác thực...";
            loginBtn.disabled = true;
            
            // Use localUsers array from js/users.js file
            try {
                console.log("Checking credentials against known users");
                // Check if localUsers exists (imported from js/users.js)
                if (typeof localUsers === 'undefined') {
                    throw new Error("User data not loaded properly");
                }
                
                const foundUser = localUsers.find(user => 
                    user.username === username && user.password === password);
                
                if (foundUser) {
                    console.log("Valid credentials found");
                    loginSuccess(username);
                } else {
                    console.log("Invalid credentials");
                    loginFailed("Tên đăng nhập hoặc mật khẩu không đúng!");
                }
            } catch (err) {
                console.error("Authentication error:", err);
                loginFailed("Có lỗi xảy ra khi xác thực. Vui lòng thử lại sau.");
            } finally {
                // Restore button
                loginBtn.textContent = originalBtnText;
                loginBtn.disabled = false;
            }
        });
        
        // Updated toggle password functionality with PNG icons
        const passwordInput = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function() {
                const toggleImg = togglePassword.querySelector('img');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleImg.src = 'photo/hide.png';
                    toggleImg.alt = 'Ẩn mật khẩu';
                } else {
                    passwordInput.type = 'password';
                    toggleImg.src = 'photo/show.png';
                    toggleImg.alt = 'Hiện mật khẩu';
                }
            });
        }
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