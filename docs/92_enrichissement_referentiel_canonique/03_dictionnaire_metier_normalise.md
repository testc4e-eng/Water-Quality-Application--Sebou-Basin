# Dictionnaire metier normalise

## Source prioritaire

Le fichier `C:\Users\Yassine - C4E Africa\OneDrive\Bureau\parametre_standariser.csv` devient la source metier prioritaire pour l'enrichissement du referentiel qualite.

Lecture audit :

- lignes dictionnaire : 126
- variantes observees brutes : 262
- lignes avec observation metier : 7
- lignes sans unite explicite : 3

Les variantes du tableau C4E doivent etre conservees comme alias metier, ingestion, historiques ou analytiques. Les rapprochements SQL approximatifs ne doivent plus primer sur ce dictionnaire.

## Dictionnaire cible prioritaire

| Nom standard | Code canonique | Domaine | Sous-domaine | Type | Signification | Unite | Parametre actif | Critique dashboard | Critique IA | Commentaire |
|---|---|---|---|---|---|---|---|---|---|---|
| Conductivite | `CONDUCTIVITE` | qualite | physicochimie | physicochimie | conductivite electrique | `µS/cm` | oui | oui | oui | alias C4E `Cond`, `cond_20_c`, `Conductivite`, `Conductivite20C(µs/cm)` |
| Oxygene dissous | `O2_DISS` | qualite | physicochimie | physicochimie | oxygene dissous dans l'eau | `mg/L` | oui | oui | oui | alias C4E `O2_diss`, `O2_dissous`, `O2dissous(mgO2/l)` |
| Nitrates | `NO3-` | qualite | nutriments | physicochimie | nitrates | `mg/L` | oui | oui | oui | alias C4E `NO3`, `NO3-(mg/l)`, `NO3_Spectro`, `Nitrates` |
| Nitrites | `NO2-` | qualite | nutriments | physicochimie | nitrites | `mg/L` | oui | oui | oui | alias C4E `NO2`, `NO2-_Spectro` |
| Orthophosphates | `PO4_3-` | qualite | nutriments | physicochimie | orthophosphates | `mg/L` | oui | oui | oui | alias C4E `PO3`, `PO4 3-`, `PO43-(mgP/l)` |
| Bicarbonates | `HCO3-` | qualite | mineralisation | physicochimie | bicarbonates | `mg/L` | oui | non | oui | alias C4E `HCO`, `HCO3`, `HCT` |
| Saturation oxygene | `SAT` | qualite | physicochimie | physicochimie | saturation en oxygene | `%` | oui | oui | oui | alias C4E `sat` |
| Mercure | `HG` | qualite | metaux | pollution | mercure | `mg/L` | oui | oui | oui | alias C4E `Hg`, `Mercure`, `Mercure(mg/l)` |
| Ammonium | `NH4` | qualite | nutriments | physicochimie | ammonium | `mg/L` | oui | oui | oui | alias C4E `Ammonium`, `NH4+`, `NH4+ Titri`, `NH4+ Spect` |
| Turbidite | `TURBIDITE` | qualite | physicochimie | physicochimie | turbidite de l'eau | `NTU` | oui | oui | oui | alias C4E `turbidite`, `Turbidite`, `Turbidité` |
| Huiles et graisses | `HUILES_GRAISSES` | qualite | pollution | pollution | huiles et graisses | `mg/L` | oui | oui | oui | alias C4E `H_G`, `Huiles Graisses`, `Huiles Graisses (H G T)` |
| Azote organique | `AZOTE_ORG` | qualite | nutriments | physicochimie | azote organique | `mg/L` | oui | non | oui | alias C4E `N_org`, `Azote_Org` |
| Azote total | `AZOTE_TOTAL` | qualite | nutriments | physicochimie | azote total | `mg/L` | oui | oui | oui | alias C4E `N_tot`, `Azote_Total` |
| Azote total Kjeldahl | `AZOTE_TOT_KJELD` | qualite | nutriments | analytique | azote total Kjeldahl | `mg/L` | oui | oui | oui | `NTK` devient mapping sur, `AZOTE_TOT_KJELDHAL` conserve comme variante/alias legacy |
| Phosphore total | `PHOSPHORE_TOTAL` | qualite | nutriments | physicochimie | phosphore total | `mg/L` | oui | oui | oui | `PT` devient mapping sur selon tableau C4E |
| Phosphore total dissous | `PTD` | qualite | nutriments | physicochimie | phosphore total dissous | `mg/L` | a creer/valider | non | oui | distinct de `PT` |
| Phosphore total particulaire | `PTP` | qualite | nutriments | physicochimie | phosphore total particulaire | `mg/L` | a creer/valider | non | oui | distinct de `PT` |
| Fluorures | `F-` | qualite | mineralisation | physicochimie | fluorures | `mg/L` | a creer | oui | oui | `F` n'est plus ambigu selon tableau C4E |
| Cyanures | `CN` | qualite | pollution | pollution | cyanures | `mg/L` | a creer | oui | oui | `CN-`, `CN(mg/l)` comme alias |
| Silice | `SIO2` | qualite | mineralisation | physicochimie | silice | `mg/L` | a creer | non | oui | `SiO2(mg/l)` comme alias |
| Silicates | `SIO3` | qualite | mineralisation | physicochimie | silicates | `mg/L` | oui | non | oui | existant a enrichir |
| Sulfites | `SO3` | qualite | mineralisation | physicochimie | sulfites | `mg/L` | a creer | non | oui | code ASCII propose pour standard C4E `SO3²-` |
| Sulfates | `SO4_2-` | qualite | mineralisation | physicochimie | sulfates | `mg/L` | a verifier | oui | oui | alias C4E `SO4--`, `SO4(mg/l)`, `SO42-_IC` |
| Sulfures | `S2-` | qualite | pollution | physicochimie | sulfures | `mg/L` | a verifier | non | oui | alias C4E `S`, `S2` |
| Sulfure hydrogene | `H2S` | qualite | pollution | physicochimie | hydrogene sulfure | `mg/L` | a creer | non | oui | resolu par tableau C4E |
| Chlore residuel | `CL2_RES` | qualite | desinfection | physicochimie | chlore residuel | `mg/L` | a creer | non | oui | resolu par tableau C4E |
| Dioxyde de carbone libre | `CO2_LIBRE` | qualite | physicochimie | physicochimie | dioxyde de carbone libre | `mg/L` | a creer | non | oui | resolu par tableau C4E |
| Germes totaux 22C | `GERME_22` | qualite | microbiologie | microbiologie | germes totaux a 22 C | `UFC/mL` | a creer | non | oui | resolu par tableau C4E |
| Germes totaux 37C | `GERME_37` | qualite | microbiologie | microbiologie | germes totaux a 37 C | `UFC/mL` | a creer | non | oui | resolu par tableau C4E |
| Clostridium sulfito-reducteurs | `CLOSTRI` | qualite | microbiologie | microbiologie | clostridium sulfito-reducteurs | `spores/100 mL` | a creer | non | oui | resolu par tableau C4E |
| Pseudomonas aeruginosa | `PSEUDO_AER` | qualite | microbiologie | microbiologie | pseudomonas aeruginosa | `UFC/100 mL` | a creer | non | oui | resolu par tableau C4E |
| Vibrion cholerique | `VIBRIO` | qualite | microbiologie | microbiologie | vibrion cholerique | `UFC/100 mL` | a creer | non | oui | resolu par tableau C4E |
| Coliformes fecaux | `CF` | qualite | microbiologie | microbiologie | coliformes fecaux E. coli | `UFC/100 mL` | a verifier | oui | oui | alias C4E `CF`, `CF(UFC/100mL)` |
| Coliformes totaux | `CT` | qualite | microbiologie | microbiologie | coliformes totaux | `UFC/100 mL` | a verifier | oui | oui | alias C4E `CT` |
| Streptocoques fecaux | `SF` | qualite | microbiologie | microbiologie | streptocoques fecaux / enterocoques | `UFC/100 mL` | a verifier | oui | oui | alias C4E `SF` |
| Odeur | `ODEUR` | qualite | organoleptique | organoleptique | odeur | qualitatif | a creer | non | oui | resolu par tableau C4E |
| Saveur | `SAVEUR` | qualite | organoleptique | organoleptique | saveur | qualitatif | a creer | non | oui | resolu par tableau C4E |
| Couleur | `COULEUR` | qualite | organoleptique | organoleptique | couleur de l'eau | qualitatif | a verifier | non | oui | present dans dictionnaire C4E |
| DBO5 | `DBO5` | qualite | pollution organique | pollution | demande biologique en oxygene a 5 jours | `mg/L` | oui | oui | oui | `DBO5_dec2h` devient mapping sur avec methode analytique `DECANTE_2H` conservee |
| DCO | `DCO` | qualite | pollution organique | pollution | demande chimique en oxygene | `mg/L` | a verifier | oui | oui | alias C4E `DCO` |
| DCO decantee 2h | `DCO_DEC2H` | qualite | pollution organique | analytique | DCO decantee en 2h | `mg/L` | a creer/valider | non | oui | distinct de `DCO` |
| Chrome total | `CRT` | qualite | metaux | pollution | chrome total | `mg/L` | oui | oui | oui | `CR/CrT` devient mapping sur vers `CRT` apres validation C4E |
| Matieres decantables | `MD` | qualite | pollution | analytique | matieres decantables | a confirmer | a creer/valider | non | oui | reste client/C4E required |
| FM | `FM` | qualite | a definir | a definir | non renseigne dans tableau | a confirmer | oui | non | non | observation C4E : a ecarter/valider cote client |
| MO_METAL | `MO_METAL` | qualite | a definir | a definir | non resolu par tableau | a confirmer | non | non | non | reste ambigu confirme |
