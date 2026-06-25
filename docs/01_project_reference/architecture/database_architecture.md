# Database Architecture

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | architecture de données, schémas métier et objets structurants |
| Source de vérité | Oui |
| Documents liés | [DATABASE_SCHEMA](../data/DATABASE_SCHEMA.md), [API_DATA_MAPPING](../data/API_DATA_MAPPING.md), [EVIDENCE_REGISTER](../EVIDENCE_REGISTER.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Rôle de la base

La base `abh_sad` constitue le noyau de données du système. Elle assure simultanément :

- la persistance des référentiels métier et SIG ;
- la gestion des séries temporelles hydrologiques et météorologiques ;
- l’intégration des résultats de modèles ;
- la préparation des vues d’exposition consommées par le backend et les dashboards ;
- la traçabilité, la sécurité et certains mécanismes de gouvernance.

## 2. Stack de données confirmée

La structure réelle confirme l’usage de :

- PostgreSQL ;
- PostGIS pour les géométries et les couches spatiales ;
- TimescaleDB pour la gestion des séries temporelles et des agrégats associés.

La présence des schémas `_timescaledb_*`, `timescaledb_information` et des agrégats `ca_*` confirme une intégration effective de TimescaleDB dans l’architecture.

## 3. Snapshot confirmé au 2026-04-10

| Schéma | Tables | Vues | Vues matérialisées | Rôle principal |
|---|---:|---:|---:|---|
| `admin` | 5 | 0 | 0 | référentiels administratifs |
| `analytics` | 0 | 0 | 3 | menus et agrégats de dashboards |
| `api` | 0 | 49 | 25 | couche d’exposition SQL pour le backend |
| `audit` | 1 | 0 | 0 | audit d’ingestion |
| `geo` | 13 | 0 | 0 | référentiels spatiaux et hydrographiques |
| `hydro` | 7 | 0 | 0 | hydrologie et débits |
| `infra` | 22 | 0 | 0 | stations, barrages, infrastructures et sources ponctuelles |
| `metadata` | 37 | 2 | 3 | dictionnaires, mappings, popup rules, suivi des refresh |
| `meteo` | 5 | 0 | 0 | mesures et référentiels météo |
| `modeles` | 3 | 0 | 0 | objets de modélisation structurants |
| `monitoring` | 3 | 0 | 0 | capteurs, seuils et flux de supervision |
| `public` | 1 | 2 | 0 | reliquats techniques et compatibilité limitée |
| `qa` | 1 | 0 | 0 | contrôle qualité ciblé |
| `qualite` | 8 | 0 | 0 | qualité des eaux |
| `security` | 11 | 0 | 0 | utilisateurs, rôles, permissions et journaux |
| `staging` | 35 | 0 | 0 | structures historiques, imports et conservation intermédiaire |
| `swat_output` | 8 | 0 | 0 | sorties SWAT |
| `swat_sebou` | 4 | 0 | 0 | scénarios et résultats SWAT du projet |
| `wasp_output` | 5 | 0 | 0 | sorties WASP |
| `wasp_sebou` | 3 | 0 | 0 | scénarios et résultats WASP du projet |

## 4. Lecture par familles de schémas

### Référentiels et territoire

- `admin`
- `geo`
- `infra`

Ces schémas structurent les entités spatiales, administratives et les infrastructures mobilisées dans les cartes, filtres et dashboards.

### Mesures métier

- `hydro`
- `meteo`
- `qualite`
- `monitoring`

Ils portent les mesures historiques, les séries d’observation et les informations directement exploitées dans les vues analytiques.

### Modèles et scénarios

- `modeles`
- `swat_output`
- `swat_sebou`
- `wasp_output`
- `wasp_sebou`

Ils assurent la séparation entre le socle métier courant et les sorties ou scénarios issus des modèles.

### Gouvernance et sécurité

- `metadata`
- `security`
- `audit`
- `qa`

Ces schémas portent les dictionnaires, mappings, règles d’affichage, logs et mécanismes de contrôle.

### Transition et compatibilité

- `staging`
- `public`

`staging` conserve les structures intermédiaires ou historiques. `public` n’est plus le schéma fonctionnel principal ; il reste limité à des usages techniques ou de compatibilité résiduelle.

## 5. Couche d’exposition SQL

Le schéma `api` joue le rôle de façade de données pour l’application. Il concentre :

- des vues d’exposition métier ;
- des vues géographiques prêtes à l’usage cartographique ;
- des vues matérialisées et agrégats de performance.

Objets structurants confirmés :

- `api.mv_hierarchie_metier_listing`
- `api.mv_bassin_geojson`
- `api.mv_sous_bassin_geojson`
- `api.mv_reseau_hydrographique`
- `api.mv_station_dimension`
- `api.mv_barrage_dimension`
- `api.mv_hydro_debit_day_qa`
- `api.mv_qualite_riviere_day`
- `api.mv_qualite_sebou_day`
- `api.mv_swat_qualite_subbasin_day`
- `api.mv_wasp_qualite_segment_day`
- `api.ca_meteo_precip_day`
- `api.ca_meteo_evaporation_day`
- `api.ca_hydro_debit_source_day`

La présence de ces objets confirme que les dashboards ne reposent pas uniquement sur des tables brutes, mais sur une couche de restitution SQL déjà structurée.

## 6. Objets de gouvernance confirmés

### Sécurité

- `security.users`
- `security.roles`
- `security.permissions`
- `security.role_permissions`
- `security.password_history`
- `security.password_reset_requests`
- `security.password_reset_tokens`
- `security.refresh_tokens`
- `security.activity_logs`
- `security.auth_logs`
- `security.log_audit`

### Métadonnées

- `metadata.dictionnaire_donnees`
- `metadata.api_view_catalog`
- `metadata.api_view_column_catalog`
- `metadata.popup_rules_config`
- `metadata.mv_refresh_status`
- `metadata.referentiel_parametre`
- plusieurs tables de mapping et de couverture

### Audit et QA

- `audit.ingestion_audit_logs`
- `qa` pour les contrôles qualité ciblés

## 7. Flux logique des données

```text
Référentiels et données historiques
(`geo`, `infra`, `hydro`, `meteo`, `qualite`, `staging`)
        ↓
Mappings, dictionnaires, règles et couverture
(`metadata`)
        ↓
Scénarios et résultats modèles
(`swat_*`, `wasp_*`, `modeles`)
        ↓
Vues d’exposition et vues matérialisées
(`api`, `analytics`)
        ↓
Backend FastAPI
        ↓
Dashboards, cartographie, exports et administration
```

## 8. Implications d’architecture

- la base est organisée de manière modulaire et maintenable ;
- les schémas de gouvernance réduisent le couplage entre code applicatif et tables sources ;
- la distinction entre `staging`, schémas métier, `metadata` et `api` facilite la montée en qualité et l’évolution du système ;
- l’usage des vues matérialisées et des agrégats répond aux enjeux de performance des dashboards.

## 9. Documents complémentaires

- [DATABASE_SCHEMA](../data/DATABASE_SCHEMA.md)
- [DATA_MODELS](../data/DATA_MODELS.md)
- [DATA_FLOW](../data/DATA_FLOW.md)
- [DATA_QUALITY](../data/DATA_QUALITY.md)
- [API_DATA_MAPPING](../data/API_DATA_MAPPING.md)
- [sql_introspection_and_metadata](../data/sql_introspection_and_metadata.md)
- [EVIDENCE_REGISTER](../EVIDENCE_REGISTER.md)
