/**
 * Reactive State Management untuk whoiam Telemetri
 * whoiam - Social Media Intelligence Platform
 */

export const CognitiveStore = {
  state: {
    threatLevel: 'GREEN', // GREEN, YELLOW, RED
    defcon: 5,
    spikeIndex: 0.84,
    currentVelocity: 38,
    baselineVelocity: 45,
    posts: [],
    selectedPost: null,
    selectedNode: null,
    clusters: [],
    snaNodes: [],
    snaEdges: [],
    emotionRadar: { anger: 15, fear: 12, trust: 68, anticipation: 25 },
    polarizationIndex: 28.5,
    simRunning: true,
    simSpeed: 'NORMAL', // NORMAL, TURBO, PAUSED
    systemClock: ''
  },

  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  },

  setThreatLevel(level, defcon) {
    this.state.threatLevel = level;
    this.state.defcon = defcon;
    this.notify();
  },

  setEwsTelemetry(data) {
    if (data.current_level) this.state.threatLevel = data.current_level;
    if (data.defcon) this.state.defcon = data.defcon;
    if (data.z_score !== undefined) this.state.spikeIndex = data.z_score;
    if (data.velocity_ppm) this.state.currentVelocity = data.velocity_ppm;
    if (data.baseline_ppm) this.state.baselineVelocity = data.baseline_ppm;
    this.notify();
  },

  addPost(post) {
    this.state.posts.unshift(post);
    if (this.state.posts.length > 50) {
      this.state.posts.pop();
    }
    this.notify();
  },

  setSelectedNode(node) {
    this.state.selectedNode = node;
    this.notify();
  },

  setSelectedPost(post) {
    this.state.selectedPost = post;
    this.notify();
  },

  setSnaGraph(nodes, edges) {
    this.state.snaNodes = nodes;
    this.state.snaEdges = edges;
    this.notify();
  },

  setEmotionRadar(emotions, polarization) {
    if (emotions) this.state.emotionRadar = emotions;
    if (polarization !== undefined) this.state.polarizationIndex = polarization;
    this.notify();
  },

  setClusters(clusters) {
    this.state.clusters = clusters;
    this.notify();
  }
};
