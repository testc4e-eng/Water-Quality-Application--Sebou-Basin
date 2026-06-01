# Validation manuelle unites

## Statut execution

`UNITES_REFERENTIEL_37_VALIDEES_APPLIQUEES`

Execution committee le `2026-05-12` :

- `37` unites validees mises a jour dans `metadata.referentiel_parametre_canonique` ;
- backup logique `audit.bkp_ref_unites_37_validees_20260512` cree avec `37` lignes ;
- aucun alias, aucune description, aucun `parametre_ref_id`, aucune table metier modifies ;
- `FM` et `F_M_MES` restent `CLIENT_REQUIRED` ;
- `MD` reste un sujet `CLIENT_REQUIRED` documentaire, sans ligne active retrouvee dans le controle canonique de cette execution.

## Mode

Validation interactive guidee. Une unite a la fois.

## Journal

| Parametre | Proposition | Decision Yassine | Statut | Commentaire |
|---|---|---|---|---|
| `DISQUE_SECCHI` | `m` | `VALIDER m` | `VALIDE_YASSINE` | Valide manuellement. Source barrage contient `DisquedeSecchi(m)` ; appliquer via SQL transactionnel separe uniquement apres validation d'execution. |
| `LARGEUR` | `m` | `VALIDER m` | `VALIDE_YASSINE` | Valide manuellement. 191 occurrences riviere, libelle brut `Largeur`, valeurs 0 a 60. |
| `PROFONDEUR` | `m` | `VALIDER m` | `VALIDE_YASSINE` | Valide manuellement. 110 occurrences riviere/nappe, libelle brut `Profondeur`, valeurs 0 a 80. |
| `PH` | `sans unite` | `VALIDER sans unite` | `VALIDE_YASSINE` | Valide manuellement. 9291 occurrences multi-supports ; pH est dimensionless ; valeurs hors plage observees a traiter QA, pas comme unite. |
| `T_AIR` | `°C` | `VALIDER °C` | `VALIDE_YASSINE` | Valide manuellement. 8145 occurrences multi-supports ; temperature air ; valeurs 4 a 250 avec outliers QA. |
| `T_EAU` | `°C` | `VALIDER °C` | `VALIDE_YASSINE` | Valide manuellement. 9299 occurrences multi-supports ; temperature eau ; valeurs 0 a 213 avec outliers QA. |
| `CA` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 4291 occurrences riviere/nappe ; calcium ; outliers de conversion detectes sur 2 lignes riviere. |
| `CF` | `UFC/100 mL` | `VALIDER UFC/100 mL` | `VALIDE_YASSINE` | Valide manuellement. 4637 occurrences nappe/riviere/garde ; source garde explicite `CF(UFC/100mL)` ; microbiologie avec outliers QA. |
| `CHLA` | `µg/L` | `VALIDER µg/L` | `VALIDE_YASSINE` | Valide manuellement. 281 occurrences ; chlorophylle a ; source garde explicite `Chl.A(µg/l)`. |
| `CL` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 4560 occurrences nappe/riviere/garde ; chlorures ; source garde explicite `Cl-(mg/l)`. |
| `CO3` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 4268 occurrences nappe/riviere ; carbonates ; sources brutes `CO3` et `CO32` ; valeur max 50000 a traiter en QA donnees, pas comme blocage unite. |
| `COULEUR` | `qualitatif` | `VALIDER qualitatif` | `VALIDE_YASSINE` | Valide manuellement. 3 occurrences historiques nappe/riviere ; dictionnaire metier C4E: couleur de l'eau, unite qualitative ; valeurs numeriques source 0.02 a 0.1 a conserver comme donnees historiques. |
| `CT` | `UFC/100 mL` | `VALIDER UFC/100 mL` | `VALIDE_YASSINE` | Valide manuellement. 4316 occurrences nappe/riviere ; coliformes totaux ; microbiologie ; valeurs 0 a 1300000000 avec outliers/fortes charges QA. |
| `DCO` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 816 occurrences Sebou ; demande chimique en oxygene ; valeurs 0 a 209 ; bruts historiques riviere/nappe aussi presents. |
| `DETERGENT` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 190 occurrences nappe/riviere ; detergents tensioactifs ; source brute `Detergent` et `Detergent_non_ionique` ; max final 1000 a traiter en QA donnees. |
| `EH` | `mV` | `VALIDER mV` | `VALIDE_YASSINE` | Valide manuellement. 89 occurrences nappe/riviere ; potentiel redox ; valeurs -330 a 396 coherentes avec millivolts. |
| `FE` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 3030 occurrences nappe/riviere/garde ; fer total et dissous ; sources garde explicites `Fer(mg/l)` et `Ferdissous(mg/l)`. |
| `FET` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 0 occurrence en tables finales ; present en staging historique riviere/nappe sous `FeT` ; unite probable mg/L pour fer total. |
| `HCT` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 0 occurrence en tables finales ; present en staging historique avec `HCO`, `HCO3-`, `HCT` ; hydrogencarbonates/bicarbonates. |
| `IBD` | `indice /20` | `VALIDER indice /20` | `VALIDE_YASSINE` | Valide manuellement. 128 occurrences riviere ; indice biologique diatomees ; valeurs 0 a 16.652. |
| `IBGN` | `indice /20` | `VALIDER indice /20` | `VALIDE_YASSINE` | Valide manuellement. 43 occurrences riviere ; indice biologique global normalise ; valeurs 1 a 16. |
| `K` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 4425 occurrences nappe/riviere ; potassium ; valeurs 0 a 30810 avec outlier QA nappe. |
| `MES` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 2079 occurrences nappe/riviere/garde ; matieres en suspension ; source garde explicite `MEST(mg/l)`. |
| `MG` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 4402 occurrences nappe/riviere ; magnesium ; valeurs 0.36 a 1043. |
| `MN` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 2422 occurrences nappe/riviere/garde ; manganese ; sources brutes `Mn` ; valeurs hautes a suivre QA. |
| `MO` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 2650 occurrences nappe/riviere ; matieres organiques/carbone organique ; distinct de `Mo` molybdene, casse metier preservee. |
| `NA` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 4427 occurrences nappe/riviere ; sodium ; valeurs 0 a 9300 avec fortes mineralisations/outliers QA. |
| `OH` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 0 occurrence tables finales et staging inspecte ; ions hydroxyde ; unite probable dictionnaire C4E, usage ingestion futur uniquement. |
| `PHENOL` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 780 occurrences nappe/riviere/garde ; phenols / indice phenol ; source garde explicite `Indicedephénol(mg/l)`. |
| `PHEOPIGMENT` | `µg/L` | `VALIDER µg/L` | `VALIDE_YASSINE` | Valide manuellement. 17 occurrences riviere ; pheopigments ; valeurs 0 a 4.14 ; parametre algal historique. |
| `SF` | `UFC/100 mL` | `VALIDER UFC/100 mL` | `VALIDE_YASSINE` | Valide manuellement. 4519 occurrences nappe/riviere ; streptocoques fecaux / enterocoques ; microbiologie. |
| `SO4` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 4498 occurrences nappe/riviere/garde ; sulfates ; valeurs 0 a 17251 avec fortes mineralisations/outliers QA. |
| `TA` | `meq/L` | `VALIDER meq/L` | `VALIDE_YASSINE` | Valide manuellement. 3127 occurrences nappe/riviere ; titre alcalimetrique ; valeurs 0 a 2114.982 ; unite probable dictionnaire C4E. |
| `TAC` | `meq/L` | `VALIDER meq/L` | `VALIDE_YASSINE` | Valide manuellement. 3130 occurrences nappe/riviere ; titre alcalimetrique complet ; valeurs 0 a 105105.5 avec extremes QA. |
| `TH` | `meq/L` | `VALIDER meq/L` | `VALIDE_YASSINE` | Valide manuellement. 2412 occurrences nappe/riviere ; titre hydrotimetrique / durete totale ; valeurs 0 a 19105.9 avec extremes QA. |
| `S` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement sur arbitrage explicite. 0 occurrence finale ; 8 lignes staging riviere/nappe ; rattache au domaine des sulfures. |
| `S2` | `mg/L` | `VALIDER mg/L` | `VALIDE_YASSINE` | Valide manuellement. 26 occurrences nappe/riviere ; sulfures ; valeurs 0 a 29.6 ; divergence partielle entre max final et bruts inspectes a suivre QA. |
| `FM` | `a arbitrer` | `CLIENT_REQUIRED` | `CLIENT_REQUIRED` | 0 occurrence finale ; 3 lignes staging riviere ; arbitrage client requis. |
| `F_M_MES` | `a arbitrer` | `CLIENT_REQUIRED` | `CLIENT_REQUIRED` | 0 occurrence finale ; 8 lignes staging riviere/nappe ; cas miroir de `FM`, arbitrage client requis. |
