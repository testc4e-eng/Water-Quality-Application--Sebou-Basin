# Tableau décision migration — version lisible

## Prêts à migrer

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0053 | CF | CF | types_mesures | UFC/100mL | MAPPED_EXACT | UNIT_OK | VALID | migrer sans réserve particulière |
| MIG-0067 | Cl | Cl- | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | VALID | migrer sans réserve particulière |
| MIG-0179 | Fe | Fe | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | VALID | migrer sans réserve particulière |
| MIG-0188 | FeT | Fe | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | VALID | migrer sans réserve particulière |
| MIG-0264 | Mn | Mn | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | VALID | migrer sans réserve particulière |
| MIG-0302 | NO2- | NO2- | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | VALID | migrer sans réserve particulière |
| MIG-0308 | NO3- | NO3- | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | VALID | migrer sans réserve particulière |
| MIG-0433 | SO4 | SO4²- | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | VALID | migrer sans réserve particulière |

## À migrer avec flag

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0011 | Arsenic(mg/l) | As | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |
| MIG-0042 | Cadmium(mg/l) | Cd | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |
| MIG-0169 | F-(mg/l) | F- | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |
| MIG-0129 | Fe | Fe | idp_2024_mesures_qualite_marche_cadre | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0244 | Fe | Fe | idp_2024_mesures_qualite_globale | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0185 | FeT | Fe | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec flag |
| MIG-0183 | Fer(mg/l) | Fe | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |
| MIG-0184 | Ferdissous(mg/l) | Fe | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |
| MIG-0415 | MES | MES | idp_2024_mesures_qualite_globale | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0242 | Manganèse(mg/l) | Mn | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec flag |
| MIG-0180 | Mn | Mn | idp_2024_mesures_qualite_globale | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0417 | Mn | Mn | idp_2024_mesures_qualite_marche_cadre | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0012 | NO2- | NO2- | idp_2024_mesures_qualite_globale | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0299 | NO2- | NO2- | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |
| MIG-0216 | NO3- | NO3- | idp_2024_mesures_qualite_globale | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0305 | NO3- | NO3- | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | migrer avec flag |
| MIG-0309 | NO3-(mg/l) | NO3- | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | migrer avec flag |
| MIG-0128 | Phénol | Phenol | idp_2024_mesures_qualite_globale | mg/L | MAPPED_EXACT | UNIT_OK | FLAG_REQUIRED | appliquer règle de parsing + flag |
| MIG-0358 | Plomb(mg/l) | Pb | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |
| MIG-0435 | SO4(mg/l) | SO4²- | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | migrer avec contrôle standard |

