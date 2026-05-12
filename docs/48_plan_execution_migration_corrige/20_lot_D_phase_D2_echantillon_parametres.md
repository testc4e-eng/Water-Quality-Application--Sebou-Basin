# Lot D2 — Échantillon référentiel paramètres

## 1. Périmètre

- Statut : `VALIDÉ UTILISATEUR POUR GÉNÉRALISATION D3`
- Phase autorisée : D2 uniquement
- Nombre de paramètres consolidés : 30
- Base consultée : `abh_sad`, schéma `staging.raw_*`, lecture seule
- Aucune table finale métier n’a été alimentée.
- Aucune table `metadata` n’a été créée ou modifiée pendant D2.

## 2. Sources utilisées

| Source | Usage |
|---|---|
| `docs/39_inventaire_parametres_metier_REGEN/08_tableau_validation_metier.csv` | inventaire propre et volumes |
| `docs/40_enrichissement_normes_seuils_ABH/03_tableau_seuils_ABH.csv` | présence de seuils ABH par paramètre |
| `docs/42_analyse_parametres_valeurs_migration/06_tableau_decision_migration_parametres.csv` | mapping, unités, statuts migration |
| `docs/retour equipe metier.xlsx / feuille parametres_normalises` | nom standard, variantes métier et unité métier |
| `abh_sad.staging.raw_*` | contrôle lecture seule des exemples et volumes bruts |

## 3. Synthèse D2

| Indicateur | Valeur |
|---|---:|
| Paramètres consolidés dans l’échantillon | 30 |
| Statut OK | 0 |
| Statut OK_AVEC_REGLE_QA | 2 |
| Statut OK_AVEC_VALIDATION_UNITE | 26 |
| Statut QUARANTAINE | 2 |
| Statut NON_RECONNU | 0 |
| Paramètres avec seuil ABH détecté | 16 |
| Tables sources documentées dans l’échantillon | 16 |

## 4. Règle appliquée

Un paramètre est classé `QUARANTAINE` si le nom canonique, l’unité standard, le type métier ou la règle de parsing n’est pas stabilisé. Le flag obligatoire est alors `PARAMETRE_A_VALIDER`.

## 5. Table master échantillon

| ID | Nom canonique | Unité standard | Type métier | Statut | Flag | Volume doc | Variantes | Décision attendue |
|---|---|---|---|---|---|---:|---|---|
| PM-D2-001 | pH | — (sans unité) | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 10218 | 3 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-002 | NH4+ | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 9991 | 7 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-003 | NO3- | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 5661 | 4 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-004 | NO2- | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 4813 | 2 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-005 | PO4³- | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 2744 | 4 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-006 | DCO | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 7034 | 4 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-007 | DBO5 | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 6884 | 2 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-008 | MES | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 2823 | 3 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-009 | Cond | µS/cm | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 10230 | 5 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-010 | T_eau | °C | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 10219 | 2 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-011 | O2_dissous | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 7957 | 4 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-012 | sat | % | physico-chimie | OK_AVEC_REGLE_QA | REGLE_QA_A_VALIDER | 1221 | 1 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-013 | CF | UFC/100 mL | bactériologie | OK_AVEC_REGLE_QA | REGLE_QA_A_VALIDER | 5191 | 2 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-014 | CT | UFC/100 mL | bactériologie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 4725 | 1 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-015 | NTK | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 6731 | 5 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-016 | PT | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 3033 | 6 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-017 | Cl- | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 5165 | 4 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-018 | SO4²- | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 5292 | 4 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-019 | Ca | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 4696 | 2 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-020 | Na | mg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 4906 | 3 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-021 | As | mg/L | métaux lourds | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 479 | 3 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-022 | Cd | mg/L | métaux lourds | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 515 | 3 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-023 | Pb | mg/L | métaux lourds | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 678 | 3 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-024 | HG | mg/L | pollution / physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 99 | 3 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-025 | HG / Hg | à confirmer | pollution / physico-chimie | QUARANTAINE | PARAMETRE_A_VALIDER | 4987 | 2 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-026 | Phenol | mg/L | pollution / physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 5800 | 8 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-027 | Chla | µg/L | physico-chimie | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 827 | 4 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-028 | Debit_m / Debit_jr | m³/s | hydrologie | QUARANTAINE | PARAMETRE_A_VALIDER | 544103 | 5 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-029 | Evaporation | mm | météo | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 48900 | 1 | valider nom canonique, unité standard, règle parsing et statut avant D3 |
| PM-D2-030 | Precip_jr | mm/jour | météo | OK_AVEC_VALIDATION_UNITE | UNITE_SOURCE_A_VALIDER | 669880 | 1 | valider nom canonique, unité standard, règle parsing et statut avant D3 |

