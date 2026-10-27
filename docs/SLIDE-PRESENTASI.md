# 📊 SLIDE PRESENTASI PITCH DECK
## whoiam
### *Sistem Intelijen Media Sosial, Forensik Geolokasi & Deteksi Buzzer 38 Provinsi*
**Versi: 3.1.0 | Role: user**

---

### SLIDE 1: JUDUL & IDENTITAS
- **Judul Produk**: **whoiam**
- **Subjudul**: Sistem Intelijen Media Sosial, Deteksi Wajah AI & Forensik Akun Terpadu
- **Fokus Utama**: Peta Sebaran Buzzer 38 Provinsi, Garis Propagasi Isu (*Flight Lines*), Deteksi Sumber Postingan Pertama (*Ground Zero*), Forensik Geolokasi & Menara BTS, Deteksi Avatar AI GAN, dan Komparasi 2 Akun Berdampingan (*Synchronicity Comparator*).
- **Pesan Kunci**: *"Melacak Dalang Pertama, Memetakan Lokasi Fisik, Membongkar Avatar Sintetis, dan Membuktikan Operator Tunggal Buzzer di Seluruh Penjuru Nusantara."*

---

### SLIDE 2: PERNYATAAN MASALAH DIGITAL INDONESIA
1. **Pola Multi-Platform**: Hoaks dan fitnah berpindah cepat dari X ke Instagram, Facebook, dan Threads tanpa jejak terpadu.
2. **Ketiadaan Sumber Asal (*Zero Origin*)**: Analis kewalahan menentukan akun mana yang pertama kali merilis hoaks sebelum viral.
3. **Ketiadaan Lokasi Fisik (*Geolocation Blindspot*)**: Pelaku bersembunyi di balik anonimitas tanpa diketahui posisi geografis dan menara BTS-nya.
4. **Wajah Palsu Sintetis (*Synthetic AI Avatars*)**: Jaringan buzzer menggunakan foto profil buatan StyleGAN/Diffusion untuk memanipulasi persepsi publik.
5. **Kesulitan Membuktikan Operator Tunggal**: Tidak adanya alat ukur matematis untuk membuktikan dua akun berbeda digerakkan oleh satu dalang/skrip yang sama.

---

### SLIDE 3: PILAR UTAMA SOLUSI whoiam
1. **Peta Sebaran Buzzer 38 Provinsi & Garis Propagasi Isu**: 100% provinsi terpetakan dengan visualisasi garis lengkung terbang (*flight lines*) animasi inter-provinsi dan filter rentang waktu dinamis (`1 JAM`, `6 JAM`, `24 JAM`, `7 HARI`).
2. **Ground Zero / Patient Zero Detection**: Menemukan akun sumber awal berdasarkan tanggal/jam rilis absolut (`date_time_release`) dan linimasa propagasi waktu.
3. **Forensik Geolokasi Presisi & Menara BTS**: Koordinat GPS, identifikasi sektor pemancar BTS terdekat, ISP backbone, dan penanda radar.
4. **Deteksi Avatar AI / Wajah Sintetis (GAN Forensics)**: Membedah keaslian foto profil, mendeteksi probabilitas StyleGAN/Diffusion, disorientasi simetri pupil mata, dan artefak anting/telinga.
5. **Komparasi 2 Akun Berdampingan (Synchronicity Comparator)**: Menguji keselarasan dua URL akun (kesamaan leksikal Jaccard, selisih waktu detik, kedekatan subnet BTS, dan status operator tunggal).
6. **Ekstraksi Topik & Awan Kata Kunci (*Topic Cloud*)**: Mengidentifikasi kata kunci dan tagar dominan yang dikuatkan secara masif oleh jejaring buzzer.
7. **Verifikasi Berita Resmi Daerah vs Medsos**: Membandingkan rilis instansi terverifikasi (live crawler Google News RSS Dewan Pers) dengan hoaks medsos secara *side-by-side*.

---

### SLIDE 4: ARSITEKTUR TEKNOLOGI EFISIEN
- **Frontend SPA**: Vite 5, Vanilla JavaScript (ES6+), Apache ECharts 5 (GeoJSON Indonesia & Community Graph), Desain Glassmorphism Dark Theme.
- **Backend Service**: Python 3.14+, FastAPI, Uvicorn, NetworkX, Httpx, BeautifulSoup4, Live RSS Engine, Pydantic type-safe.
- **Karakteristik Arsitektur**: Sangat ringan, responsif (< 1.5 detik per inspeksi), mandiri tanpa biaya langganan API eksternal.

---

### SLIDE 5: 2 RUANG KERJA OPERASIONAL (STREAMLINED UX)
- **Tab 1: Peta & Sebaran Buzzer**:
  - Peta geografis 38 provinsi berindikator warna risiko (Tinggi/Sedang/Rendah).
  - Garis animasi penerbangan isu (*flight lines*) dengan rute dan kecepatan cph.
  - Bilah filter rentang waktu dinamis (`1 JAM`, `6 JAM`, `24 JAM`, `7 HARI`) dan tombol toggle jalur propagasi.
  - 3 Sub-tab kanan: SNA Wilayah, Live Crawler Berita Daerah (Dewan Pers), dan Scraping Medsos.
- **Tab 2: Pelacak Akun Medsos**:
  - 3 Sub-tab: 1. Bedah URL Postingan, 2. Lacak Tagar/Tren, 3. Komparasi 2 Akun (Sync Comparator).
  - 5 Pilar Forensik URL: Ground Zero, BTS Geofix, Cross-SNA, Deteksi Avatar AI GAN, dan Awan Topik/Tagar.
  - Komparasi side-by-side 2 Akun dengan scorecard korelasi operator tunggal.

---

### SLIDE 6: KESIMPULAN & NILAI STRATEGIS
**whoiam** menghadirkan kapabilitas forensik siber tingkat lanjut yang dapat diakses dengan mudah oleh setiap analis:
- **Cepat**: Analisis jejak digital dalam hitungan detik.
- **Akurat**: Berbasis stempel waktu rilis absolut, data geospasial BTS, dan GAN forensics.
- **Lengkap**: Menjangkau 38 provinsi di seluruh Indonesia beserta jalur propagasi antar-wilayah.
- **Ekonomis**: Tanpa ketergantungan API berbayar.
