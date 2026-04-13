# 🏗️ Phase A : Assainissement Structurel BDD (PostgreSQL / PostGIS / TimescaleDB)

**Document de Cadrage Architecture & Gouvernance**
*Objectif : Figer l'urbanisation, les conventions, purger la dette technique par le vide et préparer la migration depuis `public`.*

---

## 1. Diagnostic Structurel Immédiat 🩺

### 🟢 Ce qui est déjà correct (socle sain)
- La segmentation logique en plusieurs schémas dédiés (`api`, `geo`, `hydro`, `qualite`) existe, prouvant une volonté d'urbanisation.
- L'utilisation massive de PostGIS (colonnes `geom`) pour la dimension spatiale de la data.
- L'intégration de **TimescaleDB** pour les grandes séries temporelles asynchrones.
- Le concept de vue via un schéma `api` comme Data Access Layer protégeant les couches en aval.

### 🟡 Tolérable transitoirement (à résorber en Phase B)
- **Hétérogénéité des clés d'identification** : Certaines tables lient par identifiant de type chaîne/code (ex: `ire_station`), d'autres par `UUID` (nouveau standard). Cette coexistence est tolérable en Phase A mais sera normée en B.
- **Requêtes backend "bypass"** : Le backend tape directement sur les tables brutes plutôt que sur le schéma `api` à cause de vues devenues obsolètes.
- **Répétitivité des noms** : Conservation historique du suffixe redondant `_abhs` (ex: `stations_abhs`) alors que la base entière appartient à cette instance.

### 🔴 À corriger immédiatement ("Red Flags" d'architecture Phase A)
- **Collisions de Modélisation Historique dans `public`** : La table maîtresse `stations_abhs` (qui devrait vivre dans `infra` ou `ref`) et `barrages_abhs` encombrent le `public`. C'est une erreur de gouvernance grave (le schéma `public` ne doit contenir aucune donnée métier sous peine d'exposition et de confusion des permissions).
- **Absence de standards de traçabilité** : Manque chronique de colonnes d'audit système (`created_at`, `updated_at`) avec triggers de maintien synchronisés.
- **Conventions d'index spatial manquantes** : Les GIST sur certaines données postGIS sont silencieux ou cassés.

---

## 2. Conventions Cibles à Figer (Standards WQDSS) 📏

Pour garantir l'intégrité du code source Backend, BI et ETL, une **nomemclature stricte** est adoptée.

| Catégorie | Convention de Nommage | Exemple |
| :--- | :--- | :--- |
| **Schémas** | `snake_case`, nom fonctionnel singulier strict. | `geo`, `hydro`, `qualite` |
| **Tables (Référentiel/Infra/Dimension)** | `snake_case`, **Nom au Singulier**, de l'entité atomique. Interdiction du nom de base (`_abhs`). | `infra.station`, `infra.barrage` |
| **Tables (Faits / Mesures)** | `snake_case`, `nom_action_mesure_temporelle`. Si table temporaire `_staging`. | `qualite.mesure_chimique` |
| **Colonnes** | `snake_case`, mots complets acceptables (éviter acronymes flous). | `capacite_max_mm3`, `date_mesure` |
| **Clés Primaires (PK)** | Toujours nommée `id`. Exception (Tables de pur joint, pas modifiées). | `id` (UUIDv4 natif de Postgres 13+) |
| **Clés Étrangères (FK)** | Modèle d'entité relationnelle : `nom_entite_cible_id`. | `station_id` (Type UUID) |
| **Index B-Tree / BRIN** | `<nom_table>_<colonne_indexee>_idx`. | `station_code_ire_idx` |
| **Index Génériques** | `<nom_table>_pkey` pour primary, `<nom_table>_ukey` pour unique. | `barrage_pkey` |
| **Contraintes (Check/FK)** | Check: `<colonne>_chk` / FK: `<tablecible>_<colonne>_fk`. | `mesure_valeur_positive_chk` |
| **Vues (Exposition tierce)** | Préfixe `v_` obligatoire. Placé dans un schéma de consommation (`api`). | `api.v_geojson_stations` |
| **Vues Matérialisées** | Préfixe `mv_` obligatoire. (Rafraîchies par batch Cron). | `api.mv_kpi_qualite_annuel` |
| **Fonctions/Procédures** | `fn_<action>_<table>()`, verbe d'action clair / `trg_<action>()`. | `fn_update_timestamp()`, `trg_audit_station` |
| **Colonnes spatiales** | **Toujours** nommées `geom` (jamais `the_geom` ni `geometry`). | `geom` (SRID explicite requis, préféré 4326 API) |

