# 04 — Tests et validation du moteur de propagation pollution

---

## 1. Scénarios de tests E2E

### Test 1 — Accès à l'écran de simulation

**Étapes :**
1. Naviguer vers `/dashboard-pollution-propagation` (ou onglet simulation).
2. Vérifier que la carte et le panneau de signalisation s'affichent.

**Critère d'acceptation :** Pas d'erreur, mode "clic sur carte" actif.

---

### Test 2 — Signalisation sur la carte

**Étapes :**
1. Cliquer sur un point proche du réseau hydrographique (ex. près de Fez, lat=34.0, lon=-5.0).
2. Vérifier l'apparition du marqueur de pollution.

**Critère d'acceptation :** Marqueur affiché, coordonnées transmises au formulaire.

---

### Test 3 — Lancement d'une simulation

**Étapes :**
1. Remplir le formulaire :
   - Polluant : `Cd`
   - Concentration initiale : `5 mg/L`
   - Date : maintenant
   - Durée : `72 h`
   - Vitesse : `10 km/h`
2. Cliquer sur "Lancer la simulation".

**Critère d'acceptation :** Appel POST `/api/v1/propagation/simulate` retourne 200 avec `path_geojson` et `impacted_stations`.

---

### Test 4 — Affichage du chemin pollué

**Étapes :**
1. Après simulation, observer la carte.

**Critère d'acceptation :** Une ligne colorée représente le chemin aval depuis le point source.

---

### Test 5 — Stations impactées

**Étapes :**
1. Consulter le tableau des stations impactées.

**Critère d'acceptation :**
- Les stations sont triées par heure d'arrivée croissante.
- La concentration estimée décroît avec la distance.
- Les niveaux d'alerte (`SAFE`, `WARNING`, `CRITICAL`) sont cohérents avec les seuils.

---

### Test 6 — Recommandations

**Étapes :**
1. Lancer une simulation avec un polluant critique (ex. `Cd` à 5 mg/L).
2. Consulter le panneau de recommandations.

**Critère d'acceptation :** Au moins une recommandation de priorité `HIGH` ou `CRITICAL` est affichée.

---

### Test 7 — Snap faible

**Étapes :**
1. Cliquer loin du réseau hydrographique (ex. lat=34.0, lon=-6.5).
2. Lancer la simulation.

**Critère d'acceptation :** Un avertissement `snap_confidence = LOW` est affiché et les résultats sont présentés avec une mise en garde.

---

### Test 8 — API backend directe

**Étapes :**
```bash
curl -X POST http://localhost:8010/api/v1/propagation/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 34.0,
    "lon": -5.0,
    "pollutant_type": "Cd",
    "initial_concentration_mg_l": 5.0,
    "timestamp": "2026-06-16T10:00:00Z",
    "simulation_hours": 72,
    "vitesse_reference_kmh": 10,
    "lambda_1_per_h": 0.05
  }'
```

**Critère d'acceptation :** Réponse JSON valide avec `status: success`, `snap`, `path_geojson`, `impacted_stations`.

---

### Test 9 — Endpoints existants inchangés

**Étapes :**
```bash
curl -s "http://localhost:8010/api/v1/propagation/source-to-stations?lng=-4.9&lat=34.3&limit=3"
curl -s "http://localhost:8010/api/v1/propagation/source-to-garde?lng=-4.9&lat=34.3"
```

**Critère d'acceptation :** Les endpoints retournent toujours les mêmes structures JSON qu'avant.

---

### Test 10 — Build et compilation

**Étapes :**
```bash
cd repo_git/frontend && npm run build
cd repo_git/backend && python -m py_compile app/api/v1/propagation.py
python -m py_compile app/services/propagation/propagation_pollution_service.py
python -m py_compile app/services/pollution_attenuation_service.py
```

**Critère d'acceptation :** Build frontend OK (warnings chunk size acceptés) ; compilation backend OK.

---

## 2. Checklist de validation

- [ ] Écran `/dashboard-pollution-propagation` accessible et stable
- [ ] Clic sur carte placé un marqueur de pollution
- [ ] Formulaire de simulation fonctionnel (validation incluse)
- [ ] Appel API `/propagation/simulate` retourne 200
- [ ] Chemin aval affiché sur la carte
- [ ] Stations/barrages/exutoires impactés listés
- [ ] Concentrations estimées décroissantes avec la distance
- [ ] Alertes WARNING/CRITICAL cohérentes avec les seuils
- [ ] Recommandations générées pour les alertes CRITICAL
- [ ] Avertissement affiché si `snap_confidence = LOW`
- [ ] Endpoints existants `/propagation/*` non régressés
- [ ] `npm run build` passe
- [ ] `python -m py_compile` passe sur les modules modifiés
- [ ] Aucun impact sur Dashboard DG, Dashboard Qualité, Carte Métier

---

## 3. Décision finale

**Recommandation : GO pour implémenter le MVP** sous réserve de :

1. Choisir l'emplacement UX : nouvelle route `/dashboard-pollution-propagation` ou onglet dans `DashboardPollution`.
2. Valider (ou marquer provisoires) les valeurs de `λ` et `vitesse_reference_kmh`.
3. Valider (ou marquer provisoires) les seuils d'alerte par polluant.

**WASP avancé : ATTENDRE** la validation du contrat externe et la calibration scientifique avant d'envisager une intégration comme moteur principal.
