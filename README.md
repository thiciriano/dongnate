# DongNate 🚀

Plataforma para conexão entre ONGs e voluntários.

## 🛠️ Como rodar o projeto

### Pré-requisitos
- Python 3.10+
- Node.js & npm

### Configuração Inicial

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/dongnate-site.git
   cd dongnate-site
   ```

2. **Configurar o Backend (FastAPI):**
   - Entre na pasta `app-server`.
   - Copie o arquivo `.env.example` para `.env`.
   - Preencha as chaves `SUPABASE_URL` e `SUPABASE_KEY` com suas credenciais do Supabase.
   - Instale as dependências:
     ```bash
     pip install -r requirements.txt
     ```

3. **Configurar o Frontend (Vite):**
   - Entre na pasta `app-client`.
   - Instale as dependências:
     ```bash
     npm install
     ```

### Executando o Sistema
Na raiz do projeto, existe um script unificado para rodar ambos os serviços simultaneamente:

```bash
python run.py
```
O backend rodará em `http://localhost:8000` e o frontend em `http://localhost:5173`.

## 📦 Estrutura do Projeto
- `app-server/`: API construída com FastAPI.
- `app-client/`: Interface construída com React/Vite e Tailwind CSS.
- `run.py`: Script de orquestração para desenvolvimento local.
