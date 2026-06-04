# Contrat API `GET /api/v1/dashboard/home`

## Règle générale

Le endpoint doit retourner un payload unique, lisible, orienté supervision, sans exposer les détails techniques inutiles à la DG.

## Racine

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `status` | string | oui | statut global de réponse | service backend | `success` si contrat complet | `partial` si sections dégradées |
| `generated_at` | string ISO datetime | oui | date de génération du payload | backend | horodatage serveur | `now()` |
| `data_freshness` | object | oui | fraîcheur par famille métier | agrégateur home | visible DG | statut `MISSING` |
| `hero` | object | oui | bandeau principal opérationnel | agrégateur home | 4 cartes max | sections vides contrôlées |
| `map` | object | oui | configuration carte métier home | config backend | carte centrale | couches vides |
| `basin_status` | object | oui | état bassin par domaine | agrégateur home | lecture rapide bassin | valeurs nulles |
| `alerts` | array | oui | top alertes pour le home | Alert Engine | max `5` | `[]` |
| `recommended_actions` | array | oui | top recommandations pour le home | Recommendation Engine | max `5` | `[]` |
| `trends` | object | oui | tendances courtes home | agrégateur home | 30 jours priorisés | points `[]` |
| `secondary_kpis` | object | oui | KPI DG secondaires | KPI Engine | hors hero | objets `UNKNOWN` |
| `metadata` | object | oui | règles et warnings home | agrégateur home | contrat métier explicite | valeurs par défaut |

## `hero`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `title` | string | oui | titre produit | statique | `WaterQual Sebou` | valeur statique |
| `subtitle` | string | oui | sous-titre métier | statique | SAD qualité eaux Sebou | valeur statique |
| `operational_date` | string ISO date | oui | date opérationnelle de lecture | agrégateur | plus récente date croisée utile | date serveur |
| `summary_label` | string | oui | libellé bloc | statique | `État opérationnel du bassin` | valeur statique |
| `cards` | array | oui | 4 cartes métier | agrégateur | hero opérationnel, pas KPI DG | `[]` |

### `hero.cards[]`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `id` | string | oui | identifiant carte | backend | `barrages_suivis`, `donnees_pluie_disponibles`, `stations_hydro_actives`, `stations_sentinelles_qualite` | stable |
| `label` | string | oui | libellé visible | backend | métier d'abord | libellé statique |
| `value` | number | oui | valeur principale | agrégateur | compte réel exploitable | `0` |
| `unit` | string | oui | unité | backend | `ouvrages`, `stations`, `réseau` | `n/a` |
| `status` | string enum | oui | `OK`, `SURVEILLANCE`, `CRITIQUE`, `UNKNOWN` | agrégateur | cohérent avec fraîcheur | `UNKNOWN` |
| `trend` | string enum | oui | `UP`, `DOWN`, `STABLE`, `UNKNOWN` | agrégateur | tendance courte | `UNKNOWN` |
| `description` | string | oui | explication métier | backend | formulation non technique | message sobre |
| `color_hint` | string | oui | aide visuelle | backend | `blue`, `green`, `orange`, `slate` | `slate` |
| `icon` | string | oui | nom icône frontend | backend | `dam`, `rain`, `river`, `quality` | `circle` |
| `freshness` | object | oui | fraîcheur de la carte | `data_freshness` | visible DG | `UNKNOWN` |

## `data_freshness`

### Structure commune

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `latest_date` | string ISO date \| null | oui | dernière date utile | agrégateur | date la plus récente de la famille | `null` |
| `age_days` | number \| null | oui | âge en jours | backend | `current_date - latest_date` | `null` |
| `status` | string enum | oui | `FRESH`, `STALE`, `MISSING` | backend | visible DG | `MISSING` |
| `note` | string | non | précision métier | backend | expliciter les réserves | omis |

Sections obligatoires :

- `barrages`
- `hydro`
- `pluvio`
- `quality_daily`

