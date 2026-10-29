/**
 * LoginView Component for KOMANDO Platform
 * Antarmuka autentikasi pengguna bergaya Tactical Cyber Command Center
 */

import { authService } from '../services/auth.js';
import { renderLucideIcons } from '../utils/icons.js';

export class LoginView {
  constructor(containerId, onLoginSuccess) {
    this.container = document.getElementById(containerId);
    this.onLoginSuccess = onLoginSuccess;
    this.isLoading = false;
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="komando-login-wrapper">
        <div class="komando-login-card">
          <!-- Tactical Top Status -->
          <div class="login-tactical-header">
            <span class="login-status-badge">
              <span class="status-indicator-dot"></span>
              KONEKSI SERVER: AKTIF
            </span>
            <span class="login-version-badge">v3.2.0 SECURE</span>
          </div>

          <!-- Brand & Logo -->
          <div class="login-brand-section">
            <div class="login-logo-glow">
              <img src="/Komando.png" alt="Logo Komando" class="login-logo-img" onerror="this.src='./Komando.png'" />
            </div>
            <h1 class="login-title">KOMANDO</h1>
            <p class="login-subtitle">KOMANDO MONITORING DAN ANALISIS NARASI DIGITAL ONLINE</p>
            <div class="login-system-tag">
              <i data-lucide="shield-alert" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
              OTENTIKASI AKSES WAR ROOM
            </div>
          </div>

          <!-- Error Alert Banner -->
          <div id="login-error-alert" class="login-error-alert" style="display: none;">
            <i data-lucide="alert-triangle" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
            <span id="login-error-text">Kredensial tidak valid.</span>
          </div>

          <!-- Login Form -->
          <form id="komando-login-form" class="login-form">
            <div class="login-input-group">
              <label for="login-username" class="login-label">
                <i data-lucide="user" style="width: 14px; height: 14px;"></i> USERNAME
              </label>
              <div class="input-with-icon">
                <input 
                  type="text" 
                  id="login-username" 
                  class="login-input" 
                  placeholder="Masukkan username Anda" 
                  autocomplete="username"
                  required 
                />
              </div>
            </div>

            <div class="login-input-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="login-password" class="login-label">
                  <i data-lucide="key-round" style="width: 14px; height: 14px;"></i> PASSWORD
                </label>
                <button type="button" id="btn-toggle-password" class="login-text-btn" tabindex="-1">
                  <span id="toggle-pw-text">Lihat</span>
                </button>
              </div>
              <div class="input-with-icon">
                <input 
                  type="password" 
                  id="login-password" 
                  class="login-input" 
                  placeholder="Masukkan password Anda" 
                  autocomplete="current-password"
                  required 
                />
              </div>
            </div>

            <!-- Quick Fill Demo Account Button -->
            <div class="login-quick-fill-box">
              <button type="button" id="btn-quick-fill" class="quick-fill-btn">
                <i data-lucide="clipboard-copy" style="width: 13px; height: 13px;"></i>
                Gunakan Akun: <strong>komando1</strong>
              </button>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="btn-login-submit" class="login-submit-btn">
              <span id="login-btn-content" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i data-lucide="log-in" style="width: 16px; height: 16px;"></i>
                <span>MASUK KE SISTEM</span>
              </span>
            </button>
          </form>

          <!-- Security Notice Footer -->
          <div class="login-footer-notice">
            <i data-lucide="lock" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; color: #64748b;"></i>
            <span>Sesi terenkripsi &bull; Seluruh aktivitas dicatat ke dalam log audit forensik.</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    renderLucideIcons(this.container);
  }

  bindEvents() {
    const form = this.container.querySelector('#komando-login-form');
    const usernameInput = this.container.querySelector('#login-username');
    const passwordInput = this.container.querySelector('#login-password');
    const togglePwBtn = this.container.querySelector('#btn-toggle-password');
    const togglePwText = this.container.querySelector('#toggle-pw-text');
    const quickFillBtn = this.container.querySelector('#btn-quick-fill');

    // Toggle Password Visibility
    if (togglePwBtn && passwordInput) {
      togglePwBtn.onclick = () => {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          togglePwText.textContent = 'Sembunyikan';
        } else {
          passwordInput.type = 'password';
          togglePwText.textContent = 'Lihat';
        }
      };
    }

    // Quick Fill Akun: komando1 / Komando2026!
    if (quickFillBtn) {
      quickFillBtn.onclick = () => {
        if (usernameInput) usernameInput.value = 'komando1';
        if (passwordInput) passwordInput.value = 'Komando2026!';
        this.hideError();
      };
    }

    // Form Submit
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
          this.showError('Harap isi username dan password.');
          return;
        }

        this.setLoading(true);
        this.hideError();

        try {
          const res = await authService.login(username, password);
          if (this.onLoginSuccess) {
            this.onLoginSuccess(res.user);
          }
        } catch (err) {
          this.showError(err.message || 'Kredensial tidak valid.');
        } finally {
          this.setLoading(false);
        }
      };
    }
  }

  showError(msg) {
    const alertEl = this.container.querySelector('#login-error-alert');
    const textEl = this.container.querySelector('#login-error-text');
    if (alertEl && textEl) {
      textEl.textContent = msg;
      alertEl.style.display = 'flex';
      renderLucideIcons(alertEl);
    }
  }

  hideError() {
    const alertEl = this.container.querySelector('#login-error-alert');
    if (alertEl) {
      alertEl.style.display = 'none';
    }
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    const btn = this.container.querySelector('#btn-login-submit');
    const btnContent = this.container.querySelector('#login-btn-content');
    if (!btn || !btnContent) return;

    if (isLoading) {
      btn.disabled = true;
      btn.style.opacity = '0.75';
      btnContent.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>MEMVERIFIKASI KREDENSIAL...</span>
      `;
    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
      btnContent.innerHTML = `
        <i data-lucide="log-in" style="width: 16px; height: 16px;"></i>
        <span>MASUK KE SISTEM</span>
      `;
      renderLucideIcons(btnContent);
    }
  }
}
