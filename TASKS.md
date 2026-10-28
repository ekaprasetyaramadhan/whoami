# WORK BREAKDOWN STRUCTURE & TASK TRACKER
## PROYEK: whoiam
### SISTEM INTELIJEN MEDIA SOSIAL, FORENSIK GEOLOKASI & DETEKSI BUZZER 38 PROVINSI

---

**Nomor Dokumen**: TASKS-WHOIAM-2026-003  
**Versi**: 3.2.0  
**Tanggal Inisiasi**: 22 Oktober 2026 (Terakhir Diperbarui: 28 Oktober 2026)  
**Status Proyek**: 100% IMPLEMENTED & VERIFIED  
**Role Pengguna**: `user`  
**Referensi**: [BRD.md](file:///e:/watax-player/BRD.md) | [PRD.md](file:///e:/watax-player/PRD.md) | [FSD.md](file:///e:/watax-player/FSD.md) | [SUBTASKS.md](file:///e:/watax-player/SUBTASKS.md) | [SCAFFOLDING.md](file:///e:/watax-player/SCAFFOLDING.md)  

---

## 📊 EXECUTIVE DASHBOARD PROGRESS

| Fase | Nama Fase | Jumlah Task | Selesai | Status |
|:---:|---|:---:|:---:|:---:|
| **FASE 1** | Fondasi Proyek, Rebranding & Scaffolding | 4 | 4 | `COMPLETED` |
| **FASE 2** | Skenario Data Sosial & Engine Simulasi | 3 | 3 | `COMPLETED` |
| **FASE 3** | Core Analytic Engines (Bot, Hoax, SNA) | 5 | 5 | `COMPLETED` |
| **FASE 4** | OSINT Scraper Engine (oEmbed & OpenGraph) | 4 | 4 | `COMPLETED` |
| **FASE 5** | Backend FastAPI REST & Data Contracts | 5 | 5 | `COMPLETED` |
| **FASE 6** | Pembersihan Jargon Militer & Penyederhanaan UI | 4 | 4 | `COMPLETED` |
| **FASE 7** | Ekspansi Peta Sebaran Buzzer Seluruh 38 Provinsi | 4 | 4 | `COMPLETED` |
| **FASE 8** | Forensik Ground Zero (Datetime Release) & Geolokasi BTS | 4 | 4 | `COMPLETED` |
| **FASE 9** | Pembersihan File Usang, Streamlined 2-Tab & Final QA | 5 | 5 | `COMPLETED` |
| **FASE 10** | Fitur Forensik Lanjutan (Flight Lines, GAN & Comparator) | 5 | 5 | `COMPLETED` |
| **FASE 11** | Responsivitas Multi-Device, Ethical Scraping & Live VPS | 5 | 5 | `COMPLETED` |
| **FASE 12** | UI/UX User Journey & Real-time Telemetry Ingestion | 4 | 4 | `COMPLETED` |
| **TOTAL** | **12 FASE UTAMA** | **52** | **52** | **100% COMPLETED** |

---

## 🏷️ LEGENDA PRIORITAS & STATUS

* **Prioritas**:
  - `P0 (Critical / Blocker)`: Fondasi arsitektur, 38 provinsi, Ground Zero, geolokasi, dan OSINT.
  - `P1 (High)`: Visualisasi interkoneksi SNA, pemantau berita daerah, dan integrasi peta.
  - `P2 (Normal / Polish)`: Buku panduan, dokumentasi Markdown, dan pembersihan file usang.
* **Status**:
  - `[x]` : Selesai Terverifikasi (*Completed*)

---

## 🚀 RINCIAN TASK PER FASE

### FASE 1: Fondasi Proyek, Rebranding & Scaffolding
- [x] **TASK-01 [P0] Inisiasi Struktur Direktori Monorepo `whoiam`**
- [x] **TASK-02 [P0] Rebranding Menyeluruh Aplikasi ke `whoiam`**
- [x] **TASK-03 [P0] Standarisasi Hak Akses & Peran Sistem ke `user`**
- [x] **TASK-04 [P1] Konfigurasi Environment & Windows Safe Logging**

### FASE 2: Skenario Data Sosial & Engine Simulasi
- [x] **TASK-05 [P0] Dataset Akun Simulasi Multi-Kategori**
- [x] **TASK-06 [P0] Dataset Kampanye Disinformasi Realistis**
- [x] **TASK-07 [P1] Generator Telemetri Otomatis & Kontrol Kecepatan**

### FASE 3: Core Analytic Engines (Bot, Hoax, SNA)
- [x] **TASK-08 [P0] Early Warning System (EWSEngine)**
- [x] **TASK-09 [P0] Buzzer & Botnet Detection (BotEngine)**
- [x] **TASK-10 [P0] Explainable Hoax Classifier (HoaxEngine)**
- [x] **TASK-11 [P0] Social Network Analysis (SNAEngine)**
- [x] **TASK-12 [P1] Sentiment & Emotion Radar (SentimentEngine)**

### FASE 4: OSINT Scraper Engine (oEmbed & OpenGraph)
- [x] **TASK-13 [P0] Ingestion Engine Metadata oEmbed (X/Twitter & Threads)**
- [x] **TASK-14 [P0] Scraper OpenGraph Metadata (Instagram, Facebook & Web)**
- [x] **TASK-15 [P0] Adapter Forensik Akun OSINT & Kalkulator Bot Index**
- [x] **TASK-16 [P1] Modul Search & War Room Ingestion Tagar Live**

### FASE 5: Backend FastAPI REST & Data Contracts
- [x] **TASK-17 [P0] Kontrak Data Pydantic Schemas Type-Safe**
- [x] **TASK-18 [P0] Pipa Streaming Asinkron (StreamBus & WebSocketManager)**
- [x] **TASK-19 [P1] Endpoint Router REST API Terpadu**
- [x] **TASK-20 [P1] Fast-Response Laporan Forensik Generator**
- [x] **TASK-21 [P1] Integrasi Single Page Application Serving**

### FASE 6: Pembersihan Jargon Militer & Penyederhanaan UI
- [x] **TASK-22 [P0] Eliminasi Total Istilah Militer (DEFCON, War Room Jargon)**
  - Mengubah terminologi menjadi bahasa forensik digital sipil yang ramah dan profesional.
- [x] **TASK-23 [P0] Penghapusan Contoh Link URL Dummy & Badge Playwright**
  - Menghapus link contoh X/Threads/IG yang tidak diperlukan sesuai arahan user.
- [x] **TASK-24 [P1] Desain Navigasi Tab Sederhana**
  - Mengganti modal bertumpuk dengan 2 tab terpusat: `PETA & SEBARAN BUZZER` dan `PELACAK AKUN MEDSOS`.
- [x] **TASK-25 [P1] Pembuatan Modal Buku Panduan Penggunaan (`GuideModal.js`)**

### FASE 7: Ekspansi Peta Sebaran Buzzer Seluruh 38 Provinsi
- [x] **TASK-26 [P0] Ekspansi Database Geografis 38 Provinsi Indonesia**
  - Menambahkan data lengkap seluruh 38 provinsi (termasuk Papua Barat Daya, Papua Selatan, Papua Tengah, Papua Pegunungan) dengan koordinat akurat.
- [x] **TASK-27 [P0] Endpoint REST `/api/v1/geo-buzzer/provinces` & `/province/{id}`**
  - Menghasilkan 76 simpul buzzer aktif dengan total reach nasional >36,8 juta impresi.
- [x] **TASK-28 [P0] Visualisasi Peta Interaktif Leaflet dengan 38 Marker Provinsi**
  - Menyediakan marker interaktif dengan kode warna risiko (Merah/Kuning/Hijau) dan filter provinsi instan.
- [x] **TASK-29 [P1] Komparasi Berita Resmi Daerah vs Postingan Medsos Buzzer**
  - Menyandingkan rilis berita terverifikasi Pemda/Polda dengan desas-desus media sosial di provinsi terpilih.

### FASE 8: Forensik Ground Zero (Datetime Release) & Geolokasi BTS
- [x] **TASK-30 [P0] Algoritma Deteksi Sumber Postingan Pertama (Ground Zero / Patient Zero)**
  - Mengidentifikasi akun sumber pertama, stempel waktu rilis absolut (`date_time_release`), dan linimasa propagasi waktu ($T+0\text{m}$, $T+3\text{m}$, dst.).
- [x] **TASK-31 [P0] Forensik Geolokasi Presisi & Sektor Menara BTS**
  - Menghitung koordinat GPS perangkat, sektor pemancar BTS terdekat, ISP backbone, dan tanda tangan perangkat.
- [x] **TASK-32 [P0] Tombol Interaktif `[ 📍 Lihat di Peta ]` (Fly-To Action)**
  - Mengintegrasikan navigasi otomatis kamera peta langsung ke titik koordinat perangkat tersangka.
- [x] **TASK-33 [P0] Interkoneksi Graf Lintas Media Sosial (Cross-Platform SNA)**
  - Menampilkan diagram jejaring hubungan antara X, Instagram, Facebook, TikTok, dan Bot Farms.

### FASE 9: Pembersihan File Usang, Streamlined 2-Tab & Final QA
- [x] **TASK-34 [P0] Identifikasi & Penghapusan 10 File Komponen Frontend Usang**
  - Menghapus 10 file yang sudah 0 referensi: `CognitiveInspector.js`, `EmotionRadar.js`, `GeoBuzzerModal.js`, `HoaxSandbox.js`, `LiveFeedTicker.js`, `OsintModal.js`, `ReportModal.js`, `SimulatorControls.js`, `SnaGraphCanvas.js`, `SpikeMonitor.js`.
- [x] **TASK-35 [P0] Integrasi Penuh 4 Komponen Aktif Frontend**
  - Memastikan antarmuka stabil hanya dengan `HeaderBar.js`, `GeoBuzzerView.js`, `OsintInlineView.js`, dan `GuideModal.js`.
- [x] **TASK-36 [P0] Validasi Zero-Error Build Produksi Vite**
  - Memastikan `npm run build` berhasil dalam waktu < 10 detik tanpa peringatan error.
- [x] **TASK-37 [P0] Sinkronisasi Seluruh Dokumentasi Teknis Markdown**
  - Memperbarui `README.md`, `PRD.md`, `BRD.md`, `FSD.md`, `SCAFFOLDING.md`, `TASKS.md`, `SUBTASKS.md`, dan direktori `docs/`.
- [x] **TASK-38 [P1] Verifikasi Layanan Berjalan Backend & Frontend**
  - Memastikan backend FastAPI di `http://127.0.0.1:8000` dan frontend di `http://localhost:5173` berjalan responsif.

### FASE 10: Fitur Forensik Lanjutan (Flight Lines, GAN & Comparator)
- [x] **TASK-39 [P0] Garis Propagasi Isu Antar-Provinsi (Migration Flight Lines)**
  - Implementasi animasi kurva transmisi isu ECharts dari Ground Zero ke provinsi tujuan beserta kecepatan dan volume replikasi.
- [x] **TASK-40 [P0] Filter Rentang Waktu Dinamis (1h, 6h, 24h, 7d)**
  - Bilah selektor pills waktu untuk memfilter rute penerbangan dan kepadatan buzzer.
- [x] **TASK-41 [P0] Deteksi Avatar AI / Wajah Sintetis (Synthetic Face GAN Detector)**
  - Analisis visi avatar profil medsos (StyleGAN3/Diffusion), probabilitas AI, simetri pupil mata, dan artefak bokeh.
- [x] **TASK-42 [P0] Komparasi 2 Akun Berdampingan (Side-by-Side Synchronicity Comparator)**
  - Pengujian korelasi dua URL akun (kesamaan leksikal Jaccard, selisih waktu delta, kedekatan BTS subnet, device fingerprint, dan vonis operator tunggal).
- [x] **TASK-43 [P1] Ekstraksi Topik & Awan Kata Kunci (Topic Cloud Badges)**
  - Menampilkan entitas kata kunci dominan yang diamplifikasi akun target beserta frekuensi dan tingkat ancaman.

### FASE 11: Responsivitas Multi-Device, Ethical Scraping & Live VPS
- [x] **TASK-44 [P0] Tata Letak Responsif Lintas Desktop, Tablet, & Smartphone / HP**
  - Implementasi media queries adaptif (`max-width: 1024px`, `768px`, `480px`) pada `warroom.css`, flex-wrapping bar kontrol, tab navigasi touch-scrollable, dan kartu KPI compact.
- [x] **TASK-45 [P0] Engine Ethical Scraping & Kepatuhan robots.txt (urllib.robotparser & Politeness Cache)**
  - Engine `ethical_scraper.py` untuk parsing direktif User-agent, Disallow, dan Crawl-delay dengan in-memory cache TTL 3600 detik.
- [x] **TASK-46 [P0] Live Regional Buzzer Harvester & Dynamic SNA Generation**
  - Engine `live_buzzer_harvester.py` untuk mengumpulkan konten regional live secara asinkron, menghitung skor bot dinamis, dan merender graf SNA dinamis.
- [x] **TASK-47 [P0] Validasi Keamanan Anti-SSRF & Endpoint Audit Robots.txt (`/check-robots`)**
  - Pencegahan SSRF (RFC 1918, link-local, loopback, cloud metadata), serta penyediaan endpoint instan audit `robots.txt` untuk verifikasi pengguna.
- [x] **TASK-48 [P0] Integrasi CI/CD GitHub Actions & Deployment Live VPS Docker Nginx SSL**
  - Workflow `.github/workflows/deploy-vps.yml` otomatis deploy ke server produksi live di `https://whoami.labados.my.id/`.

### FASE 12: UI/UX User Journey & Real-time Telemetry Ingestion
- [x] **TASK-49 [P0] Onboarding Tour Interaktif (`OnboardingModal.js`) & Tombol Tur Cepat**
  - Carousel panduan 3 langkah bagi pengguna baru, indikator titik progress, penyimpanan status di `localStorage`, dan tombol pemicu manual `[ 💡 TUR 1 MENIT ]` pada bilah atas.
- [x] **TASK-50 [P0] Breadcrumb Langkah, Preset Quick-Action Chips & Actionable Verdict Card**
  - Breadcrumb navigasi 3 langkah analitis, preset URL kasus viral/asli satu kali klik (`⚡ Contoh Kasus Hoaks Viral`, `⚡ Contoh Akun Warganet Asli`), chip tagar instan (`#bansos`, `#pilkada`, `#gempa`), dan kartu vonis detil dengan rekomendasi tindakan nyata.
- [x] **TASK-51 [P1] Glosarium Microcopy Sederhana & Contextual Tooltip Popovers `(?)`**
  - Penjelasan bahasa awam pada 5 pilar forensik (Bot Score, Sintesis AI, Sinkronisasi Koordinasi, Forensik Geolokasi, Kepatuhan Etis), serta tooltip popover pada seluruh label kontrol.
- [x] **TASK-52 [P0] Ingestion Aliran Data Telemetri Real-time via WebSocket, Floating Banner & Radar Pulse**
  - Propagasi event real-time `StreamBus` -> `/ws/telemetry` -> frontend, bilah floating toast notifikasi (`#main-geo-new-posts-banner`), sakelar `Auto-Stream Ingestion`, dan efek radar map pulse pada peta wilayah saat data masuk.
