# Documentação do Backend - DongNate

O backend é o motor do DongNate, construído com FastAPI e seguindo padrões de projeto para garantir escalabilidade.

## Arquivos e Lógica de Negócio

### 1. `/workspaces/dongnate/main.py`
Ponto de entrada da aplicação.
- **`app = FastAPI()`**: Instancia o framework.
- **`Base.metadata.create_all`**: Garante a criação das tabelas no banco ao iniciar.
- **`app.include_router(router)`**: Acopla todas as rotas definidas no controller.

### 2. `/workspaces/dongnate/controller.py`
Contém a lógica de controle e regras de negócio.

#### Funções de Segurança e Utilidade:
- **`hash_senha(s)`**: Utiliza `bcrypt` para transformar senhas em hashes. **Por que**: Segurança de dados sensíveis.
- **`verificar_senha(p, h)`**: Compara a senha digitada com o hash.
- **`criar_token(uid)`**: Gera um JWT com validade de 24h. **Por que**: Autenticação stateless.
- **`pegar_user(request, db)`**: Extrai o ID do usuário do cookie JWT e busca no banco.

#### Classes e Padrões:
- **`EntityFactory`**: 
  - `create_user`: Cria usuários já tratando o hash da senha.
  - `create_pedido`: Cria pedidos e gera uma notificação automática de sucesso.
  - **Por que**: Centraliza a criação de objetos complexos.
- **`SearchStrategy` (Interface), `TitleSearch`, `TypeSearch`**:
  - Implementam a lógica de filtragem de pedidos.
  - **Por que**: Permite alternar entre busca por título ou categoria sem mudar o código do feed (Padrão Strategy).

#### Rotas Principais (Endpoints):
- **`feed`**: Gerencia a visualização de pedidos abertos com suporte a filtros.
- **`login`/`register`**: Processam a entrada e criação de novos usuários.
- **`criar_pedido`**: Permite que instituições publiquem necessidades.
- **`ajudar`**: Registra o interesse de um doador em um pedido.
- **`confirmar`**: Finaliza o ciclo de doação (Instituição aceita a ajuda).
- **`mark_read`**: Atualiza o status de notificações via `PATCH`.

### 3. `/workspaces/dongnate/model.py` (Lógica)
- **`auto_notificar_interesse`**: Função decorada com `@event.listens_for`.
  - **O que faz**: Sempre que um novo `Interesse` é inserido, ela cria automaticamente uma `Notificacao` para o dono do pedido.
  - **Por que faz**: Implementa o padrão **Observer**, desacoplando a criação do interesse do envio da notificação.

## Termos e Siglas

- **API (Application Programming Interface)**: Conjunto de regras que permite que o frontend se comunique com o servidor.
- **FastAPI**: Framework web moderno e de alto desempenho para construir APIs com Python.
- **Endpoint**: Uma URL específica em uma API onde os recursos podem ser acessados (ex: `/feed`).
- **Hashing (Bcrypt)**: Processo de transformar uma senha em uma string irreversível por segurança.
- **Payload**: A carga de dados útil enviada em uma requisição ou contida dentro de um token JWT.
- **Stateless**: Arquitetura onde o servidor não armazena o estado da sessão; cada requisição deve conter toda a informação necessária (como o token).
- **Route (Rota)**: O caminho definido no controller que mapeia uma URL a uma função específica.
- **Middleware**: Código que executa entre a requisição do usuário e a resposta do servidor (como a verificação de cookies).

---