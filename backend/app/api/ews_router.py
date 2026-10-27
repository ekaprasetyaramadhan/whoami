"""
EWS API Router
Endpoint telemetri peringatan dini dan status kesiagaan Defcon.
"""

from fastapi import APIRouter
from app.models.schemas import EWSStatusResponse
from app.core.ews_engine import ews_engine

router = APIRouter(prefix="/ews", tags=["Early Warning System"])

@router.get("/telemetry", response_model=EWSStatusResponse)
def get_ews_telemetry():
    """Mengambil status telemetri lengkap EWS, nilai Z-score, dan tren volume."""
    data = ews_engine.get_current_status()
    return {"status": "success", "data": data}

@router.get("/status", response_model=EWSStatusResponse)
def get_ews_status():
    """Alias cepat untuk status kesiagaan EWS."""
    data = ews_engine.get_current_status()
    return {"status": "success", "data": data}
