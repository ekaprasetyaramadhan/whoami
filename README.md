# 🛡️ KOMANDO
### Komando Monitoring dan Analisis Narasi Digital Online
**Social Media Intelligence, Account Forensics, & Ground Zero Detection (X, Instagram, Facebook, TikTok, Threads)**  
*Cakupan Lengkap: **38 Provinsi di Seluruh Indonesia***

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4%2B-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Apache ECharts](https://img.shields.io/badge/ECharts-5.5%2B-aa344d?logo=apacheecharts&logoColor=white)](https://echarts.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker&logoColor=white)](https://www.docker.com/)
[![Offline Ready](https://img.shields.io/badge/Architecture-100%25%20Offline%20Ready-00e5ff?logo=shield&logoColor=white)](#-desain-offline-ready--keamanan)

---

## 📌 DAFTAR ISI
1. [Latar Belakang & Visi](#-latar-belakang--visi)
2. [4 Modul Utama Sistem](#-4-modul-utama-sistem)
3. [Arsitektur Sistem (Modular Clean Code)](#-arsitektur-sistem)
4. [Struktur File & Komponen](#-struktur-file--komponen)
5. [Panduan Instalasi & Quick Start (1-Klik Run)](#-panduan-instalasi--quick-start)
6. [Dokumentasi API Endpoint](#-dokumentasi-api-endpoint)
7. [Desain Offline-Ready & Keamanan](#-desain-offline-ready--keamanan)

---

## 🎯 LATAR BELAKANG & VISI

Di era dinamika informasi digital, manipulasi opini publik, polarisasi isu daerah, dan penyebaran konten manipulatif (*Coordinated Inauthentic Behavior / CIB*) semakin marak terjadi di berbagai media sosial seperti **X (Twitter), Instagram, Facebook, TikTok, dan Threads**.

Ketika suatu isu viral meledak di ranah publik, tim analis dan pengambil kebijakan kerap dihadapkan pada pertanyaan krusial:
> 1. *Siapa akun pertama pembawa narasi ini (Ground Zero / Patient Zero)?*
> 2. *Di mana lokasi fisik perangkat dan menara BTS pemancar postingan tersebut (Geolokalitas)?*
> 3. *Bagaimana jaringan akun tersebut terkoordinasi lintas medsos (X ↔ Instagram ↔ Facebook ↔ TikTok)?*
> 4. *Bagaimana fakta verifikasi resmi dari media massa terpercaya di daerah terkait?*

**KOMANDO** (*Komando Monitoring dan Analisis Narasi Digital Online*) dibangun untuk menjawab kebutuhan ini melalui kokpit analitik terpadu bergaya modern enterprise tactical center yang memetakan persebaran buzzer secara geografis di **seluruh 38 provinsi di Indonesia**, mendeteksi titik awal pelepasan narasi, melacak geolokasi perangkat, menjalankan agen AI otonom, serta menganalisis graf interkoneksi medsos secara intuitif.

---

## 🧠 4 MODUL UTAMA SISTEM

### 1. Dashboard Eksekutif Intelijen (`/dashboard`)
- **4 Kartu Metrik KPI Utama**: Total Percakapan, Total Interaksi, Total Tayangan / Potensi Jangkauan, dan Total Penulis/Akun terhubung reaktif dengan selektor rentang waktu (*24 Jam, 7 Hari, 30 Hari*).
- **Analisis Tren & Pangsa Suara (Share of Voice)**: Grafik multi-line harian dan Donut Chart sebaran platform digital.
- **Top Hashtags & Top Authors**: Peringkat 10 tagar teratas dan daftar akun/penulis paling berpengaruh.
- **Distribusi Jenis Kelamin & Kata Kunci Teratas**: Visualisasi demografi audiens serta awan kata kunci (*Word Cloud*) dengan tag sentiment (*Positif, Netral, Negatif*).
- **Distribusi Tipe Akun & Pelacak Viralitas**: Klasifikasi akun (Organik, Buzzer, Media, Institusi) dan monitoring kampanye viral terdeteksi.
- **Barometer Peringatan Dini DEFCON**: Skala ancaman real-time DEFCON 1 hingga 5 dengan indikator anomali Z-Score.

### 2. Peta Sebaran Buzzer 38 Provinsi (`/peta-sebaran-buzzer`)
- **Peta Interaktif ECharts GeoJSON**: Memetakan kluster buzzer di 38 provinsi dengan jalur propagasi penerbangan dinamis.
- **Jejaring Aktor (SNA Full Canvas)**: Analisis Social Network Analysis beresolusi penuh menggunakan layout gaya force-directed dengan rendering otomatis via ResizeObserver.
- **Deteksi Ground Zero (Patient Zero)**: Pelacakan akun pencetus awal dengan presisi stempel waktu dan delta propagasi.
- **Feed Medsos Live & Berita Daerah Terverifikasi**: Agregasi postingan media sosial serta komparasi langsung dengan berita media arus utama Dewan Pers di tiap provinsi.

### 3. Pelacak Akun Medsos (`/pelacak-akun-medsos`)
- **Multi-Platform OSINT Profiler**: Pencarian instan berdasarkan `@username`, link postingan, atau tagar di X, TikTok, Instagram, Facebook, Threads, dan YouTube.
- **Skor Probabilitas Bot Terpadu (*Unified Bot Score*)**: Pembobotan otomatis berdasarkan entropi teks semantik, burst temporal sinkronisasi postingan, dan in-degree amplifier kluster.
- **Tren Aktivitas Historis 30 Hari**: Grafik batang aktivitas postingan harian untuk mendeteksi lonjakan kampanye tidak wajar.

### 4. Agen Saya (`/my-agent`)
- **Workspace Manajemen Agen AI**: Pembuatan, pengeditan, dan pemantauan agen intelijen mandiri.
- **Simulasi Eksekusi Berjalan Interaktif**: Menjalankan tahapan pemindaian data stream, ekstraksi fitur semantik, dan koordinasi kluster CIB.
- **Persistensi State Lengkap**: Seluruh agen kustom dan riwayat eksekusi tersimpan aman di `localStorage` peramban.

---

## 🏗️ ARSITEKTUR SISTEM

```
watax-player/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth_router.py        # Router autentikasi operator
│   │   │   ├── geo_buzzer_router.py  # Router sebaran buzzer, berita, feeds, & SNA 38 provinsi
│   │   │   ├── osint_router.py       # Router investigasi URL & pencarian tagar
│   │   │   ├── cib_router.py         # Router analitik botnet & kluster CIB
│   │   │   ├── ews_router.py         # Router Early Warning System & DEFCON
│   │   │   ├── hoax_router.py        # Router verifikasi hoax & XAI
│   │   │   ├── report_router.py      # Router pelaporan situasi intelijen (Lapsit)
│   │   │   ├── sentiment_router.py   # Router analisis emosi & sentimen
│   │   │   ├── sim_router.py         # Router simulator inject anomali
│   │   │   └── sna_router.py         # Router graf jejaring sosial
│   │   ├── core/
│   │   │   ├── auth_service.py       # Autentikasi SQLite berbasis token bergaram
│   │   │   ├── bot_engine.py         # Algoritma heuristik bot probability score
│   │   │   ├── db.py                 # Inisialisasi basis data SQLite
│   │   │   ├── ews_engine.py         # Mesin kalkulasi Z-Score & lonjakan anomali
│   │   │   ├── geo_buzzer_engine.py  # Mesin intelijen 38 provinsi, geolokasi, & Ground Zero
│   │   │   ├── osint_engine.py       # Mesin scraping & OSINT profiling
│   │   │   ├── sentiment_engine.py   # Analisis polarisasi & kamus emosi
│   │   │   ├── sna_engine.py         # Algoritma graf NetworkX untuk sentralitas
│   │   │   ├── stream_bus.py         # Event bus streaming postingan latar belakang
│   │   │   └── ws_manager.py         # Manajer koneksi WebSocket real-time
│   │   ├── config.py                 # Konfigurasi aplikasi KOMANDO
│   │   └── main.py                   # FastAPI application & WebSocket mounting
│   ├── requirements.txt              # Dependensi Python
│   └── run.py                        # Entrypoint backend lokal (Port 8000)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js            # Navigasi kiri terintegrasi (Dashboard, Peta, Pelacak, Agen)
│   │   │   ├── TopBar.js             # Bar atas: toggle menu, filter rentang waktu, DEFCON pill
│   │   │   ├── LoginView.js          # Layar login tactical cyber center
│   │   │   ├── KomandoDashboardView.js# Dasbor eksekutif intelijen (KPI, Trend, SoV, Barometer)
│   │   │   ├── GeoBuzzerView.js      # Peta 38 provinsi, SNA Full Canvas, & Ground Zero
│   │   │   ├── PelacakAkunMedsosView.js# Forensik profil akun & pengukur probabilitas bot
│   │   │   ├── MyAgentView.js        # Ruang kerja agen intelijen mandiri (persistent)
│   │   │   └── GuideModal.js         # Panduan cara membaca sistem
│   │   ├── services/
│   │   │   ├── api.js                # API Client REST
│   │   │   ├── auth.js               # Manajemen sesi token pengguna
│   │   │   └── stream.js             # WebSocket Client Telemetri KOMANDO
│   │   ├── state/
│   │   │   └── store.js              # Manajemen reactive state global
│   │   ├── styles/                   # Tema Komando Clean Enterprise & Dark Accents
│   │   ├── router.js                 # Router client-side berbasis hash dengan auth-guard
│   │   └── main.js                   # Bootstrap aplikasi
│   ├── public/data/
│   │   └── indonesia-provinces.json  # GeoJSON peta 38 provinsi Indonesia
│   ├── index.html                    # Layout kokpit utama
│   └── package.json                  # Dependensi Vite & Apache ECharts
├── Dockerfile                        # Multi-stage container build
├── docker-compose.yml                # Orkestrasi Docker
├── start.bat                         # 1-Klik Run untuk Windows
└── start.sh                          # 1-Klik Run untuk Linux/macOS
```

---

## 🚀 PANDUAN INSTALASI & QUICK START

Sistem **KOMANDO** dapat dijalankan dengan 3 pilihan cara mudah:

### Pilihan 1: Windows 1-Click Launcher (Direkomendasikan)
Cukup klik dua kali berkas **`start.bat`** pada direktori utama:
- Backend FastAPI (`http://127.0.0.1:8000`) dan Frontend Vite (`http://localhost:5173`) otomatis aktif.
- Browser default otomatis membuka dashboard **KOMANDO**.

---

### Pilihan 2: Docker Compose
```bash
docker-compose up --build
```
Akses dashboard di `http://localhost:5173` atau `http://localhost:8000`.

---

### Pilihan 3: Manual Execution (Mode Pengembangan)

#### 1. Jalankan Backend (FastAPI):
```bash
cd backend
pip install -r requirements.txt
python run.py
```
> Backend berjalan di `http://127.0.0.1:8000` (Swagger UI: `http://127.0.0.1:8000/docs`)

#### 2. Jalankan Frontend (Vite):
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
> Frontend berjalan di `http://localhost:5173`

#### Kredensial Akses Bawaan:
- **Username**: `komando1` (atau `admin`)
- **Password**: `Komando2026!`

---

## 📡 DOKUMENTASI API ENDPOINT

| Endpoint | Method | Deskripsi |
|---|:---:|---|
| `/api/v1/auth/login` | `POST` | Autentikasi operator dan pembuatan sesi Bearer token. |
| `/api/v1/auth/me` | `GET` | Pengambilan profil operator aktif berdasarkan token sesi. |
| `/api/v1/geo/buzzer-distribution` | `GET` | Mengambil titik koordinat buzzer, estimasi pengikut, level ancaman, dan platform. |
| `/api/v1/geo/provinces-summary` | `GET` | Ringkasan statistik 38 provinsi (total buzzer, total reach, high risk count, narasi dominan). |
| `/api/v1/geo/regional-news` | `GET` | Hasil crawling berita daerah terverifikasi Dewan Pers vs isu narasi medsos. |
| `/api/v1/geo/social-feeds` | `GET` | Postingan medsos dengan penanda Ground Zero, waktu rilis presisi, dan geolokasi BTS. |
| `/api/v1/geo/province-sna/{province}` | `GET` | Topologi graf SNA interkoneksi lintas medsos, botnet relay, dan klarifikasi resmi. |
| `/api/v1/osint/inspect-url` | `POST` | Analisis komprehensif URL postingan/akun (bot score, geolokasi, timeline rilis, SNA). |
| `/api/v1/osint/search-ingest` | `POST` | Penarikan data cuitan live berdasarkan tagar/kata kunci pencarian. |
| `/api/v1/ews/telemetry` | `GET` | Status deteksi lonjakan anomali volume percakapan dan level DEFCON. |
| `/api/v1/reports/export-lapsit` | `POST` | Kompilasi laporan situasi intelijen (Lapsit) siap cetak. |

---

## 🛡️ DESAIN OFFLINE-READY & KEAMANAN

1. **100% Offline Ready**: Seluruh pustaka JavaScript (Apache ECharts, FontAwesome), font IBM Plex / Space Grotesk, serta GeoJSON batas wilayah Indonesia telah disimpan secara lokal.
2. **Kedaulatan & Kerahasiaan Data**: Pemrosesan analitik bot index, verifikasi fakta, dan pemetaan graf dijalankan secara on-premise tanpa ketergantungan pada API komersial eksternal.
3. **Standar Kepatuhan Forensik OSINT**: Sistem hanya mengagregasi data publik terbuka dan tidak melanggar privasi pengguna (*zero private credentials scraping*).
