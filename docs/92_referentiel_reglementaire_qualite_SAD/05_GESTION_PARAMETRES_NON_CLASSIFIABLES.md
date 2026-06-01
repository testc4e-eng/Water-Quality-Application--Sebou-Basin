# Gestion des paramètres non classifiables

## Principe officiel

Un paramètre sans seuil réglementaire Tableau n°1 peut être stocké, visualisé et historisé, mais il ne doit pas produire de classe qualité, de score, d'alerte réglementaire ni contribuer à la qualité globale.

## Statuts proposés

| Statut | Usage |
|---|---|
| `OBSERVATIONNEL_NON_CLASSIFIABLE` | Paramètre utile métier sans seuil officiel SAD |
| `DOCUMENTAIRE_NON_OPERATIONNEL` | Paramètre issu des grilles simplifiées non utilisées par le moteur |
| `A_VALIDER_METIER` | Paramètre avec seuil ou mapping incertain |
| `EXCLU_MOTEUR_QUALITE` | Paramètre explicitement exclu du calcul automatique |

## Paramètres exclus identifiés

| parametre | statut |
|---|---|
| Ammonium NH4 | DOCUMENTAIRE_NON_OPERATIONNEL |
| C. fécaux | DOCUMENTAIRE_NON_OPERATIONNEL |
| C. totaux | DOCUMENTAIRE_NON_OPERATIONNEL |
| CE 20°c | DOCUMENTAIRE_NON_OPERATIONNEL |
| Calcium | DOCUMENTAIRE_NON_OPERATIONNEL |
| Chlorures | DOCUMENTAIRE_NON_OPERATIONNEL |
| DBO5 | DOCUMENTAIRE_NON_OPERATIONNEL |
| Fer total | DOCUMENTAIRE_NON_OPERATIONNEL |
| Magnésium | DOCUMENTAIRE_NON_OPERATIONNEL |
| Manganèse | DOCUMENTAIRE_NON_OPERATIONNEL |
| Nitrates | DOCUMENTAIRE_NON_OPERATIONNEL |
| Orthophosphates (PO4³-) | DOCUMENTAIRE_NON_OPERATIONNEL |
| P.total | DOCUMENTAIRE_NON_OPERATIONNEL |
| P.total (PT) | DOCUMENTAIRE_NON_OPERATIONNEL |
| S. fécaux | DOCUMENTAIRE_NON_OPERATIONNEL |
| Sodium | DOCUMENTAIRE_NON_OPERATIONNEL |
| Sulfates | DOCUMENTAIRE_NON_OPERATIONNEL |
| pH | DOCUMENTAIRE_NON_OPERATIONNEL |

## Restitution frontend/API

Les dashboards peuvent afficher ces paramètres avec un badge `Non classable réglementairement`. Les exports doivent conserver la valeur brute et le motif d'exclusion.
