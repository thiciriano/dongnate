export function BottomNav() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return '';

    const isOng = user.role === 'ong';
    const path = window.location.pathname;

    const items = isOng ? [
        { label: 'Início', icon: 'home', route: '/' },
        { label: 'Meus Pedidos', icon: 'list', route: '/my-requests' },
        { label: 'Criar', icon: 'add_circle', route: '/create-request' },
        { label: 'Perfil', icon: 'person', route: '/profile' }
    ] : [
        { label: 'Explorar', icon: 'search', route: '/' },
        { label: 'Mapa', icon: 'map', route: '/map' },
        { label: 'Minhas Ajudas', icon: 'favorite', route: '/my-interests' },
        { label: 'Perfil', icon: 'person', route: '/profile' }
    ];

    const icons = {
        home: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`,
        list: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>`,
        add_circle: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
        person: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
        search: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`,
        map: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l5-2.5 5.553 2.776a1 1 0 01.447.894v10.764a1 1 0 01-1.447.894L14 17l-5 3z" /></svg>`,
        favorite: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`
    };

    return `
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-dn-green-pale flex justify-around items-center p-2 z-[2000]">
            ${items.map(item => {
                const isActive = path === item.route;
                return `
                    <a href="${item.route}" data-link class="flex flex-col items-center gap-1 ${isActive ? 'text-dn-green' : 'text-dn-ink-soft'}">
                        <div class="p-1 rounded-xl ${isActive ? 'bg-dn-green-pale' : ''}">
                            ${icons[item.icon]}
                        </div>
                        <span class="text-[10px] font-bold uppercase">${item.label}</span>
                    </a>
                `;
            }).join('')}
        </nav>
    `;
}
