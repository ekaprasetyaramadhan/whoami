"""
Pydantic Schemas & Data Contracts
whoiam - Social Media Intelligence & Account Forensics
Mendefinisikan kontrak data request dan response yang type-safe dan tervalidasi.
"""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# 1. Telemetri & Postingan
class TelemetryPost(BaseModel):
    id: str
    platform: str
    author_id: str
    author_handle: str
    author_name: str
    content: str
    timestamp: str
    created_at: str
    bot_score: float = Field(ge=0.0, le=100.0)
    is_cib: bool = False
    cib_cluster_id: Optional[str] = None
    hoax_verdict: str
    hoax_confidence: float
    sentiment: str
    emotion: str
    shares: int = 0
    likes: int = 0

class TelemetryPostResponse(BaseModel):
    status: str = "success"
    data: TelemetryPost

# 2. EWS & Alert Status
class AlertDetail(BaseModel):
    alert_id: str
    level: str
    topic: str
    z_score: float
    velocity_ppm: int
    triggered_at: str
    action: str

class EWSStatusData(BaseModel):
    threat_level: str
    defcon: int
    defcon_name: str
    defcon_color: str
    z_score: float
    velocity_ppm: int
    baseline_ppm: float
    spike_detected: bool
    active_alert: Optional[AlertDetail] = None
    recent_volume_trend: List[int]

class EWSStatusResponse(BaseModel):
    status: str = "success"
    data: EWSStatusData

# 3. Botnet & CIB Clusters
class CIBClusterItem(BaseModel):
    cluster_id: str
    cluster_name: str
    bot_count: int
    average_bot_score: float
    temporal_window_sec: int
    propagated_narrative: str
    sample_accounts: List[str]
    status: str

class CIBSummaryData(BaseModel):
    total_monitored_accounts: int
    identified_bots: int
    active_clusters_count: int
    clusters: List[CIBClusterItem]

class CIBSummaryResponse(BaseModel):
    status: str = "success"
    data: CIBSummaryData

# 4. Hoax XAI Verification
class HoaxVerifyRequest(BaseModel):
    text: str = Field(min_length=3, description="Teks berita atau cuitan yang ingin diverifikasi")

class HoaxVerifyData(BaseModel):
    verdict: str
    confidence_pct: float
    confidence: Optional[float] = None
    threat_severity: str
    evidence_tokens: List[str]
    matched_keywords_count: int
    rationale: str
    tactical_response: str
    xai_rationale: Optional[str] = None
    recommended_action: Optional[str] = None

class HoaxVerifyResponse(BaseModel):
    status: str = "success"
    data: HoaxVerifyData

# 5. SNA Graph Topologies
class GraphNode(BaseModel):
    id: str
    name: str
    label: str
    role: str
    bot_score: float
    followers: int
    betweenness: float
    degree: float
    influence: float
    community: int
    category: int
    symbolSize: int
    itemStyle: Dict[str, str]

class GraphLink(BaseModel):
    source: str
    target: str
    relation: str
    value: int
    lineStyle: Dict[str, Any]

class GraphCategory(BaseModel):
    name: str

class SNAGraphData(BaseModel):
    total_nodes: int
    total_links: int
    nodes: List[GraphNode]
    links: List[GraphLink]
    categories: List[GraphCategory]

class SNAGraphResponse(BaseModel):
    status: str = "success"
    data: SNAGraphData

# 6. Sentiment & Emotion Radar
class SentimentPolarity(BaseModel):
    positive_pct: float
    neutral_pct: float
    negative_pct: float

class EmotionRadarScores(BaseModel):
    anger: float
    fear: float
    trust: float
    anticipation: float

class SentimentOverviewData(BaseModel):
    polarity: SentimentPolarity
    emotion_radar: EmotionRadarScores
    polarization_score: float
    dominant_sentiment: str
    sample_size: int

class SentimentOverviewResponse(BaseModel):
    status: str = "success"
    data: SentimentOverviewData

# 7. Forensics Intelligence Report
class ReportExportRequest(BaseModel):
    analyst_name: Optional[str] = "User Operator"
    incident_id: Optional[str] = "INC-2026-001"

class ReportExportData(BaseModel):
    report_id: str
    title: str
    classification: str
    generated_at: str
    analyst_name: str
    threat_level: str
    defcon: int
    markdown_content: str
    download_url: str

class ReportExportResponse(BaseModel):
    status: str = "success"
    data: ReportExportData

# 8. Simulator Controls
class SimulatorSpikeResponse(BaseModel):
    status: str = "success"
    message: str
    injected_count: int
    simulated_incident: str

class SimulatorControlRequest(BaseModel):
    speed: str = Field(description="NORMAL, TURBO, atau PAUSED")

class SimulatorControlResponse(BaseModel):
    status: str = "success"
    speed_mode: str
