# Reconciliation tableau metier vs referentiel

## Source

Source prioritaire : `C:\Users\Yassine - C4E Africa\OneDrive\Bureau\parametre_standariser.csv`.

Lecture audit :

- lignes : 126
- variantes observees : 262
- referentiel actuel : 92 parametres actifs
- qualite actuelle : 81 parametres actifs

## Tableau de reconciliation

| Parametre metier | Statut actuel referentiel | Action proposee | Decision |
|---|---|---|---|
| `NTK` | cible existante `AZOTE_TOT_KJELD` + doublon lexical `AZOTE_TOT_KJELDHAL` | utiliser `AZOTE_TOT_KJELD`, ajouter alias `NTK`, `NTK Spectr`, `NTK Titri`, conserver `AZOTE_TOT_KJELDHAL` en legacy | mapping sur |
| `PT` | cible existante `PHOSPHORE_TOTAL` | ajouter alias `PT`, `PT(mgP/l)`, `Phosphore total`, `Phosphore_Total` | mapping sur |
| `F` | cible absente | creer `F-` Fluorures, alias `F`, `F-(mg/l)` | nouveau parametre a creer |
| `CN` / `CN-` | cible absente | creer `CN` Cyanures, alias `CN-`, `CN(mg/l)` | nouveau parametre a creer |
| `Clostri` | cible absente | creer `CLOSTRI` Clostridium sulfito-reducteurs, alias `Clostri_sul_redu` | nouveau parametre a creer |
| `CO2_libre` | cible absente | creer `CO2_LIBRE` Dioxyde de carbone libre | nouveau parametre a creer |
| `H2S` | cible absente | creer `H2S` Hydrogene sulfure | nouveau parametre a creer |
| `Pseudo_aer` | cible absente | creer `PSEUDO_AER` Pseudomonas aeruginosa | nouveau parametre a creer |
| `Vibrio` | cible absente | creer `VIBRIO` Vibrion cholerique | nouveau parametre a creer |
| `Germe_22` | cible absente | creer `GERME_22` Germes totaux a 22 C | nouveau parametre a creer |
| `Germe_37` | cible absente | creer `GERME_37` Germes totaux a 37 C | nouveau parametre a creer |
| `Cl2_res` | cible absente | creer `CL2_RES` Chlore residuel | nouveau parametre a creer |
| `SiO2` | cible absente | creer `SIO2` Silice, ne pas confondre avec `SIO3` | nouveau parametre a creer |
| `SiO3` | cible existante `SIO3` sans enrichissement suffisant | enrichir unite `mg/L`, alias `SiO3`, signification Silicates | alias a ajouter |
| `H_G` | cible existante `HUILES_GRAISSES` | ajouter alias C4E `H_G`, `Huiles Graisses`, `Huiles Graisses (H G T)` | mapping sur |
| `Cond` | cible existante `CONDUCTIVITE` | ajouter variantes C4E `cond_20_c`, `Conductivite20C(µs/cm)` | alias a ajouter |
| `O2_dissous` | cible existante `O2_DISS` | ajouter variantes C4E | alias a ajouter |
| `NO3` | cible existante `NO3-` | ajouter variantes C4E | alias a ajouter |
| `NO2` | cible existante `NO2-` | ajouter variantes C4E | alias a ajouter |
| `PO4` | cible existante `PO4_3-` | ajouter variantes C4E `PO3`, `PO4 3-`, `PO43-(mgP/l)` | alias a ajouter |
| `HCO3` | cible existante `HCO3-` | ajouter variantes C4E `HCO`, `HCT` | alias a ajouter |
| `NH4` | cible existante `NH4` | ajouter variantes analytiques titri/spect | alias a ajouter |
| `Cr` / `CrT` | cible existante `CRT` | ajouter alias `Cr`, `CrT`, `Chrome`, `Chrome(mg/l)` | mapping sur |
| `DBO5_dec2h` | cible existante `DBO5`, methode decantee 2h | conserver `DECANTE_2H` comme methode analytique et garder le libelle source | mapping sur |
| `PT decante` | cible existante `PHOSPHORE_TOTAL`, methode decantee 2h | conserver `DECANTE_2H` comme methode analytique et garder le libelle source | mapping sur |
| `MO_METAL` | non resolu par tableau C4E | demander definition metier | ambigu confirme |
| `FM` / `F_M_mes` | `FM` existe, signification vide et observation C4E "a ecarter valider cote client" | exclure dashboard, garder en quarantaine | exclusion dashboard |
| `MD` | cible absente, signification matieres decantables | creer seulement apres validation unite/table cible | ambigu confirme |
| `SO3` / `SO3²-` | cible absente | creer `SO3` Sulfites avec alias `SO3²-` | nouveau parametre a creer |
| `BORE` / `UNREC_BORE_MG_L` | cible absente probable | creer `BORE` si la source legacy est confirmee | nouveau parametre a creer |
| `RESIDUS_SECS` | cible existante `RS105` | ajouter alias legacy `RESIDUS_SECS` vers residu sec a 105 C | mapping sur |
| `NUMEROTATION` | information de codification, pas un parametre qualite | exclure dashboard et conserver legacy | legacy |

## Synthese decisions

| Decision | Nombre cas |
|---|---:|
| mapping sur | 8 |
| alias a ajouter | 8 |
| nouveau parametre a creer | 16 |
| ambigu confirme | 3 |
| exclusion dashboard | 1 |
| legacy | 2 |

## Effet attendu

Le tableau metier transforme plusieurs cas precedemment classes CLIENT_REQUIRED ou non trouves en mappings exploitables :

- baisse des ambiguites artificielles ;
- meilleure couverture microbiologie et organoleptique ;
- alias ingestion disponibles pour les futures corrections REF-001 a REF-004 ;
- reduction du risque de mapping approximatif.

Les corrections de donnees restent interdites sans validation explicite.
