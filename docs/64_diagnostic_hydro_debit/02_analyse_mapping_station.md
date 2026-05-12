# Analyse du mapping station

## Vérifications

- comparaison `raw.ire_station`
- jointure `metadata.mapping_station`
- station cible `station_id`

## Résultats

- lignes source préparées : `515 978`
- lignes mappées : `515 978`
- lignes non mappées : `0`
- `ire_station` distincts : `38`
- `ire_station` non mappés : `0`
- collisions de mapping dans `metadata.mapping_station` pour ces stations : `0`

## Conclusion

Le mapping station est cohérent et complet.

La classification `REBUILD_MAPPING_REQUIRED` n’est pas justifiée pour `hydro.mesure_debit`.
