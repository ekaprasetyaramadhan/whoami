"""
Geo-Spatial Buzzer Router
REST Endpoints untuk:
1. Persebaran Buzzer & Follower Terbanyak di Peta
2. SNA Spesifik Wilayah
3. Crawling Berita Regional per Provinsi
4. Scraping Feeds Medsos (X, Instagram, Facebook)
"""

from fastapi import APIRouter, Query
from typing import Optional
from app.core.geo_buzzer_engine import geo_buzzer_engine
from app.core.live_buzzer_harvester import live_buzzer_harvester

router = APIRouter(prefix="/geo", tags=["Geo-Spatial Intelligence"])

@router.get("/buzzer-distribution")
async def get_buzzer_distribution(
    platform: Optional[str] = Query("all", description="Filter medsos: all, x, instagram, facebook"),
    province: Optional[str] = Query("all", description="Filter provinsi: all atau nama provinsi")
):
    # Jika provinsi spesifik dipilih, lakukan penarikan live data secara dinamis
    if province and province.lower() != "all":
        prov_key = province.upper()
        prov_info = geo_buzzer_engine.provinces.get(prov_key)
        coords = prov_info.get("coords", [106.8456, -6.2088]) if prov_info else [106.8456, -6.2088]
        harvested = await live_buzzer_harvester.harvest_province_data(prov_key, coords)
        live_buzzers = harvested.get("buzzers", [])

        if platform and platform.lower() != "all":
            live_buzzers = [b for b in live_buzzers if b["platform"].lower() == platform.lower()]

        if live_buzzers:
            total_followers = sum(b.get("followers", 0) for b in live_buzzers)
            high_risk_count = sum(1 for b in live_buzzers if b.get("threat_level") in ["HIGH", "CRITICAL"])
            return {
                "status": "success",
                "is_live_scraped": True,
                "data_source": "LIVE_ETHICAL_SCRAPING",
                "data": {
                    "total_nodes": len(live_buzzers),
                    "total_followers_reach": total_followers,
                    "high_risk_count": high_risk_count,
                    "data": live_buzzers
                }
            }

    data = geo_buzzer_engine.get_buzzer_distribution(platform=platform, province=province)
    total_followers = sum(b.get("followers", 0) for b in data)
    high_risk_count = sum(1 for b in data if b.get("threat_level") in ["HIGH", "CRITICAL"])
    return {
        "status": "success",
        "is_live_scraped": False,
        "data_source": "CURATED_BASELINE",
        "data": {
            "total_nodes": len(data),
            "total_followers_reach": total_followers,
            "high_risk_count": high_risk_count,
            "data": data
        }
    }

@router.get("/provinces-summary")
def get_provinces_summary():
    """Mengambil ringkasan intensitas buzzer dan total reach per provinsi untuk pewarnaan peta wilayah."""
    data = geo_buzzer_engine.get_provinces_summary()
    return {
        "status": "success",
        "data": data
    }

@router.get("/regional-news")
def get_regional_news(
    province: Optional[str] = Query("all", description="Filter berita berdasarkan provinsi")
):
    """Endpoint hasil crawling berita daerah dari berbagai portal berita lokal."""
    news = geo_buzzer_engine.get_regional_news(province=province)
    return {
        "status": "success",
        "total": len(news),
        "data": news
    }

@router.get("/social-feeds")
async def get_social_feeds(
    platform: Optional[str] = Query("all", description="Filter medsos: all, x, instagram, facebook"),
    province: Optional[str] = Query("all", description="Filter provinsi")
):
    """Endpoint hasil scraping feeds medsos buzzer secara real-time (Instagram, X, Facebook)."""
    prov_key = (province or "DKI JAKARTA").upper()
    if prov_key != "ALL":
        prov_info = geo_buzzer_engine.provinces.get(prov_key)
        coords = prov_info.get("coords", [106.8456, -6.2088]) if prov_info else [106.8456, -6.2088]
        harvested = await live_buzzer_harvester.harvest_province_data(prov_key, coords)
        live_posts = harvested.get("posts", [])
        if platform and platform.lower() != "all":
            live_posts = [p for p in live_posts if p["platform"].lower() == platform.lower()]
        if live_posts:
            return {
                "status": "success",
                "is_live_scraped": True,
                "data_source": "LIVE_ETHICAL_SCRAPING",
                "total": len(live_posts),
                "data": live_posts
            }

    feeds = geo_buzzer_engine.get_social_media_feeds(platform=platform, province=province)
    return {
        "status": "success",
        "is_live_scraped": False,
        "data_source": "CURATED_BASELINE",
        "total": len(feeds),
        "data": feeds
    }

