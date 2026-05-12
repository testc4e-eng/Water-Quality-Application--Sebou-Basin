# Mappings ambigus - client required

## Mise a jour apres validation C4E

La premiere passe classait `NTK`, `PT`, `F`, `SIO2`, `DBO5_DEC2H`, `PT decante` et `CR/CrT` comme ambigus. Le tableau metier C4E leve ces ambiguites.

## Ambiguites metier restantes

| Table | Parametre source | Volume | Pourquoi ambigu | Question client/C4E |
|---|---|---:|---|---|
| `qualite.suivi_qualite_barrage_garde_hebdo` | `MO_METAL` | 11 | absent du dictionnaire C4E, risque de confusion entre matiere organique, molybdene, metal ou agregat analytique | Quelle est la definition analytique exacte de `MO_METAL`, son unite et sa cible canonique ? |
| aucune occurrence REF-001 a REF-004 | `FM/F_M_mes` | 0 | dictionnaire C4E indique une validation client / exclusion possible | Faut-il exclure ou definir un parametre canonique ? |
| aucune occurrence REF-001 a REF-004 | `MD` | 0 | matieres decantables, unite et usage cible a confirmer | Le parametre doit-il etre cree, avec quelle unite et quelle exposition dashboard ? |

## Cas leves par C4E

| Ancien cas ambigu | Decision finale |
|---|---|
| `NTK` | `AZOTE_TOT_KJELD` |
| `PT` | `PHOSPHORE_TOTAL` |
| `F` | `F-` |
| `SIO2` | `SIO2` |
| `DBO5_DEC2H` | `DBO5`, methode `DECANTE_2H` |
| `PT decante` | `PHOSPHORE_TOTAL`, methode `DECANTE_2H` |
| `CR` / `CrT` | `CRT` |

Volume ambigu restant dans REF-001 a REF-004 : 11 lignes.

