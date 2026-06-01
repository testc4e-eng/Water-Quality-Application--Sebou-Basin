# Data Origin Policy

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | policy specification |
| Périmètre | origine, confiance et statut des données |
| Source de vérité | Non |
| Documents liés | `01_data_governance_foundation.md`, `02_canonical_reference_spec.md` |
| Dernière mise à jour | 2026-05-20 |

## Contexte

| Statut | Constat |
|---|---|
| VERIFIED | Les tables actuelles contiennent des champs partiels : `source_system`, `source_table`, `scenario`, `run_id`, `quality_flag`, `qa_flags`, `confidence_score` selon les domaines. |
| VERIFIED | Il n'existe pas de colonne standard unique `data_origin` dans les tables auditées. |
| VERIFIED | Les outputs SWAT/WASP actuels sont legacy. |
| TO_VALIDATE | La politique finale observed/modeled/interpolated/corrected/imported/expert_estimated doit être arbitrée. |

## Objectif

Standardiser l'origine des données pour toutes les futures couches :

- `model_build` ;
- `feature_store` ;
- datasets ML ;
- QA et lineage ;
- outputs modèles.

## Nomenclature proposée

| `data_origin` | Définition | Exemple | Statut |
|---|---|---|---|
| `observed` | mesure terrain ou station réelle | débit, pluie, qualité labo | TO_VALIDATE |
| `modeled` | sortie modèle déterministe | SWAT/WASP/HEC | TO_VALIDATE |
| `interpolated` | valeur calculée entre observations | interpolation spatiale/temporelle | TO_VALIDATE |
| `corrected` | valeur corrigée après QA | correction métier validée | TO_VALIDATE |
| `imported` | donnée importée sans transformation métier | staging normalisé | TO_VALIDATE |
| `expert_estimated` | estimation métier explicite | hypothèse hydrologue | TO_VALIDATE |
| `legacy_modeling` | output modèle historique non final | SWAT/WASP actuels | VERIFIED |

## Table candidate : `metadata.data_origin_policy`

```sql
-- NON EXECUTE - SPECIFICATION ONLY
CREATE TABLE metadata.data_origin_policy (
    data_origin_code text PRIMARY KEY,
    label text NOT NULL,
    definition text NOT NULL,
    allowed_in_model_build boolean NOT NULL,
    allowed_in_feature_store boolean NOT NULL,
    allowed_as_ml_target boolean NOT NULL,
    requires_source_model boolean NOT NULL,
    requires_confidence_score boolean NOT NULL,
    requires_lineage boolean NOT NULL,
    default_qa_status text NOT NULL,
    validation_status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
```

## Champs standards

| Champ | Obligatoire | Rôle |
|---|---|---|
| `data_origin` | oui | origine sémantique |
| `source_model` | si `modeled` ou `legacy_modeling` | nom modèle : SWAT, SWAT+, WASP |
| `source_model_version` | si modèle | version modèle |
| `scenario_code` | si scénario | scénario stable |
| `run_id` | si pipeline/run | traçabilité |
| `confidence_score` | recommandé | score 0..1 |
| `qa_status` | oui | statut exploitation |
| `uncertainty_class` | recommandé | faible/moyenne/forte |
| `lineage_id` | oui | provenance complète |
| `unit_policy_code` | si valeur numérique | règle d'unité et conversion |
| `dataset_contract_code` | si dataset analytique | contrat applicable |

## Règles de gestion

| Règle | Statut |
|---|---|
| Une donnée `legacy_modeling` ne peut pas devenir cible ML officielle sans validation Reda/Anas. | VERIFIED |
| Une donnée `interpolated` doit garder le lien vers les observations d'origine. | TO_VALIDATE |
| Une donnée `corrected` doit référencer une décision QA ou métier. | TO_VALIDATE |
| Une donnée `expert_estimated` doit être exclue des benchmarks scientifiques par défaut. | ASSUMPTION |
| Une feature dérivée hérite du pire statut QA des sources contributrices. | ASSUMPTION |
| Toute valeur numérique exposée au Model Build ou Feature Store doit déclarer son unité canonique ou sa politique d'unité. | TO_VALIDATE |
| Une conversion d'unité doit rester traçable dans le lineage. | TO_VALIDATE |

## Classification analytique proposée

| Origine | Model Build | Feature Store | Target ML | Commentaire |
|---|---|---|---|---|
| `observed` | oui | oui | oui | référence principale |
| `modeled` | oui | oui avec flag | non par défaut | utile surrogate/benchmark |
| `legacy_modeling` | oui sandbox | oui sandbox | non | dépend Reda/Anas |
| `interpolated` | oui avec flag | oui avec flag | non par défaut | risque de biais |
| `corrected` | oui | oui | oui si décision QA | nécessite lineage |
| `imported` | staging/build | non direct | non | doit être qualifié |
| `expert_estimated` | oui avec flag | non par défaut | non | utile scénario |

## Risques

- Confondre `observed` et `modeled` invalide les métriques ML.
- Utiliser `legacy_modeling` comme vérité terrain bloque la crédibilité scientifique.
- Ne pas distinguer `corrected` et `observed` rend les audits impossibles.
- Normaliser des unités sans politique explicite peut créer des erreurs silencieuses dans SWAT/WASP/ML.
