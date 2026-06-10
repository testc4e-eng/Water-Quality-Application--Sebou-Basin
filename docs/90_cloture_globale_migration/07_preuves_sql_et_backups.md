# Preuves SQL et backups

## Requetes executees

Toutes les requetes de cette passe sont des diagnostics `SELECT`, hors corrections deja validees explicitement dans REF-001 a REF-004.

## Controles cles

```sql
SELECT count(*) FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NULL; -- 0
SELECT count(*) FROM qualite.mesure_qualite_nappe WHERE parametre_ref_id IS NULL; -- 1 NUMEROTATION
SELECT count(*) FROM qualite.mesure_qualite_sebou WHERE parametre_ref_id IS NULL; -- 0
SELECT count(*) FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_ref_id IS NULL; -- 0
```

```sql
SELECT count(*) FROM metadata.referentiel_parametre_canonique WHERE statut='ACTIF'; -- 108
SELECT count(*) FROM metadata.referentiel_parametre_canonique WHERE statut='ACTIF' AND NULLIF(TRIM(COALESCE(unite_reference,'')),'') IS NULL; -- 39
SELECT count(*) FROM metadata.referentiel_parametre_canonique WHERE statut='ACTIF' AND NULLIF(TRIM(COALESCE(table_cible,'')),'') IS NULL; -- 65
```

```sql
SELECT count(*) FROM meteo.mesure_temperature; -- 437889 (ingestion commitée le 2026-05-25, batch 2d67f599-7714-4712-ba1f-5f3584c4c961)
SELECT count(*) FROM staging.raw_mesures_temperatures_jr; -- 0
SELECT count(*) FROM meteo.mesure_evaporation WHERE valeur IS NULL; -- 10308
SELECT count(*) FROM qualite.source_pollution_mesure_param WHERE valeur_num IS NULL; -- 3447
SELECT count(*) FROM qualite.source_pollution_mesure_param WHERE valeur_num IS NULL AND trim(COALESCE(valeur_raw,''))='-'; -- 3447
```

```sql
SELECT count(*) FROM wasp_sebou.wasp_results; -- 931770
SELECT count(*) FROM swat_output.mesure_qualite_subbasin_ts; -- 745110
```

## Backups crees lors des corrections validees

| Backup | Role |
|---|---|
| `audit.bkp_ref_param_canonique_enrich_final_20260508` | enrichissement referentiel canonique |
| `audit.bkp_referentiel_parametre_sync_fk_20260508` | sync FK referentiel parametre |
| `audit.bkp_qualite_ref001_004_mapping_final_20260508` | mapping REF-001 a REF-004 |
| `audit.bkp_ref_param_mo_case_resolution_20260508` | sauvegarde `MO` / `Mo` |
| `audit.bkp_qualite_mo_metal_to_mo_case_20260508` | sauvegarde des 11 lignes `MO_METAL` |

## Journaux audit

| Table | Role |
|---|---|
| `audit.referentiel_parametre_sync_fk_journal` | sync FK referentiel |
| `audit.qualite_ref001_004_mapping_journal` | mapping REF-001 a REF-004 |
| `audit.referentiel_unite_hm3_decision_journal` | decision unite `hm3` -> `Mm3` |
