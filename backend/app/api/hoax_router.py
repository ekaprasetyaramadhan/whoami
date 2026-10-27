"""
Hoax & Explainable AI Router
Endpoint verifikasi teks dan analisis propaganda transparan.
"""

from fastapi import APIRouter
from app.models.schemas import HoaxVerifyRequest, HoaxVerifyResponse
from app.core.hoax_engine import hoax_engine

router = APIRouter(prefix="/hoax", tags=["Hoax & Explainable AI"])

@router.post("/verify-text", response_model=HoaxVerifyResponse)
def verify_text(req: HoaxVerifyRequest):
    """
    Menganalisis teks berita atau cuitan untuk menentukan taksonomi kebenaran,
    tingkat keyakinan (confidence %), bukti pemicu, dan paragraf argumen rasional (XAI).
    """
    analysis_result = hoax_engine.classify_text(req.text)
    return {
        "status": "success",
        "data": analysis_result
    }
