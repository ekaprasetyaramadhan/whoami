"""
Unit Test Suite for whoiam Core Engines
whoiam - Social Media Intelligence & Account Forensics
"""

import pytest
from app.core.ews_engine import EWSEngine
from app.core.bot_engine import BotEngine
from app.core.hoax_engine import HoaxEngine
from app.core.sna_engine import SNAEngine
from app.core.sentiment_engine import SentimentEngine

def test_ews_engine_normal_and_spike():
    engine = EWSEngine()
    # Status awal harus GREEN
    status = engine.get_current_status()
    assert status["threat_level"] in ["GREEN", "YELLOW"]
    
    # Injeksi lonjakan besar volume
    for _ in range(80):
        engine.record_post({})
    spike_status = engine.evaluate_tick(negative_ratio=0.7, bot_active=True, trigger_topic="Lonjakan Disinformasi Finansial")
    assert spike_status["z_score"] >= 2.0
    assert spike_status["threat_level"] in ["YELLOW", "RED"]

def test_bot_engine_calculation():
    engine = BotEngine()
    # Akun bot dengan username angka dan following tinggi
    bot_acc = {"handle": "@botnet_982341", "followers": 2, "following": 1400, "age_days": 4}
    bot_score = engine.calculate_unified_bot_score(bot_acc, recent_cluster_texts=["saldo raib #investasibodongviral"])
    assert bot_score >= 70.0  # Harus di atas ambang bot threshold

    # Akun organik manusia
    human_acc = {"handle": "@budi_santoso", "followers": 850, "following": 300, "age_days": 900}
    human_score = engine.calculate_unified_bot_score(human_acc)
    assert human_score <= 45.0

def test_hoax_engine_classification():
    engine = HoaxEngine()
    
    # Uji 1: Propaganda / Disinformasi Finansial
    res1 = engine.classify_text("BREAKING: Sumber anonim sebut aplikasi investasi bodong gagal bayar! #InvestasiBodongViral")
    assert res1["verdict"] in ["PROPAGANDA_TERSTRUKTUR", "HOAX"]
    assert len(res1["evidence_tokens"]) > 0
    assert "infografis" in res1["tactical_response"] or "klarifikasi" in res1["tactical_response"]
    
    # Uji 2: Fakta Resmi
    res2 = engine.classify_text("Siaran pers resmi klarifikasi resmi: Seluruh layanan beroperasi normal.")
    assert res2["verdict"] == "FAKTA_VALID"
    assert res2["confidence_pct"] >= 90.0

    # Uji 3: Provokasi
    res3 = engine.classify_text("Serang petugas di lapangan, mari buat rusuh massal sekarang!")
    assert res3["verdict"] == "PROVOKASI_HASUTAN"

def test_sna_engine_graph():
    engine = SNAEngine()
    graph_data = engine.get_graph_export()
    assert graph_data["total_nodes"] > 10
    assert graph_data["total_links"] > 10
    
    # Verifikasi keberadaan KOL dan Bot
    roles = [n["role"] for n in graph_data["nodes"]]
    assert "KOL_HUB" in roles
    assert "BOT_AMPLIFIER" in roles

def test_sentiment_engine_emotions():
    engine = SentimentEngine()
    res_neg = engine.analyze_text("Korupsi parah, sistem gagal dan hancur berantakan!")
    assert res_neg["polarity"] == "NEGATIVE"
    assert res_neg["dominant_emotion"] == "ANGER"

    res_pos = engine.analyze_text("Senang melihat layanan resmi yang sangat profesional, terpercaya, dan aman.")
    assert res_pos["polarity"] == "POSITIVE"
    assert res_pos["dominant_emotion"] == "TRUST"
    assert "emotions" in res_pos
    assert "scores" in res_pos

@pytest.mark.anyio
async def test_osint_engine_search_and_ingest():
    from app.core.osint_engine import osint_engine
    posts = await osint_engine.search_and_ingest(query="pilkada", platform="all", limit=3, inject_stream=False)
    assert len(posts) >= 1
    assert "content" in posts[0]
    assert "emotions" in posts[0]
    assert "bot_score" in posts[0]

