/**
 * GuideModal Component
 * whoiam - Panduan Penggunaan & Cara Membaca Dashboard
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
      <div class="modal-card" style="max-width: 820px; max-height: 85vh;">
        <div class="modal-header">
          <div class="modal-title">
            <i class="fa-solid fa-circle-question text-cyan"></i> PANDUAN PENGGUNAAN & MEMBACA DATA
            <span style="font-size: 0.65rem; background: rgba(0, 229, 255, 0.15); color: var(--color-cyan); padding: 2px 6px; border-radius: 3px; border: 1px solid var(--color-cyan); margin-left: 8px;">
              WHOIAM INTELIJEN
            </span>
          </div>
          <button class="modal-close-btn" id="btn-close-guide">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body" style="padding: 24px; overflow-y: auto; line-height: 1.6; font-size: 0.85rem; color: #cbd5e1;">
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #fff; font-size: 1rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-map-location-dot text-cyan"></i> Peta Sebaran Buzzer 38 Provinsi
            </h3>
            <p>Memetakan seluruh 38 provinsi di Indonesia dengan hierarki jaringan buzzer dan kluster botnet terkoordinasi:</p>
            <ul style="margin-left: 20px; margin-top: 6px; display: flex; flex-direction: column; gap: 6px;">
              <li><strong style="color: #ef4444;">Titik Merah (High Threat):</strong> Akun Koordinator Inti / Provokator Utama (Ground Zero) dengan indikasi bot/provokasi >75%.</li>
              <li><strong style="color: #8b5cf6;">Titik Ungu (Medium Threat):</strong> Akun Hub Lintas Medsos (Secondary Coordinator / Amplifikasi).</li>
              <li><strong style="color: #38bdf8;">Hierarki Kluster:</strong> Setiap titik mewakili Koordinator Inti yang mengendalikan 18–35 botnet amplifier aktif di wilayah tersebut.</li>
              <li><strong style="color: #fff;">Pill Badge Peta:</strong> Menampilkan nama kota dan estimasi jangkauan follower utama secara rapi tanpa teks bertumpuk.</li>
            </ul>
          </div>

          <div style="border-top: 1px solid var(--color-border); padding-top: 16px; margin-bottom: 20px;">
            <h3 style="color: #fff; font-size: 1rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-bullseye text-cyan"></i> 3 Tab Intelijen Wilayah (Sisi Kanan)
            </h3>
            <ul style="margin-left: 20px; margin-top: 6px; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>1. Topologi SNA Wilayah:</strong> Visualisasi graf interaksi antara Ground Zero, Hub Lintas Medsos, Bot Farm Amplifiers, dan Warga Organik.</li>
              <li><strong>2. Berita Wilayah (Live Dewan Pers):</strong> Crawler berita nyata real-time dari portal kredibel (Antara, Kompas, CNN Indonesia, Detik, dll.) untuk verifikasi silang narasi buzzer.</li>
              <li><strong>3. Scraping Medsos:</strong> Feed cuitan dan postingan buzzer lokal lengkap dengan stempel waktu rilis presisi (Ground Zero) dan jejak BTS geolokasi.</li>
            </ul>
          </div>

          <div style="border-top: 1px solid var(--color-border); padding-top: 16px;">
            <h3 style="color: #fff; font-size: 1rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-satellite-dish text-cyan"></i> Pelacak Akun Medsos (Tab 2)
            </h3>
            <p>Masukkan tautan URL postingan apa pun dari X, Threads, Instagram, atau Facebook untuk membedah identitas akun, mengukur Unified Bot Index, merekonstruksi linimasa Ground Zero ($T+0\text{m}$), dan melacak koordinat BTS geolokasi perangkat tersangka secara inline.</p>
          </div>

        </div>

        <div class="modal-footer" style="padding: 12px 20px; background: var(--color-panel-header); border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end;">
          <button id="btn-guide-got-it" class="btn-tactical cyan">
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
