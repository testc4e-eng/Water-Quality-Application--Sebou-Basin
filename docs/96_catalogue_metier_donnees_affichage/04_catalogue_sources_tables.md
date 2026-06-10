# Catalogue sources tables

## Synthèse

| Indicateur | Valeur |
|---|---:|
| Tables sources cataloguées | 15 |
| Volumétrie globale cœur métier + modélisation observée | 2525585 |

## Inventaire détaillé

| Table | Domaine | Volume | Date min/max | Support | Qualité données | Vue cible | Risque | Statut |
|---|---|---:|---|---|---|---|---|---|
| `meteo.mesure_temperature` | météo | 437889 | 1983-01-01 / 2026-06-10 | `STATION_METEO` | intégrée avec QA, 36 stations | `api.v_meteo_temperature` | doublons alias résolus (`Bab_Ouender`) | `COMMITTED` |
| `meteo.mesure_precipitation` | météo | 546007 | non documenté audit | `STATION_METEO` | exploitable | `api.v_meteo_precipitation` | volumétrie élevée, filtre temps requis | `PRODUCTION_READY_SOURCE` |
| `meteo.mesure_evaporation` | météo | 48900 | non documenté audit | `STATION_METEO` | nulls source acceptés | `api.v_meteo_evaporation` | QA source gap | `QA_ACCEPTED_SOURCE_GAP` |
| `hydro.mesure_debit` | hydrologie | 652446 | 1956-09-01 / 2025-08-31 | `RIVIERE` | exploitable avec QA flags | `api.v_hydro_debit` cible | volumétrie élevée | `MIGRE_AVEC_BACKLOG_QA` |
| `hydro.mesure_barrage_param` | hydrologie | 272652 | non documenté audit | `BARRAGE` | exploitable | `api.v_barrage_parametres`, `api.v_hydro_barrage_param_journalier` | confusion possible volume/débit si mauvais affichage | `PRODUCTION_READY_SOURCE` |
| `qualite.mesure_qualite_riviere` | qualité | 60097 | non documenté audit | `RIVIERE` | `parametre_ref_id` corrigé | vues qualité spécialisées | union multi-support | `CLOTURE_C4E_COMPLETE` |
| `qualite.mesure_qualite_nappe` | qualité | 63088 | non documenté audit | `NAPPE` | 1 legacy restant documenté | vues qualité spécialisées | géo nappes partiellement optionnelle | `CLOTURE_C4E_COMPLETE__OPTIONAL_GEO_ENRICHMENT` |
| `qualite.mesure_qualite_barrage` | qualité barrage | 7820 | non documenté audit | `BARRAGE` | `parametre_ref_id` partiel | `api.v_barrage_qualite`, `api.v_qualite_terrain` | jointure par code requise | `MIGRE_OK` |
| `qualite.mesure_qualite_sebou` | qualité | 51402 | non documenté audit | `SEBOU` | `parametre_ref_id` corrigé | vues qualité spécialisées | union multi-support | `CLOTURE_C4E_COMPLETE` |
| `qualite.suivi_qualite_barrage_garde_hebdo` | qualité barrage | 1780 | non documenté audit | `BARRAGE` | `MO_METAL` déjà résolu vers `Mo` sur 11 lignes | vues qualité spécialisées, barrage qualité | double classification possible | `CLOTURE_C4E_COMPLETE` |
| `qualite.source_pollution_prelevement` | pollution / IDP | 141 | non documenté audit | `SOURCE_POLLUTION`, `POINT_PRELEVEMENT` | géo parfois manquante | `api.v_pollution_constat_prealable`, `api.v_idp_points` | rattachement GEO progressif | `PRODUCTION_READY_SOURCE` |
| `qualite.source_pollution_mesure_param` | pollution / IDP | 7191 | non documenté audit | `POINT_PRELEVEMENT` | valeurs non numériques / nulls à conserver | `api.v_pollution_analyses_finales` | QA laboratoire | `PRODUCTION_READY_SOURCE` |
| `geo.points_non_resolus_idp` proposée | pollution / IDP | 0 observé | non applicable | `POINT_PRELEVEMENT` | future table de validation | `api.v_idp_points_non_resolus` | support futur non créé | `FUTURE_TABLE_BACKLOG` |
| `swat_output.*` | modélisation | 1 scénario + résultats non détaillés ici | non documenté audit | `SOUS_BASSIN` | legacy modelling | vues SWAT cibles | module à refondre | `LEGACY_MODELING_TO_REPLACE` |
| `wasp_output.*` | modélisation | 931770 | non documenté audit | `SEGMENT_MODELE` | legacy modelling | `api.v_wasp_qualite_segment_consolide`, vues WASP cibles | forte volumétrie + legacy | `LEGACY_MODELING_TO_REPLACE` |

## Colonnes critiques et problèmes QA connus

- `temps` / `date_mesure` : obligatoire pour les filtres temporels et le cache.
- `parametre_ref_id` : absent ou nul dans certaines branches barrage qualité ; jointure par code nécessaire.
- `parametre_qualite` / `parametre_code` : pivot de filtrage et de séparation métier.
- `qa_flag_*` : à propager jusqu'à l'affichage et à l'ingestion.
- `geom` : à n'appeler qu'en mode carte.

## Dépendances ingestion future

- conservation stricte des alias historiques ;
- quarantaine des lignes non mappées ;
- validation unitaire ;
- validation GEO ;
- audit de lot et rollback par batch.
