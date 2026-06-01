# Rapport d'exécution ingestion température

Date d'exécution : 2026-05-25  
Batch ID : `2d67f599-7714-4712-ba1f-5f3584c4c961`  
Statut final : `ROLLBACK_REQUIRED` / `TARGET_INSERT_BLOCKED_BY_QA`

## Scripts exécutés

| Ordre | Script | Statut |
|---:|---|---|
| 1 | Backup ciblé pg_dump | OK |
| 2 | `04_create_temperature_lineage_model_A_VALIDER.sql` | Échec contrôlé : FK directe impossible sur hypertable columnstore |
| 2b | `_executed_runs/04b_create_temperature_lineage_model_hypertable_EXECUTED.sql` | OK, DDL adapté sans FK directe sur hypertable |
| 3 | `_executed_runs/00_create_temperature_daily_raw_staging_EXECUTED.sql` | OK |
| 3 | `_executed_runs/01_copy_temperature_global_to_staging_EXECUTED.sql` | OK |
| 4 | `_executed_runs/05_apply_temperature_station_resolution_EXECUTED.sql` | OK |
| 5 | `06_controlled_temperature_insert_A_VALIDER.sql` | NON EXÉCUTÉ, QA bloquante avant insertion |

## Backup

Dossier backup : `C:\dev\WQDSS\repo_git\backups\temperature_ingestion_20260525_030810`

Tables sauvegardées avant écriture :
- `meteo.mesure_temperature` : présente, dump OK.
- `metadata.import_batch` : absente avant DDL.
- `metadata.import_batch_lineage` : absente avant DDL.
- `staging.temperature_daily_raw` : absente avant DDL.

## Résultats DDL lineage

Objets créés :
- `metadata.import_batch`
- `metadata.import_batch_lineage`

Colonnes ajoutées à `meteo.mesure_temperature` :
- `import_batch_id`
- `source_station_name`
- `source_file`
- `source_row_number`
- `qa_status`

Adaptation technique : `import_batch_id` est sans FK directe dans `meteo.mesure_temperature`, car la cible est une hypertable avec columnstore. La cohérence batch est portée par `metadata.import_batch_lineage`.

## Résultats staging

| Contrôle | Valeur |
|---|---:|
| Lignes staging | 445194 |
| Nulls | 0 |
| Doublons Date/Station source | 0 |
| T_Min > T_Max | 0 |
| Outliers critiques | 0 |

## Résultats mapping station

| Statut QA | Lignes |
|---|---:|
| VALIDATED | 286757 |
| MANUAL_VALIDATED | 135913 |
| MANUAL_VALIDATED_WITH_SOURCE_ALIAS | 22524 |
| REVIEW | 0 |
| REJECTED | 0 |
| Total | 445194 |

`Bab Ouender` et `Bab_Ouender` pointent bien vers `517c713a-dda4-4dcb-a033-4143062487fd`.

## QA bloquante avant insertion cible

La cible `meteo.mesure_temperature` a une clé primaire `(temps, station_id)`.
Après mapping, les deux sources `Bab Ouender` et `Bab_Ouender` produisent des doublons exacts pour la même station et les mêmes dates sur la période commune.

| Contrôle | Valeur |
|---|---:|
| Clés cible dupliquées `(date_mesure, station_id_candidate)` | 7305 |
| Lignes staging concernées par ces doublons | 14610 |
| Période concernée | 2001-01-01 à 2020-12-31 |
| Valeurs TMAX/TMIN divergentes sur doublons | 0 |

## Décision d'exécution

Insertion métier contrôlée bloquée.  
`06_controlled_temperature_insert_A_VALIDER.sql` n'a pas été exécuté.

## Statut final

`ROLLBACK_REQUIRED`

Le rollback n'a pas été exécuté automatiquement. Le staging et le batch sont conservés pour diagnostic et décision sur la stratégie de déduplication logique des alias source.

## Décision attendue avant reprise

Choisir une règle d'insertion pour les 7305 doublons exacts `Bab Ouender/Bab_Ouender` :

1. Insérer une seule ligne canonique par `(date, station_id)` et tracer les deux sources en lineage.
2. Garder `Bab Ouender` prioritaire sur la période commune, tracer `Bab_Ouender` comme alias source dupliqué non inséré.
3. Créer une table de mesures source multi-alias séparée de la table métier canonique.

Recommandation technique : option 1, car les valeurs sont strictement identiques et la table métier doit rester canonique par station/date.
