import api from '../services/api.js';

export async function MyInterestsScreen(container) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-12">
            <div class="max-w-4xl mx-auto flex justify-between items-end">
                <div>
                    <p class="text-dn-amber-light font-bold tracking-widest text-[10px] uppercase mb-2">Meu Histórico</p>
                    <h1 class="text-3xl md:text-5xl font-black font-playfair">Minhas Ajudas</h1>
                </div>
            </div>
        </div>

        <div id="interests-list" class="max-w-4xl mx-auto p-6 space-y-6 mb-24">
            <div class="flex flex-col items-center justify-center p-20">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-dn-green"></div>
            </div>
        </div>
    `;

    const listContainer = document.getElementById('interests-list');

    try {
        const interests = await api.interests.getByUser(user.id);

        if (!interests || interests.length === 0) {
            listContainer.innerHTML = `
                <div class="bg-white p-12 rounded-[2.5rem] border border-dn-green-pale text-center">
                    <p class="text-dn-ink-mid font-medium mb-6">Você ainda não manifestou interesse em nenhum pedido.</p>
                    <a href="/" class="btn-primary" data-link>Explorar Pedidos</a>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = interests.map(item => {
            const req = item.help_requests;
            const ong = req ? req.ongs : null;
            const isConfirmed = item.status === 'Confirmado';

            return `
                <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-dn-green-pale flex flex-col gap-6 relative overflow-hidden transition-all hover:shadow-md">
                    ${isConfirmed ? `
                        <div class="absolute top-0 right-0 bg-dn-green text-white px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">Confirmado</div>
                    ` : `
                        <div class="absolute top-0 right-0 bg-dn-amber/10 text-dn-amber px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">Aguardando ONG</div>
                    `}

                    <div class="flex flex-col md:flex-row gap-6">
                        ${req?.image_url ? `
                            <div class="w-full md:w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-dn-green-pale">
                                <img src="${req.image_url}" class="w-full h-full object-cover">
                            </div>
                        ` : ''}
                        
                        <div class="flex-1 space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="bg-dn-green-pale text-dn-green text-[9px] font-bold px-3 py-0.5 rounded uppercase font-dmsans">${req?.category || 'Geral'}</span>
                            </div>
                            <h3 class="text-xl font-black text-dn-green-dark font-playfair">${req?.title || 'Pedido'}</h3>
                            <p class="text-dn-ink-soft font-bold text-[10px] uppercase tracking-wider">ONG: ${ong?.organization_name || 'Organização'}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-dn-cream p-4 rounded-2xl border border-dn-green/5 italic">
                            <p class="text-[10px] font-black text-dn-green uppercase mb-1 not-italic">Sua Mensagem:</p>
                            <p class="text-xs text-dn-ink-mid">"${item.message || 'Tenho interesse em ajudar!'}"</p>
                        </div>
                        ${item.photo_url ? `
                            <div class="relative rounded-2xl overflow-hidden border border-dn-green-pale h-24">
                                <img src="${item.photo_url}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/20 flex items-end p-2">
                                    <span class="text-[8px] text-white font-black uppercase">Sua Foto Enviada</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="pt-2 flex flex-col sm:flex-row gap-3">
                        ${isConfirmed ? `
                            <a href="https://api.whatsapp.com/send?phone=${ong?.phone}&text=Olá! Minha ajuda foi confirmada no DongNate para o pedido: ${req?.title}" 
                               target="_blank"
                               class="flex-1 text-center bg-dn-green text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-dn-green-dark transition-all shadow-xl shadow-dn-green/20 font-dmsans">
                                FALAR NO WHATSAPP DA ONG
                            </a>
                        ` : `
                            <button disabled class="flex-1 bg-dn-ink-soft/10 text-dn-ink-soft py-4 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed font-dmsans">
                                AGUARDANDO CONFIRMAÇÃO
                            </button>
                        `}
                        <a href="/request-detail/${req?.id}" data-link class="sm:w-1/3 text-center border-2 border-dn-green text-dn-green py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-dn-green-pale transition-all font-dmsans">
                            VER DETALHES
                        </a>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        listContainer.innerHTML = `<div class="p-8 bg-red-50 text-dn-error rounded-3xl text-center font-bold">${err.message}</div>`;
    }
}
