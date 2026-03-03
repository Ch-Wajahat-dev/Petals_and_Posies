// Hide page loader once everything is loaded
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('hide');
        setTimeout(() => loader.remove(), 500);
    }
});

// Mobile menu toggle
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
        navbar.classList.remove('active');
    });
}

// ----- Token expiry check -----
// JWT payload is base64-encoded — decode it to read the exp claim
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // payload.exp is a Unix timestamp in seconds
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true; // treat malformed token as expired
    }
}

function checkTokenExpiry() {
    const token = localStorage.getItem('ppToken');
    if (!token) return;
    if (isTokenExpired(token)) {
        localStorage.removeItem('ppToken');
        localStorage.removeItem('ppUser');
        localStorage.removeItem('ppCart');
        // Only redirect to login if not already there
        if (!window.location.pathname.endsWith('login.html') &&
            !window.location.pathname.endsWith('signup.html')) {
            window.location.href = 'login.html';
        }
    }
}
checkTokenExpiry();

// Update cart count badge in navbar from localStorage
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    let total = 0;
    try {
        const raw = JSON.parse(localStorage.getItem('ppCart') || 'null');
        if (raw && !Array.isArray(raw)) {
            total = Object.values(raw).reduce((s, i) => s + (i ? i.quantity : 0), 0);
        } else if (Array.isArray(raw)) {
            total = raw.reduce((s, i) => s + (i ? i.quantity : 0), 0);
        }
    } catch {}
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
}
updateCartBadge();

// Auth state in navbar
function updateNavAuth() {
    const token   = localStorage.getItem('ppToken');
    const userStr = localStorage.getItem('ppUser');

    // Hide guest elements, show user pill — or vice versa
    const liLogin   = document.getElementById('li-login');
    const liSignup  = document.getElementById('li-signup');
    const liNavuser = document.getElementById('li-navuser');
    const navUser   = document.getElementById('navUser');

    if (!token || !userStr) {
        // Guest: keep login/signup visible, hide user pill
        if (liNavuser) liNavuser.style.display = 'none';
        return;
    }

    let user;
    try { user = JSON.parse(userStr); } catch { return; }

    // Logged in: hide guest links, show user pill
    if (liLogin)   liLogin.style.display  = 'none';
    if (liSignup)  liSignup.style.display = 'none';
    if (liNavuser) liNavuser.style.display = 'flex';

    if (!navUser) return;

    const initial  = user.name.charAt(0).toUpperCase();
    const firstName = user.name.split(' ')[0];
    const adminLink = user.role === 'admin'
        ? `<a class="nav-user-link admin-link" href="admin.html?token=${encodeURIComponent(token)}"><i class="fa-solid fa-shield-halved"></i> Admin</a>`
        : '';

    navUser.innerHTML = `
        <div class="nav-user-pill">
            <div class="nav-avatar">${initial}</div>
            <span class="nav-username">${firstName}</span>
            <div class="nav-user-dropdown">
                <a class="nav-user-link" href="orders.html"><i class="fa-solid fa-box"></i> My Orders</a>
                ${adminLink}
                <a class="nav-user-link logout-link" href="#" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
            </div>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('ppToken');
        localStorage.removeItem('ppUser');
        localStorage.removeItem('ppCart');
        window.location.href = 'index.html';
    });
}
updateNavAuth();

// Dynamic countdown timer for offer section
function updateCountdown() {
    const targetDate = new Date('2026-03-20T00:00:00');
    const now = new Date();
    const diff = targetDate - now;

    const times = document.querySelectorAll('.countdown .time');
    if (!times.length) return;

    if (diff <= 0) {
        times.forEach(el => el.textContent = '00');
        return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const vals = [days, hours, minutes, seconds];
    times.forEach((el, i) => {
        el.textContent = String(vals[i]).padStart(2, '0');
    });
}

if (document.querySelector('.countdown')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}
