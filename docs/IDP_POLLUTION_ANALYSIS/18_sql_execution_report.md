# Rapport execution SQL DEV - IDP pollution

Date execution : 2026-05-18

## Scripts executes

| Script | Statut | Resultat |
|---|---|---|
| `10_create_ref_site_pollution.sql` | OK | table canonique `geo.ref_site_pollution`, FK, index GiST et triggers disponibles |
| `12_create_resultat_mesure.sql` | OK | table longue `qualite.resultat_mesure` creee/validee |
| `14_create_api_views.sql` | OK | vues `api.v_pollution_sites`, `api.v_pollution_latest_results`, `api.v_pollution_by_parameter`, `api.v_pollution_timeseries` disponibles |
| `15_create_qa_views.sql` | OK apres correction | vues QA operationnelles sans dependance prematuree a `geo.v_idp_spatial_sources` |
| `16_load_ref_site_pollution_dev.sql` | OK | chargement DEV canonique et rattachement site/mesure |

## Corrections appliquees

- `15_create_qa_views.sql` : suppression de la dependance bloquante a la vue de consolidation avant creation.
- `16_load_ref_site_pollution_dev.sql` : remplacement du `ON CONFLICT` cible sur index partiel par une insertion idempotente `NOT EXISTS` puis `UPDATE`.

## Resultats SQL

| Objet | Volume |
|---|---:|
| `geo.ref_site_pollution` | 1951 sites |
| `qualite.resultat_mesure` | 1409 resultats P0 charges |
| `api.v_pollution_sites` | 1951 sites exposables |
| `api.v_pollution_latest_results` | 517 derniers resultats exposables |

Logs : `docs/IDP_POLLUTION_ANALYSIS/execution_logs/`.
