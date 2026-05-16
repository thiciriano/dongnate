from fastapi import FastAPI
from database import engine, Base
from controller import router
import uvicorn

app = FastAPI()

# cria o banco 
Base.metadata.create_all(bind=engine)

# traz as rotas do controller
app.include_router(router)

if __name__ == "__main__":
    # roda o projeto
    uvicorn.run("main:app", host="127.0.0.1", port=8002, reload=True)
