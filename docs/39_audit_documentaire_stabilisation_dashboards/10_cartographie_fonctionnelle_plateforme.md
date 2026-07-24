# Cartographie fonctionnelle plateforme

## Objectif

Relier les dashboards, leurs APIs, les couches backend et la documentation, tout en distinguant :
- le chemin critique MVP ;
- les modules a stabiliser plus tard.

## Vue synthetique

| Domaine | Dashboard / Module | API / Endpoint | Statut projet | Priorite actuelle |
| --- | --- | --- | --- | --- |
| Accueil | Home operationnel | `/api/v1/dashboard/home` | Blocage critique | P0 |
| Pollution | Declaration Pollution | A definir | Coeur du MVP manquant | P1-P4 |
| Pollution | Propagation | `/api/v1/propagation/*` | A connecter au MVP | P4 |
| Qualite | Dashboard qualite | endpoints qualite/KPI | Secondaire non bloquant | Gele sauf bug critique |
| Carte | Carte metier | `/api/v1/map/*` | Support transverse | Gele sauf bug critique |
| Pollution | Campagnes pollution | `/api/v1/pollution-campagnes/*` | Existant a realigner | Gele sauf besoin MVP |
| Administration | Ingestion / QA | endpoints admin/ingestion | Support technique | Gele sauf bug critique |

## Regle de lecture

Avant tout travail, qualifier chaque sujet comme :
1. `Blocage MVP` ;
2. `Necessaire au chantier Declaration Pollution` ;
3. `Stabilisation differee`.
