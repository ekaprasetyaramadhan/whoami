/**
 * OnboardingModal Component
 * whoiam - Tur Interaktif 1 Menit (Panduan Langkah Demi Langkah Pemula)
 */

export class OnboardingModal {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        badge: "LANGKAH 1 DARI 3",
        icon: "fa-solid fa-map-location-dot",
        title: "🗺️ Pantau Sebaran Isu & Buzzer di 38 Provinsi",
        desc: "Peta interaktif memetakan seluruh wilayah Indonesia dari Sabang sampai Merauke secara real-time.",
        points: [
          "<strong>Klik Provinsi Mana Saja:</strong> Langsung fokus ke wilayah target untuk melihat status kerentanan informasi.",
          "<strong>Garis Panah Terbang:</strong> Melihat arah ke mana narasi menyebar dari provinsi asal (pemicu) ke provinsi lain.",
          "<strong>Filter Waktu (1 Jam s/d 7 Hari):</strong> Putar balik linimasa untuk mengetahui awal mula isu meledak."
        ],
        tip: "💡 <strong>Tips Cepat:</strong> Klik salah satu titik merah di peta untuk melihat detail pelaku dan menara BTS pemancarnya."
      },
      {
        badge: "LANGKAH 2 DARI 3",
        icon: "fa-solid fa-magnifying-glass-chart",
        title: "🔍 Selidiki Akun & Postingan Medsos (OSINT)",
        desc: "Ingin memeriksa cuitan viral mencurigakan? Cukup buka Tab ke-2 [PELACAK AKUN MEDSOS].",
        points: [
          "<strong>Tempel Tautan (URL):</strong> Masukkan link postingan dari X (Twitter), Instagram, Threads, atau Facebook.",
          "<strong>Skor Kepalsuan (Bot Score):</strong> Ketahui apakah pembuat cuitan adalah warganet asli atau robot terkoordinasi.",
          "<strong>Deteksi Foto Wajah AI:</strong> Sistem memeriksa apakah foto profil adalah wajah sintetis buatan AI.",
          "<strong>Uji Satu Dalang (Komparasi 2 Akun):</strong> Uji apakah 2 akun medsos digerakkan oleh satu dalang yang sama."
        ],
        tip: "⚡ <strong>Tips Cepat:</strong> Belum punya link? Cukup klik tombol <em>'⚡ Coba Kasus Hoaks Viral'</em> untuk langsung melihat demo analisis."
      },
      {
        badge: "LANGKAH 3 DARI 3",
        icon: "fa-regular fa-newspaper",
        title: "📰 Cek Fakta dengan Berita Resmi Daerah",
        desc: "Jangan mudah terhasut desas-desus media sosial. whoiam selalu menyandingkannya dengan fakta pers resmi.",
        points: [
          "<strong>Live Crawler Dewan Pers:</strong> Menarik artikel berita terverifikasi dari Antara, Detik, Kompas, dan CNN Indonesia.",
          "<strong>Bandingkan Berita vs Cuitan:</strong> Periksa langsung apakah isu di medsos sudah diklarifikasi oleh Pemda atau kepolisian.",
          "<strong>Jejak Sumber Pertama:</strong> Ketahui siapa akun yang pertama kali merilis konten sebelum diamplifikasi."
        ],
        tip: "🛡️ <strong>Etika Legal:</strong> Seluruh pengambilan data mematuhi aturan <code>robots.txt</code> dan menjaga privasi."
      }
    ];

    this.init();
  }

  init() {
    if (document.getElementById('onboarding-modal-backdrop')) return;

    const modal = document.createElement('div');
    modal.id = 'onboarding-modal-backdrop';
    modal.className = 'modal-backdrop';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 680px; width: 95%;">
        <div class="modal-header" style="border-bottom: 1px solid var(--color-border); padding: 14px 20px;">
          <div class="modal-title" style="display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
            <i class="fa-solid fa-compass text-cyan"></i>
            <span>PANDUAN KILAT PENGGUNA BARU (TUR 1 MENIT)</span>
          </div>
          <button class="modal-close-btn" id="btn-close-onboarding" title="Tutup Panduan">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body" style="padding: 24px 24px 16px 24px; color: #cbd5e1; font-size: 0.88rem; line-height: 1.6;">
          <!-- Indicator Steps -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <div id="onboarding-step-badge" class="tag-badge valid" style="font-size: 0.68rem; letter-spacing: 0.5px;">
              LANGKAH 1 DARI 3
            </div>
            <div style="display: flex; gap: 8px;" id="onboarding-dots">
              <span class="tour-dot active" data-step="0"></span>
              <span class="tour-dot" data-step="1"></span>
              <span class="tour-dot" data-step="2"></span>
            </div>
          </div>

          <!-- Dynamic Content Slide -->
          <div id="onboarding-slide-content">
            <!-- Injected by renderStep() -->
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="modal-footer" style="padding: 14px 20px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; background: rgba(10, 15, 22, 0.6);">
          <label style="font-size: 0.75rem; color: var(--color-text-muted); cursor: pointer; display: flex; align-items: center; gap: 6px; user-select: none;">
            <input type="checkbox" id="chk-dont-show-again" style="cursor: pointer; accent-color: var(--color-cyan);">
            Jangan tampilkan tur ini otomatis lagi
          </label>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" id="btn-onboarding-prev" style="display: none; padding: 6px 14px; font-size: 0.8rem;">
              <i class="fa-solid fa-arrow-left"></i> Kembali
            </button>
            <button class="btn btn-primary" id="btn-onboarding-next" style="padding: 6px 18px; font-size: 0.8rem;">
              Lanjut <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event Listeners
    document.getElementById('btn-close-onboarding').onclick = () => this.close();
    document.getElementById('btn-onboarding-next').onclick = () => this.nextStep();
    document.getElementById('btn-onboarding-prev').onclick = () => this.prevStep();

    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) this.close();
    };

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        this.close();
      }
    });

    this.renderStep(0);
  }

  renderStep(index) {
    this.currentStep = index;
    const step = this.steps[index];
    const container = document.getElementById('onboarding-slide-content');
    const badge = document.getElementById('onboarding-step-badge');
    const prevBtn = document.getElementById('btn-onboarding-prev');
    const nextBtn = document.getElementById('btn-onboarding-next');
    const dots = document.querySelectorAll('.tour-dot');

    if (!container || !step) return;

    badge.textContent = step.badge;

    dots.forEach((dot, idx) => {
      dot.className = idx === index ? 'tour-dot active' : 'tour-dot';
    });

    container.innerHTML = `
      <div style="animation: fadeIn 0.25s ease;">
        <h3 style="color: #fff; font-size: 1.05rem; margin-bottom: 6px; display: flex; align-items: center; gap: 10px;">
          <i class="${step.icon} text-cyan"></i> ${step.title}
        </h3>
        <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 14px;">
          ${step.desc}
        </p>

        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--color-border); border-radius: 6px; padding: 12px 16px; margin-bottom: 14px;">
          <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 8px;">
            ${step.points.map(p => `<li style="line-height: 1.5;">${p}</li>`).join('')}
          </ul>
        </div>

        <div style="background: rgba(0, 229, 255, 0.08); border-left: 3px solid var(--color-cyan); padding: 8px 12px; border-radius: 0 4px 4px 0; font-size: 0.8rem; color: #e2e8f0;">
          ${step.tip}
        </div>
      </div>
    `;

    // Button states
    if (index === 0) {
      prevBtn.style.display = 'none';
      nextBtn.innerHTML = 'Lanjut <i class="fa-solid fa-arrow-right"></i>';
    } else if (index === this.steps.length - 1) {
      prevBtn.style.display = 'inline-flex';
      nextBtn.innerHTML = 'Mulai Jelajah Sekarang 🚀';
    } else {
      prevBtn.style.display = 'inline-flex';
      nextBtn.innerHTML = 'Lanjut <i class="fa-solid fa-arrow-right"></i>';
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.renderStep(this.currentStep + 1);
    } else {
      this.close();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.renderStep(this.currentStep - 1);
    }
  }

  open() {
    const modal = document.getElementById('onboarding-modal-backdrop');
    if (modal) {
      this.renderStep(0);
      modal.style.display = 'flex';
    }
  }

  close() {
    const modal = document.getElementById('onboarding-modal-backdrop');
    const chk = document.getElementById('chk-dont-show-again');

    if (chk && chk.checked) {
      localStorage.setItem('whoiam_onboarding_dismissed', 'true');
    }

    if (modal) {
      modal.style.display = 'none';
    }
  }

  checkAutoPrompt() {
    const dismissed = localStorage.getItem('whoiam_onboarding_dismissed');
    if (!dismissed) {
      setTimeout(() => {
        this.open();
      }, 700);
    }
  }
}
