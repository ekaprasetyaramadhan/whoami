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

      <!-- Right Guide & Tour Actions -->
      <div style="display: flex; align-items: center; gap: 8px;">
        <div id="header-ws-badge" class="tag-badge valid" style="font-size: 0.68rem; display: flex; align-items: center; gap: 6px; padding: 5px 10px; background: rgba(16, 185, 129, 0.12); border-color: #10b981; color: #10b981;" title="Status Aliran Data Telemetri Real-time">
          <span id="header-ws-dot" style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
          <span id="header-ws-text">RADAR LIVE</span>
        </div>
        <button id="btn-open-tour" class="btn-tactical" style="background: rgba(0, 229, 255, 0.12); border-color: var(--color-cyan); color: var(--color-cyan);" title="Mulai Tur Interaktif 1 Menit">
          <span class="fa-solid fa-compass"></span> TUR 1 MENIT
        </button>
        <button id="btn-open-guide" class="btn-tactical cyan" title="Buka Panduan & Cara Membaca Dashboard">
          <span class="fa-solid fa-circle-question"></span> BUKU PANDUAN
        </button>
      </div>
    `;

    // Listen to WebSocket status changes
    window.addEventListener('whoiam:ws_status', (e) => {
      const dot = document.getElementById('header-ws-dot');
      const text = document.getElementById('header-ws-text');
      const badge = document.getElementById('header-ws-badge');
      if (e.detail && e.detail.connected) {
        if (dot) dot.style.background = '#10b981';
        if (text) text.textContent = 'RADAR LIVE';
        if (badge) {
          badge.style.borderColor = '#10b981';
          badge.style.color = '#10b981';
        }
      } else {
        if (dot) dot.style.background = '#f59e0b';
        if (text) text.textContent = 'MENGHUBUNGKAN...';
        if (badge) {
          badge.style.borderColor = '#f59e0b';
          badge.style.color = '#f59e0b';
        }
      }
    });
  }
}
