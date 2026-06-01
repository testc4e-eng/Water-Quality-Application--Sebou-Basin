# Tests backend P0

## Tests executes

| Test | Resultat |
|---|---|
| Compilation Python des fichiers P0 | `OK` |
| `pytest tests/test_qualite_specialized_api.py -q` depuis `backend/` | `4 passed in 172.02s` |
| OpenAPI du router P0 isole | `OK` |
| Endpoint `/api/v1/qualite/metaux` | `200 success` |
| Endpoint `/api/v1/qualite/chimie-minerale` | `200 success` |
| Endpoint `/api/v1/qualite/physicochimie` | `200 success` |
| Endpoint `/api/v1/qualite/pollution-organique` | `200 success` |
| Pagination `limit=2&offset=2` | `OK` |
| Filtre date | `OK` |
| Filtre `code_parametre` | `OK` |
| Exclusion `FM` | `OK` |
| Exclusion `F_M_MES` | `OK` |
| Exclusion `MO_METAL` | `OK` |
| Distinction `MO` / `Mo` | `OK` |

## Counts obtenus

| Endpoint | Vue source | Count |
|---|---|---:|
| `/api/v1/qualite/metaux` | `api.v_qualite_metaux` | 8565 |
| `/api/v1/qualite/chimie-minerale` | `api.v_qualite_chimie_minerale` | 40933 |
| `/api/v1/qualite/physicochimie` | `api.v_qualite_physicochimie` | 9806 |
| `/api/v1/qualite/pollution-organique` | `api.v_qualite_pollution_organique` | 11481 |

## Tests metier

| Controle | Resultat |
|---|---:|
| `Mo` dans `/qualite/metaux` | 11 |
| `MO` dans `/qualite/metaux` | 0 |
| `MO` dans `/qualite/pollution-organique` | 2656 |
| `Mo` dans `/qualite/pollution-organique` | 0 |
| Codes exclus dans les 4 vues P0 | 0 |

## Ancienne limite de validation resolue

Le chargement complet de `app.main` declenchait un crash natif au moment de l'import de modules scientifiques (`swat_analysis` puis ingestion via `pandas/numpy`).

Resolution :

- `swat_analysis` ne charge plus `numpy` au top-level.
- `SWAT analysis` et `Ingestion API` sont optionnels et desactives par defaut.
- `app.main`, `/health`, `/docs` et `/openapi.json` sont maintenant valides.

Validation finale :

- `python -m pytest tests/test_qualite_specialized_api.py tests/test_runtime_optional_swat.py -q`
- Resultat : `6 passed in 178.07s`
