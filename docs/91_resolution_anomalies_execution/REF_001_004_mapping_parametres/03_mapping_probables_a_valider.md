# Mappings probables a valider

## Mise a jour apres validation C4E

La categorie `mapping probable` de premiere passe est cloturee pour REF-001 a REF-004. Les cas ci-dessous sont reclasses en mappings surs apres enrichissement referentiel.

| Table | Parametre source | Candidat canonique | Volume | Decision finale |
|---|---|---|---:|---|
| `qualite.mesure_qualite_nappe` | `RESIDUS_SECS` | `RS105` | 2206 | mapping sur, alias legacy `RESIDUS_SECS` |
| `qualite.mesure_qualite_riviere` | `CR` | `CRT` | 441 | mapping sur, chrome total |
| `qualite.mesure_qualite_riviere` | `N_TOT` | `AZOTE_TOTAL` | 358 | mapping sur |
| `qualite.mesure_qualite_riviere` | `RESIDUS_SECS` | `RS105` | 39 | mapping sur, alias legacy `RESIDUS_SECS` |
| `qualite.mesure_qualite_riviere` | `DBO5_DEC2H` | `DBO5` | 24 | mapping sur, methode `DECANTE_2H` conservee |
| `qualite.suivi_qualite_barrage_garde_hebdo` | `CR` | `CRT` | 11 | mapping sur, chrome total |
| `qualite.mesure_qualite_nappe` | `CR` | `CRT` | 5 | mapping sur, chrome total |
| `qualite.mesure_qualite_riviere` | `N_ORG` | `AZOTE_ORG` | 2 | mapping sur |
| `qualite.mesure_qualite_nappe` | `N_ORG` | `AZOTE_ORG` | 1 | mapping sur |

Volume reclassifie : 3087 lignes.

## Decision

Aucun mapping probable ne reste a valider pour REF-001 a REF-004 apres prise en compte du tableau C4E.