---

## 3. Rôles Officiels des Schémas (Cartographie Urbanisée) 🗺️

L'espace de noms (Schema) équivaut à un bounded context en Domain-Driven Design (DDD).

- `public` : **Extension et Technique.** *Rôle strict* : Accueil exclusif pour les fonctions et types globaux (PostGIS, pgcrypto, UUID-ossp, TimescaleDB, aggs). **Interdit aux tables métiers.**
- `admin` / `auth` (optionnel) : **Sécurité & IAM**. Utilisateurs, rôles (RBAC), logs de connexion, référentiel de laboratoires accrédités, permissions. Frontière fine : `auth` limite avec le backend (Supabase ou Keycloak), sinon `admin` interne.
- `geo` : **Référentiels Administratifs et Structuraux (Spatial lent)**. Bassins versants (`geo.bassin`), cours d'eau, limites provinciales (`geo.province`), cercles, communes. *Donnée hautement statique requêtée par tout.*
- `infra` : **Lieux physiques & Réseaux**. Les nœuds IoT, captages. Table pivot `infra.station`, ouvrages majeurs (`infra.barrage`, STEP industrielles, vannes).
- `hydro` : **Réseau Océanographique et Jaugeage de Fond**. Séries temporelles de volumes d'eau et statistiques purement "quantité" (débits mensuels/quotidiens, chroniques de niveaux d'eau, lâchers). Ex : `hydro.mesure_debit`.
- `meteo` : **Domaine Climatologique**. Séries d'évolution d'isohyètes, des précipitations `meteo.mesure_precipitation`, bilans d'évaporation, neiges.
- `qualite` : **Environnement & Bio-chimie**. Hyper-tables de physico-chimie (DBO5, nitrates, DCO, germes), gestion des campagnes prélèvements `qualite.prelevement`, dictionnaire des composants chimiques `qualite.ref_parametre`.
- `api` : **Exposition, Consommation (DAL)**. Schéma composé **uniquement de VUES** (v_*, mv_*). Protège la base sous-jacente des applications (FastAPI/React). Si la structure de _qualite_ change, l'API View fait la rétrocompatibilité (Proxy SQL).
- `metadata` / `system` : *(Optionnel)* Dictionnaires de la qualité des données (statut des intégrations ETL hebdomadaires).
- `staging` (Staging Area ETL) : **Zone Quarantaine Ingest**. Réception des dumps EXCEL / CSV historiques ou flux IoT bruts quotidiens sans validation de de type ou d'intégrité avant traitement par un batch. *Nettoyé chaque nuit*.

---

## 4. Doctrine sur le Schéma `public` 🛡️

Le schéma `public` **DOIT être verrouillé** pour purger définitivement la dette.

- ✅ **Ce qu'il a le droit de contenir** :
    - L'extension `postgis` / `table geometry_columns` / `spatial_ref_sys`.
    - Les extensions d'authentification ou ID, fonctions génériques `uuid_generate_v4()`.
    - Des fonctions d'aggregate ou des domaines génériques (`type: url`, `type: email`).
- ❌ **Ce qu'il ne doit PLUS contenir** : 
    - Absolument aucune table contenant de l'information (ex: `stations_abhs`, `mesures_qualite`, `bassin_sebou`).
- ⏳ **Exceptions Transitoires (Phase A -> B)** : 
    - Tolérance de `stations_abhs` et `barrages_abhs` le temps de rédiger la migration des applications existantes. Durée estimée : jusqu'au sprint de déploiement B.
