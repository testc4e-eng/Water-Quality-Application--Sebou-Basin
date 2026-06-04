# Taxonomie officielle projet

## Principes

Une anomalie detectee et documentee n'est pas un echec du projet.

C'est un resultat du controle qualite.

Le discours projet doit toujours distinguer :

### Mission C4E

- migrer
- controler
- qualifier
- documenter
- tracer
- proposer

### Responsabilite client

- arbitrer
- confirmer
- corriger
- valider
- completer

## Taxonomie recommandee

| Ancien terme | Nouveau terme |
|---|---|
| Blocage | Arbitrage métier requis |
| Donnée manquante | Donnée non fournie à ce stade |
| Anomalie bloquante | Cas nécessitant validation métier |
| Projet bloqué | Projet en attente d'arbitrage métier |
| Incohérence critique | Écart documenté |
| Erreur client | Donnée source nécessitant clarification |
| NOGO_PREPROD | Préproduction conditionnée par validation métier |
| Problème de qualité de données | Résultat du contrôle qualité de données |

## Regles de reecriture

1. Ne jamais modifier les faits, volumes, chiffres ou statistiques.
2. Requalifier uniquement l'interpretation et la responsabilite.
3. Eviter de presenter une incoherence source comme un retard de developpement.
4. Rappeler qu'une migration peut etre terminee meme si des arbitrages client restent ouverts.
5. Distinguer clairement :
   - realisation technique ;
   - qualite des donnees ;
   - arbitrage metier ;
   - validation client ;
   - responsabilites projet.

## Formulations de reference

### Formulation recommandée pour la cloture migration

`Migration realisee, controles effectues, anomalies identifiees, rapports transmis. Les cas residuels relevent d'arbitrages metier client ou de gouvernance continue.`

### Formulation recommandee pour IDP

`Pipeline IDP operationnel. Les cas ambigus residuels ont ete isoles dans des rapports d'arbitrage. La validation finale depend d'une decision metier sur l'identite de certaines entites spatiales.`

### Formulation recommandee pour les anomalies

`Les incoherences, doublons, ambiguïtés et cas non resolus ont ete identifies, documentes, traces et regroupes dans des supports d'arbitrage.`
