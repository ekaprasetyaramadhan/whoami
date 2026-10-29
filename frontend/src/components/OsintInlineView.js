/**
 * OsintInlineView Component
 * whoiam - Pelacak Akun & Konten Medsos (OSINT Live Engine & Forensik Akun)
 */

import { ApiService } from '../services/api.js';
import { CognitiveStore } from '../state/store.js';

export class OsintInlineView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTab = 'url';
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; gap: 14px; background: #080d14; border: 1px solid var(--color-border); border-radius: 8px; padding: 18px; overflow: hidden;">
        
        <!-- Header Penjelasan -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; flex-shrink: 0; flex-wrap: wrap; gap: 8px;">
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-globe text-cyan"></i> PELACAK AKUN &amp; KONTEN MEDSOS (OSINT FORENSIK)
            </h2>
            <p style="font-size: 0.78rem; color: var(--color-text-muted); margin-top: 4px;">
              Bedah profil medsos, analisis avatar AI GAN, temukan sumber awal rilis (Ground Zero), lacak BTS/GPS, pantau tagar, serta komparasikan 2 akun untuk membuktikan satu operator.
            </p>
          </div>

          <!-- Tab Nav Mini -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button id="inline-osint-tab-url" class="btn-tactical cyan">
              <i class="fa-solid fa-link"></i> 1. BEDAH URL POSTINGAN
            </button>
            <button id="inline-osint-tab-search" class="btn-tactical">
              <i class="fa-solid fa-hashtag"></i> 2. LACAK TAGAR / TREN
            </button>
            <button id="inline-osint-tab-compare" class="btn-tactical">
              <i class="fa-solid fa-code-compare"></i> 3. KOMPARASI 2 AKUN (SYNC)
            </button>
          </div>
        </div>

        <!-- Body Area -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
          
          <!-- TAB 1: BEDAH URL -->
          <div id="inline-osint-view-url" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: rgba(16, 24, 34, 0.9); padding: 14px; border-radius: 6px; border: 1px solid var(--color-border);">
              <label style="font-size: 0.75rem; color: #cbd5e1; font-weight: 600; margin-bottom: 8px; display: block;">
                TEMPELKAN LINK POSTINGAN / PROFIL MEDIA SOSIAL:
              </label>

              <div style="display: flex; gap: 10px;">
                <input type="text" id="inline-osint-input-url" class="tactical-input" style="flex: 1; padding: 8px 12px; background: #0c1219; border: 1px solid var(--color-border); color: #fff; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem;" placeholder="https://x.com/username/status/... atau https://instagram.com/..." />
                <button id="inline-btn-run-inspect-url" class="btn-tactical cyan" style="padding: 8px 20px;">
                  <i class="fa-solid fa-magnifying-glass"></i> BEDAH SEKARANG
                </button>
              </div>
            </div>

            <!-- Hasil Bedah URL -->
            <div id="inline-osint-result-url" style="display: none; background: rgba(13, 20, 30, 0.95); border: 1px solid var(--color-border); border-radius: 6px; padding: 16px;"></div>
          </div>

          <!-- TAB 2: LACAK TAGAR -->
          <div id="inline-osint-view-search" style="display: none; flex-direction: column; gap: 12px;">
            <div style="background: rgba(16, 24, 34, 0.9); padding: 14px; border-radius: 6px; border: 1px solid var(--color-border);">
              <label style="font-size: 0.75rem; color: #cbd5e1; font-weight: 600; margin-bottom: 8px; display: block;">
                CARI BERDASARKAN KATA KUNCI ATAU TAGAR POPULER:
              </label>

              <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 10px; align-items: center;">
                <input type="text" id="inline-osint-input-query" class="tactical-input" style="padding: 8px 12px; background: #0c1219; border: 1px solid var(--color-border); color: #fff; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem;" placeholder="Contoh: #pilkada2024, gempa, boikot, bantuan modal..." />
                <select id="inline-osint-select-platform" style="padding: 8px 12px; background: #0c1219; border: 1px solid var(--color-border); color: #fff; border-radius: 4px; font-size: 0.8rem;">
                  <option value="all">Semua Medsos (X, IG, FB)</option>
                  <option value="x">X / Twitter</option>
                  <option value="threads">Threads (Meta)</option>
                  <option value="instagram">Instagram</option>
                </select>
                <button id="inline-btn-run-search" class="btn-tactical cyan" style="padding: 8px 20px;">
                  <i class="fa-solid fa-satellite-dish"></i> TARIK DATA LIVE
                </button>
              </div>
            </div>

            <!-- Hasil Pencarian Tagar -->
            <div id="inline-osint-result-search" style="display: none; display: flex; flex-direction: column; gap: 10px;"></div>
          </div>

          <!-- TAB 3: KOMPARASI 2 AKUN (SYNC COMPARATOR) -->
          <div id="inline-osint-view-compare" style="display: none; flex-direction: column; gap: 12px;">
            <div style="background: rgba(16, 24, 34, 0.9); padding: 14px; border-radius: 6px; border: 1px solid var(--color-border);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                <label style="font-size: 0.75rem; color: #cbd5e1; font-weight: 600;">
                  KOMPARASI KORELASI 2 AKUN / URL POSTINGAN (SIDE-BY-SIDE SYNCHRONICITY):
                </label>
                <button id="inline-btn-preset-pair" class="btn-tactical" style="padding: 2px 10px; font-size: 0.68rem; border-color: var(--color-cyan); color: var(--color-cyan);">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> Isi Contoh: Koordinator vs Bot
                </button>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                <div>
                  <label style="font-size: 0.68rem; color: #38bdf8; font-weight: 700; margin-bottom: 4px; display: block;">
                    URL TARGET 1 (AKUN A / KOORDINATOR):
                  </label>
                  <input type="text" id="inline-osint-compare-url-a" class="tactical-input" style="width: 100%; padding: 8px 12px; background: #0c1219; border: 1px solid var(--color-border); color: #fff; border-radius: 4px; font-family: var(--font-mono); font-size: 0.78rem;" placeholder="https://x.com/opini_rakyat_id/status/17892301923" />
                </div>
                <div>
                  <label style="font-size: 0.68rem; color: #a855f7; font-weight: 700; margin-bottom: 4px; display: block;">
                    URL TARGET 2 (AKUN B / AMPLIFIER BOT):
                  </label>
                  <input type="text" id="inline-osint-compare-url-b" class="tactical-input" style="width: 100%; padding: 8px 12px; background: #0c1219; border: 1px solid var(--color-border); color: #fff; border-radius: 4px; font-family: var(--font-mono); font-size: 0.78rem;" placeholder="https://x.com/suara_indonesia_net/status/17892302144" />
                </div>
              </div>

              <button id="inline-btn-run-compare" class="btn-tactical cyan" style="width: 100%; padding: 10px; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                <i class="fa-solid fa-code-compare"></i> UJI SINKRONISASI &amp; FORENSIK OPERATOR SEKARANG
              </button>
            </div>

            <!-- Hasil Komparasi 2 Akun -->
            <div id="inline-osint-result-compare" style="display: none; background: rgba(13, 20, 30, 0.95); border: 1px solid var(--color-border); border-radius: 6px; padding: 16px;"></div>
          </div>

        </div>
      </div>
    `;

    this.setupListeners();
  }

  setupListeners() {
    const tabUrl = document.getElementById('inline-osint-tab-url');
    const tabSearch = document.getElementById('inline-osint-tab-search');
    const tabCompare = document.getElementById('inline-osint-tab-compare');

    const viewUrl = document.getElementById('inline-osint-view-url');
    const viewSearch = document.getElementById('inline-osint-view-search');
    const viewCompare = document.getElementById('inline-osint-view-compare');

    const switchMainTab = (tab) => {
      this.activeTab = tab;
      [tabUrl, tabSearch, tabCompare].forEach((t) => t && (t.className = 'btn-tactical'));
      [viewUrl, viewSearch, viewCompare].forEach((v) => v && (v.style.display = 'none'));

      if (tab === 'url') {
        if (tabUrl) tabUrl.className = 'btn-tactical cyan';
        if (viewUrl) viewUrl.style.display = 'flex';
      } else if (tab === 'search') {
        if (tabSearch) tabSearch.className = 'btn-tactical cyan';
        if (viewSearch) viewSearch.style.display = 'flex';
      } else if (tab === 'compare') {
        if (tabCompare) tabCompare.className = 'btn-tactical cyan';
        if (viewCompare) viewCompare.style.display = 'flex';
      }
    };

    if (tabUrl) tabUrl.onclick = () => switchMainTab('url');
    if (tabSearch) tabSearch.onclick = () => switchMainTab('search');
    if (tabCompare) tabCompare.onclick = () => switchMainTab('compare');

    // Preset button for Account Comparator
    const btnPreset = document.getElementById('inline-btn-preset-pair');
    const inputCompA = document.getElementById('inline-osint-compare-url-a');
    const inputCompB = document.getElementById('inline-osint-compare-url-b');
    if (btnPreset && inputCompA && inputCompB) {
      btnPreset.onclick = () => {
        inputCompA.value = 'https://x.com/warta_rakyat_id/status/18492019482910';
        inputCompB.value = 'https://x.com/suara_indonesia_net/status/18492019482928';
      };
    }

    // Run URL Inspect
    const inputUrl = document.getElementById('inline-osint-input-url');
    const btnInspect = document.getElementById('inline-btn-run-inspect-url');
    if (btnInspect) {
      btnInspect.onclick = async () => {
        const url = inputUrl ? inputUrl.value.trim() : '';
        if (!url) {
          alert('Mohon masukkan URL postingan atau profil terlebih dahulu.');
          return;
        }
        await this.handleInspectUrl(url, btnInspect);
      };
    }

    // Run Tagar Search
    const btnSearch = document.getElementById('inline-btn-run-search');
    const inputQuery = document.getElementById('inline-osint-input-query');
    const selectPlatform = document.getElementById('inline-osint-select-platform');
    if (btnSearch) {
      btnSearch.onclick = async () => {
        const query = inputQuery ? inputQuery.value.trim() : '';
        if (!query) {
          alert('Mohon masukkan tagar atau kata kunci pencarian.');
          return;
        }
        const platform = selectPlatform ? selectPlatform.value : 'all';
        await this.handleSearchQuery(query, platform, btnSearch);
      };
    }

    // Run Account Compare
    const btnCompare = document.getElementById('inline-btn-run-compare');
    if (btnCompare) {
      btnCompare.onclick = async () => {
        const urlA = inputCompA ? inputCompA.value.trim() : '';
        const urlB = inputCompB ? inputCompB.value.trim() : '';
        if (!urlA || !urlB) {
          alert('Mohon masukkan kedua URL akun (Akun A dan Akun B).');
          return;
        }
        await this.handleCompareAccounts(urlA, urlB, btnCompare);
      };
    }
  }

  async handleInspectUrl(url, btn) {
    const resBox = document.getElementById('inline-osint-result-url');
    if (!resBox) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MEMINDAI...';
    resBox.style.display = 'block';
    resBox.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--color-cyan);">
        <i class="fa-solid fa-satellite fa-spin fa-2x"></i>
        <div style="margin-top: 10px; font-size: 0.85rem;">Menghubungi endpoint scraper untuk membedah metadata akun &amp; postingan...</div>
      </div>
    `;

    try {
      const resp = await ApiService.inspectOsintUrl(url);
      const data = resp.data || resp;
      this.renderUrlResult(resBox, data);
    } catch (err) {
      resBox.innerHTML = `
        <div style="padding: 16px; border: 1px solid #ef4444; border-radius: 4px; background: rgba(239, 68, 68, 0.1); color: #fca5a5; font-size: 0.85rem;">
          <i class="fa-solid fa-triangle-exclamation"></i> Gagal membedah URL: ${err.message}
        </div>
      `;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> BEDAH SEKARANG';
    }
  }

  renderUrlResult(container, data) {
    const account = data.account || {};
    const post = data.post || {};
    const origin = data.origin_forensics || {};
    const geo = data.geolocation || {};
    const sna = data.cross_platform_sna || { nodes: [], links: [] };
    const avatar = data.avatar_forensics || {};
    const topicCloud = data.topic_cloud || [];

    const botScore = account.bot_score || data.bot_score || 35;
    const isBot = botScore > 60;
    const badgeColor = isBot ? '#ef4444' : '#10b981';
    const isGroundZero = origin.is_ground_zero || false;

    // Timeline HTML
    const timelineHtml = (origin.propagation_timeline || [])
      .map(
        (t) => `
        <div style="display: flex; gap: 10px; align-items: flex-start; position: relative; padding-bottom: 8px;">
          <div style="width: 22px; height: 22px; border-radius: 50%; background: ${t.step === 1 ? '#f59e0b' : '#1e293b'}; border: 1.5px solid ${t.step === 1 ? '#fbbf24' : '#64748b'}; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #fff; font-weight: 700; flex-shrink: 0; margin-top: 2px;">
            ${t.step}
          </div>
          <div style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 6px 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; color: ${t.step === 1 ? '#f59e0b' : '#fff'}; font-size: 0.72rem;">
                ${t.role}
              </span>
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--color-cyan);">
                ${t.delta}
              </span>
            </div>
            <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 2px;">
              Akun: <strong style="color: #cbd5e1;">${t.account}</strong> (${t.platform}) &bull; Waktu: ${t.time}
            </div>
          </div>
        </div>
      `
      )
      .join('');

    // Cross-Platform SNA Badges
    const snaNodesHtml = (sna.nodes || [])
      .map(
        (n) => `
        <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid ${n.color || '#38bdf8'}; border-radius: 4px; padding: 6px 10px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${n.color || '#38bdf8'};"></span>
            <span style="font-size: 0.72rem; color: #fff; font-weight: 600;">${n.label}</span>
          </div>
          <span style="font-size: 0.6rem; color: #94a3b8; font-family: var(--font-mono);">${n.platform}</span>
        </div>
      `
      )
      .join('');

    // Topic Badges HTML
    const topicBadgesHtml = (topicCloud || []).map((t) => {
      const isHigh = t.threat_level === 'HIGH';
      const col = isHigh ? '#ef4444' : '#00e5ff';
      return `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: rgba(15,23,42,0.8); border: 1px solid ${col}; padding: 3px 8px; border-radius: 4px; font-size: 0.68rem; color: #f8fafc;">
          <strong>#${t.keyword}</strong>
          <span style="background: ${col}; color: #000; border-radius: 10px; padding: 0 5px; font-size: 0.6rem; font-weight: 800;">${t.count}x</span>
          <span style="font-size: 0.6rem; color: ${isHigh ? '#fca5a5' : '#7dd3fc'};">${t.sentiment}</span>
        </span>
      `;
    }).join(' ');

    container.innerHTML = `
      <!-- 1. Header Profil & Bot Risk -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px solid var(--color-border); padding-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: #1e293b; border: 2px solid ${badgeColor}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
            👤
          </div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 1.05rem;">
              ${account.author_name || data.author || 'Akun Medsos'}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-cyan);">
              ${account.author_handle || data.handle || '@unknown'} &bull; Platform: ${(data.platform || 'WEB').toUpperCase()}
            </div>
          </div>
        </div>

        <div style="text-align: right;">
          <span style="background: ${isBot ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${badgeColor}; border: 1px solid ${badgeColor}; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
            ${isBot ? '⚠️ TERINDIKASI BOT KOORDINATOR' : '✓ AKUN ORGANIK'}
          </span>
          <div style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 4px;">Indeks Bot: ${botScore}%</div>
        </div>
      </div>

      <!-- Teks Postingan -->
      <div style="background: #060a0f; border: 1px solid var(--color-border); border-radius: 6px; padding: 12px; margin-bottom: 14px; font-size: 0.82rem; line-height: 1.5; color: #e2e8f0;">
        "${post.content || data.content || data.snippet || 'Tidak ada teks yang dapat diekstrak.'}"
      </div>

      <!-- GRID FORENSIK 5 PILAR UTAMA -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- PILAR 1: DETEKSI SUMBER UTAMA (PATIENT ZERO / GROUND ZERO) -->
        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(15, 23, 42, 0.6)); border: 1.5px solid #f59e0b; border-radius: 6px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #f59e0b; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-bullseye fa-fade"></i> 1. DETEKSI SUMBER POSTINGAN UTAMA (GROUND ZERO)
            </div>
            <span class="tag-badge" style="border-color: #f59e0b; color: #f59e0b; font-size: 0.65rem;">
              ${origin.status_label || (isGroundZero ? '🎯 GROUND ZERO' : '⚡ AMPLIFIER')}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.72rem; margin-bottom: 10px; background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono);">
            <div><span style="color: #94a3b8;">Waktu Rilis Asli:</span> <strong style="color: #fff;">${origin.date_time_release || post.date_time_release || '-'}</strong></div>
            <div><span style="color: #94a3b8;">Delta Waktu Sebar:</span> <strong style="color: #38bdf8;">${origin.time_delta_from_origin || '0 detik'}</strong></div>
          </div>

          <div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 6px; font-weight: 700;">
            <i class="fa-solid fa-diagram-project"></i> KRONOLOGI PENYEBARAN DARI SUMBER PERTAMA HINGGA VIRAL:
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${timelineHtml}
          </div>
        </div>

        <!-- PILAR 2: GEOLOKASI PRESISI (GPS & BTS TOWER INTEL) -->
        <div style="background: linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(15, 23, 42, 0.6)); border: 1.5px solid var(--color-cyan); border-radius: 6px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: var(--color-cyan); display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-location-crosshairs fa-spin-pulse"></i> 2. FORENSIK GEOLOKASI (GEO-TAG &amp; BTS TOWER IP INTEL)
            </div>
            <span class="tag-badge valid" style="font-size: 0.65rem;">
              ${geo.network_type || 'GPS NATIVE FIX'}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 10px; font-size: 0.72rem;">
            <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,229,255,0.2); border-radius: 4px; padding: 10px; display: flex; flex-direction: column; gap: 4px;">
              <div><span style="color: #94a3b8;">Titik Koordinat:</span> <strong style="color: #fff; font-family: var(--font-mono);">${geo.latitude}, ${geo.longitude}</strong> (Radius: <span style="color: var(--color-cyan);">${geo.accuracy_radius || '±25m'}</span>)</div>
              <div><span style="color: #94a3b8;">Wilayah Administratif:</span> <strong style="color: #fff;">${geo.district}, ${geo.city}, ${geo.province}</strong></div>
              <div><span style="color: #94a3b8;">Sektor Tower BTS:</span> <strong style="color: #e2e8f0; font-family: var(--font-mono);">${geo.cell_tower || '-'}</strong></div>
              <div><span style="color: #94a3b8;">ISP Backbone:</span> <strong style="color: #e2e8f0;">${geo.isp || '-'}</strong> &bull; IP: <span style="color: var(--color-cyan); font-family: var(--font-mono);">${geo.ip_address || '-'}</span></div>
            </div>

            <!-- Mini Radar Display -->
            <div style="background: #09101a; border: 1px solid var(--color-cyan); border-radius: 4px; padding: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
              <div style="width: 50px; height: 50px; border-radius: 50%; border: 1.5px dashed var(--color-cyan); display: flex; align-items: center; justify-content: center; position: relative;">
                <i class="fa-solid fa-crosshairs text-cyan" style="font-size: 1.2rem;"></i>
                <div style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444;"></div>
              </div>
              <div style="font-size: 0.65rem; color: #fff; font-weight: 700; margin-top: 6px;">GEO-FIX TERKUNCI</div>
              <div style="font-size: 0.58rem; color: #94a3b8;">${geo.city || 'Indonesia'}</div>
            </div>
          </div>
        </div>

        <!-- PILAR 3: INTERKONEKSI LINTAS MEDSOS (CROSS-PLATFORM SNA) -->
        <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(15, 23, 42, 0.6)); border: 1.5px solid #a855f7; border-radius: 6px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #c084fc; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-nodes"></i> 3. GRAF INTERKONEKSI LINTAS MEDSOS (CROSS-PLATFORM SNA)
            </div>
            <span class="tag-badge" style="border-color: #c084fc; color: #c084fc; font-size: 0.65rem;">
              ${sna.total_connected_accounts || 6} AKUN TERKONEKSI
            </span>
          </div>

          <div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 8px;">
            Akun ini terdeteksi memiliki jaringan sinkronisasi postingan dengan simpul-simpul berikut:
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
            ${snaNodesHtml}
          </div>
        </div>

        <!-- PILAR 4: DETEKSI AVATAR AI / WAJAH SINTETIS (SYNTHETIC GAN DETECTOR) -->
        <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(15, 23, 42, 0.6)); border: 1.5px solid #ec4899; border-radius: 6px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #f472b6; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-robot"></i> 4. DETEKSI AVATAR AI / WAJAH SINTETIS (STYLEGAN / DIFFUSION DETECTOR)
            </div>
            <span class="tag-badge" style="border-color: #ec4899; color: ${avatar.is_synthetic_ai ? '#f472b6' : '#10b981'}; font-size: 0.65rem;">
              ${avatar.verdict_badge || (avatar.is_synthetic_ai ? '⚠️ AVATAR AI GENERATED' : '✓ FOTO MANUSIA ASLI')}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.72rem; background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 4px; margin-bottom: 8px;">
            <div>
              <span style="color: #94a3b8;">Probabilitas AI GAN:</span>
              <strong style="color: ${avatar.ai_probability > 60 ? '#f472b6' : '#10b981'}; font-size: 0.85rem; margin-left: 4px;">
                ${avatar.ai_probability || 0}%
              </strong>
            </div>
            <div>
              <span style="color: #94a3b8;">Arsitektur AI Terdeteksi:</span>
              <strong style="color: #fff; font-family: var(--font-mono);">${avatar.architecture || 'Tidak Terdeteksi'}</strong>
            </div>
          </div>

          <!-- Forensik Marker Wajah -->
          <div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 4px; font-weight: 700;">
            <i class="fa-solid fa-microscope text-pink"></i> ARTEFAK SINTESIS PADA WAJAH:
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 0.68rem;">
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(236,72,153,0.2); border-radius: 4px; padding: 6px 8px;">
              <span style="color: #cbd5e1; font-weight: 600;">Simetri Pupil:</span>
              <div style="color: #f472b6; margin-top: 2px;">${(avatar.facial_markers && avatar.facial_markers.pupil_symmetry) || 'Simetris wajar'}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(236,72,153,0.2); border-radius: 4px; padding: 6px 8px;">
              <span style="color: #cbd5e1; font-weight: 600;">Artefak Aksesoris:</span>
              <div style="color: #f472b6; margin-top: 2px;">${(avatar.facial_markers && avatar.facial_markers.earring_artifact) || 'Tidak ada anomali'}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(236,72,153,0.2); border-radius: 4px; padding: 6px 8px;">
              <span style="color: #cbd5e1; font-weight: 600;">Kedalaman Latar:</span>
              <div style="color: #f472b6; margin-top: 2px;">${(avatar.facial_markers && avatar.facial_markers.background_depth) || 'Kedalaman optik nyata'}</div>
            </div>
          </div>
        </div>

        <!-- PILAR 5: EKSTRAKSI TOPIK & AWAN KATA KUNCI (TOPIC & KEYWORD CLOUD) -->
        <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(15, 23, 42, 0.6)); border: 1.5px solid #38bdf8; border-radius: 6px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-cloud-bolt"></i> 5. EKSTRAKSI TOPIK &amp; AWAN KATA KUNCI (AMPLIFIED KEYWORDS)
            </div>
            <span class="tag-badge valid" style="font-size: 0.65rem;">
              ${topicCloud.length} TOPIK DIKUATKAN
            </span>
          </div>

          <div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 8px;">
            Daftar entitas kata kunci dan tagar berulang yang dipropagandakan oleh akun ini:
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${topicBadgesHtml || '<span style="color: #64748b; font-size: 0.7rem;">Tidak ada kata kunci dominan.</span>'}
          </div>
        </div>

      </div>
    `;
  }

  async handleCompareAccounts(urlA, urlB, btn) {
    const resBox = document.getElementById('inline-osint-result-compare');
    if (!resBox) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MEMBANDINGKAN SINKRONISASI 2 AKUN...';
    resBox.style.display = 'block';
    resBox.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--color-cyan);">
        <i class="fa-solid fa-code-compare fa-spin fa-2x"></i>
        <div style="margin-top: 10px; font-size: 0.85rem;">Menganalisis selisih waktu rilis, kesamaan teks leksikal, proximity BTS, dan user-agent...</div>
      </div>
    `;

    try {
      const resp = await ApiService.compareAccounts(urlA, urlB);
      const data = resp.data || resp;
      this.renderCompareResult(resBox, data);
    } catch (err) {
      resBox.innerHTML = `
        <div style="padding: 16px; border: 1px solid #ef4444; border-radius: 4px; background: rgba(239, 68, 68, 0.1); color: #fca5a5; font-size: 0.85rem;">
          <i class="fa-solid fa-triangle-exclamation"></i> Gagal mengomparasikan kedua akun: ${err.message}
        </div>
      `;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-code-compare"></i> UJI SINKRONISASI &amp; FORENSIK OPERATOR SEKARANG';
    }
  }

  renderCompareResult(container, data) {
    const score = data.synchronicity_score || 0;
    const isSingleOperator = data.single_operator_detected;
    const badgeColor = isSingleOperator ? '#ef4444' : '#10b981';

    const accountA = data.account_a || {};
    const accountB = data.account_b || {};
    const sharedKw = data.shared_keywords || [];

    const kwBadges = sharedKw.map(k => `
      <span class="tag-badge" style="border-color: #38bdf8; color: #38bdf8; font-size: 0.65rem;">
        #${k}
      </span>
    `).join(' ');

    container.innerHTML = `
      <!-- Verdict Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase;">HASIL INVESTIGASI KORELASI AKUN:</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: ${badgeColor}; display: flex; align-items: center; gap: 8px; margin-top: 2px;">
            <i class="fa-solid ${isSingleOperator ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
            ${data.operator_match_verdict || (isSingleOperator ? 'TERBUKTI DIKENDALIKAN OPERATOR TUNGGAL' : 'AKUN INDEPENDEN')}
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 0.7rem; color: var(--color-text-muted);">SKOR SINKRONISASI:</div>
          <div style="font-size: 1.4rem; font-weight: 900; color: ${score > 70 ? '#ef4444' : '#38bdf8'}; font-family: var(--font-heading);">
            ${score}%
          </div>
        </div>
      </div>

      <!-- Side-by-Side Account Profiles -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
        <!-- Akun A -->
        <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #38bdf8; font-size: 0.85rem;"><i class="fa-solid fa-user-secret"></i> AKUN TARGET A</strong>
            <span class="tag-badge" style="font-size: 0.6rem; border-color: #38bdf8; color: #38bdf8;">${accountA.role || 'KOORDINATOR'}</span>
          </div>
          <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${accountA.handle || '@target_a'}</div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">Platform: <strong>${accountA.platform || 'X'}</strong> &bull; Waktu Rilis: <strong style="color: #fff;">${accountA.timestamp || '-'}</strong></div>
          <div style="margin-top: 6px; font-size: 0.7rem; color: #cbd5e1; background: rgba(0,0,0,0.3); padding: 6px 8px; border-radius: 4px; font-style: italic;">
            "${accountA.snippet || '-'}"
          </div>
        </div>

        <!-- Akun B -->
        <div style="background: rgba(168, 85, 247, 0.06); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 6px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #c084fc; font-size: 0.85rem;"><i class="fa-solid fa-robot"></i> AKUN TARGET B</strong>
            <span class="tag-badge" style="font-size: 0.6rem; border-color: #c084fc; color: #c084fc;">${accountB.role || 'AMPLIFIER'}</span>
          </div>
          <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${accountB.handle || '@target_b'}</div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">Platform: <strong>${accountB.platform || 'X'}</strong> &bull; Waktu Rilis: <strong style="color: #fff;">${accountB.timestamp || '-'}</strong></div>
          <div style="margin-top: 6px; font-size: 0.7rem; color: #cbd5e1; background: rgba(0,0,0,0.3); padding: 6px 8px; border-radius: 4px; font-style: italic;">
            "${accountB.snippet || '-'}"
          </div>
        </div>
      </div>

      <!-- Forensik Korelasi 4 Parameter Utama -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; font-size: 0.72rem;">
        <!-- 1. Kesamaan Leksikal -->
        <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--color-border); border-radius: 4px; padding: 8px 10px;">
          <div style="color: #94a3b8; font-size: 0.65rem;">KESAMAAN TEKS (JACCARD):</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #38bdf8; margin: 2px 0;">${data.lexical_similarity || 0}%</div>
          <div style="font-size: 0.62rem; color: #cbd5e1;">N-Gram &amp; frasa identik</div>
        </div>

        <!-- 2. Temporal Gap -->
        <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--color-border); border-radius: 4px; padding: 8px 10px;">
          <div style="color: #94a3b8; font-size: 0.65rem;">SELISIH WAKTU (DELTA):</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #f59e0b; margin: 2px 0;">${data.temporal_delta_seconds || 0} detik</div>
          <div style="font-size: 0.62rem; color: #cbd5e1;">Otomatisasi skrip cron</div>
        </div>

        <!-- 3. Subnet Proximity -->
        <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--color-border); border-radius: 4px; padding: 8px 10px;">
          <div style="color: #94a3b8; font-size: 0.65rem;">KEDEKATAN BTS / IP:</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #a855f7; margin: 2px 0;">${data.subnet_proximity || 0}%</div>
          <div style="font-size: 0.62rem; color: #cbd5e1;">Subnet / Tower identik</div>
        </div>

        <!-- 4. Device Fingerprint -->
        <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--color-border); border-radius: 4px; padding: 8px 10px;">
          <div style="color: #94a3b8; font-size: 0.65rem;">DEVICE FINGERPRINT:</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #ec4899; margin: 2px 0;">${data.device_fingerprint_match || 0}%</div>
          <div style="font-size: 0.62rem; color: #cbd5e1;">User-Agent &amp; Browser</div>
        </div>
      </div>

      <!-- Shared Keywords -->
      <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 10px; margin-bottom: 12px;">
        <div style="font-size: 0.7rem; color: #94a3b8; font-weight: 700; margin-bottom: 6px;">
          <i class="fa-solid fa-tags text-cyan"></i> KATA KUNCI &amp; TAGAR SINKRON BERSAMA:
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${kwBadges || '<span style="color: #64748b; font-size: 0.7rem;">Tidak ada kata kunci teridentifikasi.</span>'}
        </div>
      </div>

      <!-- Kesimpulan Rekomendasi Intelijen -->
      <div style="padding: 10px 14px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; font-size: 0.72rem; color: #fca5a5; line-height: 1.4;">
        <strong><i class="fa-solid fa-shield-halved"></i> REKOMENDASI TINDAKAN FORENSIK:</strong><br/>
        ${data.forensic_recommendation || 'Lakukan pembekuan massal simpul amplifier dan telusuri gateway pembayaran iklan buzzer.'}
      </div>
    `;
  }

  async handleSearchQuery(query, platform, btn) {
    const resBox = document.getElementById('inline-osint-result-search');
    if (!resBox) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MENARIK DATA...';
    resBox.style.display = 'flex';
    resBox.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--color-cyan);">
        <i class="fa-solid fa-satellite-dish fa-spin fa-2x"></i>
        <div style="margin-top: 10px; font-size: 0.85rem;">Mengambil cuitan terbaru dari platform medsos secara live...</div>
      </div>
    `;

    try {
      const resp = await ApiService.searchOsintIngest(query, platform, 10, true);
      const items = Array.isArray(resp.data) ? resp.data : [];
      
      if (items.length === 0) {
        resBox.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--color-text-muted);">Tidak ditemukan postingan dengan kata kunci tersebut.</div>`;
        return;
      }

      let html = `<div style="font-size: 0.8rem; color: var(--color-cyan); font-weight: 700; margin-bottom: 4px;">DITEMUKAN ${items.length} POSTINGAN TERBARU:</div>`;
      items.forEach(item => {
        html += `
          <div style="background: #0f172a; border: 1px solid var(--color-border); border-radius: 6px; padding: 12px; font-size: 0.8rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: #fff;">${item.author_handle || '@pengguna'}</strong>
              <span class="tag-badge valid">${item.platform || 'MEDSOS'}</span>
            </div>
            <div style="color: #cbd5e1; margin-bottom: 6px; line-height: 1.4;">${item.content || ''}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.7rem; color: var(--color-text-muted);">
              <span>👥 ${item.followers || 0} pengikut</span>
              <span>Sentimen: <strong style="color: #cbd5e1;">${item.sentiment || '-'}</strong></span>
              <span>Hoaks: <strong style="color: #cbd5e1;">${item.hoax_verdict || '-'}</strong></span>
              <span>Indeks Bot: <strong style="color: ${item.bot_score > 60 ? '#ef4444' : '#10b981'};">${item.bot_score || 20}%</strong></span>
            </div>
          </div>
        `;
      });
      resBox.innerHTML = html;
    } catch (err) {
      resBox.innerHTML = `<div style="padding: 14px; color: #ef4444;">Gagal mengambil data tagar: ${err.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> TARIK DATA LIVE';
    }
  }
}
