# Resultats EXPLAIN / performance

| Vue | Test EXPLAIN | Risque | Recommandation |
|---|---|---|---|
| `api.v_meteo_precipitation` | filtre `date_mesure >= 2020-01-01` | `MEDIUM` : scans par chunks Timescale, volumetrie 546k | imposer filtre date/station cote API ; envisager materialisation dashboard |
| `api.v_qualite_metaux` | filtre `code_parametre='FE'` et `date_mesure >= 2020-01-01` | `MEDIUM` : append multi-support, mix index scans et seq scans sur petits chunks | acceptable V1 avec filtres ; surveiller cout si dashboard global |
| `api.v_idp_points_non_resolus` | `LIMIT 10` | `LOW` : table 141 lignes, seq scan acceptable | OK V1 |

## Observations

- Les index `(parametre_qualite, temps desc)` sont exploites sur plusieurs chunks qualite.
- Certains petits chunks sont scannes sequentiellement ; ce n'est pas bloquant vu leur faible taille.
- Les vues meteo precipitation et qualite multi-supports ne doivent pas etre consommees sans filtre temporel.
- Les dashboards globaux devront utiliser pagination, filtres ou materialized views si usage intensif.

## Decision performance

Performance acceptable pour V1 sous reserve de contrats API imposant filtres `date_mesure`, `support_id` et/ou `code_parametre`.
