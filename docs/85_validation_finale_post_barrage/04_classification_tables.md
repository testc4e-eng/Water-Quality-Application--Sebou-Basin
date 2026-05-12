# Classification tables

## MIGRE_OK

| Domaine | Tables |
|---|---|
| Hydro | `hydro.mesure_barrage_param`, `hydro.mesure_debit_mensuel`, `hydro.mesure_debit_source`, `hydro.barrage_bathymetrie`, regles qualite debit |
| Meteo | `meteo.mesure_precipitation`, `meteo.mesure_precipitation_annuelle_max`, `meteo.regle_qualite_evaporation_station` |
| Qualite | `qualite.mesure_qualite_barrage`, `qualite.source_pollution_prelevement`, `qualite.source_pollution_prelevement_lien` |
| SWAT | references et `swat_output.mesure_qualite_subbasin_ts` |
| API/analytics | vues barrage parametriques, MV dashboards climat/hydro/pollution |

## MIGRE_AVEC_BACKLOG

| Domaine | Table | Backlog |
|---|---|---|
| Hydro | `hydro.mesure_debit` | 2087 valeurs negatives flaggees QA |
| Meteo | `meteo.mesure_evaporation` | 10308 valeurs nulles |
| Qualite | `qualite.mesure_qualite_riviere` | `parametre_ref_id` null et 1 valeur negative flaggee |
| Qualite | `qualite.mesure_qualite_nappe` | `parametre_ref_id` null et 1 valeur negative flaggee |
| Qualite | `qualite.mesure_qualite_sebou` | `parametre_ref_id` null |
| Qualite | `qualite.suivi_qualite_barrage_garde_hebdo` | `parametre_ref_id` null |
| Qualite | `qualite.source_pollution_mesure_param` | 3447 valeurs non numeriques/nulles documentees |
| WASP | `wasp_output.mesure_qualite_segment_ts` | 1020 groupes doublons metier |
| Metadata | `metadata.referentiel_parametre_canonique` | unites/table cible incompletes hors barrage |

## BACKLOG

| Domaine | Objet | Motif |
|---|---|---|
| Meteo | `meteo.mesure_temperature` | table vide |
| Scenarios | SWAT/WASP | un seul scenario `normal`, enrichissement multi-scenario a venir |
| IDP/GEO client | mappings unresolved | arbitrage client restant |

## LEGACY_READ_ONLY

| Objet | Motif |
|---|---|
| `hydro.mesure_barrage` | conserve comme legacy lecture seule apres bascule parametrique |

## LEGACY_IGNORE

| Objet | Motif |
|---|---|
| `public.stations_abhs` et anciens objets `public.*` | non reference de production |
| tables `staging.*` | perimetre reprise/audit, pas restitution finale |

## BLOQUANT

Aucun bloquant restant identifie.

