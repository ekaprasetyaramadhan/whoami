@echo off
TITLE whoiam - Social Media Intelligence & Forensics
COLOR 0B

echo ======================================================================
echo    whoiam: Social Media Intelligence & Account Forensics Platform
echo    Platform Analisis Akun & Deteksi Kredibilitas (Instagram, X, Threads)
echo ======================================================================
echo.
echo [1/3] Menyiapkan dependensi Backend & Frontend...

cd backend
start "whoiam Backend FastAPI [Port 8000]" cmd /k "python run.py"
cd ..

cd frontend
start "whoiam Frontend Vite Dev [Port 5173]" cmd /k "npm run dev"
cd ..

echo.
echo [2/3] Layanan berhasil dijalankan!
echo       - Backend & API Swagger: http://localhost:8000/docs
echo       - Dashboard UI: http://localhost:5173
echo.
echo [3/3] Membuka whoiam di Browser default...
timeout /t 3 >nul
start http://localhost:5173

echo.
echo ======================================================================
echo    SISTEM whoiam AKTIF DAN SIAP DIGUNAKAN (ROLE: USER).
echo    Tekan CTRL+C pada masing-masing jendela terminal untuk berhenti.
echo ======================================================================
pause
