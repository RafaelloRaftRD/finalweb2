// API Base URL
const API_URL = 'https://coffee-shop-api-kza6.onrender.com/api';

// Global variables
let currentUser = null;
let token = localStorage.getItem('token') || null;
let cart = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadMenu();
    loadWeatherRecommendation();
});

// Check if user is authenticated
function checkAuth() {
    if (token) {
        fetchUserProfile();
    }
}

// Fetch user profile
async function fetchUserProfile() {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.data;
            updateUIForLoggedInUser();
        } else {
            logout();
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    document.getElementById('authBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('ordersBtn').style.display = 'block';
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // If showing orders, load them
    if (sectionId === 'orders') {
        loadOrders();
    }
    
    // If showing menu, load products
    if (sectionId === 'menu') {
        loadMenu();
    }
}

// Toggle between login and register forms
function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
}

// Register
async function register() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    
    if (!username || !email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, phone, address })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.data.token;
            localStorage.setItem('token', token);
            currentUser = data.data;
            updateUIForLoggedInUser();
            showMessage('Registration successful!', 'success');
            showSection('home');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Registration failed', 'error');
    }
}

// Login
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Please enter email and password', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.data.token;
            localStorage.setItem('token', token);
            currentUser = data.data;
            updateUIForLoggedInUser();
            showMessage('Login successful!', 'success');
            showSection('home');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Login failed', 'error');
    }
}

// Logout
function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    cart = [];
    
    document.getElementById('authBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('ordersBtn').style.display = 'none';
    
    showMessage('Logged out successfully', 'success');
    showSection('home');
}

// Load menu (products)
async function loadMenu() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        if (response.ok) {
            displayProducts(data.data);
        }
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

// Display products
function displayProducts(products) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';
    
    if (products.length === 0) {
        menuGrid.innerHTML = '<p>No products available</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <span class="category">${product.category}</span>
            <p>${product.description}</p>
            <div class="price">${product.price}₸</div>
            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">
                Add to Cart
            </button>
        `;
        menuGrid.appendChild(card);
    });
}

// Add to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.productName === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            productName: name,
            quantity: 1,
            price: price
        });
    }
    
    updateCart();
    showMessage(`${name} added to cart!`, 'success');
}

// Update cart display
function updateCart() {
    const cartDiv = document.getElementById('cart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartDiv.style.display = 'none';
        return;
    }
    
    cartDiv.style.display = 'block';
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.productName} x ${item.quantity}</span>
            <span>${(item.price * item.quantity)}₸</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(itemDiv);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = total;
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Clear cart
function clearCart() {
    cart = [];
    updateCart();
}

// Place order
async function placeOrder() {
    if (!token) {
        showMessage('Please login to place an order', 'error');
        showSection('auth');
        return;
    }
    
    if (cart.length === 0) {
        showMessage('Cart is empty', 'error');
        return;
    }
    
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const notes = document.getElementById('orderNotes').value;
    
    if (!deliveryAddress) {
        showMessage('Please enter delivery address', 'error');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart,
                totalPrice: totalPrice,
                deliveryAddress: deliveryAddress,
                notes: notes
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Order placed successfully!', 'success');
            cart = [];
            updateCart();
            document.getElementById('deliveryAddress').value = '';
            document.getElementById('orderNotes').value = '';
            showSection('orders');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to place order', 'error');
    }
}

// Load orders
async function loadOrders() {
    if (!token) {
        document.getElementById('ordersList').innerHTML = '<p>Please login to view orders</p>';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayOrders(data.data);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Display orders
function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders yet</p>';
        return;
    }
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        
        let itemsHTML = '';
        order.items.forEach(item => {
            itemsHTML += `
                <div class="order-item">
                    <span>${item.productName} x ${item.quantity}</span>
                    <span>${(item.price * item.quantity)}₸</span>
                </div>
            `;
        });
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <strong>Order #${order._id.substring(0, 8)}</strong>
                    <p>${orderDate}</p>
                </div>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-items">
                ${itemsHTML}
            </div>
            <p><strong>Delivery:</strong> ${order.deliveryAddress}</p>
            ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            <p><strong>Total:</strong> ${order.totalPrice}₸</p>
        `;
        
        ordersList.appendChild(orderCard);
    });
}

// Load weather recommendation
async function loadWeatherRecommendation() {
    try {
        const response = await fetch(`${API_URL}/products/recommendations/weather?city=Astana`);
        const data = await response.json();
        
        if (data.success) {
            const weatherBox = document.getElementById('weatherRecommendation');
            weatherBox.innerHTML = `
                <h3>🌤️ Today's Recommendation</h3>
                <p>Temperature: ${data.data.temperature}°C - ${data.data.weather}</p>
                <p>${data.data.suggestion}</p>
            `;
        }
    } catch (error) {
        console.error('Error loading weather:', error);
    }
}

// Show message
function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}