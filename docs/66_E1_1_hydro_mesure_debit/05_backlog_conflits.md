# Conflits et backlog exclus

## Volumes exclus du scope

- `CONFLICT_VALUE_TO_REVIEW` + `PARSING_SCALING_ERROR` : `1 553`
- `BACKLOG` : `5 455`

## Important

Ces volumes sont exclus du **scope d’insertion**.

Ils ne correspondent pas forcément à des lignes absentes de la cible après exécution, car une partie recouvre des lignes déjà historiquement présentes dans `hydro.mesure_debit`.

Exemple :

- certaines contradictions portent une valeur correcte déjà présente en cible ;
- certaines signatures backlog recouvrent des dates/valeurs déjà présentes historiquement.

## Référence de travail

Le fichier d’arbitrage reste :

- [04_conflits_valeurs_a_arbitrer.csv](C:/dev/WQDSS/repo_git/docs/65_hydro_debit_reconstruction_stable/04_conflits_valeurs_a_arbitrer.csv)
