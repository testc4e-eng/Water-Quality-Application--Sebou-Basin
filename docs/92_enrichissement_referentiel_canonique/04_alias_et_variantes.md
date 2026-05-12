# Alias et variantes

## Regle source

Les variantes du fichier `parametre_standariser.csv` deviennent des alias metier, ingestion, historiques ou analytiques. Elles ne doivent pas etre perdues et ne doivent pas etre remplacees par du matching approximatif.

Le dictionnaire C4E contient 262 entrees de variantes brutes sur 126 parametres standards.

## Alias prioritaires a ajouter

| Parametre canonique | Alias | Type alias | Source | Action recommandee |
|---|---|---|---|---|
| `CONDUCTIVITE` | `Cond` | ingestion | dictionnaire C4E | ajouter alias |
| `CONDUCTIVITE` | `cond_20_c` | analytique | dictionnaire C4E | ajouter alias |
| `CONDUCTIVITE` | `Conductivite20C(µs/cm)` | laboratoire | dictionnaire C4E | ajouter alias |
| `O2_DISS` | `O2_diss` | ingestion | dictionnaire C4E | ajouter alias |
| `O2_DISS` | `O2_dissous` | historique | dictionnaire C4E | ajouter alias |
| `O2_DISS` | `O2dissous(mgO2/l)` | laboratoire | dictionnaire C4E | ajouter alias |
| `NO3-` | `NO3` | analytique | dictionnaire C4E | ajouter alias |
| `NO3-` | `NO3-(mg/l)` | laboratoire | dictionnaire C4E | ajouter alias |
| `NO3-` | `NO3_Spectro` | analytique | dictionnaire C4E | ajouter alias |
| `NO2-` | `NO2` | analytique | dictionnaire C4E | ajouter alias |
| `NO2-` | `NO2-_Spectro` | analytique | dictionnaire C4E | ajouter alias |
| `PO4_3-` | `PO3` | historique | dictionnaire C4E | ajouter alias |
| `PO4_3-` | `PO4 3-` | analytique | dictionnaire C4E | ajouter alias |
| `PO4_3-` | `PO43-(mgP/l)` | laboratoire | dictionnaire C4E | ajouter alias |
| `HCO3-` | `HCO` | historique | dictionnaire C4E | ajouter alias |
| `HCO3-` | `HCO3` | analytique | dictionnaire C4E | ajouter alias |
| `HCO3-` | `HCT` | laboratoire | dictionnaire C4E | ajouter alias |
| `NH4` | `Ammonium` | metier | dictionnaire C4E | ajouter alias |
| `NH4` | `NH4+ Titri` | analytique | dictionnaire C4E | ajouter alias |
| `NH4` | `NH4+ Spect` | analytique | dictionnaire C4E | ajouter alias |
| `HG` | `Hg` | analytique | dictionnaire C4E | ajouter alias |
| `HG` | `Mercure(mg/l)` | laboratoire | dictionnaire C4E | ajouter alias |
| `TURBIDITE` | `turbidite` | ingestion | dictionnaire C4E | ajouter alias |
| `TURBIDITE` | `Turbidité` | accent | dictionnaire C4E | ajouter alias |
| `HUILES_GRAISSES` | `H_G` | historique | dictionnaire C4E | ajouter alias |
| `HUILES_GRAISSES` | `Huiles Graisses` | metier | dictionnaire C4E | ajouter alias |
| `AZOTE_TOT_KJELD` | `NTK` | historique | dictionnaire C4E | mapping sur |
| `AZOTE_TOT_KJELD` | `NTK Spectr` | analytique | dictionnaire C4E | ajouter alias |
| `AZOTE_TOT_KJELD` | `NTK Titri` | analytique | dictionnaire C4E | ajouter alias |
| `AZOTE_TOT_KJELD` | `Azote_tot_kjeld` | legacy | dictionnaire C4E | ajouter alias |
| `AZOTE_TOT_KJELD` | `Azote_tot_kjeldhal` | legacy | dictionnaire C4E | ajouter alias |
| `PHOSPHORE_TOTAL` | `PT` | historique | dictionnaire C4E | mapping sur |
| `PHOSPHORE_TOTAL` | `Phosphore total` | metier | dictionnaire C4E | ajouter alias |
| `PHOSPHORE_TOTAL` | `Phosphore_Total` | legacy | dictionnaire C4E | ajouter alias |
| `F-` | `F` | analytique | dictionnaire C4E | creer parametre + alias |
| `F-` | `F-(mg/l)` | laboratoire | dictionnaire C4E | creer parametre + alias |
| `CN` | `CN-` | analytique | dictionnaire C4E | creer parametre + alias |
| `CN` | `CN(mg/l)` | laboratoire | dictionnaire C4E | creer parametre + alias |
| `SIO2` | `SiO2(mg/l)` | laboratoire | dictionnaire C4E | creer parametre + alias |
| `SIO3` | `SiO3` | analytique | dictionnaire C4E | enrichir existant |
| `SO3` | `SO3` | analytique | dictionnaire C4E | creer parametre sulfites |
| `H2S` | `H2S` | analytique | dictionnaire C4E | creer parametre |
| `CO2_LIBRE` | `CO2_libre` | ingestion | dictionnaire C4E | creer parametre |
| `CL2_RES` | `Cl2_res` | ingestion | dictionnaire C4E | creer parametre |
| `GERME_22` | `Germe_tt_22` | laboratoire | dictionnaire C4E | creer parametre |
| `GERME_37` | `Germe_tt_37` | laboratoire | dictionnaire C4E | creer parametre |
| `CLOSTRI` | `Clostri_sul_redu` | laboratoire | dictionnaire C4E | creer parametre |
| `PSEUDO_AER` | `Pseudo_aer` | laboratoire | dictionnaire C4E | creer parametre |
| `VIBRIO` | `Vibrion_Cholerique` | laboratoire | dictionnaire C4E | creer parametre |
| `ODEUR` | `Odeur` | organoleptique | dictionnaire C4E | creer parametre |
| `SAVEUR` | `Saveur` | organoleptique | dictionnaire C4E | creer parametre |
| `DBO5` | `DBO5_dec2h` | analytique | dictionnaire C4E | ajouter alias, conserver methode `DECANTE_2H` |
| `DCO` | `DCO_dec2h` | analytique | dictionnaire C4E | creer parametre analytique distinct si besoin |
| `CRT` | `Cr` | historique | dictionnaire C4E | mapping sur |
| `CRT` | `CrT` | analytique | dictionnaire C4E | mapping sur |
| `FM` | `F_M_mes` | historique | dictionnaire C4E | a ecarter/valider client |
| `MD` | `MD` | ingestion | dictionnaire C4E | a valider client |
| `APPORT` | `APPORTS_HM3` | legacy | barrage | conserver alias |
| `LACHER` | `RESTITUTION` | legacy | barrage | conserver alias |