## `map`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `default_layers` | string[] | oui | couches actives au chargement | backend | `barrages`, `hydro`, `pluvio`, `quality_daily` | liste statique |
| `secondary_layers` | string[] | oui | couches désactivées | backend | `pollution`, `campaigns`, `swat`, `wasp`, `historical` | liste statique |
| `layers` | object | oui | métadonnées de couches | backend | cohérent avec carte existante | `{}` |

### `map.layers.<layer>`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `label` | string | oui | libellé couche | backend | lisible métier | stable |
| `enabled` | boolean | oui | active par défaut | backend | true seulement pour couches principales | false |
| `count` | number | oui | nombre d'entités | agrégateur | compte réel | `0` |
| `symbology` | object | oui | aide symbologie | backend | pas de logique rendering dure | config simple |
| `features_endpoint` | string | oui | endpoint de chargement carte | backend | réutilise moteur carte existant | chemin stable |

## `basin_status`

Sections obligatoires :

- `hydrology`
- `rainfall`
- `quality`
- `barrages`

### `basin_status.hydrology`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `debit_moyen` | number \| null | oui | débit moyen utile | `api.v_hydro_debit_journalier_qa` | moyenne sur dernière date utile | `null` |
| `unit` | string | oui | unité | backend | `m3/s` | `m3/s` |
| `stations_hausse` | number | oui | stations en hausse | agrégateur | compare J et J-1 | `0` |
| `stations_baisse` | number | oui | stations en baisse | agrégateur | compare J et J-1 | `0` |
| `stations_stables` | number | oui | stations stables | agrégateur | compare J et J-1 | `0` |
| `station_count` | number | oui | stations incluses | agrégateur | dernier jour utile | `0` |
| `latest_date` | string ISO date \| null | oui | dernière date hydro | agrégateur | visibilité DG | `null` |

### `basin_status.rainfall`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `cumul_24h` | number \| null | oui | cumul moyen 24h | vue pluie QA | données pluie disponibles | `null` |
| `cumul_7j` | number \| null | oui | cumul moyen 7 jours | vue pluie QA | idem | `null` |
| `cumul_30j` | number \| null | oui | cumul moyen 30 jours | vue pluie QA | idem | `null` |
| `unit` | string | oui | unité | backend | `mm` | `mm` |
| `station_count` | number | oui | stations incluses | agrégateur | stations avec pluie disponible | `0` |
| `latest_date` | string ISO date \| null | oui | dernière date pluie | agrégateur | visible DG | `null` |
| `warning_typology_not_validated` | boolean | oui | avertissement typologie | backend | `true` tant que non consolidé | true |
| `label` | string | oui | libellé bloc | backend | `Données pluie disponibles` | stable |

### `basin_status.quality`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `sentinel_station_count` | number | oui | nombre stations sentinelles | `qualite.mesure_qualite_sebou` | toujours vocabulaire sentinelle | `6` si contrat figé |
| `conformes` | number | oui | stations conformes | contrat qualité quotidien futur | réseau sentinelle | `0` |
| `surveillance` | number | oui | stations sous surveillance | idem | réseau sentinelle | `0` |
| `critiques` | number | oui | stations critiques | idem | réseau sentinelle | `0` |
| `unknown` | number | oui | stations non classées | idem | réseau sentinelle | `0` |
| `latest_date` | string ISO date \| null | oui | dernière date qualité | `qualite.mesure_qualite_sebou` | visible DG | `null` |
| `label` | string | oui | libellé réseau | backend | `Stations sentinelles qualité` | stable |

### `basin_status.barrages`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `barrage_count` | number | oui | barrages inclus | `api.v_hydro_barrage_param_journalier` | dernière date utile | `0` |
| `apport_total` | number \| null | oui | somme apport | vue barrage | dernière date utile | `null` |
| `lacher_total` | number \| null | oui | somme lâcher | vue barrage | dernière date utile | `null` |
| `niveau_moyen` | number \| null | non | niveau moyen | vue barrage | si calculable | `null` |
| `unit_flow` | string | oui | unité flux | backend | `Mm3/j` | `Mm3/j` |
| `latest_date` | string ISO date \| null | oui | dernière date barrage | agrégateur | visible DG | `null` |