## 6. Mapping source vers canonique

| Canonique | Variantes métier | Variantes détectées | Tables sources | Statuts source |
|---|---|---|---|---|
| pH | ph \| pH \| pH au laboratoire | ph \| pH \| pH au laboratoire | idp_2024_mesures_qualite_marche_cadre \| idp_2024_src_pollution_globale \| idp_2024_src_pollution_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_EXACT:8; MAPPED_BY_METIER_VARIANT:1 |
| NH4+ | Ammonium \| NH4 \| NH4+ \| NH4+  Titri \| NH4+ 2 \| NH4+ Spect \| NH4+(mgNH4+/l) | Ammonium \| NH4+ \| NH4+ Spect \| NH4 \| NH4+  Titri \| NH4+ 2 \| NH4+(mgNH4+/l) | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_BY_METIER_VARIANT:8; MAPPED_EXACT:3 |
| NO3- | NO3- \| NO3-(mg/l) \| NO3-_Réduction Cd \| NO3-_Spectro | NO3- \| NO3-(mg/l) \| NO3-_Réduction Cd \| NO3-_Spectro | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_EXACT:6; MAPPED_BY_METIER_VARIANT:2 |
| NO2- | NO2- \| NO2- _Spectro. | NO2- \| NO2- _Spectro. | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| types_mesures | MAPPED_EXACT:5; MAPPED_BY_METIER_VARIANT:1 |
| PO4³- | PO3 \| PO4 3- \| PO43- \| PO43-(mgP/l) | PO43- \| PO3 \| PO4 3- \| PO43-(mgP/l) | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_EXACT:7; MAPPED_BY_METIER_VARIANT:1 |
| DCO | DCO \| DCO  2h décant. \| DCO  D   2h \| DCO_dec2h | DCO \| DCO  2h décant. \| DCO  D   2h | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_EXACT:7; MAPPED_BY_METIER_VARIANT:2 |
| DBO5 | DBO5 \| DBO5_dec2h | DBO5 | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_EXACT:7 |
| MES | MES \| MEST Filtr \| MEST(mg/l) | MES \| MEST(mg/l) \| MEST Filtr | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_EXACT:5; MAPPED_BY_METIER_VARIANT:2 |
| Cond | Cond 25°C \| cond_20_c \| Conductivite \| Conductivité \| Conductivitéà20°C(µs/cm) | Cond 25°C \| cond_20_c \| Conductivite \| Conductivité \| Conductivitéà20°C(µs/cm) | idp_2024_mesures_qualite_marche_cadre \| idp_2024_src_pollution_globale \| idp_2024_src_pollution_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_BY_METIER_VARIANT:9 |
| T_eau | t_eau \| T_eau | t_eau \| T_eau | idp_2024_src_pollution_globale \| idp_2024_src_pollution_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_EXACT:8 |
| O2_dissous | O2_diss \| o2_dissous \| O2_dissous \| O2dissous(mgd'O2/l) | O2_diss \| o2_dissous \| O2_dissous \| O2dissous(mgd'O2/l) | idp_2024_src_pollution_globale \| idp_2024_src_pollution_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_BY_METIER_VARIANT:4; MAPPED_EXACT:4 |
| sat | sat | sat | mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| types_mesures | MAPPED_EXACT:4 |
| CF | CF \| CF(UFC/100mL) | CF \| CF(UFC/100mL) | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_EXACT:7 |
| CT | CT | CT | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| types_mesures | MAPPED_EXACT:6 |
| NTK | NTK \| NTK Spectr \| NTK Titri \| Azote_tot_kjeld \| Azote_tot_kjeldhal | Azote_tot_kjeld \| Azote_tot_kjeldhal \| NTK \| NTK Spectr \| NTK Titri | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_BY_METIER_VARIANT:8; MAPPED_EXACT:2 |
| PT | PT \| PT  décant. 2h \| PT DECANTE \| PT(mgP/l) \| Phosphore total \| Phosphore_Total | PT \| Phosphore total \| Phosphore_Total \| PT  décant. 2h \| PT DECANTE \| PT(mgP/l) | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_EXACT:3; MAPPED_BY_METIER_VARIANT:6 |
| Cl- | Cl \| Cl- \| Cl-(mg/l) \| Cl-_IC | Cl \| Cl- \| Cl-(mg/l) \| Cl-_IC | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_BY_METIER_VARIANT:5; MAPPED_EXACT:2 |
| SO4²- | SO4 \| SO4-- \| SO4(mg/l) \| SO42-_IC | SO4 \| SO4-- \| SO4(mg/l) \| SO42-_IC | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_BY_METIER_VARIANT:7 |
| Ca | Ca \| Ca++ | Ca \| Ca++ | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| types_mesures | MAPPED_EXACT:4; MAPPED_BY_METIER_VARIANT:2 |
| Na | NA \| Na+ \| Na+3 | NA \| Na+ \| Na+3 | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| types_mesures | MAPPED_EXACT:4; MAPPED_BY_METIER_VARIANT:3 |
| As | As \| Arsenic \| Arsenic(mg/l) | Arsenic(mg/l) \| As \| Arsenic | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo | MAPPED_BY_METIER_VARIANT:2; MAPPED_EXACT:3 |
| Cd | Cd \| Cadmium \| Cadmium(mg/l) | Cadmium(mg/l) \| Cd \| Cadmium | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo | MAPPED_BY_METIER_VARIANT:2; MAPPED_EXACT:3 |
| Pb | Pb \| Plomb \| Plomb(mg/l) | Pb \| Plomb \| Plomb(mg/l) | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo | MAPPED_EXACT:3; MAPPED_BY_METIER_VARIANT:2 |
| HG | H_G \| Huiles Graisses \| Huiles Graisses (H G T) | Huiles Graisses \| Huiles Graisses (H G T) | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre | MAPPED_BY_METIER_VARIANT:2 |
| HG / Hg | à confirmer | H_G \| Hg | idp_2024_mesures_qualite_globale \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_sebou_jr | AMBIGUOUS:6 |
| Phenol | phenol \| Phenol \| Phénol \| Ph�nol \| indice de phénol M:A \| Indicedephénol(mg/l) \| IP \| IP(mgO2/l) | IP \| Phénol \| Indicedephénol(mg/l) \| IP(mgO2/l) \| indice de phénol M:A \| phenol \| Phenol \| Ph�nol | idp_2024_mesures_qualite_globale \| idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| suivi_qualite_sebou_jr \| types_mesures | MAPPED_BY_METIER_VARIANT:7; MAPPED_EXACT:4 |
| Chla | Chl \| Chl a \| Chl.A(µg/l) \| Chla | Chl \| Chl.A(µg/l) \| Chla \| Chl a | idp_2024_mesures_qualite_marche_cadre \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| suivi_qualite_brg_garde_hebdo \| types_mesures | MAPPED_BY_METIER_VARIANT:1; MAPPED_EXACT:6 |
| Debit_m / Debit_jr | à confirmer | debit \| Debit \| debit_jr \| debit_l_s \| debit_m | mesures_debit_jr \| mesures_debit_m \| mesures_debit_sources \| mesures_qualite_barrages \| mesures_qualite_nappes \| mesures_qualite_rivieres \| rejets_domestiques_abhs \| types_mesures | AMBIGUOUS:8 |
| Evaporation | val_evaporation | val_evaporation | mesures_evaporation_jr | MAPPED_BY_METIER_VARIANT:1 |
| Precip_jr | precipitation_jr | precipitation_jr | mesures_precipitations_jr | MAPPED_BY_METIER_VARIANT:1 |

