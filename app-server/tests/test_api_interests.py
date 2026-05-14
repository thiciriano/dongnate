import unittest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app
from app.services.supabase_service import get_supabase_service, SupabaseService

class TestInterestsAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.mock_service = AsyncMock(spec=SupabaseService)
        
        # Configura a estrutura aninhada para o auth
        self.mock_service.client = MagicMock()
        self.mock_service.client.auth = AsyncMock()
        
        async def get_mock_service():
            return self.mock_service
            
        app.dependency_overrides[get_supabase_service] = get_mock_service

    def tearDown(self):
        app.dependency_overrides = {}

    def _setup_mock_user(self, user_id="user-123", role="doador"):
        """Auxiliar para configurar o mock de usuário autenticado"""
        mock_auth_res = MagicMock()
        mock_auth_res.user.id = user_id
        self.mock_service.client.auth.get_user.return_value = mock_auth_res
        
        mock_user_data = MagicMock()
        mock_user_data.data = [{"id": user_id, "role": role}]
        self.mock_service.select.return_value = mock_user_data

    def test_create_interest_success(self):
        """Testa se um doador pode manifestar interesse em um pedido"""
        self._setup_mock_user()
        
        mock_res = MagicMock()
        mock_res.data = [{"id": 50, "request_id": 1, "user_id": "user-123"}]
        self.mock_service.insert.return_value = mock_res

        payload = {
            "request_id": 1,
            "user_id": "user-123",
            "message": "Quero doar 10 cestas básicas"
        }

        response = self.client.post("/v1/interests/", json=payload, headers={"Authorization": "Bearer token"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], 50)

    def test_confirm_interest_match(self):
        """Testa o 'Match': ONG confirma interesse e gera notificação"""
        self._setup_mock_user(role="ong")
        
        self.mock_service.confirm_and_notify_interest.return_value = {"status": "success"}

        response = self.client.put("/v1/interests/confirm/50", headers={"Authorization": "Bearer token"})
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")

if __name__ == '__main__':
    unittest.main()
