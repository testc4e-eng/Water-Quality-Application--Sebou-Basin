# Tests validation

## Backend

- `GET /api/v1/dashboard/home` répond `200`
- `status` présent
- `generated_at` présent
- `data_freshness` présent
- `hero` présent
- `map` présent
- `basin_status` présent
- `alerts` présent
- `recommended_actions` présent
- `trends` présent
- `secondary_kpis` présent
- `metadata` présent

## Métier

- `hero.cards` contient exactement les 4 cartes opérationnelles
- `rainfall_typology_status` présent dans `metadata`
- `quality_scope = 6 stations sentinelles qualité`
- les KPI DG n'apparaissent pas dans `hero`
- `secondary_kpis` contient `iqgb`, `ifd`, `icd`, `ich`, `ipp`, `isr`
- `temperature_rule = AIR_TEMPERATURE != WATER_TEMPERATURE`
- `map.default_layers = ["barrages", "hydro", "pluvio", "quality_daily"]`
- `map.secondary_layers` ne contient pas les couches opérationnelles principales

## UX

- le home reste compréhensible si `alerts=[]`
- le home reste compréhensible si `recommended_actions=[]`
- le home reste compréhensible si une famille est `STALE`
- le libellé pluie reste prudent
- le libellé qualité emploie `stations sentinelles qualité`

## Couverture automatisée implémentée

- `/api/v1/dashboard/home` répond `200`
- toutes les sections racines obligatoires sont présentes
- `hero.cards` contient exactement 4 cartes opérationnelles
- `hero.cards` exclut `iqgb`, `ifd`, `icd`, `ich`, `ipp`, `isr`
- `secondary_kpis` contient `iqgb`, `ifd`, `icd`, `ich`, `ipp`, `isr`
- `metadata.temperature_rule = AIR_TEMPERATURE != WATER_TEMPERATURE`
- `metadata.quality_scope = 6 stations sentinelles qualité`
- `metadata.rainfall_typology_status = TO_CONSOLIDATE`
- `basin_status.rainfall.label = Données pluie disponibles`
- `basin_status.quality.label = Stations sentinelles qualité`
- `map.default_layers = ["barrages", "hydro", "pluvio", "quality_daily"]`
- le payload reste valide si une sous-section échoue et bascule alors en `status=partial`

## Résultat actuel

- `python -m pytest tests/test_dashboard_home_v2.py -q` : `10 passed`

## Couverture performance ajoutée

- le contrat racine reste inchangé malgré le cache backend
- le cache renvoie la même structure que le premier payload
- un payload `partial` reste valide et cacheable
- `SAD_DASHBOARD_HOME_CACHE_SECONDS=0` désactive le cache
- l’endpoint reste `200` avec ou sans cache

## Résultat après optimisation

- `python -m pytest tests/test_dashboard_home_v2.py -q` : `13 passed`
