# Règles de classification qualité

## 1. Classification par paramètre

Une valeur mesurée est comparée au seuil du paramètre, du type d’eau et de la grille retenue. La classe qualité est celle dont l’intervalle contient la valeur.

## 2. Qualité globale

Le PDF indique deux principes complémentaires :

- ancien système : la qualité globale est donnée par la valeur du paramètre le plus pénalisant lorsque la fréquence recommandée est inférieure ;
- nouveau système : l’indice de qualité de l’eau est l’indice le plus faible obtenu pour l’ensemble des altérations considérées.

## 3. Classement par couleur

Ancienne grille : bleu, vert, orange, rouge, violet. Nouvelle grille : bleu, vert, jaune, violet, rouge. La palette finale doit être validée avant intégration SAD.

## 4. Gestion des valeurs manquantes

Ne pas classer si la valeur est absente. Marquer `donnée manquante`. Ne jamais assimiler l’absence de mesure à une bonne qualité.

## 5. Gestion des paramètres non mappés

Un paramètre non mappé doit être marqué `non classable` et envoyé en validation métier.

## 6. Formule d’indice pondéré

Formule visible : `IPp = Ii + [((Is - Ii) / (bs - bi)) * (bs - pa)]`.

Variables lues : `IPp` indice pondéré du paramètre analysé ; `Ii` indice inférieur ; `Is` indice supérieur ; `bi` borne inférieure ; `bs` borne supérieure ; `pa` paramètre analysé.

Formule visible dans le PDF mais à vérifier manuellement avant implémentation.
