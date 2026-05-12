# Controles integrite globale

## Hydro et meteo

| Controle | Resultat |
|---|---:|
| `hydro.mesure_debit` doublons metier | 0 |
| `hydro.mesure_debit` orphelins GEO | 0 |
| `hydro.mesure_debit` valeurs negatives | 2087, toutes flaggees |
| `hydro.mesure_debit` nulls critiques | 0 |
| `hydro.mesure_debit_mensuel` nulls critiques | 0 |
| `meteo.mesure_precipitation` nulls critiques | 0 |
| `meteo.mesure_precipitation` orphelins GEO | 0 |
| `meteo.mesure_evaporation` orphelins GEO | 0 |
| `meteo.mesure_evaporation` valeurs negatives | 0 |
| `meteo.mesure_evaporation` valeurs nulles | 10308 |

## Qualite

| Controle | Resultat |
|---|---:|
| doublons metier qualite riviere/nappe/barrage/sebou | 0 |
| orphelins GEO qualite riviere/nappe/barrage/sebou | 0 |
| `qualite.mesure_qualite_riviere` `parametre_ref_id` null | 17287 |
| `qualite.mesure_qualite_nappe` `parametre_ref_id` null | 13270 |
| `qualite.mesure_qualite_sebou` `parametre_ref_id` null | 31277 |
| `qualite.suivi_qualite_barrage_garde_hebdo` `parametre_ref_id` null | 539 |
| valeurs negatives qualite riviere | 1, flaggee |
| valeurs negatives qualite nappe | 1, flaggee |
| pollution mesures `valeur_num` null | 3447 |
| pollution prelevements sans geom | 0 |

## Modeles

| Controle | Resultat |
|---|---:|
| SWAT doublons metier | 0 |
| SWAT nulls critiques | 0 |
| SWAT orphelins scenario/run/parametre/subbasin | 0 |
| WASP doublons metier | 1020 groupes |
| WASP nulls critiques | 0 |
| WASP orphelins scenario/run/parametre/segment | 0 |
| scenarios SWAT | `normal` = 1 |
| scenarios WASP | `normal` = 1 |

## Metadata

| Controle | Resultat |
|---|---:|
| referentiel canonique actif | 92 |
| doublons `code_parametre` actif | 0 |
| unites manquantes actives | 59 |
| `table_cible` manquante active | 87 |
| `type_geo_supporte` manquant actif | 0 |
| mappings parametres orphelins audit | 5 |
| parametres legacy riviere non resolus | 39 |
| parametres suivi Sebou non resolus | 7 |
| nappes non resolues | 292 |
| points eau nappe non resolus | 22 |
| points eau station non resolus | 46 |
| profils nappe non resolus | 1204 |

## API runtime

Le service FastAPI local `127.0.0.1:8000` n'etait pas demarre pendant cette cloture. Les controles API effectues sont donc des controles SQL des vues et MV consommees, plus les validations deja documentees en Phase 5.

