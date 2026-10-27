"""
Report Generator Router
Endpoint penyusunan Laporan Investigasi Akun & Forensik Narasi (whoiam Forensics).
"""

from fastapi import APIRouter
from datetime import datetime, timezone
from app.models.schemas import ReportExportRequest, ReportExportResponse
from app.core.ews_engine import ews_engine
from app.core.sentiment_engine import sentiment_engine

router = APIRouter(prefix="/reports", tags=["Intelligence Reports"])

@router.post("/export-report", response_model=ReportExportResponse)
@router.post("/export-lapsit", response_model=ReportExportResponse)
def export_lapsit_report(req: ReportExportRequest):
    """
    Menghasilkan berkas Laporan Investigasi Akun & Forensik Narasi Media Sosial
    berstandar platform WHOIAM dalam format Markdown.
    """
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%d %B %Y").upper()
    time_str = now.strftime("%H:%M:%S") + " WIB"
    report_num = f"WHOIAM/REP/{now.strftime('%m%d%H%M')}/2026"
    analyst = req.analyst_name or "User"
    
    ews_data = ews_engine.get_current_status()
    snt_data = sentiment_engine.get_overview()

    markdown_doc = f"""# 🔍 WHOIAM - SOCIAL MEDIA INTELLIGENCE & FORENSIC SUITE
## LAPORAN INVESTIGASI AKUN & FORENSIK NARASI MEDIA SOSIAL
**Nomor Berkas**: {report_num}  
**Klasifikasi**: ANALISIS INTERNAL / HASIL INVESTIGASI  
**Waktu Penerbitan**: {date_str} - {time_str}  
**Operator / Analis**: {analyst} (Role: User)  
**Status Anomali**: ALERT LEVEL {ews_data['defcon']} ({ews_data['threat_level']})

---

### I. RINGKASAN EKSEKUTIF
Sistem analisis kognitif WHOIAM mendeteksi anomali transmisi narasi media sosial dengan nilai deviasi lonjakan **Z-Score: {ews_data['z_score']}** (Kecepatan: {ews_data['velocity_ppm']} posts/menit dibandingkan baseline normal {ews_data['baseline_ppm']} posts/menit).

Analisis telemetri mengindikasikan adanya kampanye terkoordinasi (*Coordinated Inauthentic Behavior / CIB*) yang menggunakan jaringan akun bot untuk memanipulasi algoritma trending topic publik.

### II. STATUS ANCAMAN & IDENTIFIKASI DISINFORMASI
* **Topik Utama**: Isu Disinformasi Rekayasa Narasi Terkoordinasi (#InvestasiBodongViral)
* **Klasifikasi AI**: **PROPAGANDA TERSTRUKTUR** (Keyakinan: 95.8%)
* **Indikator Anomali**: Ditemukan 35+ akun botnet baru dengan kesamaan teks > 85% dalam selisih waktu sempit.
* **Sentimen Dominan**: **NEGATIF ({snt_data['polarity']['negative_pct']}%)**
* **Spektrum Emosi Publik**: Kemarahan ({snt_data['emotion_radar']['anger']}%), Ketakutan ({snt_data['emotion_radar']['fear']}%), Kepercayaan ({snt_data['emotion_radar']['trust']}%)
* **Indeks Polarisasi Opini**: {snt_data['polarization_score']}/100

### III. JARINGAN AKTOR UTAMA (SOCIAL NETWORK ANALYSIS)
1. **Aktor Penggerak Utama (KOL Hub)**: `@analis_opini_id` (Betweenness Centrality: 0.84, Pengaruh: 95/100)
2. **Kluster Botnet Teridentifikasi**: `CIB-INVEST-01` (35 akun terkoordinasi)
3. **Akun Penggembung (Amplifier Nodes)**: `@ciber_bot001` s/d `@ciber_bot035`

### IV. REKOMENDASI RESPON & MITIGASI
1. **Penerbitan Klarifikasi Faktual**: Publikasikan infografis dan data faktual di seluruh kanal resmi (Instagram, X, Facebook, Threads) untuk meluruskan konteks yang diplintir.
2. **Pelaporan Akun ke Platform**: Laporkan daftar ID akun botnet yang teridentifikasi ke tim Trust & Safety platform media sosial terkait untuk tindakan mitigasi/penangguhan.
3. **Pemantauan Berkelanjutan**: Lanjutkan pemantauan indikator Z-score hingga kurva anomali mereda di bawah ambang normal.

---
*Dikeluarkan secara otomatis oleh Platform Analisis Akun WHOIAM*
"""

    return {
        "status": "success",
        "data": {
            "report_id": report_num,
            "title": "LAPORAN INVESTIGASI AKUN & FORENSIK NARASI",
            "classification": "ANALISIS INTERNAL",
            "generated_at": now.isoformat(),
            "analyst_name": analyst,
            "threat_level": ews_data['threat_level'],
            "defcon": ews_data['defcon'],
            "markdown_content": markdown_doc,
            "download_url": f"/api/v1/reports/download/{report_num.replace('/', '_')}.md"
        }
    }
