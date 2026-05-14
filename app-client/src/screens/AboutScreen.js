export async function AboutScreen(container) {
    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-12 flex items-center">
            <button onclick="window.history.back()" class="mr-4 hover:text-dn-amber transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-lg font-bold tracking-[0.2em] uppercase font-dmsans">Sobre o Projeto</h1>
        </div>

        <div class="max-w-4xl mx-auto p-8 md:p-16 space-y-12 mb-24 font-dmsans text-dn-green-dark">
            <div class="flex flex-col md:flex-row gap-12 items-center">
                <div class="flex-1 space-y-6">
                    <h2 class="text-4xl font-black font-playfair leading-tight">Conectando quem quer ajudar com quem sabe como.</h2>
                    <p class="text-dn-ink-mid leading-relaxed text-justify">
                        O <strong>DongNate</strong> nasceu da percepção de que muitas vezes a vontade de ajudar esbarra na falta de informação sobre o que é necessário e para onde levar. Ao mesmo tempo, ONGs gastam recursos preciosos tentando comunicar suas demandas urgentes.
                    </p>
                    <p class="text-dn-ink-mid leading-relaxed text-justify">
                        Nossa missão é usar a tecnologia para criar uma <strong>Rede de Apoio Inteligente</strong>, onde a logística da solidariedade seja tão eficiente quanto o sentimento que a motiva.
                    </p>
                </div>
                <div class="w-full md:w-1/3 bg-dn-green-pale rounded-[3rem] p-8 text-center aspect-square flex flex-col justify-center border-4 border-white shadow-xl">
                    <p class="text-5xl font-black text-dn-green mb-2">+100</p>
                    <p class="text-xs font-bold uppercase tracking-widest text-dn-green-dark">ONGs em potencial na rede</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                <div class="space-y-4">
                    <h3 class="text-xl font-black font-playfair">Nossa Visão</h3>
                    <p class="text-sm text-dn-ink-mid leading-relaxed">Ser a principal ponte tecnológica para o Terceiro Setor no Brasil, garantindo que nenhum pedido de ajuda fique sem resposta por falta de visibilidade.</p>
                </div>
                <div class="space-y-4">
                    <h3 class="text-xl font-black font-playfair">Nossos Valores</h3>
                    <p class="text-sm text-dn-ink-mid leading-relaxed">Transparência absoluta, Segurança de dados (LGPD), Eficiência logística e Respeito à dignidade humana de quem doa e de quem recebe.</p>
                </div>
            </div>

            <div class="border-t border-dn-green-pale pt-12 text-center">
                <h3 class="text-2xl font-black font-playfair mb-8">Tecnologia com Propósito</h3>
                <div class="flex flex-wrap justify-center gap-6 opacity-50 grayscale">
                    <span class="text-xs font-bold uppercase tracking-widest">JavaScript</span>
                    <span class="text-xs font-bold uppercase tracking-widest">FastAPI</span>
                    <span class="text-xs font-bold uppercase tracking-widest">Supabase</span>
                    <span class="text-xs font-bold uppercase tracking-widest">Tailwind CSS</span>
                </div>
            </div>
        </div>
    `;
}
