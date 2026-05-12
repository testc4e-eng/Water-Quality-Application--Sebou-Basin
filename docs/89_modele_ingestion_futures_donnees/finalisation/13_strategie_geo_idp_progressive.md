# Strategie GEO / IDP progressive

## Decision

Ne pas bloquer l'ingestion IDP/GEO lorsque le rattachement complet n'est pas disponible. Les donnees peuvent etre publiees avec un statut GEO explicite et une couche de points non resolus.

## 1. Types de mapping

| Cas | Action |
|---|---|
| station trouvee | mapping automatique |
| XY coherent | creation geometrie |
| ancienne reference connue | mapping legacy |
| proximite spatiale forte | proposition mapping |
| aucun rattachement | couche GEO temporaire |

## 2. Couche GEO restante

Vue/table proposee non executee :

```text
geo.points_non_resolus_idp
```

| Champ | Role |
|---|---|
| `point_id` | identifiant |
| `source_file` | fichier source |
| `source_row_id` | ligne source |
| `x` | coordonnee |
| `y` | coordonnee |
| `geom` | geometrie |
| `station_proposee` | suggestion |
| `nappe_proposee` | suggestion |
| `confidence_score` | score confiance |
| `validation_status` | statut |
| `commentaire` | audit |

## 3. Statuts GEO

| Statut | Description |
|---|---|
| `GEO_RESOLVED` | mapping confirme |
| `GEO_LEGACY_MATCH` | mapping ancien suffisamment fiable |
| `GEO_PROPOSED` | suggestion non validee |
| `GEO_UNRESOLVED` | non resolu |
| `GEO_CLIENT_VALIDATION` | validation client requise |

## 4. Regles

- ne jamais inventer un mapping GEO ;
- conserver les points meme non resolus ;
- ne jamais perdre XY ;
- publication possible meme sans rattachement complet ;
- isoler les points incertains ;
- permettre validation progressive.

## SQL propose non execute

```sql
-- PROPOSITION NON EXECUTEE
CREATE TABLE geo.points_non_resolus_idp (
    point_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_file text NOT NULL,
    source_row_id text NOT NULL,
    x double precision,
    y double precision,
    geom geometry(Point, 26191),
    station_proposee uuid,
    nappe_proposee integer,
    confidence_score numeric,
    validation_status text NOT NULL DEFAULT 'GEO_UNRESOLVED',
    commentaire text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (source_file, source_row_id)
);

CREATE INDEX idx_points_non_resolus_idp_geom
ON geo.points_non_resolus_idp USING gist (geom);
```
