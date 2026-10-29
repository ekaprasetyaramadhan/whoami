/**
 * GeoBuzzerView Component
 * KOMANDO - Komando Monitoring dan Analisis Narasi Digital Online
 *
 * Tampilan Terpadu di Halaman Utama:
 * 1. Peta Interaktif Indonesia (ECharts GeoJSON 38 Provinsi)
 *    - Titik persebaran buzzer pulsing (effectScatter) dengan follower & reach
 *    - Mode SEMUA (38 Provinsi): menampilkan buzzer dengan rate tertinggi (Top Rate) per provinsi
 *    - Jalur propagasi isu antar provinsi dengan animasi panah terbang
 * 2. 4 Kartu Ringkasan Eksekutif KPI Enterprise
 * 3. 4 Sub-Views Full-Width Modular Navigation:
 *    - 1. PETA GEOGRAFIS (38 PROVINSI)
 *    - 2. JEJARING AKTOR (SNA FULL CANVAS)
 *    - 3. LIVE STREAM MEDSOS & GROUND ZERO
 *    - 4. RADAR BERITA RESMI DAERAH
 * 4. Filter Platform Terpadu: SEMUA, 𝕏, IG, FB, TikTok, Threads
 * 5. Stream Ingestion Bar dengan Speed Pacer & Auto-Stream
 */

import * as echarts from 'echarts';
import { ApiService } from '../services/api.js';
import { escapeHtml } from '../utils/sanitize.js';
import {
  PROVINCES_LIST_38,
  PROVINCE_COORDINATES_38,
  PROVINCE_SUMMARIES_38,
  BUZZER_NODES_38,
  PROPAGATION_LINES_DEFAULT,
  PROPAGATION_LINES_BY_PROVINCE,
  REGIONAL_NEWS_38,
  PROVINCE_SNA_38,
  SOCIAL_FEEDS_BY_PROVINCE
} from '../data/geoBuzzerData.js';

