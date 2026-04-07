from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
for path in ['/api/v1/layers/bassin_sebou?max_features=2','/api/v1/layers/reseau_hydro_abhs?max_features=5']:
    print('PATH', path)
    resp = client.get(path)
    print('STATUS', resp.status_code)
    print(resp.text[:500])
