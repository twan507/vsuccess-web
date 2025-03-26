document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const username = sessionStorage.getItem('username');
    
    console.log("Authentication state:", isAuthenticated);
    console.log("Username:", username);
    
    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        console.log("Not authenticated, redirecting to login page");
        window.location.href = 'login.html';
        return;
    }
    
    console.log("User is authenticated, showing dashboard");
    
    // Show loading overlay for 3 seconds
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300); // Additional timeout for fade effect
        }, 3000);
    }
    
    // We don't need to adjust iframe width anymore since it's 100% by default
    function setupLayout() {
        const headerHeight = document.querySelector('header').offsetHeight;
        const mainElement = document.querySelector('main');
        
        // Set main element height to take remaining space
        mainElement.style.height = `calc(100% - ${headerHeight}px)`;
    }

    // Initial call and add event listener for window resize
    setupLayout();
    window.addEventListener('resize', setupLayout);
    
    // Add username display and logout functionality to the top navigation
    const navItems = document.querySelector('.top-nav ul');
    
    // Add username display
    const userItem = document.createElement('li');
    userItem.innerHTML = `<span id="user-display">Xin chào, <strong>${username}</strong></span>`;
    navItems.appendChild(userItem);
    
    // Add logout button
    const logoutItem = document.createElement('li');
    logoutItem.innerHTML = '<a href="#" id="logout"><strong>Đăng xuất</strong></a>';
    navItems.appendChild(logoutItem);
    
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Logging out");
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('username');
        window.location.href = 'login.html';
    });
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('nav a:not(#logout)').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // For now just scroll to top as we don't have multiple sections
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});
