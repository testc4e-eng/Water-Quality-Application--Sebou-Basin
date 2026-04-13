# Procédures de Maintenance et d'Administration SGBD

Ce document liste les tâches récurrentes à intégrer aux routines d'exploitation pour maintenir la fiabilité, la sécurité et les performances du cœur PostgreSQL/TimescaleDB.

## 1. Sauvegardes (Backups DB)

### 1.1. Sauvegarde Physique et Point-in-Time-Recovery (PITR)
Pour protéger la base de données de sinistres lourds (corruptions ou pertes de disques) :
- Configurer un outil tiers spécialisé comme `pgBackRest` ou `Barman`.
- Activer l'archivage WAL en continu (`archive_mode = on`).
- Protocole recommandé : 
  - **Sauvegarde Totale (Full Backup)** : Chaque dimanche (heures creuses).
  - **Sauvegarde Incrémentale** : Chaque nuit du Lundi au Samedi.

### 1.2. Export Logique (Dump Modulaire)
Pour extraire un jeu de données transportable (ex: référentiels géospatiaux uniquement) vers un environnement de test SIG :

```bash
# Sauvegarder les schémas statiques (admin, geo, metadata, infra)
pg_dump -U postgres -d sad_abhs -n admin -n geo -n infra -n metadata -Fc > backup_ref_ABHS_$(date +%F).dump
```

## 2. Opérations sur les Séries Temporelles (TimescaleDB)

### 2.1. Contrôle et Compression Native
Les données temporelles (`hydro`, `meteo`) historiques > 2 ans doivent être compressées nativement par Timescale, réduisant l'espace disque de près de 90% tout en restant interrogeables en SQL.
Vérification des tâches programmées (`jobs`) de compression :
```sql
SELECT job_id, application_name, schedule_interval, next_start 
FROM timescaledb_information.jobs 
WHERE application_name LIKE 'Compression%';
```

### 2.2. Analyse Régulière (ANALYZE)
Les nouvelles insertions temporelles nécessitent l'actualisation des plans d'exécution du moteur Postgres :
```sql
-- Forcer l'analyse statistique après ingestion du mois en cours
ANALYZE hydro.mesure_debit;
ANALYZE meteo.mesure_precipitation;
```

## 3. Stratégie de Purge / Archivage (Data Lifecycle)

### 3.1. Purge du Buffer Télémétrique (IoT)
La table d'ingestion `monitoring.flux_iot_brut` croît très vite. Configurer un cron/Job SQL pour supprimer les trames datant de plus de 15 jours qui ont déjà été normalisées et validées (`traite = true`).
```sql
DELETE FROM monitoring.flux_iot_brut 
WHERE temps_reception < NOW() - INTERVAL '15 days' 
AND traite = true;
```

### 3.2. Purge de la table d'Audit (`security.log_audit`)
Les logs RBAC deviennent illisibles s'ils s'entassent au-delà de 2 à 3 ans.
Action programmée (Annuellement) :
1. Exporter les logs M-24 en fichier CSV "Cold Storage".
2. Supprimer les lignes exportées de la base `security.log_audit`.

```sql
-- Exporter
\copy (SELECT * FROM security.log_audit WHERE date_action < NOW() - INTERVAL '2 years') TO '/backups_nfs/cold_storage_audit.csv' CSV HEADER;
-- Nettoyer
DELETE FROM security.log_audit WHERE date_action < NOW() - INTERVAL '2 years';
```

## 4. Monitoring d'Activité et des Lenteurs
Activer et scruter l'extension `pg_stat_statements` pour détecter les requêtes analytiques mal formées consommant trop de calculs ou d'I/O (besoin de redéfinir un index B-Tree ou GiST ?). L'utilisation de pghero est vivement recommandée comme interface graphique de monitoring DBA.
