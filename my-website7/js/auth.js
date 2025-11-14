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
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Initialize authentication for admin panel
function initAdminAuth() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');

    // Check if user is already logged in
    if (isLoggedIn()) {
        adminLogin.style.display = 'none';
        adminDashboard.style.display = 'flex';
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
