import api from '../services/api.js';

export async function RegisterOngScreen(container) {
    const user = JSON.parse(localStorage.getItem('user'));
    let mapInstance = null;
    let markerInstance = null;
    let logoUrl = null;

    container.innerHTML = `
        <div class="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-dn-green-pale mb-20">
            <div class="text-center mb-10">
                <span class="bg-dn-green-pale text-dn-green px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-dmsans">Cadastro Institucional</span>
                <h1 class="text-4xl font-black text-dn-green-dark mt-4 mb-2 font-playfair">Perfil da Organização</h1>
                <p class="text-dn-ink-soft font-dmsans">Dados jurídicos e localização da sede para o mapa.</p>
            </div>
            
            <form id="ong-form" class="space-y-6 font-dmsans">
                <!-- Logo da ONG -->
                <div class="flex flex-col items-center gap-4 mb-8">
                    <div class="relative group">
                        <div id="logo-preview" class="w-32 h-32 bg-dn-green-pale rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <label for="logo-upload" class="absolute bottom-0 right-0 bg-dn-amber text-white p-2 rounded-xl cursor-pointer shadow-lg hover:bg-dn-amber-dark transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </label>
                        <input type="file" id="logo-upload" class="hidden" accept="image/*">
                    </div>
                    <p class="text-[10px] font-black text-dn-green uppercase tracking-widest">Logo da ONG</p>
                </div>

                <!-- Informações de Identidade Jurídica -->
                <div class="space-y-4">
                    <h3 class="text-dn-green font-black text-xs uppercase tracking-widest border-b border-dn-green-pale pb-2">Identidade da ONG</h3>
                    <input type="text" id="orgName" class="input-field" placeholder="Razão Social / Nome Fantasia" required>
                    <textarea id="description" class="input-field min-h-[100px]" placeholder="Missão e atividades da organização..." maxlength="300" required></textarea>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" id="cnpj" class="input-field" placeholder="CNPJ (00.000.000/0000-00)" required>
                        <input type="tel" id="phone" class="input-field" placeholder="Telefone / WhatsApp Comercial" required>
                    </div>
                </div>

                <!-- Localização e Mapa Real (ViaCEP) -->
                <div class="bg-dn-cream p-6 rounded-3xl border border-dn-green/5 space-y-4">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-dn-green font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Endereço da Sede
                        </h3>
                        <span id="geo-status" class="text-[9px] font-bold px-2 py-0.5 rounded bg-dn-amber/20 text-dn-amber uppercase">Aguardando CEP</span>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4">
                        <input type="text" id="cep" class="input-field" placeholder="CEP" maxlength="9" required>
                        <div class="col-span-2 flex items-center text-[10px] text-dn-ink-soft italic leading-tight">Preenchimento automático via ViaCEP.</div>
                    </div>
                    
                    <div class="grid grid-cols-4 gap-4">
                        <input type="text" id="street" class="input-field col-span-3" placeholder="Rua / Logradouro" readonly>
                        <input type="text" id="number" class="input-field" placeholder="Nº" required>
                    </div>
                    
                    <input type="text" id="complement" class="input-field" placeholder="Complemento (Opcional)">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <input type="text" id="neighborhood" class="input-field" placeholder="Bairro" readonly>
                        <div class="grid grid-cols-3 gap-2">
                            <input type="text" id="city" class="input-field col-span-2" placeholder="Cidade" readonly>
                            <input type="text" id="state" class="input-field" placeholder="UF" readonly>
                        </div>
                    </div>

                    <!-- Preview do Mapa -->
                    <div id="reg-map" class="h-56 w-full rounded-2xl bg-white/50 border border-dn-green/10 overflow-hidden relative">
                        <div id="map-placeholder" class="absolute inset-0 flex items-center justify-center text-dn-ink-soft text-[10px] p-8 text-center font-bold uppercase tracking-widest">
                            Confirme o CEP para visualizar no mapa
                        </div>
                    </div>
                </div>
                
                <div id="ong-error" class="hidden p-4 bg-red-50 text-dn-error rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span id="error-text"></span>
                </div>
                
                <button type="submit" id="submit-btn" class="btn-primary w-full py-5 text-sm uppercase tracking-[0.3em] font-black shadow-2xl shadow-dn-green/30">
                    PUBLICAR ONG NO MAPA
                </button>
            </form>
        </div>
    `;

    // Lógica de Upload de Logo
    const logoUpload = document.getElementById('logo-upload');
    const logoPreview = document.getElementById('logo-preview');

    logoUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            logoPreview.innerHTML = '<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-dn-green"></div>';
            const res = await api.media.upload('ongs', file);
            logoUrl = res.url.publicUrl;
            logoPreview.innerHTML = `<img src="${logoUrl}" class="w-full h-full object-cover">`;
        } catch (err) {
            alert("Erro no upload do logo: " + err.message);
            logoPreview.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            `;
        }
    });

    if (!window.L) {
        await Promise.all([
            new Promise(r => {
                const s = document.createElement('script');
                s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
                s.onload = r; document.head.appendChild(s);
            }),
            new Promise(r => {
                const l = document.createElement('link');
                l.rel = "stylesheet"; l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                l.onload = r; document.head.appendChild(l);
            })
        ]);
    }

    const updateMap = (lat, lng) => {
        const placeholder = document.getElementById('map-placeholder');
        if (placeholder) placeholder.style.display = 'none';
        
        if (!mapInstance) {
            mapInstance = L.map('reg-map', { zoomControl: false }).setView([lat, lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
        } else {
            mapInstance.setView([lat, lng], 16);
        }
        
        if (markerInstance) mapInstance.removeLayer(markerInstance);
        markerInstance = L.marker([lat, lng]).addTo(mapInstance);
        
        const status = document.getElementById('geo-status');
        status.textContent = "LOCALIZAÇÃO CONFIRMADA";
        status.className = "text-[9px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-600 uppercase";
    };

    const validateAddress = async () => {
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        const status = document.getElementById('geo-status');

        if (cep.length !== 8) return;
        
        status.textContent = "BUSCANDO CEP...";
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) throw new Error('CEP INVÁLIDO');

            document.getElementById('street').value = data.logradouro;
            document.getElementById('neighborhood').value = data.bairro;
            document.getElementById('city').value = data.localidade;
            document.getElementById('state').value = data.uf;

            status.textContent = "GEOCODIFICANDO...";
            const fullAddr = `${data.logradouro}, ${data.localidade}, Brasil`;
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddr)}`);
            const geoData = await geoRes.json();
            
            if (geoData.length > 0) {
                updateMap(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon));
            } else {
                status.textContent = "ERRO MAPA";
            }
        } catch (e) {
            status.textContent = "ERRO NA VALIDAÇÃO";
            status.className = "text-[9px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-600 uppercase";
        }
    };

    document.getElementById('cep').addEventListener('blur', validateAddress);

    document.getElementById('ong-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        const errorText = document.getElementById('error-text');
        const errorDiv = document.getElementById('ong-error');

        try {
            if (!markerInstance) throw new Error("Valide seu CEP e confirme a localização no mapa.");

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>';

            const pos = markerInstance.getLatLng();
            const ongData = {
                user_id: user.id,
                organization_name: document.getElementById('orgName').value,
                description: document.getElementById('description').value,
                cnpj: document.getElementById('cnpj').value,
                phone: document.getElementById('phone').value,
                cep: document.getElementById('cep').value,
                street: document.getElementById('street').value,
                number: document.getElementById('number').value,
                complement: document.getElementById('complement').value,
                neighborhood: document.getElementById('neighborhood').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                latitude: pos.lat,
                longitude: pos.lng,
                logo_url: logoUrl,
                full_address: `${document.getElementById('street').value}, ${document.getElementById('number').value} - ${document.getElementById('city').value} / ${document.getElementById('state').value}`
            };

            await api.ongs.create(ongData);
            window.history.pushState({}, '', '/success');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err) {
            errorText.textContent = err.message;
            errorDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'PUBLICAR ONG NO MAPA';
        }
    });
}
