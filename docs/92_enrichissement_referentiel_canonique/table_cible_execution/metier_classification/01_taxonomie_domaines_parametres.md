# Taxonomie domaines / sous-domaines

| Domaine | Sous-domaine | Exemples parametres | Usage principal | Vue/API cible |
|---|---|---|---|---|
| `METEO` | temperature | `TEMP_MAX`, `TEMP_MIN`, `TEMP_MOY` | climatologie, suivi thermique | `api.v_meteo_temperature`, `/api/meteo/temperature` |
| `METEO` | precipitation | `PRECIP` | pluviometrie | `api.v_meteo_precipitation`, `/api/meteo/precipitation` |
| `METEO` | evaporation | `EVAPO` | deficit hydrique, bilan | `api.v_meteo_evaporation`, `/api/meteo/evaporation` |
| `HYDROLOGIE` | debit | `DEBIT` | debit instantane | `api.v_hydro_debit`, `/api/hydro/debits` |
| `HYDROLOGIE` | barrage niveau | `NIVEAU_EAU` | cote barrage | `api.v_barrage_parametres`, `/api/hydro/barrages/parametres` |
| `HYDROLOGIE` | barrage volumes | `VOLUME`, `LACHER`, `APPORT`, `TRANSFERT` | stockage et flux journaliers | `api.v_barrage_parametres`, `/api/hydro/barrages/parametres` |
| `QUALITE_EAU` | physico-chimie | `PH`, `EH`, `T_EAU`, `T_AIR` | etat in situ | `api.v_qualite_physicochimie`, `/api/qualite/physicochimie` |
| `QUALITE_EAU` | chimie minerale | `CA`, `MG`, `NA`, `K`, `CL`, `SO4`, `HCT`, `CO3` | mineralisation et ions majeurs | `api.v_qualite_chimie_minerale`, `/api/qualite/chimie-minerale` |
| `QUALITE_EAU` | nutriments | `NO3`, `NO2`, `NH4`, `NTK`, `PT`, `PO4` | eutrophisation | `api.v_qualite_nutriments`, `/api/qualite/nutriments` |
| `QUALITE_EAU` | metaux | `FE`, `MN`, `Mo`, `PB`, `ZN`, `CU`, `CD`, `NI`, `AG`, `AL`, `AS`, `BA`, `BE`, `CO`, `LI`, `SB`, `SE`, `SN`, `SR`, `TL`, `V` | contamination metallique | `api.v_qualite_metaux`, `/api/qualite/metaux` |
| `QUALITE_EAU` | pollution organique | `DCO`, `DBO5`, `MO`, `PHENOL`, `DETERGENT`, `MES` | charge organique et pollution | `api.v_qualite_pollution_organique`, `/api/qualite/pollution-organique` |
| `QUALITE_EAU` | microbiologie | `CT`, `CF`, `SF` | contamination bacterienne | `api.v_qualite_microbiologie`, `/api/qualite/microbiologie` |
| `QUALITE_EAU` | biologique / indices | `IBD`, `IBGN`, `CHLA`, `PHEOPIGMENT` | indices ecologiques / biomasse | `api.v_qualite_biologique`, `/api/qualite/biologique` |
| `QUALITE_EAU` | organoleptique | `COULEUR`, `ODEUR`, `SAVEUR` | perception / qualite apparente | `api.v_qualite_organoleptique`, `/api/qualite/organoleptique` |
| `QUALITE_EAU` | terrain | `DISQUE_SECCHI`, `T_EAU`, `T_AIR` | mesures terrain | `api.v_qualite_terrain`, `/api/qualite/terrain` |
| `QUALITE_EAU` | morphometrie | `LARGEUR`, `PROFONDEUR` | contexte physique station/cours d'eau | `api.v_qualite_terrain`, `/api/qualite/terrain` |
| `POLLUTION_IDP` | inventaire pollution | source, activite, rejet | diagnostic et priorisation | `api.v_pollution_sources`, `/api/pollution/sources` |
| `POLLUTION_IDP` | constat prealable | constat terrain, observation | qualification initiale | `api.v_pollution_constat_prealable`, `/api/pollution/constats` |
| `POLLUTION_IDP` | points prelevement | point, X/Y, station proposee | carte | `api.v_idp_points`, `/api/idp/points` |
| `POLLUTION_IDP` | analyses finales | mesures labo pollution | dashboard analytique | `api.v_pollution_analyses_finales`, `/api/pollution/analyses-finales` |
| `POLLUTION_IDP` | points non resolus | X/Y sans rattachement stable | validation progressive | `api.v_idp_points_non_resolus`, `/api/idp/points-non-resolus` |
| `MODELISATION` | SWAT | run, scenario, subbasin, variable | consultation resultats | `api.v_swat_runs`, `api.v_swat_results` |
| `MODELISATION` | WASP | run, scenario, segment, variable | consultation resultats | `api.v_wasp_runs`, `api.v_wasp_results` |
