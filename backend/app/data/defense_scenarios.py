"""
Dataset Simulasi Skenario Media Sosial & Forensik Akun whoiam
whoiam - Social Media Intelligence & Account Forensics
Mencakup skenario serangan botnet terkoordinasi, provokasi, dan percakapan organik.
"""

import random
from datetime import datetime, timezone, timedelta

# Daftar akun Botnet Terkoordinasi (Kluster: CIB-INVEST-01)
BOTNET_ACCOUNTS = [
    {"handle": f"@ciber_bot{i:03d}", "display_name": f"Warga Alert {i}", "followers": random.randint(0, 15), "following": random.randint(800, 2500), "age_days": random.randint(2, 18), "bot_score": random.uniform(82.0, 96.0)}
    for i in range(1, 36)
]

# Daftar Akun Tokoh Kunci / Key Opinion Leader (KOL Hub)
KOL_ACCOUNTS = [
    {"handle": "@analis_opini_id", "display_name": "Pengamat Opini Publik", "followers": 84200, "following": 320, "age_days": 1820, "bot_score": 14.2, "role": "KOL_HUB"},
    {"handle": "@suara_kritis_id", "display_name": "Suara Kritis Nasional", "followers": 49100, "following": 450, "age_days": 950, "bot_score": 28.5, "role": "KOL_HUB"},
    {"handle": "@infopublik_official", "display_name": "Portal Komunikasi Publik", "followers": 320000, "following": 85, "age_days": 3100, "bot_score": 2.1, "role": "OFFICIAL"},
    {"handle": "@satgas_keuangan", "display_name": "Otoritas Regulasi Keuangan", "followers": 510000, "following": 110, "age_days": 3400, "bot_score": 1.5, "role": "OFFICIAL"},
    {"handle": "@radar_media_id", "display_name": "Kabar Tren Medsos RI", "followers": 62000, "following": 290, "age_days": 1400, "bot_score": 8.4, "role": "ORGANIC_MEDIA"}
]

# Daftar Akun Netizen Organik
ORGANIC_ACCOUNTS = [
    {"handle": f"@netizen_id{i}", "display_name": f"Masyarakat {i}", "followers": random.randint(120, 1500), "following": random.randint(100, 800), "age_days": random.randint(200, 2500), "bot_score": random.uniform(5.0, 32.0)}
    for i in range(1, 41)
]

# Template Konten Skenario A: Disinformasi Manipulasi Finansial & Tagar Viral (#InvestasiBodongViral) - CIB Campaign
SCENARIO_RADAR_ALUTSISTA = [
    {
        "text": "BREAKING: Sumber anonim sebut aplikasi investasi viral gagal bayar ratusan miliar sejak 3 hari lalu! Server ditutup! Otoritas kemana? #InvestasiBodongViral",
        "verdict": "PROPAGANDA_TERSTRUKTUR",
        "confidence": 95.2,
        "sentiment": "NEGATIVE",
        "emotion": "ANGER",
        "is_cib": True,
        "cluster_id": "CIB-INVEST-01"
    },
    {
        "text": "Parah banget! Kantor investasi bodong tutup total tapi disembunyikan dari nasabah. Kerugian makin parah nih. #InvestasiBodongViral",
        "verdict": "PROPAGANDA_TERSTRUKTUR",
        "confidence": 94.6,
        "sentiment": "NEGATIVE",
        "emotion": "ANGER",
        "is_cib": True,
        "cluster_id": "CIB-INVEST-01"
    },
    {
        "text": "Apakah benar dana nasabah hilang total? Izin operasional dicabut, uang ribuan pengguna terancam hangus! #InvestasiBodongViral",
        "verdict": "HOAX",
        "confidence": 91.0,
        "sentiment": "NEGATIVE",
        "emotion": "FEAR",
        "is_cib": True,
        "cluster_id": "CIB-INVEST-01"
    },
    {
        "text": "Masyarakat dibohongi lagi! Aplikasi abal-abal dipromosikan masif giliran ditarik saldo lumpuh total. Usut tuntas sindikat di baliknya! #InvestasiBodongViral",
        "verdict": "PROPAGANDA_TERSTRUKTUR",
        "confidence": 96.0,
        "sentiment": "NEGATIVE",
        "emotion": "ANGER",
        "is_cib": True,
        "cluster_id": "CIB-INVEST-01"
    },
    {
        "text": "Kerugian nasabah tembus miliaran kawan-kawan! Jangan diam, saldo tidak bisa ditarik dan tidak ada klarifikasi resmi! #InvestasiBodongViral",
        "verdict": "PROPAGANDA_TERSTRUKTUR",
        "confidence": 93.8,
        "sentiment": "NEGATIVE",
        "emotion": "ANGER",
        "is_cib": True,
        "cluster_id": "CIB-INVEST-01"
    }
]

# Skenario B: Provokasi & Hasutan Isu Sosial
SCENARIO_PROVOKASI_PERBATASAN = [
    {
        "text": "Kabar duka, aksi unjuk rasa warga dibubarkan paksa oleh oknum aparat, sejumlah fasilitas rusak! Saatnya tolak kebijakan sepihak segera!",
        "verdict": "PROVOKASI_HASUTAN",
        "confidence": 94.0,
        "sentiment": "NEGATIVE",
        "emotion": "ANGER",
        "is_cib": False
    },
    {
        "text": "Jangan percaya informasi sepihak! Rakyat menolak regulasi baru, mari lakukan aksi serentak di setiap daerah!",
        "verdict": "PROVOKASI_HASUTAN",
        "confidence": 95.5,
        "sentiment": "NEGATIVE",
        "emotion": "ANGER",
        "is_cib": False
    },
    {
        "text": "Beredar video lama kericuhan tahun 2019 diunggah kembali seolah kejadian baru di pusat kota. Narasi sangat menyesatkan.",
        "verdict": "MISLEADING",
        "confidence": 88.0,
        "sentiment": "NEUTRAL",
        "emotion": "ANTICIPATION",
        "is_cib": False
    }
]

