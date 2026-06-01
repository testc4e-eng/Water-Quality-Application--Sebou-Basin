# E1 Extraction Dry Run Report

| Champ | Valeur |
|---|---|
| Statut | EXTRACTION_OK |
| Mode | READ_ONLY / SANDBOX_ONLY / NO_MODEL_TRAINING |
| Date UTC | 2026-05-22 12:29:01 |
| Config lue | `wqss.env.txt` |
| Connexion | OK |
| Read-only | OK, `transaction_read_only=on` |
| SQL | `sandbox/ml_hydro_baseline/sql/extract_hydro_ml_baseline_v0_sandbox.sql` |
| CSV | `sandbox/ml_hydro_baseline/datasets/hydro_ml_baseline_v0_sandbox_20260522_122901.csv` |
| Lignes data | 519236 |
| SHA256 | `a1d4a95709562a3c57c143b8bb982f1e010ffabf3817f4430ad3f3b38dcce26e` |

## Constats

- Le DSN WQDSS présent dans `wqss.env.txt` est mal formé pour un mot de passe contenant `@`.
- La connexion fonctionne avec paramètres séparés et `PGPASSWORD`, après suppression des guillemets de wrapping.
- Le test lecture seule a validé :
  - `SELECT current_database(), current_user;`
  - `SELECT 1;`
  - `SHOW transaction_read_only;`
- L'extraction a été exécutée avec `PGOPTIONS=-c default_transaction_read_only=on`.

## Garanties

- Aucune écriture DB.
- Aucun DDL.
- Aucun DML.
- Aucun entraînement ML.
- Aucun secret écrit dans ce rapport.
- Le CSV généré est ignoré par Git via `.gitignore`.

## Prochaine étape

Validation utilisateur requise avant tout entraînement sandbox XGBoost/LightGBM sur ce CSV.
