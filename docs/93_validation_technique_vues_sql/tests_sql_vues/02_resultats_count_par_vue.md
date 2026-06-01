# Resultats count par vue

Counts observes dans transaction apres creation temporaire des vues, puis `ROLLBACK`.

| Vue | Count | Attendu | Statut |
|---|---:|---:|---|
| `api.v_meteo_temperature` | 0 | 0 | `OK_VUE_VIDE_ATTENDUE` |
| `api.v_meteo_precipitation` | 546007 | 546007 | `OK` |
| `api.v_meteo_evaporation` | 48900 | 48900 | `OK` |
| `api.v_barrage_parametres` | 272652 | 272652 | `OK` |
| `api.v_barrage_qualite` | 370 | ~370 | `OK` |
| `api.v_qualite_base_multi_support` | 182135 | ~182135 | `OK` |
| `api.v_qualite_physicochimie` | 9806 | recalcul FK/alias | `OK_APRES_CORRECTION` |
| `api.v_qualite_chimie_minerale` | 40933 | ~40933 | `OK` |
| `api.v_qualite_metaux` | 8565 | ~8565 | `OK_APRES_CORRECTION_Mo` |
| `api.v_qualite_pollution_organique` | 11481 | recalcul FK/alias | `OK_APRES_CORRECTION` |
| `api.v_qualite_microbiologie` | 13880 | ~13880 | `OK` |
| `api.v_qualite_biologique` | 807 | ~807 | `OK` |
| `api.v_qualite_terrain` | 18371 | recalcul FK/alias | `OK_APRES_CORRECTION` |
| `api.v_qualite_contexte_station` | 319 | ~319 | `OK` |
| `api.v_qualite_organoleptique` | 4 | 4 | `OK` |
| `api.v_pollution_constat_prealable` | 141 | 141 | `OK` |
| `api.v_pollution_analyses_finales` | 7191 | 7191 | `OK` |
| `api.v_idp_points` | 141 | 141 | `OK` |
| `api.v_idp_points_non_resolus` | 0 | 0 actuellement | `OK` |

## Regles metier controlees

| Test | Count | Statut |
|---|---:|---|
| `FM` dans base qualite | 0 | `OK_EXCLU` |
| `F_M_MES` dans base qualite | 0 | `OK_EXCLU` |
| `MO` dans metaux | 0 | `OK_MO_NON_METAL` |
| `Mo` dans metaux | 11 | `OK_MOLYBDENE` |
| `MO_METAL` expose comme code | 0 | `OK_LEGACY_NON_EXPOSE` |
| `COULEUR` organoleptique | 4 | `OK` |
| `T_AIR` terrain qualite | 8565 | `OK` |
| `T_AIR` meteo temperature actuelle | 0 | `OK_SEPARATION_METEO` |
| `DISQUE_SECCHI` barrage qualite | 370 | `OK` |
| `DISQUE_SECCHI` riviere terrain | 87 | `OK` |
