# Audit performance backend

## Contexte

L'endpoint `GET /api/v1/dashboard/home` respectait le contrat JSON, mais le temps de réponse réel restait trop élevé pour le Home V2.

Mesures avant optimisation observées sur runtime HTTP :

- premier appel : `78.362 s`
- deuxième appel : `75.422 s`

Cause racine principale :

- agrégation séquentielle ;
- répétition des mêmes requêtes SQL dans plusieurs builders ;
- absence de cache backend court ;
- sections coûteuses en amont du rendu (`hero`, `map`, `basin_status`, `trends`) ;
- coût initial élevé des moteurs `alerts` et `recommendations`, eux-mêmes dépendants du `KPI Engine`.

## Profiling sectionnel

### Lecture avant optimisation

Les nombres de requêtes ci-dessous concernent la couche `home_service.py` uniquement, hors requêtes internes aux moteurs KPI/alertes/recommandations.

| Section | Durée observée avant | Nb requêtes avant | Risque | Optimisation proposée |
|---|---:|---:|---|---|
| `data_freshness` | `5.5 s` | `4` | faible | conserver mais mutualiser `latest_dates` |
| `hero` | `13.6 s` | `8` | élevé | réutiliser `latest_dates` et mutualiser les counts |
| `map` | `13.7 s` | `8` | élevé | réutiliser exactement les mêmes counts que `hero` |
| `basin_status` | `13.4 s` | `11` | élevé | réutiliser `latest_dates`, mutualiser le count qualité et éviter la relecture du dernier jour qualité |
| `alerts` | `21.8 s` | `4` + moteur | critique | éviter la relecture de `latest_dates` et s'appuyer sur cache backend |
| `recommended_actions` | `≈0 s` après warmup | `0` direct + moteur | moyen | profiter du cache moteur déjà en place |
| `trends` | `9.1 s` | `9` | élevé | réutiliser `latest_dates`, éviter le `max(temps)` qualité redondant, une requête par famille |
| `secondary_kpis` | `≈0 s` après warmup | `0` direct + moteur | faible | pas de duplication |
| `metadata` | `≈0 s` | `0` | faible | aucune |

### Profiling runtime après mutualisation interne

Mesure obtenue en exécutant le pipeline complet avec instrumentation interne du service, cache backend désactivé :

| Section | Durée après | Nb requêtes après | Risque résiduel | Commentaire |
|---|---:|---:|---|---|
| `data_freshness` | `5562 ms` | `4` | faible | premier chargement de `latest_dates` |
| `hero` | `4140 ms` | `4` | moyen | counts mutualisés, plus de `max(bucket_day)` redondants |
| `map` | `0 ms` | `0` | faible | réutilise entièrement les counts du `hero` |
| `basin_status` | `9161 ms` | `5` | moyen | reste la section SQL la plus coûteuse côté `home_service` |
| `alerts` | `18936 ms` | `0` direct | élevé | coût porté par le moteur d'alertes et ses dépendances |
| `recommended_actions` | `0 ms` | `0` direct | faible | profite du cache moteur déjà chaud |
| `trends` | `4855 ms` | `4` | moyen | qualité 30j reste coûteuse mais sans relecture de `latest_dates` |
| `secondary_kpis` | `0 ms` | `0` direct | faible | cache moteur |
| `metadata` | `0 ms` | `0` | faible | statique |

### Bilan SQL `home_service`

- avant optimisation : environ `44` requêtes directes côté `home_service`
- après optimisation : `17` requêtes directes côté `home_service`

## Points de friction identifiés

1. `_latest_dates()` était appelé dans presque toutes les sections.
2. Les counts `barrages/hydro/pluvio/quality` étaient recalculés au moins deux fois (`hero` + `map`).
3. La qualité quotidienne recalculait `max(temps)` et `count(distinct station_id)` hors mutualisation.
4. Les tendances réinterrogeaient inutilement la dernière date qualité.
5. L'absence de cache backend rendait chaque requête HTTP quasiment pleine charge.

## Décision d'optimisation

Priorités retenues :

1. cache backend court sur le payload complet ;
2. mutualisation des dates et counts ;
3. conservation stricte du contrat JSON ;
4. maintien de `status=partial` si une section échoue ;
5. aucune modification de base, aucun changement de moteur métier.
