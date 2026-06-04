# D2 - Paramètres ambigus

## 1. Objet

Clore la qualification métier des paramètres ambigus, variantes, unités absentes ou mélangées et mappings non stabilisés.

## 2. Paramètres concernés

### Faits vérifiés

Les dossiers `33_annexes_anomalies_detaillees`, `35_donnees_problematiques_par_bloc` et `37_fiches_arbitrage_idp_2024` identifient notamment :

- `H_G`
- `sat`
- paramètres non mappés ;
- variantes de libellés ;
- unités absentes ou mélangées ;
- valeurs non numériques nécessitant règle métier.

## 3. Matrice de validation

| Paramètre / famille | Signification métier attendue | Unité attendue | Mapping proposé | Impact si non validé | Décision |
|---|---|---|---|---|---|
| `H_G` | à confirmer officiellement | à confirmer | mapping seulement après confirmation métier | lecture qualité incertaine | `A_CONFIRMER` |
| `sat` | à confirmer officiellement | à confirmer | mapping seulement après confirmation métier | interprétation qualité incertaine | `A_CONFIRMER` |
| Paramètres non mappés | dépend du dictionnaire final | dépend du paramètre | quarantaine puis mapping progressif | couverture analytique partielle | `A_CONFIRMER` |
| Variantes multiples | libellé de référence à figer | unité de référence à figer | rattachement au dictionnaire officiel | incohérences d’affichage et de classement | `A_CONFIRMER` |
| Valeurs non numériques | règle labo à confirmer | unité inchangée | normalisation selon règle métier | données conservées mais non qualifiées | `A_CONFIRMER` |

## 4. Mappings proposés

### Recommandation C4E

- conserver la distinction stricte entre paramètres différents ;
- ne pas forcer le mapping des codes ambigus sans validation métier ;
- figer un dictionnaire métier unique de référence ;
- appliquer une règle unique pour les valeurs labo spéciales et non numériques.

## 5. Impacts

- stabilisation des écrans, tableaux et restitutions ;
- réduction des cas hors classification ;
- meilleure cohérence entre qualité, réglementaire et affichage ;
- sécurisation du futur module d’ingestion.

## 6. Décision attendue du client

- confirmer la signification métier de `H_G` ;
- confirmer la signification métier et l’unité de `sat` ;
- valider le dictionnaire de référence et le traitement des variantes ;
- valider la règle de traitement des valeurs non numériques.
