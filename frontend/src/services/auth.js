/**
 * AuthService for KOMANDO Platform
 * Mengelola sesi autentikasi pengguna, penyimpanan token di localStorage,
 * dan komunikasi dengan backend /api/v1/auth.
 */

const TOKEN_KEY = 'komando_access_token';
const USER_KEY = 'komando_user_profile';

class AuthService {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
  }

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  setSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async login(username, password) {
    const resp = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.detail || 'Gagal login. Kredensial tidak valid.');
    }

    if (data.access_token && data.user) {
      this.setSession(data.access_token, data.user);
    }

    return data;
  }

  async checkCurrentSession() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const resp = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) {
        this.clearSession();
        return null;
      }
      const data = await resp.json();
      if (data && data.user) {
        this.setSession(token, data.user);
        return data.user;
      }
    } catch (_) {
      // Jika jaringan offline, gunakan profil lokal yang tersimpan
      return this.getUser();
    }
    return null;
  }

  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (_) {}
    }
    this.clearSession();
    window.location.hash = '#/login';
  }
}

export const authService = new AuthService();
