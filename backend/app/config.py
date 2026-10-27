"""
Konfigurasi Aplikasi whoiam
Platform Intelijen Akun & Forensik Media Sosial (Social Media Intelligence & Account Forensics)
"""

import os

APP_NAME = "whoiam"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "Platform Intelijen Akun & Forensik Media Sosial (Instagram, X, Facebook, Threads)"
API_PREFIX = "/api/v1"

# Alert Levels Definition (Normal, Waspada, Krisis)
DEFCON_LEVELS = {
    "GREEN": {
        "code": 5,
        "name": "KONDISI NORMAL",
        "description": "Aktivitas percakapan media sosial dalam batas wajar. Tidak ada anomali terdeteksi.",
        "color": "#10b981",
        "accent": "text-emerald-400"
    },
    "YELLOW": {
        "code": 3,
        "name": "KONDISI WASPADA",
        "description": "Terdeteksi lonjakan volume atau peningkatan sentimen negatif. Analisis akun mencurigakan diaktifkan.",
        "color": "#f59e0b",
        "accent": "text-amber-400"
    },
    "RED": {
        "code": 1,
        "name": "KONDISI ANOMALI KRISIS",
        "description": "Anomali masif terdeteksi! Keterlibatan botnet terkoordinasi (CIB) & narasi disinformasi viral.",
        "color": "#ef4444",
        "accent": "text-red-500"
    }
}

# Detection Thresholds
SPIKE_THRESHOLD_YELLOW = 1.8
SPIKE_THRESHOLD_RED = 3.0
BOT_SCORE_THRESHOLD = 70.0
CIB_TIME_WINDOW_SEC = 60
CIB_SIMILARITY_THRESHOLD = 0.80

# Environment Mode
ENVIRONMENT = os.getenv("APP_ENV", "development")
IS_DEBUG = os.getenv("DEBUG", "True").lower() == "true"
