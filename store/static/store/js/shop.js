// Cart Counter & LocalStorage Setup

function updateCartCounter() {
    document.getElementById('cart-counter').innerText = cartCount;
    localStorage.setItem('cartCount', cartCount);
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-xl shadow-lg text-white text-xs font-medium flex items-center space-x-2 transition-all duration-300 ${type === 'success' ? 'bg-emerald-600' : 'bg-slate-800'}`;
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Add to Cart Handler (Can be integrated with POST /api/cart/add/)
function addToCart(productName, price) {
    cartCount++;
    updateCartCounter();
    showToast(`Added "${productName}" to your cart!`);
}

// Mobile Menu Toggle
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Best Sellers Carousel Controls
const track = document.getElementById('carousel-track');
document.getElementById('slide-right').addEventListener('click', () => {
    track.scrollBy({ left: 300, behavior: 'smooth' });
});
document.getElementById('slide-left').addEventListener('click', () => {
    track.scrollBy({ left: -300, behavior: 'smooth' });
});

// Newsletter Subscription Handler
function handleSubscribe(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if(email) {
        showToast('Thank you for subscribing! Check your inbox for code WELCOME25.');
        document.getElementById('newsletter-email').value = '';
    }
}

/// Cart Counter & LocalStorage Setup
let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
const counterEl = document.getElementById('cart-counter');
if(counterEl) counterEl.innerText = cartCount;

function updateCartCounter() {
    if(counterEl) counterEl.innerText = cartCount;
    localStorage.setItem('cartCount', cartCount);
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-xl shadow-lg text-white text-xs font-medium flex items-center space-x-2 transition-all duration-300 ${type === 'success' ? 'bg-emerald-600' : 'bg-slate-800'}`;
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
if(mobileBtn) {
    mobileBtn.addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        if(menu) menu.classList.toggle('hidden');
    });
}

function renderProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group';
        card.innerHTML = `
            <div>
                <div class="relative bg-slate-100 rounded-xl h-64 overflow-hidden mb-4">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">${product.discount || 'Sale'}</span>
                </div>
                <h4 class="font-semibold text-slate-800 text-sm truncate">${product.name}</h4>
            </div>
            <div class="flex items-center justify-between mt-4">
                <span class="text-indigo-600 font-bold">$${Number(product.price).toFixed(2)}</span>
                <a href="/add-to-cart/${product.id}/" class="bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl hover:bg-indigo-600 transition font-medium text-center">Add to Cart</a>
            </div>
        `;
        productGrid.appendChild(card);
    });
}
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingProducts();
});