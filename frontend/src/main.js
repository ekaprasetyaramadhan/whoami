/**
 * KOMANDO Application Bootstrap
 * Komando Monitoring dan Analisis Narasi Digital Online
 */

import { streamService } from './services/stream.js';
import { authService } from './services/auth.js';
import { Sidebar } from './components/Sidebar.js';
import { TopBar } from './components/TopBar.js';
import { GuideModal } from './components/GuideModal.js';
import { LoginView } from './components/LoginView.js';
import { KomandoDashboardView } from './components/KomandoDashboardView.js';
import { GeoBuzzerView } from './components/GeoBuzzerView.js';
import { PelacakAkunMedsosView } from './components/PelacakAkunMedsosView.js';
import { MyAgentView } from './components/MyAgentView.js';
import { AppRouter } from './router.js';
import { renderLucideIcons } from './utils/icons.js';

console.log('🛡️ Memulai KOMANDO: Komando Monitoring dan Analisis Narasi Digital Online...');

let sidebarInstance = null;
let topbarInstance = null;
let loginInstance = null;
let dashboardInstance = null;
let petaSebaranInstance = null;
let pelacakAkunInstance = null;
let myAgentInstance = null;

function initKomando() {
  // 1. Inisialisasi Guide Modal
  const guideModal = new GuideModal();
  const guideBtn = document.getElementById('btn-open-guide');
  if (guideBtn) {
    guideBtn.onclick = () => guideModal.open();
  }

  // 2. Inisialisasi Halaman Login
  loginInstance = new LoginView('view-login', (user) => {
    if (sidebarInstance) sidebarInstance.updateUser(user);
    if (!streamService.ws) {
      streamService.connect();
    }
    if (window.router) {
      window.router.navigate('/dashboard', {}, true);
    }
  });

  // 3. Inisialisasi 4 Halaman Utama
  dashboardInstance = new KomandoDashboardView('view-dashboard');
  petaSebaranInstance = new GeoBuzzerView('view-peta-sebaran');
  pelacakAkunInstance = new PelacakAkunMedsosView('view-pelacak-akun');
  myAgentInstance = new MyAgentView('view-my-agent');

  // 4. Konfigurasi Client-Side Router
  const router = new AppRouter({
    '/login': () => {
      const v = document.getElementById('view-login');
      if (v) v.style.display = 'block';
      if (loginInstance) loginInstance.startBinaryRain();
    },
    '/dashboard': () => {
      if (loginInstance) loginInstance.stopBinaryRain();
      const v = document.getElementById('view-dashboard');
      if (v) v.style.display = 'block';
      if (topbarInstance) {
        topbarInstance.updateHeader('Dashboard', 'Ringkasan analitik percakapan, sentimen, dan metrik narasi digital.', 'layout-dashboard');
      }
      if (dashboardInstance) dashboardInstance.resize();
    },
    '/peta-sebaran-buzzer': (params) => {
      const v = document.getElementById('view-peta-sebaran');
      if (v) v.style.display = 'block';
      if (topbarInstance) {
        topbarInstance.updateHeader('Peta Sebaran Buzzer', 'Visualisasi persebaran akun dan aktivitas media sosial berdasarkan wilayah.', 'map-pinned');
      }
      if (petaSebaranInstance) {
        setTimeout(() => {
          petaSebaranInstance.resize();
        }, 80);
        if (params && params.province) {
          petaSebaranInstance.changeProvince(params.province);
        }
      }
    },
    '/pelacak-akun-medsos': (params) => {
      const v = document.getElementById('view-pelacak-akun');
      if (v) v.style.display = 'block';
      if (topbarInstance) {
        topbarInstance.updateHeader('Pelacak Akun Medsos', 'Pemantauan akun dan aktivitas media sosial yang tersedia secara terbuka.', 'scan-search');
      }
      if (pelacakAkunInstance) {
        pelacakAkunInstance.resize();
        if (params && params.query) {
          pelacakAkunInstance.setQuery(params.query);
        }
      }
    },
    '/my-agent': () => {
      const v = document.getElementById('view-my-agent');
      if (v) v.style.display = 'block';
      if (topbarInstance) {
        topbarInstance.updateHeader('My Agent', 'Kelola dan jalankan agent untuk membantu analisis data.', 'bot');
      }
    }
  });

  window.router = router;

  // 4. Inisialisasi Sidebar
  sidebarInstance = new Sidebar('sidebar-container', (route) => {
    router.navigate(route);
  });

  // 5. Inisialisasi Topbar
  topbarInstance = new TopBar('topbar-container', (range) => {
    console.log('Filter rentang tanggal aktif:', range);
  });

  router.setComponents(sidebarInstance, topbarInstance);
  router.init();

  // 6. Hubungkan WebSocket Telemetry Stream jika terautentikasi
  if (authService.isAuthenticated()) {
    streamService.connect();
  }

  // 7. Render Seluruh Ikon Lucide
  renderLucideIcons(document);

  // 8. Global Resize Listener untuk refit responsif semua grafik dengan debouncing
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (dashboardInstance && typeof dashboardInstance.resize === 'function') {
        dashboardInstance.resize();
      }
      if (petaSebaranInstance && typeof petaSebaranInstance.resize === 'function') {
        petaSebaranInstance.resize();
      }
      if (pelacakAkunInstance && typeof pelacakAkunInstance.resize === 'function') {
        pelacakAkunInstance.resize();
      }
    }, 150);
  });
}

function bootstrap() {
  try {
    initKomando();
  } catch (err) {
    console.error('Fatal initialization error in initKomando:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
