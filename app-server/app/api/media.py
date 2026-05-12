from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from ..services.supabase_service import SupabaseService, get_supabase_service
import logging

router = APIRouter(prefix="/v1/media", tags=["media"])

@router.post("/upload/{bucket}")
async def upload_media(bucket: str, file: UploadFile = File(...), service: SupabaseService = Depends(get_supabase_service)):
    """
    Endpoint genérico para upload de imagens.
    Buckets sugeridos: 'avatars', 'requests', 'interests'
    """
    try:
        # Lê o conteúdo do arquivo
        contents = await file.read()
        
        # Realiza o upload via serviço
        public_url = await service.upload_file(
            bucket=bucket,
            file_content=contents,
            file_name=file.filename,
            content_type=file.content_type
        )
        
        return {"url": public_url}
    except Exception as e:
        logging.error(f"Erro no upload: {e}")
        raise HTTPException(status_code=400, detail=f"Falha ao processar upload: {str(e)}")
