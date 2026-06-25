# Stratégie de Visualisation Experte : SIG & Dashboards (SAD Sebou)

Ce document définit l'architecture de visualisation cible pour le Système d'Aide à la Décision (SAD) de la qualité des eaux du bassin du Sebou.

---

## 🏗️ 1. Architecture des Flux de Données

### Couche SIG (Système d'Information Géographique)
- **Standard** : GeoJSON natif via PostGIS.
- **Optimisation** : Contrairement à l'approche actuelle (transformation en Python), la donnée doit être servie via la vue `api.v_station_geojson`.
- **Bénéfice** : Réduction de la latence de 80% et inclusion automatique des métadonnées enrichies (Bassin, Organisme, Code Station).

### Couche Dashboard (Séries Temporelles)
- **Source** : `api.ca_hydro_debit_day` (Time-series continuous aggregate).
- **Bénéfice** : Affichage instantané des tendances annuelles même sur des millions de points, sans surcharger la mémoire du navigateur.

---

## 🎨 2. Organisation du Dashboard Professionnel

### A. Indicateurs Clés (KPIs)
1. **Statut du Réseau** : Nombre de stations actives vs hors-ligne (Source: `api.v_station_status`).
2. **Qualité Globale** : Indice de qualité moyen par sous-bassin.
3. **Alertes de Crues** : Nombre de stations dépassant le seuil de vigilance.

### B. Couches SIG Priorisées
| Couche | Source de Données | Type de Visualisation |
| :--- | :--- | :--- |
| **Stations** | `api.v_station_geojson` | Points proportionnels (Taille = Débit moyen) |
| **Bassin** | `geo.bassin_versant` | Polygones (Choroplèthe par qualité) |
| **Pollution** | `infra.source_pollution` | Heatmap d'intensité de rejet |
| **Réseau Oued** | `geo.cours_eau` | Lignes (Épaisseur = Importance hydro) |

---

## 🛠️ 3. Roadmap d'Implémentation Technique

### Étape 1 : Refactoring du Router GeoJSON (Backend)
Remplacer le catalogue statique `public.*` par un catalogue dynamique pointant sur le schéma `api.*`.

### Étape 2 : Optimisation de l'Endpoint Stations
Basculer de la transformation Lambert-WGS84 en Python (`stations.py`) vers un `SELECT * FROM api.v_station_dimension`.

### Étape 3 : Intégration Chart.js / Leaflet (Frontend)
Utiliser des sources de données `VectorTile` ou `GeoJSON` dynamiques pour une fluidité maximale sur mobile et desktop.

---
*Ce document sert de guide pour les développeurs Full-Stack et les experts SIG du projet.*