## 7. Unités et règles de parsing

| Canonique | Unité standard | Statuts unité source | Règle parsing proposée |
|---|---|---|---|
| pH | — (sans unité) | UNIT_UNKNOWN:9 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| NH4+ | mg/L | UNIT_MISSING:6; UNIT_OK:4; UNIT_CONFLICT:1 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| NO3- | mg/L | UNIT_OK:6; UNIT_MISSING:2 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| NO2- | mg/L | UNIT_OK:5; UNIT_MISSING:1 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| PO4³- | mg/L | UNIT_MISSING:3; UNIT_OK:4; UNIT_CONFLICT:1 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| DCO | mg/L | UNIT_CONFLICT:7; UNIT_MISSING:2 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| DBO5 | mg/L | UNIT_CONFLICT:7 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| MES | mg/L | UNIT_OK:6; UNIT_MISSING:1 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Cond | µS/cm | UNIT_CONFLICT:1; UNIT_MISSING:3; UNIT_OK:5 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| T_eau | °C | UNIT_MISSING:2; UNIT_OK:6 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| O2_dissous | mg/L | UNIT_CONFLICT:5; UNIT_MISSING:3 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| sat | % | UNIT_OK:4 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| CF | UFC/100 mL | UNIT_OK:7 | numeric_microbio + decimal_comma + scientific_notation + detection_limit_flags + quarantine_non_parseable |
| CT | UFC/100 mL | UNIT_CONFLICT:6 | numeric_microbio + decimal_comma + scientific_notation + detection_limit_flags + quarantine_non_parseable |
| NTK | mg/L | UNIT_OK:6; UNIT_MISSING:4 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| PT | mg/L | UNIT_MISSING:5; UNIT_OK:3; UNIT_CONFLICT:1 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Cl- | mg/L | UNIT_OK:5; UNIT_MISSING:2 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| SO4²- | mg/L | UNIT_OK:5; UNIT_MISSING:2 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Ca | mg/L | UNIT_OK:4; UNIT_MISSING:2 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Na | mg/L | UNIT_MISSING:7 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| As | mg/L | UNIT_OK:1; UNIT_MISSING:4 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Cd | mg/L | UNIT_OK:1; UNIT_MISSING:4 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Pb | mg/L | UNIT_MISSING:4; UNIT_OK:1 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| HG | mg/L | UNIT_MISSING:2 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| HG / Hg | à confirmer | UNIT_MISSING:6 | règle à valider avant migration |
| Phenol | mg/L | UNIT_MISSING:4; UNIT_OK:3; UNIT_CONFLICT:4 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Chla | µg/L | UNIT_MISSING:2; UNIT_OK:5 | numeric_decimal_comma + detection_limit_flags + quarantine_non_parseable |
| Debit_m / Debit_jr | m³/s | UNIT_MISSING:2; UNIT_UNKNOWN:6 | numeric_decimal_comma + unit_checked + negative_flag_if_validated + quarantine_non_parseable |
| Evaporation | mm | UNIT_MISSING:1 | numeric_decimal_comma + unit_checked + negative_flag_if_validated + quarantine_non_parseable |
| Precip_jr | mm/jour | UNIT_MISSING:1 | numeric_decimal_comma + unit_checked + negative_flag_if_validated + quarantine_non_parseable |

