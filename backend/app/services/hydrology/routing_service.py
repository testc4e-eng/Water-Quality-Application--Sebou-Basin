"""
routing_service.py — Routage réel sur le graphe NetworkX.
Calcule le chemin depuis un clic utilisateur jusqu'au barrage de garde Sebou.
"""
import networkx as nx
import logging
import random
from app.services.hydrology.graph_builder import graph_builder
from app.services.hydrology.runtime_config import resolve_topology_runtime_config
from app.db_raw import connection

logger = logging.getLogger(__name__)

# ─── Cible officielle ──────────────────────────────────────────────────────
# legacy_barrage_id=51  →  "brg garde du sebou"
# Fallback: legacy_station_id=52 → "brg de garde / sebou"
TARGET_BARRAGE_LEGACY_ID = 51
TARGET_STATION_LEGACY_ID = 52

_cached_target_node: int | None = None


def _base_contract(used_fallback: bool = False, network_component=None) -> dict:
    G = graph_builder.get_graph()
    runtime = G.graph.get("runtime_contract") or {}
    return {
        "routing_quality": (
            "topology_connected_direction_unvalidated"
            if not used_fallback
            else "topology_connected_undirected_fallback"
        ),
        "direction_validated": False,
        "hydraulic_direction_validated": False,
        "used_fallback": used_fallback,
        "scientific_mode": runtime.get("scientific_mode", "topology_visual_demo"),
        "is_scientific": False,
        "network_component": network_component,
        "topology_status": runtime.get(
            "topology_status",
            "TOPOLOGY_CONNECTED__HYDRAULIC_DIRECTION_NOT_VALIDATED",
        ),
        "runtime_contract": runtime,
    }


def _find_target_node() -> int | None:
    """Trouve (et met en cache) le node le plus proche du barrage de garde."""
    global _cached_target_node
    if _cached_target_node is not None:
        return _cached_target_node

    G = graph_builder.get_graph()

    try:
        with connection() as cx:
            with cx.cursor() as cur:
                runtime = resolve_topology_runtime_config(cur)
                # Essai 1 : barrage
                cur.execute(f"""
                    WITH target AS (
                        SELECT ST_Transform(geom, 26191) AS geom
                        FROM api.v_barrage_dimension
                        WHERE legacy_barrage_id = %s
                        LIMIT 1
                    )
                    SELECT n.{runtime.node_id_column}
                    FROM {runtime.node_table} n, target t
                    ORDER BY n.{runtime.node_geom_column} <-> t.geom
                    LIMIT 1;
                """, (TARGET_BARRAGE_LEGACY_ID,))
                row = cur.fetchone()

                if not row:
                    # Essai 2 : station
                    cur.execute(f"""
                        WITH target AS (
                            SELECT ST_Transform(geom, 26191) AS geom
                            FROM api.v_station_dimension
                            WHERE legacy_station_id = %s
                            LIMIT 1
                        )
                        SELECT n.{runtime.node_id_column}
                        FROM {runtime.node_table} n, target t
                        ORDER BY n.{runtime.node_geom_column} <-> t.geom
                        LIMIT 1;
                    """, (TARGET_STATION_LEGACY_ID,))
                    row = cur.fetchone()

                if row:
                    node_id = row[0]
                    if node_id in G:
                        _cached_target_node = node_id
                        logger.info("[Hydrology] Nœud barrage de garde = %s", node_id)
                        return node_id
                    else:
                        logger.warning("[Hydrology] Nœud %s hors composant principal", node_id)
    except Exception as exc:
        logger.error("[Hydrology] Erreur recherche nœud barrage : %s", exc)

    return None


