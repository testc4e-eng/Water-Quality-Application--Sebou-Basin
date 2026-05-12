# Analyse temporelle

## Couverture de dates

- source préparée :
  - min : `1956-09-01`
  - max : `2025-08-31`
- cible :
  - min : `1956-09-01`
  - max : `2025-08-31`

## Vérification des pas de temps dans la source préparée

- paires successives observées : `515 940`
- pas journalier strict (`+1 jour`) : `512 966`
- trous temporels (`> 1 jour`) : `2 974`
- séquences non croissantes : `0`

## Lecture

Le modèle temporel global est cohérent : la série est journalière, avec des trous de mesure mais sans désordre chronologique.

Les trous temporels ne constituent pas le blocage principal pour `E1.1`.
