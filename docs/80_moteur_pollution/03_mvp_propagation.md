# 03 — MVP propagation pollution

---

## 1. Objectif du MVP

Réintégrer la **signalisation interactive** et la **propagation simplifiée** de l'ancienne plateforme en s'appuyant sur le moteur topologique déjà existant.

**Scope MVP :**
- Signalisation par clic sur carte.
- Propagation topologique aval avec vitesse constante.
- Atténuation exponentielle simple de la concentration.
- Détection des stations/barrages/exutoires impactés.
- Alertes par seuils réglementaires.
- Recommandations simples.

**Non-MVP (reporté) :**
- WASP complet (advection-diffusion-réaction)
- Modèle hydrodynamique dynamique (débit variable)
- Intégration SWAT
- Prédictions multi-scénarios
- Recommandations basées sur ML

---

## 2. Formulaire de simulation

```json
{
  "lat": 34.0522,
  "lon": -4.9877,
  "pollutant_type": "Cd",
  "pollutant_family": "metaux_lourds",
  "initial_concentration_mg_l": 5.0,
  "timestamp": "2026-06-16T10:00:00Z",
  "simulation_hours": 72,
  "vitesse_reference_kmh": 10,
  "lambda_1_per_h": 0.05
}
```

### Familles de polluants proposées

| Famille | Polluants | Vitesse par défaut (km/h) | λ par défaut (1/h) |
|---------|-----------|---------------------------|--------------------|
| Métaux lourds | Cd, Pb, Hg, Cr | 2.5 | 0.01 |
| Hydrocarbures | huiles, essences | 4.0 | 0.05 |
| Eaux usées brutes | DBO5, DCO, MES, NH4 | 5.0 | 0.10 |
| Rejet agricole | nitrates, pesticides | 5.0 | 0.08 |
| Autre chimique | divers | 4.0 | 0.05 |

> Les valeurs de λ sont des **valeurs provisoires** à calibrer avec le métier.

---

## 3. Formule de propagation retenue

### Temps de parcours

```
t_segment (h) = length_segment (km) / vitesse_reference (km/h)
t_cumulé (h) = Σ t_segment
```

### Atténuation de concentration

```
C(t) = C0 * exp(-λ * t_cumulé)
```

Avec :
- `C0` : concentration initiale (mg/L)
- `λ` : coefficient d'atténuation (1/h)
- `t_cumulé` : temps écoulé depuis la source (h)

### Exemple

```
C0 = 5 mg/L
λ = 0.05 1/h
vitesse = 10 km/h
temps sur 20 km = 2 h
C(2h) = 5 * exp(-0.05 * 2) = 4.52 mg/L
```

---

## 4. Seuils d'alerte MVP

```python
ALERT_RULES = {
    "Cd": {"WARNING": 0.005, "CRITICAL": 0.01},   # mg/L — à valider
    "Pb": {"WARNING": 0.010, "CRITICAL": 0.05},
    "Hg": {"WARNING": 0.001, "CRITICAL": 0.002},
    "CrT": {"WARNING": 0.020, "CRITICAL": 0.05},
    "DBO5": {"WARNING": 10.0, "CRITICAL": 30.0},
    "DCO": {"WARNING": 50.0, "CRITICAL": 120.0},
    "MES": {"WARNING": 100.0, "CRITICAL": 300.0},
    "NH4": {"WARNING": 2.0, "CRITICAL": 5.0},
}

def get_alert_level(pollutant: str, concentration: float) -> str:
    thresholds = ALERT_RULES.get(pollutant, {})
    if concentration >= thresholds.get("CRITICAL", float("inf")):
        return "CRITICAL"
    if concentration >= thresholds.get("WARNING", float("inf")):
        return "WARNING"
    return "SAFE"
```

> Ces seuils sont une **première proposition**. Ils doivent être validés par le métier et idéalement externalisés dans une table de configuration.

---

## 5. API backend MVP

### Nouvel endpoint

```
POST /api/v1/propagation/simulate
```

### Payload

```json
{
  "lat": 34.0522,
  "lon": -4.9877,
  "pollutant_type": "Cd",
  "initial_concentration_mg_l": 5.0,
  "timestamp": "2026-06-16T10:00:00Z",
  "simulation_hours": 72,
  "vitesse_reference_kmh": 10,
  "lambda_1_per_h": 0.05
}
```

### Response

