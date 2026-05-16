import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    # esse padrao (singleton) garante que o banco seja criado uma vez so
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
            # configura onde fica o arquivo do banco
            cls._instance.url = os.getenv("DATABASE_URL", "sqlite:///./dongnate.db")
            cls._instance.engine = create_engine(cls._instance.url, connect_args={"check_same_thread": False})
            cls._instance.Sessao = sessionmaker(autocommit=False, autoflush=False, bind=cls._instance.engine)
        return cls._instance

# cria o gerenciador que todo mundo vai usar
db_manager = DatabaseManager()
engine = db_manager.engine
Sessao = db_manager.Sessao

# base pros modelos
Base = declarative_base()

def get_db():
    # pega o banco e fecha depois
    db = db_manager.Sessao()
    try:
        yield db
    finally:
        db.close()
