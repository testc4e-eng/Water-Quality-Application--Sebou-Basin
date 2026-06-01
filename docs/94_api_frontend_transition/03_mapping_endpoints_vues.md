# Mapping endpoints vers vues SQL

## Mapping cible

| Vue SQL | Endpoint cible | Methode | Usage | Front concerne | Priorite |
|---|---|---|---|---|---|
| `api.v_meteo_temperature` | `/api/v1/meteo/temperature` | `GET` | Series et points temperature | Observatoire meteo | P1 |
| `api.v_meteo_precipitation` | `/api/v1/meteo/precipitation` | `GET` | Pluviometrie | Observatoire meteo | P1 |
| `api.v_meteo_evaporation` | `/api/v1/meteo/evaporation` | `GET` | Evaporation avec source gaps | Observatoire meteo | P2 |
| `api.v_barrage_parametres` | `/api/v1/hydro/barrages/parametres` | `GET` | Niveau/parametres barrage | Hydrologie / barrages | P1 |
| `api.v_barrage_qualite` | `/api/v1/hydro/barrages/qualite` | `GET` | Qualite barrage, Secchi | Barrages / qualite | P1 |
| `api.v_qualite_metaux` | `/api/v1/qualite/metaux` | `GET` | Metaux et traces | Dashboard metaux | P0 |
| `api.v_qualite_chimie_minerale` | `/api/v1/qualite/chimie-minerale` | `GET` | Ions, alcalinite, durete | Chimie minerale | P0 |
| `api.v_qualite_physicochimie` | `/api/v1/qualite/physicochimie` | `GET` | PH, potentiel redox | Physico-chimie | P0 |
| `api.v_qualite_pollution_organique` | `/api/v1/qualite/pollution-organique` | `GET` | DCO, MES, MO, phenols, detergents | Pollution organique | P0 |
| `api.v_qualite_microbiologie` | `/api/v1/qualite/microbiologie` | `GET` | CF, CT, SF | Microbiologie | P1 |
| `api.v_qualite_biologique` | `/api/v1/qualite/biologique` | `GET` | IBD, IBGN, chlorophylle | Biologique | P1 |
| `api.v_qualite_terrain` | `/api/v1/qualite/terrain` | `GET` | T_AIR qualite, T_EAU, terrain | Qualite terrain | P1 |
| `api.v_qualite_contexte_station` | `/api/v1/qualite/contexte-station` | `GET` | Largeur, profondeur | Fiche station / campagne | P2 |
| `api.v_qualite_organoleptique` | `/api/v1/qualite/organoleptique` | `GET` | Couleur consultation only | Detail station/campagne | P2 |
| `api.v_pollution_constat_prealable` | `/api/v1/pollution/constat-prealable` | `GET` | Constats pollution | Pollution / IDP | P1 |
| `api.v_pollution_analyses_finales` | `/api/v1/pollution/analyses-finales` | `GET` | Analyses finales pollution | Pollution / IDP | P1 |
| `api.v_idp_points` | `/api/v1/idp/points` | `GET` | Points IDP resolus | Carte IDP | P1 |
| `api.v_idp_points_non_resolus` | `/api/v1/idp/non-resolus` | `GET` | Points IDP a valider | Admin GEO / client | P2 |

## Endpoints transverses proposes

| Endpoint cible | Source | Usage |
|---|---|---|
| `/api/v1/qualite/parametres` | `metadata.referentiel_parametre_canonique` + vues qualite | Liste paramètres exposables |
| `/api/v1/qualite/supports` | `api.v_qualite_base_multi_support` | Liste supports par famille |
| `/api/v1/exposure/catalog` | `metadata.referentiel_parametre_canonique.table_cible` | Catalogue des vues et endpoints |

## Règles de compatibilité

- Les anciens endpoints restent montés pendant la transition.
- Les nouveaux endpoints retournent le format standard décrit dans `04_standard_api_response.md`.
- Les endpoints spécialisés ne doivent pas exposer `FM`, `F_M_MES` ni `MO_METAL`.
