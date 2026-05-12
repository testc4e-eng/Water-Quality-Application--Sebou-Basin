# Analyse de la clé métier

## Clés testées

- `(temps, station_id)`
- `(temps, station_id, unite)`
- `(temps, station_id, source_table)`

## Résultats

- source préparée `qa_dry_run.e0_mesures_preparees` :
  - doublons sur `(temps, station_id)` : `0`
  - doublons sur `(temps, station_id, unite_finale)` : `0`
  - une seule `source_table`, donc `(temps, station_id, source_table)` n’apporte aucune discrimination utile
- cible `hydro.mesure_debit` :
  - doublons sur `(temps, station_id)` : `0`

## Lecture

La clé métier réelle est bien :

`(temps, station_id)`

Elle est stable des deux côtés. Le blocage ne vient donc pas d’une impossibilité à définir la clé fonctionnelle.

## Limite

Une clé métier stable ne suffit pas ici, car la table cible ne stocke ni provenance source, ni hash de ligne, ni identifiant métier de reprise.
