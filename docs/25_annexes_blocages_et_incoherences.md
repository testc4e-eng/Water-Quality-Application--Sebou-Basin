# 📋 ANNEXE TECHNIQUE EXHAUSTIVE : INHÉRENCES ET BLOCAGES DATA

> **Document N°25 - Version Finale Audit Technique**
> Mise à jour : 2026-04-17 13:59:05
> Mode : READ-ONLY / NORMALISATION ET CONTEXTE ACTIVÉS

## 🏛️ SYNTHÈSES DE L'AUDIT

### A. Synthèse par Domaine
| DOMAIN | TOTAL_ANOMALIES |
| --- | --- |
| METEO | 56010 |
| QUALITE | 142574 |
| IDP | 11149 |
| HYDRO | 21247 |
| INFRA | 12 |

### B. Synthèse par Type d'Anomalie
| TYPE_ANOMALIE | TOTAL_VOLUME |
| --- | --- |
| ALIAS_UNMAPPED | 136793 |
| NULL_VALUE | 71582 |
| FORMAT_ERROR | 19316 |
| NEGATIVE_VALUE | 1933 |
| NON_NUMERIC | 1361 |
| EMPTY_STRING | 7 |

### C. Synthèse par Table
| TABLE_SOURCE | TOTAL_VOLUME |
| --- | --- |
| mesures_qualite_nappes | 63089 |
| mesures_qualite_rivieres | 60098 |
| mesures_precipitations_jr_traitees | 45702 |
| mesures_debit_m | 19316 |
| mesures_idp_2024_qualite_globale | 11149 |
| mesures_suivi_qualite_brg_garde_hebdo | 10673 |
| mesures_evaporation_jr | 10308 |
| mesures_qualite_barrages | 8714 |
| mesures_debit_jr | 1931 |
| infra_stations_abhs | 11 |
| infra_barrages_abhs | 1 |

## 🚨 TOP 20 DES ANOMALIES CRITIQUES
| TABLE_SOURCE | COLUMN_SOURCE | TYPE_ANOMALIE | VOLUME_IMPACTED | EXAMPLE_VALUE | EXAMPLE_CONTEXT |
| --- | --- | --- | --- | --- | --- |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2659 | Conductivite | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2658 | T_eau | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2651 | ph | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2643 | CF | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2640 | SF | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2637 | NA | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2637 | K | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2636 | HCO3- | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2632 | NO3- | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2625 | MO | date_prelevement=1990-09-21 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2624 | Cl | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2619 | Mg | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2618 | SO4 | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2617 | T_Air | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2609 | NO2- | date_prelevement=1991-01-24 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2590 | NH4 | date_prelevement=1990-09-20 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2560 | CT | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2552 | CO3 | date_prelevement=1991-03-27 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2550 | Ca | date_prelevement=1988-10-03 \| ire_station=100/23 |
| mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2203 | RS105 | date_prelevement=1991-03-22 \| ire_station=100/23 |

