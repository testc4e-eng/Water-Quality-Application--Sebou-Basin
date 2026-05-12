# Migration officielle depuis abh_sebou_ismail

## Décision de cadrage
- source officielle : `abh_sebou_ismail` ;
- base cible : `abh_sad` ;
- `staging` : conservation brute et traçabilité ;
- `metadata` : référentiels validés ;
- `qualite`, `hydro`, `meteo` : tables finales propres ;
- `qa` : quarantaine, logs et anomalies.

## Synthèse
| Indicateur | Valeur |
|---|---:|
| Tables source détectées dans `abh_sebou_ismail` | 47 |
| Tables cible détectées dans `abh_sad` | 172 |
| Tables `TO_BACKUP_AND_EMPTY` | 117 |
| Tables `KEEP_STRUCTURE_AND_DATA` | 13 |
| Tables `KEEP_STRUCTURE_ONLY` | 8 |
| Tables à ne pas toucher | 34 |

## Fichiers
| Fichier | Contenu | Statut |
|---|---|---|
| `01_audit_source_abh_sebou_ismail.md` | audit de la source officielle | créé |
| `02_registre_tables_source.csv` | registre CSV des tables source | créé |
| `03_plan_nettoyage_abh_sad_avant_migration.md` | plan de nettoyage cible | créé |
| `04_tables_abh_sad_a_vider_ou_conserver.md` | classification des tables cible | créé |
| `05_plan_migration_depuis_source_officielle.md` | workflow de migration officiel | créé |
| `06_mapping_source_vers_cible.md` | mapping table source vers destination cible | créé |
| `07_regles_qa_et_parsing.md` | règles QA et parsing | créé |
| `08_plan_validation_par_table_source.md` | validation par table source | créé |
| `09_sql_audit_readonly_source.sql` | SQL audit read-only source | créé |
| `10_sql_proposition_backup_abh_sad.sql` | proposition backup non exécutée | créé |
| `11_sql_proposition_vidage_abh_sad.sql` | TRUNCATE commentés non exécutés | créé |
| `12_sql_proposition_migration_staging.sql` | proposition import staging non exécutée | créé |
| `13_journal_decisions.md` | journal décisions | créé |
| `14_log_execution.md` | log exécution vide | créé |
| `15_points_a_valider_avant_execution.md` | points bloquants avant exécution | créé |
| `16_synthese_tables_nettoyage_abh_sad.md` | classification normalisée des tables cible | créé |
| `backup_scripts.sql` | contrôles backup et exports CSV proposés pour tables à vider | créé |
| `truncate_plan.sql` | plan de vidage commenté, non exécuté | créé |
| `plan_execution_nettoyage.md` | plan d'exécution par lots | créé |
| `log_pre_execution.md` | journal de pré-exécution sans modification BD | créé |
