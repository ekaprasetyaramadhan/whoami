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

router = APIRouter(prefix="/geo", tags=["Geo-Spatial Intelligence"])

@router.get("/buzzer-distribution")
def get_buzzer_distribution(
    platform: Optional[str] = Query("all", description="Filter medsos: all, x, instagram, facebook, tiktok, threads"),
    province: Optional[str] = Query("all", description="Filter provinsi: all atau nama provinsi")
):
    data = geo_buzzer_engine.get_buzzer_distribution(platform=platform, province=province)
    total_followers = sum(b.get("followers", 0) for b in data)
    high_risk_count = sum(1 for b in data if b.get("threat_level") == "HIGH")
    return {
        "status": "success",
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
def get_social_feeds(
    platform: Optional[str] = Query("all", description="Filter medsos: all, x, instagram, facebook, tiktok, threads"),
    province: Optional[str] = Query("all", description="Filter provinsi")
):
    """Endpoint hasil scraping feeds medsos buzzer (Instagram, X, Facebook, TikTok, Threads)."""
    feeds = geo_buzzer_engine.get_social_media_feeds(platform=platform, province=province)
    return {
        "status": "success",
        "total": len(feeds),
        "data": feeds
    }

@router.get("/province-sna/{province}")
def get_province_sna(province: str):
    """Mengambil topologi graf SNA interaksi buzzer vs botnet vs netizen untuk provinsi terpilih."""
    sna_data = geo_buzzer_engine.get_province_sna_network(province_name=province)
    return {
        "status": "success",
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
