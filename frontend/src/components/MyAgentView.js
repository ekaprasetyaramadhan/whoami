/**
 * My Agent View Component
 * Dedicated Workspace for AI Agents Management, Simulation, and Results
 * Features:
 * - Create Agent Button & Creation Modal Form
 * - Agent Grid (Name, Description, Status, Last Run, Source, Schedule)
 * - Run Agent Simulation with Interactive Multi-Step Loading & State Transitions
 * - View Results Modal with Detailed Forensic Intelligence Report
 * - Edit Agent Modal
 */

import { renderLucideIcons } from '../utils/icons.js';

export class MyAgentView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.agents = [
      {
        id: 'agent-1',
        name: 'Buzzer Sentiment Sentinel',
        icon: 'shield-alert',
        description: 'Memantau lonjakan sentimen negatif, provokasi kebencian, dan anomali polarisasi opini publik pada tagar viral secara kontinu.',
        status: 'IDLE',
        lastRun: '15 menit lalu',
        source: 'Multi-Platform Social Stream (X, TikTok, IG)',
        schedule: 'Setiap 15 Menit',
        instructions: 'Pindai postingan dengan Z-Score > 2.5 sigma, tandai tagar dengan rasio kemarahan publik > 60%.'
      },
      {
        id: 'agent-2',
        name: 'CIB Botnet Farm Detector',
        icon: 'network',
        description: 'Menganalisis pola koordinasi Coordinated Inauthentic Behavior (interval posting < 5 detik, kesamaan semantik teks > 90%).',
        status: 'COMPLETED',
        lastRun: '45 menit lalu',
        source: 'Botnet Graph Database & Feed Medsos',
        schedule: 'Setiap 1 Jam',
        instructions: 'Kelompokkan akun dengan kesamaan teks > 85% dan jeda waktu rilis serempak di bawah 8 detik.'
      },
      {
        id: 'agent-3',
        name: 'Regional Hotspot Forecaster',
        icon: 'map-pin',
        description: 'Mengorelasikan isu kontroversial media lokal di 38 provinsi dengan tren perbincangan medsos untuk memprediksi potensi eskalasi.',
        status: 'IDLE',
        lastRun: 'Kemarin, 06:00 WIB',
        source: 'Portal Berita Daerah & Geotag Medsos',
        schedule: 'Setiap Hari (06:00 WIB)',
        instructions: 'Ekstraksi entitas lokasi dari berita kriminal/politik lokal, cocokkan dengan volume percakapan wilayah.'
      },
      {
        id: 'agent-4',
        name: 'Multi-Platform Cross-Spreader',
        icon: 'share-2',
        description: 'Melacak akun yang menyebarkan aset video/gambar narasi yang sama secara serentak antara X, TikTok, dan Threads.',
        status: 'IDLE',
        lastRun: '2 jam lalu',
        source: 'Media Content Hash Archive',
        schedule: 'Pemicu Manual',
        instructions: 'Hitung perceptual hash (pHash) konten video pendek, identifikasi akun penyebar pertama (Ground Zero).'
      }
    ];

    this.activeRunningAgent = null;
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px; width: 100%; max-width: 1600px; margin: 0 auto;">
        
        <!-- Page Header & Action Button -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-family: var(--font-display, 'Space Grotesk'); font-size: 1.3rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 10px;">
              <i data-lucide="bot" style="color: var(--color-cyan, #00e5ff); width: 24px; height: 24px;"></i>
              My Agent
            </div>
            <div style="font-size: 0.78rem; color: #64748b; margin-top: 3px;">
              Kelola dan jalankan agent untuk membantu analisis data.
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <!-- Disclaimer Simulator Badge -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 12px; font-size: 0.68rem; color: #1e40af;">
              <i class="fa-solid fa-microchip"></i> Agent Environment: <strong>Standar Modular Terisolasi</strong>
            </div>

            <!-- Create Agent Button -->
            <button id="btn-create-agent-modal" class="btn-tactical cyan" style="padding: 8px 16px; font-size: 0.75rem;">
              <i class="fa-solid fa-plus"></i> BUAT AGENT BARU
            </button>
          </div>
        </div>

        <!-- Live Execution Banner (Muncul saat ada agent yang berjalan) -->
        <div id="agent-running-banner" style="display: none; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 10px; padding: 14px 18px; flex-direction: column; gap: 8px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.82rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-spinner fa-spin text-cyan"></i>
              <span id="agent-running-name">Menjalankan Agent...</span>
            </div>
            <span class="tag-badge" style="border-color: var(--color-cyan); color: var(--color-cyan); font-size: 0.65rem;">EKSEKUSI TAHAP ANALISIS</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #334155;" id="agent-running-log">
            [1/4] Mengumpulkan 10.000 sampel data stream terkini...
          </div>
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
            <div id="agent-running-progress" style="width: 25%; height: 100%; background: var(--color-cyan); transition: width 0.5s ease;"></div>
          </div>
        </div>

        <!-- Agent Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;" id="agent-cards-grid">
          <!-- Render Cards Dinamis -->
        </div>

      </div>

      <!-- Result Modal (Hidden by default) -->
      <div id="modal-agent-result" class="modal-backdrop" style="display: none;">
        <div class="modal-card" style="max-width: 720px;">
          <div class="modal-header">
            <div class="modal-title" id="result-modal-title">
              <i class="fa-solid fa-file-shield text-cyan"></i> Laporan Hasil Eksekusi Agent
            </div>
            <button class="modal-close-btn" id="btn-close-result-modal">&times;</button>
          </div>
          <div class="modal-body" id="result-modal-body">
            <!-- Isi laporan forensik -->
          </div>
          <div class="modal-footer">
            <button class="btn-tactical" id="btn-export-result-pdf" style="font-size: 0.72rem;">
              <i class="fa-solid fa-file-pdf"></i> EKSPOR LAPORAN
            </button>
            <button class="btn-tactical cyan" id="btn-confirm-close-result" style="font-size: 0.72rem;">
              TUTUP
            </button>
          </div>
        </div>
      </div>

      <!-- Create / Edit Agent Modal (Hidden by default) -->
      <div id="modal-agent-form" class="modal-backdrop" style="display: none;">
        <div class="modal-card" style="max-width: 600px;">
          <div class="modal-header">
            <div class="modal-title" id="form-modal-title">
              <i class="fa-solid fa-robot text-cyan"></i> Konfigurasi AI Agent
            </div>
            <button class="modal-close-btn" id="btn-close-form-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form id="agent-create-form" style="display: flex; flex-direction: column; gap: 12px;">
              <input type="hidden" id="form-agent-id" value="" />
              
              <div>
                <label style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px;">NAMA AGENT</label>
                <input type="text" id="form-agent-name" placeholder="Mis. Narasi Hoax Infiltrator" class="tactical-input" required />
              </div>

              <div>
                <label style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px;">DESKRIPSI TUGAS</label>
                <textarea id="form-agent-desc" rows="2" placeholder="Jelaskan peran operasional agent ini..." class="tactical-textarea" required></textarea>
              </div>

              <div>
                <label style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px;">INSTRUKSI / PROMPT OPERASIONAL</label>
                <textarea id="form-agent-inst" rows="3" placeholder="Contoh: Tandai pola kesamaan kalimat > 80% dan laporkan akun koordinator..." class="tactical-textarea" required></textarea>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <label style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px;">SUMBER DATA INPUT</label>
                  <select id="form-agent-source" class="form-select tactical-input" style="padding: 8px;">
                    <option value="Multi-Platform Social Stream (X, TikTok, IG)">Multi-Platform Social Stream</option>
                    <option value="Botnet Graph Database">Botnet Graph Database</option>
                    <option value="Portal Berita Daerah & Geotag Medsos">Portal Berita Daerah & Geotag</option>
                    <option value="Media Content Hash Archive">Media Content Hash Archive</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 4px;">JADWAL EKSEKUSI</label>
                  <select id="form-agent-schedule" class="form-select tactical-input" style="padding: 8px;">
                    <option value="Pemicu Manual">Pemicu Manual</option>
                    <option value="Setiap 15 Menit">Setiap 15 Menit</option>
                    <option value="Setiap 1 Jam">Setiap 1 Jam</option>
                    <option value="Setiap Hari (06:00 WIB)">Setiap Hari (06:00 WIB)</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn-tactical" id="btn-cancel-agent-form">BATAL</button>
            <button class="btn-tactical cyan" id="btn-save-agent-form">SIMPAN AGENT</button>
          </div>
        </div>
      </div>
    `;

    this.renderAgentCards();
    this.bindEvents();
    renderLucideIcons(this.container);
  }

  renderAgentCards() {
    const grid = this.container.querySelector('#agent-cards-grid');
    if (!grid) return;

    grid.innerHTML = this.agents.map((a) => {
      let statusColor = '#10b981';
      let statusBadge = 'SIAP';
      if (a.status === 'RUNNING') {
        statusColor = 'var(--color-cyan)';
        statusBadge = 'RUNNING';
      } else if (a.status === 'COMPLETED') {
        statusColor = '#38bdf8';
        statusBadge = 'COMPLETED';
      }

      return `
        <div class="komando-card" style="display: flex; flex-direction: column; gap: 12px; border-top: 3px solid ${statusColor};">
          <!-- Card Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: center; color: #2563eb; font-size: 1.1rem;">
                <i class="fa-solid fa-robot"></i>
              </div>
              <div>
                <div style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #0f172a;">
                  ${a.name}
                </div>
                <div style="font-size: 0.65rem; color: #94a3b8;">
                  Jadwal: <strong style="color: #334155;">${a.schedule}</strong>
                </div>
              </div>
            </div>
            <span class="tag-badge" style="border-color: ${statusColor}; color: ${statusColor}; font-size: 0.62rem;">
              ${statusBadge}
            </span>
          </div>

          <!-- Description -->
          <div style="font-size: 0.72rem; color: #475569; line-height: 1.4; min-height: 40px;">
            ${a.description}
          </div>

          <!-- Metadata Box -->
          <div style="background: #f8fafc; padding: 8px 10px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 0.66rem; display: flex; flex-direction: column; gap: 3px;">
            <div style="color: #94a3b8;">
              <i class="fa-solid fa-database"></i> Sumber: <span style="color: #0f172a; font-weight: 600;">${a.source}</span>
            </div>
            <div style="color: #94a3b8;">
              <i class="fa-solid fa-clock-rotate-left"></i> Terakhir Dijalankan: <span style="color: var(--color-cyan);">${a.lastRun}</span>
            </div>
          </div>

          <!-- 3 Actions: Run, View Results, Edit -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 0.6fr; gap: 6px; margin-top: auto; padding-top: 6px; border-top: 1px solid #f1f5f9;">
            <button class="btn-tactical cyan btn-run-agent" data-id="${a.id}" style="padding: 5px 8px; font-size: 0.68rem; justify-content: center;">
              <i class="fa-solid fa-play"></i> Jalankan
            </button>
            <button class="btn-tactical btn-view-results" data-id="${a.id}" style="padding: 5px 8px; font-size: 0.68rem; justify-content: center;">
              <i class="fa-solid fa-eye"></i> Hasil
            </button>
            <button class="btn-tactical btn-edit-agent" data-id="${a.id}" style="padding: 5px 8px; font-size: 0.68rem; justify-content: center;" title="Ubah Konfigurasi">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.bindCardActions();
  }

  bindEvents() {
    // Tombol Buka Modal Buat Agent
    const btnCreate = this.container.querySelector('#btn-create-agent-modal');
    const modalForm = this.container.querySelector('#modal-agent-form');
    if (btnCreate && modalForm) {
      btnCreate.onclick = () => {
        this.openFormModal();
      };
    }

    // Tutup Modal Form
    const closeFormBtn = this.container.querySelector('#btn-close-form-modal');
    const cancelFormBtn = this.container.querySelector('#btn-cancel-agent-form');
    if (closeFormBtn) closeFormBtn.onclick = () => this.closeFormModal();
    if (cancelFormBtn) cancelFormBtn.onclick = () => this.closeFormModal();

    // Simpan Form Agent
    const saveFormBtn = this.container.querySelector('#btn-save-agent-form');
    if (saveFormBtn) {
      saveFormBtn.onclick = (e) => {
        e.preventDefault();
        this.saveAgentForm();
      };
    }

    // Tutup Modal Hasil
    const closeResBtn = this.container.querySelector('#btn-close-result-modal');
    const confirmResBtn = this.container.querySelector('#btn-confirm-close-result');
    if (closeResBtn) closeResBtn.onclick = () => this.closeResultModal();
    if (confirmResBtn) confirmResBtn.onclick = () => this.closeResultModal();

    // Ekspor PDF
    const exportBtn = this.container.querySelector('#btn-export-result-pdf');
    if (exportBtn) {
      exportBtn.onclick = () => {
        window.print();
      };
    }
  }

  bindCardActions() {
    // Run Agent Simulation
    this.container.querySelectorAll('.btn-run-agent').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        this.runAgentSimulation(id);
      };
    });

    // View Results
    this.container.querySelectorAll('.btn-view-results').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        this.openResultModal(id);
      };
    });

    // Edit Agent
    this.container.querySelectorAll('.btn-edit-agent').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        this.openFormModal(id);
      };
    });
  }

  runAgentSimulation(agentId) {
    const agent = this.agents.find((a) => a.id === agentId);
    if (!agent) return;

    agent.status = 'RUNNING';
    this.renderAgentCards();

    const banner = this.container.querySelector('#agent-running-banner');
    const nameEl = this.container.querySelector('#agent-running-name');
    const logEl = this.container.querySelector('#agent-running-log');
    const progressEl = this.container.querySelector('#agent-running-progress');

    if (banner) banner.style.display = 'flex';
    if (nameEl) nameEl.textContent = `Menjalankan: ${agent.name}`;

    const steps = [
      { pct: 25, log: '[1/4] Mengambil 10.000 sampel data stream sosial media multi-platform...' },
      { pct: 55, log: '[2/4] Mengekstraksi fitur semantik, jeda waktu postingan & unified bot score...' },
      { pct: 85, log: '[3/4] Mengidentifikasi simpul koordinasi CIB & anomali polarisasi...' },
      { pct: 100, log: '[4/4] Finalisasi laporan intelijen forensik narasi digital.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        if (progressEl) progressEl.style.width = `${steps[currentStep].pct}%`;
        if (logEl) logEl.textContent = steps[currentStep].log;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (banner) banner.style.display = 'none';
          agent.status = 'COMPLETED';
          agent.lastRun = 'Baru saja';
          this.renderAgentCards();
          this.openResultModal(agentId);
        }, 500);
      }
    }, 700);
  }

  openResultModal(agentId) {
    const agent = this.agents.find((a) => a.id === agentId);
    if (!agent) return;

    const modal = this.container.querySelector('#modal-agent-result');
    const titleEl = this.container.querySelector('#result-modal-title');
    const bodyEl = this.container.querySelector('#result-modal-body');

    if (titleEl) {
      titleEl.innerHTML = `<i class="fa-solid fa-file-shield text-cyan"></i> Laporan Intelijen: ${agent.name}`;
    }

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.75rem;">
          
          <!-- Report Header Info -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: rgba(0,0,0,0.35); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); font-family: var(--font-mono);">
            <div>Waktu: <strong style="color: #fff;">28 Okt 2026, 21:55 WIB</strong></div>
            <div>Sampel Diproses: <strong style="color: var(--color-cyan);">10,000 Postingan</strong></div>
            <div>Tingkat Keyakinan: <strong style="color: #10b981;">96.4% (Tinggi)</strong></div>
          </div>

          <!-- Executive Summary -->
          <div>
            <div style="font-weight: 700; color: var(--color-cyan); margin-bottom: 4px; text-transform: uppercase;">
              1. Ringkasan Temuan Forensik
            </div>
            <div style="color: #cbd5e1; line-height: 1.4; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
              Agent berhasil mendeteksi operasi amplifikasi terkoordinasi (Coordinated Inauthentic Behavior) yang berpusat pada tagar <strong>#28Oktober</strong>. Tingkat sinkronisasi waktu postingan antar kluster mencapai <strong>94.2%</strong> dalam rentang interval di bawah 5 detik, mengindikasikan penggunaan skrip otomasi (bot farm).
            </div>
          </div>

          <!-- Anomalies Table -->
          <div>
            <div style="font-weight: 700; color: var(--color-cyan); margin-bottom: 4px; text-transform: uppercase;">
              2. Simpul Koordinator Kunci & Indikator Anomali
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.72rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">
                  <th style="padding: 6px;">Akun Koordinator</th>
                  <th style="padding: 6px;">Platform</th>
                  <th style="padding: 6px;">Bot Probability</th>
                  <th style="padding: 6px;">Kluster Narasi</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                  <td style="padding: 6px; font-weight: 700; color: #fff;">@daboriba_buzz</td>
                  <td style="padding: 6px;">𝕏 (Twitter)</td>
                  <td style="padding: 6px; color: #ef4444; font-weight: 700;">88% (Tinggi)</td>
                  <td style="padding: 6px; color: #cbd5e1;">Agitasi Kebijakan Ekonomi</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                  <td style="padding: 6px; font-weight: 700; color: #fff;">@viral_indo_terkini</td>
                  <td style="padding: 6px;">TikTok</td>
                  <td style="padding: 6px; color: #ef4444; font-weight: 700;">84% (Tinggi)</td>
                  <td style="padding: 6px; color: #cbd5e1;">Amplifikasi Video Demo</td>
                </tr>
                <tr>
                  <td style="padding: 6px; font-weight: 700; color: #fff;">@revolusi_suara_rakyat</td>
                  <td style="padding: 6px;">Instagram</td>
                  <td style="padding: 6px; color: #f59e0b; font-weight: 700;">79% (Sedang)</td>
                  <td style="padding: 6px; color: #cbd5e1;">Provokasi Aksi Massa</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Recommendations -->
          <div>
            <div style="font-weight: 700; color: var(--color-cyan); margin-bottom: 4px; text-transform: uppercase;">
              3. Rekomendasi Tindakan Komando
            </div>
            <ul style="padding-left: 18px; color: #94a3b8; line-height: 1.4;">
              <li>Tingkatkan pemantauan pada kanal regional DKI Jakarta & Jawa Barat.</li>
              <li>Pantau pergerakan tagar turunan yang berkaitan dengan #DemoBuruhNasional.</li>
              <li>Lakukan penelusuran lebih mendalam pada modul <strong>Pelacak Akun Medsos</strong>.</li>
            </ul>
          </div>

        </div>
      `;
    }

    if (modal) modal.style.display = 'flex';
  }

  closeResultModal() {
    const modal = this.container.querySelector('#modal-agent-result');
    if (modal) modal.style.display = 'none';
  }

  openFormModal(agentId = null) {
    const modal = this.container.querySelector('#modal-agent-form');
    const titleEl = this.container.querySelector('#form-modal-title');
    const idInput = this.container.querySelector('#form-agent-id');
    const nameInput = this.container.querySelector('#form-agent-name');
    const descInput = this.container.querySelector('#form-agent-desc');
    const instInput = this.container.querySelector('#form-agent-inst');
    const sourceInput = this.container.querySelector('#form-agent-source');
    const schedInput = this.container.querySelector('#form-agent-schedule');

    if (agentId) {
      const agent = this.agents.find((a) => a.id === agentId);
      if (agent) {
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-cyan"></i> Ubah AI Agent: ${agent.name}`;
        if (idInput) idInput.value = agent.id;
        if (nameInput) nameInput.value = agent.name;
        if (descInput) descInput.value = agent.description;
        if (instInput) instInput.value = agent.instructions || '';
        if (sourceInput) sourceInput.value = agent.source;
        if (schedInput) schedInput.value = agent.schedule;
      }
    } else {
      if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-robot text-cyan"></i> Konfigurasi AI Agent Baru`;
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (descInput) descInput.value = '';
      if (instInput) instInput.value = '';
    }

    if (modal) modal.style.display = 'flex';
  }

  closeFormModal() {
    const modal = this.container.querySelector('#modal-agent-form');
    if (modal) modal.style.display = 'none';
  }

  saveAgentForm() {
    const idInput = this.container.querySelector('#form-agent-id');
    const nameInput = this.container.querySelector('#form-agent-name');
    const descInput = this.container.querySelector('#form-agent-desc');
    const instInput = this.container.querySelector('#form-agent-inst');
    const sourceInput = this.container.querySelector('#form-agent-source');
    const schedInput = this.container.querySelector('#form-agent-schedule');

    const name = nameInput ? nameInput.value.trim() : '';
    const desc = descInput ? descInput.value.trim() : '';
    const inst = instInput ? instInput.value.trim() : '';
    const source = sourceInput ? sourceInput.value : 'Multi-Platform Social Stream';
    const schedule = schedInput ? schedInput.value : 'Pemicu Manual';

    if (!name || !desc) {
      alert('Nama dan deskripsi agent wajib diisi!');
      return;
    }

    const editId = idInput ? idInput.value : null;

    if (editId) {
      const existing = this.agents.find((a) => a.id === editId);
      if (existing) {
        existing.name = name;
        existing.description = desc;
        existing.instructions = inst;
        existing.source = source;
        existing.schedule = schedule;
      }
    } else {
      const newAgent = {
        id: `agent-${Date.now()}`,
        name,
        icon: 'robot',
        description: desc,
        status: 'IDLE',
        lastRun: 'Belum pernah',
        source,
        schedule,
        instructions: inst
      };
      this.agents.unshift(newAgent);
    }

    this.closeFormModal();
    this.renderAgentCards();
  }
}

