# 28A  Resultats audit topologique Tc

## 1. Objectif

Verifier en lecture seule si le reseau topologique runtime permet d'exploiter le referentiel `Tc_Stations.xlsx` pour estimer le temps d'arrivee de la pollution entre :

```text
Depart : Dar Al Arsa - code 2263/15
Cible  : Amont Barrage de Garde - code 3738/8
```

Reference WASP :

```text
distance = 343.5 km
temps observe = 82 h
vitesse moyenne = 4.19 km/h
```

## 2. Statut synthetique

```text
Decision audit : TOPOLOGY_TC_ALIGNED
Reserve runtime : /api/v1/propagation/source-to-garde cible encore legacy_station_id=52
```

Le graphe PostGIS permet un parcours Dar Al Arsa -> Amont Barrage de Garde coherent avec WASP.

En revanche, l'endpoint existant `/api/v1/propagation/source-to-garde` ne doit pas etre consomme tel quel pour `TRAVEL_TIME_V1`, car il vise actuellement la station legacy `52` (`brg de garde / sebou`), localisee au meme noeud que P29, et non la cible officielle `3738/8` (`amont barrage de garde`, legacy `94`).

## 3. Connexion runtime

| Tentative | Resultat |
|---|---|
| `host.docker.internal:5432 / abh_sad / sad_app` | Echec `pg_hba.conf` |
| `127.0.0.1:5432 / abh_sad / sad_app` | Echec authentification |
| `127.0.0.1:5432 / abh_sad / postgres` | OK |

Source auditee :

```text
base = abh_sad
host = 127.0.0.1
port = 5432
utilisateur = postgres
mode = lecture seule
```

## 4. Sources candidates stations

Principales sources identifiees :

| Source | Type | Lignes | Colonnes code | Colonnes nom | Geometrie |
|---|---|---:|---|---|---|
| `api.v_station_dimension` | VIEW | 390 | `legacy_station_id`, `legacy_code_station`, `code_station` | `station_nom`, `type_station`, `bassin_nom` | `geom` |
| `api.v_barrage_dimension` | VIEW | 11 | `legacy_ire_barrage`, `legacy_barrage_id` | `barrage_nom`, `nom_oued` | `geom` |
| `api.v_profils_stations` | VIEW | 1980 | `legacy_profil_id`, `ire_station` | `station_id`, `ire_station` | `geom` |

Le referentiel principal exploitable pour les trois points de controle est `api.v_station_dimension`.

## 5. Validation des trois stations metier

| Role | Code | Legacy ID | Nom runtime | Longitude | Latitude | Diagnostic |
|---|---|---:|---|---:|---:|---|
| Depart | `2263/15` | 17 | `dar el arsa` | -4.928503 | 34.195653 | OK |
| Controle intermediaire | `1355/8` | 341 | `P29 a allal tazi` | -6.326762 | 34.518629 | OK |
| Controle final | `3738/8` | 94 | `amont barrage de garde` | -6.412841 | 34.488223 | OK |

Doublons ou points proches importants :

| Code | Legacy ID | Nom | Observation |
|---|---:|---|---|
| `3323/8` | 52 | `brg de garde / sebou` | meme coordonnee que P29, utilise par `/source-to-garde` actuel |
| `3546/8` | 51 | `brg garde du sebou` | meme coordonnee que `3738/8`, cible barrage alternative |
| `1513/8` | 158 | `forage cda sidi allal tazi` | contient `Sidi Allal Tazi` mais n'est pas P29 |

Conclusion :

```text
P29 = 1355/8
Amont Barrage de Garde = 3738/8
RP26 != P29
legacy_station_id=52 != Amont Barrage de Garde officiel
```

## 6. Reseau topologique runtime

| Table | Existe | Lignes | SRID | Role |
|---|---:|---:|---:|---|
| `geo_work.reseau_hydro_edges_final_candidate_20260602` | oui | 746 | 26191 | graphe propagation MVP |
| `geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr` | oui | 752 | 26191 | noeuds pgRouting/NetworkX |
| `geo_work.reseau_hydro_edges_final` | oui | 728 | 26191 | runtime hydrologie final |
| `geo_work.reseau_hydro_edges_raw` | oui | 697 | 26191 | source brute/fallback |

Le service propagation utilise actuellement :

```text
NETWORK_TABLE = geo_work.reseau_hydro_edges_final_candidate_20260602
NODE_TABLE    = geo_work.reseau_hydro_edges_final_candidate_20260602_vertices_pgr
```

## 7. Snap des stations

| Station | Code | Noeud snap | Edge | Distance snap | Statut |
|---|---|---:|---:|---:|---|
| Dar Al Arsa | `2263/15` | 547 | 504 | 217.35 m | MEDIUM |
| P29 a allal tazi | `1355/8` | 464 | 62 | 170.89 m | MEDIUM |
| Amont Barrage de Garde | `3738/8` | 98 | 66 | 283.77 m | LOW |

Fichier detail :

```text
docs/50_moteur_prediction_declaration_pollution/28A_stations_snap.csv
```

## 8. Parcours Dar Al Arsa -> Amont Barrage de Garde

Calcul realise sur le graphe dirige `geo_work.reseau_hydro_edges_final_candidate_20260602`.

| Indicateur | Valeur |
|---|---:|
| Noeud depart | 547 |
| Noeud cible | 98 |
| Chemin trouve | oui |
| Fallback non oriente | non |
| Noeuds traverses | 67 |
| Troncons traverses | 66 |
| Distance topologique | 341.717 km |
| Distance WASP reference | 343.5 km |
| Ecart relatif | 0.52 % |
| Statut alignement | ALIGNED |

