import pytest
from model import User, Pedido, Interesse

def test_create_user(db):
    user = User(nome="Teste", email="teste@uol.com", senha="123", tipo="doador", whatsapp="11999998888", telefone="1144445555")
    db.add(user)
    db.commit()
    assert user.id is not None

def test_user_pedido_relationship(db):
    # Validando se o relacionamento entre tabelas do SQLAlchemy está funcionando
    user = User(nome="Inst", email="inst@uol.com", senha="123", tipo="instituicao", whatsapp="11977776666", telefone="1144445555")
    db.add(user)
    db.commit()
    
    pedido = Pedido(titulo="Pedido 1", descricao="Desc", tipo="Alimentos", usuario_id=user.id)
    db.add(pedido)
    db.commit()
    
    assert len(user.pedidos) == 1
    assert user.pedidos[0].titulo == "Pedido 1"

def test_cascade_delete(db):
    user = User(nome="Deletar", email="del@uol.com", senha="123", tipo="instituicao", whatsapp="0000000000", telefone="1144445555")
    db.add(user)
    db.commit()
    
    pedido = Pedido(titulo="Vai sumir", descricao="Desc", tipo="Móveis", usuario_id=user.id)
    db.add(pedido)
    db.commit()
    
    db.delete(user) # Se eu deletar o pai, o filho deve sumir
    db.commit()
    
    p = db.query(Pedido).filter(Pedido.titulo == "Vai sumir").first()
    assert p is None
