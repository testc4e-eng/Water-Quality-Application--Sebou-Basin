# Bloc 4 - Modelisation temporaire / legacy

## 1. Resume executif

SWAT/WASP actuels sont hors perimetre migration client definitive. Aucune suppression n'est autorisee. Les objets `public.*` et `staging.*` sont legacy ou audit/reprise.

## 2. Tableau des anomalies du bloc

| ID | Anomalie | Volume | Classe actuelle | Diagnostic | Decision cible | Action |
|---|---|---:|---|---|---|---|
| MOD-001 | `swat_output.*` existant | 8 tables, 745110 TS | LEGACY_MODELING_TO_REPLACE | scenario `normal` seul | LEGACY_MODELING_TO_REPLACE | remplacer via futur ingest |
| MOD-002 | `wasp_output.*` existant | 5 tables, 931770 TS | LEGACY_MODELING_TO_REPLACE | temporaire | LEGACY_MODELING_TO_REPLACE | remplacer via futur ingest |
| MOD-003 | scenarios `normal` uniquement | 1 SWAT, 1 WASP | HORS_PERIMETRE_MIGRATION | multi-scenario absent | HORS_PERIMETRE_MIGRATION | chantier modelisation |
| MOD-004 | doublons WASP | 1020 groupes | LEGACY_MODELING_TO_REPLACE | repartis sur 12 parametres | LEGACY_MODELING_TO_REPLACE | ne pas dedoublonner avant remplacement |
| LEG-001 | `public.*` historiques | 1 table | LEGACY_IGNORE | non production | LEGACY_IGNORE | ignorer hors audit |
| LEG-002 | `staging.*` historiques | 81 tables | LEGACY_IGNORE | audit/reprise | LEGACY_IGNORE | ignorer hors audit |
| LEG-003 | `hydro.mesure_barrage` | 84831 lignes | LEGACY_READ_ONLY | legacy barrage conserve | BACKLOG_TECHNIQUE | conserver lecture seule |

## 3. Cas traitables immediatement

Aucun.

## 4. Cas necessitant validation client

Nouveaux jeux SWAT/WASP et scenarios devront etre fournis/valides par le client dans le chantier modelisation.

## 5. Cas hors perimetre / legacy

Tous les cas du bloc sont hors correction migration client.

## 6. Requetes SELECT utilisees

```sql
SELECT COUNT(*) FROM swat_output.mesure_qualite_subbasin_ts;
SELECT COUNT(*) FROM wasp_output.mesure_qualite_segment_ts;
SELECT COUNT(*) FROM swat_output.ref_scenario;
SELECT COUNT(DISTINCT scenario_code) FROM wasp_output.ref_run_modele;
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='staging';
SELECT COUNT(*) FROM hydro.mesure_barrage;
```

## 7. Corrections proposees mais non executees

Aucune correction. Le remplacement SWAT/WASP releve du futur module ingestion.

## 8. Points a valider avant execution

- specification des nouveaux fichiers SWAT/WASP
- politique de suppression/remplacement des jeux temporaires
- backup et rollback avant toute purge future

