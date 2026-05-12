# Contexte metier MO_METAL

## Constats

`MO_METAL` n'est pas present dans le dictionnaire C4E comme nom standard ni comme variante observee.

Les donnees observees :

- sont limitees au suivi qualite barrage garde hebdo ;
- concernent un seul barrage / une seule station ;
- portent une valeur constante `0.01` ;
- ont une observation analytique `<0.010` ;
- ne donnent pas l'espece chimique ou le protocole analytique.

## Hypotheses non retenues automatiquement

| Hypothese | Pourquoi non retenue |
|---|---|
| matieres organiques | le code `MO` existe separement dans le dictionnaire C4E |
| molybdene | le code `Mo` existe separement dans le dictionnaire C4E |
| metaux totaux | trop generique, pas de metal cible |
| agregat multi-metaux | aucune definition source |

## Impact

Ne pas mapper `MO_METAL` automatiquement evite :

- une confusion entre carbone organique et metal ;
- une mauvaise unite ;
- une exposition dashboard physiquement fausse ;
- une fausse interpretation IA/LLM.

## Question client/C4E

Quelle est la definition exacte de `MO_METAL` dans le suivi qualite barrage garde hebdo pour le barrage `3323/8` ?

Preciser :

- parametre analytique complet ;
- unite ;
- methode ;
- norme ou laboratoire ;
- cible canonique attendue ou decision d'exclusion.

