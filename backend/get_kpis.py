from app.services.hydrology.graph_builder import graph_builder
import networkx as nx

G = graph_builder.reload()
stats = graph_builder.stats
print(f"Edges: {G.number_of_edges()}")
print(f"Nodes: {G.number_of_nodes()}")
print(f"Components: {stats['components']}")
print(f"Cycles: {graph_builder._cycle_count}")
print(f"Micros: {graph_builder._micro_segment_count}")

# Coverage du composant principal
if stats['components'] > 0:
    comps = list(nx.weakly_connected_components(G))
    main_size = len(max(comps, key=len))
    total_size = G.number_of_nodes()
    print(f"Main Component Coverage: {(main_size/total_size)*100:.1f}%")
