# 05 - Plan d'implémentation du MVP propagation

## Objectif
Livrer le MVP du moteur de propagation de pollution : signalisation interactive sur carte, simulation topologique simplifiée, stations/barrages/exutoires impactés, et recommandations.

## Fichiers créés / modifiés

### Backend
| Fichier | Action |
|---------|--------|
| `backend/app/models/propagation_models.py` | Création des modèles Pydantic `SimulatePropagationRequest/Response`, `ImpactedStation`, `Recommendation`, `PathSummary` |
| `backend/app/services/propagation/propagation_recommendations.py` | Seuils d'alerte et génération de recommandations (isolé pour éviter les imports circulaires) |
| `backend/app/services/propagation/propagation_pollution_service.py` | Ajout de `simulate_propagation_from_point()` et `get_network_geojson()` |
| `backend/app/api/v1/propagation.py` | Ajout des routes `POST /simulate` et `GET /network.geojson` |
| `backend/app/services/recommendations/engine.py` | Non modifié (pas d'import de propagation pour éviter un cycle) |

### Frontend
| Fichier | Action |
|---------|--------|
| `frontend/src/api/propagation.ts` | Ajout des types `SimulatePropagationRequest/Response`, `simulatePropagation()`, `getPropagationNetworkGeoJSON()` |
| `frontend/src/pages/DashboardPollutionPropagation.tsx` | Page principale du MVP |
| `frontend/src/components/Pollution/PollutionSignalMap.tsx` | Carte clic-libre + réseau hydro + chemin de propagation |
| `frontend/src/components/Pollution/PollutionSimulationPanel.tsx` | Panneau de paramétrage (polluant, C0, v, λ, durée) |
| `frontend/src/components/Pollution/PollutionPropagationResults.tsx` | Résultats, cibles impactées, recommandations, export JSON |
| `frontend/src/App.tsx` | Route `/dashboard-pollution-propagation` |
| `frontend/src/components/Layout/Layout.tsx` | Intégration au style institutionnel |
| `frontend/src/components/Layout/Header.tsx` | Lien de navigation "Propagation" |

## Modèle de propagation (MVP)

- **Snap** : projection du point lat/lon en 26191 puis snap au nœud le plus proche du réseau validé.
- **Propagation** : sous-graphe atteignable aval depuis le nœud snap.
- **Temps de parcours** : `t = distance_km / vitesse_reference_kmh`.
- **Atténuation** : `C(t) = C0 * exp(-λ * t)`.
- **Alertes** : seuils provisoires Cd/Pb/Hg/Cr/Hydrocarbures en mg/L.

## Avertissements visibles

> "Modèle indicatif — ne remplace pas une étude hydrodynamique détaillée."

Affiché dans le panneau de simulation et dans les résultats.

## Vérifications

- `python -m py_compile` OK sur tous les modules modifiés.
- `npm run build` OK (warnings chunk size uniquement).
- Endpoint `POST /api/v1/propagation/simulate` testé localement et fonctionnel.
- `GET /api/v1/propagation/network.geojson` retourne 746 arêtes.

## Limites connues

- Le snap peut être `LOW` pour des sources éloignées du réseau validé.
- Les seuils sont provisoires et doivent être validés avec le métier.
- Le modèle ne simule pas la dispersion latérale, la dégradation photochimique, ni les interactions sédiments.
