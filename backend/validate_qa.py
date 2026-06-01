from app.services.hydrology.topology_qa import get_topology_qa_geojson

qa = get_topology_qa_geojson()
edges = qa['edges']['features']

micros = [e for e in edges if e['properties'].get('is_micro_segment')]
cycles = [e for e in edges if e['properties'].get('is_cycle')]

print(f"Stats QA :")
print(f"  Total Edges: {len(edges)}")
print(f"  Micro-segments: {len(micros)}")
print(f"  Cycles: {len(cycles)}")

if len(micros) > 0:
    print(f"Exemple micro: {micros[0]['properties']}")
