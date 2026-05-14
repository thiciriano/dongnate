export async function TermsScreen(container) {
    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-12 flex items-center">
            <button onclick="window.history.back()" class="mr-4 hover:text-dn-amber transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-lg font-bold tracking-[0.2em] uppercase font-dmsans">Termos de Responsabilidade</h1>
        </div>

        <div class="max-w-4xl mx-auto p-8 md:p-16 space-y-12 mb-24 font-dmsans text-dn-green-dark">
            <header>
                <p class="text-dn-ink-soft text-xs font-bold uppercase tracking-widest mb-2">Última atualização: Outubro de 2024</p>
                <h2 class="text-4xl font-black font-playfair leading-tight">Termos e Condições de Uso</h2>
            </header>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">1. Objeto e Natureza do Serviço</h3>
                <p class="text-dn-ink-mid leading-relaxed text-justify">
                    A plataforma DongNate atua exclusivamente como um facilitador tecnológico de aproximação entre doadores (pessoas físicas ou jurídicas) e Organizações Não Governamentais (ONGs). Nos termos do <strong>Código Civil Brasileiro (Lei nº 10.406/2002)</strong>, a plataforma não se caracteriza como parte nos contratos de doação, agindo apenas como suporte de comunicação.
                </p>
            </section>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">2. Responsabilidade sobre os Itens</h3>
                <p class="text-dn-ink-mid leading-relaxed text-justify">
                    O <strong>Doador</strong> declara ser o legítimo proprietário dos bens ofertados e garante que estes se encontram em condições adequadas de uso, higiene e segurança. A <strong>ONG</strong>, ao aceitar a doação, assume a responsabilidade pela conferência técnica dos itens no ato do recebimento. A DongNate exime-se de qualquer responsabilidade por vícios ocultos, danos ou inadequação dos itens doados.
                </p>
            </section>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">3. Conduta e Proibições</h3>
                <p class="text-dn-ink-mid leading-relaxed">É expressamente proibido através da plataforma:</p>
                <ul class="list-disc pl-5 space-y-2 text-dn-ink-mid">
                    <li>Solicitação ou oferta de valores em espécie (moeda corrente);</li>
                    <li>Doação de itens ilícitos, perigosos, armas ou medicamentos controlados sem prescrição/autorização legal;</li>
                    <li>Uso de linguagem abusiva ou discriminatória em chats e descrições.</li>
                </ul>
            </section>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">4. Logística e Entrega</h3>
                <p class="text-dn-ink-mid leading-relaxed text-justify">
                    Salvo acordo prévio entre as partes, o transporte dos itens é de responsabilidade negociada entre Doador e ONG. Recomendamos que encontros físicos ocorram em locais públicos e seguros, ou nas sedes oficiais das organizações cadastradas.
                </p>
            </section>

            <div class="bg-dn-cream p-8 rounded-[2.5rem] border border-dn-green-pale">
                <p class="text-xs text-dn-ink-soft leading-relaxed italic">
                    Ao utilizar o DongNate, o usuário declara ter lido e compreendido os termos aqui expostos, aceitando as diretrizes de convivência e responsabilidade civil da plataforma.
                </p>
            </div>
        </div>
    `;
}
