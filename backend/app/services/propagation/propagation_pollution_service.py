from __future__ import annotations

import json
import logging
import math
import threading
from dataclasses import dataclass
from typing import Any

import networkx as nx

from app.db_raw import connection


logger = logging.getLogger(__name__)

NETWORK_TABLE = "geo_work.reseau_hydro_edges_final_candidate_20260602"
NODE_TABLE = "geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr"
TARGET_STATION_LEGACY_ID = 52
TIME_MODEL = "TOPOLOGICAL_CONSTANT_SPEED_MVP"
TIME_WARNING = "Temps indicatif non scientifique"


@dataclass(frozen=True)
class PropagationSource:
    source_type: str
    source_id: str
    input_mode: str
    x_26191: float
    y_26191: float


@dataclass(frozen=True)
class StationCandidate:
    station_id: str
    legacy_station_id: int | None
    station_name: str | None
    station_type: str | None
    target_node: int
    target_snap_distance_m: float
    target_snap_confidence: str
    network_component: int


@dataclass(frozen=True)
class BarrageCandidate:
    barrage_id: str
    legacy_barrage_id: int | None
    barrage_name: str | None
    target_node: int
    target_snap_distance_m: float
    target_snap_confidence: str
    network_component: int


@dataclass(frozen=True)
class ExutoireCandidate:
    node_id: int
    node_type: str | None
    component_id: int | None


class PropagationGraphBuilder:
    """Dedicated cached graph for the validated candidate hydro network."""

    def __init__(self) -> None:
        self._graph: nx.MultiDiGraph | None = None
        self._lock = threading.Lock()

    def get_graph(self) -> nx.MultiDiGraph:
        if self._graph is None:
            with self._lock:
                if self._graph is None:
                    self._graph = self._load()
        return self._graph

    def reload(self) -> nx.MultiDiGraph:
        with self._lock:
            self._graph = None
        return self.get_graph()

    def _load(self) -> nx.MultiDiGraph:
        G = nx.MultiDiGraph()
        try:
            with connection() as cx:
                with cx.cursor() as cur:
                    cur.execute(
                        f"""
                        SELECT
                            e.gid AS edge_id,
                            e.source,
                            e.target,
                            COALESCE(e.length_m, 0)::float8 AS length_m,
                            ST_AsGeoJSON(ST_Transform(e.geom, 4326)) AS geom_json,
                            COALESCE(e.flow_status, 'FLOW_UNKNOWN') AS flow_status,
                            COALESCE(e.component_id, -1)::int AS component_id,
                            COALESCE(e.qa_status, 'UNKNOWN')::text AS qa_status
                        FROM {NETWORK_TABLE} e
                        WHERE e.source IS NOT NULL
                          AND e.target IS NOT NULL
                        """
                    )
                    rows = cur.fetchall()
        except Exception as exc:
            logger.error("[Propagation] Échec chargement graphe candidat: %s", exc)
            return G

        for edge_id, source, target, length_m, geom_json, flow_status, component_id, qa_status in rows:
            if source == target:
                continue
            try:
                geom = json.loads(geom_json) if geom_json else None
            except Exception:
                geom = None

            G.add_edge(
                int(source),
                int(target),
                key=int(edge_id),
                edge_id=int(edge_id),
                length_m=float(length_m or 0.0),
                geom_json=geom,
                flow_status=flow_status,
                component_id=component_id,
                qa_status=qa_status,
            )

        components = sorted(nx.weakly_connected_components(G), key=len, reverse=True)
        for component_rank, nodes in enumerate(components):
            for node in nodes:
                G.nodes[node]["component_rank"] = component_rank

        G.graph["runtime_contract"] = {
            "edge_table": NETWORK_TABLE,
            "node_table": NODE_TABLE,
            "scientific_mode": "topological_constant_speed_mvp",
            "hydraulic_direction_validated": False,
            "direction_validated": False,
        }
        G.graph["scientific_mode"] = "topological_constant_speed_mvp"
        G.graph["network_table"] = NETWORK_TABLE
        logger.info(
            "[Propagation] Graphe candidat chargé: %s nœuds / %s arêtes",
            G.number_of_nodes(),
            G.number_of_edges(),
        )
        return G


