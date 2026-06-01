# Workflow simplifie de revue cartographique

## Statut

`GO_REVUE_CARTOGRAPHIQUE_SIMPLE_DEV`  
`NOGO_FUSION_AUTOMATIQUE`

## Principe

Le workflow ne demande plus une lecture detaillee de tous les attributs QA. La revue P0 se limite aux objets proches visuellement :

- `EXACT_0M`
- `VERY_CLOSE_2M`
- `DIFFERENT_OBJECT`
- `ORPHAN`

Les distances superieures a 2 m sortent du flux principal et restent gardees separees par defaut.

## Gains reviewer

| Avant | Maintenant |
|---|---|
| Lots par famille de couche avec nombreuses colonnes QA | 4 couches par action metier |
| Analyse attributaire necessaire | Decision visuelle rapide |
| Codes de decision nombreux | Codes P0 limites par bucket |
| Risque de confusion entre conflit et decision | Suggestion systeme explicite |

## Logique distance

| Distance | Interpretation | Action |
|---|---|---|
| 0 m | certain si meme famille metier | `ACCEPT_MATCH` propose |
| 0 m + familles differentes | meme site physique, objets distincts | `SAME_SITE_DIFFERENT_OBJECT` |
| 0 < d <= 2 m | tres probable | revue visuelle prioritaire |
| d > 2 m | matching faible | hors workflow principal, garder separe |

## Workspace QGIS

Le dossier `cartographic_review_workspace` contient :

- `review_exact_0m.gpkg`
- `review_very_close_2m.gpkg`
- `review_different_object.gpkg`
- `review_orphans.gpkg`
- exports GeoJSON equivalents
- styles QML simples
- projet QGIS simplifie
- template `cartographic_review_decision_template_light.csv`

## Formulaire metier

Le reviewer doit voir prioritairement :

- couche source
- nom source
- type source
- candidat maitre
- distance
- score
- suggestion systeme
- decision metier
- commentaire

Les UUID et champs internes restent conserves pour ingestion mais ne doivent pas guider la decision metier.

## Ingestion future

Les decisions exportees seront chargees via `scripts/idp_pollution/load_cartographic_decisions.py`.

Le chargement reste :

- dry-run par defaut ;
- idempotent ;
- reversible par `run_id` ;
- sans fusion automatique ;
- sans modification immediate de `geo.ref_site_pollution`.

## Impacts PREPROD

PREPROD reste bloquee tant que :

- les `VERY_CLOSE_2M` prioritaires ne sont pas valides ;
- les `DIFFERENT_OBJECT` critiques ne sont pas confirmes ;
- les orphelins bloquants ne sont pas classes ;
- aucune decision chargee n'a ete controlee par rapport aux vues QA.

## Backlog hors P0

- Interface web MapLibre de revue.
- Traitement volontaire des distances 2-10 m si demande metier.
- Rapport automatique de couverture par reviewer.
- Generation controlee des liens source -> master apres validation.
