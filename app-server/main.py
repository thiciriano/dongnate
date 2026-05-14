import sys
import asyncio

# FIX: Configuração obrigatória para sistemas Windows
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, ongs, requests, interests, notifications, users, media

app = FastAPI(title="DongNate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão dos roteadores
app.include_router(auth.router)
app.include_router(ongs.router)
app.include_router(requests.router)
app.include_router(interests.router)
app.include_router(notifications.router)
app.include_router(users.router)
app.include_router(media.router)

@app.get("/")
def root():
    return {"status": "DongNate API is Online", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
