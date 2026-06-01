# Resultats compilation

Compilation testee dans une transaction :

```sql
BEGIN;
\i docs/93_validation_technique_vues_sql/06_sql_vues_reelles_PROPOSEES.sql
ROLLBACK;
```

Resultat : `19` vues compilees, transaction annulee par `ROLLBACK`.

| Vue | Compilation | Erreur | Correction |
|---|---|---|---|
| `api.v_meteo_temperature` | `OK` | aucune | aucune |
| `api.v_meteo_precipitation` | `OK` | aucune | aucune |
| `api.v_meteo_evaporation` | `OK` | aucune | aucune |
| `api.v_barrage_parametres` | `OK` | aucune | aucune |
| `api.v_barrage_qualite` | `OK` | aucune | correction indirecte via base qualite |
| `api.v_qualite_base_multi_support` | `OK_APRES_CORRECTION` | code expose initialement = `parametre_qualite`, insuffisant pour legacy mappe FK | exposer `COALESCE(c.code_parametre, q.parametre_qualite)` avec jointure FK prioritaire |
| `api.v_qualite_physicochimie` | `OK` | aucune | beneficie correction base |
| `api.v_qualite_chimie_minerale` | `OK` | aucune | beneficie correction base |
| `api.v_qualite_metaux` | `OK_APRES_CORRECTION` | `Mo` non visible avant correction | beneficie correction base |
| `api.v_qualite_pollution_organique` | `OK_APRES_CORRECTION` | risque `MO_METAL` expose comme code legacy | beneficie correction base |
| `api.v_qualite_microbiologie` | `OK` | aucune | beneficie correction base |
| `api.v_qualite_biologique` | `OK` | aucune | beneficie correction base |
| `api.v_qualite_terrain` | `OK` | aucune | beneficie correction base |
| `api.v_qualite_contexte_station` | `OK` | aucune | beneficie correction base |
| `api.v_qualite_organoleptique` | `OK` | aucune | beneficie correction base |
| `api.v_pollution_constat_prealable` | `OK` | aucune | aucune |
| `api.v_pollution_analyses_finales` | `OK` | aucune | aucune |
| `api.v_idp_points` | `OK` | aucune | aucune |
| `api.v_idp_points_non_resolus` | `OK` | aucune | aucune |

## Validation rollback

Toutes les creations ont ete annulees par `ROLLBACK`. Aucune vue physique durable n'a ete creee pendant cette phase.
