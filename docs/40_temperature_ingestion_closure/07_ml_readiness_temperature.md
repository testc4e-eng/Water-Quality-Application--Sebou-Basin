# ML readiness température

## Forces du dataset
- Série journalière longue : 1983-01-01 à 2026-06-10.
- 445194 observations.
- 37 stations résolues.
- Aucun null, doublon Date/Station, inversion ou outlier critique.
- TMAX/TMIN larges cohérents avec le fichier global.

## Conditions ML-ready
- Conserver `source_station_name` et `station_id`.
- Conserver `qa_status` pour distinguer exact, manuel, alias.
- Conserver `import_batch_id` pour reproductibilité.
- Ne jamais supprimer l'information `Bab_Ouender` même si elle pointe vers `Bab Ouender`.
- Construire les features météo depuis les lignes `COMMITTED` uniquement.

## Usages futurs
- Dashboards climat.
- Features LSTM/GNN hydrologie et pollution.
- Détection anomalies météo.
- Croisement température/qualité eau et propagation pollution.
