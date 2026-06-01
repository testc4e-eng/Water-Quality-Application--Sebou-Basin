# LOT 4A-1 : Audit et Normalisation du Dictionnaire des Paramètres 

L'unification du vocabulaire des données est un socle inaliénable du Big Data analytique. Cet audit structure les dénominations hétéroclites des laboratoires via une taxonomie `qualite.ref_parametre` stricte.

## 1. Regroupement Opérationnel par Familles Métier

### 🧪 Famille : Hydrobiologie / Indices
| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |
|---|---|---|---|---|---|---|
| `Chla` | `CHLA` | Chla | *N/A* | **604** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Chl.A(µg/l)` | `CHL.A` | Chl.a | *ug/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `IBD` | `IBD` | Ibd | *N/A* | **141** | Moyen (Non) | qualite_barrages, qualite_rivieres |
| `Pheopigment` | `PHEOPIGMENT` | Pheopigment | *N/A* | **54** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_rivieres |
| `IBGN` | `IBGN` | Ibgn | *N/A* | **46** | Moyen (Non) | qualite_barrages, qualite_rivieres |
| `Chl` | `CHL` | Chl | *N/A* | **2** | Moyen (Non) | qualite_rivieres |

### 🧪 Famille : In situ / Terrain
| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |
|---|---|---|---|---|---|---|
| `T_eau` | `TEAU` | T_eau | *N/A* | **9827** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres, suivi_brg_garde_hebdo, suivi_sebou_6_stations |
| `ph` | `PH` | Ph | *N/A* | **5065** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `T_Air` | `TAIR` | T_air | *N/A* | **5032** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `pH` | `PH` | Ph | *N/A* | **4754** | Élevé (Non) | suivi_brg_garde_hebdo, suivi_sebou_6_stations |
| `T_air` | `TAIR` | T_air | *N/A* | **4754** | Moyen (Non) | suivi_brg_garde_hebdo, suivi_sebou_6_stations |
| `sat` | `SAT` | Sat | *N/A* | **1220** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Ph�nol` | `PH�NOL` | Ph�nol | *N/A* | **687** | Moyen (Non) | qualite_nappes, qualite_rivieres |
| `Largeur` | `LARGEUR` | Largeur | *N/A* | **196** | Moyen (Non) | qualite_barrages, qualite_rivieres |
| `Debit` | `DEBIT` | Debit | *N/A* | **175** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Profondeur` | `PROFONDEUR` | Profondeur | *N/A* | **123** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Eh` | `EH` | Eh | *N/A* | **95** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Odeur` | `ODEUR` | Odeur | *N/A* | **1** | Moyen (Non) | qualite_rivieres |
| `Saveur` | `SAVEUR` | Saveur | *N/A* | **1** | Moyen (Non) | qualite_rivieres |
| `Temperature_Ambiante` | `TEMPERATUREA` | Temperature_ambiante | *N/A* | **1** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_nappes |
| `Numerotation_GT` | `NUMEROTATION` | Numerotation_gt | *N/A* | **1** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_nappes |

### 🧪 Famille : Microbiologie
| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |
|---|---|---|---|---|---|---|
| `CF` | `CF` | Cf | *N/A* | **4735** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `CF(UFC/100mL)` | `CF` | Cf | *UFC/100mL* | **182** | Élevé (Non) | suivi_brg_garde_hebdo |
| `Germe_tt_22` | `GERMETT22` | Germe_tt_22 | *N/A* | **4** | Moyen (Non) | qualite_rivieres |
| `Pseudo_aer` | `PSEUDOAER` | Pseudo_aer | *N/A* | **2** | Moyen (Non) | qualite_rivieres |
| `Clostri_sul_redu` | `CLOSTRISULRE` | Clostri_sul_redu | *N/A* | **2** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_rivieres |
| `Germe_tt_37` | `GERMETT37` | Germe_tt_37 | *N/A* | **2** | Moyen (Non) | qualite_rivieres |
| `Vibrion_Cholerique` | `VIBRIONCHOLE` | Vibrion_cholerique | *N/A* | **1** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_rivieres |

### 🧪 Famille : Métaux Lourds
| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |
|---|---|---|---|---|---|---|
| `DCO` | `DCO` | Dco | *N/A* | **6820** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres, suivi_sebou_6_stations |
| `Conductivite` | `CONDUCTIVITE` | Conductivite | *N/A* | **5071** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Ammonium` | `AMMONIUM` | Ammonium | *N/A* | **4572** | Moyen (Non) | suivi_sebou_6_stations |
| `Conductivité` | `CONDUCTIVITÉ` | Conductivité | *N/A* | **4572** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_sebou_6_stations |
| `Nitrates` | `NITRATES` | Nitrates | *N/A* | **4572** | Moyen (Non) | suivi_sebou_6_stations |
| `HCO3-` | `HCO3-` | Hco3- | *N/A* | **4563** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Mg` | `MG` | Mg | *N/A* | **4532** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `CO3` | `CO3` | Co3 | *N/A* | **4387** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Mn` | `MN` | Mn | *N/A* | **2625** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `FeT` | `FET` | Fet | *N/A* | **2071** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Phosphore total` | `PHOSPHORETOT` | Phosphore total | *N/A* | **1972** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_rivieres |
| `Azote_tot_kjeldhal` | `AZOTETOTKJEL` | Azote_tot_kjeldhal | *N/A* | **1933** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Fe` | `FE` | Fe | *N/A* | **1175** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Phosphore_Total` | `PHOSPHORETOT` | Phosphore_total | *N/A* | **630** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes |
| `Pb` | `PB` | Pb | *N/A* | **442** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Se` | `SE` | Se | *N/A* | **439** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `CrT` | `CRT` | Crt | *N/A* | **391** | Moyen (Non) | qualite_nappes, qualite_rivieres |
| `Azote_Total` | `AZOTETOTAL` | Azote_total | *N/A* | **369** | Moyen (Non) | qualite_barrages, qualite_rivieres |
| `Disque_secchi` | `DISQUESECCHI` | Disque_secchi | *N/A* | **367** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Cd` | `CD` | Cd | *N/A* | **279** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Cu` | `CU` | Cu | *N/A* | **277** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Ni` | `NI` | Ni | *N/A* | **271** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `As` | `AS` | As | *N/A* | **243** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Zn` | `ZN` | Zn | *N/A* | **238** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Hg` | `HG` | Hg | *N/A* | **230** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Fer(mg/l)` | `FER` | Fer | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Arsenic(mg/l)` | `ARSENIC` | Arsenic | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Beryllium(mg/l)` | `BERYLLIUM` | Beryllium | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Bore(mg/l)` | `BORE` | Bore | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `SO4(mg/l)` | `SO4` | So4 | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Indicedephénol(mg/l)` | `INDICEDEPHÉN` | Indicedephénol | *mg/l* | **182** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `IP(mgO2/l)` | `IP` | Ip | *mgO2/l* | **182** | Élevé (Non) | suivi_brg_garde_hebdo |
| `Cadmium(mg/l)` | `CADMIUM` | Cadmium | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `NO3-(mg/l)` | `NO3-` | No3- | *mg/l* | **182** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `Zinc(mg/l)` | `ZINC` | Zinc | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Vanadium(mg/l)` | `VANADIUM` | Vanadium | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Aluminium(mg/l)` | `ALUMINIUM` | Aluminium | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Conductivitéà20°C(µs/cm)` | `CONDUCTIVITÉ` | Conductivitéà20°c | *us/cm* | **182** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `Cobalt(mg/l))` | `COBALT` | Cobalt | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `PO43-(mgP/l)` | `PO43-` | Po43- | *mgP/l* | **182** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `O2dissous(mgd'O2/l)` | `O2DISSOUS` | O2dissous | *mgd'O2/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Chrome(mg/l)` | `CHROME` | Chrome | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Plomb(mg/l)` | `PLOMB` | Plomb | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Cl-(mg/l)` | `CL-` | Cl- | *mg/l* | **182** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `Ferdissous(mg/l)` | `FERDISSOUS` | Ferdissous | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Litium(mg/l)` | `LITIUM` | Litium | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Manganèse(mg/l)` | `MANGANÈSE` | Manganèse | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `SiO2(mg/l)` | `SIO2` | Sio2 | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Mercure(mg/l)` | `MERCURE` | Mercure | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Sélénium(mg/l)` | `SÉLÉNIUM` | Sélénium | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `MEST(mg/l)` | `MEST` | Mest | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `DisquedeSecchi(m)` | `DISQUEDESECC` | Disquedesecchi | *m* | **182** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `Molybdène(mg/l)` | `MOLYBDÈNE` | Molybdène | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `NH4+(mgNH4+/l)` | `NH4+` | Nh4+ | *mgNH4+/l* | **182** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `Nickel(mg)/l` | `NICKEL` | Nickel | *mg* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `Cuivre(mg/l)` | `CUIVRE` | Cuivre | *mg/l* | **182** | Moyen (Non) | suivi_brg_garde_hebdo |
| `PT(mgP/l)` | `PT` | Pt | *mgP/l* | **182** | Élevé (Non) | suivi_brg_garde_hebdo |
| `F-(mg/l)` | `F-` | F- | *mg/l* | **181** | Moyen (Ambigu (Orthographe / Symbole double)) | suivi_brg_garde_hebdo |
| `CN(mg/l)` | `CN` | Cn | *mg/l* | **179** | Élevé (Non) | suivi_brg_garde_hebdo |
| `Co` | `CO` | Co | *N/A* | **112** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `DCO_dec2h` | `DCODEC2H` | Dco_dec2h | *N/A* | **58** | Moyen (Non) | qualite_barrages, qualite_rivieres |
| `Al` | `AL` | Al | *N/A* | **58** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Cr` | `CR` | Cr | *N/A* | **57** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `Ba` | `BA` | Ba | *N/A* | **18** | Élevé (Non) | qualite_rivieres |
| `Li` | `LI` | Li | *N/A* | **16** | Élevé (Non) | qualite_rivieres |
| `Ag` | `AG` | Ag | *N/A* | **9** | Élevé (Non) | qualite_rivieres |
| `Couleur` | `COULEUR` | Couleur | *N/A* | **4** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Sb` | `SB` | Sb | *N/A* | **3** | Élevé (Non) | qualite_rivieres |
| `HCO` | `HCO` | Hco | *N/A* | **3** | Moyen (Non) | qualite_nappes, qualite_rivieres |
| `CO2_libre` | `CO2LIBRE` | Co2_libre | *N/A* | **2** | Moyen (Non) | qualite_rivieres |
| `Detergent_non_ionique` | `DETERGENTNON` | Detergent_non_ionique | *N/A* | **2** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_rivieres |
| `CO32` | `CO32` | Co32 | *N/A* | **1** | Moyen (Non) | qualite_nappes |

### 🧪 Famille : Nutriments
| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |
|---|---|---|---|---|---|---|
| `NO3-` | `NO3-` | No3- | *N/A* | **5158** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `NH4` | `NH4` | Nh4 | *N/A* | **4775** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `NTK` | `NTK` | Ntk | *N/A* | **4572** | Moyen (Non) | suivi_sebou_6_stations |
| `NO2-` | `NO2-` | No2- | *N/A* | **4534** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `PO4 3-` | `PO43-` | Po4 3- | *N/A* | **2320** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `PTD` | `PTD` | Ptd | *N/A* | **136** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `PTP` | `PTP` | Ptp | *N/A* | **136** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Azote_Org` | `AZOTEORG` | Azote_org | *N/A* | **4** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `PO3` | `PO3` | Po3 | *N/A* | **1** | Moyen (Non) | qualite_rivieres |
| `Azote_tot_kjeld` | `AZOTETOTKJEL` | Azote_tot_kjeld | *N/A* | **1** | Moyen (Ambigu (Orthographe / Symbole double)) | qualite_barrages |

### 🧪 Famille : Organique
| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |
|---|---|---|---|---|---|---|
| `DBO5` | `DBO5` | Dbo5 | *N/A* | **6681** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres, suivi_sebou_6_stations |
| `H_G` | `HG` | H_g | *N/A* | **4726** | Élevé (Non) | qualite_nappes, qualite_rivieres, suivi_sebou_6_stations |
| `Phenol` | `PHENOL` | Phenol | *N/A* | **4572** | Moyen (Non) | suivi_sebou_6_stations |
| `MO` | `MO` | Mo | *N/A* | **2657** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Detergent` | `DETERGENT` | Detergent | *N/A* | **191** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `CN` | `CN` | Cn | *N/A* | **127** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `DBO5_dec2h` | `DBO5DEC2H` | Dbo5_dec2h | *N/A* | **24** | Moyen (Non) | qualite_rivieres |
| `Carbone_org` | `CARBONEORG` | Carbone_org | *N/A* | **2** | Moyen (Non) | qualite_rivieres |
| `phenol` | `PHENOL` | Phenol | *N/A* | **2** | Moyen (Non) | qualite_barrages |

### 🧪 Famille : Physico-chimie générale
| Alias Brut | Code Cible Proposé | Libellé Normalisé | Unité Cible | Occurrences | Confiance | Sources |
|---|---|---|---|---|---|---|
| `SO4` | `SO4` | So4 | *N/A* | **4793** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Cl` | `CL` | Cl | *N/A* | **4666** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `SF` | `SF` | Sf | *N/A* | **4653** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Turbidité` | `TURBIDITÉ` | Turbidité | *N/A* | **4572** | Moyen (Non) | suivi_sebou_6_stations |
| `O2_dissous` | `O2DISSOUS` | O2_dissous | *N/A* | **4572** | Moyen (Non) | suivi_sebou_6_stations |
| `NA` | `NA` | Na | *N/A* | **4555** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `K` | `K` | K | *N/A* | **4555** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `CT` | `CT` | Ct | *N/A* | **4451** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Ca` | `CA` | Ca | *N/A* | **4417** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `TAC` | `TAC` | Tac | *N/A* | **3201** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `TA` | `TA` | Ta | *N/A* | **3197** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `O2_diss` | `O2DISS` | O2_diss | *N/A* | **2811** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `TH` | `TH` | Th | *N/A* | **2464** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `MES` | `MES` | Mes | *N/A* | **2400** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `RS105` | `RS105` | Rs105 | *N/A* | **2243** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `Turbidite` | `TURBIDITE` | Turbidite | *N/A* | **1996** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `HCT` | `HCT` | Hct | *N/A* | **491** | Moyen (Non) | qualite_barrages, qualite_rivieres |
| `SiO3` | `SIO3` | Sio3 | *N/A* | **190** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `F` | `F` | F | *N/A* | **61** | Élevé (Non) | qualite_nappes, qualite_rivieres |
| `S2` | `S2` | S2 | *N/A* | **20** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `F_M_mes` | `FMMES` | F_m_mes | *N/A* | **11** | Moyen (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `S` | `S` | S | *N/A* | **9** | Élevé (Non) | qualite_barrages, qualite_nappes, qualite_rivieres |
| `RS185` | `RS185` | Rs185 | *N/A* | **9** | Moyen (Non) | qualite_nappes, qualite_rivieres |
| `H2S` | `H2S` | H2s | *N/A* | **4** | Moyen (Non) | qualite_nappes, qualite_rivieres |
| `FM` | `FM` | Fm | *N/A* | **4** | Élevé (Non) | qualite_barrages, qualite_rivieres |
| `SO3` | `SO3` | So3 | *N/A* | **3** | Moyen (Non) | qualite_rivieres |
| `MD` | `MD` | Md | *N/A* | **2** | Élevé (Non) | qualite_rivieres |
| `Cl2_res` | `CL2RES` | Cl2_res | *N/A* | **2** | Moyen (Non) | qualite_rivieres |
| `OH` | `OH` | Oh | *N/A* | **1** | Élevé (Non) | qualite_barrages |

## 2. Alias Nécessitant un Arbitrage Métier Radical
Les valeurs suivantes sont malformées, extrêmement vagues ou possèdent des symboles invalides ne permettant pas la conciliation automatique sécurisée (ex: mélange de nom, symboles `3-`, ions `+`). Elles requièrent un arbitrage chimiste:
`NO3-`, `Conductivite`, `Conductivité`, `HCO3-`, `NO2-`, `PO4 3-`, `Phosphore total`, `Azote_tot_kjeldhal`, `Phosphore_Total`, `Disque_secchi`, `Indicedephénol(mg/l)`, `NO3-(mg/l)`, `Conductivitéà20°C(µs/cm)`, `PO43-(mgP/l)`, `Cl-(mg/l)`, `DisquedeSecchi(m)`, `NH4+(mgNH4+/l)`, `F-(mg/l)`, `Pheopigment`, `Clostri_sul_redu`, `Detergent_non_ionique`, `Temperature_Ambiante`, `Vibrion_Cholerique`, `Numerotation_GT`, `Azote_tot_kjeld`

## 3. Proposition de Modèle de Donnée Cible (Structure `abh_sad`)
L'architecture analytique des pollutions requiert la fondation d'un triptyque référentiel :
```sql
CREATE TABLE qualite.ref_parametre (
   id SERIAL PRIMARY KEY,
   code_interne VARCHAR(25) UNIQUE,  -- ex: 'NH4'
   libelle_officiel VARCHAR(150),    -- ex: 'Ammonium'
   famille_id INTEGER NULL,
   formule_chimique VARCHAR(50)
);

CREATE TABLE qualite.map_parametre_source (
   alias_brut VARCHAR(255) PRIMARY KEY, -- ex: 'Ammonium(mg/l)'
   parametre_ref_id INTEGER REFERENCES qualite.ref_parametre(id)
);

CREATE TABLE qualite.ref_unite (
   id SERIAL PRIMARY KEY,
   symbole VARCHAR(20) UNIQUE, -- ex: 'mg/l', 'NTU', 'µS/cm'
   dimension VARCHAR(50)
);
```
*(Note: Le modèle exact de ta prod devra être synchronisé avec cette recommandation)*.

## 4. Règles QA d'Ingestion Futures
1. **NULL** (`ANO-LOT4A-002`) : Toute remontée chiffrée valant stritement NULL sera exclue (`WOULD_SKIP`) ou levée par le QA formel `qa_flag_null_value` lors du scan, selon affinité.
2. **Négatifs** (`ANO-LOT4A-003`) : Une mole ou un atome ne peut physiquement être négatif. Ces seuils de censure des instruments (-99 ou <LOQ) transiteront impérativement flagués par `qa_flag_negative=TRUE` et la vraie macro `valeur_num` mise à `NULL` pour ne pas écraser les sommes arithmétiques du dashboard.
3. **Libellés Corrompus** : Si `map_parametre_source` reste muette quant à un libellé orphelin, la ligne passe en `qa_flag_param_missing=TRUE` (ou `WOULD_CONFLICT` si la stratégie d'Upsert la bannit).
4. **Paramètres Sans Unités Explicites** : La table d'ingestion factuelle s'abrogera d'une unité, qui doit être raccordée au `ref_parametre`. Un paramètre entré sans unité restera toléré si le mapping de son code parent le relève.


*Rappel de Gouvernance (Contexte Validé)* : La table `mesures_suivi_qualite_brg_garde_hebdo` jouira formellement, d'après les notes, du mapping direct `station = Barrage Garde Sebou` (`qa_flag_station_infered=TRUE`, etc). Cette décision a été intégrée comme jurisprudence du bloc 4.*
