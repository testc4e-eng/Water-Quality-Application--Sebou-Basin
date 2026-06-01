# Journal decisions unites

## Journal execution

- `2026-05-12` : transaction consolidee executee et committee ;
- `37` lignes mises a jour sur le seul champ `unite_reference` ;
- backup logique cree : `audit.bkp_ref_unites_37_validees_20260512` ;
- controles conformes : `0` valide restant sans unite, `0` doublon cree, tables qualite non modifiees par le script ;
- residuel gouvernance : `FM`, `F_M_MES`, `MD` = `CLIENT_REQUIRED`.

| Parametre | Proposition | Statut | Preuves | Decision Yassine |
|---|---|---|---|---|
| `DISQUE_SECCHI` | `m` | `VALIDE_YASSINE` | 179 occurrences ; source barrage `DisquedeSecchi(m)` ; riviere historique verifiee | `VALIDER m` |
| `LARGEUR` | `m` | `VALIDE_YASSINE` | 191 occurrences ; source brute `Largeur` ; uniquement riviere ; valeurs 0 a 60 | `VALIDER m` |
| `PROFONDEUR` | `m` | `VALIDE_YASSINE` | 110 occurrences ; source brute `Profondeur` ; riviere et nappe ; valeurs 0 a 80 | `VALIDER m` |
| `PH` | `sans unite` | `VALIDE_YASSINE` | 9291 occurrences ; multi-supports ; pH dimensionless ; quelques valeurs hors plage a classer QA | `VALIDER sans unite` |
| `T_AIR` | `°C` | `VALIDE_YASSINE` | 8145 occurrences ; multi-supports ; valeurs typiques en degres Celsius avec outliers a classer QA | `VALIDER °C` |
| `T_EAU` | `°C` | `VALIDE_YASSINE` | 9299 occurrences ; multi-supports ; valeurs typiques en degres Celsius avec outliers a classer QA | `VALIDER °C` |
| `CA` | `mg/L` | `VALIDE_YASSINE` | 4291 occurrences ; calcium ; source brute `Ca`; outliers conversion sur 2 lignes riviere | `VALIDER mg/L` |
| `CF` | `UFC/100 mL` | `VALIDE_YASSINE` | 4637 occurrences ; source garde explicite `CF(UFC/100mL)` ; valeurs microbiologiques avec outliers QA | `VALIDER UFC/100 mL` |
| `CHLA` | `µg/L` | `VALIDE_YASSINE` | 281 occurrences ; source garde explicite `Chl.A(µg/l)` | `VALIDER µg/L` |
| `CL` | `mg/L` | `VALIDE_YASSINE` | 4560 occurrences ; chlorures ; source garde explicite `Cl-(mg/l)` | `VALIDER mg/L` |
| `CO3` | `mg/L` | `VALIDE_YASSINE` | 4268 occurrences ; sources brutes `CO3`/`CO32` ; carbonates ; valeur max 50000 a traiter en QA donnees | `VALIDER mg/L` |
| `COULEUR` | `qualitatif` | `VALIDE_YASSINE` | 3 occurrences historiques ; sources brutes `Couleur` ; valeurs 0.02 a 0.1 ; dictionnaire C4E: qualitatif | `VALIDER qualitatif` |
| `CT` | `UFC/100 mL` | `VALIDE_YASSINE` | 4316 occurrences ; coliformes totaux ; valeurs 0 a 1300000000 ; microbiologie avec outliers QA | `VALIDER UFC/100 mL` |
| `DCO` | `mg/L` | `VALIDE_YASSINE` | 816 occurrences Sebou ; demande chimique en oxygene ; valeurs 0 a 209 ; bruts riviere/nappe presents | `VALIDER mg/L` |
| `DETERGENT` | `mg/L` | `VALIDE_YASSINE` | 190 occurrences ; sources brutes `Detergent`/`Detergent_non_ionique` ; max final 1000 vs max brut 18.8 a classer QA | `VALIDER mg/L` |
| `EH` | `mV` | `VALIDE_YASSINE` | 89 occurrences ; potentiel redox ; valeurs -330 a 396 ; sources brutes `Eh` | `VALIDER mV` |
| `FE` | `mg/L` | `VALIDE_YASSINE` | 3030 occurrences ; sources brutes `Fe`, `Fer(mg/l)`, `Ferdissous(mg/l)` ; max final 4452 a classer QA si besoin | `VALIDER mg/L` |
| `FET` | `mg/L` | `VALIDE_YASSINE` | 0 occurrence finale ; staging `FeT` 1977 lignes riviere/nappe ; compatibilite ingestion historique | `VALIDER mg/L` |
| `HCT` | `mg/L` | `VALIDE_YASSINE` | 0 occurrence finale ; staging `HCO`, `HCO3-`, `HCT` ; bicarbonates/hydrogenocarbonates | `VALIDER mg/L` |
| `IBD` | `indice /20` | `VALIDE_YASSINE` | 128 occurrences riviere ; valeurs 0 a 16.652 ; indice biologique diatomees | `VALIDER indice /20` |
| `IBGN` | `indice /20` | `VALIDE_YASSINE` | 43 occurrences riviere ; valeurs 1 a 16 ; indice biologique global normalise | `VALIDER indice /20` |
| `K` | `mg/L` | `VALIDE_YASSINE` | 4425 occurrences ; potassium ; valeurs 0 a 30810 ; outlier QA nappe a suivre | `VALIDER mg/L` |
| `MES` | `mg/L` | `VALIDE_YASSINE` | 2079 occurrences ; sources `MES`, `MEST(mg/l)` ; valeurs hautes a classer QA hydrosedimentaire | `VALIDER mg/L` |
| `MG` | `mg/L` | `VALIDE_YASSINE` | 4402 occurrences ; magnesium ; sources brutes `Mg`; valeurs 0.36 a 1043 | `VALIDER mg/L` |
| `MN` | `mg/L` | `VALIDE_YASSINE` | 2422 occurrences ; manganese ; sources brutes `Mn`; valeurs 0 a 450 ; valeurs hautes QA | `VALIDER mg/L` |
| `MO` | `mg/L` | `VALIDE_YASSINE` | 2650 occurrences ; matieres organiques/carbone organique ; ne pas confondre avec `Mo` molybdene deja en mg/L | `VALIDER mg/L` |
| `NA` | `mg/L` | `VALIDE_YASSINE` | 4427 occurrences ; sodium ; valeurs 0 a 9300 ; fortes mineralisations/outliers QA | `VALIDER mg/L` |
| `OH` | `mg/L` | `VALIDE_YASSINE` | 0 occurrence finale/staging inspecte ; ions hydroxyde ; usage referentiel ingestion future | `VALIDER mg/L` |
| `PHENOL` | `mg/L` | `VALIDE_YASSINE` | 780 occurrences ; source garde `Indicedephénol(mg/l)` ; valeurs finales 0 a 50.025 | `VALIDER mg/L` |
| `PHEOPIGMENT` | `µg/L` | `VALIDE_YASSINE` | 17 occurrences riviere ; valeurs 0 a 4.14 ; parametre algal historique | `VALIDER µg/L` |
| `SF` | `UFC/100 mL` | `VALIDE_YASSINE` | 4519 occurrences ; microbiologie ; valeurs 0 a 100000000 ; streptocoques fecaux / enterocoques | `VALIDER UFC/100 mL` |
| `SO4` | `mg/L` | `VALIDE_YASSINE` | 4498 occurrences ; sulfates ; valeurs 0 a 17251 ; fortes mineralisations/outliers QA | `VALIDER mg/L` |
| `TA` | `meq/L` | `VALIDE_YASSINE` | 3127 occurrences ; titre alcalimetrique ; valeurs 0 a 2114.982 ; verification QA sur valeurs extremes | `VALIDER meq/L` |
| `TAC` | `meq/L` | `VALIDE_YASSINE` | 3130 occurrences ; titre alcalimetrique complet ; valeurs 0 a 105105.5 ; extremes QA a suivre | `VALIDER meq/L` |
| `TH` | `meq/L` | `VALIDE_YASSINE` | 2412 occurrences ; titre hydrotimetrique / durete totale ; valeurs 0 a 19105.9 ; extremes QA a suivre | `VALIDER meq/L` |
| `S` | `mg/L` | `VALIDE_YASSINE` | 0 occurrence finale ; 8 lignes staging ; arbitrage explicite Yassine vers `mg/L` | `VALIDER mg/L` |
| `S2` | `mg/L` | `VALIDE_YASSINE` | 26 occurrences nappe/riviere ; sulfures ; valeurs 0 a 29.6 ; ecart final/brut a suivre QA | `VALIDER mg/L` |
| `FM` | `a arbitrer` | `CLIENT_REQUIRED` | 0 occurrence finale ; 3 lignes staging riviere ; validation client/C4E requise | `CLIENT_REQUIRED` |
| `F_M_MES` | `a arbitrer` | `CLIENT_REQUIRED` | 0 occurrence finale ; 8 lignes staging riviere/nappe ; meme famille d'ambiguite que `FM` | `CLIENT_REQUIRED` |
| `MD` | `a arbitrer` | `CLIENT_REQUIRED` | Backlog client documentaire conserve ; non modifie durant l'application transactionnelle des 37 unites | `CLIENT_REQUIRED` |