```json
{
  "propagation_id": "uuid",
  "status": "success",
  "source": {
    "source_type": "coordinates",
    "source_id": "-4.9877,34.0522",
    "input_mode": "coordinates"
  },
  "snap": {
    "edge_id": 425,
    "start_node": 41,
    "distance_to_network_m": 4484.88,
    "snap_confidence": "LOW",
    "network_component": 5
  },
  "propagation": {
    "path_length_km": 32.32,
    "max_simulation_hours": 72,
    "time_model": "TOPOLOGICAL_CONSTANT_SPEED_MVP",
    "scientific_mode": false,
    "warning": "Temps et concentrations indicatifs non scientifiques"
  },
  "path_geojson": {
    "type": "FeatureCollection",
    "features": [...]
  },
  "impacted_stations": [
    {
      "station_id": "d098a56d-7e97-453f-b1c0-32305b595087",
      "station_name": "pont rp 26",
      "station_type": "hydrologique",
      "distance_to_source_km": 32.32,
      "arrival_time": "2026-06-16T13:14:00Z",
      "estimated_concentration_mg_l": 3.20,
      "alert_level": "WARNING"
    }
  ],
  "impacted_barrages": [...],
  "impacted_exutoires": [...],
  "recommendations": [
    {
      "priority": 1,
      "domain": "pollution",
      "action": "Surveillance renforcée à pont rp 26",
      "deadline": "2026-06-16T13:14:00Z",
      "why": "Concentration Cd estimée 3.2 mg/L dépasse le seuil WARNING"
    }
  ],
  "metadata": {
    "network_table": "geo_work.reseau_hydro_edges_final_candidate_20260602",
    "lambda_1_per_h": 0.05,
    "vitesse_reference_kmh": 10
  }
}
```

### Endpoints existants conservés

```
GET /api/v1/propagation/snap-diagnostic
GET /api/v1/propagation/source-to-garde
GET /api/v1/propagation/source-to-stations
GET /api/v1/propagation/source-to-barrages
GET /api/v1/propagation/source-to-exutoires
```

---

## 6. Composants frontend MVP

| Composant | Fichier | Rôle |
|-----------|---------|------|
| Page principale | `frontend/src/pages/DashboardPollutionPropagation.tsx` | Écran de simulation |
| Carte signalisation | `frontend/src/components/Pollution/PollutionSignalMap.tsx` | Clic sur carte + affichage chemin |
| Panneau simulation | `frontend/src/components/Pollution/PollutionSimulationPanel.tsx` | Formulaire de paramètres |
| Résultats | `frontend/src/components/Pollution/PollutionPropagationResults.tsx` | Tableau impacts + carte |
| Recommandations | `frontend/src/components/Pollution/PollutionRecommendations.tsx` | Actions décisionnelles |
| Hook API | `frontend/src/hooks/usePropagationSimulation.ts` | Appel POST `/propagation/simulate` |
| Client API | `frontend/src/api/propagation.ts` | Fonction `simulatePropagation` |

---

## 7. Planning indicatif (3-4 semaines)

| Semaine | Tâches | Livrables |
|---------|--------|-----------|
| **W1** | Backend : service d'atténuation, alertes, recommandations, endpoint `/simulate` | `pollution_attenuation_service.py`, `impact_detector_service.py`, endpoint POST |
| **W2** | Frontend : signalisation sur carte, formulaire, hook API | `PollutionSignalMap.tsx`, `PollutionSimulationPanel.tsx`, `usePropagationSimulation.ts` |
| **W3** | Frontend : affichage résultats, chemin coloré, recommandations | `PollutionPropagationResults.tsx`, `PollutionRecommendations.tsx` |
| **W4** | Tests E2E, calibrage λ/vitesse avec métier, documentation | Scénarios validés, captures écran, build OK |

---

## 8. Risques et dépendances

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Snap éloigné (distance > 250 m) | Résultats peu fiables | Afficher `snap_confidence` LOW + avertissement |
| λ/vitesse non calibrés | Concentrations/temps faux | Valeurs configurables + bandeau "indicatif" |
| Plusieurs composantes connexes | Source isolée du réseau principal | Vérifier `network_component` et informer l'utilisateur |
| WASP non disponible | Pas de modèle scientifique | Utiliser MVP topologique, planifier WASP en phase 2 |
| Confusion avec Dashboard Pollution IDP | UX fragmentée | Route dédiée `/dashboard-pollution-propagation` |

---

## 9. Décision

**GO pour le MVP propagation simplifiée** dès validation des points suivants :
1. Valeurs par défaut de `λ` et `vitesse_reference_kmh` acceptables pour une démonstration.
2. Seuils d'alerte par polluant validés (ou marqués "provisoires").
3. Emplacement UX : nouvelle route ou nouvel onglet dans `DashboardPollution`.

Le **WASP avancé reste en attente** du contrat externe et de la validation scientifique.
