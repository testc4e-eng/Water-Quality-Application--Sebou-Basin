# Lot B — Vidage SWAT/WASP

## Objectif
Archiver puis vider les anciennes données SWAT/WASP présentes dans `abh_sad`, tout en conservant les structures utiles. Les nouvelles données modèles seront réimportées plus tard après arbitrage.

## Schémas concernés
- `swat_output`
- `swat_sebou`
- `wasp_output`
- `wasp_sebou`
- `modeles`

## Tables concernées

| Table | Volume | Action proposée | Justification | Validation |
|---|---|---|---|---|
| `modeles.resultat_swat` | 0 | conserver structure, vérifier vide, inclure dans plan de reconstruction | Nouvelles données modèles à réimporter plus tard | PENDING |
| `modeles.resultat_wasp` | 0 | conserver structure, vérifier vide, inclure dans plan de reconstruction | Nouvelles données modèles à réimporter plus tard | PENDING |
| `modeles.scenario_simulation` | 0 | conserver structure, vérifier vide, inclure dans plan de reconstruction | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.mesure_qualite_subbasin_ts` | 745110 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.ref_bassin` | 1 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.ref_parametre_qualite` | 5 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.ref_run_modele` | 1 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.ref_scenario` | 1 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.ref_subbasin` | 18 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.stg_swat_qualite_long` | 745110 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_output.stg_swat_qualite_meta` | 123 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_sebou.swat_models` | 0 | conserver structure, vérifier vide, inclure dans plan de reconstruction | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_sebou.swat_reach_results` | 0 | conserver structure, vérifier vide, inclure dans plan de reconstruction | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_sebou.swat_scenarios` | 1 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `swat_sebou.swat_subbasin_results` | 0 | conserver structure, vérifier vide, inclure dans plan de reconstruction | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_output.mesure_qualite_segment_ts` | 931770 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_output.ref_parametre_qualite` | 12 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_output.ref_run_modele` | 1 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_output.ref_segment_modele` | 22 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_output.stg_wasp_qualite_long` | 931770 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_sebou.wasp_results` | 931770 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_sebou.wasp_scenarios` | 1 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |
| `wasp_sebou.wasp_variables` | 12 | backup puis vidage proposé | Nouvelles données modèles à réimporter plus tard | PENDING |

## Conditions de validation

- Backup complet `abh_sad` disponible.
- Export CSV des tables modèles non vides disponible.
- Confirmation métier que les anciennes sorties modèles ne font plus foi.
- Confirmation technique du futur mode de réimport SWAT/WASP.
