# Valeurs non numériques

| Paramètre observé | Nom standard | Table source | Colonne valeur | Nombre cas | Exemples | Type non numérique | Règle proposée | Statut migration |
|---|---|---|---|---|---|---|---|---|
| TH | TH | idp_2024_mesures_qualite_globale | val_qual | 187 | 330,9980656 / 21,28095661 / 33,50342525 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Ca++ | Ca | idp_2024_mesures_qualite_globale | val_qual | 177 | 258,5 / 56,1 / 55,1 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| CT | CT | idp_2024_mesures_qualite_globale | val_qual | 173 | 3,4x102 / 1,8x102 / 1,1x102 | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| Mg++ | Mg | idp_2024_mesures_qualite_globale | val_qual | 171 | 647,6 / 17,7 / 17,9 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| CF | CF | idp_2024_mesures_qualite_globale | val_qual | 164 | 2,4x102 / 1,5x102 / 1,3x102 | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| SF | SF | idp_2024_mesures_qualite_globale | val_qual | 164 | 3,9x102 / 1,4x102 / 1,1x102 | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| NO3- | NO3- | idp_2024_mesures_qualite_globale | val_qual | 157 | 9,58 / 2,54 / 2,48 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| K+ | K | idp_2024_mesures_qualite_globale | val_qual | 153 | 2,71 / 2,4 / 2,42 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PT | PT | idp_2024_mesures_qualite_globale | val_qual | 149 | 0,167 / 0,069 / 0,061 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NH4+  | NH4+ | idp_2024_mesures_qualite_globale | val_qual | 140 | 0,280285714 / 0,182571429 / 0,145285714 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PO43- | PO4³- | idp_2024_mesures_qualite_globale | val_qual | 139 | 6,368 / 5,403 / 1,05 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| SO4-- | SO4²- | idp_2024_mesures_qualite_globale | val_qual | 129 | 85,7 / 82,2 / 78,45 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| DBO5 | DBO5 | idp_2024_mesures_qualite_globale | val_qual | 128 | 3,4645 / 1,0555 / 1,3745 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| DCO | DCO | idp_2024_mesures_qualite_globale | val_qual | 116 | 198,24 / 11,328 / 20,768 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NTK | NTK | idp_2024_mesures_qualite_globale | val_qual | 116 | 1,58 / 0,583 / 0,631 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NO2- | NO2- | idp_2024_mesures_qualite_globale | val_qual | 110 | <0,010 / <0.010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NO3-_Spectro | NO3- | idp_2024_mesures_qualite_marche_cadre | val_qual | 106 | 41,1 / 0,708 / 0,127 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Somme cations_meq/l | Som_cations | idp_2024_mesures_qualite_marche_cadre | val_qual | 89 | 9,174320524 / 7,8945857 / 10,98289952 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| somme anions_meq/l | Som_anions | idp_2024_mesures_qualite_marche_cadre | val_qual | 89 | 9,170606537 / 7,765334672 / 10,58835358 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| somme anions_mg/l | Som_anions | idp_2024_mesures_qualite_marche_cadre | val_qual | 89 | 522,197 / 461,44 / 585,346 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| TAC/TACs_meq/l | TAC | idp_2024_mesures_qualite_marche_cadre | val_qual | 87 | 6,5 / 4,2 / 4,5 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Bilan_Ionique | Bilan_Ion | idp_2024_mesures_qualite_marche_cadre | val_qual | 85 | 0,040490623 / 1,650723954 / 3,658071587 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| K+ | K | idp_2024_mesures_qualite_marche_cadre | val_qual | 85 | 1,06 / 0,886 / 19,1 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| K+4 | K | idp_2024_mesures_qualite_marche_cadre | val_qual | 85 | 1,06 / 0,886 / 19,1 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Somme cations_mg/l | Som_cations | idp_2024_mesures_qualite_marche_cadre | val_qual | 85 | 182,76 / 157,886 / 228,1 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| SO42-_IC | SO4²- | idp_2024_mesures_qualite_marche_cadre | val_qual | 84 | 8,09 / 10,8 / 78,4 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NH4+ Spect | NH4+ | idp_2024_mesures_qualite_marche_cadre | val_qual | 82 | 5,04 / 0,264 / 0,104 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Fe | Fe | idp_2024_mesures_qualite_globale | val_qual | 80 | 0,1663 / 3,25 / 2,03 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Mn5 | Mn | idp_2024_mesures_qualite_marche_cadre | val_qual | 80 | <0,050 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NH4+  | NH4+ | idp_2024_mesures_qualite_marche_cadre | val_qual | 80 | 6,48 / 0,339 / 0,134 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NO2- | NO2- | idp_2024_mesures_qualite_globale | val_qual | 79 | 0,432 / 0,08 / 0,074 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Mg++ | Mg | idp_2024_mesures_qualite_marche_cadre | val_qual | 76 | 10,9 / 9,7 / 21,1 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| TAC/TACs_°F | TAC | idp_2024_mesures_qualite_marche_cadre | val_qual | 71 | 32,5 / 22,5 / 32,3 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| CT | CT | idp_2024_mesures_qualite_marche_cadre | val_qual | 61 | 1,5.104 / 2,5.106 / 3,8.102 | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| SF | SF | idp_2024_mesures_qualite_marche_cadre | val_qual | 54 | 1,3.103 / 2,6.105 / 1,8.102 | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| CF | CF | idp_2024_mesures_qualite_marche_cadre | val_qual | 52 | 2,9.103 / 5,4.105 / 1,5.102 | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| Cl-_IC | Cl- | idp_2024_mesures_qualite_marche_cadre | val_qual | 49 | 64,9 / 56,2 / 74,2 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Huiles Graisses | HG | idp_2024_mesures_qualite_globale | val_qual | 49 | 0,769 / 17,9 / 5,9 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NO2- _Spectro. | NO2- | idp_2024_mesures_qualite_marche_cadre | val_qual | 49 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Ca++ | Ca | idp_2024_mesures_qualite_marche_cadre | val_qual | 47 | 91,4 / 88,2 / 17,6 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PT | PT | idp_2024_mesures_qualite_marche_cadre | val_qual | 47 | 4,49 / 0,303 / 9,55 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Ag | Ag | idp_2024_mesures_qualite_globale | val_qual | 46 | <0,010 / <0,0067 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| As | As | idp_2024_mesures_qualite_globale | val_qual | 46 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Fe | Fe | idp_2024_mesures_qualite_marche_cadre | val_qual | 46 | 0,156 / 0,082 / 0,09 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Se | Se | idp_2024_mesures_qualite_globale | val_qual | 46 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Al | Al | idp_2024_mesures_qualite_globale | val_qual | 45 | 0,2917 / 0,3252 / 0,2217 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Ba | Ba | idp_2024_mesures_qualite_globale | val_qual | 45 | 0,0781 / 0,0167 / 0,0213 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Be | Be | idp_2024_mesures_qualite_globale | val_qual | 45 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Co | Co | idp_2024_mesures_qualite_globale | val_qual | 45 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Sb | Sb | idp_2024_mesures_qualite_globale | val_qual | 45 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Cd | Cd | idp_2024_mesures_qualite_globale | val_qual | 44 | <0,0005 / <0,001 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Mn | Mn | idp_2024_mesures_qualite_globale | val_qual | 44 | 0,052 / 0,0191 / 0,0107 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| MES | MES | idp_2024_mesures_qualite_globale | val_qual | 41 | 16,1 / 50,4 / 43,1 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NH4+  | NH4+ | idp_2024_mesures_qualite_marche_cadre | val_qual | 41 | <0,020 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NH4+ Spect | NH4+ | idp_2024_mesures_qualite_marche_cadre | val_qual | 41 | <0,016 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| TH | TH | idp_2024_mesures_qualite_marche_cadre | val_qual | 41 | 36,5 / 31,5 / 28,5 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Mo | MO / Mo | idp_2024_mesures_qualite_globale | val_qual | 40 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NO2- _Spectro. | NO2- | idp_2024_mesures_qualite_marche_cadre | val_qual | 40 | 0,036 / 0,01 / 0,114 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Na+ | Na | idp_2024_mesures_qualite_marche_cadre | val_qual | 40 | 42,5 / 43,1 / 96,5 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PO43- | PO4³- | idp_2024_mesures_qualite_marche_cadre | val_qual | 40 | 1,62 / 0,052 / 5,06 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Na+3 | Na | idp_2024_mesures_qualite_marche_cadre | val_qual | 39 | 42,5 / 43,1 / 96,5 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Phénol | Phenol | idp_2024_mesures_qualite_globale | val_qual | 39 | 0,089 / 0,065 / 0,014 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| MEST Filtr | MES | idp_2024_mesures_qualite_marche_cadre | val_qual | 38 | 45,7 / 37,5 / 26,6 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| IP | Phenol | idp_2024_mesures_qualite_marche_cadre | val_qual | 37 | <0,45 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| PO43- | PO4³- | idp_2024_mesures_qualite_marche_cadre | val_qual | 37 | <0,02 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NTK Spectr | NTK | idp_2024_mesures_qualite_marche_cadre | val_qual | 34 | 60,5 / 1,43 / 1,86 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Phénol | Phenol | idp_2024_mesures_qualite_globale | val_qual | 33 | <0.01 / <0.065 / <0,065 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| DBO5 | DBO5 | idp_2024_mesures_qualite_marche_cadre | val_qual | 32 | 60,8 / 1,85 / 1,53 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Fe | Fe | idp_2024_mesures_qualite_marche_cadre | val_qual | 32 | <0,050 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Chl a | Chla | idp_2024_mesures_qualite_marche_cadre | val_qual | 31 | 86,4 / 25,92 / 32,4 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Cu | Cu | idp_2024_mesures_qualite_globale | val_qual | 31 | 0,0113 / 0,017 / 0,022 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| TAC_meq/l | TAC | idp_2024_mesures_qualite_globale | val_qual | 31 | 4,9 / 9,7 / 7,34 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| CrT | Cr | idp_2024_mesures_qualite_globale | val_qual | 30 | 0,0101 / 0,0385 / 0,0198 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PT | PT | idp_2024_mesures_qualite_marche_cadre | val_qual | 30 | <0,05 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Pb | Pb | idp_2024_mesures_qualite_globale | val_qual | 30 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Mn | Mn | idp_2024_mesures_qualite_globale | val_qual | 29 | <0,005 / <0,050 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Na+ | Na | idp_2024_mesures_qualite_globale | val_qual | 29 | 98,9 / 76,4 / 90,4 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Sn | Sn | idp_2024_mesures_qualite_globale | val_qual | 29 | 0,0151 / 0,0567 / 0,0106 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Zn | Zn | idp_2024_mesures_qualite_globale | val_qual | 29 | 0,0113 / 0,0715 / 0,0898 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Bilan_Ionique | Bilan_Ion | idp_2024_mesures_qualite_globale | val_qual | 28 | 3,750072287 / 3,102461377 / 3,298896337 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Fe2+ | Fe | idp_2024_mesures_qualite_marche_cadre | val_qual | 28 | <0,050 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Ni | Ni | idp_2024_mesures_qualite_globale | val_qual | 28 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| TAC_°F | TAC | idp_2024_mesures_qualite_globale | val_qual | 28 | 24,3 / 48,5 / 36,7 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| somme anions_meq/l3 | Som_anions | idp_2024_mesures_qualite_globale | val_qual | 28 | 25,059986 / 43,08299183 / 58,39430646 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| somme anions_mg/l4 | Som_anions | idp_2024_mesures_qualite_globale | val_qual | 27 | 503,048 / 877,81 / 1200,64 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Cl- | Cl- | idp_2024_mesures_qualite_globale | val_qual | 25 | 269,848 / 85,1 / 79,7 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Hg | HG / Hg | idp_2024_mesures_qualite_globale | val_qual | 24 | <0,00025 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Li | Li | idp_2024_mesures_qualite_globale | val_qual | 24 | 0,0182 / 0,02 / 0,0439 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NO3- | NO3- | idp_2024_mesures_qualite_globale | val_qual | 23 | <0.300 / <0,300 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| PO43- | PO4³- | idp_2024_mesures_qualite_globale | val_qual | 23 | <0,02 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Huiles Graisses | HG | idp_2024_mesures_qualite_globale | val_qual | 22 | <0.377 / <0,377 / <1.7 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| V | V | idp_2024_mesures_qualite_globale | val_qual | 21 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| V | V | idp_2024_mesures_qualite_globale | val_qual | 21 | 0,0076 / 0,0125 / 0,0157 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NH4+  | NH4+ | idp_2024_mesures_qualite_globale | val_qual | 20 | <0,020 / <0,016 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Ni | Ni | idp_2024_mesures_qualite_globale | val_qual | 18 | 0,0188 / 0,0133 / 0,0124 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Fe | Fe | idp_2024_mesures_qualite_globale | val_qual | 17 | <0,050 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NTK Titri | NTK | idp_2024_mesures_qualite_marche_cadre | val_qual | 17 | 60,48 / 41,4 / 40,88 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| indice de phénol M:A  | Phenol | idp_2024_mesures_qualite_marche_cadre | val_qual | 17 | 0,015 / 0,01 / 0,02 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| CrT | Cr | idp_2024_mesures_qualite_globale | val_qual | 16 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| DCO | DCO | idp_2024_mesures_qualite_globale | val_qual | 16 | <14,1 / <8,10 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Huiles Graisses (H G T) | HG | idp_2024_mesures_qualite_marche_cadre | val_qual | 16 | 2,95 / 2,58 / 1,91 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| MEST Filtr | MES | idp_2024_mesures_qualite_marche_cadre | val_qual | 16 | <3,11 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Pb | Pb | idp_2024_mesures_qualite_globale | val_qual | 16 | 0,0101 / 0,014 / 0,015 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Cu | Cu | idp_2024_mesures_qualite_globale | val_qual | 15 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| IP | Phenol | idp_2024_mesures_qualite_globale | val_qual | 14 | <0,45 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NH4+ 2 | NH4+ | idp_2024_mesures_qualite_marche_cadre | val_qual | 14 | 50,1 / 36,4 / 72,8 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Cond 25°C | Cond | idp_2024_mesures_qualite_marche_cadre | val_qual | 13 | 1929,564 / 1314,648 / 1113,768 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Cond 25°C *0,9*0,01  | à confirmer | idp_2024_mesures_qualite_marche_cadre | val_qual | 13 | 17,366076 / 11,831832 / 10,023912 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Cond 25°C *1,1*0,01  | à confirmer | idp_2024_mesures_qualite_marche_cadre | val_qual | 13 | 21,225204 / 14,461128 / 12,251448 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| DCO | DCO | idp_2024_mesures_qualite_marche_cadre | val_qual | 13 | 26,9 / 11,5 / 76,8 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| IP | Phenol | idp_2024_mesures_qualite_marche_cadre | val_qual | 13 | 0,667 / 1,87 / 2,93 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Sn | Sn | idp_2024_mesures_qualite_globale | val_qual | 13 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Zn | Zn | idp_2024_mesures_qualite_globale | val_qual | 13 | <0,010 / <0,00025 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Tl | Tl | idp_2024_mesures_qualite_globale | val_qual | 12 | 0,014 / 0,0181 / 0,0501 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| IP | Phenol | idp_2024_mesures_qualite_globale | val_qual | 11 | 2,962962963 / 2,238683128 / 1,245901639 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Fe2+ | Fe | idp_2024_mesures_qualite_marche_cadre | val_qual | 10 | 0,074 / 0,054 / 0,078 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Huiles Graisses (H G T) | HG | idp_2024_mesures_qualite_marche_cadre | val_qual | 10 | <0,377 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Li | Li | idp_2024_mesures_qualite_globale | val_qual | 10 | <0,020 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| PT | PT | idp_2024_mesures_qualite_globale | val_qual | 10 | <0,05 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| indice de phénol M:A  | Phenol | idp_2024_mesures_qualite_marche_cadre | val_qual | 10 | <0,01 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Arsenic | As | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Cadmium | Cd | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | <0,0005 / <0,001 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Cobalt | Co | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Fer | Fe | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | 0,0882 / 0,0427 / 0,063 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Mercure | Hg | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | <0,00025 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Mn5 | Mn | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | 0,448 / 0,166 / 0,111 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Plomb | Pb | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Sélénium | Se | idp_2024_mesures_qualite_marche_cadre | val_qual | 8 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Chrome | Cr | idp_2024_mesures_qualite_marche_cadre | val_qual | 7 | <0,005 / <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Hg | HG / Hg | idp_2024_mesures_qualite_globale | val_qual | 7 | 0,0004242 / 0,0002614 / 0,00036 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Nickel | Ni | idp_2024_mesures_qualite_marche_cadre | val_qual | 7 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Chl a | Chla | idp_2024_mesures_qualite_marche_cadre | val_qual | 6 | <0,1 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Mo | MO / Mo | idp_2024_mesures_qualite_globale | val_qual | 6 | 0,0102 / 0,0205 / 0,0117 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NO3-_Spectro | NO3- | idp_2024_mesures_qualite_marche_cadre | val_qual | 6 | <0,300 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Fe2+ | Fe | idp_2024_mesures_qualite_globale | val_qual | 5 | 0,0171 / 0,131 / 0,1909 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Sr | Sr | idp_2024_mesures_qualite_globale | val_qual | 5 | 0,1099 / 0,1479 / 0,3742 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Bilan_Ionique | Bilan_Ion | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 |  | EMPTY_VALUE | ne pas migrer tant que la règle NULL n'est pas validée | QUARANTINE_BEFORE_MIGRATION |
| Cuivre | Cu | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | <0,005 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Cuivre | Cu | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | 0,011 / 0,017 / 0,0056 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| DCO  2h décant. | DCO | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | 9,6 / 15,4 / 19,2 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| NO3-_Réduction Cd | NO3- | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | 0,127 / 3,55 / 3,3 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PT  décant. 2h | PT | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | 0,292 / 0,364 / 0,503 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PT DECANTE | PT | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 |  | EMPTY_VALUE | ne pas migrer tant que la règle NULL n'est pas validée | QUARANTINE_BEFORE_MIGRATION |
| Zinc | Zn | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Zinc | Zn | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | 0,0154 / 0,019 / 0,0501 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| pH au laboratoire | pH | idp_2024_mesures_qualite_marche_cadre | val_qual | 4 | (*) NM = Disque de secchi n'est pas mesuré, l'accès est difficile. / (*) Interférence probable des ions chlorures sur l'analyse de la DCO. | TEXT_VALUE | texte ou unité mélangée -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| DBO5 | DBO5 | idp_2024_mesures_qualite_globale | val_qual | 3 | * | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| DCO | DCO | idp_2024_mesures_qualite_marche_cadre | val_qual | 3 | <8,10 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| HCO3 | HCO3- | idp_2024_mesures_qualite_marche_cadre | val_qual | 3 | 81,7 / 185,4 / 17,1 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| MES | MES | idp_2024_mesures_qualite_globale | val_qual | 3 | <3,11 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| pH au laboratoire | pH | idp_2024_mesures_qualite_marche_cadre | val_qual | 3 |  | EMPTY_VALUE | ne pas migrer tant que la règle NULL n'est pas validée | QUARANTINE_BEFORE_MIGRATION |
| Cd | Cd | idp_2024_mesures_qualite_globale | val_qual | 2 | 0,0024 / 0,0013 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| DBO5 | DBO5 | idp_2024_mesures_qualite_globale | val_qual | 2 | <0,2 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| DCO | DCO | idp_2024_mesures_qualite_marche_cadre | val_qual | 2 | 288 (*) / 192 (*) | NON_PARSEABLE | valeur non directement interprétable -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| DCO  D   2h | DCO | idp_2024_mesures_qualite_globale | val_qual | 2 | 74,88 / 53,76 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Mn | Mn | idp_2024_mesures_qualite_marche_cadre | val_qual | 2 | <0,050 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NH4+  Titri | NH4+ | idp_2024_mesures_qualite_marche_cadre | val_qual | 2 | 5,04 / 21,84 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| PT | PT | idp_2024_mesures_qualite_globale | val_qual | 2 | 0,819 déctanté / 3,84 (déctanté) | TEXT_VALUE | texte ou unité mélangée -> quarantaine | QUARANTINE_BEFORE_MIGRATION |
| Tl | Tl | idp_2024_mesures_qualite_globale | val_qual | 2 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Al | Al | idp_2024_mesures_qualite_globale | val_qual | 1 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Ba | Ba | idp_2024_mesures_qualite_globale | val_qual | 1 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| CO3 | CO3²- | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | 6,24 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Chrome | Cr | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | 0,009 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Co | Co | idp_2024_mesures_qualite_globale | val_qual | 1 | 0,0245 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| DBO5 | DBO5 | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | <0,2 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Fe2+ | Fe | idp_2024_mesures_qualite_globale | val_qual | 1 | <0,010 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| NTK | NTK | idp_2024_mesures_qualite_globale | val_qual | 1 | <0,2 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| Nickel | Ni | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | 0,022 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| Sb | Sb | idp_2024_mesures_qualite_globale | val_qual | 1 | 0,0109 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| TA/Tas_meq/l | TA | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | 0,104 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| TA/Tas_°F | TA | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | 0,52 | DECIMAL_COMMA | convertir la virgule en point | OK_WITH_FLAG |
| TAC/TACs_meq/l | TAC | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | <0,40 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
| TAC/TACs_°F | TAC | idp_2024_mesures_qualite_marche_cadre | val_qual | 1 | <2,0 | BELOW_DETECTION_LIMIT | <x -> valeur_num = x + flag BELOW_DETECTION_LIMIT après validation métier | OK_WITH_FLAG |
