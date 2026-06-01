# Mapping parametres vers vues d'exposition

| Vue | Parametres couverts | Tables sources | Usage frontend | Priorite |
|---|---|---|---|---|
| `api.v_qualite_dashboard` | 57 parametres qualite exposables, hors `FM` / `F_M_MES` | `qualite.mesure_qualite_riviere`, `qualite.mesure_qualite_nappe`, `qualite.mesure_qualite_sebou`, `qualite.suivi_qualite_barrage_garde_hebdo` | Series qualite multi-supports | P1 |
| `api.v_meteo_dashboard` | `EVAPO`, `PRECIP`, `TEMP_MAX`, `TEMP_MIN`, `TEMP_MOY` | `meteo.mesure_evaporation`, `meteo.mesure_precipitation`, `meteo.mesure_temperature` | Dashboard meteo | P1 |
| `api.v_barrage_dashboard` | `NIVEAU_EAU` | `hydro.mesure_barrage_param` | Dashboard barrage | P1 |
| `api.v_idp_points` | aucun des 65 directement | `qualite.source_pollution_prelevement`, couche GEO non resolue future | Carte IDP/GEO | P2 |
| `api.v_pollution_dashboard` | aucun des 65 directement | `qualite.source_pollution_prelevement`, `qualite.source_pollution_mesure_param` | Pollution/IDP | P2 |
| `api.v_swat_latest` | aucun des 65 | `swat_output.*` legacy | Consultation modelisation | P3 |
| `api.v_wasp_latest` | aucun des 65 | `wasp_output.*` legacy | Consultation modelisation | P3 |

## Regles de regroupement

- Qualite : vue unique multi-support, filtrable par `support_type`, `code_parametre`, `station`, `date`.
- Meteo : une seule vue pour les indicateurs meteos principaux.
- Hydro barrage : vue parametrique unique, deja alignee avec `hydro.mesure_barrage_param`.
- IDP/pollution : vues gardees dans la cible API, mais hors perimetre des `65 table_cible`.
- SWAT/WASP : rester en exposition legacy explicite, sans melange avec la migration client.
