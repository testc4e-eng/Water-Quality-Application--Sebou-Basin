# Validations métier restantes

## Statut après arbitrage du 2026-05-19

Les blocages métier identifiés dans la version initiale sont clôturés. Les validations restantes sont techniques et doivent être traitées en DEV avant toute pré-production.

| Sujet | Décision métier | Statut |
|---|---|---|
| Unités métaux en `µg/l` vs `mg/L` | Source `µg/l` conservée, normalisation secondaire `mg/L` avec facteur 0.001 | CLOTURE_METIER |
| Microbiologie `/100ml` vs `UFC/100 mL` | Équivalence opérationnelle validée | CLOTURE_METIER |
| DBO5/DCO `mgO2/l` vs `mg/L` | Équivalence opérationnelle validée | CLOTURE_METIER |
| NO3 vs NO3- | `NO3-` canonique, `NO3` alias réglementaire | CLOTURE_METIER |
| O2 dissous vs O2_DISS | `O2_DISS` canonique, `O2_DISSOUS` alias réglementaire | CLOTURE_METIER |
| Paramètres absents du canonique | Équivalents retrouvés acceptés; vrais absents non utilisables moteur | CLOTURE_METIER |
| Mercure Hg | `< 1 µg/l` = moyenne, `>= 1 µg/l` = mauvaise; pas d'autre classe | CLOTURE_METIER |
| Palette qualité | bleu, vert, jaune/orange, rouge, violet | CLOTURE_METIER |
| Périmètre réglementaire final | Tableau n°1 seul, grilles simplifiées non opérationnelles | CLOTURE_METIER |

## Points techniques à exécuter plus tard

| Étape | Objectif | Précondition |
|---|---|---|
| Dry-run SQL DEV | Vérifier collisions, FK et contraintes | Validation du SQL final |
| Création tables DEV | Créer les 7 tables `metadata.qualite_*_reglementaire` | Dry-run OK |
| Chargement contrôlé | Charger classes, types d'eau, paramètres, mappings et seuils | Script d'insertion versionné à produire |
| Tests moteur classification | Tester seuils, unités, non-classables et `Hg` | Tables chargées en DEV |
| Tests API | Vérifier `/quality/thresholds`, `/quality/classify`, `/quality/global-index` | Moteur DEV opérationnel |
| Go/No-Go pré-production | Valider couverture réglementaire et QA | Rapport DEV complet |

## Paramètres non utilisables moteur

Ces paramètres restent stockables/visualisables s'ils existent dans les données, mais ne doivent pas contribuer à la classification automatique tant qu'ils ne sont pas dans le canonique :

- `H.P.A. totaux`
- `Hydrocarbures`
- `Oxydabilité KMnO4`
- `Pesticides par subst`
- `Pesticides totaux`

## Rappel de gouvernance

Aucune grille simplifiée ne doit être utilisée comme fallback. Aucun paramètre hors Tableau n°1, hors seuil officiel ou hors canonique ne doit produire une classe réglementaire.
