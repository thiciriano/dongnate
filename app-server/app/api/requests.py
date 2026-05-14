from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models.schemas import HelpRequest, HelpRequestCreate
from ..services.supabase_service import SupabaseService, get_supabase_service
from .deps import RoleChecker, get_current_user, security
from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter(prefix="/v1/help-requests", tags=["help-requests"])

# Qualquer usuário autenticado (ONG ou Doador) pode listar os pedidos
@router.get("", response_model=List[HelpRequest]) # Removida barra final
async def get_requests(
    skip: int = 0, 
    limit: int = 100, 
    service: SupabaseService = Depends(get_supabase_service)
):
    """Qualquer pessoa (mesmo não logada) pode listar pedidos na Landing Page."""
    try:
        res = await service.select("help_requests", skip=skip, limit=limit)
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Apenas ONGs podem criar pedidos
@router.post("", response_model=HelpRequest, status_code=status.HTTP_201_CREATED) # Removida barra final
async def create_request(
    request: HelpRequestCreate, 
    current_user: dict = Depends(RoleChecker(["ong"])),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        # Inicializa o serviço com o token do usuário para que o RLS reconheça o auth.uid()
        service = await SupabaseService.create_authenticated(token.credentials)
        res = await service.insert("help_requests", request.model_dump())
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Qualquer usuário autenticado pode ver detalhes de um pedido específico
@router.get("/{id}", response_model=HelpRequest)
async def get_request(
    id: int, 
    current_user: dict = Depends(RoleChecker(["ong", "doador"])),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        service = await SupabaseService.create_authenticated(token.credentials)
        res = await service.select("help_requests", {"id": id})
        if not res.data:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Apenas ONGs podem atualizar
@router.put("/{id}", response_model=HelpRequest)
async def update_request(
    id: int, 
    request: HelpRequestCreate,
    current_user: dict = Depends(RoleChecker(["ong"])),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        service = await SupabaseService.create_authenticated(token.credentials)
        # Usamos exclude_unset para não sobrescrever campos não enviados e mode='json' para compatibilidade
        update_data = request.model_dump(exclude_unset=True, mode='json')
        res = await service.update("help_requests", id, update_data)
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Apenas ONGs podem deletar
@router.delete("/{id}")
async def delete_request(
    id: int, 
    current_user: dict = Depends(RoleChecker(["ong"])),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        service = await SupabaseService.create_authenticated(token.credentials)
        await service.delete("help_requests", id)
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
