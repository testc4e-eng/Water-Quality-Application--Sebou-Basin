# 28  Audit alignement Dar Al Arsa - Amont Barrage de Garde

## 1. Objectif

Avant de developper le calcul des temps d'arrivee, il faut verifier que le moteur topologique est aligne avec le referentiel WASP Tc Stations v1.

Le controle porte strictement sur :

```text
Depart : Dar Al Arsa - code 2263/15
Cible  : Amont Barrage de Garde - code 3738/8
```

La distance WASP de reference est :

```text
343.5 km
```

Le temps observe de reference est :

```text
82 h
```

## 2. Ce qu'il ne faut plus utiliser

L'ancien resultat :

```text
distance_to_garde_km = 5.58
```

est classe :

```text
ANCIEN_RESULTAT_TECHNIQUE_NON_ALIGNE
```

Il ne doit pas etre utilise dans l'audit.

## 3. Donnees a rechercher dans la base

Rechercher les objets suivants :

| Objet | Code | Nom attendu |
|---|---|---|
| Station depart | 2263/15 | dar el arsa |
| Station P29 | 1355/8 | P29 a allal tazi |
| Station Garde | 3738/8 | amont barrage de garde |

Pour chaque objet :

- table source ;
- identifiant ;
- nom brut ;
- nom normalise ;
- code station ;
- longitude ;
- latitude ;
- geometrie ;
- distance au troncon topologique le plus proche ;
- identifiant du troncon le plus proche.

## 4. Controle topologique attendu

Le moteur doit produire un chemin entre :

```text
troncon contenant Dar Al Arsa
et
troncon contenant Amont Barrage de Garde
```

Le resultat attendu doit inclure :

- `path_geojson` non vide ;
- somme des longueurs ;
- SRID et unite de calcul ;
- noeud source ;
- noeud cible ;
- edges traverses ;
- stations intermediaires detectees ;
- presence de P29 sur le parcours ou diagnostic d'absence.

## 5. Statut d'alignement

Comparer :

```text
distance_topologique_km
vs
distance_wasp_reference_km = 343.5
```

Regles :

| Ecart relatif | Statut |
|---:|---|
| <= 10 % | ALIGNED |
| > 10 % et <= 25 % | PARTIALLY_ALIGNED |
| > 25 % | NOT_ALIGNED |

Bornes indicatives :

| Statut | Intervalle km |
|---|---:|
| ALIGNED | 309 a 378 |
| PARTIALLY_ALIGNED | 258 a 429 |
| NOT_ALIGNED | hors intervalle |

## 6. Resultat attendu pour Travel Time V1

### Si alignement confirme

Pour Garde :

```text
target_code = 3738/8
reference_distance_km = 343.5
reference_travel_time_h = 82
velocity_kmh = 4.19
method_used = TC_OBSERVED_DIRECT
confidence_level = MEDIUM
distance_alignment_status = ALIGNED ou PARTIALLY_ALIGNED
```

Pour P29 :

```text
target_code = 1355/8
topology_distance_km = distance Dar Al Arsa -> P29
calculated_travel_time_h = topology_distance_km / 4.19
method_used = AVERAGE_VELOCITY_FALLBACK
confidence_level = LOW
```

### Si alignement non confirme

```text
travel_time_status = UNAVAILABLE
method_used = UNAVAILABLE
confidence_level = UNAVAILABLE
```

La matrice NH4 et le statut de dilution peuvent continuer a fonctionner.

## 7. Tests minimaux a prevoir

1. Dar Al Arsa `2263/15` existe dans le referentiel station.
2. Amont Barrage de Garde `3738/8` existe dans le referentiel station.
3. P29 `1355/8` existe dans le referentiel station.
4. Les trois stations ont des coordonnees exploitables.
5. Dar Al Arsa et Garde se snappent au reseau.
6. Un parcours Dar Al Arsa -> Garde est trouve.
7. La distance topologique est comparee a `343.5 km`.
8. P29 est detectee ou signalee absente explicitement.
9. Aucun resultat `5.58 km` n'est utilise pour le temps de transfert.

## 8. Prochaine etape recommandee

Avant toute implementation du service `travel_time_service.py` :

```text
Executer cet audit en lecture seule sur la base runtime.
Documenter la distance topologique obtenue.
Valider ou non l'alignement avec 343.5 km.
```

Ensuite seulement :

```text
Implementer TravelTimeResult dans evaluate.
Afficher le temps d'arrivee dans le cockpit.
Ajouter le detail dans le rapport.
```

## 9. Resultat d'execution 2026-07-15

L'audit read-only a ete execute et documente dans :

```text
docs/50_moteur_prediction_declaration_pollution/28A_resultats_audit_topologique_tc.md
```

Artifacts produits :

```text
docs/50_moteur_prediction_declaration_pollution/28A_stations_snap.csv
docs/50_moteur_prediction_declaration_pollution/28A_path_edges.csv
docs/50_moteur_prediction_declaration_pollution/28A_path_dar_al_arsa_garde.geojson
```

Decision :

```text
TOPOLOGY_TC_ALIGNED
```

Resultat principal :

```text
Dar Al Arsa 2263/15 -> Amont Barrage de Garde 3738/8
distance topologique = 341.717 km
distance WASP = 343.5 km
ecart = 0.52 %
```

Reserve runtime :

```text
/api/v1/propagation/source-to-garde cible encore legacy_station_id=52.
Pour TRAVEL_TIME_V1, la cible officielle doit etre 3738/8 / legacy_station_id=94.
```
