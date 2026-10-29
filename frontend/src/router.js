/**
 * Client-Side Router for KOMANDO
 * Supports routes:
 * 1. /dashboard
 * 2. /peta-sebaran-buzzer
 * 3. /pelacak-akun-medsos
 * 4. /my-agent
 */

import { renderLucideIcons } from './utils/icons.js';
import { authService } from './services/auth.js';

export class AppRouter {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = null;
    this.sidebar = null;
    this.topbar = null;
  }

  setComponents(sidebar, topbar) {
    this.sidebar = sidebar;
    this.topbar = topbar;
  }

  init() {
    // Tangani perubahan hash pada URL browser
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    // Handle initial route
    this.handleHashChange();
  }

  handleHashChange() {
    let hash = window.location.hash.replace(/^#\/?/, '/');
    if (!hash || hash === '/') {
      hash = authService.isAuthenticated() ? '/dashboard' : '/login';
    }

    // Pisahkan query parameter jika ada
    const [path, queryString] = hash.split('?');
    const params = {};
    if (queryString) {
      new URLSearchParams(queryString).forEach((val, key) => {
        params[key] = val;
      });
    }

    this.navigate(path, params, false);
  }

  navigate(route, params = {}, updateHash = true) {
    let normalizedRoute = route.startsWith('/') ? route : `/${route}`;

    // 1. Route Guard: Proteksi rute berbasis autentikasi
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated && normalizedRoute !== '/login') {
      normalizedRoute = '/login';
      if (updateHash) {
        window.location.hash = '#/login';
        return;
      }
    } else if (isAuthenticated && normalizedRoute === '/login') {
      normalizedRoute = '/dashboard';
      if (updateHash) {
        window.location.hash = '#/dashboard';
        return;
      }
    }

    if (updateHash) {
      let newHash = `#${normalizedRoute}`;
      const searchParams = new URLSearchParams(params).toString();
      if (searchParams) newHash += `?${searchParams}`;
      window.location.hash = newHash;
      return;
    }

    this.currentRoute = normalizedRoute;

    // 2. Toggle Tampilan Layout (App Layout vs Login View)
    const appLayout = document.getElementById('app-layout');
    const viewLogin = document.getElementById('view-login');

    if (normalizedRoute === '/login') {
      if (appLayout) appLayout.style.display = 'none';
      if (viewLogin) viewLogin.style.display = 'block';
    } else {
      if (viewLogin) viewLogin.style.display = 'none';
      if (appLayout) appLayout.style.display = 'flex';
    }

    // Sembunyikan semua sub-page views di dalam main
    const allViews = document.querySelectorAll('.komando-page-view');
    allViews.forEach((v) => {
      v.style.display = 'none';
    });

    // Update Sidebar Navigation state
    if (this.sidebar && normalizedRoute !== '/login') {
      this.sidebar.setActiveRoute(normalizedRoute);
    }

    // Tampilkan page view yang dituju
    let activeHandler = this.routes[normalizedRoute];

    // Fallback ke dashboard jika route tidak dikenali dan sudah login
    if (!activeHandler) {
      if (isAuthenticated) {
        activeHandler = this.routes['/dashboard'];
        this.currentRoute = '/dashboard';
      } else {
        activeHandler = this.routes['/login'];
        this.currentRoute = '/login';
      }
    }

    if (activeHandler) {
      activeHandler(params);
    }

    // Trigger Lucide rendering & resize
    setTimeout(() => {
      renderLucideIcons(document);
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }
}


