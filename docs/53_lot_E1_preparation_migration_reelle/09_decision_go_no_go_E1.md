# Decision go / no-go E1

## Statut

**E1_READY_FOR_EXECUTION**

## Conditions verifiees

- toutes les lignes `E1` proviennent de `qa_dry_run.e0_mesures_preparees`
- toutes les lignes `E1` ont un rattachement geo unique (`GEO_SCOPE_VALIDATED`, `GEO_FORCED_MAPPING_METIER` ou `GEO_MATCH_XY_2M`)
- aucune ligne sans `X/Y` n'entre dans `E1`
- aucune ligne IDP ambiguë n'entre dans `E1`
- aucune ligne IDP orpheline n'entre dans `E1`
- aucune ligne de `qa_dry_run.e0_mesures_quarantaine` n'entre dans `E1`
- le rollback `E1` est documente
- les scripts SQL restent entierement commentes

## Chiffres clefs

- volume prepare `E0` : `3318316`
- volume eligible `E1` : `3318316`
- volume exclu sans `X/Y` : `311`
- volume IDP ambigu backlog : `3790`
- volume IDP orphelin : `3982`
- volume quarantaine `E0` : `399727`
- delta attendu : `0`

## Tables finales concernees

- `geo.nappe / infra.point_eau selon table cible`
- `hydro.barrage_bathymetrie`
- `hydro.mesure_barrage`
- `hydro.mesure_debit`
- `hydro.mesure_debit_mensuel`
- `hydro.mesure_debit_source`
- `infra.decharge (si lot referentiel active)`
- `infra.point_eau (si lot referentiel active)`
- `infra.rejet_domestique (si lot referentiel active)`
- `infra.step (si lot referentiel active)`
- `meteo.mesure_evaporation`
- `meteo.mesure_precipitation`
- `meteo.mesure_precipitation_annuelle_max`
- `qualite.mesure_qualite_* a router par type d'entite`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_sebou`
- `qualite.suivi_qualite_barrage_garde_hebdo`

## Tables finales non concernees

- `meteo.mesure_temperature`
- `qualite.source_pollution_prelevement`
- `qualite.source_pollution_mesure_param`
- `qualite.source_pollution_prelevement_lien`
- `infra.*`
- `metadata.*`
