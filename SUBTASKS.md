# GRANULAR SUBTASKS BREAKDOWN
## PROYEK: whoiam
### SISTEM INTELIJEN MEDIA SOSIAL, FORENSIK GEOLOKASI & DETEKSI BUZZER 38 PROVINSI

---

**Nomor Dokumen**: SUBTASKS-WHOIAM-2026-002  
**Versi**: 3.0.0  
**Tanggal Inisiasi**: 22 Oktober 2026 (Terakhir Diperbarui: 27 Oktober 2026)  
**Status**: 100% EXECUTED & VERIFIED  
**Role**: `user`  
**Referensi Induk**: [TASKS.md](file:///e:/watax-player/TASKS.md)  

---

## 📋 DAFTAR SUBTASK TERINCI PER FASE

### FASE 1: Fondasi Proyek, Rebranding & Scaffolding
- [x] **SUBTASK-01.1**: Buat direktori `backend/` untuk layanan FastAPI dan `frontend/` untuk SPA Vite.
- [x] **SUBTASK-01.2**: Konfigurasi `package.json` dengan Vite 5, Apache ECharts 5, dan FontAwesome 6.
- [x] **SUBTASK-01.3**: Konfigurasi `requirements.txt` backend dengan FastAPI, Uvicorn, NetworkX, Httpx, dan BeautifulSoup4.
- [x] **SUBTASK-02.1**: Ubah konfigurasi identitas aplikasi menjadi `APP_NAME = "whoiam"`.
- [x] **SUBTASK-02.2**: Ubah judul web pada `index.html` menjadi `whoiam | Social Media Intelligence & Account Forensics`.
- [x] **SUBTASK-03.1**: Tetapkan default role pada payload backend ke `"role": "user"`.
- [x] **SUBTASK-04.1**: Ganti karakter non-ASCII pada stdout backend dengan prefix aman `[whoiam]`.

---

### FASE 2: Skenario Data Sosial & Engine Simulasi
- [x] **SUBTASK-05.1**: Definisikan dataset Key Opinion Leader, Botnet Amplifier, dan Netizen Organik.
- [x] **SUBTASK-06.1**: Susun skenario narasi manipulasi isu finansial, provokasi sosial, dan klarifikasi resmi.
- [x] **SUBTASK-07.1**: Implementasikan generator telemetri dengan distribusi probabilitas acak realistis.

---

### FASE 3: Core Analytic Engines (Bot, Hoax, SNA)
- [x] **SUBTASK-08.1**: Implementasikan EWSEngine dengan Moving Average dan formula Gaussian Z-Score.
- [x] **SUBTASK-09.1**: Kembangkan BotEngine dengan formula Unified Bot Index (Entropi, Temporal, Jaccard 3-gram).
- [x] **SUBTASK-10.1**: Kembangkan HoaxEngine dengan klasifikasi 5 taksonomi dan Explainable AI Rationale.
- [x] **SUBTASK-11.1**: Kembangkan SNAEngine berbasis graf berarah NetworkX untuk pemetaan jejaring sosial.
- [x] **SUBTASK-12.1**: Kembangkan SentimentEngine untuk analisis polaritas dan radar emosi publik.

---

### FASE 4: OSINT Scraper Engine (oEmbed & OpenGraph)
- [x] **SUBTASK-13.1**: Integrasikan scraper endpoint oEmbed X (Twitter) dan Meta Threads via `httpx.AsyncClient`.
- [x] **SUBTASK-14.1**: Ekstrak OpenGraph metadata (Instagram, Facebook, Web) menggunakan BeautifulSoup4.
- [x] **SUBTASK-15.1**: Hubungkan hasil ekstraksi OSINT langsung ke kalkulasi skor bot dan verifikasi hoaks.
- [x] **SUBTASK-16.1**: Implementasikan endpoint pencarian kata kunci/tagar percakapan sosial.

---

### FASE 5: Backend FastAPI REST & Data Contracts
- [x] **SUBTASK-17.1**: Susun skema data tervalidasi Pydantic di `backend/app/models/schemas.py`.
- [x] **SUBTASK-18.1**: Kembangkan antrian pesan telemetri asinkron (`StreamBus`) dan manajer WebSocket.
- [x] **SUBTASK-19.1**: Rancang endpoint REST modular untuk OSINT, Geo Buzzer, SNA, dan analitik.
- [x] **SUBTASK-20.1**: Implementasikan generator laporan investigasi forensik berformat Markdown.
- [x] **SUBTASK-21.1**: Konfigurasi FastAPI untuk melayani static single-page application langsung dari root `/`.

---

### FASE 6: Pembersihan Jargon Militer & Penyederhanaan UI
- [x] **SUBTASK-22.1**: Hapus terminologi DEFCON, militer, dan status perang dari antarmuka pengguna.
- [x] **SUBTASK-23.1**: Hapus seluruh tautan URL dummy contoh X/Threads/IG dan label Playwright dari tampilan.
- [x] **SUBTASK-24.1**: Rancang tata letak antarmuka 2-Tab: `PETA & SEBARAN BUZZER` dan `PELACAK AKUN MEDSOS`.
- [x] **SUBTASK-25.1**: Bangun komponen modal `GuideModal.js` untuk menyediakan panduan operasional pengguna.

---

### FASE 7: Ekspansi Peta Sebaran Buzzer Seluruh 38 Provinsi
- [x] **SUBTASK-26.1**: Susun database koordinat dan identitas lengkap 38 provinsi di `geo_buzzer_engine.py`.
- [x] **SUBTASK-27.1**: Buat endpoint `/api/v1/geo-buzzer/provinces` dan `/api/v1/geo-buzzer/national-summary`.
- [x] **SUBTASK-28.1**: Integrasikan peta Leaflet/Canvas dengan marker 38 provinsi berindikator risiko warna.
- [x] **SUBTASK-29.1**: Hubungkan crawling berita daerah terverifikasi dan cuplikan postingan medsos per provinsi.

---

### FASE 8: Forensik Ground Zero (Datetime Release) & Geolokasi BTS
- [x] **SUBTASK-30.1**: Kembangkan algoritma penentu akun pengunggah pertama ($T_0$) berdasarkan `date_time_release`.
- [x] **SUBTASK-30.2**: Susun linimasa perambatan narasi ($T+0\text{m}$, $T+3\text{m}$, $T+12\text{m}$, $T+35\text{m}$) dan kecepatan sebar.
- [x] **SUBTASK-31.1**: Kembangkan modul estimasi lokasi fisik: GPS Lat/Long, Menara BTS sektor, dan ISP backbone.
- [x] **SUBTASK-32.1**: Hubungkan tombol `[ 📍 Lihat di Peta ]` untuk memicu pemindahan kamera peta (*flyTo*) ke titik tersangka.
- [x] **SUBTASK-33.1**: Kembangkan visualisasi graf interkoneksi SNA lintas platform (X, Instagram, Facebook, TikTok).

---

### FASE 9: Pembersihan File Usang, Streamlined 2-Tab & Final QA
- [x] **SUBTASK-34.1**: Lakukan audit ketergantungan import terhadap seluruh file di `frontend/src/components/`.
- [x] **SUBTASK-34.2**: Hapus 10 komponen yang sudah tidak terpakai:
  - `CognitiveInspector.js`
  - `EmotionRadar.js`
  - `GeoBuzzerModal.js`
  - `HoaxSandbox.js`
  - `LiveFeedTicker.js`
  - `OsintModal.js`
  - `ReportModal.js`
  - `SimulatorControls.js`
  - `SnaGraphCanvas.js`
  - `SpikeMonitor.js`
- [x] **SUBTASK-35.1**: Pastikan `main.js` mengimpor dan merender 4 komponen aktif secara efisien.
- [x] **SUBTASK-36.1**: Jalankan kompilasi produksi `npm run build` dan pastikan zero lint / build error.
- [x] **SUBTASK-37.1**: Perbarui seluruh dokumentasi repositori (`README.md`, `PRD.md`, `BRD.md`, `FSD.md`, `SCAFFOLDING.md`, `TASKS.md`, `SUBTASKS.md`, dan folder `docs/`).
- [x] **SUBTASK-38.1**: Lakukan verifikasi runtime end-to-end pada server FastAPI dan frontend Vite.

---

### FASE 10: Fitur Forensik Lanjutan (Flight Lines, GAN & Comparator)
- [x] **SUBTASK-39.1**: Kembangkan algoritma rute transmisi isu lintas provinsi di `geo_buzzer_engine.py` dan endpoint `GET /api/v1/geo-buzzer/propagation-lines`.
- [x] **SUBTASK-39.2**: Implementasikan layer animasi ECharts `lines` dengan efek partikel panah dan tooltip kecepatan replikasi narasi di `GeoBuzzerView.js`.
- [x] **SUBTASK-40.1**: Integrasikan selector pills rentang waktu dinamis (`1 JAM`, `6 JAM`, `24 JAM`, `7 HARI`) pada toolbar peta intelijen.
- [x] **SUBTASK-41.1**: Rancang modul deteksi wajah sintetis (`avatar_forensics`) di `osint_engine.py` (StyleGAN3/Diffusion detector, simetri pupil, artefak).
- [x] **SUBTASK-41.2**: Tampilkan Pilar 4 (Deteksi Avatar AI GAN) pada kartu hasil inspeksi URL di `OsintInlineView.js`.
- [x] **SUBTASK-42.1**: Implementasikan engine komparasi korelasi 2 akun di `osint_engine.py` (Jaccard similarity, temporal gap delta, BTS proximity, single operator verdict).
- [x] **SUBTASK-42.2**: Bangun Sub-Tab 3 (*Side-by-Side Synchronicity Comparator*) di `PelacakAkunMedsosView.js` dengan preset testing dan scorecard komparasi.
- [x] **SUBTASK-43.1**: Kembangkan ekstraksi topik dan awan kata kunci (`topic_cloud`) di `osint_engine.py` dan render badge frekuensi di `PelacakAkunMedsosView.js`.

---

### FASE 11: Transformasi Modern Enterprise KOMANDO & Clean Code
- [x] **SUBTASK-44.1**: Rancang navigasi sidebar kiri responsif terpadu (`Sidebar.js`) dengan 4 rute utama (/dashboard, /peta-sebaran-buzzer, /pelacak-akun-medsos, /my-agent).
- [x] **SUBTASK-45.1**: Lokalisasi antarmuka secara penuh ke Bahasa Indonesia formal pada seluruh kartu ringkasan KPI, grafik, dan modal.
- [x] **SUBTASK-46.1**: Pasang `ResizeObserver` pada kontainer grafik jejaring aktor SNA (`#main-geo-sna-chart-container`) dan perbaiki `switchMainView('sna')` untuk inisialisasi kanvas tanpa delay.
- [x] **SUBTASK-47.1**: Implementasikan `loadAgents()` dan `saveAgentsToStorage()` berbasis `localStorage` pada `MyAgentView.js`.
- [x] **SUBTASK-48.1**: Hapus berkas komponen usang (`HeaderBar.js`, `DashboardView.js`, `OsintInlineView.js`) dengan git rm.
- [x] **SUBTASK-49.1**: Sambungkan callback selektor waktu TopBar ke pembaruan dinamis 4 kartu KPI di `KomandoDashboardView.js`.


