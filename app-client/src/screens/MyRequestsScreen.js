import api from '../services/api.js';

export async function MyRequestsScreen(container) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-12">
            <div class="max-w-4xl mx-auto flex justify-between items-center">
                <div>
                    <h1 class="text-3xl md:text-5xl font-black font-playfair text-white">Meus Pedidos</h1>
                    <p class="text-dn-amber-light font-bold text-xs uppercase tracking-widest mt-2 font-dmsans">Gestão de Doações e Interessados</p>
                </div>
                <a href="/create-request" class="bg-dn-green p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform" data-link>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </a>
            </div>
        </div>

        <div id="requests-container" class="max-w-4xl mx-auto p-6 space-y-8 mb-24">
            <div class="flex justify-center p-20 opacity-30">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-dn-green"></div>
            </div>
        </div>

        <!-- Modal de Interessados -->
        <div id="interests-modal" class="fixed inset-0 bg-dn-green-dark/95 z-[3000] hidden items-center justify-center p-4 backdrop-blur-md">
            <div class="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl">
                <div class="bg-dn-green p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 class="font-black font-playfair text-2xl text-white">Doadores Interessados</h3>
                        <p class="text-dn-green-pale text-xs uppercase tracking-widest mt-1 font-dmsans text-white/80">Confirme quem pode ajudar</p>
                    </div>
                    <button id="close-modal" class="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div id="interests-list-content" class="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                    <!-- Lista dinâmica -->
                </div>
            </div>
        </div>
    `;

    const requestsContainer = document.getElementById('requests-container');
    const modal = document.getElementById('interests-modal');
    const interestsList = document.getElementById('interests-list-content');

    async function loadData() {
        try {
            const ongs = await api.ongs.getAll();
            const myOng = ongs.find(o => o.user_id === user.id);

            if (!myOng) {
                requestsContainer.innerHTML = `<div class="p-12 text-center bg-white rounded-3xl border border-dn-green-pale"><p class="text-dn-ink-mid">ONG não encontrada. Conclua seu cadastro.</p></div>`;
                return;
            }

            const myRequests = await api.ongs.getRequestsWithInterests(myOng.id);

            if (!myRequests || myRequests.length === 0) {
                requestsContainer.innerHTML = `<div class="p-12 text-center bg-white rounded-3xl border border-dn-green-pale"><p class="text-dn-ink-mid font-playfair text-xl">Você ainda não publicou nenhum pedido.</p></div>`;
                return;
            }

            requestsContainer.innerHTML = myRequests.map(req => `
                <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-dn-green-pale hover:shadow-md transition-all">
                    <div class="flex flex-col md:flex-row gap-6">
                        ${req.image_url ? `
                            <div class="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-dn-green-pale">
                                <img src="${req.image_url}" class="w-full h-full object-cover">
                            </div>
                        ` : ''}
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="bg-dn-green-pale text-dn-green text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest font-dmsans">${req.category}</span>
                                <span class="bg-dn-cream text-dn-ink-soft text-[10px] font-bold px-3 py-1 rounded-lg uppercase border border-dn-green-pale font-dmsans">${req.status}</span>
                            </div>
                            <h3 class="text-2xl font-black text-dn-green-dark font-playfair mb-2">${req.title}</h3>
                            <p class="text-dn-ink-mid text-sm line-clamp-2 mb-6 font-dmsans">${req.description}</p>
                            
                            <button class="view-interests-btn group flex items-center gap-3 bg-dn-green-pale text-dn-green px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-dn-green hover:text-white transition-all font-dmsans" data-id="${req.id}">
                                <span>${req.interestsCount} Interessado(s)</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex md:flex-col gap-2 shrink-0">
                            <button class="bg-red-50 text-dn-error p-4 rounded-2xl hover:bg-dn-error hover:text-white transition-all delete-btn" data-id="${req.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            bindListEvents();
        } catch (err) {
            requestsContainer.innerHTML = `<div class="p-12 bg-red-50 text-dn-error rounded-3xl text-center font-bold">${err.message}</div>`;
        }
    }

    function bindListEvents() {
        requestsContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Excluir este pedido permanentemente?')) {
                    await api.requests.delete(btn.dataset.id);
                    loadData();
                }
            };
        });

        requestsContainer.querySelectorAll('.view-interests-btn').forEach(btn => {
            btn.onclick = () => openInterestsModal(btn.dataset.id);
        });
    }

    async function openInterestsModal(requestId) {
        interestsList.innerHTML = '<div class="text-center p-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-dn-green mx-auto"></div></div>';
        modal.classList.replace('hidden', 'flex');
        
        try {
            const interests = await api.interests.getByRequest(requestId);
            
            if (!interests || interests.length === 0) {
                interestsList.innerHTML = `<div class="text-center py-20 font-playfair text-dn-ink-soft text-xl">Ninguém manifestou interesse ainda.</div>`;
                return;
            }

            interestsList.innerHTML = interests.map(int => `
                <div class="bg-dn-cream p-8 rounded-[2.5rem] border border-dn-green-pale flex flex-col gap-4 relative">
                    ${int.status === 'Confirmado' ? `
                        <div class="absolute top-0 right-0 bg-dn-green text-white px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest font-dmsans shadow-sm">Confirmado</div>
                    ` : ''}
                    
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-dn-green rounded-2xl overflow-hidden flex items-center justify-center text-white text-2xl font-black font-playfair">
                            ${int.users?.avatar_url ? `<img src="${int.users.avatar_url}" class="w-full h-full object-cover">` : (int.users?.full_name?.charAt(0) || 'U')}
                        </div>
                        <div>
                            <h4 class="text-xl font-black text-dn-green-dark font-playfair">${int.users?.full_name || 'Usuário'}</h4>
                            <p class="text-[10px] font-bold text-dn-ink-soft uppercase tracking-widest font-dmsans">${int.users?.role || 'Doador'}</p>
                        </div>
                    </div>

                    ${int.photo_url ? `
                        <div class="w-full h-48 rounded-2xl overflow-hidden border-2 border-dn-green-pale mb-2">
                            <img src="${int.photo_url}" class="w-full h-full object-cover">
                        </div>
                        <p class="text-[9px] font-black text-dn-green uppercase tracking-tighter mb-2">Foto enviada pelo doador</p>
                    ` : ''}

                    <div class="bg-white p-5 rounded-2xl border border-dn-green/5 shadow-inner">
                        <p class="text-dn-ink-mid text-sm italic font-dmsans leading-relaxed">"${int.message || 'Olá! Tenho interesse em ajudar com esta doação.'}"</p>
                    </div>

                    <div class="flex gap-3 mt-2">
                        ${int.status === 'Pendente' ? `
                            <button class="confirm-btn flex-1 bg-dn-green text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-dn-green-dark shadow-lg shadow-dn-green/20 transition-all font-dmsans" data-id="${int.id}">
                                Confirmar Ajuda
                            </button>
                        ` : `
                            <a href="https://api.whatsapp.com/send?phone=${int.users?.phone || ''}&text=Olá ${int.users?.full_name}! Sua ajuda foi confirmada no DongNate." 
                               target="_blank"
                               class="flex-1 text-center bg-dn-green text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-dn-green/20 font-dmsans">
                                Abrir WhatsApp do Doador
                            </a>
                        `}
                    </div>
                </div>
            `).join('');

            interestsList.querySelectorAll('.confirm-btn').forEach(btn => {
                btn.onclick = async () => {
                    const originalText = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = 'Processando...';
                    try {
                        await api.interests.confirm(btn.dataset.id);
                        openInterestsModal(requestId);
                    } catch (e) {
                        alert(e.message);
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                    }
                };
            });

        } catch (e) {
            interestsList.innerHTML = `<p class="text-dn-error text-center p-8">${e.message}</p>`;
        }
    }

    document.getElementById('close-modal').onclick = () => modal.classList.replace('flex', 'hidden');

    loadData();
}