propagation_graph_builder = PropagationGraphBuilder()


def _snap_confidence(distance_to_network_m: float) -> str:
    if distance_to_network_m <= 50:
        return "HIGH"
    if distance_to_network_m <= 250:
        return "MEDIUM"
    return "LOW"


def _transfer_time_label(transfer_time_hours: float) -> str:
    whole_hours = int(transfer_time_hours)
    minutes = int(round((transfer_time_hours - whole_hours) * 60))
    if minutes == 60:
        whole_hours += 1
        minutes = 0
    return f"+{whole_hours}h{minutes:02d}m"


def _resolve_source(
    *,
    site_id: str | None,
    prelevement_id: str | None,
    lng: float | None,
    lat: float | None,
) -> PropagationSource:
    if site_id:
        with connection() as cx:
            with cx.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        site_id::text,
                        ST_X(
                            ST_Transform(
                                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
                                26191
                            )
                        )::float8,
                        ST_Y(
                            ST_Transform(
                                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
                                26191
                            )
                        )::float8
                    FROM api.v_pollution_sites
                    WHERE site_id::text = %s
                      AND longitude IS NOT NULL
                      AND latitude IS NOT NULL
                    LIMIT 1
                    """,
                    (site_id,),
                )
                row = cur.fetchone()
        if not row:
            raise LookupError(f"site_id introuvable ou sans coordonnées exploitables: {site_id}")
        return PropagationSource(
            source_type="pollution_site",
            source_id=row[0],
            input_mode="site_id",
            x_26191=float(row[1]),
            y_26191=float(row[2]),
        )

    if prelevement_id:
        with connection() as cx:
            with cx.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        id::text,
                        ST_X(ST_Transform(geom, 26191))::float8,
                        ST_Y(ST_Transform(geom, 26191))::float8
                    FROM api.v_source_pollution_prelevement
                    WHERE id::text = %s
                      AND geom IS NOT NULL
                    LIMIT 1
                    """,
                    (prelevement_id,),
                )
                row = cur.fetchone()
        if not row:
            raise LookupError(f"prelevement_id introuvable ou sans géométrie: {prelevement_id}")
        return PropagationSource(
            source_type="source_pollution_prelevement",
            source_id=row[0],
            input_mode="prelevement_id",
            x_26191=float(row[1]),
            y_26191=float(row[2]),
        )

    if lng is None or lat is None:
        raise ValueError("Aucune source d'entrée valide fournie.")

    with connection() as cx:
        with cx.cursor() as cur:
            cur.execute(
                """
                SELECT
                    ST_X(
                        ST_Transform(
                            ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                            26191
                        )
                    )::float8,
                    ST_Y(
                        ST_Transform(
                            ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                            26191
                        )
                    )::float8
                """,
                (lng, lat, lng, lat),
            )
            row = cur.fetchone()
    return PropagationSource(
        source_type="coordinates",
        source_id=f"{lng},{lat}",
        input_mode="coordinates",
        x_26191=float(row[0]),
        y_26191=float(row[1]),
    )


def _find_target_node() -> int:
    with connection() as cx:
        with cx.cursor() as cur:
            cur.execute(
                f"""
                WITH target AS (
                    SELECT ST_Transform(geom, 26191) AS geom
                    FROM api.v_station_dimension
                    WHERE legacy_station_id = %s
                    LIMIT 1
                )
                SELECT n.id
                FROM {NODE_TABLE} n, target t
                ORDER BY n.the_geom <-> t.geom
                LIMIT 1
                """,
                (TARGET_STATION_LEGACY_ID,),
            )
            row = cur.fetchone()
    if not row:
        raise RuntimeError("Nœud cible garde introuvable pour legacy_station_id=52.")
    return int(row[0])