@router.get("/province-sna/{province}")
async def get_province_sna(province: str):
    """Mengambil topologi graf SNA interaksi buzzer vs botnet vs netizen untuk provinsi terpilih."""
    prov_key = province.upper()
    prov_info = geo_buzzer_engine.provinces.get(prov_key)
    coords = prov_info.get("coords", [106.8456, -6.2088]) if prov_info else [106.8456, -6.2088]
    harvested = await live_buzzer_harvester.harvest_province_data(prov_key, coords)
    live_buzzers = harvested.get("buzzers", [])

    if live_buzzers and len(live_buzzers) >= 2:
        sna_data = live_buzzer_harvester.generate_dynamic_sna_topology(prov_key, live_buzzers)
        formatted_nodes = []
        for n in sna_data["nodes"]:
            is_gz = (n["role"] == "GROUND_ZERO")
            formatted_nodes.append({
                "id": n["id"],
                "name": n["id"],
                "label": n["label"],
                "role": n["role"],
                "category": 0 if is_gz else (1 if n["role"] == "BOT_AMPLIFIER" else 2),
                "symbolSize": n["size"],
                "itemStyle": {
                    "color": n["color"],
                    "borderColor": "#fff",
                    "borderWidth": 1.5,
                    "shadowBlur": 10 if is_gz else 4,
                    "shadowColor": n["color"]
                },
                "followers": n["followers"],
                "bot_score": n["bot_score"],
                "influence": 90.0 if is_gz else 45.0,
                "platform": n["platform"],
                "is_live_scraped": True
            })

        formatted_links = []
        for l in sna_data["links"]:
            formatted_links.append({
                "source": l["source"],
                "target": l["target"],
                "relation": l["interaction"],
                "value": l["weight"],
                "lineStyle": {"color": "#8b5cf6", "width": 2, "type": "solid"}
            })

        return {
            "status": "success",
            "is_live_scraped": True,
            "data_source": "DYNAMIC_LIVE_INTERACTIONS",
            "data": {
                "province": prov_key,
                "total_nodes": len(formatted_nodes),
                "total_links": len(formatted_links),
                "nodes": formatted_nodes,
                "links": formatted_links,
                "categories": [
                    {"name": "Ground Zero (Sumber Utama)", "itemStyle": {"color": "#ef4444"}},
                    {"name": "Botnet Farm Amplifiers", "itemStyle": {"color": "#8b5cf6"}},
                    {"name": "Warga Netizen Organik", "itemStyle": {"color": "#38bdf8"}},
                    {"name": "Cross Mirror Akun", "itemStyle": {"color": "#ec4899"}}
                ]
            }
        }

    sna_data = geo_buzzer_engine.get_province_sna_network(province_name=province)
    return {
        "status": "success",
        "is_live_scraped": False,
        "data_source": "CURATED_BASELINE",
        "data": sna_data
    }

@router.get("/propagation-lines")
def get_propagation_lines(
    province: Optional[str] = Query("DKI JAKARTA", description="Nama provinsi asal / Ground Zero"),
    timeframe: Optional[str] = Query("24h", description="Rentang waktu: 1h, 6h, 24h, 7d")
):
    """Mengambil kurva garis transmisi penyebaran isu antar-provinsi."""
    lines = geo_buzzer_engine.get_propagation_flight_lines(province_name=province, timeframe=timeframe)
    return {
        "status": "success",
        "total_routes": len(lines),
        "timeframe": timeframe,
        "origin_province": province,
        "data": lines
    }
