import api from '../services/api.js';

export async function LandingPage(container) {
    // Renderiza a estrutura básica imediatamente
    container.innerHTML = `
        <div class="flex flex-col overflow-x-hidden font-dmsans bg-white selection:bg-dn-amber selection:text-white">

            <!-- Navbar Flutuante Premium -->
            <nav class="fixed top-0 left-0 right-0 z-[100] px-6 py-6 transition-all duration-500" id="landing-nav">
                <div class="max-w-6xl mx-auto flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[2rem] shadow-2xl">
                    <a href="/" data-link class="text-white font-playfair text-3xl font-black tracking-tighter hover:text-dn-amber transition-colors">DongNate</a>
                    <div class="hidden md:flex items-center gap-10">
                        <a href="/about" data-link class="text-white/70 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all">Missão</a>
                        <a href="/how-it-works" data-link class="text-white/70 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all">Como Funciona</a>
                        <div class="h-4 w-[1px] bg-white/10"></div>
                        <a href="/login" data-link class="text-white/70 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all">Entrar</a>
                        <a href="/register" data-link class="bg-dn-amber text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-dn-amber-dark hover:scale-105 transition-all shadow-xl shadow-dn-amber/20">Começar</a>
                    </div>
                </div>
            </nav>

            <!-- Hero Section Magnética -->
            <section class="relative bg-dn-green-dark text-white pt-56 pb-48 px-6 overflow-hidden">
                <div class="absolute -right-40 -top-40 w-[600px] h-[600px] bg-dn-green rounded-full opacity-20 blur-[150px] animate-float"></div>
                <div class="absolute -left-40 bottom-20 w-[500px] h-[500px] bg-dn-amber rounded-full opacity-10 blur-[150px]"></div>

                <div class="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div class="text-left space-y-10 animate-fade-in-up">
                        <div class="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full">
                            <span class="flex h-2 w-2 relative">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-dn-amber opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-dn-amber"></span>
                            </span>
                            <span class="text-[10px] font-black uppercase tracking-[0.4em] text-dn-amber-light">O Futuro da Filantropia</span>
                        </div>

                        <h1 class="text-7xl md:text-9xl font-black mb-8 leading-[0.9] font-playfair tracking-tighter">
                            Tecnologia <br>
                            <span class="text-dn-amber italic underline decoration-dn-amber/30 underline-offset-[10px]">Humana</span>.
                        </h1>

                        <p class="text-xl md:text-2xl text-dn-ink-soft max-w-lg leading-relaxed font-light italic">
                            "Aproximando quem tem recursos de quem tem propósito, através de um clique seguro."
                        </p>

                        <div class="flex flex-col sm:flex-row gap-6 pt-4">
                            <a href="/register" data-link class="group bg-white text-dn-green-dark px-12 py-7 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-dn-amber hover:text-white transition-all shadow-3xl flex items-center justify-center gap-4">
                                Iniciar Jornada
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="hidden lg:block relative">
                        <div class="relative z-20 rounded-[5rem] overflow-hidden border-[1px] border-white/20 shadow-4xl group">
                            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Impacto" class="w-full h-[700px] object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100">
                            <div class="absolute inset-0 bg-gradient-to-t from-dn-green-dark/80 to-transparent opacity-60 group-hover:opacity-20 transition-all duration-700"></div>
                        </div>
                        <!-- Stats Badge -->
                        <div class="absolute -bottom-12 -right-12 z-30 bg-dn-amber p-12 rounded-[4rem] shadow-4xl max-w-[320px] rotate-6 hover:rotate-0 transition-all duration-500 cursor-default group">
                            <p class="text-white font-playfair text-6xl font-black mb-2 group-hover:scale-110 transition-transform">100%</p>
                            <p class="text-white/90 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">Transparência em cada match de doação realizado.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Grid de Valor (USP) -->
            <section class="py-40 bg-dn-cream/30">
                <div class="max-w-6xl mx-auto px-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div class="space-y-6 animate-fade-in-up">
                            <div class="text-dn-amber font-black text-6xl font-playfair opacity-20">01</div>
                            <h3 class="text-3xl font-black text-dn-green-dark font-playfair">Match <br>Inteligente</h3>
                            <p class="text-dn-ink-mid leading-relaxed text-sm">Algoritmo de proximidade que conecta doadores a ONGs no mesmo CEP, reduzindo custos logísticos drasticamente.</p>
                        </div>
                        <div class="space-y-6 animate-fade-in-up" style="animation-delay: 0.2s">
                            <div class="text-dn-amber font-black text-6xl font-playfair opacity-20">02</div>
                            <h3 class="text-3xl font-black text-dn-green-dark font-playfair">Prova <br>Visual</h3>
                            <p class="text-dn-ink-mid leading-relaxed text-sm">Sistema de upload de fotos obrigatório para validação do estado dos itens, garantindo utilidade real para a ONG.</p>
                        </div>
                        <div class="space-y-6 animate-fade-in-up" style="animation-delay: 0.4s">
                            <div class="text-dn-amber font-black text-6xl font-playfair opacity-20">03</div>
                            <h3 class="text-3xl font-black text-dn-green-dark font-playfair">Privacidade <br>Blindada</h3>
                            <p class="text-dn-ink-mid leading-relaxed text-sm">Dados sensíveis como WhatsApp e endereço só são revelados após a confirmação mútua do interesse na plataforma.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Seção de Demanda Real -->
            <section class="py-40 bg-white px-6 relative">
                <div class="max-w-6xl mx-auto">
                    <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div class="max-w-2xl text-left">
                            <p class="text-dn-green font-black text-[10px] uppercase tracking-[0.5em] mb-6">Urgências da Rede</p>
                            <h2 class="text-5xl md:text-7xl font-black text-dn-green-dark font-playfair leading-[1.1]">Pedidos que precisam <br>de você <span class="text-dn-amber underline decoration-dn-green-pale">hoje</span>.</h2>
                        </div>
                        <a href="/register" data-link class="group flex items-center gap-4 bg-dn-green-dark text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-dn-green transition-all shadow-2xl">
                            Ver Mapa Completo
                            <span class="group-hover:translate-x-2 transition-transform">→</span>
                        </a>
                    </div>

                    <div id="latest-requests-landing" class="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <!-- Skeleton Loading -->
                        <div class="h-[450px] bg-dn-green-pale/50 animate-pulse rounded-[4rem]"></div>
                        <div class="h-[450px] bg-dn-green-pale/50 animate-pulse rounded-[4rem]"></div>
                        <div class="h-[450px] bg-dn-green-pale/50 animate-pulse rounded-[4rem]"></div>
                    </div>
                </div>
            </section>

            <!-- Seção FAQ / Curiosidades -->
            <section class="py-40 bg-dn-green-dark text-white px-6">
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-5xl font-black font-playfair mb-20 text-center">Dúvidas Frequentes</h2>
                    <div class="space-y-6">
                        ${FAQItem("O DongNate cobra alguma taxa?", "Não. Somos uma plataforma 100% gratuita para doadores e ONGs. Nosso objetivo é facilitar a conexão social.")}
                        ${FAQItem("Como sei que a ONG é real?", "Todas as organizações cadastradas passam por um processo de verificação de CNPJ e dados institucionais.")}
                        ${FAQItem("Posso doar dinheiro?", "Neste momento, focamos exclusivamente em doações de itens físicos e voluntariado, onde a transparência é mais visível.")}
                        ${FAQItem("Quem faz a entrega?", "A logística é combinada diretamente entre o doador e a ONG após o match, garantindo flexibilidade para ambas as partes.")}
                    </div>
                </div>
            </section>

            <!-- Seção Newsletter (Mock) -->
            <section class="py-32 bg-dn-amber px-6">
                <div class="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[4rem] shadow-4xl text-center space-y-10">
                    <h2 class="text-4xl md:text-6xl font-black text-dn-green-dark font-playfair">Receba histórias de impacto no seu e-mail.</h2>
                    <p class="text-dn-ink-mid text-lg max-w-xl mx-auto">Toda semana, um resumo de como a rede DongNate está transformando bairros inteiros.</p>
                    <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input type="email" placeholder="Seu melhor e-mail" class="flex-1 bg-dn-green-pale border-none rounded-full px-8 py-5 focus:ring-2 focus:ring-dn-amber text-dn-green-dark font-bold">
                        <button class="bg-dn-green-dark text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Assinar</button>
                    </div>
                </div>
            </section>

            <!-- Footer CTA -->
            <section class="py-40 px-6 bg-dn-green-dark text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
                <div class="max-w-4xl mx-auto relative z-10 space-y-12">
                    <h2 class="text-6xl md:text-8xl font-black text-white font-playfair leading-none">O próximo impacto <br>começa com <span class="text-dn-amber">você</span>.</h2>
                    <a href="/register" data-link class="inline-block bg-white text-dn-green-dark px-20 py-8 rounded-full font-black text-sm uppercase tracking-[0.4em] hover:bg-dn-amber hover:text-white hover:scale-110 transition-all shadow-4xl">
                        Criar Conta Gratuita
                    </a>
                </div>
            </section>
        </div>
    `;

    // Efeito de scroll na navbar
    window.onscroll = () => {
        const nav = document.getElementById('landing-nav');
        if (window.scrollY > 100) {
            nav.classList.remove('py-6');
            nav.classList.add('py-2');
        } else {
            nav.classList.remove('py-2');
            nav.classList.add('py-6');
        }
    };

    // Lógica para carregar os pedidos REAIS na Landing
    try {
        const requests = await api.requests.getAll();
        const latest = requests.slice(0, 3);
        const requestsContainer = document.getElementById('latest-requests-landing');

        if (latest.length > 0) {
            requestsContainer.innerHTML = latest.map((req, idx) => `
                <div class="group bg-dn-cream/40 p-10 rounded-[4rem] border border-dn-green-pale hover:bg-white hover:shadow-4xl transition-all duration-700 flex flex-col h-full animate-fade-in-up" style="animation-delay: ${idx * 0.2}s">
                    <div class="flex justify-between items-start mb-8">
                        <span class="text-[10px] font-black text-dn-amber bg-dn-amber/10 px-4 py-1.5 rounded-full uppercase tracking-widest">${req.category}</span>
                        <span class="text-[9px] font-bold text-dn-green uppercase tracking-widest">${req.urgency}</span>
                    </div>

                    <h3 class="text-3xl font-black text-dn-green-dark font-playfair mb-6 leading-tight group-hover:text-dn-green transition-colors">${req.title}</h3>
                    <p class="text-dn-ink-mid text-sm leading-relaxed mb-10 flex-1 line-clamp-4 font-light italic">"${req.description}"</p>

                    <div class="pt-8 border-t border-dn-green-pale/50 flex justify-between items-center">
                         <div class="flex -space-x-2">
                            <div class="w-8 h-8 rounded-full bg-dn-green border-2 border-white flex items-center justify-center text-[10px] text-white font-black">?</div>
                         </div>
                        <a href="/login" data-link class="bg-dn-green-dark text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-dn-amber transition-all">
                            Ajudar →
                        </a>
                    </div>
                </div>
            `).join('');
        } else {
            requestsContainer.innerHTML = `
                <div class="col-span-3 text-center py-20 bg-dn-cream rounded-[4rem] border border-dashed border-dn-green/20">
                    <p class="text-dn-ink-soft italic font-playfair text-xl">A rede está silenciosa hoje. Seja o primeiro a criar um pedido!</p>
                </div>
            `;
        }
    } catch (e) {
        console.error("Erro ao carregar pedidos na landing", e);
    }
}

function FAQItem(question, answer) {
    return `
        <div class="border-b border-white/10 pb-6 group cursor-pointer">
            <div class="flex justify-between items-center py-4">
                <h4 class="text-xl md:text-2xl font-black font-playfair group-hover:text-dn-amber transition-colors">${question}</h4>
                <span class="text-dn-amber text-2xl group-hover:rotate-90 transition-transform">+</span>
            </div>
            <p class="text-dn-ink-soft text-sm leading-relaxed max-w-2xl hidden group-hover:block animate-fade-in-up">
                ${answer}
            </p>
        </div>
    `;
}
