/**
 * Pelacak Akun Medsos View Component
 * Dedicated Social Media Account & Hashtag Forensics Tracking Interface
 * Features:
 * - Search by Username, Account URL, or Display Name
 * - Multi-Platform Selector (X, TikTok, Instagram, Facebook, YouTube, Threads)
 * - 4 Summary Statistic Cards
 * - Clickable Search History / Saved Account List
 * - Structured Account Profile Detail Panel & Public Metrics
 * - 30-Day Historical Activity & Engagement Chart (ECharts)
 * - Recent Public Posts Timeline
 * - Clear distinction between public OSINT data and simulated indicators
 */

import * as echarts from 'echarts';
import { ApiService } from '../services/api.js';
import { renderLucideIcons } from '../utils/icons.js';

export class PelacakAkunMedsosView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activityChart = null;
    this.currentAccount = null;
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px; padding: 20px; width: 100%; max-width: 1600px; margin: 0 auto;">
        
        <!-- Page Header & Subtitle -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.3rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 10px;">
              <i data-lucide="scan-search" style="color: var(--color-cyan, #00e5ff); width: 24px; height: 24px;"></i>
              Pelacak Akun Medsos
            </div>
            <div style="font-size: 0.78rem; color: #64748b; margin-top: 3px;">
              Pemantauan akun dan aktivitas media sosial yang tersedia secara terbuka.
            </div>
          </div>

          <!-- Legal / Privacy Notice -->
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 12px; font-size: 0.68rem; color: #1e40af; max-width: 480px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-shield-halved text-cyan"></i>
            <span><strong>Standar Kepatuhan OSINT:</strong> Modul ini hanya mengagregasi data publik terbuka. Sistem tidak mengakses pesan pribadi (DM) atau kredensial rahasia.</span>
          </div>
        </div>

        <!-- 4 Summary Statistic Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
          <div class="komando-card" style="border-top: 3px solid #2563eb; padding: 14px 16px;">
            <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">AKUN TERPANTAU</div>
            <div style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 2px 0;">5 Tersimpan</div>
            <div style="font-size: 0.65rem; color: #38bdf8;">Target investigasi aktif</div>
          </div>

          <div class="komando-card" style="border-top: 3px solid #ef4444; padding: 14px 16px;">
            <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">RATA-RATA SKOR BOTNET</div>
            <div style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: #ef4444; margin: 2px 0;">82.4%</div>
            <div style="font-size: 0.65rem; color: #f87171;">Tingkat probabilitas bot tinggi</div>
          </div>

          <div class="komando-card" style="border-top: 3px solid #8b5cf6; padding: 14px 16px;">
            <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">TOTAL ESTIMASI REACH</div>
            <div style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 2px 0;">14.8 Juta</div>
            <div style="font-size: 0.65rem; color: #c084fc;">Potensi paparan audiens publik</div>
          </div>

          <div class="komando-card" style="border-top: 3px solid #f59e0b; padding: 14px 16px;">
            <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">OPERASI CIB TERDETEKSI</div>
            <div style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: #fbbf24; margin: 2px 0;">3 Kluster</div>
            <div style="font-size: 0.65rem; color: #fbbf24;">Koordinasi waktu &lt; 5 detik</div>
          </div>
        </div>

        <!-- Search Bar & Platform Selector Controls -->
        <div class="komando-card" style="display: flex; flex-direction: column; gap: 12px; background: #ffffff;">
          <div class="osint-search-row">
            
            <!-- Platform Dropdown -->
            <select id="osint-platform-select" class="form-select osint-platform-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.78rem; padding: 8px 12px; border-radius: 6px;">
              <option value="ALL">Semua Platform</option>
              <option value="X" selected>𝕏 (Twitter)</option>
              <option value="TIKTOK">TikTok</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="THREADS">Threads</option>
            </select>

            <!-- Input Query -->
            <div class="osint-query-wrap" style="position: relative;">
              <input type="text" id="osint-query-input" value="@daboriba_buzz" placeholder="Masukkan @username, nama profil, tagar (#28Oktober), atau URL akun..." class="tactical-input" style="padding-left: 36px; font-size: 0.82rem;" />
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 12px; color: #94a3b8; font-size: 0.85rem;"></i>
            </div>

            <!-- Submit Button -->
            <button id="btn-osint-submit" class="btn-tactical cyan osint-submit-btn" style="padding: 8px 18px; font-size: 0.78rem;">
              <i class="fa-solid fa-satellite-dish"></i> LACAK AKUN
            </button>
          </div>

          <!-- Saved Account Chips / Quick History -->
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 0.68rem; color: #94a3b8; font-weight: 700;">
              <i class="fa-solid fa-clock-rotate-left"></i> RIWAYAT / CEPAT:
            </span>
            <button class="preset-chip chip-account" data-query="@daboriba_buzz" data-plat="X">
              𝕏 @daboriba_buzz <span class="tag-badge bot" style="font-size: 0.55rem; padding: 0 3px;">88%</span>
            </button>
            <button class="preset-chip chip-account" data-query="@viral_indo_terkini" data-plat="TIKTOK">
              TikTok @viral_indo_terkini <span class="tag-badge bot" style="font-size: 0.55rem; padding: 0 3px;">84%</span>
            </button>
            <button class="preset-chip chip-account" data-query="@revolusi_suara_rakyat" data-plat="INSTAGRAM">
              IG @revolusi_suara_rakyat <span class="tag-badge bot" style="font-size: 0.55rem; padding: 0 3px;">79%</span>
            </button>
            <button class="preset-chip chip-account" data-query="@nusantara_update" data-plat="THREADS">
              Threads @nusantara_update <span class="tag-badge valid" style="font-size: 0.55rem; padding: 0 3px;">65%</span>
            </button>
            <button class="preset-chip chip-account" data-query="@radar_politik_idn" data-plat="FACEBOOK">
              FB @radar_politik_idn <span class="tag-badge bot" style="font-size: 0.55rem; padding: 0 3px;">81%</span>
            </button>
            <button class="preset-chip chip-account" data-query="#28Oktober" data-plat="ALL" style="border-color: #ef4444; color: #ef4444;">
              <i class="fa-solid fa-hashtag"></i> #28Oktober
            </button>
          </div>
        </div>

        <!-- MAIN INVESTIGATION RESULT PANEL -->
        <div id="osint-result-container" style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Top Row: Profile Card & Bot Score Meter -->
          <div class="osint-profile-grid">
            
            <!-- Profile Identity Card -->
            <div class="komando-card" style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 52px; height: 52px; border-radius: 50%; background: #eff6ff; border: 2px solid #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #2563eb;">
                    <i class="fa-brands fa-x-twitter" id="osint-card-platform-icon"></i>
                  </div>
                  <div>
                    <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                      <span id="osint-profile-name">Daboriba Buzzer Network</span>
                      <span class="tag-badge bot" id="osint-profile-risk">HIGH THREAT</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #38bdf8; font-family: var(--font-mono);" id="osint-profile-handle">
                      @daboriba_buzz &bull; ID: 1748291038592
                    </div>
                  </div>
                </div>
                <span class="tag-badge" style="border-color: #38bdf8; color: #38bdf8; font-size: 0.65rem;">AKUN PUBLIK</span>
              </div>

              <!-- Bio Snippet -->
              <div style="font-size: 0.78rem; color: #334155; background: #f8fafc; padding: 10px 12px; border-radius: 6px; border: 1px solid #e2e8f0; line-height: 1.4;">
                <em>"Pusat update kabar viral, isu terkini seputar kebijakan ekonomi, dan diskusi hangat masyarakat setiap hari. Follow untuk berita eksklusif."</em>
              </div>

              <!-- 4 Public Account Metrics -->
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-family: var(--font-mono); text-align: center;">
                <div style="background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 0.62rem; color: #94a3b8;">FOLLOWERS</div>
                  <strong style="color: #38bdf8; font-size: 0.95rem;">1,240,500</strong>
                </div>
                <div style="background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 0.62rem; color: #94a3b8;">FOLLOWING</div>
                  <strong style="color: #0f172a; font-size: 0.95rem;">420</strong>
                </div>
                <div style="background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 0.62rem; color: #94a3b8;">TOTAL POSTS</div>
                  <strong style="color: #0f172a; font-size: 0.95rem;">4,850</strong>
                </div>
                <div style="background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <div style="font-size: 0.62rem; color: #94a3b8;">ENGAGEMENT</div>
                  <strong style="color: #10b981; font-size: 0.95rem;">14.2%</strong>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
                <span>Dibuat: <strong>Maret 2024 (Akun Baru &bull; 7 Bulan)</strong></span>
                <span>Wilayah Terdeteksi: <strong>DKI Jakarta (BTS Sektor Selatan)</strong></span>
              </div>
            </div>

            <!-- Bot Probability Score Breakdown -->
            <div class="komando-card" style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #0f172a;">
                  <i class="fa-solid fa-robot text-amber"></i> Unified Bot Probability Score
                </div>
                <span class="tag-badge bot" style="font-size: 0.65rem;">88% (PROBABILITAS TINGGI)</span>
              </div>

              <!-- Sub-meters -->
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.72rem;">
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="color: #475569;">1. Entropi Teks & Semantik (Template Keberulangan)</span>
                    <strong style="color: #ef4444;">89% (Sangat Mirip)</strong>
                  </div>
                  <div style="width: 100%; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                    <div style="width: 89%; height: 100%; background: #ef4444;"></div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="color: #475569;">2. Sinkronisasi Waktu Postingan (Burst Temporal)</span>
                    <strong style="color: #ef4444;">94% (Interval &lt; 5s)</strong>
                  </div>
                  <div style="width: 100%; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                    <div style="width: 94%; height: 100%; background: #ef4444;"></div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="color: #475569;">3. Derajat Koneksi Kluster (In-Degree Amplifiers)</span>
                    <strong style="color: #fbbf24;">78% (35 Simpul Terhubung)</strong>
                  </div>
                  <div style="width: 100%; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                    <div style="width: 78%; height: 100%; background: #f59e0b;"></div>
                  </div>
                </div>
              </div>

              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 10px; font-size: 0.68rem; color: #b91c1c; margin-top: auto;">
                <i class="fa-solid fa-triangle-exclamation"></i> Terindikasi sebagai <strong>Koordinator Kluster CIB-INVEST-01</strong> yang menggerakkan puluhan akun amplifier otomatis.
              </div>
            </div>

          </div>

          <!-- Bottom Row: Historical Activity Chart (Kiri) & Recent Public Posts (Kanan) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            
            <!-- Historical Activity Chart -->
            <div class="komando-card" style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #0f172a;">
                  <i class="fa-solid fa-chart-simple text-cyan"></i> Tren Aktivitas & Lonjakan 30 Hari
                </div>
                <span class="tag-badge valid" style="font-size: 0.6rem;">HISTORIS</span>
              </div>
              <div id="osint-activity-chart-container" style="width: 100%; height: 240px;"></div>
            </div>

            <!-- Recent Public Posts Timeline -->
            <div class="komando-card" style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #0f172a;">
                  <i class="fa-solid fa-newspaper text-cyan"></i> Postingan Publik Terpantau
                </div>
                <span class="tag-badge" style="border-color: var(--color-cyan); color: var(--color-cyan); font-size: 0.6rem;">3 KONTEN</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto;">
                <!-- Post 1 -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 0.72rem; display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #f59e0b; font-weight: 700; font-family: var(--font-mono); font-size: 0.65rem;">
                      <i class="fa-solid fa-bullhorn"></i> T-00:00 (ORIGIN GROUND ZERO)
                    </span>
                    <span class="tag-badge bot" style="font-size: 0.55rem;">NEGATIF</span>
                  </div>
                  <div style="color: #334155; line-height: 1.3;">
                    "Kebijakan tarif baru membuat rakyat makin terjepit. Suarakan aksi serempak besok! #28Oktober #DemoBuruhNasional"
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.62rem; color: #94a3b8; font-family: var(--font-mono);">
                    <span>28 Okt 2026, 08:14 WIB</span>
                    <span><i class="fa-solid fa-repeat"></i> 1,420 &bull; <i class="fa-regular fa-heart"></i> 4,890</span>
                  </div>
                </div>

                <!-- Post 2 -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 0.72rem; display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #38bdf8; font-family: var(--font-mono); font-size: 0.65rem;">
                      AMPLIFIKASI KLUSTER
                    </span>
                    <span class="tag-badge bot" style="font-size: 0.55rem;">PROVOKATIF</span>
                  </div>
                  <div style="color: #334155; line-height: 1.3;">
                    "Jangan biarkan suara buruh diabaikan. Retweet massal sampai trending topic nasional! #28Oktober"
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.62rem; color: #94a3b8; font-family: var(--font-mono);">
                    <span>28 Okt 2026, 08:15 WIB</span>
                    <span><i class="fa-solid fa-repeat"></i> 980 &bull; <i class="fa-regular fa-heart"></i> 3,120</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    this.bindEvents();
    this.initActivityChart();
    renderLucideIcons(this.container);
  }

  bindEvents() {
    // Tombol Lacak Akun
    const btnSubmit = this.container.querySelector('#btn-osint-submit');
    const inputQuery = this.container.querySelector('#osint-query-input');
    const platSelect = this.container.querySelector('#osint-platform-select');

    if (btnSubmit && inputQuery) {
      btnSubmit.onclick = () => {
        const query = inputQuery.value.trim();
        if (!query) return;
        this.executeSearch(query, platSelect ? platSelect.value : 'X');
      };

      inputQuery.onkeydown = (e) => {
        if (e.key === 'Enter') {
          btnSubmit.click();
        }
      };
    }

    // Klik Chip Akun Cepat
    const chips = this.container.querySelectorAll('.chip-account');
    chips.forEach((c) => {
      c.onclick = () => {
        const q = c.dataset.query;
        const p = c.dataset.plat;
        if (inputQuery) inputQuery.value = q;
        if (platSelect && p !== 'ALL') platSelect.value = p;
        this.executeSearch(q, p);
      };
    });
  }

  executeSearch(query, platform) {
    const btnSubmit = this.container.querySelector('#btn-osint-submit');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MEMERIKSA...';
    }

    setTimeout(() => {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> LACAK AKUN';
      }

      // Update Tampilan Profil
      const nameEl = this.container.querySelector('#osint-profile-name');
      const handleEl = this.container.querySelector('#osint-profile-handle');
      const platIcon = this.container.querySelector('#osint-card-platform-icon');

      if (nameEl) nameEl.textContent = query.startsWith('#') ? `Tagar: ${query}` : `Akun: ${query}`;
      if (handleEl) handleEl.textContent = `${query} \u2022 Platform: ${platform || 'Multi-Platform'}`;

      if (platIcon) {
        platIcon.className = '';
        if (platform === 'TIKTOK') platIcon.className = 'fa-brands fa-tiktok';
        else if (platform === 'INSTAGRAM') platIcon.className = 'fa-brands fa-instagram';
        else if (platform === 'FACEBOOK') platIcon.className = 'fa-brands fa-facebook';
        else if (platform === 'THREADS') platIcon.className = 'fa-brands fa-threads';
        else if (platform === 'YOUTUBE') platIcon.className = 'fa-brands fa-youtube';
        else platIcon.className = 'fa-brands fa-x-twitter';
      }

      this.initActivityChart();
    }, 700);
  }

  setQuery(query) {
    const input = this.container.querySelector('#osint-query-input');
    if (input) {
      input.value = query;
      this.executeSearch(query, 'X');
    }
  }

  initActivityChart() {
    const el = document.getElementById('osint-activity-chart-container');
    if (!el || el.clientWidth === 0) return;

    if (this.activityChart) this.activityChart.dispose();
    this.activityChart = echarts.init(el);

    const days = Array.from({ length: 30 }, (_, i) => `${i + 1} Okt`);
    const posts = [4, 6, 3, 5, 8, 12, 7, 5, 9, 14, 8, 10, 15, 22, 18, 25, 30, 42, 38, 55, 48, 62, 75, 90, 85, 110, 145, 180, 210, 250];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        textStyle: { color: '#0f172a', fontSize: 11 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 6px;'
      },
      grid: {
        top: 25,
        left: 40,
        right: 15,
        bottom: 25
      },
      xAxis: {
        type: 'category',
        data: days,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b', fontSize: 9, interval: 4 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#64748b', fontSize: 9 }
      },
      series: [
        {
          name: 'Frekuensi Postingan Harian',
          type: 'bar',
          data: posts,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ef4444' },
              { offset: 1, color: '#7f1d1d' }
            ]),
            borderRadius: [3, 3, 0, 0]
          }
        }
      ]
    };

    this.activityChart.setOption(option);
  }

  resize() {
    const el = document.getElementById('osint-activity-chart-container');
    if (!el || el.clientWidth === 0) return;
    if (!this.activityChart) {
      this.initActivityChart();
    } else {
      this.activityChart.resize();
    }
  }
}

