# 08 - Tests E2E du MVP propagation

## Environnement de test

- Backend : `uvicorn app.main:app --host 127.0.0.1 --port 8011` (env `sad_backend`)
- Frontend : `npm run build` OK
- Base : PostgreSQL `abh_sad` via `host.docker.internal:5432`

## Scénarios testés

### 1. Build frontend
```bash
cd frontend && npm run build
```
✅ Réussi (warnings chunk size uniquement).

### 2. Compilation backend
```bash
python -m py_compile backend/app/models/propagation_models.py
python -m py_compile backend/app/services/propagation/propagation_recommendations.py
python -m py_compile backend/app/services/propagation/propagation_pollution_service.py
python -m py_compile backend/app/api/v1/propagation.py
```
✅ Réussi.

### 3. Endpoint réseau hydro
```bash
curl -s http://127.0.0.1:8011/api/v1/propagation/network.geojson
```
✅ Retourne 746 arêtes (FeatureCollection).

### 4. Endpoint simulation
```bash
curl -s -X POST http://127.0.0.1:8011/api/v1/propagation/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 34.0,
    "lon": -5.0,
    "pollutant_type": "Cd",
    "initial_concentration_mg_l": 5.0,
    "timestamp": "2026-06-15T10:00:00Z",
    "simulation_hours": 72,
    "vitesse_reference_kmh": 10,
    "lambda_1_per_h": 0.05
  }'
```
✅ Réponse JSON avec :
- `propagation_id`
- `start_node` (snap nœud 246, confiance LOW)
- `path` : 615.59 km, 45.76 h
- `impacted_stations` : 116
- `impacted_barrages` : 2
- `impacted_exutoires` : 4
- `recommendations` : 122 (dont actions CRITICAL)
- `warnings` : source éloignée + modèle indicatif

### 5. Validation métier
- Concentrations décroissantes avec la distance : ✅
- Niveaux d'alerte CRITICAL/WARNING/SAFE : ✅
- Recommandations priorisées par deadline : ✅

### 6. Routes protégées
- Dashboard DG, Dashboard Qualité, Carte Métier non modifiés.
- La nouvelle route `/dashboard-pollution-propagation` est accessible et stylée comme les écrans institutionnels.

## Bugs rencontrés et résolus

1. **Import circulaire** : `propagation_pollution_service` importait `recommendations.engine`, qui importait `alerts.engine`, qui importait `kpi.engine`, qui importait `propagation_pollution_service`.  
   **Solution** : création d'un module dédié `propagation_recommendations.py` sans dépendances externes.

2. **Processus uvicorn résiduel** : plusieurs redémarrages ont été nécessaires car l'ancien processus uvicorn sur le port 8010 ne pouvait pas être arrêté.  
   **Solution** : kill par image `uvicorn.exe` avant chaque test.

## Reste à tester en UI

- Clic sur la carte et apparition du marqueur rouge.
- Lancement simulation depuis le panneau.
- Tracé du chemin aval.
- Export JSON.
- Fermeture et retour à la carte vierge.
