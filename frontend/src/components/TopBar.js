/**
 * TopBar Component
 * Displays Route Title, Breadcrumbs, Date & Analytics Quick Filters, DEFCON Status Pill, and Help Modal Trigger
 */

import { CognitiveStore } from '../state/store.js';
import { renderLucideIcons } from '../utils/icons.js';

export class TopBar {
  constructor(containerId, onDateFilterChange) {
    this.container = document.getElementById(containerId);
    this.onDateFilterChange = onDateFilterChange;
    this.activeTimeframe = '7d';
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <header class="komando-topbar">
        <div class="topbar-left">
          <div class="topbar-page-title" id="topbar-title">
            <span class="nav-icon" id="topbar-icon"><i data-lucide="layout-dashboard"></i></span>
            <span id="topbar-heading">Dashboard</span>
          </div>
          <span class="topbar-page-sub" id="topbar-sub">Ringkasan analitik percakapan, sentimen, dan metrik narasi digital.</span>
        </div>

        <div class="topbar-right">
          <!-- Date Range Quick Filter -->
          <div style="display: flex; align-items: center; gap: 4px; background: #f8fafc; padding: 3px 6px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <span style="font-size: 0.68rem; color: #64748b; font-weight: 600; padding: 0 4px;">
              <i data-lucide="calendar" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;"></i> RENTANG:
            </span>
            <button class="btn-tactical topbar-date-btn" data-range="24h" style="padding: 2px 8px; font-size: 0.65rem;">24 Jam</button>
            <button class="btn-tactical topbar-date-btn active" data-range="7d" style="padding: 2px 8px; font-size: 0.65rem; color: #2563eb; border-color: #93c5fd; background: #eff6ff;">7 Hari</button>
            <button class="btn-tactical topbar-date-btn" data-range="30d" style="padding: 2px 8px; font-size: 0.65rem;">30 Hari</button>
          </div>

          <!-- DEFCON Status Pill -->
          <div id="topbar-defcon-pill" class="defcon-badge green" style="font-size: 0.68rem; padding: 4px 10px; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 9999px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-shield-halved"></i>
            <span id="topbar-defcon-text">STATUS AMAN</span>
          </div>

          <!-- Guide / Bantuan Button -->
          <button class="btn-tactical" id="btn-topbar-guide" style="padding: 5px 10px; font-size: 0.72rem;">
            <i class="fa-solid fa-circle-question"></i> PANDUAN
          </button>
        </div>
      </header>
    `;

    this.bindEvents();
    this.subscribeToStore();
    renderLucideIcons(this.container);
  }

  bindEvents() {
    const dateBtns = this.container.querySelectorAll('.topbar-date-btn');
    dateBtns.forEach((btn) => {
      btn.onclick = () => {
        dateBtns.forEach((b) => {
          b.classList.remove('active');
          b.style.color = '';
          b.style.borderColor = '';
          b.style.background = '';
        });
        btn.classList.add('active');
        btn.style.color = '#2563eb';
        btn.style.borderColor = '#93c5fd';
        btn.style.background = '#eff6ff';
        this.activeTimeframe = btn.dataset.range;
        if (this.onDateFilterChange) this.onDateFilterChange(this.activeTimeframe);
      };
    });

    const guideBtn = this.container.querySelector('#btn-topbar-guide');
    if (guideBtn) {
      guideBtn.onclick = () => {
        const modalBtn = document.getElementById('btn-open-guide');
        if (modalBtn) modalBtn.click();
      };
    }
  }

  updateHeader(title, subtitle, iconName) {
    const heading = this.container.querySelector('#topbar-heading');
    const sub = this.container.querySelector('#topbar-sub');
    const iconContainer = this.container.querySelector('#topbar-icon');

    if (heading) heading.textContent = title;
    if (sub) sub.textContent = subtitle;
    if (iconContainer && iconName) {
      iconContainer.innerHTML = `<i data-lucide="${iconName}"></i>`;
      renderLucideIcons(iconContainer);
    }
  }

  subscribeToStore() {
    CognitiveStore.subscribe((state) => {
      const pill = this.container.querySelector('#topbar-defcon-pill');
      const text = this.container.querySelector('#topbar-defcon-text');
      if (!pill || !text) return;

      const level = state.threatLevel;
      const num = state.defcon;

      pill.className = 'defcon-badge';
      if (level === 'RED' || num <= 2) {
        pill.classList.add('red');
        text.textContent = `DEFCON ${num} (ANCAMAN TINGGI)`;
      } else if (level === 'AMBER' || num <= 4) {
        pill.classList.add('yellow');
        text.textContent = `DEFCON ${num} (WASPADA)`;
      } else {
        pill.classList.add('green');
        text.textContent = `DEFCON 5 (AMAN)`;
      }
    });
  }
}
