# Quarantaine et erreurs

## Principe

Une ligne ambigue ou invalide ne doit pas etre perdue ni forcee. Elle entre en quarantaine avec la cause exacte.

## Table logique

| Champ | Role |
|---|---|
| `batch_id` | lot |
| `source_file` | fichier |
| `source_row_id` | ligne source |
| `source_row_hash` | hash stable |
| `error_code` | code erreur |
| `severity` | `BLOCKING`, `WARNING`, `INFO` |
| `raw_payload` | donnees source |
| `proposed_fix` | correction proposee |
| `decision_status` | statut arbitrage |

## Codes erreur minimum

| Code | Description |
|---|---|
| `PARAM_UNKNOWN` | parametre absent referentiel |
| `PARAM_AMBIGUOUS` | plusieurs candidats |
| `UNIT_INCONSISTENT` | unite incompatible |
| `GEO_UNRESOLVED` | support GEO absent |
| `VALUE_NON_NUMERIC` | valeur non numerique |
| `DUPLICATE_BUSINESS_KEY` | doublon metier |
| `SCENARIO_UNKNOWN` | scenario non reference |
