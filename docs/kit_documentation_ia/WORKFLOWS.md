# Workflows - SAD Sebou 2026

## Workflow 1 - Consultation cartographique
1. Le frontend charge une couche via `/api/v1/layers/{layer_key}`.
2. Le backend lit la table geographique.
3. La geometrie est retournee en GeoJSON 4326.
4. La carte React affiche la couche.

## Workflow 2 - Analyse climat/hydro
1. L'utilisateur choisit station, pas de temps, periode.
2. Le frontend appelle `/climate/*` ou `/hydro/*`.
3. Le backend interroge les vues `api.v_measurements_*`.
4. Le frontend rend KPIs et series temporelles.

## Workflow 3 - Suivi qualite des eaux
1. Choix station qualite.
2. Appels `/quality/kpis`, `/quality/table`, `/quality/chart`.
3. Restitution des indicateurs N/O/P.

## Workflow 4 - Exploitation des resultats SWAT
1. Selection scenario.
2. Appel des endpoints SWAT.
3. Visualisation carte ou serie par sous-bassin/reach.

## Workflow 5 - Data management
1. L'admin ouvre `/data`.
2. Le frontend liste les tables via `/raw/tables`.
3. Lecture, creation, mise a jour, suppression via endpoints raw.
4. Controle a renforcer avant mise en production.
