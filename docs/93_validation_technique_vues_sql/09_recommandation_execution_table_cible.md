# Recommandation execution `table_cible`

## Decision par action

| Action | Decision | Justification |
|---|---|---|
| `CREATE VIEW` reel | `DONE` | 19 vues creees et controlees le 2026-05-13 |
| `UPDATE table_cible` | `DONE` | 63 parametres affectes aux vues specialisees le 2026-05-13 |
| APIs FastAPI | `HOLD` | Implementation endpoints non lancee |
| ingestion V1 | `GO_CONCEPTION` | Les besoins QA/GEO/quarantaine sont clarifies |
| materialisation future | `GO_CONCEPTION` | Necessaire probable pour precipitation et qualite dashboard global |

## Vues techniquement faisables

- `api.v_meteo_temperature`
- `api.v_meteo_precipitation`
- `api.v_meteo_evaporation`
- `api.v_barrage_parametres`
- `api.v_barrage_qualite`
- vues qualite specialisees par famille, sous reserve de generation SQL complete
- `api.v_pollution_constat_prealable`
- `api.v_pollution_analyses_finales`
- `api.v_idp_points`
- `api.v_idp_points_non_resolus`

## Vues a risque

| Vue | Risque |
|---|---|
| vues qualite multi-supports | unions repetitives, performance si non filtrees |
| `api.v_qualite_chimie_minerale` | familles avec unites differentes (`mg/L`, `meq/L`) |
| `api.v_qualite_biologique` | indices et concentrations dans meme vue |
| `api.v_meteo_precipitation` | volumetrie elevee |
| `api.v_idp_points_non_resolus` | future table dediee non creee |

## Recommendation finale mise a jour

| Etape | Decision |
|---|---|
| Finaliser SQL complet de toutes les vues specialisees | `DONE` |
| Tester chaque vue en transaction / environnement non destructif | `DONE` |
| Creer vues physiques | `DONE` |
| Executer `UPDATE table_cible` | `DONE` |
| Coder les endpoints FastAPI | `HOLD_VALIDATION_API` |
| Adapter frontend | `HOLD_VALIDATION_FRONTEND` |

## Statut global

`TABLE_CIBLE_REFERENTIEL_SPECIALISEES_APPLIQUEES`

## Controle post-update du 2026-05-13

| Controle | Resultat |
|---|---:|
| Parametres mis a jour | 63 |
| Backup logique | `audit.bkp_ref_table_cible_final_metier_20260513` |
| Lignes backup | 65 |
| Parametres actifs restants sans `table_cible` | 2 |
| `FM` sans `table_cible` | 1 |
| `F_M_MES` sans `table_cible` | 1 |
| Parametres affectes vers vue inexistante | 0 |
| Cible primaire `api.v_qualite_dashboard_global` | 0 |
| Unites modifiees | 0 |
| Alias modifies | 0 |

API FastAPI = `HOLD`, Frontend = `HOLD`, Ingestion V1 = `GO_CONCEPTION`.
