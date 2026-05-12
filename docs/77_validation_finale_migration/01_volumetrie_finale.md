# Volumetrie finale

## Context

Les volumes ci-dessous proviennent de l'etat observe de `abh_sad` au moment de la consolidation.

## Analysis

Volumetries clefs :

- `hydro.mesure_debit` : `652 446`
- `hydro.mesure_debit_mensuel` : `19 316`
- `hydro.mesure_debit_source` : `3 978`
- `hydro.mesure_barrage` : `84 831`
- `meteo.mesure_precipitation` : `546 007`
- `meteo.mesure_evaporation` : `48 900`
- `qualite.mesure_qualite_riviere` : `59 534`
- `qualite.mesure_qualite_nappe` : `63 047`
- `qualite.mesure_qualite_barrage` : `7 820`
- `qualite.mesure_qualite_sebou` : `49 954`
- `qualite.suivi_qualite_barrage_garde_hebdo` : `1 780`
- `qualite.source_pollution_mesure_param` : `7 191`
- `swat_output.mesure_qualite_subbasin_ts` : `745 110`
- `wasp_output.mesure_qualite_segment_ts` : `931 770`

Volumetrie cible future barrage :

- source brute : `85 166`
- source dedupee : `84 832`
- normalized future : `272 655`
- ecart structurel vs cible actuelle : `+187 824`

## Solution

Lecture :

- le noyau hydro, meteo precipitation et modeles est volumetriquement exploitable
- la qualite reste partiellement migree mais pas referentiellement closee
- le flux barrage n'est pas finalisable dans son schema actuel
