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
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
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

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('tikshop_admin') === 'true';
}

// Login function
function login(username, password) {
    if (username === 'admin' && password === 'password123') {
        localStorage.setItem('tikshop_admin', 'true');
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('tikshop_admin');
    showNotification('Logged out successfully');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}
