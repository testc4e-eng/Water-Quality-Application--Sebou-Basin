# Stratégie de validation hydraulique

## Objectif
Transformer le routage actuel topologique en fondation hydraulique validée, sans modifier le réseau source et sans inversion automatique.

## Principe
Pour chaque segment runtime :
1. Transformer le début et la fin du segment vers le CRS du MNT (`EPSG:32630`).
2. Echantillonner `z_start` et `z_end` dans le MNT principal `seboureproj`.
3. Calculer `dz = z_start - z_end`.
4. Calculer `slope = dz / length_m`.
5. Attribuer un statut QA sans modifier la géométrie ni les champs source.

## Table QA cible proposée
```sql
-- PROPOSITION UNIQUEMENT - NE PAS EXECUTER SANS REVUE
CREATE TABLE qa.hydraulic_direction_validation (
    validation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    edge_id bigint NOT NULL,
    geom geometry(LineString, 26191),
    source_node bigint,
    target_node bigint,
    z_start double precision,
    z_end double precision,
    slope double precision,
    direction_runtime text NOT NULL DEFAULT 'SOURCE_TO_TARGET',
    direction_mnt text,
    direction_status text NOT NULL,
    confidence text NOT NULL,
    qa_comment text,
    mnt_source text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hydraulic_direction_validation_geom
ON qa.hydraulic_direction_validation USING gist (geom);

CREATE INDEX IF NOT EXISTS idx_hydraulic_direction_validation_status
ON qa.hydraulic_direction_validation (direction_status);
```

## Sortie attendue
La QA doit produire une couche cartographique de revue : segments confirmés, inversions suspectées, segments plats, segments NoData et segments à revue manuelle.

## Interdiction
Aucune inversion de `source`/`target`, aucune réécriture de géométrie, aucune correction de réseau ne doit être appliquée pendant cette phase.
