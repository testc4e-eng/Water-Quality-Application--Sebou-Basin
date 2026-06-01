# Décisions réglementaires

## Décisions validées

| Décision | Statut | Impact |
|---|---|---|
| Utiliser uniquement le Tableau n°1 officiel eaux de surface | VALIDÉ | Seuls les seuils `surface_generale` alimentent le moteur SAD |
| Exclure les nouvelles grilles simplifiées du calcul opérationnel | VALIDÉ | Rivières/lacs/souterraines simplifiés = `DOCUMENTAIRE_NON_OPERATIONNEL` |
| Classer uniquement les paramètres avec seuil réglementaire explicite | VALIDÉ | Aucun scoring pour paramètre sans seuil |
| Stocker/visualiser/historiser les paramètres non classifiables | VALIDÉ | Pas de perte de donnée, mais pas de qualité globale |
| Utiliser `metadata` comme schéma cible | VALIDÉ | Gouvernance référentielle centralisée |
| Mapper vers `metadata.referentiel_parametre_canonique` | VALIDÉ | Pas de référentiel parallèle |
| Préserver `MO` et `Mo` | VALIDÉ | Aucune normalisation globale de casse |

## Décisions métier clôturées le 2026-05-19

| Blocage | Décision validée | Conséquence opérationnelle |
|---|---|---|
| Métaux `µg/l` vs `mg/L` | Conserver l'unité réglementaire source `µg/l` et stocker une valeur normalisée secondaire en `mg/L` | Conversion tracée `1 µg/l = 0.001 mg/L`; moteur compare sur unité normalisée si nécessaire |
| Microbiologie `/100ml` vs `UFC/100 mL` | Équivalence opérationnelle validée | `CF`, `CT`, `SF` classifiables avec unité canonique d'affichage `UFC/100 mL` |
| `DBO5` / `DCO` `mgO2/l` vs `mg/L` | Équivalence opérationnelle validée | Moteur et API peuvent utiliser `mg/L`; la source réglementaire reste traçable |
| Nitrates | `NO3-` est le code canonique; `NO3` est l'alias réglementaire | Pas de création parallèle de code nitrates |
| Oxygène dissous | `O2_DISS` est le code canonique; `O2_DISSOUS` est l'alias réglementaire | Pas de duplication entre code source et code moteur |
| Paramètres retrouvés dans le canonique | Les équivalences vérifiées sont acceptées comme mappings réglementaire → canonique | Les mappings passent de `absent_du_referentiel` à `match_probable` ou `match_probable_fort` |
| Vrais absents du canonique | Négligés pour le moteur | Non utilisables et non classifiables tant qu'ils ne sont pas intégrés au canonique |
| Mercure `Hg` | Règle validée : `< 1 µg/l` = `moyenne`, `>= 1 µg/l` = `mauvaise`; pas de bonne/excellente/très mauvaise | `Hg` devient classifiable avec règle spécifique auditée |
| Palette qualité | Palette SAD mixte normalisée : bleu, vert, jaune/orange, rouge, violet | Couleur PDF conservable en métadonnée, affichage SAD stabilisé |
| Périmètre final | Tableau n°1 seul, grilles simplifiées non opérationnelles, paramètres hors seuil ou hors canonique non classifiables | Verrou réglementaire pour SQL, API et moteur qualité |

## Distinctions obligatoires

- `REGLEMENTAIRE` : seuil officiel Tableau n°1, utilisable par le moteur après validation des unités/mappings.
- `CANONIQUE` : paramètre interne SAD dans `metadata.referentiel_parametre_canonique`.
- `OBSERVATIONNEL` : donnée mesurable mais non classifiable automatiquement.
- `EXPERIMENTAL` : donnée ou règle utilisée pour simulation/prédiction, hors décision réglementaire directe.

## Décision de gouvernance

Toute future insertion doit passer par une migration contrôlée, un dry-run, une revue métier et un rapport d'écarts. Aucun seuil documentaire simplifié ne doit être utilisé dans `quality/classify`.

Les décisions ci-dessus clôturent les blocages métier du référentiel réglementaire. Les blocages restants sont techniques : dry-run SQL, chargement contrôlé DEV, tests moteur/API, puis Go/No-Go pré-production.
