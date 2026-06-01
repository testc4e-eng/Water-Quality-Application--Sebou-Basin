# Canonical Reference Specification

| Champ | Valeur |
|---|---|
| Statut | PREPARATION_ONLY |
| Type | specification |
| Périmètre | référentiels canoniques analytiques |
| Source de vérité | Non |
| Documents liés | `01_data_governance_foundation.md`, `04_data_origin_policy.md` |
| Dernière mise à jour | 2026-05-20 |

## Contexte

| Statut | Constat |
|---|---|
| VERIFIED | `metadata.referentiel_parametre_canonique` existe et contient déjà le référentiel paramètre métier. |
| VERIFIED | `infra.stations_mesure`, `infra.stations`, `infra.barrages`, `geo.ref_site_pollution`, `geo.sous_bassin_*`, `geo_work.reseau_hydro_edges_final` existent. |
| VERIFIED | Les conflits spatiaux IDP et pollution ne sont pas arbitrés définitivement. |
| TO_VALIDATE | Les mappings `station_id` / `reach_id` / `subbasin_uid` / `swat_rch_number` / `wasp_segment_id` restent à valider. |

## Objectif

Créer une spécification de référence canonique sans modifier les tables existantes.

La référence canonique cible doit permettre de relier :

- stations ;
- barrages ;
- sites pollution ;
- points de prélèvement ;
- bassins et sous-bassins ;
- reaches / tronçons ;
- segments WASP ;
- sous-bassins ou HRU SWAT ;
- paramètres métier et variables modèles.

## Table candidate : `metadata.canonical_entity_registry`

DDL conceptuel non appliqué :

```sql
-- NON EXECUTE - SPECIFICATION ONLY
CREATE TABLE metadata.canonical_entity_registry (
    canonical_entity_id uuid PRIMARY KEY,
    entity_type text NOT NULL,
    canonical_code text NOT NULL,
    canonical_name text,
    source_schema text NOT NULL,
    source_table text NOT NULL,
    source_pk text NOT NULL,
    geometry_status text NOT NULL,
    qa_status text NOT NULL,
    confidence_score numeric,
    validation_status text NOT NULL,
    validated_by text,
    validated_at timestamptz,
    lineage_id uuid,
    valid_from timestamptz,
    valid_to timestamptz,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (entity_type, canonical_code)
);
```

## Types d'entités proposés

| `entity_type` | Source candidate | Statut | Dépendance |
|---|---|---|---|
| `STATION_MESURE` | `infra.stations_mesure` | VERIFIED | QA station hors bassin |
| `STATION_LEGACY` | `infra.stations` | VERIFIED | mapping vers `stations_mesure` |
| `BARRAGE` | `infra.barrages` | VERIFIED | QA géométrie |
| `SITE_POLLUTION` | `geo.ref_site_pollution` | VERIFIED | validation spatiale |
| `POINT_PRELEVEMENT_IDP` | `qualite.resultat_mesure`, staging IDP | TO_VALIDATE | validation spatiale |
| `BASSIN` | `geo.bassin_versant` | VERIFIED | aucune |
| `SOUS_BASSIN_ABH` | `geo.sous_bassin_abh` | VERIFIED | aucune |
| `SOUS_BASSIN_SWAT` | `geo.sous_bassin_swat_*`, `swat_output.ref_subbasin` | TO_VALIDATE | dépend Reda |
| `REACH` | `geo.reseau_hydrographique`, `geo_work.reseau_hydro_edges_final` | TO_VALIDATE | validation hydraulique/spatiale |
| `WASP_SEGMENT` | `wasp_output.ref_segment_modele` | TO_VALIDATE | dépend Anas |

## Table candidate : `metadata.canonical_model_variable_registry`

```sql
-- NON EXECUTE - SPECIFICATION ONLY
CREATE TABLE metadata.canonical_model_variable_registry (
    variable_ref_id uuid PRIMARY KEY,
    model_family text NOT NULL,
    source_code text NOT NULL,
    canonical_code text,
    display_name text NOT NULL,
    unit_source text,
    unit_canonical text,
    parameter_ref_id uuid,
    variable_role text NOT NULL,
    qa_status text NOT NULL,
    validation_status text NOT NULL,
    validated_by text,
    validated_at timestamptz,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (model_family, source_code)
);
```

## Contraintes conceptuelles

| Contrainte | Statut |
|---|---|
| `entity_type + canonical_code` doit être unique | ASSUMPTION |
| une entité `VALIDATED` doit avoir une source et un statut géométrique explicite | TO_VALIDATE |
| une variable modèle doit déclarer `model_family` : `SWAT`, `SWAT_PLUS`, `WASP`, `HEC`, `OBSERVED` | TO_VALIDATE |
| les variables SWAT/WASP legacy doivent rester marquées `LEGACY` | VERIFIED |

## Exemple de registre non définitif

| Entité | Exemple | Statut |
|---|---|---|
| station | `STATION_MESURE:<code_station>` | ASSUMPTION |
| reach | `REACH:<edge_id>` | TO_VALIDATE - dépend validation spatiale |
| sous-bassin SWAT | `SWAT_SUBBASIN:<bassin_code>:<subbasin_local_id>` | TO_VALIDATE - dépend Reda |
| segment WASP | `WASP_SEGMENT:<bassin_code>:<segment_local_id>` | TO_VALIDATE - dépend Anas |

## Risques

- Ne pas utiliser `geo_work.reseau_hydro_edges_final` comme reach hydraulique validé tant que la direction n'est pas validée.
- Ne pas confondre `geo.reseau_hydrographique` source brute et `geo_work` runtime topologique.
- Ne pas promouvoir les sites IDP/pollution conflictuels en référence canonique finale avant arbitrage SIG/QA.

