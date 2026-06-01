# Rapport chargement QA identite spatiale

Date : 2026-05-19  
Mode : chargement DEV QA depuis CSV dry-run, sans fusion.

## Script

Script cree :

- `scripts/idp_pollution/load_spatial_identity_qa.py`

Caracteristiques :

- dry-run par defaut;
- `--execute` obligatoire pour ecrire;
- idempotent par `run_id` : si un run existe deja, aucune insertion n'est refaite;
- rollback logique disponible par `--rollback-run-id <run_id> --execute`;
- aucune modification de `geo.ref_site_pollution`;
- aucune suppression source.

## Run charge

| Champ | Valeur |
|---|---|
| `run_id` | `e60088e9-cf94-4e41-ae65-a5390866b4b8` |
| Source CSV | `docs/IDP_POLLUTION_ANALYSIS/spatial_identity_outputs/` |
| Candidates CSV | 14380 |
| Conflicts CSV | 14366 |
| Orphans CSV | 590 |

## Volumes charges

| Table QA | Lignes chargees |
|---|---:|
| `qa.spatial_identity_candidates` | 14380 |
| `qa.spatial_identity_conflicts` | 14366 |
| `qa.spatial_identity_orphans` | 590 |
| `qa.spatial_identity_decisions` | 0 |

## Repartition conflits

| Type | Nombre |
|---|---:|
| `DUPLICATE_EXACT` | 14239 |
| `POSSIBLE_MATCH` | 124 |
| `TO_VALIDATE` | 3 |

## Top couches en conflit

| Couche | Conflits |
|---|---:|
| `staging.raw_idp_mesures_qualite_globale_2024` | 4619 |
| `staging.raw_idp_src_pollution_marche_cadre` | 3614 |
| `staging.raw_idp_mesures_qualite_marche_cadre_2024` | 3614 |
| `infra.huilerie_inventaire_pollution` | 585 |
| `infra.huilerie` | 570 |
| `infra.rejet_domestique` | 273 |
| `infra.rejet_inventaire_pollution` | 270 |

## Orphelins principaux

| Couche | Orphelins |
|---|---:|
| `staging.raw_idp_mesures_qualite_globale_2024` | 275 |
| `infra.decharge` | 91 |
| `infra.rejet_domestique` | 89 |
| `infra.huilerie` | 42 |
| `staging.raw_idp_src_pollution_globale` | 36 |

## Rollback logique

Commande :

```powershell
python scripts/idp_pollution/load_spatial_identity_qa.py --rollback-run-id e60088e9-cf94-4e41-ae65-a5390866b4b8 --execute
```

Effet :

- `qa.spatial_identity_conflicts.arbitration_status = 'REVERTED'`;
- `qa.spatial_identity_orphans.review_status = 'REVERTED'`;
- marquage `rollback_status` dans `qa.spatial_identity_candidates.metadata`;
- aucune suppression physique.
