# Validation des paramètres qualité - format long

Ce rapport analyse `quality_long_format_preview.csv`. Les statuts proposés sont des recommandations, pas des décisions métier.

## Champs candidats observés dans la prévisualisation

| champ | statut proposé | commentaires |
| --- | --- | --- |
| n_enregest | EXCLUDE | non_null=4955; non_numeric=4955; examples=180-999-1-8; 180-999-3-8; 180-999-7-7; 180-999-2-8; 180-999-6-7 |
| n_indice | EXCLUDE | non_null=2419; non_numeric=0; examples=13; 14; 8; 3; 15 |
| n_ordre | EXCLUDE | non_null=2712; non_numeric=520; examples=1190; 1293; 1270; 1150; 1757 |
| observatio | TO_VALIDATE | non_null=15; non_numeric=15; examples=Décanté 2h; pH au laboratoire est < 8,30; (*) NM = Disque de secchi n'est pas mesuré, l'accès est difficile.; (*) Interférence probable des ions chlorures sur l'analyse de la DCO. |
| parametre_ | TO_VALIDATE | non_null=4955; non_numeric=4955; examples=IP; NH4+ Spect; NH4+; RS mesuré_à 105 °C; NO2- _Spectro. |
| val_qual | TO_VALIDATE | non_null=4944; non_numeric=1057; examples=<0,45; <0,016; <0,020; 575; <0,010 |

## Paramètres analytiques détectés

