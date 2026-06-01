# Règles de performance et lazy loading

## Contexte

La contrainte principale est d'éviter les chargements inutiles et de préserver la réactivité du frontend existant.

## Solution

- catalogue local pour les visions, familles, paramètres, campagnes et supports ;
- zéro appel API à l'ouverture ;
- chargement uniquement après clic `Afficher` ;
- `limit` par défaut = `100` ;
- période récente par défaut ;
- `include_geom` uniquement en mode carte ;
- modules non prêts = `à venir` ;
- route test chargée en `lazy` ;
- coexistence avec le dashboard legacy.

## Traduction technique

- état `submittedSelection` séparé de l'état de formulaire ;
- hook React Query réutilisé avec `enabled` conditionnel ;
- page test isolée de `Dashboard2` ;
- aucun backend ou SQL modifié.