## 8. Seuils ABH détectés

| Canonique | Seuil ABH disponible | Références ABH |
|---|---|---|
| pH | oui | eaux de surface p.8 (PH) \| eaux de rivières p.12 (pH) \| eaux de lacs p.13 (pH) \| eaux souterraines p.14 (pH) |
| NH4+ | oui | eaux de surface p.8 (Ammonium) \| eaux de rivières p.12 (Ammonium NH4) \| eaux de lacs p.13 (Ammonium) \| eaux souterraines p.14 (Ammonium) |
| NO3- | oui | eaux de surface p.8 (Nitrates (NO3-)) \| eaux de rivières p.12 (Nitrates (NO3-)) \| eaux de lacs p.13 (Nitrates) \| eaux souterraines p.14 (Nitrates) |
| NO2- | non | non détecté |
| PO4³- | oui | eaux de surface p.8 (Phosphates (PO4--)) \| eaux de rivières p.12 (Orthophosphates (PO4³-)) \| eaux de lacs p.13 (Orthophosphates (PO4³-)) |
| DCO | oui | eaux de surface p.8 (DCO) \| eaux de rivières p.12 (DCO) |
| DBO5 | oui | eaux de surface p.8 (DBO 5) \| eaux de rivières p.12 (DBO5) |
| MES | oui | eaux de surface p.8 (MES) \| eaux de rivières p.12 (MES) \| eaux de lacs p.13 (MES) |
| Cond | oui | eaux de surface p.8 (Conductivité à 20° C) \| eaux de rivières p.12 (CE 20°c) \| eaux de lacs p.13 (CE 20°c) \| eaux souterraines p.14 (CE 20°c) |
| T_eau | oui | eaux de surface p.8 (Température) \| eaux de rivières p.12 (Température) \| eaux de lacs p.13 (Température) \| eaux souterraines p.14 (Température) |
| O2_dissous | oui | eaux de surface p.8 (O2 dissous) \| eaux de rivières p.12 (O2 dissous) \| eaux de lacs p.13 (O2 dissous) |
| sat | non | non détecté |
| CF | oui | eaux de surface p.8 (Coliformes fécaux) \| eaux de rivières p.12 (C. fécaux) \| eaux de lacs p.13 (C. fécaux) \| eaux souterraines p.14 (C. fécaux) |
| CT | oui | eaux de surface p.8 (Coliformes totaux) \| eaux de rivières p.12 (C. totaux) \| eaux de lacs p.13 (C. totaux) \| eaux souterraines p.14 (C. totaux) |
| NTK | oui | eaux de surface p.8 (NTK) \| eaux de rivières p.12 (NTK) \| eaux de lacs p.13 (NTK) |
| PT | oui | eaux de surface p.8 (P total (Pt)) \| eaux de rivières p.12 (P.total (PT)) \| eaux de lacs p.13 (P.total) |
| Cl- | non | non détecté |
| SO4²- | oui | eaux de surface p.8 (Sulfates (SO4-)) \| eaux de rivières p.12 (Sulfates (SO4-)) \| eaux de lacs p.13 (Sulfates) \| eaux souterraines p.14 (Sulfates) |
| Ca | non | non détecté |
| Na | non | non détecté |
| As | non | non détecté |
| Cd | non | non détecté |
| Pb | non | non détecté |
| HG | non | non détecté |
| HG / Hg | non | non détecté |
| Phenol | non | non détecté |
| Chla | oui | eaux de surface p.8 (Chlorophylle a) \| eaux de lacs p.13 (Chlorophylle a) |
| Debit_m / Debit_jr | non | non détecté |
| Evaporation | non | non détecté |
| Precip_jr | non | non détecté |

