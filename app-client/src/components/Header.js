import api from '../services/api.js';

export function Header() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    return `
        <header class="bg-white border-b border-dn-green-pale p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div class="flex items-center gap-2">
                <a href="/" data-link class="text-dn-green font-playfair text-2xl font-black tracking-tight">DongNate</a>
            </div>
            ${user ? `
                <div class="flex items-center gap-3 sm:gap-6">
                    <!-- Sino de Notificações -->
                    <div class="relative cursor-pointer" id="notif-bell-container">
                        <div class="p-2 hover:bg-dn-green-pale rounded-xl transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-dn-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span id="notif-badge" class="hidden absolute top-0 right-0 bg-dn-amber text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">0</span>
                        </div>
                        
                        <!-- Menu de Notificações -->
                        <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-72 bg-white border border-dn-green-pale rounded-[2rem] shadow-2xl p-6 z-[1000]">
                            <h4 class="text-xs font-black text-dn-green uppercase tracking-widest mb-4">Avisos Recentes</h4>
                            <div id="notif-items" class="space-y-4 max-h-64 overflow-y-auto">
                                <p class="text-[10px] text-dn-ink-soft text-center py-4 italic">Nenhuma notificação por enquanto.</p>
                            </div>
                        </div>
                    </div>

                    <div class="h-8 w-[1px] bg-dn-green-pale hidden sm:block"></div>

                    <div class="flex items-center gap-3">
                        <a href="/profile" data-link class="flex items-center gap-3 group">
                            <div class="text-right hidden sm:block">
                                <p class="text-xs font-black text-dn-green-dark leading-none group-hover:text-dn-green transition-colors">${user.full_name.split(' ')[0]}</p>
                                <p class="text-[9px] font-bold text-dn-ink-soft uppercase tracking-wider">${user.role}</p>
                            </div>
                            <div class="w-10 h-10 bg-dn-green-pale rounded-xl overflow-hidden border-2 border-white shadow-sm flex items-center justify-center group-hover:border-dn-green transition-all">
                                ${user.avatar_url ? `<img src="${user.avatar_url}" class="w-full h-full object-cover">` : `
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                `}
                            </div>
                        </a>
                        <button id="logout-btn" class="bg-dn-error/10 p-2 rounded-xl text-dn-error hover:bg-dn-error hover:text-white transition-all ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            ` : ''}
        </header>
    `;
}

export async function updateHeaderNotifications() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const notifications = await api.notifications.getByUser(user.id);
        
        const badge = document.getElementById('notif-badge');
        const itemsContainer = document.getElementById('notif-items');
        if (!badge || !itemsContainer) return;

        const unread = notifications.filter(n => !n.is_read);
        if (unread.length > 0) {
            badge.textContent = unread.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }

        if (notifications.length > 0) {
            itemsContainer.innerHTML = notifications.map(n => `
                <div class="p-3 rounded-2xl ${n.is_read ? 'opacity-50' : 'bg-dn-green-pale border border-dn-green/10'}">
                    <p class="text-[10px] font-black text-dn-green-dark mb-1 uppercase tracking-tighter">${n.title}</p>
                    <p class="text-[11px] text-dn-ink-mid leading-tight">${n.message}</p>
                </div>
            `).join('');
        }
    } catch (e) { 
        console.error("Erro ao carregar notificações no header:", e); 
    }
}
