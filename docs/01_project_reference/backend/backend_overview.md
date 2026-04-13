# ⚙️ Documentation Backend API - WQDSS

Le Backend du système est construit en **FastAPI (Python)**. Il sert de Data Access Layer (DAL) entre la base de données PostgreSQL/PostGIS et les dashboards Frontend.

## Architecture des Routeurs (API)

Les routeurs ont été restructurés pour taper directement sur les schémas métiers (qualité, hydro, geo) ou `public` suite à la migration des données de mars 2026.

### 1. Routeur Qualité des Eaux (`/quality`)
Gère l'historique massif (Time-Series) des prélèvements (`qualite._legacy_qualite_riviere`).
- `GET /stations` : Jointure entre le référentiel des stations (`public.stations_abhs`) et les analyses pour lister les points de contrôle.
- `GET /kpis` : Calcule les totaux (1988->2013) : nombre de campagnes, analyses, et paramètres.
- `GET /chart` : Agrége temporellement par date pour les séries `NO3`, `pH`, `DBO5`, `DCO`, `O2` (utilisé par Recharts).
- `GET /table` : Retourne un format pivot tabulaire des 10 derniers paramètres physico-chimiques majeurs.

### 2. Routeur Hydrologique & Barrages (`/hydro`)
Surveillance quantitative des rivières et des infrastructures.
- `GET /stations` : Interroge `public.stations_abhs` (puits, sources, forages, etc.), convertit les géométries PostGIS avec `ST_Transform(geom, 4326)` pour l'affichage cartographique.
- `GET /barrages` : Retourne la liste des barrages (`public.barrages_abhs`) avec capacité (Mm³) et année de mise en service.
- `GET /kpis` : Calcule le total des capacités des barrages, le nombre de stations réparties par sous-bassins.

### 3. Routeur Météo Climatologique (`/climate`)
- `GET /stations` : Filtre et retourne les stations à rôle pluviométrique ou climatique, avec leur distribution altimétrique.
- `GET /kpis` : Statistiques de base du réseau météo.

### 4. Couche Géospatiale & Cartographique (`/layers`)
Le routeur de couches expose le référentiel SIG complet prêt pour la brique cartographique Web.
- Convertit les couches (bassins, sous-bassins, réseau hydro, provinces) en format **GeoJSON feature collection**.
- Modèle `LAYER_MAP` centralisé pour s'adapter dynamiquement aux noms de colonnes migrés (`id` vs `id_station`).

---

## 🏃 Lancer le serveur en dev

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*(Le backend charge la configuration de `.env` pour l'accès `abh_sad`).*
