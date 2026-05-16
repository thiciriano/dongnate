# Documentação do Frontend - DongNate

O frontend do DongNate utiliza uma abordagem baseada em templates do lado do servidor (Server-Side Rendering) para garantir rapidez e simplicidade.

## Arquivos e Configurações

### 1. `/workspaces/dongnate/view.py`
Este arquivo é responsável pela configuração da camada de visualização.

- **`templates` (Variável/Instância)**: Configura o `Jinja2Templates` apontando para a pasta de templates.
  - **Por que faz**: Permite que o FastAPI renderize arquivos HTML dinâmicos, injetando dados do backend diretamente nas páginas.

### 2. `/workspaces/dongnate/templates/` (Diretório)
Embora os arquivos HTML não estejam detalhados no código fonte fornecido, eles são referenciados no controller:
- **`login.html`**: Interface de autenticação.
- **`register.html`**: Formulário de cadastro para Doadores e Instituições.
- **`feed.html`**: Painel principal onde os pedidos de doação são listados e filtrados.
- **`profile.html`**: Dashboard do usuário para gerenciar seus próprios pedidos, interesses e notificações.
- **`edit_pedido.html`**: Interface para modificação de pedidos existentes.

## Integração com o Backend
O frontend comunica-se com o backend através de formulários HTML (`POST`) e links (`GET`).

- **Jinja2 Syntax**: Utilizado para lógica de exibição, como o `unread_count` para mostrar notificações não lidas e loops para listar `pedidos`.
- **Cookies**: O frontend armazena o `access_token` (JWT) enviado pelo backend para manter a sessão do usuário ativa.
- **Redirects (303)**: O sistema utiliza redirecionamentos constantes para atualizar a interface após ações do usuário (como criar um pedido ou deletar uma conta).

## Termos e Siglas

- **SSR (Server-Side Rendering)**: Renderização do lado do servidor. O HTML é gerado no servidor e enviado pronto para o navegador.
- **Jinja2**: Motor de templates para Python que permite inserir lógica (loops, condicionais) dentro do HTML.
- **JWT (JSON Web Token)**: Método padrão para representar reivindicações de segurança entre duas partes. Usado aqui para manter o usuário logado.
- **Status 303 (See Other)**: Código HTTP usado para redirecionar o usuário para uma nova URL após uma operação de POST (evita reenvio de formulários ao atualizar a página).
- **DOM (Document Object Model)**: A estrutura de objetos que o navegador cria a partir do HTML.

---