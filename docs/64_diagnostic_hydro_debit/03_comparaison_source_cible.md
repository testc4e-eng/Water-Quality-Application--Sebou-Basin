# Comparaison source / cible

## Chiffres

- source préparée : `515 978`
- cible actuelle : `521 433`
- mêmes clés déjà présentes : `384 965`
- mêmes clés avec même valeur : `383 412`
- mêmes clés avec valeur contradictoire : `1 553`
- clés présentes dans la source mais absentes de la cible : `131 013`
- clés présentes dans la cible mais absentes de la source préparée : `136 468`

## Pourcentages sur la source préparée

- déjà présentes : `74,61 %`
- déjà présentes et cohérentes : `74,31 %`
- contradictoires : `0,30 %`
- réellement nouvelles : `25,39 %`

## Lecture

Une stratégie `INSERT_ONLY_MISSING` serait théoriquement envisageable si :

- la source était rejouable de façon stable ;
- la cible portait une provenance fiable ;
- les contradictions de valeur étaient négligeables et expliquées.

Ce n’est pas le cas ici :

- `1 553` collisions portent des écarts de valeur extrêmes ;
- la cible contient `136 468` clés absentes de la source préparée actuelle ;
- le périmètre cible n’est donc pas simplement “source + manque”.

## Exemples de contradictions

Exemples observés sur une même clé métier :

- `25.100011` en cible vs `2 500 000 000 000` en source préparée
- `36.107` en cible vs `360 000 000` en source préparée
- `4.1006` en cible vs `4 000 000` en source préparée
- `2.106` en cible vs `2 000 000` en source préparée

Ces cas indiquent un défaut de parsing/scaling dans la préparation `E0` pour une partie du flux débit.