Artifacts :

```text
docs/50_moteur_prediction_declaration_pollution/28A_path_edges.csv
docs/50_moteur_prediction_declaration_pollution/28A_path_dar_al_arsa_garde.geojson
```

## 9. Position de P29 sur le parcours

| Indicateur | Valeur |
|---|---:|
| Noeud P29 | 464 |
| P29 sur le chemin principal Dar -> Garde | oui |
| Distance Dar Al Arsa -> P29 | 328.078 km |
| Temps estime a 4.19 km/h | 78.32 h |

Interpretation :

```text
P29 est bien sur le parcours principal.
Le temps vers P29 peut etre calcule en fallback moyenne 4.19 km/h,
avec confiance LOW, car le fichier Tc ne contient pas Dar Al Arsa -> P29 direct.
```

## 10. Controle des endpoints runtime

Tests executes contre :

```text
http://127.0.0.1:8010/api/v1/propagation
```

### Point Dar Al Arsa `2263/15`

| Endpoint | HTTP | Statut | Resultat |
|---|---:|---|---|
| `/snap-diagnostic` | 200 | success | snap OK |
| `/source-to-garde` | 200 | success | distance `328.08 km`, cible legacy `52`, non conforme a `3738/8` |
| `/source-to-stations?limit=400` | 200 | success | P29 `328.08 km`, Garde officielle `341.72 km` |

### Point source matrice actuel

Coordonnee testee :

```text
longitude = -4.908418523493339
latitude  = 34.16528818110318
```

| Endpoint | HTTP | Statut | Resultat |
|---|---:|---|---|
| `/snap-diagnostic` | 200 | success | snap `10.53 m`, confiance HIGH |
| `/source-to-garde` | 200 | success | distance `328.08 km`, cible legacy `52`, non conforme a `3738/8` |
| `/source-to-stations?limit=400` | 200 | success | P29 et Garde officielle atteignables |

Detail important retourne par `/source-to-stations` :

| Cible | Legacy ID | Distance source | Commentaire |
|---|---:|---:|---|
| `P29 a allal tazi` | 341 | 328.08 km | point de controle intermediaire |
| `amont barrage de garde` | 94 | 341.72 km | point de controle final officiel |
| `brg garde du sebou` | 51 | 341.72 km | barrage alternatif, meme coordonnee que `3738/8` |
| `brg de garde / sebou` | 52 | 328.08 km | cible actuelle de `/source-to-garde`, non officielle pour Tc |

## 11. Analyse de l'ancien `5.58 km`

L'ancien resultat `distance_to_garde_km = 5.58` reste classe :

```text
ANCIEN_RESULTAT_TECHNIQUE_NON_ALIGNE
```

Constat :

- il est incompatible avec la reference WASP `343.5 km` ;
- il est incompatible avec le parcours Dar Al Arsa -> Garde officielle `341.717 km` ;
- il ne doit pas etre utilise pour `TRAVEL_TIME_V1`.

Cause probable :

```text
Ancien point prototype ou ancienne cible technique locale,
non alignee avec le corridor Tc Dar Al Arsa -> Amont Barrage de Garde.
```

Le verrou actuel n'est plus ce `5.58 km`, mais le fait que `/source-to-garde` cible `legacy_station_id=52` au lieu de la station officielle `3738/8`.

## 12. Decision pour Travel Time V1

Decision :

```text
TOPOLOGY_TC_ALIGNED
```

Conditions d'utilisation :

### Vers Amont Barrage de Garde

```text
target_code = 3738/8
target_legacy_station_id = 94
reference_distance_km = 343.5
topology_distance_km = 341.717
reference_travel_time_h = 82
velocity_kmh = 4.19
method_used = TC_OBSERVED_DIRECT
confidence_level = MEDIUM
distance_alignment_status = ALIGNED
```

### Vers P29

```text
target_code = 1355/8
target_legacy_station_id = 341
topology_distance_km = 328.078
calculated_travel_time_h = 78.32
method_used = AVERAGE_VELOCITY_FALLBACK
confidence_level = LOW
```

## 13. Reserve obligatoire avant implementation

Ne pas brancher `TRAVEL_TIME_V1` sur `/api/v1/propagation/source-to-garde` tel quel.

Correction minimale recommandee avant implementation :

```text
Creer une resolution explicite de cible Garde officielle :
code_station = 3738/8
ou legacy_station_id = 94
```

Options acceptables :

1. Ajouter un parametre cible au service propagation, sans casser l'endpoint existant.
2. Creer une fonction interne `route_source_to_station_code("3738/8")`.
3. Implementer `TravelTimeService` avec resolution explicite des stations `2263/15`, `1355/8`, `3738/8`, sans consommer `/source-to-garde`.

Option a eviter :

```text
Utiliser legacy_station_id=52 comme Garde officielle pour les temps d'arrivee.
```

## 14. Conclusion

Le referentiel Tc Stations v1 est exploitable pour enrichir la Declaration Pollution avec vitesse et temps d'arrivee, sous reserve de ne pas reutiliser la cible runtime historique de `/source-to-garde`.

Le prochain developpement peut etre prepare, mais doit commencer par un contrat explicite :

```text
Dar Al Arsa 2263/15 -> P29 1355/8 -> Amont Barrage de Garde 3738/8
```

et non par :

```text
source -> legacy_station_id=52
```

