"""
Early Warning System (EWS) Engine
whoiam - Social Media Intelligence & Account Forensics
Mendeteksi anomali volume perbincangan (Spike Detection) menggunakan Z-Score
dan mengelola State Machine tingkat kesiagaan (Alert Level 5/3/1).
"""

import math
from datetime import datetime, timezone
from collections import deque
from app.config import DEFCON_LEVELS, SPIKE_THRESHOLD_YELLOW, SPIKE_THRESHOLD_RED

class EWSEngine:
    def __init__(self, history_window_size=30):
        self.history_window_size = history_window_size
        self.history_volume = deque(maxlen=history_window_size)
        self.current_minute_posts = 0
        self.last_minute_volume = 42  # Baseline awal (ppm: posts per minute)
        self.current_threat_level = "GREEN"
        self.current_defcon = 5
        self.active_alert = None
        self.alerts_history = []
        
        # Inisialisasi data historis sintetis baseline normal (35 - 55 post/menit)
        for val in [40, 42, 38, 45, 41, 39, 44, 46, 42, 40, 43, 41, 45, 42, 39]:
            self.history_volume.append(val)

    def record_post(self, post: dict):
        """Mencatat kemunculan postingan baru dalam interval berjalan."""
        self.current_minute_posts += 1

    def evaluate_tick(self, negative_ratio=0.2, bot_active=False, trigger_topic="Isu Pertahanan Nasional") -> dict:
        """
        Dieksekusi berkala untuk memperbarui kalkulasi statistik Z-score
        dan menentukan transisi status kesiagaan nasional.
        """
        # Catat volume menit terakhir ke riwayat
        current_vol = max(self.current_minute_posts * 4, 35) # Dikalikan faktor pemantauan
        self.history_volume.append(current_vol)
        self.last_minute_volume = current_vol
        self.current_minute_posts = 0  # Reset counter

        # 1. Hitung Mean (Rata-rata) dan Standar Deviasi
        n = len(self.history_volume)
        mean_vol = sum(self.history_volume) / n
        variance = sum((x - mean_vol) ** 2 for x in self.history_volume) / n
        std_vol = math.sqrt(variance)
        if std_vol < 1.0:
            std_vol = 1.0

        # 2. Hitung Z-Score Anomali
        z_score = (current_vol - mean_vol) / std_vol

        # 3. Evaluasi State Machine Defcon
        now_str = datetime.now(timezone.utc).isoformat()
        
        if z_score >= SPIKE_THRESHOLD_RED or (negative_ratio >= 0.50 and bot_active and z_score >= 2.0):
            self.current_threat_level = "RED"
            self.current_defcon = 1
            action_code = "DEFCON_1_EMERGENCY_BRIEFING"
            self.active_alert = {
                "alert_id": f"ALT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "level": "RED",
                "topic": trigger_topic,
                "z_score": round(z_score, 2),
                "velocity_ppm": current_vol,
                "triggered_at": now_str,
                "action": "Segera terbitkan rilis klarifikasi fakta via Dispenad dan lakukan pelacakan kluster CIB."
            }
            self.alerts_history.append(self.active_alert)
        elif z_score >= SPIKE_THRESHOLD_YELLOW or negative_ratio >= 0.35:
            self.current_threat_level = "YELLOW"
            self.current_defcon = 3
            action_code = "DEFCON_3_INTENSIVE_MONITORING"
            self.active_alert = {
                "alert_id": f"ALT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "level": "YELLOW",
                "topic": trigger_topic,
                "z_score": round(z_score, 2),
                "velocity_ppm": current_vol,
                "triggered_at": now_str,
                "action": "Tingkatkan frekuensi sampling telemetri dan pantau akun perantara (Bridge)."
            }
        else:
            self.current_threat_level = "GREEN"
            self.current_defcon = 5
            action_code = "DEFCON_5_ROUTINE"
            self.active_alert = None

        return self.get_current_status(z_score, current_vol, round(mean_vol, 1))

    def get_current_status(self, z_score=None, current_vol=None, baseline=None) -> dict:
        """Mengembalikan payload status telemetri EWS saat ini."""
        if z_score is None:
            n = len(self.history_volume)
            mean_vol = sum(self.history_volume) / n
            variance = sum((x - mean_vol) ** 2 for x in self.history_volume) / n
            std_vol = math.sqrt(variance) or 1.0
            current_vol = self.last_minute_volume
            z_score = (current_vol - mean_vol) / std_vol
            baseline = round(mean_vol, 1)

        defcon_meta = DEFCON_LEVELS[self.current_threat_level]

        return {
            "threat_level": self.current_threat_level,
            "defcon": self.current_defcon,
            "defcon_name": defcon_meta["name"],
            "defcon_color": defcon_meta["color"],
            "z_score": round(z_score, 2),
            "velocity_ppm": current_vol,
            "baseline_ppm": baseline,
            "spike_detected": z_score >= SPIKE_THRESHOLD_YELLOW,
            "active_alert": self.active_alert,
            "recent_volume_trend": list(self.history_volume)[-12:]
        }

# Global Singleton EWS Engine
ews_engine = EWSEngine()
