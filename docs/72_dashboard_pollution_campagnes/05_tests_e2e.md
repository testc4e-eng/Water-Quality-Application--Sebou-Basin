# 05 — Tests E2E — Dashboard Pollution Campagnes

## Tests backend

```bash
cd backend
python -m py_compile app/models/pollution_campagnes_models.py
python -m py_compile app/services/pollution_campagnes_service.py
python -m py_compile app/api/v1/pollution_campagnes.py
python -m py_compile app/api/api_v1.py
```

## Tests API (TestClient)

```python
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.api.v1.pollution_campagnes import router

app = FastAPI()
app.include_router(router, prefix="/api/v1")
client = TestClient(app)

assert client.get("/api/v1/pollution/campagnes").status_code == 200
assert client.get("/api/v1/pollution/prelevements").status_code == 200
assert client.get("/api/v1/pollution/alerts").status_code == 200
```

Résultat constaté :
- 2 campagnes détectées (`IDP_GLOBALE_2024`, `IDP_MARCHE_CADRE_2024`).
- 141 prélèvements.
- 51 paramètres par prélèvement.
- 21 paramètres prioritaires marqués dans la fiche.
- ~239 alertes sur l'ensemble des paramètres prioritaires (seuils réglementaires dynamiques).

## Tests frontend

```bash
cd frontend
npm run build
```

Build OK (seul warning : chunk size > 500 kB).

## Tests navigateur à réaliser

1. Ouvrir `/dashboard-pollution-campagnes`.
2. Vérifier le bandeau "Données provisoires".
3. Vérifier 141 points sur la carte.
4. Filtrer par campagne `IDP_GLOBALE_2024`.
5. Clic sur un point → drawer avec 51 mesures.
6. Vérifier les valeurs `< LQ` affichées telles quelles.
7. Vérifier les alertes Cd/Pb/Hg/Cr.
8. Vérifier que les dashboards existants (DG, Qualité, IDP, Propagation) restent accessibles.