| raw_parameter_code | valeurs non nulles | exemples | type détecté | valeurs non numériques | groupe proposé | unité canonique proposée | statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ag | 8 | <0,010 | text | <0,010 (8) | à valider | à valider | TO_VALIDATE |
| Al | 8 | 0,2917; 0,3252; 0,2217; 0,3283; 0,1049 | numeric | <0,010 (1) | à valider | à valider | TO_VALIDATE |
| Arsenic | 8 | <0,005; <0,010 | text | <0,005 (7); <0,010 (1) | à valider | à valider | TO_VALIDATE |
| As | 8 | <0,005 | text | <0,005 (8) | à valider | à valider | TO_VALIDATE |
| Ba | 8 | 0,0781; 0,0167; 0,0213; 0,1225; 0,0578 | numeric |  | à valider | à valider | TO_VALIDATE |
| Be | 8 | <0,005 | text | <0,005 (8) | à valider | à valider | TO_VALIDATE |
| Bilan_Ionique | 86 | 0,040490623; 1,650723954; 3,658071587; 1,753810824; 1,157619032 | numeric |  | à valider | à valider | TO_VALIDATE |
| CF | 145 | 30; 0; 2,9.103; 22; 14 | text | 1,5.103 (2); 1,1.103 (2); 1,8.102 (2); 3,8.102 (2); 1,6x106 (2); 2,9.103 (1); 5,4.105 (1); 1,5.102 (1) | à valider | à valider | TO_VALIDATE |
| CO3 | 94 | 0; 6,24 | numeric |  | à valider | à valider | TO_VALIDATE |
| CT | 146 | 80; 0; 1,5.104; 45; 55 | text | 1,5.104 (2); 3,9.104 (2); 3,1.104 (2); 2,5.102 (2); 9,0.102 (2); 2,4.104 (2); 3,5x103 (2); 1,1x107 (2) | à valider | à valider | TO_VALIDATE |
| Ca++ | 146 | 128; 104; 91,4; 85; 88,2 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Cadmium | 8 | <0,0005; <0,001 | text | <0,0005 (7); <0,001 (1) | chimie_minerale | mg/L | VALIDABLE |
| Cd | 8 | <0,0005 | text | <0,0005 (8) | à valider | à valider | TO_VALIDATE |
| Chl a | 38 | 459; 86,4; 25,92; 32,4; 1,62 | numeric | <0,1 (6) | à valider | à valider | TO_VALIDATE |
| Chrome | 8 | <0,005; 0,009; <0,010 | text | <0,005 (6); <0,010 (1) | à valider | à valider | TO_VALIDATE |
| Cl- | 57 | 9005; 189; 163; 155; 156 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Cl-_IC | 127 | 64,9; 56,2; 316; 106; 11413 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Co | 8 | <0,005 | text | <0,005 (8) | à valider | à valider | TO_VALIDATE |
| Cobalt | 8 | <0,005; <0,010 | text | <0,005 (7); <0,010 (1) | à valider | à valider | TO_VALIDATE |
| Cond 25°C *0,9*0,01 | 13 | 17,366076; 11,831832; 10,023912; 7,794144; 5,865696 | numeric |  | physicochimie | µS/cm | VALIDABLE |
| Cond 25°C *1,1*0,01 | 13 | 21,225204; 14,461128; 12,251448; 9,526176; 7,169184 | numeric |  | physicochimie | µS/cm | VALIDABLE |
| Cond25°C | 13 | 1929,564; 1314,648; 1113,768; 866,016; 651,744 | numeric |  | physicochimie | µS/cm | VALIDABLE |
| CrT | 8 | <0,005; 0,0101 | text | <0,005 (7) | à valider | à valider | TO_VALIDATE |
| Cu | 8 | <0,005 | text | <0,005 (8) | à valider | à valider | TO_VALIDATE |
| Cuivre | 8 | <0,005; 0,011; 0,017; 0,0056; 0,0171 | text | <0,005 (4) | à valider | à valider | TO_VALIDATE |
| DBO5 | 91 | 60,8; 1,85; 1,53; 1,4; 1,06 | numeric | * (3); <0,2 (1) | pollution_organique_nutriments | mg/L | VALIDABLE |
| DCO | 98 | 225; 26,9; 11,5; 319; 303 | numeric | <14,1 (11); <8,10 (3); 288 (*) (1); 192 (*) (1) | pollution_organique_nutriments | mg/L | VALIDABLE |
| DCO 2h décant. | 4 | 9,6; 15,4; 19,2; 53,8 | numeric |  | pollution_organique_nutriments | mg/L | VALIDABLE |
| Fe | 107 | <0,050; 0,156; 0,082; 0,09; 0,128 | text | <0,050 (36) | à valider | à valider | TO_VALIDATE |
| Fe2+ | 38 | <0,050; 0,074; 0,054; 0,078; 0,255 | text | <0,050 (28) | à valider | à valider | TO_VALIDATE |
| Fer | 8 | 0,0882; 0,0427; 0,063; 0,278; 0,053 | numeric |  | à valider | à valider | TO_VALIDATE |
| HCO3 | 94 | 397; 256; 275; 394; 417 | numeric |  | à valider | à valider | TO_VALIDATE |
| Hg | 3 | <0,00025 | text | <0,00025 (3) | à valider | à valider | TO_VALIDATE |
| HuilesGraisses | 24 | 0,769; 17,9; 5,9; <0.377; 0,69 | numeric | <0.377 (5); <0,377 (1) | à valider | à valider | TO_VALIDATE |
| HuilesGraisses (H G T) | 27 | 2,95; 2,58; 3; 1,91; 2,36 | text | <0,377 (10) | à valider | à valider | TO_VALIDATE |
| IP | 55 | <0,45; 0,667; 1,87; 2,93; 0,8 | text | <0,45 (37) | à valider | à valider | TO_VALIDATE |
| K+ | 146 | 1,06; 0,886; 19,1; 1,04; 0,264 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| K+4 | 89 | 1,06; 0,886; 19,1; 1,04; 0,264 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Li | 7 | 0,0182; 0,02; 0,0439; 0,0265; 0,0236 | numeric |  | à valider | à valider | TO_VALIDATE |
| MES | 52 | 107; 16,1; 50,4; 43,1; 35,9 | numeric |  | pollution_organique_nutriments | mg/L | VALIDABLE |
| MEST Filtr | 77 | 149; 45,7; 110; 316; 280 | numeric | <3,11 (16) | pollution_organique_nutriments | mg/L | VALIDABLE |
| Mercure | 8 | <0,00025 | text | <0,00025 (8) | à valider | à valider | TO_VALIDATE |
| Mg++ | 146 | 10,9; 9,7; 21,1; 9,2; 15,8 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Mn | 15 | <0,050; <0,005; 0,052; 0,0191; 0,0107 | text | <0,050 (6); <0,005 (4) | à valider | à valider | TO_VALIDATE |
| Mn5 | 88 | <0,050; 0,448; 0,166; 0,111; 0,175 | text | <0,050 (80) | à valider | à valider | TO_VALIDATE |
| Mo | 8 | <0,010 | text | <0,010 (8) | à valider | à valider | TO_VALIDATE |
| NH4+ | 184 | <0,020; 6,48; 0,339; 0,134; 72 | numeric | <0,020 (45) | pollution_organique_nutriments | mg/L | VALIDABLE |
| NH4+  Titri | 2 | 5,04; 21,84 | numeric |  | pollution_organique_nutriments | mg/L | VALIDABLE |
| NH4+ 2 | 17 | 50,1; 36,4; 72,8; 61,6; 43,7 | numeric |  | pollution_organique_nutriments | mg/L | VALIDABLE |
| NH4+ Spect | 127 | <0,016; 5,04; 0,264; 0,104; 56 | text | <0,016 (41) | pollution_organique_nutriments | mg/L | VALIDABLE |
| NO2- | 57 | 0,432; 0,08; 0,074; 0,068; 0,072 | text | <0,010 (26); <0.010 (2) | pollution_organique_nutriments | mg/L | VALIDABLE |
| NO2- _Spectro. | 89 | <0,010; 0,036; 0,01; 0,114; 0,178 | text | <0,010 (49) | pollution_organique_nutriments | mg/L | VALIDABLE |
| NO3- | 57 | 9,58; 2,54; 2,48; 2,63; 3,2 | numeric | <0,300 (7); <0.300 (1) | pollution_organique_nutriments | mg/L | VALIDABLE |
| NO3-_Réduction Cd | 4 | 0,127; 3,55; 3,3; 0,057 | numeric |  | pollution_organique_nutriments | mg/L | VALIDABLE |
| NO3-_Spectro | 127 | 41,1; 109; 0,708; 113; 0,127 | numeric | <0,300 (6) | pollution_organique_nutriments | mg/L | VALIDABLE |
| NTK | 52 | 1,58; 0,583; 0,631; 0,612; 0,853 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| NTK Spectr | 39 | 60,5; 1,43; 1,86; 1,22; 1,36 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| NTK Titri | 21 | 60,48; 41,4; 84; 40,88; 81,2 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Na+ | 146 | 42,5; 43,1; 96,5; 97,9; 161 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Na+3 | 89 | 42,5; 43,1; 96,5; 97,9; 161 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Ni | 8 | <0,010 | text | <0,010 (8) | à valider | à valider | TO_VALIDATE |
| Nickel | 8 | <0,010; 0,022 | text | <0,010 (7) | chimie_minerale | mg/L | VALIDABLE |
| OH- | 89 | 0 | numeric |  | à valider | à valider | TO_VALIDATE |
| PO43- | 129 | 1,62; 0,052; 5,06; 0,029; 0,031 | text | <0,02 (52) | pollution_organique_nutriments | mg/L | VALIDABLE |
| PT | 129 | 4,49; 0,303; 9,55; 0,292; 0,364 | numeric | <0,05 (36) | à valider | à valider | TO_VALIDATE |
| PT DECANTE | 0 |  | text |  | chimie_minerale | mg/L | TO_VALIDATE |
| PT décant. 2h | 4 | 0,292; 0,364; 0,503; 3,84 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Pb | 8 | <0,005 | text | <0,005 (8) | à valider | à valider | TO_VALIDATE |
| Phénol | 24 | <0.01; 0,089; 0,065; <0.065; 0,014 | text | <0.01 (8); <0,01 (2); <0.065 (1); <0,065 (1) | physicochimie | à valider | VALIDABLE |
| Plomb | 8 | <0,005; <0,010 | text | <0,005 (7); <0,010 (1) | à valider | à valider | TO_VALIDATE |
| RS mesuré | 5 | 1327; 1689; 1364; 1636; 1733 | numeric |  | pollution_organique_nutriments | mg/L | VALIDABLE |
| RS mesuré_à 105 °C | 50 | 575; 503; 755; 554; 805 | numeric |  | pollution_organique_nutriments | mg/L | VALIDABLE |
| SF | 145 | 12; 0; 1,3.103; 24; 20 | text | 1,5 x 106 (3); 1,5.103 (2); 1,1.103 (2); 2,5.102 (2); 1,0.103 (2); 1,9.102 (2); 2,4.102 (2); 5,6.105 (2) | à valider | à valider | TO_VALIDATE |
| SO4-- | 57 | 1234; 85,7; 82,2; 78,45; 79,3 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| SO42-_IC | 127 | 8,09; 10,8; 78,4; 60,8; 668 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Sb | 8 | <0,010 | text | <0,010 (8) | à valider | à valider | TO_VALIDATE |
| Se | 8 | <0,005 | text | <0,005 (8) | à valider | à valider | TO_VALIDATE |
| Sn | 8 | <0,010 | text | <0,010 (8) | à valider | à valider | TO_VALIDATE |
| Sommecations_meq/l | 89 | 9,174320524; 7,8945857; 10,98289952; 9,281907018; 12,70837836 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Sommecations_mg/l | 89 | 182,76; 157,886; 228,1; 193,14; 265,264 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| Sélénium | 8 | <0,005; <0,010 | text | <0,005 (7); <0,010 (1) | à valider | à valider | TO_VALIDATE |
| TA/Tas_meq/l | 89 | 0; 0,104 | numeric |  | à valider | à valider | TO_VALIDATE |
| TA/Tas_°F | 89 | 0; 0,52 | numeric |  | à valider | à valider | TO_VALIDATE |
| TAC/TACs_meq/l | 89 | 6,5; 4,2; 4,5; 6,46; 6,84 | numeric | <0,40 (1) | à valider | à valider | TO_VALIDATE |
| TAC/TACs_°F | 89 | 32,5; 21; 22,5; 32,3; 34,2 | numeric | <2,0 (1) | à valider | à valider | TO_VALIDATE |
| TAC_meq/l | 5 | 4,9; 9,7; 6; 7,34; 4,3 | numeric |  | à valider | à valider | TO_VALIDATE |
| TAC_°F | 5 | 24,3; 48,5; 30; 36,7; 21,4 | numeric |  | à valider | à valider | TO_VALIDATE |
| TA_meq/l | 5 | 0 | numeric |  | à valider | à valider | TO_VALIDATE |
| TA_°F | 5 | 0 | numeric |  | à valider | à valider | TO_VALIDATE |
| TH | 146 | 36,5; 30; 31,5; 25; 28,5 | numeric |  | chimie_minerale | à valider | VALIDABLE |
| V | 8 | <0,005; 0,0076 | text | <0,005 (7) | à valider | à valider | TO_VALIDATE |
| Zinc | 8 | <0,010; 0,0154; 0,019; 0,0501 | text | <0,010 (4) | à valider | à valider | TO_VALIDATE |
| Zn | 8 | <0,010 | text | <0,010 (8) | à valider | à valider | TO_VALIDATE |
| indice de phénol M:A | 27 | 0,015; <0,01; 0,01; 0,02; 0,022 | text | <0,01 (10) | physicochimie | à valider | VALIDABLE |
| pH au laboratoire | 4 | (*) NM = Disque de secchi n'est pas mesuré, l'accès est difficile.; ; (*) Interférence probable des ions chlorures sur l'analyse de la DCO. | text | (*) NM = Disque de secchi n'est pas mesuré, l'accès est difficile. (2); (*) Interférence probable des ions chlorures sur l'analyse de la DCO. (2) | physicochimie | à valider | VALIDABLE |
| sommeanions_meq/l | 89 | 9,170606537; 7,765334672; 10,58835358; 9,120535008; 12,56211036 | numeric |  | à valider | à valider | TO_VALIDATE |
| sommeanions_meq/l3 | 1 | 25,059986 | numeric |  | à valider | à valider | TO_VALIDATE |
| sommeanions_mg/l | 89 | 522,197; 461,44; 585,346; 499,8225; 671,529 | numeric |  | chimie_minerale | mg/L | VALIDABLE |
| sommeanions_mg/l4 | 1 | 503,048 | numeric |  | chimie_minerale | mg/L | VALIDABLE |

## Paramètres à valider

- Les champs candidats `n_enregest`, `n_ordre`, `n_indice` ressemblent à des identifiants source et doivent rester exclus du référentiel analytique.
- Les paramètres analytiques ci-dessus sont extraits du couple source `parametre_` / `val_qual`.
- Les lignes `TO_VALIDATE` doivent être revues avec le dictionnaire qualité projet avant chargement vers `metadata.ref_parametre_qualite`.
- Les unités sont inférées à partir du code brut et doivent être validées métier.