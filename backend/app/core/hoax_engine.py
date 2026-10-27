"""
Explainable Hoax & Propaganda Classifier Engine (XAI Engine)
whoiam - Social Media Intelligence & Account Forensics
Menganalisis konten teks ke dalam 5 taksonomi putusan, menyertakan bukti pemicu (evidence),
dan menyusun argumen rasional yang dapat diaudit (Explainable AI Rationale).
"""

import re
from app.data.keywords import match_keywords

class HoaxEngine:
    def __init__(self):
        # Penanda Fakta Terverifikasi / Lembaga Resmi
        self.verified_markers = [
            "siaran pers resmi", "klarifikasi resmi", "keterangan resmi",
            "telah dikonfirmasi", "beroperasi normal", "otoritas resmi",
            "satgas terpadu", "kanal terverifikasi"
        ]

        # Pemicu Provokasi & Hasutan
        self.provocation_markers = [
            "serang petugas", "bakar posko", "rusuh massal", "angkat senjata",
            "perang saudara", "anarki sipil", "robohkan gedung"
        ]

        # Pemicu Propaganda Terstruktur
        self.propaganda_markers = [
            "mati total", "korupsi pengadaan", "investasi bodong", "rakyat dibohongi",
            "disembunyikan dari nasabah", "#investasibodongviral", "saldo raib", "lumpuh total"
        ]

        # Pemicu Hoaks Konvensional
        self.hoax_markers = [
            "sumber anonim sebut", "dana hilang total", "server ditutup sepihak",
            "kebocoran rahasia palsu", "rekening dibekukan massal"
        ]

    def classify_text(self, text: str) -> dict:
        """
        Melakukan inferensi klasifikasi teks dengan Explainable AI Rationale.
        """
        text_lower = text.lower()
        matched_kw = match_keywords(text)

        found_verified = [m for m in self.verified_markers if m in text_lower]
        found_provocation = [m for m in self.provocation_markers if m in text_lower]
        found_propaganda = [m for m in self.propaganda_markers if m in text_lower]
        found_hoax = [m for m in self.hoax_markers if m in text_lower]

        evidence_tokens = found_verified + found_provocation + found_propaganda + found_hoax
        for kw in matched_kw:
            if kw["term"] not in evidence_tokens:
                evidence_tokens.append(kw["term"])

        # Logika Penentuan Taksonomi
        if len(found_verified) >= 1 and len(found_propaganda) == 0 and len(found_provocation) == 0:
            verdict = "FAKTA_VALID"
            confidence = 97.4
            threat_severity = "LOW"
            rationale = (
                f"Konten secara eksplisit merujuk pada rilis resmi instansi/lembaga terverifikasi ({', '.join(found_verified)}). "
                "Informasi sesuai dengan fakta primer yang dapat dipertanggungjawabkan."
            )
            tactical_response = "Diseminasi informasi faktual dan pantau respon audiens untuk menjaga sentimen berimbang."

        elif len(found_provocation) >= 1:
            verdict = "PROVOKASI_HASUTAN"
            confidence = 94.6
            threat_severity = "CRITICAL"
            rationale = (
                f"Terdeteksi diksi agitasi konflik terbuka dan provokasi permusuhan: '{', '.join(found_provocation)}'. "
                "Konten bertujuan memicu polarisasi horizontal dan keresahan masyarakat."
            )
            tactical_response = "Mitigasi risiko narasi dengan menyajikan fakta pembanding dan pelaporan akun provokatif."

        elif len(found_propaganda) >= 2 or ("#investasibodongviral" in text_lower):
            verdict = "PROPAGANDA_TERSTRUKTUR"
            confidence = 95.8
            threat_severity = "CRITICAL"
            rationale = (
                f"Teks teridentifikasi memuat pola kampanye manipulatif terorganisir dengan kata pemicu: '{', '.join(found_propaganda)}'. "
                "Narasi ini mendaur ulang klaim spekulatif tanpa bukti untuk memanipulasi opini publik."
            )
            tactical_response = "Terbitkan infografis dan rilis data faktual terbuka untuk mematahkan narasi manipulatif."

        elif len(found_hoax) >= 1 or len(found_propaganda) == 1:
            verdict = "HOAX"
            confidence = 89.2
            threat_severity = "HIGH"
            rationale = (
                f"Klaim menyajikan informasi palsu tanpa verifikasi data primer: '{', '.join(found_hoax or found_propaganda)}'. "
                "Menggunakan teknik dramatisasi untuk menimbulkan kepanikan sosial."
            )
            tactical_response = "Labeli konten sebagai disinformasi dan lakukan klarifikasi berbasis data faktual."

        else:
            verdict = "MISLEADING"
            confidence = 81.5
            threat_severity = "MEDIUM"
            rationale = (
                "Konten mencampurkan sebagian fakta lapangan dengan framing spekulatif yang berpotensi membingungkan masyarakat luas."
            )
            tactical_response = "Edukasi masyarakat dengan meluruskan konteks informasi yang diplintir."

        return {
            "verdict": verdict,
            "confidence_pct": confidence,
            "confidence": confidence / 100.0,
            "threat_severity": threat_severity,
            "evidence_tokens": evidence_tokens,
            "matched_keywords_count": len(matched_kw),
            "rationale": rationale,
            "tactical_response": tactical_response,
            "xai_rationale": rationale,
            "recommended_action": tactical_response
        }

# Global Singleton Hoax Engine
hoax_engine = HoaxEngine()
