# Deployment - SAD Sebou 2026

## Etat actuel
Le projet est démarrable localement et dispose d’un socle opérationnel déjà structuré pour le refresh des vues matérialisées, l’exploitation courante et la maintenance documentaire.

## Référence maître
Consulter en priorité :
- `docs/01_project_reference/deployment_operations/deployment_and_operations.md`

## Chaîne minimale à connaître
1. Backend FastAPI lancé localement via `uvicorn`.
2. Frontend Vite lancé via `npm run dev`.
3. Base PostgreSQL/PostGIS/TimescaleDB accessible via `backend/.env`.
4. Refresh des MVs via API et scripts backend.

## Points d’attention
- ne jamais exposer les secrets d’environnement dans les documents ou réponses
- vérifier la cohérence entre scripts SQL, scripts backend et documentation d’exploitation
- privilégier la documentation maître plutôt qu’un récit parallèle dans les notes agents
