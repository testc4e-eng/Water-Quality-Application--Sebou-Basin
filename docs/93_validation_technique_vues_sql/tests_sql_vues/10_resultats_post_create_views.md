# Resultats post create views

## Counts par vue

| Vue | Count | Statut |
|---|---:|---|
| `api.v_meteo_temperature` | 0 | `OK_VUE_VIDE_ATTENDUE` |
| `api.v_meteo_precipitation` | 546007 | `OK` |
| `api.v_meteo_evaporation` | 48900 | `OK` |
| `api.v_barrage_parametres` | 272652 | `OK` |
| `api.v_barrage_qualite` | 370 | `OK` |
| `api.v_qualite_base_multi_support` | 182135 | `OK` |
| `api.v_qualite_physicochimie` | 9806 | `OK` |
| `api.v_qualite_chimie_minerale` | 40933 | `OK` |
| `api.v_qualite_metaux` | 8565 | `OK` |
| `api.v_qualite_pollution_organique` | 11481 | `OK` |
| `api.v_qualite_microbiologie` | 13880 | `OK` |
| `api.v_qualite_biologique` | 807 | `OK` |
| `api.v_qualite_terrain` | 18371 | `OK` |
| `api.v_qualite_contexte_station` | 319 | `OK` |
| `api.v_qualite_organoleptique` | 4 | `OK` |
| `api.v_pollution_constat_prealable` | 141 | `OK` |
| `api.v_pollution_analyses_finales` | 7191 | `OK` |
| `api.v_idp_points` | 141 | `OK` |
| `api.v_idp_points_non_resolus` | 0 | `OK` |

## Colonnes communes

Les 19 vues exposent les colonnes minimales :

- `source_table`
- `support_type`
- `support_id`
- `date_mesure`
- `code_parametre`
- `libelle_parametre`
- `unite_reference`
- `valeur_num`
- `valeur_raw`
- `qa_status`
- `geo_status`

Statut : `OK`.

## Regles metier controlees

| Controle | Resultat | Statut |
|---|---:|---|
| `FM` dans base qualite | 0 | `OK_EXCLU` |
| `F_M_MES` dans base qualite | 0 | `OK_EXCLU` |
| `MO` dans metaux | 0 | `OK` |
| `Mo` dans metaux | 11 | `OK` |
| `MO_METAL` expose | 0 | `OK` |
| `COULEUR` organoleptique | 4 | `OK` |
| `COULEUR` ailleurs vues specialisees | 0 | `OK` |
| `T_AIR` terrain qualite | 8565 | `OK` |
| `T_AIR` meteo temperature actuelle | 0 | `OK_SEPARATION_METEO` |
| `DISQUE_SECCHI` barrage qualite | 370 | `OK` |
| `DISQUE_SECCHI` riviere terrain | 87 | `OK` |

## Controle referentiel

| Controle | Resultat |
|---|---:|
| actifs sans `table_cible` apres creation vues | 65 |

Les valeurs `table_cible` restent non modifiees.

## Performance minimale

| Vue | Resultat EXPLAIN | Risque |
|---|---|---|
| `api.v_meteo_precipitation` | scans par chunks Timescale sur periode filtree | `MEDIUM` |
| `api.v_qualite_metaux` | parallel append multi-support ; seq scans sur chunks, jointure referentiel | `MEDIUM/HIGH` si usage sans filtre |
| `api.v_idp_points_non_resolus` | seq scan sur 141 lignes | `LOW` |

## Conclusion

Les vues sont operationnelles. Les performances V1 sont acceptables sous condition de filtres API obligatoires pour les vues volumineuses.
