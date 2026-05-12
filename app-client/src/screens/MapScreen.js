import api from '../services/api.js';
import SearchManager from '../services/SearchManager.js';
import { MarkerFactory } from '../services/MarkerFactory.js';

export async function MapScreen(container) {
    const categories = ["Todos", "Alimentos", "Vestuário", "Higiene", "Voluntariado", "Móveis", "Outros"];

    container.innerHTML = `
        <div class="h-[calc(100vh-140px)] w-full relative">
            <!-- Barra de Busca Avançada -->
            <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-2xl flex flex-col gap-2">
                <div class="bg-white p-2 rounded-2xl shadow-2xl flex gap-2 border border-dn-green/10">
                    <div class="flex-1 flex items-center bg-dn-cream/50 rounded-xl px-3 border border-dn-green-pale">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" id="map-location-search" placeholder="Pesquisar endereço, cidade ou bairro..." 
                               class="w-full border-none focus:ring-0 text-sm p-2 bg-transparent" />
                    </div>
                    <select id="map-category-filter" class="text-xs border-none focus:ring-0 bg-dn-green-pale rounded-xl font-bold text-dn-green px-3">
                        ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <button id="btn-search-map" class="bg-dn-green text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-dn-green-dark transition-all">Buscar</button>
                </div>
                <div id="search-results-dropdown" class="hidden bg-white rounded-2xl shadow-2xl border border-dn-green-pale overflow-hidden max-h-48 overflow-y-auto"></div>
            </div>

            <div id="map" class="h-full w-full bg-dn-cream"></div>
            
            <div id="map-loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-[1001] hidden">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-dn-green"></div>
            </div>

            <button id="locate-me-btn" class="absolute bottom-6 right-6 z-[1000] bg-white p-4 rounded-full shadow-2xl text-dn-green hover:bg-dn-green-pale transition-all border border-dn-green/10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    `;

    if (!window.L) {
        await new Promise(resolve => {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    const map = L.map('map', { zoomControl: false }).setView([-23.5505, -46.6333], 13);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const markerLayer = L.featureGroup().addTo(map);
    const userLayer = L.layerGroup().addTo(map);
    const loading = document.getElementById('map-loading');

    const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
        iconSize: [16, 16]
    });

    map.on('locationfound', (e) => {
        userLayer.clearLayers();
        L.marker(e.latlng, { icon: userIcon }).addTo(userLayer).bindPopup("<b>Você está aqui</b>");
        L.circle(e.latlng, e.accuracy, { color: '#3b82f6', weight: 1, fillOpacity: 0.1 }).addTo(userLayer);
    });

    document.getElementById('locate-me-btn').addEventListener('click', () => {
        map.locate({ setView: true, maxZoom: 16 });
    });

    async function refreshMapData(filters = { query: '', category: 'Todos' }) {
        loading.classList.remove('hidden');
        markerLayer.clearLayers();

        try {
            const [ongs, requests] = await Promise.all([
                api.ongs.getAll(),
                api.requests.getAll()
            ]);

            // ONGs reais (Círculos Verdes)
            ongs.forEach(ong => {
                if (ong.latitude && ong.longitude) {
                    const markerData = MarkerFactory.createMarker('ONG', ong);
                    L.circleMarker([markerData.lat, markerData.lng], {
                        radius: 10,
                        fillColor: markerData.color,
                        color: "#fff",
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 1
                    }).bindPopup(markerData.popupHtml).addTo(markerLayer);
                }
            });

            // Pedidos reais (Filtrados por categoria e query de texto)
            requests.filter(r => 
                (filters.category === 'Todos' || r.category === filters.category)
            ).forEach(req => {
                if (req.latitude && req.longitude) {
                    const markerData = MarkerFactory.createMarker('REQUEST', req);
                    L.marker([markerData.lat, markerData.lng]).bindPopup(markerData.popupHtml).addTo(markerLayer);
                }
            });

        } catch (err) {
            console.error("Erro no mapa:", err);
        } finally {
            loading.classList.add('hidden');
        }
    }

    // Busca Geográfica (Nominatim)
    const locationSearch = document.getElementById('map-location-search');
    const btnSearch = document.getElementById('btn-search-map');

    const doGeocodeSearch = async () => {
        const query = locationSearch.value;
        if (!query) return;

        loading.classList.remove('hidden');
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Brasil')}`);
            const data = await res.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                map.flyTo([lat, lon], 15, { animate: true, duration: 1.5 });
            } else {
                alert("Local não encontrado.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading.classList.add('hidden');
        }
    };

    btnSearch.addEventListener('click', doGeocodeSearch);
    locationSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doGeocodeSearch();
    });

    const categorySelect = document.getElementById('map-category-filter');
    categorySelect.addEventListener('change', () => {
        SearchManager.setSearch(locationSearch.value, categorySelect.value);
    });

    SearchManager.subscribe((filters) => refreshMapData(filters));

    map.locate({ setView: true, maxZoom: 14 });
    refreshMapData(SearchManager.getFilters());
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
