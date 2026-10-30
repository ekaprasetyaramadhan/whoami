/**
 * GuideModal Component
 * KOMANDO - Panduan Penggunaan & Cara Membaca Dashboard
 */

export class GuideModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    if (document.getElementById('guide-modal-backdrop')) return;

    const modal = document.createElement('div');
    modal.id = 'guide-modal-backdrop';
    modal.className = 'modal-backdrop';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 820px; max-height: 85vh; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);">
        <div class="modal-header" style="padding: 16px 22px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <div class="modal-title" style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.05rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-circle-question" style="color: #2563eb; font-size: 1.1rem;"></i>
            <span>PANDUAN PENGGUNAAN & MEMBACA DATA</span>
            <span style="font-size: 0.65rem; background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 4px; border: 1px solid #bfdbfe; font-weight: 700; letter-spacing: 0.04em;">
              KOMANDO INTELIJEN
            </span>
          </div>
          <button class="modal-close-btn" id="btn-close-guide" style="background: transparent; border: none; color: #64748b; font-size: 1.25rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color 0.2s;" title="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body" style="padding: 24px; overflow-y: auto; line-height: 1.6; font-size: 0.85rem; color: #334155; background: #ffffff;">
          
          <div style="margin-bottom: 22px;">
            <h3 style="color: #0f172a; font-size: 1rem; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-map-location-dot" style="color: #2563eb;"></i> Peta Sebaran Buzzer 38 Provinsi
            </h3>
            <p style="color: #475569; margin: 0 0 8px 0;">Memetakan seluruh 38 provinsi di Indonesia dengan hierarki jaringan buzzer dan kluster botnet terkoordinasi:</p>
            <ul style="margin-left: 20px; margin-top: 6px; display: flex; flex-direction: column; gap: 6px; color: #334155;">
              <li><strong style="color: #ef4444;">Titik Merah (High Threat):</strong> Akun Koordinator Inti / Provokator Utama (Ground Zero) dengan indikasi bot/provokasi &gt;75%.</li>
              <li><strong style="color: #8b5cf6;">Titik Ungu (Medium Threat):</strong> Akun Hub Lintas Medsos (Secondary Coordinator / Amplifikasi).</li>
              <li><strong style="color: #0284c7;">Hierarki Kluster:</strong> Setiap titik mewakili Koordinator Inti yang mengendalikan 18–35 botnet amplifier aktif di wilayah tersebut.</li>
              <li><strong style="color: #0f172a;">Pill Badge Peta:</strong> Menampilkan nama kota dan estimasi jangkauan follower utama secara rapi tanpa teks bertumpuk.</li>
            </ul>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-bottom: 22px;">
            <h3 style="color: #0f172a; font-size: 1rem; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-bullseye" style="color: #2563eb;"></i> 4 Tab Intelijen Wilayah (Peta Sebaran)
            </h3>
            <ul style="margin-left: 20px; margin-top: 6px; display: flex; flex-direction: column; gap: 6px; color: #334155;">
              <li><strong style="color: #0f172a;">1. Peta Geografis (38 Provinsi):</strong> Visualisasi persebaran nasional dan garis propagasi penerbangan penyebaran narasi.</li>
              <li><strong style="color: #0f172a;">2. Jejaring Aktor (SNA Full Canvas):</strong> Visualisasi graf interaksi antara Ground Zero, Hub Lintas Medsos, Bot Farm Amplifiers, dan Warga Organik.</li>
              <li><strong style="color: #0f172a;">3. Live Stream Medsos & Ground Zero:</strong> Feed cuitan dan postingan buzzer lokal lengkap dengan stempel waktu rilis presisi (Ground Zero) dan jejak BTS geolokasi.</li>
              <li><strong style="color: #0f172a;">4. Radar Berita Resmi Daerah:</strong> Crawler berita nyata real-time dari portal terakreditasi Dewan Pers untuk verifikasi silang narasi buzzer.</li>
            </ul>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 18px;">
            <h3 style="color: #0f172a; font-size: 1rem; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-satellite-dish" style="color: #2563eb;"></i> Pelacak Akun Medsos
            </h3>
            <p style="color: #475569; margin: 0;">Masukkan username, nama profil, tagar (contoh: <code>#28Oktober</code>), atau tautan akun publik di X, TikTok, Instagram, Facebook, YouTube, atau Threads untuk membedah skor probabilitas bot, analisis entropi teks, burst sinkronisasi waktu, dan riwayat aktivitas 30 hari.</p>
          </div>

        </div>

        <div class="modal-footer" style="padding: 14px 22px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
          <button id="btn-guide-got-it" class="btn-tactical cyan" style="padding: 8px 18px; font-size: 0.76rem; font-weight: 700;">
            <i class="fa-solid fa-check"></i> SAYA MENGERTI
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Listeners
    modal.querySelector('#btn-close-guide').onclick = () => this.close();
    modal.querySelector('#btn-guide-got-it').onclick = () => this.close();
    modal.onclick = (e) => {
      if (e.target === modal) this.close();
    };
  }

  open() {
    if (this.modal) this.modal.style.display = 'flex';
  }

  close() {
    if (this.modal) this.modal.style.display = 'none';
  }
}
