# 1. Corrections des filtres sur /features

## Problème initial
Au Sprint 1, l'API `/business-map/features` ne prenait en charge que le filtrage par `support_type` et `bassin_nom`. Lorsqu'un utilisateur sélectionnait un paramètre (ex: AG), la carte affichait toujours 100% des stations du support (ex: STATION_QUALITE), même si elles ne mesuraient pas l'AG.

## Correction Backend
Le endpoint FastAPI `/features` a été étendu pour accepter `domain`, `subdomain`, et `parameter_code`.

Dans `business_map_service.py`, une logique de jointure dynamique a été ajoutée. Si l'un de ces paramètres est fourni, la requête SQL effectue une jointure `JOIN` sur :
1. `api.mv_business_map_last_values lv` (qui lie `object_id` et `parameter_code`).
2. `api.mv_business_map_availability a` (qui lie `parameter_code` et `domain`).

Cette approche préserve les performances via l'utilisation stricte des vues matérialisées et de leurs index pré-calculés, sans altérer le schéma natif des données.

## Correction Frontend
Les hooks React Query dans `frontend/src/api/businessMapV1.ts` et `useBusinessMapV1.ts` transmettent désormais correctement l'intégralité du state de filtrage (`filters`) vers l'API.

**Résultat :** Le nombre de marqueurs visibles sur la carte diminue instantanément lorsqu'on sélectionne un paramètre spécifique pour ne conserver que les stations pertinentes.
