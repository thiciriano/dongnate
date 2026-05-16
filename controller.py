import os
from fastapi import APIRouter, Form, Depends, Request, Response, Query, HTTPException, status
from fastapi.responses import RedirectResponse
from datetime import datetime, timedelta, timezone
import bcrypt
from jose import jwt
from dotenv import load_dotenv

from database import get_db
from model import User, Pedido, Notificacao, Interesse
from view import templates
from sqlalchemy.orm import Session

load_dotenv()

router = APIRouter()

# segredos
SECRET_KEY = os.getenv("SECRET_KEY", "chave_padrao_para_desenvolvimento")
ALGORITHM = "HS256"

def hash_senha(s):
    # gera hash da senha
    return bcrypt.hashpw(s.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verificar_senha(p, h):
    # verifica senha
    return bcrypt.checkpw(p.encode('utf-8'), h.encode('utf-8'))

def criar_token(uid):
    # gera token jwt
    vencimento = datetime.now(timezone.utc) + timedelta(hours=24)
    payload = {"sub": str(uid), "exp": vencimento}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

class EntityFactory:
    # fabrica de objetos
    @staticmethod
    def create_user(db: Session, **kwargs):
        kwargs['senha'] = hash_senha(kwargs['senha'])
        user = User(**kwargs)
        db.add(user)
        return user

    @staticmethod
    def create_pedido(db: Session, **kwargs):
        pedido = Pedido(**kwargs)
        db.add(pedido)
        # cria notificacao
        n = Notificacao(usuario_id=pedido.usuario_id, titulo="Sucesso", mensagem=f"Pedido '{pedido.titulo}' criado!")
        db.add(n)
        return pedido

class SearchStrategy:
    # define busca
    def apply(self, query, term: str):
        pass

class TitleSearch(SearchStrategy):
    # busca por titulo
    def apply(self, query, term: str):
        return query.filter(Pedido.titulo.contains(term))

class TypeSearch(SearchStrategy):
    # busca por tipo
    def apply(self, query, term: str):
        return query.filter(Pedido.tipo.contains(term))

def get_search_strategy(search_type: str) -> SearchStrategy:
    # escolhe estrategia
    strategies = {
        "titulo": TitleSearch(),
        "tipo": TypeSearch()
    }
    return strategies.get(search_type, TitleSearch())

def pegar_user(request, db):
    # identifica usuario
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        dados = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_do_user = int(dados.get("sub"))
        return db.query(User).filter(User.id == id_do_user).first()
    except:
        return None

@router.get("/")
async def root(request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if u:
        return RedirectResponse("/feed", 303)
    return RedirectResponse("/login", 303)

@router.get("/login")
async def login_page(request: Request):
    return templates.TemplateResponse(request, "login.html", {"hide_nav": True})

@router.get("/register")
async def register_page(request: Request):
    return templates.TemplateResponse(request, "register.html", {"hide_nav": True})

@router.get("/feed")
async def feed(request: Request, q: str = Query(None), t: str = Query("titulo"), db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u:
        return RedirectResponse("/login", 303)
    
    query = db.query(Pedido).filter(Pedido.status == "aberto")
    
    # filtra resultados
    if q:
        strategy = get_search_strategy(t)
        query = strategy.apply(query, q)

    pedidos = query.order_by(Pedido.data_criacao.desc()).all()
    meus_ids = [i.pedido_id for i in u.interesses]
    
    return templates.TemplateResponse(request, "feed.html", {
        "user": u, "pedidos": pedidos, "notificacoes": u.notificacoes,
        "unread_count": len([n for n in u.notificacoes if n.lida == False]),
        "meus_interesses": meus_ids
    })

@router.get("/profile")
async def profile(request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u:
        # erro 401: nao autorizado
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Acesso restrito. Faça login.")
        
    return templates.TemplateResponse(request, "profile.html", { 
        "user": u, "notificacoes": u.notificacoes, 
        "unread_count": len([n for n in u.notificacoes if n.lida == False])
    })

@router.post("/login")
async def login(email: str = Form(...), senha: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user and verificar_senha(senha, user.senha):
        # 303: redireciona
        res = RedirectResponse("/feed", status_code=status.HTTP_303_SEE_OTHER)
        res.set_cookie(key="access_token", value=criar_token(user.id), httponly=True)
        return res
    return RedirectResponse("/login?error=1", status_code=status.HTTP_303_SEE_OTHER)

@router.post("/register")
async def register(nome: str = Form(...), email: str = Form(...), senha: str = Form(...), tipo: str = Form(...), whatsapp: str = Form(...), telefone: str = Form(...), db: Session = Depends(get_db)):
    # cria usuario
    try:
        EntityFactory.create_user(db, nome=nome, email=email, senha=senha, tipo=tipo, whatsapp=whatsapp, telefone=telefone)
        db.commit()
    except Exception:
        db.rollback()
        # erro 500: falha interna
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar conta.")
    
    return RedirectResponse("/login", status_code=status.HTTP_303_SEE_OTHER)

@router.post("/pedidos")
async def criar_pedido(request: Request, titulo: str = Form(...), descricao: str = Form(...), tipo: str = Form(...), urgencia: str = Form("normal"), db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if u and u.tipo == 'instituicao':
        # cria pedido
        EntityFactory.create_pedido(db, titulo=titulo, descricao=descricao, tipo=tipo, urgencia=urgencia, usuario_id=u.id)
        db.commit()
    return RedirectResponse("/feed", status_code=status.HTTP_303_SEE_OTHER)

@router.get("/pedidos/editar/{pid}")
async def editar_pedido_page(pid: int, request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u: return RedirectResponse("/login", 303)
    
    p = db.query(Pedido).filter(Pedido.id == pid).first()
    if not p:
        # erro 404: nao encontrado
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado")
    
    if p.usuario_id != u.id:
        # erro 403: proibido
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para editar este pedido")
        
    return templates.TemplateResponse(request, "edit_pedido.html", {"user": u, "pedido": p})

@router.put("/pedidos/editar/{pid}")
@router.post("/pedidos/editar/{pid}")
async def editar_pedido(pid: int, request: Request, titulo: str = Form(...), descricao: str = Form(...), tipo: str = Form(...), urgencia: str = Form("normal"), db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u: raise HTTPException(status_code=401)
    
    p = db.query(Pedido).filter(Pedido.id == pid).first()
    if not p:
        raise HTTPException(status_code=404)
    if p.usuario_id != u.id:
        raise HTTPException(status_code=403)

    p.titulo, p.descricao, p.tipo, p.urgencia = titulo, descricao, tipo, urgencia
    db.commit()
    return RedirectResponse("/profile", status_code=status.HTTP_303_SEE_OTHER)

@router.delete("/pedidos/delete/{pid}")
@router.post("/pedidos/delete/{pid}")
async def delete_pedido(pid: int, request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u: raise HTTPException(status_code=401)
    
    p = db.query(Pedido).filter(Pedido.id == pid).first()
    if not p: raise HTTPException(status_code=404)
    if p.usuario_id != u.id: raise HTTPException(status_code=403)
    
    db.delete(p)
    db.commit()
    return RedirectResponse("/profile", status_code=status.HTTP_303_SEE_OTHER)

@router.post("/interesses")
async def ajudar(request: Request, pedido_id: int = Form(...), mensagem: str = Form(""), db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u or u.tipo != 'doador':
        raise HTTPException(status_code=403, detail="Apenas doadores podem ajudar")
    
    ja_tem = db.query(Interesse).filter(Interesse.usuario_id == u.id, Interesse.pedido_id == pedido_id).first()
    if not ja_tem:
        i = Interesse(mensagem=mensagem, usuario_id=u.id, pedido_id=pedido_id)
        db.add(i) 
        db.commit()
    return RedirectResponse("/feed", status_code=status.HTTP_303_SEE_OTHER)

@router.put("/interesses/confirmar/{iid}")
@router.post("/interesses/confirmar/{iid}")
async def confirmar(iid: int, request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    i = db.query(Interesse).filter(Interesse.id == iid).first()
    if not i: raise HTTPException(status_code=404)
    if i.pedido.usuario_id != u.id: raise HTTPException(status_code=403)

    i.status, i.pedido.status = "confirmado", "finalizado"
    a = Notificacao(usuario_id=i.usuario_id, titulo="Interesse Confirmado!", mensagem=f"A instituição {u.nome} aceitou sua ajuda!")
    db.add(a)
    db.commit()
    return RedirectResponse("/profile", status_code=status.HTTP_303_SEE_OTHER)

@router.patch("/notificacoes/read/{nid}")
@router.post("/notificacoes/read/{nid}")
async def mark_read(nid: int, request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u: raise HTTPException(status_code=401)
    
    n = db.query(Notificacao).filter(Notificacao.id == nid, Notificacao.usuario_id == u.id).first()
    if not n: raise HTTPException(status_code=404)
    
    n.lida = True
    db.commit()
    # sucesso
    return {"status": "lida"}

@router.delete("/interesses/delete/{iid}")
@router.post("/interesses/delete/{iid}")
async def cancelar_interesse(iid: int, request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u: raise HTTPException(status_code=401)
    
    i = db.query(Interesse).filter(Interesse.id == iid, Interesse.usuario_id == u.id).first()
    if i:
        db.delete(i)
        db.commit()
    return RedirectResponse("/profile", status_code=status.HTTP_303_SEE_OTHER)

@router.delete("/notificacoes/delete/{nid}")
@router.post("/notificacoes/delete/{nid}")
async def delete_notification(nid: int, request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u: raise HTTPException(status_code=401)
    
    n = db.query(Notificacao).filter(Notificacao.id == nid, Notificacao.usuario_id == u.id).first()
    if n:
        db.delete(n)
        db.commit()
    return RedirectResponse("/profile", status_code=status.HTTP_303_SEE_OTHER)

@router.delete("/delete-account")
@router.post("/delete-account")
async def delete_account(request: Request, db: Session = Depends(get_db)):
    u = pegar_user(request, db)
    if not u: raise HTTPException(status_code=401)
    
    db.delete(u)
    db.commit()
    res = RedirectResponse("/login", status_code=status.HTTP_303_SEE_OTHER)
    res.delete_cookie("access_token")
    return res

@router.get("/logout")
async def logout():
    res = RedirectResponse("/login", status_code=status.HTTP_303_SEE_OTHER)
    res.delete_cookie("access_token")
    return res
