# Plan de migration progressive

## Phase A — Coexistence legacy + nouvelles APIs

Objectif : ajouter les nouvelles APIs sans casser les routes existantes.

Actions :

- Créer repositories lecture seule sur vues `api.*`.
- Créer routers spécialisés `/meteo`, `/qualite`, `/pollution`, `/idp`, extension `/hydro`.
- Garder `/quality`, `/climate`, `/analytics`, `/observatory` existants.
- Ajouter tests count/limit sur chaque endpoint.

Statut cible : `API_SPECIALISEES_DISPONIBLES`.

## Phase B — Nouveaux dashboards pilotes

Objectif : valider un premier écran complet.

Actions :

- Créer module frontend `src/api/qualite.ts` spécialisé.
- Créer écran `Métaux`.
- Vérifier `Mo` présent, `MO` absent des métaux, `FM/F_M_MES` absents.
- Valider performance.

Statut cible : `FRONT_PILOTE_OK`.

## Phase C — Migration composants critiques

Objectif : remplacer les appels frontend legacy par famille.

Ordre recommandé :

1. Qualité métaux.
2. Qualité pollution organique.
3. Chimie minérale.
4. Météo précipitation.
5. Barrages paramètres.
6. Pollution / IDP.

Statut cible : `DASHBOARDS_SPECIALISES_OK`.

## Phase D — Dépréciation legacy

Objectif : réduire les routes directes vers tables métier.

Actions :

- Marquer `/quality/*` legacy dans docs OpenAPI.
- Remplacer `/entity/{id}/data` par dispatcher `table_cible`.
- Déprécier catalogues `public.*`.
- Conserver `raw` uniquement admin.

Statut cible : `LEGACY_READ_ONLY_DEPRECATED`.

## Phase E — Ingestion V1 finale

Objectif : brancher les futures données sur le même référentiel.

Actions :

- Ingestion avec alias, QA, GEO, quarantaine.
- Mise à jour référentiel gouvernée.
- Exposition automatique via vues/API.

Statut cible : `INGESTION_V1_READY`.

## Contraintes anti-régression

- Aucun endpoint existant supprimé pendant les phases A à C.
- Les nouvelles routes sont ajoutées sous chemins explicites.
- Frontend migre écran par écran.
- Tests minimum : compilation backend, import routers, count SQL, build frontend après chaque migration.