## À valider unité

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0002 | Ag | Ag | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0049 | Ag | Ag | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0004 | Al | Al | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0005 | Al | Al | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0428 | Al | Al | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0007 | Ammonium | NH4+ | suivi_qualite_sebou_jr | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0298 | Arsenic | As | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0013 | As | As | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0014 | As | As | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0056 | As | As | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0029 | Ba | Ba | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0478 | Ba | Ba | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0076 | Be | Be | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0032 | Bilan_Ionique | Bilan_Ion | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0033 | Bilan_Ionique | Bilan_Ion | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0073 | CN | CN- | mesures_qualite_nappes | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0074 | CN | CN- | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0079 | CO2_libre | CO2_libre | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0086 | CO32 | CO3²- | mesures_qualite_nappes | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0001 | CT | CT | idp_2024_mesures_qualite_globale | mg/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0030 | CT | CT | idp_2024_mesures_qualite_marche_cadre | mg/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0111 | CT | CT | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0112 | CT | CT | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0113 | CT | CT | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0114 | CT | CT | types_mesures | mg/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0039 | Ca++ | Ca | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0040 | Ca++ | Ca | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0303 | Cadmium | Cd | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0044 | Carbone_org | MO | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0046 | Cd | Cd | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0047 | Cd | Cd | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0109 | Cd | Cd | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0055 | Chl | Chla | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0357 | Chl a | Chla | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0343 | Chrome | Cr | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0068 | Cl- | Cl- | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0070 | Cl-_IC | Cl- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0071 | Cl2_res | Cl2_res | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0072 | Clostri_sul_redu | Clostri | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0077 | Co | Co | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0078 | Co | Co | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0087 | Co | Co | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0304 | Cobalt | Co | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0089 | Cond 25°C | Cond | idp_2024_mesures_qualite_marche_cadre | °C | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0098 | Conductivité | Cond | suivi_qualite_sebou_jr | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0100 | Couleur | Couleur | mesures_qualite_barrages | UCV | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0101 | Couleur | Couleur | mesures_qualite_nappes | UCV | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0102 | Couleur | Couleur | mesures_qualite_rivieres | UCV | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0103 | Couleur | Couleur | types_mesures | UCV | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0104 | Cr | Cr | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0105 | Cr | Cr | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0107 | CrT | Cr | mesures_qualite_nappes | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0108 | CrT | Cr | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0246 | CrT | Cr | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0116 | Cu | Cu | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0117 | Cu | Cu | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0260 | Cu | Cu | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0375 | Cuivre | Cu | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0122 | DBO5 | DBO5 | mesures_qualite_barrages | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0123 | DBO5 | DBO5 | mesures_qualite_nappes | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0124 | DBO5 | DBO5 | mesures_qualite_rivieres | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0125 | DBO5 | DBO5 | suivi_qualite_sebou_jr | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0126 | DBO5 | DBO5 | types_mesures | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0365 | DBO5 | DBO5 | idp_2024_mesures_qualite_globale | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0479 | DBO5 | DBO5 | idp_2024_mesures_qualite_marche_cadre | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0127 | DBO5_dec2h | DBO5_dec2h | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0130 | DCO | DCO | mesures_qualite_barrages | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0131 | DCO | DCO | mesures_qualite_nappes | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0132 | DCO | DCO | mesures_qualite_rivieres | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0133 | DCO | DCO | suivi_qualite_sebou_jr | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0134 | DCO | DCO | types_mesures | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0251 | DCO | DCO | idp_2024_mesures_qualite_globale | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0374 | DCO | DCO | idp_2024_mesures_qualite_marche_cadre | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0135 | DCO  2h décant. | DCO | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0136 | DCO  D   2h | DCO | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0137 | DCO_dec2h | DCO_dec2h | mesures_qualite_barrages | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0138 | DCO_dec2h | DCO_dec2h | mesures_qualite_rivieres | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0139 | DCO_dec2h | DCO_dec2h | types_mesures | mg O2/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0152 | Detergent_non_ionique | Detergent | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0160 | DisquedeSecchi(m) | Disque_Secchi | suivi_qualite_brg_garde_hebdo | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0167 | F | F- | mesures_qualite_nappes | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0168 | F | F- | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0189 | FM | FM | mesures_qualite_barrages | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0190 | FM | FM | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0191 | FM | FM | types_mesures | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0170 | F_M_mes | FM | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0171 | F_M_mes | FM | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0172 | F_M_mes | FM | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0173 | F_M_mes | FM | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0181 | Fe2+ | Fe | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0489 | Fe2+ | Fe | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0182 | Fer | Fe | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0192 | Germe_tt_22 | Germe_22 | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0193 | Germe_tt_37 | Germe_37 | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0197 | H2S | H2S | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0198 | H2S | H2S | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0201 | HCO | HCO3- | mesures_qualite_nappes | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0202 | HCO | HCO3- | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0203 | HCO3 | HCO3- | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0204 | HCO3 | HCO3- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0209 | HCT | HCO3- | mesures_qualite_barrages | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0210 | HCT | HCO3- | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0211 | HCT | HCO3- | types_mesures | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0225 | Huiles Graisses | HG | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0288 | Huiles Graisses (H G T) | HG | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0217 | IBD | IBD | mesures_qualite_barrages | Indice | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0218 | IBD | IBD | mesures_qualite_rivieres | Indice | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0219 | IBD | IBD | types_mesures | Indice | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0220 | IBGN | IBGN | mesures_qualite_barrages | Indice | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0221 | IBGN | IBGN | mesures_qualite_rivieres | Indice | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0222 | IBGN | IBGN | types_mesures | Indice | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0120 | IP | Phenol | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0265 | IP | Phenol | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0227 | IP(mgO2/l) | Phenol | suivi_qualite_brg_garde_hebdo | mgO2/l | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0232 | K+ | K | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0233 | K+ | K | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0234 | K+4 | K | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0239 | Li | Li | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0293 | Li | Li | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0243 | MD | MD | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0259 | MEST Filtr | MES | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0311 | Mercure | Hg | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0257 | Mg++ | Mg | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0258 | Mg++ | Mg | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0028 | Mn5 | Mn | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0273 | NA | Na | mesures_qualite_barrages | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0274 | NA | Na | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0275 | NA | Na | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0276 | NA | Na | types_mesures | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0110 | NH4+ | NH4+ | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0238 | NH4+ | NH4+ | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0286 | NH4+  Titri | NH4+ | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0287 | NH4+ 2 | NH4+ | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0115 | NH4+ Spect | NH4+ | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0289 | NH4+(mgNH4+/l) | NH4+ | suivi_qualite_brg_garde_hebdo | mgNH4+/l | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0048 | NO2- _Spectro. | NO2- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0310 | NO3-_Réduction Cd | NO3- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0364 | NO3-_Spectro | NO3- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0313 | NTK | NTK | suivi_qualite_sebou_jr | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0498 | NTK | NTK | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0314 | NTK Spectr | NTK | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0315 | NTK Titri | NTK | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0277 | Na+ | Na | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0278 | Na+ | Na | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0279 | Na+3 | Na | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0212 | Ni | Ni | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0291 | Ni | Ni | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0292 | Ni | Ni | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0346 | Nickel | Ni | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0294 | Nickel(mg)/l | Ni | suivi_qualite_brg_garde_hebdo | mg | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0295 | Nitrates | Nitrates | suivi_qualite_sebou_jr | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0316 | Numerotation_GT | Numerotation | mesures_qualite_nappes | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0317 | O2_diss | O2_dissous | mesures_qualite_barrages | mg O2/L | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0318 | O2_diss | O2_dissous | mesures_qualite_nappes | mg O2/L | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0319 | O2_diss | O2_dissous | mesures_qualite_rivieres | mg O2/L | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0320 | O2_diss | O2_dissous | types_mesures | mg O2/L | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0323 | O2_dissous | O2_dissous | suivi_qualite_sebou_jr | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0324 | O2dissous(mgd'O2/l) | O2_dissous | suivi_qualite_brg_garde_hebdo | mgd'O2/l | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0328 | OH- | OH- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0325 | Odeur | Odeur | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0359 | PO3 | PO4³- | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0121 | PO43- | PO4³- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0223 | PO43- | PO4³- | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0366 | PO43-(mgP/l) | PO4³- | suivi_qualite_brg_garde_hebdo | mgP/l | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0175 | PT | PT | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0285 | PT | PT | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0376 | PT  décant. 2h | PT | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0377 | PT DECANTE | PT | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0378 | PT(mgP/l) | PT | suivi_qualite_brg_garde_hebdo | mgP/l | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0174 | Pb | Pb | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0332 | Pb | Pb | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0333 | Pb | Pb | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0345 | Phenol | Phenol | suivi_qualite_sebou_jr | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0353 | Phosphore total | PT | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0351 | Ph�nol | Phenol | mesures_qualite_nappes | pH | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0352 | Ph�nol | Phenol | mesures_qualite_rivieres | pH | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0312 | Plomb | Pb | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0373 | Pseudo_aer | Pseudo_aer | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0389 | RS  mesuré | RS105 | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0390 | RS  mesuré_à 105 °C | RS105 | idp_2024_mesures_qualite_marche_cadre | °C | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0391 | RS105 | RS105 | mesures_qualite_barrages | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0392 | RS105 | RS105 | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0393 | RS105 | RS105 | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0394 | RS105 | RS105 | types_mesures | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0395 | RS185 | RS185 | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0396 | RS185 | RS185 | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0010 | SF | SF | idp_2024_mesures_qualite_globale | g/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0041 | SF | SF | idp_2024_mesures_qualite_marche_cadre | g/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0419 | SF | SF | mesures_qualite_barrages | g/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0420 | SF | SF | mesures_qualite_nappes | g/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0421 | SF | SF | mesures_qualite_rivieres | g/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0422 | SF | SF | types_mesures | g/L | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0429 | SO3 | SO3²- | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0434 | SO4-- | SO4²- | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0436 | SO42-_IC | SO4²- | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0409 | Saveur | Saveur | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0106 | Sb | Sb | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0411 | Sb | Sb | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0062 | Se | Se | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0413 | Se | Se | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0414 | Se | Se | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0266 | Sn | Sn | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0441 | Somme cations_meq/l | Som_cations | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0443 | Sr | Sr | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0331 | Sélénium | Se | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0466 | TA | TA | mesures_qualite_barrages | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0467 | TA | TA | mesures_qualite_nappes | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0468 | TA | TA | mesures_qualite_rivieres | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0469 | TA | TA | types_mesures | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0471 | TA/Tas_meq/l | TA | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0470 | TA/Tas_°F | TA | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0474 | TAC | TAC | mesures_qualite_barrages | mg/L CaCO₃ | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0475 | TAC | TAC | mesures_qualite_nappes | mg/L CaCO₃ | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0476 | TAC | TAC | mesures_qualite_rivieres | mg/L CaCO₃ | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0477 | TAC | TAC | types_mesures | mg/L CaCO₃ | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0512 | TAC/TACs_meq/l | TAC | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0510 | TAC/TACs_°F | TAC | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0481 | TAC_meq/l | TAC | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0480 | TAC_°F | TAC | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0473 | TA_meq/l | TA | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0472 | TA_°F | TA | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0483 | TH | TH | idp_2024_mesures_qualite_globale | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0484 | TH | TH | idp_2024_mesures_qualite_marche_cadre | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0485 | TH | TH | mesures_qualite_barrages | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0486 | TH | TH | mesures_qualite_nappes | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0487 | TH | TH | mesures_qualite_rivieres | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0488 | TH | TH | types_mesures | °F | MAPPED_EXACT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0455 | T_air | T_air | suivi_qualite_brg_garde_hebdo | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0456 | T_air | T_air | suivi_qualite_sebou_jr | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0482 | Temperature_Ambiante | T_air | mesures_qualite_nappes | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0418 | Tl | Tl | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0497 | Turbidité | Turbidite | suivi_qualite_sebou_jr | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0226 | V | V | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0504 | Vibrion_Cholerique | Vibrio | mesures_qualite_rivieres | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0412 | Zinc | Zn | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0284 | Zn | Zn | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0513 | Zn | Zn | mesures_qualite_nappes | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0514 | Zn | Zn | mesures_qualite_rivieres | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0043 | cap_equiv_hab | Cap_equiv | step_abhs | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0092 | cond_20_c | Cond | idp_2024_src_pollution_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0093 | cond_20_c | Cond | idp_2024_src_pollution_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0153 | dimension | Dimension | rejets_domestiques_abhs | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0154 | disqu_secchi | Disque_Secchi | idp_2024_src_pollution_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0155 | disqu_secchi | Disque_Secchi | idp_2024_src_pollution_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0162 | eau_ss_terr_niv_statique_m_sol | Eau_ss_terr | idp_2024_src_pollution_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0290 | indice de phénol M:A | Phenol | idp_2024_mesures_qualite_marche_cadre | Indice | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | NOT_EVALUATED | unités non alignées |
| MIG-0297 | niveau_eau_m_ngm | Niveau_eau | mesures_niv_eau_barrages | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0321 | o2_dissous | O2_dissous | idp_2024_src_pollution_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0322 | o2_dissous | O2_dissous | idp_2024_src_pollution_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0340 | pH | pH | suivi_qualite_brg_garde_hebdo | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0341 | pH | pH | suivi_qualite_sebou_jr | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0410 | pH au laboratoire | pH | idp_2024_mesures_qualite_marche_cadre | pH | MAPPED_BY_METIER_VARIANT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0329 | p_annuelle | P_annuelle | mesures_precipitations_jr_max | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0330 | p_max | P_max | mesures_precipitations_jr_max | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0335 | ph | pH | idp_2024_src_pollution_globale | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0336 | ph | pH | idp_2024_src_pollution_marche_cadre | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0337 | ph | pH | mesures_qualite_barrages | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0338 | ph | pH | mesures_qualite_nappes | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0339 | ph | pH | mesures_qualite_rivieres | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0342 | ph | pH | types_mesures | pH | MAPPED_EXACT | UNIT_UNKNOWN | NOT_EVALUATED | référence unité métier/ABH absente |
| MIG-0344 | phenol | Phenol | mesures_qualite_barrages | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0367 | precipitation_jr | Precip_jr | mesures_precipitations_jr | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0387 | quantite_t_j | Quantite_tj | decharges_abhs | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0437 | somme anions_meq/l | Som_anions | idp_2024_mesures_qualite_marche_cadre | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0438 | somme anions_meq/l3 | Som_anions | idp_2024_mesures_qualite_globale | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0450 | t_air | T_air | idp_2024_src_pollution_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0451 | t_air | T_air | idp_2024_src_pollution_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0458 | t_eau | T_eau | idp_2024_src_pollution_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0459 | t_eau | T_eau | idp_2024_src_pollution_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0491 | turbidite | Turbidite | idp_2024_src_pollution_globale | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0492 | turbidite | Turbidite | idp_2024_src_pollution_marche_cadre | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0499 | val_evaporation | Evaporation | mesures_evaporation_jr | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0500 | val_observees | Val_obs | mesures_precipitations_jr_traitees | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0501 | val_power_nasa | Val_power | mesures_precipitations_jr_traitees | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | NOT_EVALUATED | unité source absente |
| MIG-0502 | val_remplies | Val_remplies | mesures_precipitations_jr_traitees | à confirmer | MAPPED_EXACT | UNIT_MISSING | NOT_EVALUATED | unité source absente |

## À valider bibliographiquement

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0006 | Aluminium(mg/l) | Al | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0015 | Azote_Org | N_org | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0016 | Azote_Org | N_org | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0017 | Azote_Org | N_org | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0018 | Azote_Org | N_org | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0025 | Azote_Total | N_tot | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0026 | Azote_Total | N_tot | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0027 | Azote_Total | N_tot | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0019 | Azote_tot_kjeld | NTK | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0020 | Azote_tot_kjeld | NTK | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0021 | Azote_tot_kjeldhal | NTK | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0022 | Azote_tot_kjeldhal | NTK | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0023 | Azote_tot_kjeldhal | NTK | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0024 | Azote_tot_kjeldhal | NTK | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0031 | Beryllium(mg/l) | Be | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0075 | CN(mg/l) | CN- | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0080 | CO3 | CO3²- | idp_2024_mesures_qualite_globale | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0081 | CO3 | CO3²- | idp_2024_mesures_qualite_marche_cadre | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0082 | CO3 | CO3²- | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0083 | CO3 | CO3²- | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0084 | CO3 | CO3²- | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0085 | CO3 | CO3²- | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0035 | Ca | Ca | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0036 | Ca | Ca | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0037 | Ca | Ca | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0038 | Ca | Ca | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0057 | Chl.A(µg/l) | Chla | suivi_qualite_brg_garde_hebdo | µg/l | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0058 | Chla | Chla | mesures_qualite_barrages | µg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0059 | Chla | Chla | mesures_qualite_nappes | µg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0060 | Chla | Chla | mesures_qualite_rivieres | µg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0061 | Chla | Chla | types_mesures | µg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0063 | Chrome(mg/l) | Cr | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0088 | Cobalt(mg/l)) | Co | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0094 | Conductivite | Cond | mesures_qualite_barrages | µS/cm | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0095 | Conductivite | Cond | mesures_qualite_nappes | µS/cm | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0096 | Conductivite | Cond | mesures_qualite_rivieres | µS/cm | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0097 | Conductivite | Cond | types_mesures | µS/cm | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0099 | Conductivitéà20°C(µs/cm) | Cond | suivi_qualite_brg_garde_hebdo | µs/cm | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0119 | Cuivre(mg/l) | Cu | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0148 | Detergent | Detergent | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0149 | Detergent | Detergent | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0150 | Detergent | Detergent | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0151 | Detergent | Detergent | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0156 | Disque_secchi | Disque_Secchi | mesures_qualite_barrages | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0157 | Disque_secchi | Disque_Secchi | mesures_qualite_nappes | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0158 | Disque_secchi | Disque_Secchi | mesures_qualite_rivieres | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0159 | Disque_secchi | Disque_Secchi | types_mesures | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0163 | Eh | Eh | mesures_qualite_barrages | mV | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0164 | Eh | Eh | mesures_qualite_nappes | mV | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0165 | Eh | Eh | mesures_qualite_rivieres | mV | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0166 | Eh | Eh | types_mesures | mV | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0205 | HCO3- | HCO3- | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0206 | HCO3- | HCO3- | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0207 | HCO3- | HCO3- | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0208 | HCO3- | HCO3- | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0224 | Indicedephénol(mg/l) | Phenol | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0228 | K | K | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0229 | K | K | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0230 | K | K | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0231 | K | K | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0235 | Largeur | Largeur | mesures_qualite_barrages | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0236 | Largeur | Largeur | mesures_qualite_rivieres | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0237 | Largeur | Largeur | types_mesures | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0240 | Litium(mg/l) | Li | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0247 | MES | MES | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0248 | MES | MES | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0249 | MES | MES | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0250 | MES | MES | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0252 | MEST(mg/l) | MES | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0245 | Mercure(mg/l) | Hg | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0253 | Mg | Mg | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0254 | Mg | Mg | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0255 | Mg | Mg | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0256 | Mg | Mg | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0271 | Molybdène(mg/l) | Mo | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0280 | NH4 | NH4+ | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0281 | NH4 | NH4+ | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0282 | NH4 | NH4+ | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0283 | NH4 | NH4+ | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0326 | OH | OH- | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0327 | OH | OH- | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0360 | PO4 3- | PO4³- | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0361 | PO4 3- | PO4³- | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0362 | PO4 3- | PO4³- | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0363 | PO4 3- | PO4³- | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0379 | PTD | PTD | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0380 | PTD | PTD | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0381 | PTD | PTD | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0382 | PTD | PTD | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0383 | PTP | PTP | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0384 | PTP | PTP | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0385 | PTP | PTP | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0386 | PTP | PTP | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0348 | Pheopigment | Pheopigment | mesures_qualite_barrages | µg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0349 | Pheopigment | Pheopigment | mesures_qualite_rivieres | µg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0350 | Pheopigment | Pheopigment | types_mesures | µg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0354 | Phosphore_Total | PT | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0355 | Phosphore_Total | PT | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0356 | Phosphore_Total | PT | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0347 | Phénol | Phenol | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0369 | Profondeur | Profondeur | mesures_qualite_barrages | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0370 | Profondeur | Profondeur | mesures_qualite_nappes | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0371 | Profondeur | Profondeur | mesures_qualite_rivieres | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0372 | Profondeur | Profondeur | types_mesures | m | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0397 | S | S²- | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0398 | S | S²- | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0399 | S | S²- | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0400 | S | S²- | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0401 | S2 | S²- | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0402 | S2 | S²- | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0403 | S2 | S²- | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0404 | S2 | S²- | types_mesures | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0423 | SiO2(mg/l) | SiO2 | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0424 | SiO3 | SiO3 | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0425 | SiO3 | SiO3 | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0426 | SiO3 | SiO3 | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0427 | SiO3 | SiO3 | types_mesures | mg/L | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0442 | Somme cations_mg/l | Som_cations | idp_2024_mesures_qualite_marche_cadre | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0416 | Sélénium(mg/l) | Se | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0452 | T_Air | T_air | mesures_qualite_barrages | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0453 | T_Air | T_air | mesures_qualite_nappes | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0454 | T_Air | T_air | mesures_qualite_rivieres | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0457 | T_Air | T_air | types_mesures | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0460 | T_eau | T_eau | mesures_qualite_barrages | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0461 | T_eau | T_eau | mesures_qualite_nappes | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0462 | T_eau | T_eau | mesures_qualite_rivieres | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0463 | T_eau | T_eau | suivi_qualite_brg_garde_hebdo | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0464 | T_eau | T_eau | suivi_qualite_sebou_jr | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0465 | T_eau | T_eau | types_mesures | °C | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0493 | Turbidite | Turbidite | mesures_qualite_barrages | NTU | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0494 | Turbidite | Turbidite | mesures_qualite_nappes | NTU | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0495 | Turbidite | Turbidite | mesures_qualite_rivieres | NTU | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0496 | Turbidite | Turbidite | types_mesures | NTU | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0503 | Vanadium(mg/l) | V | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0511 | Zinc(mg/l) | Zn | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0009 | apports_mm3 | Apports_hm3 | mesures_niv_eau_barrages | Mm3 | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0200 | hauteur_m | Hauteur | bathymetries_barrages_abhs | m | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0241 | longueur_km | Longueur | reseau_hydro_abhs | km | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0388 | restitutions_mm3 | Restitution | mesures_niv_eau_barrages | Mm3 | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0405 | sat | sat | mesures_qualite_barrages | % | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0406 | sat | sat | mesures_qualite_nappes | % | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0407 | sat | sat | mesures_qualite_rivieres | % | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0408 | sat | sat | types_mesures | % | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0439 | somme anions_mg/l | Som_anions | idp_2024_mesures_qualite_marche_cadre | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0440 | somme anions_mg/l4 | Som_anions | idp_2024_mesures_qualite_globale | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0444 | sup_occupee_ha | Superficie_ha | decharges_abhs | ha | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0445 | sup_tot_ha | Superficie_ha | decharges_abhs | ha | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0446 | superficie_ha | Superficie_ha | step_abhs | ha | MAPPED_EXACT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0449 | surface_km2 | Superficie_km2 | bathymetries_barrages_abhs | km2 | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0490 | transfert_mm3 | Transfert | mesures_niv_eau_barrages | Mm3 | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0505 | vol_eaux_us_trait_m3_an | Vol_trait | step_abhs | m3/an | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0507 | volume_mm3 | Volume | bathymetries_barrages_abhs | Mm3 | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |
| MIG-0508 | volume_mm3 | Volume | mesures_niv_eau_barrages | Mm3 | MAPPED_BY_METIER_VARIANT | UNIT_OK | NO_REFERENCE | confirmer une plage de référence ou accepter sans seuil externe |

