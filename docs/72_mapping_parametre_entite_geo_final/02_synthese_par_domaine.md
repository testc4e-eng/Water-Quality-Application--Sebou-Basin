## Qualite

- Lignes de mapping : 249
- Tables prêtes : 5
- Liste prêtes : qualite.mesure_qualite_barrage, qualite.mesure_qualite_nappe, qualite.mesure_qualite_riviere, qualite.mesure_qualite_sebou, qualite.suivi_qualite_barrage_garde_hebdo
- Tables bloquées / à arbitrer : 0

## Hydro

- Lignes de mapping : 8
- Tables prêtes : 3
- Liste prêtes : hydro.barrage_bathymetrie, hydro.mesure_debit, hydro.mesure_debit_mensuel
- Tables bloquées / à arbitrer : 2
- Liste bloquées : hydro.mesure_barrage, hydro.mesure_debit_source

## Meteo

- Lignes de mapping : 4
- Tables prêtes : 3
- Liste prêtes : meteo.mesure_evaporation, meteo.mesure_precipitation, meteo.mesure_precipitation_annuelle_max
- Tables bloquées / à arbitrer : 0

## Idp

- Lignes de mapping : 318
- Tables prêtes : 0
- Tables bloquées / à arbitrer : 4
- Liste bloquées : staging.raw_idp_2024_mesures_qualite_globale, staging.raw_idp_2024_mesures_qualite_marche_cadre, staging.raw_idp_2024_src_pollution_globale, staging.raw_idp_2024_src_pollution_marche_cadre

## Modeles

- Lignes de mapping : 29
- Tables prêtes : 2
- Liste prêtes : swat_output.mesure_qualite_subbasin_ts, wasp_output.mesure_qualite_segment_ts
- Tables bloquées / à arbitrer : 1
- Liste bloquées : wasp_sebou.wasp_results

## Barrage spécialisé

- Les futures sous-tables barrage spécialisées ne sont pas encore créées.
- Le rattachement geo de `hydro.mesure_barrage` est globalement valide, mais l’architecture métier reste à remanier avant migration finale des concepts barrage.
