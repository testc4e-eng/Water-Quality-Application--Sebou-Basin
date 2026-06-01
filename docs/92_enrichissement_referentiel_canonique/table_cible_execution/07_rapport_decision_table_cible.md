# Rapport decisionnel - `table_cible`

## Synthese

| Classe | Volume |
|---|---:|
| Affectes a vues qualite | 57 |
| Affectes a vues meteo | 5 |
| Affectes a vues hydro | 1 |
| Affectes a IDP/pollution | 0 |
| Restants hors restitution | 0 |
| Client required | 2 |
| Legacy ignore | 0 |

## Lecture

- Le referentiel ne necessite pas `65` nouvelles tables.
- Les `63` affectations utiles doivent pointer vers `3` vues logiques principales :
  - `api.v_qualite_dashboard`
  - `api.v_meteo_dashboard`
  - `api.v_barrage_dashboard`
- Les vues `api.v_idp_points` et `api.v_pollution_dashboard` restent pertinentes pour l'architecture globale, mais ne portent pas directement les `65` parametres audites.
- `FM` et `F_M_MES` restent exclus de la restitution fiable.
- `MD` reste `CLIENT_REQUIRED`, hors lot courant des `65`.

## Decision recommandee

- `GO` pour la mise a jour `table_cible` apres validation humaine du script propose.
- `HOLD` pour la creation reelle des vues/API jusqu'a revue technique du SQL et de la semantique frontend.
- `CLIENT_REQUIRED` uniquement pour `FM`, `F_M_MES`, et maintien documentaire de `MD`.
