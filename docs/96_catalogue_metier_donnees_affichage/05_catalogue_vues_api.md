# Catalogue vues SQL / API / frontend / usage métier

## Synthèse

| Indicateur | Valeur |
|---|---:|
| Vues SQL cataloguées | 21 |
| APIs cataloguées | 18 |

## Traçabilité complète

| Vue SQL | API | Front | Paramètres | Support | Filtre | Pagination | Cache | Statut |
|---|---|---|---|---|---|---|---|---|
| `api.v_meteo_temperature` | `/api/v1/meteo/temperature` cible | Observatoire météo | `TEMP_MAX`,`TEMP_MIN`,`TEMP_MOY` | `STATION_METEO` | station, période | oui | court | `PIPELINE_FUTUR` |
| `api.v_meteo_precipitation` | `/api/v1/meteo/precipitation` cible | Observatoire météo | `PRECIP` | `STATION_METEO` | station, période | oui | court | `API_CIBLE_DOCUMENTEE` |
| `api.v_meteo_evaporation` | `/api/v1/meteo/evaporation` cible | Observatoire météo | `EVAPO` | `STATION_METEO` | station, période, qa | oui | court | `API_CIBLE_DOCUMENTEE` |
| `api.v_hydro_debit` | `/api/v1/hydro/debits` cible | Observatoire hydrologie | `DEBIT` | `RIVIERE` | station, période | oui | court | `API_CIBLE_DOCUMENTEE` |
| `api.v_barrage_parametres` | `/api/v1/hydro/barrages/parametres` cible | Hydrologie / barrages | `NIVEAU_EAU`,`VOLUME`,`LACHER`,`APPORT`,`TRANSFERT` | `BARRAGE` | barrage, paramètre, période, scénario | oui | court | `API_CIBLE_DOCUMENTEE` |
| `api.v_barrage_qualite` | `/api/v1/hydro/barrages/qualite` cible | Barrages / qualité | `DISQUE_SECCHI` | `BARRAGE` | barrage, période, paramètre | oui | court | `API_CIBLE_DOCUMENTEE` |
| `api.v_qualite_base_multi_support` | pas exposée directement | backend / support filters | base multi-support | multi-support | famille, support, période | n/a | n/a | `BACKEND_SUPPORT_VIEW` |
| `api.v_qualite_physicochimie` | `/api/v1/qualite/physicochimie` | Observatoire V2, dashboard décisionnel test, futurs écrans qualité | `PH`,`EH` et famille cible | multi-support | `code_parametre`, dates, support, limit, include_geom | oui | React Query / 60s côté front existant | `BACKEND_P0_READY` |
| `api.v_qualite_chimie_minerale` | `/api/v1/qualite/chimie-minerale` | Observatoire V2, dashboard décisionnel test | `CA` et famille cible | multi-support | mêmes filtres standards | oui | React Query / 60s | `BACKEND_P0_READY` |
| `api.v_qualite_metaux` | `/api/v1/qualite/metaux` | pilote Métaux, Observatoire V2, dashboard décisionnel test | `Mo` et famille métaux | multi-support | mêmes filtres standards | oui | React Query / 60s | `BACKEND_P0_READY` |
| `api.v_qualite_pollution_organique` | `/api/v1/qualite/pollution-organique` | Observatoire V2, dashboard décisionnel test | `MO`,`DCO`,`MES`,`PHENOL`,`DETERGENT` | multi-support | mêmes filtres standards | oui | React Query / 60s | `BACKEND_P0_READY` |
| `api.v_qualite_microbiologie` | `/api/v1/qualite/microbiologie` cible | futur frontend qualité | `CF`,`CT`,`SF` | multi-support | support, période, paramètre | oui | à définir | `HOLD_IMPLEMENTATION` |
| `api.v_qualite_biologique` | `/api/v1/qualite/biologique` cible | futur frontend qualité | `IBD`,`IBGN`,`CHLA`,`PHEOPIGMENT` | surtout `RIVIERE` | support, période, paramètre | oui | à définir | `HOLD_IMPLEMENTATION` |
| `api.v_qualite_terrain` | `/api/v1/qualite/terrain` cible | futur frontend qualité | `T_EAU`,`T_AIR`,`DISQUE_SECCHI` rivière | multi-support | support, période, paramètre | oui | à définir | `HOLD_IMPLEMENTATION` |
| `api.v_qualite_contexte_station` | `/api/v1/qualite/contexte-station` cible | fiche station / campagne | `LARGEUR`,`PROFONDEUR` | station / campagne | station, période | légère | long | `CONSULTATION_ONLY` |
| `api.v_qualite_organoleptique` | `/api/v1/qualite/organoleptique` cible | détail station / campagne | `COULEUR` et futurs `ODEUR`,`SAVEUR` | multi-support | support, période | légère | long | `CONSULTATION_ONLY` |
| `api.v_pollution_constat_prealable` | `/api/v1/pollution/constat-prealable` cible | futur écran pollution / IDP | constats terrain | `SOURCE_POLLUTION` | date, type, statut | oui | court | `HOLD_IMPLEMENTATION` |
| `api.v_pollution_analyses_finales` | `/api/v1/pollution/analyses-finales` cible | futur écran pollution / IDP | mesures labo | `POINT_PRELEVEMENT` | point, paramètre, qa | oui | court | `HOLD_IMPLEMENTATION` |
| `api.v_idp_points` | `/api/v1/idp/points` cible | future carte IDP | points résolus | `POINT_PRELEVEMENT` | bbox, statut, type | oui | court | `HOLD_IMPLEMENTATION` |
| `api.v_idp_points_non_resolus` | `/api/v1/idp/non-resolus` cible | admin GEO / validation | points non résolus | `POINT_PRELEVEMENT` | geo_status, bbox | légère | court | `BACKLOG_FUTURE_TABLE` |
| `api.v_hydro_barrage_param_journalier` | `/api/v1/observatory/barrage/*` legacy compatible | dashboards legacy observatory | `NIVEAU_EAU`,`VOLUME`,`LACHER`,`APPORT`,`TRANSFERT` | `BARRAGE` | barrage, période, métrique | selon endpoint | n/a | `LEGACY_COMPATIBLE` |

## Règles de compatibilité

- Les endpoints spécialisés ne doivent jamais exposer `FM`, `F_M_MES` ni `MO_METAL`.
- Les endpoints spécialisés qualité utilisent le format standard `status`, `count`, `filters`, `data`, `metadata`.
- `include_geom` doit rester réservé au mode carte.
- Le dashboard décisionnel test et l'Observatoire V2 n'appellent aucune API à l'ouverture.
