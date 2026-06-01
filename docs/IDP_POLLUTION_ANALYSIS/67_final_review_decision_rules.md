# Regles decisions revue finale

## Statut

`DECISION_CODES_LIMITED_FOR_FINAL_REVIEW`

## Principe

La revue finale ne doit pas redevenir une analyse technique lourde. Les decisions sont limitees et adaptees a deux buckets :

- `TRUE_AMBIGUOUS`
- `ORPHAN_REVIEW`

## Decisions TRUE_AMBIGUOUS

| Decision | Usage | Effet futur |
|---|---|---|
| `ACCEPT_MATCH` | le master candidat est correct | autorise un rattachement logique futur |
| `KEEP_SEPARATE` | le candidat est proche mais doit rester distinct | pas de fusion, pas de lien fort |
| `SAME_SITE_DIFFERENT_OBJECT` | meme site physique, role metier different | lien site -> objet, pas de fusion role |
| `NEED_FIELD_VALIDATION` | la carte ne suffit pas | attente validation terrain/metier |
| `WAIT_BUSINESS_DECISION` | arbitrage metier necessaire | attente decision equipe metier/DG |

## Decisions ORPHAN_REVIEW

| Decision | Usage | Effet futur |
|---|---|---|
| `WAIT_SOURCE_FIX` | source ou geometrie a corriger | bloque l'integration |
| `INVALID_SOURCE_DATA` | source inexploitable | rejet logique futur possible |
| `CREATE_NEW_SITE` | objet valide, sans master existant | creation controlee future d'un site maitre |
| `NOT_USABLE` | non affichable/non exploitable | exclure des usages operationnels |
| `REVIEW_LATER` | pas prioritaire ou info insuffisante | backlog |

## Regles de securite

- Aucune decision ne declenche une fusion immediate.
- Aucune geometrie ne doit etre modifiee.
- Aucun ID ne doit etre modifie.
- Les decisions servent uniquement a l'ingestion QA future.

## Mapping vers codes internes existants

| Decision finale | Code interne chargeable |
|---|---|
| `WAIT_BUSINESS_DECISION` | `NEED_EXPERT_REVIEW` |
| `INVALID_SOURCE_DATA` | `INVALID_GEOMETRY` |
| `CREATE_NEW_SITE` | `CREATE_NEW_MASTER_SITE` |
| `NOT_USABLE` | `REJECT_MATCH` |
| `REVIEW_LATER` | `NEED_EXPERT_REVIEW` |

Cette correspondance permet de reutiliser `qa.spatial_identity_decisions_cartographic` sans modifier le DDL existant.

## Colonnes modifiables

| Colonne | Obligatoire | Commentaire |
|---|---|---|
| `reviewer_decision` | oui pour cas traite | une des decisions autorisees |
| `reviewer_comment` | recommande | justification courte |

Toutes les autres colonnes doivent rester intactes.
