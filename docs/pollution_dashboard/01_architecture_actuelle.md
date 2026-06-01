# Architecture Actuelle du MVP

## 1. Stack Technologique
- **Frontend** : React 18, TypeScript, MapLibre GL JS, React-Map-GL (v8), TailwindCSS, Shadcn UI.
- **Backend** : FastAPI (Python), SQLAlchemy.
- **Base de données** : PostgreSQL avec l'extension spatiale PostGIS.

## 2. Composants React Principaux
Le dashboard est architecturé autour de trois composants clés :
- `DashboardPollution.tsx` : Page conteneur gérant l'état global (incident sélectionné, données cartographiques, résultats de simulation).
- `PollutionMap.tsx` : Composant cartographique (MapLibre) gérant le rendu des couches GeoJSON (Réseau hydro, marqueurs des stations et barrages, vecteur d'impact).
- `PollutionSidebar.tsx` : Panneau latéral d'interaction permettant la saisie des paramètres de l'incident (type de polluant, date) et affichant le tableau de bord des impacts (ETA, recommandations).

## 3. Structure Spatiale PostgreSQL/PostGIS
La base de données héberge les géométries natives. Les tables exploitées sont :
- `geo.reseau_hydrographique` : Segments du fleuve et affluents.
- `api.v_station_dimension` (ou table associée) : Points de localisation des stations.
- `api.v_barrage_dimension` (ou table associée) : Points de localisation des barrages.

## 4. API Backend (Endpoints GeoJSON)
Le backend expose des endpoints dynamiques (`/api/v1/geojson/{layer_key}`) qui convertissent les géométries PostGIS en FeatureCollection GeoJSON consommables par MapLibre.
