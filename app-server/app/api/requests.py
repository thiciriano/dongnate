from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models.schemas import HelpRequest, HelpRequestCreate
from ..services.supabase_service import SupabaseService, get_supabase_service
from .deps import RoleChecker

router = APIRouter(prefix="/v1/help-requests", tags=["help-requests"])

# Qualquer um pode ver os pedidos
@router.get("/", response_model=List[HelpRequest])
async def get_requests(skip: int = 0, limit: int = 100, service: SupabaseService = Depends(get_supabase_service)):
    try:
        res = await service.select("help_requests", skip=skip, limit=limit)
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Apenas ONGs podem criar pedidos
@router.post("/", response_model=HelpRequest, status_code=status.HTTP_201_CREATED)
async def create_request(
    request: HelpRequestCreate, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(RoleChecker(["ong"]))
):
    try:
        res = await service.insert("help_requests", request.model_dump())
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}", response_model=HelpRequest)
async def get_request(id: int, service: SupabaseService = Depends(get_supabase_service)):
    try:
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
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(RoleChecker(["ong"]))
):
    try:
        res = await service.update("help_requests", id, request.model_dump())
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Apenas ONGs podem deletar
@router.delete("/{id}")
async def delete_request(
    id: int, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(RoleChecker(["ong"]))
):
    try:
        await service.client.table("help_requests").delete().eq("id", id).execute()
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
