# Nouveaux parametres a creer

## Regle

Les nouveaux parametres ci-dessous sont proposes a partir du dictionnaire C4E. Ils restent non executes en base tant qu'une validation explicite n'est pas donnee.

## Creations prioritaires resolues par le tableau metier

| Parametre | Domaine | Type | Unite | Justification | Priorite |
|---|---|---|---|---|---|
| `F-` | qualite | physicochimie | `mg/L` | fluorures, alias `F`, resolu par tableau C4E | P1 |
| `CN` | qualite | pollution | `mg/L` | cyanures, alias `CN-`, `CN(mg/l)` | P1 |
| `SIO2` | qualite | physicochimie | `mg/L` | silice, distinct de `SIO3` | P1 |
| `SO3` | qualite | physicochimie | `mg/L` | sulfites, code ASCII propose pour standard `SO3²-` | P2 |
| `H2S` | qualite | physicochimie | `mg/L` | hydrogene sulfure | P2 |
| `CO2_LIBRE` | qualite | physicochimie | `mg/L` | dioxyde de carbone libre | P2 |
| `CL2_RES` | qualite | physicochimie | `mg/L` | chlore residuel | P2 |
| `GERME_22` | qualite | microbiologie | `UFC/mL` | germes totaux a 22 C | P2 |
| `GERME_37` | qualite | microbiologie | `UFC/mL` | germes totaux a 37 C | P2 |
| `PSEUDO_AER` | qualite | microbiologie | `UFC/100 mL` | pseudomonas aeruginosa | P2 |
| `VIBRIO` | qualite | microbiologie | `UFC/100 mL` | vibrion cholerique | P2 |
| `CLOSTRI` | qualite | microbiologie | `spores/100 mL` | clostridium sulfito-reducteurs | P2 |
| `ODEUR` | qualite | organoleptique | qualitatif | odeur | P3 |
| `SAVEUR` | qualite | organoleptique | qualitatif | saveur | P3 |

## Creations ou enrichissements a verifier

| Parametre | Domaine | Type | Unite | Justification | Priorite |
|---|---|---|---|---|---|
| `PTD` | qualite | physicochimie | `mg/L` | phosphore total dissous, distinct de `PT` | P2 |
| `PTP` | qualite | physicochimie | `mg/L` | phosphore total particulaire, distinct de `PT` | P2 |
| `DCO_DEC2H` | qualite | analytique | `mg/L` | DCO decantee 2h, ne pas fusionner automatiquement avec `DCO` | P3 |
| `COULEUR` | qualite | organoleptique | qualitatif | couleur de l'eau | P3 |
| `BORE` | qualite | pollution | `mg/L` | source `UNREC_BORE_MG_L`, dictionnaire C4E confirme Bore | P2 |
| `MD` | qualite | analytique | a confirmer | matieres decantables, validation client demandee | HOLD |

## Remarque

`NTK`, `PT`, `F`, `CN`, `Clostri`, `CO2_libre`, `H2S`, `Pseudo_aer`, `Vibrio`, `Germe_22`, `Germe_37`, `Cl2_res`, `SiO2`, `SiO3` et `H_G` ne doivent plus etre classes comme inconnus. Ils sont resolus par le tableau metier, sauf les sous-cas explicitement conserves en validation.

