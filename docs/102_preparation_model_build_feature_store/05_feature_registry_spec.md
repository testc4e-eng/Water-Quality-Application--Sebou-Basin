# Feature Registry Specification

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | specification |
| Périmètre | registre des features, contrats et gouvernance feature engineering |
| Source de vérité | Non |
| Documents liés | `01_data_governance_foundation.md`, `03_temporal_policy.md`, `04_data_origin_policy.md` |
| Dernière mise à jour | 2026-05-20 |

## Contexte

| Statut | Constat |
|---|---|
| VERIFIED | Le schéma `feature_store` n'existe pas. |
| VERIFIED | Aucun `feature_registry` n'existe en DB. |
| VERIFIED | Les données hydro/météo sont les plus proches d'un usage ML classique. |
| VERIFIED | Les données qualité sont utiles mais irrégulières. |
| TO_VALIDATE | Les features spatiales dépendent du retour validation spatiale. |
| TO_VALIDATE | Les features SWAT/WASP dépendent de Reda et Anas. |

## Objectif

Préparer le registre qui empêchera les features non documentées, non reproductibles ou contaminées par leakage.

## Table candidate : `feature_store.feature_registry`

```sql
-- NON EXECUTE - SPECIFICATION ONLY
CREATE TABLE feature_store.feature_registry (
    feature_id uuid PRIMARY KEY,
    feature_name text NOT NULL UNIQUE,
    feature_group text NOT NULL,
    domain text NOT NULL,
    entity_type text NOT NULL,
    value_type text NOT NULL,
    unit text,
    frequency text NOT NULL,
    source_tables text[] NOT NULL,
    dataset_contract_code text NOT NULL,
    calculation_sql_ref text,
    temporal_policy_code text NOT NULL,
    data_origin_allowed text[] NOT NULL,
    leakage_risk text NOT NULL,
    qa_rule_codes text[] NOT NULL,
    owner_role text,
    version_code text NOT NULL,
    status text NOT NULL,
    description text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
```

## Conventions de nommage

Format proposé :

```text
<domain>__<entity>__<variable>__<aggregation>__<window>
```

Exemples non définitifs :

| Feature | Statut | Commentaire |
|---|---|---|
| `hydro__station__debit_m3s__mean__7d` | ASSUMPTION | moyenne glissante débit 7 jours |
| `meteo__station__precip_mm__sum__30d` | ASSUMPTION | cumul pluie 30 jours |
| `quality__station__no3__last_value__365d` | TO_VALIDATE | dernière valeur qualité dans fenêtre |
| `spatial__reach__distance_to_station__static` | dépend validation spatiale | mapping non figé |
| `model__swat__nsurq__daily__legacy` | dépend Reda | output legacy seulement |
| `model__wasp__dissolved_oxygen__daily__legacy` | dépend Anas | output legacy seulement |

## Catégories de features

| Groupe | Description | Statut |
|---|---|---|
| `hydro_daily` | débit, volume, niveau, apport, lâcher, transfert | VERIFIED source available |
| `meteo_daily` | pluie, évaporation, température future | VERIFIED partial |
| `quality_sparse` | mesures qualité campagne | VERIFIED source available |
| `spatial_static` | distances, bassin, sous-bassin, reach | dépend validation spatiale |
| `model_outputs` | SWAT/WASP outputs | dépend Reda / Anas |
| `event_features` | crues, sécheresses, pics pollution | TO_VALIDATE |
| `qa_features` | flags qualité, fraîcheur, complétude | ASSUMPTION |

## Champs obligatoires dans les tables feature

| Champ | Rôle |
|---|---|
| `feature_row_id` | identifiant ligne |
| `entity_id` | entité canonique |
| `entity_type` | station, reach, catchment, site |
| `as_of_date` | date anti-leakage |
| `bucket_day` | date d'agrégation |
| `feature_version` | version calcul |
| `qa_status` | statut qualité |
| `lineage_id` | provenance |
| `dataset_contract_code` | contrat dataset utilisé |
| `unit_policy_code` | politique d'unité si applicable |
| `freshness_days` | âge de l'information si source sparse |
| `freshness_class` | classe de fraîcheur |
| `created_at` | audit |

## Règles anti-leakage registry

| Règle | Statut |
|---|---|
| Toute feature doit déclarer son `temporal_policy_code`. | ASSUMPTION |
| Toute feature cible qualité doit exclure les observations postérieures à `as_of_date`. | TO_VALIDATE |
| Les features basées sur outputs modèle doivent être marquées `modeled` ou `legacy_modeling`. | VERIFIED |
| Les features spatiales ne peuvent être `ACTIVE` que si `geometry_status=VALIDATED`. | dépend validation spatiale |
| Les features sans owner ni description restent `DRAFT`. | ASSUMPTION |
| Toute feature `ACTIVE` doit référencer un dataset contract. | TO_VALIDATE |
| Toute feature issue de qualité sparse doit porter un freshness score. | TO_VALIDATE |

## Dataset contract integration

| Statut | Principe |
|---|---|
| TO_VALIDATE | `feature_registry.dataset_contract_code` doit pointer vers un contrat validé avant statut `ACTIVE`. |
| ASSUMPTION | Le contrat vérifie colonnes, unités, granularité, clés canoniques, QA et valeurs interdites. |
| ASSUMPTION | Les datasets d'entraînement doivent être refusés si le contrat est `DRAFT` ou `BLOCKED`. |

Contrats candidats :

| Contract code | Usage | Statut |
|---|---|---|
| `CONTRACT_HYDRO_DAILY_V1` | features débit/barrage daily | TO_VALIDATE |
| `CONTRACT_METEO_DAILY_V1` | features pluie/évaporation daily | TO_VALIDATE |
| `CONTRACT_QUALITY_SPARSE_V1` | features qualité campagne avec fraîcheur | TO_VALIDATE |
| `CONTRACT_SWAT_LEGACY_SANDBOX_V1` | outputs SWAT legacy uniquement sandbox | dépend Reda |
| `CONTRACT_WASP_LEGACY_SANDBOX_V1` | outputs WASP legacy uniquement sandbox | dépend Anas |

## Statuts de feature

| Statut | Usage |
|---|---|
| `DRAFT` | spécifiée, non validée |
| `CANDIDATE` | calculable en sandbox |
| `QA_READY` | contrôles définis |
| `ACTIVE` | utilisable pour dataset officiel |
| `DEPRECATED` | conservée pour reproductibilité |
| `BLOCKED` | dépendance non résolue |

## Drift monitoring concept

| Contrôle | Description | Statut |
|---|---|---|
| distribution drift | comparaison moyenne/quantiles par période | ASSUMPTION |
| missingness drift | évolution taux nulls/gaps | ASSUMPTION |
| spatial coverage drift | perte d'entités couvertes | dépend validation spatiale |
| model-output drift | dérive outputs SWAT/WASP par run | dépend Reda / Anas |
