# 🔍 whoiam
### Platform Intelijen Akun, Pemetaan Buzzer Nasional, & Forensik Media Sosial
**Social Media Intelligence, Account Forensics, & Ground Zero Detection (X, Instagram, Facebook, Threads)**  
*Cakupan Lengkap: **38 Provinsi di Seluruh Indonesia***

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4%2B-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Apache ECharts](https://img.shields.io/badge/ECharts-5.5%2B-aa344d?logo=apacheecharts&logoColor=white)](https://echarts.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker&logoColor=white)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/GitHub%20Actions-Automated%20Deploy-2088ff?logo=githubactions&logoColor=white)](https://github.com/ekaprasetyaramadhan/whoami/actions)
[![Production URL](https://img.shields.io/badge/Live%20Production-whoami.labados.my.id-10b981?logo=nginx&logoColor=white)](https://whoami.labados.my.id/)
[![Ethical Scraping](https://img.shields.io/badge/Scraping-robots.txt%20Compliant-00e5ff?logo=shield&logoColor=white)](#-desain-offline-ready--keamanan)

---

## 📌 DAFTAR ISI
1. [Latar Belakang & Visi](#-latar-belakang--visi)
2. [Pilar Fitur Utama](#-pilar-fitur-utama)
3. [Arsitektur Sistem (Modular Clean Code)](#-arsitektur-sistem)
4. [Struktur File & Komponen](#-struktur-file--komponen)
5. [Panduan Instalasi & Quick Start (1-Klik Run)](#-panduan-instalasi--quick-start)
6. [Dokumentasi API Endpoint](#-dokumentasi-api-endpoint)
7. [Ethical Scraping, Keamanan OWASP Top 10, & Responsivitas Multi-Device](#-desain-offline-ready--keamanan)

---

## 🎯 LATAR BELAKANG & VISI

Di era dinamika informasi digital, manipulasi opini publik, polarisasi isu daerah, dan penyebaran konten manipulatif (*Coordinated Inauthentic Behavior / CIB*) semakin marak terjadi di berbagai media sosial seperti **X (Twitter), Instagram, Facebook, dan Threads**.

Ketika suatu isu viral meledak di ranah publik, tim analis dan pengambil kebijakan kerap dihadapkan pada pertanyaan krusial:
> 1. *Siapa akun pertama pembawa narasi ini (Ground Zero / Patient Zero)?*
> 2. *Di mana lokasi fisik perangkat dan menara BTS pemancar postingan tersebut (Geolokalitas)?*
> 3. *Bagaimana jaringan akun tersebut terkoordinasi lintas medsos (X ↔ Instagram ↔ Facebook)?*
> 4. *Bagaimana fakta verifikasi resmi dari media massa terpercaya di daerah terkait?*

**whoiam** dibangun untuk menjawab kebutuhan ini melalui kokpit analitik terpadu yang memetakan persebaran buzzer secara geografis di **seluruh 38 provinsi di Indonesia**, mendeteksi titik awal pelepasan narasi, melacak geolokasi perangkat, serta menganalisis graf interkoneksi medsos secara intuitif tanpa jargon militer yang membingungkan.

---

## 🧠 PILAR FITUR UTAMA

### 1. Peta Sebaran Buzzer Nasional 38 Provinsi
- **Cakupan 38 Provinsi Lengkap**: Memetakan titik-titik buzzer dari Sabang sampai Merauke berdasarkan koordinat presisi.
- **Hierarki Kluster Aktor & Botnet**: Menampilkan **76 Koordinator Inti** yang mengendalikan **1.250+ Botnet Amplifiers** dengan jangkauan akumulatif hingga **36.800.000 netizen**.
- **Pill Badge Anti-Overlap**: Label nama kota dan reach diformat dalam kapsul dark-glass elegan dan otomatis mencegah teks ganda bertumpuk (*hideOverlap: true*).
- **Efek Pulsing & Radar Visual**: Titik koordinat memancarkan gelombang radar sesuai level ancaman (*Tinggi / Sedang*) dan besaran follower.

### 2. Deteksi Sumber Postingan Utama (Ground Zero / Patient Zero)
- **Analisis Waktu Rilis Presisi (`YYYY-MM-DD HH:mm:ss WIB`)**: Melacak postingan paling awal yang menjadi pencetus utama suatu narasi.
- **Kalkulasi Delta Propagasi (*Time-to-Spread*)**:
  - `T+00m00s`: **Akun Sumber Utama (Patient Zero)**.
  - `T+03m15s`: Amplifikasi otomatis oleh Botnet Farm.
  - `T+08m40s`: Kloning lintas platform (Facebook Group / Instagram Feed).
  - `T+19m10s`: Viralitas dan respons netizen organik.
- **Penanda Visual Emas**: Kartu banner penanda khusus `🎯 GROUND ZERO` di baris teratas feed scraper wilayah.

### 3. Forensik Geolokasi Presisi (Peta, GPS, & BTS ISP)
- **Koordinat Nyata**: Menampilkan Latitude & Longitude presisi dengan estimasi radius akurasi (`±25 meter`).
- **Sektor Menara BTS & ISP**: Identitas menara pemancar (*Cell Tower Sector*) dan backbone provider (*Telkomsel, Indosat, XL, Biznet*).
- **Interaksi Satu-Klik Fokus Peta**: Tombol **[ 📍 Lihat di Peta ]** yang secara otomatis mengarahkan, memperbesar, dan memfokuskan peta Indonesia ke titik koordinat asal akun.

### 4. Interkoneksi Lintas Medsos (Cross-Platform SNA)
- **Topologi Jaringan Terpadu**: Memvisualisasikan bagaimana akun di X berkoordinasi dengan akun cermin di Facebook dan Instagram.
- **Relasi Khusus**: Garis penghubung bertipe `CROSS_PLATFORM_SYNC`, `AMPLIFY_RETWEET`, `REPLY_COMMENT`, dan `COUNTER_NARRATIVE`.
- **Kategori Node Warna**: Emas (Ground Zero), Ungu (Hub Medsos), Oranye/Pink (Botnet Farm), Sian (Organik), dan Hijau (Humas Resmi Pemprov).

### 5. Crawling Berita Resmi Daerah Terverifikasi (Live Dewan Pers)
- **Live RSS News Crawler Real-Time**: Terkoneksi secara langsung untuk menarik 5–6 artikel berita terkini per provinsi secara live dari portal pers terakreditasi (*Antara News, Kompas, CNN Indonesia, Republika, Detik, Tribun Daerah*, dll.).
- **Debunking & Fact-Check Note**: Membandingkan framing buzzer medsos vs rilis resmi instansi berwenang secara *side-by-side*.
- **In-Memory Caching & Offline Fallback**: Menjamin performa cepat (cache 10 menit) serta fallback anggun ke basis data lokal jika sedang offline.

### 6. Pelacak Akun Medsos & OSINT Ingestion
- **Inspeksi URL Instan**: Menganalisis link cuitan/postingan (X, Instagram, Threads, Facebook) secara real-time.
- **Pencarian Tagar Live**: Menarik data postingan terkini berdasarkan kata kunci untuk memantau dinamika percakapan.

---

## 🏗️ ARSITEKTUR SISTEM

```
whoiam/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── geo_buzzer_router.py  # Router sebaran buzzer, berita, feeds, & SNA 38 provinsi
│   │   │   ├── osint_router.py       # Router investigasi URL & pencarian tagar
│   │   │   ├── cib_router.py         # Router analitik botnet
│   │   │   ├── hoax_router.py        # Router verifikasi hoax & XAI
│   │   │   └── ...
│   │   ├── core/
│   │   │   ├── geo_buzzer_engine.py  # Mesin intelijen 38 provinsi, geolokasi, & Ground Zero
│   │   │   ├── osint_engine.py       # Mesin scraping & OSINT profiling
│   │   │   └── ...
│   │   ├── config.py                 # Konfigurasi aplikasi
│   │   └── main.py                   # FastAPI application & router mounting
│   ├── requirements.txt              # Dependensi Python
│   └── run.py                        # Entrypoint backend lokal (Port 8000)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GeoBuzzerView.js      # Tampilan utama: Peta Indonesia, SNA, Berita, & Medsos
│   │   │   ├── OsintInlineView.js    # Tampilan pelacak akun, geolokasi radar, & SNA OSINT
│   │   │   ├── HeaderBar.js          # Header navigasi & logo
│   │   │   └── GuideModal.js         # Panduan penggunaan sistem
│   │   ├── services/
│   │   │   ├── api.js                # API Client REST
│   │   │   └── stream.js             # WebSocket Client
│   │   ├── state/
│   │   │   └── store.js              # Manajemen reactive state
│   │   ├── styles/                   # Tema Dark Cyber UI
│   │   └── main.js                   # Bootstrap aplikasi
│   ├── public/data/
│   │   └── indonesia-provinces.json  # GeoJSON peta 38 provinsi Indonesia
│   ├── index.html                    # Layout kokpit utama
│   └── package.json                  # Dependensi Vite & ECharts
├── Dockerfile                        # Multi-stage container build
├── docker-compose.yml                # Orkestrasi Docker
├── start.bat                         # 1-Klik Run untuk Windows
└── start.sh                          # 1-Klik Run untuk Linux/macOS
```

---

## 🚀 PANDUAN INSTALASI & QUICK START

Sistem **whoiam** dapat dijalankan dengan 3 pilihan cara mudah:

### Pilihan 1: Windows 1-Click Launcher (Direkomendasikan)
Cukup klik dua kali berkas **`start.bat`** pada direktori utama:
- Backend FastAPI (`http://127.0.0.1:8000`) dan Frontend Vite (`http://localhost:5173`) otomatis aktif.
- Browser default otomatis membuka dashboard **whoiam**.

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

---

## 📡 DOKUMENTASI API ENDPOINT

| Endpoint | Method | Deskripsi |
|---|:---:|---|
| `/api/v1/geo/buzzer-distribution` | `GET` | Mengambil persebaran buzzer (mendukung live ethical scraping per provinsi). |
| `/api/v1/geo/provinces-summary` | `GET` | Ringkasan statistik 38 provinsi (total buzzer, total reach, high risk count). |
| `/api/v1/geo/regional-news` | `GET` | Hasil crawling berita daerah live terverifikasi Dewan Pers vs isu narasi medsos. |
| `/api/v1/geo/social-feeds` | `GET` | Postingan medsos live & baseline dengan penanda Ground Zero, waktu rilis, & BTS. |
| `/api/v1/geo/province-sna/{province}` | `GET` | Topologi graf SNA interaksi dinamis buzzer vs botnet vs warganet organik. |
| `/api/v1/geo/propagation-lines` | `GET` | Kurva animasi aliran propagasi transmisi isu dari Ground Zero ke provinsi lain. |
| `/api/v1/osint/inspect-url` | `POST` | Analisis komprehensif URL medsos (bot index, hoax AI, geolokasi, audit robots.txt). |
| `/api/v1/osint/search-ingest` | `POST` | Penarikan narasi & cuitan live berdasarkan tagar/kata kunci pencarian. |
| `/api/v1/osint/check-robots` | `GET` | Audit instan kepatuhan robots.txt dan validasi Anti-SSRF pada domain/URL target. |
| `/api/v1/osint/compare-accounts` | `POST` | Komparasi berdampingan 2 akun untuk membuktikan keterkaitan operator tunggal. |

---

## 🛡️ ETHICAL SCRAPING, KEAMANAN OWASP TOP 10, & RESPONSIVITAS

1. **Ethical Web Scraping (`robots.txt` Compliance)**:
   - Menggunakan `ethical_scraper` berbasis `urllib.robotparser` untuk mematuhi direktif `User-agent`, `Disallow`, dan `Crawl-delay` pada setiap domain target.
   - Dilengkapi *in-memory cache* (TTL 1 jam) agar tidak membebani server tujuan.
2. **Hardening Keamanan OWASP Top 10**:
   - **Anti-SSRF (Server-Side Request Forgery)**: Melarang akses ke IP privat (RFC 1918), loopback, link-local, dan cloud metadata (`169.254.169.254`).
   - **Anti-XSS (Cross-Site Scripting)**: Sanitasi seluruh input dan respons dinamis via `escapeHtml()`.
   - **Content Security Policy (CSP)** & Subresource Integrity (SRI) pada berkas HTML.
   - **CORS Lockdown & Security Headers**: Strict-Origin-When-Cross-Origin, X-Content-Type-Options: nosniff, dan penyembunyian OpenAPI Swagger pada mode production.
3. **Desain Responsif Multi-Device**:
   - Layout adaptif untuk **Desktop (War Room 100vh)**, **Tablet (Split Stack & 2-Col KPI)**, dan **Smartphone / HP (Single Col, Touch Tab Swiping, Compact Cards)**.
4. **CI/CD Otomatis & Dockerized VPS**:
   - Terintegrasi penuh dengan GitHub Actions (`.github/workflows/deploy-vps.yml`) untuk deployment otomatis ke VPS Nginx Reverse Proxy ber-SSL Let's Encrypt di [https://whoami.labados.my.id/](https://whoami.labados.my.id/).

