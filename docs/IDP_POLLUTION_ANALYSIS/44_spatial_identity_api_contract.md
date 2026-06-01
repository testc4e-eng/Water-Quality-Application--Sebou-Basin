# Contrat API cible identite spatiale

Statut : cible PREPROD, non implemente dans cette phase.

## Endpoints

| Endpoint | Role |
|---|---|
| `GET /api/v1/map/sites` | couche GeoJSON maitre paginee/filtrable |
| `GET /api/v1/map/sites/{id}` | fiche site maitre |
| `GET /api/v1/map/sites/{id}/parameters` | parametres disponibles par site |
| `GET /api/v1/map/sites/{id}/timeseries` | series temporelles par parametre |
| `GET /api/v1/map/sites/{id}/sources` | lineage source du site |
| `GET /api/v1/map/sites/conflicts` | conflits spatiaux a arbitrer |
| `GET /api/v1/map/sites/orphans` | sources sans rattachement |

## `GET /api/v1/map/sites`

Parametres :

- `bbox=minx,miny,maxx,maxy`
- `limit`, `offset`
- `source_type`
- `pollution_category`
- `commune`, `province`, `bassin`
- `parameter_code`
- `regulatory_class`
- `validation_status`
- `identity_status`
- `cluster=true|false`

Format GeoJSON :

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "uuid",
      "geometry": {"type": "Point", "coordinates": [-5.1, 34.2]},
      "properties": {
        "site_code": "POLL-000001",
        "site_name": "STEP ...",
        "source_type": "STEP",
        "commune": "...",
        "validation_status": "TO_VALIDATE",
        "identity_status": "MASTER_CONFIRMED",
        "confidence_score": 0.98,
        "latest_regulatory_class": "moyenne",
        "symbology": {"color": "#f59e0b", "mode": "regulatory_status"}
      }
    }
  ],
  "metadata": {"count": 1, "limit": 5000, "offset": 0}
}
```

## Popup MapLibre cible

La popup doit afficher :

- metadonnees du site maitre;
- sources rattachees;
- derniers resultats qualite;
- classe reglementaire;
- liens vers series temporelles;
- statut QA/arbitrage.

## QA exposee

Les endpoints QA exposent uniquement les conflits et orphelins actifs. Les decisions d'arbitrage restent dans les tables QA jusqu'a validation metier.