## Ambigus

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0141 | Debit | Debit_m / Debit_jr | mesures_qualite_barrages | m³/s | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0142 | Debit | Debit_m / Debit_jr | mesures_qualite_nappes | m³/s | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0143 | Debit | Debit_m / Debit_jr | mesures_qualite_rivieres | m³/s | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0144 | Debit | Debit_m / Debit_jr | types_mesures | m³/s | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0194 | H_G | HG / Hg | mesures_qualite_nappes | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0195 | H_G | HG / Hg | mesures_qualite_rivieres | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0196 | H_G | HG / Hg | suivi_qualite_sebou_jr | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0213 | Hg | HG / Hg | mesures_qualite_nappes | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0214 | Hg | HG / Hg | mesures_qualite_rivieres | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0215 | Hg | HG / Hg | idp_2024_mesures_qualite_globale | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0267 | MO | MO / Mo | mesures_qualite_barrages | mg/L | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0268 | MO | MO / Mo | mesures_qualite_nappes | mg/L | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0269 | MO | MO / Mo | mesures_qualite_rivieres | mg/L | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0270 | MO | MO / Mo | types_mesures | mg/L | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0118 | Mo | MO / Mo | idp_2024_mesures_qualite_globale | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0140 | debit | Debit_m / Debit_jr | mesures_debit_sources | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0145 | debit_jr | Debit_m / Debit_jr | mesures_debit_jr | à confirmer | AMBIGUOUS | UNIT_MISSING | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0146 | debit_l_s | Debit_m / Debit_jr | rejets_domestiques_abhs | L/s | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |
| MIG-0147 | debit_m | Debit_m / Debit_jr | mesures_debit_m | m | AMBIGUOUS | UNIT_UNKNOWN | NOT_EVALUATED | arbitrage métier sur le standard cible |

