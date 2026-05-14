from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status, Header
from ..services.supabase_service import SupabaseService
from .deps import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/media", tags=["media"])

# Lista de buckets permitidos para evitar uploads em locais arbitrários
ALLOWED_BUCKETS = {"avatars", "requests", "interests"}

@router.post("/upload/{bucket}")
async def upload_media(
    bucket: str, 
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user),
    authorization: str = Header(None)
):
    """
    Endpoint genérico para upload de imagens.
    """
    if bucket not in ALLOWED_BUCKETS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"O bucket '{bucket}' não é permitido ou não existe."
        )

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autenticação ausente.")

    token = authorization.split(" ")[1]

    try:
        # Inicializa o serviço com o token do usuário para respeitar o RLS
        service = await SupabaseService.create_authenticated(token)
        
        # Lê o conteúdo do arquivo
        contents = await file.read()
        
        # Realiza o upload via serviço
        public_url = await service.upload_file(
            bucket=bucket,
            file_content=contents,
            file_name=file.filename,
            content_type=file.content_type
        )
        
        # Retorna diretamente o dicionário {"url": {"publicUrl": "..."}} gerado pelo serviço
        return public_url
    except Exception as e:
        logger.error(f"Falha no upload para o bucket {bucket}: {str(e)}")
        
        # Se o erro for de permissão (RLS), retornamos 403 explicitamente
        if "violates row-level security" in str(e).lower() or "unauthorized" in str(e).lower():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permissão negada no Supabase Storage (RLS).")
            
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Falha ao processar upload: {str(e)}")
