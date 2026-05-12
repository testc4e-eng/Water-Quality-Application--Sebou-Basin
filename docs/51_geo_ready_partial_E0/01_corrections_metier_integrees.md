# Corrections metier integrees

## Priorite aux decisions metier

Les decisions metier validees priment sur les heuristiques automatiques de rattachement.

## Decision forcee integree

### Table
- `staging.raw_suivi_qualite_brg_garde_hebdo`

### Decision metier appliquee
- toutes les lignes sont rattachees a la station **Barrage de Garde Sebou**
- cible retenue dans le referentiel : `infra.stations` / code `3323/8` / nom `brg de garde / sebou`
- statut applique : `GEO_FORCED_MAPPING_METIER`

### Effet sur l'audit GEO
- volume corrige par decision metier : `7094`
- ce cas ne doit plus reapparaitre comme `ORPHELIN`
- ce cas sort de la liste des blocages GEO

## Regles maintenues

- IDP 2024 : buffer strict `<= 2 m`
- problemes spatiaux : flags QA uniquement si le rattachement geo est unique
- incoherences de referentiel : traitement une par une, sans correction automatique
