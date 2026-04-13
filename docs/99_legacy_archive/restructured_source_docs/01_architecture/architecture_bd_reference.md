# Documentation d'Architecture de Référence : Base de Données `abh_sad`

Ce document constitue la référence technique et métier pour l'urbanisation, la gestion et l'exploitation de la base de données du **Système d'Aide à la Décision (SAD)** pour la qualité des eaux de surface du bassin du Sebou.

---

## 🏗️ 1. Vue d’ensemble de l’architecture BD

### Rôle Global
La base de données `abh_sad` est le cœur réacteur de la plateforme. Elle assure la persistance des données hydro-climatiques, spatiales (SIG) et de qualité, tout en servant de couche analytique pour le dashboard via des vues optimisées (API Layer).

### Domaines Métier Couverts
1. **Hydrologie & Hydraulique** : Suivi des débits et des barrages.
2. **Qualité des Eaux** : Campagnes de prélèvements et analyses physico-chimiques.
3. **Météorologie** : Pluviométrie et températures.
4. **Référentiel Spatial (SIG)** : Découpage administratif et hydrographique.

### Architecture Multi-Schémas
L'architecture a migré d'un modèle monolithique (`public`) vers une **urbanisation par domaines métier** :
- **`hydro` / `meteo`** : Séries temporelles gérées par **TimescaleDB** (Hypertables).
- **`geo` / `infra`** : Référentiels géographiques gérés par **PostGIS**.
- **`qualite`** : Suivi environnemental ponctuel.
- **`api`** : Couche d'exposition sémantique (Vues).

---

## 📂 2. Inventaire technique détaillé

| Objet | Schéma | Type | Rôle |
| :--- | :--- | :--- | :--- |
| `mesure_debit` | `hydro` | Hypertable | Séries temporelles de débit (mensuel). |
| `station_mesure` | `infra` | Table | Référentiel pivot des points de mesure (Point PostGIS). |
| `v_station_dimension`| `api` | Vue | Vue enrichie (JOIN admin/geo) pour le backend. |
| `ca_hydro_debit_day` | `api` | Cont. Agg | Agrégats journaliers TimescaleDB (Performance). |
| `audit_log` | `security`| Table | Traçabilité des modifications (JSONB). |

---

## 🗺️ 3. Cartographie métier de la donnée

- **Référentiel Territorial** (`admin`, `geo`) : Contient les limites des provinces, communes et sous-bassins. Indispensable pour les filtres géographiques du dashboard.
- **Séries Temporelles** (`hydro`, `meteo`) : Gère des millions de points de données. Optimisé pour les graphiques de tendances (Highcharts/Chart.js).
- **Suivi Qualité** (`qualite`) : Centralise les résultats d'analyses croisés avec les normes environnementales (Vues de conformité).

---

## ⚠️ 4. Analyse détaillée du schéma `public`

### Diagnostic
- **Légitime** : Fonctions d'extensions (`postgis`, `timescaledb`).
- **À Migrer** : Toutes les tables "miroir" ou temporaires héritées des anciennes versions d'ETL.
- **Doctrine** : Le schéma `public` ne doit plus contenir d'objets métier (`stations_abhs` -> `infra.station_mesure`). L'utilisation de schémas nommés améliore la sécurité (permissions par schéma) et la maintenance.

---

## 📖 5. Dictionnaire de données métier et technique

### Table : `infra.station_mesure`
- **Finalité** : Point d'ancrage de toutes les mesures.
- **PK** : `UUID` (généré par défaut).
- **Colonnes Clés** : `code_station` (Métier), `geom` (PostGIS 4326), `type_station` (Filtre).
- **Fréquence** : Mise à jour annuelle ou lors de nouveaux équipements.

### Table : `hydro.mesure_debit` (SAD Core)
- **Finalité** : Stockage des débits mesurés.
- **Granularité** : Pas de temps variable (15min à journalier).
- **Index** : `(station_id, temps DESC)` pour accès rapide aux derniers relevés.

---

## 🔗 6. Analyse des relations et du modèle logique

Le modèle est en **étoile hybride** :
- **Table Pivot (Centrale)** : `infra.station_mesure`.
- **Faits (Séries)** : `hydro.*`, `meteo.*`, `qualite.*`.
- **Dimensions (Statiques)** : `geo.*`, `admin.*`.

---

## 🛡️ 7. Analyse de la qualité d’architecture

- **Points Forts** : Utilisation native de TimescaleDB (compression, agrégats continus) et PostGIS.
- **Dette Technique** : Incohérence de nommage entre certaines tables SQL (`plural` vs `singular`).
- **Risques** : Manque de contraintes `FOREIGN KEY` sur les hyper-tables si non géré prudemment avec TimescaleDB (Note : Timescale supporte les FK sur les tables régulières vers hypertables mais avec restrictions).

---

## 🚀 8. Stratégie de migration du schéma `public`

1. **Audit** : `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`.
2. **Mapping** : Créer des vues de compatibilité dans `public` pointant vers les nouveaux schémas.
3. **Execution** : `ALTER TABLE public.old_name SET SCHEMA hydro;`.
4. **Validation** : Vérifier que le backend configuré en `.env` (mis à jour) répond correctement.

---

## 🛠️ 10. Plan d’adaptation backend (FastAPI/Alembic)

- **Mapping ORM** : Mettre à jour les paramètres `__table_args__ = {"schema": "hydro"}` dans les modèles SQLAlchemy.
- **Versionnement** : Utiliser Alembic pour tracer les migrations de schémas métier.
- **Repository Pattern** : Isoler les requêtes sur les vues `api.*` pour simplifier les contrôleurs.

---

## 🎨 11. Plan d’adaptation frontend (GeoJSON)

- **Endpoints SIG** : Utiliser exclusivement `api.v_station_geojson` pour MapBox/Leaflet.
- **Graphiques** : Consommer les `continuous aggregates` (`ca_hydro_*`) pour éviter les timeouts sur les gros volumes.

---

## 🔒 13. Sécurité, rôles et traçabilité

- **Lecteur (RO)** : Accès uniquement au schéma `api`.
- **Gestionnaire (RW)** : Accès aux schémas métiers (`hydro`, `meteo`, `qualite`).
- **Audit** : Le trigger sur `security.audit_log` doit être systématique sur `infra` et `admin`.

---

## 📈 14. Performance et volumétrie

- **Compression** : Activer la compression TimescaleDB après 90 jours pour réduire l'espace de 90%.
- **Aggregates** : Les vues `ca_*` divisent par 50 le temps de réponse frontend pour les graphiques annuels.

---

## 🏁 15. Recommandations prioritaires

1. **Quick Win** : Supprimer les tables doublons identifiées dans `public`.
2. **30 Jours** : Finaliser le dictionnaire de données complet dans `metadata.catalogue`.
3. **90 Jours** : Automatiser l'archivage/compression des données de plus de 5 ans.
