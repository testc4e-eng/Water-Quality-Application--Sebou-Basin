# Decision GEO_READY_PARTIAL_FOR_E0

## Statut

**GEO_READY_PARTIAL_FOR_E0**

## Recalcul global

- volume total audite : `2169287`
- volume rattache initial (audit 49) : `2152678`
- volume corrige via decisions metier : `7094`
- volume IDP rattache par XY `<= 2 m` : `816`
- volume IDP ambigu restant : `3790`
- volume IDP orphelin restant : `4293`
- volume restant hors scope E0 initial : `616`
- nouveau taux GEO corrige : `99.6%`

## Lecture de decision

- le seuil `> 98%` est atteint
- la decision metier `Garde Sebou` est integree
- les blocages restants sont localises principalement sur l'IDP 2024 et sur un backlog geo hors scope E0
- les anomalies spatiales restent des flags QA, pas des blocages automatiques

## Condition de passage

- **autoriser un E0 partiel** sur le perimetre `02_scope_E0_geo_fiable.csv`
- **exclure** du dry-run les lignes listees dans `03_exclusions_geo_backlog.csv`
- **ne pas** lancer le chargement final Lot E tant que le backlog IDP ambigu/orphelin n'est pas arbitre
