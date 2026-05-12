# Scope de migration proposé

## Classification

- `ALREADY_PRESENT_OK` : `546 007`
- `READY_INSERT_ONLY_MISSING` : `0`
- `CONFLICT_VALUE_TO_REVIEW` : `0`
- `BACKLOG` : `605 351`
- `SOURCE_DUPLICATE` : `64 529`

## Interprétation

### ALREADY_PRESENT_OK

Toute la source `raw_mesures_precipitations_jr_traitees` est déjà correctement migrée.

### READY_INSERT_ONLY_MISSING

Aucune ligne supplémentaire propre n’est à insérer dans la table cible actuelle.

### SOURCE_DUPLICATE

`64 529` lignes de la source brute sont déjà couvertes par la source traitée, avec la même valeur observée.

### BACKLOG

`605 351` lignes de la source brute ne sont pas présentes en cible. Elles représentent un flux métier séparé, non un simple manque de chargement.

## Stratégie finale recommandée

**NE_RIEN_FAIRE**

Pour `meteo.mesure_precipitation` elle-même, aucun mini-lot `E1.1` n’est requis.
