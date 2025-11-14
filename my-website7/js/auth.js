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
    hideAdminPanel();
    showToast('Logged out successfully', 'success');
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('admin-panel').classList.add('active');
    document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
}

// Hide admin panel
function hideAdminPanel() {
    document.getElementById('admin-panel').classList.remove('active');
}

// Initialize authentication
function initAuth() {
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const adminLoginLink = document.getElementById('admin-login-link');
    const footerAdminLink = document.getElementById('footer-admin-link');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Open login modal
    adminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
    });

    footerAdminLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn()) {
            showAdminPanel();
        } else {
            loginModal.classList.add('active');
        }
    });

    // Close login modal
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = await login(username, password);
        
        if (result.success) {
            loginModal.classList.remove('active');
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

    // Logout button
    logoutBtn.addEventListener('click', logout);

    // Close modal when clicking outside
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    // Auto-show admin panel if already logged in
    if (isLoggedIn()) {
        // Admin panel will be shown when needed
    }
}