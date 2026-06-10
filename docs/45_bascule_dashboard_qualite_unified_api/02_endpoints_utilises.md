# Endpoints Utilisés par le Frontend

Le Dashboard Qualité Réglementaire appelle désormais ces endpoints depuis `api/qualityRegulatory.ts` :

```http
GET /api/v1/quality/unified/stations?support_type=SENTINELLE
GET /api/v1/quality/unified/parameters?support_type=SENTINELLE
GET /api/v1/quality/unified/timeseries?support_type=SENTINELLE&ire_station=3695/8
```

En changeant d'onglet sur le Dashboard, le frontend met à jour le `support_type` (`RIVIERE`, `BARRAGE`, `BARRAGE_GARDE`), déclenchant un rafraîchissement des requêtes via React Query.

### Avantages de l'UX
- Réactivité : React Query met en cache les données par `queryKey` comprenant le `supportType`. Le basculement d'un onglet à l'autre est instantané après le premier chargement.
- Intégrité : Le filtrage côté backend garantit qu'aucune donnée de "Rivière Historique" ne viendra polluer les affichages du "Temps Réel".
