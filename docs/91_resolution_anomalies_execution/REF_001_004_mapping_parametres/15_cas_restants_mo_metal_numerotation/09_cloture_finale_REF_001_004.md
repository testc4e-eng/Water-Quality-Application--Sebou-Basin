# Cloture finale REF-001 a REF-004

## Statut final

`CLOTURE_C4E_COMPLETE`

## Etat final

| Cas | Volume | Statut |
|---|---:|---|
| lignes deja corrigees REF-001 a REF-004 | 62361 | `CLOTURE_C4E` |
| `MO_METAL` | 11 | `CORRIGE_C4E` vers `Mo` |
| `NUMEROTATION` | 1 | `LEGACY_IGNORE` |

## Validations finales

| Controle | Resultat |
|---|---:|
| `Mo` canonique | 1 |
| `Mo` FK | 1 |
| `MO_METAL` restant | 0 |
| `NUMEROTATION` restant | 1 |
| FK orphelines | 0 |
| `MO_METAL` mappe vers `MO` | 0 |
| `MO_METAL` mappe vers `Mo` | 11 |

## Rappel metier

| Code | Signification | Usage |
|---|---|---|
| `MO` | Matieres organiques | ne pas utiliser pour molybdene |
| `Mo` | Molybdene | cible correcte des 11 lignes `MO_METAL` |

La casse est semantiquement significative et doit etre preservee dans les referentiels, mappings, ingestion et dashboards.

## Decision NUMEROTATION

`NUMEROTATION` reste le seul reliquat autorise.

Statut :

```text
LEGACY_IGNORE
```

Il ne doit pas etre expose dans les dashboards qualite et ne doit pas etre cree comme parametre canonique qualite.
