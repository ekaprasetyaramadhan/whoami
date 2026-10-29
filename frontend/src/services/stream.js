/**
 * WebSocket Stream Service
 * Mengonsumsi telemetri real-time dari backend
 */

import { CognitiveStore } from '../state/store.js';

class StreamService {
  constructor() {
    this.ws = null;
    this.reconnectTimer = null;
    this.url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/telemetry';
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[KOMANDO STREAM] Terhubung ke WebSocket Telemetri Backend');
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          this.handlePacket(packet);
        } catch (e) {
          console.error('[KOMANDO STREAM] Gagal parsing paket WebSocket:', e);
        }
      };

      this.ws.onclose = () => {
        console.warn('[KOMANDO STREAM] Koneksi terputus. Menghubungkan kembali dalam 3 detik...');
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.error('[KOMANDO STREAM] Kesalahan WebSocket:', err);
        this.ws.close();
      };
    } catch (e) {
      console.warn('[KOMANDO STREAM] Gagal inisiasi WebSocket:', e);
      this.scheduleReconnect();
    }
  }

  handlePacket(packet) {
    if (packet.event_type === 'NEW_TELEMETRY_POST') {
      CognitiveStore.addPost(packet.payload);
      window.dispatchEvent(new CustomEvent('komando:new_post', { detail: packet.payload }));
      window.dispatchEvent(new CustomEvent('whoiam:new_post', { detail: packet.payload }));
    } else if (packet.event_type === 'DEFCON_ALERT_UPDATE') {
      CognitiveStore.setThreatLevel(packet.payload.threat_level, packet.payload.defcon);
    } else if (packet.event_type === 'TELEMETRY_REFRESH') {
      CognitiveStore.setEwsTelemetry(packet.payload);
    }
  }

  scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, 3000);
    }
  }
}

export const streamService = new StreamService();
