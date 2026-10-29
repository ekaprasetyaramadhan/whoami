import { performanceContentData, filterAndSortPerformanceContent, getPerformanceCampaigns } from '../data/performanceContentData.js';
import { initialAccountTypeData, getAccountTypeComputed } from '../data/accountTypeData.js';
import { viralityMockData } from '../data/viralityData.js';
/**
 * Komando Dashboard View Component
 * Platform Intelijen dan Analisis Narasi Digital Online
 *
 * Full Vertical Dashboard Layout:
 * 1. Dashboard Header & Analytics Filters
 * 2. Four Primary KPI Statistic Cards:
 *    - Total Conversations (2,845,190)
 *    - Total Engagement (18,420,500)
 *    - Total View / Potential Reach (54,200,000)
 *    - Total Authors (142,800)
 * 3. Trend Analysis & Share of Voice
 * 4. Lower Section Row 1 (32% / 68%):
 *    - Top Hashtags (Left)
 *    - Top Authors (Right)
 * 5. Lower Section Row 2 (32% / 68%):
 *    - Gender Distribution (Left)
 *    - Top Words (Right)
 * 6. Tactical Barometer & DEFCON Early Warning System
 */

import * as echarts from 'echarts';
import { ApiService } from '../services/api.js';
import { CognitiveStore } from '../state/store.js';
import { renderLucideIcons } from '../utils/icons.js';
import {
  hashtagData,
  authorData,
  genderDistributionData,
  wordCloudData,
  platformTopWordComparison
} from '../data/dashboardMockData.js';

