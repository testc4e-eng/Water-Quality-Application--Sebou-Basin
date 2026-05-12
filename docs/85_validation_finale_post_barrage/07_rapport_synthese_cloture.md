# Rapport synthese cloture

## Synthese

La migration complete vers `abh_sad` est cloturable avec backlog. Le blocage principal barrage est leve : le modele multi-colonnes legacy est remplace cote API/dashboard par `hydro.mesure_barrage_param`, et `APPORTS_HM3` est harmonise en `APPORT` sans conversion numerique.

## Production-ready

- `hydro.mesure_barrage_param`
- vues API barrage parametriques
- `analytics.mv_dashboard_hydrologie_menu`
- precipitation, debit mensuel, SWAT subbasin TS
- dimensions API station/barrage utilisees par les controles

## Exploitable dashboard

- hydrologie barrage : `NIVEAU_EAU`, `VOLUME`, `LACHER`, `APPORT`, `TRANSFERT`
- hydrologie debit avec QA flags
- meteo precipitation
- dashboards analytics climat/hydro/pollution

## Exploitable IA/LLM

Les couches sont exploitables pour analyse assistee si les prompts tiennent compte du backlog :

- `APPORT`, `LACHER`, `TRANSFERT` sont des volumes journaliers en `Mm3/j`
- ne pas traiter `LACHER` comme debit
- ne pas conclure sur les parametres qualite non rattaches sans filtrer `parametre_ref_id`
- documenter les doublons WASP avant analyses de comparaison fine

## Encore legacy ou backlog

- `hydro.mesure_barrage` : legacy lecture seule
- `public.*` historiques : legacy ignore
- `staging.*` : audit/reprise uniquement
- referentiel qualite incomplet
- mappings IDP/GEO client
- scenarios modeles encore minimaux

## Decision finale

`FINAL_GO_AVEC_BACKLOG`

