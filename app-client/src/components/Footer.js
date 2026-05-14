export function Footer() {
    return `
        <footer class="bg-dn-green-dark text-white p-8 mt-auto">
            <div class="max-w-4xl mx-auto">
                <p class="text-dn-amber-light font-bold tracking-widest text-sm mb-6 uppercase">DONGNATE</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <ul class="space-y-3">
                        <li><a href="/terms" data-link class="text-sm hover:text-dn-amber transition-all flex items-center gap-2">
                            <span class="w-1 h-1 bg-dn-amber rounded-full"></span> Termos de Responsabilidade
                        </a></li>
                        <li><a href="/privacy" data-link class="text-sm hover:text-dn-amber transition-all flex items-center gap-2">
                            <span class="w-1 h-1 bg-dn-amber rounded-full"></span> Privacidade e LGPD
                        </a></li>
                    </ul>
                    <ul class="space-y-3">
                        <li><a href="/how-it-works" data-link class="text-sm hover:text-dn-amber transition-all flex items-center gap-2">
                            <span class="w-1 h-1 bg-dn-amber rounded-full"></span> Como funciona a doação
                        </a></li>
                        <li><a href="/about" data-link class="text-sm hover:text-dn-amber transition-all flex items-center gap-2">
                            <span class="w-1 h-1 bg-dn-amber rounded-full"></span> Sobre o projeto
                        </a></li>
                    </ul>
                </div>
                
                <div class="border-t border-white/10 pt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-dn-ink-soft font-bold uppercase tracking-widest">
                        <p>© 2024 DongNate - Conectando Redes de Solidariedade</p>
                        <p>Suporte: contato@dongnate.com.br</p>
                    </div>
                </div>
            </div>
        </footer>
    `;
}
