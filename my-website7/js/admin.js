// Admin panel functionality

// Initialize admin panel
function initAdminPanel() {
    if (!initAdminAuth()) return; // Stop if not logged in
    
    setupAdminNavigation();
    loadAdminDashboard();
    setupProductManagement();
    setupBulkUpload();
}

// Setup admin navigation
function setupAdminNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
            
            // Update page title
            pageTitle.textContent = item.querySelector('span').textContent;
            
            // Load specific tab data
            switch(tab) {
                case 'dashboard':
                    loadAdminDashboard();
                    break;
                case 'products':
                    loadAdminProducts();
                    break;
                case 'analytics':
                    loadAnalytics();
                    break;
            }
        });
    });
}

// Load admin dashboard
function loadAdminDashboard() {
    const products = loadProducts();
    const activeProducts = products.filter(p => p.status === 'active');
    const featuredProducts = activeProducts.filter(p => p.featured);
    const tiktokProducts = activeProducts.filter(p => p.source === 'tiktok');
    const amazonProducts = activeProducts.filter(p => p.source === 'amazon');
    
    // Update stats
    document.getElementById('total-products').textContent = activeProducts.length;
    document.getElementById('featured-products').textContent = featuredProducts.length;
    document.getElementById('tiktok-products').textContent = tiktokProducts.length;
    document.getElementById('amazon-products').textContent = amazonProducts.length;
    
    // Load recent activity
    loadRecentActivity();
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    const products = loadProducts();
    
    // Get recent products (last 5)
    const recentProducts = products
        .filter(p => p.status === 'active')
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
    
    activityList.innerHTML = recentProducts.map(product => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-box"></i>
            </div>
            <div class="activity-info">
                <p><strong>${product.title}</strong> added</p>
                <span class="activity-time">${formatPrice(product.price)} • ${product.source}</span>
            </div>
        </div>
    `).join('');
}

// Setup product management
function setupProductManagement() {
    const searchInput = document.getElementById('product-search');
    const filterSelect = document.getElementById('product-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            loadAdminProducts();
        }, 300));
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', loadAdminProducts);
    }
    
    loadAdminProducts();
}

// Load admin products
function loadAdminProducts() {
    const products = loadProducts();
    const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('product-filter')?.value || 'all';
    
    let filteredProducts = products;
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply source filter
    if (filterValue !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.source === filterValue);
    }
    
    displayAdminProducts(filteredProducts);
}

// Display admin products in table
function displayAdminProducts(products) {
    const adminProductsList = document.getElementById('admin-products-list');
    if (!adminProductsList) return;
    
    adminProductsList.innerHTML = products.map(product => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <div style="font-weight: 500;">${product.title}</div>
                        <div style="font-size: 0.8rem; color: var(--admin-text-secondary);">${product.category}</div>
                    </div>
                </div>
            </td>
            <td>${formatPrice(product.price)}</td>
            <td>
                <span class="product-source" style="background: var(--admin-sidebar); padding: 0.3rem 0.7rem; border-radius: 20px; font-size: 0.8rem;">
                    ${product.source}
                </span>
            </td>
            <td>
                <span style="padding: 0.3rem 0.7rem; border-radius: 20px; font-size: 0.8rem; background: ${product.status === 'active' ? 'var(--admin-success)' : 'var(--admin-danger)'}; color: white;">
                    ${product.status}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" onclick="editProduct('${product.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    if (products.length === 0) {
        adminProductsList.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--admin-text-secondary);">
                    No products found
                </td>
            </tr>
        `;
    }
}

// Add new product
async function addProduct() {
    const title = document.getElementById('product-title').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const affiliateLink = document.getElementById('product-affiliate-link').value;
    const source = document.getElementById('product-source').value;
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const tags = document.getElementById('product-tags').value.split(',').map(tag => tag.trim());
    const featured = document.getElementById('product-featured').checked;
    
    // Validate inputs
    if (!title || !price || !description || !affiliateLink || !category || !image) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (!isValidUrl(affiliateLink) || !isValidUrl(image)) {
        showToast('Please enter valid URLs for affiliate link and image', 'error');
        return;
    }
    
    await simulateAPIDelay(); // Simulate API call
    
    const products = loadProducts();
    const newProduct = {
        id: generateId(),
        title,
        description,
        price,
        originalPrice: price * 1.2,
        affiliateLink,
        source,
        category,
        image,
        tags,
        featured,
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 1000) + 100,
        status: "active"
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    // Reset form
    document.getElementById('add-product-form').reset();
    
    showToast('Product added successfully!', 'success');
    
    // Refresh products list
    loadAdminProducts();
    loadAdminDashboard();
}

// Edit product
function editProduct(productId) {
    const products = loadProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    // Populate form with product data
    document.getElementById('product-title').value = product.title;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-affiliate-link').value = product.affiliateLink;
    document.getElementById('product-source').value = product.source;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-tags').value = product.tags.join(', ');
    document.getElementById('product-featured').checked = product.featured;
    
    // Switch to add product tab
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="add-product"]').classList.add('active');
    document.getElementById('add-product-tab').classList.add('active');
    document.getElementById('page-title').textContent = 'Edit Product';
    
    // Change button text and behavior
    const submitButton = document.querySelector('#add-product-form button[type="submit"]');
    submitButton.textContent = 'Update Product';
    submitButton.onclick = function(e) {
        e.preventDefault();
        updateProduct(productId);
    };
    
    showToast('Edit the product details and click Update Product', 'success');
}

