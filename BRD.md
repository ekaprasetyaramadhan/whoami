# BUSINESS REQUIREMENTS DOCUMENT (BRD)
## PROYEK: whoiam
### SISTEM INTELIJEN MEDIA SOSIAL & FORENSIK AKUN TERPADU (OSINT & GEOLOKASI)

---

**Nomor Dokumen**: BRD-WHOIAM-2026-004  
**Versi**: 3.2.0  
**Tanggal Rilis**: 28 Oktober 2026  
**Status**: APPROVED & OPERATIONAL  
**Klasifikasi Dokumen**: Spesifikasi Persyaratan Bisnis & Solusi Intelijen Forensik  
**Target Pengguna**: Analis Media Sosial, Penyelidik OSINT, Tim Forensik Siber, & Pemeriksa Fakta  
**Peran Sistem (Role)**: `user`  

---

## DAFTAR ISI

1. [INFORMASI DOKUMEN & KONTROL REVISI](#1-informasi-dokumen--kontrol-revisi)
2. [LATAR BELAKANG BISNIS & PERNYATAAN MASALAH](#2-latar-belakang-bisnis--pernyataan-masalah)
3. [TUJUAN BISNIS & TARGET KEBERHASILAN (KPI)](#3-tujuan-bisnis--target-keberhasilan-kpi)
4. [ANALISIS STAKEHOLDER & USER PERSONA](#4-analisis-stakeholder--user-persona)
5. [BATASAN RUANG LINGKUP (SCOPE OF WORK)](#5-batasan-ruang-lingkup-scope-of-work)
6. [ANALISIS PROSES BISNIS (AS-IS VS TO-BE)](#6-analisis-proses-bisnis-as-is-vs-to-be)
7. [KEBUTUHAN BISNIS & FITUR STRATEGIS UTAMA](#7-kebutuhan-bisnis--fitur-strategis-utama)
   - [7.1 Cakupan Nasional Peta Buzzer 38 Provinsi](#71-cakupan-nasional-peta-buzzer-38-provinsi)
   - [7.2 Pelacakan Sumber Postingan Utama (Ground Zero Forensics)](#72-pelacakan-sumber-postingan-utama-ground-zero-forensics)
   - [7.3 Forensik Geolokasi Presisi, Menara BTS & ISP](#73-forensik-geolokasi-presisi-menara-bts--isp)
   - [7.4 Analisis Jejaring Lintas Platform (Cross-Platform SNA)](#74-analisis-jejaring-lintas-platform-cross-platform-sna)
   - [7.5 Komparasi Berita Resmi Daerah vs Disinformasi Medsos](#75-komparasi-berita-resmi-daerah-vs-disinformasi-medsos)
   - [7.6 Penyelidikan Akun Medsos Langsung (Inline Profiler)](#76-penyelidikan-akun-medsos-langsung-inline-profiler)
   - [7.7 Garis Propagasi Isu Antar-Provinsi (Migration Flight Lines)](#77-garis-propagasi-isu-antar-provinsi-migration-flight-lines)
   - [7.8 Filter Rentang Waktu (Timeline Playback Pills)](#78-filter-rentang-waktu-timeline-playback-pills)
   - [7.9 Deteksi Avatar AI / Wajah Sintetis (Synthetic Face GAN Detector)](#79-deteksi-avatar-ai--wajah-sintetis-synthetic-face-gan-detector)
   - [7.10 Komparasi 2 Akun Berdampingan (Side-by-Side Synchronicity Comparator)](#710-komparasi-2-akun-berdampingan-side-by-side-synchronicity-comparator)
   - [7.11 Ekstraksi Topik & Tagar (Topic & Keyword Cloud)](#711-ekstraksi-topik--tagar-topic--keyword-cloud)
   - [7.12 Ethical Scraping & Multi-Device Accessibility](#712-ethical-scraping--multi-device-accessibility)
8. [KEBUTUHAN NON-FUNGSIONAL (NFR)](#8-kebutuhan-non-fungsional-nfr)
9. [MATRIKS TRACEABILITY & KRITERIA PENERIMAAN](#9-matriks-traceability--kriteria-penerimaan)

---

## 1. INFORMASI DOKUMEN & KONTROL REVISI

### 1.1 Riwayat Revisi
| Versi | Tanggal | Penulis | Deskripsi Perubahan |
|---|---|---|---|
| 1.0.0 | 21 Oktober 2026 | Tim whoiam | Inisiasi baseline spesifikasi sistem intelijen media sosial |
| 2.0.0 | 22 Oktober 2026 | Tim whoiam | Rebranding ke whoiam, integrasi OSINT Scraper, netralisasi narasi militer |
| 3.0.0 | 27 Oktober 2026 | Tim whoiam | Ekspansi cakupan 38 Provinsi, Deteksi Ground Zero, BTS Geolokasi, Cross-Platform SNA. |
| 3.1.0 | 27 Oktober 2026 | Tim whoiam | **Implementasi Fitur Forensik Lanjutan**: Garis Propagasi Isu Antar-Provinsi (*Migration Flight Lines*), Filter Rentang Waktu (1h, 6h, 24h, 7d), Deteksi Avatar AI Wajah Sintetis (GAN Detector), Komparasi 2 Akun Berdampingan (*Synchronicity Comparator*), dan Ekstraksi Topik/Tagar (*Topic Cloud*). |
| 3.2.0 | 28 Oktober 2026 | Tim whoiam | **Desain Responsif Multi-Device & Ethical Scraping Compliance**: Penyesuaian antarmuka responsif (Desktop, Tablet, Mobile/HP), modul crawling etis `robots.txt` compliance dengan Anti-SSRF, live dynamic buzzer harvesting, dan CI/CD deployment ke VPS live `https://whoami.labados.my.id/`. |

### 1.2 Glosarium & Terminologi
* **whoiam**: Platform intelijen media sosial dan forensik akun untuk mengidentifikasi dalang penyebar narasi, validitas postingan, serta pola jaringan manipulasi siber di Indonesia.
* **Ground Zero / Patient Zero**: Akun pertama pembuat konten/hoaks sebelum diamplifikasi secara masif oleh botnet atau jaringan buzzer sekunder.
* **DateTime Release**: Stempel waktu terverifikasi kapan postingan pertama kali dirilis di internet untuk merekonstruksi kronologi penyebaran informasi.
* **Geofix & BTS Sector**: Estimasi lokasi fisik perangkat pengunggah berdasarkan koordinat GPS dan menara pemancar Base Transceiver Station (BTS).
* **Cross-Platform SNA**: Visualisasi interkoneksi penyebaran narasi antar berbagai platform (X, Instagram, Facebook, TikTok, Bot Farms).
* **Migration Flight Lines**: Garis lengkung visualisasi penerbangan isu dari provinsi asal (*origin*) ke provinsi penerima (*destination*) beserta kecepatan replikasi narasi.
* **Synthetic Face GAN Detector**: Algoritma forensik visi komputer untuk mendeteksi avatar profil hasil generasi AI (*StyleGAN/Diffusion*) berdasarkan pupil mata dan artefak latar.
* **Side-by-Side Synchronicity Comparator**: Matriks uji keselarasan 2 akun untuk membuktikan apakah keduanya digerakkan oleh operator manusia/skrip yang sama.

---

## 2. LATAR BELAKANG BISNIS & PERNYATAAN MASALAH

### 2.1 Konteks Lanskap Media Sosial di Indonesia
Penyebaran disinformasi dan kampanye manipulasi opini di Indonesia saat ini memiliki karakteristik spesifik:
1. **Pola Multi-Platform**: Sebuah hoaks jarang bertahan di satu platform saja; narasi biasanya bermula dari satu cuitan di X atau tangkapan layar di Telegram, kemudian diunggah ke Instagram sebagai reel/infografis, dibagikan di grup Facebook, dan menjadi viral di TikTok.
2. **Ketiadaan Informasi Siapa Sumber Utama**: Saat isu membesar, publik dan analis hanya melihat ratusan akun yang membicarakan isu tersebut tanpa tahu akun mana yang memulainya pertama kali (*Ground Zero*).
3. **Ketiadaan Lokasi Fisik Akun (Geolocation Blindspot)**: Kampanye hitam seringkali digerakkan oleh bot farm yang berlokasi di daerah tertentu, namun analis tidak dapat memetakan posisi geografis para pelaku.
4. **Cakupan Wilayah Terbatas**: Alat pemantauan yang ada umumnya hanya memantau kota-kota besar (Jakarta/Jawa) dan mengabaikan 38 provinsi di seluruh penjuru Indonesia.
5. **Kurangnya Verifikasi Berita Resmi Daerah**: Tidak adanya sarana komparasi instan antara desas-desus media sosial di suatu daerah dengan rilis resmi instansi/pemerintah daerah terkait.

### 2.2 Pernyataan Masalah (Problem Statement)
> *"Bagaimana menyediakan platform intelijen akun dan forensik media sosial yang komprehensif, mencakup seluruh 38 provinsi Indonesia, mampu mendeteksi akun pengunggah pertama (Ground Zero) berdasarkan stempel waktu rilis, melacak lokasi geografis dan menara BTS akun terkait, serta memetakan keterhubungan antar platform media sosial secara interaktif dan mudah digunakan tanpa lisensi API mahal?"*

---

## 3. TUJUAN BISNIS & TARGET KEBERHASILAN (KPI)

1. **100% Cakupan Wilayah Nasional**: Memantau 38 provinsi di Indonesia secara real-time dengan inventaris 76 node buzzer dan estimasi reach >36,8 juta impresi.
2. **Presisi Ground Zero Detection**: Mengidentifikasi akun pembuat narasi pertama beserta stempel waktu rilisnya ($T+0\text{m}$) dengan tingkat akurasi kronologis 100%.
3. **Forensik Geolokasi Terintegrasi**: Menyajikan koordinat lintang/bujur, sektor BTS seluler, dan ISP backbone, serta fitur langsung melompat (*flyTo*) ke titik lokasi di peta interaktif.
4. **Transparansi Interkoneksi Lintas Medsos**: Menggambarkan jalur penyebaran narasi lintas platform (X $\rightarrow$ Instagram $\rightarrow$ Facebook $\rightarrow$ TikTok $\rightarrow$ Bot Farms) dalam kanvas SNA yang intuitif.
5. **Efisiensi Alur Kerja Forensik**: Menghilangkan popup bertumpuk dan menyatukan seluruh proses investigasi ke dalam 2 ruang kerja operasional terpadu.

---

## 4. ANALISIS STAKEHOLDER & USER PERSONA

### 4.1 Peran Pengguna Utama
* **Nama Peran**: `user` (Analis Intelijen Media Sosial / Forensik Siber)
* **Kewenangan & Aktivitas**:
  - Memantau sebaran buzzer di peta interaktif 38 provinsi.
  - Memilih provinsi untuk melihat detail berita lokal vs postingan medsos bermasalah.
  - Meneliti akun Ground Zero dan jejak geolokasi BTS-nya.
  - Menavigasi peta langsung ke koordinat perangkat tersangka via tombol `[ 📍 Lihat di Peta ]`.
  - Melakukan inspeksi URL postingan secara inline di tab Pelacak Akun Medsos.

---

## 5. BATASAN RUANG LINGKUP (SCOPE OF WORK)

### In-Scope:
- Visualisasi peta interaktif seluruh 38 provinsi Indonesia (termasuk 4 provinsi baru di Papua).
- Panel data per provinsi (Nama, Ibukota, Titik Koordinat, Status Risiko, Jumlah Buzzer, Total Reach).
- Modul identifikasi akun pertama (Ground Zero) dan timeline perambatan ($T+0\text{m}$ hingga $T+35\text{m}$).
- Panel forensik geolokasi (GPS Lat/Long, Menara BTS Sektor, ISP Backbone, IP Origin, Signature Perangkat).
- Graf Interkoneksi Lintas Platform (X, Instagram, Facebook, TikTok, Bot Farms).
- Modul pemantauan berita resmi pemerintah daerah vs narasi medsos provinsi.
- Tab Pelacak Akun Medsos berbasis OSINT Profiler dengan tampilan inline hasil analisis.
- Modal Buku Panduan Sistem Penggunaan (*Guide Modal*).

### Out-of-Scope:
- Tindakan pemblokiran/take-down akun media sosial langsung (kewenangan aparat hukum/regulator).
- Penyusupan ilegal atau hacking perangkat fisik tanpa wewenang hukum.

---

## 6. ANALISIS PROSES BISNIS (AS-IS VS TO-BE)

| Aspek | Kondisi Sebelumnya (As-Is) | Kondisi Baru whoiam (To-Be) |
|---|---|---|
| **Cakupan Wilayah** | Hanya 10 provinsi prioritas di Jawa/Sumatera | **Seluruh 38 Provinsi Indonesia Lengkap** dari Aceh hingga Papua Pegunungan |
| **Sumber Utama Isu** | Analis menebak-nebak akun yang memulai hoaks | **Ground Zero otomatis terdeteksi** dengan stempel waktu rilis presisi ($T_0$) |
| **Jejak Lokasi** | Tidak ada data lokasi sama sekali | **Forensik Geolokasi Presisi**: GPS, BTS Cell, ISP Backbone, tombol [Lihat di Peta] |
| **Penyebaran Antar Medsos** | Terisolasi per platform | **Cross-Platform SNA**: Memetakan perpindahan hoaks antar X, IG, FB, dan TikTok |
| **Verifikasi Lapangan** | Analis harus mencari rilis pers Pemda di Google secara manual | **Integrasi Berita Resmi Daerah vs Medsos** disandingkan berdampingan |
| **Pengalaman Pengguna** | Modal popup bertumpuk dan bahasa militer yang kaku | **2 Tab Ruang Kerja Bersih**: Peta Sebaran Buzzer & Pelacak Akun Medsos |

---

## 7. KEBUTUHAN BISNIS & FITUR STRATEGIS UTAMA

### 7.1 Cakupan Nasional Peta Buzzer 38 Provinsi
Sistem wajib menyajikan peta interaktif dengan 38 titik koordinat provinsi yang akurat di Indonesia, menampilkan indikator warna risiko buzzer (Merah/Kuning/Hijau) serta total reach nasional.

### 7.2 Pelacakan Sumber Postingan Utama (Ground Zero Forensics)
Sistem wajib mengidentifikasi dan menampilkan akun yang pertama kali merilis konten, waktu unggah awal dalam format ISO-8601 lokal, kecepatan propagasi, serta linimasa perambatan narasi.

### 7.3 Forensik Geolokasi Presisi, Menara BTS & ISP
Sistem wajib menampilkan data lokasi fisik akun tersangka, meliputi koordinat lintang/bujur, sektor menara BTS terdekat, jaringan ISP yang digunakan, dan menyediakan tombol yang dapat langsung mengarahkan tampilan peta ke lokasi tersebut.

### 7.4 Analisis Jejaring Lintas Platform (Cross-Platform SNA)
Sistem wajib menampilkan graf hubungan yang memperlihatkan bagaimana sebuah narasi diamplifikasi oleh berbagai akun di platform berbeda (X, IG, Facebook, TikTok) secara terkoordinasi.

### 7.5 Komparasi Berita Resmi Daerah vs Disinformasi Medsos
Sistem wajib menampilkan feed berita resmi daerah dari sumber terverifikasi untuk disandingkan dengan narasi buzzer yang sedang berkembang di provinsi tersebut.

### 7.6 Penyelidikan Akun Medsos Langsung (Inline Profiler)
Sistem wajib menyediakan tab khusus untuk menginput URL postingan medsos apa pun dan menampilkan analisis profil, Ground Zero, geolokasi, dan SNA secara langsung di halaman yang sama tanpa dialog popup.

### 7.7 Garis Propagasi Isu Antar-Provinsi (Migration Flight Lines)
Sistem wajib memvisualisasikan jalur transmisi penyebaran isu dari provinsi origin (Ground Zero) ke provinsi penerima dalam bentuk garis lengkung terbang beranimasi (*flight lines*) yang dilengkapi tooltip kecepatan replikasi narasi (cph) dan volume interaksi.

### 7.8 Filter Rentang Waktu (Timeline Playback Pills)
Sistem wajib menyediakan filter rentang waktu dinamis (`1 JAM`, `6 JAM`, `24 JAM`, `7 HARI`) pada bilah kendali peta intelijen untuk mengamati eskalasi volume buzzer dan dinamika perambatan isu secara periodik.

### 7.9 Deteksi Avatar AI / Wajah Sintetis (Synthetic Face GAN Detector)
Sistem wajib menyediakan algoritma inspeksi avatar profil akun untuk mendeteksi apakah foto wajah merupakan manusia asli atau hasil sintesis kecerdasan buatan (*StyleGAN/Diffusion*), dilengkapi skor probabilitas AI (%) dan identifikasi artefak forensik (simetri pupil mata, keanehan aksesoris/anting, dan konsistensi bokeh latar belakang).

### 7.10 Komparasi 2 Akun Berdampingan (Side-by-Side Synchronicity Comparator)
Sistem wajib menyediakan sub-tab komparasi yang mampu membedah dua URL akun secara berdampingan untuk menguji korelasi kepemilikan operator tunggal, mengukur kesamaan teks leksikal (Jaccard index), selisih waktu unggah (*temporal delta*), kedekatan subnet/menara BTS, kecocokan *device fingerprint*, serta kata kunci bersama.

### 7.11 Ekstraksi Topik & Tagar (Topic & Keyword Cloud)
Sistem wajib mengekstrak dan menampilkan awan kata kunci serta tagar dominan yang dikuatkan oleh akun target, disertai frekuensi sebutan dan kategori sentimen/ancaman narasi.

---

## 8. KEBUTUHAN NON-FUNGSIONAL (NFR)

1. **Performa**: Waktu respons inspeksi URL dan pemuatan detail provinsi $< 1.5$ detik.
2. **Ketersediaan**: Sistem dapat berjalan 100% mandiri secara offline maupun online tanpa dependensi API eksternal berbayar.
3. **Kompatibilitas**: Antarmuka responsif dan optimal dibuka pada browser modern (Chrome, Edge, Firefox, Safari) pada resolusi layar standar desktop (1366x768 hingga 4K).
4. **Keamanan & Integritas**: Kode backend menggunakan prinsip type-safe Pydantic dan penanganan error yang anggun (*graceful fallback*).

---

## 9. MATRIKS TRACEABILITY & KRITERIA PENERIMAAN

| ID Kebutuhan | Kebutuhan Bisnis | Modul / Komponen Terkait | Kriteria Penerimaan |
|:---:|---|---|---|
| **REQ-01** | Peta 38 Provinsi Lengkap | `GeoBuzzerView.js` & `geo_buzzer_engine.py` | 38 provinsi muncul di peta dan daftar filter |
| **REQ-02** | Deteksi Ground Zero & Datetime | `GeoBuzzerView.js` & `OsintInlineView.js` | Tampil username sumber, datetime release, dan timeline delta |
| **REQ-03** | Geolokasi & Menara BTS | `geo_buzzer_engine.py` & `osint_engine.py` | Tampil GPS, BTS sektor, ISP, dan tombol [Lihat di Peta] berfungsi |
| **REQ-04** | Cross-Platform SNA | `GeoBuzzerView.js` & `OsintInlineView.js` | Graf menampilkan simpul X, IG, FB, TikTok, Bot Farms |
| **REQ-05** | Berita Resmi vs Medsos | `GeoBuzzerView.js` & `geo_buzzer_router.py` | Berita resmi dan medsos tampil berdampingan per provinsi |
| **REQ-06** | UI 2-Tab Sederhana | `main.js`, `HeaderBar.js`, `index.html` | Tab navigasi berpindah lancar tanpa modal popup |
| **REQ-07** | Garis Propagasi Isu (Flight Lines) | `GeoBuzzerView.js` & `geo_buzzer_engine.py` | Garis animasi lengkung terbang terender di atas peta |
| **REQ-08** | Filter Rentang Waktu (1h-7d) | `GeoBuzzerView.js` & `geo_buzzer_engine.py` | Pill 1h, 6h, 24h, 7d memfilter volume dan rute |
| **REQ-09** | Deteksi Avatar AI GAN | `OsintInlineView.js` & `osint_engine.py` | Gauge probabilitas AI GAN dan artefak wajah tampil |
| **REQ-10** | Komparasi 2 Akun (Sync Comparator) | `OsintInlineView.js` & `osint_engine.py` | Scorecard komparasi side-by-side & status operator tunggal |
| **REQ-11** | Ekstraksi Topik & Tagar Cloud | `OsintInlineView.js` & `osint_engine.py` | Badge frekuensi topik dan sentimen ancaman tampil |
