# Temporal Policy

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | policy specification |
| Périmètre | règles temporelles pour build, features, ML et anti-leakage |
| Source de vérité | Non |
| Documents liés | `01_data_governance_foundation.md`, `05_feature_registry_spec.md` |
| Dernière mise à jour | 2026-05-20 |

## Contexte

| Statut | Constat |
|---|---|
| VERIFIED | Les séries météo et hydro sont majoritairement journalières ou assimilables quotidiennement. |
| VERIFIED | Les séries qualité sont irrégulières, de type campagne. |
| VERIFIED | Les outputs SWAT/WASP legacy ont des pas temporels journaliers dans les tables de résultats auditées. |
| TO_VALIDATE | Les fenêtres calibration/validation SWAT+ dépendent de Reda. |
| TO_VALIDATE | Les fenêtres WASP et conditions limites dépendent d'Anas. |

## Objectif

Définir les règles temporelles minimales pour éviter :

- data leakage ;
- confusion observation/modèle ;
- agrégations incohérentes ;
- mélange de fréquence journalière et campagne ;
- entraînement sur information future.

## Table candidate : `metadata.temporal_policy`

```sql
-- NON EXECUTE - SPECIFICATION ONLY
CREATE TABLE metadata.temporal_policy (
    temporal_policy_id uuid PRIMARY KEY,
    policy_code text NOT NULL UNIQUE,
    domain text NOT NULL,
    source_schema text,
    source_table text,
    time_column text NOT NULL,
    native_frequency text NOT NULL,
    target_frequency text,
    aggregation_rule text,
    allowed_lag_days integer,
    min_history_days integer,
    max_gap_days integer,
    leakage_guard_rule text NOT NULL,
    qa_status text NOT NULL,
    valid_from timestamptz,
    valid_to timestamptz,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);
```

## Fréquences proposées

| Domaine | Source | Fréquence native | Fréquence cible Feature Store | Statut |
|---|---|---|---|---|
| hydro débit | `hydro.mesure_debit` | journalier/sub-journalier selon station | daily | VERIFIED |
| hydro barrage | `hydro.mesure_barrage_param` | daily | daily | VERIFIED |
| météo pluie | `meteo.mesure_precipitation` | daily | daily | VERIFIED |
| météo évaporation | `meteo.mesure_evaporation` | daily | daily | VERIFIED |
| météo température | `meteo.mesure_temperature` | absent | non applicable | VERIFIED |
| qualité rivière/nappe/barrage | `qualite.mesure_qualite_*` | campagne irrégulière | daily sparse + last observation carry metadata | ASSUMPTION |
| IDP pollution | `qualite.resultat_mesure` | campagne/ponctuel | event-based + daily sparse | TO_VALIDATE |
| SWAT output | `swat_output.*` | daily | daily | LEGACY |
| WASP output | `wasp_output.*`, `wasp_sebou.*` | daily | daily | LEGACY |

## Règles anti-leakage

| Règle | Description | Statut |
|---|---|---|
| `as_of_date` obligatoire | date maximale d'information disponible pour calculer une feature | ASSUMPTION |
| `target_date` obligatoire | date de la cible prédite ou expliquée | ASSUMPTION |
| `forecast_horizon_days` obligatoire | horizon entre `as_of_date` et `target_date` | ASSUMPTION |
| pas de jointure qualité future | une mesure qualité après `as_of_date` ne peut pas servir de feature | TO_VALIDATE |
| pas d'output modèle futur | un output SWAT/WASP postérieur à `as_of_date` ne peut pas expliquer une cible historique réelle | TO_VALIDATE |
| splits temporels stricts | train < validation < test en dates | ASSUMPTION |

## Politiques temporelles candidates

| `policy_code` | Usage | Règle |
|---|---|---|
| `DAILY_OBSERVED_STRICT` | hydro/météo observés | uniquement données observées jusqu'à `as_of_date` |
| `DAILY_MODEL_OUTPUT_LEGACY` | SWAT/WASP legacy | autorisé pour benchmark, interdit comme vérité terrain |
| `CAMPAIGN_SPARSE_OBSERVED` | qualité campagne | pas d'interpolation silencieuse ; flag de fraîcheur obligatoire |
| `EVENT_BASED_IDP` | pollution/IDP | événement ponctuel, pas de complétion artificielle |
| `TRAINING_WINDOW_LOCKED` | ML | fenêtres figées, versionnées et reproductibles |

## Champs temporels standards

| Champ | Rôle |
|---|---|
| `event_time` | date/heure de l'observation source |
| `bucket_day` | jour normalisé |
| `as_of_date` | date de disponibilité maximale des features |
| `target_date` | date de la cible |
| `forecast_horizon_days` | horizon de prédiction |
| `window_start` | début fenêtre agrégation |
| `window_end` | fin fenêtre agrégation |
| `data_available_at` | date réelle de disponibilité si différente de `event_time` |
| `freshness_days` | âge de la dernière observation disponible à `as_of_date` |
| `freshness_class` | classe de fraîcheur analytique |
| `freshness_weight` | pondération candidate pour ML ou scoring |

## Quality freshness score

| Statut | Principe |
|---|---|
| VERIFIED | Les mesures qualité sont irrégulières et ne doivent pas être traitées comme une chronique dense. |
| ASSUMPTION | La fraîcheur doit être calculée par couple entité/paramètre/support. |
| TO_VALIDATE | Les seuils de fraîcheur doivent être validés par le métier qualité. |

Nomenclature candidate :

| `freshness_class` | Exemple de règle initiale | Usage |
|---|---|---|
| `FRESH` | 0 à 30 jours | observation récente |
| `STABLE` | 31 à 180 jours | exploitable avec prudence |
| `OLD` | 181 à 365 jours | contexte historique |
| `STALE` | > 365 jours | ne pas utiliser comme état courant |
| `UNKNOWN` | pas de date fiable | exclure ou quarantaine |

Champs candidats dans Feature Store :

| Champ | Type conceptuel | Rôle |
|---|---|---|
| `last_observation_date` | date | dernière mesure connue avant `as_of_date` |
| `freshness_days` | integer | `as_of_date - last_observation_date` |
| `freshness_class` | text | classe métier |
| `freshness_weight` | numeric | pondération 0..1 |
| `freshness_policy_code` | text | version de politique |

## Risques

- Qualité d'eau irrégulière : ne pas convertir artificiellement en série quotidienne dense sans stratégie validée.
- Outputs modèles legacy : risque de les utiliser comme cible IA au lieu de benchmark.
- Données futures : risque élevé si les agrégations utilisent `max(date)` global sans `as_of_date`.
- Fraîcheur qualité ignorée : risque de donner le même poids à une mesure de 5 jours et à une mesure de 400 jours.
