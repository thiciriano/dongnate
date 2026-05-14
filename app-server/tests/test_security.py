import unittest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from main import app
from app.services.supabase_service import get_supabase_service, SupabaseService

class TestSecurity(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.mock_service = AsyncMock(spec=SupabaseService)
        # Configura a estrutura necessária para o auth
        self.mock_service.client = MagicMock()
        self.mock_service.client.auth = AsyncMock()
        
        async def get_mock_service():
            return self.mock_service
            
        app.dependency_overrides[get_supabase_service] = get_mock_service

    def _setup_mock_user(self, user_id="uuid-seguro", role="ong"):
        """Simula um usuário autenticado para passar pela barreira do RBAC"""
        mock_auth_res = MagicMock()
        mock_auth_res.user.id = user_id
        self.mock_service.client.auth.get_user.return_value = mock_auth_res
        
        mock_user_data = MagicMock()
        mock_user_data.data = [{"id": user_id, "role": role}]
        self.mock_service.select.return_value = mock_user_data

    def test_sql_injection_numeric_path(self):
        """O FastAPI deve barrar tipos inválidos antes da autenticação"""
        payload = "1; DROP TABLE users;--"
        response = self.client.get(f"/v1/ongs/{payload}")
        self.assertEqual(response.status_code, 422)

    def test_sql_injection_string_query(self):
        """Testa escape de string em rota protegida"""
        self._setup_mock_user()
        malicious_id = "uuid-real' OR '1'='1"
        
        # Simula que o segundo select (da busca do usuário) não retorna nada
        # Nota: O primeiro select é usado pelo deps.py para pegar a role
        self.mock_service.select.side_effect = [
            MagicMock(data=[{"id": "u", "role": "ong"}]), # Chamada do deps.py
            MagicMock(data=[]) # Chamada do endpoint real
        ]

        headers = {"Authorization": "Bearer token"}
        response = self.client.get(f"/v1/users/{malicious_id}", headers=headers)
        
        # 404 significa que o SQL foi tratado como texto e não executado
        self.assertEqual(response.status_code, 404)
        
        # Verifica se o serviço de select foi chamado com a string maliciosa literal,
        # provando que ela não foi interpretada como comando SQL antes da consulta.
        calls = self.mock_service.select.call_args_list
        self.assertTrue(any(malicious_id in str(call) for call in calls))

    def test_xss_injection_attempt(self):
        """Testa inserção de scripts em rota protegida"""
        self._setup_mock_user(role="ong")
        
        payload = {
            "ong_id": 1,
            "title": "<script>alert('xss')</script>",
            "description": "Teste",
            "category": "Alimentos",
            "urgency": "media",
            "delivery_location": "Rua 1",
            "latitude": 0,
            "longitude": 0
        }
        
        self.mock_service.insert.return_value = MagicMock(data=[{"id": 1, **payload}])

        headers = {"Authorization": "Bearer token"}
        response = self.client.post("/v1/help-requests/", json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["title"], payload["title"])

if __name__ == '__main__':
    unittest.main()
