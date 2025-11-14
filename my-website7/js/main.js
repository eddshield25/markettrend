// Main Frontend JavaScript

let currentFilter = 'all';

// Initialize the frontend
function init() {
    displayProducts();
    setupEventListeners();
}

// Display products on the frontend
function displayProducts() {
    const products = loadProducts();
    const activeProducts = products.filter(p => !p.status || p.status === 'active');
    
    // Filter products based on current filter
    let filteredProducts = activeProducts;
    if (currentFilter !== 'all') {
        filteredProducts = activeProducts.filter(p => p.source === currentFilter);
    }
    
    // Display in main grid
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <span class="product-source">${product.source}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">View Details</button>
                        <a href="${product.affiliateLink}" target="_blank" class="btn btn-primary">Buy Now</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Display featured products in trending section
    const trendingGrid = document.getElementById('trending-grid');
    if (trendingGrid) {
        const featuredProducts = activeProducts.filter(p => p.featured);
        trendingGrid.innerHTML = featuredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <span class="product-source">${product.source}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">View Details</button>
                        <a href="${product.affiliateLink}" target="_blank" class="btn btn-primary">Buy Now</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Filter products
function filterProducts(source) {
    currentFilter = source;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayProducts();
}

// View product details
function viewProduct(productId) {
    const products = loadProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Open product link in new tab
        window.open(product.affiliateLink, '_blank');
    }
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to trending section
function scrollToTrending() {
    const trendingSection = document.getElementById('trending');
    if (trendingSection) {
        trendingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add any additional event listeners here
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);
