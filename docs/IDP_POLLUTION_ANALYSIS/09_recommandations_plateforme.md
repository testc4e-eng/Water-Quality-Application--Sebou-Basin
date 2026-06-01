# Recommandations plateforme

## Backend / API

- Exposer les données IDP via vues `api.*`, pas directement depuis `staging`.
- Prévoir endpoints FastAPI filtrables par campagne, commune, type de pollution, paramètre, statut QA et emprise cartographique.
- Conserver `include_geom` optionnel pour limiter les payloads.

## Frontend React / MapLibre

- Afficher séparément sites inventoriés, points mesurés, matches validés et anomalies.
- Ajouter une interface d'arbitrage pour doublons et correspondances candidates.
- Symboliser `VALIDATED`, `TO_VALIDATE`, `DUPLICATE_CANDIDATE`, `UNMATCHED`.

## Data / PostGIS

- Utiliser GiST sur toutes les géométries métier.
- Conserver `geom_original` et `geom_4326`.
- Centraliser paramètres et unités dans `metadata`.
- Ne jamais supprimer les lignes source ; qualifier les anomalies dans `qa`.

## Analytics

- Préparer agrégations par commune, catégorie pollution, campagne, paramètre et statut QA.
