"""
Main Entry Point FastAPI & Lifespan Event Pipeline
whoiam: Sistem Intelijen Media Sosial & Forensik Akun Terpadu
"""

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_NAME, APP_VERSION, APP_DESCRIPTION, API_PREFIX, ENVIRONMENT
from app.core.ws_manager import ws_manager
from app.core.stream_bus import stream_bus
from app.core.ews_engine import ews_engine
from app.core.sna_engine import sna_engine
from app.core.sentiment_engine import sentiment_engine

# Import Routers
from app.api.ews_router import router as ews_router
from app.api.cib_router import router as cib_router
from app.api.hoax_router import router as hoax_router
from app.api.sna_router import router as sna_router
from app.api.sentiment_router import router as sentiment_router
from app.api.report_router import router as report_router
from app.api.sim_router import router as sim_router
from app.api.osint_router import router as osint_router
from app.api.geo_buzzer_router import router as geo_buzzer_router

async def on_new_telemetry_post(post: dict):
    """
    Callback yang dieksekusi setiap kali StreamBus memancarkan postingan baru:
    1. Catat ke EWS volume tracker
    2. Perbarui graf SNA
    3. Perbarui riwayat sentimen & emosi
    4. Broadcast paket ke seluruh klien browser via WebSocket
    """
    ews_engine.record_post(post)
    sna_engine.update_with_post(post)
    sentiment_engine.record_post(post)

    # Broadcast event postingan baru
    await ws_manager.broadcast_json({
        "event_type": "NEW_TELEMETRY_POST",
        "payload": post
    })

    # Setiap 10 post, broadcast pembaruan status telemetri EWS
    if ews_engine.current_minute_posts % 5 == 0:
        await ws_manager.broadcast_json({
            "event_type": "TELEMETRY_REFRESH",
            "payload": ews_engine.get_current_status()
        })

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Daftarkan callback subscriber ke stream_bus dan mulai background loop
    print("=" * 70)
    print("[whoiam] MEMULAI SERVICE TELEMETRI MEDIA SOSIAL...")
    print("=" * 70)
    stream_bus.add_subscriber(on_new_telemetry_post)
    await stream_bus.start()
    yield
    # Shutdown
    print("[whoiam] SERVICE TELEMETRI DIMATIKAN.")
    stream_bus.is_running = False

# Sembunyikan dokumentasi OpenAPI/Swagger di production agar endpoint tidak di-scrape publik
docs_url = None if ENVIRONMENT == "production" else "/docs"
redoc_url = None if ENVIRONMENT == "production" else "/redoc"

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    docs_url=docs_url,
    redoc_url=redoc_url,
    lifespan=lifespan
)

# CORS Policy: Kunci domain hanya untuk domain resmi & dev lokal di mode production
allowed_origins = [
    "https://whoami.labados.my.id",
    "https://www.whoami.labados.my.id",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000"
] if ENVIRONMENT == "production" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrasi Router REST API ke prefix /api/v1
app.include_router(ews_router, prefix=API_PREFIX)
app.include_router(cib_router, prefix=API_PREFIX)
app.include_router(hoax_router, prefix=API_PREFIX)
app.include_router(sna_router, prefix=API_PREFIX)
app.include_router(sentiment_router, prefix=API_PREFIX)
app.include_router(report_router, prefix=API_PREFIX)
app.include_router(sim_router, prefix=API_PREFIX)
app.include_router(osint_router, prefix=API_PREFIX)
app.include_router(geo_buzzer_router, prefix=API_PREFIX)

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Cek apakah folder frontend/dist tersedia (misal saat running di Docker / Production)
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
ASSETS_DIR = os.path.join(DIST_DIR, "assets")
DATA_DIR = os.path.join(DIST_DIR, "data")

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="static-assets")

if os.path.exists(DATA_DIR):
    app.mount("/data", StaticFiles(directory=DATA_DIR), name="static-data")

@app.api_route("/", methods=["GET", "HEAD"])
def read_root():
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "role": "user",
        "description": APP_DESCRIPTION,
        "status": "OPERATIONAL",
        "docs": "/docs",
        "api_v1": API_PREFIX,
        "server_time": datetime.now(timezone.utc).isoformat()
    }

@app.get("/health")
def health_check():
    ews_status = ews_engine.get_current_status()
    return {
        "status": "healthy",
        "defcon_level": ews_status["threat_level"],
        "defcon_code": ews_status["defcon"],
        "ai_engines": {
            "ews_engine": "READY",
            "bot_cib_engine": "READY",
            "hoax_xai_engine": "READY",
            "sna_graph_engine": "READY",
            "sentiment_engine": "READY"
        },
        "stream_speed": stream_bus.speed_mode,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# WebSocket Endpoint Telemetri Real-time
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Kirim status inisialisasi awal ke klien yang baru terhubung
        await websocket.send_json({
            "event_type": "INITIAL_HANDSHAKE",
            "payload": {
                "ews_status": ews_engine.get_current_status(),
                "sentiment_overview": sentiment_engine.get_overview(),
                "message": "Terhubung ke Platform Analisis Akun whoiam"
            }
        })
        while True:
            # Dengarkan pesan kontrol/ping dari klien jika ada
            data = await websocket.receive_text()
            if data == "PING":
                await websocket.send_text("PONG")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS ERROR] Error koneksi: {e}")
        ws_manager.disconnect(websocket)

# SPA fallback handler untuk melayani asset publik dan rute SPA frontend
@app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
def serve_spa_or_static(full_path: str):
    target_file = os.path.join(DIST_DIR, full_path)
    if os.path.isfile(target_file):
        return FileResponse(target_file)
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"detail": "Not Found"}
