import os
import logging
import uuid
from supabase import create_async_client, AsyncClient
from dotenv import load_dotenv
from fastapi import Depends

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

if not url or not key:
    logger.warning("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados no .env")

_async_supabase_client: AsyncClient = None

# Cliente global (usado para operações administrativas via service_role)

async def get_supabase_client() -> AsyncClient:
    global _async_supabase_client
    if _async_supabase_client is None:
        if not url or not key:
            raise Exception("Credenciais do Supabase não configuradas.")
        _async_supabase_client = await create_async_client(url, key)
    return _async_supabase_client

logging.basicConfig(level=logging.INFO, format='{"time": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}')
logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self, client: AsyncClient):
        self.client = client

    @classmethod
    async def create_authenticated(cls, token: str):
        """Cria uma instância do serviço agindo em nome do usuário (respeita RLS)"""
        # Criamos um novo cliente para esta requisição para evitar conflitos de sessão
        client = await create_async_client(url, key)
        await client.auth.set_session(access_token=token, refresh_token=token)
        return cls(client)

    async def upload_file(self, bucket: str, file_content, file_name: str, content_type: str = "image/jpeg"):
        """Realiza upload de arquivo para o Supabase Storage"""
        # Garante nome único para evitar colisões
        ext = file_name.split('.')[-1]
        unique_name = f"{uuid.uuid4()}.{ext}"
        
        try:
            # O cliente python do supabase requer bytes ou file-like object
            res = await self.client.storage.from_(bucket).upload(
                path=unique_name,
                file=file_content,
                file_options={"content-type": content_type}
            )
            
            # Gera URL pública e garante que o retorno seja um dicionário serializável
            # compatível com o que o frontend espera: res.url.publicUrl
            public_url = await self.client.storage.from_(bucket).get_public_url(unique_name)
            
            return {"url": {"publicUrl": str(public_url)}}
        except Exception as e:
            logger.error(f"Erro no upload para o bucket {bucket}: {str(e)}")
            raise e

    async def sign_up(self, email, password, data):
        return await self.client.auth.sign_up({
            "email": email, 
            "password": password, 
            "options": {"data": data}
        })

    async def register_user_with_sync(self, user_data):
        # Usamos mode='json' para garantir que tipos como 'date' virem strings
        auth_payload = user_data.model_dump(exclude={'password'}, mode='json')
        
        res = await self.sign_up(
            email=user_data.email,
            password=user_data.password,
            data=auth_payload
        )
        
        if not res.user:
            return None

        public_data = user_data.model_dump(exclude={'password'}, mode='json')
        public_data["id"] = res.user.id

        try:
            sync_res = await self.insert("users", public_data)
            if not sync_res.data:
                raise Exception("Não foi possível criar o registro de perfil na tabela users.")
        except Exception as e:
            logger.error(f"Erro na sincronização do usuário {res.user.id}: {str(e)}")
            # Remove o usuário do Auth se a sincronização falhar para permitir nova tentativa
            await self.delete_user(res.user.id)
            raise e
            
        return {**public_data, "created_at": res.user.created_at}

    async def get_user_with_fallback(self, auth_res):
        user_id = auth_res.user.id
        public_res = await self.select("users", {"id": user_id})
        
        if public_res.data:
            return public_res.data[0]
            
        user_meta = auth_res.user.user_metadata
        return {
            "id": user_id,
            "email": auth_res.user.email,
            **user_meta
        }

    async def sign_in(self, email, password):
        return await self.client.auth.sign_in_with_password({
            "email": email, 
            "password": password
        })

    async def delete_user(self, user_id: str):
        return await self.client.auth.admin.delete_user(user_id)

    async def confirm_and_notify_interest(self, interest_id: int):
        res = await self.client.table("interests").update({"status": "Confirmado"}).eq("id", interest_id).execute()
        if not res.data:
            return None
            
        interest = res.data[0]
        req_res = await self.client.table("help_requests").select("title, ong_id").eq("id", interest['request_id']).execute()
        if req_res.data:
            req = req_res.data[0]
            ong_res = await self.client.table("ongs").select("organization_name").eq("id", req['ong_id']).execute()
            ong_name = ong_res.data[0]['organization_name'] if ong_res.data else "Uma ONG"

            await self.client.table("notifications").insert({
                "user_id": interest['user_id'],
                "title": "Ajuda Confirmada! 🎉",
                "message": f"A ONG {ong_name} aceitou sua oferta para '{req['title']}'. Contato liberado!"
            }).execute()
            
        return {"status": "success"}

    async def select(self, table, query_params=None, skip: int = None, limit: int = None):
        query = self.client.table(table).select("*")
        if skip is not None and limit is not None:
            query = query.range(skip, skip + limit - 1)
        if query_params:
            for key, value in query_params.items():
                query = query.eq(key, value)
        return await query.execute()

    async def insert(self, table, data):
        return await self.client.table(table).insert(data).execute()

    async def update(self, table, id, data):
        return await self.client.table(table).update(data).eq("id", id).execute()

    async def delete(self, table, id):
        return await self.client.table(table).delete().eq("id", id).execute()

async def get_supabase_service():
    client = await get_supabase_client()
    return SupabaseService(client)