- 🔒 **Verrouillage Futur** : À la fin de la phase B, exécuter `REVOKE CREATE ON SCHEMA public FROM public;` pour empêcher les Data Analysts, scripts Python, ou l'applicatif de créer accidentellement de nouvelles tables ici par commodité.

---

## 5. Référentiel Minimal Obligatoire (Avant Migration) ⚓

Pour éviter que chaque schéma (`hydro`, `meteo`, `qualite`) crée sa propre définition de "Point de Mesure", 4 piliers d'unification doivent exister.

1.  **La Table Station Pivot (`infra.station`)** : Mère de toutes les mesures. Toute donnée doit y référer à 100% via `station_id` (UUID). Possède la catégorisation Enum du type de site.
2.  **La Table Barrage Pivot (`infra.barrage`)** : Découple le stockage massique historique de ce qui est ouvrage de régulation pur.
3.  **Le Dictionnaire des Paramètres (`qualite.ref_parametre_qualite`)** : Empêche l'encodage hybride de `"NO3"`, `"NO3-N"`, `"Nitrates"` dans la série temporelle. C'est l'identifiant ID qui part dans l'hypertable mesurée.
4.  **Le Dictionnaire des Unités (`ref.unite_mesure`)** : mg/L vs μg/L, m³/s vs L/s. Table référentielle incontournable pour les ETL/Dashboards. 

---

## 6. Standardisation des Colonnes Techniques (Audit Trail) ⚙️

Toute table de Référentiel, Infra ou Dimension (`geo`, `infra`, `admin`) doit comporter 4 colonnes techniques standards, gérées par triggers. (NB: Ne pas appliquer toutes ces colonnes aux énormes séries temporelles iot pur pour raison de perfs).

- **`id`** (`uuid`, Mandatory) : Généré via `gen_random_uuid()` ou `uuid_generate_v4()`. Ne jamais modifier.
- **`created_at`** (`timestamp with time zone`, Mandatory) : `DEFAULT CURRENT_TIMESTAMP`.
- **`updated_at`** (`timestamp with time zone`, Mandatory) : `DEFAULT CURRENT_TIMESTAMP`, mis à jour à chaque `UPDATE` par la fonction universelle `fn_update_timestamp()`.
- **`created_by`** / **`updated_by`** (`varchar`, Optional) : Pour tracer un flux applicatif, nom du User.
- **`source_system`** (`varchar`, Optional) : `"import_excel_v2"`, `"backend_api"`, `"saisie_manuelle"`. Crucial pour retrouver l'origine d'un lot aberrant de données historiques.
- **`is_active`** (`boolean`, Mandatory sur infra) : `DEFAULT true`. **Soft delete rule** : Un barrage ne "disparaît" pas, sa mesure `is_active = false`. On maintient ainsi les contraintes de clés antérieures intactes.
- **`geom`** (`geometry(point, 4326)` ou `26191`, Mandatory spatial) : Stockage PostGIS indexé systèmatiquement `USING GIST (geom)`.

---

## 7. Standardisation Clés et Modèle Relationnel (Legacy Sync) 🔗

- **UUID v4** en tant que Clé Primaire (`PK` / `FK`). C'est non-négociable, garant de la fusion des données offlines et de la sécurité des API contre l'énumération (`id=5` -> `id=6`). (Nativement supporté avec le type `uuid` dans PostgreSQL).
- **Gestion de la dette `code_station` (ex IRE '1217/9')** :
    - Ce code humain n'est **jamais une clé primaire**.
    - Dans la table mère (`infra.station`), c'est une colonne de type `VARCHAR` avec une contrainte `UNIQUE` : `legacy_code_ire`.
    - **Stratégie de transition (Phase A)** : Lors de la migration Data, insérer le `code_ire` des anciens fichiers pour faire une jointure de mappage (String -> UUID), remplir les tables filles par l'UUID, et ensuite pouvoir se passer du `code_ire` pour le liant intra-BDD. Le frontend peut toujours afficher ce code "Humainement lisible".

