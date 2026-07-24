# 18  Audit contrats topologie

## 1. Objectif

Documenter l'ecart entre :

- le contrat topologique attendu par `backend/app/services/declaration_pollution_service.py` ;
- le contrat reel retourne par les endpoints du moteur de propagation ;
- les adaptations necessaires pour fiabiliser l'orchestrateur `Declaration Pollution` sans modifier le moteur topologique.

Ce document precede toute correction de code.

## 2. Perimetre audite

Composants analyses :

- `backend/app/services/declaration_pollution_service.py`
- `backend/app/api/v1/propagation.py`
- `GET /api/v1/propagation/snap-diagnostic`
- `GET /api/v1/propagation/source-to-garde`
- `GET /api/v1/propagation/source-to-stations`
- `docs/50_moteur_prediction_declaration_pollution/17_preset_demo_dar_el_arssa.md`

Hors perimetre :

- refonte du moteur topologique ;
- refonte des referentiels stations ;
- correction matrice ;
- correction frontend avancee.

## 3. Contexte de test

Preset prototype teste :

- `lng = -6.30540031`
- `lat = 34.515619453`

Constats valides en lecture / execution reelle :

- `snap-diagnostic` retourne un snap `HIGH` a `0.0 m` ;
- `source-to-garde` retourne un `path_geojson` non vide et `distance_to_garde_km = 5.58` ;
- `source-to-stations` retourne notamment `P29 a allal tazi` ;
- `evaluate` echoue encore cote declaration avec `TOPOLOGY_GARDE_NOT_REACHED`, puis potentiellement `TOPOLOGY_SAT_NOT_FOUND`.

## 4. Contrat attendu par l'orchestrateur declaration

Dans `declaration_pollution_service.py`, la logique actuelle attend implicitement :

### 4.1 Snap

Entrees attendues sur `garde["snap"]` :

- `distance_to_network_m`
- `snap_confidence`
- optionnellement `snap_lon`
- optionnellement `snap_lat`

Usage actuel :

- blocage si `distance_to_network_m > 2000`
- warning si `distance_to_network_m > 1000`
- restitution `snapped_point`, `snap_distance_m`, `confidence_level`

### 4.2 Parcours vers Garde

Entrees attendues implicitement sur `garde` :

- `path_geojson.features` non vide
- `propagation.reached == true`
- `propagation.distance_to_garde_km`

Usage actuel :

- si `path_geojson.features` vide : `TOPOLOGY_PATH_NOT_FOUND`
- si `bool(propagation.get("reached"))` faux : `TOPOLOGY_GARDE_NOT_REACHED`
- `longueur_km = propagation.distance_to_garde_km`

### 4.3 Stations

Entrees attendues sur `stations` :

- `targets` liste de stations joignables
- `station_name` exploitable textuellement

Usage actuel :

- SAT detectee si `"sidi allal tazi" in normalize(station_name)`
- sinon `TOPOLOGY_SAT_NOT_FOUND`

## 5. Contrat reel retourne par les endpoints propagation

## 5.1 GET /api/v1/propagation/snap-diagnostic

Structure reelle observee :

```json
{
  "status": "success",
  "source": {
    "source_type": "coordinates",
    "source_id": "-6.30540031,34.515619453",
    "input_mode": "coordinates"
  },
  "snap": {
    "edge_id": 61,
    "start_node": 463,
    "distance_to_network_m": 0.0,
    "snap_confidence": "HIGH",
    "network_component": 5
  },
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "scientific_mode": false,
    "warning": "Temps de parcours et concentrations indicatifs — modele topologique simplifie"
  }
}
```

Conclusion :

- contrat compatible avec l'orchestrateur sur `distance_to_network_m` et `snap_confidence` ;
- `snap_lon` / `snap_lat` non observes dans le payload de reference.

## 5.2 GET /api/v1/propagation/source-to-garde

Structure reelle observee :

