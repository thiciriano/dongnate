import unittest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app
from app.services.supabase_service import get_supabase_service, SupabaseService

class TestRequestsAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.mock_service = AsyncMock(spec=SupabaseService)
        
        # Configura a estrutura para o auth exigida pelas dependências
        self.mock_service.client = MagicMock()
        self.mock_service.client.auth = AsyncMock()
        
        async def get_mock_service():
            return self.mock_service
            
        app.dependency_overrides[get_supabase_service] = get_mock_service

    def tearDown(self):
        app.dependency_overrides = {}

    def _setup_mock_user(self, user_id="uuid-ong", role="ong"):
        mock_auth_res = MagicMock()
        mock_auth_res.user.id = user_id
        self.mock_service.client.auth.get_user.return_value = mock_auth_res
        
        mock_user_data = MagicMock()
        mock_user_data.data = [{"id": user_id, "role": role}]
        self.mock_service.select.return_value = mock_user_data

    def test_get_requests_success(self):
        """Testa listagem de pedidos de ajuda (público)"""
        mock_res = MagicMock()
        mock_res.data = [
            {
                "id": 1, 
                "ong_id": 10,
                "title": "Alimentos para abrigo", 
                "description": "Necessitamos de doações de arroz e feijão.",
                "category": "Alimentos", 
                "urgency": "alta",
                "status": "ABERTO",
                "delivery_location": "Rua Central, 500",
                "latitude": -23.55,
                "longitude": -46.63,
                "created_at": "2023-10-27T10:00:00"
            }
        ]
        self.mock_service.select.return_value = mock_res

        response = self.client.get("/v1/help-requests/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["title"], "Alimentos para abrigo")

    def test_create_request_success(self):
        """Testa criação de pedido de ajuda com usuário autenticado simulado"""
        self._setup_mock_user()
        
        mock_res = MagicMock()
        mock_res.data = [{
            "id": 10, 
            "ong_id": 1,
            "title": "Cestas Básicas",
            "description": "Necessitamos de 50 cestas",
            "category": "Alimentos",
            "urgency": "media",
            "status": "ABERTO",
            "delivery_location": "Rua A, 123",
            "latitude": 0.0,
            "longitude": 0.0,
            "created_at": "2023-10-27T10:00:00"
        }]
        self.mock_service.insert.return_value = mock_res

        payload = {
            "ong_id": 1,
            "title": "Cestas Básicas",
            "description": "Necessitamos de 50 cestas",
            "category": "Alimentos",
            "urgency": "media",
            "delivery_location": "Rua A, 123",
            "latitude": 0.0,
            "longitude": 0.0
        }

        headers = {"Authorization": "Bearer token-valido"}
        response = self.client.post("/v1/help-requests/", json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["id"], 10)

if __name__ == '__main__':
    unittest.main()
