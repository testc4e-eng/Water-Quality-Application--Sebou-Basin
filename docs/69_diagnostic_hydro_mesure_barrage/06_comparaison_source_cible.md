# Comparaison source / cible

## Volumes comparés

| Mesure | Volume |
|---|---:|
| Lignes source brutes | `85 166` |
| Clés métier source distinctes `(date_jr, barrage_id)` | `84 832` |
| Lignes cible actuelles | `84 831` |
| Lignes `E0` éclatées | `264 723` |

## Mapping barrage

- `11` codes `ire_barrage` distincts
- `11` mappés dans `metadata.mapping_barrage`
- `0` non mappé

## Recouvrement des valeurs supportées par la cible

### Niveau d’eau

- `82 740` valeurs strictement identiques
- `2 334` conflits stricts, uniquement des écarts de rounding (`0.001` à `0.005`)
- `92` cas sans date, donc non rattachables

### Volume

- `9 786` valeurs strictement identiques
- `350` conflits stricts, uniquement des écarts de rounding (`0.001` à `0.005`)
- `0` cas réellement manquants en cible sur les lignes datées

### Restitution

- `77 502` valeurs présentes en source
- `0` portées dans `lacher_m3s`

### Apports

- `83 643` valeurs présentes en source
- `0` colonne cible dédiée

### Transfert

- `8 276` valeurs présentes en source
- `0` colonne cible dédiée

## Exemples de conflits observés

### Niveau d’eau

| Date | IRE barrage | Source | Cible |
|---|---|---:|---:|
| `2024-08-30` | `2820/15` | `71.006` | `71.01` |
| `2024-08-29` | `2820/15` | `71.063` | `71.06` |

### Volume

| Date | IRE barrage | Source | Cible |
|---|---|---:|---:|
| `2023-11-10` | `1182/9` | `7.872` | `7.87` |
| `2021-08-31` | `1182/9` | `2.592` | `2.59` |

## Contradiction structurante

Le volume “déjà cohérent” en cible ne signifie pas que le modèle est bon :

- la cible recouvre correctement l’axe `niveau`
- elle recouvre partiellement `volume`
- elle ne couvre pas `restitution`, `apports`, `transfert`

Le vrai conflit est donc **structurel**, pas seulement volumétrique.