---

## 8. Standardisation PostGIS / Geospatial 🌍

- **Format de Stockage** : `GEOMETRY` (non pas `Geography` ce qui est trop lent pour d'énormes calculs vectoriels hydrologiques purs sur une étendue nationale marocaine).
- **SRID** :
    - Soit `26191` (Lambert Conformal Conic, Merchich Nord Maroc) pour la précision métrique rigoureuse des surfaces de sous-bassins.
    - Soit `4326` (WGS84 GPS Decimal Degrees) qui est aujourd'hui de fait le standard web international et APIs.
    - **Recommandation**: Si l'API renvoie du `GeoJSON`, la BDD devrait **stocker en 4326** avec index GIST. Cela évite au backend ou au routeur d'invoquer la conversion CPU-intensive `ST_Transform(geom, 4326)` sur des millions de points par la suite.
- **Indexation** : `CREATE INDEX idx_spat_<table> ON <schema>.<table> USING GIST (geom);`

---

## 9. Standard Time-Series (TimescaleDB / Hyper-tables) ⏱️

Les données observationnelles environnementales relèvent d'un volume OLAP.

- **Structure Type** d'une "Faits / Mesure" (ex: `qualite.mesure_hydrochimique`) :
    - `station_id` (UUID, FK, NOT NULL)
    - `time` (TimestampTZ, PK implicite temps, NOT NULL)
    - `param_id` (UUID ou Integer réf, FK)
    - `valeur` (Numeric / Float)
    - *Optional* : `methodologie`, `is_quality_flag_valid`.
- **Clé Primaire Compose (Primary Key Rule)** : Sur les hyper-tables TimescaleDB, le temps doit être partie intégrante du partitionnement, l'id unique pur UUID n'étant pas toujours performant s'il n'est pas inclu dans la PK composite locale. (`PK = (time, station_id, param_id)`).
- **Granularité/Chunks** : 1 Mois en général par chunk.
- **Règles Legacy** : Si l'historique a causé 2 mesures pour la même station le même jour : Upsert conflict `ON CONFLICT DO UPDATE...` => Le flux récent l'emporte.

---

## 10. PACK SQL — Assainissement Immédiat (Phase A DDL) 💻

Ce bloc pose les fondations sans impacter (Drop) l'applicatif actuel.

```sql
-- 1. EXTENSIONS SYSTEMES (Dans public)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;

-- 2. CRÉATION DES SCHÉMAS NORMatifs
CREATE SCHEMA IF NOT EXISTS geo;
CREATE SCHEMA IF NOT EXISTS infra;
CREATE SCHEMA IF NOT EXISTS hydro;
CREATE SCHEMA IF NOT EXISTS meteo;
CREATE SCHEMA IF NOT EXISTS qualite;
CREATE SCHEMA IF NOT EXISTS api;
CREATE SCHEMA IF NOT EXISTS staging;

-- Commentaires de Gouvernance (Metadata System)
COMMENT ON SCHEMA public  IS 'ZONE ROUGE - Interdit aux tables métier (fonctions globales/postgis uniquement).';
COMMENT ON SCHEMA api     IS 'Data Access Layer pour le Frontend (Backend fastapi) - Exclusivement des Vues, MViews, et API routes prêtes.';
COMMENT ON SCHEMA qualite IS 'Séries historiques et références physico-chimiques (Eaux).';
COMMENT ON SCHEMA infra   IS 'Réseau IoT, Stations pivots, Ouvrages lourds (barrages).';

-- 3. FONCTION UNIVERSELLE D'AUDIT
CREATE OR REPLACE FUNCTION public.fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.fn_update_timestamp IS 'Mise a jour automatique de de la col updated_at pour tables ref/infra';

-- 4. PRÉPARATION DU DICTIONNAIRE TRANSVERSAL OBLIGATOIRE (Paramètres)
CREATE TABLE IF NOT EXISTS qualite.ref_parametre (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_abrege VARCHAR(50) UNIQUE NOT NULL,       -- ex: DBO5
    nom_complet VARCHAR(255) NOT NULL,             -- Demande biologique en Oxygene a 5J
    unite VARCHAR(50) NOT NULL,                    -- mg/L
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS trg_update_ref_parametre ON qualite.ref_parametre;
CREATE TRIGGER trg_update_ref_parametre
BEFORE UPDATE ON qualite.ref_parametre
FOR EACH ROW EXECUTE PROCEDURE public.fn_update_timestamp();

-- Index métier
CREATE INDEX idx_ref_parametre_code ON qualite.ref_parametre(code_abrege);
```

---

## 11. PACK SQL — Contrôle & Audit de Structure (Dashboard DBA) 👁️‍🗨️

Exécuter ces requêtes pour identifier exactement le delta en dette technique.

```sql
-- Q1. Tables Métier illégales résiduelles dans le Public (Hors extensions spatiales raw)
SELECT tablename, tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT IN ('spatial_ref_sys', 'geometry_columns', 'geography_columns');

-- Q2. Tables du projet ne possédant PAS de Clé Primaire : Danger total Intégrité Relat / ORM
SELECT n.nspname AS schemaname, c.relname AS tablename
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_index i ON c.oid = i.indrelid AND i.indisprimary
WHERE c.relkind = 'r' 
  AND i.indrelid IS NULL 
  AND n.nspname NOT IN ('pg_catalog', 'information_schema') AND n.nspname NOT LIKE '_time%';

-- Q3. Colonnes GEOMETRY avec un index GIST potentiellement manquant (Performance Danger)
SELECT c.table_schema, c.table_name, c.column_name
FROM information_schema.columns c
LEFT JOIN pg_indexes i ON i.schemaname = c.table_schema 
                      AND i.tablename = c.table_name
                      AND i.indexdef ILIKE '%USING gist%'
WHERE c.udt_name = 'geometry' 
  AND i.indexname IS NULL
  AND c.table_schema NOT IN ('pg_catalog', 'topology');

-- Q4. Audit des Clés Varchar/Old-School au lieu de UUID (Séries Temporelles cibles de scan)
SELECT table_schema, table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema IN ('qualite', 'hydro', 'public') 
  AND column_name ILIKE '%id%' 
  AND data_type = 'character varying' OR data_type = 'integer';
```

---

## 12. Plan d'Exécution Opérationnel (La "Semaine 1") 🚦

| Étape | Action (DBA / Architect) | Validation Exit |
| :--- | :--- | :--- |
| **0. Freeze** | Geler temporairement le code sur Backend "FastAPI" / Eviter pull/push CRUD. Backup Prod Complet (pg_dump). | `backup_wds_mar2026.sql` prêt et validé. |
| **1. Init Structural** | Exécuter le bloc "PACK SQL — Assainissement Immédiat (Phase A DDL)". | Les 7 schémas métiers existent et le trigger `fn_update` est globalement dispo. Les extensions (`uuid-ossp`) certifiées. |
| **2. Healthcheck Audit** | Lancer les requêtes du "PACK SQL — Contrôle" et exporter un `baseline_audit.csv`. Il donnera précisément la liste des tables à migrer plus tard. | Zéro erreur. Liste documentée des 30+ tables à corriger en phase B. |
| **3. Freeze Refactoring App**| Ajuster finement la base de données de test en local par rapport au repo `backend/models` et `backend/routers`. Mettre en place SQLAlchemy pour "ignorer" le mot public s'il modéli-sait sans schema. (L'ORM sait changer de search_path). | Validation des tests Unitaires. |
| **4. Alignement Métadonnées** | Renommer quelques colonnes post-mortem si pertinent (Phase B préparatoire, non destructif). | Code prêt, PR Backend Reviewée. |

