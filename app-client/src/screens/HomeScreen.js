import api from '../services/api.js';
import SearchManager from '../services/SearchManager.js';

export async function HomeScreen(container) {
    const user = JSON.parse(localStorage.getItem('user'));
    const isOng = user && user.role === 'ong';
    let allRequests = [];

    const renderList = (requests) => {
        const listContainer = document.getElementById('requests-list');
        if (!listContainer) return;

        if (requests.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-12 px-6 bg-white rounded-3xl border border-dn-green-pale">
                    <p class="text-dn-ink-soft font-medium">Nenhum pedido encontrado para sua busca.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = requests.map(req => `
            <div class="bg-white rounded-[2.5rem] shadow-sm border border-dn-green-pale cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden flex flex-col md:flex-row" 
                 onclick="window.history.pushState({}, '', '/request-detail/${req.id}'); window.dispatchEvent(new PopStateEvent('popstate'));">
                
                ${req.image_url ? `
                    <div class="w-full md:w-48 h-48 shrink-0">
                        <img src="${req.image_url}" class="w-full h-full object-cover">
                    </div>
                ` : `
                    <div class="w-full md:w-48 h-48 shrink-0 bg-dn-green-pale flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-dn-green opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                `}

                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-dn-green-pale text-dn-green text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider font-dmsans">
                            ${req.category}
                        </span>
                        <span class="${req.urgency === 'alta' || req.urgency === 'urgente' ? 'text-dn-error' : 'text-dn-amber'} text-[11px] font-bold uppercase tracking-widest font-dmsans">
                            ${req.urgency}
                        </span>
                    </div>
                    
                    <h3 class="text-2xl font-black text-dn-green-dark mb-2 font-playfair leading-tight">${req.title}</h3>
                    <p class="text-dn-ink-mid text-sm mb-6 line-clamp-2 font-dmsans flex-1">${req.description}</p>
                    
                    <div class="border-t border-dn-green-pale pt-4 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-dn-green rounded-full animate-pulse"></div>
                            <span class="text-dn-green font-bold text-xs uppercase tracking-widest font-dmsans">
                                ${isOng ? 'Ver Interessados' : 'Manifestar Interesse'}
                            </span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        `).join('');
    };

    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-16 relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-dn-green rounded-full opacity-10 blur-3xl"></div>
            <div class="max-w-4xl mx-auto relative z-10">
                <p class="text-dn-amber-light font-bold tracking-[0.4em] text-[10px] mb-4 uppercase font-dmsans">Plataforma DongNate</p>
                <h1 class="text-4xl md:text-6xl font-black leading-tight font-playfair mb-8">
                    ${isOng ? 'Gerencie o impacto da sua organização' : 'Como você quer transformar vidas hoje?'}
                </h1>
            </div>
        </div>

        <div class="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
            <div class="bg-white p-2 rounded-[1.5rem] shadow-2xl flex items-center gap-2 border border-dn-green-pale">
                <div class="pl-4 text-dn-green">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input type="text" id="home-search" placeholder="Buscar por alimentos, cobertores, remédios..." 
                    class="w-full p-4 border-none focus:ring-0 text-dn-green-dark font-medium placeholder:text-dn-ink-soft">
            </div>
        </div>

        <div class="max-w-4xl mx-auto p-8 space-y-8 mb-20">
            <div class="flex justify-between items-end">
                <h2 class="text-3xl font-black text-dn-green-dark font-playfair">
                    ${isOng ? 'Seus Pedidos Ativos' : 'Pedidos Urgentes'}
                </h2>
                <p class="text-xs font-bold text-dn-green uppercase tracking-widest pb-1 border-b-2 border-dn-green">Recentes</p>
            </div>

            <div id="requests-list" class="grid grid-cols-1 gap-8">
                <div class="flex flex-col items-center justify-center p-20 opacity-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-dn-green mb-4"></div>
                    <p class="font-bold uppercase tracking-widest text-[10px]">Carregando rede de apoio...</p>
                </div>
            </div>
        </div>
    `;

    SearchManager.subscribe(({ query, category }) => {
        const filtered = allRequests.filter(req => {
            const matchQuery = req.title.toLowerCase().includes(query.toLowerCase()) || 
                               req.description.toLowerCase().includes(query.toLowerCase());
            const matchCat = category === 'Todos' || req.category === category;
            return matchQuery && matchCat;
        });
        renderList(filtered);
    });

    const searchInput = document.getElementById('home-search');
    searchInput.addEventListener('input', (e) => {
        SearchManager.setSearch(e.target.value, SearchManager.getFilters().category);
    });

    try {
        allRequests = await api.requests.getAll();
        renderList(allRequests);
    } catch (err) {
        document.getElementById('requests-list').innerHTML = `
            <div class="p-8 bg-red-50 rounded-3xl border border-red-100 text-center">
                <p class="text-dn-error font-bold mb-4">${err.message}</p>
                <button onclick="location.reload()" class="btn-primary">Tentar Novamente</button>
            </div>
        `;
    }
}
