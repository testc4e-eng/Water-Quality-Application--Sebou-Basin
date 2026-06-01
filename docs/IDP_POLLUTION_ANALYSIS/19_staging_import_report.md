# Rapport import staging DEV - IDP pollution

Date execution : 2026-05-18

Import realise avec `scripts/idp_pollution/import_idp_to_staging.py`.

Batch DEV : `11111111-1111-4111-8111-111111111111`.

## Controle couche pilote

| Couche | Lignes | Geom 26191 | Geom 4326 | Statut |
|---|---:|---:|---:|---|
| `staging.raw_idp_src_pollution_marche_cadre` | 3614 | 3614 | 3614 | OK |

Rollback logique disponible via `--rollback --batch-id`.

## Import complet

| Table staging | Lignes | Geom 26191 | Geom 4326 | Remarque |
|---|---:|---:|---:|---|
| `staging.raw_idp_src_pollution_marche_cadre` | 3614 | 3614 | 3614 | OK |
| `staging.raw_idp_src_pollution_globale` | 243 | 207 | 207 | 36 lignes sans geometrie source |
| `staging.raw_idp_mesures_qualite_marche_cadre_2024` | 3614 | 3614 | 3614 | OK |
| `staging.raw_idp_mesures_qualite_globale_2024` | 4894 | 4619 | 4619 | 275 lignes sans geometrie source |

## Points techniques

- Les SHP sources n'ont pas ete modifies.
- Le GDAL local ne dispose pas du driver PostgreSQL ; le script utilise donc le fallback controle `ogr2ogr CSV stdout` puis insertion PostGIS via `psycopg2`.
- Les colonnes source sont conservees avec noms SQL nettoyes ; les metadonnees `source_layer`, `source_file`, `source_feature_id`, `import_batch_id`, `imported_at`, `geom_original`, `geom_4326` sont ajoutees.
- Index crees par table : batch, source feature, GiST `geom_original`, GiST `geom_4326`.
