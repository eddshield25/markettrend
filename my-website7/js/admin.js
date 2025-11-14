// Admin panel functionality

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
        featured: false,
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 1000) + 100,
        status: "active"
    };
    
    products.push(newProduct);
    saveProducts(products);
    displayProducts(getActiveProducts());
    updateAdminProductsList();
    document.getElementById('add-product-form').reset();
    showToast('Product added successfully!', 'success');
}

// Update admin products list
function updateAdminProductsList() {
    const adminProductsList = document.getElementById('admin-products-list');
    adminProductsList.innerHTML = '<p>Loading...</p>';
    
    setTimeout(() => {
        const products = loadProducts();
        
        if (products.length === 0) {
            adminProductsList.innerHTML = '<p>No products added yet.</p>';
            return;
        }
        
        adminProductsList.innerHTML = '';
        
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                margin-bottom: 1rem;
            `;
            
            productItem.innerHTML = `
                <div>
                    <h4 style="margin: 0 0 0.5rem;">${product.title}</h4>
                    <div style="display: flex; gap: 1rem; font-size: 0.9rem; color: #64748b;">
                        <span>Source: ${product.source}</span>
                        <span>Price: ${formatPrice(product.price)}</span>
                        <span>Status: ${product.status}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" onclick="editProduct('${product.id}')" style="padding: 0.5rem;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="deleteProduct('${product.id}')" style="padding: 0.5rem; background: #ef4444; color: white;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            adminProductsList.appendChild(productItem);
        });
    }, 500);
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
    
    // Switch to add product tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="add-product"]').classList.add('active');
    document.getElementById('add-product-tab').classList.add('active');
    
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
        tags
    };
    
    saveProducts(products);
    displayProducts(getActiveProducts());
    updateAdminProductsList();
    
    // Reset form and button
    document.getElementById('add-product-form').reset();
    const submitButton = document.querySelector('#add-product-form button[type="submit"]');
    submitButton.textContent = 'Add Product';
    submitButton.onclick = function(e) {
        e.preventDefault();
        addProduct();
    };
    
    showToast('Product updated successfully!', 'success');
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
        
        displayProducts(getActiveProducts());
        updateAdminProductsList();
        showToast('Product deleted successfully!', 'success');
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
        
        newProducts.forEach(productData => {
            const newProduct = {
                id: generateId(),
                ...productData,
                status: "active",
                rating: 4.0 + Math.random(),
                reviewCount: Math.floor(Math.random() * 1000) + 100
            };
            products.push(newProduct);
        });
        
        saveProducts(products);
        displayProducts(getActiveProducts());
        updateAdminProductsList();
        document.getElementById('bulk-data').value = '';
        showToast(`${newProducts.length} products imported successfully!`, 'success');
    } catch (error) {
        showToast('Error importing products. Check JSON format.', 'error');
    }
}

// Initialize admin panel
function initAdmin() {
    const addProductForm = document.getElementById('add-product-form');
    const importBulkBtn = document.getElementById('import-bulk');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add product form
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addProduct();
    });

    // Import bulk products
    importBulkBtn.addEventListener('click', importBulkProducts);

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Update admin products list if logged in
    if (isLoggedIn()) {
        updateAdminProductsList();
    }
}