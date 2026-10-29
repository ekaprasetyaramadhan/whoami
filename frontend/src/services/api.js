/**
 * API Client Service
 * Abstraksi pemanggilan REST endpoint backend
 */

const API_BASE = '/api/v1';

export const ApiService = {
  async getEwsTelemetry() {
    const res = await fetch(`${API_BASE}/ews/telemetry`);
    return await res.json();
  },

  async getCibSummary() {
    const res = await fetch(`${API_BASE}/cib/summary`);
    return await res.json();
  },

  async getSnaGraph(minInfluence = 0) {
    const res = await fetch(`${API_BASE}/sna/graph-data?min_influence=${minInfluence}`);
    return await res.json();
  },

  async getSentimentOverview() {
    const res = await fetch(`${API_BASE}/sentiment/overview`);
    return await res.json();
  },

  async verifyHoaxText(text) {
    const res = await fetch(`${API_BASE}/hoax/verify-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return await res.json();
  },

  async injectSpike() {
    const res = await fetch(`${API_BASE}/sim/inject-spike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  },

  async exportLapsitReport(analystName = 'User') {
    const res = await fetch(`${API_BASE}/reports/export-lapsit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analyst_name: analystName })
    });
    return await res.json();
  },

  async inspectOsintUrl(url) {
    const res = await fetch(`${API_BASE}/osint/inspect-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    return await res.json();
  },

  async searchOsintIngest(query, platform = 'all', limit = 10, injectStream = true) {
    const res = await fetch(`${API_BASE}/osint/search-ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, platform, limit, inject_stream: injectStream })
    });
    return await res.json();
  },

  async searchOsintFeed(query, platform = 'all', limit = 10, injectStream = true) {
    return await this.searchOsintIngest(query, platform, limit, injectStream);
  },

  async getGeoBuzzerDistribution(platform = 'all', province = 'all') {
    const res = await fetch(`${API_BASE}/geo/buzzer-distribution?platform=${encodeURIComponent(platform)}&province=${encodeURIComponent(province)}`);
    return await res.json();
  },

  async getGeoProvincesSummary() {
    const res = await fetch(`${API_BASE}/geo/provinces-summary`);
    return await res.json();
  },

  async getRegionalNews(province = 'all') {
    const res = await fetch(`${API_BASE}/geo/regional-news?province=${encodeURIComponent(province)}`);
    return await res.json();
  },

  async getGeoSocialFeeds(platform = 'all', province = 'all') {
    const res = await fetch(`${API_BASE}/geo/social-feeds?platform=${encodeURIComponent(platform)}&province=${encodeURIComponent(province)}`);
    return await res.json();
  },

  async getProvinceSna(province) {
    const res = await fetch(`${API_BASE}/geo/province-sna/${encodeURIComponent(province)}`);
    return await res.json();
  },

  async getPropagationLines(province = 'DKI JAKARTA', timeframe = '24h') {
    const res = await fetch(`${API_BASE}/geo/propagation-lines?province=${encodeURIComponent(province)}&timeframe=${encodeURIComponent(timeframe)}`);
    return await res.json();
  },

  async compareAccounts(urlA, urlB) {
    const res = await fetch(`${API_BASE}/osint/compare-accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url_a: urlA, url_b: urlB })
    });
    return await res.json();
  },

  async setSimulatorSpeed(speed) {
    try {
      const res = await fetch(`${API_BASE}/sim/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed })
      });
      return await res.json();
    } catch (e) {
      console.warn('Gagal setSimulatorSpeed:', e);
      return { status: 'mock' };
    }
  }
};
