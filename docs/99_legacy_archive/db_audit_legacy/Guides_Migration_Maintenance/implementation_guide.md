# Guide d'Implémentation et d'Optimisation - SAD ABHS

Ce guide fournit des instructions concrètes pour le déploiement de la base de données et l'optimisation des performances de l'infrastructure PostgreSQL.

## 1. Pré-Requis SGBD
- **PostgreSQL 14 ou supérieur** : Recommandé pour le partitionnement natif, les vues matérialisées et les performances JSONB améliorées.
- **Extensions requises** :
  - `postgis` (min 3.0) pour la cartographie.
  - `timescaledb` (min 2.0) pour les tables temporelles.
  - `uuid-ossp` et `pgcrypto` pour la génération des clés primaires UUID.
- **Matériel (Serveur BD Production)** :
  - 64 GB > RAM requise pour charger rapidement les `chunks` TimescaleDB en mémoire.
  - Disques NVMe obligatoires pour les tables `hydro` et `meteo`.

## 2. Étapes de Déploiement

Exécuter, dans l'ordre strict, via l'utilitaire `psql` connecté avec le rôle `postgres` :

```bash
psql -U postgres -d sad_abhs -f 01_init_db.sql
psql -U postgres -d sad_abhs -f 02_admin_geo_infra.sql
psql -U postgres -d sad_abhs -f 03_hydro_meteo_qualite_timescale.sql
psql -U postgres -d sad_abhs -f 04_monitoring_modeles.sql
psql -U postgres -d sad_abhs -f 05_security_audit.sql
psql -U postgres -d sad_abhs -f 12_api_views.sql
psql -U postgres -d sad_abhs -f 06_donnees_test.sql # [Uniquement Environnement de Test]
```

## 3. Configuration & Optimisation PostgreSQL (`postgresql.conf`)

Pour des données massivement "Time Series", modifiez les paramètres suivants :

- `shared_buffers` : 25% de la mémoire vive totale (ex: `16GB`).
- `work_mem` : Augmenter pour les tris de grandes séries temporelles (`16MB` à `64MB`).
- `maintenance_work_mem` : Mettre à `2GB` ou plus pour accélérer la création des index et les partitions.
- `max_parallel_workers_per_gather` : Paramétrer à `4` ou `8` selon les cœurs CPU pour le calcul d'agrégations parallèles.

## 4. Recommandations TimescaleDB 

### 4.1. Réglage de l'intervalle des tronçons (Chunk Interval)
Par défaut, l'hyper-table est configurée à `1 month` d'intervalle. Assurez-vous que l'ensemble des données d'un `chunk` (et de ses index) tient dans 25% des `shared_buffers` de la RAM centrale pour garantir des lectures rapides. 

### 4.2. Activation de la Compression Native
Pour économiser 90% d'espace de stockage sur l'historique de > 2 ans (ou 5 ans), exécutez ces règles (ici on le fait sur les débits hydrauliques par exemple) :

```sql
ALTER TABLE hydro.mesure_debit SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'station_id',
    timescaledb.compress_orderby = 'temps DESC'
);
SELECT add_compression_policy('hydro.mesure_debit', INTERVAL '2 years');
```

## 5. Sécurité (RLS et Audit)
- Le modèle intègre une macro RBAC (`admin_sys`, `lecteur`, etc.).
- Les tables critiques écrivent **tout changement (UPDATE/DELETE)** dans la table `security.log_audit` au format `JSONB` pour conserver l'état de la donnée avant/après la modification.

## 6. Intégration API / IoT
Pour l'ingestion de la télémesure (MQTT / IoT) :
- Écrivez massivement les paquets bruts bruts dans `monitoring.flux_iot_brut`.
- Un processus asynchrone (ex. cron ou worker python/Node) lira les chroniques `traite=false`, validera format/seuils, puis écrira de manière ordonnée dans la table finale structurée (ex. `hydro.mesure_debit`).
