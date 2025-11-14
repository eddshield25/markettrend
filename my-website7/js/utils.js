// Utility Functions

// Format price in Philippine Peso
function formatPrice(price) {
    return `₱${parseFloat(price).toFixed(2)}`;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Validate Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Load products from localStorage
function loadProducts() {
    const stored = localStorage.getItem('tikshop_products');
    if (stored) {
        return JSON.parse(stored);
    } else {
        // Default products
        const defaultProducts = [
            {
                id: '1',
                title: "Viral TikTok Hair Styler",
                description: "Create perfect curls in minutes - went viral on TikTok!",
                price: 1499.99,
                affiliateLink: "https://example.com/product1",
                source: "tiktok",
                category: "Beauty",
                image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=300&fit=crop",
                featured: true
            },
            {
                id: '2',
                title: "Smart Watch Pro",
                description: "Feature-packed smartwatch with health monitoring",
                price: 3999.99,
                affiliateLink: "https://example.com/product2",
                source: "amazon",
                category: "Electronics",
                image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=300&fit=crop",
                featured: true
            },
            {
                id: '3',
                title: "Portable Blender",
                description: "Make smoothies anywhere - TikTok famous!",
                price: 1249.99,
                affiliateLink: "https://example.com/product3",
                source: "tiktok",
                category: "Kitchen",
                image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=300&fit=crop",
                featured: false
            }
        ];
        saveProducts(defaultProducts);
        return defaultProducts;
    }
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('tikshop_products', JSON.stringify(products));
}

// Load admin credentials from localStorage
function loadAdminCredentials() {
    const stored = localStorage.getItem('tikshop_admin_credentials');
    if (stored) {
        return JSON.parse(stored);
    } else {
        // Default admin credentials (change these in production)
        const defaultCredentials = {
            username: 'admin',
            password: 'admin123', // Change this to a secure password
            email: 'admin@tikshop.com'
        };
        saveAdminCredentials(defaultCredentials);
        return defaultCredentials;
    }
}

// Save admin credentials to localStorage
function saveAdminCredentials(credentials) {
    localStorage.setItem('tikshop_admin_credentials', JSON.stringify(credentials));
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('tikshop_admin_loggedin') === 'true';
}

// Set login status
function setLoginStatus(loggedIn) {
    if (loggedIn) {
        localStorage.setItem('tikshop_admin_loggedin', 'true');
    } else {
        localStorage.removeItem('tikshop_admin_loggedin');
    }
}

// Login function
function login(username, password) {
    const credentials = loadAdminCredentials();
    if (username === credentials.username && password === credentials.password) {
        setLoginStatus(true);
        return true;
    }
    return false;
}

// Logout function
function logout() {
    setLoginStatus(false);
    showNotification('Logged out successfully');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Change password function
function changePassword(newPassword, confirmPassword) {
    if (!newPassword || !confirmPassword) {
        return { success: false, message: 'Please fill in all fields' };
    }
    
    if (newPassword !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
    }
    
    if (newPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
    }
    
    const credentials = loadAdminCredentials();
    credentials.password = newPassword;
    saveAdminCredentials(credentials);
    
    return { success: true, message: 'Password updated successfully' };
}

// Forgot password function (simulated - in real app, this would send an email)
function forgotPassword(email) {
    const credentials = loadAdminCredentials();
    
    if (email !== credentials.email) {
        return { success: false, message: 'Email not found' };
    }
    
    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Send an email with reset link
    // 3. Store the token for verification
    
    // For demo purposes, we'll just show a message
    return { 
        success: true, 
        message: 'Password reset instructions have been sent to your email' 
    };
}
