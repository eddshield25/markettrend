// Admin Panel JavaScript

let currentEditingId = null;

// Initialize admin panel
function initAdmin() {
    // Check if user is logged in
    if (isLoggedIn()) {
        showDashboard();
    } else {
        showLogin();
    }
    
    setupEventListeners();
}

// Show login screen
function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadAdminProducts();
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (login(username, password)) {
                showNotification('Login successful!');
                setTimeout(() => {
                    showDashboard();
                }, 1000);
            } else {
                showNotification('Invalid credentials!', 'error');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Add product form
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (currentEditingId) {
                updateProduct(currentEditingId);
            } else {
                addProduct();
            }
        });
    }
}

// Show tab
function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Activate clicked button
    event.target.classList.add('active');
    
    // Load data if needed
    if (tabId === 'products-tab') {
        loadAdminProducts();
    }
}

// Load products in admin
function loadAdminProducts() {
    const products = loadProducts();
    const productsList = document.getElementById('admin-products-list');
    
    if (productsList) {
        if (products.length === 0) {
            productsList.innerHTML = '<p>No products found.</p>';
            return;
        }
        
        productsList.innerHTML = products.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <div class="product-meta">
                        <span>${formatPrice(product.price)}</span>
                        <span>${product.source}</span>
                        <span>${product.category}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

// Add new product
function addProduct() {
    const title = document.getElementById('product-title').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const affiliateLink = document.getElementById('product-link').value;
    const source = document.getElementById('product-source').value;
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    
    // Validation
    if (!title || !price || !description || !affiliateLink || !source || !category || !image) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (!isValidUrl(affiliateLink) || !isValidUrl(image)) {
        showNotification('Please enter valid URLs', 'error');
        return;
    }
    
    const products = loadProducts();
    const newProduct = {
        id: generateId(),
        title,
        price,
        description,
        affiliateLink,
        source,
        category,
        image,
        featured: false,
        status: 'active'
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    // Reset form
    document.getElementById('add-product-form').reset();
    
    showNotification('Product added successfully!');
    loadAdminProducts();
    showTab('products-tab');
}

// Edit product
function editProduct(productId) {
    const products = loadProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Fill form with product data
    document.getElementById('product-title').value = product.title;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-link').value = product.affiliateLink;
    document.getElementById('product-source').value = product.source;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    
    // Change form to update mode
    currentEditingId = productId;
    document.querySelector('#add-product-form button[type="submit"]').textContent = 'Update Product';
    
    showTab('add-tab');
}

// Update product
function updateProduct(productId) {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        showNotification('Product not found', 'error');
        return;
    }
    
    const title = document.getElementById('product-title').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const affiliateLink = document.getElementById('product-link').value;
    const source = document.getElementById('product-source').value;
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    
    // Validation
    if (!title || !price || !description || !affiliateLink || !source || !category || !image) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    // Update product
    products[productIndex] = {
        ...products[productIndex],
        title,
        price,
        description,
        affiliateLink,
        source,
        category,
        image
    };
    
    saveProducts(products);
    
    // Reset form
    document.getElementById('add-product-form').reset();
    currentEditingId = null;
    document.querySelector('#add-product-form button[type="submit"]').textContent = 'Add Product';
    
    showNotification('Product updated successfully!');
    loadAdminProducts();
    showTab('products-tab');
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure
