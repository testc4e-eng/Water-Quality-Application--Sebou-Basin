# Comparaison : Ancienne API vs Nouvelle API Unifiée

## Ancienne approche (Fragmentée)
Les anciens endpoints (ex: `GET /api/v1/quality/stations`) pointaient en dur vers des tables physiques spécifiques (comme `qualite.mesure_qualite_riviere` ou `qualite.mesure_qualite_sebou` selon le routeur), ce qui entraînait :
- La nécessité de multiplier les endpoints pour afficher différents contextes métiers.
- Une confusion entre les données temps réel (sentinelles) et l'historique rivière.
- Une complexité accrue pour croiser les données avec les dimensions de station (`api.v_station_dimension`).

## Nouvelle approche (Unifiée avec `support_type`)
Les endpoints sous `/api/v1/quality/unified/` utilisent une vue logique unifiant les 4 sources physiques.
- **Simplification du backend** : Un seul endpoint `/timeseries` peut servir les barrages, la rivière ou les sentinelles simplement en modifiant le paramètre `support_type`.
- **Intégrité métier** : La colonne `support_type` force le requêtant (frontend) à expliciter son contexte métier, évitant le mélange accidentel des données.
- **Sécurité et Traçabilité** : Les tables sources restent isolées et intactes, et la colonne `source_table` est exposée dans les réponses JSON pour tracer l'origine de chaque point de donnée.
