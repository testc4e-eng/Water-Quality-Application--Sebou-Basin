# Rapport post-DDL DEV identite spatiale

Date : 2026-05-19  
Base : DEV `abh_sad` via configuration backend.  
Statut : `DDL_DEV_APPLIQUE__AUCUNE_FUSION`.

## Scripts executes

| Script | Statut |
|---|---|
| `database/idp_pollution/20_create_ref_site_pollution_master.sql` | OK |
| `database/idp_pollution/21_create_spatial_identity_qa.sql` | OK |

Backup schema pre-DDL :

- `docs/IDP_POLLUTION_ANALYSIS/ddl_backups/pre_spatial_identity_ddl_geo_qa_schema_20260519_175957.sql`

## Objets verifies

| Objet | Lignes | Colonnes | Statut |
|---|---:|---:|---|
| `geo.ref_site_pollution` | 1951 | 26 | conserve, enrichi par colonnes gouvernance |
| `geo.ref_site_pollution_source_link` | 0 | 19 | cree |
| `geo.ref_site_pollution_merge_history` | 0 | 19 | cree |
| `qa.spatial_identity_candidates` | 0 avant chargement | 25 | cree |
| `qa.spatial_identity_conflicts` | 0 avant chargement | 21 | cree |
| `qa.spatial_identity_decisions` | 0 | 18 | cree |
| `qa.spatial_identity_orphans` | 0 avant chargement | 18 | cree |

Index observes apres DDL :

| Famille | Nombre index |
|---|---:|
| `geo.ref_site_pollution` | 14 |
| `geo.ref_site_pollution_source_link` | 5 |
| `geo.ref_site_pollution_merge_history` | 1 |
| `qa.spatial_identity_candidates` | 5 |
| `qa.spatial_identity_conflicts` | 5 |
| `qa.spatial_identity_decisions` | 3 |
| `qa.spatial_identity_orphans` | 4 |

## Garanties respectees

- Aucun SHP modifie.
- Aucun site supprime, archive ou fusionne.
- Aucune decision metier chargee automatiquement.
- Les endpoints `/api/v1/pollution/*` ne sont pas modifies.
- `geo.ref_site_pollution` conserve ses 1951 lignes.

## Remarque

Le DDL ajoute une structure de gouvernance et de lineage. Il ne resout aucun doublon par lui-meme.
