# Decision finale

## Decision metier C4E sur la casse

La casse est semantiquement significative.

| Code | Signification | Nature |
|---|---|---|
| `MO` | Matieres organiques | parametre organique |
| `Mo` | Molybdene | element chimique / metal trace |

Regles obligatoires :

- ne jamais fusionner `MO` et `Mo` ;
- ne jamais mapper `Mo` vers `MO` ;
- ne jamais mapper `MO` vers `Mo` ;
- ne jamais appliquer de normalisation de casse sur ces codes metier.

## Synthese decisionnelle

| Cas | Volume | Decision | Action |
|---|---:|---|---|
| `MO_METAL` | 11 | `CORRIGE_C4E` | `Mo` cree/synchronise, 11 lignes tracees source `Molybdene(mg/l)` mappees vers `Mo` |
| `NUMEROTATION` | 1 | `LEGACY_IGNORE` | ne pas mapper, ne pas exposer dashboard |

## Resultat des controles read-only

| Controle | Resultat |
|---|---:|
| `MO` dans `metadata.referentiel_parametre_canonique` | 1 |
| `MO` dans `metadata.referentiel_parametre` | 1 |
| `Mo` dans `metadata.referentiel_parametre_canonique` | 1 |
| `Mo` dans `metadata.referentiel_parametre` | 1 |
| alias melangeant explicitement `MO` / `Mo` / `MO_METAL` | 0 |
| index case-insensitive `lower/upper` sur codes referentiel | 0 |
| `MO_METAL` restant | 0 |
| `NUMEROTATION` restant | 1 |

## Decision MO_METAL

Les 11 lignes `MO_METAL` ne doivent pas etre mappees vers `MO`.

La cible correcte est :

```text
Mo = Molybdene
```

Statut courant :

```text
CORRIGE_C4E
```

## Decision NUMEROTATION

Decision confirmee :

```text
LEGACY_IGNORE
```

`NUMEROTATION` reste une trace d'import, pas un parametre analytique.

## Decision globale REF-001 a REF-004

| Statut | Volume |
|---|---:|
| deja corrige C4E | 62361 |
| correction `MO_METAL -> Mo` executee | 11 |
| legacy ignore | 1 |

REF-001 a REF-004 sont declares `CLOTURE_C4E_COMPLETE`.
