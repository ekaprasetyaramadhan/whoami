#!/usr/bin/env bash
# ======================================================================
# whoiam: Social Media Intelligence & Account Forensics Platform
# Launcher Script untuk Linux / macOS
# ======================================================================

set -e

echo "🔍 Memulai whoiam Platform (Role: User)..."

# Jalankan backend di background
echo "-> Menjalankan Backend FastAPI di port 8000..."
cd backend
python run.py &
BACKEND_PID=$!
cd ..

# Jalankan frontend di background
echo "-> Menjalankan Frontend Vite di port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Sistem whoiam Aktif:"
echo "   - Backend API: http://localhost:8000/docs"
echo "   - Dashboard UI: http://localhost:5173"

# Handler saat user menekan CTRL+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

wait
