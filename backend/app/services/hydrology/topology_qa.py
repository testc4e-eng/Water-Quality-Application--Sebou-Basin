from app.services.hydrology.graph_builder import graph_builder
from app.services.hydrology.runtime_config import resolve_topology_runtime_config
from app.db_raw import connection
import json
import networkx as nx

def get_topology_qa_geojson() -> dict:
    """Génère un GeoJSON complet du réseau avec métadonnées de connectivité."""
    G = graph_builder.get_graph()
    
    # 1. Extraction des Edges avec statut de connectivité
    edges_features = []
    for u, v, data in G.edges(data=True):
        if not data.get("geom_json"):
            continue
            
        edges_features.append({
            "type": "Feature",
            "geometry": data["geom_json"],
            "properties": {
                "edge_id": data.get("edge_id"),
                "source": u,
                "target": v,
                "flow_status": data.get("flow_status"),
                "component_id": data.get("component_id", -1),
                "is_main": data.get("is_main", False),
                "is_cycle": data.get("is_cycle", False),
                "is_micro_segment": data.get("is_micro_segment", False)
            }
        })

    # 2. Extraction des Nodes avec degrés et appartenance composant
    nodes_features = []
    try:
        with connection() as cx:
            with cx.cursor() as cur:
                # Détection de la meilleure table de nodes
                runtime = resolve_topology_runtime_config(cur)

                cur.execute(
                    f"""
                    SELECT
                        {runtime.node_id_column},
                        ST_AsGeoJSON(ST_Transform({runtime.node_geom_column}, 4326))
                    FROM {runtime.node_table}
                    """
                )
                db_nodes = cur.fetchall()
        
        node_positions = {r[0]: json.loads(r[1]) for r in db_nodes}
        
        for node_id, geom in node_positions.items():
            in_deg = G.in_degree(node_id) if node_id in G else 0
            out_deg = G.out_degree(node_id) if node_id in G else 0
            
            node_data = G.nodes[node_id] if node_id in G else {}
            
            nodes_features.append({
                "type": "Feature",
                "geometry": geom,
                "properties": {
                    "node_id": node_id,
                    "in_degree": in_deg,
                    "out_degree": out_deg,
                    "is_confluence": in_deg > 1,
                    "is_bifurcation": out_deg > 1,
                    "is_isolated": node_id not in G,
                    "component_id": node_data.get("component_id", -1),
                    "is_main": node_data.get("is_main", False)
                }
            })
    except Exception:
        pass

    return {
        "edges": {
            "type": "FeatureCollection",
            "features": edges_features
        },
        "nodes": {
            "type": "FeatureCollection",
            "features": nodes_features
        },
        "stats": graph_builder.stats
    }
