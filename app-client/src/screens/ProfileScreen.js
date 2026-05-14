import api from '../services/api.js';

export async function ProfileScreen(container) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
    }

    function render() {
        container.innerHTML = `
            <div class="bg-dn-green-dark text-white p-8 md:p-12">
                <div class="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <div class="w-32 h-32 bg-dn-green rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-6 border-4 border-white/10 relative overflow-hidden">
                        ${user.avatar_url ? `<img src="${user.avatar_url}" class="w-full h-full object-cover">` : `
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        `}
                    </div>
                    <h2 class="text-3xl font-black font-playfair mb-1">${user.full_name}</h2>
                    <span class="bg-dn-amber-light text-dn-amber-dark px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">${user.role}</span>
                </div>
            </div>

            <div class="max-w-md mx-auto p-8 space-y-4 mb-24">
                <div class="bg-white rounded-[2rem] shadow-sm border border-dn-green-pale overflow-hidden">
                    <a href="/edit-profile" data-link>
                        ${ProfileOption('Dados Cadastrais', 'E-mail, telefone e foto')}
                    </a>
                    <a href="/terms" data-link>
                        ${ProfileOption('Termos e Condições', 'Regras de uso da plataforma')}
                    </a>
                    <a href="/privacy" data-link>
                        ${ProfileOption('Privacidade (LGPD)', 'Como cuidamos dos seus dados')}
                    </a>
                </div>

                <div class="pt-8 space-y-4">
                    <button id="logout-profile-btn" class="w-full py-5 bg-dn-green-pale text-dn-green font-black rounded-2xl hover:bg-dn-green transition-all hover:text-white shadow-sm tracking-widest text-xs">
                        SAIR DA CONTA
                    </button>

                    <button id="delete-account-btn" class="w-full py-2 text-dn-error text-[10px] font-black uppercase tracking-[0.2em] hover:underline opacity-60">
                        Excluir conta permanentemente
                    </button>
                </div>
            </div>

            <!-- MODAL DE EXCLUSÃO -->
            <div id="delete-modal" class="fixed inset-0 bg-dn-green-dark/95 flex items-center justify-center p-6 hidden z-[4000] backdrop-blur-md">
                <div class="bg-white p-8 rounded-[3rem] max-w-md w-full shadow-2xl border border-dn-green-pale max-h-[90vh] overflow-y-auto">
                    <h3 class="text-2xl font-black text-dn-green-dark mb-2 font-playfair">Sentiremos sua falta</h3>
                    <p class="text-dn-ink-soft text-xs mb-6 leading-relaxed">Sua conta e dados serão excluídos permanentemente de nossa base agora.</p>
                    
                    <div class="space-y-4 mb-8">
                        <div>
                            <label class="block text-[10px] font-black text-dn-green uppercase tracking-widest mb-2">Por que você está nos deixando?</label>
                            <select id="delete-reason" class="input-field text-sm">
                                <option value="">Selecione um motivo</option>
                                <option value="interface">Interface difícil de usar</option>
                                <option value="performance">Problemas técnicos/lentidão</option>
                                <option value="privacy">Preocupações com privacidade</option>
                                <option value="other">Outro motivo</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-[10px] font-black text-dn-green uppercase tracking-widest mb-2">Justificativa (Opcional)</label>
                            <textarea id="delete-justification" class="input-field min-h-[100px] text-sm" placeholder="Conte-nos como podemos melhorar..."></textarea>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3">
                        <button id="confirm-delete" class="bg-dn-error text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200">EXCLUIR MINHA CONTA AGORA</button>
                        <button id="cancel-delete" class="text-dn-ink-soft font-black text-xs uppercase tracking-widest py-2">MANTER MINHA CONTA</button>
                    </div>
                </div>
            </div>
        `;

        bindEvents();
    }

    function ProfileOption(title, sub) {
        return `
            <div class="flex items-center justify-between p-6 border-b border-dn-green-pale last:border-0 cursor-pointer hover:bg-dn-green-pale/20 transition-colors">
                <div>
                    <span class="block text-dn-green-dark font-black text-sm uppercase tracking-wider">${title}</span>
                    <span class="text-[10px] text-dn-ink-soft font-medium">${sub}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-dn-green" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </div>
        `;
    }

    function bindEvents() {
        const modal = document.getElementById('delete-modal');
        const deleteBtn = document.getElementById('delete-account-btn');
        const cancelBtn = document.getElementById('cancel-delete');
        const confirmBtn = document.getElementById('confirm-delete');

        if (deleteBtn) deleteBtn.onclick = () => modal.classList.remove('hidden');
        if (cancelBtn) cancelBtn.onclick = () => modal.classList.add('hidden');

        if (confirmBtn) {
            confirmBtn.onclick = async () => {
                const reason = document.getElementById('delete-reason').value;
                if (!reason) {
                    alert('Por favor, selecione um motivo para a exclusão.');
                    return;
                }
                try {
                    confirmBtn.disabled = true;
                    confirmBtn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>';
                    await api.auth.deleteAccount();
                    alert('Sua conta foi excluída com sucesso.');
                    api.auth.logout();
                    window.history.pushState({}, '', '/landing');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } catch (err) {
                    alert('Erro ao solicitar exclusão: ' + err.message);
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'EXCLUIR MINHA CONTA AGORA';
                }
            };
        }
    }

    render();
}
