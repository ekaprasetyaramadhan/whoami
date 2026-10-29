/**
 * DashboardView Component
 * whoiam - Komando Monitoring dan Analisis Narasi Digital Online
 * Menampilkan Ringkasan Eksekutif, Barometer DEFCON, Radar Sentimen & Emosi,
 * Top 5 Provinsi Rawan Buzzer, Live Feed Telemetri, dan Pintasan Komando.
 */

import * as echarts from 'echarts';
import { ApiService } from '../services/api.js';
import { CognitiveStore } from '../state/store.js';

export class DashboardView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.radarChart = null;
    this.summaryData = {};
    this.topProvinces = [];
    this.recentFeeds = [];
    this.init();
  }

  async init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; background: #080d14; padding: 16px; gap: 16px;">
        
        <!-- Baris KPI Barometer Operasional Komando -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; flex-shrink: 0;">
          
          <!-- KPI 1: Status DEFCON & Ancaman -->
          <div style="background: #0e1520; border: 1px solid var(--color-border); border-left: 4px solid var(--color-green); border-radius: 6px; padding: 14px; display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 8px; background: rgba(16, 185, 129, 0.12); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #10b981;" id="dash-defcon-icon">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <div style="font-size: 0.68rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">STATUS PERINGATAN DINI</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: #10b981; font-family: var(--font-display);" id="dash-defcon-title">DEFCON 5 (AMAN)</div>
              <div style="font-size: 0.68rem; color: #94a3b8;" id="dash-defcon-desc">Sistem stabil, volume pesan normal</div>
            </div>
          </div>

          <!-- KPI 2: Kecepatan Aliran & Anomali -->
          <div style="background: #0e1520; border: 1px solid var(--color-border); border-left: 4px solid var(--color-cyan); border-radius: 6px; padding: 14px; display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 8px; background: rgba(0, 229, 255, 0.12); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: var(--color-cyan);">
              <i class="fa-solid fa-gauge-high"></i>
            </div>
            <div>
              <div style="font-size: 0.68rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">VELOCITY TELEMETRI</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--color-cyan); font-family: var(--font-mono);" id="dash-val-velocity">38 PPM</div>
              <div style="font-size: 0.68rem; color: #94a3b8;">Z-Score: <strong style="color: #fff;" id="dash-val-zscore">0.84σ</strong> (Ambang: >3.0σ)</div>
            </div>
          </div>

          <!-- KPI 3: Sebaran Buzzer Terpetakan -->
          <div style="background: #0e1520; border: 1px solid var(--color-border); border-left: 4px solid #a855f7; border-radius: 6px; padding: 14px; display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 8px; background: rgba(168, 85, 247, 0.12); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #a855f7;">
              <i class="fa-solid fa-users-viewfinder"></i>
            </div>
            <div>
              <div style="font-size: 0.68rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">JARINGAN BUZZER NASIONAL</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: #a855f7; font-family: var(--font-display);">152 KOORDINATOR</div>
              <div style="font-size: 0.68rem; color: #94a3b8;">38 Provinsi &bull; 1.400+ Bot Amplifiers</div>
            </div>
          </div>

          <!-- KPI 4: Jangkauan & Polarisasi -->
          <div style="background: #0e1520; border: 1px solid var(--color-border); border-left: 4px solid var(--color-amber); border-radius: 6px; padding: 14px; display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: var(--color-amber);">
              <i class="fa-solid fa-scale-unbalanced"></i>
            </div>
            <div>
              <div style="font-size: 0.68rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">POLARISASI OPINI PUBLIK</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--color-amber); font-family: var(--font-mono);" id="dash-val-polarization">28.5%</div>
              <div style="font-size: 0.68rem; color: #94a3b8;">Potensi Reach: <strong style="color: #fff;">~54.2 Juta</strong></div>
            </div>
          </div>

        </div>

        <!-- Layout Grid Utama (Kiri: Barometer EWS & Analisis Sentimen, Kanan: Top 5 Titik Panas & Live Ticker) -->
        <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 16px; flex: 1;">
          
          <!-- SISI KIRI -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- Widget 1: Barometer DEFCON & Kontrol Pertahanan Kognitif -->
            <div style="background: #0d131b; border: 1px solid var(--color-border); border-radius: 6px; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-radar text-cyan"></i> SISTEM DETEKSI DINI (EARLY WARNING SYSTEM - DEFCON)
                </div>
                <div style="display: flex; gap: 6px;">
                  <button id="btn-dash-inject-spike" class="btn-tactical" style="padding: 3px 9px; font-size: 0.68rem; border-color: var(--color-amber); color: var(--color-amber);" title="Uji ketahanan EWS dengan simulasi lonjakan pesan botnet">
                    <i class="fa-solid fa-bolt"></i> UJI SPIKE
                  </button>
                  <button id="btn-dash-refresh" class="btn-tactical" style="padding: 3px 9px; font-size: 0.68rem;">
                    <i class="fa-solid fa-arrows-rotate"></i> REFRESH
                  </button>
                </div>
              </div>

              <!-- Barometer 5 Tingkat DEFCON Visual -->
              <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;" id="defcon-visual-scale">
                <div style="padding: 8px 4px; text-align: center; border-radius: 4px; font-size: 0.65rem; font-weight: 700; border: 1px solid #10b981; background: rgba(16, 185, 129, 0.15); color: #10b981;" id="scale-defcon-5">
                  DEFCON 5<br><span style="font-size: 0.58rem; font-weight: normal;">NORMAL</span>
                </div>
                <div style="padding: 8px 4px; text-align: center; border-radius: 4px; font-size: 0.65rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: var(--color-text-muted);" id="scale-defcon-4">
                  DEFCON 4<br><span style="font-size: 0.58rem; font-weight: normal;">MONITOR</span>
                </div>
                <div style="padding: 8px 4px; text-align: center; border-radius: 4px; font-size: 0.65rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: var(--color-text-muted);" id="scale-defcon-3">
                  DEFCON 3<br><span style="font-size: 0.58rem; font-weight: normal;">WASPADA</span>
                </div>
                <div style="padding: 8px 4px; text-align: center; border-radius: 4px; font-size: 0.65rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: var(--color-text-muted);" id="scale-defcon-2">
                  DEFCON 2<br><span style="font-size: 0.58rem; font-weight: normal;">SIAGA</span>
                </div>
                <div style="padding: 8px 4px; text-align: center; border-radius: 4px; font-size: 0.65rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: var(--color-text-muted);" id="scale-defcon-1">
                  DEFCON 1<br><span style="font-size: 0.58rem; font-weight: normal;">KRITIS</span>
                </div>
              </div>

              <!-- Deskripsi Status EWS & Algoritma Anomali -->
              <div style="background: rgba(0,0,0,0.3); border-radius: 4px; padding: 10px 14px; font-size: 0.72rem; color: #cbd5e1; line-height: 1.5; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="color: var(--color-text-muted);">Algoritma Deteksi:</span>
                  <strong>Rolling Z-Score Anomaly Detector</strong> (Window: 60 Detik)
                </div>
                <div style="font-family: var(--font-mono); color: var(--color-cyan);">
                  Baseline: <strong>45 PPM</strong> &bull; Ambang Kritis: <strong>3.00σ</strong>
                </div>
              </div>
            </div>

            <!-- Widget 2: Radar Spektrum Emosi & Distribusi Sentimen Publik -->
            <div style="background: #0d131b; border: 1px solid var(--color-border); border-radius: 6px; padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-chart-pie text-purple"></i> ANALISIS SENTIMEN & SPEKTRUM EMOSI WARGANET
                </div>
                <span class="tag-badge valid" style="font-size: 0.62rem;">XAI SENTIMENT ENGINE</span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: center;">
                <!-- Radar Chart Container -->
                <div id="dash-radar-chart-container" style="width: 100%; height: 220px;"></div>

                <!-- Breakdown Persentase Sentimen & Polarisasi -->
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 600;">DISTRIBUSI POLARITAS OPINI:</div>
                  
                  <!-- Positif Bar -->
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 3px;">
                      <span style="color: #10b981;"><i class="fa-solid fa-face-smile"></i> Positif / Kepercayaan</span>
                      <strong style="color: #fff;" id="dash-pct-pos">54%</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                      <div id="dash-bar-pos" style="width: 54%; height: 100%; background: #10b981; border-radius: 3px;"></div>
                    </div>
                  </div>

                  <!-- Netral Bar -->
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 3px;">
                      <span style="color: var(--color-cyan);"><i class="fa-solid fa-face-meh"></i> Netral / Informasi</span>
                      <strong style="color: #fff;" id="dash-pct-neu">32%</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                      <div id="dash-bar-neu" style="width: 32%; height: 100%; background: var(--color-cyan); border-radius: 3px;"></div>
                    </div>
                  </div>

                  <!-- Negatif Bar -->
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 3px;">
                      <span style="color: #ef4444;"><i class="fa-solid fa-face-frown"></i> Negatif / Provokasi</span>
                      <strong style="color: #fff;" id="dash-pct-neg">14%</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                      <div id="dash-bar-neg" style="width: 14%; height: 100%; background: #ef4444; border-radius: 3px;"></div>
                    </div>
                  </div>

                  <div style="background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 4px; padding: 8px 10px; font-size: 0.68rem; color: #c084fc; margin-top: 4px;">
                    <i class="fa-solid fa-brain"></i> Emosi Dominan: <strong id="dash-dominant-emotion" style="color: #fff;">KEPERCAYAAN (TRUST)</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Widget 3: Kluster Botnet CIB & Manipulasi Terkoordinasi -->
            <div style="background: #0d131b; border: 1px solid var(--color-border); border-radius: 6px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-network-wired text-amber"></i> OPERASI MANIPULASI TERKOORDINASI (CIB CLUSTER)
                </div>
                <span class="tag-badge bot" style="font-size: 0.62rem;">35 BOTNET FARM AKTIF</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.72rem;">
                <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="color: var(--color-text-muted); font-size: 0.65rem;">KLUSTER ANCAMAN UTAMA:</div>
                  <strong style="color: #fbbf24;">CIB-INVEST-01 (Amplifikasi Finansial)</strong>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="color: var(--color-text-muted); font-size: 0.65rem;">SINKRONISASI WAKTU:</div>
                  <strong style="color: #ef4444;">94.2% (Interval 3-8 Detik)</strong>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="color: var(--color-text-muted); font-size: 0.65rem;">RATA-RATA UNIFIED BOT SCORE:</div>
                  <strong style="color: #ef4444;">88.5% (Probabilitas Tinggi)</strong>
                </div>
              </div>
            </div>

          </div>

          <!-- SISI KANAN -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- Widget 4: Top 5 Provinsi Titik Panas Buzzer (Hotspots Nasional) -->
            <div style="background: #0d131b; border: 1px solid var(--color-border); border-radius: 6px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-fire-flame-curved" style="color: #ef4444;"></i> TOP 5 WILAYAH TITIK PANAS BUZZER
                </div>
                <span class="tag-badge valid" style="font-size: 0.62rem;">INTELIJEN REGIONAL</span>
              </div>

              <!-- List 5 Provinsi Rawan -->
              <div id="dash-top-provinces-list" style="display: flex; flex-direction: column; gap: 8px;">
                <!-- Diisi dinamis -->
              </div>
            </div>

            <!-- Widget 5: Live Feed Telemetri Medsos (Aliran Postingan Real-Time) -->
            <div style="background: #0d131b; border: 1px solid var(--color-border); border-radius: 6px; padding: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-satellite-dish text-cyan fa-fade"></i> ALIRAN TELEMETRI MEDSOS REAL-TIME
                </div>
                <span class="tag-badge" style="border-color: var(--color-cyan); color: var(--color-cyan); font-size: 0.6rem;">WEBSOCKET LIVE</span>
              </div>

              <!-- Container List Postingan Live Ticker -->
              <div id="dash-live-feed-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px;">
                <div style="text-align: center; padding: 20px; color: var(--color-text-muted); font-size: 0.75rem;">
                  <i class="fa-solid fa-spinner fa-spin"></i> Menghubungkan ke aliran telemetri...
                </div>
              </div>
            </div>

            <!-- Widget 6: Pintasan Aksi Komando Cepat (Command Shortcuts) -->
            <div style="background: #0d131b; border: 1px solid var(--color-border); border-radius: 6px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #fff; margin-bottom: 2px;">
                <i class="fa-solid fa-bolt text-cyan"></i> PINTASAN AKSI KOMANDO OPERASIONAL
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button id="btn-dash-jump-geo" class="btn-tactical" style="padding: 8px; font-size: 0.72rem; text-align: left; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-map-location-dot text-cyan" style="font-size: 1rem;"></i>
                  <div>
                    <div style="font-weight: 700; color: #fff;">PETA & SEBARAN BUZZER</div>
                    <div style="font-size: 0.62rem; color: var(--color-text-muted);">Analisis 38 Provinsi & SNA</div>
                  </div>
                </button>
                <button id="btn-dash-jump-osint" class="btn-tactical" style="padding: 8px; font-size: 0.72rem; text-align: left; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-globe text-purple" style="font-size: 1rem;"></i>
                  <div>
                    <div style="font-weight: 700; color: #fff;">PELACAK AKUN MEDSOS</div>
                    <div style="font-size: 0.62rem; color: var(--color-text-muted);">Bedah URL Akun & Tagar</div>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    this.bindEvents();
    this.initRadarChart();
    this.loadTopProvinces();
    this.subscribeToStore();
  }

  bindEvents() {
    // Tombol Uji Lonjakan Spike
    const btnSpike = document.getElementById('btn-dash-inject-spike');
    if (btnSpike) {
      btnSpike.onclick = async () => {
        btnSpike.disabled = true;
        btnSpike.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MENYUNTIK...';
        try {
          await ApiService.injectSpike();
        } catch (e) {
          console.warn('Gagal inject spike:', e);
        } finally {
          setTimeout(() => {
            btnSpike.disabled = false;
            btnSpike.innerHTML = '<i class="fa-solid fa-bolt"></i> UJI SPIKE';
          }, 1200);
        }
      };
    }

    // Tombol Refresh
    const btnRefresh = document.getElementById('btn-dash-refresh');
    if (btnRefresh) {
      btnRefresh.onclick = async () => {
        btnRefresh.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MEMPERBARUI...';
        await Promise.all([this.loadTopProvinces(), this.loadTelemetryStatus()]);
        btnRefresh.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> REFRESH';
      };
    }

    // Tombol Pintasan ke Peta
    const btnJumpGeo = document.getElementById('btn-dash-jump-geo');
    if (btnJumpGeo) {
      btnJumpGeo.onclick = () => {
        if (window.switchToTab) window.switchToTab('tab-pane-geo');
      };
    }

    // Tombol Pintasan ke OSINT
    const btnJumpOsint = document.getElementById('btn-dash-jump-osint');
    if (btnJumpOsint) {
      btnJumpOsint.onclick = () => {
        if (window.switchToTab) window.switchToTab('tab-pane-osint');
      };
    }
  }

  initRadarChart() {
    const radarContainer = document.getElementById('dash-radar-chart-container');
    if (!radarContainer) return;

    this.radarChart = echarts.init(radarContainer);
    this.updateRadarOption({ anger: 15, fear: 12, trust: 68, anticipation: 25 });

    window.addEventListener('resize', () => {
      if (this.radarChart) this.radarChart.resize();
    });
  }

  updateRadarOption(emotions) {
    if (!this.radarChart) return;

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#10161d',
        borderColor: '#1f2937',
        textStyle: { color: '#e9e6dd', fontSize: 11 }
      },
      radar: {
        indicator: [
          { name: 'Kemarahan (Anger)', min: 0, max: 100 },
          { name: 'Ketakutan (Fear)', min: 0, max: 100 },
          { name: 'Kepercayaan (Trust)', min: 0, max: 100 },
          { name: 'Antisipasi (Anticipation)', min: 0, max: 100 }
        ],
        center: ['50%', '50%'],
        radius: '68%',
        splitNumber: 4,
        axisTick: { show: false },
        axisName: {
          color: '#94a3b8',
          fontSize: 10
        },
        splitLine: {
          lineStyle: { color: 'rgba(255, 255, 255, 0.08)' }
        },
        splitArea: { show: false },
        axisLine: {
          lineStyle: { color: 'rgba(255, 255, 255, 0.12)' }
        }
      },
      series: [
        {
          name: 'Spektrum Emosi Publik',
          type: 'radar',
          data: [
            {
              value: [
                emotions.anger || 15,
                emotions.fear || 12,
                emotions.trust || 68,
                emotions.anticipation || 25
              ],
              name: 'Indeks Emosi Publik',
              symbolSize: 4,
              itemStyle: { color: '#00e5ff' },
              areaStyle: {
                color: 'rgba(0, 229, 255, 0.22)'
              },
              lineStyle: {
                width: 2,
                color: '#00e5ff'
              }
            }
          ]
        }
      ]
    };

    this.radarChart.setOption(option, true);
  }

  async loadTopProvinces() {
    const listEl = document.getElementById('dash-top-provinces-list');
    if (!listEl) return;

    try {
      const res = await ApiService.getGeoProvincesSummary();
      if (res && res.data && res.data.provinces) {
        const provs = Object.values(res.data.provinces);
        // Urutkan berdasarkan total reach & risk
        const sorted = provs.sort((a, b) => (b.total_reach || 0) - (a.total_reach || 0)).slice(0, 5);

        listEl.innerHTML = sorted.map((p, idx) => `
          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--color-border); border-radius: 5px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease;">
            <div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px;">
                <span style="font-family: var(--font-mono); color: var(--color-cyan); font-size: 0.7rem;">#${idx + 1}</span>
                ${p.province}
                <span class="tag-badge ${p.high_risk_count > 0 ? 'bot' : 'valid'}" style="font-size: 0.58rem; padding: 1px 5px;">
                  ${p.high_risk_count > 0 ? 'WASPADA TINGGI' : 'TERKENDALI'}
                </span>
              </div>
              <div style="font-size: 0.66rem; color: var(--color-text-muted); margin-top: 2px;">
                Isu: <strong style="color: #cbd5e1;">${p.dominant_narrative || '-'}</strong> &bull; 
                Reach: <strong style="color: var(--color-cyan);">${(p.total_reach ? (p.total_reach / 1000000).toFixed(1) + 'M' : '1.2M')}</strong>
              </div>
            </div>
            <button class="btn-tactical btn-dash-focus-prov" data-province="${p.province}" style="padding: 4px 8px; font-size: 0.65rem; border-color: var(--color-cyan); color: var(--color-cyan);">
              <i class="fa-solid fa-map-pin"></i> BUKA DI PETA
            </button>
          </div>
        `).join('');

        // Pasang event listener untuk tombol fokus peta
        listEl.querySelectorAll('.btn-dash-focus-prov').forEach(btn => {
          btn.onclick = () => {
            const targetProv = btn.dataset.province;
            if (window.switchToTab) {
              window.switchToTab('tab-pane-geo', targetProv);
            }
          };
        });
      }
    } catch (e) {
      console.warn('Gagal memuat top provinces:', e);
    }
  }

  async loadTelemetryStatus() {
    try {
      const res = await ApiService.getEwsTelemetry();
      if (res && res.data) {
        CognitiveStore.setEwsTelemetry(res.data);
      }
    } catch (e) {
      console.warn('Gagal memuat telemetry status:', e);
    }
  }

  subscribeToStore() {
    CognitiveStore.subscribe((state) => {
      // 1. Update DEFCON Box
      const defconIcon = document.getElementById('dash-defcon-icon');
      const defconTitle = document.getElementById('dash-defcon-title');
      const defconDesc = document.getElementById('dash-defcon-desc');

      if (defconTitle) {
        const level = state.threatLevel;
        const num = state.defcon;
        if (level === 'RED' || num <= 2) {
          defconTitle.textContent = `DEFCON ${num} (ANCAMAN TINGGI)`;
          defconTitle.style.color = '#ef4444';
          if (defconIcon) {
            defconIcon.style.color = '#ef4444';
            defconIcon.style.background = 'rgba(239, 68, 68, 0.15)';
          }
          if (defconDesc) defconDesc.textContent = 'Lonjakan anomali narasi terkoordinasi terdeteksi!';
        } else if (level === 'YELLOW' || num <= 4) {
          defconTitle.textContent = `DEFCON ${num} (WASPADA)`;
          defconTitle.style.color = '#f59e0b';
          if (defconIcon) {
            defconIcon.style.color = '#f59e0b';
            defconIcon.style.background = 'rgba(245, 158, 11, 0.15)';
          }
          if (defconDesc) defconDesc.textContent = 'Peningkatan volume pesan melebihi batas rata-rata.';
        } else {
          defconTitle.textContent = `DEFCON ${num} (AMAN)`;
          defconTitle.style.color = '#10b981';
          if (defconIcon) {
            defconIcon.style.color = '#10b981';
            defconIcon.style.background = 'rgba(16, 185, 129, 0.15)';
          }
          if (defconDesc) defconDesc.textContent = 'Sistem stabil, volume pesan normal terkendali.';
        }
      }

      // 2. Update Velocity & Z-Score
      const valVel = document.getElementById('dash-val-velocity');
      if (valVel) valVel.textContent = `${state.currentVelocity || 38} PPM`;

      const valZ = document.getElementById('dash-val-zscore');
      if (valZ) valZ.textContent = `${typeof state.spikeIndex === 'number' ? state.spikeIndex.toFixed(2) : 0.84}σ`;

      // 3. Highlight Defcon Visual Scale Bar
      for (let i = 1; i <= 5; i++) {
        const el = document.getElementById(`scale-defcon-${i}`);
        if (el) {
          if (i === state.defcon) {
            el.style.border = '2px solid #00e5ff';
            el.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.4)';
          } else {
            el.style.border = '1px solid rgba(255,255,255,0.1)';
            el.style.boxShadow = 'none';
          }
        }
      }

      // 4. Update Radar Emosi
      if (state.emotionRadar) {
        this.updateRadarOption(state.emotionRadar);
      }

      // 5. Update Polarisasi
      const polEl = document.getElementById('dash-val-polarization');
      if (polEl && state.polarizationIndex !== undefined) {
        polEl.textContent = `${state.polarizationIndex.toFixed(1)}%`;
      }

      // 6. Update Live Feeds Ticker List
      this.updateLiveFeeds(state.posts);
    });
  }

  updateLiveFeeds(posts) {
    const feedContainer = document.getElementById('dash-live-feed-list');
    if (!feedContainer || !posts || posts.length === 0) return;

    const topPosts = posts.slice(0, 6);
    feedContainer.innerHTML = topPosts.map((p) => {
      const isBot = (p.bot_score || 0) > 60;
      return `
        <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--color-border); border-radius: 4px; padding: 8px 10px; font-size: 0.72rem; display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <strong style="color: #fff;">${p.author_name || p.author || 'Pengguna'}</strong>
              <span style="color: var(--color-cyan); font-family: var(--font-mono); font-size: 0.65rem;">${p.author_handle || ''}</span>
            </div>
            <span class="tag-badge ${isBot ? 'bot' : 'valid'}" style="font-size: 0.58rem; padding: 1px 5px;">
              ${p.platform || 'MEDSOS'} &bull; BOT: ${p.bot_score || 18}%
            </span>
          </div>
          <div style="color: #cbd5e1; font-size: 0.68rem; line-height: 1.3;">
            ${p.content || ''}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.62rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 2px;">
            <span>Sentimen: <strong style="color: #fff;">${p.sentiment || 'NEUTRAL'}</strong></span>
            <span>${p.timestamp || 'Baru saja'}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  resize() {
    if (this.radarChart) {
      this.radarChart.resize();
    }
  }
}