```json
{
  "status": "success",
  "source": {
    "source_type": "coordinates",
    "source_id": "-6.30540031,34.515619453",
    "input_mode": "coordinates"
  },
  "snap": {
    "edge_id": 61,
    "start_node": 463,
    "distance_to_network_m": 0.0,
    "snap_confidence": "HIGH",
    "network_component": 5
  },
  "propagation": {
    "target_type": "garde",
    "reachable_nodes": 19,
    "reachable_edges": 18,
    "distance_to_garde_km": 5.58,
    "transfer_time_hours": 0.56,
    "transfer_time_label": "+0h34m",
    "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP"
  },
  "path_geojson": {
    "type": "FeatureCollection",
    "features": [ ... ]
  },
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "scientific_mode": false,
    "warning": "Temps de parcours et concentrations indicatifs — modele topologique simplifie"
  }
}
```

Conclusion :

- `path_geojson` est bien present ;
- `distance_to_garde_km` est bien presente ;
- `reached` n'est pas present dans le payload reel observe ;
- le moteur topologique exprime donc l'atteinte de Garde par les indices de parcours, pas par un booleen explicite.

## 5.3 GET /api/v1/propagation/source-to-stations

Structure reelle observee :

```json
{
  "status": "success",
  "source": { ... },
  "snap": { ... },
  "propagation": {
    "target_type": "stations",
    "reachable_nodes": 19,
    "reachable_edges": 18,
    "targets_total_considered": 390,
    "targets_returned": 11
  },
  "targets": [
    {
      "station_name": "brg de garde / sebou",
      "reachable": true,
      "distance_to_source_km": 5.58
    },
    {
      "station_name": "P29 a allal tazi",
      "reachable": true,
      "distance_to_source_km": 5.58
    }
  ],
  "metadata": { ... }
}
```

Conclusion :

- les stations sont renvoyees dans `targets` et non dans `stations` ;
- les variantes de nommage ne suivent pas forcement le libelle canonique `Sidi Allal Tazi` ;
- `P29 a allal tazi` est une station control point utile pour le MVP mais rejetee par la logique actuelle.

## 6. Divergences champ par champ

| Domaine | Attendu par declaration | Retour reel propagation | Ecart | Impact |
|---|---|---|---|---|
| Garde atteint | `propagation.reached == true` | `distance_to_garde_km`, `path_geojson.features`, `status=success` | champ `reached` absent | faux negatif `TOPOLOGY_GARDE_NOT_REACHED` |
| Parcours valide | `path_geojson.features` non vide | compatible | aucun | OK |
| Longueur parcours | `propagation.distance_to_garde_km` | compatible | aucun | OK |
| Snap distance | `snap.distance_to_network_m` | compatible | aucun | OK |
| Station SAT | libelle contenant `sidi allal tazi` | variante `P29 a allal tazi` | detection trop litterale | faux negatif `TOPOLOGY_SAT_NOT_FOUND` |
| Station collection | `targets` deja consommee | compatible | aucun | OK |
| Point snappe | `snap_lon`, `snap_lat` si presents | non observes | fallback sur point entre | acceptable mais non ideal | faible |

## 7. Cause racine du blocage MVP

Le blocage principal n'est pas dans :

- le frontend ;
- le preset ;
- le moteur topologique ;
- le GeoJSON ;
- le snap.

Le blocage est dans l'adaptation de contrat entre :

- `propagation_pollution_service` ;
- `declaration_pollution_service`.

Le service declaration consomme un contrat topologique plus strict et plus specifique que celui fourni en pratique par le moteur propagation.

## 8. Adaptations minimales necessaires

## 8.1 Regle MVP pour `garde_reached`

Pour le MVP, `Garde atteint` doit etre considere `true` si au moins une des conditions suivantes est satisfaite :

- `propagation.reached == true`
- `propagation.distance_to_garde_km` existe et `> 0`
- `path_geojson.features` contient au moins une feature
- un champ cible explicite `garde` existe dans une future variante de payload

Regle recommandeee :

```text
garde_reached =
  reached == true
  OR distance_to_garde_km > 0
  OR path_geojson.features non vide
  OR cible nominale contient garde
```

Important :

- ne pas se contenter de `status == success` seul ;
- conserver `path_geojson` non vide comme preuve forte de parcours ;
- garder la logique bloquante si aucun indice de parcours n'est disponible.

