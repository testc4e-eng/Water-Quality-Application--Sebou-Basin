# Scope INSERT_ONLY_MISSING

## Classification proposée

Sur le volume brut stable `521 433` :

- `ALREADY_PRESENT_OK` : `383 412`
- `READY_INSERT_ONLY_MISSING` : `131 013`
- `CONFLICT_VALUE_TO_REVIEW` : `1 497`
- `PARSING_SCALING_ERROR` : `56`
- `BACKLOG` : `5 455`

## Interprétation

### Déjà cohérent

`383 412` lignes existent déjà dans `hydro.mesure_debit` avec la bonne valeur.

### Prêt à insérer

`131 013` lignes sont absentes de la cible mais propres côté source stable.

### À arbitrer

`1 553` lignes portent une contradiction de valeur :

- `56` quasi certaines erreurs de scaling
- `1 497` conflits de valeur à revoir

### Hors périmètre immédiat

`5 455` lignes ne figurent pas dans `E0` préparé actuel et doivent rester en backlog tant que la reconstruction stable n’est pas matérialisée proprement.

## Stratégie finale recommandée

**INSERT_ONLY_MISSING après correction**

Justification :

- la clé métier est valide
- le mapping station est complet
- l’unité est homogène
- la cible contient déjà beaucoup de lignes cohérentes qu’il n’y a pas lieu de réécrire

## Réserve

Une stratégie `RESET_AND_RELOAD` ne serait justifiable qu’après validation métier explicite d’une reconstruction complète de l’historique débit.
