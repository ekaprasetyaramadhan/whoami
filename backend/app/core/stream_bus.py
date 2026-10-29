"""
Stream Bus & Real-time Ingestion Pipeline
whoiam - Social Media Intelligence & Account Forensics
Mengelola aliran data telemetri media sosial secara asinkron dengan kontrol simulasi.
"""

import asyncio
from typing import Callable, List
from app.data.defense_scenarios import generate_telemetry_post

class StreamBus:
    def __init__(self):
        self.queue = asyncio.Queue()
        self.subscribers: List[Callable] = []
        self.is_running = True
        self.speed_mode = "NORMAL"  # NORMAL (1.5s), TURBO (0.2s), PAUSED
        self.active_spike_count = 0
        self._worker_task = None

    def add_subscriber(self, callback: Callable):
        """Mendaftarkan fungsi subscriber untuk menerima setiap postingan baru."""
        self.subscribers.append(callback)

    def set_speed(self, mode: str):
        """Mengatur kecepatan aliran simulasi data."""
        if mode in ["NORMAL", "TURBO", "PAUSED"]:
            self.speed_mode = mode

    def inject_spike(self, intensity=25):
        """
        Menyuntikkan lonjakan pesan botnet provokatif secara instan
        untuk memicu anomali Z-score pada Early Warning System (EWS).
        """
        self.active_spike_count += intensity

    async def start(self):
        """Memulai background loop generator telemetri."""
        if self._worker_task is None or self._worker_task.done():
            self._worker_task = asyncio.create_task(self._generator_loop())

    async def emit(self, post: dict):
        """
        Memancarkan satu postingan ke seluruh subscriber (EWS, WebSocket, DB cache).
        Dipakai oleh generator loop maupun injeksi langsung dari ingestion OSINT.
        """
        for subscriber in self.subscribers:
            try:
                if asyncio.iscoroutinefunction(subscriber):
                    await subscriber(post)
                else:
                    subscriber(post)
            except Exception as e:
                print(f"[STREAM BUS ERROR] Gagal mendistribusikan post: {e}")

    async def _generator_loop(self):
        while self.is_running:
            if self.speed_mode == "PAUSED":
                await asyncio.sleep(0.5)
                continue

            # Tentukan apakah ada injeksi spike aktif
            is_spike = False
            if self.active_spike_count > 0:
                is_spike = True
                self.active_spike_count -= 1

            # Generate postingan baru
            post = generate_telemetry_post(is_spike=is_spike)

            # Notifikasi ke seluruh subscriber (EWS, WebSocket, DB cache)
            await self.emit(post)

            # Jeda waktu interval berdasarkan mode kecepatan
            if is_spike:
                await asyncio.sleep(0.1)  # Lonjakan cepat saat spike
            elif self.speed_mode == "TURBO":
                await asyncio.sleep(0.2)
            else:
                await asyncio.sleep(1.5)

# Global Singleton StreamBus instance
stream_bus = StreamBus()
