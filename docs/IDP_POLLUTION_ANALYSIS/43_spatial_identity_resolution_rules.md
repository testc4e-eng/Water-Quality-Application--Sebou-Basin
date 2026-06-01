# Regles de resolution d'identite spatiale

## Objectif

Attribuer un `master_site_id` a chaque objet pollution/qualite sans modifier les sources. Le moteur produit des candidats et des conflits, puis l'arbitrage metier decide.

## Normalisation

- Nom : trim, suppression espaces multiples, accents neutralises pour comparaison uniquement.
- Commune : comparaison normalisee, sans modifier la valeur source.
- Type : mapping vers typologies pollution existantes.
- Geometrie : toutes les comparaisons se font en SRID 26191.

## Score propose

| Critere | Poids |
|---|---:|
| distance exacte ou <= 5 m | 0.35 |
| nom normalise proche | 0.20 |
| commune coherente | 0.15 |
| typologie coherente | 0.15 |
| source prioritaire | 0.10 |
| campagne/parametres coherents | 0.05 |

## Classes de decision

| Classification | Conditions |
|---|---|
| `DUPLICATE_EXACT` | meme geometrie exacte et meme typologie/commune probable |
| `DUPLICATE_NEAR` | distance <= 10 m, pas de conflit apparent |
| `SAME_SITE_DIFFERENT_SOURCE` | proche, sources differentes, typologies compatibles |
| `GEOMETRY_CONFLICT` | proche mais nom/type/commune divergent |
| `INVENTORY_TO_MEASURE_MATCH` | IDP inventaire proche IDP mesure, campagne coherente |
| `POSSIBLE_MATCH` | score moyen ou information incomplete |
| `ORPHAN_SITE` | aucune geometrie candidate ou distance > 25 m |
| `MISSING_GEOMETRY` | geometrie absente |
| `TO_VALIDATE` | cas non tranchable automatiquement |

## Seuils

| Score | Distance | Statut recommande |
|---:|---:|---|
| >= 0.95 | <= 5 m | `AUTO_MATCH_CANDIDATE` |
| 0.80 - 0.95 | <= 10 m | `TO_VALIDATE_LIGHT` |
| 0.60 - 0.80 | <= 25 m | `MANUAL_REVIEW_REQUIRED` |
| < 0.60 | toute | `POSSIBLE_MATCH_LOW` |

## Regle d'or

Le moteur ne valide pas une fusion. Il produit un candidat, un score, une raison et un statut d'arbitrage.
