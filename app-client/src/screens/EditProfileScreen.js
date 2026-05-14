import api from '../services/api.js';

export async function EditProfileScreen(container) {
    const user = JSON.parse(localStorage.getItem('user'));

    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-12 flex items-center">
            <button onclick="window.history.back()" class="mr-4 hover:text-dn-amber transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-lg font-bold tracking-[0.2em] uppercase font-dmsans">Editar Perfil</h1>
        </div>

        <div class="max-w-2xl mx-auto p-8 space-y-8 mb-24">
            <!-- Foto de Perfil -->
            <div class="flex flex-col items-center gap-4 mb-8">
                <div class="relative group">
                    <div id="avatar-preview" class="w-32 h-32 bg-dn-green-pale rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                        ${user.avatar_url ? `<img src="${user.avatar_url}" class="w-full h-full object-cover">` : `
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        `}
                    </div>
                    <label for="avatar-upload" class="absolute bottom-0 right-0 bg-dn-amber text-white p-2 rounded-xl cursor-pointer shadow-lg hover:bg-dn-amber-dark transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </label>
                    <input type="file" id="avatar-upload" class="hidden" accept="image/*">
                </div>
                <p class="text-[10px] font-black text-dn-green uppercase tracking-widest">Alterar Foto</p>
            </div>

            <form id="edit-profile-form" class="space-y-6">
                <!-- Dados KYC / Analytics -->
                <div class="space-y-4">
                    <h3 class="text-dn-green font-black text-xs uppercase tracking-widest border-b border-dn-green-pale pb-2 font-dmsans">Dados de Identificação</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2 font-dmsans">Nome Completo</label>
                            <input type="text" id="edit-fullname" class="input-field" value="${user.full_name}" required>
                        </div>
                        
                        <div>
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2 font-dmsans">Data de Nascimento</label>
                            <input type="date" id="edit-birthdate" class="input-field" value="${user.birth_date || ''}" required>
                        </div>
                        
                        <div>
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2 font-dmsans">Telefone / WhatsApp</label>
                            <input type="tel" id="edit-phone" class="input-field" value="${user.phone || ''}" placeholder="(00) 00000-0000">
                        </div>

                        <div>
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2 font-dmsans">Gênero</label>
                            <select id="edit-gender" class="input-field">
                                <option value="">Selecione</option>
                                <option value="Masculino" ${user.gender === 'Masculino' ? 'selected' : ''}>Masculino</option>
                                <option value="Feminino" ${user.gender === 'Feminino' ? 'selected' : ''}>Feminino</option>
                                <option value="Outro" ${user.gender === 'Outro' ? 'selected' : ''}>Outro</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2 font-dmsans">Etnia</label>
                            <select id="edit-ethnicity" class="input-field">
                                <option value="">Selecione</option>
                                <option value="Branca" ${user.ethnicity === 'Branca' ? 'selected' : ''}>Branca</option>
                                <option value="Preta" ${user.ethnicity === 'Preta' ? 'selected' : ''}>Preta</option>
                                <option value="Parda" ${user.ethnicity === 'Parda' ? 'selected' : ''}>Parda</option>
                                <option value="Amarela" ${user.ethnicity === 'Amarela' ? 'selected' : ''}>Amarela</option>
                                <option value="Indígena" ${user.ethnicity === 'Indígena' ? 'selected' : ''}>Indígena</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Localização -->
                <div class="space-y-4">
                    <h3 class="text-dn-green font-black text-xs uppercase tracking-widest border-b border-dn-green-pale pb-2 font-dmsans">Endereço e Localização</h3>
                    
                    <div class="grid grid-cols-3 gap-4 font-dmsans">
                        <div class="col-span-1">
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2">CEP</label>
                            <input type="text" id="edit-cep" class="input-field" value="${user.cep || ''}" maxlength="9">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2">Logradouro</label>
                            <input type="text" id="edit-street" class="input-field" value="${user.street || ''}" readonly>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-4 font-dmsans">
                        <div>
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2">Número</label>
                            <input type="text" id="edit-number" class="input-field" value="${user.number || ''}">
                        </div>
                        <div class="col-span-3">
                            <label class="block text-[10px] font-black text-dn-ink-soft uppercase mb-1 ml-2">Bairro</label>
                            <input type="text" id="edit-neighborhood" class="input-field" value="${user.neighborhood || ''}" readonly>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 font-dmsans">
                        <input type="text" id="edit-city" class="input-field" value="${user.city || ''}" placeholder="Cidade" readonly>
                        <input type="text" id="edit-state" class="input-field" value="${user.state || ''}" placeholder="UF" readonly>
                    </div>
                </div>

                <div id="edit-error" class="hidden p-4 bg-red-50 text-dn-error rounded-2xl text-xs font-bold border border-red-100"></div>

                <button type="submit" id="save-profile-btn" class="btn-primary w-full py-5 mt-6 uppercase tracking-widest text-sm shadow-xl shadow-dn-green/20 font-black">
                    Confirmar Alterações Reais
                </button>
            </form>
        </div>
    `;

    let avatarUrl = user.avatar_url;

    // Lógica de Upload de Avatar
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');

    avatarUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            avatarPreview.innerHTML = '<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-dn-green"></div>';
            const res = await api.media.upload('avatars', file);
            avatarUrl = res.url.publicUrl;
            avatarPreview.innerHTML = `<img src="${avatarUrl}" class="w-full h-full object-cover">`;
        } catch (err) {
            alert("Erro ao subir imagem: " + err.message);
            renderInitialAvatar();
        }
    });

    function renderInitialAvatar() {
        avatarPreview.innerHTML = avatarUrl ? `<img src="${avatarUrl}" class="w-full h-full object-cover">` : `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        `;
    }

    // Busca de CEP
    const cepInput = document.getElementById('edit-cep');
    cepInput.addEventListener('blur', async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) return;
            document.getElementById('edit-street').value = data.logradouro;
            document.getElementById('edit-neighborhood').value = data.bairro;
            document.getElementById('edit-city').value = data.localidade;
            document.getElementById('edit-state').value = data.uf;
        } catch (e) {}
    });

    document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('save-profile-btn');
        const errorDiv = document.getElementById('edit-error');

        try {
            btn.disabled = true;
            btn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>';

            const updatedData = {
                full_name: document.getElementById('edit-fullname').value,
                phone: document.getElementById('edit-phone').value,
                birth_date: document.getElementById('edit-birthdate').value,
                gender: document.getElementById('edit-gender').value,
                ethnicity: document.getElementById('edit-ethnicity').value,
                cep: document.getElementById('edit-cep').value,
                street: document.getElementById('edit-street').value,
                number: document.getElementById('edit-number').value,
                neighborhood: document.getElementById('edit-neighborhood').value,
                city: document.getElementById('edit-city').value,
                state: document.getElementById('edit-state').value,
                avatar_url: avatarUrl
            };

            // Validação de maioridade
            const bDate = new Date(updatedData.birth_date);
            const today = new Date();
            let age = today.getFullYear() - bDate.getFullYear();
            const m = today.getMonth() - bDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) age--;
            if (age < 18) throw new Error("Você precisa ter pelo menos 18 anos.");

            await api.users.update(user.id, updatedData);

            localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
            
            window.history.pushState({}, '', '/profile');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.innerHTML = 'Confirmar Alterações Reais';
        }
    });
}
