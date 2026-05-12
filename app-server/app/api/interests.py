from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models.schemas import Interest, InterestCreate
from ..services.supabase_service import SupabaseService, get_supabase_service
from .deps import get_current_user, RoleChecker

router = APIRouter(prefix="/v1/interests", tags=["interests"])

@router.post("/", response_model=Interest)
async def create_interest(
    interest: InterestCreate, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(get_current_user)
):
    """Qualquer usuário logado pode manifestar interesse."""
    try:
        # Garante que o user_id do interesse seja o do usuário logado
        data = interest.model_dump()
        data["user_id"] = current_user["id"]
        res = await service.insert("interests", data)
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user/{user_id}")
async def get_interests_by_user(
    user_id: str, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(get_current_user)
):
    """O usuário só pode ver seus próprios interesses."""
    if current_user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Acesso negado")
        
    try:
        res = await service.client.table("interests") \
            .select("*, help_requests(*, ongs(*))") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/request/{request_id}")
async def get_interests_by_request(
    request_id: int, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(RoleChecker(["ong"]))
):
    """Apenas ONGs podem ver quem se interessou por um pedido."""
    try:
        res = await service.client.table("interests") \
            .select("*, users(*)") \
            .eq("request_id", request_id) \
            .order("created_at", desc=True) \
            .execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/confirm/{interest_id}")
async def confirm_interest(
    interest_id: int, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(RoleChecker(["ong"]))
):
    """Apenas ONGs podem confirmar um interesse."""
    try:
        result = await service.confirm_and_notify_interest(interest_id)
        if not result:
            raise HTTPException(status_code=404, detail="Registro não encontrado.")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
