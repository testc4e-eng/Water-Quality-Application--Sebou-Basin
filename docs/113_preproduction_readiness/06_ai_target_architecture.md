# Architecture cible moteur IA

| Champ | Valeur |
|---|---|
| Statut | Cible |
| Type | architecture |
| Snapshot | 2026-06-04 |

## Positionnement

Le moteur IA doit etre prepare des maintenant sans attendre la livraison finale SWAT/WASP.

Le principe est de construire un socle IA centré sur les donnees observees et les referentiels gouvernes, puis de brancher SWAT/WASP comme sources externes versionnees lorsqu'elles seront validees.

## 1. Architecture prediction

```text
hydro/meteo/qualite/pollution observes
-> canonical views api.*
-> model_build
-> feature_store
-> training datasets
-> model registry
-> prediction services
```

Sources prioritaires :

- `api.v_station_dimension`
- `api.v_barrage_dimension`
- `api.v_pollution_sites`
- `api.v_pollution_latest_results`
- vues hydro/meteo/qualite exposees au runtime

## 2. Architecture recommandation

```text
signals terrain + KPI + classification reglementaire + propagation topologique
-> rule engine
-> recommendation engine
-> explainability payload
-> dashboard decisionnel
```

Dependances courtes :

- `backend/app/services/kpi/engine.py`
- `backend/app/services/dashboard/home_service.py`
- `backend/app/services/map_business_service.py`
- `backend/app/services/regulatory_quality.py`

## 3. Feature store cible

Familles de features :

- hydro temporel ;
- meteo temporel ;
- qualite reglementaire ;
- pollution IDP consolidee ;
- contexte spatial station/barrage/commune/sous-bassin ;
- topologie de propagation non scientifique ;
- futures features SWAT/WASP versionnees.

Contraintes :

- exclure `WAIT_SOURCE_FIX` ;
- exclure les runs SWAT/WASP non valides ;
- versionner toute feature sensible au lineage source.

## 4. Modele de donnees cible

```text
entity_dimension
time_series_fact
quality_classification_fact
pollution_event_fact
propagation_fact
model_run_dimension
feature_snapshot_fact
training_dataset_registry
```

## 5. Pipeline ML cible

```text
staging -> QA -> canonical -> feature build -> split registry -> train -> evaluate -> register -> serve
```

Gates :

1. QA structurelle ;
2. QA metier ;
3. validation lineage ;
4. validation modele ;
5. promotion environnement.

## 6. Regles de gouvernance

- aucun dataset ML n'absorbe `WAIT_SOURCE_FIX` ;
- aucun dataset officiel n'absorbe `DUPLICATE_EXACT` hors couche consolidee ;
- aucun output SWAT/WASP n'est promu sans `VALIDATED_SCIENTIFIC` ;
- aucun signal de propagation ne doit etre presente comme hydraulique scientifique tant que `direction_validated=false`.

## Decision

```text
AI_ENGINE_STRATEGY = OBSERVED_DATA_FIRST__MODEL_INPUTS_LATER
```
