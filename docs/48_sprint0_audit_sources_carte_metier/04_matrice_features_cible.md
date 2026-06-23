# 4. Matrice Features Cible

Liste des supports géographiques permettant d'alimenter l'endpoint `GET /api/v1/business-map/features`.

| Support | Identifiant | Nom objet | Géométrie dispo | Source géométrie | Attributs minimum popup | Endpoint source actuel | Statut V1/V2 |
|---|---|---|---|---|---|---|---|
| STATION_QUALITE | `station_id` | `station_nom` | Oui | `api.v_station_dimension` (`geom`) | `code_station`, `type_station`, `bassin_nom` | `/api/v1/map/entities` | V1 |
| STATION_HYDRO | `station_id` | `station_nom` | Oui | `api.v_station_dimension` (`geom`) | `code_station`, `type_station` | `/api/v1/map/entities` | V1 |
| BARRAGE | `barrage_id` | `barrage_nom` | Oui | `api.v_barrage_dimension` (`geom`) | `nom_oued`, `type_barrage`, `statut` | `/api/v1/map/entities` | V1 |
| STATION_METEO | `station_id` | `station_nom` | Oui | `api.v_station_dimension` (`geom`) | `code_station`, `type_station` | `/api/v1/map/entities` | V1 |
| SOURCE_POLLUTION | `site_id` | `site_name` | Oui | `api.v_pollution_sites` (`geometry` GeoJSON) | `commune`, `bassin`, `source_type_label` | `/api/v1/map/entities` | V1 |
| RESEAU_HYDRO | `id` | N/A | Oui | `geo.reseau_hydrographique` | Ordre de Strahler | N/A | V2 (Lourd) |