def _find_snap(x_26191: float, y_26191: float) -> dict[str, Any]:
    with connection() as cx:
        with cx.cursor() as cur:
            cur.execute(
                f"""
                WITH impact AS (
                    SELECT ST_SetSRID(ST_MakePoint(%s, %s), 26191) AS geom
                ),
                nearest_edge AS (
                    SELECT
                        e.gid AS edge_id,
                        e.source,
                        e.target,
                        e.length_m,
                        COALESCE(e.component_id, -1)::int AS network_component,
                        ST_Distance(e.geom, p.geom)::float8 AS distance_to_network_m
                    FROM {NETWORK_TABLE} e, impact p
                    WHERE e.source IS NOT NULL
                      AND e.target IS NOT NULL
                    ORDER BY e.geom <-> p.geom
                    LIMIT 1
                )
                SELECT
                    e.edge_id,
                    CASE
                        WHEN ST_Distance(ns.the_geom, p.geom) <= ST_Distance(nt.the_geom, p.geom)
                        THEN e.source
                        ELSE e.target
                    END AS start_node,
                    e.network_component,
                    e.distance_to_network_m
                FROM nearest_edge e
                JOIN {NODE_TABLE} ns ON ns.id = e.source
                JOIN {NODE_TABLE} nt ON nt.id = e.target
                CROSS JOIN impact p
                """,
                (x_26191, y_26191),
            )
            row = cur.fetchone()
    if not row:
        raise RuntimeError("Impossible de snapper la source sur le réseau candidat.")

    edge_id, start_node, network_component, distance_to_network_m = row
    distance_to_network_m = float(distance_to_network_m)
    return {
        "edge_id": int(edge_id),
        "start_node": int(start_node),
        "distance_to_network_m": round(distance_to_network_m, 2),
        "snap_confidence": _snap_confidence(distance_to_network_m),
        "network_component": int(network_component),
    }


def _metadata_payload() -> dict[str, Any]:
    return {
        "network_table": NETWORK_TABLE,
        "scientific_mode": False,
        "warning": TIME_WARNING,
    }


def _metadata_targets_payload(targets_source: str) -> dict[str, Any]:
    return {
        **_metadata_payload(),
        "targets_source": targets_source,
        "time_model": TIME_MODEL,
    }


def _graph_reachability(graph: nx.MultiDiGraph, start_node: int) -> tuple[set[int], int]:
    if start_node not in graph:
        return set(), 0
    reachable_nodes_set = nx.descendants(graph, start_node) | {start_node}
    reachable_edges = graph.subgraph(reachable_nodes_set).number_of_edges() if reachable_nodes_set else 0
    return reachable_nodes_set, reachable_edges


def _shortest_path_length_km(graph: nx.MultiDiGraph, start_node: int, target_node: int) -> float | None:
    try:
        length_m = nx.shortest_path_length(graph, source=start_node, target=target_node, weight="length_m")
    except nx.NetworkXNoPath:
        return None
    return round(float(length_m) / 1000.0, 2)


def _station_candidates(station_type: str | None) -> list[StationCandidate]:
    sql = f"""
        WITH stations AS (
            SELECT
                s.station_id::text AS station_id,
                s.legacy_station_id,
                s.station_nom,
                s.type_station,
                ST_Transform(s.geom, 26191) AS geom_26191
            FROM api.v_station_dimension s
            WHERE s.geom IS NOT NULL
              AND (%s IS NULL OR s.type_station = %s)
        )
        SELECT
            st.station_id,
            st.legacy_station_id,
            st.station_nom,
            st.type_station,
            CASE
                WHEN ST_Distance(ns.the_geom, st.geom_26191) <= ST_Distance(nt.the_geom, st.geom_26191)
                THEN ne.source
                ELSE ne.target
            END AS target_node,
            ne.distance_to_network_m,
            ne.network_component
        FROM stations st
        CROSS JOIN LATERAL (
            SELECT
                e.source,
                e.target,
                COALESCE(e.component_id, -1)::int AS network_component,
                ST_Distance(e.geom, st.geom_26191)::float8 AS distance_to_network_m
            FROM {NETWORK_TABLE} e
            WHERE e.source IS NOT NULL
              AND e.target IS NOT NULL
            ORDER BY e.geom <-> st.geom_26191
            LIMIT 1
        ) ne
        JOIN {NODE_TABLE} ns ON ns.id = ne.source
        JOIN {NODE_TABLE} nt ON nt.id = ne.target
    """
    with connection() as cx:
        with cx.cursor() as cur:
            cur.execute(sql, (station_type, station_type))
            rows = cur.fetchall()

    candidates: list[StationCandidate] = []
    for row in rows:
        legacy_station_id = int(row[1]) if row[1] is not None else None
        distance = round(float(row[5]), 2)
        candidates.append(
            StationCandidate(
                station_id=row[0],
                legacy_station_id=legacy_station_id,
                station_name=row[2],
                station_type=row[3],
                target_node=int(row[4]),
                target_snap_distance_m=distance,
                target_snap_confidence=_snap_confidence(distance),
                network_component=int(row[6]),
            )
        )
    return candidates


