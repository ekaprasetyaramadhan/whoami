/**
 * Sidebar Component for KOMANDO Platform
 * Provides Left-Hand Navigation for:
 * 1. Dashboard (/dashboard)
 * 2. Peta Sebaran Buzzer (/peta-sebaran-buzzer)
 * 3. Pelacak Akun Medsos (/pelacak-akun-medsos)
 * 4. My Agent (/my-agent)
 */

import { renderLucideIcons } from '../utils/icons.js';
import { authService } from '../services/auth.js';

export class Sidebar {
  constructor(containerId, onNavigate) {
    this.container = document.getElementById(containerId);
    this.onNavigate = onNavigate;
    this.currentRoute = '/dashboard';
    this.isCollapsed = localStorage.getItem('komando_sidebar_collapsed') === 'true';
    this.init();
  }

  init() {
    if (!this.container) return;

    const user = authService.getUser() || { full_name: 'Operator Komando 1', role: 'user' };
    const appLayout = document.getElementById('app-layout');
    if (appLayout) {
      if (this.isCollapsed) {
        appLayout.classList.add('sidebar-collapsed');
      } else {
        appLayout.classList.remove('sidebar-collapsed');
      }
    }

    this.container.innerHTML = `
      <aside class="komando-sidebar ${this.isCollapsed ? 'collapsed' : ''}" id="komando-sidebar">
        <!-- Logo & Branding -->
        <div class="sidebar-brand-box">
          <img src="/Komando.png" alt="Komando Logo" class="sidebar-logo-img" onerror="this.src='./Komando.png'" />
          <div class="sidebar-brand-text">
            <div class="sidebar-brand-title">KOMANDO</div>
            <div class="sidebar-brand-sub">
              <div class="brand-sub-line">
                <span>KOMANDO</span>
                <span>MONITORING</span>
                <span>DAN</span>
              </div>
              <div class="brand-sub-line">
                <span>ANALISIS</span>
                <span>NARASI</span>
              </div>
              <div class="brand-sub-line">
                <span>DIGITAL</span>
                <span>ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Primary Navigation Items (Exact Required Order) -->
        <nav class="sidebar-nav-list" id="sidebar-nav-list">
          <!-- 1. Dashboard -->
          <a class="sidebar-nav-item ${this.currentRoute === '/dashboard' ? 'active' : ''}" data-route="/dashboard" id="nav-item-dashboard" data-tooltip="Dashboard" title="Dashboard">
            <span class="nav-icon"><i data-lucide="layout-dashboard"></i></span>
            <span class="nav-text">Dashboard</span>
          </a>

          <!-- 2. Peta Sebaran Buzzer -->
          <a class="sidebar-nav-item ${this.currentRoute === '/peta-sebaran-buzzer' ? 'active' : ''}" data-route="/peta-sebaran-buzzer" id="nav-item-peta-sebaran" data-tooltip="Peta Sebaran Buzzer" title="Peta Sebaran Buzzer">
            <span class="nav-icon"><i data-lucide="map-pinned"></i></span>
            <span class="nav-text">Peta Sebaran Buzzer</span>
          </a>

          <!-- 3. Pelacak Akun Medsos -->
          <a class="sidebar-nav-item ${this.currentRoute === '/pelacak-akun-medsos' ? 'active' : ''}" data-route="/pelacak-akun-medsos" id="nav-item-pelacak-akun" data-tooltip="Pelacak Akun Medsos" title="Pelacak Akun Medsos">
            <span class="nav-icon"><i data-lucide="scan-search"></i></span>
            <span class="nav-text">Pelacak Akun Medsos</span>
          </a>

          <!-- 4. My Agent -->
          <a class="sidebar-nav-item ${this.currentRoute === '/my-agent' ? 'active' : ''}" data-route="/my-agent" id="nav-item-my-agent" data-tooltip="My Agent" title="My Agent">
            <span class="nav-icon"><i data-lucide="bot"></i></span>
            <span class="nav-text">My Agent</span>
          </a>
        </nav>

        <!-- User Profile Section & Log Out -->
        <div class="sidebar-footer-box">
          <div class="sidebar-user-card" data-tooltip="${user.full_name || 'Operator Komando 1'}" title="${user.full_name || 'Operator Komando 1'}">
            <div class="sidebar-user-avatar">
              <i class="fa-solid fa-user-shield"></i>
              <div class="sidebar-user-online-dot" title="Online Terverifikasi"></div>
            </div>
            <div class="sidebar-user-info" style="flex: 1; overflow: hidden;">
              <div class="sidebar-user-name" id="sidebar-display-name">${user.full_name || 'Operator Komando 1'}</div>
              <div class="sidebar-user-role" id="sidebar-display-role">ROLE: ${(user.role || 'user').toUpperCase()}</div>
            </div>
          </div>

          <button class="sidebar-logout-btn" id="btn-sidebar-logout" data-tooltip="Log Out" title="Keluar dari sesi War Room">
            <span class="nav-icon"><i data-lucide="log-out"></i></span>
            <span class="logout-text">Log Out</span>
          </button>
        </div>
      </aside>
    `;

    this.ensureBackdrop();
    this.bindEvents();
    renderLucideIcons(this.container);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('komando_sidebar_collapsed', this.isCollapsed ? 'true' : 'false');

    const aside = this.container.querySelector('.komando-sidebar');
    const appLayout = document.getElementById('app-layout');

    if (aside) {
      if (this.isCollapsed) {
        aside.classList.add('collapsed');
      } else {
        aside.classList.remove('collapsed');
      }
    }

    if (appLayout) {
      if (this.isCollapsed) {
        appLayout.classList.add('sidebar-collapsed');
      } else {
        appLayout.classList.remove('sidebar-collapsed');
      }
    }



    // Trigger visual resize on charts (ECharts & containers)
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 280);
  }

  ensureBackdrop() {
    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', () => this.close());
    }
    this.backdrop = backdrop;
  }

  open() {
    const aside = this.container.querySelector('.komando-sidebar');
    if (aside) aside.classList.add('open');
    if (this.backdrop) this.backdrop.classList.add('active');
  }

  close() {
    const aside = this.container.querySelector('.komando-sidebar');
    if (aside) aside.classList.remove('open');
    if (this.backdrop) this.backdrop.classList.remove('active');
  }

  toggle() {
    if (window.innerWidth <= 1024) {
      const aside = this.container.querySelector('.komando-sidebar');
      if (aside && aside.classList.contains('open')) {
        this.close();
      } else {
        this.open();
      }
    } else {
      this.toggleCollapse();
    }
  }

  updateUser(user) {
    if (!user) return;
    const nameEl = this.container.querySelector('#sidebar-display-name');
    const roleEl = this.container.querySelector('#sidebar-display-role');
    if (nameEl) nameEl.textContent = user.full_name || 'Operator Komando 1';
    if (roleEl) roleEl.textContent = `ROLE: ${(user.role || 'user').toUpperCase()}`;
  }

  bindEvents() {
    // Listen for toggle event from TopBar
    document.addEventListener('komando:toggle-sidebar', () => {
      this.toggle();
    });

    const items = this.container.querySelectorAll('.sidebar-nav-item');
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = item.getAttribute('data-route');
        if (route && this.onNavigate) {
          this.setActiveRoute(route);
          this.onNavigate(route);
          // Auto-close on mobile/tablet
          if (window.innerWidth <= 1024) {
            this.close();
          }
        }
      });
    });

    const logoutBtn = this.container.querySelector('#btn-sidebar-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (confirm('Konfirmasi Log Out: Apakah Anda yakin ingin keluar dari Sesi Komando?')) {
          await authService.logout();
        }
      });
    }
  }

  setActiveRoute(route) {
    this.currentRoute = route;
    const items = this.container.querySelectorAll('.sidebar-nav-item');
    items.forEach((item) => {
      const itemRoute = item.getAttribute('data-route');
      if (itemRoute === route) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}
