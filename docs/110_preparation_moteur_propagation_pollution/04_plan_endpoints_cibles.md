# Plan endpoints cibles

## Contexte

Le MVP backend actuel couvre :

- `GET /api/v1/propagation/source-to-garde`
- `GET /api/v1/propagation/snap-diagnostic`

Les prochains endpoints doivent rester :

- lecture seule
- topologiques
- sans SWAT
- sans WASP
- avec diagnostic de snap obligatoire

## source-to-stations

Statut :

- `IMPLEMENTED_MVP`

### Endpoint cible

- `GET /api/v1/propagation/source-to-stations`

### Source SQL cible

- sources : `api.v_pollution_sites` ou `api.v_source_pollution_prelevement`
- cibles : `api.v_station_dimension`
- réseau : `geo_work.reseau_hydro_edges_final_candidate_20260602`
- vertices : `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`

### Logique de snapping cible

- snapper la source d'entrée sur le réseau
- snapper chaque station candidate sur le vertex ou edge le plus proche
- filtrer ou annoter les stations trop éloignées du réseau
- calculer uniquement les stations atteignables en aval depuis le noeud de départ

### Format JSON attendu

```json
{
  "status": "success",
  "source": {},
  "snap": {},
  "targets": [
    {
      "station_id": "...",
      "legacy_station_id": 123,
      "station_name": "...",
      "distance_to_source_km": 12.34,
      "transfer_time_hours": 1.23,
      "target_snap_distance_m": 45.6,
      "reachable": true
    }
  ],
  "metadata": {}
}
```

### Risques

- stations éloignées du réseau validé
- ambiguïté entre station métier et noeud PGR
- cardinalité potentiellement élevée si aucune limite n'est posée
- certaines stations peuvent snapper sur le même noeud que la source et retourner une distance aval `0.0 km`

## source-to-barrages

Statut :

- `IMPLEMENTED_MVP`

### Endpoint cible

- `GET /api/v1/propagation/source-to-barrages`

### Source SQL cible

- sources : `api.v_pollution_sites` ou `api.v_source_pollution_prelevement`
- cibles : `api.v_barrage_dimension`
- réseau : `geo_work.reseau_hydro_edges_final_candidate_20260602`
- vertices : `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`

### Logique de snapping cible

- snapper la source sur le réseau
- snapper chaque barrage au vertex le plus proche
- calculer les barrages atteignables en aval
- exposer la distance source -> barrage et un temps indicatif à vitesse constante

### Format JSON attendu

```json
{
  "status": "success",
  "source": {},
  "snap": {},
  "targets": [
    {
      "barrage_id": "...",
      "legacy_barrage_id": 123,
      "barrage_name": "...",
      "distance_to_source_km": 45.67,
      "transfer_time_hours": 4.57,
      "target_snap_distance_m": 120.0,
      "reachable": true
    }
  ],
  "metadata": {}
}
```

### Risques

- faible nombre de barrages mais sensibilité métier forte
- distinction nécessaire entre barrage géographique et point de mesure associé
- risque de faux positifs si le snap barrage est trop lointain
- ne pas confondre barrage géographique et garde fonctionnelle station `52`

## source-to-exutoires

Statut :

- `IMPLEMENTED_MVP`

### Endpoint cible

- `GET /api/v1/propagation/source-to-exutoires`

### Source SQL cible

- sources : `api.v_pollution_sites` ou `api.v_source_pollution_prelevement`
- cibles : `geo_work.reseau_hydro_nodes_final_candidate_20260602`
- réseau : `geo_work.reseau_hydro_edges_final_candidate_20260602`
- vertices : `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr`

### Logique de snapping cible

- snapper la source sur le réseau
- identifier les exutoires dans la composante aval atteignable
- pour chaque exutoire, calculer chemin, distance cumulée et temps indicatif
- prioriser l'exutoire terminal principal de la composante

### Format JSON attendu

```json
{
  "status": "success",
  "source": {},
  "snap": {},
  "targets": [
    {
      "node_id": 123,
      "node_type": "exutoire",
      "distance_to_source_km": 210.5,
      "transfer_time_hours": 21.05,
      "reachable": true
    }
  ],
  "metadata": {}
}
```

### Risques

- définition métier de l'exutoire à stabiliser si plusieurs terminaux existent
- besoin de distinguer exutoire composante vs exutoire bassin
- risque d'interprétation excessive si l'utilisateur attend un comportement hydraulique réel
