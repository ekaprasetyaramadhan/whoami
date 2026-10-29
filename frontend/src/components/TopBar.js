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
          <!-- Menu Toggle Button (Image 2 style) -->
          <button class="topbar-menu-btn" id="btn-toggle-sidebar" title="Ciutkan / Buka Menu Navigasi" aria-label="Toggle Sidebar">
            <span class="menu-icon-bars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span class="menu-btn-text">Menu</span>
          </button>



        </div>

        <div class="topbar-right">
          <!-- Date Range Quick Filter -->
          <div class="topbar-date-filter-box">
            <span class="topbar-date-label">
              <i data-lucide="calendar" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;"></i> RENTANG:
            </span>
            <button class="btn-tactical topbar-date-btn" data-range="24h">24 Jam</button>
            <button class="btn-tactical topbar-date-btn active" data-range="7d">7 Hari</button>
            <button class="btn-tactical topbar-date-btn" data-range="30d">30 Hari</button>
          </div>

          <!-- DEFCON Status Pill -->
          <div id="topbar-defcon-pill" class="defcon-badge green">
            <i class="fa-solid fa-shield-halved"></i>
            <span id="topbar-defcon-text">STATUS AMAN</span>
          </div>

          <!-- Guide / Bantuan Button -->
          <button class="btn-tactical topbar-guide-btn" id="btn-topbar-guide" title="Panduan Penggunaan">
            <i class="fa-solid fa-circle-question"></i> <span class="guide-btn-text">PANDUAN</span>
          </button>
        </div>
      </header>
    `;

    this.bindEvents();
    this.subscribeToStore();
    renderLucideIcons(this.container);
  }

  bindEvents() {
    const toggleBtn = this.container.querySelector('#btn-toggle-sidebar');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        document.dispatchEvent(new CustomEvent('komando:toggle-sidebar'));
      };
    }

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
    const iconContainer = this.container.querySelector('#topbar-icon');

    if (heading) heading.textContent = title || '';
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
