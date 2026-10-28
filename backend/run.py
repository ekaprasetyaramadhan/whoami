"""
Local Development Server Runner for whoiam
Menjalankan server FastAPI backend pada http://127.0.0.1:8000
"""

import uvicorn
import os
import sys

# Menambahkan direktori backend ke sys.path agar impor modul app berjalan mulus
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    reload = os.environ.get("RELOAD", "true").lower() == "true"
    print("=" * 70)
    print("[whoiam] Social Media Intelligence & Account Forensics Platform")
    print(f"Memulai server API Backend pada http://0.0.0.0:{port}")
    print(f"Dokumentasi Swagger API: http://0.0.0.0:{port}/docs")
    print("Role: User")
    print("=" * 70)
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=reload)
