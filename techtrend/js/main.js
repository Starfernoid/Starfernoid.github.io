// Khởi tạo giỏ hàng
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId, productName, price, image, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddedToCartModal(productName);
}

// Hiển thị thông báo thêm vào giỏ hàng
function showAddedToCartModal(productName) {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-content">
            <i class="fas fa-check-circle"></i>
            <p>Đã thêm ${productName} vào giỏ hàng</p>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }, 3000);
}

// Xử lý sự kiện click thêm vào giỏ hàng
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('h3').textContent;
        const price = parseFloat(productCard.querySelector('.current-price').textContent.replace(/[^\d]/g, ''));
        const image = productCard.querySelector('img').src;
        
        addToCart(productId, productName, price, image);
    }
});

// Chatbot toggle
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');

chatbotToggle.addEventListener('click', function() {
    chatbotContainer.classList.toggle('active');
});

document.querySelector('.close-chat').addEventListener('click', function() {
    chatbotContainer.classList.remove('active');
});

// Khởi tạo khi DOM tải xong
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Hiệu ứng scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Thêm các hàm xử lý khác cho các trang cụ thể