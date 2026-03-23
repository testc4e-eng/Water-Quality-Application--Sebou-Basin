# Architecture Applicative - SAD Sebou 2026

## 1. Synthese rapide
- L'architecture cible la plus coherente pour votre projet reste une architecture web 3 couches simple: frontend React, backend FastAPI, PostgreSQL/PostGIS.
- Cette architecture est deja en grande partie en place dans le repo; l'enjeu mission 4 est donc la consolidation, pas le redesign complet.
- La logique generale doit separer clairement consultation SIG, services API metier, acces aux donnees, et traitements/imports.
- Niveau de complexite: Moyen.

## 2. Architecture cible
- Vision d'ensemble: application web SIG d'aide a la decision, alimentee par une base metier hydro-qualite et exposee via API REST.
- Style architectural propose: monolithe modulaire.
- Principes directeurs:
  - simplicite et lisibilite
  - conservation de la stack existante
  - separation nette UI / API / data
  - stabilite des contrats API et des couches SIG

## 3. Composants principaux
- Frontend / interface utilisateur:
  - React + Vite + TypeScript
  - cartes, dashboards, pages login, data viewer
- Backend / API:
  - FastAPI
  - auth, couches, nomenclatures, dashboards climat/hydro/qualite, SWAT, raw
- Base de donnees:
  - PostgreSQL
  - tables metier + couches geographiques + vues `api.*`
- Services de traitement:
  - scripts ETL/import
  - agregations et preparation des resultats
- Integrations externes:
  - donnees partenaires / modeles / imports terrain selon mission
- Gestion fichiers:
  - imports ponctuels a conserver en perimetre maitrise

## 4. Flux applicatifs
- utilisateur -> frontend React
- frontend -> API FastAPI
- API -> PostgreSQL / vues metier
- API -> services de traitement si import, analyse ou agregations
- frontend -> endpoints couches et dashboards -> rendu carte/table/graphique

```text
Utilisateur
  -> Frontend React
  -> API FastAPI /api/v1
  -> PostgreSQL/PostGIS + vues metier
  -> reponse JSON / GeoJSON
  -> carte, dashboard, reporting
```

## 5. Alignement avec le besoin
- Alignement avec les objectifs: bon pour la centralisation, la visualisation et l'integration des resultats.
- Alignement avec les donnees: bon, car les tables/vues deja consommees sont compatibles avec cette architecture.
- Alignement avec les contraintes: bon pour une equipe reduite et une mission 4 progressive.
- Ecarts ou arbitrages:
  - unifier les routeurs backend
  - clarifier les jobs/imports
  - encadrer le module `raw`

## 6. Points forts
- Simplicite: pas besoin de microservices.
- Maintenabilite: stack connue et deja implementee.
- Scalabilite realiste: suffisante pour un SAD institutionnel.
- Adequation metier: bien adaptee au croisement SIG + series + indicateurs.

## 7. Points faibles
- Dette technique backend due aux deux styles de routes.
- Dependances critiques aux vues `api.*`.
- Risques de securite/gouvernance sur l'edition des donnees.
- Peu de socle visible pour observabilite et tests.

## 8. Bonnes pratiques
- Architecture:
  - garder un monolithe modulaire
  - normaliser la structure API
- SIG / hydrologie:
  - standardiser les sorties GeoJSON
  - verifier SRID, ids, relations spatiales
- Securite/gouvernance:
  - restreindre les operations decriture
  - tracer les actions admin
- Dev/deploiement:
  - centraliser config
  - ajouter tests sur flux critiques

## 9. Propositions
- Proposition 1: architecture MVP
  - perimetre: frontend actuel + backend actuel + base actuelle
  - benefices: rapide, proche de l'existant
  - limites: dette technique conservee
  - effort relatif: Faible
- Proposition 2: architecture intermediaire
  - perimetre: unification API + encadrement imports/raw + conventions data
  - benefices: meilleure stabilite mission 4
  - limites: demande refactoring cible
  - effort relatif: Moyen
- Proposition 3: architecture cible moyen terme
  - perimetre: observabilite, jobs formalises, reporting industrialise, CI/CD
  - benefices: meilleure exploitabilite institutionnelle
  - limites: hors MVP
  - effort relatif: Eleve

## 10. Recommandations
- Recommandation principale: privilegier l'architecture intermediaire.
- Option a privilegier: monolithe modulaire consolide autour de FastAPI + React + PostgreSQL/PostGIS.
- Points a valider:
  - perimetre exact du reporting mission 4
  - niveau d'administration autorise
  - liste officielle des flux critiques
- Sous-etape suivante recommandee: Design base de donnees.

## 11. Questions ouvertes
- Faut-il garder durablement deux couches de routeurs backend ?
- Quel perimetre exact pour les imports et traitements batch ?
- Quelle separation entre consultation et administration en production ?
