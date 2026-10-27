# PROPOSAL TEKNIS SOLUSI: whoiam
### *Sistem Intelijen Media Sosial, Forensik Geolokasi & Deteksi Buzzer 38 Provinsi*
**Domain: Social Media Intelligence, Geolocation Forensics, AI Avatar Detection & Account Synchronicity**  
**Versi: 3.1.0**  
**Role Pengguna: user**

---

## 1. RINGKASAN EKSEKUTIF

Di era informasi digital modern, manipulasi opini publik dan kampanye disinformasi terstruktur sering kali bergerak cepat melintasi batas geografis dan multi-platform (X/Twitter, Instagram, Facebook, Threads). Tantangan terbesar bagi analis intelijen dan aparat penegak hukum adalah:
1. **Mengetahui Siapa Pengunggah Pertama (*Ground Zero / Patient Zero*)**: Sering kali hoaks bermula dari 1 postingan terencana sebelum diamplifikasi oleh puluhan akun buzzer sekunder.
2. **Ketiadaan Lokasi Fisik Penyebar (*Geolocation Blindspot*)**: Mengetahui di mana lokasi fisik server bot atau perangkat yang mengoperasikan akun penyebar hoaks.
3. **Pelacakan Garis Propagasi Isu Antar-Provinsi**: Mengetahui rute ke mana narasi menyebar dari provinsi asal dan seberapa cepat replikasinya.
4. **Manipulasi Identitas dengan Foto Wajah Palsu AI (*Synthetic GAN Avatars*)**: Maraknya akun botnet yang menggunakan foto profil rekaan AI (StyleGAN/Diffusion) agar tampak seperti warga asli.
5. **Membuktikan Dua Akun Dijalankan oleh Satu Dalang (*Single Operator Correlation*)**: Sulitnya membuktikan secara matematis bahwa dua akun buzzer berbeda sebenarnya dioperasikan oleh satu sindikat.

**whoiam** hadir sebagai platform intelijen media sosial dan forensik digital terpadu yang memecahkan seluruh tantangan tersebut melalui pilar inovasi:
- **Peta Sebaran Buzzer Nasional 38 Provinsi & Garis Propagasi Isu**: Menampilkan sebaran buzzer dengan visualisasi garis lengkung terbang (*flight lines*) antar provinsi beranimasi dan filter rentang waktu dinamis (`1 JAM`, `6 JAM`, `24 JAM`, `7 HARI`).
- **Deteksi Sumber Postingan Pertama (*Ground Zero*)**: Rekonstruksi stempel waktu rilis absolut (`date_time_release`) dan linimasa perambatan ($T+0\text{m}$, $T+3\text{m}$, dst.).
- **Forensik Geolokasi Presisi**: Koordinat GPS perangkat, identitas sektor menara pemancar BTS, ISP backbone, dan penanda radar.
- **Deteksi Avatar AI / Wajah Sintetis (GAN Forensics)**: Membedah keaslian foto avatar profil akun, mendeteksi probabilitas StyleGAN/Diffusion, disorientasi pupil mata, dan artefak anting/telinga.
- **Komparasi 2 Akun Berdampingan (Synchronicity Comparator)**: Menguji korelasi dua URL akun secara instan (kesamaan leksikal Jaccard, selisih waktu detik, kedekatan subnet BTS, dan status operator tunggal).
- **Ekstraksi Topik & Awan Kata Kunci (*Topic Cloud*)**: Mengidentifikasi kata kunci dan tagar dominan yang dikuatkan secara masif oleh jejaring buzzer.
- **Komparasi Berita Resmi Daerah vs Medsos**: Membandingkan rilis instansi terverifikasi (live crawler Google News RSS Dewan Pers) dengan hoaks medsos secara *side-by-side*.

---

## 2. ARSITEKTUR TEKNOLOGI & TOPOLOGI SISTEM