export class KomandoDashboardView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.trendChart = null;
    this.sovChart = null;
    this.genderChart = null;
    this.radarChart = null;
    this.radarResizeObserver = null;
    this.currentDefcon = 5;

    // State untuk Lower Section Cards
    this.selectedHashtagMetric = 'post'; // 'post' | 'engagement'
    this.selectedAuthorMetric = 'engagement'; // 'engagement' | 'post'
    this.selectedAuthorChannel = 'All Channel';
    this.authorSortCol = 'engagement';
    this.authorSortAsc = false;
    this.currentAuthorList = [...authorData];

    this.selectedWordMetric = 'Mention'; // 'Mention' | 'Engagement'
    this.selectedWordPlatform = 'All';

    // State untuk Account Type Distribution
    this.accountTypeData = [...initialAccountTypeData];

    // State untuk Virality Tracker Section
    this.selectedViralityCategory = 'ALL';
    this.selectedViralityPlatform = 'All';
    this.viralitySearchQuery = '';
        this.viralitySort = 'score';

    // State untuk Top Performance Content
    this.selectedPerformanceMetric = 'Engagement'; // 'Engagement' | 'Views' | 'ER%'
    this.selectedPerformanceCampaign = 'All Campaign';
    this.selectedPerformanceChannel = 'All Channel';

    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px; max-width: 1600px; margin: 0 auto; width: 100%;">
        
        <!-- ===================================================================
             SECTION 1: DASHBOARD HEADER & ANALYTICS FILTERS
             =================================================================== -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <div>
            <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.15rem; font-weight: 700; color: #0f172a;">
              Ringkasan Analitik Intelijen Medsos
            </div>
            <div style="font-size: 0.72rem; color: #94a3b8;">
              Data terkumpul dari 5 platform digital (𝕏, TikTok, Instagram, Facebook, Threads) secara real-time.
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <!-- Platform Selector -->
            <select id="dash-platform-filter" class="form-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.75rem; padding: 5px 10px; border-radius: 4px;">
              <option value="ALL">Semua Platform (Multi-Stream)</option>
              <option value="X">𝕏 (Twitter)</option>
              <option value="TIKTOK">TikTok</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="THREADS">Threads</option>
            </select>

            <!-- Sentiment Mode -->
            <select id="dash-sentiment-filter" class="form-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.75rem; padding: 5px 10px; border-radius: 4px;">
              <option value="ALL">Semua Sentimen</option>
              <option value="NEG">Negatif & Provokasi</option>
              <option value="POS">Positif / Netral</option>
            </select>

            <button id="btn-dash-refresh-all" class="btn-tactical" style="padding: 6px 12px; font-size: 0.72rem;">
              <i class="fa-solid fa-arrows-rotate"></i> REFRESH
            </button>
          </div>
        </div>

        <!-- ===================================================================
             SECTION 2: FOUR PRIMARY KPI STATISTIC CARDS
             =================================================================== -->
        <div class="kpi-summary-grid">
          
          <!-- Card 1: Total Conversations -->
          <div class="komando-card" style="border-top: 3px solid #2563eb;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                  TOTAL PERCAKAPAN
                </div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 4px 0;">
                  2,845,190
                </div>
              </div>
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(37, 99, 235, 0.12); color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i data-lucide="activity"></i>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #10b981; margin-top: 6px;">
              <i class="fa-solid fa-arrow-trend-up"></i>
              <span style="font-weight: 700;">+14.2%</span>
              <span style="color: #94a3b8;">vs 7 hari sebelumnya</span>
            </div>
            <div style="font-size: 0.65rem; color: #64748b; margin-top: 2px;">
              Total postingan & komentar dianalisis
            </div>
          </div>

          <!-- Card 2: Total Engagement -->
          <div class="komando-card" style="border-top: 3px solid #8b5cf6;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                  TOTAL INTERAKSI
                </div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 4px 0;">
                  18,420,500
                </div>
              </div>
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(139, 92, 246, 0.12); color: #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i data-lucide="share-2"></i>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #10b981; margin-top: 6px;">
              <i class="fa-solid fa-arrow-trend-up"></i>
              <span style="font-weight: 700;">+8.7%</span>
              <span style="color: #94a3b8;">vs 7 hari sebelumnya</span>
            </div>
            <div style="font-size: 0.65rem; color: #64748b; margin-top: 2px;">
              Akumulasi likes, retweets, replies & shares
            </div>
          </div>

          <!-- Card 3: Total View (Potential Reach) -->
          <div class="komando-card" style="border-top: 3px solid #10b981;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                  TOTAL TAYANGAN / POTENSI JANGKAUAN
                </div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 4px 0;">
                  54,200,000
                </div>
              </div>
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(16, 185, 129, 0.12); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i data-lucide="eye"></i>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #38bdf8; margin-top: 6px;">
              <i class="fa-solid fa-arrow-trend-up"></i>
              <span style="font-weight: 700;">+21.5%</span>
              <span style="color: #94a3b8;">ekspansi jangkauan audiens</span>
            </div>
            <div style="font-size: 0.65rem; color: #64748b; margin-top: 2px;">
              Estimasi impresi publik di 38 provinsi
            </div>
          </div>

          <!-- Card 4: Total Authors -->
          <div class="komando-card" style="border-top: 3px solid #f59e0b;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                  TOTAL PENULIS / AKUN
                </div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 4px 0;">
                  142,800
                </div>
              </div>
              <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); color: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i data-lucide="users"></i>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #f59e0b; margin-top: 6px;">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span style="font-weight: 700;">152 KOORDINATOR</span>
              <span style="color: #94a3b8;">1.400+ Bot Farm</span>
            </div>
            <div style="font-size: 0.65rem; color: #64748b; margin-top: 2px;">
              Akun aktif terkluster dalam operasi narasi
            </div>
          </div>

        </div>

        <!-- ===================================================================
             SECTION 3: TREND ANALYSIS & SHARE OF VOICE (INTACT)
             =================================================================== -->
        <div class="dash-analytics-row">
          
          <!-- Chart 1: Trend Analysis -->
          <div class="komando-card" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 0.95rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-chart-line text-cyan"></i> Analisis Tren (Volume & Dinamika Sentimen)
                </div>
                <div style="font-size: 0.68rem; color: #94a3b8;">
                  Fluktuasi intensitas percakapan harian dan pergeseran polarisasi narasi.
                </div>
              </div>
              <div style="display: flex; gap: 6px;">
                <span class="tag-badge valid" style="font-size: 0.62rem;">SINKRONISASI REAL-TIME</span>
              </div>
            </div>

            <div id="komando-trend-chart-container" style="width: 100%; height: 280px;"></div>
          </div>

          <!-- Chart 2: Share of Voice -->
          <div class="komando-card" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              <div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 0.95rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-chart-pie text-cyan"></i> Pangsa Suara (Share of Voice)
                </div>
                <div style="font-size: 0.68rem; color: #94a3b8;">
                  Distribusi pangsa platform media sosial.
                </div>
              </div>
              <span class="tag-badge" style="border-color: #38bdf8; color: #38bdf8; font-size: 0.62rem;">5 PLATFORM</span>
            </div>

            <div id="komando-sov-chart-container" style="width: 100%; height: 280px;"></div>
          </div>

        </div>

        <!-- ===================================================================
             SECTION 4: TOP HASHTAGS (LEFT 32%) & TOP AUTHORS (RIGHT 68%)
             =================================================================== -->
        <div class="dash-lower-grid">
          
          <!-- CARD: TOP HASHTAGS (LEFT 32%) -->
          <div class="dash-lower-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 570px; height: 570px;">
            <!-- Header -->
            <div style="display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 6px;">
              <!-- Top Row: Icon, Title & Detail Button -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background: rgba(147, 51, 234, 0.15); color: #c084fc; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">
                    <i class="fa-solid fa-hashtag"></i>
                  </div>
                  <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.12rem; font-weight: 700; color: #0f172a; white-space: nowrap;">
                    Tagar Teratas
                  </div>
                </div>

                <!-- Blue Detail Button -->
                <button id="btn-hashtag-detail" style="padding: 4px 12px; font-size: 0.7rem; border-radius: 9999px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;">
                  <i class="fa-regular fa-eye"></i> Rincian
                </button>
              </div>

              <!-- Bottom Row: Subtitle & Segmented Control -->
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <div style="font-size: 0.68rem; color: #64748b; line-height: 1.3;">
                  10 Tagar teratas berdasarkan sebaran aktivitas
                </div>

                <!-- Segmented Control: Post & Engagement -->
                <div class="dash-segmented-control" id="ctrl-hashtag-metric" style="flex-shrink: 0;">
                  <button class="dash-seg-btn active" data-metric="post">Postingan</button>
                  <button class="dash-seg-btn" data-metric="engagement">Interaksi</button>
                </div>
              </div>
            </div>

            <!-- Ranking List Container (10 Rows evenly spaced) -->
            <div id="hashtag-ranking-list" style="display: flex; flex-direction: column; gap: 7px; flex: 1; justify-content: space-between; padding: 4px 0;">
              <!-- Injected via renderHashtagRows() -->
            </div>

            <!-- Footer: Divider and Centered Legend -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 8px;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.72rem; color: #94a3b8;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #3b82f6; border-radius: 2px;"></span>
                <span>Demo 28 Okt &bull; 10 Tagar Teratas</span>
              </div>
            </div>
          </div>

          <!-- CARD: TOP AUTHORS (RIGHT 68%) -->
          <div class="dash-lower-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 570px; height: 570px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(147, 51, 234, 0.15); color: #c084fc; display: flex; align-items: center; justify-content: center; font-size: 1.05rem;">
                  <i class="fa-solid fa-users"></i>
                </div>
                <div>
                  <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.08rem; font-weight: 700; color: #0f172a;">
                    Akun / Penulis Teratas
                  </div>
                  <div style="font-size: 0.68rem; color: #64748b;">
                    10 Akun teratas berdasarkan performa interaksi
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <!-- Channel Dropdown (Default: All Channel) -->
                <select id="author-channel-select" class="form-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.72rem; padding: 5px 12px; border-radius: 9999px; font-weight: 500;">
                  <option value="All Channel">Semua Saluran</option>
                  <option value="Threads">Threads</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter / 𝕏</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                </select>

                <!-- Segmented Control: Engagement (default) & Post -->
                <div class="dash-segmented-control" id="ctrl-author-metric">
                  <button class="dash-seg-btn active" data-metric="engagement">Interaksi</button>
                  <button class="dash-seg-btn" data-metric="post">Postingan</button>
                </div>
              </div>
            </div>

            <!-- Table Container (8 Distinct Columns) -->
            <div style="overflow-x: auto; overflow-y: auto; scrollbar-width: thin; flex: 1;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.74rem; text-align: left;">
                <thead style="position: sticky; top: 0; background: #f8fafc; z-index: 5;">
                  <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.68rem; text-transform: uppercase;">
                    <th style="padding: 8px 6px; width: 34px; cursor: pointer; text-align: center;" class="sortable-author-col" data-col="rank" title="Urutkan Peringkat">Peringkat</th>
                    <th style="padding: 8px 6px; width: 44px; text-align: center;">Avatar</th>
                    <th style="padding: 8px 10px; cursor: pointer;" class="sortable-author-col" data-col="author" title="Urutkan Nama">Akun / Penulis</th>
                    <th style="padding: 8px 10px;">Saluran</th>
                    <th style="padding: 8px 10px; text-align: right; cursor: pointer;" class="sortable-author-col" data-col="followers" title="Urutkan Pengikut">Pengikut</th>
                    <th style="padding: 8px 10px; text-align: right; cursor: pointer;" class="sortable-author-col" data-col="engagement" title="Urutkan Interaksi">Interaksi</th>
                    <th style="padding: 8px 10px; text-align: right; cursor: pointer;" class="sortable-author-col" data-col="post" title="Urutkan Postingan">Postingan</th>
                    <th style="padding: 8px 10px; text-align: right; cursor: pointer;" class="sortable-author-col" data-col="er" title="Urutkan Engagement Rate">ER%</th>
                  </tr>
                </thead>
                <tbody id="top-authors-tbody">
                  <!-- Injected via renderAuthorTable() -->
                </tbody>
              </table>
            </div>

            <!-- Footer: Divider and Helper Text -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 8px; display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; color: #94a3b8;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-circle-check" style="color: #2563eb;"></i>
                <span>Akun Resmi &bull; Avatar / Nama = klik untuk profil detail</span>
              </div>
              <div id="author-table-count" style="font-family: var(--font-mono); color: #cbd5e1; font-weight: 600;">
                10 akun ditampilkan
              </div>
            </div>
          </div>

        </div>

        <!-- ===================================================================
             SECTION 5: GENDER DISTRIBUTION (LEFT 32%) & TOP WORDS (RIGHT 68%)
             =================================================================== -->
        <div class="dash-lower-grid">
          
          <!-- CARD: GENDER DISTRIBUTION (LEFT 32%) -->
          <div class="dash-lower-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 460px; height: 460px; max-height: 460px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(37, 99, 235, 0.15); color: #60a5fa; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.05rem; font-weight: 700; color: #0f172a;">
                      Distribusi Jenis Kelamin
                    </span>
                    <span style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em;">
                      ESTIMASI
                    </span>
                  </div>
                  <div style="font-size: 0.7rem; color: #64748b; margin-top: 3px;">
                    258 dari 2.695 akun terklasifikasi
                  </div>
                </div>
              </div>
            </div>

            <!-- Donut Chart -->
            <div id="komando-gender-chart-container" style="width: 100%; height: 210px; margin: 0 auto;"></div>

            <!-- Legend and Statistics -->
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: -6px;">
              <!-- Male Row -->
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem;">
                  <div style="display: flex; align-items: center; gap: 6px; color: #1e293b; font-weight: 600;">
                    <i class="fa-solid fa-mars" style="color: #3b82f6; font-size: 0.85rem;"></i>
                    <span>Laki-laki</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 0.68rem; color: #64748b;">166 akun</span>
                    <strong style="font-size: 0.82rem; color: #3b82f6; min-width: 32px; text-align: right;">64%</strong>
                  </div>
                </div>
                <div style="width: 100%; height: 6px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 9999px; overflow: hidden;">
                  <div style="width: 64%; height: 100%; background: #3b82f6; border-radius: 9999px;"></div>
                </div>
              </div>

              <!-- Female Row -->
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem;">
                  <div style="display: flex; align-items: center; gap: 6px; color: #1e293b; font-weight: 600;">
                    <i class="fa-solid fa-venus" style="color: #ec4899; font-size: 0.85rem;"></i>
                    <span>Perempuan</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 0.68rem; color: #64748b;">92 akun</span>
                    <strong style="font-size: 0.82rem; color: #ec4899; min-width: 32px; text-align: right;">36%</strong>
                  </div>
                </div>
                <div style="width: 100%; height: 6px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 9999px; overflow: hidden;">
                  <div style="width: 36%; height: 100%; background: #ec4899; border-radius: 9999px;"></div>
                </div>
              </div>
            </div>

            <!-- Footer: Thin divider & Disclaimer -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: auto;">
              <div style="font-size: 0.68rem; color: #94a3b8; font-style: italic; text-align: center;">
                Hanya mencakup akun yang terklasifikasi dengan keyakinan ≥70%
              </div>
            </div>
          </div>

          <!-- CARD: TOP WORDS (RIGHT 68%) -->
          <div class="dash-lower-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 460px; height: 460px; max-height: 460px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.15rem; font-weight: 700; color: #0f172a;">
                  Kata Kunci Teratas
                </div>
              </div>

              <!-- Segmented Controls: Mention (default) & Engagement -->
              <div class="dash-segmented-control" id="ctrl-word-metric">
                <button class="dash-seg-btn active" data-metric="Mention">Sebutan</button>
                <button class="dash-seg-btn" data-metric="Engagement">Interaksi</button>
              </div>
            </div>

            <!-- Horizontally Arranged Platform Filter Bar -->
            <div class="dash-platform-pill-bar" id="ctrl-word-platforms">
              <button class="dash-plat-pill active" data-platform="All">Semua</button>
              <button class="dash-plat-pill" data-platform="YouTube">YouTube</button>
              <button class="dash-plat-pill" data-platform="Online Media">Media Online</button>
              <button class="dash-plat-pill" data-platform="Facebook">Facebook</button>
              <button class="dash-plat-pill" data-platform="Threads">Threads</button>
            </div>

            <!-- Word Cloud Visualization Container -->
            <div id="word-cloud-content" class="word-cloud-container">
              <!-- Injected via renderWordCloud() -->
            </div>

            <!-- Footer: #tag = hashtag & Sentiment Legend -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; padding-bottom: 2px; margin-top: auto; display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: #64748b; flex-wrap: wrap; gap: 8px;">
              <div><span style="text-decoration: underline; font-weight: 600; color: #475569;">#tag</span> &nbsp;=&nbsp; tagar</div>
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
                  <span style="color: #475569; font-weight: 500;">Positif</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #334155;"></span>
                  <span style="color: #475569; font-weight: 500;">Netral</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></span>
                  <span style="color: #475569; font-weight: 500;">Negatif</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ===================================================================
             SECTION 6: ACCOUNT TYPE DISTRIBUTION (LEFT) & VIRALITY TRACKER (RIGHT)
             =================================================================== -->
        <div class="dash-split-6-grid">
          
          <!-- LEFT CARD: ACCOUNT TYPE DISTRIBUTION -->
          <div class="account-type-card" id="card-account-type-dist">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 4px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 1.05rem;">
                  <i class="fa-solid fa-users"></i>
                </div>
                <div>
                  <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.08rem; font-weight: 700; color: #0f172a;">
                    Distribusi Tipe Akun
                  </div>
                  <div style="font-size: 0.68rem; color: #94a3b8;">
                    Sebaran narasi berdasarkan kategori dan tipe akun media sosial
                  </div>
                </div>
              </div>

              <!-- Top-right Total Categorized Posts -->
              <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 9999px; padding: 4px 12px; font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #38bdf8;" id="acct-total-categorized-badge" style="background: #eff6ff; border: 1px solid #bfdbfe; color: #2563eb; border-radius: 9999px; padding: 4px 12px; font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;">
                2 postingan terkategori
              </div>
            </div>

            <!-- Table Header beneath title -->
            <div style="display: grid; grid-template-columns: 63% calc(37% - 10px); gap: 10px; align-items: center; padding: 4px 12px; font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
              <div>TIPE AKUN</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); text-align: center;">
                <div>INSTAGRAM</div>
                <div>TIKTOK</div>
                <div style="color: #38bdf8;">TOTAL POSTINGAN</div>
              </div>
            </div>

            <!-- 4 Account Type Rows Container -->
            <div id="acct-type-rows-container" style="display: flex; flex-direction: column; gap: 8px; flex: 1; justify-content: space-between; padding: 4px 0;">
              <!-- Injected via renderAccountTypeDistribution() -->
            </div>

            <!-- Footer: Divider and Note -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 4px; display: flex; align-items: center; gap: 8px; font-size: 0.7rem; color: #64748b;">
              <i class="fa-solid fa-circle-info text-cyan"></i>
              <span>Hanya berdasarkan akun yang terdaftar di KOMANDO</span>
            </div>
          </div>

          <!-- RIGHT CARD: VIRALITY TRACKER -->
          <div class="virality-tracker-card" id="card-virality-tracker">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 4px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #ec4899 0%, #ef4444 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; box-shadow: 0 0 12px rgba(239, 68, 68, 0.4); flex-shrink: 0;">
                  <i class="fa-solid fa-star"></i>
                </div>
                <div>
                  <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.08rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                    Pelacak Viralitas
                    <span style="font-size: 0.62rem; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; padding: 2px 7px; border-radius: 9999px; font-weight: 700; letter-spacing: 0.05em;">TOP 10</span>
                  </div>
                  <div style="font-size: 0.68rem; color: #94a3b8;">
                    10 Konten paling viral dari medsos & media online
                  </div>
                </div>
              </div>

              <!-- Controls (Platform Select & Category Pills) -->
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <select id="virality-platform-select" class="form-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.7rem; padding: 3px 8px; border-radius: 9999px; font-weight: 500;">
                  <option value="All">Semua Saluran</option>
                  <option value="TikTok">TikTok</option>
                  <option value="X">X</option>
                  <option value="Threads">Threads</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Online Media">Online Media</option>
                </select>

                <div style="display: flex; align-items: center; gap: 4px;">
                  <button class="virality-cat-badge all active" data-cat="ALL" style="padding: 3px 8px; font-size: 0.65rem;">Semua</button>
                  <button class="virality-cat-badge sangat-viral" data-cat="Sangat Viral" style="padding: 3px 8px; font-size: 0.65rem;">Sangat Viral</button>
                  <button class="virality-cat-badge viral" data-cat="Viral" style="padding: 3px 8px; font-size: 0.65rem;">Viral</button>
                  <button class="virality-cat-badge normal" data-cat="Normal" style="padding: 3px 8px; font-size: 0.65rem;">Normal</button>
                </div>
              </div>
            </div>

            <!-- Search input bar -->
            <div style="position: relative; display: flex; align-items: center; margin-bottom: 2px;">
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; color: #64748b; font-size: 0.68rem;"></i>
              <input type="text" id="virality-search-input" placeholder="Cari narasi / kata kunci..." style="background: #ffffff; border: 1px solid #cbd5e1; color: #0f172a; padding: 4px 10px 4px 26px; border-radius: 9999px; font-size: 0.68rem; width: 100%; outline: none;">
            </div>

            <!-- List Container (Scrollable & compact) -->
            <div id="virality-items-list" style="display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 380px; scrollbar-width: thin; flex: 1;">
              <!-- Injected via renderViralityTracker() -->
            </div>

            <!-- Footer Formula & Explanatory Note -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 4px; display: flex; align-items: center; justify-content: space-between; font-size: 0.68rem; color: #94a3b8;">
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 360px;">
                <i class="fa-solid fa-calculator text-cyan"></i>
                <span>Skor = (bagikan ÷ pengikut × 60%) + (interaksi ÷ pengikut × 40%)</span>
              </div>
              <div id="virality-count-indicator" style="font-family: var(--font-mono); font-size: 0.68rem; color: #cbd5e1; flex-shrink: 0;">
                10 konten
              </div>
            </div>
          </div>

        </div>

                <!-- ===================================================================
             SECTION 7: TOP PERFORMANCE CONTENT (GALLERY GRID)
             =================================================================== -->
        <div class="top-performance-card" id="card-top-performance-content">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; box-shadow: 0 0 14px rgba(6, 182, 212, 0.35); flex-shrink: 0;">
                <i class="fa-solid fa-chart-simple"></i>
              </div>
              <div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.15rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                  Konten Performa Teratas
                  <span style="font-size: 0.65rem; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; padding: 2px 8px; border-radius: 9999px; font-weight: 700; letter-spacing: 0.05em;">TOP 12</span>
                </div>
                <div style="font-size: 0.7rem; color: #94a3b8;">
                  12 Konten dengan performa interaksi, impresi tayangan, dan rasio keterlibatan tertinggi
                </div>
              </div>
            </div>

            <!-- Controls (All Campaign, All Channel, Segmented Metric) -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <!-- Dropdown: All Campaign -->
              <select id="perf-campaign-select" class="form-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.72rem; padding: 5px 10px; border-radius: 8px; font-weight: 500;">
                <option value="All Campaign">Semua Kampanye</option>
                <option value="Aksi Mahasiswa">Aksi Mahasiswa</option>
                <option value="Hari Sumpah Pemuda">Hari Sumpah Pemuda</option>
                <option value="Isu Nasional">Isu Nasional</option>
              </select>

              <!-- Dropdown: All Channel -->
              <select id="perf-channel-select" class="form-select" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.72rem; padding: 5px 10px; border-radius: 8px; font-weight: 500;">
                <option value="All Channel">Semua Saluran</option>
                <option value="Threads">Threads</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="X">X / Twitter</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Online Media">Online Media</option>
              </select>

              <!-- Segmented Metric Switcher: Engagement, Views, ER% -->
              <div class="dash-segmented-control" id="ctrl-perf-metric">
                <button class="dash-seg-btn active" data-metric="Engagement">Interaksi</button>
                <button class="dash-seg-btn" data-metric="Views">Tayangan</button>
                <button class="dash-seg-btn" data-metric="ER%">Rasio ER%</button>
              </div>
            </div>
          </div>

          <!-- Content Card Grid (12 Items) -->
          <div id="perf-content-grid" class="perf-content-grid">
            <!-- Injected dynamically via renderPerformanceContent() -->
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: #94a3b8; flex-wrap: wrap; gap: 8px;">
            <div id="perf-count-label">
              Menampilkan 12 konten teratas
            </div>
            <div style="display: flex; align-items: center; gap: 14px; font-size: 0.68rem;">
              <span style="display: flex; align-items: center; gap: 5px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                <span style="color: #cbd5e1;">#1 Emas</span>
              </span>
              <span style="display: flex; align-items: center; gap: 5px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; display: inline-block;"></span>
                <span style="color: #cbd5e1;">#2 Perak</span>
              </span>
              <span style="display: flex; align-items: center; gap: 5px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ea580c; display: inline-block;"></span>
                <span style="color: #cbd5e1;">#3 Perunggu</span>
              </span>
              <span style="color: #64748b;">&bull;</span>
              <span style="color: #38bdf8; font-weight: 500;">
                <i class="fa-regular fa-hand-pointer"></i> Klik kartu untuk melihat rincian konten
              </span>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             SECTION 8: TACTICAL DEFCON BAROMETER (EARLY WARNING SYSTEM)
             =================================================================== -->
        <div class="early-warning-card" id="card-early-warning-barometer">
          <!-- Header Barometer -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 12px; background: rgba(2, 132, 199, 0.12); color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.1);">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.05rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  Sistem Peringatan Dini Pertahanan Kognitif (Barometer Peringatan Dini)
                  <span id="ews-status-pill" style="font-size: 0.65rem; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; padding: 2px 8px; border-radius: 9999px; font-weight: 700; letter-spacing: 0.04em;">PEMANTAUAN NORMAL</span>
                </div>
                <div style="font-size: 0.72rem; color: #64748b;">
                  Deteksi dini lonjakan anomali volume percakapan, eskalasi narasi polarisasi, dan pemetaan dinamika emosi publik
                </div>
              </div>
            </div>

            <!-- Action Controls -->
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <button id="btn-komando-inject-spike" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: var(--font-mono); border-radius: 10px; border: 1px solid #f59e0b; background: #fffbeb; color: #b45309; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(245, 158, 11, 0.1);" title="Uji ketahanan deteksi dini dengan simulasi lonjakan pesan">
                <i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> UJI LONJAKAN (SIMULASI)
              </button>
            </div>
          </div>

          <!-- Responsive Two-Column Grid -->
          <div class="early-warning-grid">
            
            <!-- LEFT PANEL: INDEKS DEFCON & TELEMETRI -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 18px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; min-width: 0;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <span style="font-size: 0.76rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-gauge-high" style="color: #0284c7;"></i> Indeks DEFCON Komando Siber
                  </span>
                  <span style="font-size: 0.68rem; color: #64748b; font-weight: 500;">Kesiapsiagaan & Aliran Pesan</span>
                </div>

                <!-- 5 DEFCON Scales (Clean, Responsive Grid) -->
                <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; font-family: var(--font-mono); text-align: center;" id="komando-defcon-scale-container">
                  <div class="defcon-scale-item" id="komando-scale-defcon-1" data-defcon="1" style="background: #ffffff; border: 1px solid #fca5a5; border-radius: 10px; padding: 8px 4px; color: #dc2626; cursor: pointer; transition: all 0.2s ease;" title="Klik untuk menguji DEFCON 1">
                    <div style="font-size: 0.72rem; font-weight: 800; line-height: 1.1;">DEFCON 1</div>
                    <div style="font-size: 0.58rem; font-weight: 700; margin-top: 2px;">KRITIS</div>
                  </div>
                  <div class="defcon-scale-item" id="komando-scale-defcon-2" data-defcon="2" style="background: #ffffff; border: 1px solid #fdba74; border-radius: 10px; padding: 8px 4px; color: #ea580c; cursor: pointer; transition: all 0.2s ease;" title="Klik untuk menguji DEFCON 2">
                    <div style="font-size: 0.72rem; font-weight: 800; line-height: 1.1;">DEFCON 2</div>
                    <div style="font-size: 0.58rem; font-weight: 700; margin-top: 2px;">BAHAYA</div>
                  </div>
                  <div class="defcon-scale-item" id="komando-scale-defcon-3" data-defcon="3" style="background: #ffffff; border: 1px solid #fcd34d; border-radius: 10px; padding: 8px 4px; color: #d97706; cursor: pointer; transition: all 0.2s ease;" title="Klik untuk menguji DEFCON 3">
                    <div style="font-size: 0.72rem; font-weight: 800; line-height: 1.1;">DEFCON 3</div>
                    <div style="font-size: 0.58rem; font-weight: 700; margin-top: 2px;">WASPADA</div>
                  </div>
                  <div class="defcon-scale-item" id="komando-scale-defcon-4" data-defcon="4" style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 8px 4px; color: #2563eb; cursor: pointer; transition: all 0.2s ease;" title="Klik untuk menguji DEFCON 4">
                    <div style="font-size: 0.72rem; font-weight: 800; line-height: 1.1;">DEFCON 4</div>
                    <div style="font-size: 0.58rem; font-weight: 700; margin-top: 2px;">SIAGA</div>
                  </div>
                  <div class="defcon-scale-item active-defcon" id="komando-scale-defcon-5" data-defcon="5" style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 10px; padding: 8px 4px; color: #047857; font-weight: 800; box-shadow: 0 3px 10px rgba(16, 185, 129, 0.2); cursor: pointer; transition: all 0.2s ease;" title="DEFCON 5 Normal (Aktif)">
                    <div style="font-size: 0.72rem; font-weight: 800; line-height: 1.1;">DEFCON 5</div>
                    <div style="font-size: 0.58rem; font-weight: 700; margin-top: 2px;">NORMAL</div>
                  </div>
                </div>
              </div>

              <!-- 3 Flexible Telemetry Micro-Cards -->
              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 4px;">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                  <span style="font-size: 0.65rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Velocity</span>
                  <span style="font-size: 0.95rem; font-weight: 700; color: #0284c7; font-family: var(--font-mono);" id="komando-val-velocity">38 PPM</span>
                  <span style="font-size: 0.58rem; color: #94a3b8;">Laju pesan/menit</span>
                </div>

                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                  <span style="font-size: 0.65rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Z-Score</span>
                  <span style="font-size: 0.95rem; font-weight: 700; color: #0f172a; font-family: var(--font-mono);" id="komando-val-zscore">0.84σ</span>
                  <span style="font-size: 0.58rem; color: #94a3b8;">Deviasi standar</span>
                </div>

                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                  <span style="font-size: 0.65rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Polarisasi</span>
                  <span style="font-size: 0.95rem; font-weight: 700; color: #d97706; font-family: var(--font-mono);" id="komando-val-polarisasi">28.5%</span>
                  <span style="font-size: 0.58rem; color: #94a3b8;">Keterbelahan opini</span>
                </div>
              </div>
            </div>

            <!-- RIGHT PANEL: SPEKTRUM EMOSI PUBLIK -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 6px; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.76rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-brain" style="color: #6366f1;"></i> Spektrum Emosi Publik
                </span>
                <span style="font-size: 0.65rem; background: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 9999px; font-weight: 600;">4 Dimensi Analisis</span>
              </div>

              <!-- Radar Container with flexible width and robust padding -->
              <div style="position: relative; width: 100%; height: 185px; min-height: 185px; display: flex; align-items: center; justify-content: center;">
                <div id="komando-radar-chart-container" style="width: 100%; height: 185px; min-width: 220px;"></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- =====================================================================
           MODAL 1: TOP HASHTAGS FULL DETAIL MODAL
           ===================================================================== -->
      <div id="modal-hashtag-detail" class="komando-modal-backdrop" style="display: none;">
        <div class="komando-modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(168,85,247,0.15); color: #c084fc; display: flex; align-items: center; justify-content: center;">
                <i class="fa-solid fa-hashtag"></i>
              </div>
              <div>
                <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: #fff;">
                  Rincian Penuh Top Hashtags
                </div>
                <div style="font-size: 0.72rem; color: #94a3b8;">
                  Peringkat tagar terpopuler dan analisis keterlibatan audiens
                </div>
              </div>
            </div>
            <button id="btn-close-hashtag-modal" class="btn-tactical" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 50%;">
              &times;
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.76rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.7rem; text-transform: uppercase;">
                  <th style="padding: 8px;">Peringkat</th>
                  <th style="padding: 8px;">Tagar</th>
                  <th style="padding: 8px; text-align: right;">Jumlah Postingan</th>
                  <th style="padding: 8px; text-align: right;">Interaksi</th>
                  <th style="padding: 8px; text-align: right;">Estimasi Jangkauan</th>
                  <th style="padding: 8px;">Sentimen</th>
                  <th style="padding: 8px; text-align: right;">Aksi</th>
                </tr>
              </thead>
              <tbody id="modal-hashtag-tbody">
                <!-- Injected via openHashtagModal() -->
              </tbody>
            </table>
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <button id="btn-dismiss-hashtag-modal" class="btn-tactical" style="padding: 6px 16px;">Tutup</button>
          </div>
        </div>
      </div>

      <!-- =====================================================================
           MODAL 2: AUTHOR PROFILE DETAIL MODAL
           ===================================================================== -->
      <div id="modal-author-profile" class="komando-modal-backdrop" style="display: none;">
        <div class="komando-modal-content" style="max-width: 580px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-id-card text-cyan"></i> Detail Profil Akun
            </div>
            <button id="btn-close-author-modal" class="btn-tactical" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 50%;">
              &times;
            </button>
          </div>

          <div id="modal-author-profile-body">
            <!-- Injected via openAuthorModal() -->
          </div>
        </div>
      </div>

      <!-- =====================================================================
           MODAL 3: WORD CLOUD TERM DETAIL MODAL
           ===================================================================== -->
      <div id="modal-word-detail" class="komando-modal-backdrop" style="display: none;">
        <div class="komando-modal-content" style="max-width: 500px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-spell-check text-cyan"></i> Analisis Frekuensi Kata
            </div>
            <button id="btn-close-word-modal" class="btn-tactical" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 50%;">
              &times;
            </button>
          </div>

          <div id="modal-word-detail-body">
            <!-- Injected via openWordModal() -->
          </div>
        </div>
      </div>

      <!-- =====================================================================
           MODAL 4: VIRALITY DETAIL MODAL
           ===================================================================== -->
      <div id="modal-virality-detail" class="komando-modal-backdrop" style="display: none;">
        <div class="komando-modal-content" style="max-width: 620px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-fire text-amber"></i> Rincian Konten Viralitas
            </div>
            <button id="btn-close-virality-modal" class="btn-tactical" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 50%;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div id="modal-virality-detail-body">
            <!-- Injected via openViralityModal() -->
          </div>
        </div>
      </div>
      <!-- =====================================================================
           MODAL 5: TOP PERFORMANCE CONTENT DETAIL MODAL
           ===================================================================== -->
      <div id="modal-perf-detail" class="komando-modal-backdrop" style="display: none;">
        <div class="komando-modal-content" style="max-width: 640px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
            <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-chart-simple text-cyan"></i> Rincian Performa Konten Teratas
            </div>
            <button id="btn-close-perf-modal" class="btn-tactical" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 50%;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div id="modal-perf-detail-body">
            <!-- Injected via openPerformanceModal() -->
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderHashtagRows();
    this.renderAuthorTable();
    this.renderWordCloud();
    this.renderAccountTypeDistribution();
    this.renderViralityTracker();
    this.renderPerformanceContent();
    this.initCharts();
    renderLucideIcons(this.container);
  }

  bindEvents() {
    // 1. Refresh Button
    const btnRefresh = this.container.querySelector('#btn-dash-refresh-all');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        btnRefresh.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> REFRESHING...';
        setTimeout(() => {
          btnRefresh.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> REFRESH';
          this.initCharts();
          this.renderHashtagRows();
          this.renderAuthorTable();
          this.renderWordCloud();
        }, 500);
      };
    }

    // 2. DEFCON Spike Injection & Interactive Scale Bar
    const btnSpike = this.container.querySelector('#btn-komando-inject-spike');
    if (btnSpike) {
      btnSpike.onclick = async () => {
        btnSpike.disabled = true;
        btnSpike.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MENYUNTIK...';
        // Feedback visual langsung saat spike disuntikkan
        this.setDefconLevel(1, { currentVelocity: 185, spikeIndex: 4.35, polarizationIndex: 78.5, emotionRadar: [85, 78, 14, 60] });
        try {
          await ApiService.injectSpike();
        } catch (e) {
          console.warn('Gagal inject spike:', e);
        } finally {
          setTimeout(() => {
            btnSpike.disabled = false;
            btnSpike.innerHTML = '<i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> UJI LONJAKAN SPIKE';
          }, 1200);
        }
      };
    }

    // Klik interaktif pada pill skala DEFCON
    const defconPills = this.container.querySelectorAll('#komando-defcon-scale-container .defcon-scale-item');
    defconPills.forEach((pill) => {
      pill.onclick = () => {
        const lvl = parseInt(pill.dataset.defcon, 10);
        if (lvl) {
          this.setDefconLevel(lvl);
        }
      };
    });

    // Subskripsi state global CognitiveStore untuk pembaruan telemetri EWS otomatis
    this.subscribeToStore();

    // 3. Top Hashtags: Metric Switcher (Post vs Engagement)
    const hashtagSegBtns = this.container.querySelectorAll('#ctrl-hashtag-metric .dash-seg-btn');
    hashtagSegBtns.forEach((btn) => {
      btn.onclick = () => {
        hashtagSegBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedHashtagMetric = btn.dataset.metric;
        this.renderHashtagRows();
      };
    });

    // 4. Top Hashtags: Detail Modal Button
    const btnHashtagDetail = this.container.querySelector('#btn-hashtag-detail');
    if (btnHashtagDetail) {
      btnHashtagDetail.onclick = () => this.openHashtagModal();
    }

    // 5. Top Authors: Metric Switcher (Engagement vs Post)
    const authorSegBtns = this.container.querySelectorAll('#ctrl-author-metric .dash-seg-btn');
    authorSegBtns.forEach((btn) => {
      btn.onclick = () => {
        authorSegBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedAuthorMetric = btn.dataset.metric;
        this.authorSortCol = btn.dataset.metric;
        this.authorSortAsc = false;
        this.filterAndRenderAuthors();
      };
    });

    // 6. Top Authors: Channel Dropdown Filter
    const channelSelect = this.container.querySelector('#author-channel-select');
    if (channelSelect) {
      channelSelect.onchange = (e) => {
        this.selectedAuthorChannel = e.target.value;
        this.filterAndRenderAuthors();
      };
    }

    // 7. Top Authors: Column Sorting
    const sortHeaders = this.container.querySelectorAll('.sortable-author-col');
    sortHeaders.forEach((th) => {
      th.onclick = () => {
        const col = th.dataset.col;
        if (this.authorSortCol === col) {
          this.authorSortAsc = !this.authorSortAsc;
        } else {
          this.authorSortCol = col;
          this.authorSortAsc = false;
        }
        this.filterAndRenderAuthors();
      };
    });

    // 8. Top Words: Metric Switcher (Mention vs Engagement)
    const wordSegBtns = this.container.querySelectorAll('#ctrl-word-metric .dash-seg-btn');
    wordSegBtns.forEach((btn) => {
      btn.onclick = () => {
        wordSegBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedWordMetric = btn.dataset.metric;
        this.renderWordCloud();
      };
    });

    // 9. Top Words: Platform Pills
    const wordPlatPills = this.container.querySelectorAll('#ctrl-word-platforms .dash-plat-pill');
    wordPlatPills.forEach((pill) => {
      pill.onclick = () => {
        this.selectWordPlatform(pill.dataset.platform);
      };
    });

    // Virality Tracker: Category Badges
    const virCatBadges = this.container.querySelectorAll('.virality-cat-badge');
    virCatBadges.forEach((b) => {
      b.onclick = () => {
        virCatBadges.forEach((btn) => btn.classList.remove('active'));
        b.classList.add('active');
        this.selectedViralityCategory = b.dataset.cat;
        this.renderAccountTypeDistribution();
    this.renderViralityTracker();
      };
    });

    // Virality Tracker: Platform Dropdown
    const virPlatSelect = this.container.querySelector('#virality-platform-select');
    if (virPlatSelect) {
      virPlatSelect.onchange = (e) => {
        this.selectedViralityPlatform = e.target.value;
        this.renderAccountTypeDistribution();
    this.renderViralityTracker();
      };
    }

    // Virality Tracker: Sort Dropdown
    const virSortSelect = this.container.querySelector('#virality-sort-select');
    if (virSortSelect) {
      virSortSelect.onchange = (e) => {
        this.viralitySort = e.target.value;
        this.renderAccountTypeDistribution();
    this.renderViralityTracker();
      };
    }

    // Virality Tracker: Search Input
    const virSearchInput = this.container.querySelector('#virality-search-input');
    if (virSearchInput) {
      virSearchInput.oninput = (e) => {
        this.viralitySearchQuery = e.target.value;
        this.renderAccountTypeDistribution();
    this.renderViralityTracker();
      };
    }

    // Virality Detail Modal Close
    const closeViralityBtn = this.container.querySelector('#btn-close-virality-modal');
    if (closeViralityBtn) closeViralityBtn.onclick = () => this.closeModals();

    // 10. Modal Close Handlers
    const closeHashtagBtn = this.container.querySelector('#btn-close-hashtag-modal');
    const dismissHashtagBtn = this.container.querySelector('#btn-dismiss-hashtag-modal');
    if (closeHashtagBtn) closeHashtagBtn.onclick = () => this.closeModals();
    if (dismissHashtagBtn) dismissHashtagBtn.onclick = () => this.closeModals();

    const closeAuthorBtn = this.container.querySelector('#btn-close-author-modal');
    if (closeAuthorBtn) closeAuthorBtn.onclick = () => this.closeModals();

    const closeWordBtn = this.container.querySelector('#btn-close-word-modal');
    if (closeWordBtn) closeWordBtn.onclick = () => this.closeModals();


    // 9. Top Performance Content Controls
    const perfMetricBtns = this.container.querySelectorAll('#ctrl-perf-metric .dash-seg-btn');
    perfMetricBtns.forEach((btn) => {
      btn.onclick = () => {
        perfMetricBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedPerformanceMetric = btn.dataset.metric;
        this.renderPerformanceContent();
      };
    });

    const perfCampSelect = this.container.querySelector('#perf-campaign-select');
    if (perfCampSelect) {
      perfCampSelect.onchange = (e) => {
        this.selectedPerformanceCampaign = e.target.value;
        this.renderPerformanceContent();
      };
    }

    const perfChanSelect = this.container.querySelector('#perf-channel-select');
    if (perfChanSelect) {
      perfChanSelect.onchange = (e) => {
        this.selectedPerformanceChannel = e.target.value;
        this.renderPerformanceContent();
      };
    }

    const btnClosePerfModal = this.container.querySelector('#btn-close-perf-modal');
    if (btnClosePerfModal) {
      btnClosePerfModal.onclick = () => {
        const m = this.container.querySelector('#modal-perf-detail');
        if (m) m.style.display = 'none';
      };
    }

    // Close on backdrop click
    const backdrops = this.container.querySelectorAll('.komando-modal-backdrop');
    backdrops.forEach((bd) => {
      bd.onclick = (e) => {
        if (e.target === bd) this.closeModals();
      };
    });
  }

  /* =========================================================================
     TOP PERFORMANCE CONTENT LOGIC & RENDERING
     ========================================================================= */
  renderPerformanceContent() {
    const grid = this.container.querySelector('#perf-content-grid');
    const countLabel = this.container.querySelector('#perf-count-label');
    if (!grid) return;

    const list = filterAndSortPerformanceContent(performanceContentData, {
      campaign: this.selectedPerformanceCampaign,
      channel: this.selectedPerformanceChannel,
      metric: this.selectedPerformanceMetric
    });

    if (countLabel) {
      countLabel.textContent = `Menampilkan ${list.length} konten teratas`;
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
          <i class="fa-solid fa-filter-circle-xmark" style="font-size: 2rem; color: #64748b; margin-bottom: 10px;"></i>
          <div style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #cbd5e1;">Tidak ada konten yang sesuai dengan filter</div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">Coba ubah pilihan Campaign atau Channel untuk melihat konten lainnya.</div>
          <button id="btn-reset-perf-filters" class="btn-tactical cyan" style="margin-top: 14px; padding: 6px 16px; font-size: 0.74rem;">
            <i class="fa-solid fa-rotate-left"></i> Reset Filter
          </button>
        </div>
      `;

      const resetBtn = grid.querySelector('#btn-reset-perf-filters');
      if (resetBtn) {
        resetBtn.onclick = () => {
          this.selectedPerformanceCampaign = 'All Campaign';
          this.selectedPerformanceChannel = 'All Channel';
          this.selectedPerformanceMetric = 'Engagement';
          const campSelect = this.container.querySelector('#perf-campaign-select');
          const chanSelect = this.container.querySelector('#perf-channel-select');
          if (campSelect) campSelect.value = 'All Campaign';
          if (chanSelect) chanSelect.value = 'All Channel';
          const btns = this.container.querySelectorAll('#ctrl-perf-metric .dash-seg-btn');
          btns.forEach((b) => {
            if (b.dataset.metric === 'Engagement') b.classList.add('active');
            else b.classList.remove('active');
          });
          this.renderPerformanceContent();
        };
      }
      return;
    }

    grid.innerHTML = list.map((item) => {
      const rank = item.dynamicRank;
      const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
      const platClass = 'plat-' + item.platformCode.toLowerCase();
      const sentClass = item.sentiment.toLowerCase();

      return `
        <div class="perf-item-card" data-id="${item.id}" title="Klik untuk melihat rincian performa lengkap">
          <!-- Thumbnail Box (16:9) with Overlays -->
          <div class="perf-thumb-box" style="background: ${item.thumbGradient};">
            <div style="text-align: center; color: rgba(255,255,255,0.45); user-select: none;">
              <i class="${item.thumbIcon}" style="font-size: 1.6rem; opacity: 0.85;"></i>
              <div style="font-size: 0.55rem; color: rgba(255,255,255,0.5); font-weight: 600; margin-top: 2px;">${item.thumbTheme}</div>
            </div>

            <!-- 1. Ranking Badge Top-Left -->
            <div class="perf-rank-pill ${rankClass}">
              ${rank}
            </div>

            <!-- 2. Platform Badge Top-Right -->
            <div class="perf-plat-pill ${platClass}">
              ${item.platformCode}
            </div>

            <!-- 3. Video Play Icon if applicable -->
            ${item.isVideo ? '<div class="perf-play-btn"><i class="fa-solid fa-play"></i></div>' : ''}

            <!-- 4. Sentiment Badge Bottom-Left -->
            <div class="perf-sent-pill ${sentClass}">
              <i class="fa-solid fa-circle" style="font-size: 0.38rem;"></i>
              <span>${item.sentimentLabel}</span>
            </div>
          </div>

          <!-- Account Meta & Caption Body -->
          <div class="perf-body">
            <div class="perf-meta-row">
              <span class="perf-username" title="${item.username}">${item.username}</span>
              <span class="perf-date">${item.publishedAt}</span>
            </div>
            <div class="perf-caption-box" title="${item.caption}">
              ${item.caption}
            </div>
          </div>

          <!-- Performance Metrics Footer (3 columns) -->
          <div class="perf-metric-footer">
            <div class="perf-metric-col">
              <span class="perf-metric-lbl">Eng</span>
              <span class="perf-metric-val ${this.selectedPerformanceMetric === 'Engagement' ? 'highlight' : ''}">${item.engagementStr}</span>
            </div>
            <div class="perf-metric-col">
              <span class="perf-metric-lbl">Views</span>
              <span class="perf-metric-val ${this.selectedPerformanceMetric === 'Views' ? 'highlight' : ''}">${item.viewsStr}</span>
            </div>
            <div class="perf-metric-col">
              <span class="perf-metric-lbl">ER%</span>
              <span class="perf-metric-val ${this.selectedPerformanceMetric === 'ER%' ? 'highlight' : ''}" style="${item.engagementRate ? 'color: #38bdf8;' : ''}">${item.erStr}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click handlers
    const cards = grid.querySelectorAll('.perf-item-card');
    cards.forEach((card) => {
      card.onclick = () => {
        const id = card.dataset.id;
        this.openPerformanceModal(id);
      };
    });
  }

  openPerformanceModal(id) {
    const modal = this.container.querySelector('#modal-perf-detail');
    const body = this.container.querySelector('#modal-perf-detail-body');
    if (!modal || !body) return;

    const item = performanceContentData.find((p) => p.id === id) || performanceContentData[0];
    const platClass = 'plat-' + item.platformCode.toLowerCase();

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Top Media Canvas -->
        <div style="width: 100%; height: 160px; border-radius: 12px; background: ${item.thumbGradient}; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.4);">
          <div style="text-align: center; color: rgba(255,255,255,0.7);">
            <i class="${item.thumbIcon}" style="font-size: 2.4rem; margin-bottom: 6px; opacity: 0.85;"></i>
            <div style="font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; color: #fff;">${item.thumbTheme}</div>
            <div style="font-size: 0.68rem; color: rgba(255,255,255,0.6);">${item.platform} Media Preview</div>
          </div>
          <span class="perf-plat-pill ${platClass}" style="position: absolute; top: 10px; right: 10px; font-size: 0.75rem;">
            ${item.platformCode}
          </span>
          <span class="perf-sent-pill ${item.sentiment.toLowerCase()}" style="position: absolute; bottom: 10px; left: 10px; font-size: 0.65rem;">
            <i class="fa-solid fa-circle" style="font-size: 0.45rem;"></i> Sentimen: ${item.sentimentLabel}
          </span>
          ${item.isVideo ? '<div class="perf-play-btn" style="width: 40px; height: 40px; font-size: 0.95rem;"><i class="fa-solid fa-play"></i></div>' : ''}
        </div>

        <!-- Author & Campaign Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          <div>
            <div style="font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: #38bdf8;">
              ${item.username}
            </div>
            <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">
              Dipublikasikan pada <strong style="color: #cbd5e1;">${item.publishedAt}</strong> &bull; Kanal: <strong style="color: #fff;">${item.channel}</strong>
            </div>
          </div>
          <span style="background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; font-size: 0.68rem; padding: 4px 10px; border-radius: 9999px; font-weight: 600;">
            <i class="fa-solid fa-bullseye"></i> ${item.campaign}
          </span>
        </div>

        <!-- Full Caption Preview -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; font-size: 0.8rem; color: #f1f5f9; line-height: 1.5;">
          ${item.caption}
        </div>

        <!-- Performance Metrics 3-Card Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
          <div style="background: #f8fafc; padding: 10px 8px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 600;">ENGAGEMENT</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #38bdf8; font-family: var(--font-mono); margin-top: 2px;">${item.engagementStr}</div>
          </div>
          <div style="background: #f8fafc; padding: 10px 8px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 600;">TOTAL VIEWS</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #cbd5e1; font-family: var(--font-mono); margin-top: 2px;">${item.viewsStr}</div>
          </div>
          <div style="background: #f8fafc; padding: 10px 8px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 600;">ENGAGEMENT RATE (ER%)</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: ${item.engagementRate ? '#c084fc' : '#94a3b8'}; font-family: var(--font-mono); margin-top: 2px;">${item.erStr}</div>
          </div>
        </div>

        <!-- Action Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 4px;">
          <span style="font-size: 0.68rem; color: #64748b;">
            <i class="fa-solid fa-shield-halved text-cyan"></i> Data terverifikasi sistem pemantauan KOMANDO
          </span>
          <button class="btn-tactical cyan" onclick="window.router && window.router.navigate('/pelacak-akun-medsos', { query: '${item.username}' }); document.getElementById('modal-perf-detail').style.display='none';" style="padding: 7px 16px; font-size: 0.74rem;">
            <i class="fa-solid fa-magnifying-glass"></i> Lacak Akun Ini di Pelacak Medsos
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  /* =========================================================================
     ACCOUNT TYPE DISTRIBUTION LOGIC & RENDERING
     ========================================================================= */
  renderAccountTypeDistribution() {
    const container = this.container.querySelector('#acct-type-rows-container');
    const badgeEl = this.container.querySelector('#acct-total-categorized-badge');
    if (!container) return;

    const { categories, totalCategorizedPosts } = getAccountTypeComputed(this.accountTypeData);

    if (badgeEl) {
      badgeEl.textContent = `${totalCategorizedPosts} postingan terkategori`;
    }

    container.innerHTML = categories.map((cat) => {
      return `
        <div class="acct-type-row">
          <!-- Left Column: Icon Tile, Name, Progress Bar, Percentage -->
          <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
            <div class="acct-icon-tile" style="background: ${cat.bgColor}; color: ${cat.color};">
              <i class="${cat.icon}"></i>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 5px; overflow: hidden;">
              <div style="font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; color: #0f172a;">
                ${cat.name}
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="flex: 1; height: 10px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                  <div style="width: ${cat.percentage}%; height: 100%; background: ${cat.gradient || cat.color}; border-radius: 9999px; transition: width 0.5s ease;"></div>
                </div>
                <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: #0f172a; min-width: 44px; text-align: right;">
                  ${cat.percentageStr}
                </span>
              </div>
            </div>
          </div>

          <!-- Right Column: Instagram, TikTok, Total Posts -->
          <div class="acct-stat-card">
            <div class="acct-stat-col">
              <span class="acct-stat-val" style="color: #0f172a;">${cat.instagramPosts}</span>
              <span class="acct-stat-lbl">Instagram</span>
            </div>
            <div class="acct-stat-col">
              <span class="acct-stat-val" style="color: #0f172a;">${cat.tiktokPosts}</span>
              <span class="acct-stat-lbl">TikTok</span>
            </div>
            <div class="acct-stat-col">
              <span class="acct-stat-val" style="color: ${cat.color};">${cat.totalPosts}</span>
              <span class="acct-stat-lbl" style="color: ${cat.color}; font-weight: 700;">Total</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* =========================================================================
     VIRALITY TRACKER LOGIC & RENDERING
     ========================================================================= */
  renderViralityTracker() {
    const listContainer = this.container.querySelector('#virality-items-list');
    const countEl = this.container.querySelector('#virality-count-indicator');
    if (!listContainer) return;

    let items = [...viralityMockData];

    // Filter by Category
    if (this.selectedViralityCategory && this.selectedViralityCategory !== 'ALL') {
      items = items.filter((i) => i.category === this.selectedViralityCategory);
    }

    // Filter by Platform
    if (this.selectedViralityPlatform && this.selectedViralityPlatform !== 'All') {
      items = items.filter((i) => i.platform.toLowerCase() === this.selectedViralityPlatform.toLowerCase());
    }

    // Filter by Search Query
    if (this.viralitySearchQuery && this.viralitySearchQuery.trim()) {
      const q = this.viralitySearchQuery.toLowerCase().trim();
      items = items.filter((i) => i.headline.toLowerCase().includes(q) || i.author.toLowerCase().includes(q));
    }

    // Sort
    if (this.viralitySort === 'engagement') {
      items.sort((a, b) => b.engagement - a.engagement);
    } else if (this.viralitySort === 'latest') {
      items.sort((a, b) => parseInt(a.timeAgo) - parseInt(b.timeAgo));
    } else {
      // Default: Virality Score
      items.sort((a, b) => b.viralityScore - a.viralityScore);
    }

    // Exactly 10 items
    const displayList = items.slice(0, 10);

    if (countEl) {
      countEl.textContent = `${displayList.length} konten ditampilkan`;
    }

    if (displayList.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; color: #64748b; font-style: italic; padding: 32px;">
          Tidak ada konten viral yang cocok dengan kriteria filter saat ini.
        </div>
      `;
      return;
    }

    listContainer.innerHTML = displayList.map((item, idx) => {
      const rank = idx + 1;
      const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
      const platClass = 'plat-' + item.platformCode.toLowerCase();

      return `
        <div class="viral-item-row" data-id="${item.id}" title="Klik untuk melihat rincian narasi" style="grid-template-columns: 32px 32px 1fr 100px 65px; gap: 8px; padding: 7px 10px;">
          <!-- 1. Ranking Circle -->
          <div class="viral-rank-circle ${rankClass}" style="width: 32px; height: 32px; font-size: 0.85rem;">
            ${rank}
          </div>

          <!-- 2. Platform Badge -->
          <div class="viral-platform-badge ${platClass}" style="width: 32px; height: 32px; font-size: 0.72rem;" title="${item.platform}">
            ${item.platformCode}
          </div>

          <!-- 3. Headline & Meta -->
          <div style="display: flex; flex-direction: column; gap: 2px; overflow: hidden; cursor: pointer;">
            <div style="font-weight: 700; color: #0f172a; font-size: 0.78rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;" class="viral-headline-link" data-id="${item.id}">
              ${item.headline}
            </div>
            <div style="font-size: 0.64rem; color: #64748b; display: flex; align-items: center; gap: 6px;">
              <span style="color: #2563eb; font-weight: 600;">${item.author}</span>
              <span>&bull;</span>
              <span>${item.timeAgo}</span>
            </div>
          </div>

          <!-- 4. Virality Progress Bar & Large Score -->
          <div class="viral-score-col" style="display: flex; align-items: center; gap: 6px;">
            <div style="flex: 1;" class="virality-progress-wrap">
              <div style="display: flex; justify-content: space-between; font-size: 0.6rem; color: #94a3b8;">
                <span>Score</span>
                <span style="color: #f87171; font-weight: 700;">${item.viralityScore}</span>
              </div>
              <div class="virality-bar-track" style="height: 6px;">
                <div class="virality-bar-fill" style="width: ${item.viralityScore}%;"></div>
              </div>
            </div>
          </div>

          <!-- 5. Engagement Count -->
          <div class="viral-eng-col" style="text-align: right;">
            <div style="font-family: var(--font-mono); font-size: 0.95rem; font-weight: 800; color: #0f172a; line-height: 1;">
              ${item.engagementStr}
            </div>
            <div style="font-size: 0.58rem; color: #2563eb; font-weight: 600; text-transform: uppercase;">
              eng
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers to open Virality Modal
    const rows = listContainer.querySelectorAll('.viral-item-row');
    rows.forEach((row) => {
      row.onclick = () => {
        const id = row.dataset.id;
        this.openViralityModal(id);
      };
    });
  }

  openViralityModal(id) {
    const modal = this.container.querySelector('#modal-virality-detail');
    const body = this.container.querySelector('#modal-virality-detail-body');
    if (!modal || !body) return;

    const item = viralityMockData.find((i) => i.id === id) || viralityMockData[0];

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="viral-platform-badge plat-${item.platformCode.toLowerCase()}" style="width: 32px; height: 32px; font-size: 0.75rem;">
              ${item.platformCode}
            </span>
            <div>
              <span style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">${item.platform}</span>
              <span style="font-size: 0.7rem; color: #94a3b8; margin-left: 6px;">${item.author}</span>
            </div>
          </div>
          <span class="tag-badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239, 68, 68, 0.3); font-size: 0.68rem;">
            ${item.category} &bull; Skor ${item.viralityScore}
          </span>
        </div>

        <div style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #0f172a; line-height: 1.4;">
          ${item.headline}
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-size: 0.78rem; color: #334155; line-height: 1.5;">
          ${item.preview}
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
          <div style="background: #f8fafc; padding: 10px 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8;">ENGAGEMENT</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #2563eb; margin-top: 2px;">${item.engagementStr}</div>
          </div>
          <div style="background: #f8fafc; padding: 10px 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8;">SHARES / RETWEET</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #9333ea; margin-top: 2px;">${item.sharesStr}</div>
          </div>
          <div style="background: #f8fafc; padding: 10px 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8;">VIRALITY SCORE</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #ef4444; margin-top: 2px;">${item.viralityScore}/100</div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
          <span style="font-size: 0.7rem; color: #64748b;">Tagar Terkait:</span>
          ${item.hashtags.map((tag) => `
            <span style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25); padding: 2px 8px; border-radius: 9999px; font-size: 0.68rem; font-family: var(--font-mono);">
              ${tag}
            </span>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 6px;">
          <span style="font-size: 0.7rem; color: #64748b;">
            <i class="fa-regular fa-clock"></i> Dipublikasikan ${item.timeAgo}
          </span>
          <button class="btn-tactical cyan" onclick="window.router && window.router.navigate('/pelacak-akun-medsos', { query: '${item.author}' }); document.getElementById('modal-virality-detail').style.display='none';" style="padding: 7px 16px; font-size: 0.74rem;">
            <i class="fa-solid fa-magnifying-glass"></i> Lacak Akun Sumber di Pelacak Medsos
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  /* =========================================================================
     TOP HASHTAGS LOGIC & RENDERING
     ========================================================================= */
  renderHashtagRows() {
    const listContainer = this.container.querySelector('#hashtag-ranking-list');
    if (!listContainer) return;

    let data = hashtagData[this.selectedHashtagMetric] || hashtagData.post;
    // Always sort by active metric value descending and display top 10
    data = [...data].sort((a, b) => b.count - a.count).slice(0, 10);
    const maxVal = data[0] ? data[0].count : 1;

    listContainer.innerHTML = data.map((item, idx) => {
      const percentage = Math.max(16, Math.round((item.count / maxVal) * 100));
      return `
        <div style="display: flex; align-items: center; gap: 10px; font-size: 0.74rem; padding: 1px 0;">
          <!-- Rank Number (1-10) -->
          <span style="font-family: var(--font-mono); font-weight: 700; color: #64748b; width: 20px; text-align: right; flex-shrink: 0;">
            ${idx + 1}
          </span>

          <!-- Hashtag Label -->
          <span style="font-weight: 600; color: #1e293b; width: 135px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; cursor: pointer;" title="${item.tag}">
            ${item.tag}
          </span>

          <!-- Horizontal Progress Bar (Blue-to-Cyan Gradient) & Numeric Value -->
          <div style="flex: 1; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 9999px; height: 25px; position: relative; overflow: hidden; display: flex; align-items: center;">
            <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%); border-radius: 9999px; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);"></div>
            <span style="position: absolute; right: 12px; font-family: var(--font-mono); font-size: 0.74rem; font-weight: 700; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
              ${item.displayVal}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  openHashtagModal() {
    const modal = this.container.querySelector('#modal-hashtag-detail');
    const tbody = this.container.querySelector('#modal-hashtag-tbody');
    if (!modal || !tbody) return;

    const data = hashtagData[this.selectedHashtagMetric] || hashtagData.post;
    tbody.innerHTML = data.map((item, idx) => `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
        <td style="padding: 10px 8px; font-weight: 700; color: var(--color-cyan);">${idx + 1}</td>
        <td style="padding: 10px 8px; font-weight: 700; color: #fff;">${item.tag}</td>
        <td style="padding: 10px 8px; text-align: right; font-family: var(--font-mono); color: #38bdf8;">${item.displayVal}</td>
        <td style="padding: 10px 8px; text-align: right; font-family: var(--font-mono); color: #a855f7;">${item.reach}</td>
        <td style="padding: 10px 8px; text-align: right; font-family: var(--font-mono); color: #10b981;">~${item.reach}</td>
        <td style="padding: 10px 8px;">
          <span class="tag-badge ${item.sentiment === 'Negatif' ? 'bot' : 'valid'}" style="font-size: 0.62rem;">
            ${item.sentiment}
          </span>
        </td>
        <td style="padding: 10px 8px; text-align: right;">
          <button class="btn-tactical" onclick="window.router && window.router.navigate('/pelacak-akun-medsos', { query: '${item.tag}' })" style="padding: 3px 8px; font-size: 0.65rem;">
            Lacak
          </button>
        </td>
      </tr>
    `).join('');

    modal.style.display = 'flex';
  }

  /* =========================================================================
     TOP AUTHORS LOGIC & RENDERING
     ========================================================================= */
  filterAndRenderAuthors() {
    let list = [...authorData];

    // Filter by Channel
    if (this.selectedAuthorChannel !== 'All Channel') {
      list = list.filter((a) => a.channel.toLowerCase() === this.selectedAuthorChannel.toLowerCase());
    }

    // Sort by Column
    list.sort((a, b) => {
      let valA, valB;
      if (this.authorSortCol === 'author') {
        valA = a.author.toLowerCase();
        valB = b.author.toLowerCase();
        return this.authorSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (this.authorSortCol === 'followers') {
        valA = a.followers;
        valB = b.followers;
      } else if (this.authorSortCol === 'engagement') {
        valA = a.engagement;
        valB = b.engagement;
      } else if (this.authorSortCol === 'post') {
        valA = a.post;
        valB = b.post;
      } else if (this.authorSortCol === 'er') {
        valA = a.erNum;
        valB = b.erNum;
      } else {
        // default rank: sort by active metric
        if (this.selectedAuthorMetric === 'post') {
          valA = a.post;
          valB = b.post;
        } else {
          valA = a.engagement;
          valB = b.engagement;
        }
      }

      return this.authorSortAsc ? valA - valB : valB - valA;
    });

    this.currentAuthorList = list;
    this.renderAuthorTable();
  }

  renderAuthorTable() {
    const tbody = this.container.querySelector('#top-authors-tbody');
    const countEl = this.container.querySelector('#author-table-count');
    if (!tbody) return;

    if (this.currentAuthorList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 24px; color: #94a3b8; font-style: italic;">
            Tidak ada akun yang cocok dengan filter "${this.selectedAuthorChannel}".
          </td>
        </tr>
      `;
      if (countEl) countEl.textContent = '0 akun';
      return;
    }

    // Display up to 10 accounts
    const displayList = this.currentAuthorList.slice(0, 10);

    if (countEl) {
      countEl.textContent = `${displayList.length} akun ditampilkan (dari total ${this.currentAuthorList.length})`;
    }

    tbody.innerHTML = displayList.map((item, idx) => {
      const channelClass = this.getChannelBadgeClass(item.channel);
      const initials = item.author.substring(0, 2).toUpperCase();

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
          <!-- 1. Rank (#) -->
          <td style="padding: 8px 6px; font-family: var(--font-mono); font-weight: 700; color: #64748b; text-align: center;">
            ${idx + 1}
          </td>

          <!-- 2. Avatar (Separated Column) -->
          <td style="padding: 8px 6px; text-align: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${item.avatarColor || '#3b82f6'}; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.15);" class="author-profile-link" data-author="${item.author}" title="Klik untuk melihat profil ${item.author}">
              ${initials}
            </div>
          </td>

          <!-- 3. Author / Username -->
          <td style="padding: 8px 10px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="font-weight: 700; color: #0f172a; cursor: pointer;" class="author-profile-link" data-author="${item.author}" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#0f172a'">
                ${item.author}
              </span>
              ${item.verified ? '<i class="fa-solid fa-circle-check" style="color: #2563eb; font-size: 0.72rem;" title="Official Account"></i>' : ''}
            </div>
          </td>

          <!-- 4. Channel Badge -->
          <td style="padding: 8px 10px;">
            <span class="${channelClass}">
              ${item.channel}
            </span>
          </td>

          <!-- 5. Followers -->
          <td style="padding: 8px 10px; text-align: right; font-family: var(--font-mono); color: #64748b;">
            ${item.followersStr}
          </td>

          <!-- 6. Engagement -->
          <td style="padding: 8px 10px; text-align: right; font-family: var(--font-mono); font-weight: 700; color: #2563eb;">
            ${item.engagementStr}
          </td>

          <!-- 7. Post -->
          <td style="padding: 8px 10px; text-align: right; font-family: var(--font-mono); color: #334155;">
            ${item.post}
          </td>

          <!-- 8. ER% -->
          <td style="padding: 8px 10px; text-align: right; font-family: var(--font-mono); font-weight: 700; color: #10b981;">
            ${item.er}
          </td>
        </tr>
      `;
    }).join('');

    // Attach click events on author profile links
    const profileLinks = tbody.querySelectorAll('.author-profile-link');
    profileLinks.forEach((link) => {
      link.onclick = () => {
        const authorName = link.dataset.author;
        this.openAuthorModal(authorName);
      };
    });
  }

  getChannelBadgeClass(channel) {
    const c = (channel || '').toLowerCase();
    if (c.includes('threads')) return 'badge-channel-threads';
    if (c.includes('tiktok')) return 'badge-channel-tiktok';
    if (c.includes('instagram')) return 'badge-channel-instagram';
    if (c.includes('twitter') || c.includes('x')) return 'badge-channel-twitter';
    if (c.includes('facebook')) return 'badge-channel-facebook';
    if (c.includes('youtube')) return 'badge-channel-youtube';
    return 'badge-channel-threads';
  }

  openAuthorModal(authorName) {
    const modal = this.container.querySelector('#modal-author-profile');
    const body = this.container.querySelector('#modal-author-profile-body');
    if (!modal || !body) return;

    const author = authorData.find((a) => a.author === authorName) || {
      author: authorName,
      channel: 'Platform Medsos',
      followersStr: '124.500',
      engagementStr: '32.100',
      post: 2,
      er: '4.8%',
      bio: 'Profil teridentifikasi aktif dalam jejaring percakapan narasi.',
      location: 'Indonesia'
    };

    const initials = author.author.substring(0, 2).toUpperCase();

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 14px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: ${author.avatarColor || '#2563eb'}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: #fff;">
            ${initials}
          </div>
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 6px;">
              ${author.author}
              ${author.verified ? '<i class="fa-solid fa-circle-check" style="color:#38bdf8; font-size: 0.9rem;"></i>' : ''}
            </div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
              Saluran: <strong style="color: #cbd5e1;">${author.channel}</strong> &bull; Wilayah: <strong style="color: #cbd5e1;">${author.location || 'Nasional'}</strong>
            </div>
          </div>
        </div>

        <div style="font-size: 0.76rem; color: #cbd5e1; background: #f1f5f9; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; border-left: 3px solid #3b82f6;">
          <em>"${author.bio || 'Tidak ada deskripsi profil publik.'}"</em>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;">
          <div style="background: #f8fafc; padding: 10px 6px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8;">PENGIKUT</div>
            <div style="font-size: 1rem; font-weight: 700; color: #38bdf8; margin-top: 2px;">${author.followersStr}</div>
          </div>
          <div style="background: #f8fafc; padding: 10px 6px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8;">INTERAKSI</div>
            <div style="font-size: 1rem; font-weight: 700; color: #10b981; margin-top: 2px;">${author.engagementStr}</div>
          </div>
          <div style="background: #f8fafc; padding: 10px 6px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8;">POSTINGAN</div>
            <div style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${author.post}</div>
          </div>
          <div style="background: #f8fafc; padding: 10px 6px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.65rem; color: #94a3b8;">RASIO ER%</div>
            <div style="font-size: 1rem; font-weight: 700; color: #a855f7; margin-top: 2px;">${author.er}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;">
          <button class="btn-tactical cyan" onclick="window.router && window.router.navigate('/pelacak-akun-medsos', { query: '${author.author}' }); document.getElementById('modal-author-profile').style.display='none';" style="padding: 7px 16px; font-size: 0.74rem;">
            <i class="fa-solid fa-magnifying-glass"></i> Lacak Akun Ini di Pelacak Medsos
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  /* =========================================================================
     TOP WORDS LOGIC & RENDERING
     ========================================================================= */
  selectWordPlatform(platformName) {
    this.selectedWordPlatform = platformName;
    const wordPlatPills = this.container.querySelectorAll('#ctrl-word-platforms .dash-plat-pill');
    wordPlatPills.forEach((p) => {
      if (p.dataset.platform.toLowerCase() === platformName.toLowerCase()) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    this.renderWordCloud();
  }

  renderWordCloud() {
    const container = this.container.querySelector('#word-cloud-content');
    if (!container) return;

    const platData = wordCloudData[this.selectedWordPlatform] || wordCloudData.All;
    const words = platData[this.selectedWordMetric] || platData.Mention || [];

    if (words.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: #64748b; font-style: italic; padding: 30px;">
          Tidak ada kata kunci yang tersedia untuk platform "${this.selectedWordPlatform}".
        </div>
      `;
      return;
    }

    container.innerHTML = words.map((w, idx) => {
      const isHashtag = w.text.startsWith('#');
      let color = '#334155';
      let weight = '600';
      let extraClass = '';

      if (w.sentiment === 'negative') {
        color = '#ef4444'; // Red
        weight = (w.isTop || w.weight >= 30) ? '800' : '600';
      } else if (w.sentiment === 'positive') {
        color = '#10b981'; // Green
        weight = '600';
      } else {
        if (w.isTop || w.weight >= 40) {
          color = '#0f172a'; // Bold prominent slate
          weight = '800';
        } else if (w.weight >= 28) {
          color = '#1e293b';
          weight = '700';
        } else if (w.weight >= 18) {
          color = '#334155';
          weight = '600';
        } else {
          color = '#64748b';
          weight = '500';
        }
      }

      let fontSize;
      if (isHashtag) {
        fontSize = Math.min(13, Math.max(10, Math.round(w.weight * 0.82)));
        extraClass = 'is-hashtag';
      } else if (w.isTop || w.weight >= 40) {
        fontSize = Math.min(44, Math.max(34, Math.round(w.weight * 0.92)));
        extraClass = 'top-hero-word';
      } else if (w.weight >= 28) {
        fontSize = Math.min(30, Math.max(22, Math.round(w.weight * 0.88)));
      } else if (w.weight >= 18) {
        fontSize = Math.min(20, Math.max(15, Math.round(w.weight * 0.85)));
      } else {
        fontSize = Math.min(13, Math.max(10, Math.round(w.weight * 0.85)));
      }

      return `
        <span class="word-cloud-item ${extraClass}" 
              data-word="${w.text}" 
              data-freq="${w.freq}" 
              data-sent="${w.sentiment}" 
              style="font-size: ${fontSize}px; font-weight: ${weight}; color: ${color};" 
              title="${w.text} (${w.freq} ${this.selectedWordMetric === 'Mention' ? 'sebutan' : 'interaksi'})">
          ${w.text}
        </span>
      `;
    }).join('');

    // Attach click events on word cloud items
    const wordEls = container.querySelectorAll('.word-cloud-item');
    wordEls.forEach((el) => {
      el.onclick = () => {
        const word = el.dataset.word;
        this.openWordModal(word);
      };
    });
  }

  openWordModal(wordText) {
    const modal = this.container.querySelector('#modal-word-detail');
    const body = this.container.querySelector('#modal-word-detail-body');
    if (!modal || !body) return;

    const platData = wordCloudData[this.selectedWordPlatform] || wordCloudData.All;
    const words = platData[this.selectedWordMetric] || platData.Mention || [];
    const item = words.find((w) => w.text.toLowerCase() === wordText.toLowerCase()) || {
      text: wordText,
      freq: '342',
      sentiment: 'neutral'
    };

    let sentLabel = 'Netral (Informasi Objektif)';
    let sentColor = '#94a3b8';
    if (item.sentiment === 'negative') {
      sentLabel = 'Negatif / Provokatif';
      sentColor = '#ef4444';
    } else if (item.sentiment === 'positive') {
      sentLabel = 'Positif / Konstruktif';
      sentColor = '#10b981';
    }

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
          <div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #0f172a;">
              "${item.text}"
            </div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
              Kata Kunci Narasi Digital &bull; Platform: <strong style="color:#fff;">${this.selectedWordPlatform}</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-cyan); font-family: var(--font-mono);">
              ${item.freq}
            </div>
            <div style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase;">
              ${this.selectedWordMetric}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.75rem;">
          <span style="color: #94a3b8;">Klasifikasi Sentimen:</span>
          <strong style="color: ${sentColor};">${sentLabel}</strong>
        </div>

        <div style="font-size: 0.72rem; color: #94a3b8; line-height: 1.4;">
          Term ini terdeteksi sebagai fokus utama percakapan dalam kluster isu peringatan nasional dan amplifikasi warganet di beberapa kanal digital.
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
          <button class="btn-tactical cyan" onclick="window.router && window.router.navigate('/pelacak-akun-medsos', { query: '${item.text}' }); document.getElementById('modal-word-detail').style.display='none';" style="padding: 6px 14px; font-size: 0.72rem;">
            Lacak Postingan Terkait
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  closeModals() {
    const modals = this.container.querySelectorAll('.komando-modal-backdrop');
    modals.forEach((m) => {
      m.style.display = 'none';
    });
  }

  /* =========================================================================
     CHARTS INITIALIZATION
     ========================================================================= */
  initCharts() {
    setTimeout(() => {
      this.initTrendChart();
      this.initSovChart();
      this.initGenderChart();
      this.initRadarChart();
    }, 60);
  }

  initTrendChart() {
    const el = document.getElementById('komando-trend-chart-container');
    if (!el || el.clientWidth === 0) return;

    if (this.trendChart) this.trendChart.dispose();
    this.trendChart = echarts.init(el);

    const dates = ['22 Okt', '23 Okt', '24 Okt', '25 Okt', '26 Okt', '27 Okt', '28 Okt'];
    const totalVolume = [280000, 310000, 390000, 420000, 380000, 490000, 575190];
    const negativeVol = [42000, 51000, 78000, 110000, 89000, 145000, 210000];
    const positiveVol = [150000, 165000, 192000, 185000, 172000, 205000, 220000];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        textStyle: { color: '#0f172a', fontSize: 11 },
        axisPointer: { type: 'cross', lineStyle: { color: '#2563eb' } }
      },
      legend: {
        data: ['Total Volume', 'Sentimen Negatif', 'Sentimen Positif'],
        textStyle: { color: '#475569', fontSize: 11 },
        top: 0,
        right: 10
      },
      grid: {
        top: 36,
        left: 45,
        right: 20,
        bottom: 25
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: {
          color: '#64748b',
          fontSize: 10,
          formatter: (val) => `${(val / 1000).toFixed(0)}k`
        }
      },
      series: [
        {
          name: 'Total Volume',
          type: 'line',
          smooth: true,
          data: totalVolume,
          symbolSize: 6,
          itemStyle: { color: '#3b82f6' },
          lineStyle: { width: 3, color: '#3b82f6' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.02)' }
            ])
          }
        },
        {
          name: 'Sentimen Negatif',
          type: 'line',
          smooth: true,
          data: negativeVol,
          symbolSize: 5,
          itemStyle: { color: '#ef4444' },
          lineStyle: { width: 2, color: '#ef4444' }
        },
        {
          name: 'Sentimen Positif',
          type: 'line',
          smooth: true,
          data: positiveVol,
          symbolSize: 5,
          itemStyle: { color: '#10b981' },
          lineStyle: { width: 2, color: '#10b981' }
        }
      ]
    };

    this.trendChart.setOption(option);
  }

  initSovChart() {
    const el = document.getElementById('komando-sov-chart-container');
    if (!el || el.clientWidth === 0) return;

    if (this.sovChart) this.sovChart.dispose();
    this.sovChart = echarts.init(el);

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        textStyle: { color: '#0f172a', fontSize: 11 },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-radius: 8px;',
        formatter: (params) => {
          const val = params.value ? params.value.toLocaleString('id-ID') : params.value;
          return `<div style="padding: 2px 4px;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">${params.name}</div>
            <div style="color: #64748b; font-size: 0.72rem;">Volume: <strong style="color: #2563eb;">${val}</strong></div>
            <div style="color: #64748b; font-size: 0.72rem;">Pangsa: <strong style="color: #10b981;">${params.percent}%</strong></div>
          </div>`;
        }
      },
      legend: {
        orient: 'vertical',
        right: 15,
        top: 'middle',
        itemGap: 10,
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
        textStyle: {
          color: '#475569',
          fontSize: 11,
          fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
          fontWeight: 500
        }
      },
      series: [
        {
          name: 'Share of Voice',
          type: 'pie',
          radius: ['52%', '78%'],
          center: ['38%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
            borderRadius: 0
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 5,
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 2,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.12)'
            },
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#0f172a',
              formatter: '{b}\n{d}%'
            }
          },
          data: [
            { value: 1195000, name: '𝕏 (Twitter)', itemStyle: { color: '#2563eb' } },
            { value: 682800, name: 'TikTok', itemStyle: { color: '#06b6d4' } },
            { value: 512100, name: 'Instagram', itemStyle: { color: '#8b5cf6' } },
            { value: 312900, name: 'Facebook', itemStyle: { color: '#3b82f6' } },
            { value: 142390, name: 'Threads', itemStyle: { color: '#0284c7' } }
          ]
        }
      ]
    };

    this.sovChart.setOption(option);
  }

  initGenderChart() {
    const el = document.getElementById('komando-gender-chart-container');
    if (!el || el.clientWidth === 0) return;

    if (this.genderChart) this.genderChart.dispose();
    this.genderChart = echarts.init(el);

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        textStyle: { color: '#0f172a', fontSize: 11 },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-radius: 8px;',
        formatter: '{b}: <strong>{c} authors</strong> ({d}%)'
      },
      series: [
        {
          name: 'Gender Distribution',
          type: 'pie',
          radius: ['58%', '82%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#ffffff',
            borderWidth: 3
          },
          label: {
            show: true,
            position: 'center',
            formatter: '{val|258}\n{lbl|AKUN}',
            rich: {
              val: {
                fontSize: 22,
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'Space Grotesk, sans-serif',
                lineHeight: 26
              },
              lbl: {
                fontSize: 10,
                fontWeight: 700,
                color: '#64748b',
                fontFamily: 'IBM Plex Sans, sans-serif',
                letterSpacing: 1
              }
            }
          },
          emphasis: {
            scale: true,
            scaleSize: 5,
            label: {
              show: true
            }
          },
          data: [
            {
              value: 166,
              name: 'Laki-laki',
              itemStyle: { color: '#3b82f6' }
            },
            {
              value: 92,
              name: 'Perempuan',
              itemStyle: { color: '#ec4899' }
            }
          ]
        }
      ]
    };

    this.genderChart.setOption(option);
  }

  initRadarChart() {
    const el = document.getElementById('komando-radar-chart-container');
    if (!el || el.clientWidth === 0) return;

    if (this.radarChart) this.radarChart.dispose();
    this.radarChart = echarts.init(el);

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        textStyle: { color: '#0f172a', fontSize: 11 },
        borderWidth: 1,
        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px;'
      },
      radar: {
        indicator: [
          { name: 'Kemarahan', min: 0, max: 100 },
          { name: 'Ketakutan', min: 0, max: 100 },
          { name: 'Kepercayaan', min: 0, max: 100 },
          { name: 'Antisipasi', min: 0, max: 100 }
        ],
        center: ['50%', '50%'],
        radius: '52%',
        splitNumber: 4,
        axisTick: { show: false },
        axisName: {
          color: '#334155',
          fontSize: 10,
          fontWeight: 600,
          padding: [3, 6],
          borderRadius: 6,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0'
        },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(248, 250, 252, 0.8)', 'rgba(255, 255, 255, 0.8)']
          }
        },
        axisLine: { lineStyle: { color: '#cbd5e1' } }
      },
      series: [
        {
          name: 'Emosi Publik',
          type: 'radar',
          data: [
            {
              value: [22, 18, 65, 30],
              name: 'Emosi Publik (%)',
              symbolSize: 4,
              itemStyle: { color: '#0284c7' },
              areaStyle: { color: 'rgba(2, 132, 199, 0.2)' },
              lineStyle: { width: 2, color: '#0284c7' }
            }
          ]
        }
      ]
    };

    this.radarChart.setOption(option);

    // Otomatis adaptasi ukuran radar jika container berubah dimensi
    if (window.ResizeObserver && !this.radarResizeObserver) {
      this.radarResizeObserver = new ResizeObserver(() => {
        if (this.radarChart) {
          this.radarChart.resize();
        }
      });
      this.radarResizeObserver.observe(el);
    }
  }

  /* =========================================================================
     DEFCON LOGIC & STORE SUBSCRIPTION
     ========================================================================= */
  subscribeToStore() {
    CognitiveStore.subscribe((state) => {
      if (state && state.defcon !== undefined) {
        this.setDefconLevel(state.defcon, state);
      }
    });
  }

  setDefconLevel(level, state = {}) {
    const num = Math.min(5, Math.max(1, Number(level) || 5));
    this.currentDefcon = num;

    // 1. Highlight Visual Scale Pills
    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`komando-scale-defcon-${i}`);
      if (!el) continue;
      if (i === num) {
        el.classList.add('active-defcon');
        if (i === 1) {
          el.style.background = '#fef2f2';
          el.style.border = '2px solid #ef4444';
          el.style.boxShadow = '0 3px 10px rgba(239, 68, 68, 0.25)';
          el.style.color = '#dc2626';
          el.style.fontWeight = '800';
        } else if (i === 2) {
          el.style.background = '#fff7ed';
          el.style.border = '2px solid #f97316';
          el.style.boxShadow = '0 3px 10px rgba(249, 115, 22, 0.25)';
          el.style.color = '#ea580c';
          el.style.fontWeight = '800';
        } else if (i === 3) {
          el.style.background = '#fffbeb';
          el.style.border = '2px solid #f59e0b';
          el.style.boxShadow = '0 3px 10px rgba(245, 158, 11, 0.25)';
          el.style.color = '#d97706';
          el.style.fontWeight = '800';
        } else if (i === 4) {
          el.style.background = '#eff6ff';
          el.style.border = '2px solid #3b82f6';
          el.style.boxShadow = '0 3px 10px rgba(59, 130, 246, 0.25)';
          el.style.color = '#2563eb';
          el.style.fontWeight = '800';
        } else {
          el.style.background = '#ecfdf5';
          el.style.border = '2px solid #10b981';
          el.style.boxShadow = '0 3px 10px rgba(16, 185, 129, 0.25)';
          el.style.color = '#047857';
          el.style.fontWeight = '800';
        }
      } else {
        el.classList.remove('active-defcon');
        el.style.boxShadow = 'none';
        el.style.fontWeight = 'normal';
        if (i === 1) {
          el.style.background = '#ffffff';
          el.style.border = '1px solid #fca5a5';
          el.style.color = '#dc2626';
        } else if (i === 2) {
          el.style.background = '#ffffff';
          el.style.border = '1px solid #fdba74';
          el.style.color = '#ea580c';
        } else if (i === 3) {
          el.style.background = '#ffffff';
          el.style.border = '1px solid #fcd34d';
          el.style.color = '#d97706';
        } else if (i === 4) {
          el.style.background = '#ffffff';
          el.style.border = '1px solid #bfdbfe';
          el.style.color = '#2563eb';
        } else {
          el.style.background = '#ffffff';
          el.style.border = '1px solid #a7f3d0';
          el.style.color = '#059669';
        }
      }
    }

    // 2. Update Header Status Pill
    const pill = document.getElementById('ews-status-pill');
    if (pill) {
      if (num === 1) {
        pill.textContent = 'DEFCON 1 — KRITIS';
        pill.style.background = '#fef2f2';
        pill.style.borderColor = '#fca5a5';
        pill.style.color = '#b91c1c';
      } else if (num === 2) {
        pill.textContent = 'DEFCON 2 — BAHAYA';
        pill.style.background = '#fff7ed';
        pill.style.borderColor = '#fdba74';
        pill.style.color = '#c2410c';
      } else if (num === 3) {
        pill.textContent = 'DEFCON 3 — WASPADA';
        pill.style.background = '#fffbeb';
        pill.style.borderColor = '#fcd34d';
        pill.style.color = '#b45309';
      } else if (num === 4) {
        pill.textContent = 'DEFCON 4 — SIAGA';
        pill.style.background = '#eff6ff';
        pill.style.borderColor = '#bfdbfe';
        pill.style.color = '#1d4ed8';
      } else {
        pill.textContent = 'DEFCON 5 — NORMAL MONITORING';
        pill.style.background = '#ecfdf5';
        pill.style.borderColor = '#a7f3d0';
        pill.style.color = '#059669';
      }
    }

    // 3. Update Metrics (Velocity, Z-Score, Polarisasi)
    const velEl = document.getElementById('komando-val-velocity');
    if (velEl) {
      const v = state.currentVelocity !== undefined ? state.currentVelocity : (num === 1 ? 168 : (num === 2 ? 112 : (num === 3 ? 74 : (num === 4 ? 52 : 38))));
      velEl.textContent = `${v} PPM`;
      velEl.style.color = num <= 2 ? '#dc2626' : (num === 3 ? '#d97706' : '#0284c7');
    }

    const zEl = document.getElementById('komando-val-zscore');
    if (zEl) {
      const z = typeof state.spikeIndex === 'number' ? state.spikeIndex : (num === 1 ? 4.12 : (num === 2 ? 2.85 : (num === 3 ? 1.76 : (num === 4 ? 1.15 : 0.84))));
      zEl.textContent = `${Number(z).toFixed(2)}σ`;
      zEl.style.color = num <= 2 ? '#dc2626' : '#0f172a';
    }

    const polEl = document.getElementById('komando-val-polarisasi');
    if (polEl) {
      const p = state.polarizationIndex !== undefined ? state.polarizationIndex : (num === 1 ? 76.4 : (num === 2 ? 62.1 : (num === 3 ? 45.8 : (num === 4 ? 34.2 : 28.5))));
      polEl.textContent = `${Number(p).toFixed(1)}%`;
      polEl.style.color = num <= 2 ? '#dc2626' : '#d97706';
    }

    // 4. Update Radar Emosi sesuai tingkatan DEFCON
    if (this.radarChart) {
      let radarData = state.emotionRadar;
      if (!radarData || !Array.isArray(radarData) || radarData.length < 4) {
        if (num === 1) radarData = [85, 78, 14, 60];
        else if (num === 2) radarData = [68, 60, 30, 48];
        else if (num === 3) radarData = [45, 42, 50, 40];
        else if (num === 4) radarData = [32, 28, 58, 35];
        else radarData = [22, 18, 65, 30];
      }
      this.radarChart.setOption({
        series: [
          {
            data: [
              {
                value: radarData,
                name: 'Emosi Publik (%)',
                symbolSize: 4,
                itemStyle: { color: num <= 2 ? '#ef4444' : '#0284c7' },
                areaStyle: { color: num <= 2 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(2, 132, 199, 0.2)' },
                lineStyle: { width: 2, color: num <= 2 ? '#ef4444' : '#0284c7' }
              }
            ]
          }
        ]
      });
    }
  }

  resize() {
    const trendEl = document.getElementById('komando-trend-chart-container');
    if (trendEl && trendEl.clientWidth > 0) {
      if (!this.trendChart) this.initTrendChart(); else this.trendChart.resize();
    }
    const sovEl = document.getElementById('komando-sov-chart-container');
    if (sovEl && sovEl.clientWidth > 0) {
      if (!this.sovChart) this.initSovChart(); else this.sovChart.resize();
    }
    const genderEl = document.getElementById('komando-gender-chart-container');
    if (genderEl && genderEl.clientWidth > 0) {
      if (!this.genderChart) this.initGenderChart(); else this.genderChart.resize();
    }
    const radarEl = document.getElementById('komando-radar-chart-container');
    if (radarEl && radarEl.clientWidth > 0) {
      if (!this.radarChart) this.initRadarChart(); else this.radarChart.resize();
    }
  }
}
