# Décisions Restantes

Pour clôturer cette fonctionnalité lors des prochains sprints ou versions, les points d'arbitrage suivants doivent être adressés par le backend :

1. **Agrégats temporels globaux :** Fournir un endpoint dédié (ex: `/api/v1/quality/unified/timeseries/aggregated`) pour exposer les données par mois/année sur tous les supports, sans envoyer 120 000 points bruts au frontend.
2. **Classification Globale :** Implémenter le moteur de règles pour classifier les mesures de la vue unifiée en classes de qualité (I, II, III).
3. **Cartographie :** Mettre à disposition les couches WMS / GeoJSON exactes relatives aux entités géographiques de qualité, distinctes de celles exploitées par le `BusinessMap` actuel.
