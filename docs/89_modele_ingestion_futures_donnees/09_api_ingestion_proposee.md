# API ingestion proposee

## Endpoints

| Methode | Endpoint | Role |
|---|---|---|
| `POST` | `/api/v1/ingestion/batches` | creer un batch |
| `POST` | `/api/v1/ingestion/batches/{batch_id}/upload` | uploader fichier |
| `POST` | `/api/v1/ingestion/batches/{batch_id}/validate` | lancer validation QA |
| `GET` | `/api/v1/ingestion/batches/{batch_id}/report` | consulter rapport |
| `POST` | `/api/v1/ingestion/batches/{batch_id}/load` | charger apres validation |
| `POST` | `/api/v1/ingestion/batches/{batch_id}/rollback` | rollback audite |
| `GET` | `/api/v1/ingestion/mappings/pending` | lister arbitrages |
| `POST` | `/api/v1/ingestion/mappings/decisions` | enregistrer decision mapping |

## Garde-fous

- `load` interdit si anomalies BLOQUANT
- `rollback` interdit sans role admin
- tous les endpoints doivent journaliser dans `ingestion.ingestion_batch`
- aucun endpoint ne doit utiliser `ctid`

