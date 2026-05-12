from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..services.supabase_service import SupabaseService, get_supabase_service

security = HTTPBearer()

async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    service: SupabaseService = Depends(get_supabase_service)
):
    """
    Verifica o token JWT com o Supabase e retorna os dados do usuário.
    """
    try:
        # No Supabase, o próprio cliente valida o token ao ser usado
        # Aqui buscamos os dados do usuário logado baseado no token
        user_res = await service.client.auth.get_user(token.credentials)
        if not user_res.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado"
            )
        
        # Buscamos a role na tabela pública para garantir segurança
        res = await service.select("users", {"id": user_res.user.id})
        if not res.data:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
            
        return res.data[0]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não foi possível validar as credenciais"
        )

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(get_current_user)):
        if user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para realizar esta ação"
            )
        return user
