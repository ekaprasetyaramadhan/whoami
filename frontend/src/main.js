/**
 * whoiam Frontend Bootstrap
 * Social Media Intelligence & Regional Buzzer Forensics Platform
 */

import { CognitiveStore } from './state/store.js';
import { streamService } from './services/stream.js';
import { ApiService } from './services/api.js';

import { HeaderBar } from './components/HeaderBar.js';
import { GuideModal } from './components/GuideModal.js';
import { GeoBuzzerView } from './components/GeoBuzzerView.js';
import { OsintInlineView } from './components/OsintInlineView.js';

console.log('🔍 Memulai whoiam Social Media Intelligence Platform...');

let geoBuzzerInstance = null;

// Inisialisasi Seluruh Komponen War Room
function initWarRoom() {
  // 1. Header Bar
  new HeaderBar('header-container');

  // 2. Modals & Dialogs
  const guideModal = new GuideModal();

  // Pasang listener panduan di Header
  const guideBtn = document.getElementById('btn-open-guide');
  if (guideBtn) {
    guideBtn.onclick = () => guideModal.open();
  }

  // 3. TAB 1: Mount GeoBuzzerView langsung ke tampilan utama
  // (Peta Indonesia + Titik Follower Terbanyak + SNA Wilayah + Berita Daerah + Scraping Medsos)
  const geoContainer = document.getElementById('tab-pane-geo');
  if (geoContainer) {
    geoBuzzerInstance = new GeoBuzzerView('tab-pane-geo');
  }

  // 4. TAB 2: OSINT Scraper Inline (Investigasi URL Postingan / Profil & Tagar)
  const osintContainer = document.getElementById('osint-inline-container');
  if (osintContainer) {
    new OsintInlineView('osint-inline-container');
  }

  // 5. Navigasi Tab Utama
  initTabNavigation();

  // 7. Mulai Stream WebSocket
  streamService.connect();
}

/**
 * Setup Navigasi Antar Tab (Peta Buzzer & OSINT Live)
 */
function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.main-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update button active states
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update pane visibility
      tabPanes.forEach(pane => {
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Berikan jeda sejenak lalu trigger resize agar kanvas ECharts menyesuaikan ukuran
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (targetTabId === 'tab-pane-geo' && geoBuzzerInstance) {
          geoBuzzerInstance.resize();
        }
      }, 50);
    });
  });
}

// Jalankan bootstrapping saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initWarRoom();
});
