from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth
from .api import requests
from .api import notifications
from .api import ongs
from .api import interests
from .api import users
from .api import media

app = FastAPI(
    title="DongNate API",
    description="API para a plataforma de doações DongNate",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitido pois o proxy do Vite gerencia a origem
    allow_credentials=True, # Permite cookies, cabeçalhos de autorização, etc.
    allow_methods=["*"], # Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Permite todos os cabeçalhos HTTP
)

# Inclua seus roteadores de API no aplicativo principal
app.include_router(auth.router)
app.include_router(requests.router) # Corrigido: Usar 'requests.router' conforme importado
app.include_router(notifications.router)
app.include_router(ongs.router)
app.include_router(interests.router)
app.include_router(users.router)
app.include_router(media.router)