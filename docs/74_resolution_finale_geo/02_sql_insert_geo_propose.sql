-- ATTENTION : SCRIPT PROPOSE, NON EXECUTE
-- EXECUTION INTERDITE SANS VALIDATION HUMAINE
-- Propositions de creation d'entites geographiques candidates

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: MERJA FOUARATE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AVAL REJET INDUSTRIEL MERJA:874.714m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(393481.000 408618.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S1 (Aval_conf_Rejet_MOG (Mograne) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:aval confluence sebou /beht:155.272m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(404650.000 423453.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S2 (Barrage de garde) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:amont barrage de garde:468.838m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(407303.000 432473.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S3 (Station Pompage Ferme (Amont Bge de garde) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:amont barrage de garde:1902.16m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(408732.000 432361.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S4 (Amont station pompage ferme) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:amont barrage de garde:3544.282m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(410306.000 433218.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S6 (Amont ancien rejet sotrameg) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:Piezometre:815.547m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(411388.000 436987.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S5 (Aval ancien rejet sotrameg) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.point_eau:Forage CHELIK Arbi:2297.945m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(411431.000 434938.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S7 (Aval_Conf_Rejet_SAT (Sidi Allal Tazi) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:SAT_DOM_R1:344.646m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(413977.000 438108.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: Aval STEP (Aval Conf. Chaaba avec Oued Tiflet) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:REJET STEP TIFLET:2365.368m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(415784.000 370014.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S8 (Aval Ferme Agricole sidi kamel) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:brg de garde / sebou:2031.028m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(415869.000 434092.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S9 (Aval douar el fokra (sidi kamel) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit cooperative mesbah:565.809m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(422480.000 434880.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S10 (Aval douar Zehair (sidi kamel) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:IRE 1026/8:3262.749m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(424538.000 441614.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S11 (Amont Fermes Agricole sidi kamel | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.step::4447.757m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(436692.000 445438.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: Amont STEP Khémisset | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:749.979m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(439837.000 360098.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: Aval STEP Khémisset | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:382.873m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(440195.000 360614.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S12 (Aval_Conf_Rejet_MBK_R4 (Mechraa Bel Ksiri) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:aval rejet sucrerie bel ksiri:617.484m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(446067.000 441720.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S13 (Aval_Conf_Rejet_MBK (Mechraa Bel Ksiri) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:MBK_DOM_R3:74.33m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(448680.000 440646.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: PT. O. BEHT AVAL BIORISINE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:SDS_DOM1_R5:16.125m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(451016.000 406792.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL VILLAGE AIT SIBERNE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:RG-AIS-2:985.597m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(451926.000 365389.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S14 (Aval_Conf_Rejet_HFT (Al Haouafate) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:HFT_DOM_R2:549.193m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(453061.000 434317.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S15 (Aval_Conf_Sebou_ Ouagha (Dour El Kbara) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:SMC_DOM_R1:2711.425m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(465664.000 424569.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AMONT SOUK ELAHAD CHEBANATE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AID_DOM1_R4:141.767m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(466002.000 410013.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S16 (Aval_Conf_Rejet_KHN (Khnichet) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.decharge:ancienne decharge du centre khnichet:172.351m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(473049.000 426910.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL AIN KARMA | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AKA_PDOM1_R1:2174.135m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(478488.000 380870.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S23 (Aval_Conf_Rejet_JEM (Jorf el MALHA ) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:JEM_DOM_R3:3590.348m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(485741.000 430051.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL REJET MOULAY DRISS ZARHOUN | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:DDZ_PDOM1_R1:923.576m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(486697.000 384628.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL REJET BOUFEKRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:pont route principale 21:289.848m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(490717.000 356032.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL OUED IFRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:OIF_PDOM1_R1:744.527m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(491102.000 300558.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S26 (Aval_Conf_Rejet_MKS (Mkansa) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:azib soltane:301.789m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(491774.000 413700.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S24 (Douar Chorf laghouazi) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.huilerie:Huilerie Touaress:2203.675m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504514.000 431747.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL STEP EL HAJEB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:HJB_DOM1:642.05m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504570.000 348710.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL AIN LEUH | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:ALH_PDOM1_R4 (E.M):104.995m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504884.000 300497.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: PA Aval Village Tigrigra | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:SID_PDOM1_R2:693.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504961.000 312168.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL STEP AZROU | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:AZR_PDOM1_R1:109.289m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507467.000 313351.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: PA AVAL STEP MHAYA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:MHA_PDOM1:316.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(513291.000 376994.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S25 (Aval_Conf_Rejet_LMJ (Lamjaara) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:Station mjaara ( nÂ°12 ):82.074m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(513544.000 443140.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: RZI_DEC_PE1 (Puits Fouad ELBRINI) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:dÃ©charge route laghouzi:599.761m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(514759.000 421189.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: R-KRB_PDE_P2 | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:dÃ©charge route laghouzi:598.941m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(514760.000 421189.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: ATJ_DECH_PE1 | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.point_eau:Jbel AACHOUR:287.785m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518542.000 364386.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL REJET MOULAY YAACOUB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:my yaacoub:743.424m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(519539.000 388381.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S18 (Aval Sidi Daoud) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:pont rp 26:87.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523147.000 412143.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL STEP IFRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:IFR_PDOM1:630.863m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523437.000 331724.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL REJET AIN CHEGGAG | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:CHG_DOM_R1:482.084m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(532794.000 366268.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S28 (Aval_Conf_Rejet_ORG (Ouartzagh) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:ORG_DOM_R1:1830.908m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(537364.000 436554.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S31 (Aval_Conf_Rejet_LOJ (Loulja) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.huilerie:CoopÃ©rative Al Nasser EL ALAOUI EL TADLI:3122.894m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(537565.000 409952.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S27 (Aval_Conf_Rejet_LOD (Louadaine) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:REJET R5 (R5: LOD-DOM-R2):448.261m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(543094.000 401261.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S20 (Aval STEP Fes) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:JEO_DOM_R1:876.413m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(544486.000 387178.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S22 (Aval_conf_Sebou_ Inaoun) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:LOJ_DOM_R1:5053.928m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(545460.000 406845.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S30 (Aval_Conf_Rejet_SHZ (Sidi Harazem) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_industriel:DÃ©pÃ´t Arab Huiler:1501.632m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(546463.000 384297.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: BHL_DOM_PE1 (PUITS) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:source ammes dechquonda:507.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(548010.000 363937.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AMONT SEFROU | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:eddir elouaar:3398.186m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(548341.000 358673.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S21 (Aval_conf_Leban_ Inaoun | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.mine:ATLAMIR:6465.042m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(552458.000 401649.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: Station Hajria | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:hajria:12.529m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(552856.000 432506.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL REJET SEFROU | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:SEF_DOM_14:1772.217m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(553720.000 361794.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: S29 (Aval_Conf_Rejet_Douar Ouled Jrir | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:ain el ouali:281.428m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(555797.000 377237.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL BOULEMANE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit ait sidi arbi:153.809m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(560909.000 308376.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: TIS_DEC_PE1 (MEHDI OUAZZANI) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.point_eau:Mehdi Ouazani:70.228m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566866.000 409680.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: Amont STEP Taounate | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:89.538m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571757.000 435740.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: Aval STEP Taounate | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:322.932m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571892.000 435379.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL REJET EL MENZEL | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:MNZ_DOM_R4:963.499m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(577329.000 360959.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AMONT STEP OUED AMLIL | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.huilerie:Huile nakhla:545.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(600202.000 406183.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL STEP OUED AMLIL | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:OA_DOM_R1:118.004m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(603267.000 399513.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: IMM_DECH_PE1 (FORAGE ONEE-BO) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:ain tataw:94.428m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(603944.000 320639.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: AVAL VILLAGE BNI AMMART | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:BA_DOM_R1:53.451m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(613904.000 468186.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_globale | Nom: STATION BAB MARZOUKA | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:bab merzouka:20.001m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(615850.000 400850.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: FORAGE ABD NBI BOUTABEQ | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:REJET ABATTOIR SIDI SIDI BOUKNADEL:2472.061m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(381040.000 389473.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: DAYAT SIDI BOUGHABA | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:kasbat mehdia:492.276m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(383102.000 406392.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AMONT STEP KENITRA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:forage:1185.42m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(392546.000 411337.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: DAYAT FOUARATE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AVAL REJET INDUSTRIEL MERJA:874.714m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(393481.000 408618.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS FERME BENNANI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:IRE 915/8 PIEZO ( R 911/8 ):448.16m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(396617.000 425212.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: FORAGE BARRAGE DE GARDE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:amont barrage de garde:191.399m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(406932.000 432666.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AMONT BARRAGE DE GARDE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.point_eau:Forage CHELIK Arbi:1073.786m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(411255.000 436360.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS STATION DAR SALEM | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:dar salem:43.192m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(414129.000 401202.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP SIDI YAHYA EL GHARB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:SYG_DOM1:771.038m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(416810.000 416679.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: LAGUNE MERJA ZARGA (SURFACE) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:la commune:3955.672m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(420051.000 472640.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS MOHAMED CHEHYMA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits mohamed chehyma:28.302m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(427574.000 482265.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: FORAGE SOCHATOUR | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits sochatour:62.584m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(434414.000 478461.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS MOHAMED HASSANI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits mohamed hassani:1203.996m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(437049.000 471403.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: FORAGE ONEP KSAIBIA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:IRE 727/14:830.351m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(438642.000 410539.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AMONT STEP KHEMISSET | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:749.979m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(439837.000 360098.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP KHEMISSET | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:382.873m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(440195.000 360614.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP SIDI SLIMANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:mechraa belksiri:111.037m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(448173.000 410920.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: STATION PONT MECHRAA BEL KSIRI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:MBK_DOM_R6:77.318m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(448223.000 440951.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: FORAGE ONEP BEN AOUDA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:forage onep ben aouda:789.637m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(449723.000 470980.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AMONT STEP MECHRAA BEL KSIRI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:MBK_DOM_R1:85.726m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(452534.000 441554.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP MECHRAA BEL KSIRI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:MBK_DOM_R1:85.726m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(452534.000 441554.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE EL KANSRA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:el kansera:1049.731m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454000.000 382400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE EL KANSRA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:el kansera:1049.731m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454000.000 382400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE EL KANSRA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:el kansera:1049.731m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454000.000 382400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE OULJET SOLTANE (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:ouljet essoltane:181.454m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454917.000 339829.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE OULJET SOLTANE (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:ouljet essoltane:181.454m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454917.000 339829.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE OULJET SOLTANE (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:ouljet essoltane:181.454m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454917.000 339829.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL CONFLUENCE SEBOU-RDAT | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:aval confluence sebou /rdat:929.963m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(458636.000 431756.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP SIDI KACEM | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:ZIR_DOM1:1200.544m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(467580.000 407448.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PONT KHENICHET | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:khenichet:90.441m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(473637.000 426830.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS BADIA SAHLI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.huilerie:AJAMS:1105.273m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(499728.000 456521.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP EL HAJEB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:HJB_DOM1:642.05m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504570.000 348710.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE SIDI ECHAHED (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:sidi chahed:251.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507232.000 389307.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE SIDI ECHAHED (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:sidi chahed:251.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507232.000 389307.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE SIDI ECHAHED (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:sidi chahed:251.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507232.000 389307.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP AZROU | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:AZR_PDOM1_R1:109.289m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507467.000 313351.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS GHOUAZI OUAZZAA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit rhouazi ouled aissa:677.664m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(508686.000 431138.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS FERME BEN ALI (NOUVEAU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:Najji khadija:1163.327m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(515332.000 370251.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE EL WAHDA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg el wahda:249.366m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518602.000 444430.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE EL WAHDA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg el wahda:249.366m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518602.000 444430.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE EL WAHDA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg el wahda:249.366m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518602.000 444430.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP KARIAT BA MOHAMED | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:KBM_PDS_R1:693.479m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(519684.000 418218.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: STATION RP 26 | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:pont rp 26:65.573m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523250.000 412150.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP IFRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:IFR_PDOM1:630.863m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523437.000 331724.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: FORAGE ATTO MILOUD | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits Ã captage non cuvelÃ©:543.947m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(538336.000 366978.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP FES | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:JEO_DOM_R1:195.888m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(543750.000 387094.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PONT PORTUGAIS | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:pont portugais:228.571m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(544238.000 385695.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS SOUK EL HAD (GHAFSAI) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:onep ghafsai:308.105m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(544508.000 449308.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: STATION HAJRIA | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:hajria:12.529m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(552856.000 432506.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE IDRISS 1ER (FOND) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:idriss premier:0.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(559800.000 396000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE IDRISS 1ER (MILIEU) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:idriss premier:0.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(559800.000 396000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE IDRISS 1ER (SURFACE) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:idriss premier:0.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(559800.000 396000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: PUITS AVAL BOULEMANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit ait sidi arbi:264.367m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(560761.000 308387.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE ALLAL EL FASSI (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg allal el fassi:155.71m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566743.000 370400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE ALLAL EL FASSI (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg allal el fassi:155.71m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566743.000 370400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE ALLAL EL FASSI (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg allal el fassi:155.71m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566743.000 370400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE SAHLA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg sahla:1351.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(567500.000 442000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE SAHLA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg sahla:1351.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(567500.000 442000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE SAHLA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg sahla:1351.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(567500.000 442000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AMONT STEP TAOUNATE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:89.538m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571757.000 435740.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP TAOUNATE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:322.932m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571892.000 435379.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE BOUHOUDA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=infra.rejet_domestique:BHD_PDS_R1:1225.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(575900.000 444500.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE BOUHOUDA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=infra.rejet_domestique:BHD_PDS_R1:1225.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(575900.000 444500.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE BOUHOUDA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=infra.rejet_domestique:BHD_PDS_R1:1225.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(575900.000 444500.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP TAHLA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:T_DOM:236.028m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(587570.000 382928.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE BAB LOUTA (FOND) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg bab louta:3.111m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(598322.000 380082.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE BAB LOUTA (MILIEU) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg bab louta:3.111m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(598322.000 380082.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: BARRAGE BAB LOUTA (SURFACE) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg bab louta:3.111m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(598322.000 380082.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: AVAL STEP IMOUZZER MARMOUCHA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:IMM_DOM:2405.569m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(600262.000 314456.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: STATION BAB MARZOUKA | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:bab merzouka:20.001m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(615850.000 400850.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_mesures_qualite_marche_cadre | Nom: POINT RP1 AVAL TAZA | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=geo.source:Rhiran Isaleb:100.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(623250.000 404600.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: MERJA FOUARATE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AVAL REJET INDUSTRIEL MERJA:874.714m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(393481.000 408618.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S1 (Aval_conf_Rejet_MOG (Mograne) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:aval confluence sebou /beht:155.272m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(404650.000 423453.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S2 (Barrage de garde) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:amont barrage de garde:468.838m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(407303.000 432473.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S3 (Station Pompage Ferme (Amont Bge de garde) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:amont barrage de garde:1902.16m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(408732.000 432361.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S4 (Amont station pompage ferme) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:amont barrage de garde:3544.282m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(410306.000 433218.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S6 (Amont ancien rejet sotrameg) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:Piezometre:815.547m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(411388.000 436987.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S5 (Aval ancien rejet sotrameg) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.point_eau:Forage CHELIK Arbi:2297.945m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(411431.000 434938.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S7 (Aval_Conf_Rejet_SAT (Sidi Allal Tazi) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:SAT_DOM_R1:344.646m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(413977.000 438108.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: Aval STEP (Aval Conf. Chaaba avec Oued Tiflet) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:REJET STEP TIFLET:2365.368m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(415784.000 370014.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S8 (Aval Ferme Agricole sidi kamel) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:brg de garde / sebou:2031.028m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(415869.000 434092.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S9 (Aval douar el fokra (sidi kamel) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit cooperative mesbah:565.809m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(422480.000 434880.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S10 (Aval douar Zehair (sidi kamel) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:IRE 1026/8:3262.749m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(424538.000 441614.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S11 (Amont Fermes Agricole sidi kamel | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.step::4447.757m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(436692.000 445438.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: Amont STEP Khémisset | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:749.979m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(439837.000 360098.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: Aval STEP Khémisset | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:382.873m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(440195.000 360614.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S12 (Aval_Conf_Rejet_MBK_R4 (Mechraa Bel Ksiri) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:aval rejet sucrerie bel ksiri:617.484m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(446067.000 441720.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S13 (Aval_Conf_Rejet_MBK (Mechraa Bel Ksiri) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:MBK_DOM_R3:74.33m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(448680.000 440646.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: PT. O. BEHT AVAL BIORISINE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:SDS_DOM1_R5:16.125m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(451016.000 406792.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL SIDI SLIMANE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits Ã captage cuvelÃ©:1715.686m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(451597.000 411757.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL VILLAGE AIT SIBERNE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:RG-AIS-2:985.597m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(451926.000 365389.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S14 (Aval_Conf_Rejet_HFT (Al Haouafate) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:HFT_DOM_R2:549.193m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(453061.000 434317.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S15 (Aval_Conf_Sebou_ Ouagha (Dour El Kbara) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:SMC_DOM_R1:2711.425m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(465664.000 424569.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL SOUK ELAHAD CHEBANATE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:AID_DOM1_R2:352.239m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(465819.000 411026.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AMONT SOUK ELAHAD CHEBANATE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AID_DOM1_R4:141.767m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(466002.000 410013.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S16 (Aval_Conf_Rejet_KHN (Khnichet) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.decharge:ancienne decharge du centre khnichet:172.351m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(473049.000 426910.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL AIN KARMA | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AKA_PDOM1_R1:2174.135m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(478488.000 380870.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL AIN DFALI | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AID_DOM1_R4 (AIN DFALI):982.642m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(484976.000 444828.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S23 (Aval_Conf_Rejet_JEM (Jorf el MALHA ) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:JEM_DOM_R3:3590.348m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(485741.000 430051.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL REJET MOULAY DRISS ZARHOUN | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:DDZ_PDOM1_R1:923.576m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(486697.000 384628.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL REJET BOUFEKRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:pont route principale 21:289.848m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(490717.000 356032.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL OUED IFRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:OIF_PDOM1_R1:744.527m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(491102.000 300558.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S26 (Aval_Conf_Rejet_MKS (Mkansa) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:azib soltane:301.789m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(491774.000 413700.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S24 (Douar Chorf laghouazi) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.huilerie:Huilerie Touaress:2203.675m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504514.000 431747.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL STEP EL HAJEB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:HJB_DOM1:642.05m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504570.000 348710.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL AIN LEUH | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:ALH_PDOM1_R4 (E.M):104.995m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504884.000 300497.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: PA Aval Village Tigrigra | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:SID_PDOM1_R2:693.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504961.000 312168.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AMONT STEP El Hajeb | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:HJB_DOM1:1238.008m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(505266.000 347101.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL STEP AZROU | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:AZR_PDOM1_R1:109.289m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507467.000 313351.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: PA AVAL STEP MHAYA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:MHA_PDOM1:316.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(513291.000 376994.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S25 (Aval_Conf_Rejet_LMJ (Lamjaara) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:Station mjaara ( nÂ°12 ):82.074m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(513544.000 443140.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: RZI_DEC_PE1 (Puits Fouad ELBRINI) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:dÃ©charge route laghouzi:599.761m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(514759.000 421189.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: R-KRB_PDE_P2 | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:dÃ©charge route laghouzi:598.941m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(514760.000 421189.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: ATJ_DECH_PE1 | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.point_eau:Jbel AACHOUR:287.785m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518542.000 364386.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL REJET MOULAY YAACOUB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:my yaacoub:743.424m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(519539.000 388381.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S18 (Aval Sidi Daoud) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:pont rp 26:87.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523147.000 412143.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL STEP IFRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:IFR_PDOM1:630.863m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523437.000 331724.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL REJET AIN CHEGGAG | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:CHG_DOM_R1:482.084m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(532794.000 366268.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S28 (Aval_Conf_Rejet_ORG (Ouartzagh) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:ORG_DOM_R1:1830.908m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(537364.000 436554.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S31 (Aval_Conf_Rejet_LOJ (Loulja) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.huilerie:CoopÃ©rative Al Nasser EL ALAOUI EL TADLI:3122.894m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(537565.000 409952.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S27 (Aval_Conf_Rejet_LOD (Louadaine) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=qualite.source_pollution_prelevement:REJET R5 (R5: LOD-DOM-R2):448.261m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(543094.000 401261.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S20 (Aval STEP Fes) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:JEO_DOM_R1:876.413m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(544486.000 387178.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S22 (Aval_conf_Sebou_ Inaoun) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:LOJ_DOM_R1:5053.928m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(545460.000 406845.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S30 (Aval_Conf_Rejet_SHZ (Sidi Harazem) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_industriel:DÃ©pÃ´t Arab Huiler:1501.632m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(546463.000 384297.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: BHL_DOM_PE1 (PUITS) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:source ammes dechquonda:507.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(548010.000 363937.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AMONT SEFROU | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:eddir elouaar:3398.186m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(548341.000 358673.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S21 (Aval_conf_Leban_ Inaoun | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.mine:ATLAMIR:6465.042m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(552458.000 401649.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: Station Hajria | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:hajria:12.529m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(552856.000 432506.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL REJET SEFROU | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:SEF_DOM_14:1772.217m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(553720.000 361794.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: Aval Village Galaz | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_abattoir::1022.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(554587.000 436637.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: S29 (Aval_Conf_Rejet_Douar Ouled Jrir | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=api.v_station_dimension:ain el ouali:281.428m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(555797.000 377237.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL BOULEMANE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit ait sidi arbi:153.809m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(560909.000 308376.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: TIS_DEC_PE1 (MEHDI OUAZZANI) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.point_eau:Mehdi Ouazani:70.228m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566866.000 409680.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: Amont STEP Taounate | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:89.538m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571757.000 435740.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: Aval STEP Taounate | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:322.932m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571892.000 435379.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL REJET EL MENZEL | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=rejet, nearest=infra.rejet_domestique:MNZ_DOM_R4:963.499m
-- INSERT INTO qualite.source_pollution_prelevement (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(577329.000 360959.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AMONT STEP OUED AMLIL | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.huilerie:Huile nakhla:545.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(600202.000 406183.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL STEP OUED AMLIL | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:OA_DOM_R1:118.004m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(603267.000 399513.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: IMM_DECH_PE1 (FORAGE ONEE-BO) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:ain tataw:94.428m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(603944.000 320639.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: AVAL VILLAGE BNI AMMART | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:BA_DOM_R1:53.451m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(613904.000 468186.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_globale | Nom: STATION BAB MARZOUKA | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:bab merzouka:20.001m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(615850.000 400850.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE ABD NBI BOUTABEQ | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:REJET ABATTOIR SIDI SIDI BOUKNADEL:2472.061m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(381040.000 389473.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: DAYAT SIDI BOUGHABA | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:kasbat mehdia:492.276m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(383102.000 406392.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AMONT STEP KENITRA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:forage:1185.42m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(392546.000 411337.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: DAYAT FOUARATE | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=qualite.source_pollution_prelevement:AVAL REJET INDUSTRIEL MERJA:874.714m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(393481.000 408618.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS FERME BENNANI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:IRE 915/8 PIEZO ( R 911/8 ):448.16m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(396617.000 425212.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE BARRAGE DE GARDE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:amont barrage de garde:191.399m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(406932.000 432666.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE FERME MED SQALI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:forage:142.62m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(411145.000 457853.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AMONT BARRAGE DE GARDE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.point_eau:Forage CHELIK Arbi:1073.786m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(411255.000 436360.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS STATION DAR SALEM | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:dar salem:43.192m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(414129.000 401202.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP SIDI YAHYA EL GHARB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:SYG_DOM1:771.038m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(416810.000 416679.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: LAGUNE MERJA ZARGA (SURFACE) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.decharge:la commune:3955.672m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(420051.000 472640.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE FERME HERATI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:IRE 1026/8:943.004m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(426317.000 439663.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS MOHAMED CHEHYMA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits mohamed chehyma:28.302m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(427574.000 482265.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL DAR GUEDDARI | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:aval dar gueddari:973.265m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(434398.000 425035.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE SOCHATOUR | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits sochatour:62.584m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(434414.000 478461.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS MOHAMED HASSANI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits mohamed hassani:1203.996m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(437049.000 471403.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP DAR GUEDDARI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.decharge:dar el gueddari:733.297m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(437704.000 426402.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE ONEP KSAIBIA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:IRE 727/14:830.351m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(438642.000 410539.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AMONT STEP KHEMISSET | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:749.979m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(439837.000 360098.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP KHEMISSET | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:RG-KHM-1:382.873m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(440195.000 360614.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE DRISS NAISSA (CDA 224 BEL KSIRI) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:forage:693.019m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(445122.000 440707.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP SIDI SLIMANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:mechraa belksiri:111.037m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(448173.000 410920.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: STATION PONT MECHRAA BEL KSIRI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:MBK_DOM_R6:77.318m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(448223.000 440951.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE ONEP BEN AOUDA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:forage onep ben aouda:789.637m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(449723.000 470980.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AMONT STEP MECHRAA BEL KSIRI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:MBK_DOM_R1:85.726m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(452534.000 441554.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP MECHRAA BEL KSIRI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:MBK_DOM_R1:85.726m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(452534.000 441554.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE EL KANSRA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:el kansera:1049.731m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454000.000 382400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE EL KANSRA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:el kansera:1049.731m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454000.000 382400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE EL KANSRA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:el kansera:1049.731m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454000.000 382400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE OULJET SOLTANE (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:ouljet essoltane:181.454m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454917.000 339829.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE OULJET SOLTANE (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:ouljet essoltane:181.454m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454917.000 339829.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE OULJET SOLTANE (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:ouljet essoltane:181.454m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(454917.000 339829.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL CONFLUENCE SEBOU-RDAT | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:aval confluence sebou /rdat:929.963m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(458636.000 431756.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE COLONEL ALLAM | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits Ã cuvelÃ©:336.691m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(461128.000 411476.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS ALLAL ZOUHRI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.rejet_domestique:AID_DOM1_R2:405.08m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(465624.000 410619.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP SIDI KACEM | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:ZIR_DOM1:1200.544m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(467580.000 407448.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PONT KHENICHET | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:khenichet:90.441m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(473637.000 426830.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS BADIA SAHLI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=infra.huilerie:AJAMS:1105.273m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(499728.000 456521.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP EL HAJEB | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:HJB_DOM1:642.05m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(504570.000 348710.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE SIDI ECHAHED (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:sidi chahed:251.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507232.000 389307.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE SIDI ECHAHED (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:sidi chahed:251.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507232.000 389307.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE SIDI ECHAHED (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:sidi chahed:251.369m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507232.000 389307.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP AZROU | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=qualite.source_pollution_prelevement:AZR_PDOM1_R1:109.289m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(507467.000 313351.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS GHOUAZI OUAZZAA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit rhouazi ouled aissa:677.664m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(508686.000 431138.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS FERME BEN ALI (NOUVEAU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:Najji khadija:1163.327m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(515332.000 370251.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE EL WAHDA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg el wahda:249.366m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518602.000 444430.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE EL WAHDA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg el wahda:249.366m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518602.000 444430.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE EL WAHDA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg el wahda:249.366m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(518602.000 444430.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP KARIAT BA MOHAMED | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:KBM_PDS_R1:693.479m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(519684.000 418218.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: STATION RP 26 | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:pont rp 26:65.573m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523250.000 412150.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP IFRANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:IFR_PDOM1:630.863m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(523437.000 331724.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: STATION TABOUDA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:tabouda:251.831m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(524250.000 461600.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: FORAGE ATTO MILOUD | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puits Ã captage non cuvelÃ©:543.947m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(538336.000 366978.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP FES | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:JEO_DOM_R1:195.888m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(543750.000 387094.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PONT PORTUGAIS | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:pont portugais:228.571m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(544238.000 385695.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS SOUK EL HAD (GHAFSAI) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:onep ghafsai:308.105m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(544508.000 449308.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AMONT STEP GHAFSAI | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:onep ghafsai:341.316m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(544536.000 449360.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: STATION HAJRIA | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:hajria:12.529m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(552856.000 432506.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE IDRISS 1ER (FOND) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:idriss premier:0.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(559800.000 396000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE IDRISS 1ER (MILIEU) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:idriss premier:0.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(559800.000 396000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE IDRISS 1ER (SURFACE) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_barrage_dimension:idriss premier:0.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(559800.000 396000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: PUITS AVAL BOULEMANE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=api.v_station_dimension:puit ait sidi arbi:264.367m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(560761.000 308387.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE ALLAL EL FASSI (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg allal el fassi:155.71m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566743.000 370400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE ALLAL EL FASSI (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg allal el fassi:155.71m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566743.000 370400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE ALLAL EL FASSI (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg allal el fassi:155.71m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(566743.000 370400.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE SAHLA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg sahla:1351.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(567500.000 442000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE SAHLA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg sahla:1351.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(567500.000 442000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE SAHLA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg sahla:1351.668m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(567500.000 442000.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AMONT STEP TAOUNATE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:89.538m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571757.000 435740.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP TAOUNATE | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.rejet_domestique:TNT_PDS_R1:322.932m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(571892.000 435379.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE BOUHOUDA (FOND) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=infra.rejet_domestique:BHD_PDS_R1:1225.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(575900.000 444500.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE BOUHOUDA (MILIEU) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=infra.rejet_domestique:BHD_PDS_R1:1225.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(575900.000 444500.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE BOUHOUDA (SURFACE) | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=infra.rejet_domestique:BHD_PDS_R1:1225.471m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(575900.000 444500.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP TAHLA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:T_DOM:236.028m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(587570.000 382928.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE BAB LOUTA (FOND) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg bab louta:3.111m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(598322.000 380082.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE BAB LOUTA (MILIEU) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg bab louta:3.111m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(598322.000 380082.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: BARRAGE BAB LOUTA (SURFACE) | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=barrage, nearest=api.v_station_dimension:brg bab louta:3.111m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(598322.000 380082.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: AVAL STEP IMOUZZER MARMOUCHA | Confiance: FORTE
-- Justification: Point orphelin avec XY, type probable=station, nearest=infra.step:IMM_DOM:2405.569m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(600262.000 314456.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: STATION BAB MARZOUKA | Confiance: MOYENNE
-- Justification: Point orphelin avec XY, type probable=station, nearest=api.v_station_dimension:bab merzouka:20.001m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(615850.000 400850.000)'), 26191), ...);

-- Source: staging.raw_idp_2024_src_pollution_marche_cadre | Nom: POINT RP1 AVAL TAZA | Confiance: FAIBLE
-- Justification: Point orphelin avec XY, type probable=autre, nearest=geo.source:Rhiran Isaleb:100.0m
-- INSERT INTO infra.stations_mesure (...) VALUES (..., ST_SetSRID(ST_GeomFromText('POINT(623250.000 404600.000)'), 26191), ...);
