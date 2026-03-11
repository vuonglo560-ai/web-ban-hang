// Dữ liệu sản phẩm
const products = [
    {
        id: 1,
        name: "Kem dưỡng ẩm Vitamin C",
        price: 299000,
        category: "skincare",
        image: "💧",
        description: "Kem dưỡng ẩm chứa Vitamin C giúp làm sáng da và chống lão hóa."
    },
    {
        id: 2,
        name: "Son môi matte đỏ",
        price: 199000,
        category: "makeup",
        image: "💄",
        description: "Son môi matte lâu trôi với màu đỏ quyến rũ."
    },
    {
        id: 3,
        name: "Nước hoa hoa hồng",
        price: 899000,
        category: "fragrance",
        image: "🌹",
        description: "Nước hoa với hương thơm nhẹ nhàng của hoa hồng."
    },
    {
        id: 4,
        name: "Serum Hyaluronic Acid",
        price: 399000,
        category: "skincare",
        image: "🧴",
        description: "Serum cấp ẩm sâu với Hyaluronic Acid."
    },
    {
        id: 5,
        name: "Phấn phủ kiềm dầu",
        price: 249000,
        category: "makeup",
        image: "✨",
        description: "Phấn phủ kiềm dầu giúp lâu trôi suốt ngày dài."
    },
    {
        id: 6,
        name: "Nước hoa vanilla",
        price: 799000,
        category: "fragrance",
        image: "🍦",
        description: "Nước hoa với hương vanilla ngọt ngào và quyến rũ."
    },
    {
        id: 7,
        name: "Tẩy trang dịu nhẹ",
        price: 179000,
        category: "skincare",
        image: "🧽",
        description: "Tẩy trang dịu nhẹ không gây khô da."
    },
    {
        id: 8,
        name: "Mascara dài mi",
        price: 229000,
        category: "makeup",
        image: "👁️",
        description: "Mascara giúp mi dài và cong tự nhiên."
    }
];

// Giỏ hàng
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    setupEventListeners();
    updateCartCount();
});

// Hiển thị sản phẩm
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Thêm vào giỏ hàng
                </button>
            </div>
        `;
        
        // Thêm sự kiện click để xem chi tiết
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                showProductDetails(product);
            }
        });
        
        productsGrid.appendChild(productCard);
    });
}

// Lọc sản phẩm
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    displayProducts(filteredProducts);
}

// Thêm vào giỏ hàng
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification('Đã thêm vào giỏ hàng!');
}

// Xóa khỏi giỏ hàng
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCart();
}

// Cập nhật số lượng trong giỏ hàng
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartCount();
            displayCart();
        }
    }
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Hiển thị giỏ hàng
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Giỏ hàng trống</p>';
        totalPrice.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <span>${formatPrice(item.price)}</span>
            </div>
            <div>
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; color: red;">Xóa</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    totalPrice.textContent = formatPrice(total);
}

// Hiển thị chi tiết sản phẩm
function showProductDetails(product) {
    const productDetails = document.getElementById('product-details');
    productDetails.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">${product.image}</div>
            <h2>${product.name}</h2>
            <p style="margin: 1rem 0; color: #666;">${product.description}</p>
            <div style="font-size: 1.5rem; color: #e91e63; font-weight: bold; margin: 1rem 0;">
                ${formatPrice(product.price)}
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id}); closeModal('product-modal')">
                Thêm vào giỏ hàng
            </button>
        </div>
    `;
    productModal.style.display = 'block';
}

// Đóng modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Cuộn đến phần sản phẩm
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Thiết lập event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });
    
    // Cart icon
    cartIcon.addEventListener('click', () => {
        displayCart();
        cartModal.style.display = 'block';
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }
        
        alert('Cảm ơn bạn đã mua hàng! Đơn hàng sẽ được xử lý sớm.');
        cart = [];
        updateCartCount();
        closeModal('cart-modal');
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// CSS Animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);