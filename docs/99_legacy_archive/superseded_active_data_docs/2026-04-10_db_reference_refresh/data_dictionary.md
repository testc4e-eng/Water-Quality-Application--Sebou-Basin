# 📘 Dictionnaire de Données WQDSS (Data Dictionary & Gouvernance)

**Version** : 1.1 (Post-Urbanisation Complète)
**Statut** : 🟢 MRO (Prêt pour Production)
**Publiccible** : Architectes, Data Engineers, Frontend/Backend Devs, Experts Métier.

---

## 1. Vue d’ensemble de la Base

La base `abh_sad` est organisée en **domaines métier** (schémas) pour garantir la séparation des préoccupations (SoC) et la performance spatio-temporelle.

*   **Finalité** : Système d'Aide à la Décision (SAD) pour le Bassin du Sebou.
*   **Technologie** : PostgreSQL + PostGIS (Spatial) + TimescaleDB (Time-series).

---

## 2. Cartographie des Schémas & Inventaire Physique

### 🏭 Schéma `infra` (Référentiel Équipements)
*   `infra.station_mesure` : Pivot central (390 stations).
*   `infra.barrage` : Ouvrages hydrauliques.
*   `infra.rejet_industriel`, `infra.rejet_domestique`, `infra.decharge` : Sources de pollution.
*   `infra.step` : Stations de traitement.

### 🌍 Schéma `geo` (Référentiel Spatial)
*   `geo.bassin_versant`, `geo.sous_bassin` : Découpage hydrographique.
*   `geo.cours_eau`, `geo.nappe` : Réseaux et ressources souterraines.

### 🧪 Schéma `qualite` (Mesures Physico-Chimiques)
*   `qualite.ref_parametre` : Catalogue des codes (DBO5, DCO, pH).
*   `qualite.campagne_mesure` : Événements de prélèvement.
*   `qualite.resultat_analyse` : Valeurs brutes labo.
*   `qualite.suivi_qualite_sebou` : Chronique consolidée.

### 📈 Schémas `hydro` & `meteo` (Séries Temporelles)
*   `hydro.mesure_debit`, `hydro.mesure_barrage` : Données d'écoulement.
*   `meteo.mesure_precipitation`, `meteo.mesure_temperature` : Données climatiques.

---

## 3. Couche d'Exposition API (`api.v_*`)

Formatage des données pour consommation directe par le Dashboard React.

| Vue | Description | Usage UI |
| :--- | :--- | :--- |
| `api.v_station_dimension` | Liste des stations actives avec métadonnées. | Sidebar Filters |
| `api.v_station_geojson` | Géométries WGS84 des stations. | Mapbox / Leaflet |
| `api.v_barrage_dimension` | État et capacité des barrages. | Dashboard Hydro |
| `api.v_qualite_mesures_enrichies` | Jointure Mesures + Paramètres. | Dashboard Qualité |

---

## 4. Rétro-compatibilité (Schéma `public`)

Des Vues Proxy ont été créées dans `public` pour ne pas casser les anciens scripts et le backend legacy.
- `public.stations_abhs` → Pointe vers `infra.station_mesure`.
- `public.mesures_qualite_rivieres` → Pointe vers `qualite._legacy_qualite_riviere`.
- `public.barrages_abhs` → Pointe vers `infra.barrage`.

---

## 5. Statistiques de Qualité (Gouvernance)

| Indicateur | Valeur (Audit Phase C) | Statut |
| :--- | :--- | :--- |
| **Taux de Mapping UUID** | 100.00 % | 🟢 |
| **Intégrité PostGIS** | Toutes géométries valides (`ST_IsValid`) | 🟢 |
| **SRID Standard** | 4326 (WGS84) appliqué | 🟢 |
| **Outliers Physico-Chimiques** | < 0.01 % (isolés par `is_valid=false`) | 🟢 |

---

## 6. Recommandations de Maintenance
- **Purge** : Les tables `_legacy_*` dans les schémas métiers peuvent être archivées après 6 mois de stabilité.
- **Index** : Surveiller l'indexation GIST sur `infra.station_mesure(geom)` pour les filtres spatiaux.
- **Sécurité** : Privilégier les rôles `role_api_reader` pour tout nouvel outil de visualisation.
2. **CI/CD** : Mettre ce dictionnaire et les scripts (`001_phaseA.sql`, `002_phaseB.sql`) dans un dossier versionné sous Git et faire tourner Liquibase ou Alembic à chaque Push pour sécuriser la Base en recette.
