# Plan d'exécution mini-lots E1.1

## Principe

- 1 table cible = 1 mini-lot
- aucun mini-lot sans validation humaine explicite
- toute exécution future doit écrire dans `qa_dry_run.e1_1_insert_audit`
- rollback futur interdit via `ctid` seul

## Ordre recommandé

1. `hydro.mesure_barrage`

## Mini-lots déjà validés hors périmètre actif

- `hydro.mesure_debit_mensuel`
- `meteo.mesure_precipitation`
- `hydro.barrage_bathymetrie`
- `meteo.mesure_evaporation`
- `meteo.mesure_precipitation_annuelle_max`

### Note métier precipitation

- `meteo.mesure_precipitation` reste `METEO_PRECIPITATION_READY`
- valeur par défaut dashboards / cartes / analytics / exports : `val_remplies`
- `val_observees` et `val_power_nasa` restent des valeurs d'audit / détail avancé
- `staging.raw_mesures_precipitations_jr` reste hors périmètre, en backlog séparé

## Mini-lots déjà exécutés

- `hydro.mesure_debit`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_riviere`
- `qualite.suivi_qualite_barrage_garde_hebdo`

## Règle

Avant toute exécution :

1. relire la fiche de la table
2. valider la stratégie
3. préparer le script du mini-lot
4. exécuter uniquement cette table
5. contrôler
6. documenter
