export async function HowItWorksScreen(container) {
    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-12 flex items-center">
            <button onclick="window.history.back()" class="mr-4 hover:text-dn-amber transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-lg font-bold tracking-[0.2em] uppercase font-dmsans">Como funciona a doação</h1>
        </div>

        <div class="max-w-4xl mx-auto p-8 md:p-16 space-y-12 mb-24 font-dmsans text-dn-green-dark">
            <header class="text-center">
                <h2 class="text-4xl font-black font-playfair mb-4">Transformando intenção em ação</h2>
                <p class="text-dn-ink-mid text-lg max-w-2xl mx-auto">O DongNate simplifica o processo de doação, conectando você diretamente com quem mais precisa de ajuda na sua região.</p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-dn-cream p-8 rounded-[2.5rem] border border-dn-green-pale flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-dn-green rounded-2xl flex items-center justify-center text-white mb-6 text-2xl font-black">1</div>
                    <h3 class="text-xl font-black font-playfair mb-3">Explore</h3>
                    <p class="text-sm text-dn-ink-mid">Navegue pelo mapa ou lista de pedidos das ONGs locais. Filtre por categorias como alimentos, roupas ou móveis.</p>
                </div>

                <div class="bg-dn-cream p-8 rounded-[2.5rem] border border-dn-green-pale flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-dn-green rounded-2xl flex items-center justify-center text-white mb-6 text-2xl font-black">2</div>
                    <h3 class="text-xl font-black font-playfair mb-3">Manifeste-se</h3>
                    <p class="text-sm text-dn-ink-mid">Viu algo que pode ajudar? Clique em "Manifestar Interesse" e envie uma breve mensagem para a ONG responsável.</p>
                </div>

                <div class="bg-dn-cream p-8 rounded-[2.5rem] border border-dn-green-pale flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-dn-green rounded-2xl flex items-center justify-center text-white mb-6 text-2xl font-black">3</div>
                    <h3 class="text-xl font-black font-playfair mb-3">Conecte-se</h3>
                    <p class="text-sm text-dn-ink-mid">Assim que a ONG aceitar sua ajuda, os dados de contato serão liberados para vocês combinarem a logística de entrega.</p>
                </div>
            </div>

            <section class="bg-dn-green-dark text-white p-10 rounded-[3rem] shadow-xl">
                <h3 class="text-2xl font-black font-playfair mb-6">Dicas para uma doação segura</h3>
                <ul class="space-y-4">
                    <li class="flex gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-dn-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm font-medium">Priorize entregar as doações diretamente na sede física da ONG.</p>
                    </li>
                    <li class="flex gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-dn-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm font-medium">Certifique-se de que os itens estão em bom estado e higienizados.</p>
                    </li>
                    <li class="flex gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-dn-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm font-medium">Use o chat interno para tirar dúvidas antes de compartilhar seu telefone pessoal.</p>
                    </li>
                </ul>
            </section>
        </div>
    `;
}
