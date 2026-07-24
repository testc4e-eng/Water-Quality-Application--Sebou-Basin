# 27  Referentiel Tc Stations v1

## 1. Objectif

Ce document formalise l'exploitation du fichier :

```text
C:/Users/Yassine - C4E Africa/Downloads/Tc_Stations.xlsx
```

pour enrichir le workflow Declaration Pollution avec une estimation de :

- vitesse de transfert ;
- temps de transfert ;
- heure estimee d'arrivee de la pollution ;
- niveau de confiance ;
- limites scientifiques.

Le referentiel ne remplace pas un modele hydraulique complet. Il fournit une estimation temporelle MVP basee sur des temps de concentration observes ou calcules entre stations.

## 2. Donnees lues dans l'Excel

Le classeur contient une seule feuille `Sheet1`.

Colonnes principales :

| Colonne | Signification |
|---|---|
| Troncon | Couple source -> cible |
| Distance (km) | Distance WASP entre stations |
| Tc observe | Temps de transfert observe |
| Unite | h ou j |
| Vitesse (Km/h) | Vitesse moyenne derivee |
| Tc Calcule | Temps estime quand le Tc observe direct est insuffisant |
| Observation | Methode ou limite |

## 3. Troncons Tc disponibles

| Troncon | Distance km | Tc observe | Unite | Vitesse km/h | Tc calcule h | Statut |
|---|---:|---:|---|---:|---:|---|
| Dar Al Arsa -> RP26 | 60.393 | 14 | h | 4.314 | - | observe |
| RP26 -> Azib Soltane | 53.857 | 10 | h | 5.386 | - | observe |
| Azib Soltane -> Belksiri | 136.868 | 38 | h | 3.602 | - | observe |
| Belksiri -> Barrage de Garde | 92.380 | 20 | h | 4.619 | - | observe |
| Dar Al Arsa -> Barrage de Garde | 343.500 | 82 | h | 4.189 | - | observe direct global |
| Al Wahda -> Belksiri | 171.889 | 2-3 | j | - | 47.723 | partiel |
| Jorf El Malha -> Belksiri | 109.981 | 30 | h | 3.666 | - | observe |
| Tissa -> RP26 | 112.745 | 20 | h | 5.637 | - | observe |
| Idriss Ier -> RP26 | 88.490 | 1-2 | j | - | 15.697 | partiel |

## 4. Correspondance stations

| Reference Tc | Nom plateforme | Code |
|---|---|---|
| Dar Al Arsa | dar el arsa | 2263/15 |
| RP26 | pont rp 26 | 1541/15 |
| Azib Soltane | azib soltane | 1540/15 |
| Belksiri | aval bel ksiri | 3695/8 |
| P29 | P29 a allal tazi | 1355/8 |
| Barrage de Garde | amont barrage de garde | 3738/8 |
| Al Wahda | barrage el wahda | 1709/9 |
| Jorf El Malha | jorf el melha | 1826/9 |
| Tissa | tissa | 2551/15 |
| Idriss Ier | barrage idriss 1er | 3264/15 |

Decision importante :

```text
RP26 != P29 Sidi Allal Tazi
```

La ligne `Dar Al Arsa -> RP26 = 14 h` ne doit jamais etre utilisee comme temps d'arrivee a P29.

## 5. Definition de SEGMENT_POLLUTION_BASE

Definition retenue :

```text
SEGMENT_POLLUTION_BASE

Segment longitudinal de reference utilise par le modele WASP pour simuler
le transfert de la pollution NH4 depuis le point source situe en amont
de Dar Al Arsa jusqu'au point de controle amont du Barrage de Garde.
```

Il faut distinguer :

| Objet | Role |
|---|---|
| Point source | Lieu precis de depart de la pollution |
| SEGMENT_POLLUTION_BASE | Parcours global de simulation WASP |
| Reseau topologique PostGIS | Reseau SIG utilise pour reconstruire le parcours aval |

La matrice NH4 est rattachee au corridor global. Le moteur topologique a encore besoin de la coordonnee ou du troncon SIG exact correspondant au point source.

## 6. Point source et origine de reference

Le point source metier est situe :

```text
en amont de la station Dar Al Arsa
```

Tant que la distance entre le point source et Dar Al Arsa n'est pas connue, le calcul temporel V1 doit utiliser :

```text
reference_origin = station Dar Al Arsa
reference_start_station_code = 2263/15
source_point_offset_status = NOT_QUANTIFIED
```

Libelle recommande :

```text
Point source des simulations NH4 - secteur amont de la station Dar Al Arsa
Localisation cartographique technique a confirmer
```

## 7. Distance de reference vers Garde

La valeur :

```text
343.5 km
```

correspond a la distance WASP :

```text
Dar Al Arsa 2263/15 -> Amont Barrage de Garde 3738/8
```

Elle ne commence pas exactement au point source si celui-ci est en amont de Dar Al Arsa.

L'ancien resultat technique :

```text
distance_to_garde_km = 5.58
```

est classe :

```text
ANCIEN_RESULTAT_TECHNIQUE_NON_ALIGNE
```

Il ne doit plus etre utilise pour :

- le temps de transfert ;
- la vitesse ;
- la validation du parcours ;
- la presentation client.

