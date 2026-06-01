# Matrice finale `table_cible`

## Regles appliquees

- Les vues globales sont des agregateurs, pas des cibles primaires.
- `FM` et `F_M_MES` restent sans `table_cible`.
- `T_AIR` est en double classification : qualite terrain actuellement, meteo temperature pour futur pipeline.
- `DISQUE_SECCHI` est en double classification selon support ; la cible principale retenue est barrage qualite car l'usage majoritaire actuel est barrage / garde hebdo.
- `COULEUR` est organoleptique, consultation only, exclue des analytics.
- `MO` et `Mo` restent distincts.

| Parametre | Domaine | Sous-domaine | Type mesure | Support | Ancienne table_cible proposee | Nouvelle table_cible | API cible | Front cible | Statut |
|---|---|---|---|---|---|---|---|---|---|
| `NIVEAU_EAU` | `HYDROLOGIE` | barrage niveau | mesure barrage parametrique | barrage | `api.v_barrage_dashboard` | `api.v_barrage_parametres` | `/api/hydro/barrages/parametres` | Hydrologie / barrages | `PRODUCTION_READY` |
| `EVAPO` | `METEO` | evaporation | serie meteo | station meteo | `api.v_meteo_dashboard` | `api.v_meteo_evaporation` | `/api/meteo/evaporation` | Observatoire meteo | `QA_ACCEPTED_SOURCE_GAP` |
| `PRECIP` | `METEO` | precipitation | serie meteo | station meteo | `api.v_meteo_dashboard` | `api.v_meteo_precipitation` | `/api/meteo/precipitation` | Observatoire meteo | `PRODUCTION_READY` |
| `TEMP_MAX` | `METEO` | temperature | serie meteo future | station meteo | `api.v_meteo_dashboard` | `api.v_meteo_temperature` | `/api/meteo/temperature` | Observatoire meteo | `PIPELINE_TO_IMPLEMENT` |
| `TEMP_MIN` | `METEO` | temperature | serie meteo future | station meteo | `api.v_meteo_dashboard` | `api.v_meteo_temperature` | `/api/meteo/temperature` | Observatoire meteo | `PIPELINE_TO_IMPLEMENT` |
| `TEMP_MOY` | `METEO` | temperature | serie meteo future | station meteo | `api.v_meteo_dashboard` | `api.v_meteo_temperature` | `/api/meteo/temperature` | Observatoire meteo | `PIPELINE_TO_IMPLEMENT` |
| `PH` | `QUALITE_EAU` | physico-chimie | mesure terrain qualite | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_physicochimie` | `/api/qualite/physicochimie` | Physico-chimie | `PRODUCTION_READY` |
| `EH` | `QUALITE_EAU` | physico-chimie | mesure terrain qualite | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_physicochimie` | `/api/qualite/physicochimie` | Physico-chimie | `PRODUCTION_READY` |
| `T_AIR` | `QUALITE_EAU` + futur `METEO` | terrain / temperature | double classification par source | qualite actuellement ; meteo futur | `api.v_qualite_dashboard` | `api.v_qualite_terrain` | `/api/qualite/terrain` + futur `/api/meteo/temperature` | Qualite terrain / Observatoire meteo futur | `DOUBLE_CLASSIFICATION` |
| `T_EAU` | `QUALITE_EAU` | terrain | mesure terrain qualite | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_terrain` | `/api/qualite/terrain` | Qualite terrain | `VALIDE_YASSINE` |
| `DISQUE_SECCHI` | `QUALITE_BARRAGE` + `QUALITE_EAU` | transparence | double classification par support | barrage majoritaire ; riviere secondaire ; nappe QA | `api.v_qualite_dashboard` | `api.v_barrage_qualite` | `/api/hydro/barrages/qualite` + `/api/qualite/terrain` | Qualite barrage / terrain | `DOUBLE_CLASSIFICATION_SUPPORT` |
| `LARGEUR` | `HYDROMORPHOLOGIE` | contexte station | contexte physique | station / campagne | `api.v_qualite_dashboard` | `api.v_qualite_contexte_station` | `/api/qualite/contexte-station` | Fiche station | `CONSULTATION_ONLY` |
| `PROFONDEUR` | `HYDROMORPHOLOGIE` | contexte station | contexte physique | station / campagne | `api.v_qualite_dashboard` | `api.v_qualite_contexte_station` | `/api/qualite/contexte-station` | Fiche station | `CONSULTATION_ONLY` |
| `COULEUR` | `QUALITE_EAU` | organoleptique | observation historique | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_organoleptique` | `/api/qualite/organoleptique` | Detail station/campagne | `CONSULTATION_ONLY_EXCLUDE_ANALYTICS` |
| `CA` | `QUALITE_EAU` | chimie minerale | ion majeur | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `MG` | `QUALITE_EAU` | chimie minerale | ion majeur | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `NA` | `QUALITE_EAU` | chimie minerale | ion majeur | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `K` | `QUALITE_EAU` | chimie minerale | ion majeur | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `CL` | `QUALITE_EAU` | chimie minerale | ion majeur | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `SO4` | `QUALITE_EAU` | chimie minerale | ion majeur | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY` |
| `CO3` | `QUALITE_EAU` | chimie minerale | ion majeur | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY_QA_EXTREMES` |
| `HCT` | `QUALITE_EAU` | chimie minerale | bicarbonates / hydrogenocarbonates | ingestion future / staging | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `INGESTION_READY` |
| `OH` | `QUALITE_EAU` | chimie minerale | ion hydroxyde | ingestion future | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `INGESTION_READY` |
| `S` | `QUALITE_EAU` | chimie minerale | sulfures | staging / futur | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `VALIDATION_YASSINE_ACQUISE` |
| `S2` | `QUALITE_EAU` | chimie minerale | sulfures | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY_QA` |
| `TA` | `QUALITE_EAU` | chimie minerale | alcalinite | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY_QA_EXTREMES` |
| `TAC` | `QUALITE_EAU` | chimie minerale | alcalinite complete | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY_QA_EXTREMES` |
| `TH` | `QUALITE_EAU` | chimie minerale | durete totale | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_chimie_minerale` | `/api/qualite/chimie-minerale` | Chimie minerale | `PRODUCTION_READY_QA_EXTREMES` |
| `AG` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `AL` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `AS` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `BA` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `BE` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `CD` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `CO` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `CU` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `FE` | `QUALITE_EAU` | metaux | fer total/dissous | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY_QA_EXTREMES` |
| `FE2` | `QUALITE_EAU` | metaux | fer ferreux | ingestion future | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `INGESTION_READY` |
| `FET` | `QUALITE_EAU` | metaux | fer total | staging historique | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `INGESTION_READY` |
| `LI` | `QUALITE_EAU` | metaux | element trace | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `MN` | `QUALITE_EAU` | metaux | manganese | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY_QA_EXTREMES` |
| `Mo` | `QUALITE_EAU` | metaux | molybdene | garde hebdo / qualite | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `NI` | `QUALITE_EAU` | metaux | nickel | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `PB` | `QUALITE_EAU` | metaux | plomb | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `SB` | `QUALITE_EAU` | metaux | antimoine | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `SE` | `QUALITE_EAU` | metaux | selenium | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `SN` | `QUALITE_EAU` | metaux | etain | ingestion future | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `INGESTION_READY` |
| `SR` | `QUALITE_EAU` | metaux | strontium | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `TL` | `QUALITE_EAU` | metaux | thallium | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `V` | `QUALITE_EAU` | metaux | vanadium | garde hebdo / qualite | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `ZN` | `QUALITE_EAU` | metaux | zinc | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_metaux` | `/api/qualite/metaux` | Metaux | `PRODUCTION_READY` |
| `DCO` | `QUALITE_EAU` | pollution organique | charge organique | Sebou / qualite | `api.v_qualite_dashboard` | `api.v_qualite_pollution_organique` | `/api/qualite/pollution-organique` | Pollution organique | `PRODUCTION_READY` |
| `DETERGENT` | `QUALITE_EAU` | pollution organique | tensioactifs | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_pollution_organique` | `/api/qualite/pollution-organique` | Pollution organique | `PRODUCTION_READY_QA` |
| `MES` | `QUALITE_EAU` | pollution organique | matieres en suspension | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_pollution_organique` | `/api/qualite/pollution-organique` | Pollution organique | `PRODUCTION_READY` |
| `MO` | `QUALITE_EAU` | pollution organique | matieres organiques | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_pollution_organique` | `/api/qualite/pollution-organique` | Pollution organique | `PRODUCTION_READY_NE_PAS_CONFONDRE_Mo` |
| `PHENOL` | `QUALITE_EAU` | pollution organique | phenols | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_pollution_organique` | `/api/qualite/pollution-organique` | Pollution organique | `PRODUCTION_READY` |
| `CF` | `QUALITE_EAU` | microbiologie | coliformes fecaux | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_microbiologie` | `/api/qualite/microbiologie` | Microbiologie | `PRODUCTION_READY` |
| `CT` | `QUALITE_EAU` | microbiologie | coliformes totaux | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_microbiologie` | `/api/qualite/microbiologie` | Microbiologie | `PRODUCTION_READY` |
| `SF` | `QUALITE_EAU` | microbiologie | streptocoques fecaux | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_microbiologie` | `/api/qualite/microbiologie` | Microbiologie | `PRODUCTION_READY` |
| `CHLA` | `QUALITE_EAU` | biologique / indices | chlorophylle a | multi-support | `api.v_qualite_dashboard` | `api.v_qualite_biologique` | `/api/qualite/biologique` | Biologique | `PRODUCTION_READY` |
| `PHEOPIGMENT` | `QUALITE_EAU` | biologique / indices | pheopigments | riviere / historique | `api.v_qualite_dashboard` | `api.v_qualite_biologique` | `/api/qualite/biologique` | Biologique | `PRODUCTION_READY_RARE` |
| `IBD` | `QUALITE_EAU` | biologique / indices | indice diatomees | riviere | `api.v_qualite_dashboard` | `api.v_qualite_biologique` | `/api/qualite/biologique` | Biologique | `PRODUCTION_READY` |
| `IBGN` | `QUALITE_EAU` | biologique / indices | indice macro-invertebres | riviere | `api.v_qualite_dashboard` | `api.v_qualite_biologique` | `/api/qualite/biologique` | Biologique | `PRODUCTION_READY` |
| `FM` | `QUALITE_EAU` | non classe | inconnu client | aucun support final | aucune | aucune | aucune | aucun | `CLIENT_REQUIRED_HORS_RESTITUTION` |
| `F_M_MES` | `QUALITE_EAU` | non classe | inconnu client | aucun support final | aucune | aucune | aucune | aucun | `CLIENT_REQUIRED_HORS_RESTITUTION` |

## Volumetrie par vue cible

| Nouvelle table_cible | Nombre parametres |
|---|---:|
| `api.v_qualite_metaux` | 23 |
| `api.v_qualite_chimie_minerale` | 14 |
| `api.v_meteo_temperature` | 3 |
| `api.v_qualite_biologique` | 4 |
| `api.v_qualite_microbiologie` | 3 |
| `api.v_qualite_pollution_organique` | 5 |
| `api.v_qualite_terrain` | 2 |
| `api.v_qualite_contexte_station` | 2 |
| `api.v_qualite_organoleptique` | 1 |
| `api.v_meteo_evaporation` | 1 |
| `api.v_meteo_precipitation` | 1 |
| `api.v_barrage_parametres` | 1 |
| `api.v_barrage_qualite` | 1 |
| aucune / hors restitution | 2 |
