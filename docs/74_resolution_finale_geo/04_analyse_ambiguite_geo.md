# Analyse des ambiguïtés GEO

## Motifs d'ambiguite detectes

- `rejet_vs_point_pollution_duplique` : `166` cas
- `station_vs_station_mesure_duplique` : `132` cas
- `plusieurs_candidats_distincts` : `4` cas
- `conflit_referentiel_source` : `4` cas

## Regles d'arbitrage appliquees

- `infra.stations_mesure` est priorise sur `infra.stations` pour les points de mesure.
- Pour les flux `src_pollution`, une entite `infra.rejet_*` est priorisee sur `qualite.source_pollution_prelevement` quand la nature de rejet est explicite.
- Pour les flux `mesures_qualite_*`, `qualite.source_pollution_prelevement` est priorise sur l'entite rejet quand le point represente un point de prelevement analytique.
- Les clusters multi-entites ou les collisions sans information descriptive robuste restent en validation metier.
