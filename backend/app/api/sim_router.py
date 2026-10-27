"""
Simulator Controls API Router
Endpoint untuk mengendalikan jalannya simulator data dan memicu lonjakan serangan mendadak (Spike Injection).
"""

from fastapi import APIRouter
from app.models.schemas import SimulatorSpikeResponse, SimulatorControlRequest, SimulatorControlResponse
from app.core.stream_bus import stream_bus
from app.core.ews_engine import ews_engine

router = APIRouter(prefix="/sim", tags=["Simulator Controls"])

@router.post("/inject-spike", response_model=SimulatorSpikeResponse)
def trigger_spike_attack():
    """
    Menyuntikkan lonjakan 30 cuitan botnet manipulasi secara instan
    untuk memicu kondisi darurat Z-Score pada EWS (ALERT LEVEL 1 KRISIS).
    """
    stream_bus.inject_spike(intensity=30)
    
    # Catat lonjakan ke EWS
    for _ in range(50):
        ews_engine.record_post({})
    
    # Evaluasi status ancaman ke kondisi RED
    ews_engine.evaluate_tick(
        negative_ratio=0.75,
        bot_active=True,
        trigger_topic="Operasi Kampanye Disinformasi Finansial Terkoordinasi (#InvestasiBodongViral)"
    )

    return {
        "status": "success",
        "message": "Lonjakan anomali akun terkoordinasi berhasil disuntikkan ke aliran telemetri.",
        "injected_count": 30,
        "simulated_incident": "Kampanye Disinformasi Terkoordinasi (#InvestasiBodongViral)"
    }

@router.post("/control", response_model=SimulatorControlResponse)
def control_simulation_speed(req: SimulatorControlRequest):
    """Mengatur kecepatan aliran simulasi data (NORMAL, TURBO, PAUSED)."""
    stream_bus.set_speed(req.speed)
    return {
        "status": "success",
        "speed_mode": stream_bus.speed_mode
    }
