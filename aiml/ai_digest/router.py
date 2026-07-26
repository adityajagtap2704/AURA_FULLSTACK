"""
FastAPI Router for AI Digest API

Exposes GET /api/digest/today
This is the ONLY integration surface for the frontend team.
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from aiml.ai_digest.schemas import DigestResponse
from aiml.ai_digest.digest_agent import AIDigestAgent

router = APIRouter(prefix="/api/digest", tags=["digest"])
agent_instance = AIDigestAgent()

@router.get("/today", response_model=DigestResponse)
async def get_today_digest(
    user_id: str = Query(default="demo-user", description="User ID"),
    tenant_id: str = Query(default="demo-tenant", description="Tenant ID"),
    date: Optional[str] = Query(default=None, description="ISO date YYYY-MM-DD (defaults to today)")
) -> DigestResponse:
    """
    Returns daily AI digest containing:
    1. Summary text (1-2 sentence executive overview)
    2. Top 3 priority items
    3. Meeting preparation notes for scheduled meetings
    """
    try:
        target_date = date or datetime.now().strftime("%Y-%m-%d")
        response = agent_instance.run(
            user_id=user_id,
            tenant_id=tenant_id,
            date=target_date
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate digest: {str(e)}")
