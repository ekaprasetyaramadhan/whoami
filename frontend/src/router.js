/**
 * Client-Side Router for KOMANDO
 * Supports routes:
 * 1. /dashboard
 * 2. /peta-sebaran-buzzer
 * 3. /pelacak-akun-medsos
 * 4. /my-agent
 */

import { renderLucideIcons } from './utils/icons.js';

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
      hash = '/dashboard';
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
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;

    if (updateHash) {
      let newHash = `#${normalizedRoute}`;
      const searchParams = new URLSearchParams(params).toString();
      if (searchParams) newHash += `?${searchParams}`;
      window.location.hash = newHash;
      return;
    }

    this.currentRoute = normalizedRoute;

    // Sembunyikan semua page views
    const allViews = document.querySelectorAll('.komando-page-view');
    allViews.forEach((v) => {
      v.style.display = 'none';
    });

    // Update Sidebar
    if (this.sidebar) {
      this.sidebar.setActiveRoute(normalizedRoute);
    }

    // Tampilkan page view yang dituju
    let activeHandler = this.routes[normalizedRoute];

    // Fallback ke dashboard jika route tidak dikenali
    if (!activeHandler) {
      activeHandler = this.routes['/dashboard'];
      this.currentRoute = '/dashboard';
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

