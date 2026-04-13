# 🏗️ Phase B : Migration Contrôlée & QA Data (PostgreSQL / PostGIS)

**Document Stratégique de Refactoring & Consommation API**
*Objectif : Exécuter la sortie définitive du schéma `public`, mapper les données, construire les vues `api.*` de consommation applicative et certifier la base sans régression.*

---

## 1. Diagnostic de Départ Phase B 🧭

- ✅ **Faits Observés** : La Phase A a créé les schémas métiers (`geo`, `infra`, `hydro`, `qualite`, `api`). Les rôles sont assignés. Le trigger d'audit `updated_at` est prêt. L'extension "uuid-ossp" est active.
- 🔴 **Dette Existante (Table métier du `public`)** :
    - `public.stations_abhs` (Pivot majeur, UUID id)
    - `public.barrages_abhs` (Pivot majeur, UUID id, sans geom fonctionnelle)
    - `public.bassin_sebou` / `sous_bassin_sebou` (Geo pure)
    - `public.nappes_abhs` (Geo)
    - `public.reseau_hydro_abhs` (Geo, volumineux)
    - `public.decharges_abhs` / `huileries_abhs` (Infra pollution)
- ⚠️ **Analyse de Risque Applicatif** :
    - Le Backend FastAPI tape actuellement sur `public.stations_abhs` et `qualite._legacy_qualite_riviere` directement. **Risque 🔴 (Très élevé)** : Casser les routes si on Drop/Move sans filet.
- 💡 **Recommandation** : Les objets seront déplacés et **des vues proxy** portant l'exact même nom (`stations_abhs`) seront provisoirement créées dans `public` pour leurrer le Backend existant le temps de migrer ce dernier sur le schéma `api`.

---

## 2. Inventaire Exhaustif des Objets à Migrer 📦

Matrice consolidée des tables identifiées dans le schéma source.

| Schéma Actuel | Nom Actuel | Type | Domaine | Schéma Cible | Nom Cible | Prio | Complx | Stratégie |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `public` | `stations_abhs` | Table | Infra IoT | `infra` | `station` | P1 | Moy. | Type B + F (Vue proxy) |
| `public` | `barrages_abhs` | Table | Infra Hydr. | `infra` | `barrage` | P1 | Moy. | Type B + F (Vue proxy) |
| `public` | `bassin_sebou` | Table | Geo Spat | `geo` | `bassin` | P2 | Faible | Type B |
| `public` | `sous_bassin_sebou`| Table | Geo Spat | `geo` | `sous_bassin` | P2 | Faible | Type B |
| `public` | `reseau_hydro...` | Table | Geo Spat | `geo` | `reseau_hydro` | P2 | Faible | Type B |
| `public` | `nappes_abhs` | Table | Geo Spat | `geo` | `nappe` | P2 | Faible | Type B |
| `public` | `huileries_abhs` | Table | Infra Poll. | `infra` | `huilerie` | P3 | Faible | Type B |
| `public` | `decharges_abhs` | Table | Infra Poll. | `infra` | `decharge` | P3 | Faible | Type B |
| `public` | `rejets_ind_abhs` | Table | Infra Poll. | `infra` | `rejet_industriel`| P3 | Faible | Type B |
| `qualite`| `_legacy_qualite_ri..`| Hypertable| Qualité | `qualite` | `mesure_physico_chimique` | P1 | **Forte** | Type D + E (Mappage Legacy -> UUID) |

---

## 3. Typologie Officielle des Migrations (Protocoles) 📋

- **Type A (Déplacement Simple)** : `ALTER TABLE <nom> SET SCHEMA <nouveau>;`. Risque Zéro base.
- **Type B (Dépl. + Renommage)** : Le standard. `ALTER TABLE .. SET SCHEMA infra; ALTER TABLE .. RENAME TO station;`. 
- **Type D/E (Reconstruction + Mapping Legacy)** : Concerne les hypertables temporelles liant via `Varchar` au lieu de `UUID`. Création de la table cible vierge -> `INSERT INTO cible SELECT ... JOIN mapping ...`.
- **Type F (Vue de Compatibilité Proxy)** : Crucial. Après un Type B, générer un `CREATE VIEW public.stations_abhs AS SELECT ... FROM infra.station;`. L'application ne voit aucune différence.
- **Type G (Vues API Consommation)** : Construites de novo pour alimenter le dashboard `React`.

