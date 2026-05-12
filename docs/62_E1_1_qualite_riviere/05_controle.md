# Contrôles post-remigration

## Résultats

- volume final table cible : `59 534`
- doublons métier sur `(temps, station_id, parametre_qualite)` : `0`
- `station_id` null : `0`
- `parametre_qualite` null : `0`
- `valeur` null : `0`
- `parametre_ref_id` null : `17 287`
- volume audit `E1_1_RIVIERE` : `59 534`

## Interprétation

Le mini-lot est correct au sens de la clé métier et de la qualité de chargement. Le point résiduel sur `parametre_ref_id` vient d’une couverture incomplète du référentiel canonique pour certains codes rivières ; ce point n’a pas bloqué la remigration car il ne crée ni doublon métier, ni null critique sur la donnée mesurée.
