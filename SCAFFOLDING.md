# PROJECT SCAFFOLDING & ARCHITECTURAL BLUEPRINT
## PROYEK: whoiam
### SISTEM INTELIJEN MEDIA SOSIAL, FORENSIK GEOLOKASI & DETEKSI BUZZER 38 PROVINSI

---

**Nomor Dokumen**: SCAF-WHOIAM-2026-003  
**Versi**: 3.1.0  
**Tanggal Rilis**: 27 Oktober 2026  
**Status**: ACTIVE PRODUCTION BLUEPRINT  
**Role Pengguna**: `user`  

---

## 1. IKHTISAR TEKNOLOGI & TECH STACK

| Komponen | Teknologi | Versi | Tanggung Jawab & Alasan Pemilihan |
|---|---|---|---|
| **Backend Framework** | **FastAPI** (Python) | `>= 0.115.0` | Framework asinkron berkecepatan tinggi dengan validasi Pydantic terintegrasi dan responsivitas cepat. |
| **ASGI Web Server** | **Uvicorn** | `>= 0.32.0` | Server ASGI standar industri untuk melayani HTTP REST dan WebSocket. |
| **Peta Interaktif** | **Apache ECharts (GeoJSON Indonesia)** | `v5.5.1` | Visualisasi peta geografis 38 provinsi, node persebaran koordinator, dan garis terbang propagasi isu (*flight lines*). |
| **Visualisasi Graf Jaringan** | **Apache ECharts** | `v5.5.1` | Pustaka visualisasi tingkat enterprise untuk Graf SNA Lintas Media Sosial (Force-Directed Graph). |
| **OSINT Scraper** | **HTTPX & BeautifulSoup4** | `>= 0.28.0` / `>= 4.12.0` | Klien HTTP asinkron untuk scraping oEmbed (X/Twitter, Threads) dan ekstraksi OpenGraph metadata HTML. |
| **Live News Crawler** | **Python RSS Feed Engine** | Native/Httpx | Crawler live Google News RSS Indonesia (Dewan Pers terakreditasi) dengan cache in-memory 10 menit. |
| **Analisis Graf Backend** | **NetworkX** | `>= 3.4.0` | Algoritma komputasi graf tingkat lanjut untuk sentralitas dan keterhubungan simpul. |
| **Frontend Core** | **Vanilla JavaScript (ES6 Modules)** | Native Browser | Performa instan tanpa beban virtual DOM, interaksi DOM langsung untuk efisiensi tinggi. |
| **Frontend Bundler** | **Vite** | `v5.4.21` | Tooling modern dengan build produksi yang cepat dan Hot Module Replacement (HMR). |
| **Iconography** | **FontAwesome Free** | `v6.7.2` | Kumpulan ikon cyber-forensik profesional. |
| **Typography** | **Google Fonts** | Hosted/CDN | `Space Grotesk` (Header & Judul), `IBM Plex Sans` (Body Text), `IBM Plex Mono` (Data Forensik). |

---

## 2. STRUKTUR DIREKTORI REPOSITORI AKTIF

