export async function SuccessScreen(container) {
    container.innerHTML = `
        <div class="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div class="w-24 h-24 bg-dn-green-pale rounded-full flex items-center justify-center mb-8 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-dn-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h1 class="text-4xl font-black text-dn-green-dark mb-4 font-playfair">Tudo pronto!</h1>
            <p class="text-dn-ink-mid text-lg max-w-sm mb-12">
                Sua ação foi processada com sucesso. O DongNate agradece por ajudar a fortalecer nossa rede.
            </p>
            
            <a href="/" data-link class="btn-primary px-12 py-4 shadow-xl shadow-dn-green/20">VOLTAR PARA O INÍCIO</a>
        </div>
    `;
}
