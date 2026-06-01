"""
graph_builder.py — Chargement et mise en cache du graphe hydrologique.
Consomme le contrat runtime défini dans runtime_config.py.
"""
import networkx as nx
import json
import logging
import time
from app.db_raw import connection
from app.services.hydrology.runtime_config import resolve_topology_runtime_config

logger = logging.getLogger(__name__)


class HydrologyGraphBuilder:
    """Singleton : charge le graphe une seule fois en mémoire."""
    _graph: nx.MultiDiGraph | None = None
    _load_time_s: float = 0.0
    _edge_count: int = 0
    _node_count: int = 0
    _component_count: int = 0
    _cycle_count: int = 0
    _micro_segment_count: int = 0
    _duplicate_count: int = 0
    _runtime_contract: dict | None = None

    def _load(self) -> nx.MultiDiGraph:
        G = nx.MultiDiGraph()
        t0 = time.perf_counter()
        skipped = 0
        self._cycle_count = 0
        self._micro_segment_count = 0
        self._duplicate_count = 0

        try:
            with connection() as cx:
                with cx.cursor() as cur:
                    runtime = resolve_topology_runtime_config(cur)
                    self._runtime_contract = runtime.as_dict
                    logger.info(
                        "[Hydrology] Chargement depuis %s avec noeuds %s",
                        runtime.edge_table,
                        runtime.node_table,
                    )

                    cur.execute(
                        """
                        SELECT column_name
                        FROM information_schema.columns
                        WHERE table_schema = 'geo_work' AND table_name = %s
                        """,
                        (runtime.edge_table_name,),
                    )
                    available_cols = {row[0] for row in cur.fetchall()}

                    # Construction dynamique des fallbacks SQL
                    col_component = "e.component_id" if "component_id" in available_cols else "NULL::int AS component_id"
                    col_qa = "e.qa_status" if "qa_status" in available_cols else "'RAW'::text AS qa_status"
                    col_cycle = "e.is_cycle" if "is_cycle" in available_cols else "false AS is_cycle"
                    col_micro = "e.is_micro_segment" if "is_micro_segment" in available_cols else "(ST_Length(e.geom) < 1.0) AS is_micro_segment"
                    col_z_min = "e.z_min::float AS z_min" if "z_min" in available_cols else "NULL::float AS z_min"
                    col_z_max = "e.z_max::float AS z_max" if "z_max" in available_cols else "NULL::float AS z_max"

                    query = f"""
                        SELECT
                            e.edge_id,
                            e.source,
                            e.target,
                            COALESCE(e.length_m, 0)::float AS length_m,
                            ST_AsGeoJSON(ST_Transform(e.geom, 4326)) AS geom_json,
                            COALESCE(e.flow_status, 'FLOW_UNKNOWN') AS flow_status,
                            {col_z_min},
                            {col_z_max},
                            {col_component},
                            {col_qa},
                            {col_cycle},
                            {col_micro}
                        FROM {runtime.edge_table} e
                        WHERE e.source IS NOT NULL
                          AND e.target IS NOT NULL
                    """
                    cur.execute(query)
                    rows = cur.fetchall()

            for row in rows:
                edge_id, source, target, length_m, geom_json, flow_status, z_min, z_max, comp_id, qa_status, is_cyc, is_mic = row
                
                if source == target:
                    skipped += 1
                    continue
                
                try:
                    geom = json.loads(geom_json) if geom_json else None
                except Exception:
                    geom = None
                    skipped += 1

                final_source = source
                final_target = target

                G.add_edge(
                    final_source, final_target,
                    key=edge_id,
                    edge_id=edge_id,
                    length_m=length_m,
                    geom_json=geom,
                    flow_status=flow_status,
                    z_min=z_min,
                    z_max=z_max,
                    component_id=comp_id,
                    qa_status=qa_status,
                    is_cycle=is_cyc,
                    is_micro_segment=is_mic,
                    hydraulic_direction_validated=False,
                    direction_validated=False,
                )
                if is_mic: self._micro_segment_count += 1

            # Détection des cycles par NetworkX
            try:
                simple_graph = nx.Graph()
                simple_graph.add_nodes_from(G.nodes)
                simple_graph.add_edges_from((u, v) for u, v in G.edges())
                cycles = nx.cycle_basis(simple_graph)
                self._cycle_count = len(cycles)
                for cycle in cycles:
                    for i in range(len(cycle)):
                        u, v = cycle[i], cycle[(i+1)%len(cycle)]
                        if G.has_edge(u, v):
                            for key in G[u][v]:
                                G.edges[u, v, key]['is_cycle'] = True
                        if G.has_edge(v, u):
                            for key in G[v][u]:
                                G.edges[v, u, key]['is_cycle'] = True
            except Exception as e:
                logger.warning("[Hydrology] Échec détection cycles : %s", e)

            # Analyse de connectivité exhaustive
            components = sorted(list(nx.weakly_connected_components(G)), key=len, reverse=True)
            self._component_count = len(components)
            
            for comp_id, nodes in enumerate(components):
                for node in nodes:
                    G.nodes[node]['component_id'] = comp_id
                    G.nodes[node]['is_main'] = (comp_id == 0)
                
                sub = G.subgraph(nodes)
                for u, v, key, data in sub.edges(keys=True, data=True):
                    G.edges[u, v, key]['component_id'] = comp_id
                    G.edges[u, v, key]['is_main'] = (comp_id == 0)

        except Exception as exc:
            logger.error("[Hydrology] Échec chargement graphe : %s", exc)
            G = nx.MultiDiGraph()

        self._load_time_s = time.perf_counter() - t0
        self._edge_count = G.number_of_edges()
        self._node_count = G.number_of_nodes()
        G.graph["runtime_contract"] = self._runtime_contract or {}
        G.graph["hydraulic_direction_validated"] = False
        G.graph["direction_validated"] = False
        G.graph["scientific_mode"] = "topology_visual_demo"
        G.graph["topology_status"] = (
            (self._runtime_contract or {}).get(
                "topology_status",
                "TOPOLOGY_CONNECTED__HYDRAULIC_DIRECTION_NOT_VALIDATED",
            )
        )

        logger.info(
            "[Hydrology] Graphe chargé en %.2fs — %d nœuds, %d arêtes "
            "(%d composants, %d cycles, %d micros, %d ignorés)",
            self._load_time_s, self._node_count, self._edge_count,
            self._component_count, self._cycle_count, self._micro_segment_count, skipped,
        )
        return G

    def get_graph(self) -> nx.MultiDiGraph:
        if self._graph is None:
            self._graph = self._load()
        return self._graph

    def reload(self):
        """Force le rechargement (utile en debug)."""
        self._graph = None
        return self.get_graph()

    @property
    def stats(self) -> dict:
        return {
            "nodes": self._node_count,
            "edges": self._edge_count,
            "components": self._component_count,
            "cycles": self._cycle_count,
            "micro_segments": self._micro_segment_count,
            "load_time_s": round(self._load_time_s, 3),
            "runtime_contract": self._runtime_contract,
            "direction_validated": False,
            "hydraulic_direction_validated": False,
            "scientific_mode": "topology_visual_demo",
        }


# Instance globale partagée
graph_builder = HydrologyGraphBuilder()
