# Controles d'integrite

## Context

Les controles prioritaires portent sur les nulls critiques, les doublons metier, l'integrite geo et l'integrite referentielle.

## Analysis

Constats verifies :

- `hydro.mesure_barrage`
  - doublons `(barrage_id, temps)` : `0`
  - `lacher_m3s` non alimente : `0` lignes utiles
  - source dedupee future sans doublon `(barrage_id, date_jr, parametre_code)` : `0`
  - incoherence metier active : `lacher_m3s` reste encore la representation legacy a supprimer
- `staging.raw_mesures_niv_eau_barrages`
  - doublons source : `334`
  - lignes `date_jr IS NULL` : `92`
  - 1 cle dedupee restante sans temps
- `qualite.mesure_qualite_riviere`
  - `parametre_ref_id IS NULL` : `17 287`
  - doublons metier : `1 995`
- `qualite.mesure_qualite_nappe`
  - `parametre_ref_id IS NULL` : `13 270`
  - doublons metier : `2 657`
- `qualite.mesure_qualite_sebou`
  - `parametre_ref_id IS NULL` : `31 277`
  - doublons metier : `4 553`
- `qualite.suivi_qualite_barrage_garde_hebdo`
  - `parametre_ref_id IS NULL` : `539`
  - doublons metier : `93`
- `meteo.mesure_evaporation`
  - nulls critiques observes : `10 308`
- `metadata.referentiel_parametre`
  - collision canonique active : `DEBIT`

## Solution

Statut synthese :

- `BLOQUANT`
  - barrage parametrique non deploie
  - referentiel final non consolide
  - controles `parametre <-> unite` non deployes dans la couche finale
- `BACKLOG`
  - qualite parametre_ref
  - evaporation nulls
- `INFO`
  - modeles SWAT/WASP structurellement coherents
