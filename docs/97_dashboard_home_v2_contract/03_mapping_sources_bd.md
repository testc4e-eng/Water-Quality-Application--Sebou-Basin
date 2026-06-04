# Mapping sources BD / API

| Section payload | Champ | Source DB/API | Statut | Remarque |
|---|---|---|---|---|
| `hero.cards.barrages_suivis` | `value` | `api.v_hydro_barrage_param_journalier` | disponible | compter barrages sur dernière date utile |
| `hero.cards.donnees_pluie_disponibles` | `value` | `api.v_meteo_precipitation_journalier_qa` | disponible avec réserve | typologie à consolider |
| `hero.cards.stations_hydro_actives` | `value` | `api.v_hydro_debit_journalier_qa` | disponible | compter stations sur dernière date utile |
| `hero.cards.stations_sentinelles_qualite` | `value` | `qualite.mesure_qualite_sebou` | disponible | réseau quotidien de 6 stations |
| `data_freshness.barrages` | `latest_date` | `api.v_hydro_barrage_param_journalier` | disponible | `max(bucket_day)` |
| `data_freshness.hydro` | `latest_date` | `api.v_hydro_debit_journalier_qa` | disponible | `max(bucket_day)` |
| `data_freshness.pluvio` | `latest_date` | `api.v_meteo_precipitation_journalier_qa` | disponible | `max(bucket_day)` |
| `data_freshness.quality_daily` | `latest_date` | `qualite.mesure_qualite_sebou` | disponible | `max(temps)` |
| `map.layers.barrages` | `count` | `api.v_barrage_dimension` + `api.v_hydro_barrage_param_journalier` | disponible | count exploitable home |
| `map.layers.hydro` | `count` | `api.v_hydro_debit_journalier_qa` | disponible | dernier jour utile |
| `map.layers.pluvio` | `count` | `api.v_meteo_precipitation_journalier_qa` | disponible avec réserve | données pluie disponibles |
| `map.layers.quality_daily` | `count` | `qualite.mesure_qualite_sebou` | disponible | 6 stations sentinelles |
| `basin_status.hydrology.debit_moyen` | `value` | `api.v_hydro_debit_journalier_qa` | disponible | moyenne dernière date utile |
| `basin_status.hydrology.stations_hausse/baisse/stables` | `value` | `api.v_hydro_debit_journalier_qa` | disponible sous condition | comparaison J/J-1 à implémenter |
| `basin_status.rainfall.cumul_24h/7j/30j` | `value` | `api.v_meteo_precipitation_journalier_qa` | disponible avec réserve | utiliser `val_remplies` recommandé |
| `basin_status.quality.*` | `conformes/surveillance/critiques` | contrat qualité quotidien futur dérivé de `qualite.mesure_qualite_sebou` | à consolider | nécessite logique métier dédiée |
| `basin_status.barrages.apport_total` | `value` | `api.v_hydro_barrage_param_journalier` | disponible | `parametre_code='APPORT'` |
| `basin_status.barrages.lacher_total` | `value` | `api.v_hydro_barrage_param_journalier` | disponible | `parametre_code='LACHER'` |
| `basin_status.barrages.niveau_moyen` | `value` | `api.v_hydro_barrage_param_journalier` | disponible | `parametre_code='NIVEAU_EAU'` |
| `alerts` | array | `/api/v1/alerts` | disponible | filtrage/priorisation home à spécialiser |
| `recommended_actions` | array | `/api/v1/recommendations` | disponible | filtrage/priorisation home à spécialiser |
| `trends.hydro_30d` | `points` | `api.v_hydro_debit_journalier_qa` | disponible | agrégation 30 jours |
| `trends.rainfall_30d` | `points` | `api.v_meteo_precipitation_journalier_qa` | disponible avec réserve | typologie pluie à préciser |
| `trends.barrage_apport_30d` | `points` | `api.v_hydro_barrage_param_journalier` | disponible | APPORT journalier |
| `trends.quality_30d` | `points` | `qualite.mesure_qualite_sebou` | à définir | score synthétique sentinelle à concevoir |
| `secondary_kpis` | `iqgb/ifd/icd/ich/ipp/isr` | `/api/v1/kpi/overview` | disponible | déjà industrialisé |
| `metadata.temperature_rule` | `value` | règle métier | figé | `AIR_TEMPERATURE != WATER_TEMPERATURE` |
