# 29  Travel Time V1 Implementation

## 1. Statut

Statut de pilotage :

```text
TRAVEL_TIME_V1_READY_AVEC_RESERVES
```

Le lot ajoute l'estimation des temps d'arrivee aux points de controle du workflow Declaration Pollution, sans modifier la base et sans recalcul frontend.

## 2. Source canonique

Fichier source canonique :

```text
C:\dev\WQDSS\data\Tc_Stations.xlsx
```

Checksum SHA-256 du fichier Excel :

```text
3578f957bdadbb998f6d222afc1baa03491cf84fbbf360a0ce9576a5b0c6a608
```

La copie utilisee initialement depuis `Downloads` a ete comparee avant stabilisation. Les checksums sont identiques.

## 3. Ressource backend

Ressources generees :

```text
backend/app/resources/travel_time/tc_stations_v1.csv
backend/app/resources/travel_time/tc_stations_v1.metadata.json
backend/app/resources/travel_time/tc_stations_v1.sha256
backend/app/resources/travel_time/tc_stations_v1.validation_report.json
```

Reference :

```text
reference_id      = TC_STATIONS_V1
reference_version = 1.0.0
csv_sha256        = a7d494dffa5b1e7b67aab0cdfa0a8db5821d243e01b69ec949f26b67d04dfa3b
```

Le CSV normalise les colonnes fusionnees du fichier Excel vers :

```text
Troncon
Distance (km)
Tc observe
Unite
Vitesse (Km/h)
Tc Calcule
Observation
```

## 4. Cibles officielles

| Role | Code station | Legacy ID | Libelle |
|---|---:|---:|---|
| Origine reference | 2263/15 | 17 | Dar Al Arsa |
| Controle intermediaire | 1355/8 | 341 | P29 a Allal Tazi |
| Controle final | 3738/8 | 94 | Amont Barrage de Garde |

La cible legacy `52 / 3323/8` n'est pas utilisee par `TravelTimeService`.

## 5. Regles de calcul

### P29

```text
target_code      = 1355/8
distance_runtime = distance topologique source -> P29
method_used      = AVERAGE_VELOCITY_FALLBACK
velocity_kmh     = 4.189
confidence_level = LOW
```

Le temps P29 est estimatif, car le referentiel Tc ne fournit pas de Tc direct Dar Al Arsa -> P29.

### Amont Barrage de Garde

```text
target_code                = 3738/8
reference_distance_km      = 343.5
reference_travel_time_h    = 82
method_used                = TC_OBSERVED_DIRECT
confidence_level           = MEDIUM
distance_alignment_status  = ALIGNED
```

Le Tc observe de 82 h reste la reference principale. La distance topologique runtime sert a verifier l'alignement.

## 6. Heure de reference

Priorite appliquee :

1. `detected_at` fourni par l'utilisateur ;
2. `detected_at` enregistre dans la declaration ;
3. `analysis_started_at`.

Les dates sont stockees en UTC et restituees aussi en `Africa/Casablanca`.

## 7. Integration runtime

Ordre d'execution :

```text
topology
-> travel_time
-> matrix
-> risk
-> recommendations
-> snapshot
-> report
```

Une indisponibilite du temps de transfert ne bloque pas Matrix V1 :

```text
topologie valide + matrice valide + travel time indisponible
= analyse reussie avec warning
```

## 8. Frontend

Ajouts :

- champ `Date et heure de detection` dans le cockpit Declaration ;
- panneau `Temps d'arrivee estime` dans les resultats ;
- affichage limite a P29 et Amont Barrage de Garde ;
- aucune valeur de temps recalculee cote frontend.

Le cockpit affiche une note courte. Les limites scientifiques completes restent dans le snapshot et le rapport.

## 9. Tests executes

Backend :

```powershell
python -m pytest tests/test_travel_time_service.py tests/test_pollution_declarations_api.py -q
```

Resultat :

```text
14 passed
```

Frontend :

```powershell
npm run test -- src/components/Pollution/declarationDraft.mapper.test.ts src/components/Pollution/declarationDraft.validation.test.ts src/components/Pollution/declarationExecution.service.test.ts
```

Resultat :

```text
16 passed
```

Build :

```powershell
npm run build
```

Resultat :

```text
OK
```

Reserve build connue : warning Vite sur taille de chunk, non bloquant pour le MVP.

## 10. Reserves scientifiques

- Le point source exact en amont de Dar Al Arsa reste a quantifier.
- P29 utilise une vitesse moyenne fallback.
- Les Tc sont des proxies issus d'evenements de crue, pas une modelisation hydraulique complete.
- La cible historique `/source-to-garde` reste legacy tant qu'elle n'est pas refondue.

## 11. Prochaine validation

Passage vise :

```text
TRAVEL_TIME_V1_UI_READY_AVEC_RESERVES
```

Conditions restantes :

- recette Playwright cockpit ;
- verification rapport contenant `travel_time_result` ;
- capture navigateur finale ;
- validation metier des libelles et de la reserve scientifique.
