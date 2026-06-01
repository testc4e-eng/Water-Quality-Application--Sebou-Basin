# Backlog backend P1

| Sujet | Action | Priorite |
|---|---|---|
| Import global `swat_analysis` | Isoler ou lazy-loader pour eviter crash `numpy` au demarrage complet | P1 technique |
| Endpoints meteo specialises | Ajouter `/api/v1/meteo/temperature`, `/precipitation`, `/evaporation` | P1 |
| Endpoints hydro barrage | Ajouter `/api/v1/hydro/barrages/parametres`, `/qualite` ou adapter existants | P1 |
| Endpoints qualite P1 | Microbiologie, biologique, terrain, contexte station, organoleptique | P1 |
| Endpoints pollution / IDP | Exposer constat, analyses finales, points, non resolus | P1 |
| Repository catalog | Ajouter endpoint `/api/v1/exposure/catalog` depuis `table_cible` | P2 |
| Performance | Evaluer materialisation des vues qualite multi-supports si latence > seuil | P2 |
| Frontend | Debloquer uniquement apres validation endpoints P0 sur app complete | P2 |

## Decision

Backend P0 est pret fonctionnellement en isolation. Avant rollout applicatif complet, corriger le blocage d'import global `swat_analysis` ou valider l'environnement runtime backend cible.
