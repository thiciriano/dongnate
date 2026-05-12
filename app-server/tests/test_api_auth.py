import unittest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app
from app.services.supabase_service import get_supabase_service, SupabaseService

class TestAuthAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        # Criamos um Mock para o SupabaseService
        self.mock_service = AsyncMock(spec=SupabaseService)
        
        # Função para substituir a dependência real
        async def get_mock_supabase_service():
            return self.mock_service
            
        # Aplicamos o override no FastAPI
        app.dependency_overrides[get_supabase_service] = get_mock_supabase_service

    def tearDown(self):
        # Limpa os overrides após cada teste
        app.dependency_overrides = {}

    def test_register_endpoint_success(self):
        """Testa o endpoint de registro usando injeção de dependência mockada"""
        # Configuramos o comportamento do mock
        self.mock_service.register_user_with_sync.return_value = {
            "id": "user-uuid-123",
            "full_name": "Doador Teste",
            "email": "teste@dongnate.com",
            "role": "doador",
            "created_at": "2023-10-27T10:00:00"
        }

        payload = {
            "full_name": "Doador Teste",
            "email": "teste@dongnate.com",
            "password": "strongpassword",
            "role": "doador",
            "birth_date": "1990-01-01",
            "phone": "11999999999"
        }

        response = self.client.post("/v1/auth/register", json=payload)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], "user-uuid-123")
        # Verifica se o método do serviço foi chamado corretamente
        self.mock_service.register_user_with_sync.assert_called_once()

    def test_login_endpoint_fail(self):
        """Testa falha de login com erro simulado no serviço"""
        self.mock_service.sign_in.side_effect = Exception("Invalid credentials")

        payload = {
            "email": "errado@teste.com",
            "password": "123"
        }

        response = self.client.post("/v1/auth/login", json=payload)
        
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["detail"], "E-mail ou senha inválidos.")

if __name__ == '__main__':
    unittest.main()
