# Rapport execution auto-validation identite spatiale

## Statut

`DRY_RUN_READY__NO_DESTRUCTIVE_ACTION`

## Synthese

Le chantier passe de la notion de "doublons spatiaux" vers un modele de site physique maitre avec objets metier lies.

Les auto-validations produisent des mappings logiques `source -> master_site_id`. Elles ne fusionnent pas physiquement les objets, ne suppriment aucune source et ne modifient aucun SHP.

## Artefacts crees

| Type | Fichier |
|---|---|
| Strategie | `docs/IDP_POLLUTION_ANALYSIS/60_spatial_auto_validation_strategy.md` |
| SQL mapping | `database/idp_pollution/25_create_site_object_mapping.sql` |
| Script EXACT_0M | `scripts/idp_pollution/auto_validate_exact_0m.py` |
| Rapport EXACT_0M | `docs/IDP_POLLUTION_ANALYSIS/61_exact_0m_auto_validation_report.md` |
| Script VERY_CLOSE_2M | `scripts/idp_pollution/auto_validate_very_close_2m.py` |
| Rapport VERY_CLOSE_2M | `docs/IDP_POLLUTION_ANALYSIS/62_very_close_2m_auto_validation_report.md` |
| Strategie DIFFERENT_OBJECT | `docs/IDP_POLLUTION_ANALYSIS/63_same_site_different_object_strategy.md` |
| Ambigus reels | `docs/IDP_POLLUTION_ANALYSIS/64_true_ambiguous_cases.md` |
| CSV ambigus | `docs/IDP_POLLUTION_ANALYSIS/true_ambiguous_cases_only.csv` |
| Vues QA/API-ready finales | `database/idp_pollution/26_create_final_spatial_identity_views.sql` |

## CSV de mapping produits

| CSV | Volume | Usage |
|---|---:|---|
| `spatial_identity_auto_validation/exact_0m_site_object_mapping_preview.csv` | 8771 | preview source -> master certain |
| `spatial_identity_auto_validation/very_close_2m_site_object_mapping_preview.csv` | 126 | preview source -> master haute confiance |
| `spatial_identity_auto_validation/same_site_different_object_mapping_preview.csv` | 5438 | preview objets metier distincts lies au meme site |

## Volumes consolides

| Famille | Volume | Decision |
|---|---:|---|
| `EXACT_0M` | 8771 | auto-valider `ACCEPT_MATCH` |
| `VERY_CLOSE_2M` | 126 | auto-valider `ACCEPT_MATCH`, confiance haute |
| `DIFFERENT_OBJECT` | 5438 | lier comme `SAME_SITE_DIFFERENT_OBJECT`, pas fusionner les roles |
| `ORPHAN` | 102 | `WAIT_SOURCE_FIX` ou `REVIEW_MAPPING` |
| Vrais ambigus CSV | 105 | revue humaine residuelle |

## Volumes restants

Le volume humain prioritaire est reduit aux cas suivants :

- 3 conflits `TO_VALIDATE` issus du dry-run complet ;
- 102 orphelins a corriger ou revoir.

Les cas exacts, tres proches et objets differents ne doivent plus etre traites comme arbitrage manuel standard.

## Controles executes

| Controle | Resultat |
|---|---|
| `python scripts/idp_pollution/auto_validate_exact_0m.py` | dry-run OK, 8771 mappings prepares |
| `python scripts/idp_pollution/auto_validate_very_close_2m.py` | dry-run OK, 126 mappings prepares |
| `python -m py_compile ...` | OK |

## Impacts architecture

- `geo.ref_site_pollution` reste le pivot spatial.
- `geo.site_object_mapping` devient la table de rattachement logique source -> site physique.
- Les objets metier restent dans leurs couches/tables source.
- Les vues QA finales preparent :
  - popup enrichie ;
  - multi-objets par site ;
  - latest values rattachees au site ;
  - navigation `site -> objets lies`.
- Les vues `qa.v_site_objects_api_ready` et `qa.v_site_object_summary_api_ready` preparent les futurs contrats API sans modifier les endpoints existants.

## Risques

| Risque | Niveau | Mitigation |
|---|---|---|
| Auto-validation trop large | Faible sur `EXACT_0M`, modere sur `VERY_CLOSE_2M` | conserver distance, source, batch, rollback logique |
| Confusion site physique / objet metier | Moyen | `SAME_SITE_DIFFERENT_OBJECT` separe explicitement les roles |
| Orphelins mal classes | Moyen | maintenir `WAIT_SOURCE_FIX` / `REVIEW_MAPPING` |
| Execution SQL prematuree | Moyen | scripts dry-run par defaut, `--execute` obligatoire |

## GO/NOGO

| Decision | Statut |
|---|---|
| GO dry-run mapping | `GO` |
| GO creation SQL DEV apres validation | `GO_CONDITIONNEL` |
| GO fusion physique | `NOGO` |
| GO PREPROD | `NOGO` tant que SQL non applique en DEV et controles QA non revus |

## Prochaine etape recommandee

1. Valider le DDL `25_create_site_object_mapping.sql` en DEV.
2. Executer les scripts avec `--execute` uniquement apres backup DEV.
3. Appliquer `26_create_final_spatial_identity_views.sql`.
4. Comparer les vues QA avec les CSV preview.
5. Brancher plus tard les APIs cartographiques sur `geo.site_object_mapping`, sans casser `/api/v1/pollution/*`.

## Garanties

- Aucun SHP modifie.
- Aucun DELETE.
- Aucun DROP.
- Aucune fusion physique.
- Aucune ecriture dans tables metier finales.
- Aucun SQL execute par cette phase.
