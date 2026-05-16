import pytest

def test_get_login_page(client):
    response = client.get("/login")
    assert response.status_code == 200
    assert "Bem-vindo de volta" in response.text

def test_register_and_login_flow(client):
    # Simulando o fluxo completo: primeiro o registro e depois a autenticação
    reg_data = {
        "nome": "Doador Teste",
        "email": "doador@teste.com",
        "senha": "password123",
        "tipo": "doador",
        "whatsapp": "11999998888",
        "telefone": "1144445555"
    }
    response = client.post("/register", data=reg_data, follow_redirects=False)
    assert response.status_code == 303 
    
    # 2. Fazer Login
    login_data = {
        "email": "doador@teste.com",
        "senha": "password123"
    }
    response = client.post("/login", data=login_data, follow_redirects=False)
    assert response.status_code == 303
    assert response.headers["location"] == "/feed"
    assert "access_token" in response.cookies

def test_access_feed_unauthorized(client):
    # Validando se o middleware de segurança redireciona usuários não logados
    response = client.get("/feed", follow_redirects=False)
    assert response.status_code == 303
    assert response.headers["location"] == "/login"

def test_create_pedido_as_instituicao(client):
    # Testando se apenas usuários do tipo 'instituicao' conseguem criar novos pedidos
    client.post("/register", data={"nome": "ONG", "email": "ong@teste.com", "senha": "123", "tipo": "instituicao", "whatsapp": "11977776666", "telefone": "1144445555"})
    
    client.post("/login", data={"email": "ong@teste.com", "senha": "123"})
    
    # Criando o pedido e verificando se ele aparece no feed depois
    pedido_data = {
        "titulo": "Cestas de Alimentos",
        "descricao": "Precisamos de 10 cestas",
        "tipo": "Alimentos"
    }
    # Verificamos se redireciona após criar
    response = client.post("/pedidos", data=pedido_data, follow_redirects=False)
    assert response.status_code == 303
    
    # 3. Verificar se aparece no Feed (seguindo redirecionamento agora)
    feed_res = client.get("/feed")
    assert "Cestas de Alimentos" in feed_res.text
