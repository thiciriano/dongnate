import unittest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app
from app.services.supabase_service import get_supabase_service, SupabaseService

class TestOngsAPI(unittest.TestCase):
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

    def _setup_mock_user(self, user_id="uuid-123", role="doador"):
        mock_auth_res = MagicMock()
        mock_auth_res.user.id = user_id
        self.mock_service.client.auth.get_user.return_value = mock_auth_res
        
        mock_user_data = MagicMock()
        mock_user_data.data = [{"id": user_id, "role": role}]
        self.mock_service.select.return_value = mock_user_data

    def test_get_ongs_success(self):
        """Testa listagem pública de ONGs (sem auth)"""
        mock_response = MagicMock()
        mock_response.data = [
            {
                "id": 1, "user_id": "u1", "organization_name": "ONG A", 
                "cnpj": "1", "phone": "1", "cep": "1", "street": "1", 
                "number": "1", "neighborhood": "1", "city": "1", "state": "1", 
                "latitude": 0, "longitude": 0, "verified": False
            }
        ]
        self.mock_service.select.return_value = mock_response

        response = self.client.get("/v1/ongs/")
        self.assertEqual(response.status_code, 200)

    def test_create_ong_error(self):
        """Testa criação de ONG com usuário autenticado simulado"""
        self._setup_mock_user()
        self.mock_service.insert.side_effect = Exception("CNPJ já cadastrado")
        
        payload = {
            "organization_name": "Nova ONG",
            "cnpj": "00.000.000/0001-91",
            "user_id": "uuid-123",
            "phone": "11988887777",
            "cep": "01001-000",
            "street": "Rua X",
            "number": "1",
            "neighborhood": "Bairro",
            "city": "Cidade",
            "state": "UF",
            "latitude": 0,
            "longitude": 0
        }
        
        headers = {"Authorization": "Bearer token-valido"}
        response = self.client.post("/v1/ongs/", json=payload, headers=headers)
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
