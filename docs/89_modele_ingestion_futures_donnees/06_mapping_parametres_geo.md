# Mapping parametres et GEO

## Parametres

Tout parametre doit etre resolu vers :

- code canonique
- unite reference
- domaine
- support GEO
- table cible
- statut

## GEO

| Support | Cle cible |
|---|---|
| station | `infra.stations_mesure.id` |
| barrage | `infra.barrages.id` / `api.v_barrage_dimension.barrage_id` |
| point eau | `infra.point_eau.id` |
| rejet / IDP | entite pollution ou geom ponctuelle |
| sous-bassin | `geo.sous_bassin` ou ref SWAT |
| segment | reseau hydrographique ou ref WASP |

## Regle

Aucune ligne ne doit etre publiee comme production-ready sans mapping parametre et GEO coherent, sauf classification explicite `BACKLOG` ou `CLIENT_REQUIRED`.

