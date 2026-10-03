let isLoginMode = true;

function toggleForm() {
    isLoginMode = !isLoginMode;
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchText = document.getElementById('switch-text');
    const toggleBtn = document.getElementById('toggle-form-btn');

    if (isLoginMode) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        switchText.innerText = "Don't have an account?";
        toggleBtn.innerText = "Sign up";
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        switchText.innerText = "Already have an account?";
        toggleBtn.innerText = "Sign in";
    }
}

// Password show/hide toggle function jo login page par use ho raha hai
function togglePassword(fieldId, btnElement) {
    const passwordField = document.getElementById(fieldId);
    
    if (passwordField) {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            btnElement.textContent = "Hide";
        } else {
            passwordField.type = "password";
            btnElement.textContent = "Show";
        }
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-lg shadow-lg text-white text-sm flex items-center space-x-2 transition-all duration-300 ${type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function checkPasswordStrength(password) {
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    if (!bar || !text) return;

    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength === 0) {
        bar.style.width = '0%';
        bar.className = 'h-full bg-gray-200';
        text.innerText = "Use 8+ characters with letters, numbers & symbols";
    } else if (strength <= 2) {
        bar.style.width = '40%';
        bar.className = 'h-full bg-rose-500';
        text.innerText = "Weak password";
    } else if (strength === 3) {
        bar.style.width = '75%';
        bar.className = 'h-full bg-amber-500';
        text.innerText = "Medium strength";
    } else {
        bar.style.width = '100%';
        bar.className = 'h-full bg-emerald-500';
        text.innerText = "Strong password!";
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Login Form Handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const btn = document.getElementById('login-btn');

            if(btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> <span>Signing In...</span>';
            }

            try {
                const response = await fetch('/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({ email: email, password: password })
                });

                const data = await response.json();

                if (response.ok) {
                    if(btn) {
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Success! Redirecting...</span>';
                    }
                    setTimeout(() => {
                        window.location.href = "/"; // Index page par redirect
                    }, 1000);
                } else {
                    alert(data.error || "Login failed. Please check your credentials.");
                    if(btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<span>Sign In</span>';
                    }
                }
            } catch (err) {
                console.error('Error:', err);
                alert("Something went wrong. Check your connection.");
                if(btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<span>Sign In</span>';
                }
            }
        });
    }

    // Logout Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/logout/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });
                if (response.ok) {
                    window.location.href = "/";
                } else {
                    alert("Logout failed.");
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }
});

// Handle Login Form Submit via AJAX
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');
    
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `Signing in...`;

    try {
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/'; // Homepage par redirect karega
            }, 1200);
        } else {
            showToast(data.error || data.message || 'Invalid credentials', 'error');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    } catch (err) {
        console.error('Login error:', err);
        showToast('Network error occurred.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Handle Signup Form Submit via AJAX
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            return;
        }

        const btn = document.getElementById('signup-submit-btn');
        if (btn) {
            btn.querySelector('.btn-text').classList.add('opacity-50');
            btn.querySelector('.spinner').classList.remove('hidden');
            btn.disabled = true;
        }

        try {
            const response = await fetch('/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                showToast('Account created successfully! Please login.', 'success');
                setTimeout(() => toggleForm(), 1500);
            } else {
                showToast(data.error || 'Registration failed', 'error');
            }
        } catch (err) {
            showToast('Network error occurred.', 'error');
        } finally {
            if (btn) {
                btn.querySelector('.btn-text').classList.remove('opacity-50');
                btn.querySelector('.spinner').classList.add('hidden');
                btn.disabled = false;
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // CSRF Token Helper
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Signup Form Handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const fullname = document.getElementById('signup-fullname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const btn = document.getElementById('signup-btn');

            // Button ko loading state mein convert karna
            if(btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> <span>Creating Account...</span>';
            }

            try {
                const response = await fetch('/api/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        fullname: fullname,
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success message dikhana
                    if(btn) {
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Account Created! Redirecting...</span>';
                    }
                    
                    // 1 second ke baad automatically login page par redirect kar dena
                    setTimeout(() => {
                        window.location.href = "/login/";
                    }, 1000);
                } else {
                    alert(data.message || data.error || "Signup failed. Please try again.");
                    if(btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<span>Create Account</span>';
                    }
                }
            } catch (err) {
                console.error('Error:', err);
                alert("Something went wrong. Check your connection.");
                if(btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<span>Create Account</span>';
                }
            }
        });
    }
});

// Dropdown close handler on outside click
window.addEventListener('click', function(e) {
    const btn = document.getElementById('profile-dropdown-btn');
    const menu = document.getElementById('profile-dropdown-menu');
    if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// Real Logout Handler Function
async function handleLogout() {
    try {
        const response = await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            window.location.href = "/"; // Homepage par redirect aur session destroy
        } else {
            alert("Logout failed. Please try again.");
        }
    } catch (err) {
        console.error('Error:', err);
        alert("Something went wrong during logout.");
    }
}