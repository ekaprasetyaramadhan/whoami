# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## PROYEK: KOMANDO
### KOMANDO MONITORING DAN ANALISIS NARASI DIGITAL ONLINE
**Sistem Intelijen Media Sosial, Forensik Akun, & Peta Sebaran Buzzer 38 Provinsi**

---

**Nomor Dokumen**: PRD-KOMANDO-2026-003  
**Versi**: 4.0.0  
**Tanggal Rilis**: 29 Oktober 2026  
**Status**: APPROVED & PRODUCTION READY  
**Target Pengguna**: Analis Intelijen Media Sosial, Tim Forensik Siber, Pemeriksa Fakta & Penyelidik OSINT  
**Role Pengguna**: `user`, `admin`  

---

## DAFTAR ISI

1. [RINGKASAN PRODUK & PRINSIP DESAIN](#1-ringkasan-produk--prinsip-desain)
2. [4 MODUL UTAMA APLIKASI](#2-4-modul-utama-aplikasi)
3. [FEATURE MATRIX & HIERARKI AKSES](#3-feature-matrix--hierarki-akses)
4. [SPESIFIKASI DETAIL MODUL APLIKASI](#4-spesifikasi-detail-modul-aplikasi)
   - [4.1 Modul 01: Dashboard Eksekutif Intelijen](#41-modul-01-dashboard-eksekutif-intelijen)
   - [4.2 Modul 02: Peta & Sebaran Buzzer Nasional 38 Provinsi](#42-modul-02-peta--sebaran-buzzer-nasional-38-provinsi)
   - [4.3 Modul 03: Deteksi Ground Zero & Forensik Geolokasi](#43-modul-03-deteksi-ground-zero--forensik-geolokasi)
   - [4.4 Modul 04: Pelacak Akun Medsos & OSINT Profiler](#44-modul-04-pelacak-akun-medsos--osint-profiler)
   - [4.5 Modul 05: Workspace Agen AI Mandiri](#45-modul-05-workspace-agen-ai-mandiri)
5. [SPESIFIKASI TATA LETAK & DESAIN UI (MODERN ENTERPRISE)](#5-spesifikasi-tata-letak--desain-ui-modern-enterprise)
6. [SPESIFIKASI TEKNIS & API DATA CONTRACTS](#6-spesifikasi-teknis--api-data-contracts)
7. [LOGIKA ALGORITMA & MATEMATIKA INTI](#7-logika-algoritma--matematika-inti)
8. [SKENARIO PENGUJIAN & PENANGANAN EDGE CASES](#8-skenario-pengujian--penanganan-edge-cases)

---

## 1. RINGKASAN PRODUK & PRINSIP DESAIN

### 1.1 Deskripsi Produk
**KOMANDO** (*Komando Monitoring dan Analisis Narasi Digital Online*) adalah platform intelijen media sosial (*Social Media Intelligence*) dan forensik digital enterprise yang dirancang khusus untuk memetakan dinamika opini publik, mendeteksi kampanye manipulasi buzzer terkoordinasi di seluruh **38 Provinsi Indonesia**, melacak sumber postingan pertama (Ground Zero) berdasarkan stempel waktu rilis (*datetime release*), mengidentifikasi jejak geolokasi presisi (koordinat GPS, sektor BTS seluler, dan backbone ISP) dari akun penyebar disinformasi, serta menjalankan agen AI otonom untuk investigasi berkelanjutan.

### 1.2 Prinsip Desain Produk
1. **National Full Scope (38 Provinsi)**: Memetakan 100% provinsi di Indonesia tanpa terkecuali, mencakup simpul buzzer teridentifikasi dengan total potensi jangkauan (reach) puluhan juta impresi.
2. **Ground Zero Identification**: Menemukan akun sumber pertama yang memicu gelombang disinformasi (*patient zero*) berdasarkan kronologi stempel waktu absolut (ISO-8601) dan rentang waktu propagasi ($T+0\text{m}$, $T+3\text{m}$, dst.).
3. **Forensic Geolocation Radar**: Setiap akun mencurigakan dilacak hingga koordinat lintang/bujur (Latitude/Longitude), menara pemancar BTS, dan penyedia layanan internet (ISP), serta dapat difokuskan langsung ke peta melalui tombol aksi interaktif.
4. **Cross-Platform Interconnection**: Menganalisis penyebaran narasi lintas platform (X/Twitter, Instagram, Facebook, TikTok, Threads, Bot Farms) dalam sebuah Social Network Analysis (SNA) interkoneksi.
5. **Modern Enterprise 4-Route Navigation**: Navigasi sisi kiri terpadu (`Sidebar.js`) dengan 4 ruang kerja: `Dashboard`, `Peta Sebaran Buzzer`, `Pelacak Akun Medsos`, dan `Agen Saya`.
6. **Independence & Zero API Cost**: Beroperasi secara mandiri tanpa ketergantungan pada API berbayar mahal, memanfaatkan protokol publik dan generator telemetri deterministik.

---

## 2. 4 MODUL UTAMA APLIKASI

```
+---------------------------------------------------------------------------------------------------+
|                                  KOMANDO ENTERPRISE INTELLIGENCE                                  |
+---------------------------------------------------------------------------------------------------+
|  1. DASHBOARD EKSEKUTIF  |  2. PETA SEBARAN BUZZER   |  3. PELACAK AKUN MEDSOS |  4. AGEN SAYA    |
|  - 4 Kartu KPI Reaktif   |  - 38 Provinsi Peta Geo   |  - Multi-Platform OSINT |  - AI Agent Form |
|  - Trend & Share of Voice|  - Jejaring SNA Resolusi  |  - Skor Probabilitas Bot|  - Multi-Step Run|
|  - Top Hashtag & Authors |  - Ground Zero Detection  |  - Tren 30 Hari Historis|  - LocalStorage  |
|  - Barometer DEFCON 1-5  |  - Berita Daerah vs Feeds |  - Profil & Metrik Akun |    Persistence   |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. FEATURE MATRIX & HIERARKI AKSES

| Fitur | Deskripsi | Prioritas | Tampilan / Komponen |
|---|---|:---:|---|
| **Dashboard Eksekutif** | 4 KPI Cards, Analisis Tren, Share of Voice, dan Barometer DEFCON | `P0` | Rute 1: `KomandoDashboardView` |
| **Peta Sebaran 38 Provinsi** | Peta interaktif GeoJSON ECharts dengan sebaran buzzer 38 provinsi | `P0` | Rute 2: `GeoBuzzerView` |
| **Jejaring Aktor (SNA)** | Graf interkoneksi akun pemicu vs bot farm dengan ResizeObserver | `P0` | Rute 2: `GeoBuzzerView` (Tab SNA) |
| **Ground Zero Forensics** | Panel identifikasi akun sumber pertama, waktu rilis, & timeline mutasi | `P0` | Rute 2: `GeoBuzzerView` |
| **Pelacak Akun Medsos** | Pencarian instan profil, skor probabilitas bot, dan tren historis 30 hari | `P0` | Rute 3: `PelacakAkunMedsosView` |
| **Workspace Agen AI** | Pembuatan dan eksekusi agen intelijen dengan penyimpanan persisten | `P0` | Rute 4: `MyAgentView` |
| **Top Navigation Bar** | Filter rentang waktu dinamis, DEFCON pill, dan tombol menu | `P0` | Global: `TopBar` |
| **Sidebar Navigasi** | Panel navigasi kiri dapat diciutkan dengan profil operator aktif | `P0` | Global: `Sidebar` |
| **Buku Panduan Sistem** | Modal panduan operasional sistem lengkap dan mudah dipahami | `P2` | Modal: `GuideModal` |

---

## 4. SPESIFIKASI DETAIL MODUL APLIKASI

### 4.1 Modul 01: Peta & Sebaran Buzzer Nasional 38 Provinsi
* **Cakupan Wilayah**: Menjangkau seluruh 38 provinsi di Indonesia (dari Aceh hingga Papua Selatan, Papua Tengah, dan Papua Pegunungan).
* **Inventaris Data**: 76 titik simpul buzzer dengan total jangkauan 36.870.000 netizen.
* **Informasi Per Provinsi**:
  - Nama Provinsi, Ibukota, dan Koordinat Geografis (Latitude/Longitude).
  - Status Risiko Buzzer: `TINGGI` (Merah), `SEDANG` (Kuning), `RENDAH` (Hijau).
  - Jumlah Akun Buzzer Aktif dan Estimasi Total Reach.
  - Tagar / Narasi Utama yang sedang diamplifikasi di wilayah tersebut.
* **Interaktivitas**: Mengklik kartu provinsi atau marker di peta akan memperbarui data berita lokal, postingan medsos, dan graf jaringan secara instan.

### 4.2 Modul 02: Deteksi Sumber Postingan Utama (Ground Zero / Patient Zero)
* **Tujuan**: Menjawab pertanyaan krusial: *"Siapa yang pertama kali mengunggah hoaks ini sebelum viral?"*
* **Parameter Output**:
  - `origin_account`: Username dan identitas akun pembuat unggahan primer (misal: `@provokator_utama_01`).
  - `origin_platform`: Platform asal (X/Twitter, Facebook, Telegram, WhatsApp leak).
  - `date_time_release`: Stempel waktu ISO-8601 presisi (misal: `2026-10-27T10:14:02+07:00`).
  - `propagation_speed`: Kecepatan amplifikasi (misal: `4.800 reposts/jam`).
  - `propagation_timeline`: Rantai mutasi waktu:
    - $T+0\text{m}$: Unggahan pertama oleh akun sumber.
    - $T+3\text{m}$: Amplifikasi pertama oleh botnet ring-1.
    - $T+12\text{m}$: Mutasi narasi ke platform sekunder (Instagram/TikTok).
    - $T+35\text{m}$: Penetrasi ke netizen organik dan trending topic.

### 4.3 Modul 03: Forensik Geolokasi Presisi (GPS, BTS & ISP Backbone)
* **Tujuan**: Mengidentifikasi lokasi fisik operasional sindikat buzzer.
* **Parameter Forensik**:
  - `latitude` & `longitude`: Koordinat lokasi perangkat pembuat konten.
  - `city` & `province`: Wilayah administratif.
  - `bts_cell`: Identitas dan sektor menara BTS telekomunikasi (contoh: `BTS-TELK-SMG-084 Sector 2`).
  - `isp`: Penyedia layanan internet / ISP Backbone (contoh: `Telkomsel Enterprise / Indosat Ooredoo`).
  - `ip_origin`: Alamat IP sumber dengan penanda routing/VPN.
  - `device_signature`: Karakteristik perangkat keras (contoh: `Android SDK 34 / Automated Adb Farm`).
* **Fitur `[ 📍 Lihat di Peta ]`**: Mengklik tombol ini otomatis memindahkan fokus peta (*flyTo*) ke koordinat tepat akun tersebut.

### 4.4 Modul 04: Interkoneksi Lintas Medsos (Cross-Platform SNA)
* **Visualisasi Graf Jaringan**:
  - Memetakan bagaimana sebuah narasi berpindah dari akun anonim di X, disalin oleh bot farm Instagram, lalu diunggah kembali sebagai infografis di Facebook.
  - Simpul (Nodes): Berbeda warna dan ikon berdasarkan platform (`X`, `Instagram`, `Facebook`, `TikTok`, `Bot Farms`).
  - Tautan (Edges): Menunjukkan arah propagasi narasi dan relasi amplifikasi.

### 4.5 Modul 05: Pelacak Akun Medsos & OSINT URL Profiler
* **Alur Pemeriksaan URL**: Pengguna menempelkan URL postingan medsos ke dalam input teks.
* **Hasil Pemeriksaan Langsung (Inline)**:
  - Kartu Profil Akun: Display name, username, follower count, status bot score.
  - Kartu Ground Zero: Waktu rilis pertama dan kecepatan sebar.
  - Kartu Radar Geolokasi: Koordinat perangkat dan sektor BTS.
  - Visualisasi Interkoneksi Lintas Medsos.

### 4.6 Modul 06: Crawling Berita Resmi Daerah vs Narasi Hoaks Medsos
* **Live RSS News Crawler Real-Time**:
  - Terintegrasi langsung dengan sindikasi portal media nasional dan daerah yang terverifikasi Dewan Pers (Antara News, Kompas, CNN Indonesia, Republika, Detik, dll.).
  - Mengambil 5–6 rilis berita terverifikasi hari ini secara live per provinsi.
  - Dilengkapi sistem *caching in-memory* (10 menit) dan *offline fallback* anggun.
* **Komparasi Dua Sisi**:
  - Kolom Kiri: Rilis berita resmi dari media kredibel atau portal Pemda/Polda setempat (penangkal hoaks / verifikasi fakta).
  - Kolom Kanan: Postingan buzzer medsos yang terindikasi disinformasi di provinsi tersebut.
* **Tujuan**: Memudahkan analis melakukan verifikasi silang (cross-check) tanpa membuka tab browser baru.

---

## 5. SPESIFIKASI TATA LETAK & DESAIN UI (STREAMLINED 2-TAB)

```
+---------------------------------------------------------------------------------------------------+
|  [LOGO WHOIAM]  whoiam | INTELIJEN MEDSOS & FORENSIK AKUN     [PETA & BUZZER] [PELACAK AKUN] [Buku Panduan]|
+---------------------------------------------------------------------------------------------------+
| TAB 1: PETA & SEBARAN BUZZER NASIONAL (38 PROVINSI)                                               |
| +-----------------------------------------------+ +---------------------------------------------+ |
| | PETA SEBARAN BUZZER 38 PROVINSI INDONESIA     | | DETAIL PROVINSI: JAWA TENGAH                | |
| | [Marker Leaflet Koordinat GPS 38 Provinsi]    | | - Status: TINGGI • Kluster: 28 Akun (2+26)   | |
| |                                               | | - GROUND ZERO: @jateng_front (T: 08:15 WIB) | |
| |                                               | | - GEOLOKASI: Semarang (-6.99, 110.42) [Peta]| |
| |                                               | | - BERITA RESMI (LIVE 6) vs POSTINGAN BUZZER | |
| |                                               | | - GRAF INTERKONEKSI SNA LINTAS MEDSOS       | |
| +-----------------------------------------------+ +---------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 6. SPESIFIKASI TEKNIS & API DATA CONTRACTS

### Endpoint REST API Aktif

| Method | Endpoint | Deskripsi & Respons Kunci |
|---|---|---|
| `GET` | `/api/v1/geo-buzzer/provinces` | Daftar 38 provinsi, koordinat, buzzer nodes, status risiko, dan reach |
| `GET` | `/api/v1/geo-buzzer/province/{id}` | Detail provinsi lengkap: berita, postingan buzzer, Ground Zero, geolokasi, SNA |
| `GET` | `/api/v1/geo-buzzer/national-summary` | Ringkasan nasional: total provinsi (38), buzzer nodes (76), total reach (>36.8M) |
| `POST` | `/api/v1/osint/inspect-url` | Forensik URL akun: profil, Ground Zero datetime, geofix coordinates, cross-SNA |
| `POST` | `/api/v1/osint/search-ingest` | Scrape tagar/kata kunci & analisis jaringan akun terkait |
| `GET` | `/api/v1/osint/status` | Pengecekan status ketersediaan scraper engine |

---

## 7. LOGIKA ALGORITMA & MATEMATIKA INTI

### 7.1 Identifikasi Ground Zero ($T_0$)
Menentukan simpul awal postingan $A_0$ dari himpunan postingan bertagar sama $P = \{p_1, p_2, \dots, p_n\}$:
$$p_0 = \arg\min_{p \in P} (\text{timestamp}(p))$$
Delta waktu propagasi pada simpul $i$:
$$\Delta T_i = \text{timestamp}(p_i) - \text{timestamp}(p_0)$$

### 7.2 Indeks Risiko Provinsi ($R_{\text{prov}}$)
$$R_{\text{prov}} = w_1 \cdot \frac{N_{\text{buzzer}}}{N_{\text{max}}} + w_2 \cdot \frac{\text{Reach}}{\text{Reach}_{\text{max}}} + w_3 \cdot S_{\text{sentiment\_neg}}$$
Dimana bobot $w_1 = 0.35, w_2 = 0.35, w_3 = 0.30$. Jika $R_{\text{prov}} \ge 0.70 \implies \text{RISIKO TINGGI}$.

---

## 8. SKENARIO PENGUJIAN & PENANGANAN EDGE CASES

1. **Provinsi Pemekaran Baru Papua**: Memastikan Papua Selatan, Papua Tengah, dan Papua Pegunungan memiliki koordinat valid dan simpul buzzer tersimulasi dengan benar.
2. **URL Tanpa Akses Publik**: Jika URL privat atau dibatasi, OSINT Engine menghasilkan profil probabilistik berbasis domain dan parameter URL tanpa memutus alur antarmuka.
3. **Penyelarasan Stempel Waktu (Timezone)**: Seluruh stempel waktu dinormalisasi ke format ISO-8601 dengan indikator zona waktu lokal (WIB/WITA/WIT).
