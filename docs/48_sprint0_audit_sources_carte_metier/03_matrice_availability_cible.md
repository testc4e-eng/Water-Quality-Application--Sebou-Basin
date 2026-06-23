# 3. Matrice Availability Cible

Afin de servir de contrat pour l'endpoint `GET /api/v1/business-map/availability`, la matrice cible préconisée s'appuie sur une agrégation des vues existantes.

| support_type | domain | subdomain | parameter_code | parameter_label | unit | object_count | measure_count | date_min | date_max | has_geometry | has_timeseries | has_thresholds | recommended_v1 |
|---|---|---|---|---|---|---:|---:|---|---|---|---|---|---|
| STATION_QUALITE | QUALITE | PHYSICO_CHIMIE | PH | pH | unité pH | 47 | 1540 | 1980-01-01 | 2026-06-10 | true | true | true | true |
| STATION_QUALITE | QUALITE | PHYSICO_CHIMIE | COND | Conductivité | µS/cm | 47 | 1540 | 1980-01-01 | 2026-06-10 | true | true | true | true |
| STATION_HYDRO | HYDROLOGIE | DEBIT | DEBIT | Débit | m³/s | 85 | 652448 | 1960-01-01 | 2026-06-10 | true | true | false | true |
| BARRAGE | HYDROLOGIE | STOCK | VOLUME | Volume | Mm³ | 34 | 272652 | 1970-01-01 | 2026-06-10 | true | true | false | true |
| STATION_METEO | CLIMATOLOGIE | PRECIPITATION | PREC | Précipitation | mm | 112 | 546007 | 1975-01-01 | 2026-06-10 | true | true | false | true |
| SOURCE_POLLUTION| POLLUTION | REJET_IDP | DBO5 | DBO5 | mg/L | 75 | 1409 | 2024-01-01 | 2025-12-31 | true | false | true | true |

*Cette matrice doit être générée dynamiquement par une vue matérialisée croisant les métadonnées (`metadata.referentiel_parametre`) et les dimensions (`api.v_station_dimension`).*
