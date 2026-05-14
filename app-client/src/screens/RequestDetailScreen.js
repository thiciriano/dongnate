import api from "../services/api.js";

// Função auxiliar para evitar XSS
function escapeHTML(str) {
  const p = document.createElement("p");
  p.textContent = str || "";
  return p.innerHTML;
}

export async function RequestDetailScreen(container, params) {
  const requestId = params.id;

  container.innerHTML = `
        <div class="flex justify-center p-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-dn-green"></div>
        </div>
    `;

  try {
    const request = await api.requests.getById(requestId);
    const ong = await api.ongs.getById(request.ong_id);
    const user = JSON.parse(localStorage.getItem("user"));

    const isOngOwner = user && user.id === ong.user_id;
    const isDonor = user && user.role === "doador";

    let interests = [];
    let alreadyInterested = false;

    // Apenas ONGs podem buscar a lista de interessados (evita 403 para doadores)
    if (user && user.role === "ong") {
      interests = await api.interests.getByRequest(requestId);
    }

    // Doadores verificam se já se interessaram consultando o próprio histórico
    if (isDonor) {
      const myInterests = await api.interests.getByUser(user.id);
      alreadyInterested = myInterests.some(
        (int) => int.request_id === parseInt(requestId),
      );
    }

    let photoUrl = null;

    container.innerHTML = `
            <div class="bg-dn-green-dark text-white p-6 md:p-8 flex items-center">
                <button onclick="window.history.back()" class="mr-4 hover:text-dn-amber transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 class="text-lg font-bold tracking-[0.2em] uppercase font-dmsans">Detalhes do Pedido</h1>
            </div>

            <div class="max-w-3xl mx-auto p-6 md:p-12 space-y-8 mb-20">
                ${
                  request.image_url
                    ? `
                    <div class="w-full h-64 md:h-96 rounded-[3rem] overflow-hidden shadow-2xl mb-8 border-8 border-white">
                        <img src="${request.image_url}" class="w-full h-full object-cover">
                    </div>
                `
                    : ""
                }

                <div class="flex gap-3">
                    <span class="bg-dn-green-pale text-dn-green px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-dmsans">
                        ${escapeHTML(request.category)}
                    </span>
                    <span class="${request.urgency === "alta" || request.urgency === "urgente" ? "bg-red-50 text-dn-error" : "bg-dn-amber/10 text-dn-amber"} px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-dmsans">
                        ${escapeHTML(request.urgency)}
                    </span>
                </div>

                <h2 class="text-4xl md:text-5xl font-black text-dn-green-dark leading-tight font-playfair">
                    ${escapeHTML(request.title)}
                </h2>

                <p class="text-dn-ink-mid text-xl leading-relaxed font-dmsans">
                    ${escapeHTML(request.description)}
                </p>

                <div class="bg-dn-cream p-6 rounded-3xl border border-dn-green-pale flex items-center gap-4">
                    <div class="w-12 h-12 bg-dn-green rounded-2xl flex items-center justify-center text-white shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-dn-green uppercase tracking-widest">Local de Entrega</p>
                        <p class="text-sm font-bold text-dn-green-dark font-dmsans">${request.delivery_location || "Consultar com a ONG"}</p>
                    </div>
                </div>

                <hr class="border-dn-green-pale">

                <div class="space-y-6">
                    <div>
                        <p class="text-dn-green font-bold text-xs tracking-[0.2em] uppercase mb-2 font-dmsans">ONG Responsável</p>
                        <h3 class="text-3xl font-black text-dn-green-dark font-playfair">${ong.organization_name}</h3>
                        <p class="text-dn-ink-soft text-sm mt-2">${ong.description || ""}</p>
                    </div>
                    
                    <div class="pt-4">
                        ${
                          isOngOwner
                            ? `
                            <div class="bg-dn-green-pale/30 p-8 rounded-[2.5rem] border border-dn-green-pale text-center">
                                <p class="text-dn-green-dark font-bold mb-4">Você é o responsável por este pedido.</p>
                                <a href="/my-requests" data-link class="btn-primary inline-block">GERENCIAR INTERESSADOS (${interests.length})</a>
                            </div>
                        `
                            : isDonor
                              ? `
                                <div id="interest-section" class="space-y-6">
                                    ${
                                      alreadyInterested
                                        ? `
                                        <div class="bg-dn-green-pale/50 border-2 border-dn-green p-6 rounded-[2rem] text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-dn-green mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p class="text-dn-green font-black uppercase tracking-widest text-sm">Interesse já manifestado</p>
                                            <p class="text-dn-ink-mid text-xs mt-1">Aguarde o contato da ONG no seu perfil.</p>
                                            <a href="/my-interests" data-link class="inline-block mt-4 text-dn-green font-bold text-xs underline">VER MINHAS AJUDAS</a>
                                        </div>
                                    `
                                        : `
                                        <div class="bg-white p-8 rounded-[2.5rem] border border-dn-green-pale shadow-sm">
                                            <h4 class="text-lg font-black text-dn-green-dark mb-4 font-playfair">Manifestar Interesse</h4>
                                            
                                            <div class="mb-6">
                                                <label class="block text-[10px] font-black text-dn-green uppercase tracking-widest mb-3">Foto do Item para Doação (Opcional)</label>
                                                <div class="flex items-center gap-4">
                                                    <div id="interest-photo-preview" class="w-20 h-20 bg-dn-green-pale rounded-2xl border-2 border-dashed border-dn-green flex items-center justify-center overflow-hidden">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <label class="bg-dn-green-pale text-dn-green px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-dn-green hover:text-white transition-all">
                                                        Subir Foto
                                                        <input type="file" id="interest-photo-upload" class="hidden" accept="image/*">
                                                    </label>
                                                </div>
                                                <p class="text-[9px] text-dn-ink-soft mt-2 italic">Dica: Fotos reais aumentam as chances da ONG aceitar sua ajuda rapidamente.</p>
                                            </div>

                                            <label class="block text-[10px] font-black text-dn-green uppercase tracking-widest mb-2 font-dmsans">Sua mensagem para a ONG:</label>
                                            <textarea id="interest-message" class="input-field min-h-[100px] mb-6 text-sm" placeholder="Ex: Olá! Tenho essas roupas para doar e moro perto."></textarea>
                                            
                                            <button id="help-btn" class="bg-dn-amber text-white font-black w-full py-4 rounded-full hover:bg-dn-amber-dark transition-all shadow-xl shadow-dn-amber/20 tracking-widest text-sm uppercase">
                                                ENVIAR PROPOSTA DE AJUDA
                                            </button>
                                        </div>
                                    `
                                    }
                                </div>
                            `
                              : `
                                <div class="bg-dn-cream/30 p-8 rounded-[2.5rem] border border-dn-green-pale text-center">
                                    <p class="text-dn-ink-soft text-sm font-medium italic">Faça login como doador para manifestar interesse neste pedido.</p>
                                </div>
                            `
                        }
                    </div>
                </div>
            </div>
        `;

    // Lógica de Upload de Foto de Interesse
    const photoUpload = document.getElementById("interest-photo-upload");
    const photoPreview = document.getElementById("interest-photo-preview");

    if (photoUpload) {
      photoUpload.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          photoPreview.innerHTML =
            '<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-dn-green"></div>';
          const res = await api.media.upload("interests", file);
          photoUrl = res.url.publicUrl;
          photoPreview.innerHTML = `<img src="${photoUrl}" class="w-full h-full object-cover">`;
        } catch (err) {
          alert("Erro no upload: " + err.message);
          photoPreview.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                `;
        }
      });
    }

    const helpBtn = document.getElementById("help-btn");
    if (helpBtn) {
      helpBtn.addEventListener("click", async () => {
        const message = document.getElementById("interest-message").value;
        try {
          helpBtn.disabled = true;
          helpBtn.innerHTML =
            '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>';

          await api.interests.create({
            request_id: request.id,
            user_id: user.id,
            message: message || "Tenho interesse em ajudar com este pedido!",
            photo_url: photoUrl,
          });

          window.history.pushState({}, "", "/success");
          window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (err) {
          alert("Erro ao manifestar interesse: " + err.message);
          helpBtn.disabled = false;
          helpBtn.textContent = "ENVIAR PROPOSTA DE AJUDA";
        }
      });
    }
  } catch (err) {
    container.innerHTML = `
            <div class="text-center p-12">
                <p class="text-dn-error font-bold mb-4">${err.message}</p>
                <button onclick="window.history.back()" class="btn-primary">Voltar</button>
            </div>
        `;
  }
}
