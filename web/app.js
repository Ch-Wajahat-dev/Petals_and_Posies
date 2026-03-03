let openShopping  = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list          = document.querySelector('.list');
let listCard      = document.querySelector('.listCard');
let body          = document.querySelector('body');
let total         = document.querySelector('.total');
let quantity      = document.querySelector('.quantity');
let searchInput   = document.querySelector('#searchInput');

openShopping.addEventListener('click', () => {
    body.classList.add('active');
});
closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
});

// Checkout button
const checkoutBtn = document.querySelector('.checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (Object.keys(cartMap).length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html';
    });
}

// Auth helpers
const ppToken = () => localStorage.getItem('ppToken');

// ----- Products -----
let products = [];   // populated from API

async function fetchProducts(search = '') {
    try {
        const url = '/api/products' + (search ? `?search=${encodeURIComponent(search)}` : '');
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        products = await res.json();
    } catch {
        // Fallback to static list if API unavailable
        products = [
            { _id: '1', name: 'Floral Bouquet',   image: '02 (2).jpg',  price: 3690 },
            { _id: '2', name: 'Solo Tulip',        image: 'p2 (2).jpg',  price: 2499 },
            { _id: '3', name: 'Colorful Roses',    image: 'p3 (2).jpg',  price: 2589 },
            { _id: '4', name: 'Serene Floral',     image: 'p4 (1).jpg',  price: 3499 },
            { _id: '5', name: 'Vibrant Peony',     image: 'p5 (2).jpg',  price: 2450 },
            { _id: '6', name: 'Elegant Dahlia',    image: 'p4 (4).jpg',  price: 3550 },
            { _id: '7', name: 'Elegant Iris',      image: 'p6 (2).jpg',  price: 5689 },
            { _id: '8', name: 'Sunny Floral',      image: 'p9 (2).jpg',  price: 6790 },
            { _id: '9', name: 'Red Roses',         image: 'p8.jpg',       price: 5560 },
            { _id: '10', name: 'Tulip Bouquet',    image: 'p9.jpg',       price: 3989 },
            { _id: '11', name: 'Vibrant Blossom',  image: 'p7.jpg',       price: 6995 },
            { _id: '12', name: 'Purple Tulips',    image: 'p8 (2).jpg',  price: 5480 }
        ];
        if (search) {
            const q = search.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(q));
        }
    }
}

function renderProducts() {
    list.innerHTML = '';
    products.forEach((value) => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="img/${value.image}" alt="${value.name}">
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()} PKR</div>
            <button onclick="addToCart('${value._id}', this)">Add To Cart</button>`;
        list.appendChild(newDiv);
    });
}

async function initApp(search) {
    await fetchProducts(search);
    renderProducts();
}
initApp();

if (searchInput) {
    searchInput.addEventListener('input', () => {
        initApp(searchInput.value);
    });
}

// ----- Cart -----
// listCards is an object: { productId: { _id, name, image, price, quantity } }
// We store it as an array in localStorage for backward compat, but also index by _id internally.
// For simplicity we use a plain object keyed by _id.
let cartMap = {};   // { productId: { _id, name, image, price, quantity } }

function loadCartFromLocalStorage() {
    const raw = JSON.parse(localStorage.getItem('ppCart') || 'null');
    if (!raw) return;
    // raw may be sparse array (old format) or object
    cartMap = {};
    if (Array.isArray(raw)) {
        raw.forEach(item => {
            if (item && item._id) cartMap[item._id] = item;
        });
    } else if (typeof raw === 'object') {
        cartMap = raw;
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('ppCart', JSON.stringify(cartMap));
    // Also update cart badge
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const count = Object.values(cartMap).reduce((s, i) => s + i.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
}

loadCartFromLocalStorage();

async function addToCart(productId, btn) {
    // Look up product from already-loaded products array
    const productData = products.find(p => p._id === productId);
    if (!productData) return;

    // Visual feedback
    if (btn) {
        btn.textContent = 'Added!';
        btn.style.background = '#28a745';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Add To Cart';
            btn.style.background = '';
            btn.disabled = false;
        }, 1500);
    }

    if (ppToken()) {
        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ppToken()}`
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });
            if (!res.ok) throw new Error('Cart API error');
            const cart = await res.json();
            syncCartFromApi(cart);
        } catch {
            addToCartLocal(productId, productData);
        }
    } else {
        addToCartLocal(productId, productData);
    }
    reloadCard();
    body.classList.add('active');
}

function addToCartLocal(productId, productData) {
    if (cartMap[productId]) {
        cartMap[productId].quantity += 1;
    } else {
        cartMap[productId] = { ...productData, quantity: 1 };
    }
    saveCartToLocalStorage();
}

function syncCartFromApi(cart) {
    cartMap = {};
    (cart.items || []).forEach(item => {
        const prod = item.product;
        cartMap[prod._id] = {
            _id: prod._id,
            name: prod.name,
            image: prod.image,
            price: prod.price,
            quantity: item.quantity
        };
    });
    saveCartToLocalStorage();
}

function reloadCard() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    Object.values(cartMap).forEach(item => {
        count      += item.quantity;
        totalPrice += item.price * item.quantity;

        let li = document.createElement('li');
        li.innerHTML = `
            <div><img src="img/${item.image}" alt="${item.name}"/></div>
            <div>${item.name}</div>
            <div>${(item.price * item.quantity).toLocaleString()} PKR</div>
            <div>
                <button onclick="changeQuantity('${item._id}', ${item.quantity - 1})">-</button>
                <div class="count">${item.quantity}</div>
                <button onclick="changeQuantity('${item._id}', ${item.quantity + 1})">+</button>
            </div>`;
        listCard.appendChild(li);
    });

    total.innerText = totalPrice.toLocaleString() + ' PKR';
    quantity.innerText = count;
}
reloadCard();

async function changeQuantity(productId, qty) {
    if (qty === 0) {
        delete cartMap[productId];
        if (ppToken()) {
            fetch(`/api/cart/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${ppToken()}` }
            }).then(r => r.json()).then(cart => syncCartFromApi(cart)).catch(() => {});
        }
    } else {
        if (cartMap[productId]) cartMap[productId].quantity = qty;
        if (ppToken()) {
            fetch(`/api/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ppToken()}`
                },
                body: JSON.stringify({ quantity: qty })
            }).then(r => r.json()).then(cart => syncCartFromApi(cart)).catch(() => {});
        }
    }
    saveCartToLocalStorage();
    reloadCard();
}
