// Main application initialization for customer frontend

// Initialize the app
function init() {
    initAuth();
    initProducts();
    setupEventListeners();
    setupButtonHandlers();
}

// Set up button handlers
function setupButtonHandlers() {
    // Shop Now button
    const shopNowBtn = document.querySelector('.btn-primary[href="#products"]');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Trending Now button
    const trendingBtn = document.querySelector('.btn-secondary[href="#trending"]');
    if (trendingBtn) {
        trendingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const trendingSection = document.getElementById('trending');
            if (trendingSection) {
                trendingSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Admin link
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            if (!isLoggedIn()) {
                e.preventDefault();
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.classList.add('active');
                }
            }
        });
    }
}

// Set up event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            if (navLinks) navLinks.classList.remove('active');
        }
    });

    // Close all modals when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#products' && href !== '#trending') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
