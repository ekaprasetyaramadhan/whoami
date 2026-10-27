"""
Kamus Kata Kunci Isu Sensitif & Disinformasi Media Sosial
whoiam - Social Media Intelligence & Account Forensics
"""

DEFENSE_KEYWORDS = {
    "PENIPUAN_FINANSIAL": {
        "weight": 2.5,
        "threat_severity": "HIGH",
        "description": "Isu penipuan finansial online, investasi bodong, pembekuan saldo sepihak, dan kerugian massal.",
        "terms": [
            "investasi bodong", "gagal bayar", "saldo raib", "#investasibodongviral",
            "rekening dibekukan", "aplikasi tipu", "dana nasabah hilang", "skema ponzi",
            "kantor tutup kabur", "tarik paksa saldo"
        ]
    },
    "HASUTAN_KEKERASAN": {
        "weight": 2.8,
        "threat_severity": "CRITICAL",
        "description": "Agitasi kekerasan fisik, ajakan kerusuhan, perusakan fasilitas, dan pembangkangan anarkis.",
        "terms": [
            "serang petugas", "bakar posko", "rusuh massal", "perang saudara",
            "anarki sipil", "robohkan gedung", "hancurkan kantor", "ajakan ricuh"
        ]
    },
    "DISINFORMASI_KRITIS": {
        "weight": 2.6,
        "threat_severity": "CRITICAL",
        "description": "Fabrikasi hoaks krisis publik, rekayasa kabar bencana, atau narasi kepanikan sosial.",
        "terms": [
            "server mati total", "bencana disembunyikan", "kebocoran data massal",
            "rakyat dibohongi", "lumpuh total", "bocoran rahasia palsu",
            "peringatan darurat palsu", "kontaminasi massal"
        ]
    },
    "MANIPULASI_OPINI_CIB": {
        "weight": 2.2,
        "threat_severity": "HIGH",
        "description": "Operasi kampanye botnet terkoordinasi, amplifikasi narasi palsu, dan framing fitnah.",
        "terms": [
            "sumber anonim sebut", "viralkan sebelum dihapus", "bagikan sekarang",
            "jangan percaya klarifikasi", "bukti otentik konspirasi", "rahasia terbongkar"
        ]
    },
    "INSTABILITAS_SOSIAL": {
        "weight": 1.8,
        "threat_severity": "MEDIUM",
        "description": "Ajakan pemboikotan sepihak, provokasi antar-kelompok, dan kepanikan pasar.",
        "terms": [
            "turunkan paksa", "boikot serentak", "blokir fasilitas publik",
            "mogok massal", "kepanikan massal"
        ]
    }
}

def match_keywords(text: str) -> list[dict]:
    """
    Mencocokkan teks terhadap kamus kata kunci sensitif media sosial.
    Mengembalikan daftar kata kunci yang cocok beserta kategori dan bobot ancamannya.
    """
    text_lower = text.lower()
    matches = []

    for category, meta in DEFENSE_KEYWORDS.items():
        for term in meta["terms"]:
            if term in text_lower:
                matches.append({
                    "term": term,
                    "category": category,
                    "weight": meta["weight"],
                    "threat_severity": meta["threat_severity"]
                })

    return matches
