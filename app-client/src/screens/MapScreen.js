import api from "../services/api.js";
import SearchManager from "../services/SearchManager.js";
import { MarkerFactory } from "../services/MarkerFactory.js";
import RequestService from "../services/RequestService.js";
import { SearchRequestsStrategy } from "../services/requestStrategies.js";

export async function MapScreen(container) {
  SearchManager.clearObservers();
  let allOngs = [];
  let allRequests = [];

  const categories = [
    "Todos",
    "Alimentos",
    "Vestuário",
    "Higiene",
    "Voluntariado",
    "Móveis",
    "Outros",
  ];

  container.innerHTML = `
        <div class="h-[calc(100vh-140px)] w-full relative">
            <!-- Barra de Busca Avançada -->
            <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-2xl flex flex-col gap-2">
                <div class="bg-white p-2 rounded-2xl shadow-2xl flex gap-2 border border-dn-green/10">
                    <div class="flex-1 flex items-center bg-dn-cream/50 rounded-xl px-3 border border-dn-green-pale">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" id="map-location-search" placeholder="Buscar endereço ou item (ex: fraldas, móveis)..." 
                               class="w-full border-none focus:ring-0 text-sm p-2 bg-transparent" />
                    </div>
                    <select id="map-category-filter" class="text-xs border-none focus:ring-0 bg-dn-green-pale rounded-xl font-bold text-dn-green px-3">
                        ${categories.map((c) => `<option value="${c}">${c}</option>`).join("")}
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
    await new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  const map = L.map("map", { zoomControl: false }).setView(
    [-23.5505, -46.6333],
    13,
  );
  L.control.zoom({ position: "bottomleft" }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const markerLayer = L.featureGroup().addTo(map);
  const userLayer = L.layerGroup().addTo(map);
  const loading = document.getElementById("map-loading");
  const categorySelect = document.getElementById("map-category-filter");

  const userIcon = L.divIcon({
    className: "user-marker",
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
    iconSize: [16, 16],
  });

  map.on("locationfound", (e) => {
    userLayer.clearLayers();
    L.marker(e.latlng, { icon: userIcon })
      .addTo(userLayer)
      .bindPopup("<b>Você está aqui</b>");
    L.circle(e.latlng, e.accuracy, {
      color: "#3b82f6",
      weight: 1,
      fillOpacity: 0.1,
    }).addTo(userLayer);
  });

  document.getElementById("locate-me-btn").addEventListener("click", () => {
    map.locate({ setView: true, maxZoom: 16 });
  });

  async function applyFilters() {
    markerLayer.clearLayers();
    const currentFilters = SearchManager.getFilters();
    const lowerCaseQuery = currentFilters.query.toLowerCase().trim();

    // 1. Nível de Busca de Itens: Filtrar Pedidos usando a Strategy do sistema
    const strategy = new SearchRequestsStrategy(currentFilters.query, currentFilters.category);
    // Mockamos o apiClient para usar os dados já carregados localmente, respeitando a arquitetura
    const mockApiClient = { requests: { getAll: async () => allRequests } };
    const filteredRequests = await strategy.fetchRequests(mockApiClient);

    // 2. Determinar quais ONGs devem ser exibidas
    const ongsToDisplayIds = new Set();

    // ONGs que correspondem diretamente ao termo de busca (nome ou descrição)
    allOngs.forEach((ong) => {
      if (
        !lowerCaseQuery ||
        ong.organization_name.toLowerCase().includes(lowerCaseQuery) ||
        (ong.description &&
          ong.description.toLowerCase().includes(lowerCaseQuery))
      ) {
        ongsToDisplayIds.add(ong.id);
      }
    });

    // ONGs que possuem pedidos que passaram pelo filtro
    filteredRequests.forEach((req) => {
      if (req.ong_id) {
        ongsToDisplayIds.add(req.ong_id);
      }
    });

    // 3. Renderizar marcadores para as ONGs filtradas
      allOngs
        .filter((ong) => ongsToDisplayIds.has(ong.id))
        .forEach((ong) => {
          if (ong.latitude && ong.longitude) {
            const markerData = MarkerFactory.createMarker("ONG", ong);
            L.circleMarker([markerData.lat, markerData.lng], {
              radius: 10,
              fillColor: markerData.color,
              color: "#fff",
              weight: 3,
              opacity: 1,
              fillOpacity: 1,
            })
              .bindPopup(markerData.popupHtml)
              .addTo(markerLayer);
          }
        });

    // 4. Renderizar marcadores para os Pedidos filtrados
      filteredRequests.forEach((req) => {
        if (req.latitude && req.longitude) {
          const markerData = MarkerFactory.createMarker("REQUEST", req);
          L.marker([markerData.lat, markerData.lng])
            .bindPopup(markerData.popupHtml)
            .addTo(markerLayer);
        }
      });
  }

  async function refreshMapData() {
    loading.classList.remove("hidden");
    try {
      const [ongs, requests] = await Promise.all([
        api.ongs.getAll(),
        api.requests.getAll(),
      ]);
      allOngs = ongs;
      allRequests = requests;
      applyFilters();
    } finally {
      loading.classList.add("hidden");
    }
  }

  // Busca Geográfica (Nominatim)
  const locationSearch = document.getElementById("map-location-search");
  const btnSearch = document.getElementById("btn-search-map");

  const handleMapSearch = async () => {
    const query = locationSearch.value.trim();
    if (!query) return;

    // Nível 1: Busca de Itens (Filtro Reativo)
    // Atualiza o SearchManager, que por sua vez dispara o applyFilters (Strategy)
    SearchManager.setSearch(query, categorySelect.value);

    // Nível 2: Busca Geográfica (Apenas se parecer um endereço/CEP)
    // Isso evita que termos de busca de itens desloquem o mapa aleatoriamente
    const isAddressQuery = /\d/.test(query) || query.includes(',') || /^\d{5}-?\d{3}$/.test(query);
    if (!isAddressQuery) return;

    loading.classList.remove("hidden");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Brasil")}`,
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([lat, lon], 15, { animate: true, duration: 1.5 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.classList.add("hidden");
    }
  };

  // Torna a busca no mapa reativa ao digitar (Busca Real)
  locationSearch.addEventListener(
    "input",
    debounce((e) => {
      SearchManager.setSearch(e.target.value, categorySelect.value);
    }, 500),
  );

  btnSearch.addEventListener("click", handleMapSearch);
  locationSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleMapSearch();
  });

  categorySelect.addEventListener("change", () => {
    SearchManager.setSearch(locationSearch.value, categorySelect.value);
  });

  SearchManager.subscribe(() => applyFilters());

  map.locate({ setView: true, maxZoom: 14 });
  refreshMapData();
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
