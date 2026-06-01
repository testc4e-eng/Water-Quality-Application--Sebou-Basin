# Rapport vues de revue metier identite spatiale

Date : 2026-05-19  
Statut : vues QA creees en DEV.

## Script execute

- `database/idp_pollution/22_create_spatial_identity_review_views.sql`

## Vues creees

| Vue | Role | Lignes |
|---|---|---:|
| `qa.v_spatial_review_step_stm` | lot STEP/STM | 106 |
| `qa.v_spatial_review_rejets` | lot rejets | 543 |
| `qa.v_spatial_review_huileries` | lot huileries | 1155 |
| `qa.v_spatial_review_mines_decharges` | lot mines/decharges | 348 |
| `qa.v_spatial_review_idp_inventory_measurements` | lot IDP inventaire/mesures | 12054 |
| `qa.v_spatial_review_orphans` | sources sans master candidat | 590 |

## Colonnes exposees

- `run_id`
- `review_id`
- `candidate_id`
- `source_layer`
- `source_id`
- `master_site_id`
- `distance_m`
- `score`
- `conflict_type`
- `source_name`
- `master_site_name`
- `commune_source`
- `commune_master`
- `source_type_source`
- `source_type_master`
- `recommended_decision`
- `review_priority`
- `review_status`
- `reason`

## Usage

Ces vues servent uniquement a la revue metier. Elles ne modifient pas les sources, ne creent pas de `master_site_id` definitif et ne valident aucune fusion.
