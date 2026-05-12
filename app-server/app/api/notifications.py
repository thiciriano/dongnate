from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..services.supabase_service import SupabaseService, get_supabase_service

router = APIRouter(prefix="/v1/notifications", tags=["notifications"])

@router.get("/{user_id}")
async def get_notifications(user_id: str, service: SupabaseService = Depends(get_supabase_service)):
    try:
        res = await service.client.table("notifications") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: int, service: SupabaseService = Depends(get_supabase_service)):
    try:
        await service.client.table("notifications").update({"is_read": True}).eq("id", notification_id).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