## 8.2 Regle MVP pour `sat_detected`

Le MVP ne doit pas faire une comparaison litterale unique.

Normalisation minimale recommandee :

- minuscules ;
- suppression accents ;
- trim ;
- reduction espaces multiples ;
- tolerance sur sous-chaines `allal tazi`.

Alias minimums recommandes :

- `sidi allal tazi`
- `allal tazi`
- `p29 a allal tazi`
- variantes futures a completer dans un referentiel

## 9. Proposition d'architecture : TopologyAdapter

## 9.1 Principe

Le service declaration ne doit plus interpreter directement les payloads bruts des endpoints propagation.

Proposition :

- creer `backend/app/services/topology_adapter.py`
- y centraliser la lecture des payloads : `snap-diagnostic`, `source-to-garde`, `source-to-stations`
- retourner un contrat unique `TopologyResult`

## 9.2 Contrat cible unifie

```python
TopologyResult = {
    "snapped_point": {...},
    "snap_distance_m": float,
    "snap_confidence": str,
    "parcours_geojson": {...},
    "longueur_km": float | None,
    "garde_reached": bool,
    "sat_detected": bool,
    "stations_detectees": list,
    "diagnostic_messages": list[str],
    "warnings": list[str],
    "raw_garde_payload": dict,
    "raw_stations_payload": dict,
}
```

## 9.3 Responsabilites du TopologyAdapter

- appeler les fonctions du moteur topologique existant ;
- interpreter les variantes de payload ;
- deduire `garde_reached` a partir de preuves de parcours ;
- deduire `sat_detected` a partir d'alias normalises ;
- preparer un contrat stable pour `DeclarationPollutionService`.

## 9.4 Benefices

- l'orchestrateur declaration devient plus simple ;
- les futurs moteurs topologiques ou variantes d'endpoints restent encapsules ;
- les tests de compatibilite deviennent unites et non disperses ;
- le frontend consomme un `topology_result` stable.

## 10. Recommandation de mise en oeuvre

Ordre recommande :

1. corriger l'orchestrateur actuel minimalement pour debloquer le MVP ;
2. ajouter les tests couvrant le contrat reel observe ;
3. extraire ensuite un `TopologyAdapter` dedie ;
4. documenter le contrat unifie comme reference inter-modules.

## 11. Tests a ajouter ou ajuster

Cas minimaux a couvrir :

- `source-to-garde` sans `reached`, mais avec `distance_to_garde_km > 0` et `path_geojson.features > 0` : attendu `garde_reached = true`
- `source-to-garde` sans `reached`, sans distance, sans features : attendu `TOPOLOGY_PATH_NOT_FOUND` ou `TOPOLOGY_GARDE_NOT_REACHED` selon cas
- `source-to-stations` avec station `P29 a allal tazi` : attendu `sat_detected = true`
- `evaluate` avec preset Dar El Arssa : ne doit plus echouer sur `TOPOLOGY_GARDE_NOT_REACHED`
- `evaluate` doit retourner un `topology_result` exploitable avec `parcours_geojson`, `longueur_km`, `stations_detectees`

## 12. Risques si rien n'est corrige

- faux negatifs topologiques repetes ;
- invalidation injustifiee des presets demo ;
- confusion entre bug moteur et bug orchestrateur ;
- dette croissante lors de l'ajout d'autres points de rejet ;
- frontends et tests contourneront localement des incoherences backend.

## 13. Decision recommandee

Decision immediate : `GO` pour correction de l'orchestrateur.

Motif :

- le moteur topologique fournit deja des preuves suffisantes de parcours pour le MVP ;
- le blocage est un probleme de contrat consommateur, pas de calcul topologique ;
- la correction est circonscrite et testable.

## 14. Prochaine action

Prochaine action recommandee :

- corriger `backend/app/services/declaration_pollution_service.py` ;
- ajouter les tests backend de compatibilite ;
- revalider le preset Dar El Arssa ;
- seulement ensuite brancher `DeclarationMapPanel` sur `topology_result.parcours_geojson`.
