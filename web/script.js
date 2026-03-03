// ----- Panel Toggle -----
const container   = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn    = document.getElementById('login');

registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click',    () => container.classList.remove('active'));

// ----- Helpers -----
function showError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

function setLoading(btnId, loading, defaultText) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled   = loading;
    btn.textContent = loading ? 'Please wait...' : defaultText;
}

// ----- Sign Up -----
async function handleSignup(e) {
    e.preventDefault();
    showError('signupError', '');

    const name     = document.getElementById('signupName').value.trim();
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (password.length < 6) {
        showError('signupError', 'Password must be at least 6 characters.');
        return;
    }

    setLoading('signupBtn', true, 'Sign Up');
    try {
        const res  = await fetch('/api/auth/register', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('signupError', data.errors ? data.errors[0].msg : data.message);
            return;
        }

        localStorage.setItem('ppToken', data.token);
        localStorage.setItem('ppUser',  JSON.stringify(data.user));
        window.location.href = 'index.html';

    } catch {
        showError('signupError', 'Network error. Is the server running?');
    } finally {
        setLoading('signupBtn', false, 'Sign Up');
    }
}

// ----- Log In -----
async function handleLogin(e) {
    e.preventDefault();
    showError('loginError', '');

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    setLoading('loginBtn', true, 'Log In');
    try {
        const res  = await fetch('/api/auth/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('loginError', data.errors ? data.errors[0].msg : data.message);
            return;
        }

        localStorage.setItem('ppToken', data.token);
        localStorage.setItem('ppUser',  JSON.stringify(data.user));

        // Redirect admin to admin panel (with token for server-side check), users to home
        window.location.href = data.user.role === 'admin'
            ? `admin.html?token=${encodeURIComponent(data.token)}`
            : 'index.html';

    } catch {
        showError('loginError', 'Network error. Is the server running?');
    } finally {
        setLoading('loginBtn', false, 'Log In');
    }
}
