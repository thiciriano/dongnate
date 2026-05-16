from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Boolean, event
from sqlalchemy.orm import relationship, Session
from datetime import datetime, timezone
from database import Base

class User(Base):
    # gente que usa o site
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100))
    email = Column(String(100), unique=True)
    senha = Column(String(100))
    whatsapp = Column(String(20))
    telefone = Column(String(20))
    tipo = Column(String(20)) 
    
    # ligações com outras tabelas
    pedidos = relationship("Pedido", back_populates="usuario", cascade="all, delete-orphan")
    interesses = relationship("Interesse", back_populates="usuario", cascade="all, delete-orphan")
    notificacoes = relationship("Notificacao", back_populates="usuario", cascade="all, delete-orphan")

class Pedido(Base):
    # o que as ongs pedem
    __tablename__ = "pedidos"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100))
    descricao = Column(Text)
    tipo = Column(String(50)) 
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"))
    data_criacao = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(20), default="aberto") 
    urgencia = Column(String(20), default="normal") 
    
    usuario = relationship("User", back_populates="pedidos")
    interesses = relationship("Interesse", back_populates="pedido", cascade="all, delete-orphan")

class Interesse(Base):
    # quem quer ajudar
    __tablename__ = "interesses"
    id = Column(Integer, primary_key=True, index=True)
    mensagem = Column(Text)
    status = Column(String(20), default="pendente") 
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"))
    pedido_id = Column(Integer, ForeignKey("pedidos.id", ondelete="CASCADE"))
    data = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    usuario = relationship("User", back_populates="interesses")
    pedido = relationship("Pedido", back_populates="interesses")

class Notificacao(Base):
    # avisos do sistema
    __tablename__ = "notificacoes"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100))
    mensagem = Column(Text)
    lida = Column(Boolean, default=False) 
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"))
    data = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    usuario = relationship("User", back_populates="notificacoes")

# --- Padrão Observer ---
@event.listens_for(Interesse, 'after_insert')
def auto_notificar_interesse(mapper, connection, target):
    # esse observador avisa o dono do pedido automaticamente quando alguem quer ajudar
    # abre uma sessao rapidinha pra salvar o aviso
    session = Session(bind=connection)
    pedido = session.query(Pedido).filter(Pedido.id == target.pedido_id).first()
    n = Notificacao(usuario_id=pedido.usuario_id, titulo="Novo Interessado", mensagem=f"Alguém quer ajudar em '{pedido.titulo}'")
    session.add(n)
    session.commit()
