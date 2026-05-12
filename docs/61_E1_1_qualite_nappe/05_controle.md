# Contrôles post-remigration

## Résultats

- volume final table cible : `63 047`
- doublons métier sur `(temps, station_id, parametre_qualite)` : `0`
- `station_id` null : `0`
- `parametre_qualite` null : `0`
- `valeur` null : `0`
- `parametre_ref_id` null : `13 270`
- volume audit `E1_1_NAPPE` : `63 047`

## Interprétation

Le mini-lot est correct au sens de la clé métier et de la qualité de chargement. Le point résiduel sur `parametre_ref_id` vient d’une couverture incomplète du référentiel canonique pour certains codes nappes ; ce point n’a pas bloqué la remigration car il ne crée ni doublon métier, ni null critique sur la donnée mesurée.