## Non mappés

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0034 | Bore(mg/l) |  | suivi_qualite_brg_garde_hebdo | mg/l | UNMAPPED | UNIT_UNKNOWN | NOT_EVALUATED | créer ou valider le mapping métier |
| MIG-0090 | Cond 25°C *0,9*0,01 |  | idp_2024_mesures_qualite_marche_cadre | °C | UNMAPPED | UNIT_UNKNOWN | NOT_EVALUATED | créer ou valider le mapping métier |
| MIG-0091 | Cond 25°C *1,1*0,01 |  | idp_2024_mesures_qualite_marche_cadre | °C | UNMAPPED | UNIT_UNKNOWN | NOT_EVALUATED | créer ou valider le mapping métier |

## Quarantaine avant migration

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0050 | CF | CF | mesures_qualite_barrages | UFC/100mL | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0051 | CF | CF | mesures_qualite_nappes | UFC/100mL | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0052 | CF | CF | mesures_qualite_rivieres | UFC/100mL | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0054 | CF(UFC/100mL) | CF | suivi_qualite_brg_garde_hebdo | UFC/100mL | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0064 | Cl | Cl- | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0065 | Cl | Cl- | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0066 | Cl | Cl- | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0069 | Cl-(mg/l) | Cl- | suivi_qualite_brg_garde_hebdo | mg/l | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0176 | Fe | Fe | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0177 | Fe | Fe | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0178 | Fe | Fe | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0186 | FeT | Fe | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0187 | FeT | Fe | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0261 | Mn | Mn | mesures_qualite_barrages | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0262 | Mn | Mn | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0263 | Mn | Mn | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0300 | NO2- | NO2- | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0301 | NO2- | NO2- | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0306 | NO3- | NO3- | mesures_qualite_nappes | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0307 | NO3- | NO3- | mesures_qualite_rivieres | mg/L | MAPPED_EXACT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0430 | SO4 | SO4²- | mesures_qualite_barrages | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0431 | SO4 | SO4²- | mesures_qualite_nappes | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |
| MIG-0432 | SO4 | SO4²- | mesures_qualite_rivieres | mg/L | MAPPED_BY_METIER_VARIANT | UNIT_OK | SUSPECT_OUTLIER | mettre en quarantaine |

