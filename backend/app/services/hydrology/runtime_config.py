"""
Runtime topology contract for the pollution hydrology engine.

The source hydrographic table remains untouched. Runtime routing must consume
one coherent edge table and its matching node table.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class TopologyRuntimeConfig:
    edge_table: str
    node_table: str
    node_id_column: str
    node_geom_column: str
    edge_id_column: str = "edge_id"
    source_column: str = "source"
    target_column: str = "target"
    edge_geom_column: str = "geom"
    length_column: str = "length_m"
    hydraulic_direction_validated: bool = False
    direction_validated: bool = False
    scientific_mode: str = "topology_visual_demo"
    topology_status: str = "TOPOLOGY_CONNECTED__HYDRAULIC_DIRECTION_NOT_VALIDATED"

    @property
    def edge_table_name(self) -> str:
        return self.edge_table.split(".", 1)[1]

    @property
    def node_table_name(self) -> str:
        return self.node_table.split(".", 1)[1]

    @property
    def as_dict(self) -> dict:
        return {
            "edge_table": self.edge_table,
            "node_table": self.node_table,
            "hydraulic_direction_validated": self.hydraulic_direction_validated,
            "direction_validated": self.direction_validated,
            "scientific_mode": self.scientific_mode,
            "topology_status": self.topology_status,
        }


def _table_exists(cur, schema: str, table: str) -> bool:
    cur.execute(
        """
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = %s AND table_name = %s
        )
        """,
        (schema, table),
    )
    return bool(cur.fetchone()[0])


def _columns(cur, schema: str, table: str) -> set[str]:
    cur.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        """,
        (schema, table),
    )
    return {row[0] for row in cur.fetchall()}


def resolve_topology_runtime_config(cur) -> TopologyRuntimeConfig:
    """
    Resolve the active topology tables from the database.

    Official runtime target is `geo_work.reseau_hydro_edges_final` with its
    pgRouting vertices table. Raw/noded tables are accepted only as degraded
    fallback when the final runtime contract is not available.
    """
    edge_candidates = [
        "reseau_hydro_edges_final",
        "reseau_hydro_edges_raw",
    ]
    required_edge_cols = {"edge_id", "source", "target", "geom", "length_m"}

    selected_edge = None
    for table in edge_candidates:
        if not _table_exists(cur, "geo_work", table):
            continue
        cols = _columns(cur, "geo_work", table)
        if required_edge_cols <= cols:
            selected_edge = table
            break

    if selected_edge is None:
        raise RuntimeError(
            "Aucune table runtime routable trouvée dans geo_work "
            "(source/target/geom/length_m requis)."
        )

    vertices_table = f"{selected_edge}_vertices_pgr"
    if _table_exists(cur, "geo_work", vertices_table):
        node_cols = _columns(cur, "geo_work", vertices_table)
        if {"id", "the_geom"} <= node_cols:
            return TopologyRuntimeConfig(
                edge_table=f"geo_work.{selected_edge}",
                node_table=f"geo_work.{vertices_table}",
                node_id_column="id",
                node_geom_column="the_geom",
            )

    if _table_exists(cur, "geo_work", "reseau_hydro_nodes"):
        node_cols = _columns(cur, "geo_work", "reseau_hydro_nodes")
        if {"node_id", "geom"} <= node_cols:
            return TopologyRuntimeConfig(
                edge_table=f"geo_work.{selected_edge}",
                node_table="geo_work.reseau_hydro_nodes",
                node_id_column="node_id",
                node_geom_column="geom",
                topology_status="DEGRADED_TO_LEGACY_NODE_TABLE__HYDRAULIC_DIRECTION_NOT_VALIDATED",
            )

    raise RuntimeError(
        f"Aucune table de noeuds compatible trouvée pour geo_work.{selected_edge}."
    )
