# APIs candidates frontend

## Statut

Propositions non implementees. A valider avant creation FastAPI/backend.

| API | Source | Usage frontend | Priorite | Filtre | Pagination | Cache |
|---|---|---|---|---|---|---|
| `GET /api/qualite/dashboard` | `api.v_qualite_dashboard` | series qualite multi-support | P1 | support, station, parametre, date | oui | 5 min |
| `GET /api/qualite/parametres` | `metadata.referentiel_parametre_canonique` | filtres parametres/aliases | P1 | domaine, actif, dashboard | non | 1 h |
| `GET /api/meteo/dashboard` | `api.v_meteo_dashboard` | precipitation/evaporation/temperature | P1 | station, parametre, date | oui | 15 min |
| `GET /api/hydro/barrages/parametres` | `api.v_barrage_dashboard` | dashboard barrage parametrique | P1 | barrage, parametre, scenario, date | oui | 15 min |
| `GET /api/idp/points` | `api.v_idp_points` | carte IDP/GEO progressive | P1 | geo_status, bbox, source | oui | 15 min |
| `GET /api/pollution/dashboard` | `api.v_pollution_dashboard` | pollution + QA valeur brute | P2 | parametre, qa_status, bbox | oui | 15 min |
| `GET /api/swat/latest` | `api.v_swat_latest` | consultation SWAT legacy | P3 | scenario, subbasin, parametre | oui | 1 h |
| `GET /api/wasp/latest` | `api.v_wasp_latest` | consultation WASP legacy | P3 | scenario, segment, parametre | oui | 1 h |
| `GET /api/ingestion/batches` | `ingestion.batch` | suivi ingestion future | P1 futur | status, source, date | oui | 1 min |
| `GET /api/ingestion/quarantine` | `ingestion.quarantine` | revue anomalies | P1 futur | severity, error_code, status | oui | 1 min |

## Regles API

- exposer `geo_status` et `qa_status` dans les reponses ;
- ne pas masquer les lacunes source, les classer ;
- ne pas exposer SWAT/WASP legacy sans `modeling_status` ;
- conserver la casse des codes parametres (`MO` != `Mo`) ;
- utiliser pagination par defaut sur series longues.

## Front concerne

| Front | APIs |
|---|---|
| Dashboard qualite | qualite/dashboard, qualite/parametres |
| Dashboard meteo | meteo/dashboard |
| Dashboard barrage | hydro/barrages/parametres |
| Carte IDP | idp/points, pollution/dashboard |
| Modelisation | swat/latest, wasp/latest |
| Admin ingestion | ingestion/batches, ingestion/quarantine |