def _find_start_node(lng: float, lat: float) -> tuple[int | None, int | None]:
    """Retourne (edge_id, node le plus proche) sur la table runtime officielle."""
    try:
        with connection() as cx:
            with cx.cursor() as cur:
                runtime = resolve_topology_runtime_config(cur)
                cur.execute(f"""
                    WITH impact AS (
                        SELECT ST_Transform(
                            ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                            26191
                        ) AS geom
                    ),
                    nearest_edge AS (
                        SELECT e.edge_id, e.source, e.target
                        FROM {runtime.edge_table} e, impact p
                        WHERE e.source IS NOT NULL
                          AND e.target IS NOT NULL
                        ORDER BY e.geom <-> p.geom
                        LIMIT 1
                    )
                    SELECT
                        e.edge_id,
                        CASE
                            WHEN ST_Distance(ns.{runtime.node_geom_column}, p.geom)
                               <= ST_Distance(nt.{runtime.node_geom_column}, p.geom)
                            THEN e.source
                            ELSE e.target
                        END AS start_node
                    FROM nearest_edge e
                    JOIN {runtime.node_table} ns
                      ON ns.{runtime.node_id_column} = e.source
                    JOIN {runtime.node_table} nt
                      ON nt.{runtime.node_id_column} = e.target
                    CROSS JOIN impact p;
                """, (lng, lat))
                row = cur.fetchone()
                if row:
                    return row[0], row[1]
    except Exception as exc:
        logger.error("[Hydrology] Erreur snapping : %s", exc)
    return None, None


def _mock_eta(path_length_km: float) -> str:
    """ETA fictif (non scientifique) : environ 10 km/h de vitesse de crue."""
    hours = path_length_km / 10.0
    h = int(hours)
    m = int((hours - h) * 60)
    return f"+{h}h{m:02d}m (fictif)"


def _edge_data(G: nx.MultiDiGraph, u: int, v: int) -> dict | None:
    """Retourne l'arête la plus courte entre deux nœuds runtime."""
    data = G.get_edge_data(u, v)
    if not data:
        return None
    return min(data.values(), key=lambda edge: edge.get("length_m", float("inf")))


