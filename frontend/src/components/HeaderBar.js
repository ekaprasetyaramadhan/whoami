/**
 * HeaderBar Component
 * whoiam - Social Media Intelligence & Account Forensics
 * Menampilkan Identitas Sistem, Jam Operasional Real-time, Status Alert Barometer, dan Tombol Kontrol.
 */

export class HeaderBar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="brand-wrapper">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10161d, #1f2937); border: 1px solid var(--color-cyan); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 0 12px var(--color-cyan-glow);">
          🔍
        </div>
        <div>
          <div class="brand-title">
            whoiam
            <span style="font-size: 0.65rem; background: rgba(0, 229, 255, 0.15); color: var(--color-cyan); padding: 2px 6px; border-radius: 3px; border: 1px solid var(--color-cyan);">FORENSICS</span>
          </div>
          <div class="brand-subtitle">Social Media Intelligence & Account Forensics</div>
        </div>
      </div>

      <!-- Right Guide Action -->
      <div style="display: flex; align-items: center; gap: 10px;">
        <button id="btn-open-guide" class="btn-tactical cyan" title="Buka Panduan & Cara Membaca Dashboard">
          <span class="fa-solid fa-circle-question"></span> PANDUAN SISTEM
        </button>
      </div>
    `;
  }
}