---

## 13. Risques, Garde-Fous et Politique de Mitigation 🔥

| Risque Identifié | Impact | Guard-Fail (Garde fou) d'architecture |
| :--- | :---: | :--- |
| **Casse Applicative Vues Backend** (FastAPI qui crashe en Error 500) | Critique | Ne jamais appliquer `DROP` sur public tant qu'on n'a pas migré via `SET SCHEMA`. Les vues `api.v_*` joueront le rôle de Proxy temporaire qui "pointe" sur l'ancienne table public pour protéger le Web, le temps de migrer la BD. |
| **Modèles ORM Désynchronisés** (SQLAlchemy n'arrive pas à lier ID/String) | Majeur | Coder les classes modèles "Legacy" explicitement avec `__table_args__ = {'schema': 'qualite'}` et vérifier les migrations locales avant Merge Request. |
| **Contraintes Intégrales Échouées** (`#1217` vs `uuid` de station) | Élevé | Utiliser des requêtes de type `WITH station_mapping AS (...) UPDATE qualite...` lors d'une fenêtre de maintenance stricte. Vérifier qu'un record manquant dans le dict des stations est placé dans "*Station inconnue_import*". |
| **Erreur de DDL dans `public` (futur par des Dev/BI)** | Moyen | `REVOKE CREATE ON SCHEMA public FROM my_app_user, bi_powerbi_role;`. Force l'utilisation correcte (geo, qualite...). |

---

## 14. Préparation de la "Phase B" (Coup d'Envoi) 🏁

**À l'issue de cette Phase A, que reste-t-il préparé ?**
- L'environnement de la BDD est désormais cloisonné, intelligent (Schémas explicitement documentés liés au code).
- La table *Dictionaries* (Paramètres physico-chimie) est prête avec ses audits Triggers. 
- Les requêtes d'Aiguillage DDL sont validées. Le Backup prod prouvé.

**Objectifs de la Phase B à ouvrir directement ensuite :**
1. L'application effective des commandes Migration (`ALTER TABLE public.stations_abhs SET SCHEMA infra; RENAME TO station;`).
2. Mappages des centaines de millions de lignes historiques *qualite* de leur liaison texte `ire` vers la vraie `FK` (UUID) de l'infra.station.
3. Transformation de ce mapping legacy sur **TimescaleDB** nativement.
4. Passage du Backend "Routing direct public" à un "Routing API" pour un Frontend haut-débit via Vue de requêtes pré-aggégées `api.mv_*`.

---
## Annexes Techniques (Checklists)

### A. Matrice d’Objet (Transition BDD - Actuel -> Cible)
*   `public.bassin_sebou` ➔ `geo.bassin` (RENOMMAGE & MOVE)
*   `public.barrages_abhs` ➔ `infra.barrage` (RENOMMAGE, MOVE, FIX GEOMETRY)
*   `public.stations_abhs` ➔ `infra.station` (RENOMMAGE, MOVE)
*   `qualite._legacy_qualite_...` ➔ *A terme : Éclatée en `qualite.mesure_observation` (Timescale) et `qualite.ref_parametre`*.

### B. Maintien Backend / Modélisation ORM SQLAlchemy
Si l'application utilise SQLAlchemy / SQLModel, la phase A dicte l'architecture suivante :

```python
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID

# Toujours forcer l'entité relationnelle :
class Station(Base):
    __tablename__ = "station"
    __table_args__ = {'schema': 'infra'} # Forcé par les conventions de dev
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    code_ire = Column(String(50), unique=True) # Conservation du code historique WQDSS
    # geom = Column(Geometry('POINT', srid=4326))
```

### C. Checklist Validation DBA (Avant Git Commit phase B)
- [ ] Le schéma API ne contient aucune table "vivante", uniquement des **Views**.
- [ ] Le schéma `public` ne liste plus `mesures_debits`, `barrages`, ou `stations`.
- [ ] Le rôle applicatif `backend_user` a `USAGE` sur `hydro, infra, api` et `SELECT` sur des views `api`.
- [ ] Tests Spatiaux : Un `EXPLAIN ANALYZE` sur un `ST_Contains` montre bien un parcours d'Index GIST.
