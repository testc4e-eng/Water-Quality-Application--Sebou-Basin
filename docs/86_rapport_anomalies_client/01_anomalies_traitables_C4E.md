# Anomalies traitables C4E

## Referentiel et qualite

| Anomalie | Volume | Classe | Action C4E |
|---|---:|---|---|
| `parametre_ref_id` null riviere | 17287 | TRAITABLE_C4E | completer mapping parametre qualite |
| `parametre_ref_id` null nappe | 13270 | TRAITABLE_C4E | completer mapping parametre qualite |
| `parametre_ref_id` null Sebou | 31277 | TRAITABLE_C4E | completer mapping parametre qualite |
| `parametre_ref_id` null garde hebdo | 539 | TRAITABLE_C4E | completer mapping parametre qualite |
| unites manquantes referentiel canonique | 59 | TRAITABLE_C4E | enrichir `unite_reference` |
| `table_cible` manquante referentiel canonique | 87 | TRAITABLE_C4E | renseigner table cible ou classer hors restitution |
| mappings parametres orphelins audit | 5 | TRAITABLE_C4E | arbitrage technique avec dictionnaire existant |
| parametres legacy riviere non resolus | 39 | TRAITABLE_C4E | fusion/alias vers canonique |
| parametres suivi Sebou non resolus | 7 | TRAITABLE_C4E | fusion/alias vers canonique |

## Donnees et QA

| Anomalie | Volume | Classe | Action C4E |
|---|---:|---|---|
| valeurs nulles evaporation | 10308 | TRAITABLE_C4E | confirmer statut lacune, filtrer dashboard ou completer si source disponible |
| pollution `valeur_num` null/non numerique | 3447 | TRAITABLE_C4E | parser qualifiers, documenter non numerique, enrichir QA |
| valeurs negatives debit | 2087 | BACKLOG_TECHNIQUE | deja flaggees QA, ne bloque pas la migration |
| valeurs negatives qualite | 2 | BACKLOG_TECHNIQUE | deja flaggees QA, verifier interpretation metier |

## Modelisation temporaire

| Anomalie | Volume | Classe | Action C4E |
|---|---:|---|---|
| doublons WASP | 1020 groupes | LEGACY_MODELING_TO_REPLACE | ne pas corriger dans le perimetre client, remplacer par futur jeu modele |
| scenarios SWAT/WASP limites a `normal` | 1 par modele | LEGACY_MODELING_TO_REPLACE | basculer au chantier ingestion/modelisation |

