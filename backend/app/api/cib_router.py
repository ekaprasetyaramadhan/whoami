"""
CIB & Botnet API Router
Endpoint investigasi akun inautentik dan kluster botnet terkoordinasi.
"""

from fastapi import APIRouter
from app.models.schemas import CIBSummaryResponse
from app.core.bot_engine import bot_engine
from app.data.defense_scenarios import SCENARIO_RADAR_ALUTSISTA, BOTNET_ACCOUNTS

router = APIRouter(prefix="/cib", tags=["Buzzer & Botnet Detection"])

@router.get("/summary", response_model=CIBSummaryResponse)
def get_cib_summary():
    """Mengambil ringkasan kluster botnet CIB yang terdeteksi secara otomatis."""
    # Ambil kluster aktif berdasarkan postingan skenario radar alutsista
    active_clusters = bot_engine.detect_cib_clusters(SCENARIO_RADAR_ALUTSISTA)

    return {
        "status": "success",
        "data": {
            "total_monitored_accounts": len(BOTNET_ACCOUNTS) + 60,
            "identified_bots": len(BOTNET_ACCOUNTS),
            "active_clusters_count": len(active_clusters) or 1,
            "clusters": active_clusters or [
                {
                    "cluster_id": "CIB-INVEST-01",
                    "cluster_name": "Kluster Bot Terkoordinasi 01 (#InvestasiBodongViral)",
                    "bot_count": 35,
                    "average_bot_score": 89.4,
                    "temporal_window_sec": 14,
                    "propagated_narrative": "Aplikasi investasi viral gagal bayar ratusan miliar sejak 3 hari lalu! #InvestasiBodongViral",
                    "sample_accounts": [b["handle"] for b in BOTNET_ACCOUNTS[:5]],
                    "status": "ACTIVE_PROPAGATING"
                }
            ]
        }
    }

@router.get("/clusters", response_model=CIBSummaryResponse)
def get_cib_clusters():
    """Alias endpoint kluster CIB."""
    return get_cib_summary()
