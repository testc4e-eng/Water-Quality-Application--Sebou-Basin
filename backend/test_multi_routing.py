from app.services.hydrology.routing_service import route_to_garde

points = [
    ("Fès", -5.00, 34.03),
    ("Meknès", -5.36, 33.89),
    ("Oued Beht", -5.84, 33.91)
]

for name, lng, lat in points:
    print(f"\n--- Test {name} ({lng}, {lat}) ---")
    res = route_to_garde(lng, lat)
    print(f"STATUS: {res['status']}")
    if 'path_length_km' in res:
        print(f"DISTANCE: {res['path_length_km']} km")
    if 'message' in res:
        print(f"MESSAGE: {res['message']}")
