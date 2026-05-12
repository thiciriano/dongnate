from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from ..models.schemas import Ong, OngCreate
from ..services.supabase_service import SupabaseService, get_supabase_service
from .deps import get_current_user, RoleChecker

router = APIRouter(prefix="/v1/ongs", tags=["ongs"])

@router.get("/", response_model=List[Ong])
async def get_ongs(skip: int = 0, limit: int = 100, service: SupabaseService = Depends(get_supabase_service)):
    res = await service.select("ongs", skip=skip, limit=limit)
    return res.data

@router.get("/{id}/requests-with-interests")
async def get_ong_requests_with_interests(
    id: int, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(RoleChecker(["ong"]))
):
    """
    Apenas ONGs autenticadas podem ver contagem de interesses.
    """
    try:
        res = await service.client.table("help_requests") \
            .select("*, interests(count)") \
            .eq("ong_id", id) \
            .execute()
        
        formatted_data = []
        for item in res.data:
            item['interestsCount'] = item['interests'][0]['count'] if item.get('interests') else 0
            formatted_data.append(item)
            
        return formatted_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id}", response_model=Ong)
async def get_ong(id: int, service: SupabaseService = Depends(get_supabase_service)):
    try:
        res = await service.select("ongs", {"id": id})
        if not res.data:
            raise HTTPException(status_code=404, detail="ONG não encontrada")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Ong)
async def create_ong(
    ong: OngCreate, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(get_current_user)
):
    """
    Qualquer usuário logado pode registrar sua ONG.
    """
    try:
        res = await service.insert("ongs", ong.model_dump())
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
