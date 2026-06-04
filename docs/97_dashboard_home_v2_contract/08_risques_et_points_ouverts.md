# Risques et points ouverts

## Typologie pluvio

Risque :

- exposer un KPI pluie trompeur si on présente toutes les stations comme strictement pluviométriques.

Décision :

- utiliser `Données pluie disponibles` tant que la typologie n'est pas consolidée.

## Qualité journalière

Risque :

- mélanger qualité réglementaire globale et réseau quotidien sentinelle.

Décision :

- le home doit cibler les `6 stations sentinelles qualité`.

## Fraîcheur

Risque :

- certaines familles sont réellement anciennes ;
- le home pourrait sembler faux si la fraîcheur n'est pas visible.

Décision :

- afficher explicitement `data_freshness`.

## Température

Risque :

- confusion entre `T_AIR` et `T_EAU`.

Décision :

- règle absolue exposée dans `metadata`.

## Carte surchargée

Risque :

- une carte trop riche ferait régresser le home vers un navigateur de couches.

Décision :

- 4 couches par défaut seulement ;
- tout le reste désactivé.

## Tendances qualité

Risque :

- absence de score synthétique immédiatement disponible pour le home.

Décision :

- autoriser une première version simple ;
- documenter le calcul du score home séparément si nécessaire.
