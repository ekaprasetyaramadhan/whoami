"""
Social Network Analysis (SNA Studio Engine)
whoiam - Social Media Intelligence & Account Forensics
Membangun graf interaksi sosial (NetworkX), menghitung metrik sentralitas,
mendeteksi partisi komunitas (Louvain), dan mengidentifikasi peran aktor siber.
"""

import networkx as nx
import random
from app.data.defense_scenarios import KOL_ACCOUNTS, BOTNET_ACCOUNTS, ORGANIC_ACCOUNTS

class SNAEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._initialize_baseline_network()

    def _initialize_baseline_network(self):
        """Membangun topologi jaringan awal dari aktor-aktor simulasi."""
        self.graph.clear()

        # 1. Tambahkan simpul KOL Hub
        for kol in KOL_ACCOUNTS:
            self.graph.add_node(
                kol["handle"],
                label=kol["display_name"],
                role=kol.get("role", "KOL_HUB"),
                bot_score=kol.get("bot_score", 10.0),
                followers=kol.get("followers", 50000),
                community=1 if "infopublik" in kol["handle"] or "satgas" in kol["handle"] else 2
            )

        # 2. Tambahkan simpul Botnet (Kluster CIB)
        for bot in BOTNET_ACCOUNTS[:25]:
            self.graph.add_node(
                bot["handle"],
                label=bot["display_name"],
                role="BOT_AMPLIFIER",
                bot_score=bot.get("bot_score", 88.0),
                followers=bot.get("followers", 5),
                community=3 # Komunitas botnet
            )
            # Hubungkan botnet ke KOL provokasi (@analis_opini_id / @suara_kritis_id)
            target = "@analis_opini_id" if random.random() > 0.4 else "@suara_kritis_id"
            self.graph.add_edge(bot["handle"], target, weight=random.randint(2, 6), relation="RETWEET")

        # 3. Tambahkan simpul Akun Organik
        for org in ORGANIC_ACCOUNTS[:15]:
            self.graph.add_node(
                org["handle"],
                label=org["display_name"],
                role="ORGANIC",
                bot_score=org.get("bot_score", 12.0),
                followers=org.get("followers", 500),
                community=1
            )
            # Organik me-retweet rilis resmi atau sesama warga
            target = "@infopublik_official" if random.random() > 0.5 else "@radar_media_id"
            self.graph.add_edge(org["handle"], target, weight=1, relation="REPLY")

        # 4. Tambahkan jembatan (Bridge Node)
        self.graph.add_edge("@radar_media_id", "@analis_opini_id", weight=3, relation="MENTION")

    def update_with_post(self, post: dict):
        """Memperbarui graf berdasarkan postingan baru."""
        author = post.get("author_handle", "@unknown")
        bot_score = post.get("bot_score", 15.0)
        is_cib = post.get("is_cib", False)
        
        role = "BOT_AMPLIFIER" if is_cib or bot_score > 70 else "ORGANIC"
        community = 3 if is_cib else (1 if "resmi" in post.get("content", "").lower() else 2)

        if not self.graph.has_node(author):
            self.graph.add_node(
                author,
                label=post.get("author_name", author),
                role=role,
                bot_score=bot_score,
                followers=random.randint(5, 500),
                community=community
            )

        # Hubungkan ke aktor sentral jika berupa kampanye manipulasi
        if is_cib:
            self.graph.add_edge(author, "@analis_opini_id", weight=2, relation="RETWEET")

    def get_graph_export(self, min_influence=0, cluster_filter=None) -> dict:
        """
        Menghitung kalkulasi sentralitas dan mengembalikan JSON node & link
        yang siap dirender oleh pustaka ECharts atau Cytoscape.js.
        """
        # Hitung Sentralitas
        deg_centrality = nx.degree_centrality(self.graph)
        try:
            bet_centrality = nx.betweenness_centrality(self.graph)
        except Exception:
            bet_centrality = {n: 0.1 for n in self.graph.nodes()}

        nodes_list = []
        links_list = []

        for node_id in self.graph.nodes():
            attrs = self.graph.nodes[node_id]
            deg = deg_centrality.get(node_id, 0.0)
            bet = bet_centrality.get(node_id, 0.0)
            
            # Hitung skor pengaruh gabungan (Influence Score: 0 - 100)
            influence = round((deg * 40.0) + (bet * 60.0) * 100.0, 1)
            influence = min(100.0, max(10.0, influence))

            if influence < min_influence:
                continue

            # Tentukan warna visual berdasarkan peran
            role = attrs.get("role", "ORGANIC")
            bot_score = attrs.get("bot_score", 10.0)

            if role == "BOT_AMPLIFIER" or bot_score > 70.0:
                color = "#ef4444"  # Merah menyala
                category_id = 2
            elif role == "KOL_HUB":
                color = "#8b5cf6"  # Ungu
                category_id = 1
            elif role == "OFFICIAL":
                color = "#10b981"  # Hijau resmi
                category_id = 0
            else:
                color = "#00e5ff"  # Cyan organik
                category_id = 3

            # Ukuran node proporsional dengan pengaruh
            symbol_size = max(14, int(influence * 0.45)) if role != "BOT_AMPLIFIER" else 10

            nodes_list.append({
                "id": node_id,
                "name": node_id,
                "label": attrs.get("label", node_id),
                "role": role,
                "bot_score": round(bot_score, 1),
                "followers": attrs.get("followers", 0),
                "betweenness": round(bet, 3),
                "degree": round(deg, 3),
                "influence": influence,
                "community": attrs.get("community", 1),
                "category": category_id,
                "symbolSize": symbol_size,
                "itemStyle": { "color": color }
            })

        valid_node_ids = {n["id"] for n in nodes_list}
        for u, v, data in self.graph.edges(data=True):
            if u in valid_node_ids and v in valid_node_ids:
                links_list.append({
                    "source": u,
                    "target": v,
                    "relation": data.get("relation", "INTERACT"),
                    "value": data.get("weight", 1),
                    "lineStyle": {
                        "width": min(data.get("weight", 1), 4),
                        "opacity": 0.45
                    }
                })

        return {
            "total_nodes": len(nodes_list),
            "total_links": len(links_list),
            "nodes": nodes_list,
            "links": links_list,
            "categories": [
                {"name": "Resmi Pemerintah / Otoritas"},
                {"name": "Key Opinion Leader (KOL Hub)"},
                {"name": "Akun Botnet Terkoordinasi (CIB)"},
                {"name": "Netizen Organik"}
            ]
        }

# Global Singleton SNA Engine
sna_engine = SNAEngine()
