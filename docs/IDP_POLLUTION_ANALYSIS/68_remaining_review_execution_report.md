# Rapport workspace revue humaine finale

## Statut

`WORKSPACE_FINAL_READY_FOR_IMANE`

## Synthese

Un workspace QGIS leger a ete prepare pour traiter uniquement les cas residuels apres auto-validation spatiale.

Les objets deja stabilises automatiquement sont exclus :

- `EXACT_0M`
- `VERY_CLOSE_2M`
- `DIFFERENT_OBJECT`

## Workspace

Chemin :

`docs/IDP_POLLUTION_ANALYSIS/final_human_review_workspace/`

## Fichiers crees

| Fichier | Role |
|---|---|
| `review_true_ambiguous.gpkg` | couche QGIS des vrais conflits residuels |
| `review_orphans.gpkg` | couche QGIS des orphelins |
| `review_true_ambiguous.geojson` | export portable TRUE_AMBIGUOUS |
| `review_orphans.geojson` | export portable ORPHAN_REVIEW |
| `final_human_review.qgz` | projet QGIS minimal |
| `qml_true_ambiguous.qml` | style rouge ambigu |
| `qml_orphans.qml` | style gris orphelins |
| `final_review_decision_template.csv` | fichier de decisions a retourner |
| `README_REVIEW.md` | consignes pour Imane |

## Volumes exportes

| Couche | Volume | Commentaire |
|---|---:|---|
| `TRUE_AMBIGUOUS` | 3 | conflits residuels stricts |
| `ORPHAN_REVIEW` | 102 | sources sans master candidat fiable |
| Template decisions | 105 | total unique |

## Colonnes visibles utiles

- `review_id`
- `source_layer`
- `source_object_name`
- `candidate_site_name`
- `distance_m`
- `issue_type`
- `suggested_action`
- `reviewer_decision`
- `reviewer_comment`

## Decisions disponibles

### TRUE_AMBIGUOUS

- `ACCEPT_MATCH`
- `KEEP_SEPARATE`
- `SAME_SITE_DIFFERENT_OBJECT`
- `NEED_FIELD_VALIDATION`
- `WAIT_BUSINESS_DECISION`

### ORPHAN_REVIEW

- `WAIT_SOURCE_FIX`
- `INVALID_SOURCE_DATA`
- `CREATE_NEW_SITE`
- `NOT_USABLE`
- `REVIEW_LATER`

## Ingestion future

Le script `scripts/idp_pollution/load_cartographic_decisions.py` supporte maintenant :

- `--final-template`
- validation des colonnes obligatoires ;
- validation des decisions selon le bucket ;
- rapport dry-run ;
- rollback logique par `run_id` ;
- aucune ecriture sans `--execute`.

Commande dry-run :

```powershell
python scripts/idp_pollution/load_cartographic_decisions.py --final-template
```

Commande future apres retour Imane :

```powershell
python scripts/idp_pollution/load_cartographic_decisions.py --final-template --execute
```

## Controles executes

| Controle | Resultat |
|---|---|
| Creation GeoJSON | OK |
| Conversion GeoPackage via `ogr2ogr` | OK |
| Creation QGZ minimal | OK |
| `python -m py_compile scripts/idp_pollution/load_cartographic_decisions.py` | OK |
| Dry-run ingestion final template | OK, 105 decisions vides attendues |

## Limites

- La couche `TRUE_AMBIGUOUS` contient 3 vrais conflits ; le chiffre historique 105 incluait les 102 orphelins.
- Un des conflits peut avoir geometrie nulle si la source ne fournit pas de WKT exploitable dans les exports disponibles.
- Les styles QML sont simples ; QGIS peut les ajuster manuellement si besoin, sans modifier les donnees.

## Recommandations PREPROD

1. Imane renseigne uniquement `reviewer_decision` et `reviewer_comment`.
2. Retourner uniquement `final_review_decision_template.csv`.
3. Executer d'abord le dry-run d'ingestion.
4. Charger en DEV avec `--execute` seulement apres controle.
5. Ne pas appliquer de fusion physique avant validation data governance.

## Garanties

- Aucun SHP modifie.
- Aucun SQL execute.
- Aucune suppression.
- Aucune ecriture BD directe.
- Aucune fusion automatique.
