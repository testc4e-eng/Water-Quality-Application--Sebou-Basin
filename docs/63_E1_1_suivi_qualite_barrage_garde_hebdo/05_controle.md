# Contrôles post-remigration

## Résultats

- volume final table cible : `1 780`
- doublons métier sur `(temps, station_id, parametre_qualite)` : `0`
- `station_id` null : `0`
- `parametre_qualite` null : `0`
- `valeur` null : `0`
- `barrage_id` null : `0`
- `parametre_ref_id` null : `539`
- volume audit `E1_1_GARDE_HEBDO` : `1 780`

## Interprétation

Le mini-lot est correct au sens de la clé métier, du rattachement station/barrage et de la qualité de chargement. Le point résiduel sur `parametre_ref_id` vient d’une couverture incomplète du référentiel canonique pour certains paramètres Garde Sebou ; ce point n’a pas bloqué la remigration.