## `alerts[]`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `id` | string | oui | identifiant d'alerte | backend | stable pour UI | hash synthétique |
| `type` | string enum | oui | `BARRAGE`, `HYDRO`, `PLUVIO`, `QUALITE`, `DATA` | Alert Engine | normalisé home | `DATA` |
| `severity` | string enum | oui | `INFO`, `SURVEILLANCE`, `CRITIQUE` | Alert Engine | traduction depuis moteur existant | `INFO` |
| `title` | string | oui | titre court | Alert Engine | lisible DG | stable |
| `message` | string | oui | message | Alert Engine | non technique | stable |
| `object_label` | string \| null | non | objet concerné | Alert Engine | station, barrage, zone | `null` |
| `object_type` | string \| null | non | type objet | Alert Engine | station, barrage, data | `null` |
| `action_hint` | string | oui | action recommandée | Alert Engine | actionnable | `Surveillance recommandée` |
| `created_at` | string ISO datetime \| null | non | date logique alerte | backend | si disponible | `generated_at` |
| `source` | string | oui | source logique | backend | `alert_engine` | stable |

## `recommended_actions[]`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `id` | string | oui | identifiant recommandation | backend | stable UI | hash |
| `priority` | string enum | oui | `P0`, `P1`, `P2` | mapping moteur recommandations | home normalisé | `P2` |
| `title` | string | oui | titre court | Recommendation Engine | lisible DG | stable |
| `why` | string | oui | justification | Recommendation Engine | courte | stable |
| `action` | string | oui | action détaillée | Recommendation Engine | actionnable | stable |
| `target_type` | string \| null | non | type cible | Recommendation Engine | station, barrage, bassin | `null` |
| `target_label` | string \| null | non | libellé cible | Recommendation Engine | visible UI | `null` |
| `source` | string | oui | source logique | backend | `recommendation_engine` | stable |

## `trends`

Sections obligatoires :

- `hydro_30d`
- `rainfall_30d`
- `barrage_apport_30d`
- `quality_30d`

### Structure commune

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `label` | string | oui | libellé graphique | backend | métier | stable |
| `unit` | string | oui | unité | backend | explicite | `n/a` |
| `points` | array | oui | série ordonnée | agrégateur | `date`, `value` | `[]` |

### `trends.points[]`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `date` | string ISO date | oui | date du point | source série | ordre croissant | omis |
| `value` | number \| null | oui | valeur agrégée | source série | agrégat simple lisible | `null` |

## `secondary_kpis`

Objets obligatoires :

- `iqgb`
- `ifd`
- `icd`
- `ich`
- `ipp`
- `isr`

### Structure commune

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `value` | number \| null | oui | valeur KPI | `/api/v1/kpi/overview` | secondaire sur le home | `null` |
| `label` | string | oui | nom KPI | backend | lisible | stable |
| `status` | string enum | oui | `OK`, `SURVEILLANCE`, `CRITIQUE`, `UNKNOWN` | backend | basé sur seuil UI | `UNKNOWN` |
| `description` | string | oui | description courte | backend | pédagogique DG | stable |
| `source_endpoint` | string | oui | endpoint source | backend | traçabilité | `/api/v1/kpi/overview` |

## `metadata`

| Champ | Type | Obligatoire | Description | Source | Règle métier | Fallback |
|---|---|---:|---|---|---|---|
| `mode` | string | oui | mode home | backend | `OPERATIONAL_HOME_V2` | stable |
| `scientific_warning` | string | oui | avertissement scientifique | backend | pas de prévision hydro avancée | stable |
| `temperature_rule` | string | oui | règle absolue température | backend | `AIR_TEMPERATURE != WATER_TEMPERATURE` | stable |
| `quality_scope` | string | oui | périmètre qualité | backend | `6 stations sentinelles qualité` | stable |
| `rainfall_typology_status` | string | oui | état typologie pluie | backend | `TO_CONSOLIDATE` tant que besoin | stable |
| `excluded_from_home` | string[] | oui | exclus du home | backend | `swat`, `wasp`, `legacy`, `historical_campaigns` | liste stable |
