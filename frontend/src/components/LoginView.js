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
        <!-- Falling Binary 1010 Matrix Rain Canvas -->
        <canvas id="login-binary-canvas" class="login-binary-canvas"></canvas>

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

            <!-- Kredensial Default Helper Card -->
            <div style="margin-top: 18px; padding: 12px 14px; background: rgba(37, 99, 235, 0.06); border: 1px dashed rgba(59, 130, 246, 0.4); border-radius: 8px; font-size: 0.72rem; color: #94a3b8; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #38bdf8; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-shield-halved"></i> KREDENSIAL BAWAAN:
                </span>
                <button type="button" id="btn-quick-fill" style="background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(59, 130, 246, 0.5); color: #60a5fa; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                  Isi Otomatis
                </button>
              </div>
              <div style="font-family: var(--font-mono, monospace); color: #e2e8f0; font-size: 0.7rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
                <span>Username: <strong style="color: #60a5fa;">komando1</strong></span>
                <span>Password: <strong style="color: #60a5fa;">Komando2026!</strong></span>
              </div>
            </div>
          </form>

        </div>
      </div>
    `;

    this.bindEvents();
    this.startBinaryRain();
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

    // Quick Fill Kredensial Default
    if (quickFillBtn && usernameInput && passwordInput) {
      quickFillBtn.onclick = () => {
        usernameInput.value = 'komando1';
        passwordInput.value = 'Komando2026!';
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

  startBinaryRain() {
    this.stopBinaryRain();
    const canvas = this.container.querySelector('#login-binary-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 15;
    const columns = Math.floor(width / fontSize);
    const drops = [];

    // Inisialisasi posisi jatuh awal acak untuk setiap kolom
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -60);
    }

    const chars = ['0', '1'];
    let lastTime = 0;
    const fps = 32; // 32 FPS untuk pergerakan mulus dan hemat CPU
    const interval = 1000 / fps;

    const render = (time) => {
      this.animationFrameId = requestAnimationFrame(render);

      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      // Fade trail hitam-navy transparan untuk efek ekor bayangan
      ctx.fillStyle = 'rgba(8, 13, 26, 0.085)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `600 ${fontSize}px "IBM Plex Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Warna stabil cyan neon yang tenang dan elegan tanpa efek kedip-kedip
        ctx.fillStyle = 'rgba(0, 229, 255, 0.55)';
        ctx.shadowBlur = 0;
        ctx.fillText(char, x, y);

        // Jika tetesan melewati bawah layar, reset ke atas dengan jeda acak
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    this.animationFrameId = requestAnimationFrame(render);

    this.onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newCols = Math.floor(width / fontSize);
      drops.length = 0;
      for (let i = 0; i < newCols; i++) {
        drops[i] = Math.floor(Math.random() * -60);
      }
    };

    window.addEventListener('resize', this.onResize);
  }

  stopBinaryRain() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);
      this.onResize = null;
    }
  }
}
