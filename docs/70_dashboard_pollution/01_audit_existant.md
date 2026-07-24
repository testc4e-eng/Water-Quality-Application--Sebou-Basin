# 01 — Audit de l'existant Dashboard Pollution

> Audit réalisé le 2026-06-16 sur la branche `Dev_refonte`.
> Règle respectée : lecture seule du code et de la base ; aucune modification des tables sources, du Dashboard DG, du Dashboard Qualité ni de la Carte Métier.

---

## 1. Vue d'ensemble

Le projet dispose déjà d'une page **Dashboard Pollution** accessible aux routes `/dashboard-pollution` et `/pollution`. Cependant, cette page consomme les APIs **IDP (Inventaire des Points de Pollution)** et de **propagation topologique**, pas les données brutes de **campagnes de prélèvement** (`qualite.source_pollution_prelevement`).

**Constat clé :** l'écran existant affiche des **sources de pollution déclarées** (2 026 sites, 5 paramètres P0) mais **ne restitue pas les 141 prélèvements de campagne avec leurs 51 paramètres**.

---

## 2. Fichiers frontend trouvés

| Fichier | Rôle | État |
|---------|------|------|
| `frontend/src/pages/DashboardPollution.tsx` | Page principale `/dashboard-pollution` | **Fonctionnelle** — affiche carte IDP, KPIs, onglets propagation/impacts/recommandations |
| `frontend/src/pages/PollutionIdpDevPage.tsx` | Page DEV `/pollution-idp-dev` | **Fonctionnelle** — couche MapLibre isolée pour tests IDP |
| `frontend/src/components/Pollution/PollutionIdpMap.tsx` | Carte MapLibre des sites IDP | **Fonctionnelle** — symbologie validation/réglementaire, popup P0 |
| `frontend/src/components/Pollution/PollutionMap.tsx` | Carte de simulation legacy | **Obsolète** — liée à `pollutionSimulationData.ts` (mock) |
| `frontend/src/components/Pollution/PollutionSidebar.tsx` | Sidebar de simulation legacy | **Obsolète** — formulaire de déclaration mock |
| `frontend/src/api/pollutionIdp.ts` | Client API IDP | **Fonctionnel** — limite aux 5 paramètres P0 (DBO5, DCO, NH4, NO3, MES) |
| `frontend/src/hooks/usePollutionIdp.ts` | Hooks React Query IDP | **Fonctionnel** |
| `frontend/src/App.tsx` | Déclaration des routes | **Fonctionnel** — routes `/dashboard-pollution`, `/pollution`, `/pollution-idp-dev` |

### Dépendances du DashboardPollution existant

- `usePollutionIdp` / `usePollutionLatestResults` → `/api/v1/pollution/sites.geojson`, `/api/v1/pollution/latest-results`
- `usePropagationToGarde/Stations/Barrages/Exutoires` → `/api/v1/propagation/*`
- `useDecisionRecommendations` → `/api/v1/recommendations`
- `PollutionIdpMap` → MapLibre + GeoJSON IDP

---

## 3. Fichiers backend trouvés

| Fichier | Rôle | État |
|---------|------|------|
| `backend/app/api/v1/pollution.py` | Router `/api/v1/pollution/*` | **Fonctionnel** — endpoints `/sites.geojson` et `/latest-results` (P0 uniquement) |
| `backend/app/api/api_v1.py` | Inclusion des routers | **Fonctionnel** — `pollution_router` monté sans préfixe |
| `backend/app/routers/quality.py` | Router `/api/v1/quality/*` | **Fonctionnel** — inclut `/inventory/rows` (inventaire STEP/STM/points d'eau) et pollution-organique |
| `backend/app/services/propagation/propagation_pollution_service.py` | Service propagation | **Fonctionnel** — consommé par `/api/v1/propagation/*` |
| `backend/app/routers/analytics.py` | Analytics | **Fonctionnel** — `/analytics/pollution/options`, `/analytics/pollution/sites`, `/analytics/pollution/series` |

**Aucun modèle Pydantic spécifique aux campagnes/prélèvements pollution** n'existe actuellement.

---

## 4. API existante — tests

### Endpoints actuellement disponibles

```bash
curl -s "http://localhost:8010/api/v1/pollution/sites.geojson?limit=5"      # OK
curl -s "http://localhost:8010/api/v1/pollution/latest-results?limit=3"     # OK
curl -s "http://localhost:8010/api/v1/propagation/source-to-garde"          # OK (si site_id fourni)
curl -s "http://localhost:8010/api/v1/recommendations?domain=pollution"     # OK
curl -s "http://localhost:8010/api/v1/quality/inventory/rows"               # OK
```

### Endpoints manquants pour les campagnes de prélèvement

| Endpoint attendu | État |
|------------------|------|
| `GET /api/v1/pollution/campagnes` | **Absent** |
| `GET /api/v1/pollution/campagnes/{id}` | **Absent** |
| `GET /api/v1/pollution/prelevements` | **Absent** (404) |
| `GET /api/v1/pollution/prelevements/{id}` | **Absent** |
| `GET /api/v1/pollution/sites` (JSON liste) | **Absent** (seul `.geojson` existe) |
| `GET /api/v1/pollution/mesures` | **Absent** |
| `GET /api/v1/pollution/alerts` | **Absent** |

Test des endpoints manquants :

```bash
curl -s "http://localhost:8010/api/v1/pollution/prelevements" | head -c 200
# {"detail":"Not Found"}
```

---

## 5. État visuel actuel

La page `/dashboard-pollution` est accessible et affiche :

- Un bandeau DEV/TOPOLOGIQUE/NON HYDRAULIQUE SCIENTIFIQUE
- 4 KPIs : Sites recensés (500), Résultats récents (250), Types de rejets (4), Source API
- Une carte MapLibre **Pollutions déclarées**
- 4 onglets : Pollutions déclarées / Propagation / Impacts potentiels / Recommandations
- Une sidebar de sélection de site source + rappels métier

**Capture d'écran :** `docs/70_dashboard_pollution/dashboard_pollution_current_state.png`

**Conclusion visuelle :** l'écran est fonctionnel mais ne comporte **aucun tableau de campagnes, aucune fiche de prélèvement, aucun indicateur métallique lourd** et aucune analyse des 51 paramètres mesurés.

---

## 6. Synthèse des écarts

| Attendu (données de campagne) | Existant |
|-------------------------------|----------|
| 141 prélèvements, 51 paramètres | Affichage IDP : ~500 sites, 5 paramètres P0 |
| Vue campagne + fiche prélèvement | Non présent |
| Alertes métaux lourds (Cd, Pb, Hg, Cr) | Non présent |
| Tableau comparatif campagnes | Non présent |
| Carte des points de prélèvement de campagne | Non présent (carte IDP différente) |
| Export rapport campagne | Non présent |

---

## 7. Décision intermédiaire

**GO conditionnel** pour créer un **Dashboard Pollution — Campagnes de prélèvement** en parallèle de l'écran IDP existant, sans le remplacer. La validation métier est requise sur les seuils réglementaires et les unités des métaux lourds avant de rendre les alertes opérationnelles.
