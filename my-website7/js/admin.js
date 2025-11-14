// Authentication functionality

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'password123'
};

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Login function
async function login(username, password) {
    await simulateAPIDelay(); // Simulate API call
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        return { success: true };
    }
    return { 
        success: false, 
        message: 'Invalid credentials' 
    };
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    showToast('Logged out successfully', 'success');
    
    // If we're on admin page, redirect to login screen
    if (window.location.pathname.includes('admin.html')) {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {
        // If we're on main page, just hide admin panel
        hideAdminPanel();
    }
}

// Show admin panel (for main page)
function showAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.add('active');
        adminPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hide admin panel (for main page)
function hideAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.remove('active');
    }
}

// Initialize authentication for main page
function initAuth() {
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const adminLoginLink = document.getElementById('admin-login-link');
    const footerAdminLink = document.getElementById('footer-admin-link');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Open login modal
    if (adminLoginLink) {
        adminLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) loginModal.classList.add('active');
        });
    }

    if (footerAdminLink) {
        footerAdminLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn()) {
                showAdminPanel();
            } else {
                if (loginModal) loginModal.classList.add('active');
            }
        });
    }

    // Close login modal
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            if (loginModal) loginModal.classList.remove('active');
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const result = await login(username, password);
            
            if (result.success) {
                if (loginModal) loginModal.classList.remove('active');
                showAdminPanel();
                showToast('Login successful!', 'success');
                loginForm.reset();
                // Refresh admin products list
                if (typeof updateAdminProductsList === 'function') {
                    updateAdminProductsList();
                }
            } else {
                showToast(result.message, 'error');
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Close modal when clicking outside
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // Auto-show admin panel if already logged in
    if (isLoggedIn() && window.location.pathname.includes('index.html')) {
        showAdminPanel();
    }
}

// Initialize authentication for admin panel
function initAdminAuth() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');

    // Check if user is already logged in
    if (isLoggedIn()) {
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'flex';
        return true;
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const result = await login(username, password);
            
            if (result.success) {
                showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showToast(result.message, 'error');
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    return false;
}