whoiam dibangun dengan arsitektur modern berkinerja tinggi yang memisahkan antarmuka pengguna interaktif dengan mesin analitik asinkron:

```
+-----------------------------------------------------------------------------------+
|                        whoiam: FRONTEND SPA (VITE + ES6)                          |
|  - Tab 1: GeoBuzzerView (Interactive 38 Provinces Map, GZ Panel, Geofix BTS, SNA) |
|  - Tab 2: OsintInlineView (Instant URL Profiling, GZ Timeline, Cross-Platform SNA)|
|  - Modal: GuideModal (SOP & Panduan Operasional Sistem Lengkap)                   |
+-----------------------------------------------------------------------------------+
                                          ^
                                          | HTTP REST API (v1 JSON)
                                          v
+-----------------------------------------------------------------------------------+
|                      whoiam: FASTAPI ASYNC BACKEND (PYTHON)                       |
|  - geo_buzzer_router.py: Layanan 38 Provinsi, Ground Zero, BTS Cell & Berita       |
|  - osint_router.py: Layanan Forensik URL, Profil Akun, & Cross-Platform SNA       |
|  - geo_buzzer_engine.py: Basis Data Geospasial 38 Provinsi & Logika Ground Zero   |
|  - osint_engine.py: Mesin Ekstraksi oEmbed & Rekonstruksi Jejak Digital           |
|  - bot_engine.py & hoax_engine.py: Unified Bot Score & Explainable AI Rationale   |
+-----------------------------------------------------------------------------------+
```

---

## 3. KEUNGGULAN KOMPETITIF SOLUSI

1. **Cakupan Penuh 38 Provinsi Indonesia**:
   - Tidak hanya memantau pulau Jawa, melainkan menjangkau hingga wilayah pemekaran baru di Papua (Papua Selatan, Papua Tengah, Papua Pegunungan, Papua Barat Daya).
2. **Forensik Ground Zero Berbasis Stempel Waktu Rilis**:
   - Menghilangkan dugaan spekulatif dengan menyajikan bukti kronologis stempel waktu rilis ($T_0$) secara absolut dalam zona waktu lokal (WIB/WITA/WIT).
3. **Forensik Geolokasi Menara BTS**:
   - Menyajikan informasi sektor menara BTS terdekat dan ISP backbone dengan kemampuan interaktif langsung menyorot posisi fisik akun di peta via tombol `[ 📍 Lihat di Peta ]`.
4. **Analisis Interkoneksi Lintas Platform (Cross-Platform SNA)**:
   - Memetakan koordinasi terorganisir antara akun pengunggah di X, penyalin konten di Instagram, penyebar infografis di Facebook, dan bot farm.
5. **Nol Biaya Langganan API Eksternal (Zero Dependency)**:
   - Memanfaatkan protokol resmi oEmbed dan generator telemetri forensik internal yang mandiri, hemat biaya, dan dapat dioperasikan secara *air-gapped / on-premise*.
6. **Antarmuka Bersih & Ergonomis**:
   - Menghapus modal bertumpuk dan terminologi militer lama, menyajikan antarmuka 2-ruang kerja yang intuitif dan profesional.

---

## 4. METODOLOGI & RENCANA IMPLEMENTASI

1. **Fase 1 - Fondasi & Engine Analitik**: Pembuatan basis data geospasial 38 provinsi, algoritma Ground Zero, dan scraper OSINT (Selesai).
2. **Fase 2 - Antarmuka Pengguna Reaktif**: Pengembangan peta interaktif Leaflet, kartu forensik, dan graf ECharts lintas medsos (Selesai).
3. **Fase 3 - Verifikasi & Quality Assurance**: Pengujian unit tests, validasi build produksi, dan pembersihan 10 file usang (Selesai).
4. **Fase 4 - Operasional & Diseminasi**: Penyusunan dokumen teknis, SOP operasional, dan materi panduan pengguna (Selesai).