## 8. Regle temporelle MVP vers Garde

Si l'audit topologique confirme que le parcours est aligne entre :

```text
Dar Al Arsa 2263/15
et
Amont Barrage de Garde 3738/8
```

alors :

```text
target = Amont Barrage de Garde
target_code = 3738/8
reference_distance_km = 343.5
reference_travel_time_h = 82
velocity_kmh = 4.19
method_used = TC_OBSERVED_DIRECT
confidence_level = MEDIUM
```

Si l'alignement n'est pas confirme :

```text
travel_time_status = UNAVAILABLE
method_used = UNAVAILABLE
confidence_level = UNAVAILABLE
```

## 9. Regle temporelle MVP vers P29

P29 est :

```text
P29 a allal tazi
code = 1355/8
```

Le fichier Tc ne contient pas de ligne directe :

```text
Dar Al Arsa -> P29
```

Regle MVP recommandee :

```text
travel_time_h = distance_topologique_Dar_Al_Arsa_to_P29 / 4.19
method_used = AVERAGE_VELOCITY_FALLBACK
confidence_level = LOW
```

Conditions :

- P29 doit etre localisee avec le code `1355/8` ;
- P29 doit etre sur le parcours principal ;
- la distance topologique Dar Al Arsa -> P29 doit etre disponible ;
- l'interface doit presenter le resultat comme estimation.

Option prudente si la distance n'est pas fiable :

```text
Temps de transfert vers P29 non disponible dans le referentiel Tc actuel.
```

## 10. Heure de reference

Champs a prevoir :

```text
detected_at
analysis_started_at
travel_time_reference_at
travel_time_reference_source
```

Valeurs possibles :

```text
DETECTION_TIME
USER_PROVIDED_TIME
ANALYSIS_START_TIME
```

Ordre de priorite :

1. heure de detection saisie par l'utilisateur ;
2. heure de detection enregistree dans la declaration ;
3. heure de lancement de l'analyse.

Stockage :

```text
UTC
```

Affichage :

```text
Africa/Casablanca
```

## 11. Contrat cible TravelTimeTargetResult

```typescript
interface TravelTimeTargetResult {
  sourcePointLabel: string;
  referenceStartStationCode: "2263/15";
  referenceStartStationLabel: "Dar Al Arsa";

  targetStationCode: string;
  targetStationLabel: string;

  sourceToReferenceDistanceKm?: number;
  referenceDistanceKm?: number;
  topologyDistanceKm?: number;

  referenceTravelTimeH?: number;
  calculatedTravelTimeH?: number;

  methodUsed:
    | "TC_OBSERVED_DIRECT"
    | "AVERAGE_VELOCITY_FALLBACK"
    | "UNAVAILABLE";

  distanceAlignmentStatus:
    | "ALIGNED"
    | "PARTIALLY_ALIGNED"
    | "NOT_ALIGNED"
    | "NOT_CHECKED";

  confidenceLevel: "MEDIUM" | "LOW" | "UNAVAILABLE";
  warnings: string[];
}
```

## 12. Contrat cible TravelTimeResult

```typescript
interface TravelTimeResult {
  referenceId: "TC_STATIONS_V1";
  referenceVersion: "2026-07-15";
  sourcePointId: "SEGMENT_POLLUTION_BASE";
  sourcePointLabel: string;
  referenceOrigin: "DAR_AL_ARSA";
  sourceOffsetStatus: "NOT_QUANTIFIED" | "QUANTIFIED";
  referenceTime: string;
  referenceTimeSource: "DETECTION_TIME" | "USER_PROVIDED_TIME" | "ANALYSIS_START_TIME";
  targets: TravelTimeTargetResult[];
  scientificLimitations: string[];
}
```

## 13. UX recommandee

Dans le cockpit :

```text
Temps de transfert estimatif
Methode : referentiel Tc Stations v1
Confiance : moyenne/faible
```

Infobulle courte :

```text
Estimation issue de temps de transfert observes entre stations.
```

Le rapport doit contenir l'avertissement complet :

```text
Les temps de transfert sont estimes a partir du decalage temporel entre evenements de crue.
Cette methode est utilisee comme proxy provisoire pour le transfert du signal NH4.
Elle ne constitue pas une modelisation hydraulique complete.
```

## 14. Verrous avant implementation

### Verrou A - Alignement Dar Al Arsa -> Garde

Confirmer que le moteur topologique utilise exactement :

```text
Dar Al Arsa : 2263/15
Amont Barrage de Garde : 3738/8
```

### Verrou B - Localisation P29

Confirmer :

```text
P29 a allal tazi : 1355/8
```

et verifier que la station est sur le parcours principal.

### Verrou C - Offset point source -> Dar Al Arsa

Tant que cet offset n'est pas quantifie :

```text
source_point_offset_status = NOT_QUANTIFIED
```

Le temps total depuis le rejet exact reste incomplet.

## 15. Decision

Le temps de transfert ne bloque pas l'evaluation Matrix V1.

Il est ajoute comme enrichissement decisionnel :

- utile pour la demonstration ;
- utile pour prioriser la reaction ;
- mais scientifiquement annote ;
- et non bloquant si indisponible.

