// Utility functions

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.log('Toast element not found');
        return;
    }
    
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Format price in Philippine Peso
function formatPrice(price) {
    if (isNaN(price)) {
        console.error('Invalid price:', price);
        return '₱0.00';
    }
    return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
}

// Simulate API delay
function simulateAPIDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debug function to check if scripts are loaded
function checkScripts() {
    console.log('Utils.js loaded successfully');
    console.log('isValidUrl test:', isValidUrl('https://example.com'));
    console.log('formatPrice test:', formatPrice(1234.56));
}