## 9. Exemples bruts contrôlés en lecture seule

| Canonique | Exemples raw |
|---|---|
| pH | raw_suivi_qualite_sebou_jr : pH=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : pH=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : pH=8.2 ; date=2023-12-09 ; point=2263/15 |
| NH4+ | raw_suivi_qualite_sebou_jr : Ammonium=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : Ammonium=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : Ammonium=32.112 ; date=2023-12-09 ; point=2263/15 |
| NO3- | raw_mesures_qualite_nappes : NO3-=14.8 ; date=1988-10-03 ; point=1652/22 \|\| raw_mesures_qualite_nappes : NO3-=6.6 ; date=1989-03-31 ; point=2528/15 \|\| raw_mesures_qualite_nappes : NO3-=29 ; date=1990-09-20 ; point=1182/14 |
| NO2- | raw_mesures_qualite_nappes : NO2-=0 ; date=1991-01-24 ; point=159/22 \|\| raw_mesures_qualite_nappes : NO2-=0.01 ; date=1991-03-22 ; point=1161/15 \|\| raw_mesures_qualite_nappes : NO2-=0.02 ; date=1991-03-26 ; point=160/15 |
| PO4³- | raw_mesures_qualite_rivieres : PO4 3-=9.2 ; date=1988-10-05 ; point=2496/15 \|\| raw_mesures_qualite_rivieres : PO4 3-=0.116 ; date=1988-10-06 ; point=1236/14 \|\| raw_mesures_qualite_rivieres : PO4 3-=4.566 ; date=1988-10-06 ; point=1540/15 |
| DCO | raw_suivi_qualite_sebou_jr : DCO=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : DCO=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : DCO=NaN ; date=2023-12-09 ; point=2263/15 |
| DBO5 | raw_suivi_qualite_sebou_jr : DBO5=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : DBO5=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : DBO5=NaN ; date=2023-12-09 ; point=2263/15 |
| MES | raw_mesures_qualite_rivieres : MES=343 ; date=1988-09-22 ; point=1000/23 \|\| raw_mesures_qualite_rivieres : MES=40.8 ; date=1988-10-04 ; point=2169/15 \|\| raw_mesures_qualite_rivieres : MES=6558 ; date=1988-10-05 ; point=2496/15 |
| Cond | raw_suivi_qualite_sebou_jr : Conductivité=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : Conductivité=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : Conductivité=1668 ; date=2023-12-09 ; point=2263/15 |
| T_eau | raw_suivi_qualite_sebou_jr : T_eau=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : T_eau=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : T_eau=18.6 ; date=2023-12-09 ; point=2263/15 |
| O2_dissous | raw_suivi_qualite_sebou_jr : O2_dissous=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : O2_dissous=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : O2_dissous=8.8 ; date=2023-12-09 ; point=2263/15 |
| sat | raw_mesures_qualite_rivieres : sat=0 ; date=1988-09-20 ; point=2817/15 \|\| raw_mesures_qualite_rivieres : sat=8.3 ; date=1988-09-22 ; point=1000/23 \|\| raw_mesures_qualite_rivieres : sat=48.5 ; date=1988-10-04 ; point=2169/15 |
| CF | raw_mesures_qualite_nappes : CF=2 ; date=1988-10-03 ; point=1652/22 \|\| raw_mesures_qualite_nappes : CF=1300 ; date=1988-10-19 ; point=1475/9 \|\| raw_mesures_qualite_nappes : CF=2 ; date=1989-03-31 ; point=2528/15 |
| CT | raw_mesures_qualite_nappes : CT=16 ; date=1988-10-03 ; point=1652/22 \|\| raw_mesures_qualite_nappes : CT=68000 ; date=1988-10-19 ; point=1475/9 \|\| raw_mesures_qualite_nappes : CT=200 ; date=1989-03-31 ; point=2528/15 |
| NTK | raw_suivi_qualite_sebou_jr : NTK=0 ; date=2024-04-18 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : NTK=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : NTK=NaN ; date=2023-12-08 ; point=2263/15 |
| PT | raw_mesures_qualite_rivieres : Phosphore total=3.47 ; date=1988-09-22 ; point=1000/23 \|\| raw_mesures_qualite_rivieres : Phosphore total=2.974 ; date=1988-10-04 ; point=2169/15 \|\| raw_mesures_qualite_rivieres : Phosphore total=6.59 ; date=1988-10-05 ; point=2496/15 |
| Cl- | raw_mesures_qualite_nappes : Cl=227.1 ; date=1988-10-03 ; point=1652/22 \|\| raw_mesures_qualite_nappes : Cl=221 ; date=1989-03-31 ; point=2528/15 \|\| raw_mesures_qualite_nappes : Cl=69.8 ; date=1990-09-20 ; point=1182/14 |
| SO4²- | raw_mesures_qualite_nappes : SO4=39 ; date=1988-10-03 ; point=1652/22 \|\| raw_mesures_qualite_nappes : SO4=19.2 ; date=1989-03-31 ; point=2528/15 \|\| raw_mesures_qualite_nappes : SO4=29.3 ; date=1990-09-21 ; point=2881/15 |
| Ca | raw_mesures_qualite_nappes : Ca=67.3 ; date=1988-10-03 ; point=1652/22 \|\| raw_mesures_qualite_nappes : Ca=122.6 ; date=1989-03-31 ; point=2528/15 \|\| raw_mesures_qualite_nappes : Ca=994 ; date=1991-03-27 ; point=2881/15 |
| Na | raw_mesures_qualite_nappes : NA=172 ; date=1988-10-03 ; point=1652/22 \|\| raw_mesures_qualite_nappes : NA=132 ; date=1989-03-31 ; point=2528/15 \|\| raw_mesures_qualite_nappes : NA=8160 ; date=1991-03-27 ; point=2881/15 |
| As | raw_mesures_qualite_rivieres : As=0.015 ; date=1993-03-09 ; point=756/16 \|\| raw_mesures_qualite_rivieres : As=0.01 ; date=1993-03-12 ; point=2400/14 \|\| raw_mesures_qualite_rivieres : As=0.015 ; date=1993-03-18 ; point=3261/14 |
| Cd | raw_mesures_qualite_rivieres : Cd=0.001 ; date=1990-02-07 ; point=609/9 \|\| raw_mesures_qualite_rivieres : Cd=0.001 ; date=1990-02-12 ; point=2401/14 \|\| raw_mesures_qualite_rivieres : Cd=0.0004 ; date=1990-03-21 ; point=669/22 |
| Pb | raw_mesures_qualite_rivieres : Pb=0.02 ; date=1990-01-31 ; point=2496/15 \|\| raw_mesures_qualite_rivieres : Pb=0.023 ; date=1990-02-01 ; point=1359/8 \|\| raw_mesures_qualite_rivieres : Pb=0.013 ; date=1990-02-05 ; point=3261/14 |
| HG | à confirmer en raw |
| HG / Hg | raw_suivi_qualite_sebou_jr : H_G=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : H_G=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : H_G=0.402 ; date=2023-12-09 ; point=2263/15 |
| Phenol | raw_suivi_qualite_sebou_jr : Phenol=NaN ; date=2023-12-07 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : Phenol=NaN ; date=2023-12-08 ; point=2263/15 \|\| raw_suivi_qualite_sebou_jr : Phenol=0.02 ; date=2023-12-09 ; point=2263/15 |
| Chla | raw_mesures_qualite_barrages : Chla=9.1 ; date=1990-08-17 ; point=788/21 \|\| raw_mesures_qualite_barrages : Chla=1.1 ; date=1991-09-27 ; point=788/21 \|\| raw_mesures_qualite_barrages : Chla=1 ; date=1991-10-29 ; point=3907/14 |
| Debit_m / Debit_jr | raw_mesures_debit_jr : debit_jr=0.0702 ; date=1984-09-01 ; point=1000/23 \|\| raw_mesures_debit_jr : debit_jr=0.0702 ; date=1984-09-02 ; point=1000/23 \|\| raw_mesures_debit_jr : debit_jr=0.074 ; date=1984-09-03 ; point=1000/23 |
| Evaporation | raw_mesures_evaporation_jr : val_evaporation=1.73 ; date=2016-04-27 ; point=3817/600 \|\| raw_mesures_evaporation_jr : val_evaporation=4.78 ; date=2016-04-28 ; point=3817/600 \|\| raw_mesures_evaporation_jr : val_evaporation=4.61 ; date=2016-04-29 ; point=3817/600 |
| Precip_jr | raw_mesures_precipitations_jr : precipitation_jr=0 ; date=2009-01-01 ; point=198/30 \|\| raw_mesures_precipitations_jr : precipitation_jr=0 ; date=2009-01-02 ; point=198/30 \|\| raw_mesures_precipitations_jr : precipitation_jr=0 ; date=2009-01-03 ; point=198/30 |

## 10. Paramètres à arbitrer avant D3

- `pH` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `NH4+` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `NO3-` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `NO2-` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `PO4³-` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `DCO` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `DBO5` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `MES` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Cond` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `T_eau` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `O2_dissous` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `CT` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `NTK` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `PT` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Cl-` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `SO4²-` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Ca` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Na` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `As` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Cd` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Pb` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `HG` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `HG / Hg` : QUARANTAINE / PARAMETRE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Phenol` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Chla` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Debit_m / Debit_jr` : QUARANTAINE / PARAMETRE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Evaporation` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3
- `Precip_jr` : OK_AVEC_VALIDATION_UNITE / UNITE_SOURCE_A_VALIDER / valider nom canonique, unité standard, règle parsing et statut avant D3

## 11. Décision attendue

Échantillon validé pour généralisation D3. Aucun `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE` ou chargement final n’a été exécuté.
