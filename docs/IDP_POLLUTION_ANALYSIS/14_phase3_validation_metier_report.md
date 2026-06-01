# Rapport de fin phase 3 - Validation métier IDP pollution

## Fichiers créés

- `arbitrage_batches/00_profiling_candidats_arbitrage.md`
- `arbitrage_batches/batch_01_auto_high_confidence.csv`
- `arbitrage_batches/batch_02_geometry_conflicts.csv`
- `arbitrage_batches/batch_03_geometry_missing.csv`
- `arbitrage_batches/batch_04_marche_cadre_inventory_measurement.csv`
- `arbitrage_batches/batch_05_global_inventory_measurement.csv`
- `arbitrage_batches/batch_99_to_review.csv`
- `12_matrice_decision_arbitrage.md`
- `13_validation_parametres_qualite.md`
- `14_phase3_validation_metier_report.md`
- `ref_parametres_qualite_template.csv`
- `ref_typologie_pollution_template.csv`

## Nombre de candidats par batch

| batch | count |
| --- | --- |
| batch_01_auto_high_confidence.csv | 4534 |
| batch_02_geometry_conflicts.csv | 2277 |
| batch_03_geometry_missing.csv | 0 |
| batch_04_marche_cadre_inventory_measurement.csv | 3614 |
| batch_05_global_inventory_measurement.csv | 8573 |
| batch_99_to_review.csv | 0 |

Les lots sont thématiques et peuvent se recouvrir. `batch_99_to_review.csv` contient uniquement les candidats ne correspondant à aucun critère de lot.

## Paramètres qualité détectés

| validation_status | count |
| --- | --- |
| TO_VALIDATE | 55 |
| VALIDABLE | 44 |

## Décisions métier restantes

- Valider ou rejeter les candidats haute confiance.
- Résoudre les conflits nom/commune sur géométrie identique ou proche.
- Trancher la consolidation `globale` / `marche_cadre`.
- Valider les paramètres à inclure, exclure ou renommer.
- Valider les unités canoniques.

## Risques bloquants

- Risque de fusion abusive en présence de doublons exacts multi-paramètres.
- Risque de rattachement erroné si les conflits géométrie/attributs ne sont pas arbitrés.
- Risque de charger des identifiants source comme paramètres qualité si le référentiel n'est pas validé.
- Risque de duplication métier si `globale` et `marche_cadre` ne sont pas statué avant pré-migration.

## Recommandation Go/No-Go

`NO-GO` pour migration PostGIS réelle tant que les batches P0/P1 et les référentiels paramètres/typologie ne sont pas validés. `GO` limité pour revue métier des CSV générés.