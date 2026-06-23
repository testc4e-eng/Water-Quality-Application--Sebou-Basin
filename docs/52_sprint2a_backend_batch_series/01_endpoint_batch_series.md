# 1. Endpoint Batch Series

## POST /api/v1/business-map/analysis/series/batch

Cet endpoint permet d'extraire plusieurs séries (jusqu'à 20 maximum) en un seul appel réseau.

### Paramètres de sécurité et d'efficacité
- **ID déterministes** : Chaque série se voit attribuer un identifiant unique calculé par un hachage SHA-1 combinant son support, objet, domaine, paramètre, agrégation et période temporelle.
- **Downsampling Automatique** : La période (`date_to - date_from`) dicte l'agrégation forcée :
  - > 90 jours & raw → daily
  - > 730 jours & raw/daily → monthly
  - > 3650 jours & raw/daily/monthly → annual

### Payload Type
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
    }
  ]
}
```
