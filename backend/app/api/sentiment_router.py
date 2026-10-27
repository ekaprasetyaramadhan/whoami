"""
Sentiment & Emotion Radar Router
Endpoint polaritas sentimen dan radar emosi 4 kuadran.
"""

from fastapi import APIRouter
from app.models.schemas import SentimentOverviewResponse
from app.core.sentiment_engine import sentiment_engine

router = APIRouter(prefix="/sentiment", tags=["Sentiment & Emotion Radar"])

@router.get("/overview", response_model=SentimentOverviewResponse)
def get_sentiment_overview():
    """Mengambil proporsi sentimen publik, radar 4 emosi, dan indeks polarisasi opini."""
    overview = sentiment_engine.get_overview()
    return {
        "status": "success",
        "data": overview
    }
