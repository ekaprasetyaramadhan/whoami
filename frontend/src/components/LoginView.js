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

          <!-- Brand & Logo -->
          <div class="login-brand-section">
            <div class="login-logo-glow">
              <img src="/Komando.png" alt="Logo Komando" class="login-logo-img" onerror="this.src='./Komando.png'" />
            </div>
            <h1 class="login-title">KOMANDO</h1>
            <p class="login-subtitle">KOMANDO MONITORING DAN ANALISIS NARASI DIGITAL ONLINE</p>
          </div>

          <!-- Error Alert Banner -->
          <div id="login-error-alert" class="login-error-alert" style="display: none;">
            <i data-lucide="alert-triangle" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
            <span id="login-error-text">Kredensial tidak valid.</span>
          </div>

          <!-- Login Form -->
          <form id="komando-login-form" class="login-form">
            <div class="login-input-group">
              <label for="login-username" class="login-label">USERNAME</label>
              <input 
                type="text" 
                id="login-username" 
                class="login-input" 
                placeholder="Masukkan username" 
                autocomplete="username"
                required 
              />
            </div>

            <div class="login-input-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="login-password" class="login-label">PASSWORD</label>
                <button type="button" id="btn-toggle-password" class="login-text-btn" tabindex="-1">
                  <span id="toggle-pw-text">Lihat</span>
                </button>
              </div>
              <input 
                type="password" 
                id="login-password" 
                class="login-input" 
                placeholder="Masukkan password" 
                autocomplete="current-password"
                required 
              />
            </div>


            <!-- Submit Button -->
            <button type="submit" id="btn-login-submit" class="login-submit-btn">
              <span id="login-btn-content" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i data-lucide="log-in" style="width: 16px; height: 16px;"></i>
                <span>MASUK KE SISTEM</span>
              </span>
            </button>
          </form>

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
