"""
Unit Test Suite for LiveBuzzerHarvester
whoiam - Social Media Intelligence & Account Forensics
"""

import pytest
from app.core.live_buzzer_harvester import LiveBuzzerHarvester

@pytest.mark.anyio
async def test_live_buzzer_harvester_basic():
    harvester = LiveBuzzerHarvester()
    
    # Injeksi data mock artikel ke cache untuk menguji pemetaan akun dan topologi SNA
    mock_articles = [
        {
            "id": "test-1",
            "title": "Pilkada Jakarta memanas terkait isu subsidi transportasi",
            "source": "Antara News",
            "url": "https://antaranews.com/berita/123",
            "published_at": "Hari ini"
        },
        {
            "id": "test-2",
            "title": "Klarifikasi resmi pemprov bantah narasi hoaks anggaran",
            "source": "Kompas",
            "url": "https://kompas.com/berita/456",
            "published_at": "Hari ini"
        }
    ]
    
    # Uji ekstraksi identitas
    handle, name, platform = harvester._extract_handle_and_author("Antara News", "Isu Publik")
    assert handle.startswith("@")
    assert len(name) > 0
    assert platform in ["X", "INSTAGRAM", "FACEBOOK"]

    # Uji generasi topologi SNA dinamis
    mock_buzzers = [
        {
            "handle": "@antara_news",
            "author": "Antara News",
            "platform": "X",
            "bot_score": 85.0,
            "followers": 45000
        },
        {
            "handle": "@kompas_radar",
            "author": "Kompas Radar",
            "platform": "INSTAGRAM",
            "bot_score": 35.0,
            "followers": 12000
        }
    ]
    sna = harvester.generate_dynamic_sna_topology("DKI JAKARTA", mock_buzzers)
    assert sna["total_nodes"] >= 2
    assert sna["total_links"] >= 1
    roles = [n["role"] for n in sna["nodes"]]
    assert "GROUND_ZERO" in roles
