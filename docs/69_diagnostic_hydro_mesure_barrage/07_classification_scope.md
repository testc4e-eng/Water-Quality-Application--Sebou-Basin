# Classification du scope

## Règles de classement utilisées

- `ALREADY_PRESENT_OK`
- `READY_INSERT_ONLY_MISSING`
- `PARAMETRE_MAL_CLASSE`
- `TIMESTEP_INCONSISTENT`
- `CONFLICT_VALUE_TO_REVIEW`
- `SOURCE_DUPLICATE`
- `BACKLOG`

## Résultat métier / technique

| Classe | Volume | Lecture |
|---|---:|---|
| `ALREADY_PRESENT_OK` | `92 526` | `NIVEAU_EAU` + `VOLUME` déjà présents en cible à valeur strictement égale |
| `READY_INSERT_ONLY_MISSING` | `0` | aucune ligne datée réellement absente du modèle actuel |
| `PARAMETRE_MAL_CLASSE` | `169 421` | `RESTITUTION`, `APPORTS_HM3`, `TRANSFERT` sans support cible cohérent |
| `TIMESTEP_INCONSISTENT` | `0` | flux journalier homogène |
| `CONFLICT_VALUE_TO_REVIEW` | `2 684` | écarts de rounding sur `NIVEAU_EAU` et `VOLUME` |
| `SOURCE_DUPLICATE` | `334` | doublons source sur `(date_jr, ire_barrage)` |
| `BACKLOG` | `92` | lignes source sans `date_jr` |

## Lecture importante

Le fait qu’il n’y ait aucune ligne `READY_INSERT_ONLY_MISSING` signifie :

- le blocage n’est pas un simple “insert des manquants”
- la cible actuelle a déjà saturé la clé `(temps, barrage_id)`
- mais elle l’a saturée avec un **sous-ensemble** des concepts métier

## Implication opérationnelle

Une stratégie `INSERT_ONLY_MISSING` n’est pas adaptée.

Deux seules stratégies réalistes subsistent :

1. `RESET_AND_RELOAD` après validation métier, si l’on garde la structure actuelle en l’acceptant comme partielle
2. remodelage d’architecture avant migration, ce qui est la recommandation de ce diagnostic