# Skenario C: Percakapan Organik & Klarifikasi Resmi
SCENARIO_ORGANIK_POSITIF = [
    {
        "text": "Klarifikasi Resmi Otoritas: Seluruh layanan perbankan dan transaksi digital beroperasi normal 100% dan terintegrasi secara aman.",
        "verdict": "FAKTA_VALID",
        "confidence": 98.5,
        "sentiment": "POSITIVE",
        "emotion": "TRUST",
        "is_cib": False,
        "is_official": True
    },
    {
        "text": "Siaran pers resmi Kementerian menegaskan isu pembekuan rekening massal adalah disinformasi hoaks tidak berdasar.",
        "verdict": "FAKTA_VALID",
        "confidence": 97.8,
        "sentiment": "POSITIVE",
        "emotion": "TRUST",
        "is_cib": False,
        "is_official": True
    },
    {
        "text": "Senang melihat transparansi layanan publik yang semakin modern dan responsif membantu aduan warga.",
        "verdict": "FAKTA_VALID",
        "confidence": 96.0,
        "sentiment": "POSITIVE",
        "emotion": "TRUST",
        "is_cib": False
    },
    {
        "text": "Jangan mudah terhasut tagar yang tiba-tiba trending tengah malam. Cek selalu sumber resmi dari kanal terverifikasi.",
        "verdict": "FAKTA_VALID",
        "confidence": 92.0,
        "sentiment": "POSITIVE",
        "emotion": "TRUST",
        "is_cib": False
    },
    {
        "text": "Semoga para petugas pelayanan masyarakat yang bertugas di lapangan selalu diberi kelancaran dan kesehatan. Tetap semangat!",
        "verdict": "FAKTA_VALID",
        "confidence": 95.0,
        "sentiment": "POSITIVE",
        "emotion": "TRUST",
        "is_cib": False
    }
]

def generate_telemetry_post(forced_scenario=None, is_spike=False) -> dict:
    """
    Menghasilkan 1 entitas postingan telemetri simulasi realistis.
    """
    now = datetime.now(timezone.utc)
    post_id = f"post_{random.randint(10000, 99999)}"

    # Jika sedang terjadi injeksi spike, prioritaskan skenario botnet #InvestasiBodongViral
    if is_spike or forced_scenario == "SPIKE_BOTNET":
        template = random.choice(SCENARIO_RADAR_ALUTSISTA)
        bot = random.choice(BOTNET_ACCOUNTS)
        author_handle = bot["handle"]
        display_name = bot["display_name"]
        bot_score = bot["bot_score"]
        is_cib = True
        cluster_id = "CIB-INVEST-01"
    else:
        # Distribusi probabilitas normal: 50% Organik, 30% Netizen umum, 20% Provokasi sporadis
        dice = random.random()
        if dice < 0.45:
            template = random.choice(SCENARIO_ORGANIK_POSITIF)
            if template.get("is_official"):
                account = random.choice([KOL_ACCOUNTS[2], KOL_ACCOUNTS[3]])
            else:
                account = random.choice(ORGANIC_ACCOUNTS)
        elif dice < 0.75:
            template = random.choice(SCENARIO_RADAR_ALUTSISTA)
            account = random.choice(BOTNET_ACCOUNTS)
        else:
            template = random.choice(SCENARIO_PROVOKASI_PERBATASAN)
            account = random.choice(ORGANIC_ACCOUNTS)

        author_handle = account["handle"]
        display_name = account["display_name"]
        bot_score = account.get("bot_score", 15.0)
        is_cib = template.get("is_cib", False)
        cluster_id = template.get("cluster_id")

    sample_provinces = [
        "DKI JAKARTA", "JAWA BARAT", "JAWA TENGAH", "JAWA TIMUR", 
        "SUMATERA UTARA", "SULAWESI SELATAN", "BALI", "KALIMANTAN TIMUR", 
        "BANTEN", "SUMATERA SELATAN", "PAPUA", "ACEH", "RIAU", "LAMPUNG"
    ]
    assigned_prov = random.choice(sample_provinces)

    return {
        "id": post_id,
        "platform": random.choice(["X", "INSTAGRAM", "THREADS", "FACEBOOK"]),
        "author_id": f"usr_{abs(hash(author_handle)) % 100000}",
        "author_handle": author_handle,
        "author_name": display_name,
        "content": template["text"],
        "province": assigned_prov,
        "city": assigned_prov.title(),
        "date_time_release": now.strftime("%Y-%m-%d %H:%M:%S WIB"),
        "time_delta": "T+0m",
        "is_ground_zero": True if (is_cib and random.random() < 0.3) else False,
        "timestamp": now.strftime("%H:%M:%S"),
        "created_at": now.isoformat(),
        "bot_score": bot_score,
        "is_cib": is_cib,
        "cib_cluster_id": cluster_id,
        "hoax_verdict": template["verdict"],
        "hoax_confidence": template["confidence"],
        "sentiment": template["sentiment"],
        "emotion": template["emotion"],
        "shares": random.randint(0, 140) if is_cib else random.randint(2, 45),
        "likes": random.randint(1, 350)
    }

