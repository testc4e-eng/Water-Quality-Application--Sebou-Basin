# Anomalies finales sans X/Y

## Principe

- Ces cas ne peuvent pas etre rattaches automatiquement.
- Ils doivent etre transmis au client comme anomalies finales de donnees source.

## REJET R1 (R1: SHZ-DOM2-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R1 EM (R1: SHZ-DOM2-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R1 EP (R1: SHZ-DOM2-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R10 (R10: KNH-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R10 EM (R10: KNH-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R10 EP (R10: KNH-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R11 (R11: NTR-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R11 EM (R11: NTR-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R11 EP (R11: NTR-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R12 (R12: MBK-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R12 EM (R12: MBK-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R12 EP (R12: MBK-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R2 (R2: SHZ-DOM2-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R2 EM (R2: SHZ-DOM2-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R2 EP (R2: SHZ-DOM2-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R3 (R3: SHZ-DOM1-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R3 EM (R3: SHZ-DOM1-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R3 EP (R3: SHZ-DOM1-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R4 (R4: SHZ-DOM3-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R4 EM (R4: SHZ-DOM3-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R4 EP (R4: SHZ-DOM3-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R5 (R5: LOD-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R5 EM (R5: LOD-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R5 EP (R5: LOD-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R6 (R6: ORG-DOM-R3)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R6 EM (R6: ORG-DOM-R3)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R6 EP (R6: ORG-DOM-R3)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R7 (R7: JEM-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R7 EM (R7: JEM-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R7 EP (R7: JEM-DOM-R2)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R8 EM (R8: LMJ-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R8 EP (R8: LMJ-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R9 (R9: TRL-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `1`
- Parametres : `DCO`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R9 EM (R9: TRL-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `19`
- Parametres : `Ca++, Cl-, DBO5, DCO, Fe, Huiles Graisses, K+, MES, Mg++, NH4+, NO2-, NO3-`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R9 EP (R9: TRL-DOM-R1)
- Table source : `staging.raw_idp_2024_mesures_qualite_globale`
- Volume : `3`
- Parametres : `CF, CT, SF`
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_ANALYSE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R1 (R1: SHZ-DOM2-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R1 EM (R1: SHZ-DOM2-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R1 EP (R1: SHZ-DOM2-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R10 (R10: KNH-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R10 EM (R10: KNH-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R10 EP (R10: KNH-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R11 (R11: NTR-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R11 EM (R11: NTR-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R11 EP (R11: NTR-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R12 (R12: MBK-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R12 EM (R12: MBK-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R12 EP (R12: MBK-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R2 (R2: SHZ-DOM2-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R2 EM (R2: SHZ-DOM2-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R2 EP (R2: SHZ-DOM2-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R3 (R3: SHZ-DOM1-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R3 EM (R3: SHZ-DOM1-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R3 EP (R3: SHZ-DOM1-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R4 (R4: SHZ-DOM3-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R4 EM (R4: SHZ-DOM3-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R4 EP (R4: SHZ-DOM3-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R5 (R5: LOD-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R5 EM (R5: LOD-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R5 EP (R5: LOD-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R6 (R6: ORG-DOM-R3)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R6 EM (R6: ORG-DOM-R3)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R6 EP (R6: ORG-DOM-R3)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R7 (R7: JEM-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R7 EM (R7: JEM-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R7 EP (R7: JEM-DOM-R2)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R8 (R8: LMJ-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R8 EM (R8: LMJ-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R8 EP (R8: LMJ-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R9 (R9: TRL-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R9 EM (R9: TRL-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis

## REJET R9 EP (R9: TRL-DOM-R1)
- Table source : `staging.raw_idp_2024_src_pollution_globale`
- Volume : `1`
- Parametres : ``
- Raison absence XY : coordonnees absentes dans la source brute
- Classification : `BLOQUANT_MODELE`
- Recommandation client : fournir `coord_x`, `coord_y`, un code geo stable ou un rattachement station/barrage/source explicite
- Regle de correction : ne pas migrer tant que les coordonnees ou le referentiel geo stable ne sont pas fournis
