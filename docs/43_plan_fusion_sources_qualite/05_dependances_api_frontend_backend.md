# Dépendances API, Frontend et Backend

L'audit du code (via `backend/app/routers/quality.py`, `runtime_service.py`, `DashboardQualiteReglementaire.tsx`, etc.) révèle les adhérences suivantes :

| Objet | Type | Table utilisée | Risque si fusion | Action recommandée |
| ----- | ---- | -------------- | ---------------- | ------------------ |
| `list_quality_stations_with_timeseries()` | Backend Service | `qualite.mesure_qualite_sebou` | Cassure du Dash Accueil DG | Ne modifier qu'en phase terminale, en remplaçant par la vue unifiée avec filtre `support_type = 'SENTINELLE'`. |
| `GET /api/v1/quality/stations` | Route API | `qualite.mesure_qualite_riviere` | Disparition des stations historiques du Dash Qualité | Pointer vers la vue unifiée avec filtrage paramétrique. |
| `GET /api/v1/quality/timeseries` | Route API | `qualite.mesure_qualite_riviere` | Cassure des graphiques Qualité | Pointer vers la vue unifiée et adapter la requête pivot. |
| `GET /api/v1/quality/parameters` | Route API | `qualite.mesure_qualite_riviere` | Perte de la liste des paramètres | Pointer vers la vue unifiée. |
| `DashboardQualiteReglementaire.tsx` | Frontend | API Routes ci-dessus | Aucun impact direct | Maintenir le contrat d'API strictement identique (même JSON de sortie). |
| `api.v_station_dimension` | Vue SQL | Référentiels infra | Désynchronisation des alias | Assurer que la vue unifiée jointe toujours vers cette dimension. |
| `metadata.mapping_parametre_source` | Table | N/A | Ignorer les nouveaux codes | Garantir que la routine de fusion nettoie les codes avant insertion. |
