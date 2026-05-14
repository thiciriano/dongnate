import unittest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app
from app.services.supabase_service import get_supabase_service, SupabaseService

class TestRBAC(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        # Criamos o mock do serviço
        self.mock_service = AsyncMock(spec=SupabaseService)
        
        # Configuramos explicitamente a estrutura do client.auth exigida pelo deps.py
        self.mock_service.client = MagicMock()
        self.mock_service.client.auth = AsyncMock()
        
        async def get_mock_service():
            return self.mock_service
            
        app.dependency_overrides[get_supabase_service] = get_mock_service

    def tearDown(self):
        app.dependency_overrides = {}

    def test_create_request_as_ong_success(self):
        """Testa se um usuário com role 'ong' pode criar pedidos"""
        # 1. Simula retorno do auth.get_user
        mock_auth_res = MagicMock()
        mock_auth_res.user.id = "uuid-ong"
        self.mock_service.client.auth.get_user.return_value = mock_auth_res
        
        # 2. Simula retorno do select('users') para pegar a role
        mock_user_data = MagicMock()
        mock_user_data.data = [{"id": "uuid-ong", "role": "ong", "full_name": "ONG Teste"}]
        self.mock_service.select.return_value = mock_user_data

        # 3. Simula retorno do insert do pedido
        mock_req_res = MagicMock()
        mock_req_res.data = [{
            "id": 1, "ong_id": 1, "title": "Teste", "description": "Desc", 
            "category": "Alimentos", "urgency": "media", "status": "ABERTO",
            "delivery_location": "Local", "latitude": 0, "longitude": 0,
            "created_at": "2023-10-27T10:00:00"
        }]
        self.mock_service.insert.return_value = mock_req_res

        payload = {
            "ong_id": 1, "title": "Teste", "description": "Desc", 
            "category": "Alimentos", "urgency": "media", "delivery_location": "Local", 
            "latitude": 0, "longitude": 0
        }

        headers = {"Authorization": "Bearer valid-token"}
        response = self.client.post("/v1/help-requests/", json=payload, headers=headers)
        
        self.assertEqual(response.status_code, 201)

    def test_create_request_as_doador_forbidden(self):
        """Testa se um doador é impedido de criar pedidos (403 Forbidden)"""
        mock_auth_res = MagicMock()
        mock_auth_res.user.id = "uuid-doador"
        self.mock_service.client.auth.get_user.return_value = mock_auth_res
        
        mock_user_data = MagicMock()
        mock_user_data.data = [{"id": "uuid-doador", "role": "doador"}]
        self.mock_service.select.return_value = mock_user_data

        payload = {
            "ong_id": 1, "title": "Teste", "description": "Desc", "category": "Alimentos",
            "urgency": "media", "delivery_location": "Local", "latitude": 0, "longitude": 0
        }

        headers = {"Authorization": "Bearer valid-token"}
        response = self.client.post("/v1/help-requests/", json=payload, headers=headers)
        
        # Aqui o usuário está logado, mas não tem a role certa -> 403
        self.assertEqual(response.status_code, 403)

    def test_unauthorized_access(self):
        """Testa acesso sem token (Deve retornar 401 Unauthorized)"""
        response = self.client.post("/v1/help-requests/", json={})
        # Sem token nenhum -> 401
        self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()
