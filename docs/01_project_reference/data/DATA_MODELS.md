# DATA_MODELS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | modèle logique des entités métier et des relations structurantes du SAD |
| Source de vérité | Oui |
| Documents liés | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), [DATA_FLOW](./DATA_FLOW.md), [API_DATA_MAPPING](./API_DATA_MAPPING.md) |
| Dernière mise à jour | 2026-04-10 |

## 1. Entités centrales

- `Station` : ancrée dans `infra.stations_mesure`, relayée par `api.mv_station_dimension` et consommée par les mesures `hydro`, `meteo` et `qualite`.
- `Bassin / sous-bassin` : portés par `geo.bassin_versant`, `geo.sous_bassin_abh` et les tables `geo.sous_bassin_swat_*`.
- `Scénario` : porté par `swat_sebou.swat_scenarios` et `wasp_sebou.wasp_scenarios`.
- `Paramètre / variable` : normalisé dans `metadata.referentiel_parametre`, `metadata.mapping_parametre_source` et `wasp_sebou.wasp_variables`.
- `Utilisateur / rôle / permission` : porté par `security.users`, `security.roles`, `security.permissions`.

## 2. Relations structurantes

- `hydro.mesure_debit.station_id -> infra.stations_mesure.id`
- `meteo.mesure_precipitation.station_id -> infra.stations_mesure.id`
- `meteo.mesure_temperature.station_id -> infra.stations_mesure.id`
- `qualite.mesure_qualite_riviere.station_id -> infra.stations_mesure.id`
- `qualite.mesure_qualite_riviere.parametre_ref_id -> metadata.referentiel_parametre.id`
- `qualite.mesure_qualite_sebou.parametre_ref_id -> metadata.referentiel_parametre.id`
- `swat_sebou.swat_subbasin_results.scenario_id -> swat_sebou.swat_scenarios.id`
- `wasp_sebou.wasp_results.scenario_id -> wasp_sebou.wasp_scenarios.id`
- `wasp_sebou.wasp_results.variable_id -> wasp_sebou.wasp_variables.id`
- `security.users.role_id -> security.roles.id`

## 3. Logique métier

- Les tables métier (`hydro`, `meteo`, `qualite`) portent les séries et mesures brutes ou consolidées.
- Les tables `metadata.mapping_*` assurent la continuité entre sources historiques et modèle canonique.
- Les schémas `api` et `analytics` servent de couche d'abstraction stable pour la restitution web.

## 4. Schéma logique simplifié

```text
Référentiels spatiaux et entités terrain
        ↓
Mesures métier et résultats modèles
        ↓
Mappings, paramètres et gouvernance
        ↓
Vues API et vues matérialisées
        ↓
Backend FastAPI puis dashboards et administration
```
