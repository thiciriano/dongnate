import api from '../services/api.js';

export async function RegisterScreen(container) {
    let step = 1;
    let formData = {
        role: 'doador',
        full_name: '', // Nome do Responsável ou Doador
        email: '',
        password: '',
        phone: '',
        birth_date: '',
        gender: '',
        ethnicity: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        latitude: null,
        longitude: null,
        // Dados de Instituição (ONG)
        organization_name: '',
        cnpj: ''
    };

    function render() {
        container.innerHTML = `
            <div class="max-w-xl mx-auto mt-8 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-dn-green-pale mb-20 font-dmsans">
                <div class="mb-8">
                    <div class="w-full bg-dn-green-pale h-2 rounded-full mb-8 overflow-hidden">
                        <div class="bg-dn-green h-2 rounded-full transition-all duration-500" style="width: ${(step / 4) * 100}%"></div>
                    </div>
                    ${renderStepContent()}
                </div>

                <div id="register-error" class="hidden p-4 bg-red-50 text-dn-error rounded-2xl text-xs font-bold border border-red-100 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span id="error-msg"></span>
                </div>

                <div class="flex flex-col gap-4">
                    <button id="next-btn" class="btn-primary w-full py-5 text-sm uppercase tracking-widest font-black shadow-xl shadow-dn-green/20 flex justify-center items-center gap-2 transition-all active:scale-95">
                        <span>${step < 4 ? 'PRÓXIMO PASSO' : 'FINALIZAR CADASTRO'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                    ${step > 1 ? `
                        <button id="prev-btn" class="text-dn-ink-soft font-bold py-2 text-xs uppercase tracking-widest hover:text-dn-green transition-colors">Voltar</button>
                    ` : `
                        <a href="/login" class="text-center text-dn-ink-soft font-bold py-2 text-xs uppercase tracking-widest" data-link>Já tenho uma conta</a>
                    `}
                </div>
            </div>
        `;
        bindEvents();
    }

    function renderStepContent() {
        if (step === 1) {
            return `
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-black text-dn-green-dark mb-2 font-playfair">Tipo de Perfil</h1>
                    <p class="text-dn-ink-soft text-sm font-dmsans">Como você deseja atuar no DongNate?</p>
                </div>
                <div class="grid grid-cols-1 gap-4 font-dmsans">
                    <div class="role-card p-6 rounded-3xl border-2 cursor-pointer flex items-center gap-6 transition-all ${formData.role === 'doador' ? 'border-dn-green bg-dn-green-pale/30 shadow-lg' : 'border-dn-green-pale bg-dn-cream/50'}" data-role="doador">
                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center ${formData.role === 'doador' ? 'bg-dn-green text-white' : 'bg-white text-dn-green'} shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <div>
                            <p class="font-black text-dn-green-dark text-lg uppercase tracking-tight font-playfair">Doador Individual</p>
                            <p class="text-xs text-dn-ink-mid">Pessoa física que deseja realizar doações.</p>
                        </div>
                    </div>
                    <div class="role-card p-6 rounded-3xl border-2 cursor-pointer flex items-center gap-6 transition-all ${formData.role === 'ong' ? 'border-dn-green bg-dn-green-pale/30 shadow-lg' : 'border-dn-green-pale bg-dn-cream/50'}" data-role="ong">
                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center ${formData.role === 'ong' ? 'bg-dn-green text-white' : 'bg-white text-dn-green'} shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                            <p class="font-black text-dn-green-dark text-lg uppercase tracking-tight font-playfair">ONG / Instituição</p>
                            <p class="text-xs text-dn-ink-mid">Para organizações cadastradas no CNPJ.</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (step === 2) {
            return `
                <div class="text-center mb-8 font-dmsans">
                    <h1 class="text-3xl font-black text-dn-green-dark mb-2 font-playfair">Identificação</h1>
                    <p class="text-dn-ink-soft text-sm font-dmsans">${formData.role === 'ong' ? 'Dados oficiais da instituição.' : 'Precisamos te conhecer para analytics.'}</p>
                </div>
                <div class="space-y-4 font-dmsans">
                    ${formData.role === 'ong' ? `
                        <input type="text" id="organization_name" class="input-field" placeholder="Razão Social ou Nome Fantasia" value="${formData.organization_name}" required>
                        <input type="text" id="cnpj" class="input-field" placeholder="CNPJ (Apenas números)" value="${formData.cnpj}" maxlength="14" required>
                        <div class="h-[1px] bg-dn-green-pale my-4"></div>
                    ` : ''}
                    
                    <input type="text" id="full_name" class="input-field" placeholder="${formData.role === 'ong' ? 'Nome do Responsável Legal' : 'Nome Completo'}" value="${formData.full_name}" required>
                    <input type="email" id="email" class="input-field" placeholder="E-mail de Acesso" value="${formData.email}" required>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black text-dn-green uppercase mb-1 ml-2">Data de Nascimento</label>
                            <input type="date" id="birth_date" class="input-field" value="${formData.birth_date}" required>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-dn-green uppercase mb-1 ml-2">WhatsApp</label>
                            <input type="tel" id="phone" class="input-field" placeholder="(00) 00000-0000" value="${formData.phone}" required>
                        </div>
                    </div>

                    ${formData.role === 'doador' ? `
                        <div class="grid grid-cols-2 gap-4">
                            <select id="gender" class="input-field" required>
                                <option value="">Gênero</option>
                                <option value="Masculino" ${formData.gender === 'Masculino' ? 'selected' : ''}>Masculino</option>
                                <option value="Feminino" ${formData.gender === 'Feminino' ? 'selected' : ''}>Feminino</option>
                                <option value="Outro" ${formData.gender === 'Outro' ? 'selected' : ''}>Outro</option>
                            </select>
                            <select id="ethnicity" class="input-field" required>
                                <option value="">Etnia</option>
                                <option value="Branca" ${formData.ethnicity === 'Branca' ? 'selected' : ''}>Branca</option>
                                <option value="Preta" ${formData.ethnicity === 'Preta' ? 'selected' : ''}>Preta</option>
                                <option value="Parda" ${formData.ethnicity === 'Parda' ? 'selected' : ''}>Parda</option>
                                <option value="Amarela" ${formData.ethnicity === 'Amarela' ? 'selected' : ''}>Amarela</option>
                                <option value="Indígena" ${formData.ethnicity === 'Indígena' ? 'selected' : ''}>Indígena</option>
                            </select>
                        </div>
                    ` : ''}
                </div>
            `;
        } else if (step === 3) {
            return `
                <div class="text-center mb-8 font-dmsans">
                    <h1 class="text-3xl font-black text-dn-green-dark mb-2 font-playfair">Sua Localização</h1>
                    <p class="text-dn-ink-soft text-sm font-dmsans">O CEP preenche os campos automaticamente através da integração ViaCEP.</p>
                </div>
                <div class="space-y-4 font-dmsans">
                    <div class="grid grid-cols-3 gap-4">
                        <input type="text" id="cep" class="input-field" placeholder="CEP" value="${formData.cep}" maxlength="9" required>
                        <div class="col-span-2 flex items-center"><span id="cep-status" class="text-[9px] font-bold text-dn-amber uppercase tracking-widest leading-none">Digite o CEP...</span></div>
                    </div>
                    
                    <div class="grid grid-cols-4 gap-4">
                        <input type="text" id="street" class="input-field col-span-3" placeholder="Rua / Logradouro" value="${formData.street}" readonly>
                        <input type="text" id="number" class="input-field" placeholder="Nº" value="${formData.number}" required>
                    </div>

                    <input type="text" id="complement" class="input-field" placeholder="Complemento (Ex: Apto 10, Bloco B)" value="${formData.complement}">
                    
                    <input type="text" id="neighborhood" class="input-field" placeholder="Bairro" value="${formData.neighborhood}" readonly>
                    
                    <div class="grid grid-cols-3 gap-4">
                        <input type="text" id="city" class="input-field col-span-2" placeholder="Cidade" value="${formData.city}" readonly>
                        <input type="text" id="state" class="input-field" placeholder="UF" value="${formData.state}" readonly>
                    </div>
                    
                    <div id="geo-status" class="hidden text-[9px] font-bold text-center text-green-600 uppercase tracking-widest border-2 border-green-100 p-2 rounded-xl bg-green-50">Localização vinculada ao mapa com sucesso!</div>
                </div>
            `;
        } else {
            return `
                <div class="text-center mb-8 font-dmsans">
                    <h1 class="text-3xl font-black text-dn-green-dark mb-2 font-playfair">Segurança</h1>
                    <p class="text-dn-ink-soft text-sm font-dmsans">Defina sua senha de acesso.</p>
                </div>
                <div class="space-y-4 font-dmsans">
                    <input type="password" id="password" class="input-field" placeholder="Mínimo 6 caracteres" required>
                    <p class="text-[10px] text-dn-ink-soft px-2 leading-relaxed italic uppercase font-black">Ao finalizar, você concorda com as diretrizes de transparência do DongNate.</p>
                </div>
            `;
        }
    }

    function bindEvents() {
        if (step === 1) {
            container.querySelectorAll('.role-card').forEach(card => {
                card.onclick = () => { formData.role = card.dataset.role; render(); };
            });
        }

        if (step === 3) {
            const cepInput = document.getElementById('cep');
            const cepStatus = document.getElementById('cep-status');
            const geoStatus = document.getElementById('geo-status');

            cepInput.addEventListener('blur', async () => {
                const cep = cepInput.value.replace(/\D/g, '');
                if (cep.length !== 8) return;

                cepStatus.textContent = "Buscando ViaCEP...";
                try {
                    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await res.json();
                    if (data.erro) {
                        cepStatus.textContent = "CEP Não Encontrado";
                        cepStatus.className = "text-[9px] font-bold text-dn-error uppercase tracking-widest";
                        return;
                    }

                    document.getElementById('street').value = data.logradouro;
                    document.getElementById('neighborhood').value = data.bairro;
                    document.getElementById('city').value = data.localidade;
                    document.getElementById('state').value = data.uf;

                    formData.street = data.logradouro;
                    formData.neighborhood = data.bairro;
                    formData.city = data.localidade;
                    formData.state = data.uf;
                    cepStatus.textContent = "Endereço Vinculado";
                    cepStatus.className = "text-[9px] font-bold text-green-600 uppercase tracking-widest";

                    // Geocoding Nominatim
                    const fullAddr = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brasil`;
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddr)}`);
                    const geoData = await geoRes.json();
                    if (geoData.length > 0) {
                        formData.latitude = parseFloat(geoData[0].lat);
                        formData.longitude = parseFloat(geoData[0].lon);
                        geoStatus.classList.remove('hidden');
                    }
                } catch (e) {
                    console.error("Erro ViaCEP:", e);
                }
            });
        }

        const nextBtn = document.getElementById('next-btn');
        nextBtn.onclick = async () => {
            const errorDiv = document.getElementById('register-error');
            const errorMsg = document.getElementById('error-msg');
            errorDiv.classList.add('hidden');

            if (step === 2) {
                formData.full_name = document.getElementById('full_name').value;
                formData.email = document.getElementById('email').value;
                formData.phone = document.getElementById('phone').value;
                formData.birth_date = document.getElementById('birth_date').value;

                if (formData.role === 'ong') {
                    formData.organization_name = document.getElementById('org_name').value;
                    formData.cnpj = document.getElementById('cnpj').value;
                    if (!formData.organization_name || !formData.cnpj) {
                        errorMsg.textContent = "Informe os dados institucionais.";
                        errorDiv.classList.remove('hidden');
                        return;
                    }
                } else {
                    formData.gender = document.getElementById('gender').value;
                    formData.ethnicity = document.getElementById('ethnicity').value;
                    if (!formData.gender || !formData.ethnicity) {
                        errorMsg.textContent = "Selecione gênero e etnia para analytics.";
                        errorDiv.classList.remove('hidden');
                        return;
                    }
                }

                if (!formData.full_name || !formData.email || !formData.birth_date || !formData.phone) {
                    errorMsg.textContent = "Preencha todos os campos obrigatórios.";
                    errorDiv.classList.remove('hidden');
                    return;
                }

                const birth = new Date(formData.birth_date);
                const age = new Date().getFullYear() - birth.getFullYear();
                if (age < 18) {
                    errorMsg.textContent = "Você deve ser maior de 18 anos para se cadastrar.";
                    errorDiv.classList.remove('hidden');
                    return;
                }
            }

            if (step === 3) {
                formData.cep = document.getElementById('cep').value;
                formData.number = document.getElementById('number').value;
                formData.complement = document.getElementById('complement').value;
                formData.state = document.getElementById('state').value;
                if (!formData.cep || !formData.number || !formData.city || !formData.state) {
                    errorMsg.textContent = "Valide seu CEP e informe o número do local.";
                    errorDiv.classList.remove('hidden');
                    return;
                }
            }

            if (step === 4) {
                formData.password = document.getElementById('password').value;
                if (!formData.password || formData.password.length < 6) {
                    errorMsg.textContent = "A senha deve ter pelo menos 6 caracteres.";
                    errorDiv.classList.remove('hidden');
                    return;
                }
                
                try {
                    nextBtn.disabled = true;
                    nextBtn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>';
                    
                    // Registro Auth
                    await api.auth.register(formData);
                    await api.auth.login(formData.email, formData.password);
                    
                    // Registro Institucional se for ONG
                    if (formData.role === 'ong') {
                        const user = JSON.parse(localStorage.getItem('user'));
                        await api.ongs.create({
                            user_id: user.id,
                            organization_name: formData.organization_name,
                            cnpj: formData.cnpj,
                            phone: formData.phone,
                            cep: formData.cep,
                            street: formData.street,
                            number: formData.number,
                            complement: formData.complement,
                            neighborhood: formData.neighborhood,
                            city: formData.city,
                            state: formData.state,
                            latitude: formData.latitude,
                            longitude: formData.longitude,
                            full_address: `${formData.street}, ${formData.number} - ${formData.city}/${formData.state}`
                        });
                    }
                    
                    window.history.pushState({}, '', '/success');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } catch (err) {
                    errorMsg.textContent = err.message;
                    errorDiv.classList.remove('hidden');
                    nextBtn.disabled = false;
                    nextBtn.textContent = 'FINALIZAR CADASTRO';
                }
                return;
            }
            step++;
            render();
        };

        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) prevBtn.onclick = () => { step--; render(); };
    }

    render();
}
