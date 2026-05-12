# Lot D3 — Unités et attributs

## Unités standards proposées

| Unité | Nombre paramètres | Exemples paramètres |
|---|---|---|
| mg/L | 64 | AG \| AL \| AS \| BA \| BE \| CA \| CD \| CL \| CL2_RES \| CN \| CO \| CO2_LIBRE \| CO3 \| CR \| CU \| ... (+49) |
| à confirmer | 62 | MD \| UNREC_ALUMINIUM \| UNREC_AMMONIA_N \| UNREC_ANNEE_HYDROLOGIQUE_CALCULEE \| UNREC_ANNEE_HYDROLOGIQUE_DEBUT_MOIS \| UNREC_ANTIMOINE \| UNREC_ARGENT \| UNREC_A_B_C_D \| UNREC_A_B_C_D_H_E \| UNREC_BARYUM \| UNREC_BERYLLIUM \| UNREC_CBOD_U \| UNREC_CBOD_ULTIMATE \| UNREC_CHLA_OUT \| UNREC_CHROME_TOTAL \| ... (+47) |
| °C | 10 | T_AIR \| T_EAU \| UNREC_COND_25DEGC_0_9_0_01 \| UNREC_COND_25DEGC_1_1_0_01 \| UNREC_TEMPERATURE_MAX \| UNREC_TEMPERATURE_MAXIMALE \| UNREC_TEMPERATURE_MIN \| UNREC_TEMPERATURE_MINIMALE \| UNREC_TEMPERATURE_MOYENNE \| UNREC_WATER_TEMPERATURE |
| mm | 8 | EVAPORATION \| PRECIPITATION \| P_MAX \| UNREC_EVAPO \| UNREC_PRECIP \| UNREC_PRECIPITATION_ANNUELLE \| UNREC_PRECIPITATION_JOURNALIERE \| UNREC_PRECIPITATION_MAXIMALE |
| m | 7 | DISQUE_SECCHI \| DIST_FOYER \| EAU_SS_TERR \| HAUTEUR \| LARGEUR \| NIVEAU_PIEZOM \| PROFONDEUR |
| UFC/100 mL | 5 | CF \| CT \| PSEUDO_AER \| SF \| VIBRIO |
| Mm³ | 4 | APPORTS_HM3 \| RESTITUTION \| TRANSFERT \| VOLUME |
| meq/L | 3 | TA \| TAC \| TH |
| — (variable) | 3 | VAL_OBS \| VAL_POWER \| VAL_REMPLIES |
| % | 2 | BILAN_ION \| SATURATION_OXYGENE |
| UFC/mL | 2 | GERME_22 \| GERME_37 |
| km | 2 | LONGUEUR \| PERIMETRE |
| meq/L ou mg/L | 2 | SOM_ANIONS \| SOM_CATIONS |
| m³/an | 2 | VOL_PRELEVE \| VOL_TRAIT |
| µS/cm | 2 | COND \| UNREC_CONDUC |
| µg/L | 2 | CHLA \| PHEOPIGMENT |
| — (indice /20) | 2 | IBD \| IBGN |
| — (qualitatif) | 2 | ODEUR \| SAVEUR |
| EH | 1 | CAP_EQUIV |
| Millions Dirhams | 1 | MONTANT_MD |
| NTU | 1 | TURBIDITE |
| UCV | 1 | COULEUR |
| ha | 1 | SUPERFICIE_HA |
| km² | 1 | SUPERFICIE_KM2 |
| m NGM | 1 | NIVEAU_EAU |
| m3/s | 1 | DEBIT |
| mV | 1 | EH |
| mg/l | 1 | UNREC_BORE_MG_L |
| mm/an | 1 | P_ANNUELLE |
| sans unité | 1 | PH |
| spores/100 mL | 1 | CLOSTRI |
| t/jour | 1 | QUANTITE_TJ |
| — | 1 | DIMENSION |
| — (code) | 1 | NUMEROTATION |

## Attributs obligatoires

| Code | Paramètre | Attributs obligatoires | Attributs optionnels | Statut |
|---|---|---|---|---|
| CF | Coliformes_fecaux | type_valeur |  | VALID_WITH_QA |
| CL | Chlorures | methode_analyse |  | VALID |
| COND | Conductivite | temperature_reference | source_mesure | VALID |
| CT | Coliformes_totaux | type_valeur |  | VALID_WITH_QA |
| DBO5 | DBO5 | condition_mesure | methode_analyse | VALID_WITH_QA |
| DCO | DCO | condition_mesure | qa_relation_DCO_DBO5 | VALID_WITH_QA |
| DEBIT | Debit | time_step;unite_source;source_table | source_mesure | VALID_WITH_QA |
| EVAPORATION | Evaporation | time_step | source_donnee | VALID_WITH_QA |
| FE | Fer | forme_chimique |  | VALID_WITH_QA |
| MES | MES | filtre | condition_mesure | VALID_WITH_QA |
| MN | Manganese | forme_chimique |  | VALID_WITH_QA |
| NH4 | Ammonium | methode_analyse | forme_chimique | VALID |
| NO2 | Nitrites | methode_analyse | conversion_unite_si_ug_L | VALID_WITH_QA |
| NO3 | Nitrates | methode_analyse | forme_chimique | VALID |
| PH | pH | source_mesure | methode_analyse | VALID |
| PHENOL | Phenol | methode_analyse |  | VALID_WITH_QA |
| PRECIPITATION | Precipitation | time_step;source_donnee;type_valeur |  | VALID_WITH_QA |
| SATURATION_OXYGENE | Saturation_oxygene | parametre_lie_O2 | source_mesure | VALID_WITH_QA |
| SO4 | Sulfates | methode_analyse |  | VALID |
| T_AIR | Temperature_air | time_step;type_valeur | source_donnee | VALID_WITH_QA |

## Règles d’unités validées D3

- Chimie : `mg/L` sauf exceptions validées.
- pH : sans unité.
- Conductivité : `µS/cm` avec `temperature_reference`.
- Turbidité : `NTU`.
- Température : `°C`.
- Saturation oxygène : `%`.
- Débit : `m3/s`.
- Précipitation / évaporation : `mm`.
