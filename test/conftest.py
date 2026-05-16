import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
import os
import sys

# caminho dos arquivos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
from main import app

# banco so pra teste
url_teste = "sqlite:///./test_db.db"

eng = create_engine(url_teste, connect_args={"check_same_thread": False})
SessaoTeste = sessionmaker(autocommit=False, autoflush=False, bind=eng)

@pytest.fixture(scope="function")
def db():
    # faz o banco de teste
    Base.metadata.create_all(bind=eng)
    d = SessaoTeste()
    try:
        yield d
    finally:
        d.close()
        # apaga o banco de teste no fim
        Base.metadata.drop_all(bind=eng)

@pytest.fixture(scope="function")
def client(db):
    # troca o banco real pelo de teste
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
