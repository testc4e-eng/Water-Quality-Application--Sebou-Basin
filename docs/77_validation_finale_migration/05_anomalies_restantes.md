# Anomalies restantes

## BLOQUANT

- `hydro.mesure_barrage` ne supporte pas le modele 1 parametre = 1 ligne.
- les dashboards/API legacy barrage n'ont pas encore purge `lacher_m3s`.

## BACKLOG

- `metadata.referentiel_parametre` historique conserve une collision `DEBIT`, mais le referentiel canonique final l'a neutralisee.
- `APPORTS_HM3` et `TRANSFERT` sont actifs dans `metadata.referentiel_parametre_canonique`, mais pas encore servis par la couche barrage parametrique.
- 1 cle barrage dedupee sans date.
- tables qualite avec `parametre_ref_id` manquants et doublons metier.
- `meteo.mesure_evaporation` avec nulls critiques.
- frontend/backend encore relies a des colonnes legacy pont (`cote_m`, `volume_mm3`) tant que `hydro.mesure_barrage_param` n'est pas deployee.

## INFO

- les flux SWAT/WASP sont deja structures par parametre et scenario.
- le mapping barrage est suffisant pour le flux actif de mesures barrage.
- la regle metier officielle est maintenant figee :
  - `LACHER`, `APPORTS_HM3`, `TRANSFERT` = `Mm3/j`

## LEGACY_IGNORE

- objets `public.*` non references comme production dans la cloture
- `hydro.mesure_barrage` comme cible definitive multi-colonnes
