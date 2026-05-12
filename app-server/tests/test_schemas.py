import unittest
from datetime import date, timedelta
from pydantic import ValidationError
from app.models.schemas import UserCreate

class TestUserSchemas(unittest.TestCase):
    def setUp(self):
        self.valid_user_data = {
            "full_name": "João Silva",
            "email": "joao@example.com",
            "password": "password123",
            "role": "doador",
            "birth_date": date.today() - timedelta(days=365*20), # 20 anos
            "phone": "11999999999"
        }

    def test_user_create_success(self):
        """Testa se um usuário com mais de 18 anos é aceito"""
        user = UserCreate(**self.valid_user_data)
        self.assertEqual(user.full_name, "João Silva")

    def test_user_underage_error(self):
        """Testa se a validação de idade mínima (18 anos) funciona"""
        underage_data = self.valid_user_data.copy()
        underage_data["birth_date"] = date.today() - timedelta(days=365*10) # 10 anos
        
        with self.assertRaises(ValidationError) as cm:
            UserCreate(**underage_data)
        
        # Verifica se a mensagem de erro é a que definimos no validator
        self.assertIn("pelo menos 18 anos", str(cm.exception))

if __name__ == '__main__':
    unittest.main()
