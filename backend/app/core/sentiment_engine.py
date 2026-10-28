"""
Sentiment & Emotion Radar Engine
whoiam - Social Media Intelligence & Account Forensics
Menganalisis polaritas sentimen publik, spektrum emosi psikologis (4 kuadran),
dan menghitung Indeks Polarisasi Opini.
"""

from collections import deque

class SentimentEngine:
    def __init__(self, history_size=100):
        self.history_size = history_size
        self.recent_sentiments = deque(maxlen=history_size)
        self.recent_emotions = deque(maxlen=history_size)

        # Inisialisasi data awal (seimbang)
        for _ in range(30):
            self.recent_sentiments.append("POSITIVE")
            self.recent_emotions.append("TRUST")
        for _ in range(20):
            self.recent_sentiments.append("NEUTRAL")
            self.recent_emotions.append("ANTICIPATION")
        for _ in range(10):
            self.recent_sentiments.append("NEGATIVE")
            self.recent_emotions.append("ANGER")

        # Kamus Kata Kunci Emosi Bahasa Indonesia
        self.anger_lexicon = [
            "marah", "gagal", "hancur", "kebohongan", "korup", "bobol", "zalim",
            "parah", "bubar", "rusak", "pecat", "sialan", "kacau", "lumpuh"
        ]
        self.fear_lexicon = [
            "takut", "krisis", "ancaman", "bahaya", "perang", "waspada", "genting",
            "darurat", "panik", "bocor", "serang", "menyeramkan", "terancam"
        ]
        self.trust_lexicon = [
            "resmi", "aman", "terbukti", "siaga", "hebat", "terpercaya",
            "bangga", "terverifikasi", "disiplin", "profesional", "solid", "valid"
        ]
        self.anticipation_lexicon = [
            "menunggu", "klarifikasi", "apakah benar", "menantikan", "selidiki", "pantau",
            "berharap", "konfirmasi", "update", "kabar terbaru"
        ]

    def analyze_text(self, text: str) -> dict:
        """Menganalisis teks individual untuk menentukan polaritas dan emosi dominan."""
        text_lower = text.lower()

        score_anger = sum(1 for w in self.anger_lexicon if w in text_lower)
        score_fear = sum(1 for w in self.fear_lexicon if w in text_lower)
        score_trust = sum(1 for w in self.trust_lexicon if w in text_lower)
        score_anticipation = sum(1 for w in self.anticipation_lexicon if w in text_lower)

        # Penentuan Emosi Dominan
        emotion_scores = {
            "ANGER": score_anger * 1.5,
            "FEAR": score_fear * 1.3,
            "TRUST": score_trust * 1.4,
            "ANTICIPATION": score_anticipation * 1.0
        }
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        if emotion_scores[dominant_emotion] == 0:
            dominant_emotion = "NEUTRAL_ANTICIPATION"

        # Penentuan Polaritas
        if score_anger > 0 or score_fear > 0:
            polarity = "NEGATIVE"
        elif score_trust > 0:
            polarity = "POSITIVE"
        else:
            polarity = "NEUTRAL"

        scores_dict = {
            "anger": score_anger,
            "fear": score_fear,
            "trust": score_trust,
            "anticipation": score_anticipation
        }

        return {
            "polarity": polarity,
            "dominant_emotion": dominant_emotion,
            "scores": scores_dict,
            "emotions": scores_dict
        }

    def record_post(self, post: dict):
        """Mencatat postingan ke dalam riwayat rolling window untuk kalkulasi agregat."""
        pol = post.get("sentiment", "NEUTRAL")
        emo = post.get("emotion", "ANTICIPATION")
        self.recent_sentiments.append(pol)
        self.recent_emotions.append(emo)

    def get_overview(self) -> dict:
        """
        Menghitung proporsi sentimen terkini, radar emosi 4 kuadran,
        dan Indeks Polarisasi Opini publik.
        """
        total = len(self.recent_sentiments) or 1
        pos_count = sum(1 for s in self.recent_sentiments if s == "POSITIVE")
        neu_count = sum(1 for s in self.recent_sentiments if s == "NEUTRAL")
        neg_count = sum(1 for s in self.recent_sentiments if s == "NEGATIVE")

        pos_pct = round((pos_count / total) * 100.0, 1)
        neu_pct = round((neu_count / total) * 100.0, 1)
        neg_pct = round((neg_count / total) * 100.0, 1)

        # Hitung Emosi 4 Kuadran (Skala 0 - 100)
        total_emo = len(self.recent_emotions) or 1
        anger_pct = round((sum(1 for e in self.recent_emotions if e == "ANGER") / total_emo) * 100.0, 1)
        fear_pct = round((sum(1 for e in self.recent_emotions if e == "FEAR") / total_emo) * 100.0, 1)
        trust_pct = round((sum(1 for e in self.recent_emotions if e == "TRUST") / total_emo) * 100.0, 1)
        ant_pct = round((sum(1 for e in self.recent_emotions if e in ["ANTICIPATION", "NEUTRAL_ANTICIPATION"]) / total_emo) * 100.0, 1)

        # Hitung Indeks Polarisasi Opini (0 - 100)
        # Polarisasi tinggi jika Positif dan Negatif sama-sama besar dan Netral kecil
        if (pos_pct + neg_pct) > 0:
            diff_factor = abs(pos_pct - neg_pct) / (pos_pct + neg_pct)
            neu_moderator = neu_pct / 100.0
            polarization = round(100.0 * (1.0 - (diff_factor * 0.4 + neu_moderator * 0.6)), 1)
        else:
            polarization = 25.0

        dominant = "NEGATIVE" if neg_pct > pos_pct and neg_pct > neu_pct else ("POSITIVE" if pos_pct > neg_pct else "NEUTRAL")

        return {
            "polarity": {
                "positive_pct": pos_pct,
                "neutral_pct": neu_pct,
                "negative_pct": neg_pct
            },
            "emotion_radar": {
                "anger": anger_pct,
                "fear": fear_pct,
                "trust": trust_pct,
                "anticipation": ant_pct
            },
            "polarization_score": min(100.0, max(10.0, polarization)),
            "dominant_sentiment": dominant,
            "sample_size": total
        }

# Global Singleton Sentiment Engine
sentiment_engine = SentimentEngine()