```
e:\watax-player\
├── .gitignore                          # Pengabaian git (node_modules, __pycache__, dist)
├── BRD.md                              # Business Requirements Document (v3.1.0)
├── PRD.md                              # Product Requirements Document (v3.1.0)
├── FSD.md                              # Functional Specification Document (v3.1.0)
├── TASKS.md                            # Work Breakdown Structure & Task Tracker
├── SUBTASKS.md                         # Granular Subtasks Breakdown
├── SCAFFOLDING.md                      # Blueprint Arsitektur & Struktur Direktori (v3.1.0)
├── README.md                           # Dokumentasi utama dan panduan operasional
├── Dockerfile                          # Multi-stage docker image build
├── docker-compose.yml                  # Konfigurasi orkestrasi kontainer
├── start.bat                           # Script one-click launcher untuk Windows
├── start.sh                            # Script one-click launcher untuk Linux / macOS
│
├── backend/                            # === LAYANAN BACKEND (FASTAPI) ===
│   ├── requirements.txt                # Dependensi paket Python
│   ├── run.py                          # Launcher server Uvicorn (port 8000)
│   ├── tests/                          # Pengujian otomatis unit tests (pytest)
│   │   ├── __init__.py
│   │   └── test_engines.py             # 5 unit tests validasi analytic engines
│   └── app/                            # Paket aplikasi backend
│       ├── __init__.py
│       ├── config.py                   # Konfigurasi aplikasi (APP_NAME = "whoiam", port, host)
│       ├── main.py                     # Entrypoint FastAPI, CORS, router mounting, static SPA
│       ├── api/                        # Router endpoint REST API
│       │   ├── __init__.py
│       │   ├── geo_buzzer_router.py    # UTAMA: 38 Provinsi, Ground Zero, Flight Lines, Geofix, News, SNA
│       │   ├── osint_router.py         # UTAMA: URL Inspect, GAN Detector, Compare Accounts, Search
│       │   ├── cib_router.py           # Kompatibilitas: Kluster botnet CIB
│       │   ├── ews_router.py           # Kompatibilitas: Early Warning System status
│       │   ├── hoax_router.py          # Kompatibilitas: XAI Hoax classification
│       │   ├── sna_router.py           # Kompatibilitas: Global SNA network graph
│       │   ├── sentiment_router.py     # Kompatibilitas: Sentiment & Emotion overview
│       │   ├── report_router.py        # Kompatibilitas: Laporan forensik generator
│       │   └── sim_router.py           # Kompatibilitas: Simulator telemetri kontrol
│       ├── core/                       # Core Analytic & Forensics Engines
│       │   ├── __init__.py
│       │   ├── geo_buzzer_engine.py    # UTAMA: 38 Provinsi DB, Ground Zero, Flight Lines, BTS, News RSS
│       │   ├── osint_engine.py         # UTAMA: URL Profiler, GAN Detector, Topic Cloud, Compare Accounts
│       │   ├── bot_engine.py           # Unified Bot Index (Entropi, Sinkronisasi, Jaccard)
│       │   ├── hoax_engine.py          # Explainable AI Rationale & 5 Taksonomi
│       │   ├── sna_engine.py           # Algoritma analisis graf jaringan (NetworkX)
│       │   ├── sentiment_engine.py     # Analisis polaritas sentimen & spektrum emosi
│       │   ├── stream_bus.py           # Antrian event telemetri asinkron
│       │   ├── ews_engine.py           # Engine moving average & z-score
│       │   └── ws_manager.py           # Koneksi & broadcast WebSocket
│       ├── data/                       # Dataset dan skenario simulasi
│       │   ├── __init__.py
│       │   ├── defense_scenarios.py    # Profil akun & template narasi simulasi
│       │   └── keywords.py             # Kamus kata kunci dan evidensi token
│       └── models/                     # Skema data Pydantic type-safe
│           ├── __init__.py
│           └── schemas.py              # Pydantic data contracts
│
├── frontend/                           # === LAYANAN FRONTEND (VITE SPA) ===
│   ├── package.json                    # Konfigurasi npm package dan build scripts
│   ├── index.html                      # Template HTML utama dashboard 2-Tab
│   ├── public/                         # Aset publik statis (data/indonesia-provinces.json, favicon)
│   ├── dist/                           # Direktori hasil build produksi (Vite compilation)
│   └── src/                            # Kode sumber antarmuka
│       ├── main.js                     # Inisialisasi aplikasi dan tab switching
│       ├── index.css                   # Sistem styling Glassmorphism Dark Mode
│       ├── components/                 # Modul komponen UI AKTIF (4 Komponen Bersih)
│       │   ├── HeaderBar.js            # Identitas sistem, 2-tab switch, tombol buku panduan
│       │   ├── GeoBuzzerView.js        # TAB 1: Peta 38 Provinsi, Flight Lines, Timeframe, SNA, News
│       │   ├── OsintInlineView.js      # TAB 2: Bedah URL, Lacak Tagar, GAN Forensics, Compare 2 Akun
│       │   └── GuideModal.js           # Modal: Buku Panduan Operasional Sistem & Glosarium
│       ├── services/                   # Layanan komunikasi HTTP & WebSocket
│       │   ├── api.js                  # Klien API fetch wrapper ke backend FastAPI
│       │   └── stream.js               # Handler stream koneksi
│       ├── state/                      # State Management
│       │   └── store.js                # CognitiveStore (Observer Pub/Sub pattern)
│       └── styles/                     # CSS Modular
│           ├── components.css          # Gaya visual kartu dan widget
│           ├── variables.css           # Token warna desain (Cyan, Amber, Crimson, Dark)
│           └── warroom.css             # Penataan layout dan kontainer
│
└── docs/                               # === DOKUMENTASI PENDUKUNG & PRESENTASI ===
    ├── README.md                       # Indeks dokumentasi pendukung
    ├── PROPOSAL-TEKNIS.md              # Proposal teknis arsitektur solusi whoiam
    ├── SKRIP-VIDEO-DEMO.md             # Panduan skenario demonstrasi video walk-through
    └── SLIDE-PRESENTASI.md             # Materi slide presentasi sistem whoiam
```

