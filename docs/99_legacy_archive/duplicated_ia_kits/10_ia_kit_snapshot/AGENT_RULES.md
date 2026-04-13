# Regles Agents IA - SAD Sebou 2026

## Objectif
Soutenir l'ABHS Sebou avec un systeme d'aide a la decision pour la gestion de la qualite des eaux de surface, integre avec les resultats hydrologiques, les couches SIG et les tableaux de bord web.

## Contexte
- Domaine: eau, hydro-informatique, SIG, qualite des eaux
- Zone: bassin hydraulique du Sebou, Maroc
- Cible: equipe projet, ABHS Sebou, analysts, administrateurs metier
- Mission 4: collecte, integration des modeles, analyse/visualisation, reporting, deploiement, maintenance

## Stack confirmee
- Backend: FastAPI, SQLAlchemy, psycopg2
- Frontend: React 18, Vite, TypeScript, React Query
- Base de donnees: PostgreSQL, vues metier, couches geographiques PostGIS probables
- SIG: GeoJSON, Leaflet, MapLibre, Turf, proj4
- Auth: JWT HS256 + hash mot de passe

## Priorites pour l'agent
1. Preserver les contrats API deja consommes par le frontend.
2. Eviter les regressions sur les dashboards climat, hydro, qualite et SWAT.
3. Respecter le vocabulaire metier ABHS: bassin, sous-bassin, barrage, station, qualite, scenario, SWAT.
4. Privilegier les corrections minimales et verifiables.

## Ne jamais
- Renommer un endpoint public sans verifier son usage frontend.
- Introduire du SQL dynamique non securise sur les operations CRUD.
- Modifier les couches geographiques sans verifier SRID et structure GeoJSON.
- Exposer des secrets ou credentials dans le code.

## Points d'attention
- Deux couches d'API coexistent: `app/api/v1/*` et `app/routers/*`.
- Deux acces DB coexistent: SQLAlchemy et pool psycopg2.
- Le module `raw` autorise du CRUD generique: surface de risque elevee.
- Le modele de donnees SQLAlchemy visible est partiel par rapport a la base metier reelle.

## Workflow recommande
1. Lire le code backend et le frontend consommateur.
2. Verifier le schema ou la vue metier cible.
3. Faire un patch minimal.
4. Tester au moins le chemin critique impacte.
5. Documenter l'impact sur mission 4.

## Commandes utiles
- Backend: `cd backend && uvicorn app.main:app --reload --port 8000`
- Frontend: `cd frontend && npm run dev -- --port 3001`
- Build frontend: `npm --prefix frontend run build`
- Health: `http://127.0.0.1:8000/health`
