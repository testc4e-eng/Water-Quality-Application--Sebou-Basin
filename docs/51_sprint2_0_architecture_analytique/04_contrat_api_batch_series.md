# 4. Contrat API : POST /analysis/series/batch

Afin d'éviter d'envoyer 10 requêtes `GET /series` concurrentes lorsque l'utilisateur analyse 10 paramètres, nous introduisons un endpoint batch robuste.
C'est le seul nouvel endpoint exigé pour lancer le Sprint 2.

**Endpoint :** `POST /api/v1/analysis/series/batch`

## Payload attendu

```json
{
  "date_from": "2015-01-01",
  "date_to": "2026-12-31",
  "aggregation": "monthly",
  "series": [
    {
      "support_type": "STATION_HYDRO",
      "object_id": "123",
      "domain": "HYDROLOGIE",
      "parameter_code": "DEBIT"
    },
    {
      "support_type": "BARRAGE",
      "object_id": "456",
      "domain": "HYDROLOGIE",
      "parameter_code": "LACHER"
    }
  ]
}
```

## Structure de Réponse attendue

```json
{
  "series": [
     // Tableau d'AnalyticalSeries (cf. 01_specifications_multi_support.md)
  ],
  "warnings": [
     // Éventuels avertissements côté base (ex: "Série X ignorée car aucun point")
  ],
  "meta": {
    "requested": 2,
    "returned": 2,
    "aggregation": "monthly"
  }
}
```
