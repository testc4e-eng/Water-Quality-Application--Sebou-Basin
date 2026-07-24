# 02 — Backend API — Dashboard Pollution Campagnes

## Router

`backend/app/api/v1/pollution_campagnes.py`

Enregistré dans `backend/app/api/api_v1.py` à côté du router IDP existant.

## Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/pollution/campagnes` | Synthèse par campagne (date min/max, nb prélèvements, nb paramètres) |
| GET | `/api/v1/pollution/prelevements` | Liste des 141 prélèvements, filtrable |
| GET | `/api/v1/pollution/prelevements/{id}` | Détail d'un prélèvement |
| GET | `/api/v1/pollution/prelevements/{id}/mesures` | 51 mesures du prélèvement |
| GET | `/api/v1/pollution/prelevements/{id}/liens` | Entités d'inventaire liées |
| GET | `/api/v1/pollution/alerts` | Dépassements des seuils provisoires |

## Service

`backend/app/services/pollution_campagnes_service.py`

- Lecture seule sur `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param`, `qualite.source_pollution_prelevement_lien`.
- Conversion 26191 → 4326 via `ST_Transform(p.geom, 4326)`.
- Jointure avec `metadata.mapping_parametre_source` + `metadata.referentiel_parametre` pour récupérer les unités.

## Modèles Pydantic

`backend/app/models/pollution_campagnes_models.py`
