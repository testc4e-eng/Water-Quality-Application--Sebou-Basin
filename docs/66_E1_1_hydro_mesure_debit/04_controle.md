# Contrôles post-insert

## Résultats

- volume final `hydro.mesure_debit` : `652 446`
- lignes insérées : `131 013`
- doublons métier sur `(temps, station_id)` : `0`
- `station_id` null : `0`
- `valeur` null : `0`
- unité source insérée : `m3/s`
- lignes audit `E1_1_HYDRO_DEBIT` : `131 013`

## Interprétation

Le mini-lot a ajouté exactement le périmètre `READY_INSERT_ONLY_MISSING` sans créer de doublon métier ni de null critique.