// Update product
async function updateProduct(productId) {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        showToast('Product not found', 'error');
        return;
    }
    
    const title = document.getElementById('product-title').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const affiliateLink = document.getElementById('product-affiliate-link').value;
    const source = document.getElementById('product-source').value;
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const tags = document.getElementById('product-tags').value.split(',').map(tag => tag.trim());
    const featured = document.getElementById('product-featured').checked;
    
    await simulateAPIDelay(); // Simulate API call
    
    // Update product
    products[productIndex] = {
        ...products[productIndex],
        title,
        price,
        description,
        affiliateLink,
        source,
        category,
        image,
        tags,
        featured
    };
    
    saveProducts(products);
    
    // Reset form and button
    document.getElementById('add-product-form').reset();
    const submitButton = document.querySelector('#add-product-form button[type="submit"]');
    submitButton.textContent = 'Add Product';
    submitButton.onclick = function(e) {
        e.preventDefault();
        addProduct();
    };
    
    // Switch back to products tab
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="products"]').classList.add('active');
    document.getElementById('products-tab').classList.add('active');
    document.getElementById('page-title').textContent = 'Products';
    
    showToast('Product updated successfully!', 'success');
    
    // Refresh products list
    loadAdminProducts();
    loadAdminDashboard();
}

// Delete product
async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        await simulateAPIDelay(); // Simulate API call
        
        const products = loadProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            showToast('Product not found', 'error');
            return;
        }
        
        // Soft delete by changing status
        products[productIndex].status = 'inactive';
        saveProducts(products);
        
        showToast('Product deleted successfully!', 'success');
        
        // Refresh products list
        loadAdminProducts();
        loadAdminDashboard();
    }
}

// Setup bulk upload
function setupBulkUpload() {
    const importBulkBtn = document.getElementById('import-bulk');
    if (importBulkBtn) {
        importBulkBtn.addEventListener('click', importBulkProducts);
    }
}

// Bulk import products
async function importBulkProducts() {
    const bulkData = document.getElementById('bulk-data').value;
    
    if (!bulkData.trim()) {
        showToast('Please enter product data', 'error');
        return;
    }
    
    try {
        const newProducts = JSON.parse(bulkData);
        
        if (!Array.isArray(newProducts)) {
            showToast('Invalid format. Please provide an array of products.', 'error');
            return;
        }
        
        await simulateAPIDelay(); // Simulate API call
        
        const products = loadProducts();
        let importedCount = 0;
        
        newProducts.forEach(productData => {
            // Validate required fields
            if (productData.title && productData.price && productData.description && 
                productData.affiliateLink && productData.source && productData.category && productData.image) {
                
                const newProduct = {
                    id: generateId(),
                    ...productData,
                    status: "active",
                    rating: 4.0 + Math.random(),
                    reviewCount: Math.floor(Math.random() * 1000) + 100,
                    featured: productData.featured || false,
                    originalPrice: productData.originalPrice || productData.price * 1.2,
                    tags: productData.tags || []
                };
                
                products.push(newProduct);
                importedCount++;
            }
        });
        
        saveProducts(products);
        document.getElementById('bulk-data').value = '';
        showToast(`${importedCount} products imported successfully!`, 'success');
        
        // Refresh products list and dashboard
        loadAdminProducts();
        loadAdminDashboard();
        
    } catch (error) {
        showToast('Error importing products. Check JSON format.', 'error');
    }
}

// Load analytics
function loadAnalytics() {
    const products = loadProducts();
    const activeProducts = products.filter(p => p.status === 'active');
    
    // Source distribution
    const sourceStats = document.getElementById('source-stats');
    if (sourceStats) {
        const sources = {};
        activeProducts.forEach(product => {
            sources[product.source] = (sources[product.source] || 0) + 1;
        });
        
        sourceStats.innerHTML = Object.entries(sources).map(([source, count]) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding: 0.5rem; background: var(--admin-card); border-radius: 4px;">
                <span>${source}</span>
                <span style="font-weight: 500;">${count} products</span>
            </div>
        `).join('');
    }
    
    // Price range stats
    const priceStats = document.getElementById('price-stats');
    if (priceStats) {
        const priceRanges = {
            'Under ₱1,000': 0,
            '₱1,000 - ₱2,500': 0,
            '₱2,500 - ₱5,000': 0,
            'Over ₱5,000': 0
        };
        
        activeProducts.forEach(product => {
            if (product.price < 1000) priceRanges['Under ₱1,000']++;
            else if (product.price <= 2500) priceRanges['₱1,000 - ₱2,500']++;
            else if (product.price <= 5000) priceRanges['₱2,500 - ₱5,000']++;
            else priceRanges['Over ₱5,000']++;
        });
        
        priceStats.innerHTML = Object.entries(priceRanges).map(([range, count]) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding: 0.5rem; background: var(--admin-card); border-radius: 4px;">
                <span>${range}</span>
                <span style="font-weight: 500;">${count} products</span>
            </div>
        `).join('');
    }
}

// Initialize add product form
function initAddProductForm() {
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addProduct();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin page
    if (document.getElementById('admin-dashboard')) {
        initAdminPanel();
        initAddProductForm();
    }
});
