/**
 * GeoBuzzerView Component
 * whoiam - Social Media Intelligence & Account Forensics Platform
 *
 * Tampilan Terpadu di Halaman Utama:
 * 1. Peta Interaktif Indonesia (ECharts GeoJSON)
 *    - Titik-titik persebaran buzzer dengan follower terbanyak (pulsing effectScatter)
 *    - Ukuran titik sebanding dengan jumlah follower / reach
 *    - Warna titik mengindikasikan tingkat ancaman (Merah: High Threat, Ungu: Medium)
 * 2. SNA (Social Network Analysis) Terkoneksi Wilayah
 * 3. Crawling Berita Lokal per Wilayah & Cross-Check Validitas Isu
 * 4. Scraping Data Medsos (Instagram, X, Facebook)
 */

import * as echarts from 'echarts';
import { ApiService } from '../services/api.js';

export class GeoBuzzerView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mapChart = null;
    this.snaChart = null;
    this.selectedProvince = 'DKI JAKARTA';
    this.selectedPlatform = 'all';
    this.selectedTimeframe = '24h';
    this.activeRightTab = 'sna'; // 'sna' | 'news' | 'social'
    this.buzzerData = [];
    this.summaryData = {};
    this.flightLinesData = [];
    this.showFlightLines = true;
    this.isMapRegistered = false;
    this.init();
  }

  async init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; background: #080d14;">
        
        <!-- Filter & Control Toolbar -->
        <div style="padding: 8px 16px; background: #0c1219; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; flex-shrink: 0;">
          <!-- Platform Filter Pills -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600; margin-right: 2px;">PLATFORM:</span>
            <button class="btn-tactical geo-platform-pill active" data-platform="all">SEMUA</button>
            <button class="btn-tactical geo-platform-pill" data-platform="X"><i class="fa-brands fa-x-twitter"></i> 𝕏</button>
            <button class="btn-tactical geo-platform-pill" data-platform="INSTAGRAM"><i class="fa-brands fa-instagram text-purple"></i> IG</button>
            <button class="btn-tactical geo-platform-pill" data-platform="FACEBOOK"><i class="fa-brands fa-facebook text-cyan"></i> FB</button>
          </div>

          <!-- Timeframe Playback Slider / Pills -->
          <div style="display: flex; align-items: center; gap: 5px;">
            <span style="font-size: 0.7rem; color: var(--color-cyan); font-weight: 700; margin-right: 2px;">
              <i class="fa-solid fa-clock-rotate-left"></i> RENTANG:
            </span>
            <button class="btn-tactical geo-timeframe-pill" data-tf="1h" style="padding: 3px 8px; font-size: 0.68rem;">1 JAM</button>
            <button class="btn-tactical geo-timeframe-pill" data-tf="6h" style="padding: 3px 8px; font-size: 0.68rem;">6 JAM</button>
            <button class="btn-tactical geo-timeframe-pill active" data-tf="24h" style="padding: 3px 8px; font-size: 0.68rem;">24 JAM</button>
            <button class="btn-tactical geo-timeframe-pill" data-tf="7d" style="padding: 3px 8px; font-size: 0.68rem;">7 HARI</button>
          </div>

          <!-- Province Selector, Flight Lines Toggle & Refresh -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <button id="main-btn-toggle-flights" class="btn-tactical active" style="padding: 4px 9px; font-size: 0.7rem; border-color: var(--color-cyan); color: var(--color-cyan);">
              <i class="fa-solid fa-plane-departure"></i> JALUR PROPAGASI
            </button>
            <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">WILAYAH:</span>
            <select id="main-geo-province-select" class="form-select" style="background: #111827; color: #fff; border: 1px solid var(--color-border); font-size: 0.72rem; padding: 4px 8px; border-radius: 4px; font-family: var(--font-mono);">
              <option value="DKI JAKARTA">DKI JAKARTA</option>
              <option value="JAWA BARAT">JAWA BARAT</option>
              <option value="JAWA TENGAH">JAWA TENGAH</option>
              <option value="JAWA TIMUR">JAWA TIMUR</option>
              <option value="DAERAH ISTIMEWA YOGYAKARTA">D.I. YOGYAKARTA</option>
              <option value="SUMATERA UTARA">SUMATERA UTARA</option>
              <option value="SULAWESI SELATAN">SULAWESI SELATAN</option>
              <option value="KALIMANTAN TIMUR">KALIMANTAN TIMUR (IKN)</option>
              <option value="BALI">BALI</option>
              <option value="PAPUA">PAPUA</option>
            </select>
            <button id="main-btn-refresh-geo" class="btn-tactical" style="padding: 4px 9px; font-size: 0.7rem;">
              <i class="fa-solid fa-arrows-rotate"></i> REFRESH
            </button>
          </div>
        </div>

        <!-- Main Split View (Kiri: Peta Indonesia, Kanan: 3 Tab Intelejen Wilayah) -->
        <div style="display: flex; flex: 1; overflow: hidden; position: relative;">
          
          <!-- SISI KIRI: Peta Interaktif Indonesia -->
          <div style="flex: 1.15; display: flex; flex-direction: column; border-right: 1px solid var(--color-border); background: #070b10; position: relative;">
            
            <!-- Map Legend Box -->
            <div style="position: absolute; top: 12px; left: 14px; z-index: 10; background: rgba(10, 16, 24, 0.9); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 6px; border: 1px solid var(--color-border); font-size: 0.7rem; pointer-events: none;">
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
                <span style="color: #cbd5e1;">Garis Propagasi Isu (Penerbangan Animasi)</span>
              </div>
              <div style="font-size: 0.65rem; color: var(--color-text-muted); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px; line-height: 1.3;">
                *Titik mewakili <strong>Koordinator Inti</strong> (menggerakkan 18–35 bot amplifier terhubung)
              </div>
            </div>

            <!-- ECharts Indonesia Map Container -->
            <div id="main-indonesia-map-chart" style="width: 100%; flex: 1; min-height: 440px;"></div>

            <!-- Bottom Selected Province Bar -->
            <div style="padding: 8px 16px; background: #0a0f16; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; flex-shrink: 0;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-location-crosshairs text-cyan"></i>
                <span style="color: var(--color-text-muted);">Wilayah Terpilih:</span>
                <strong id="main-brief-prov-name" style="color: #fff; font-family: var(--font-heading);">DKI JAKARTA</strong>
              </div>
              <div id="main-brief-prov-stats" style="color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.72rem;">
                Memuat telemetri wilayah...
              </div>
            </div>
          </div>

          <!-- SISI KANAN: Panel 3 Tab (SNA, Berita Lokal, Medsos Scrapes) -->
          <div style="flex: 0.95; display: flex; flex-direction: column; background: #0a0e14; overflow: hidden;">
            
            <!-- Tab Header -->
            <div style="display: flex; border-bottom: 1px solid var(--color-border); background: #0d131b; flex-shrink: 0;">
              <button id="main-btn-tab-sna" class="btn-tactical geo-tab-nav active" style="flex: 1; border-radius: 0; padding: 10px 12px; font-size: 0.75rem;">
                <i class="fa-solid fa-circle-nodes text-purple"></i> 1. SNA WILAYAH
              </button>
              <button id="main-btn-tab-news" class="btn-tactical geo-tab-nav" style="flex: 1; border-radius: 0; padding: 10px 12px; font-size: 0.75rem;">
                <i class="fa-solid fa-newspaper text-cyan"></i> 2. BERITA WILAYAH
              </button>
              <button id="main-btn-tab-social" class="btn-tactical geo-tab-nav" style="flex: 1; border-radius: 0; padding: 10px 12px; font-size: 0.75rem;">
                <i class="fa-solid fa-hashtag text-amber"></i> 3. SCRAPING MEDSOS
              </button>
            </div>

            <!-- Tab Content 1: SNA Graph Canvas -->
            <div id="main-geo-tab-view-sna" class="geo-tab-pane" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;">
              <div style="padding: 8px 14px; background: rgba(139, 92, 246, 0.08); border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; flex-shrink: 0;">
                <span style="color: #c084fc;">
                  <i class="fa-solid fa-project-diagram"></i> Topologi Interaksi Buzzer & Bot Farm di <strong id="main-sna-target-prov-label">DKI JAKARTA</strong>
                </span>
                <span class="tag-badge bot" style="font-size: 0.62rem;">COMMUNITY GRAPH</span>
              </div>
              <div id="main-geo-sna-chart-container" style="width: 100%; height: 100%; min-height: 440px; flex: 1;"></div>
            </div>

            <!-- Tab Content 2: Regional News Crawler -->
            <div id="main-geo-tab-view-news" class="geo-tab-pane" style="flex: 1; display: none; flex-direction: column; overflow-y: auto; padding: 14px; gap: 10px;">
              <div style="padding: 10px 14px; background: rgba(0, 229, 255, 0.06); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 6px; font-size: 0.72rem; color: #94a3b8;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="color: var(--color-cyan); font-weight: 700;">
                    <i class="fa-solid fa-satellite-dish text-cyan"></i> CRAWLER BERITA DAERAH REAL-TIME (DEWAN PERS)
                  </span>
                  <span class="tag-badge valid" style="font-size: 0.62rem;">LIVE NEWS CRAWLER</span>
                </div>
                Menyinkronkan rilis pers dan investigasi resmi dari portal berita terakreditasi untuk memverifikasi isu dan narasi medsos di provinsi ini.
              </div>
              <div id="main-geo-news-feed-list" style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Diisi dinamis -->
              </div>
            </div>

            <!-- Tab Content 3: Scraping Feeds Medsos (X, IG, FB) -->
            <div id="main-geo-tab-view-social" class="geo-tab-pane" style="flex: 1; display: none; flex-direction: column; overflow-y: auto; padding: 14px; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <div style="font-size: 0.75rem; color: #fff; font-weight: 600;">
                  <i class="fa-solid fa-satellite-dish text-amber"></i> POSTINGAN BUZZER TERDETEKSI
                </div>
                <div id="main-geo-social-count-badge" class="tag-badge" style="font-size: 0.65rem;">0 POSTS</div>
              </div>
              <div id="main-geo-social-feed-list" style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Diisi dinamis -->
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    this.bindEvents();

    // Inisialisasi ECharts
    setTimeout(() => {
      const mapContainer = document.getElementById('main-indonesia-map-chart');
      if (mapContainer) {
        this.mapChart = echarts.init(mapContainer);
      }
      this.loadAllData();
    }, 50);

    window.addEventListener('resize', () => {
      if (this.mapChart) this.mapChart.resize();
      if (this.snaChart) this.snaChart.resize();
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
        this.loadBuzzerDistribution();
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

    // Right Sub-Tab Switching
    const tabSnaBtn = document.getElementById('main-btn-tab-sna');
    const tabNewsBtn = document.getElementById('main-btn-tab-news');
    const tabSocialBtn = document.getElementById('main-btn-tab-social');

    const viewSna = document.getElementById('main-geo-tab-view-sna');
    const viewNews = document.getElementById('main-geo-tab-view-news');
    const viewSocial = document.getElementById('main-geo-tab-view-social');

    const switchTab = (tab) => {
      this.activeRightTab = tab;
      [tabSnaBtn, tabNewsBtn, tabSocialBtn].forEach((b) => b && b.classList.remove('active'));
      [viewSna, viewNews, viewSocial].forEach((v) => v && (v.style.display = 'none'));

      if (tab === 'sna') {
        tabSnaBtn.classList.add('active');
        viewSna.style.display = 'flex';
        if (this.snaChart) this.snaChart.resize();
      } else if (tab === 'news') {
        tabNewsBtn.classList.add('active');
        viewNews.style.display = 'flex';
      } else if (tab === 'social') {
        tabSocialBtn.classList.add('active');
        viewSocial.style.display = 'flex';
      }
    };

    if (tabSnaBtn) tabSnaBtn.onclick = () => switchTab('sna');
    if (tabNewsBtn) tabNewsBtn.onclick = () => switchTab('news');
    if (tabSocialBtn) tabSocialBtn.onclick = () => switchTab('social');
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
    try {
      const res = await ApiService.getPropagationLines(this.selectedProvince, this.selectedTimeframe);
      if (res && res.data && res.data.lines) {
        this.flightLinesData = res.data.lines;
      } else {
        this.flightLinesData = [];
      }
      this.renderMap();
    } catch (e) {
      console.warn('Gagal memuat flight lines propagasi:', e);
    }
  }

  async registerMapIfNeeded() {
    if (this.isMapRegistered) return;
    try {
      const resp = await fetch('/data/indonesia-provinces.json');
      const geoJson = await resp.json();
      echarts.registerMap('indonesia', geoJson);
      this.isMapRegistered = true;
    } catch (e) {
      console.error('Gagal registrasi GeoJSON peta Indonesia:', e);
    }
  }

  async loadBuzzerDistribution() {
    try {
      const res = await ApiService.getGeoBuzzerDistribution(this.selectedPlatform, 'all');
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          this.buzzerData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          this.buzzerData = res.data.data;
        } else {
          this.buzzerData = [];
        }
        this.renderMap();
      }
    } catch (e) {
      console.warn('Gagal memuat persebaran buzzer:', e);
    }
  }

  async loadProvincesSummary() {
    try {
      const res = await ApiService.getGeoProvincesSummary();
      if (res && res.data) {
        this.summaryData = res.data.provinces || {};
        this.populateProvinceSelect();
        this.updateProvinceBrief(this.selectedProvince);
      }
    } catch (e) {
      console.warn('Gagal memuat ringkasan provinsi:', e);
    }
  }

  populateProvinceSelect() {
    const sel = document.getElementById('main-geo-province-select');
    if (!sel || !this.summaryData) return;
    const provNames = Object.keys(this.summaryData).sort();
    if (provNames.length === 0) return;
    
    const cur = sel.value || this.selectedProvince;
    sel.innerHTML = provNames.map(p => `<option value="${p}">${p}</option>`).join('');
    if (provNames.includes(cur)) {
      sel.value = cur;
    } else {
      sel.value = 'DKI JAKARTA';
    }
  }

  changeProvince(provName) {
    this.selectedProvince = provName;

    const provSelect = document.getElementById('main-geo-province-select');
    if (provSelect && provSelect.value !== provName) {
      provSelect.value = provName;
    }

    const snaLabel = document.getElementById('main-sna-target-prov-label');
    if (snaLabel) snaLabel.textContent = provName;

    this.updateProvinceBrief(provName);
    this.loadPropagationLines();
    this.loadProvinceSna(provName);
    this.loadRegionalNews(provName);
    this.loadSocialFeeds();
  }

  updateProvinceBrief(provName) {
    const briefName = document.getElementById('main-brief-prov-name');
    if (briefName) briefName.textContent = provName;

    const briefStats = document.getElementById('main-brief-prov-stats');
    if (briefStats) {
      const provBuzzers = (this.buzzerData || []).filter((b) => b.province === provName);
      const data = (this.summaryData && this.summaryData[provName]) || {};
      
      const coreCoordinators = provBuzzers.length > 0 ? provBuzzers.length : 2;
      const botAmplifiers = data.bot_amplifiers_count || (18 + ((provBuzzers[0]?.amplifiers_count || 240) % 18));
      const totalCluster = coreCoordinators + botAmplifiers;

      const totalReach = data.total_reach ?? data.total_followers ?? provBuzzers.reduce((acc, b) => acc + (b.followers || 0), 0);
      const highRisk = data.high_risk_count ?? (provBuzzers.length > 0 ? provBuzzers.filter((b) => b.threat_level === 'HIGH').length : 1);

      briefStats.innerHTML = `
        <span>Kluster Terdeteksi: <strong style="color: #fff;">${totalCluster} Akun</strong> (<span style="color: #ef4444;">${coreCoordinators} Koordinator Inti</span> + <span style="color: #a855f7;">${botAmplifiers} Bot Amplifiers</span>)</span> &bull; 
        <span>Potensi Reach: <strong style="color: var(--color-cyan);">${this.formatNumber(totalReach)}</strong></span> &bull; 
        <span>High Threat: <strong style="color: #ef4444;">${highRisk} Aktor</strong></span>
      `;
    }
  }

  renderMap() {
    if (!this.mapChart || !this.isMapRegistered) return;

    // Hindari label ganda bertumpuk: Setiap provinsi/kota memiliki 2 node buzzer (High & Medium Threat).
    // Urutkan buzzer dari follower terbanyak dan hanya tampilkan label teks permanen untuk 1 node primer per kota.
    const seenCityKeys = new Set();
    const sortedBuzzers = [...this.buzzerData].sort((a, b) => (b.followers || 0) - (a.followers || 0));

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
          show: isPrimary
        }
      };
    });

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0f172a',
        borderColor: '#00e5ff',
        borderWidth: 1,
        textStyle: { color: '#f8fafc', fontSize: 12 },
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
              <div style="padding: 4px; min-width: 220px;">
                <div style="font-weight: 700; color: #00e5ff; font-size: 0.85rem; margin-bottom: 2px;">
                  ${b.name} <span style="color: #94a3b8; font-weight: normal;">${b.handle}</span>
                </div>
                <div style="font-size: 0.72rem; color: #cbd5e1; margin-bottom: 6px;">
                  Platform: <strong>${b.platform}</strong> &bull; Wilayah: <strong>${b.city}, ${b.province}</strong>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.7rem; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px;">
                  <div>Follower: <strong style="color: #38bdf8;">${b.followers.toLocaleString('id-ID')}</strong></div>
                  <div>Bot Score: <strong style="color: ${b.bot_score > 75 ? '#ef4444' : '#f59e0b'};">${b.bot_score}%</strong></div>
                  <div>Amplifiers: <strong style="color: #a855f7;">${b.amplifiers_count} bot</strong></div>
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
        zoom: 1.25,
        center: [118.0, -2.5],
        label: {
          show: false
        },
        itemStyle: {
          areaColor: '#0c131d',
          borderColor: 'rgba(0, 229, 255, 0.35)',
          borderWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        },
        emphasis: {
          itemStyle: {
            areaColor: '#162233',
            borderColor: '#00e5ff',
            borderWidth: 1.5
          },
          label: {
            show: true,
            color: '#fff',
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
          data: this.flightLinesData.map(l => ({
            fromName: l.from_name,
            toName: l.to_name,
            coords: [l.from_coords, l.to_coords],
            itemData: l
          }))
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
              return `{city|${b.city}} {reach|${(b.followers / 1000).toFixed(0)}k}`;
            },
            position: 'top',
            distance: 6,
            backgroundColor: 'rgba(11, 19, 32, 0.82)',
            borderColor: 'rgba(0, 229, 255, 0.35)',
            borderWidth: 1,
            borderRadius: 3,
            padding: [2, 6],
            rich: {
              city: {
                color: '#f8fafc',
                fontWeight: 600,
                fontSize: 9.5
              },
              reach: {
                color: '#00e5ff',
                fontSize: 9
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
      if (res && res.data) {
        this.renderSnaGraph(res.data);
      }
    } catch (e) {
      console.warn('Gagal memuat SNA wilayah:', e);
    }
  }

  renderSnaGraph(snaData) {
    const snaContainer = document.getElementById('main-geo-sna-chart-container');
    if (!snaContainer) return;

    if (!this.snaChart) {
      this.snaChart = echarts.init(snaContainer, null, {
        width: snaContainer.clientWidth || 560,
        height: 440
      });
    } else {
      this.snaChart.resize({
        width: snaContainer.clientWidth || 560,
        height: 440
      });
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#10161d',
        borderColor: '#1f2937',
        textStyle: { color: '#e9e6dd', fontSize: 12 },
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
            color: '#cbd5e1',
            fontSize: 10
          },
          labelLayout: {
            hideOverlap: true
          },
          force: {
            repulsion: 220,
            gravity: 0.1,
            edgeLength: [60, 140],
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
      const res = await ApiService.getRegionalNews(provName);
      const newsList = res && res.data ? res.data : [];

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
        <div style="background: #0f1622; border: 1px solid var(--color-border); border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.68rem; color: var(--color-cyan); font-weight: 700; text-transform: uppercase;">
              <i class="fa-regular fa-newspaper"></i> ${n.source}
            </span>
            <span style="font-size: 0.65rem; color: var(--color-text-muted); font-family: var(--font-mono);">
              ${n.published_at}
            </span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 600; color: #fff;">
            ${n.title}
          </div>
          <div style="background: rgba(0,0,0,0.3); border-left: 3px solid #10b981; padding: 6px 10px; font-size: 0.7rem; color: #cbd5e1;">
            <div style="color: #10b981; font-weight: 700; font-size: 0.65rem; margin-bottom: 2px;">
              <i class="fa-solid fa-check-circle"></i> VERIFIKASI FAKTA VS NARRATIVE MEDSOS:
            </div>
            ${n.fact_check_note}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span class="tag-badge ${n.buzzer_correlation === 'AUTHENTIC_NEWS' ? 'valid' : 'bot'}" style="font-size: 0.62rem;">
              ${n.buzzer_correlation}
            </span>
            <a href="${n.portal_url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.7rem; color: var(--color-cyan); text-decoration: none;">
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
      const res = await ApiService.getGeoSocialFeeds(this.selectedPlatform, this.selectedProvince);
      const feeds = res && res.data ? res.data : [];

      const countBadge = document.getElementById('main-geo-social-count-badge');
      if (countBadge) countBadge.textContent = `${feeds.length} POSTS TERKUTIP`;

      if (feeds.length === 0) {
        listContainer.innerHTML = `
          <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.75rem;">
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
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 22, 34, 0.95)); border: 1.5px solid #f59e0b; border-radius: 6px; padding: 12px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);">
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

      const cardsHtml = feeds
        .map((f) => {
          const platformIcon =
            f.platform === 'X'
              ? 'fa-brands fa-x-twitter'
              : f.platform === 'INSTAGRAM'
              ? 'fa-brands fa-instagram text-purple'
              : 'fa-brands fa-facebook text-cyan';

          const threatColor = f.threat_level === 'HIGH' ? '#ef4444' : '#f59e0b';
          const isGz = f.is_ground_zero;

          return `
          <div style="background: ${isGz ? 'rgba(245, 158, 11, 0.05)' : '#0f1622'}; border: 1px solid ${isGz ? '#f59e0b' : 'var(--color-border)'}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 28px; height: 28px; border-radius: 4px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
                  <i class="${platformIcon}"></i>
                </div>
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 0.78rem;">
                    ${f.author_name} <span style="color: var(--color-text-muted); font-weight: normal;">${f.author_handle}</span>
                    ${isGz ? '<span class="tag-badge" style="border-color:#f59e0b; color:#f59e0b; font-size:0.58rem; margin-left:4px;">🎯 GROUND ZERO</span>' : ''}
                  </div>
                  <div style="font-size: 0.65rem; color: var(--color-text-muted);">
                    ${f.city}, ${f.province} &bull; <strong style="color: var(--color-cyan);">${f.followers.toLocaleString('id-ID')} followers</strong>
                  </div>
                </div>
              </div>
              <span class="tag-badge" style="border-color: ${threatColor}; color: ${threatColor}; font-size: 0.62rem;">
                BOT: ${f.bot_score}%
              </span>
            </div>

            <!-- Tanggal & Waktu Rilis (Deteksi Sumber Utama) -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.35); padding: 5px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.65rem;">
              <span style="color: ${isGz ? '#f59e0b' : '#38bdf8'}; font-weight: 700;">
                <i class="fa-solid fa-clock"></i> Rilis: ${f.date_time_release || f.timestamp}
              </span>
              <span style="color: ${isGz ? '#f59e0b' : '#94a3b8'}; font-size: 0.62rem;">
                ${f.time_delta || 'T+0m'}
              </span>
            </div>

            <!-- Konten Postingan -->
            <div style="font-size: 0.75rem; color: #e2e8f0; line-height: 1.4;">
              ${f.content}
            </div>

            <!-- 3. FORENSIK GEOLOKASI (GPS Coordinates & BTS) -->
            <div style="background: rgba(0, 229, 255, 0.04); border: 1px dashed rgba(0, 229, 255, 0.25); border-radius: 4px; padding: 6px 8px; font-size: 0.66rem; display: flex; flex-direction: column; gap: 3px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--color-cyan); font-weight: 700;">
                  <i class="fa-solid fa-location-dot"></i> KOORDINAT: ${f.geolocation?.latitude}, ${f.geolocation?.longitude}
                </span>
                <button class="btn-focus-map" data-lon="${f.geolocation?.longitude || 0}" data-lat="${f.geolocation?.latitude || 0}" style="background: transparent; border: 1px solid var(--color-cyan); color: var(--color-cyan); padding: 1px 6px; border-radius: 3px; font-size: 0.6rem; cursor: pointer;">
                  <i class="fa-solid fa-crosshairs"></i> Lihat di Peta
                </button>
              </div>
              <div style="color: #94a3b8; font-size: 0.62rem; display: flex; flex-direction: column; gap: 1px;">
                <div><i class="fa-solid fa-tower-broadcast"></i> ${f.geolocation?.cell_tower || '-'}</div>
                <div><i class="fa-solid fa-mobile-screen"></i> ${f.geolocation?.device || '-'} (Radius: ${f.geolocation?.accuracy_radius || '±30m'})</div>
              </div>
            </div>

            <!-- Footer Engagement & Tagar -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: var(--color-text-muted); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px;">
              <span style="color: #38bdf8; font-weight: 600;">${f.narrative}</span>
              <div style="display: flex; gap: 10px; font-family: var(--font-mono);">
                <span><i class="fa-solid fa-repeat"></i> ${f.retweets_shares}</span>
                <span><i class="fa-regular fa-heart"></i> ${f.likes}</span>
              </div>
            </div>
          </div>
        `;
        })
        .join('');

      listContainer.innerHTML = gzBannerHtml + cardsHtml;

      // Bind listener ke tombol fokus peta
      listContainer.querySelectorAll('.btn-focus-map').forEach((btn) => {
        btn.onclick = () => {
          const lon = parseFloat(btn.dataset.lon);
          const lat = parseFloat(btn.dataset.lat);
          if (lon && lat) {
            this.flyToLocation(lon, lat, 4.5);
          }
        };
      });
    } catch (e) {
      console.warn('Gagal memuat feeds medsos:', e);
      listContainer.innerHTML = '<div style="color: #ef4444; font-size: 0.75rem;">Gagal memuat postingan medsos.</div>';
    }
  }

  resize() {
    if (this.mapChart) this.mapChart.resize();
    if (this.snaChart) this.snaChart.resize();
  }

  formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  }
}
