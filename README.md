# Dongnate

Dongnate é uma plataforma de intermediação de doações desenvolvida para conectar instituições (ONGs) que possuem necessidades específicas com doadores dispostos a ajudar. 

## 🚀 Funcionalidades

- **Gestão de Usuários**: Cadastro e login diferenciado para doadores e instituições.
- **Pedidos de Ajuda**: Instituições podem criar, editar e excluir pedidos de doação com diferentes níveis de urgência.
- **Manifestação de Interesse**: Doadores podem responder a pedidos, enviando mensagens para a instituição.
- **Sistema de Notificações**: Avisos automáticos sobre novos interessados e atualizações de status.
- **Busca Avançada**: Filtros para localizar pedidos por título ou categoria.

## 🏗️ Arquitetura e Padrões de Projeto

O projeto foi estruturado utilizando padrões de projeto clássicos para garantir a qualidade e manutenibilidade do software:

1.  **Singleton (`database.py`)**: Garante que o gerenciamento da conexão com o banco de dados SQLite seja feito por uma única instância centralizada do `DatabaseManager`.
2.  **Factory (`controller.py`)**: A `EntityFactory` centraliza a lógica de criação de entidades complexas (User, Pedido), garantindo que hashes de senha e notificações iniciais sejam processados corretamente.
3.  **Strategy (`controller.py`)**: Utilizado no sistema de busca, permitindo que o algoritmo de filtragem (`TitleSearch` ou `TypeSearch`) seja escolhido dinamicamente em tempo de execução.
4.  **Observer (`model.py`)**: Implementado através de eventos do SQLAlchemy para disparar notificações automáticas sempre que um novo registro de interesse for inserido no banco.

## 🛠️ Tecnologias Utilizadas

- **FastAPI**: Framework web moderno e assíncrono.
- **SQLAlchemy**: ORM para abstração e manipulação do banco de dados.
- **Jinja2**: Motor de templates para renderização do frontend.
- **Bcrypt & JWT**: Segurança robusta para criptografia de senhas e autenticação de sessões via cookies.

##  Como Rodar o Projeto

1. Instale as dependências necessárias:
   ```bash
   pip install -r requirements.txt
   ```
2. Inicie a aplicação:
   ```bash
   python main.py
   ```
3. O sistema estará disponível em: `http://127.0.0.1:8002`

## 📂 Organização de Arquivos

- `main.py`: Ponto de entrada e configuração do servidor.
- `model.py`: Definição do esquema do banco de dados e lógica de Observer.
- `controller.py`: Implementação das rotas, lógica de negócio e padrões Factory/Strategy.
- `database.py`: Configuração da persistência de dados e padrão Singleton.
- `view.py`: Configuração da camada de visualização (templates).