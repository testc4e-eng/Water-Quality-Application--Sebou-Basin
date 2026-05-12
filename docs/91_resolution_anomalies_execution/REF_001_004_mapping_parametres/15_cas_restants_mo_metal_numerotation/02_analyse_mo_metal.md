# Analyse MO_METAL

## Identification

| Champ | Valeur |
|---|---|
| ID anomalie | `REF-004-MO_METAL` |
| Table | `qualite.suivi_qualite_barrage_garde_hebdo` |
| Volume | 11 lignes |
| Statut avant analyse | `CLIENT_REQUIRED` |
| Mode | read-only |

## Contexte observe

| Indicateur | Valeur |
|---|---|
| periode | 2024-11-20 a 2025-09-08 |
| station | `brg de garde / sebou` |
| IRE station | `3323/8` |
| barrage | `garde du sebou` |
| milieu | `Surface` |
| valeur | 0.01 |
| observation | `<0.010` |
| pas de temps | hebdo |
| source system | `E1_1_GARDE_HEBDO` |

## Point cle

Le parametre cible restant est `MO_METAL`, mais la ligne source brute liee par `source_row_id` indique systematiquement :

```text
Molybdene(mg/l)
```

Le dictionnaire C4E distingue explicitement `MO` et `Mo`.

| Code | Signification | Nature |
|---|---|---|
| `MO` | Matieres organiques | parametre organique |
| `Mo` | Molybdene | element chimique / metal trace |

## Analyse

`MO_METAL` semble etre un artefact de normalisation/migration, pas un vrai parametre metier autonome.

La preuve est forte car :

| Preuve | Resultat |
|---|---|
| toutes les lignes ont un `source_row_id` | oui |
| toutes les lignes source ont le meme libelle brut | `Molybdene(mg/l)` |
| toutes les lignes ont la meme unite implicite | `mg/l` |
| un parametre canonique `Mo` existe deja | non |
| un parametre FK `Mo` existe deja | non |
| un parametre `MO` existe deja | oui, mais il signifie Matieres organiques et ne doit pas etre utilise |

## Limite referentiel

Le code `MO` existe dans les deux referentiels, mais il correspond a `Matieres organiques` selon la decision C4E. Il ne doit pas etre enrichi ni utilise pour le molybdene.

| Referentiel | Code | Libelle | Unite |
|---|---|---|---|
| `metadata.referentiel_parametre_canonique` | `MO` | `MO` | null |
| `metadata.referentiel_parametre` | `MO` | `MO` | null |

Avant correction des 11 lignes, il faut creer/synchroniser une cible distincte `Mo` avec :

| Champ | Valeur cible |
|---|---|
| nom/libelle | `Molybdene` |
| unite | `mg/L` |
| code | `Mo` |
| aliases | `Molybdene(mg/l)`, `MO_METAL` |
| domaine | `qualite` |
| type | `physicochimie` |

## Decision proposee

`A_PROPOSER_CORRECTION_C4E`

Correction sure proposee, non executee :

1. creer/synchroniser le referentiel `Mo` ;
2. mapper uniquement les 11 lignes `MO_METAL` dont la source brute est exactement `Molybdene(mg/l)` vers `Mo` ;
3. conserver `MO_METAL` comme alias legacy/ingestion, pas comme code canonique ;
4. exclure `MO_METAL` des dashboards comme parametre autonome.

## Risque

Risque faible si la correction est limitee aux 11 lignes tracees par `source_row_id` et par libelle source brut.

Ne pas generaliser `MO_METAL` a d'autres contextes sans verification source.

Risque critique a eviter : mapper vers `MO`. La casse est semantiquement significative et ne doit pas etre normalisee.
