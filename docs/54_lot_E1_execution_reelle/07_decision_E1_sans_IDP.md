# Decision E1 sans IDP

## Statut

**E1_READY_FOR_EXECUTION**

## Conditions verifiees

- les 4 tables `IDP 2024` sont totalement exclues du scope `E1`
- le volume `E1` final sans `IDP` est recalculé a `3317540`
- le rollback est documente
- les scripts SQL restent entierement commentes
- aucune execution DB finale n'a ete lancee

## Tables finales concernees

- `geo.nappe / infra.point_eau selon table cible`
- `hydro.barrage_bathymetrie`
- `hydro.mesure_barrage`
- `hydro.mesure_debit`
- `hydro.mesure_debit_mensuel`
- `hydro.mesure_debit_source`
- `infra.decharge (si lot referentiel active)`
- `infra.huilerie (si lot referentiel active)`
- `infra.point_eau (si lot referentiel active)`
- `infra.rejet_domestique (si lot referentiel active)`
- `infra.step (si lot referentiel active)`
- `meteo.mesure_evaporation`
- `meteo.mesure_precipitation`
- `meteo.mesure_precipitation_annuelle_max`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_sebou`
- `qualite.suivi_qualite_barrage_garde_hebdo`

## Point d'attention

Le lot `IDP-GEO` doit etre traite separement avant toute decision de reinjection
eventuelle dans des tables metier.