def _barrage_candidates() -> list[BarrageCandidate]:
    sql = f"""
        WITH barrages AS (
            SELECT
                b.barrage_id::text AS barrage_id,
                b.legacy_barrage_id,
                b.barrage_nom,
                ST_Transform(b.geom, 26191) AS geom_26191
            FROM api.v_barrage_dimension b
            WHERE b.geom IS NOT NULL
        )
        SELECT
            b.barrage_id,
            b.legacy_barrage_id,
            b.barrage_nom,
            CASE
                WHEN ST_Distance(ns.the_geom, b.geom_26191) <= ST_Distance(nt.the_geom, b.geom_26191)
                THEN ne.source
                ELSE ne.target
            END AS target_node,
            ne.distance_to_network_m,
            ne.network_component
        FROM barrages b
        CROSS JOIN LATERAL (
            SELECT
                e.source,
                e.target,
                COALESCE(e.component_id, -1)::int AS network_component,
                ST_Distance(e.geom, b.geom_26191)::float8 AS distance_to_network_m
            FROM {NETWORK_TABLE} e
            WHERE e.source IS NOT NULL
              AND e.target IS NOT NULL
            ORDER BY e.geom <-> b.geom_26191
            LIMIT 1
        ) ne
        JOIN {NODE_TABLE} ns ON ns.id = ne.source
        JOIN {NODE_TABLE} nt ON nt.id = ne.target
    """
    with connection() as cx:
        with cx.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()

    candidates: list[BarrageCandidate] = []
    for row in rows:
        legacy_barrage_id = int(row[1]) if row[1] is not None else None
        distance = round(float(row[4]), 2)
        candidates.append(
            BarrageCandidate(
                barrage_id=row[0],
                legacy_barrage_id=legacy_barrage_id,
                barrage_name=row[2],
                target_node=int(row[3]),
                target_snap_distance_m=distance,
                target_snap_confidence=_snap_confidence(distance),
                network_component=int(row[5]),
            )
        )
    return candidates


def _exutoire_candidates() -> list[ExutoireCandidate]:
    sql = """
        SELECT
            node_id,
            node_type,
            component_id
        FROM geo_work.reseau_hydro_nodes_final_candidate_20260602
        WHERE eout = 0
          AND ein >= 1
    """
    with connection() as cx:
        with cx.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()

    return [
        ExutoireCandidate(
            node_id=int(row[0]),
            node_type=row[1],
            component_id=int(row[2]) if row[2] is not None else None,
        )
        for row in rows
    ]


