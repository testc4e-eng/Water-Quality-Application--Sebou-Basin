# Roadmap MVP prediction

## Objectif

Definir une trajectoire realiste pour qu'un futur moteur prediction serve `Declaration Pollution` sans casser le chemin critique du MVP.

## Sequence recommandee

### P1. Cadrage metier

- figer les objets `declaration`, `dossier`, `statut`, `validation`, `alerte` ;
- choisir la cible a predire ;
- separer clairement `priorisation` et `prediction d'impact`.

### P2. Stabilisation data source

- normaliser les champs obligatoires ;
- qualifier les historiques disponibles ;
- definir les exclusions de donnees ;
- preparer une vue source rejouable.

### P3. Baseline interpretable

- construire un score par regles ;
- documenter la ponderation ;
- comparer le score aux attentes metier ;
- integrer la restitution dans les vues dashboard si utile.

### P4. Sandbox analytique

- creer un dataset versionne ;
- tester des modeles non officiels ;
- mesurer derive, biais et explicabilite ;
- produire un retour vers la gouvernance data.

### P5. Decision go/no-go

- si la qualite metier est suffisante, ouvrir un chantier modele officiel ;
- sinon, conserver uniquement le score interpretable comme aide a la priorisation.

## Definition du MVP strict

Le MVP strict du chantier prediction est atteint si :

- un score de priorite explicable existe ;
- les entrees sont tracees ;
- la restitution n'induit pas une decision automatique ;
- les utilisateurs comprennent pourquoi un dossier est classe prioritaire ;
- le moteur peut etre desactive sans casser le workflow declaration.

## Hors perimetre immediat

Ne pas inclure dans ce lot :

- benchmarking ML large ;
- couplage complet propagation + prediction ;
- generation de recommandations automatiques engageantes ;
- engagements de precision scientifique ;
- exposition client comme fonctionnalite finale.

## Point de pilotage

Decision recommandee :

`Documenter maintenant, concevoir maintenant, implementer progressivement apres stabilisation du workflow Declaration Pollution.`

