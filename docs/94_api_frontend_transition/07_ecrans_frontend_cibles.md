# Ecrans frontend cibles

| Ecran | APIs | Carte | Graphiques | Filtres | Niveau priorite |
|---|---|---|---|---|---|
| Observatoire meteo | `/meteo/temperature`, `/meteo/precipitation`, `/meteo/evaporation` | Stations meteo | Series, cumuls, distributions | période, station, paramètre | P1 |
| Observatoire hydrologie | `/hydro/barrages/parametres`, futur `/hydro/debit` | Barrages, stations hydro | Niveau, volumes, debit | période, support, paramètre | P1 |
| Observatoire qualite globale | endpoints qualite specialises | Stations, nappes, barrages | Synthese par familles | période, support, famille, QA | P1 |
| Metaux | `/qualite/metaux` | Supports qualité | Series, seuils, cartes concentration | période, métal, support | P0 |
| Nutriments | futur `/qualite/nutriments` | Supports qualité | Eutrophisation, tendances | période, paramètre, support | P2 |
| Pollution organique | `/qualite/pollution-organique` | Supports qualité | DCO, MES, MO, phénols | période, paramètre, support | P0 |
| Microbiologie | `/qualite/microbiologie` | Supports qualité | CF, CT, SF | période, paramètre, support | P1 |
| Biologique | `/qualite/biologique` | Stations rivière | IBD, IBGN, CHLA | période, indice, station | P1 |
| Qualité terrain | `/qualite/terrain` | Stations/campagnes | T_EAU, T_AIR qualite | période, support | P1 |
| Organoleptique | `/qualite/organoleptique` | Supports qualité | Consultation only | période, support | P2 |
| Pollution / IDP | `/pollution/constat-prealable`, `/pollution/analyses-finales`, `/idp/points` | Points pollution | Analyses finales | campagne, geo_status, type point | P1 |
| Points non résolus | `/idp/non-resolus` | Points non résolus | Tableau QA/GEO | source, confidence, statut validation | P2 |
| Barrages | `/hydro/barrages/parametres`, `/hydro/barrages/qualite` | Barrages | Niveau, Secchi | barrage, période, paramètre | P1 |
| Recherche avancée | `/exposure/catalog`, endpoints spécialisés | selon domaine | selon type | multi-filtres | P2 |
| Admin QA | futures routes QA | optionnel | anomalies | statut QA | P3 |
| Admin ingestion futur | `/ingestion/*` futur | optionnel | logs | batch, statut | P3 |

## Ecran pilote recommande

Premier écran recommandé : `Metaux`.

Raison :

- vue spécialisée stable ;
- règle `MO != Mo` déjà validée ;
- fort intérêt analytique ;
- périmètre clair ;
- exclusions `FM/F_M_MES` vérifiables.
