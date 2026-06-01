# Grille d'arbitrage hydraulique

## Champs de la grille
| Champ | Description | Exemple |
|---|---|---|
| edge_id | Identifiant du segment | 601 |
| direction_status | Statut calculé avec le MNT | FLOW_REVERSED_SUSPECTED |
| z_start | Altitude au début | 523 |
| z_end | Altitude à la fin | 830 |
| dz | Différence altitude `z_start - z_end` | -307 |
| slope | Pente calculée | -0.054839 |
| longueur_m | Longueur du segment | 5598.2 |
| decision | Décision humaine | NEEDS_REVERSAL |
| commentaire_collaboratrice | Justification | sens contraire à la pente |
| besoin_validation_metier | oui/non | oui |
| date_validation | Date de revue | 2026-05-25 |
| validateur | Nom de la personne | Imane |

## Décisions autorisées
| Décision | Quand l'utiliser |
|---|---|
| `VALIDATED_AS_IS` | Le segment semble correct malgré le signal MNT |
| `NEEDS_REVERSAL` | Le segment semble réellement inversé |
| `UNCERTAIN` | Le cas ne peut pas être tranché visuellement |
| `IGNORE_MNT_ARTIFACT` | Le signal MNT semble faux ou non pertinent |
| `NEED_FIELD_VALIDATION` | Vérification terrain/métier nécessaire |

## Règle importante
Une décision dans la grille ne modifie pas le réseau. Elle sert à préparer une correction future contrôlée et auditée.
