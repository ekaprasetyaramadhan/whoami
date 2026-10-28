"""
Unit Test Suite for Ethical Scraper & robots.txt Compliance
whoiam - Social Media Intelligence & Account Forensics
"""

import pytest
from app.core.ethical_scraper import EthicalScraperService, DEFAULT_BOT_USER_AGENT
from urllib.robotparser import RobotFileParser

@pytest.mark.anyio
async def test_ethical_scraper_ssrf_protection():
    scraper = EthicalScraperService()
    
    # 1. URL Lokal / Loopback harus ditolak oleh Anti-SSRF
    allowed, details = await scraper.can_fetch_url("http://127.0.0.1:8000/admin")
    assert allowed is False
    assert details["robots_checked"] is False
    assert "Anti-SSRF" in details["reason"]

    # 2. URL Private Subnet RFC 1918 harus ditolak
    allowed_priv, details_priv = await scraper.can_fetch_url("http://192.168.1.1/secret")
    assert allowed_priv is False

@pytest.mark.anyio
async def test_ethical_scraper_robot_parser_logic():
    scraper = EthicalScraperService()
    
    # Injeksi mock parser ke cache untuk domain uji
    mock_parser = RobotFileParser()
    mock_parser.parse([
        "User-agent: *",
        "Disallow: /private/",
        "Allow: /public/",
        "Crawl-delay: 2"
    ])
    
    from app.core.ethical_scraper import RobotCacheEntry
    scraper._robots_cache["https://example.com"] = RobotCacheEntry(
        parser=mock_parser,
        status_code=200,
        fetched_at=9999999999.0,
        raw_text="User-agent: *\nDisallow: /private/\nAllow: /public/"
    )
    
    # Path publik harus diizinkan
    allowed_pub, details_pub = await scraper.can_fetch_url("https://example.com/public/news")
    assert allowed_pub is True
    assert details_pub["allowed"] is True
    assert details_pub["crawl_delay_seconds"] == 2.0
    
    # Path privat harus dilarang sesuai robots.txt
    allowed_priv, details_priv = await scraper.can_fetch_url("https://example.com/private/vault")
    assert allowed_priv is False
    assert details_priv["compliance_verdict"] == "DISALLOWED_BY_ROBOTS_TXT"
