# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## PROYEK: whoiam
### SISTEM INTELIJEN MEDIA SOSIAL, FORENSIK GEOLOKASI & DETEKSI BUZZER 38 PROVINSI

---

**Nomor Dokumen**: PRD-WHOIAM-2026-003  
**Versi**: 3.2.0  
**Tanggal Rilis**: 28 Oktober 2026  
**Status**: APPROVED & PRODUCTION READY  
**Target Pengguna**: Analis Intelijen Media Sosial, Tim Forensik Siber, Pemeriksa Fakta & Penyelidik OSINT  
**Role Pengguna**: `user`  

---

## DAFTAR ISI

1. [RINGKASAN PRODUK & PRINSIP DESAIN](#1-ringkasan-produk--prinsip-desain)
2. [5 PILAR FITUR UTAMA (CORE CAPABILITIES)](#2-5-pilar-fitur-utama-core-capabilities)
3. [FEATURE MATRIX & HIERARKI AKSES](#3-feature-matrix--hierarki-akses)
4. [SPESIFIKASI DETAIL MODUL APLIKASI](#4-spesifikasi-detail-modul-aplikasi)
   - [4.1 Modul 01: Peta & Sebaran Buzzer Nasional 38 Provinsi](#41-modul-01-peta--sebaran-buzzer-nasional-38-provinsi)
   - [4.2 Modul 02: Deteksi Sumber Postingan Utama (Ground Zero / Patient Zero)](#42-modul-02-deteksi-sumber-postingan-utama-ground-zero--patient-zero)
   - [4.3 Modul 03: Forensik Geolokasi Presisi (GPS, BTS & ISP Backbone)](#43-modul-03-forensik-geolokasi-presisi-gps-bts--isp-backbone)
   - [4.4 Modul 04: Interkoneksi Lintas Medsos (Cross-Platform SNA)](#44-modul-04-interkoneksi-lintas-medsos-cross-platform-sna)
   - [4.5 Modul 05: Pelacak Akun Medsos & OSINT URL Profiler](#45-modul-05-pelacak-akun-medsos--osint-url-profiler)
   - [4.6 Modul 06: Crawling Berita Resmi Daerah vs Narasi Hoaks Medsos](#46-modul-06-crawling-berita-resmi-daerah-vs-narasi-hoaks-medsos)
5. [SPESIFIKASI TATA LETAK & DESAIN UI (STREAMLINED 2-TAB)](#5-spesifikasi-tata-letak--desain-ui-streamlined-2-tab)
6. [SPESIFIKASI TEKNIS & API DATA CONTRACTS](#6-spesifikasi-teknis--api-data-contracts)
7. [LOGIKA ALGORITMA & MATEMATIKA INTI](#7-logika-algoritma--matematika-inti)
8. [SKENARIO PENGUJIAN & PENANGANAN EDGE CASES](#8-skenario-pengujian--penanganan-edge-cases)

---

## 1. RINGKASAN PRODUK & PRINSIP DESAIN

### 1.1 Deskripsi Produk
**whoiam** adalah platform intelijen media sosial (*Social Media Intelligence*) dan forensik digital terpadu yang dirancang khusus untuk memetakan dinamika opini publik, mendeteksi kampanye manipulasi buzzer terkoordinasi di seluruh **38 Provinsi Indonesia**, melacak sumber postingan pertama (Ground Zero) berdasarkan stempel waktu rilis (*datetime release*), dan mengidentifikasi jejak geolokasi presisi (koordinat GPS, sektor BTS seluler, dan backbone ISP) dari akun penyebar disinformasi.

### 1.2 Prinsip Desain Produk
1. **National Full Scope (38 Provinsi)**: Memetakan 100% provinsi di Indonesia tanpa terkecuali, mencakup 76 simpul buzzer teridentifikasi dengan total potensi jangkauan (reach) mencapai >36,8 juta impresi.
2. **Ground Zero Identification**: Menemukan akun sumber pertama yang memicu gelombang disinformasi (*patient zero*) berdasarkan kronologi stempel waktu absolut (ISO-8601) dan rentang waktu propagasi ($T+0\text{m}$, $T+3\text{m}$, dst.).
3. **Forensic Geolocation Radar**: Setiap akun mencurigakan dilacak hingga koordinat lintang/bujur (Latitude/Longitude), menara pemancar BTS, dan penyedia layanan internet (ISP), serta dapat difokuskan langsung ke peta melalui tombol aksi interaktif.
4. **Cross-Platform Interconnection**: Menganalisis penyebaran narasi lintas platform (X/Twitter, Instagram, Facebook, TikTok, Bot Farms) dalam sebuah Social Network Analysis (SNA) interkoneksi.
5. **Streamlined 2-Tab User Experience**: Menghilangkan modal popup yang bertumpuk dan terminologi militer yang membingungkan. Antarmuka disederhanakan menjadi 2 ruang kerja operasional: `PETA & SEBARAN BUZZER` dan `PELACAK AKUN MEDSOS`.
6. **Independence & Ethical Scraping**: Beroperasi secara mandiri mematuhi regulasi `robots.txt` domain target (politeness delay & in-memory cache) dengan pengamanan Anti-SSRF.
7. **Multi-Device Responsiveness**: Pengalaman visual optimal di layar Desktop (100vh War Room), Tablet (2-kolom split stack), hingga Smartphone / HP (single kolom dengan touch swipe).

---

## 2. 5 PILAR FITUR UTAMA (CORE CAPABILITIES)

```
+---------------------------------------------------------------------------------------------------+
|                                  WHOIAM 5 PILAR FORENSIK DIGITAL                                  |
+---------------------------------------------------------------------------------------------------+
|  1. PETA 38 PROVINSI   |  2. GROUND ZERO           |  3. GEOLOKASI PRESISI   |  4. CROSS-SNA      |
|  - 38 Provinsi Lengkap |  - Akun Penyebar Pertama  |  - Koordinat Lat/Long   |  - Interkoneksi    |
|  - 76 Node Buzzer      |  - Stempel Waktu Rilis    |  - Sektor Menara BTS    |    X, IG, FB, TT   |
|  - 36.8M+ Total Reach  |  - Kronologi Propagasi    |  - ISP Backbone & IP    |  - Sentralitas Hub |
|  - Metrik Risiko       |  - Selisih Waktu T+Delta  |  - Tombol [Lihat Peta]  |  - Kluster Botnet  |
+---------------------------------------------------------------------------------------------------+
|                          5. VERIFIKASI BERITA RESMI DAERAH VS HOAKS MEDSOS                        |
|  - RSS / Scraper Berita Resmi Pemda, Antara, & Portal Terverifikasi                              |
|  - Perbandingan Langsung Narasi Buzzer Provokatif vs Fakta Valid Klarifikasi Instansi             |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. FEATURE MATRIX & HIERARKI AKSES

| Fitur | Deskripsi | Prioritas | Tampilan / Komponen |
|---|---|:---:|---|
| **Peta Sebaran 38 Provinsi** | Peta interaktif Leaflet/Canvas dengan marker koordinat seluruh provinsi | `P0` | Tab 1: `GeoBuzzerView` |
| **Ground Zero Forensics** | Panel identifikasi akun sumber pertama, waktu rilis, & timeline mutasi | `P0` | Tab 1 & Tab 2 |
| **Geolokasi & Menara BTS** | Informasi presisi koordinat GPS, BTS sektor, ISP, dan link flyTo peta | `P0` | Tab 1 & Tab 2 |
| **Cross-Platform SNA** | Graf interaktif relasi antar platform (X, Instagram, Facebook, TikTok) | `P0` | Tab 1 & Tab 2 |
| **OSINT URL Profiler** | Analisis instan tautan medsos tanpa popup modal | `P0` | Tab 2: `OsintInlineView` |
| **Ethical Scraper & Robots.txt** | Validasi kepatuhan crawling etis dan indikator domain hijau | `P0` | Tab 1 & Tab 2 |
| **Responsif Multi-Device** | Adaptasi layout mulus Desktop, Tablet, dan Mobile/HP | `P0` | Global (`warroom.css`) |
| **Pemantau Berita Daerah** | Aliran berita resmi daerah terverifikasi per provinsi terpilih | `P1` | Tab 1: Kolom Informasi |
| **Postingan Medsos Provinsi** | Cuplikan status dan sentimen medsos aktif di provinsi terpilih | `P1` | Tab 1: Kolom Informasi |
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
