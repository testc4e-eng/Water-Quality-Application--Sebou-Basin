# Decision finale

## Context

La demande de cloture impose un modele barrage stable, extensible et auditable.

## Analysis

- `hydro.mesure_barrage` actuel n'est pas compatible avec les 5 parametres source
- `RESTITUTION -> LACHER` est valide metierement avec unite de reference `Mm3/j`
- 1 ligne dedupee reste sans date et doit etre sortie du flux final
- le frontend/backend est encore couple au legacy multi-colonnes

## Solution

Decision :

- statut : `BLOQUANT`
- action : `REMODELER avant cloture`
- strategie : `RESET_AND_RELOAD` uniquement apres:
  - validation du referentiel canonique
  - creation de `hydro.mesure_barrage_param`
  - mise en place d'une compatibilite API/dashboard

Classification restante :

- `BLOQUANT`
  - exposition legacy `lacher_m3s` encore presente cote API/dashboard
  - absence de support final `APPORTS_HM3`
  - absence de support final `TRANSFERT`
- `BACKLOG`
  - 1 cle dedupee sans date
  - alias `VOLUME_BARRAGE` vs `VOLUME`
- `INFO`
  - mapping barrage couvert pour le flux actif
- `LEGACY_IGNORE`
  - `hydro.mesure_barrage` legacy comme cible definitive

## Optional improvements

- geler l'ecriture sur `hydro.mesure_barrage`
- basculer les dashboards sur une vue parametrique compat
