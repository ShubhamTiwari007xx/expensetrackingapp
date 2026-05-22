document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Auth
    const authContainer = document.getElementById('auth-container');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');

    // DOM Elements - Dashboard
    const dashboardContainer = document.getElementById('dashboard-container');
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');
    const expenseCountDisplay = document.getElementById('expense-count');

    // State
    let expenses = [];

    // --- Authentication Logic ---

    function showLogin() {
        loginTab.classList.add('tab-active');
        loginTab.classList.remove('text-slate-400', 'hover:text-slate-200');
        signupTab.classList.remove('tab-active');
        signupTab.classList.add('text-slate-400', 'hover:text-slate-200');

        loginForm.classList.remove('opacity-0', 'translate-x-12', 'pointer-events-none');
        loginForm.classList.add('opacity-100', 'translate-x-0', 'pointer-events-auto');
        signupForm.classList.add('opacity-0', 'translate-x-12', 'pointer-events-none');
        signupForm.classList.remove('opacity-100', 'translate-x-0', 'pointer-events-auto');

        signupForm.reset();
        signupMessage.textContent = '';
    }

    function showSignup() {
        signupTab.classList.add('tab-active');
        signupTab.classList.remove('text-slate-400', 'hover:text-slate-200');
        loginTab.classList.remove('tab-active');
        loginTab.classList.add('text-slate-400', 'hover:text-slate-200');

        signupForm.classList.remove('opacity-0', 'translate-x-12', 'pointer-events-none');
        signupForm.classList.add('opacity-100', 'translate-x-0', 'pointer-events-auto');
        loginForm.classList.add('opacity-0', '-translate-x-12', 'pointer-events-none');
        loginForm.classList.remove('opacity-100', 'translate-x-0', 'pointer-events-auto');

        loginForm.reset();
        loginMessage.textContent = '';
    }

    loginTab.addEventListener('click', showLogin);
    signupTab.addEventListener('click', showSignup);

    async function handleAuth(url, body, messageElement) {
        messageElement.textContent = 'Processing...';
        messageElement.className = 'text-center text-sm min-h-[1.25rem] mt-4 text-indigo-400';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                messageElement.textContent = 'Success! Entering Nexus...';
                messageElement.classList.replace('text-indigo-400', 'text-green-400');
                
                setTimeout(() => {
                    initDashboard();
                }, 1000);
            } else {
                messageElement.textContent = data.message || 'Action failed';
                messageElement.classList.replace('text-indigo-400', 'text-red-400');
            }
        } catch (error) {
            messageElement.textContent = 'Server error. Please try again.';
            messageElement.classList.replace('text-indigo-400', 'text-red-400');
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        handleAuth('/auth/login', { email, password }, loginMessage);
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        handleAuth('/auth/register', { username, email, password }, signupMessage);
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    });

    // --- Dashboard Logic ---

    async function initDashboard() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token) {
            authContainer.classList.remove('hidden');
            dashboardContainer.classList.add('hidden');
            return;
        }

        // UI Transition
        authContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        userGreeting.textContent = user.username;

        fetchExpenses();
    }

    async function fetchExpenses() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/expenses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) {
                logoutBtn.click();
                return;
            }
            expenses = await response.json();
            renderExpenses();
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        }
    }

    function renderExpenses() {
        if (expenses.length === 0) {
            expenseList.innerHTML = '<div class="text-center py-20 text-slate-500 italic">No expenses yet. Add one to get started!</div>';
            totalAmountDisplay.textContent = '$0.00';
            expenseCountDisplay.textContent = '0 items';
            return;
        }

        let total = 0;
        expenseList.innerHTML = expenses.map(exp => {
            total += exp.amount;
            return `
                <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group animate-in fade-in slide-in-from-right-5 duration-300">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            ${getCategoryIcon(exp.category)}
                        </div>
                        <div>
                            <div class="font-bold text-white">${exp.title}</div>
                            <div class="text-xs text-slate-400">${exp.category} • ${new Date(exp.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="font-bold text-lg">$${exp.amount.toFixed(2)}</div>
                        <button onclick="deleteExpense(${exp.id})" class="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        totalAmountDisplay.textContent = `$${total.toFixed(2)}`;
        expenseCountDisplay.textContent = `${expenses.length} items`;
    }

    function getCategoryIcon(category) {
        switch (category) {
            case 'Food': return '🍔';
            case 'Transport': return '🚗';
            case 'Shopping': return '🛍️';
            case 'Bills': return '📄';
            default: return '💰';
        }
    }

    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('expense-title').value;
        const amount = document.getElementById('expense-amount').value;
        const category = document.getElementById('expense-category').value;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/expenses', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, amount, category })
            });

            if (response.ok) {
                expenseForm.reset();
                fetchExpenses();
            }
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    });

    window.deleteExpense = async (id) => {
        const token = localStorage.getItem('token');
        // Removed confirm for smoother UX and testing
        try {
            const response = await fetch(`/expenses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchExpenses();
            }
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    // Check login state on load
    initDashboard();
});
