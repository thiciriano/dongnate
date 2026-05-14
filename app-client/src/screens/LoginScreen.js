import api from '../services/api.js';

export async function LoginScreen(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-dn-green-pale">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black text-dn-green mb-2">Bem-vindo de volta</h1>
                <p class="text-dn-ink-mid">Acesse sua conta para continuar ajudando.</p>
            </div>
            
            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-dn-ink-mid mb-1">E-mail</label>
                    <input type="email" id="email" class="input-field" placeholder="seu@email.com" required>
                </div>
                <div>
                    <label class="block text-sm font-bold text-dn-ink-mid mb-1">Senha</label>
                    <input type="password" id="password" class="input-field" placeholder="••••••••" required>
                </div>
                
                <div id="login-error" class="text-dn-error text-sm hidden"></div>
                
                <button type="submit" class="btn-primary w-full py-4 mt-4">Entrar</button>
            </form>
            
            <div class="mt-6 text-center">
                <p class="text-dn-ink-mid">Não tem uma conta? 
                    <a href="/register" class="text-dn-green font-bold" data-link>Cadastre-se</a>
                </p>
            </div>
        </div>
    `;

    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await api.auth.login(email, password);
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.classList.remove('hidden');
        }
    });
}
