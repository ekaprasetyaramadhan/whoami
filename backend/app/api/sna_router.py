"""
SNA Graph Router
Endpoint data topologi graf jaringan aktor siber sosial.
"""

from fastapi import APIRouter, Query
from app.models.schemas import SNAGraphResponse
from app.core.sna_engine import sna_engine

router = APIRouter(prefix="/sna", tags=["Social Network Analysis"])

@router.get("/graph-data", response_model=SNAGraphResponse)
def get_graph_data(min_influence: float = 0.0):
    """Mengambil data simpul dan hubungan interaksi untuk visualisasi graf War Room."""
    # Pastikan min_influence berupa float
    if hasattr(min_influence, 'default'):
        val = float(min_influence.default)
    else:
        val = float(min_influence)
    graph_export = sna_engine.get_graph_export(min_influence=val)
    return {
        "status": "success",
        "data": graph_export
    }
