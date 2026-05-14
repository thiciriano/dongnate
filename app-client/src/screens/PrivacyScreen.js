export async function PrivacyScreen(container) {
    container.innerHTML = `
        <div class="bg-dn-green-dark text-white p-8 md:p-12 flex items-center">
            <button onclick="window.history.back()" class="mr-4 hover:text-dn-amber transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-lg font-bold tracking-[0.2em] uppercase font-dmsans">Privacidade e LGPD</h1>
        </div>

        <div class="max-w-4xl mx-auto p-8 md:p-16 space-y-12 mb-24 font-dmsans text-dn-green-dark">
            <header>
                <p class="text-dn-ink-soft text-xs font-bold uppercase tracking-widest mb-2">Conformidade com a Lei nº 13.709/2018</p>
                <h2 class="text-4xl font-black font-playfair leading-tight">Política de Privacidade</h2>
            </header>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">1. Compromisso com a Transparência</h3>
                <p class="text-dn-ink-mid leading-relaxed text-justify">
                    A DongNate valoriza a privacidade de seus usuários. Esta política descreve como coletamos, utilizamos e protegemos seus dados pessoais em total conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
                </p>
            </section>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">2. Dados Coletados e Finalidade</h3>
                <p class="text-dn-ink-mid leading-relaxed text-justify">
                    Coletamos apenas os dados estritamente necessários para a operação da plataforma:
                </p>
                <ul class="list-disc pl-5 space-y-2 text-dn-ink-mid">
                    <li><strong>Dados Identificadores:</strong> Nome completo e CPF/CNPJ para validação de segurança.</li>
                    <li><strong>Dados de Contato:</strong> E-mail e WhatsApp para viabilizar a comunicação entre doador e receptor.</li>
                    <li><strong>Geolocalização:</strong> Utilizada para mapear pedidos de ajuda próximos ao usuário, otimizando a logística de doação.</li>
                </ul>
            </section>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">3. Compartilhamento de Dados</h3>
                <p class="text-dn-ink-mid leading-relaxed text-justify">
                    Em respeito ao princípio da necessidade, seus dados de contato (WhatsApp) <strong>não são públicos</strong>. Eles só são revelados à outra parte interessada (ONG ou Doador) após o aceite formal de uma proposta de ajuda dentro da plataforma.
                </p>
            </section>

            <section class="space-y-4">
                <h3 class="text-xl font-black uppercase tracking-tight border-b-2 border-dn-amber inline-block pb-1">4. Direitos do Titular</h3>
                <p class="text-dn-ink-mid leading-relaxed text-justify">
                    Conforme o Artigo 18 da LGPD, você possui o direito de:
                </p>
                <ul class="list-disc pl-5 space-y-2 text-dn-ink-mid">
                    <li>Confirmar a existência de tratamento de seus dados;</li>
                    <li>Acessar, corrigir ou anonimizar dados incompletos;</li>
                    <li>Solicitar a exclusão definitiva de sua conta e dados (que será processada em até 30 dias).</li>
                </ul>
            </section>

            <div class="bg-dn-green-pale/30 p-8 rounded-[2.5rem] border border-dn-green-pale">
                <p class="text-sm text-dn-green-dark leading-relaxed font-bold">
                    Segurança: Utilizamos criptografia de ponta a ponta em nossa infraestrutura via Supabase Auth para garantir que suas credenciais permaneçam invioláveis.
                </p>
            </div>
        </div>
    `;
}
