"""
WebSocket Connection Manager
whoiam - Social Media Intelligence & Account Forensics
Mengelola koneksi klien WebSocket aktif dan menyiarkan data telemetri secara real-time.
"""

from typing import List
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[WS MANAGER] Klien terhubung. Total klien aktif: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"[WS MANAGER] Klien terputus. Sisa klien aktif: {len(self.active_connections)}")

    async def broadcast_json(self, data: dict):
        """Menyiarkan paket JSON ke seluruh klien yang terhubung."""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception as e:
                disconnected.append(connection)

        for dead_conn in disconnected:
            self.disconnect(dead_conn)

# Global Singleton WebSocket Manager
ws_manager = WebSocketManager()
