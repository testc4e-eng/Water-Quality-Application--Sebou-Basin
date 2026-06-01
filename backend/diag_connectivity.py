from app.services.hydrology.routing_service import _find_start_node, _find_target_node
from app.services.hydrology.graph_builder import graph_builder
import networkx as nx

G = graph_builder.reload()
target = _find_target_node()
start_edge, start_node = _find_start_node(-5.0, 34.03)

print(f"Target Node: {target}")
print(f"Start Node: {start_node}")

if target in G and start_node in G:
    has_dir = nx.has_path(G, start_node, target)
    has_rev = nx.has_path(G, target, start_node)
    has_undir = nx.has_path(G.to_undirected(), start_node, target)
    
    print(f"Path (Directed): {has_dir}")
    print(f"Path (Reversed): {has_rev}")
    print(f"Path (Undirected): {has_undir}")
    
    if has_undir and not has_dir:
        # Trouver où ça bloque
        path = nx.shortest_path(G.to_undirected(), start_node, target)
        inverted = 0
        for i in range(len(path)-1):
            u, v = path[i], path[i+1]
            if not G.has_edge(u, v):
                if G.has_edge(v, u):
                    inverted += 1
                    # print(f"  Edge inversé détecté: {v} -> {u} (devrait être {u} -> {v})")
        print(f"Nombre d'arêtes inversées sur le chemin le plus court : {inverted}")
else:
    print("Nodes non trouvés dans le graphe.")
