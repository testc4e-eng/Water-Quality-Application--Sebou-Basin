# Audit API reglementaires

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit code runtime |
| Source de verite | Oui |
| Date | 2026-06-04 |

## Fichiers inspectes

- [regulatory_quality.py](C:/dev/WQDSS/repo_git/backend/app/services/regulatory_quality.py)
- [quality.py](C:/dev/WQDSS/repo_git/backend/app/routers/quality.py)
- [pollution.py](C:/dev/WQDSS/repo_git/backend/app/api/v1/pollution.py)
- [map.py](C:/dev/WQDSS/repo_git/backend/app/api/v1/map.py)
- [map_business_service.py](C:/dev/WQDSS/repo_git/backend/app/services/map_business_service.py)
- [engine.py](C:/dev/WQDSS/repo_git/backend/app/services/kpi/engine.py)
- [home_service.py](C:/dev/WQDSS/repo_git/backend/app/services/dashboard/home_service.py)
- [qualityRegulatory.ts](C:/dev/WQDSS/repo_git/frontend/src/api/qualityRegulatory.ts)

## Routes backend reglementaires verifiees

| Route | Fichier | Usage reel |
|---|---|---|
| `GET /api/v1/quality/regulatory-status` | `backend/app/routers/quality.py` | synthese du referentiel charge |
| `GET /api/v1/quality/thresholds` | `backend/app/routers/quality.py` | exposition des seuils actifs |
| `POST /api/v1/quality/classify` | `backend/app/routers/quality.py` | classification unitaire |
| `POST /api/v1/quality/global-index` | `backend/app/routers/quality.py` | indice global penalise |
| `GET /api/v1/quality/stations` | `backend/app/routers/quality.py` | stations qualite runtime |
| `GET /api/v1/quality/timeseries` | `backend/app/routers/quality.py` | series qualite runtime |

## Services backend utilisant reellement le referentiel

| Fichier | Usage |
|---|---|
| `backend/app/services/regulatory_quality.py` | charge le contexte reglementaire et classifie |
| `backend/app/api/v1/pollution.py` | enrichit les `latest_results` pollution avec statut reglementaire |
| `backend/app/api/v1/map.py` | classification unitaire pour le dashboard cartographique |
| `backend/app/services/map_business_service.py` | classification des valeurs recentes cartographiques |
| `backend/app/services/kpi/engine.py` | classification pour KPI et indices |
| `backend/app/services/dashboard/home_service.py` | synthese dashboard decisionnel |

## Frontend verifie

La route [App.tsx](C:/dev/WQDSS/repo_git/frontend/src/App.tsx) monte l'ecran :

- `/dashboard-qualite-reglementaire`

Le client frontend [qualityRegulatory.ts](C:/dev/WQDSS/repo_git/frontend/src/api/qualityRegulatory.ts) consomme reellement :

- `/quality/regulatory-status`
- `/quality/thresholds`
- `/quality/stations`
- `/quality/timeseries`
- `/quality/classify`

## Conclusion

Le referentiel reglementaire n'est pas seulement charge en base. Il est effectivement branche au runtime backend et au frontend decisionnel.
