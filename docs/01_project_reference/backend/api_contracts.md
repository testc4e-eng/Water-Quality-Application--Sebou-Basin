# 🔎 Catalogue Détaillé des Endpoints

## 1. `GET /api/v1/infra/stations`

**Objectif métier** : exposer les stations enrichies avec contexte administratif et hydrographique.  
**Cas d'usage** : filtres dashboard, cartes, formulaires de sélection.  
**Auth** : `lecteur+`  
**Rate limiting** : `120 req/min/user`

### Paramètres
| Nom | Emplacement | Type | Requis | Défaut | Validation | Exemple valide | Exemple invalide | Impact performance |
|---|---|---|---|---|---|---|---|---|
| `type_station` | query | string | Non | null | enum métier | `Hydrologique` | `XXX` | faible |
| `bassin_id` | query | integer | Non | null | `> 0` | `1` | `-1` | faible |
| `sous_bassin_id` | query | integer | Non | null | `> 0` | `12` | `abc` | faible |
| `actif` | query | boolean | Non | null | `true/false` | `true` | `yes` | faible |
| `format` | query | string | Non | `json` | `json|geojson|csv` | `geojson` | `xml` | moyen |
| `page` | query | integer | Non | `1` | `1..100000` | `1` | `0` | faible |
| `page_size` | query | integer | Non | `100` | `1..500` | `100` | `5000` | moyen |

### Réponses
- `200` liste paginée ou `FeatureCollection`
- `400` paramètre invalide
- `401` non authentifié
- `403` rôle insuffisant
- `500` erreur interne

### Exemple cURL
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.waterqual-sebou.ma/api/v1/infra/stations?type_station=Hydrologique&actif=true&page=1&page_size=100"
```

### Exemple JavaScript
```javascript
const res = await fetch(`${baseUrl}/infra/stations?actif=true`, {
  headers: { Authorization: `Bearer ${token}` }
});
const json = await res.json();
```

### Exemple Python
```python
import requests
res = requests.get(
    f"{base_url}/infra/stations",
    headers={"Authorization": f"Bearer {token}"},
    params={"actif": "true", "page": 1, "page_size": 100},
    timeout=30,
)
res.raise_for_status()
data = res.json()
```

### Notes techniques
- Temps de réponse typique: `< 150 ms`
- Vue source: `api.v_station_dimension`
- Cache recommandé: `1 h`

## 2. `GET /api/v1/meteo/precipitations/timeseries`

**Objectif métier** : fournir les séries de précipitation pour analyses climatiques et graphiques temporels.  
**Dashboards** : Climat, Principal carte.

### Paramètres
| Nom | Type | Requis | Validation | Défaut | Exemple |
|---|---|---|---|---|---|
| `station_ids[]` | array<uuid> | Oui | `1..50` IDs | - | `["uuid1"]` |
| `from` | date-time | Oui | ISO 8601 | - | `2025-01-01T00:00:00Z` |
| `to` | date-time | Oui | `to > from` | - | `2025-01-31T23:59:59Z` |
| `aggregate` | enum | Non | `raw|hour|day|week|month|year` | `day` | `month` |
| `stat` | enum | Non | `sum|min|max|avg|count` | `sum` | `sum` |
| `timezone` | string | Non | IANA TZ | `Africa/Casablanca` | `UTC` |
| `cursor` | string | Non | base64 opaque | null | `eyJ0...` |

### Réponse 200
```json
{
  "data": [
    {
      "station_id": "550e8400-e29b-41d4-a716-446655440000",
      "bucket_start": "2025-01-01T00:00:00+01:00",
      "bucket_end": "2025-02-01T00:00:00+01:00",
      "value": 42.7,
      "unit": "mm"
    }
  ],
  "meta": {
    "aggregation": "month",
    "filters": {
      "station_ids": ["550e8400-e29b-41d4-a716-446655440000"]
    }
  },
  "links": {},
  "errors": []
}
```

### Gestion des erreurs
```javascript
if (!res.ok) {
  const err = await res.json();
  throw new Error(err.errors?.[0]?.message ?? "API error");
}
```

### Notes techniques
- Temps de réponse typique: `< 300 ms` sur agrégats, `< 2 s` sur brut borné
- Limite conseillée: `10000` points maximum en `raw`
- Source SQL: `api.ca_meteo_precip_day` ou table brute selon `aggregate`
- Cache: `5 à 15 min`

## 3. `GET /api/v1/meteo/temperatures/timeseries`

**Objectif métier** : exposer les séries température min/moy/max.  
**Dashboards** : Climat, Principal carte.

### Paramètres
Même contrat que précipitations, sauf `stat` facultatif selon implémentation.

### Notes techniques
- Source SQL: `api.ca_meteo_temp_day`
- Colonnes principales: `temp_min`, `temp_moy`, `temp_max`
- Cache: `5 à 15 min`

## 4. `GET /api/v1/hydro/debits/timeseries`

**Objectif métier** : alimenter les courbes de débit et comparaisons hydrologiques.  
**Dashboards** : Hydrologie simple, multi-scénarios, carte.

### Paramètres
| Nom | Type | Requis | Validation |
|---|---|---|---|
| `station_ids[]` | array<uuid> | Oui | `1..20` |
| `from` | date-time | Oui | ISO 8601 |
| `to` | date-time | Oui | `to > from` |
| `aggregate` | enum | Non | `raw|hour|day|week|month|year` |
| `stat` | enum | Non | `avg|min|max|sum|count|p95` |
| `scenario[]` | array<string> | Non | valeurs métier contrôlées |

### Exemple cURL
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.waterqual-sebou.ma/api/v1/hydro/debits/timeseries?station_ids[]=uuid1&from=2025-01-01T00:00:00Z&to=2025-01-31T23:59:59Z&aggregate=day&stat=avg"
```

