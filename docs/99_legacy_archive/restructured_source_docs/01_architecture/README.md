# 🧪 Guide d'Intégration Frontend

## Objectif
Ce guide décrit comment intégrer proprement l'API WaterQual SEBOU côté frontend, avec gestion du cache, des erreurs, des chargements et des transformations de données.

## Client API recommandé

```javascript
export class WaterQualAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(path, params = {}) {
    const url = new URL(`${this.baseURL}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(`${key}[]`, v));
      } else if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
      },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.errors?.[0]?.message || "API request failed");
    }
    return payload;
  }

  infra = {
    getStations: (params) => this.request("/infra/stations", params),
  };

  meteo = {
    getPrecipitations: (params) => this.request("/meteo/precipitations/timeseries", params),
    getTemperatures: (params) => this.request("/meteo/temperatures/timeseries", params),
  };

  hydro = {
    getDebits: (params) => this.request("/hydro/debits/timeseries", params),
    getFdc: (params) => this.request("/hydro/debits/fdc", params),
  };

  qualite = {
    getSeries: (params) => this.request("/qualite/analyses/timeseries", params),
    getConformite: (params) => this.request("/qualite/conformite", params),
  };

  map = {
    getOverview: (params) => this.request("/map/overview", params),
    getQualityLayer: (params) => this.request("/map/layers/quality-status", params),
  };
}
```

## Gestion d'état recommandée

```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function loadData(params) {
  setLoading(true);
  setError(null);
  try {
    const response = await api.hydro.getDebits(params);
    setData(response.data);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}
```

## Patterns recommandés

- Debounce `300 à 500 ms` sur les filtres texte et multi-select.
- Réinitialiser `cursor` quand un filtre change.
- Utiliser React Query, SWR ou TanStack Query pour cache et retry.
- Désactiver le retry automatique sur erreurs `400/422`.
- Afficher un message clair si le backend refuse une requête `raw` trop volumineuse.

## Transformations courantes

### API → séries dashboard
```javascript
export function toChartSeries(rows, valueKey = "value") {
  return rows.map((row) => ({
    x: row.bucket_start,
    y: row[valueKey],
    stationId: row.station_id,
  }));
}
```

### API GeoJSON → carte
```javascript
export function toLeafletLayer(featureCollection) {
  return L.geoJSON(featureCollection, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng),
  });
}
```

## Exemple React - panneau filtres climat

```jsx
import { useEffect, useState } from "react";

export function ClimateFilterPanel({ api, onChange }) {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    api.infra.getStations({ type_station: "Météorologique", actif: true })
      .then((res) => setStations(res.data))
      .catch(console.error);
  }, [api]);

  return (
    <div>
      <label>Station</label>
      <select onChange={(e) => onChange({ stationId: e.target.value })}>
        <option value="">Choisir</option>
        {stations.map((s) => (
          <option key={s.station_id} value={s.station_id}>
            {s.station_nom}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Exemple React - graphique temporel

```jsx
import { useEffect, useState } from "react";

export function TimeSeriesChart({ api, stationId, from, to }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!stationId) return;
    api.hydro.getDebits({
      station_ids: [stationId],
      from,
      to,
      aggregate: "day",
      stat: "avg",
    }).then((res) => setRows(res.data));
  }, [api, stationId, from, to]);

  return <pre>{JSON.stringify(rows.slice(0, 5), null, 2)}</pre>;
}
```

## FAQ intégration

| Problème | Cause probable | Réponse frontend |
|---|---|---|
| Peu de points retournés | agrégation trop coarse | permettre changement `aggregate` |
| Erreur `422` | requête brute trop volumineuse | basculer en `day` ou `month` |
| Carte lente | bbox absent | requêter selon emprise courante |
