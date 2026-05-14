import api from '../services/api.js';

export async function CreateRequestScreen(container) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    let ong = null;
    try {
        const ongs = await api.ongs.getAll();
        ong = ongs.find(o => o.user_id === user.id);
    } catch (e) {
        console.error("Erro ao buscar ONG", e);
    }

    if (!ong) {
        container.innerHTML = `
            <div class="p-12 text-center">
                <p class="text-dn-error font-bold">Apenas ONGs cadastradas podem criar pedidos.</p>
                <a href="/register-ong" class="btn-primary inline-block mt-4" data-link>Cadastrar ONG</a>
            </div>
        `;
        return;
    }

    const categories = ["Alimentos", "Vestuário", "Higiene", "Voluntariado", "Móveis", "Outros"];
    const urgencies = ["Baixa", "Média", "Alta", "Urgente"];
    const urgencyMap = { "Baixa": "baixa", "Média": "media", "Alta": "alta", "Urgente": "urgente" };

    let selectedCategory = "Alimentos";
    let selectedUrgency = "Média";
    let imageUrl = null;

    function render() {
        container.innerHTML = `
            <div class="bg-dn-green text-white p-6 flex items-center">
                <button onclick="window.history.back()" class="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 class="text-lg font-bold tracking-widest uppercase">Novo Pedido</h1>
            </div>

            <div class="max-w-2xl mx-auto p-6 space-y-6 mb-20">
                <div class="bg-dn-green-pale p-4 rounded-xl flex items-start gap-3 border border-dn-green/10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-dn-green mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-xs text-dn-green-dark font-medium">
                        Este pedido será publicado com a localização da sua sede: <br>
                        <span class="font-bold">${ong.full_address}</span>
                    </p>
                </div>

                <form id="request-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-dn-ink-mid mb-1">Imagem do Pedido (Opcional)</label>
                        <div class="flex items-center gap-4">
                            <div id="image-preview" class="w-24 h-24 bg-dn-green-pale rounded-2xl border-2 border-dashed border-dn-green flex items-center justify-center overflow-hidden">
                                ${imageUrl ? `<img src="${imageUrl}" class="w-full h-full object-cover">` : `
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                `}
                            </div>
                            <label class="bg-dn-green-pale text-dn-green px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-dn-green hover:text-white transition-all">
                                Upload Foto
                                <input type="file" id="request-image-upload" class="hidden" accept="image/*">
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-dn-ink-mid mb-1">Título do Pedido</label>
                        <input type="text" id="title" class="input-field" placeholder="Ex: Cestas Básicas para Comunidade" required>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-dn-ink-mid mb-1">Descrição detalhada</label>
                        <textarea id="description" class="input-field min-h-[120px]" placeholder="Descreva o que é necessário..." required></textarea>
                    </div>

                    <div>
                        <p class="block text-sm font-bold text-dn-ink-mid mb-3">Categoria:</p>
                        <div class="flex flex-wrap gap-2">
                            ${categories.map(cat => `
                                <button type="button" class="category-chip px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-dn-green border-dn-green text-white' : 'border-dn-green-pale text-dn-green hover:bg-dn-green-pale'}" data-value="${cat}">
                                    ${cat}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div id="quantity-fields" class="${selectedCategory === 'Voluntariado' ? 'hidden' : 'grid grid-cols-2 gap-4'}">
                        <div>
                            <label class="block text-sm font-bold text-dn-ink-mid mb-1">Qtd.</label>
                            <input type="number" id="quantity" class="input-field" placeholder="0">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-dn-ink-mid mb-1">Unidade</label>
                            <input type="text" id="unit" class="input-field" placeholder="Ex: kg, un">
                        </div>
                    </div>

                    <div>
                        <p class="block text-sm font-bold text-dn-ink-mid mb-3">Urgência:</p>
                        <div class="flex flex-wrap gap-2">
                            ${urgencies.map(u => `
                                <button type="button" class="urgency-chip px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${selectedUrgency === u ? (u === 'Urgente' || u === 'Alta' ? 'bg-red-600 border-red-600 text-white' : 'bg-dn-green border-dn-green text-white') : 'border-dn-green-pale text-dn-green hover:bg-dn-green-pale'}" data-value="${u}">
                                    ${u}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div id="form-error" class="text-dn-error text-sm hidden"></div>

                    <button type="submit" id="submit-btn" class="btn-secondary w-full py-4 text-sm font-black tracking-widest uppercase">
                        Publicar Pedido Real
                    </button>
                </form>
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        // Upload de Imagem
        const imageUpload = document.getElementById('request-image-upload');
        const imagePreview = document.getElementById('image-preview');

        imageUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                imagePreview.innerHTML = '<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-dn-green"></div>';
                const res = await api.media.upload('requests', file);
                imageUrl = res.url.publicUrl;
                imagePreview.innerHTML = `<img src="${imageUrl}" class="w-full h-full object-cover">`;
            } catch (err) {
                alert("Erro no upload: " + err.message);
                imagePreview.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                `;
            }
        });

        container.querySelectorAll('.category-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedCategory = btn.dataset.value;
                render();
            });
        });

        container.querySelectorAll('.urgency-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedUrgency = btn.dataset.value;
                render();
            });
        });

        const form = document.getElementById('request-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            const errorDiv = document.getElementById('form-error');

            const requestData = {
                ong_id: ong.id,
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                category: selectedCategory,
                urgency: urgencyMap[selectedUrgency] || "media",
                status: "ABERTO",
                quantity: parseInt(document.getElementById('quantity')?.value) || null,
                unit: document.getElementById('unit')?.value || null,
                delivery_location: ong.full_address,
                latitude: ong.latitude,
                longitude: ong.longitude,
                image_url: imageUrl
            };

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>';
                await api.requests.create(requestData);
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
            } catch (err) {
                errorDiv.textContent = err.message;
                errorDiv.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Publicar Pedido Real';
            }
        });
    }

    render();
}
