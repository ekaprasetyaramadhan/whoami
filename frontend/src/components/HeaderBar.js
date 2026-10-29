/**
 * HeaderBar Component
 * whoiam - Social Media Intelligence & Regional Buzzer Forensics
 * Menampilkan Identitas Sistem, Logo Komando, Jam Operasional Real-time, dan Status DEFCON Live.
 */

import { CognitiveStore } from '../state/store.js';

export class HeaderBar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="brand-wrapper" style="display: flex; align-items: center; gap: 14px;">
        <img src="/Komando.png" alt="Logo Komando" style="height: 62px; width: 62px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.7)); flex-shrink: 0;">
        <div>
          <div class="brand-title" style="font-size: 1.45rem; font-weight: 800; color: #fff; letter-spacing: 0.05em; line-height: 1.05; margin: 1px 0 3px 0;">
            KOMANDO
          </div>
          <div class="brand-subtitle" style="font-size: 0.65rem; color: #38bdf8; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1.3;">
            MONITORING DAN ANALISIS<br>NARASI DIGITAL ONLINE
          </div>
        </div>
      </div>

      <!-- Right Actions: Status Barometer & System Guide -->
      <div style="display: flex; align-items: center; gap: 14px;">
        <div id="header-defcon-status" style="display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.72rem; background: #0c1219; border: 1px solid var(--color-border); padding: 5px 12px; border-radius: 4px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;" id="header-defcon-dot"></span>
          <span style="color: var(--color-text-muted);">STATUS SISTEM:</span>
          <strong id="header-defcon-text" style="color: #10b981;">DEFCON 5 (NORMAL)</strong>
        </div>

        <button id="btn-open-guide" class="btn-tactical cyan" title="Buka Panduan & Cara Membaca Dashboard">
          <i class="fa-solid fa-circle-question"></i> PANDUAN SISTEM
        </button>
      </div>
    `;

    // Pasang subscriber store untuk update status defcon secara reaktif
    CognitiveStore.subscribe((state) => {
      const dot = document.getElementById('header-defcon-dot');
      const text = document.getElementById('header-defcon-text');
      if (dot && text) {
        if (state.threatLevel === 'RED' || state.defcon <= 2) {
          dot.style.background = '#ef4444';
          dot.style.boxShadow = '0 0 10px #ef4444';
          text.style.color = '#ef4444';
          text.textContent = `DEFCON ${state.defcon} (ANCAMAN KRITIS)`;
        } else if (state.threatLevel === 'YELLOW' || state.defcon <= 4) {
          dot.style.background = '#f59e0b';
          dot.style.boxShadow = '0 0 10px #f59e0b';
          text.style.color = '#f59e0b';
          text.textContent = `DEFCON ${state.defcon} (WASPADA)`;
        } else {
          dot.style.background = '#10b981';
          dot.style.boxShadow = '0 0 10px #10b981';
          text.style.color = '#10b981';
          text.textContent = `DEFCON ${state.defcon} (NORMAL)`;
        }
      }
    });
  }
}
