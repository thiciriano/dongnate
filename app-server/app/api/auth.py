from fastapi import APIRouter, HTTPException, Query, Depends
from ..models.schemas import UserCreate, LoginRequest, TokenResponse, User
from ..services.supabase_service import SupabaseService, get_supabase_service

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.post("/register", response_model=User)
async def register(user_data: UserCreate, service: SupabaseService = Depends(get_supabase_service)):
    try:
        user = await service.register_user_with_sync(user_data)
        if not user:
            raise HTTPException(status_code=400, detail="Erro ao criar conta de usuário.")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, service: SupabaseService = Depends(get_supabase_service)):
    try:
        res = await service.sign_in(credentials.email, credentials.password)
        user_obj = await service.get_user_with_fallback(res)

        return {
            "access_token": res.session.access_token,
            "token_type": "bearer",
            "user": user_obj
        }
    except Exception as e:
        print(f"Erro no login: {e}")
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos.")

@router.delete("/me")
async def delete_account(user_id: str = Query(...), service: SupabaseService = Depends(get_supabase_service)):
    try:
        await service.delete_user(user_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
