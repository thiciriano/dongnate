# Documentação de Banco de Dados - DongNate

O sistema utiliza SQLite para persistência, gerenciado pelo SQLAlchemy (ORM).

## Arquitetura de Conexão

### 1. `/workspaces/dongnate/database.py`
- **`DatabaseManager` (Classe)**:
  - Implementa o padrão **Singleton** através do método `__new__`.
  - **Por que faz**: Garante que o `engine` do SQLAlchemy e o `sessionmaker` sejam criados apenas uma vez, economizando recursos e evitando conflitos de conexão no SQLite.
- **`get_db()` (Generator)**:
  - Fornece uma sessão de banco de dados para as rotas e garante que ela seja fechada após o uso (`finally: db.close()`).

## Esquema de Dados (Modelos)

### 2. `/workspaces/dongnate/model.py`
Define as tabelas e relacionamentos:

#### **Classe `User` (Tabela `usuarios`)**
- Armazena `nome`, `email`, `senha` (hash), `whatsapp`, `telefone` e `tipo` (doador/instituicao).
- Possui relacionamentos `cascade="all, delete-orphan"` para apagar pedidos e interesses se o usuário for excluído.

#### **Classe `Pedido` (Tabela `pedidos`)**
- Registra a necessidade da ONG. 
- Campos: `titulo`, `descricao`, `tipo`, `status` (aberto/finalizado) e `urgencia`.
- Ligado a um `User` (instituição).

#### **Classe `Interesse` (Tabela `interesses`)**
- Tabela de ligação entre Doadores e Pedidos.
- Contém a `mensagem` enviada pelo doador.
- **Por que faz**: Permite que o sistema saiba quem quer ajudar em qual pedido.

#### **Classe `Notificacao` (Tabela `notificacoes`)**
- Sistema de avisos internos.
- Campos: `titulo`, `mensagem`, `lida` (Boolean).
- **Por que faz**: Mantém o usuário informado sobre o status de suas interações sem precisar atualizar a página manualmente.

---
*Nota: O banco de dados é inicializado automaticamente via `main.py` utilizando o arquivo `dongnate.db` (padrão).*

## Termos e Siglas

- **ORM (Object-Relational Mapping)**: Técnica que permite interagir com o banco de dados usando objetos da linguagem de programação (Python) em vez de SQL puro.
- **SQLAlchemy**: O ORM padrão da indústria para Python utilizado neste projeto.
- **SQLite**: Banco de dados relacional leve que armazena os dados em um arquivo local, ideal para desenvolvimento.
- **PK (Primary Key)**: Chave Primária. Identificador único de um registro em uma tabela.
- **FK (Foreign Key)**: Chave Estrangeira. Um campo que aponta para a PK de outra tabela, criando um relacionamento.
- **Singleton**: Padrão de projeto que garante que uma classe tenha apenas uma instância em toda a aplicação.

---