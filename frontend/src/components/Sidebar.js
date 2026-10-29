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
    this.init();
  }

  init() {
    if (!this.container) return;

    const user = authService.getUser() || { full_name: 'Operator Komando 1', role: 'user' };

    this.container.innerHTML = `
      <aside class="komando-sidebar">
        <!-- Logo & Branding -->
        <div class="sidebar-brand-box">
          <img src="/Komando.png" alt="Komando Logo" class="sidebar-logo-img" onerror="this.src='./Komando.png'" />
          <div class="sidebar-brand-text">
            <div class="sidebar-brand-eyebrow">KOMANDO PLATFORM</div>
            <div class="sidebar-brand-title">KOMANDO</div>
            <div class="sidebar-brand-sub">
              KOMANDO MONITORING DAN<br>ANALISIS NARASI DIGITAL ONLINE
            </div>
          </div>
        </div>

        <!-- 4 Primary Navigation Items (Exact Required Order) -->
        <nav class="sidebar-nav-list" id="sidebar-nav-list">
          <!-- 1. Dashboard -->
          <a class="sidebar-nav-item active" data-route="/dashboard" id="nav-item-dashboard">
            <span class="nav-icon"><i data-lucide="layout-dashboard"></i></span>
            <span>Dashboard</span>
          </a>

          <!-- 2. Peta Sebaran Buzzer -->
          <a class="sidebar-nav-item" data-route="/peta-sebaran-buzzer" id="nav-item-peta-sebaran">
            <span class="nav-icon"><i data-lucide="map-pinned"></i></span>
            <span>Peta Sebaran Buzzer</span>
          </a>

          <!-- 3. Pelacak Akun Medsos -->
          <a class="sidebar-nav-item" data-route="/pelacak-akun-medsos" id="nav-item-pelacak-akun">
            <span class="nav-icon"><i data-lucide="scan-search"></i></span>
            <span>Pelacak Akun Medsos</span>
          </a>

          <!-- 4. My Agent -->
          <a class="sidebar-nav-item" data-route="/my-agent" id="nav-item-my-agent">
            <span class="nav-icon"><i data-lucide="bot"></i></span>
            <span>My Agent</span>
          </a>
        </nav>

        <!-- User Profile Section & Log Out -->
        <div class="sidebar-footer-box">
          <div class="sidebar-user-card">
            <div class="sidebar-user-avatar">
              <i class="fa-solid fa-user-shield"></i>
              <div class="sidebar-user-online-dot" title="Online Terverifikasi"></div>
            </div>
            <div style="flex: 1; overflow: hidden;">
              <div class="sidebar-user-name" id="sidebar-display-name">${user.full_name || 'Operator Komando 1'}</div>
              <div class="sidebar-user-role" id="sidebar-display-role">ROLE: ${(user.role || 'user').toUpperCase()}</div>
            </div>
          </div>

          <button class="sidebar-logout-btn" id="btn-sidebar-logout" title="Keluar dari sesi War Room">
            <span class="nav-icon"><i data-lucide="log-out"></i></span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    `;

    this.bindEvents();
    renderLucideIcons(this.container);
  }

  updateUser(user) {
    if (!user) return;
    const nameEl = this.container.querySelector('#sidebar-display-name');
    const roleEl = this.container.querySelector('#sidebar-display-role');
    if (nameEl) nameEl.textContent = user.full_name || 'Operator Komando 1';
    if (roleEl) roleEl.textContent = `ROLE: ${(user.role || 'user').toUpperCase()}`;
  }

  bindEvents() {
    const items = this.container.querySelectorAll('.sidebar-nav-item');
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = item.getAttribute('data-route');
        if (route && this.onNavigate) {
          this.setActiveRoute(route);
          this.onNavigate(route);
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
