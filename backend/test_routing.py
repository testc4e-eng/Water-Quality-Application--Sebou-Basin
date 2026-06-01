from app.services.hydrology.routing_service import route_to_garde

# Coordonnées Fès (estimées pour le test)
FES_LNG = -5.00
FES_LAT = 34.03

try:
    print(f"Test de routage depuis Fès ({FES_LNG}, {FES_LAT})...")
    res = route_to_garde(FES_LNG, FES_LAT)
    
    print(f"STATUS : {res['status']}")
    if res['status'] == 'success':
        print(f"  Distance : {res['path_length_km']} km")
        print(f"  Nœuds traversés : {res['topology_metrics']['nodes_crossed']}")
        print(f"  Arêtes GeoJSON : {len(res['path_geojson']['features'])}")
        print(f"  Component ID : {res['topology_metrics']['network_component']}")
    else:
        print(f"  Message : {res.get('message', res.get('warning'))}")
except Exception as e:
    print(f"ERREUR : {e}")
