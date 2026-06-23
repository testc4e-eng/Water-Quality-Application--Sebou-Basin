# 1. Inventaire des supports

L'audit révèle la présence des objets géographiques ou fonctionnels suivants en base, éligibles comme "Supports" pour la Carte Métier.

## Supports prêts pour la V1 (avec géométrie validée)
- **STATION_QUALITE** : via `api.v_station_dimension`.
- **STATION_HYDRO** : via `api.v_station_dimension` (filtre `type_station = 'hydrologique'`).
- **STATION_METEO** / **PLUVIO** : via `api.v_station_dimension` (filtre `pluviometrique`).
- **BARRAGE** : via `api.v_barrage_dimension` (géométrie polygonale ou ponctuelle selon vue).
- **FORAGE** / **PUITS** / **SOURCE** : via `api.v_station_dimension`.
- **POINT_PRELEVEMENT_ABH** : via `api.v_source_pollution_prelevement`.
- **SOURCE_POLLUTION** (IDP) : via `api.v_pollution_sites` (bénéficiant du workflow de validation des coordonnées).
- **STEP** : via `infra.step`.
- **REJET** : via `infra.rejet_industriel` et `infra.rejet_domestique`.
- **BASSIN / SOUS_BASSIN** : via les vues matérialisées `api.mv_bassin_geojson` et `api.mv_sous_bassin_geojson`.

## Supports nécessitant une préparation (V2)
- **STATION_SENTINELLE** : Actuellement un concept dérivé des dashboards existants, nécessite un mapping clair en base.
- **BARRAGE_GARDE** : Nécessite une jointure avec `qualite.suivi_qualite_barrage_garde_hebdo`.
- **NAPPE** : Polygones complexes, potentiellement lourds à restituer sans tuilage.
- **HUILERIE / DECHARGE / MINE / FOSSE_SEPTIQUE** : Existent dans le schéma `infra.*` mais demandent une validation géospatiale (souvent incomplète).
- **RESEAU_HYDRO** : Très lourd, nécessite l'utilisation exclusive du runtime optimisé (`geo_work.reseau_hydro_edges_final`).
