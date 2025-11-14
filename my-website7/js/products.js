// Product management functionality

// Load products from localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem('affiliateProducts');
    if (storedProducts) {
        return JSON.parse(storedProducts);
    } else {
        // Default sample products with TikTok theme
        const defaultProducts = [
            {
                id: '1',
                title: "Viral TikTok Hair Styler - Magic Curls Pro",
                description: "The hair tool that went viral on TikTok for creating perfect curls in minutes without heat damage.",
                price: 1499.99,
                originalPrice: 1999.99,
                affiliateLink: "https://example.com/product1",
                source: "tiktok",
                category: "Beauty",
                image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["hair", "styler", "beauty", "viral"],
                featured: true,
                rating: 4.5,
                reviewCount: 1247,
                status: "active"
            },
            {
                id: '2',
                title: "Amazon's Best-Selling Smart Watch 2023",
                description: "Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life.",
                price: 3999.99,
                originalPrice: 4999.99,
                affiliateLink: "https://example.com/product2",
                source: "amazon",
                category: "Electronics",
                image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["smartwatch", "fitness", "tech", "amazon"],
                featured: true,
                rating: 4.3,
                reviewCount: 3821,
                status: "active"
            },
            {
                id: '3',
                title: "Portable Blender for Smoothies - TikTok Famous",
                description: "Make healthy smoothies on the go with this powerful portable blender that went viral on TikTok.",
                price: 1249.99,
                originalPrice: 1749.99,
                affiliateLink: "https://example.com/product3",
                source: "tiktok",
                category: "Kitchen",
                image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["blender", "kitchen", "health", "viral"],
                featured: false,
                rating: 4.7,
                reviewCount: 892,
                status: "active"
            },
            {
                id: '4',
                title: "Gaming Chair - Amazon's Choice",
                description: "Ergonomic gaming chair with lumbar support and adjustable armrests for long sessions.",
                price: 7499.99,
                originalPrice: 9999.99,
                affiliateLink: "https://example.com/product4",
                source: "amazon",
                category: "Furniture",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["gaming", "chair", "ergonomic", "amazon"],
                featured: true,
                rating: 4.4,
                reviewCount: 1563,
                status: "active"
            },
            {
                id: '5',
                title: "LED Face Mask - Instagram Viral",
                description: "Professional LED light therapy mask for skin rejuvenation, featured by beauty influencers.",
                price: 2999.99,
                originalPrice: 3999.99,
                affiliateLink: "https://example.com/product5",
                source: "instagram",
                category: "Beauty",
                image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["skincare", "LED", "beauty", "instagram"],
                featured: false,
                rating: 4.2,
                reviewCount: 567,
                status: "active"
            },
            {
                id: '6',
                title: "Wireless Earbuds - TikTok Sound Quality",
                description: "Crystal clear sound wireless earbuds that went viral for their amazing battery life.",
                price: 1999.99,
                originalPrice: 2499.99,
                affiliateLink: "https://example.com/product6",
                source: "tiktok",
                category: "Electronics",
                image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["earbuds", "audio", "wireless", "viral"],
                featured: true,
                rating: 4.6,
                reviewCount: 2341,
                status: "active"
            }
        ];
        saveProducts(defaultProducts);
        return defaultProducts;
    }
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('affiliateProducts', JSON.stringify(products));
}

// Get all active products
function getActiveProducts() {
    const products = loadProducts();
    return products.filter(product => product.status === 'active');
}

// Get featured products
function getFeaturedProducts() {
    const products = getActiveProducts();
    return products.filter(product => product.featured);
}

// Display products in the grid
function displayProducts(productsToDisplay, gridId = 'products-grid') {
    const productsGrid = document.getElementById(gridId);
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p class="no-products" style="text-align: center; grid-column: 1 / -1; padding: 2rem; color: var(--tiktok-text-secondary);">No products found. Try a different filter.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const badge = product.featured ? '<div class="product-badge">🔥 Trending</div>' : '';
        
        productCard.innerHTML = `
            ${badge}
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <span class="product-source">${product.source}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    ${formatPrice(product.price)}
                    ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">View Details</button>
                    <a href="${product.affiliateLink}" target="_blank" class="btn btn-primary">Buy Now</a>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// View product details in modal
function viewProduct(productId) {
    const products = loadProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.title}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">
        <span class="product-source">${product.source}</span>
        <h2 style="margin: 0.5rem 0; color: var(--tiktok-text);">${product.title}</h2>
        <p style="color: var(--tiktok-text-secondary);">${product.description}</p>
        <div class="product-price" style="font-size: 1.5rem; margin: 1rem 0; color: var(--tiktok-text);">
            ${formatPrice(product.price)}
            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
            <div style="display: flex; align-items: center; color: var(--tiktok-text-secondary);">
                <i class="fas fa-star" style="color: #f59e0b;"></i>
                <span style="margin-left: 0.5rem;">${product.rating} (${product.reviewCount} reviews)</span>
            </div>
            <span style="background: var(--tiktok-gray); color: var(--tiktok-text); padding: 0.3rem 0.7rem; border-radius: 20px; font-size: 0.8rem;">
                ${product.category}
            </span>
        </div>
        <div style="display: flex; gap: 1rem;">
            <a href="${product.affiliateLink}" target="_blank" class="btn btn-primary" style="flex: 1; text-align: center;">
                Buy Now
            </a>
            <button class="btn btn-secondary" onclick="addToFavorites('${product.id}')" style="flex: 1;">
                <i class="far fa-heart"></i> Add to Favorites
            </button>
        </div>
    `;
    
    document.getElementById('product-modal').classList.add('active');
}

// Add product to favorites (placeholder function)
function addToFavorites(productId) {
    showToast('Product added to favorites!', 'success');
}

// Initialize products for customer frontend
function initProducts() {
    const products = getActiveProducts();
    const featuredProducts = getFeaturedProducts();
    
    displayProducts(products);
    
    // Display trending products if element exists
    const trendingGrid = document.getElementById('trending-grid');
    if (trendingGrid) {
        displayProducts(featuredProducts, 'trending-grid');
    }
    
    // Filter products
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            const allProducts = getActiveProducts();
            if (filter === 'all') {
                displayProducts(allProducts);
            } else {
                const filteredProducts = allProducts.filter(product => product.source === filter);
                displayProducts(filteredProducts);
            }
        });
    });
    
    // Close product modal
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('product-modal').classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
            }
        });
    }
}