export class GeoBuzzerView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mapChart = null;
    this.snaChart = null;
    this.selectedProvince = 'ALL';
    this.selectedPlatform = 'all';
    this.selectedTimeframe = '24h';
    this.activeMainView = 'map'; // 'map' | 'sna' | 'social' | 'news'
    this.streamPaceMode = 'NORMAL'; // 'NORMAL' | 'SLOW' | 'PAUSED'
    this.buzzerData = [...BUZZER_NODES_38];
    this.summaryData = { ...PROVINCE_SUMMARIES_38 };
    this.flightLinesData = [...PROPAGATION_LINES_DEFAULT];
    this.showFlightLines = true;
    this.isMapRegistered = false;
    this.pendingIncomingPosts = [];
    this.autoStreamEnabled = false;
    this.init();
  }

  async init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="geo-view-wrapper">
        
        <!-- Ringkasan Eksekutif (4 Indikator Utama Enterprise Analytics) -->
        <section class="executive-kpi-bar" style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 10px 16px;">
          <!-- Card 1: Cakupan Wilayah -->
          <div class="kpi-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div class="kpi-icon status-green"><i class="fa-solid fa-map-location-dot"></i></div>
            <div class="kpi-content">
              <div class="kpi-label">CAKUPAN WILAYAH</div>
              <div class="kpi-val text-cyan">38 PROVINSI</div>
              <div class="kpi-desc">Sebaran nasional buzzer rate tertinggi</div>
            </div>
          </div>

          <!-- Card 2: Buzzer Terpantau -->
          <div class="kpi-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div class="kpi-icon text-cyan"><i class="fa-solid fa-users-viewfinder"></i></div>
            <div class="kpi-content">
              <div class="kpi-label">BUZZER TERDETEKSI</div>
              <div class="kpi-val text-cyan" id="kpi-top-buzzer-count">152 KOORDINATOR</div>
              <div class="kpi-desc">1.400+ bot farm terorganisir</div>
            </div>
          </div>

          <!-- Card 3: Jangkauan Audiens -->
          <div class="kpi-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div class="kpi-icon text-purple"><i class="fa-solid fa-bullhorn"></i></div>
            <div class="kpi-content">
              <div class="kpi-label">POTENSI JANGKAUAN</div>
              <div class="kpi-val text-purple" id="kpi-top-reach">54.200.000</div>
              <div class="kpi-desc">Akumulasi follower akun terpantau</div>
            </div>
          </div>

          <!-- Card 4: Platform Medsos -->
          <div class="kpi-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div class="kpi-icon text-amber"><i class="fa-solid fa-share-nodes"></i></div>
            <div class="kpi-content">
              <div class="kpi-label">CRAWLING MULTI-PLATFORM</div>
              <div class="kpi-val text-amber">6 PLATFORM</div>
              <div class="kpi-desc">𝕏 &bull; IG &bull; FB &bull; TikTok &bull; Threads</div>
            </div>
          </div>
        </section>

        <!-- Filter & Control Toolbar -->
        <div class="geo-control-toolbar">
          <!-- Platform Filter Pills -->
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600; margin-right: 2px;">PLATFORM:</span>
            <button class="btn-tactical geo-platform-pill active" data-platform="all">SEMUA</button>
            <button class="btn-tactical geo-platform-pill" data-platform="X"><i class="fa-brands fa-x-twitter"></i> 𝕏</button>
            <button class="btn-tactical geo-platform-pill" data-platform="INSTAGRAM"><i class="fa-brands fa-instagram text-purple"></i> IG</button>
            <button class="btn-tactical geo-platform-pill" data-platform="FACEBOOK"><i class="fa-brands fa-facebook text-cyan"></i> FB</button>
            <button class="btn-tactical geo-platform-pill" data-platform="TIKTOK"><i class="fa-brands fa-tiktok"></i> TikTok</button>
            <button class="btn-tactical geo-platform-pill" data-platform="THREADS"><i class="fa-brands fa-threads"></i> Threads</button>
          </div>

          <!-- Timeframe Playback Slider / Pills -->
          <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
            <span style="font-size: 0.7rem; color: var(--color-cyan); font-weight: 700; margin-right: 2px;">
              <i class="fa-solid fa-clock-rotate-left"></i> RENTANG:
            </span>
            <button class="btn-tactical geo-timeframe-pill" data-tf="1h" style="padding: 3px 8px; font-size: 0.68rem;">1 JAM</button>
            <button class="btn-tactical geo-timeframe-pill" data-tf="6h" style="padding: 3px 8px; font-size: 0.68rem;">6 JAM</button>
            <button class="btn-tactical geo-timeframe-pill active" data-tf="24h" style="padding: 3px 8px; font-size: 0.68rem;">24 JAM</button>
            <button class="btn-tactical geo-timeframe-pill" data-tf="7d" style="padding: 3px 8px; font-size: 0.68rem;">7 HARI</button>
          </div>

          <!-- Province Selector, Flight Lines Toggle & Refresh -->
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <button id="main-btn-toggle-flights" class="btn-tactical active" style="padding: 4px 9px; font-size: 0.7rem; border-color: var(--color-cyan); color: var(--color-cyan);">
              <i class="fa-solid fa-plane-departure"></i> JALUR PROPAGASI
            </button>
            <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">WILAYAH:</span>
            <select id="main-geo-province-select" class="form-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.74rem; padding: 5px 10px; border-radius: 6px; font-family: var(--font-mono); min-width: 250px;">
              <option value="ALL">SEMUA (38 PROVINSI)</option>
              <optgroup label="SUMATERA (10 PROVINSI)">
                <option value="ACEH">ACEH</option>
                <option value="SUMATERA UTARA">SUMATERA UTARA</option>
                <option value="SUMATERA BARAT">SUMATERA BARAT</option>
                <option value="RIAU">RIAU</option>
                <option value="KEPULAUAN RIAU">KEPULAUAN RIAU</option>
                <option value="JAMBI">JAMBI</option>
                <option value="SUMATERA SELATAN">SUMATERA SELATAN</option>
                <option value="KEPULAUAN BANGKA BELITUNG">KEPULAUAN BANGKA BELITUNG</option>
                <option value="BENGKULU">BENGKULU</option>
                <option value="LAMPUNG">LAMPUNG</option>
              </optgroup>
              <optgroup label="JAWA (6 PROVINSI)">
                <option value="DKI JAKARTA">DKI JAKARTA</option>
                <option value="BANTEN">BANTEN</option>
                <option value="JAWA BARAT">JAWA BARAT</option>
                <option value="JAWA TENGAH">JAWA TENGAH</option>
                <option value="DAERAH ISTIMEWA YOGYAKARTA">D.I. YOGYAKARTA</option>
                <option value="JAWA TIMUR">JAWA TIMUR</option>
              </optgroup>
              <optgroup label="BALI & NUSA TENGGARA (3 PROVINSI)">
                <option value="BALI">BALI</option>
                <option value="NUSA TENGGARA BARAT">NUSA TENGGARA BARAT</option>
                <option value="NUSA TENGGARA TIMUR">NUSA TENGGARA TIMUR</option>
              </optgroup>
              <optgroup label="KALIMANTAN (5 PROVINSI)">
                <option value="KALIMANTAN BARAT">KALIMANTAN BARAT</option>
                <option value="KALIMANTAN TENGAH">KALIMANTAN TENGAH</option>
                <option value="KALIMANTAN SELATAN">KALIMANTAN SELATAN</option>
                <option value="KALIMANTAN TIMUR">KALIMANTAN TIMUR (IKN)</option>
                <option value="KALIMANTAN UTARA">KALIMANTAN UTARA</option>
              </optgroup>
              <optgroup label="SULAWESI (6 PROVINSI)">
                <option value="SULAWESI UTARA">SULAWESI UTARA</option>
                <option value="GORONTALO">GORONTALO</option>
                <option value="SULAWESI TENGAH">SULAWESI TENGAH</option>
                <option value="SULAWESI BARAT">SULAWESI BARAT</option>
                <option value="SULAWESI SELATAN">SULAWESI SELATAN</option>
                <option value="SULAWESI TENGGARA">SULAWESI TENGGARA</option>
              </optgroup>
              <optgroup label="MALUKU & PAPUA (8 PROVINSI)">
                <option value="MALUKU">MALUKU</option>
                <option value="MALUKU UTARA">MALUKU UTARA</option>
                <option value="PAPUA">PAPUA</option>
                <option value="PAPUA BARAT">PAPUA BARAT</option>
                <option value="PAPUA SELATAN">PAPUA SELATAN</option>
                <option value="PAPUA TENGAH">PAPUA TENGAH</option>
                <option value="PAPUA PEGUNUNGAN">PAPUA PEGUNUNGAN</option>
                <option value="PAPUA BARAT DAYA">PAPUA BARAT DAYA</option>
              </optgroup>
            </select>
            <button id="main-btn-refresh-geo" class="btn-tactical" style="padding: 4px 9px; font-size: 0.7rem;">
              <i class="fa-solid fa-arrows-rotate"></i> REFRESH
            </button>
          </div>
        </div>

        <!-- 4 Sub-Views Full-Width Modular Navigation (Unsplit) -->
        <div class="geo-main-tab-nav">
          <button id="main-btn-view-map" class="btn-tactical geo-main-tab-btn active" data-view="map">
            <i class="fa-solid fa-map-location-dot text-cyan"></i> 1. PETA GEOGRAFIS (38 PROVINSI)
          </button>
          <button id="main-btn-view-sna" class="btn-tactical geo-main-tab-btn" data-view="sna">
            <i class="fa-solid fa-diagram-project text-purple"></i> 2. JEJARING AKTOR (SNA FULL CANVAS)
          </button>
          <button id="main-btn-view-social" class="btn-tactical geo-main-tab-btn" data-view="social">
            <i class="fa-solid fa-satellite-dish text-amber"></i> 3. LIVE STREAM MEDSOS & GROUND ZERO
            <span id="main-tab-social-count-badge" class="tag-badge" style="font-size: 0.6rem; margin-left: 6px;">0 POSTS</span>
          </button>
          <button id="main-btn-view-news" class="btn-tactical geo-main-tab-btn" data-view="news">
            <i class="fa-regular fa-newspaper text-cyan"></i> 4. RADAR BERITA RESMI DAERAH
          </button>
        </div>

        <!-- Global Persistent Ingestion Stream Bar -->
        <div id="main-global-stream-bar" class="global-stream-bar">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: #0f172a;">
              <span class="fa-solid fa-bolt fa-fade" style="color: #f59e0b;"></span>
              <span id="main-global-stream-text"><span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-satellite-dish"></i> Telemetri Live Aktif:</span> Menangkap aliran data medsos 38 provinsi</span>
            </div>
            <!-- Floating Banner Notification Toast -->
            <div id="main-geo-new-posts-banner" class="floating-stream-banner" style="display: none; margin: 0; padding: 3px 12px;" title="Klik untuk menampilkan postingan terbaru">
              <span id="main-geo-new-posts-text">⚡ 0 Post Baru Masuk</span>
              <button id="main-btn-show-new-posts" class="btn-tactical cyan" style="padding: 2px 8px; font-size: 0.65rem; font-weight: 700; margin-left: 6px;">
                TAMPILKAN KE FEED ↑
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <!-- Speed Pacer Controls -->
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 0.65rem; color: #94a3b8; font-weight: 600;">KECEPATAN ALIRAN:</span>
              <button id="btn-stream-pace-normal" class="btn-tactical active" style="padding: 2px 7px; font-size: 0.62rem;" title="Aliran standar setiap 1.5 detik">⚡ NORMAL (1.5s)</button>
              <button id="btn-stream-pace-slow" class="btn-tactical" style="padding: 2px 7px; font-size: 0.62rem;" title="Aliran santai setiap 4 detik">⏱️ SANTAI (4s)</button>
              <button id="btn-stream-pace-pause" class="btn-tactical" style="padding: 2px 7px; font-size: 0.62rem;" title="Jeda sementara agar data tidak melompat-lompat">⏸️ JEDA</button>
            </div>

            <!-- Auto-Stream Toggle -->
            <label style="font-size: 0.68rem; color: #0f172a; display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; background: #eff6ff; padding: 4px 10px; border-radius: 6px; border: 1px solid #bfdbfe;" title="Otomatis masukkan postingan baru tanpa perlu klik tombol Tampilkan">
              <input type="checkbox" id="chk-auto-stream-toggle" style="accent-color: var(--color-cyan); cursor: pointer;">
              <span>Auto-Stream Langsung</span>
            </label>
          </div>
        </div>

        <!-- Full-Width Content Container (Modular Unsplit) -->
        <div class="geo-full-content-container">
          
          <!-- PANE 1: FULL-WIDTH PETA INDONESIA -->
          <div id="main-view-pane-map" class="geo-full-view-pane" style="display: flex;">
            <!-- Map Legend Box -->
            <div class="geo-map-legend">
              <div style="color: var(--color-cyan); font-weight: 700; margin-bottom: 4px;"><i class="fa-solid fa-circle-dot"></i> SEBARAN BUZZER TERDETEKSI</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 6px #ef4444;"></span>
                <span style="color: #cbd5e1;">High Threat (>75% Bot / Provokasi)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #8b5cf6; box-shadow: 0 0 6px #8b5cf6;"></span>
                <span style="color: #cbd5e1;">Medium Threat / Polarizer</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="display: inline-block; width: 14px; height: 2px; background: #00e5ff; box-shadow: 0 0 6px #00e5ff;"></span>
                <span style="color: #cbd5e1;">Arah Sebaran Isu (Garis Panah Terbang) <span class="help-icon" title="Menunjukkan ke provinsi mana narasi ini merambat beserta kecepatan sebar per jamnya.">?</span></span>
              </div>
              <div style="font-size: 0.65rem; color: var(--color-text-muted); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px; line-height: 1.3;">
                *Mode SEMUA: menampilkan <strong>Buzzer Top Rate</strong> per provinsi
              </div>
            </div>

            <!-- ECharts Indonesia Map Container -->
            <div id="main-indonesia-map-chart" class="geo-map-chart" style="width: 100%; height: 560px; min-height: 520px; flex: 1;"></div>

            <!-- Bottom Selected Province Bar -->
            <div class="geo-brief-prov-bar">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-location-crosshairs text-cyan"></i>
                <span style="color: var(--color-text-muted);">Wilayah Terpilih:</span>
                <strong id="main-brief-prov-name" style="color: #0f172a; font-family: var(--font-heading);">SEMUA PROVINSI (NASIONAL)</strong>
              </div>
              <div id="main-brief-prov-stats" style="color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.72rem;">
                Memuat telemetri wilayah...
              </div>
            </div>
          </div>

          <!-- PANE 2: FULL-WIDTH SNA GRAPH CANVAS -->
          <div id="main-view-pane-sna" class="geo-full-view-pane" style="display: none;">
            <div style="padding: 10px 18px; background: rgba(139, 92, 246, 0.08); border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem; flex-shrink: 0;">
              <span style="color: #c084fc;">
                <i class="fa-solid fa-diagram-project"></i> Peta Hubungan Akun Pemicu vs Bot Farm di Wilayah <strong id="main-sna-target-prov-label">SEMUA PROVINSI</strong> (Full 100% Canvas)
                <span class="help-icon" title="Diagram lingkaran interaksi: Koordinator Inti (tengah), Bot Farm amplifier (sekitar), dan Warganet Organik.">?</span>
              </span>
              <span class="tag-badge bot" style="font-size: 0.65rem;">SNA FULL RESOLUTION</span>
            </div>
            <div id="main-geo-sna-chart-container" style="width: 100%; height: 560px; min-height: 520px; flex: 1;"></div>
          </div>

          <!-- PANE 3: FULL-WIDTH POSTINGAN MEDSOS & GROUND ZERO -->
          <div id="main-view-pane-social" class="geo-full-view-pane" style="display: none; overflow-y: auto; padding: 18px; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div style="font-size: 0.8rem; color: #0f172a; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-satellite-dish text-amber"></i> POSTINGAN MEDSOS & DETEKSI GROUND ZERO DI <span id="main-social-prov-title" style="color: var(--color-cyan);">SEMUA WILAYAH</span>
              </div>
              <div id="main-geo-social-count-badge" class="tag-badge valid" style="font-size: 0.68rem;">0 POSTS TERKUTIP</div>
            </div>
            <div id="main-geo-social-feed-list" class="geo-feed-grid">
              <!-- Diisi dinamis -->
            </div>
          </div>

          <!-- PANE 4: FULL-WIDTH RADAR BERITA RESMI DAERAH -->
          <div id="main-view-pane-news" class="geo-full-view-pane" style="display: none; overflow-y: auto; padding: 18px; gap: 14px;">
            <div style="padding: 12px 18px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 0.74rem; color: #1e40af;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="color: var(--color-cyan); font-weight: 700;">
                  <i class="fa-solid fa-newspaper text-cyan"></i> CRAWLER BERITA RESMI DAERAH (DEWAN PERS & MEDIA TERAKREDITASI)
                </span>
                <span class="tag-badge valid" style="font-size: 0.65rem;">LIVE NEWS CRAWLER</span>
              </div>
              Menyinkronkan rilis pers dan investigasi resmi dari portal berita terakreditasi untuk memverifikasi isu dan narasi medsos di provinsi ini.
            </div>
            <div id="main-geo-news-feed-list" class="geo-news-grid">
              <!-- Diisi dinamis -->
            </div>
          </div>

        </div>

      </div>
    `;

    this.bindEvents();

    // Inisialisasi ECharts setelah kontainer terpasang di DOM dan memiliki dimensi
    setTimeout(() => {
      const mapContainer = document.getElementById('main-indonesia-map-chart');
      if (mapContainer && mapContainer.clientWidth > 0 && !this.mapChart) {
        this.mapChart = echarts.init(mapContainer);
      }
      this.loadAllData();
    }, 60);

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  bindEvents() {
    // Platform Pills
    const pills = this.container.querySelectorAll('.geo-platform-pill');
    pills.forEach((p) => {
      p.onclick = () => {
        pills.forEach((x) => x.classList.remove('active'));
        p.classList.add('active');
        this.selectedPlatform = p.dataset.platform;
        this.renderMap();
        this.loadSocialFeeds();
      };
    });

    // Timeframe Pills
    const tfPills = this.container.querySelectorAll('.geo-timeframe-pill');
    tfPills.forEach((tp) => {
      tp.onclick = () => {
        tfPills.forEach((x) => x.classList.remove('active'));
        tp.classList.add('active');
        this.selectedTimeframe = tp.dataset.tf;
        this.loadPropagationLines();
      };
    });

    // Toggle Flight Lines Button
    const toggleFlightsBtn = document.getElementById('main-btn-toggle-flights');
    if (toggleFlightsBtn) {
      toggleFlightsBtn.onclick = () => {
        this.showFlightLines = !this.showFlightLines;
        if (this.showFlightLines) {
          toggleFlightsBtn.classList.add('active');
          toggleFlightsBtn.style.color = 'var(--color-cyan)';
          toggleFlightsBtn.style.borderColor = 'var(--color-cyan)';
          toggleFlightsBtn.innerHTML = '<i class="fa-solid fa-plane-departure"></i> JALUR PROPAGASI: AKTIF';
        } else {
          toggleFlightsBtn.classList.remove('active');
          toggleFlightsBtn.style.color = 'var(--color-text-muted)';
          toggleFlightsBtn.style.borderColor = 'var(--color-border)';
          toggleFlightsBtn.innerHTML = '<i class="fa-solid fa-plane-slash"></i> JALUR PROPAGASI: NONAKTIF';
        }
        this.renderMap();
      };
    }

    // Province Dropdown Change
    const provSelect = document.getElementById('main-geo-province-select');
    if (provSelect) {
      provSelect.onchange = (e) => {
        this.changeProvince(e.target.value);
      };
    }

    // Refresh Button
    const refreshBtn = document.getElementById('main-btn-refresh-geo');
    if (refreshBtn) {
      refreshBtn.onclick = () => {
        refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MEMPERBARUI...';
        this.loadAllData().finally(() => {
          refreshBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> REFRESH';
        });
      };
    }

    // 4 Modular View Tabs Switching
    const viewBtns = this.container.querySelectorAll('.geo-main-tab-btn');
    viewBtns.forEach((btn) => {
      btn.onclick = () => {
        const view = btn.dataset.view;
        if (view) this.switchMainView(view);
      };
    });

    // Speed Pacer Buttons
    const btnPaceNormal = document.getElementById('btn-stream-pace-normal');
    const btnPaceSlow = document.getElementById('btn-stream-pace-slow');
    const btnPacePause = document.getElementById('btn-stream-pace-pause');

    if (btnPaceNormal) btnPaceNormal.onclick = () => this.changeStreamPace('NORMAL');
    if (btnPaceSlow) btnPaceSlow.onclick = () => this.changeStreamPace('SLOW');
    if (btnPacePause) btnPacePause.onclick = () => this.changeStreamPace('PAUSED');

    // Auto-Stream Ingestion Toggle
    const autoStreamChk = document.getElementById('chk-auto-stream-toggle');
    if (autoStreamChk) {
      autoStreamChk.onchange = (e) => {
        this.autoStreamEnabled = e.target.checked;
        if (this.autoStreamEnabled && this.pendingIncomingPosts.length > 0) {
          this.flushPendingPosts();
        }
      };
    }

    // Show New Posts Button on Floating Banner
    const showNewPostsBtn = document.getElementById('main-btn-show-new-posts');
    if (showNewPostsBtn) {
      showNewPostsBtn.onclick = () => {
        this.flushPendingPosts();
      };
    }

    // Ingestion WebSocket Event Listener
    window.addEventListener('whoiam:new_post', (e) => {
      if (e.detail) {
        this.handleIncomingTelemetryPost(e.detail);
      }
    });
  }

  switchMainView(viewName) {
    this.activeMainView = viewName;
    const btns = this.container.querySelectorAll('.geo-main-tab-btn');
    btns.forEach((b) => {
      b.classList.toggle('active', b.dataset.view === viewName);
    });

    const panes = {
      map: document.getElementById('main-view-pane-map'),
      sna: document.getElementById('main-view-pane-sna'),
      social: document.getElementById('main-view-pane-social'),
      news: document.getElementById('main-view-pane-news')
    };

    Object.entries(panes).forEach(([k, el]) => {
      if (el) el.style.display = k === viewName ? 'flex' : 'none';
    });

    setTimeout(() => {
      if (viewName === 'map' && this.mapChart) {
        this.mapChart.resize();
      } else if (viewName === 'sna' && this.snaChart) {
        this.snaChart.resize();
      }
    }, 60);
  }

  async changeStreamPace(mode) {
    this.streamPaceMode = mode;
    const pBtns = {
      NORMAL: document.getElementById('btn-stream-pace-normal'),
      SLOW: document.getElementById('btn-stream-pace-slow'),
      PAUSED: document.getElementById('btn-stream-pace-pause')
    };

    Object.entries(pBtns).forEach(([k, btn]) => {
      if (btn) btn.classList.toggle('active', k === mode);
    });

    const streamStatusText = document.getElementById('main-global-stream-text');
    if (streamStatusText) {
      if (mode === 'PAUSED') {
        streamStatusText.innerHTML = '<span style="color:#ef4444; font-weight:700;"><i class="fa-solid fa-circle-pause"></i> Aliran Dijeda:</span> Postingan baru ditampung di antrean buffer';
      } else if (mode === 'SLOW') {
        streamStatusText.innerHTML = '<span style="color:#38bdf8; font-weight:700;"><i class="fa-solid fa-clock"></i> Aliran Santai:</span> Jeda santai 4 detik per post';
      } else {
        streamStatusText.innerHTML = '<span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-satellite-dish"></i> Telemetri Live Aktif:</span> Menangkap aliran data medsos 38 provinsi';
      }
    }

    try {
      await ApiService.setSimulatorSpeed(mode);
    } catch (e) {
      console.warn('Gagal mengatur kecepatan simulator:', e);
    }
  }

  async loadAllData() {
    await this.registerMapIfNeeded();
    await Promise.all([
      this.loadBuzzerDistribution(),
      this.loadProvincesSummary(),
      this.loadPropagationLines(),
      this.loadProvinceSna(this.selectedProvince),
      this.loadRegionalNews(this.selectedProvince),
      this.loadSocialFeeds()
    ]);
  }

  async loadPropagationLines() {
    const provParam = (this.selectedProvince === 'ALL' || this.selectedProvince === 'SEMUA') ? 'DKI JAKARTA' : this.selectedProvince;
    try {
      const res = await ApiService.getPropagationLines(provParam, this.selectedTimeframe);
      if (res && res.data && res.data.lines && res.data.lines.length > 0) {
        this.flightLinesData = res.data.lines;
      } else {
        this.flightLinesData = PROPAGATION_LINES_BY_PROVINCE[provParam] || PROPAGATION_LINES_DEFAULT;
      }
    } catch (e) {
      console.warn('Gagal memuat flight lines propagasi dari API, fallback ke master dataset:', e);
      this.flightLinesData = PROPAGATION_LINES_BY_PROVINCE[provParam] || PROPAGATION_LINES_DEFAULT;
    } finally {
      this.renderMap();
    }
  }

  async registerMapIfNeeded() {
    if (this.isMapRegistered) return;
    try {
      const resp = await fetch('/data/indonesia-provinces.json');
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} fetching /data/indonesia-provinces.json`);
      }
      const geoJson = await resp.json();
      echarts.registerMap('indonesia', geoJson);
      this.isMapRegistered = true;
      console.log('✅ GeoJSON peta Indonesia (38 Provinsi) berhasil diregistrasi.');
    } catch (e) {
      console.error('❌ Gagal registrasi GeoJSON peta Indonesia:', e);
    }
  }

  async loadBuzzerDistribution() {
    try {
      const res = await ApiService.getGeoBuzzerDistribution(this.selectedPlatform, 'all');
      if (res && res.data) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          this.buzzerData = res.data;
        } else if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          this.buzzerData = res.data.data;
        }
      }
    } catch (e) {
      console.warn('Gagal memuat persebaran buzzer dari API, fallback ke 152 node 38 provinsi:', e);
    } finally {
      if (!this.buzzerData || this.buzzerData.length === 0) {
        this.buzzerData = [...BUZZER_NODES_38];
      }
      this.renderMap();
    }
  }

  async loadProvincesSummary() {
    try {
      const res = await ApiService.getGeoProvincesSummary();
      if (res && res.data && res.data.provinces && Object.keys(res.data.provinces).length > 0) {
        this.summaryData = res.data.provinces;
      }
    } catch (e) {
      console.warn('Gagal memuat ringkasan provinsi dari API, fallback ke master 38 provinsi:', e);
    } finally {
      if (!this.summaryData || Object.keys(this.summaryData).length === 0) {
        this.summaryData = { ...PROVINCE_SUMMARIES_38 };
      }
      this.populateProvinceSelect();
      this.updateProvinceBrief(this.selectedProvince);
    }
  }

  populateProvinceSelect() {
    const sel = document.getElementById('main-geo-province-select');
    if (!sel) return;
    const cur = sel.value || this.selectedProvince;
    
    // Pastikan seluruh 38 provinsi selalu tersedia di select dropdown
    if (sel.options.length < 39) {
      sel.innerHTML = `
        <option value="ALL">SEMUA (38 PROVINSI)</option>
        <optgroup label="SUMATERA (10 PROVINSI)">
          <option value="ACEH">ACEH</option>
          <option value="SUMATERA UTARA">SUMATERA UTARA</option>
          <option value="SUMATERA BARAT">SUMATERA BARAT</option>
          <option value="RIAU">RIAU</option>
          <option value="KEPULAUAN RIAU">KEPULAUAN RIAU</option>
          <option value="JAMBI">JAMBI</option>
          <option value="SUMATERA SELATAN">SUMATERA SELATAN</option>
          <option value="KEPULAUAN BANGKA BELITUNG">KEPULAUAN BANGKA BELITUNG</option>
          <option value="BENGKULU">BENGKULU</option>
          <option value="LAMPUNG">LAMPUNG</option>
        </optgroup>
        <optgroup label="JAWA (6 PROVINSI)">
          <option value="DKI JAKARTA">DKI JAKARTA</option>
          <option value="BANTEN">BANTEN</option>
          <option value="JAWA BARAT">JAWA BARAT</option>
          <option value="JAWA TENGAH">JAWA TENGAH</option>
          <option value="DAERAH ISTIMEWA YOGYAKARTA">D.I. YOGYAKARTA</option>
          <option value="JAWA TIMUR">JAWA TIMUR</option>
        </optgroup>
        <optgroup label="BALI & NUSA TENGGARA (3 PROVINSI)">
          <option value="BALI">BALI</option>
          <option value="NUSA TENGGARA BARAT">NUSA TENGGARA BARAT</option>
          <option value="NUSA TENGGARA TIMUR">NUSA TENGGARA TIMUR</option>
        </optgroup>
        <optgroup label="KALIMANTAN (5 PROVINSI)">
          <option value="KALIMANTAN BARAT">KALIMANTAN BARAT</option>
          <option value="KALIMANTAN TENGAH">KALIMANTAN TENGAH</option>
          <option value="KALIMANTAN SELATAN">KALIMANTAN SELATAN</option>
          <option value="KALIMANTAN TIMUR">KALIMANTAN TIMUR (IKN)</option>
          <option value="KALIMANTAN UTARA">KALIMANTAN UTARA</option>
        </optgroup>
        <optgroup label="SULAWESI (6 PROVINSI)">
          <option value="SULAWESI UTARA">SULAWESI UTARA</option>
          <option value="GORONTALO">GORONTALO</option>
          <option value="SULAWESI TENGAH">SULAWESI TENGAH</option>
          <option value="SULAWESI BARAT">SULAWESI BARAT</option>
          <option value="SULAWESI SELATAN">SULAWESI SELATAN</option>
          <option value="SULAWESI TENGGARA">SULAWESI TENGGARA</option>
        </optgroup>
        <optgroup label="MALUKU & PAPUA (8 PROVINSI)">
          <option value="MALUKU">MALUKU</option>
          <option value="MALUKU UTARA">MALUKU UTARA</option>
          <option value="PAPUA">PAPUA</option>
          <option value="PAPUA BARAT">PAPUA BARAT</option>
          <option value="PAPUA SELATAN">PAPUA SELATAN</option>
          <option value="PAPUA TENGAH">PAPUA TENGAH</option>
          <option value="PAPUA PEGUNUNGAN">PAPUA PEGUNUNGAN</option>
          <option value="PAPUA BARAT DAYA">PAPUA BARAT DAYA</option>
        </optgroup>
      `;
    }
    sel.value = cur || 'ALL';
  }

  changeProvince(provName) {
    this.selectedProvince = provName;

    const provSelect = document.getElementById('main-geo-province-select');
    if (provSelect && provSelect.value !== provName) {
      provSelect.value = provName;
    }

    const isAll = (provName === 'ALL' || provName === 'SEMUA');
    const snaLabel = document.getElementById('main-sna-target-prov-label');
    if (snaLabel) {
      snaLabel.textContent = isAll ? '38 PROVINSI (RATE TERTINGGI NASIONAL)' : provName;
    }

    const socialTitle = document.getElementById('main-social-prov-title');
    if (socialTitle) {
      socialTitle.textContent = isAll ? 'SEMUA WILAYAH' : provName;
    }

    this.updateProvinceBrief(provName);
    this.renderMap();

    // Kamera otomatis mengarah ke koordinat centroid provinsi terpilih
    if (!isAll && PROVINCE_COORDINATES_38[provName]) {
      const coords = PROVINCE_COORDINATES_38[provName];
      this.flyToLocation(coords[0], coords[1], 4.2);
    } else if (isAll) {
      this.flyToLocation(118.0, -2.5, 1.25);
    }

    this.loadPropagationLines();
    this.loadProvinceSna(provName);
    this.loadRegionalNews(provName);
    this.loadSocialFeeds();
  }

  updateProvinceBrief(provName) {
    const isAll = (provName === 'ALL' || provName === 'SEMUA');
    const briefName = document.getElementById('main-brief-prov-name');
    if (briefName) {
      briefName.textContent = isAll ? 'SEMUA PROVINSI (NASIONAL - 38 PROVINSI)' : provName;
    }

    const briefStats = document.getElementById('main-brief-prov-stats');
    if (briefStats) {
      if (isAll) {
        const totalBuzzers = (this.buzzerData || []).length;
        const allSummaries = Object.values(this.summaryData || {});
        const totalReach = allSummaries.reduce((acc, s) => acc + (s.total_reach || s.total_followers || 0), 0) || 54200000;
        const totalHighThreat = (this.buzzerData || []).filter(b => b.threat_level === 'HIGH').length || 42;

        let maxRateBuzzer = null;
        let maxRateVal = 0;
        (this.buzzerData || []).forEach(b => {
          const r = parseFloat(b.engagement_rate) || 0;
          if (r > maxRateVal) {
            maxRateVal = r;
            maxRateBuzzer = b;
          }
        });
        const topRateLabel = maxRateBuzzer ? `${maxRateBuzzer.engagement_rate} (${maxRateBuzzer.city})` : '12.5%';

        briefStats.innerHTML = `
          <span>Cakupan: <strong style="color: #fff;">38 Provinsi</strong> (<span style="color: var(--color-cyan);">${totalBuzzers || 152} Koordinator</span>)</span> &bull; 
          <span>Potensi Reach: <strong style="color: var(--color-cyan);">${this.formatNumber(totalReach)}</strong></span> &bull; 
          <span>High Threat: <strong style="color: #ef4444;">${totalHighThreat} Aktor</strong></span> &bull; 
          <span>Top Engagement Rate: <strong style="color: #10b981;">${topRateLabel}</strong></span>
        `;

        const kpiCount = document.getElementById('kpi-top-buzzer-count');
        if (kpiCount) kpiCount.textContent = `${totalBuzzers || 152} KOORDINATOR`;
        const kpiReach = document.getElementById('kpi-top-reach');
        if (kpiReach) kpiReach.textContent = this.formatNumber(totalReach);
      } else {
        const provBuzzers = (this.buzzerData || []).filter((b) => b.province === provName);
        const data = (this.summaryData && this.summaryData[provName]) || {};
        
        const coreCoordinators = provBuzzers.length > 0 ? provBuzzers.length : 4;
        const botAmplifiers = data.bot_amplifiers_count || (28 + ((provBuzzers[0]?.amplifiers_count || 240) % 18));
        const totalCluster = coreCoordinators + botAmplifiers;

        const totalReach = data.total_reach ?? data.total_followers ?? provBuzzers.reduce((acc, b) => acc + (b.followers || 0), 0);
        const highRisk = data.high_risk_count ?? (provBuzzers.length > 0 ? provBuzzers.filter((b) => b.threat_level === 'HIGH').length : 1);
        const provTopRate = provBuzzers.length > 0 ? provBuzzers[0].engagement_rate : '8.5%';

        briefStats.innerHTML = `
          <span>Kluster Terdeteksi: <strong style="color: #fff;">${totalCluster} Akun</strong> (<span style="color: #ef4444;">${coreCoordinators} Koordinator</span> + <span style="color: #a855f7;">${botAmplifiers} Bot Farm</span>)</span> &bull; 
          <span>Potensi Reach: <strong style="color: var(--color-cyan);">${this.formatNumber(totalReach)}</strong></span> &bull; 
          <span>High Threat: <strong style="color: #ef4444;">${highRisk} Aktor</strong></span> &bull; 
          <span>Engagement Rate: <strong style="color: #10b981;">${provTopRate}</strong></span>
        `;
      }
    }
  }

  renderMap() {
    const mapContainer = document.getElementById('main-indonesia-map-chart');
    if (!this.mapChart && mapContainer && mapContainer.clientWidth > 0) {
      this.mapChart = echarts.init(mapContainer);
    }
    if (!this.mapChart || !this.isMapRegistered) return;
    if (mapContainer && mapContainer.clientWidth === 0) return;

    const isAll = (this.selectedProvince === 'ALL' || this.selectedProvince === 'SEMUA');
    let targetBuzzers = [...this.buzzerData];

    // Filter berdasarkan platform jika aktif
    if (this.selectedPlatform !== 'all') {
      targetBuzzers = targetBuzzers.filter(b => b.platform.toUpperCase() === this.selectedPlatform.toUpperCase());
    }

    if (!isAll) {
      targetBuzzers = targetBuzzers.filter(b => b.province === this.selectedProvince);
    }

    // Urutkan dari rate dan follower tertinggi
    const sortedBuzzers = targetBuzzers.sort((a, b) => {
      const rateA = parseFloat(a.engagement_rate) || 0;
      const rateB = parseFloat(b.engagement_rate) || 0;
      return (rateB * 100000 + (b.followers || 0)) - (rateA * 100000 + (a.followers || 0));
    });

    const seenCityKeys = new Set();
    const scatterData = sortedBuzzers.map((b) => {
      const cityKey = `${b.province}_${b.city}`;
      const isPrimary = !seenCityKeys.has(cityKey);
      if (isPrimary) {
        seenCityKeys.add(cityKey);
      }

      return {
        name: `${b.name} (${b.handle})`,
        value: [b.coords[0], b.coords[1], b.followers],
        itemData: b,
        label: {
          show: isAll ? isPrimary : true
        }
      };
    });

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        textStyle: { color: '#0f172a', fontSize: 12 },
        extraCssText: 'box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: (params) => {
          if (params.seriesType === 'lines' && params.data && params.data.itemData) {
            const l = params.data.itemData;
            return `
              <div style="padding: 6px; min-width: 230px;">
                <div style="font-weight: 700; color: #00e5ff; font-size: 0.82rem; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-plane-departure"></i> JALUR PROPAGASI ISU
                </div>
                <div style="font-size: 0.74rem; color: #f8fafc; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">
                  <strong style="color: #fbbf24;">${l.from_name}</strong> &rarr; <strong style="color: #38bdf8;">${l.to_name}</strong>
                </div>
                <div style="font-size: 0.7rem; color: #cbd5e1; margin-bottom: 2px;">Narasi: <strong style="color: #fff;">${l.narrative}</strong></div>
                <div style="font-size: 0.7rem; color: #cbd5e1; margin-bottom: 2px;">Kecepatan: <strong style="color: #f59e0b;">${l.speed_cph} tweet/jam</strong></div>
                <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 4px;">
                  Rentang: <strong style="color: var(--color-cyan);">${l.timeframe}</strong> &bull; Volume: <strong style="color: #fff;">${(l.volume || 0).toLocaleString('id-ID')} interaksi</strong>
                </div>
              </div>
            `;
          }
          if (params.seriesType === 'effectScatter' && params.data && params.data.itemData) {
            const b = params.data.itemData;
            return `
              <div style="padding: 4px; min-width: 230px;">
                <div style="font-weight: 700; color: #00e5ff; font-size: 0.85rem; margin-bottom: 2px;">
                  ${b.name} <span style="color: #94a3b8; font-weight: normal;">${b.handle}</span>
                </div>
                <div style="font-size: 0.72rem; color: #cbd5e1; margin-bottom: 6px;">
                  Platform: <strong style="color: #f8fafc;">${b.platform}</strong> &bull; Wilayah: <strong style="color: #f8fafc;">${b.city}, ${b.province}</strong>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.7rem; background: rgba(0,0,0,0.35); padding: 6px; border-radius: 4px;">
                  <div>Follower: <strong style="color: #38bdf8;">${b.followers.toLocaleString('id-ID')}</strong></div>
                  <div>Engagement: <strong style="color: #10b981;">${b.engagement_rate || '7.5%'}</strong></div>
                  <div>Bot Score: <strong style="color: ${b.bot_score > 75 ? '#ef4444' : '#f59e0b'};">${b.bot_score}%</strong></div>
                  <div>Ancaman: <strong style="color: ${b.threat_level === 'HIGH' ? '#ef4444' : '#10b981'};">${b.threat_level}</strong></div>
                </div>
                <div style="margin-top: 6px; font-size: 0.7rem; color: #e2e8f0; border-left: 2px solid #00e5ff; padding-left: 6px;">
                  <em>"${b.post_snippet}"</em>
                </div>
                <div style="margin-top: 4px; font-size: 0.65rem; color: #94a3b8; text-align: right;">
                  Narasi: <strong style="color: #38bdf8;">${b.narrative}</strong>
                </div>
              </div>
            `;
          }
          return params.name;
        }
      },
      geo: {
        map: 'indonesia',
        roam: true,
        zoom: isAll ? 1.25 : 4.0,
        center: (!isAll && PROVINCE_COORDINATES_38[this.selectedProvince])
          ? PROVINCE_COORDINATES_38[this.selectedProvince]
          : [118.0, -2.5],
        label: {
          show: false
        },
        itemStyle: {
          areaColor: '#e2e8f0',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.04)',
          shadowBlur: 4
        },
        emphasis: {
          itemStyle: {
            areaColor: '#bfdbfe',
            borderColor: '#2563eb',
            borderWidth: 1.5
          },
          label: {
            show: true,
            color: '#0f172a',
            fontSize: 11
          }
        }
      },
      series: [
        ...(this.showFlightLines && this.flightLinesData && this.flightLinesData.length > 0 ? [{
          name: 'Jalur Propagasi Isu',
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 1,
          effect: {
            show: true,
            period: 4,
            trailLength: 0.25,
            symbol: 'arrow',
            symbolSize: 6,
            color: '#00e5ff'
          },
          lineStyle: {
            color: '#00e5ff',
            width: 1.6,
            opacity: 0.5,
            curveness: 0.25
          },
          data: this.flightLinesData
            .map(l => {
              const coords = l.coords || (l.from_coords && l.to_coords ? [l.from_coords, l.to_coords] : null);
              if (!coords || !Array.isArray(coords) || coords.length !== 2) return null;
              const [c1, c2] = coords;
              if (!Array.isArray(c1) || !Array.isArray(c2) || c1.length < 2 || c2.length < 2) return null;
              const lon1 = Number(c1[0]), lat1 = Number(c1[1]);
              const lon2 = Number(c2[0]), lat2 = Number(c2[1]);
              if (isNaN(lon1) || isNaN(lat1) || isNaN(lon2) || isNaN(lat2)) return null;
              return {
                fromName: l.from_name || '',
                toName: l.to_name || '',
                coords: [[lon1, lat1], [lon2, lat2]],
                itemData: l
              };
            })
            .filter(Boolean)
        }] : []),
        {
          name: 'Top Buzzer',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: scatterData,
          symbolSize: (val) => {
            const followers = val[2] || 10000;
            return Math.min(32, Math.max(12, Math.sqrt(followers) / 35));
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 3.5,
            period: 3
          },
          label: {
            formatter: (params) => {
              const b = params.data.itemData;
              const rate = b.engagement_rate || '';
              return `{city|${b.city}} {reach|${(b.followers / 1000).toFixed(0)}k}${rate ? ` {rate|${rate}}` : ''}`;
            },
            position: 'top',
            distance: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#cbd5e1',
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 6],
            rich: {
              city: {
                color: '#0f172a',
                fontWeight: 600,
                fontSize: 9.5
              },
              reach: {
                color: '#2563eb',
                fontSize: 9
              },
              rate: {
                color: '#059669',
                fontSize: 8.5,
                fontWeight: 700
              }
            }
          },
          labelLayout: {
            hideOverlap: true
          },
          emphasis: {
            scale: 1.3,
            label: {
              show: true,
              borderColor: '#00e5ff',
              backgroundColor: 'rgba(15, 23, 42, 0.95)'
            }
          },
          itemStyle: {
            color: (params) => {
              const b = params.data.itemData;
              return b.threat_level === 'HIGH' ? '#ef4444' : '#8b5cf6';
            },
            shadowBlur: 12,
            shadowColor: '#ef4444'
          },
          zlevel: 2
        }
      ]
    };

    this.mapChart.setOption(option, true);

    this.mapChart.off('click');
    this.mapChart.on('click', (params) => {
      if (params.seriesType === 'effectScatter' && params.data && params.data.itemData) {
        const b = params.data.itemData;
        this.changeProvince(b.province);
      } else if (params.componentType === 'geo') {
        const provName = params.name ? params.name.toUpperCase() : null;
        if (provName) this.changeProvince(provName);
      }
    });
  }


  async loadProvinceSna(provName) {
    try {
      const res = await ApiService.getProvinceSna(provName);
      if (res && res.data && res.data.nodes && res.data.nodes.length > 0) {
        this.renderSnaGraph(res.data);
        return;
      }
    } catch (e) {
      console.warn('Gagal memuat SNA wilayah dari API, fallback ke master dataset:', e);
    }
    const fallbackSna = PROVINCE_SNA_38[provName] || PROVINCE_SNA_38['ALL'];
    if (fallbackSna) {
      this.renderSnaGraph(fallbackSna);
    }
  }

  renderSnaGraph(snaData) {
    this.lastSnaData = snaData;
    const snaContainer = document.getElementById('main-geo-sna-chart-container');
    if (!snaContainer || snaContainer.clientWidth === 0) return;

    if (!this.snaChart) {
      this.snaChart = echarts.init(snaContainer);
    } else {
      this.snaChart.resize();
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        textStyle: { color: '#0f172a', fontSize: 12 },
        extraCssText: 'box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: (params) => {
          if (params.dataType === 'node') {
            const d = params.data;
            const displayName = d.label || d.name;
            return `<div style="font-size:0.75rem; padding: 4px;">
              <strong style="color: #00e5ff;">${displayName}</strong> <span style="color:#94a3b8;">(${d.id})</span><br>
              Peran: <strong>${d.role}</strong><br>
              Bot Score: <strong style="color:${d.bot_score > 70 ? '#ef4444' : '#10b981'};">${d.bot_score}%</strong><br>
              Follower: <strong>${d.followers.toLocaleString('id-ID')}</strong>
            </div>`;
          } else if (params.dataType === 'edge') {
            return `<div style="font-size:0.72rem;">${params.data.source} ➔ ${params.data.target}<br/>Relasi: <strong>${params.data.relation}</strong></div>`;
          }
        }
      },
      legend: [
        {
          data: snaData.categories.map((c) => c.name),
          textStyle: { color: '#94a3b8', fontSize: 10 },
          top: 6,
          left: 10
        }
      ],
      series: [
        {
          name: 'Regional SNA',
          type: 'graph',
          layout: 'force',
          data: snaData.nodes,
          links: snaData.links,
          categories: snaData.categories,
          roam: true,
          label: {
            show: true,
            position: 'right',
            formatter: (params) => params.data.label || params.data.name,
            color: '#0f172a',
            fontSize: 10
          },
          labelLayout: {
            hideOverlap: true
          },
          force: {
            repulsion: 320,
            gravity: 0.08,
            edgeLength: [80, 200],
            friction: 0.6
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [4, 8],
          lineStyle: {
            color: 'source',
            curveness: 0.12,
            opacity: 0.7
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3
            }
          }
        }
      ]
    };

    this.snaChart.setOption(option, true);
    setTimeout(() => {
      if (this.snaChart) this.snaChart.resize();
    }, 50);
  }

  async loadRegionalNews(provName) {
    const listContainer = document.getElementById('main-geo-news-feed-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<div style="font-size: 0.75rem; color: var(--color-text-muted);">Memuat crawling berita lokal...</div>';

    try {
      let newsList = [];
      try {
        const res = await ApiService.getRegionalNews(provName);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          newsList = res.data;
        }
      } catch (e) {
        console.warn('Gagal memuat berita regional dari API, fallback ke master dataset:', e);
      }

      if (!newsList || newsList.length === 0) {
        newsList = REGIONAL_NEWS_38[provName] || REGIONAL_NEWS_38['DKI JAKARTA'] || [];
      }

      const tabNewsBtn = document.getElementById('main-btn-tab-news');
      if (tabNewsBtn) {
        tabNewsBtn.innerHTML = `<i class="fa-solid fa-newspaper text-cyan"></i> 2. BERITA WILAYAH (${newsList.length})`;
      }

      if (newsList.length === 0) {
        listContainer.innerHTML = `
          <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.75rem;">
            Tidak ada isu kontroversial di media massa lokal terverifikasi untuk wilayah ${provName}.
          </div>
        `;
        return;
      }

      listContainer.innerHTML = newsList
        .map(
          (n) => `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.68rem; color: var(--color-cyan); font-weight: 700; text-transform: uppercase;">
              <i class="fa-regular fa-newspaper"></i> ${escapeHtml(n.source)}
            </span>
            <span style="font-size: 0.65rem; color: var(--color-text-muted); font-family: var(--font-mono);">
              ${escapeHtml(n.published_at)}
            </span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 600; color: #0f172a;">
            ${escapeHtml(n.title)}
          </div>
          <div style="background: #f0fdf4; border: 1px solid #dcfce7; border-left: 3px solid #10b981; padding: 6px 10px; font-size: 0.7rem; color: #166534;">
            <div style="color: #10b981; font-weight: 700; font-size: 0.65rem; margin-bottom: 2px;">
              <i class="fa-solid fa-check-circle"></i> VERIFIKASI FAKTA VS NARRATIVE MEDSOS:
            </div>
            ${escapeHtml(n.fact_check_note)}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="tag-badge ${n.buzzer_correlation === 'AUTHENTIC_NEWS' ? 'valid' : 'bot'}" style="font-size: 0.62rem;">
                ${escapeHtml(n.buzzer_correlation)}
              </span>
              ${n.ethical_scraping ? `<span class="tag-badge valid" style="font-size: 0.58rem;"><i class="fa-solid fa-robot"></i> ROBOTS.TXT: ${escapeHtml(n.ethical_scraping.robots_status)}</span>` : ''}
            </div>
            <a href="${n.portal_url || n.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.7rem; color: var(--color-cyan); text-decoration: none;">
              Buka Berita Asli <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      `
        )
        .join('');
    } catch (e) {
      console.warn('Gagal memuat berita regional:', e);
      listContainer.innerHTML = '<div style="color: #ef4444; font-size: 0.75rem;">Gagal memuat berita regional.</div>';
    }
  }

  flyToLocation(lon, lat, zoom = 4.2) {
    if (!this.mapChart) return;
    this.mapChart.setOption({
      geo: {
        center: [lon, lat],
        zoom: zoom
      }
    });
  }

  async loadSocialFeeds() {
    const listContainer = document.getElementById('main-geo-social-feed-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<div style="font-size: 0.75rem; color: var(--color-text-muted);">Menarik data postingan buzzer...</div>';

    try {
      let feeds = [];
      try {
        const res = await ApiService.getGeoSocialFeeds(this.selectedPlatform, this.selectedProvince);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          feeds = res.data;
        }
      } catch (e) {
        console.warn('Gagal memuat feeds medsos dari API, fallback ke master dataset:', e);
      }

      if (!feeds || feeds.length === 0) {
        const provFeeds = SOCIAL_FEEDS_BY_PROVINCE[this.selectedProvince] || SOCIAL_FEEDS_BY_PROVINCE['ALL'] || [];
        if (this.selectedPlatform !== 'all') {
          feeds = provFeeds.filter(f => f.platform && f.platform.toUpperCase() === this.selectedPlatform.toUpperCase());
        } else {
          feeds = provFeeds;
        }
      }

      const countBadge = document.getElementById('main-geo-social-count-badge');
      if (countBadge) countBadge.textContent = `${feeds.length} POSTS TERKUTIP`;

      const tabCountBadge = document.getElementById('main-tab-social-count-badge');
      if (tabCountBadge) tabCountBadge.textContent = `${feeds.length} POSTS`;

      if (feeds.length === 0) {
        listContainer.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.75rem;">
            Tidak ada postingan scraper medsos aktif untuk filter ini.
          </div>
        `;
        return;
      }

      // 2. Deteksi Sumber Utama (Patient Zero / Ground Zero)
      const gzFeed = feeds.find((f) => f.is_ground_zero) || feeds[0];

      let gzBannerHtml = '';
      if (gzFeed) {
        gzBannerHtml = `
          <div style="grid-column: 1 / -1; background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 22, 34, 0.95)); border: 1.5px solid #f59e0b; border-radius: 6px; padding: 12px; margin-bottom: 6px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.72rem; color: #f59e0b; font-weight: 800; display: flex; align-items: center; gap: 6px; letter-spacing: 0.5px;">
                <i class="fa-solid fa-bullseye fa-fade"></i> DETEKSI SUMBER POSTINGAN UTAMA (GROUND ZERO)
              </span>
              <span class="tag-badge" style="border-color: #f59e0b; color: #f59e0b; font-size: 0.62rem; font-weight: 700;">
                PATIENT ZERO
              </span>
            </div>
            
            <div style="font-size: 0.75rem; color: #fff;">
              Akun <strong>${gzFeed.author_name}</strong> (<span style="color: var(--color-cyan); font-family: var(--font-mono);">${gzFeed.author_handle}</span>) terdeteksi sebagai <u>penyebar pertama narasi ini</u> pada:
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.68rem;">
              <div style="color: #f59e0b; font-weight: 700;">
                <i class="fa-solid fa-clock"></i> ${gzFeed.date_time_release || gzFeed.timestamp}
              </div>
              <div style="color: #94a3b8;">
                Delta: <strong style="color: #38bdf8;">T+00m00s (ORIGIN)</strong>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: #cbd5e1; margin-top: 2px;">
              <span>
                <i class="fa-solid fa-location-crosshairs text-cyan"></i> Geotag: <strong>${gzFeed.geolocation?.city || gzFeed.city}</strong> [${gzFeed.geolocation?.latitude || 0}, ${gzFeed.geolocation?.longitude || 0}]
              </span>
              <button class="btn-focus-map" data-lon="${gzFeed.geolocation?.longitude || 0}" data-lat="${gzFeed.geolocation?.latitude || 0}" style="background: rgba(0,229,255,0.15); border: 1px solid var(--color-cyan); color: var(--color-cyan); padding: 3px 8px; border-radius: 3px; font-size: 0.65rem; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                <i class="fa-solid fa-magnifying-glass-location"></i> Fokuskan Peta
              </button>
            </div>
          </div>
        `;
      }

      const cardsHtml = feeds.map((f) => this.renderPostCardHtml(f, false)).join('');
      listContainer.innerHTML = gzBannerHtml + cardsHtml;

      // Bind listener ke tombol fokus peta
      listContainer.querySelectorAll('.btn-focus-map').forEach((btn) => {
        btn.onclick = () => {
          const lon = parseFloat(btn.dataset.lon);
          const lat = parseFloat(btn.dataset.lat);
          if (lon && lat) {
            this.switchMainView('map');
            this.flyToLocation(lon, lat, 4.5);
          }
        };
      });
    } catch (e) {
      console.warn('Gagal memuat feeds medsos:', e);
      listContainer.innerHTML = '<div style="color: #ef4444; font-size: 0.75rem;">Gagal memuat postingan medsos.</div>';
    }
  }

  renderPostCardHtml(f, isNewLive = false) {
    const platformIcon =
      f.platform === 'X'
        ? 'fa-brands fa-x-twitter'
        : f.platform === 'INSTAGRAM'
        ? 'fa-brands fa-instagram text-purple'
        : 'fa-brands fa-facebook text-cyan';

    const threatColor = f.threat_level === 'HIGH' ? '#ef4444' : '#f59e0b';
    const isGz = f.is_ground_zero;
    const highlightAnim = isNewLive ? 'animation: bounceIn 0.4s ease; border-color: var(--color-cyan) !important;' : '';

    return `
    <div class="geo-social-card" style="background: ${isGz ? '#fffbeb' : '#ffffff'}; border: 1px solid ${isGz ? '#f59e0b' : '#e2e8f0'}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 8px; ${highlightAnim}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 28px; height: 28px; border-radius: 4px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
            <i class="${platformIcon}"></i>
          </div>
          <div>
            <div style="font-weight: 700; color: #0f172a; font-size: 0.78rem;">
              ${escapeHtml(f.author_name || f.author || 'Pengguna Medsos')} <span style="color: var(--color-text-muted); font-weight: normal;">${escapeHtml(f.author_handle || f.handle || '@unknown')}</span>
              ${isGz ? '<span class="tag-badge" style="border-color:#f59e0b; color:#f59e0b; font-size:0.58rem; margin-left:4px;">🎯 GROUND ZERO</span>' : ''}
              ${f.is_live_scraped ? '<span class="tag-badge valid" style="font-size:0.58rem; margin-left:4px;"><i class="fa-solid fa-satellite-dish"></i> DATA ASLI (LIVE SCRAPED)</span>' : ''}
              ${isNewLive ? '<span class="tag-badge valid" style="font-size:0.58rem; margin-left:4px; border-color:var(--color-cyan); color:var(--color-cyan);"><i class="fa-solid fa-bolt fa-fade"></i> LIVE TELEMETRI</span>' : ''}
            </div>
            <div style="font-size: 0.65rem; color: var(--color-text-muted);">
              ${escapeHtml(f.city || f.province || 'Indonesia')}, ${escapeHtml(f.province || 'Wilayah')} &bull; <strong style="color: var(--color-cyan);">${(f.followers || 0).toLocaleString('id-ID')} followers</strong>
            </div>
          </div>
        </div>
        <span class="tag-badge" style="border-color: ${threatColor}; color: ${threatColor}; font-size: 0.62rem;">
          BOT: ${f.bot_score || 0}%
        </span>
      </div>

      <!-- Tanggal & Waktu Rilis (Deteksi Sumber Utama) -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 5px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.65rem;">
        <span style="color: ${isGz ? '#f59e0b' : '#38bdf8'}; font-weight: 700;">
          <i class="fa-solid fa-clock"></i> Rilis: ${escapeHtml(f.date_time_release || f.timestamp || 'Baru Saja')}
        </span>
        <span style="color: ${isGz ? '#f59e0b' : '#94a3b8'}; font-size: 0.62rem;">
          ${escapeHtml(f.time_delta || f.time_delta_label || 'T+0m')}
        </span>
      </div>

      <!-- Konten Postingan -->
      <div style="font-size: 0.75rem; color: #334155; line-height: 1.4;">
        ${escapeHtml(f.content || '')}
      </div>

      <!-- 3. FORENSIK GEOLOKASI (GPS Coordinates & BTS) -->
      <div style="background: rgba(0, 229, 255, 0.04); border: 1px dashed rgba(0, 229, 255, 0.25); border-radius: 4px; padding: 6px 8px; font-size: 0.66rem; display: flex; flex-direction: column; gap: 3px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--color-cyan); font-weight: 700;">
            <i class="fa-solid fa-location-dot"></i> KOORDINAT: ${f.geolocation?.latitude ?? '-'}, ${f.geolocation?.longitude ?? '-'}
          </span>
          ${f.geolocation?.latitude ? `
          <button class="btn-focus-map" data-lon="${f.geolocation?.longitude || 0}" data-lat="${f.geolocation?.latitude || 0}" style="background: transparent; border: 1px solid var(--color-cyan); color: var(--color-cyan); padding: 1px 6px; border-radius: 3px; font-size: 0.6rem; cursor: pointer;">
            <i class="fa-solid fa-crosshairs"></i> Lihat di Peta
          </button>` : ''}
        </div>
        <div style="color: #94a3b8; font-size: 0.62rem; display: flex; flex-direction: column; gap: 1px;">
          <div><i class="fa-solid fa-tower-broadcast"></i> ${f.geolocation?.cell_tower || f.geolocation?.bts_tower || 'BTS Tower Regional'}</div>
          <div><i class="fa-solid fa-mobile-screen"></i> ${f.geolocation?.device || f.geolocation?.network_type || 'Mobile 4G/5G Network'} (Radius: ${f.geolocation?.accuracy_radius || '±30m'})</div>
        </div>
      </div>

      <!-- Footer Engagement & Tagar -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: var(--color-text-muted); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px;">
        <span style="color: #38bdf8; font-weight: 600;">
          ${(f.original_post_url || f.post_url) ? `<a href="${escapeHtml(f.original_post_url || f.post_url)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-cyan); text-decoration: underline;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Sumber Asli</a>` : escapeHtml(f.narrative || 'Isu Publik')}
        </span>
        <div style="display: flex; gap: 10px; font-family: var(--font-mono);">
          <span><i class="fa-solid fa-repeat"></i> ${f.retweets_shares || f.retweets || 0}</span>
          <span><i class="fa-regular fa-heart"></i> ${f.likes || 0}</span>
        </div>
      </div>
    </div>
    `;
  }

  handleIncomingTelemetryPost(post) {
    if (!post) return;

    // 1. Radar Map Pulse di provinsi/wilayah terkait
    const targetProv = post.province || post.city;
    if (targetProv) {
      this.triggerMapPulse(targetProv);
    }

    // 2. Prepend langsung jika mode auto-stream aktif & tidak dijeda, atau tampung di banner jika manual / paused
    if (this.autoStreamEnabled && this.streamPaceMode !== 'PAUSED') {
      this.prependSocialPost(post, true);
    } else {
      this.pendingIncomingPosts.unshift(post);
      this.updatePendingBanner();
    }
  }

  updatePendingBanner() {
    const banner = document.getElementById('main-geo-new-posts-banner');
    const textEl = document.getElementById('main-geo-new-posts-text');
    const tabCountBadge = document.getElementById('main-tab-social-count-badge');
    if (!banner || !textEl) return;

    const count = this.pendingIncomingPosts.length;
    if (count > 0) {
      textEl.innerHTML = `⚡ <strong>${count} Postingan Baru Masuk</strong>`;
      banner.style.display = 'flex';
      if (tabCountBadge) {
        tabCountBadge.textContent = `+${count} BARU`;
        tabCountBadge.className = 'tag-badge warning';
      }
    } else {
      banner.style.display = 'none';
      if (tabCountBadge) {
        tabCountBadge.className = 'tag-badge';
      }
    }
  }

  flushPendingPosts() {
    if (this.pendingIncomingPosts.length === 0) return;
    const postsToPrepend = [...this.pendingIncomingPosts].reverse();
    this.pendingIncomingPosts = [];
    this.updatePendingBanner();

    postsToPrepend.forEach((p) => {
      this.prependSocialPost(p, true);
    });
  }

  prependSocialPost(post, isNewLive = false) {
    const listContainer = document.getElementById('main-geo-social-feed-list');
    if (!listContainer) return;

    // Hapus placeholder teks jika ada
    const emptyNotice = listContainer.querySelector('div[style*="text-align: center"]');
    if (emptyNotice) {
      emptyNotice.remove();
    }

    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.renderPostCardHtml(post, isNewLive).trim();
    const cardEl = tempWrapper.firstElementChild;
    if (!cardEl) return;

    // Temukan apakah ada gzBanner di urutan pertama
    const gzBanner = listContainer.querySelector('div[style*="PATIENT ZERO"]')?.parentElement;
    if (gzBanner && gzBanner.nextSibling) {
      listContainer.insertBefore(cardEl, gzBanner.nextSibling);
    } else if (listContainer.firstChild) {
      listContainer.insertBefore(cardEl, listContainer.firstChild);
    } else {
      listContainer.appendChild(cardEl);
    }

    // Bind listener tombol fokus peta pada card baru
    const focusBtn = cardEl.querySelector('.btn-focus-map');
    if (focusBtn) {
      focusBtn.onclick = () => {
        const lon = parseFloat(focusBtn.dataset.lon);
        const lat = parseFloat(focusBtn.dataset.lat);
        if (lon && lat) {
          this.switchMainView('map');
          this.flyToLocation(lon, lat, 4.5);
        }
      };
    }

    // Update jumlah post badge
    const countBadge = document.getElementById('main-geo-social-count-badge');
    const existingCards = listContainer.querySelectorAll('.geo-social-card');
    if (countBadge) {
      countBadge.textContent = `${existingCards.length} POSTS TERKUTIP`;
    }
    const tabCountBadge = document.getElementById('main-tab-social-count-badge');
    if (tabCountBadge && this.pendingIncomingPosts.length === 0) {
      tabCountBadge.textContent = `${existingCards.length} POSTS`;
    }

    // Batasi card agar tidak membuat browser lambat (max 40 cards)
    if (existingCards.length > 40) {
      const lastCard = existingCards[existingCards.length - 1];
      if (lastCard) lastCard.remove();
    }
  }

  triggerMapPulse(provinceName) {
    if (!provinceName) return;

    // Visual pulse pada brief bar di bawah peta
    const briefBar = document.querySelector('.geo-brief-prov-bar');
    if (briefBar) {
      briefBar.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.8), inset 0 0 10px rgba(0, 229, 255, 0.3)';
      briefBar.style.borderColor = 'var(--color-cyan)';
      setTimeout(() => {
        briefBar.style.boxShadow = '';
        briefBar.style.borderColor = '';
      }, 1400);
    }

    // Jika peta ECharts siap, temukan node buzzer terkait dan picu highlight sementara
    if (this.mapChart && this.buzzerData && this.buzzerData.length > 0) {
      const pUpper = provinceName.toUpperCase();
      const targetIdx = this.buzzerData.findIndex(
        (b) => (b.province && b.province.toUpperCase().includes(pUpper)) || (b.city && b.city.toUpperCase().includes(pUpper))
      );

      if (targetIdx !== -1) {
        try {
          this.mapChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: targetIdx
          });
          setTimeout(() => {
            this.mapChart.dispatchAction({
              type: 'hideTip'
            });
          }, 2000);
        } catch (_) {}
      }
    }
  }

  resize() {
    const mapContainer = document.getElementById('main-indonesia-map-chart');
    if (mapContainer && mapContainer.clientWidth > 0) {
      if (!this.mapChart) {
        this.mapChart = echarts.init(mapContainer);
        this.renderMap();
      } else {
        this.mapChart.resize();
      }
    }

    const snaContainer = document.getElementById('main-geo-sna-chart-container');
    if (snaContainer && snaContainer.clientWidth > 0) {
      if (!this.snaChart && this.lastSnaData) {
        this.renderSnaGraph(this.lastSnaData);
      } else if (this.snaChart) {
        this.snaChart.resize();
      }
    }
  }

  formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  }
}


export { GeoBuzzerView as PetaSebaranBuzzerView };
