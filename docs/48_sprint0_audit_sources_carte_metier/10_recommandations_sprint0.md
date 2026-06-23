# 10. Recommandations pour l'Implémentation du Sprint 0

Suite à l'audit des sources, voici les recommandations finales avant le démarrage du code :

1. **Materialized Views obligatoires** : La matrice `availability` nécessitant de scanner plus de 2 millions de lignes réparties sur 10 tables, elle DOIT être implémentée sous forme de `MATERIALIZED VIEW` (ex: `api.mv_business_map_availability`) rafraîchie périodiquement (idéalement de nuit via `pg_cron` ou Airflow).
2. **Standardiser `AnalyticalSeries`** : Le backend doit convertir à la volée les dates (qui mixent `date` et `timestamp with time zone`) au format ISO 8601 pour le frontend.
3. **Sécurité Bassin** : Imposer la RLS (Row Level Security) ou un filtre `WHERE bassin_nom = :bassin` strict dans chaque requête retournant des entités géographiques ou séries.
4. **V1 focusée** : Ne cibler que les supports ayant le statut "V1" dans la matrice des features (`STATION_QUALITE`, `STATION_HYDRO`, `STATION_METEO`, `BARRAGE`, `SOURCE_POLLUTION`) pour garantir un Delivery rapide et stable.
