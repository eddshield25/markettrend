// Product management functionality

// Load products from localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem('affiliateProducts');
    if (storedProducts) {
        return JSON.parse(storedProducts);
    } else {
        // Default sample products
        const defaultProducts = [
            {
                id: '1',
                title: "Viral TikTok Hair Styler",
                description: "The hair tool that went viral on TikTok for creating perfect curls in minutes.",
                price: 1499.99,
                originalPrice: 1999.99,
                affiliateLink: "https://example.com/product1",
                source: "tiktok",
                category: "Beauty",
                image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["hair", "styler", "beauty"],
                featured: true,
                rating: 4.5,
                reviewCount: 1247,
                status: "active"
            },
            {
                id: '2',
                title: "Amazon's Best-Selling Smart Watch",
                description: "Feature-packed smartwatch with health monitoring and long battery life.",
                price: 3999.99,
                originalPrice: 4999.99,
                affiliateLink: "https://example.com/product2",
                source: "amazon",
                category: "Electronics",
                image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["smartwatch", "fitness", "tech"],
                featured: true,
                rating: 4.3,
                reviewCount: 3821,
                status: "active"
            },
            {
                id: '3',
                title: "Portable Blender for Smoothies",
                description: "Make healthy smoothies on the go with this powerful portable blender.",
                price: 1249.99,
                originalPrice: 1749.99,
                affiliateLink: "https://example.com/product3",
                source: "tiktok",
                category: "Kitchen",
                image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["blender", "kitchen", "health"],
                featured: false,
                rating: 4.7,
                reviewCount: 892,
                status: "active"
            },
            {
                id: '4',
                title: "Ergonomic Office Chair",
                description: "Comfortable office chair with lumbar support for long work hours.",
                price: 7499.99,
                originalPrice: 9999.99,
                affiliateLink: "https://example.com/product4",
                source: "amazon",
                category: "Furniture",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                tags: ["office", "chair", "ergonomic"],
                featured: true,
                rating: 4.4,
                reviewCount: 1563,
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

// Display products in the grid
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p class="no-products" style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No products found. Try a different filter.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
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
                    <button class="btn" onclick="viewProduct('${product.id}')">View Details</button>
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
        <h2 style="margin: 0.5rem 0;">${product.title}</h2>
        <p>${product.description}</p>
        <div class="product-price" style="font-size: 1.5rem; margin: 1rem 0;">
            ${formatPrice(product.price)}
            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
            <div style="display: flex; align-items: center;">
                <i class="fas fa-star" style="color: #f59e0b;"></i>
                <span style="margin-left: 0.5rem;">${product.rating} (${product.reviewCount} reviews)</span>
            </div>
            <span style="background: #e2e8f0; padding: 0.3rem 0.7rem; border-radius: 20px; font-size: 0.8rem;">
                ${product.category}
            </span>
        </div>
        <div style="display: flex; gap: 1rem;">
            <a href="${product.affiliateLink}" target="_blank" class="btn btn-primary" style="flex: 1; text-align: center;">
                Buy Now
            </a>
            <button class="btn" onclick="addToFavorites('${product.id}')" style="flex: 1;">
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

// Initialize products
function initProducts() {
    const products = getActiveProducts();
    displayProducts(products);
    
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
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('product-modal').classList.remove('active');
    });
    
    // Close modal when clicking outside
    document.getElementById('product-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('product-modal')) {
            document.getElementById('product-modal').classList.remove('active');
        }
    });
}