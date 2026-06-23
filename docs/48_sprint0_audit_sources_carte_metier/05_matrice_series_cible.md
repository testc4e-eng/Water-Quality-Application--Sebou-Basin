# 5. Matrice Series Cible

Identification des sources SQL permettant de remplir le contrat `AnalyticalSeries` (via `GET /api/v1/business-map/series`).

| support_type | domain | parameter_code | source_table | object_id_field | date_field | value_field | unit_field | geometry_join_field | contraintes | transformation |
|---|---|---|---|---|---|---|---|---|---|---|
| STATION_QUALITE | QUALITE | `pH`, `NO3-`, etc. | `api.v_qualite_dashboard_unifiee` | `station_id` | `date_prelevement` | `valeur` | `unite` | `station_id` | Filtre `support_type='RIVIERE'` | Aucune |
| STATION_HYDRO | HYDROLOGIE | `DEBIT` | `hydro.mesure_debit` / `_mensuel` | `station_id` | `temps` | `valeur` | (m³/s fixe) | `station_id` | Volumétrie massive (>600k) | Agrégation mensuelle requise |
| BARRAGE | HYDROLOGIE | `VOLUME`, `LACHER` | `hydro.mesure_barrage_param` | `barrage_id` | `temps` | `valeur` | `unite` | `barrage_id` | Aucune | Pivot selon `parametre_code` |
| STATION_METEO | CLIMATOLOGIE | `PREC` | `meteo.mesure_precipitation` | `station_id` | `temps` | `val_observees` | (mm fixe) | `station_id` | Remplissage | Agrégation mensuelle |
| SOURCE_POLLUTION | POLLUTION | `DBO5`, etc. | `qualite.source_pollution_mesure_param` | `prelevement_id` -> `site_id` | `temps` | `valeur_num` | (mg/L) | `prelevement_id` | Jointure multi-niveaux | Mapping canonique nécessaire |