### Notes techniques
- Source SQL: `api.ca_hydro_debit_day`
- Vue brute de secours: `hydro.mesure_debit`
- Cache: `5 min`

## 5. `GET /api/v1/hydro/debits/fdc`

**Objectif métier** : calculer la courbe de débit classé (FDC).  
**Dashboards** : Hydrologie mode FDC.

### Paramètres
| Nom | Type | Requis | Validation |
|---|---|---|---|
| `station_id` | uuid | Oui | FK valide |
| `from` | date-time | Oui | ISO 8601 |
| `to` | date-time | Oui | `to > from` |

### Réponse
```json
{
  "data": [
    { "rank": 1, "exceedance_probability": 0.1, "debit": 125.4 },
    { "rank": 2, "exceedance_probability": 0.2, "debit": 120.1 }
  ],
  "meta": {
    "station_id": "550e8400-e29b-41d4-a716-446655440000",
    "sample_size": 3650
  },
  "errors": []
}
```

### Notes techniques
- Calcul potentiellement coûteux sur longue période
- Recommandation: pré-calcul ou cache `30 min`

## 6. `GET /api/v1/qualite/analyses/timeseries`

**Objectif métier** : exposer les séries qualité de l'eau par paramètre.  
**Dashboards** : Qualité, carte.

### Paramètres
| Nom | Type | Requis | Validation |
|---|---|---|---|
| `station_ids[]` | array<uuid> | Oui | `1..50` |
| `param_codes[]` | array<string> | Oui | codes existants dans `admin.catalogue_parametre` |
| `from` | date-time | Oui | ISO 8601 |
| `to` | date-time | Oui | `to > from` |
| `aggregate` | enum | Non | `raw|day|month|year` |

### Notes techniques
- Source SQL: `api.mv_qualite_month` pour mensuel, `api.v_qualite_mesures_enrichies` pour brut
- Cache: `15 min`

## 7. `GET /api/v1/qualite/conformite`

**Objectif métier** : retourner les ratios et alertes de conformité par station et paramètre.  
**Dashboards** : Qualité, Principal carte.

### Réponse type
```json
{
  "data": [
    {
      "station_id": "550e8400-e29b-41d4-a716-446655440000",
      "param_code": "NO3",
      "sample_count": 12,
      "non_conforme_count": 2,
      "conformity_rate": 0.8333
    }
  ],
  "meta": {},
  "errors": []
}
```

## 8. `GET /api/v1/map/overview`

**Objectif métier** : fournir les KPI synthétiques du dashboard principal.  
**Dashboards** : Principal cartographique.

### Réponse type
```json
{
  "data": {
    "active_stations": 42,
    "quality_alerts": 5,
    "conformity_rate": 0.91,
    "latest_hydro_measure_count": 38
  },
  "meta": {},
  "errors": []
}
```

### Notes techniques
- Source SQL: `api.mv_station_latest_status`
- Cache: `1 à 5 min`

## 9. `GET /api/v1/map/layers/quality-status`

**Objectif métier** : retourner la couche GeoJSON de statut qualité des stations.  
**Dashboards** : Principal cartographique.

### Paramètres
| Nom | Type | Requis | Validation |
|---|---|---|---|
| `bbox` | string | Non | `minLon,minLat,maxLon,maxLat` |
| `bassin_id` | integer | Non | `> 0` |
| `sous_bassin_id` | integer | Non | `> 0` |
| `from` | date-time | Non | ISO 8601 |
| `to` | date-time | Non | `to > from` |

### Réponse
Format `application/geo+json`, `FeatureCollection`.

## 10. `GET|POST|PUT|DELETE /api/v1/raw/...`

**Objectif métier** : fournir une couche d'accès CRUD générique aux tables autorisées.  
**Dashboards** : page Données brutes.

### Contraintes
- Restreindre aux tables explicitement whitelistées
- Journaliser via `security.audit_log`
- Désactiver en environnement public

### Méthodes
- `GET /raw/{schema}/{table}`
- `POST /raw/{schema}/{table}`
- `PUT /raw/{schema}/{table}/{id}`
- `DELETE /raw/{schema}/{table}/{id}`

## 11. `POST /api/v1/exports`

**Objectif métier** : lancer un export asynchrone Excel, CSV ou PDF.  
**Dashboards** : Données brutes, analystes.

### Réponse 202
```json
{
  "data": {
    "export_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "queued"
  },
  "meta": {},
  "errors": []
}
```
