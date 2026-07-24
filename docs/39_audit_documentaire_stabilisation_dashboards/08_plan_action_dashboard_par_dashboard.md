# Plan d'action - Finalisation du MVP

## Cadre

Le projet doit etre pilote par chemin critique metier.

## P0 - Corriger le Dashboard Accueil

### Objectif

Lever le blocage critique qui empeche d'utiliser et de demontrer la plateforme.

### Perimetre strict

1. verifier `GET /api/v1/dashboard/home` ;
2. verifier le contrat JSON backend/frontend ;
3. verifier les dependances secondaires KPI/recommandations/carte ;
4. corriger uniquement la cause racine.

### Critere de sortie

- le Dashboard Accueil s'affiche sans erreur ;
- aucun message d'echec n'est visible ;
- les KPI principaux sont visibles ;
- la plateforme est demonstrable.

## P1 - Analyse complete de la matrice metier

### Objectif

Transformer la matrice metier en specification exploitable.

### A extraire

- acteurs ;
- statuts ;
- transitions ;
- regles de validation ;
- donnees obligatoires ;
- decisions metier.

## P2 - Conception du workflow Declaration Pollution

### Objectif

Reconstituer le workflow metier complet avant toute implementation lourde.

## P3 - Conception technique

### Objectif

Definir :
- modele de donnees ;
- tables et relations ;
- API ;
- permissions ;
- notifications ;
- historique ;
- tracabilite.

## P4 - Developpement du Dashboard Declaration Pollution

### Objectif

Developper le MVP fonctionnel :
- formulaire de declaration ;
- liste des declarations ;
- tableau de bord operationnel ;
- carte des declarations ;
- suivi des statuts ;
- integration propagation.

## P5 - Validation MVP

### Objectif

Verifier :
- conformite workflow ;
- coherence donnees ;
- ergonomie ;
- demonstration avec cas reels.

## Phase suivante - Stabilisation plateforme

A enclencher apres completion du MVP, hors bugs critiques :
- optimisation frontend ;
- optimisation backend ;
- harmonisation API ;
- performance ;
- UX ;
- QA ;
- correction des bugs secondaires ;
- preproduction.
