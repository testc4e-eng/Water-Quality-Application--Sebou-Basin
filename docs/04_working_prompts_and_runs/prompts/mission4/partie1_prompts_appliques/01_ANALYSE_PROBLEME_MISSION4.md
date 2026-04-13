# Analyse des Problemes - SAD Sebou 2026

## 1. Synthese rapide
- Le projet SAD Sebou vise a centraliser des donnees hydro-climatiques, qualitatives et SIG dans une application web de consultation et d'aide a la decision.
- Une base technique existe deja, mais elle reste partiellement heterogene et peu formalisee sur les aspects architecture, gouvernance data et industrialisation.
- Le probleme principal n'est pas l'absence d'outil, mais la consolidation d'un systeme fiable, coherent et maintenable pour la mission 4.
- Enjeu principal: rendre le SAD robuste pour l'exploitation metier ABHS.
- Niveau de maturite du besoin: Moyen a bon.

## 2. Nature du probleme
- Probleme metier: besoin de lecture integree de la qualite des eaux, de l'hydrologie et des sorties de modeles.
- Probleme operationnel: la chaine collecte -> integration -> visualisation -> reporting n'est pas encore completement stabilisee.
- Probleme technique: coexistence de plusieurs styles de routeurs et de plusieurs modes d'acces a la base.
- Probleme de donnees: patrimoine riche, mais schema reel, qualite et tracabilite encore partiellement formalises.

## 3. Contexte metier et hydrologique
- Domaine concerne: SAD eau, SIG, hydrologie, qualite des eaux, modelisation.
- Processus impactes: consultation cartographique, analyse des series, lecture des indicateurs, exploitation des resultats SWAT.
- Acteurs impactes: ABHS Sebou, equipe projet, analysts, administrateurs, developpeurs SIG.
- Decisions impactees: suivi de la qualite des eaux, lecture territoriale des stations/barrages, interpretation des tendances et scenarios.

## 4. Symptomes observes
- Architecture backend mixte.
- Schema ORM visible tres incomplet par rapport a la base metier reelle.
- Module `raw` sensible sur le plan securite/gouvernance.
- Documentation contractuelle et technique encore partielle.
- Tests et industrialisation peu visibles.

## 5. Causes probables
- Causes racines:
  - construction du projet par etapes successives
  - priorite donnee a la fonctionnalite avant industrialisation
  - forte dependance aux vues et tables metier existantes
- Causes secondaires:
  - documentation du schema et des flux encore insuffisante
  - coexistence d'anciens et nouveaux patterns API
- Incertitudes a confirmer:
  - perimetre exact du reporting mission 4
  - gouvernance de mise a jour des donnees
  - niveau de validation fonctionnelle ABHS deja atteint

## 6. Points forts
- Frontend React et backend FastAPI deja en place.
- Modules climat, hydro, qualite et SWAT deja relies.
- Couches SIG et nomenclatures metier presentes.
- Authentification et exploration de donnees disponibles.

## 7. Points faibles
- Dette d'architecture backend.
- Couplage fort a la base reelle et aux vues `api.*`.
- Tracabilite des donnees et schema logique incomplets dans le repo.
- Surface de risque du CRUD generique.

## 8. Analyse des donnees
| Element analyse | Observation | Niveau de risque | Impact | Verification recommandee |
|---|---|---|---|---|
| Disponibilite | Beaucoup de sources visibles dans le code | Moyen | Positif mais dependant de la base reelle | Lister toutes les tables/vues critiques |
| Qualite | Qualite probable inegale selon domaines | Moyen | Peut fausser cartes et indicateurs | Verifier champs, unites, valeurs nulles |
| Historisation | Series temporelles presentes via vues | Moyen | Impact direct sur dashboards | Verifier profondeur historique |
| Continuite | Non prouvee dans le repo | Eleve | Risque sur analyses hydrologiques | Auditer les trous temporels |
| Granularite temporelle | Latest/daily/monthly/annual visibles | Faible a moyen | Bon potentiel analytique | Verifier cohérence entre vues |
| Granularite spatiale | Bassin, sous-bassins, stations, barrages disponibles | Moyen | Cle pour mission 4 SIG | Verifier relations spatiales |
| Tracabilite | Partielle | Eleve | Difficulte de maintenance | Documenter origine des vues et transformations |
| Interoperabilite | GeoJSON + API REST existants | Moyen | Favorable pour UI | Verifier referentiels et noms stables |

## 9. Impacts du probleme
- Impact operationnel: risque de lenteur ou d'incoherence dans l'exploitation quotidienne.
- Impact analytique: risque d'indicateurs ou cartes incomplets.
- Impact decisionnel: moindre confiance dans la decision appuyee sur le SAD.
- Impact qualite / maintenance: forte dependance aux personnes connaissant deja la base.

## 10. Bonnes pratiques
- Metier: definir un MVP mission 4 clair.
- Donnees: qualifier les vues critiques avant extension fonctionnelle.
- Developpement: unifier les conventions API et acces DB.
- Documentation/gouvernance: tracer les sources, unites, couches et dependances.

## 11. Propositions d'investigation
- Proposition 1: auditer les flux critiques mission 4.
  - objectif: identifier les parcours reels exploites
  - benefice: stabiliser le coeur utile
  - effort estimatif: Faible
- Proposition 2: cartographier les dependances data/API/frontend.
  - objectif: reduire le couplage implicite
  - benefice: faciliter la maintenance SIG
  - effort estimatif: Moyen
- Proposition 3: qualifier les couches et series critiques.
  - objectif: verifier la fiabilite metier
  - benefice: renforcer la credibilite du SAD
  - effort estimatif: Moyen

## 12. Recommandations
- Recommandation principale: cadrer mission 4 comme consolidation d'un SAD existant, pas comme demarrage from scratch.
- Priorites immediates:
  - verrouiller les couches SIG et les objets metier critiques
  - fiabiliser les flux climat/hydro/qualite/SWAT
  - clarifier le perimetre reporting/admin
- Sous-etape suivante recommandee: Clarification des objectifs.

## 13. Questions ouvertes
- Quels livrables exacts ABHS attend pour le reporting mission 4 ?
- Quelles operations `raw` doivent etre autorisees en production ?
- Quelle est la liste officielle des couches SIG de reference ?
- Quels indicateurs sont obligatoires pour la validation fonctionnelle ?
