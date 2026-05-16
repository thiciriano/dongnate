import pytest
from controller import hash_senha, verificar_senha, criar_token

def test_password_hashing():
    senha = "dongnate_password"
    hashed = hash_senha(senha)
    assert hashed != senha
    assert verificar_senha(senha, hashed) is True
    assert verificar_senha("senha_errada", hashed) is False

def test_jwt_token():
    from jose import jwt
    from controller import SECRET_KEY, ALGORITHM
    user_id = 123
    token = criar_token(user_id)
    assert token is not None
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert int(payload.get("sub")) == user_id