## 📄 LISTE EXHAUSTIVE DES ANOMALIES TECHNIQUES (BRUTE)
| DOMAIN | TABLE_SOURCE | COLUMN_SOURCE | TYPE_ANOMALIE | VOLUME_IMPACTED | PERCENT_OF_COLUMN | EXAMPLE_VALUE | EXAMPLE_CONTEXT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| METEO | mesures_precipitations_jr_traitees | val_observees | NULL_VALUE | 45702 | 8.370222359786595 | NULL | date_jr=1985-09-03 \| ire_station=1000/23 |
| METEO | mesures_evaporation_jr | val_evaporation | NULL_VALUE | 10308 | 21.079754601226995 | NULL | date_mesure=2013-07-06 \| ire_station=1699/9 |
| QUALITE | mesures_suivi_qualite_brg_garde_hebdo | ire_station | NULL_VALUE | 7094 | 100.0 | NULL | date_prelevement=2023-01-03 \| parametre_qualite=Aluminium(mg/l) |
| IDP | mesures_idp_2024_qualite_globale | ire | NULL_VALUE | 4894 | 100.0 | NULL | pts_prelevement= REJET R10 (R10: KNH-DOM-R1) |
| QUALITE | mesures_suivi_qualite_brg_garde_hebdo | val_qual_brg_garde_hebdo | NULL_VALUE | 3579 | 50.45108542430222 | NULL | date_prelevement=2023-01-03 \| ire_station=None \| parametre_qualite=Aluminium(mg/l) |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2659 | 4.2147476540705044 | Conductivite | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2658 | 4.213162566573675 | T_eau | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2651 | 4.202066954095867 | ph | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2643 | 4.189386254121227 | CF | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2640 | 4.184630991630738 | SF | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2637 | 4.179875729140249 | NA | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2637 | 4.179875729140249 | K | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2636 | 4.178290641643419 | HCO3- | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2632 | 4.171950291656099 | NO3- | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2625 | 4.160854679178291 | MO | date_prelevement=1990-09-21 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2624 | 4.159269591681461 | Cl | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2619 | 4.151344154197312 | Mg | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2618 | 4.149759066700482 | SO4 | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2617 | 4.148173979203652 | T_Air | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2609 | 4.1354932792290136 | NO2- | date_prelevement=1991-01-24 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2590 | 4.105376616789247 | NH4 | date_prelevement=1990-09-20 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2560 | 4.0578239918843515 | CT | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2552 | 4.045143291909714 | CO3 | date_prelevement=1991-03-27 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2550 | 4.041973116916054 | Ca | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2203 | 3.4919477555161045 | RS105 | date_prelevement=1991-03-22 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2199 | 3.485607405528785 | Mn | date_prelevement=1991-03-22 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2027 | 3.212972356074055 | TAC | date_prelevement=1990-09-21 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2027 | 3.212972356074055 | TA | date_prelevement=1990-09-21 \| ire_station=100/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1995 | 3.3196332595637057 | T_eau | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1995 | 3.3196332595637057 | T_Air | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1994 | 3.3179692829924954 | ph | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1992 | 3.3146413298500756 | Conductivite | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1972 | 3.2813617984258783 | Phosphore total | date_prelevement=1988-09-22 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1971 | 3.2796978218546684 | O2_diss | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1961 | 3.2630580561425697 | DBO5 | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1961 | 3.2630580561425697 | MES | date_prelevement=1988-09-22 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1953 | 3.2497462435728903 | CF | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1953 | 3.2497462435728903 | NH4 | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1932 | 3.214802735577483 | DCO | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1930 | 3.2114747824350633 | NO3- | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| HYDRO | mesures_debit_jr | debit_jr | NEGATIVE_VALUE | 1921 | 0.3684078299608962 | -1.0 | date_jr=1962-12-26 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1891 | 3.146579696157878 | PO4 3- | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1889 | 3.1432517430154587 | Cl | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1879 | 3.1266119773033596 | SF | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1822 | 3.0317653127443966 | Turbidite | date_prelevement=1988-10-06 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1799 | 2.9934938516065697 | HCO3- | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1791 | 2.9801820390368903 | NO2- | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1790 | 2.9785180624656804 | NA | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1789 | 2.9768540858944705 | K | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1788 | 2.9751901093232607 | SO4 | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1783 | 2.9668702264672113 | Mg | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1756 | 2.921942859044545 | CT | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1741 | 2.8969832104763964 | Ca | date_prelevement=1989-03-23 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1715 | 2.85371981962494 | CO3 | date_prelevement=1991-12-26 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1615 | 8.36094429488507 | Août | annee=1950 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1615 | 8.36094429488507 | Avril | annee=1939 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1614 | 8.355767239594119 | Mars | annee=1939 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1614 | 8.355767239594119 | Juin | annee=1950 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1612 | 8.345413129012218 | Juillet | annee=1950 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1612 | 8.345413129012218 | Mai | annee=1950 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1611 | 8.340236073721268 | Février | annee=1935 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1609 | 8.329881963139368 | Janvier | annee=1950 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1608 | 2.5488206949023584 | TH | date_prelevement=1991-03-27 \| ire_station=100/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1605 | 8.309173741975565 | Septembre | annee=1949 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1603 | 8.298819631393663 | Novembre | annee=1949 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1603 | 8.298819631393663 | Octobre | annee=1949 \| ire_station=1000/23 |
| HYDRO | mesures_debit_m | mois | FORMAT_ERROR | 1603 | 8.298819631393663 | Décembre | annee=1949 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1580 | 2.629082982511606 | Azote_tot_kjeldhal | date_prelevement=1988-09-22 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1560 | 2.472736495054527 | FeT | date_prelevement=1999-06-23 \| ire_station=100/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1103 | 1.8353661580444947 | TAC | date_prelevement=1994-05-24 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1100 | 1.8303742283308653 | TA | date_prelevement=1994-05-24 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1074 | 1.7871108374794082 | sat | date_prelevement=1988-09-20 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 806 | 1.341165116395161 | TH | date_prelevement=1992-03-16 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 689 | 1.0921252853157493 | Fe | date_prelevement=1991-03-22 \| ire_station=100/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 682 | 1.1348320215651364 | Ph�nol | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 633 | 7.264172595822814 | O2_diss | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 596 | 6.839568510442966 | NO3- | date_prelevement=1990-01-30 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 591 | 6.7821895799862295 | Phosphore_Total | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 490 | 0.8153485198928399 | HCT | date_prelevement=1994-05-17 \| ire_station=1217/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 436 | 0.7254937850475066 | Pb | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 434 | 0.7221658319050868 | Se | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 427 | 8.724969350224764 | <0,010 | date_jr_prelevement=2024-09-13 \| pts_prelevement=ACH_PDS_R1 \| parametre_qualite=Ag |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 420 | 4.819830158365848 | T_eau | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 420 | 4.819830158365848 | ph | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 420 | 4.819830158365848 | T_Air | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 420 | 4.819830158365848 | Conductivite | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 417 | 0.6938782301945189 | FeT | date_prelevement=1994-07-06 \| ire_station=1217/9 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 417 | 4.7854028000918065 | Chla | date_prelevement=1990-08-17 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 414 | 4.750975441817765 | MES | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 389 | 0.6472868862006422 | CrT | date_prelevement=1990-01-31 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 389 | 4.4640807895340835 | PO4 3- | date_prelevement=1990-08-17 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 387 | 4.4411292173513885 | SO4 | date_prelevement=1992-06-05 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 358 | 0.5957036124931361 | Azote_Total | date_prelevement=2002-07-28 \| ire_station=1217/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 300 | 0.4991929713629632 | Fe | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 290 | 3.327977966490705 | Mn | date_prelevement=1991-11-22 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 279 | 3.201744319485885 | Disque_secchi | date_prelevement=1990-08-17 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 274 | 0.4559295805115064 | Cd | date_prelevement=1990-02-07 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 272 | 0.45260162736908666 | Cu | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 269 | 0.44760969765545705 | Ni | date_prelevement=1990-08-01 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 240 | 0.3993543770903706 | As | date_prelevement=1993-03-09 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 233 | 0.38770654109190145 | Zn | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 232 | 2.6623823731925635 | NH4 | date_prelevement=1990-01-30 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 227 | 0.3777226816646422 | Hg | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 207 | 0.32811311184377373 | O2_diss | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 206 | 0.32652802434694395 | Azote_tot_kjeldhal | date_prelevement=1988-10-19 \| ire_station=100/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 191 | 0.3178195251010866 | Largeur | date_prelevement=1994-07-06 \| ire_station=1217/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 189 | 0.31449157195866684 | Detergent | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 189 | 3.861871679607683 | NO3- | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 189 | 3.861871679607683 | Mg++ | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 189 | 3.861871679607683 | NO2- | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 189 | 3.861871679607683 | Ca++ | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 189 | 3.861871679607683 | SO4-- | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 189 | 3.861871679607683 | Cl- | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 189 | 3.861871679607683 | TH | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 188 | 3.8414384961176955 | NH4+  | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 186 | 2.1344962129905896 | Fe | date_prelevement=1991-11-22 \| ire_station=1255/22 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 184 | 3.759705762157744 | CF | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EP (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 184 | 3.759705762157744 | CT | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EP (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 184 | 3.759705762157744 | SF | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EP (R10: KNH-DOM-R1) |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 180 | 0.29951578281777796 | Chla | date_prelevement=1988-10-06 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 179 | 0.2837306619325387 | DCO | date_prelevement=1988-10-19 \| ire_station=100/23 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 172 | 3.5145075602778917 | K+ | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 172 | 3.5145075602778917 | Na+ | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 172 | 3.5145075602778917 | DCO | date_jr_prelevement=2024-09-12 \| pts_prelevement= REJET R10 (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 163 | 3.330608908868002 | NTK | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 163 | 3.330608908868002 | DBO5 | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 163 | 3.330608908868002 | MES | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 163 | 3.330608908868002 | PO43- | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 163 | 3.330608908868002 | PT | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 162 | 0.2695642045360001 | Debit | date_prelevement=1988-09-22 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 153 | 0.25458841539511123 | H_G | date_prelevement=1991-09-13 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 153 | 1.7557952719761305 | Cl | date_prelevement=1990-01-30 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 150 | 0.2495964856814816 | SiO3 | date_prelevement=1993-03-09 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 147 | 1.686940555428047 | Azote_tot_kjeldhal | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 143 | 1.641037411062658 | Turbidite | date_prelevement=1990-08-17 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 139 | 1.595134266697269 | CF | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 138 | 1.5836584806059217 | DBO5 | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 137 | 1.5721826945145745 | DCO | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 136 | 0.22630081368454333 | Mn | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 135 | 1.5492311223318798 | CT | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 134 | 1.5377553362405325 | NO2- | date_prelevement=1991-11-22 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 134 | 1.5377553362405325 | SF | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 130 | 1.4918521918751435 | Mg | date_prelevement=1992-06-05 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 129 | 1.4803764057837963 | K | date_prelevement=1992-06-05 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 128 | 0.2129890011148643 | IBD | date_prelevement=2003-05-27 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 128 | 1.468900619692449 | HCO3- | date_prelevement=1992-06-05 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 128 | 1.468900619692449 | NA | date_prelevement=1992-06-05 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 128 | 1.468900619692449 | sat | date_prelevement=1988-10-14 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 126 | 1.4459490475097545 | Ca | date_prelevement=1992-06-05 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 124 | 0.20633309483002477 | CN | date_prelevement=1990-02-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 120 | 1.3770943309616708 | CO3 | date_prelevement=1992-06-05 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 110 | 0.18303742283308652 | Co | date_prelevement=1994-07-06 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 108 | 0.17970946969066676 | Profondeur | date_prelevement=1994-07-06 \| ire_station=1236/14 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 106 | 2.1659174499387004 | <0,005 | date_jr_prelevement=2024-09-13 \| pts_prelevement=AVAL VILLAGE AIT SIBERNE \| parametre_qualite=As |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 97 | 1.9820187985288107 | Fe | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 94 | 1.078723892586642 | FeT | date_prelevement=2002-02-18 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 87 | 0.14476596169525935 | Disque_secchi | date_prelevement=1989-03-23 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 86 | 0.14310198512404945 | Eh | date_prelevement=1990-02-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 73 | 0.11571138726857721 | PTP | date_prelevement=2008-12-18 \| ire_station=1026/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 73 | 0.11571138726857721 | PTD | date_prelevement=2008-12-18 \| ire_station=1026/14 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 73 | 1.491622394769105 | Mn | date_jr_prelevement=2024-09-13 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 72 | 1.4711892112791174 | Phénol | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 72 | 1.4711892112791174 | Huiles
Graisses | date_jr_prelevement=2024-09-13 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 71 | 0.8147808124856554 | TAC | date_prelevement=1994-05-30 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 70 | 0.8033050263943081 | TA | date_prelevement=1994-05-30 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 57 | 0.09484666455896301 | DCO_dec2h | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 56 | 0.09318268798775314 | F | date_prelevement=1993-03-09 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 54 | 0.08985473484533338 | Cr | date_prelevement=1988-10-05 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 54 | 0.08985473484533338 | Al | date_prelevement=1991-08-19 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 50 | 0.5737893045673629 | TH | date_prelevement=1993-04-15 \| ire_station=1255/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 48 | 0.07987087541807411 | PTP | date_prelevement=2009-03-12 \| ire_station=1217/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 48 | 0.07987087541807411 | PTD | date_prelevement=2009-03-12 \| ire_station=1217/9 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Se | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | As | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Pb | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Ba | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Cd | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Cu | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | CrT | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Al | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Sb | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Co | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Mo | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Ag | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 46 | 0.939926440539436 | Ni | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 45 | 0.9194932570494483 | Be | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 43 | 0.07155099256202473 | IBGN | date_prelevement=2009-03-12 \| ire_station=1217/9 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 42 | 0.858193706579485 | Sn | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 42 | 0.858193706579485 | V | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 42 | 0.858193706579485 | Zn | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 41 | 0.8377605230894973 | <0,050 | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) \| parametre_qualite=Fe |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 40 | 0.06340349987319299 | PO4 3- | date_prelevement=1990-09-20 \| ire_station=100/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 39 | 0.06489508627718521 | RS105 | date_prelevement=1990-01-24 \| ire_station=1000/23 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 39 | 0.06181841237636317 | Phosphore_Total | date_prelevement=1988-10-19 \| ire_station=100/23 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 37 | 0.42460408537984856 | SiO3 | date_prelevement=1991-11-22 \| ire_station=1709/9 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 37 | 0.42460408537984856 | Pheopigment | date_prelevement=1995-06-02 \| ire_station=1709/9 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 34 | 0.6947282386595832 | Li | date_jr_prelevement=2024-09-18 \| pts_prelevement=AVAL AIN KARMA |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 33 | 0.6742950551695954 | <0,0067 | date_jr_prelevement=2025-10-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) \| parametre_qualite=Ag |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 32 | 0.6538618716796076 | TAC_meq/l | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 32 | 0.6538618716796076 | TAC_°F | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 32 | 0.6538618716796076 | CO3 | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 32 | 0.6538618716796076 | TA_meq/l | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 32 | 0.6538618716796076 | HCO3 | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 32 | 0.6538618716796076 | TA_°F | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 31 | 0.04913771240172458 | Turbidite | date_prelevement=1990-09-20 \| ire_station=1161/15 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 31 | 0.63342868818962 | <0,001 | date_jr_prelevement=2025-10-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) \| parametre_qualite=Cd |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 31 | 0.63342868818962 | Hg | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 29 | 0.5925623212096445 | <0,020 | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) \| parametre_qualite=Li |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 28 | 0.5721291377196567 | Bilan_Ionique | date_jr_prelevement=2024-09-20 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 28 | 0.5721291377196567 | somme
anions_meq/l3 | date_jr_prelevement=2024-09-20 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 28 | 0.5721291377196567 | somme
anions_mg/l4 | date_jr_prelevement=2024-09-20 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 26 | 0.043263390851456814 | MO | date_prelevement=1990-08-15 \| ire_station=1217/9 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 25 | 0.03962718742074563 | MES | date_prelevement=1988-10-19 \| ire_station=100/23 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 25 | 0.5108295872496935 | <0,00025 | date_jr_prelevement=2024-09-13 \| pts_prelevement=ALH_PDOM1_R4 (E.M) \| parametre_qualite=Hg |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 25 | 0.5108295872496935 | IP | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 24 | 0.039935437709037055 | DBO5_dec2h | date_prelevement=1990-01-31 \| ire_station=1000/23 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 24 | 0.4903964037597058 | RS 
mesuré | date_jr_prelevement=2024-09-18 \| pts_prelevement=ALH_PDOM1_PE1 (LAHCEN BIZIZI) |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 23 | 0.469963220269718 | <0,02 | date_jr_prelevement=2024-09-13 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=PO43- |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 22 | 0.4495300367797303 | <0,300 | date_jr_prelevement=2024-09-16 \| pts_prelevement=AID_DOM1_R4 (AIN DFALI) \| parametre_qualite=NO3- |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 18 | 0.02995157828177779 | Ba | date_prelevement=1996-02-13 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 18 | 0.02853157494293685 | sat | date_prelevement=1988-10-03 \| ire_station=100/23 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 17 | 0.028287601710567916 | Pheopigment | date_prelevement=1995-02-09 \| ire_station=2244/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 16 | 0.026623625139358037 | Li | date_prelevement=1994-07-06 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 16 | 0.025361399949277198 | S2 | date_prelevement=2013-08-28 \| ire_station=102/15 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 15 | 0.17213679137020885 | PTP | date_prelevement=1995-06-02 \| ire_station=1709/9 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 15 | 0.17213679137020885 | PTD | date_prelevement=1995-06-02 \| ire_station=1709/9 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 14 | 0.28606456885982834 | <0,01 | date_jr_prelevement=2024-09-18 \| pts_prelevement=AVAL AIN KARMA \| parametre_qualite=Phénol |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 14 | 0.28606456885982834 | <0.01 | date_jr_prelevement=2024-09-13 \| pts_prelevement=MBK_DOM_R4 \| parametre_qualite=Phénol |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 14 | 0.28606456885982834 | <0,45 | date_jr_prelevement=2025-10-17 \| pts_prelevement=ACH_PDE(PUITS CARRIERE) \| parametre_qualite=IP |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 14 | 0.28606456885982834 | Tl | date_jr_prelevement=2025-10-13 \| pts_prelevement=AVAL AIN KARMA |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 13 | 0.14918521918751435 | IBD | date_prelevement=2003-06-03 \| ire_station=1710/9 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 13 | 0.14918521918751435 | Profondeur | date_prelevement=1991-11-22 \| ire_station=1709/9 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 13 | 0.2656313853698406 | <0,0005 | date_jr_prelevement=2024-09-13 \| pts_prelevement=AVAL VILLAGE AIT SIBERNE \| parametre_qualite=Cd |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 11 | 0.12623364700481982 | Azote_Total | date_prelevement=2013-09-16 \| ire_station=3546/8 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 11 | 0.22476501838986515 | <14,1 | date_jr_prelevement=2024-09-12 \| pts_prelevement= REJET R10 (R10: KNH-DOM-R1) \| parametre_qualite=DCO |
| HYDRO | mesures_debit_jr | debit_jr | NEGATIVE_VALUE | 10 | 0.0019177919310822292 | -2.0 | date_jr=1972-01-17 \| ire_station=585/22 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 10 | 0.015850874968298248 | DBO5 | date_prelevement=1988-10-19 \| ire_station=100/23 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 10 | 0.2043318348998774 | <0,377 | date_jr_prelevement=2024-09-19 \| pts_prelevement=Amont STEP Taounate \| parametre_qualite=Huiles
Graisses |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 10 | 0.2043318348998774 | <0,05 | date_jr_prelevement=2024-09-13 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=PT |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 9 | 0.014975789140888896 | Ag | date_prelevement=1994-07-06 \| ire_station=1236/14 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 9 | 0.18389865140988967 | <0.377 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R3 EM  (R3: SHZ-DOM1-R1) \| parametre_qualite=Huiles
Graisses |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 8 | 0.09180628873077806 | Debit | date_prelevement=1988-10-14 \| ire_station=3264/15 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 8 | 0.1634654679199019 | 1,1X106 | date_jr_prelevement=2024-09-22 \| pts_prelevement=AKA_PDOM1_R1 \| parametre_qualite=SF |
| INFRA | infra_stations_abhs | nom_station | EMPTY_STRING | 7 | 1.7948717948717947 |   | ire_station=1253/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 7 | 0.011647835998469143 | F_M_mes | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 7 | 0.011095612477808775 | RS185 | date_prelevement=1996-10-25 \| ire_station=1294/8 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 7 | 0.011095612477808775 | Chla | date_prelevement=1990-09-20 \| ire_station=1182/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 6 | 0.00951052498097895 | Pb | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 6 | 0.06885471654808355 | Eh | date_prelevement=1990-08-17 \| ire_station=3264/15 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 6 | 0.06885471654808355 | MO | date_prelevement=1994-11-03 \| ire_station=1255/22 |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 6 | 0.12259910093992644 | Fe2+ | date_jr_prelevement=2024-09-21 \| pts_prelevement=ARB_DECH1_PE1 (AIN LABROUAL) |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.007925437484149124 | Se | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.007925437484149124 | Ph�nol | date_prelevement=1990-09-21 \| ire_station=160/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.007925437484149124 | Zn | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.007925437484149124 | Cd | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.007925437484149124 | Cu | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.007925437484149124 | F | date_prelevement=1993-08-10 \| ire_station=1095/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.007925437484149124 | Debit | date_prelevement=1988-10-19 \| ire_station=1182/14 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.05737893045673629 | Largeur | date_prelevement=2003-06-06 \| ire_station=1710/9 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 5 | 0.1021659174499387 | <8,10 | date_jr_prelevement=2024-09-21 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=DCO |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 5 | 0.1021659174499387 | 1,6X106 | date_jr_prelevement=2024-09-22 \| pts_prelevement=Amont STEP Khémisset  \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 5 | 0.1021659174499387 | 2,7X107 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AMONT SOUK ELAHAD CHEBANATE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 5 | 0.1021659174499387 | 1,5X106 | date_jr_prelevement=2024-09-22 \| pts_prelevement=AVAL STEP OUED AMLIL \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 5 | 0.1021659174499387 | Sr | date_jr_prelevement=2025-10-23 \| pts_prelevement=AVAL REJET MOULAY YAACOUB |
| INFRA | infra_stations_abhs | nom_station | NULL_VALUE | 4 | 1.0256410256410255 | NULL | ire_station=1225/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 4 | 0.006655906284839509 | Germe_tt_22 | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 4 | 0.006655906284839509 | S | date_prelevement=1990-02-14 \| ire_station=1236/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 4 | 0.0063403499873192996 | Al | date_prelevement=1991-03-27 \| ire_station=1197/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 4 | 0.0063403499873192996 | S | date_prelevement=1990-09-21 \| ire_station=2881/15 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 4 | 0.08173273395995095 | 3,5x103 | date_jr_prelevement=2024-09-14 \| pts_prelevement=PA SIDI MOKHFI \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 4 | 0.08173273395995095 | 1,5 x 106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=AKA_DOM_R1 \| parametre_qualite=CF |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004991929713629632 | SO3 | date_prelevement=1990-02-14 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004991929713629632 | FM | date_prelevement=1994-09-21 \| ire_station=2263/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004991929713629632 | Sb | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004755262490489475 | As | date_prelevement=1991-03-27 \| ire_station=2043/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004755262490489475 | CN | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004755262490489475 | Eh | date_prelevement=1990-09-20 \| ire_station=1182/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004755262490489475 | Hg | date_prelevement=1991-03-27 \| ire_station=2043/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004755262490489475 | Cr | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.004755262490489475 | SiO3 | date_prelevement=1991-03-27 \| ire_station=2043/15 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.034427358274041774 | IBGN | date_prelevement=2009-03-16 \| ire_station=3546/8 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 3 | 0.034427358274041774 | F_M_mes | date_prelevement=1996-05-29 \| ire_station=1710/9 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,6X107 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AID_DOM1_R4 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 2,6X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=AMONT SOUK ELAHAD CHEBANATE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,8X106 | date_jr_prelevement=2025-10-13 \| pts_prelevement=PT. O. BEHT AVAL BIORISINE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 2,2X107 | date_jr_prelevement=2025-10-14 \| pts_prelevement=REJET ABATTOIR ZOUMI  \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,0X104 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AVAL REJET INDUSTRIEL MERJA \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | <0,2 | date_jr_prelevement=2024-09-22 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=DBO5 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,6x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=BSM_PDOM1_R2 (EM) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,4X106 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AID_DOM1_R4 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | <3,11 | date_jr_prelevement=2025-10-14 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=MES |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 2,5X102 | date_jr_prelevement=2025-10-28 \| pts_prelevement=Amont STEP Taounate \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,8X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DOM_PE1 (Forage Belaje) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,1x107 | date_jr_prelevement=2024-09-16 \| pts_prelevement=BHD_PDS_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,1x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S3 (Station Pompage Ferme (Amont Bge de garde) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | <0,065 | date_jr_prelevement=2024-09-16 \| pts_prelevement=AVAL REJET SEFROU \| parametre_qualite=Phénol |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,5x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=ACH_PDS_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 4,5X106 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AID_DOM1_R4 (AIN DFALI) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 4,2x106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=BSM_PDOM1_R2 (EM) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | * | date_jr_prelevement=2024-09-19 \| pts_prelevement=AKA_DOM_R1 \| parametre_qualite=DBO5 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 3 | 0.06129955046996322 | 1,7X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=Aval STEP Khémisset  \| parametre_qualite=CF |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Germe_tt_37 | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | RS185 | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Clostri_sul_redu | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Detergent_non_ionique | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Couleur | date_prelevement=1992-05-25 \| ire_station=3261/14 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | S2 | date_prelevement=2005-07-28 \| ire_station=1540/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | HCO | date_prelevement=1996-01-16 \| ire_station=1436/8 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | H2S | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Carbone_org | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Chl | date_prelevement=1994-10-06 \| ire_station=2244/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Cl2_res | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | MD | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Pseudo_aer | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | Azote_Org | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0033279531424197546 | CO2_libre | date_prelevement=1994-07-06 \| ire_station=1508/9 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0031701749936596498 | CrT | date_prelevement=1991-03-27 \| ire_station=2043/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0031701749936596498 | H2S | date_prelevement=1991-03-27 \| ire_station=2043/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0031701749936596498 | Profondeur | date_prelevement=2000-08-07 \| ire_station=R1712/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0031701749936596498 | Co | date_prelevement=1994-07-13 \| ire_station=1024/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.0031701749936596498 | Ni | date_prelevement=1991-03-22 \| ire_station=1161/15 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.022951572182694516 | phenol | date_prelevement=2007-01-12 \| ire_station=3546/8 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.022951572182694516 | S2 | date_prelevement=2003-06-10 \| ire_station=1710/9 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,0x106 | date_jr_prelevement=2025-10-21 \| pts_prelevement=AZR_PDOM1_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,0x107 | date_jr_prelevement=2024-09-18 \| pts_prelevement=REJET ABATTOIR OUED AMLIL  \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 8,0X105 | date_jr_prelevement=2025-10-15 \| pts_prelevement=DBA_DOM1_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,5x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SHZ_DOM2_R5 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,4x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=BMR_DOM_PE1 (Forage CHELIK Arbi) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,8X107 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AKA_PDOM1_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,8x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S13 (Aval_Conf_Rejet_MBK (Mechraa Bel Ksiri) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,7x107 | date_jr_prelevement=2024-09-18 \| pts_prelevement=REJET R12 EP (R12: MBK-DOM-R2) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,8x102 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S11 (Amont Fermes Agricole sidi kamel \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,2x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SHZ_DOM5_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,0x107 | date_jr_prelevement=2025-11-05 \| pts_prelevement=RAT_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,9X106 | date_jr_prelevement=2025-12-13 \| pts_prelevement=REJET ABATTOIR MASMOUDA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,2X103 | date_jr_prelevement=2025-10-28 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,0X105 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AVAL REJET INDUSTRIEL MERJA \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,7X105 | date_jr_prelevement=2025-10-14 \| pts_prelevement=Aval STEP (Aval Conf. Chaaba avec Oued Tiflet) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,6x103 | date_jr_prelevement=2024-09-14 \| pts_prelevement=AVAL STEP IFRANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,1 x 102 | date_jr_prelevement=2024-09-19 \| pts_prelevement=S14 (Aval_Conf_Rejet_HFT (Al Haouafate) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 7,0 x 105 | date_jr_prelevement=2024-09-19 \| pts_prelevement=AKA_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 8,0x104 | date_jr_prelevement=2025-11-10 \| pts_prelevement=AVAL OUED IFRANE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,3X105 | date_jr_prelevement=2025-11-19 \| pts_prelevement=AVAL BOULEMANE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,3X105 | date_jr_prelevement=2024-09-22 \| pts_prelevement=M_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,2x103 | date_jr_prelevement=2024-09-24 \| pts_prelevement=REJET ABATTOIR SKOURA MDAZ \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,5 x 106 | date_jr_prelevement=2024-09-18 \| pts_prelevement= REJET R10 EP (R10: KNH-DOM-R1) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,8x105 | date_jr_prelevement=2024-09-13 \| pts_prelevement=LOJ_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 8,0 x 105 | date_jr_prelevement=2024-09-18 \| pts_prelevement=KSN_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | <0.010 | date_jr_prelevement=2024-09-18 \| pts_prelevement= REJET R10 EM (R10: KNH-DOM-R1) \| parametre_qualite=NO2- |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,2x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S13 (Aval_Conf_Rejet_MBK (Mechraa Bel Ksiri) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,2X106 | date_jr_prelevement=2025-12-08 \| pts_prelevement=REJET ABATTOIR MOULAY DRISS ZRHOUN  \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 5,8X106 | date_jr_prelevement=2025-10-30 \| pts_prelevement=OA_DOM_R3 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,3x106 | date_jr_prelevement=2025-10-21 \| pts_prelevement=BA_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 6,8X103 | date_jr_prelevement=2024-09-23 \| pts_prelevement=AVAL REJET MOULAY YAACOUB \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,8X102 | date_jr_prelevement=2025-11-13 \| pts_prelevement=Amont STEP Taounate \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,4X106 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AKA_PDOM1_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,1 x 107 | date_jr_prelevement=2024-09-19 \| pts_prelevement=AKA_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,2 x 102 | date_jr_prelevement=2024-09-19 \| pts_prelevement=S21 (Aval_conf_Leban_ Inaoun \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,1x103 | date_jr_prelevement=2025-10-22 \| pts_prelevement=AVAL REJET SEFROU \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 7,0x103 | date_jr_prelevement=2025-11-03 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,8X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=AVAL REJET AIN CHEGGAG \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,9 x 106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=CHQ_DOM_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,7x107 | date_jr_prelevement=2025-10-21 \| pts_prelevement=BSM_PDOM1_R2 (EM) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,4x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=BFK_PDOM1_R1 (EM) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 6,2 x 107 | date_jr_prelevement=2024-09-21 \| pts_prelevement=CHQ_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,9x106 | date_jr_prelevement=2024-09-16 \| pts_prelevement=AVAL STEP AZROU \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,2X107 | date_jr_prelevement=2025-12-08 \| pts_prelevement=REJET ABATTOIR MATMATA \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,0X107 | date_jr_prelevement=2025-10-30 \| pts_prelevement=OA_DOM_R3 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,1X106 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DOM_R3 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,9X107 | date_jr_prelevement=2025-10-16 \| pts_prelevement=AID_DOM1_R4 (AIN DFALI) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,1x106 | date_jr_prelevement=2025-11-05 \| pts_prelevement=AVAL VILLAGE BNI AMMART \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,7x104 | date_jr_prelevement=2025-11-10 \| pts_prelevement=AVAL OUED IFRANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 5,4X106 | date_jr_prelevement=2025-10-28 \| pts_prelevement=REJET ABATTOIR MATMATA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,9x105 | date_jr_prelevement=2025-12-09 \| pts_prelevement=MOKR_PDOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,0x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S11 (Amont Fermes Agricole sidi kamel \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 8,0x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=REJET ABATTOIR OUED AMLIL  \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,5x106 | date_jr_prelevement=2024-09-16 \| pts_prelevement=REJET R9 EP (R9: TRL-DOM-R1) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,2X106 | date_jr_prelevement=2024-09-22 \| pts_prelevement=AVAL STEP EL HAJEB \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 5,2x107 | date_jr_prelevement=2024-09-18 \| pts_prelevement= REJET R10 EP (R10: KNH-DOM-R1) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,1 x 106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=LOD_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | < 1,7 | date_jr_prelevement=2025-12-13 \| pts_prelevement=REJET ABATTOIR MOULAY DRISS ZRHOUN  \| parametre_qualite=Huiles
Graisses |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,5X104 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MERJA FOUARATE \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,3X106 | date_jr_prelevement=2025-10-20 \| pts_prelevement=AVAL STEP EL HAJEB \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 5,1X107 | date_jr_prelevement=2025-10-16 \| pts_prelevement=REJET ABATTOIR SIDI REDOUANE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,7x103 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S13 (Aval_Conf_Rejet_MBK (Mechraa Bel Ksiri) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,6x106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=BHD_PDS_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 8,0X104 | date_jr_prelevement=2025-10-30 \| pts_prelevement=AMONT SEFROU \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 3,6X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=S16 (Aval_Conf_Rejet_KHN (Khnichet) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,6X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=MSA_DOM1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,8x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SBA_DOM1_R1 (EM) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,2X106 | date_jr_prelevement=2024-09-22 \| pts_prelevement=RG_AIS_1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 4,2x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=R-KRB_PDE_P2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 1,3X104 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AVAL REJET INDUSTRIEL MERJA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 2 | 0.04086636697997548 | 2,0X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DEC_PE1 (Forage Ferme ZIANI Bel Arbi) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | parametre_qualite | ALIAS_UNMAPPED | 2 | 0.04086636697997548 | DCO  D 
 2h | date_jr_prelevement=2025-10-30 \| pts_prelevement=AMONT STEP OUED AMLIL |
| INFRA | infra_barrages_abhs | nom_barrage | NULL_VALUE | 1 | 2.941176470588235 | NULL | nom_barrage=None |
| QUALITE | mesures_qualite_rivieres | val_qual_riv | NEGATIVE_VALUE | 1 | 0.0016639765712098773 | -0.4 | date_prelevement=2006-12-05 \| ire_station=2263/15 \| parametre_qualite=CF |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0016639765712098773 | PO3 | date_prelevement=1993-03-11 \| ire_station=669/22 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0016639765712098773 | Odeur | date_prelevement=1994-05-17 \| ire_station=2496/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0016639765712098773 | Vibrion_Cholerique | date_prelevement=2009-10-22 \| ire_station=1540/15 |
| QUALITE | mesures_qualite_rivieres | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0016639765712098773 | Saveur | date_prelevement=1994-05-17 \| ire_station=2496/15 |
| QUALITE | mesures_qualite_nappes | val_qual_nap | NEGATIVE_VALUE | 1 | 0.0015850874968298249 | -330.0 | date_prelevement=1990-09-21 \| ire_station=2881/15 \| parametre_qualite=Eh |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | CO32 | date_prelevement=1999-05-20 \| ire_station=1162/14 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | Temperature_Ambiante | date_prelevement=1991-03-27 \| ire_station=2881/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | Couleur | date_prelevement=1992-09-17 \| ire_station=1149/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | Disque_secchi | date_prelevement=1991-10-03 \| ire_station=788/22 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | Numerotation_GT | date_prelevement=1991-03-27 \| ire_station=2881/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | HCO | date_prelevement=1996-05-09 \| ire_station=1308/22 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | Detergent | date_prelevement=1993-08-10 \| ire_station=897/16 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | F_M_mes | date_prelevement=2006-12-13 \| ire_station=2797/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | H_G | date_prelevement=1991-03-27 \| ire_station=2881/15 |
| QUALITE | mesures_qualite_nappes | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.0015850874968298249 | Azote_Org | date_prelevement=1994-07-12 \| ire_station=1102/13 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | OH | date_prelevement=1992-06-05 \| ire_station=788/21 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | Couleur | date_prelevement=2004-10-07 \| ire_station=1709/9 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | FM | date_prelevement=1996-05-29 \| ire_station=3323/8 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | Azote_tot_kjeld | date_prelevement=1996-10-24 \| ire_station=3264/15 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | RS105 | date_prelevement=1990-01-30 \| ire_station=788/21 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | Detergent | date_prelevement=1990-08-17 \| ire_station=788/21 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | DCO_dec2h | date_prelevement=2002-11-25 \| ire_station=3546/8 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | HCT | date_prelevement=2007-01-12 \| ire_station=3546/8 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | S | date_prelevement=2003-06-10 \| ire_station=1710/9 |
| QUALITE | mesures_qualite_barrages | parametre_qualite | ALIAS_UNMAPPED | 1 | 0.011475786091347258 | Azote_Org | date_prelevement=2003-11-13 \| ire_station=1710/9 |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4 x 102 | date_jr_prelevement=2024-09-19 \| pts_prelevement=S21 (Aval_conf_Leban_ Inaoun \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,3X102 | date_jr_prelevement=2025-10-17 \| pts_prelevement=ARB_DECH1_PE1 (AIN LABROUAL) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,3x107 | date_jr_prelevement=2025-10-22 \| pts_prelevement=SBA_DOM1_R1 (EM) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,3X107 | date_jr_prelevement=2024-09-22 \| pts_prelevement=SAZ_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,7x107 | date_jr_prelevement=2024-09-24 \| pts_prelevement=LMJ_DOM_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9X106 | date_jr_prelevement=2025-10-15 \| pts_prelevement=DBA_DOM1_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,2x107 | date_jr_prelevement=2024-09-14 \| pts_prelevement=REJET R4 EP (R4: SHZ-DOM3-R2) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,0 x 107 | date_jr_prelevement=2024-09-21 \| pts_prelevement=HFT_DOM_R3 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4x104 | date_jr_prelevement=2025-12-09 \| pts_prelevement=MOKR_PDOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5x107 | date_jr_prelevement=2024-09-16 \| pts_prelevement=REJET R8 EP (R8: LMJ-DOM-R1) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,9X103 | date_jr_prelevement=2025-10-16 \| pts_prelevement=AVAL REJET MOULAY DRISS ZARHOUN \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,7 x 102 | date_jr_prelevement=2024-09-19 \| pts_prelevement=SHZ_DOM2_PE2 (Source Barda) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,1x105 | date_jr_prelevement=2025-11-20 \| pts_prelevement=IMK_DOM_R3 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,3X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=MSA_DOM1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,5X105 | date_jr_prelevement=2025-10-30 \| pts_prelevement=AMONT STEP OUED AMLIL \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4x106 | date_jr_prelevement=2024-09-16 \| pts_prelevement=REJET R8 EP (R8: LMJ-DOM-R1) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,5x106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=REJET R4 EP (R4: SHZ-DOM3-R2) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,3x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S7 (Aval_Conf_Rejet_SAT (Sidi Allal Tazi) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,3X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=S16 (Aval_Conf_Rejet_KHN (Khnichet) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,7x107 | date_jr_prelevement=2024-09-14 \| pts_prelevement=MOG_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 9,0 x 105 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SHZ_DOM2_R3 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,2X102 | date_jr_prelevement=2025-10-17 \| pts_prelevement=ARB_DECH1_PE1 (AIN LABROUAL) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,6x104 | date_jr_prelevement=2025-11-05 \| pts_prelevement=AVAL REJET EL MENZEL \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,2X105 | date_jr_prelevement=2024-09-23 \| pts_prelevement=LOJ_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,5x107 | date_jr_prelevement=2024-09-14 \| pts_prelevement=REJET R6 EP  (R6: ORG-DOM-R3) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,8X103 | date_jr_prelevement=2025-11-13 \| pts_prelevement=TAM_PDS_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,4X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DEC_PE1 (Forage Ferme ZIANI Bel Arbi) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,9 x 107 | date_jr_prelevement=2024-09-21 \| pts_prelevement=OMN_DOM_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,3x107 | date_jr_prelevement=2025-11-12 \| pts_prelevement=BHD_PDS_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,6 x 106 | date_jr_prelevement=2024-09-19 \| pts_prelevement=MKS_DOM_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,5X107 | date_jr_prelevement=2025-12-13 \| pts_prelevement=REJET ABATTOIR MOULAY DRISS ZRHOUN  \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9x107 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SHZ_DOM5_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,1x106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=REJET R4 EP (R4: SHZ-DOM3-R2) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,5 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S23 (Aval_Conf_Rejet_JEM (Jorf el MALHA ) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,6X102 | date_jr_prelevement=2025-11-20 \| pts_prelevement=Amont STEP Taounate \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,7X102 | date_jr_prelevement=2024-09-23 \| pts_prelevement=S22 (Aval_conf_Sebou_ Inaoun) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,1x104 | date_jr_prelevement=2025-12-09 \| pts_prelevement=MOKR_PDOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,0 x 105 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S27 (Aval_Conf_Rejet_LOD (Louadaine) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,0X105 | date_jr_prelevement=2025-10-20 \| pts_prelevement=AVAL REJET BOUFEKRANE \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,4x106 | date_jr_prelevement=2025-10-22 \| pts_prelevement=SBA_DOM1_R1 (EM) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,8x104 | date_jr_prelevement=2025-12-10 \| pts_prelevement=REJET ABATTOIR GALDMANE \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 9,0x105 | date_jr_prelevement=2025-11-12 \| pts_prelevement=BA_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,2X104 | date_jr_prelevement=2025-10-13 \| pts_prelevement=MERJA FOUARATE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9X105 | date_jr_prelevement=2025-10-13 \| pts_prelevement=MERJA FOUARATE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,4x105 | date_jr_prelevement=2025-11-21 \| pts_prelevement=ACH_PDS_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,5x107 | date_jr_prelevement=2024-09-14 \| pts_prelevement=SAT_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,4x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S1 (Aval_conf_Rejet_MOG (Mograne) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9x108 | date_jr_prelevement=2024-09-24 \| pts_prelevement=LMJ_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,2 x 102 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S24 (Douar Chorf laghouazi) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,8 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S20 (Aval STEP Fes) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,6X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=RG_TFL_1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,2x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S9 (Aval douar el fokra (sidi kamel) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,8X105 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DOM_R5 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,3X103 | date_jr_prelevement=2025-11-04 \| pts_prelevement=AVAL REJET SEFROU \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,3x105 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R1 EP (R1: SHZ-DOM2-R1) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,2 x 102 | date_jr_prelevement=2024-09-21 \| pts_prelevement=S14 (Aval_Conf_Rejet_HFT (Al Haouafate) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 8,0X103 | date_jr_prelevement=2025-11-25 \| pts_prelevement=PA AVAL STEP MHAYA \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,0x102 | date_jr_prelevement=2024-09-14 \| pts_prelevement=MBK_DOM_R4 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,1X107 | date_jr_prelevement=2025-12-13 \| pts_prelevement=REJET ABATTOIR MASMOUDA \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,9x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S1 (Aval_conf_Rejet_MOG (Mograne) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,9X103 | date_jr_prelevement=2025-10-16 \| pts_prelevement=AVAL REJET MOULAY DRISS ZARHOUN \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,0x106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=REJET R6 EP  (R6: ORG-DOM-R3) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,0X106 | date_jr_prelevement=2025-12-11 \| pts_prelevement=REJET ABATTOIR SIDI BOUSBER \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 9,0 x 104 | date_jr_prelevement=2024-09-20 \| pts_prelevement=MBC_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,7 x 103 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SAT_DEC_PE1 (Puits youness CHOUA) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4X103 | date_jr_prelevement=2025-10-29 \| pts_prelevement=TAZ_PDOM_R9 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,8x103 | date_jr_prelevement=2025-11-10 \| pts_prelevement=AVAL AIN LEUH \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,6x106 | date_jr_prelevement=2025-11-20 \| pts_prelevement=REJET BOULEMANE (EM) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,0 x 107 | date_jr_prelevement=2024-09-19 \| pts_prelevement=MKS_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,5x103 | date_jr_prelevement=2024-09-18 \| pts_prelevement=S30 (Aval_Conf_Rejet_SHZ (Sidi Harazem) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,1x104 | date_jr_prelevement=2025-10-24 \| pts_prelevement=AVAL STEP IFRANE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,4 x 105 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S23 (Aval_Conf_Rejet_JEM (Jorf el MALHA ) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,84 (déctanté) | date_jr_prelevement=2025-10-30 \| pts_prelevement=STATION BAB MARZOUKA \| parametre_qualite=PT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,8X104 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AVAL AIN KARMA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,4 x 106 | date_jr_prelevement=2024-09-20 \| pts_prelevement=KSN_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,0X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=Aval STEP (Aval Conf. Chaaba avec Oued Tiflet) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,4 x 103 | date_jr_prelevement=2024-09-18 \| pts_prelevement=S29 (Aval_Conf_Rejet_Douar Ouled Jrir \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,2X103 | date_jr_prelevement=2024-09-23 \| pts_prelevement=S22 (Aval_conf_Sebou_ Inaoun) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,5x103 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R3 EP  (R3: SHZ-DOM1-R1) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,1X106 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AMONT SOUK ELAHAD CHEBANATE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,2X103 | date_jr_prelevement=2025-10-31 \| pts_prelevement=AVAL REJET MOULAY YAACOUB \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,5 x 105 | date_jr_prelevement=2024-09-19 \| pts_prelevement=S26 (Aval_Conf_Rejet_MKS (Mkansa) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,8X104 | date_jr_prelevement=2024-09-22 \| pts_prelevement=SAZ_DOM_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,4 x 106 | date_jr_prelevement=2024-09-19 \| pts_prelevement=MKS_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,6x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S8 (Aval Ferme Agricole sidi kamel) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5X103 | date_jr_prelevement=2025-11-20 \| pts_prelevement=Aval STEP Taounate \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,3x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S8 (Aval Ferme Agricole sidi kamel) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,1 x 102 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S18 (Aval Sidi Daoud) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,9 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S23 (Aval_Conf_Rejet_JEM (Jorf el MALHA ) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,5x103 | date_jr_prelevement=2025-11-10 \| pts_prelevement=AVAL AIN LEUH \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,4X103 | date_jr_prelevement=2025-10-16 \| pts_prelevement=AVAL REJET MOULAY DRISS ZARHOUN \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,7x105 | date_jr_prelevement=2025-11-21 \| pts_prelevement=ACH_PDS_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,1x105 | date_jr_prelevement=2025-10-22 \| pts_prelevement=AZR_PDOM1_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,3X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=S15 (Aval_Conf_Sebou_ Ouagha (Dour El Kbara) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,6x105 | date_jr_prelevement=2025-10-22 \| pts_prelevement=AVAL STEP AZROU \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | <1.7 | date_jr_prelevement=2024-09-23 \| pts_prelevement=LOJ_DOM_R1 \| parametre_qualite=Huiles
Graisses |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,4x104 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R2 EP  (R2: SHZ-DOM2-R2) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,4X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=PT. O. BEHT AVAL BIORISINE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,0X107 | date_jr_prelevement=2025-10-15 \| pts_prelevement=SDK_DOM1_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5x103 | date_jr_prelevement=2025-10-22 \| pts_prelevement=PA SIDI MOKHFI \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,2x103 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S12 (Aval_Conf_Rejet_MBK_R4 (Mechraa Bel Ksiri) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,5 x 102 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S24 (Douar Chorf laghouazi) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 8,0x102 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S10 (Aval douar Zehair (sidi kamel) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,5X106 | date_jr_prelevement=2025-10-13 \| pts_prelevement=REJET MERJA FOUARATE AIN SEBAA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5x104 | date_jr_prelevement=2025-11-10 \| pts_prelevement=AVAL AIN LEUH \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 9,0X102 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AVAL VILLAGE AIT SIBERNE \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,4x106 | date_jr_prelevement=2025-10-21 \| pts_prelevement=BFK_PDOM1_R1 (EM) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9 x 102 | date_jr_prelevement=2024-09-21 \| pts_prelevement=S28 (Aval_Conf_Rejet_ORG (Ouartzagh) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,9x105 | date_jr_prelevement=2025-10-22 \| pts_prelevement=AZR_PDOM1_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,1 x 106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SHZ_DOM3_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,5X104 | date_jr_prelevement=2025-10-30 \| pts_prelevement=AMONT STEP OUED AMLIL \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,1X105 | date_jr_prelevement=2025-11-25 \| pts_prelevement=PA AVAL STEP MHAYA \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,8X107 | date_jr_prelevement=2025-10-28 \| pts_prelevement=SJH_DOM1_R1 (EM) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,3 x 103 | date_jr_prelevement=2024-09-18 \| pts_prelevement=S30 (Aval_Conf_Rejet_SHZ (Sidi Harazem) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,5x106 | date_jr_prelevement=2025-11-12 \| pts_prelevement=AVAL VILLAGE BNI AMMART \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9 x 107 | date_jr_prelevement=2024-09-20 \| pts_prelevement=JEM_DOM_R3 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,8X103 | date_jr_prelevement=2025-10-28 \| pts_prelevement=BHL_DOM_PE1 (PUITS) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,4X106 | date_jr_prelevement=2025-10-14 \| pts_prelevement=Amont STEP Khémisset  \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S1 (Aval_conf_Rejet_MOG (Mograne) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,1X106 | date_jr_prelevement=2025-10-13 \| pts_prelevement=REJET MERJA FOUARATE AIN SEBAA \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,7X104 | date_jr_prelevement=2024-09-22 \| pts_prelevement=SAZ_DOM_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,6X105 | date_jr_prelevement=2025-11-05 \| pts_prelevement=RAT_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,9x106 | date_jr_prelevement=2024-09-16 \| pts_prelevement=REJET R9 EP (R9: TRL-DOM-R1) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 8,0 x 104 | date_jr_prelevement=2024-09-19 \| pts_prelevement=S26 (Aval_Conf_Rejet_MKS (Mkansa) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,2X105 | date_jr_prelevement=2025-10-14 \| pts_prelevement=Aval STEP Khémisset  \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,9X107 | date_jr_prelevement=2025-12-14 \| pts_prelevement=REJET ABATTOIR TAHLA \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9X104 | date_jr_prelevement=2025-12-13 \| pts_prelevement=MDZ_PDOM1_PE1  \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,1X107 | date_jr_prelevement=2025-12-11 \| pts_prelevement=REJET ABATTOIR AGOURAI \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,9x104 | date_jr_prelevement=2025-10-22 \| pts_prelevement=PA SIDI MOKHFI \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4X106 | date_jr_prelevement=2025-10-16 \| pts_prelevement=AID_DOM1_R4 (AIN DFALI) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,7X106 | date_jr_prelevement=2025-10-16 \| pts_prelevement=SAH_DOM1_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,3X106 | date_jr_prelevement=2024-09-23 \| pts_prelevement=LOJ_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,8x106 | date_jr_prelevement=2024-09-18 \| pts_prelevement= REJET R10 EP (R10: KNH-DOM-R1) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,8x102 | date_jr_prelevement=2024-09-24 \| pts_prelevement=S25 (Aval_Conf_Rejet_LMJ (Lamjaara) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,2 x 106 | date_jr_prelevement=2024-09-20 \| pts_prelevement=LOD_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,0X103 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AVAL VILLAGE AIT SIBERNE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,4X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DOM_PE1 (Forage Belaje) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,4X104 | date_jr_prelevement=2025-11-20 \| pts_prelevement=Aval STEP Taounate \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,0x105 | date_jr_prelevement=2025-11-20 \| pts_prelevement=REJET BOULEMANE (EM) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,3 x 106 | date_jr_prelevement=2024-09-21 \| pts_prelevement=HFT_DOM_R3 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 9,0X105 | date_jr_prelevement=2025-10-16 \| pts_prelevement=DDZ_PDOM1_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,9X102 | date_jr_prelevement=2025-11-20 \| pts_prelevement=Aval STEP Taounate \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,8 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=RZI_DEC_PE1 (Puits Fouad ELBRINI) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,6x105 | date_jr_prelevement=2025-10-22 \| pts_prelevement=AVAL STEP AZROU \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9x102 | date_jr_prelevement=2025-11-14 \| pts_prelevement=Station Hajria \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,3X105 | date_jr_prelevement=2025-10-20 \| pts_prelevement=AVAL REJET BOUFEKRANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,8X104 | date_jr_prelevement=2025-11-13 \| pts_prelevement=TAM_PDS_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,1X105 | date_jr_prelevement=2025-11-26 \| pts_prelevement=M_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,1x105 | date_jr_prelevement=2025-11-19 \| pts_prelevement=AVAL BOULEMANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,4X105 | date_jr_prelevement=2025-12-01 \| pts_prelevement=SDR_PDOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,0 x 104 | date_jr_prelevement=2024-09-20 \| pts_prelevement=MBC_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,0X103 | date_jr_prelevement=2025-10-13 \| pts_prelevement=AVAL VILLAGE AIT SIBERNE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,9x106 | date_jr_prelevement=2025-11-19 \| pts_prelevement=AVAL BOULEMANE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,4x104 | date_jr_prelevement=2025-12-10 \| pts_prelevement=REJET ABATTOIR GALDMANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,8x103 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R3 EP  (R3: SHZ-DOM1-R1) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,4x106 | date_jr_prelevement=2025-11-12 \| pts_prelevement=THS_PDS_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,2 x 103 | date_jr_prelevement=2024-09-19 \| pts_prelevement=SHZ_DOM2_PE1 (Source Skhinate (Nakhla) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,7 x 105 | date_jr_prelevement=2024-09-21 \| pts_prelevement=ORG_DOM_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,9X105 | date_jr_prelevement=2024-09-22 \| pts_prelevement=OHN_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,8x107 | date_jr_prelevement=2024-09-14 \| pts_prelevement=REJET R5 EP (R5: LOD-DOM-R2) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,7X106 | date_jr_prelevement=2025-11-26 \| pts_prelevement=OZ_DECH_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,9x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S9 (Aval douar el fokra (sidi kamel) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,3x102 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S12 (Aval_Conf_Rejet_MBK_R4 (Mechraa Bel Ksiri) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,6x106 | date_jr_prelevement=2024-09-16 \| pts_prelevement=REJET R8 EP (R8: LMJ-DOM-R1) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,2x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S6 (Amont ancien rejet sotrameg) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,5X103 | date_jr_prelevement=2024-09-22 \| pts_prelevement=S16 (Aval_Conf_Rejet_KHN (Khnichet) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,7X107 | date_jr_prelevement=2025-12-11 \| pts_prelevement=REJET ABATTOIR SIDI BOUSBER \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,3X103 | date_jr_prelevement=2025-10-28 \| pts_prelevement=TIS_DEC_PE1 (MEHDI OUAZZANI) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,2 x 106 | date_jr_prelevement=2024-09-20 \| pts_prelevement=JEM_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,4X105 | date_jr_prelevement=2025-10-30 \| pts_prelevement=AVAL STEP OUED AMLIL \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,6X104 | date_jr_prelevement=2025-10-30 \| pts_prelevement=STATION BAB MARZOUKA \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,8 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S27 (Aval_Conf_Rejet_LOD (Louadaine) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,2x102 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S11 (Amont Fermes Agricole sidi kamel \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,2x103 | date_jr_prelevement=2025-10-24 \| pts_prelevement=AVAL STEP IFRANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,8 x 107 | date_jr_prelevement=2024-09-20 \| pts_prelevement=JEM_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,8 x 103 | date_jr_prelevement=2024-09-19 \| pts_prelevement=SHZ_DOM2_PE1 (Source Skhinate (Nakhla) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,1X103 | date_jr_prelevement=2025-10-29 \| pts_prelevement=TAZ_PDOM_R9 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S27 (Aval_Conf_Rejet_LOD (Louadaine) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,2 x 105 | date_jr_prelevement=2024-09-21 \| pts_prelevement=ORG_DOM_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,0x103 | date_jr_prelevement=2024-09-18 \| pts_prelevement=S30 (Aval_Conf_Rejet_SHZ (Sidi Harazem) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,1X107 | date_jr_prelevement=2025-12-02 \| pts_prelevement=ZDA_PDOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | <0.065 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R3 EM  (R3: SHZ-DOM1-R1) \| parametre_qualite=Phénol |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,3X107 | date_jr_prelevement=2025-10-14 \| pts_prelevement=Amont STEP Khémisset  \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,1x105 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R2 EP  (R2: SHZ-DOM2-R2) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 9,0x106 | date_jr_prelevement=2025-11-12 \| pts_prelevement=AVAL VILLAGE BNI AMMART \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4x105 | date_jr_prelevement=2025-10-22 \| pts_prelevement=PA Aval Village Tigrigra \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,8 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S20 (Aval STEP Fes) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,5X103 | date_jr_prelevement=2025-11-05 \| pts_prelevement=AVAL REJET EL MENZEL \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,3 x 105 | date_jr_prelevement=2024-09-21 \| pts_prelevement=HFT_DOM_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,9x107 | date_jr_prelevement=2024-09-18 \| pts_prelevement=REJET R11 EP (R11: NTR-DOM-R1) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9x103 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S10 (Aval douar Zehair (sidi kamel) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,2x104 | date_jr_prelevement=2024-09-18 \| pts_prelevement=S29 (Aval_Conf_Rejet_Douar Ouled Jrir \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,4x107 | date_jr_prelevement=2025-10-21 \| pts_prelevement=BFK_PDOM1_R1 (EM) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,6 x 106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=MOG_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,1X106 | date_jr_prelevement=2025-11-26 \| pts_prelevement=M_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,7X104 | date_jr_prelevement=2024-09-22 \| pts_prelevement=OHN_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,6 x 106 | date_jr_prelevement=2024-09-21 \| pts_prelevement=HFT_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,1X104 | date_jr_prelevement=2025-11-25 \| pts_prelevement=PA AVAL STEP MHAYA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,3 x 106 | date_jr_prelevement=2024-09-21 \| pts_prelevement=CHQ_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | <0,016 | date_jr_prelevement=2025-12-13 \| pts_prelevement=MDZ_PDOM1_PE1  \| parametre_qualite=NH4+  |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,5 x 108 | date_jr_prelevement=2024-09-21 \| pts_prelevement=OMN_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,8x107 | date_jr_prelevement=2024-09-16 \| pts_prelevement=REJET R9 EP (R9: TRL-DOM-R1) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,7x105 | date_jr_prelevement=2025-12-09 \| pts_prelevement=REJET ABATTOIR MOQRISSET  \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,1X106 | date_jr_prelevement=2025-12-14 \| pts_prelevement=REJET ABATTOIR TAHLA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,3 x 106 | date_jr_prelevement=2024-09-21 \| pts_prelevement=CHQ_DOM_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,6 x 106 | date_jr_prelevement=2024-09-21 \| pts_prelevement=HFT_DOM_R3 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,3X102 | date_jr_prelevement=2025-11-13 \| pts_prelevement=GHF_PDE_P1 (PUITS MRIZIEK) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,1X106 | date_jr_prelevement=2025-12-14 \| pts_prelevement=REJET ABATTOIR GUIGOU \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,5X104 | date_jr_prelevement=2025-10-28 \| pts_prelevement=SOURCE AMMES DECHQUONDA (BHL_PDOM_PE1) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,3x102 | date_jr_prelevement=2025-11-14 \| pts_prelevement=Station Hajria \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,4 x 106 | date_jr_prelevement=2024-09-21 \| pts_prelevement=ORG_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | <0.6 | date_jr_prelevement=2024-09-23 \| pts_prelevement=LOJ_DOM_R1 \| parametre_qualite=Phénol |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,8X106 | date_jr_prelevement=2025-10-15 \| pts_prelevement=SDK_DOM1_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,7 x 105 | date_jr_prelevement=2024-09-19 \| pts_prelevement=S26 (Aval_Conf_Rejet_MKS (Mkansa) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,3 x 106 | date_jr_prelevement=2024-09-21 \| pts_prelevement=CHQ_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,1x107 | date_jr_prelevement=2024-09-24 \| pts_prelevement=LMJ_DOM_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,2x104 | date_jr_prelevement=2025-10-22 \| pts_prelevement=PA Aval Village Tigrigra \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,0x107 | date_jr_prelevement=2025-10-21 \| pts_prelevement=SMK_PDOM1_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,9x102 | date_jr_prelevement=2024-09-23 \| pts_prelevement=S22 (Aval_conf_Sebou_ Inaoun) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,7x106 | date_jr_prelevement=2025-11-12 \| pts_prelevement=BA_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,8X106 | date_jr_prelevement=2025-12-14 \| pts_prelevement=REJET ABATTOIR BAB MARZOUKA  \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,7x103 | date_jr_prelevement=2024-09-14 \| pts_prelevement=MBK_DOM_R4 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,7X102 | date_jr_prelevement=2025-11-13 \| pts_prelevement=GHF_PDE_P1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,4X107 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DOM_R3 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,0X104 | date_jr_prelevement=2025-10-29 \| pts_prelevement=TAZ_PDOM_R9 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,2x105 | date_jr_prelevement=2025-11-20 \| pts_prelevement=REJET BOULEMANE (EM) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,7 x 106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=SAT_DOM_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,9X102 | date_jr_prelevement=2025-10-28 \| pts_prelevement=TIS_DEC_PE1 (MEHDI OUAZZANI) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,5X106 | date_jr_prelevement=2025-10-15 \| pts_prelevement=SDK_DOM1_R2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,5 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=RZI_DEC_PE1 (Puits Fouad ELBRINI) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,3X103 | date_jr_prelevement=2024-09-22 \| pts_prelevement=S15 (Aval_Conf_Sebou_ Ouagha (Dour El Kbara) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5X107 | date_jr_prelevement=2025-10-15 \| pts_prelevement=DBA_DOM1_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,7X105 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DOM_R5 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,1 x 102 | date_jr_prelevement=2024-09-21 \| pts_prelevement=S14 (Aval_Conf_Rejet_HFT (Al Haouafate) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,0X105 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DOM_R6 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,2x102 | date_jr_prelevement=2025-11-14 \| pts_prelevement=Station Hajria \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5X105 | date_jr_prelevement=2024-09-22 \| pts_prelevement=SAZ_DOM_R2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,4 x 105 | date_jr_prelevement=2024-09-21 \| pts_prelevement=HFT_DOM_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,6 x 104 | date_jr_prelevement=2024-09-19 \| pts_prelevement=SHZ_DOM2_PE1 (Source Skhinate (Nakhla) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,7 x 106 | date_jr_prelevement=2024-09-19 \| pts_prelevement=MKS_DOM_R2 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,6X106 | date_jr_prelevement=2025-10-28 \| pts_prelevement=SJH_DOM1_R1 (EM) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,3x104 | date_jr_prelevement=2025-11-10 \| pts_prelevement=AVAL OUED IFRANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,9X105 | date_jr_prelevement=2025-10-28 \| pts_prelevement=SOURCE AMMES DECHQUONDA (BHL_PDOM_PE1) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,8X107 | date_jr_prelevement=2025-10-16 \| pts_prelevement=DDZ_PDOM1_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,9X106 | date_jr_prelevement=2025-10-17 \| pts_prelevement=NBA_PDOM1_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,2X105 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AVAL AIN KARMA \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,8X106 | date_jr_prelevement=2025-12-13 \| pts_prelevement=REJET ABATTOIR SIDI REDOUANE \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,4X102 | date_jr_prelevement=2025-10-17 \| pts_prelevement=ARB_DECH1_PE1 (AIN LABROUAL) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,4X102 | date_jr_prelevement=2025-10-28 \| pts_prelevement=PONT RS 302 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,3X103 | date_jr_prelevement=2025-10-28 \| pts_prelevement=TIS_DEC_PE1 (MEHDI OUAZZANI) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,2 x 107 | date_jr_prelevement=2024-09-21 \| pts_prelevement=CHQ_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,0x105 | date_jr_prelevement=2025-12-10 \| pts_prelevement=REJET ABATTOIR SKOURA MDAZ \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 6,0 x 102 | date_jr_prelevement=2024-09-20 \| pts_prelevement=RZI_DEC_PE1 (Puits Fouad ELBRINI) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 8,4x103 | date_jr_prelevement=2024-09-24 \| pts_prelevement=S25 (Aval_Conf_Rejet_LMJ (Lamjaara) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,7x104 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R3 EP  (R3: SHZ-DOM1-R1) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,8X106 | date_jr_prelevement=2025-12-13 \| pts_prelevement=REJET ABATTOIR MASMOUDA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,6 x 107 | date_jr_prelevement=2024-09-20 \| pts_prelevement=LOD_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,1X104 | date_jr_prelevement=2025-11-03 \| pts_prelevement=R-KRB_PDE_P2 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,2X106 | date_jr_prelevement=2025-11-26 \| pts_prelevement=OZ_DECH_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,1X103 | date_jr_prelevement=2025-11-03 \| pts_prelevement=R-KRB_PDE_P2 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,6X107 | date_jr_prelevement=2025-12-14 \| pts_prelevement=REJET ABATTOIR BAB MARZOUKA  \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,0x107 | date_jr_prelevement=2024-09-18 \| pts_prelevement=SHZ_DOM3_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,5 x 103 | date_jr_prelevement=2024-09-19 \| pts_prelevement=S21 (Aval_conf_Leban_ Inaoun \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,3X104 | date_jr_prelevement=2025-10-31 \| pts_prelevement=AVAL REJET MOULAY YAACOUB \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,7x106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=REJET R5 EP (R5: LOD-DOM-R2) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,8X102 | date_jr_prelevement=2024-09-22 \| pts_prelevement=MBK_DEC_PE1 (Forage Ferme ZIANI Bel Arbi) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,7X106 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AID_DOM1_R4 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,2 x 103 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S18 (Aval Sidi Daoud) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,0x104 | date_jr_prelevement=2025-12-10 \| pts_prelevement=REJET ABATTOIR BNI FTAH \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,8x106 | date_jr_prelevement=2025-10-21 \| pts_prelevement=Rejet Industriel (SMK) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,2X104 | date_jr_prelevement=2025-10-30 \| pts_prelevement=STATION BAB MARZOUKA \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,0x106 | date_jr_prelevement=2024-09-16 \| pts_prelevement=REJET R7 EP  (R7: JEM-DOM-R2) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,2 x 106 | date_jr_prelevement=2024-09-18 \| pts_prelevement=REJET R11 EP (R11: NTR-DOM-R1) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,7 x 107 | date_jr_prelevement=2024-09-19 \| pts_prelevement=MKS_DOM_R1 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 0,819 déctanté | date_jr_prelevement=2025-10-30 \| pts_prelevement=AMONT STEP OUED AMLIL \| parametre_qualite=PT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 3,1 x 106 | date_jr_prelevement=2024-09-20 \| pts_prelevement=JEM_DOM_R3 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,2x106 | date_jr_prelevement=2025-12-02 \| pts_prelevement=ZDA_PDOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5x102 | date_jr_prelevement=2024-09-13 \| pts_prelevement=S2 (Barrage de garde) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,5X102 | date_jr_prelevement=2025-10-14 \| pts_prelevement=REJET STEP TIFLET \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | <0.300 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R3 EM  (R3: SHZ-DOM1-R1) \| parametre_qualite=NO3- |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,6 x 102 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S18 (Aval Sidi Daoud) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,9x102 | date_jr_prelevement=2024-09-14 \| pts_prelevement=S12 (Aval_Conf_Rejet_MBK_R4 (Mechraa Bel Ksiri) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,7x106 | date_jr_prelevement=2025-11-20 \| pts_prelevement=IMK_DOM_R3 \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,3x107 | date_jr_prelevement=2025-12-10 \| pts_prelevement=REJET ABATTOIR GALDMANE \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,4X105 | date_jr_prelevement=2025-10-28 \| pts_prelevement=SOURCE AMMES DECHQUONDA (BHL_PDOM_PE1) \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 4,6 x 106 | date_jr_prelevement=2024-09-20 \| pts_prelevement=JEM_DOM_R1 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,6x104 | date_jr_prelevement=2025-11-04 \| pts_prelevement=AVAL REJET SEFROU \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 7,5 x 104 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S20 (Aval STEP Fes) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,9 x 106 | date_jr_prelevement=2024-09-14 \| pts_prelevement=MOG_DOM_R1 \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,9 x 102 | date_jr_prelevement=2024-09-20 \| pts_prelevement=S24 (Douar Chorf laghouazi) \| parametre_qualite=CT |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 1,2x105 | date_jr_prelevement=2025-11-20 \| pts_prelevement=IMK_DOM_R3 \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,4X104 | date_jr_prelevement=2025-10-15 \| pts_prelevement=AVAL AIN KARMA \| parametre_qualite=SF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 5,3x104 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R1 EP (R1: SHZ-DOM2-R1) \| parametre_qualite=CF |
| IDP | mesures_idp_2024_qualite_globale | val_qual | NON_NUMERIC | 1 | 0.02043318348998774 | 2,7x105 | date_jr_prelevement=2024-09-13 \| pts_prelevement=REJET R1 EP (R1: SHZ-DOM2-R1) \| parametre_qualite=SF |