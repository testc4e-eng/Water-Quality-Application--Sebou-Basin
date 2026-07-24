# Lecture globale - Phase actuelle du projet

## 1. Repositionnement

La lecture consolidee de la documentation et du contexte projet montre que le projet SAD Sebou / WQDSS n'est plus dans une phase principale de stabilisation globale.

La phase active correcte est la `finalisation du MVP metier`.

## 2. Phase projet corrigee

```text
PHASE 0  Conception                                Cloturee
PHASE 1  Migration et structuration des donnees    Cloturee
PHASE 2  Qualification et arbitrages metier        Cloturee
PHASE 3  Finalisation du MVP                       En cours
PHASE 4  Stabilisation plateforme                  A venir
PHASE 5  Validation metier finale / preprod        A venir
PHASE 6  Deploiement                               A venir
```

## 3. Definition de la phase active

La phase en cours doit etre pilotee sous la forme :

`FINALISATION_MVP`

avec la sequence suivante :

```text
P0  Corriger le Dashboard Accueil
P1  Concevoir et implementer le Dashboard Declaration de Pollution
P2  Analyser et integrer la matrice metier
P3  Valider le workflow metier complet
P4  Connecter le moteur de propagation
P5  Demonstration MVP complete
```

## 4. Consequence de pilotage

La stabilisation globale est volontairement gelee, sauf quand un bug empeche :
- d'ouvrir la plateforme ;
- de demontrer le MVP ;
- de poursuivre le chantier Declaration Pollution.

## 5. Priorite immediate

La priorite immediate est strictement limitee au `Dashboard Home` :
- verifier `GET /api/v1/dashboard/home` ;
- verifier le contrat JSON avec `DashboardHomeV2.tsx` ;
- verifier les dependances secondaires ;
- corriger uniquement la cause racine.

## 6. Chantier central ensuite

Le chantier principal devient `Declaration Pollution`.

Il doit etre traite en 4 etapes :
1. analyse metier ;
2. architecture ;
3. implementation MVP ;
4. validation.

## 7. Ce qui est volontairement repousse

Sauf bug bloquant, il faut repousser :
- optimisation performance ;
- refonte UX globale ;
- harmonisation complete des API ;
- nettoyage documentaire complementaire ;
- stabilisation des dashboards secondaires.
