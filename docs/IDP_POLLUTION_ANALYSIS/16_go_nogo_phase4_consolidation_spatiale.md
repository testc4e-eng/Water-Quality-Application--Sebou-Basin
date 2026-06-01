# GO/NOGO Phase 4 - Consolidation spatiale et pré-migration

## Prêt à être exécuté

| Élément | Statut | Commande / fichier |
|---|---|---|
| Création modèle spatial canonique | READY_FOR_DBA_REVIEW | `database/idp_pollution/10_create_ref_site_pollution.sql` |
| Import staging IDP dry-run | READY | `python scripts/idp_pollution/import_idp_to_staging.py` |
| Import staging IDP réel | READY_AFTER_DB_VALIDATION | `python scripts/idp_pollution/import_idp_to_staging.py --execute --pg-dsn ...` |
| Rollback logique staging par batch | READY_AFTER_IMPORT | `python scripts/idp_pollution/import_idp_to_staging.py --rollback --batch-id ... --execute --pg-dsn ...` |
| Vues consolidation spatiale | READY_FOR_DBA_REVIEW | `database/idp_pollution/11_build_spatial_consolidation_views.sql` |
| Table résultats qualité long format | READY_FOR_DBA_REVIEW | `database/idp_pollution/12_create_resultat_mesure.sql` |
| Vue/load qualité format long | READY_FOR_DBA_REVIEW | `database/idp_pollution/13_build_quality_long_format.sql` |
| Vues API MapLibre/analytics | READY_FOR_DBA_REVIEW | `database/idp_pollution/14_create_api_views.sql` |
| Vues QA opérationnelles | READY_FOR_DBA_REVIEW | `database/idp_pollution/15_create_qa_views.sql` |

## Bloquants avant exécution réelle

- Valider les noms exacts de tables/colonnes `infra.*` en base réelle avant `11_build_spatial_consolidation_views.sql`.
- Confirmer que `metadata.mapping_parametre_source` contient les alias IDP (`source_column='parametre_'`) ou charger ces mappings avant `13_build_quality_long_format.sql`.
- Valider la politique d'extension `pgcrypto` et `postgis` sur l'environnement cible.
- Confirmer les privilèges de création/modification sur `geo`, `staging`, `qualite`, `qa`, `api`, `metadata`.
- Valider la stratégie `globale` / `marche_cadre` pour éviter doublons métier.

## Validation métier requise

- Statuts des candidats `qa.v_spatial_site_candidates`.
- Règle de réutilisation des sites existants à 0 m / 5 m / 10 m / 25 m.
- Typologie source pollution (`STEP`, `STM`, `HUILERIE`, `MINE`, `DECHARGE`, `REJET_DOMESTIQUE`, etc.).
- Paramètres qualité et unités via `metadata.referentiel_parametre` et `metadata.mapping_parametre_source`.

## Importable immédiatement en staging

Les quatre SHP IDP `processed` peuvent être importés en staging dès que la DSN et les droits sont validés :

```powershell
python scripts/idp_pollution/import_idp_to_staging.py --pg-dsn "host=... port=5432 dbname=... user=... password=..." --execute
```

Dry-run sans base :

```powershell
python scripts/idp_pollution/import_idp_to_staging.py
```

## Affichable immédiatement dans MapLibre après exécution SQL

- `api.v_pollution_sites` : couche unique de points pollution.
- `api.v_pollution_latest_results` : popups enrichis avec derniers résultats.
- `api.v_pollution_by_parameter` : filtres/agrégations par paramètre.
- `api.v_pollution_timeseries` : séries temporelles qualité.

## Décision GO/NOGO

- `GO` pour revue DBA et exécution en environnement de développement contrôlé.
- `GO` pour import staging IDP après validation DSN/droits.
- `NO-GO` pour chargement métier final tant que les mappings paramètres et arbitrages spatiaux ne sont pas validés.
