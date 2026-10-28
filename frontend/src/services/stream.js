/**
 * WebSocket Stream Service
 * Mengonsumsi telemetri real-time dari backend
 */

import { CognitiveStore } from '../state/store.js';

class StreamService {
  constructor() {
    this.ws = null;
    this.reconnectTimer = null;

    const customWs = import.meta.env.VITE_WS_URL;
    const customApi = import.meta.env.VITE_API_URL;

    if (customWs) {
      this.url = customWs;
    } else if (customApi) {
      const wsProtocol = customApi.startsWith('https') ? 'wss://' : 'ws://';
      const cleanHost = customApi.replace(/^https?:\/\//, '').replace(/\/+$/, '');
      this.url = `${wsProtocol}${cleanHost}/ws/telemetry`;
    } else {
      this.url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/telemetry';
    }
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[whoiam STREAM] Terhubung ke WebSocket Telemetri Backend');
        window.dispatchEvent(new CustomEvent('whoiam:ws_status', { detail: { connected: true } }));
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
          console.error('[whoiam STREAM] Gagal parsing paket WebSocket:', e);
        }
      };

      this.ws.onclose = () => {
        console.warn('[whoiam STREAM] Koneksi terputus. Menghubungkan kembali dalam 3 detik...');
        window.dispatchEvent(new CustomEvent('whoiam:ws_status', { detail: { connected: false } }));
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.error('[whoiam STREAM] Kesalahan WebSocket:', err);
        window.dispatchEvent(new CustomEvent('whoiam:ws_status', { detail: { connected: false } }));
        this.ws.close();
      };
    } catch (e) {
      console.warn('[whoiam STREAM] Gagal inisiasi WebSocket:', e);
      window.dispatchEvent(new CustomEvent('whoiam:ws_status', { detail: { connected: false } }));
      this.scheduleReconnect();
    }
  }

  handlePacket(packet) {
    if (packet.event_type === 'NEW_TELEMETRY_POST') {
      CognitiveStore.addPost(packet.payload);
      window.dispatchEvent(new CustomEvent('whoiam:new_post', { detail: packet.payload }));
    } else if (packet.event_type === 'DEFCON_ALERT_UPDATE') {
      CognitiveStore.setThreatLevel(packet.payload.threat_level, packet.payload.defcon);
      window.dispatchEvent(new CustomEvent('whoiam:alert_update', { detail: packet.payload }));
    } else if (packet.event_type === 'TELEMETRY_REFRESH') {
      CognitiveStore.setEwsTelemetry(packet.payload);
      window.dispatchEvent(new CustomEvent('whoiam:telemetry_refresh', { detail: packet.payload }));
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