def snap_diagnostic(
    *,
    site_id: str | None = None,
    prelevement_id: str | None = None,
    lng: float | None = None,
    lat: float | None = None,
) -> dict[str, Any]:
    source = _resolve_source(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    snap = _find_snap(source.x_26191, source.y_26191)
    return {
        "status": "success",
        "source": {
            "source_type": source.source_type,
            "source_id": source.source_id,
            "input_mode": source.input_mode,
        },
        "snap": snap,
        "metadata": _metadata_payload(),
    }


def _edge_data(graph: nx.MultiDiGraph, u: int, v: int) -> dict[str, Any] | None:
    data = graph.get_edge_data(u, v)
    if not data:
        return None
    return min(data.values(), key=lambda edge: edge.get("length_m", math.inf))


def _build_path_geojson(graph: nx.MultiDiGraph, path_nodes: list[int]) -> tuple[dict[str, Any], float]:
    features: list[dict[str, Any]] = []
    path_length_km = 0.0
    for u, v in zip(path_nodes[:-1], path_nodes[1:]):
        edge_data = _edge_data(graph, u, v)
        if not edge_data or not edge_data.get("geom_json"):
            continue
        features.append(
            {
                "type": "Feature",
                "geometry": edge_data["geom_json"],
                "properties": {
                    "edge_id": edge_data["edge_id"],
                    "flow_status": edge_data.get("flow_status", "FLOW_UNKNOWN"),
                    "qa_status": edge_data.get("qa_status"),
                },
            }
        )
        path_length_km += float(edge_data["length_m"]) / 1000.0

    return {"type": "FeatureCollection", "features": features}, round(path_length_km, 3)


def propagate_source_to_garde(
    *,
    site_id: str | None = None,
    prelevement_id: str | None = None,
    lng: float | None = None,
    lat: float | None = None,
    vitesse_reference_kmh: float = 10.0,
) -> dict[str, Any]:
    source = _resolve_source(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    snap = _find_snap(source.x_26191, source.y_26191)

    graph = propagation_graph_builder.get_graph()
    if graph.number_of_nodes() == 0:
        raise RuntimeError("Le graphe de propagation candidat n'est pas disponible.")

    start_node = int(snap["start_node"])
    target_node = _find_target_node()

    reachable_nodes_set, reachable_edges = _graph_reachability(graph, start_node)

    if start_node not in graph:
        return {
            "status": "partial",
            "source": {
                "source_type": source.source_type,
                "source_id": source.source_id,
                "input_mode": source.input_mode,
            },
            "snap": snap,
            "propagation": {
                "target_type": "garde",
                "reachable_nodes": 0,
                "reachable_edges": 0,
                "distance_to_garde_km": None,
                "transfer_time_hours": None,
                "transfer_time_label": None,
                "time_model": TIME_MODEL,
            },
            "path_geojson": {"type": "FeatureCollection", "features": []},
            "metadata": {
                **_metadata_payload(),
            },
        }
    try:
        path_nodes = nx.shortest_path(graph, source=start_node, target=target_node, weight="length_m")
        path_geojson, path_length_km = _build_path_geojson(graph, path_nodes)
        transfer_time_hours = round(path_length_km / vitesse_reference_kmh, 2) if vitesse_reference_kmh > 0 else None
        transfer_time_label = _transfer_time_label(transfer_time_hours) if transfer_time_hours is not None else None
        return {
            "status": "success",
            "source": {
                "source_type": source.source_type,
                "source_id": source.source_id,
                "input_mode": source.input_mode,
            },
            "snap": snap,
            "propagation": {
                "target_type": "garde",
                "reachable_nodes": len(reachable_nodes_set),
                "reachable_edges": reachable_edges,
                "distance_to_garde_km": round(path_length_km, 2),
                "transfer_time_hours": transfer_time_hours,
                "transfer_time_label": transfer_time_label,
                "time_model": TIME_MODEL,
            },
            "path_geojson": path_geojson,
            "metadata": {
                **_metadata_payload(),
            },
        }
    except nx.NetworkXNoPath:
        return {
            "status": "partial",
            "source": {
                "source_type": source.source_type,
                "source_id": source.source_id,
                "input_mode": source.input_mode,
            },
            "snap": snap,
            "propagation": {
                "target_type": "garde",
                "reachable_nodes": len(reachable_nodes_set),
                "reachable_edges": reachable_edges,
                "distance_to_garde_km": None,
                "transfer_time_hours": None,
                "transfer_time_label": None,
                "time_model": TIME_MODEL,
            },
            "path_geojson": {"type": "FeatureCollection", "features": []},
            "metadata": {
                **_metadata_payload(),
            },
        }


def propagate_to_stations(
    *,
    site_id: str | None = None,
    prelevement_id: str | None = None,
    lng: float | None = None,
    lat: float | None = None,
    vitesse_reference_kmh: float = 10.0,
    station_type: str | None = None,
    max_target_snap_distance_m: float = 1000.0,
    only_reachable: bool = True,
    limit: int = 50,
) -> dict[str, Any]:
    source = _resolve_source(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    snap = _find_snap(source.x_26191, source.y_26191)

    graph = propagation_graph_builder.get_graph()
    if graph.number_of_nodes() == 0:
        raise RuntimeError("Le graphe de propagation candidat n'est pas disponible.")

    start_node = int(snap["start_node"])
    reachable_nodes_set, reachable_edges = _graph_reachability(graph, start_node)
    raw_candidates = _station_candidates(station_type)

    targets_total_considered = len(raw_candidates)
    stations: list[dict[str, Any]] = []
    for candidate in raw_candidates:
        within_snap_threshold = candidate.target_snap_distance_m <= max_target_snap_distance_m
        reachable = candidate.target_node in reachable_nodes_set if reachable_nodes_set else False

        if only_reachable and not reachable:
            continue
        if not within_snap_threshold:
            continue

        distance_to_source_km = None
        transfer_time_hours = None
        transfer_time_label = None
        if reachable:
            distance_to_source_km = _shortest_path_length_km(graph, start_node, candidate.target_node)
            if distance_to_source_km is not None and vitesse_reference_kmh > 0:
                transfer_time_hours = round(distance_to_source_km / vitesse_reference_kmh, 2)
                transfer_time_label = _transfer_time_label(transfer_time_hours)

        stations.append(
            {
                "station_id": candidate.station_id,
                "legacy_station_id": candidate.legacy_station_id,
                "station_name": candidate.station_name,
                "station_type": candidate.station_type,
                "target_node": candidate.target_node,
                "target_snap_distance_m": candidate.target_snap_distance_m,
                "target_snap_confidence": candidate.target_snap_confidence,
                "reachable": reachable,
                "distance_to_source_km": distance_to_source_km,
                "transfer_time_hours": transfer_time_hours,
                "transfer_time_label": transfer_time_label,
            }
        )

    stations.sort(
        key=lambda item: (
            item["distance_to_source_km"] is None,
            item["distance_to_source_km"] if item["distance_to_source_km"] is not None else math.inf,
            item["target_snap_distance_m"],
        )
    )
    stations = stations[:limit]

    status = "success"
    if not stations and targets_total_considered > 0:
        status = "partial"

    return {
        "status": status,
        "source": {
            "source_type": source.source_type,
            "source_id": source.source_id,
            "input_mode": source.input_mode,
        },
        "snap": snap,
        "propagation": {
            "target_type": "stations",
            "reachable_nodes": len(reachable_nodes_set),
            "reachable_edges": reachable_edges,
            "targets_total_considered": targets_total_considered,
            "targets_returned": len(stations),
        },
        "targets": stations,
        "metadata": _metadata_targets_payload("api.v_station_dimension"),
    }


def propagate_to_barrages(
    *,
    site_id: str | None = None,
    prelevement_id: str | None = None,
    lng: float | None = None,
    lat: float | None = None,
    vitesse_reference_kmh: float = 10.0,
    max_target_snap_distance_m: float = 1000.0,
    only_reachable: bool = True,
    limit: int = 50,
) -> dict[str, Any]:
    source = _resolve_source(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    snap = _find_snap(source.x_26191, source.y_26191)

    graph = propagation_graph_builder.get_graph()
    if graph.number_of_nodes() == 0:
        raise RuntimeError("Le graphe de propagation candidat n'est pas disponible.")

    start_node = int(snap["start_node"])
    reachable_nodes_set, reachable_edges = _graph_reachability(graph, start_node)
    raw_candidates = _barrage_candidates()

    targets_total_considered = len(raw_candidates)
    barrages: list[dict[str, Any]] = []
    for candidate in raw_candidates:
        within_snap_threshold = candidate.target_snap_distance_m <= max_target_snap_distance_m
        reachable = candidate.target_node in reachable_nodes_set if reachable_nodes_set else False

        if only_reachable and not reachable:
            continue
        if not within_snap_threshold:
            continue

        distance_to_source_km = None
        transfer_time_hours = None
        transfer_time_label = None
        if reachable:
            distance_to_source_km = _shortest_path_length_km(graph, start_node, candidate.target_node)
            if distance_to_source_km is not None and vitesse_reference_kmh > 0:
                transfer_time_hours = round(distance_to_source_km / vitesse_reference_kmh, 2)
                transfer_time_label = _transfer_time_label(transfer_time_hours)

        barrages.append(
            {
                "barrage_id": candidate.barrage_id,
                "legacy_barrage_id": candidate.legacy_barrage_id,
                "barrage_name": candidate.barrage_name,
                "target_node": candidate.target_node,
                "target_snap_distance_m": candidate.target_snap_distance_m,
                "target_snap_confidence": candidate.target_snap_confidence,
                "reachable": reachable,
                "distance_to_source_km": distance_to_source_km,
                "transfer_time_hours": transfer_time_hours,
                "transfer_time_label": transfer_time_label,
                "includes_garde": False,
            }
        )

    barrages.sort(
        key=lambda item: (
            item["distance_to_source_km"] is None,
            item["distance_to_source_km"] if item["distance_to_source_km"] is not None else math.inf,
            item["target_snap_distance_m"],
        )
    )
    barrages = barrages[:limit]

    status = "success"
    if not barrages and targets_total_considered > 0:
        status = "partial"

    return {
        "status": status,
        "source": {
            "source_type": source.source_type,
            "source_id": source.source_id,
            "input_mode": source.input_mode,
        },
        "snap": snap,
        "propagation": {
            "target_type": "barrages",
            "reachable_nodes": len(reachable_nodes_set),
            "reachable_edges": reachable_edges,
            "targets_total_considered": targets_total_considered,
            "targets_returned": len(barrages),
        },
        "targets": barrages,
        "metadata": _metadata_targets_payload("api.v_barrage_dimension"),
    }


def propagate_to_exutoires(
    *,
    site_id: str | None = None,
    prelevement_id: str | None = None,
    lng: float | None = None,
    lat: float | None = None,
    vitesse_reference_kmh: float = 10.0,
    only_reachable: bool = True,
    limit: int = 50,
) -> dict[str, Any]:
    source = _resolve_source(
        site_id=site_id,
        prelevement_id=prelevement_id,
        lng=lng,
        lat=lat,
    )
    snap = _find_snap(source.x_26191, source.y_26191)

    graph = propagation_graph_builder.get_graph()
    if graph.number_of_nodes() == 0:
        raise RuntimeError("Le graphe de propagation candidat n'est pas disponible.")

    start_node = int(snap["start_node"])
    reachable_nodes_set, reachable_edges = _graph_reachability(graph, start_node)
    raw_candidates = _exutoire_candidates()

    targets_total_considered = len(raw_candidates)
    exutoires: list[dict[str, Any]] = []
    for candidate in raw_candidates:
        reachable = candidate.node_id in reachable_nodes_set if reachable_nodes_set else False
        if only_reachable and not reachable:
            continue

        distance_to_source_km = None
        transfer_time_hours = None
        transfer_time_label = None
        if reachable:
            distance_to_source_km = _shortest_path_length_km(graph, start_node, candidate.node_id)
            if distance_to_source_km is not None and vitesse_reference_kmh > 0:
                transfer_time_hours = round(distance_to_source_km / vitesse_reference_kmh, 2)
                transfer_time_label = _transfer_time_label(transfer_time_hours)

        exutoires.append(
            {
                "node_id": candidate.node_id,
                "node_type": "exutoire",
                "component_id": candidate.component_id,
                "reachable": reachable,
                "distance_to_source_km": distance_to_source_km,
                "transfer_time_hours": transfer_time_hours,
                "transfer_time_label": transfer_time_label,
            }
        )

    exutoires.sort(
        key=lambda item: (
            item["distance_to_source_km"] is None,
            item["distance_to_source_km"] if item["distance_to_source_km"] is not None else math.inf,
            item["node_id"],
        )
    )
    exutoires = exutoires[:limit]

    status = "success"
    if not exutoires and targets_total_considered > 0:
        status = "partial"

    return {
        "status": status,
        "source": {
            "source_type": source.source_type,
            "source_id": source.source_id,
            "input_mode": source.input_mode,
        },
        "snap": snap,
        "propagation": {
            "target_type": "exutoires",
            "reachable_nodes": len(reachable_nodes_set),
            "reachable_edges": reachable_edges,
            "targets_total_considered": targets_total_considered,
            "targets_returned": len(exutoires),
        },
        "targets": exutoires,
        "metadata": {
            **_metadata_targets_payload("geo_work.reseau_hydro_nodes_final_candidate_20260602"),
            "exutoire_rule": "eout=0 AND ein>=1",
        },
    }
