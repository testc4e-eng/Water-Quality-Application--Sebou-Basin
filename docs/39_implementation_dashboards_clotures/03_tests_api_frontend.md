# Tests API / frontend

## Build frontend

- Commande exécutée : `npm run build`
- Résultat : `OK`
- Outil : `vite build`
- Remarque : warning sur chunks > `500 kB`, sans échec de build

## Tests manuels API

### Santé backend local

- URL testée : `http://127.0.0.1:8000/health`
- Résultat : `200 OK`
- Réponse observée : service `agent-swat-api`

### Endpoints dashboards attendus

- `GET /api/v1/dashboard/home` -> `404`
- `GET /api/v1/quality/regulatory-status` -> `404`
- `GET /api/v1/pollution/sites.geojson?limit=1` -> `404`

## Conclusion technique

Le service qui répond sur `127.0.0.1:8000` n’est pas l’API SAD attendue par le frontend actuellement configuré.

Conséquence :

- le build frontend est validé ;
- les tests d’intégration runtime n’ont pas pu être confirmés contre la bonne API SAD ;
- les écrans d’erreur et d’état vide deviennent donc importants et ont été renforcés.
