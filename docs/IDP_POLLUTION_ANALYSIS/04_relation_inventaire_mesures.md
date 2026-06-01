# Relation inventaire - mesures

## Stratégie de rapprochement proposée

1. Niveau 1 : identifiant exact lorsque disponible.
2. Niveau 2 : coordonnées exactes.
3. Niveau 3 : distance <= 10 m.
4. Niveau 4 : nom normalisé + commune.
5. Niveau 5 : arbitrage manuel.

## Table conceptuelle

`inventory_site_id`, `measurement_site_id`, `match_method`, `match_score`, `match_status`, `distance_m`, `comments`.

Nombre total de candidats détectés : `155672`.

| inventory_site_id | measurement_site_id | inventory_name | measurement_name | match_method | match_score | match_status | distance_m | comments |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idp_src_pollution_globale:1 | idp_mesures_qualité_globale_2024:211 | ACH_PDS_R5 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:7 | idp_mesures_qualité_globale_2024:216 | BF_DOM_R1 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:9 | idp_mesures_qualité_globale_2024:200 | Aval Village Galaz | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:10 | idp_mesures_qualité_globale_2024:203 | GIG_DECH_PE1 (Puits LOUPARIS) | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:14 | idp_mesures_qualité_globale_2024:222 | M_DECH_PE3 (Forage IRE 3224/15) | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:15 | idp_mesures_qualité_globale_2024:223 | MTA_PDOM_R4 | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:18 | idp_mesures_qualité_globale_2024:213 | MHA_PDOM1_R2 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:20 | idp_mesures_qualité_globale_2024:242 | REJET ABATTOIR SIDI SIDI BOUKNADEL | REJET R3 EM  (R3: SHZ-DOM1-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:25 | idp_mesures_qualité_globale_2024:93 | REJET ABATTOIR TAOUNATE | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:39 | idp_mesures_qualité_marche_cadre_2024:16 | REJET R3 EM  (R3: SHZ-DOM1-R1) | FORAGE ABD NBI BOUTABEQ | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:39 | idp_mesures_qualité_globale_2024:16 | REJET R3 EM  (R3: SHZ-DOM1-R1) | S1 (Aval_conf_Rejet_MOG (Mograne) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:96 | idp_mesures_qualité_globale_2024:198 | BBT_PDS_R3 (E.M) | REJET R5 (R5: LOD-DOM-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:104 | idp_mesures_qualité_globale_2024:199 | Station Hajria | REJET R4  (R4: SHZ-DOM3-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:105 | idp_mesures_qualité_globale_2024:204 | Amont STEP Taounate | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:106 | idp_mesures_qualité_globale_2024:205 | Aval STEP Taounate | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:107 | idp_mesures_qualité_globale_2024:212 | PA AVAL STEP MHAYA | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:108 | idp_mesures_qualité_globale_2024:201 | AVAL BOULEMANE | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:109 | idp_mesures_qualité_globale_2024:214 | M_DOM_R1 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:110 | idp_mesures_qualité_globale_2024:215 | OZ_DECH_R1 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:111 | idp_mesures_qualité_globale_2024:217 | SDR_PDOM_R1 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:112 | idp_mesures_qualité_globale_2024:218 | ZDA_PDOM_R1 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:113 | idp_mesures_qualité_globale_2024:219 | Z_DECH_PE1 (FORAGE IRE 898/16 AIN BOUCHIBA) | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:114 | idp_mesures_qualité_globale_2024:220 | Z_DECH_PE2 (FORAGE IRE 12/517 AIN BOUCHIBA) | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:115 | idp_mesures_qualité_globale_2024:221 | M_DECH_PE1 (FORAGE IRE 2153/15) | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:116 | idp_mesures_qualité_globale_2024:224 | REJET ABATTOIR ZOUMI | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:117 | idp_mesures_qualité_globale_2024:225 | ZOM_PDOM_R1 | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:118 | idp_mesures_qualité_globale_2024:226 | REJET ABATTOIR OUED AMLIL | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:119 | idp_mesures_qualité_globale_2024:227 | REJET ABATTOIR MOQRISSET | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:120 | idp_mesures_qualité_globale_2024:228 | MOKR_PDOM_R1 | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:121 | idp_mesures_qualité_globale_2024:229 | REJET ABATTOIR GALDMANE | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:122 | idp_mesures_qualité_globale_2024:230 | REJET ABATTOIR BNI FTAH | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:123 | idp_mesures_qualité_globale_2024:231 | REJET ABATTOIR SKOURA MDAZ | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:124 | idp_mesures_qualité_globale_2024:232 | REJET ABATTOIR MATMATA | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:125 | idp_mesures_qualité_globale_2024:233 | REJET ABATTOIR SIDI BOUSBER | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:126 | idp_mesures_qualité_globale_2024:202 | IMM_DECH_PE1 (FORAGE ONEE-BO) | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:127 | idp_mesures_qualité_globale_2024:48 | REJET ABATTOIR AGOURAI | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:128 | idp_mesures_qualité_globale_2024:234 | REJET ABATTOIR SIDI REDOUANE | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:129 | idp_mesures_qualité_globale_2024:235 | REJET ABATTOIR MASMOUDA | REJET R2 EM  (R2: SHZ-DOM2-R2) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:130 | idp_mesures_qualité_globale_2024:206 | REJET BOULEMANE (EM) | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:131 | idp_mesures_qualité_globale_2024:207 | IMK_DOM_R3 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:132 | idp_mesures_qualité_globale_2024:208 | IMK_DEC_PE1 (AMHAOUCHE ISMAIL) | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:133 | idp_mesures_qualité_globale_2024:209 | ACH_PDE(PUITS CARRIERE) | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:134 | idp_mesures_qualité_globale_2024:210 | ACH_PDS_R1 | REJET R1 EM (R1: SHZ-DOM2-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:135 | idp_mesures_qualité_globale_2024:236 | MDZ_PDOM1_PE1 | REJET R3 EM  (R3: SHZ-DOM1-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:136 | idp_mesures_qualité_globale_2024:237 | REJET ABATTOIR MOULAY DRISS ZRHOUN | REJET R3 EM  (R3: SHZ-DOM1-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:137 | idp_mesures_qualité_globale_2024:238 | REJET ABATTOIR BAB MARZOUKA | REJET R3 EM  (R3: SHZ-DOM1-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:138 | idp_mesures_qualité_globale_2024:239 | REJET ABATTOIR TAHLA | REJET R3 EM  (R3: SHZ-DOM1-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:139 | idp_mesures_qualité_globale_2024:240 | REJET ABATTOIR OULED ZBAIR | REJET R3 EM  (R3: SHZ-DOM1-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:140 | idp_mesures_qualité_globale_2024:241 | REJET ABATTOIR GUIGOU | REJET R3 EM  (R3: SHZ-DOM1-R1) | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |
| idp_src_pollution_globale:156 | idp_mesures_qualité_marche_cadre_2024:17 | REJET R1 EP (R1: SHZ-DOM2-R1) | FORAGE ABD NBI BOUTABEQ | ID_EXACT | 1.0 | AUTO_CANDIDATE |  |  |

Le fichier `inventory_measurement_matches.csv` contient la liste complète.
