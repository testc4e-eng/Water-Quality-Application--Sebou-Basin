# Matrice parametre / table / vue / API / front

| Parametre | Domaine | Sous-domaine | Table source | Type mesure | Vue metier | API | Front | Statut validation |
|---|---|---|---|---|---|---|---|---|
| `TEMP_MAX`,`TEMP_MIN`,`TEMP_MOY` | METEO | temperature | `meteo.mesure_temperature` | `STATION_AUTOMATIQUE` | `api.v_meteo_temperature` | `/api/meteo/temperature` | Observatoire meteo | `PIPELINE_TO_IMPLEMENT` |
| `PRECIP` | METEO | precipitation | `meteo.mesure_precipitation` | `STATION_AUTOMATIQUE` | `api.v_meteo_precipitation` | `/api/meteo/precipitation` | Observatoire meteo | `PRODUCTION_READY` |
| `EVAPO` | METEO | evaporation | `meteo.mesure_evaporation` | `STATION_AUTOMATIQUE` | `api.v_meteo_evaporation` | `/api/meteo/evaporation` | Observatoire meteo | `QA_ACCEPTED_SOURCE_GAP` |
| `NIVEAU_EAU` | HYDROLOGIE | niveau barrage | `hydro.mesure_barrage_param` | `STATION_AUTOMATIQUE` | `api.v_barrage_parametres` | `/api/hydro/barrages/parametres` | Hydrologie / barrages | `PRODUCTION_READY` |
| `PH`,`EH` | QUALITE_EAU | physico-chimie | `qualite.*` | historiques + suivis | `api.v_qualite_physicochimie` | `/api/qualite/physicochimie` | Qualite eau globale | `PRODUCTION_READY` |
| `CA`,`MG`,`NA`,`K`,`CL`,`SO4`,`HCT`,`CO3`,`S`,`S2` | QUALITE_EAU | chimie minerale | `qualite.*` | historiques + suivis | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `FE`,`MN`,`Mo`,`PB`,`ZN`,`CU`,`CD`,`NI`,`AG`,`AL`,`AS`,`BA`,`BE`,`CO`,`LI`,`SB`,`SE`,`SN`,`SR`,`TL`,`V`,`FE2`,`FET` | QUALITE_EAU | metaux | `qualite.*` | historiques + suivis | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY / REFERENTIEL_FUTUR` |
| `DCO`,`DETERGENT`,`MES`,`MO`,`PHENOL` | QUALITE_EAU | pollution organique | `qualite.*` | historiques + suivis | `api.v_qualite_pollution_organique` | `/api/qualite/pollution-organique` | Pollution organique | `PRODUCTION_READY` |
| `CT`,`CF`,`SF` | QUALITE_EAU | microbiologie | `qualite.*` | historiques + suivis | `api.v_qualite_microbiologie` | `/api/qualite/microbiologie` | Microbiologie | `PRODUCTION_READY` |
| `IBD`,`IBGN`,`CHLA`,`PHEOPIGMENT` | QUALITE_EAU | biologique | `qualite.*` | historiques + suivis | `api.v_qualite_biologique` | `/api/qualite/biologique` | Biologique | `PRODUCTION_READY` |
| `COULEUR` | QUALITE_EAU | organoleptique | `qualite.*` | historique | `api.v_qualite_organoleptique` | `/api/qualite/organoleptique` | Organoleptique | `A_VALIDER_RESTITUTION` |
| `DISQUE_SECCHI`,`T_EAU`,`T_AIR` | QUALITE_EAU | terrain | `qualite.*` | historiques + suivis | `api.v_qualite_terrain` | `/api/qualite/terrain` | Qualite terrain | `A_VALIDER_VISION_METIER` |
| `LARGEUR`,`PROFONDEUR` | QUALITE_EAU | morphometrie | `qualite.*` | historique | `api.v_qualite_terrain` | `/api/qualite/terrain` | Profil station / hydromorphologie | `A_VALIDER_VISION_METIER` |
| `FM`,`F_M_MES` | QUALITE_EAU | non classe | staging | non publie | aucune | aucune | aucun | `CLIENT_REQUIRED` |
