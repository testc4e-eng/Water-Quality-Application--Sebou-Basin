# Parametres ambigus a valider

## Decision finale apres tableau metier C4E

Le dictionnaire `parametre_standariser.csv` leve les ambiguites artificielles suivantes :

- `NTK` -> `AZOTE_TOT_KJELD`
- `PT` -> `PHOSPHORE_TOTAL`
- `F` -> `F-`
- `CN` -> `CN`
- `Clostri` -> `CLOSTRI`
- `CO2_libre` -> `CO2_LIBRE`
- `H2S` -> `H2S`
- `Pseudo_aer` -> `PSEUDO_AER`
- `Vibrio` -> `VIBRIO`
- `Germe_22` -> `GERME_22`
- `Germe_37` -> `GERME_37`
- `Cl2_res` -> `CL2_RES`
- `SiO2` -> `SIO2`
- `SiO3` -> `SIO3`
- `H_G` -> `HUILES_GRAISSES`
- `DBO5_dec2h` -> `DBO5` avec methode analytique `DECANTE_2H`
- `PT decante` -> `PHOSPHORE_TOTAL` avec methode analytique `DECANTE_2H`
- `CR` / `CrT` -> `CRT` dans le referentiel existant

## Ambiguites restantes

| Parametre | Probleme | Risque | Recommandation | Validation requise |
|---|---|---|---|---|
| `MO_METAL` | absent du tableau C4E et non resolu par le referentiel | confusion entre matiere organique, molybdene, metal ou agregat analytique | ne pas mapper automatiquement, investiguer le contexte BD | client + C4E |
| `FM` / `F_M_mes` | ligne C4E presente mais sans signification, observation `a ecarter valider cote client` | integration d'un parametre non metier | exclure dashboard, garder en quarantaine | client |
| `MD` | matieres decantables mais unite et usage cible a confirmer | confusion mesure analytique / observation terrain | creer seulement apres validation unite et table cible | client + C4E |

## Decision

Seuls `MO_METAL`, `FM/F_M_mes` et `MD` restent des ambiguites metier. Aucun de ces trois cas ne doit etre mappe automatiquement.