def route_to_garde(lng: float, lat: float) -> dict:
    """
    Point d'entrée principal du routage topologique.
    lng/lat : coordonnées WGS84 du clic utilisateur.
    """
    G = graph_builder.get_graph()
    if G.number_of_nodes() == 0:
        return {
            "status": "error",
            "message": "Le graphe hydrologique n'est pas disponible.",
            **_base_contract(),
        }

    # 1. Snapping du clic → edge + nœud départ
    start_edge_id, start_node = _find_start_node(lng, lat)
    if start_node is None:
        return {
            "status": "error",
            "message": "Aucun tronçon trouvé à proximité.",
            **_base_contract(),
        }

    # 2. Vérifier si le nœud de départ est dans le composant principal
    if start_node not in G:
        return {
            "status": "partial",
            "warning": "segment_isolated",
            "message": (
                "Le point d'impact est sur un sous-réseau isolé "
                "non connecté au bassin principal."
            ),
            "mock_metrics": {"eta_hours": "Inconnu", "risk_score": "Indéterminé"},
            "impacted_stations": [],
            "impacted_barrages": [],
            **_base_contract(network_component="isolated"),
        }

    # 3. Nœud cible (barrage de garde)
    target_node = _find_target_node()
    if target_node is None:
        return {
            "status": "error",
            "message": "Nœud du barrage de garde introuvable dans le graphe.",
            **_base_contract(),
        }

    if start_node == target_node:
        return {
            "status": "success",
            "mode": "topology_visual_demo",
            "start_edge_id": start_edge_id,
            "target_barrage": "Barrage de Garde Sebou",
            "path_length_km": 0.0,
            "path_geojson": {"type": "FeatureCollection", "features": []},
            "topology_metrics": {"nodes_crossed": 1, "edges_crossed": 0, "network_component": "main"},
            "warnings": ["Direction hydraulique non validée."],
            "mock_metrics": {"eta_hours": "+0h00m (fictif)", "risk_score": "Critique"},
            "impacted_stations": [],
            "impacted_barrages": [],
            **_base_contract(network_component="main"),
        }

    # 4. Calcul du chemin via NetworkX Dijkstra
    try:
        path_nodes = nx.shortest_path(
            G, source=start_node, target=target_node, weight="length_m"
        )
    except nx.NetworkXNoPath:
        # TENTATIVE FALLBACK NON-ORIENTÉ (Phase D.1C)
        try:
            path_nodes = nx.shortest_path(G.to_undirected(), source=start_node, target=target_node, weight="length_m")
            logger.warning("[Hydrology] Chemin orienté introuvable, fallback non-orienté utilisé pour %s -> %s", start_node, target_node)
            
            # On construit le GeoJSON mais on change le status
            features = []
            path_length_km = 0.0
            for u, v in zip(path_nodes[:-1], path_nodes[1:]):
                edge_data = _edge_data(G, u, v) or _edge_data(G, v, u)
                if not edge_data or not edge_data.get("geom_json"): continue
                features.append({
                    "type": "Feature",
                    "geometry": edge_data["geom_json"],
                    "properties": {
                        "edge_id": edge_data["edge_id"],
                        "flow_status": "FLOW_DIRECTION_UNCERTAIN",
                    },
                })
                path_length_km += edge_data["length_m"] / 1000.0

            return {
                "status": "partial_direction_issue",
                "message": "Chemin géométriquement connecté mais sens hydraulique non validé.",
                "path_length_km": round(path_length_km, 2),
                "path_geojson": {"type": "FeatureCollection", "features": features},
                "topology_metrics": {
                    "nodes_crossed": len(path_nodes),
                    "edges_crossed": len(features),
                    "network_component": G.nodes[path_nodes[0]].get("component_id", "unknown"),
                },
                "warnings": [
                    "Fallback non orienté utilisé.",
                    "Direction hydraulique non validée.",
                    "ETA fictif — vitesse de crue simulée à 10 km/h.",
                ],
                "mock_metrics": {
                    "eta_hours": _mock_eta(path_length_km),
                    "risk_score": "Critique" if path_length_km > 50 else "Élevé",
                },
                "impacted_stations": [],
                "impacted_barrages": [],
                **_base_contract(
                    used_fallback=True,
                    network_component=G.nodes[path_nodes[0]].get("component_id", "unknown"),
                ),
            }
        except nx.NetworkXNoPath:
            return {
                "status": "partial",
                "warning": "no_path",
                "message": (
                    "Aucun chemin topologique trouvé même en mode non-orienté. "
                    "Le point d'impact est physiquement déconnecté du barrage."
                ),
                "mock_metrics": {"eta_hours": "Inconnu", "risk_score": "Indéterminé"},
                "impacted_stations": [],
                "impacted_barrages": [],
                **_base_contract(network_component="disconnected"),
            }
    except nx.NodeNotFound as e:
        return {"status": "error", "message": f"Nœud manquant : {e}", **_base_contract()}

    # 5. Construction du GeoJSON du trajet
    features = []
    path_length_km = 0.0

    for u, v in zip(path_nodes[:-1], path_nodes[1:]):
        edge_data = _edge_data(G, u, v)
        if not edge_data or not edge_data.get("geom_json"):
            continue
        features.append({
            "type": "Feature",
            "geometry": edge_data["geom_json"],
            "properties": {
                "edge_id": edge_data["edge_id"],
                "flow_status": edge_data.get("flow_status", "FLOW_UNKNOWN"),
            },
        })
        path_length_km += edge_data["length_m"] / 1000.0

    return {
        "status": "success",
        "mode": "topology_visual_demo",
        "start_edge_id": start_edge_id,
        "target_barrage": "Barrage de Garde Sebou",
        "path_length_km": round(path_length_km, 2),
        "path_geojson": {
            "type": "FeatureCollection",
            "features": features,
        },
            "topology_metrics": {
                "nodes_crossed": len(path_nodes),
                "edges_crossed": len(features),
                "network_component": G.nodes[path_nodes[0]].get("component_id", "unknown"),
            },
        "warnings": [
            "Direction hydraulique non validée.",
            "ETA fictif — vitesse de crue simulée à 10 km/h.",
        ],
        "mock_metrics": {
            "eta_hours": _mock_eta(path_length_km),
            "risk_score": "Critique" if path_length_km > 50 else "Élevé",
        },
        "impacted_stations": [],
        "impacted_barrages": [],
        **_base_contract(
            network_component=G.nodes[path_nodes[0]].get("component_id", "unknown"),
        ),
    }