---

## 4. Gestion des Identifiants & Mapping Legacy 🔗

**Objectif** : Lier chroniques physico-chimiques (`qualite._legacy_...`) à la nouvelle table mère `infra.station` par `UUID`.

**Cas d'Usage** :
- `infra.station` = PK `id` (UUID), `code_ire` (VARCHAR '1217/9').
- `qualite.legacy_mesure` = PK chronologique, liée via `ire_station` (VARCHAR '1217/9').

**Stratégie Type E (Mapping à la volée)** :
La nouvelle table sera : `qualite.mesure_observation` (FK `station_id` UUID).
```sql
-- Requête d'insertion transformatrice
INSERT INTO qualite.mesure_observation (station_id, date_prelevement, param_code, valeur)
SELECT s.id, q.date_prelevement, q.parametre_qualite, q.val_qual_riv
FROM qualite._legacy_qualite_riviere q
JOIN infra.station s ON s.code_ire = q.ire_station;
```
*Garde-Fou* : Un rapport DBA va lister les enregistrements dont le `q.ire_station` n'a pas trouvé de correspondance dans `s.code_ire`. Ces "Orphelins" historiques justifient un nettoyage manuel.

---

## 5. Pack SQL — Audit & Pré-Migration (Checklists DBA) 🩺

À lancer **avant toute** migration (Fenêtre d'audit S-1).

```sql
-- 5.1 Vérifier quelles vues ou fonctions dépendent de 'public.stations_abhs'
SELECT v.oid::regclass AS dependent_view
FROM pg_depend d
JOIN pg_rewrite r ON r.oid = d.objid
JOIN pg_class v ON v.oid = r.ev_class
WHERE d.refobjid = 'public.stations_abhs'::regclass;

-- 5.2 Identifier les enregistrements de mesures Qualité qui n'ont pas de Station
-- (Lignes orphelines bloquant techniquement une FK UUID future)
SELECT l.ire_station, count(*) as volumetrie
FROM qualite._legacy_qualite_riviere l
LEFT JOIN public.stations_abhs s ON l.ire_station = s.code_station
WHERE s.code_station IS NULL
GROUP BY l.ire_station;
```

---

## 6. Pack SQL — Migration Contrôlée (Dry-Run prêt) 🚜

Blocs exécutables atomiques (Transactions).

```sql
BEGIN;

-- -----------------------------------------------------------------------------
-- EX 1 : MIGRATION DE LA STATION PIVOT (TYPE B + F)
-- -----------------------------------------------------------------------------
-- 1. Migration Physique (0.01s - DDL Only)
ALTER TABLE public.stations_abhs SET SCHEMA infra;
ALTER TABLE infra.stations_abhs RENAME TO station;

-- 2. Renommage des index pour cohérence
ALTER INDEX IF EXISTS public.stations_abhs_pkey RENAME TO station_pkey;
-- (Assumer de recréer les index GIST si le search_path bloque, mais normalement transférés).

-- 3. Mise en place du Proxy de Rétro-Compatibilité PURE (Pour le Backend existant)
CREATE VIEW public.stations_abhs AS 
SELECT id, nom, code_station, type_station, altitude_m, actif, geom 
FROM infra.station;

-- 4. Audit Trail auto-assigné (Phase A)
ALTER TABLE infra.station ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
CREATE TRIGGER trg_audit_station BEFORE UPDATE ON infra.station FOR EACH ROW EXECUTE PROCEDURE fn_update_timestamp();

COMMIT;
```

```sql
BEGIN;
-- -----------------------------------------------------------------------------
-- EX 2 : BARRAGES & GEO (TYPE B + F)
-- -----------------------------------------------------------------------------
ALTER TABLE public.barrages_abhs SET SCHEMA infra;
ALTER TABLE infra.barrages_abhs RENAME TO barrage;
CREATE VIEW public.barrages_abhs AS SELECT * FROM infra.barrage;

ALTER TABLE public.bassin_sebou SET SCHEMA geo;
ALTER TABLE geo.bassin_sebou RENAME TO bassin;
CREATE VIEW public.bassin_sebou AS SELECT * FROM geo.bassin;

COMMIT;
```

---

## 7. Pack Vues `api` (Nouveau Data Access) 🚀

Construire ces vues en parallèle pour basculer doucement le Frontend React via FastAPI sur de l'optimisé.

```sql
-- 7.1 Référentiel Dimension (Remplacement propre des anciennes vues cassées)
CREATE OR REPLACE VIEW api.v_station_dimension AS
SELECT 
    s.id AS station_id,
    s.code_station AS code_ire,
    s.nom AS station_nom,
    s.type_station,
    s.altitude_m,
    sb.nom AS sous_bassin_nom
    -- (Laissant de coté les ST_Contains massifs si pré-calculés)
FROM infra.station s
LEFT JOIN geo.sous_bassin sb ON ST_Contains(sb.geom, s.geom);

-- 7.2 GeoJSON Automatique pour Mapbox/Leaflet (Très Haute Perf Backend)
CREATE OR REPLACE VIEW api.v_station_geojson AS
SELECT row_to_json(fc) AS geojson 
FROM (
    SELECT 'FeatureCollection' AS type, array_to_json(array_agg(f)) AS features 
    FROM (
        SELECT 'Feature' AS type,
               ST_AsGeoJSON(ST_Transform(s.geom, 4326))::json AS geometry,
               row_to_json((SELECT l FROM (SELECT id, nom, type_station) As l)) AS properties
        FROM infra.station s
    ) As f
)  As fc;

-- 7.3 KPI Materialized View (Évite d'analyser 1M lignes de qualités pour dessiner 3 Dashboards)
CREATE MATERIALIZED VIEW api.mv_kpi_qualite_annuel AS
SELECT 
    s.id AS station_id,
    EXTRACT(YEAR FROM q.date_prelevement) AS annee,
    q.parametre_qualite,
    AVG(q.val_qual_riv) AS val_moyenne,
    COUNT(q.val_qual_riv) AS nb_mesures
FROM qualite._legacy_qualite_riviere q
JOIN infra.station s ON s.code_station = q.ire_station
GROUP BY 1, 2, 3
WITH DATA;
-- À rafraichir occasionnellement : REFRESH MATERIALIZED VIEW CONCURRENTLY api.mv_kpi_qualite_annuel;
```

---

## 8. Plan d'Exécution Opérationnel (Lots de Déploiement) 📆

| Ordre | Lot | Objets | Méthode SQL | Risque |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Domaine Spatiale (Geo)** | Bassins, Sous-Bassins, Nappes, Réseau Hydro | `SET SCHEMA geo` + proxy view public | Faible. Aucune écriture transactionnelle depuis le Web. |
| **2** | **Infrastructures Compl. (Infra)** | Décharges, Huileries, Rejets | `SET SCHEMA infra` + proxy view | Faible. |
| **3** | **Cœur de Modèle (Pivots)** | `stations_abhs`, `barrages_abhs` | `SET SCHEMA infra` + **Proxy views STRICTES** | Haute. Ordonnancement avant le reste imposé. |
| **4** | **Reconstruction Legacy** | Mapping et Migration des 860k mesures Qualité sur `UUID` | Script Type E + Timescale Chunking | **Très Élevé**. Validation Volume stricte requise. |
| **5** | **Vues DAL API** | Déploiement `api.v_*` et `api.mv_*` | `CREATE OR REPLACE VIEW api...` | Faible. N'affecte pas l'existant. |
| **6** | **Backend Flip** | Changement des requêtes FastAPI pour consommer uniquement `api.v_*` | Changement PR Python | Moyen (Surveiller QA). |

---

## 9. 🏆 RAPPORT FINAL D'AUDIT ET VALIDATION POST-MIGRATION (Le GO/NOGO)

*À produire de manière exhaustive après le passage du SQL.*

### 9.1 Rapport de Validation Global (Modèle Dashboard)
**Migration du :** `28 Mars 2026`  | **Version** : `WQDSS-Core-DB-v2` | **Environnement** : `PROD`
| Schéma Cible | Objet | Statut | Volumétrie (Avant/Après) | Anomalies Rejet | Verdict |
|---|---|---|---|---|---|
| `infra` | `station` | 🟢 SUCCESS | 390 / 390 lignes | 0 (0%) | Parfait. |
| `infra` | `barrage` | 🟢 SUCCESS | 34 / 34 lignes | 0 (0%) | Parfait. (Geom toujours vide). |
| `qualite` | `mesure_obs`| 🟡 WARN | 861 / 852 lignes | 9 orphelines. | 9 lignes ignorées car code_ire erroné. |

### 9.2 Contrôles d'Intégrité et Données (SQL)
Requête de certitude comptable. Doit retourner 0 sur toute la feuille.
```sql
-- Lignes non transférables de la dette (Validation d'erreur de clé)
SELECT 'qualite.legacy' as source, count(*) as err_count
FROM qualite._legacy_qualite_riviere q
WHERE NOT EXISTS (SELECT 1 FROM infra.station s WHERE s.code_ire = q.ire_station)
UNION ALL
SELECT 'barrage', count(*) 
FROM infra.barrage 
WHERE id IS NULL;
```

### 9.3 Audit Spatial (PostGIS Sanity Check)
```sql
-- Trouver toute géométrie illégale générée par des mauvais types B
SELECT 'infra.station' AS table, id, ST_IsValidReason(geom) 
FROM infra.station WHERE ST_IsValid(geom) = false;
```

### 9.4 Audit des Dépendances & Sécurité Publique
```sql
-- Vérifier que plus aucune table légitime n'habite le SCHÉMA PUBLIC (Exceptions proxy autorisées durant l'intersprint)
SELECT relname 
FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
WHERE n.nspname = 'public' AND c.relkind = 'r' 
  AND c.relname NOT IN ('spatial_ref_sys'); -- Le résultat DOIT être nul.
```

### 9.5 Performances des Vues API
```sql
-- S'assurer qu'une requête Backend met moins de 50ms sur les géométries lourdes
EXPLAIN ANALYZE SELECT * FROM api.v_station_geojson;
-- -> Doit utiliser Index Scan sur infra.station
```

---

## 10. Check-lists Finales / GO de Production 🏁

### DBA Checklist
- [ ] Les Triggers d'Audit `updated_at` sont actifs sur `infra.station` et `infra.barrage`.
- [ ] Toutes les 8 vues proxy `public.*_abhs` pointent bien vers `infra` / `geo` sans erreur.
- [ ] Zéro table système (relkind 'r') orpheline n'est restée dans `public`.
- [ ] Le Script `backup_rollback.sql` (qui Drop `infra.station` et relocalise dans `public`) a été testé sur une base CI.

### Backend Developer Checklist
- [ ] PR pour transformer FastAPI: Retirer `public.stations_abhs` du code et router vers `api.v_station_dimension`.
- [ ] Le type ODB (Axios) TypeScript correspond exactement à la nouvelle API View JSON.
- [ ] **Test E2E Frontend** : L'écran "Dashboards Qualité" s'affiche toujours instantanément.

### Validation Data
- [ ] La volumétrie des Vues Méta API (`COUNT * api.v_station_dimension`) est STRICTEMENT ÉGALE à l'ancienne `COUNT * public.stations_abhs`. Score d'intégrité : **100/100**.
