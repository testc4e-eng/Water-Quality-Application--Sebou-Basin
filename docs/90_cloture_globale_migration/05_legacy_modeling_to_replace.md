# Legacy modeling to replace

## Decision

`SWAT_WASP_LEGACY_MODELING_TO_REPLACE`

Les donnees SWAT/WASP actuelles sont temporaires. Elles restent consultables mais ne constituent pas le referentiel final de modelisation.

## Tables concernees

| Schema | Table | Volume | Decision |
|---|---|---:|---|
| `swat_output` | `mesure_qualite_subbasin_ts` | 745110 | `LEGACY_MODELING_TO_REPLACE` |
| `swat_output` | `stg_swat_qualite_long` | 745110 | `LEGACY_MODELING_TO_REPLACE` |
| `swat_output` | `ref_run_modele` | 1 | `LEGACY_MODELING_TO_REPLACE` |
| `swat_output` | `ref_scenario` | 1 | `LEGACY_MODELING_TO_REPLACE` |
| `wasp_output` | `mesure_qualite_segment_ts` | 931770 | `LEGACY_MODELING_TO_REPLACE` |
| `wasp_output` | `stg_wasp_qualite_long` | 931770 | `LEGACY_MODELING_TO_REPLACE` |
| `wasp_output` | `ref_run_modele` | 1 | `LEGACY_MODELING_TO_REPLACE` |
| `wasp_sebou` | `wasp_results` | 931770 | `LEGACY_MODELING_TO_REPLACE` |
| `wasp_sebou` | `wasp_scenarios` | 1 | `LEGACY_MODELING_TO_REPLACE` |
| `wasp_sebou` | `wasp_variables` | 12 | `LEGACY_MODELING_TO_REPLACE` |

## Constats

| Controle | Resultat |
|---|---:|
| scenarios SWAT output | 1 (`normal`) |
| scenarios WASP output | 1 (`normal`) |
| scenarios SWAT Sebou | 1 (`result_SWATOutput`) |
| scenarios WASP Sebou | 1 (`Baseline_Innaouen`) |
| doublons `wasp_sebou.wasp_results` | 1020 groupes |
| doublons `wasp_output.mesure_qualite_segment_ts` | 0 groupe |

## Regles

- ne pas dedoublonner maintenant ;
- ne pas supprimer maintenant ;
- ne pas utiliser comme conclusion contractuelle finale de modelisation ;
- remplacer via le futur module ingestion avec audit et rollback.