---

## 3. AUDIT PEMBERSIHAN FILE USANG (CLEANUP LOG)

Untuk menjaga performa dan kebersihan arsitektur, 10 file komponen lama yang sudah usang dan digantikan oleh arsitektur 2-Tab telah **dihapus sepenuhnya** dari `frontend/src/components/`:

| File Dihapus | Alasan Penghapusan & Pengganti |
|---|---|
| `CognitiveInspector.js` | Digantikan oleh kartu profil dan rincian XAI inline di `OsintInlineView.js` dan `GeoBuzzerView.js`. |
| `EmotionRadar.js` | Digantikan oleh grafik visualisasi interkoneksi SNA dan metrik risiko provinsi. |
| `GeoBuzzerModal.js` | Digantikan oleh tampilan halaman penuh interaktif `GeoBuzzerView.js`. |
| `HoaxSandbox.js` | Digantikan oleh analisis inline postingan pada `OsintInlineView.js`. |
| `LiveFeedTicker.js` | Dihapus karena menyita ruang layar; digantikan oleh feed postingan per provinsi. |
| `OsintModal.js` | Digantikan oleh tampilan ruang kerja mandiri `OsintInlineView.js`. |
| `ReportModal.js` | Disederhanakan untuk efisiensi alur kerja tanpa popup yang bertumpuk. |
| `SimulatorControls.js` | Dihapus demi kesederhanaan operasional antarmuka. |
| `SnaGraphCanvas.js` | Diintegrasikan langsung ke dalam kanvas SNA provinsi dan SNA lintas medsos. |
| `SpikeMonitor.js` | Digantikan oleh indikator kecepatan propagasi Ground Zero ($T_0$ delta). |

Hasil verifikasi: Kompilasi build `npm run build` berhasil 100% tanpa error, menghasilkan bundle produksi optimal.

---

## 4. MATRIKS INTEGRASI ARUS DATA ANTAR MODUL

```
+-------------------------------------------------------------------------------------------------------+
| Komponen UI           | Sumber Data API                 | Data Kunci yang Dirender                     |
+-------------------------------------------------------------------------------------------------------+
| HeaderBar.js          | State Store                     | Navigasi 2-Tab, Logo, Tombol Buku Panduan    |
| GeoBuzzerView.js      | /geo-buzzer/provinces           | 38 Marker Peta, Indikator Risiko, Total Reach|
|                       | /geo-buzzer/province/{id}       | Ground Zero, Datetime Release, Koordinat BTS,|
|                       |                                 | Berita Resmi Daerah vs Medsos, SNA Provinsi  |
| OsintInlineView.js    | /osint/inspect-url              | Profil Akun, Unified Bot Score, Ground Zero  |
|                       |                                 | Timeline Mutasi, Geofix BTS, Cross-SNA       |
| GuideModal.js         | Statis / Lokal                  | Panduan Penggunaan, Penjelasan 5 Fitur Utama |
+-------------------------------------------------------------------------------------------------------+
```
