# Resultats colonnes communes

Colonnes minimales controlees :

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

| Vue | Colonnes minimales OK | Colonnes manquantes | Statut |
|---|---|---|---|
| `api.v_meteo_temperature` | oui | aucune | `OK` |
| `api.v_meteo_precipitation` | oui | aucune | `OK` |
| `api.v_meteo_evaporation` | oui | aucune | `OK` |
| `api.v_barrage_parametres` | oui | aucune | `OK` |
| `api.v_barrage_qualite` | oui | aucune | `OK` |
| `api.v_qualite_base_multi_support` | oui | aucune | `OK` |
| `api.v_qualite_physicochimie` | oui | aucune | `OK` |
| `api.v_qualite_chimie_minerale` | oui | aucune | `OK` |
| `api.v_qualite_metaux` | oui | aucune | `OK` |
| `api.v_qualite_pollution_organique` | oui | aucune | `OK` |
| `api.v_qualite_microbiologie` | oui | aucune | `OK` |
| `api.v_qualite_biologique` | oui | aucune | `OK` |
| `api.v_qualite_terrain` | oui | aucune | `OK` |
| `api.v_qualite_contexte_station` | oui | aucune | `OK` |
| `api.v_qualite_organoleptique` | oui | aucune | `OK` |
| `api.v_pollution_constat_prealable` | oui | aucune | `OK` |
| `api.v_pollution_analyses_finales` | oui | aucune | `OK` |
| `api.v_idp_points` | oui | aucune | `OK` |
| `api.v_idp_points_non_resolus` | oui | aucune | `OK` |

## Resultat

Toutes les vues proposees exposent le socle minimal requis. Les colonnes optionnelles `geom`, `campagne_id`, `ingestion_batch_id` sont aussi presentes dans le SQL corrige.
