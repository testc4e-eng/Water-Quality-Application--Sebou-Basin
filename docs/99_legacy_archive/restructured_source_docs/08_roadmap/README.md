# ⚙️ Guide d'Exploitation et Maintenance

## Déploiement API

### Variables d'environnement

```bash
DATABASE_URL=postgresql://waterqual_app:***@db:5432/waterqual_sebou
API_PORT=3001
API_HOST=0.0.0.0
REDIS_URL=redis://redis:6379/0
JWT_ISSUER=waterqual-sebou
JWT_AUDIENCE=waterqual-clients
LOG_LEVEL=info
```

### Démarrage recommandé

```bash
docker compose up -d
```

## Initialisation SQL

```bash
psql -U postgres -d sad_abhs -f 01_init_db.sql
psql -U postgres -d sad_abhs -f 02_admin_geo_infra.sql
psql -U postgres -d sad_abhs -f 03_hydro_meteo_qualite_timescale.sql
psql -U postgres -d sad_abhs -f 04_monitoring_modeles.sql
psql -U postgres -d sad_abhs -f 05_security_audit.sql
psql -U postgres -d sad_abhs -f 12_api_views.sql
```

## Jobs de refresh automatique

### pg_cron recommandé pour vues matérialisées

```sql
SELECT cron.schedule(
  'refresh-api-mv-qualite-month',
  '0 * * * *',
  'REFRESH MATERIALIZED VIEW api.mv_qualite_month;'
);

SELECT cron.schedule(
  'refresh-api-mv-station-latest-status',
  '*/5 * * * *',
  'REFRESH MATERIALIZED VIEW api.mv_station_latest_status;'
);
```

## Monitoring et alertes

| Métrique | Seuil d'alerte | Outil |
|---|---|---|
| Temps réponse API p95 | `> 500 ms` | APM |
| Taux erreur API | `> 0.1%` | logs + metrics |
| Retard refresh MV | `> 2 h` | cron/SQL probe |
| Pool connexions saturé | `> 80%` | exporter PostgreSQL |
| Cache Redis indisponible | `> 1 min` | Redis exporter |

### Requêtes utiles

```sql
SELECT now(), job_id, hypertable_schema, hypertable_name, last_run_started_at, last_successful_finish
FROM timescaledb_information.job_stats;
```

## Backup et restauration

### Sauvegarde logique
```bash
pg_dump -Fc -U postgres -d sad_abhs -f backup_sad_abhs_$(date +%F).dump
```

### Sauvegarde ciblée schéma API
```bash
pg_dump -U postgres -d sad_abhs -n api -f api_schema_backup.sql
```

### Restauration
```bash
pg_restore -U postgres -d sad_abhs --clean --if-exists backup_sad_abhs_2026-03-10.dump
```

## Maintenance périodique

```sql
VACUUM ANALYZE infra.station_mesure;
VACUUM ANALYZE hydro.mesure_debit;
VACUUM ANALYZE meteo.mesure_precipitation;
VACUUM ANALYZE qualite.campagne_mesure;
VACUUM ANALYZE qualite.resultat_analyse;
```

## Troubleshooting

| Symptôme | Cause probable | Action |
|---|---|---|
| API lente sur `/hydro/debits/timeseries` | plage temporelle trop large en brut | forcer agrégation |
| Carte incomplète | `mv_station_latest_status` non refreshée | refresh manuel |
| Erreur SQL sur compression | TimescaleDB non activé | vérifier extensions |
| Qualité incohérente | normes absentes | compléter `qualite.norme_qualite` |
