# Controle post-execution E1

## Tables effectivement modifiees

- `hydro.mesure_debit_source` : `1162` lignes inserees
- `qualite.mesure_qualite_sebou` : `49954` lignes inserees

## Tables non modifiees

- `hydro.mesure_debit`
- `hydro.mesure_debit_mensuel`
- `hydro.mesure_barrage`
- `hydro.barrage_bathymetrie`
- `meteo.mesure_precipitation`
- `meteo.mesure_precipitation_annuelle_max`
- `meteo.mesure_evaporation`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_riviere`
- `qualite.suivi_qualite_barrage_garde_hebdo`

## Constats critiques

- `qualite.mesure_qualite_sebou` passe de `51402` a `101356` lignes
- `42052` doublons naturels existent desormais sur `(temps, station_id, parametre_qualite)`
- `hydro.mesure_debit_source` ne presente pas de doublon naturel detecte apres charge

## Cause probable

- l'ancien contenu historique de `qualite.mesure_qualite_sebou` n'avait pas ete neutralise avant `E1`
- la cle primaire inclut `source_row_id`, ce qui a permis l'insertion de mesures deja presentes sous un autre identifiant source

## Blocage recommande

- `E1.1` ou tout lot de migration aval doit rester bloque tant qu'une decision n'est pas prise sur :
  - rollback cible de `qualite.mesure_qualite_sebou`
  - dedoublonnage metier
  - correction des tables `E0` dont `source_row_id` reference le `ctid`
