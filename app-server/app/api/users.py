from fastapi import APIRouter, HTTPException, Depends, status
from ..models.schemas import User, UserUpdate
from ..services.supabase_service import SupabaseService, get_supabase_service
from .deps import get_current_user
import logging

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.put("/{user_id}", response_model=User, status_code=status.HTTP_200_OK)
async def update_user(
    user_id: str, 
    data: UserUpdate, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(get_current_user)
):
    """Garante que o usuário só consiga editar o próprio perfil."""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para editar este perfil"
        )
        
    try:
        update_data = data.model_dump(exclude_unset=True)
        if update_data.get('birth_date') and hasattr(update_data['birth_date'], 'isoformat'):
            update_data['birth_date'] = update_data['birth_date'].isoformat()

        res = await service.update("users", user_id, update_data)
        if not res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
            
        try:
            await service.client.auth.admin.update_user_by_id(user_id, {
                "user_metadata": update_data
            })
        except Exception as auth_err:
            logging.warning(f"Erro ao sincronizar metadados Auth para {user_id}: {auth_err}")
            
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erro ao atualizar usuário: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{user_id}", response_model=User, status_code=status.HTTP_200_OK)
async def get_user(
    user_id: str, 
    service: SupabaseService = Depends(get_supabase_service),
    current_user: dict = Depends(get_current_user)
):
    """Busca dados de um usuário específico."""
    try:
        res = await service.select("users", {"id": user_id})
        if not res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erro ao recuperar usuário: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