## À exclure du périmètre migration

| id_decision | parametre_observe | nom_standard_metier | source_table | unite_source | statut_mapping | statut_unite | statut_valeur | action_recommandee |
|---|---|---|---|---|---|---|---|---|
| MIG-0008 | apports_hm | Apports_hm3 | barrages_abhs | à confirmer | MAPPED_BY_METIER_VARIANT | UNIT_MISSING | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0161 | dist_pt_eau_foyer_pollut_m | Dist_foyer | points_eau_abhs | m | MAPPED_BY_METIER_VARIANT | UNIT_OK | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0199 | hauteur | Hauteur | barrages_abhs | à confirmer | MAPPED_EXACT | UNIT_MISSING | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0272 | montant_md | Montant_MD | barrages_abhs | à confirmer | MAPPED_EXACT | UNIT_MISSING | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0296 | niv_piezometrique_m | Niveau_piezom | points_eau_abhs | m | MAPPED_BY_METIER_VARIANT | UNIT_OK | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0334 | perimetre | Perimetre | bassin_sebou | à confirmer | MAPPED_EXACT | UNIT_MISSING | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0368 | profond_tot_m | Profondeur | points_eau_abhs | m | MAPPED_BY_METIER_VARIANT | UNIT_OK | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0447 | superficie_km2 | Superficie_km2 | bassin_sebou | km2 | MAPPED_EXACT | UNIT_OK | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0448 | superficie_km2 | Superficie_km2 | nappes_abhs | km2 | MAPPED_EXACT | UNIT_OK | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0506 | vol_preleve_m3_an | Vol_preleve | points_eau_abhs | m3/an | MAPPED_BY_METIER_VARIANT | UNIT_OK | HORS_PERIMETRE | hors périmètre migration des mesures |
| MIG-0509 | vrn_hm3 | Volume | barrages_abhs | Hm3 | MAPPED_BY_METIER_VARIANT | UNIT_CONFLICT | HORS_PERIMETRE | hors périmètre migration des mesures |
