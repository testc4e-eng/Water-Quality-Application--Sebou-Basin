# Backlog final consolide

## GEO

- documenter explicitement la chaine geo de `qualite.source_pollution_mesure_param`
- maintenir la couverture `metadata.mapping_barrage` pour les barrages sans chroniques actives

## REFERENTIEL

- maintenir `metadata.referentiel_parametre_canonique` comme source finale
- traiter la dette documentaire et technique restante de `metadata.referentiel_parametre`
- normaliser `COND`, `O2_DISSOUS`, `PT`, `NO3`, `Conductivité`

## MODELE

- deprecier `hydro.mesure_barrage` comme table finale
- deployer `hydro.mesure_barrage_param`
- reconstruire les vues hydrologie barrage

## CLIENT

- refactor frontend/backend pour `parametre_code`
- retirer les metriques hardcodees `cote_m`, `volume_mm3`, `lacher_m3s`
- aligner les libelles et unites dashboard :
  - `DEBIT` = `m3/s`
  - `LACHER` = `Mm3/j`
  - `APPORTS_HM3` = `Mm3/j`
  - `TRANSFERT` = `Mm3/j`
  - `VOLUME` = `Mm3`

## SCENARIOS

- initialiser `ACTUEL` pour l'historique barrage
- reserver `scenario_id` pour SWAT/WASP et futurs runs analytiques
