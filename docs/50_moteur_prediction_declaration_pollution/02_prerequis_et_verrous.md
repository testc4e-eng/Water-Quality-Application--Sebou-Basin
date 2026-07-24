# Prerequis et verrous

## Prerequis metier

Avant toute prediction exploitable, il faut disposer de :

- un cycle de vie officiel des declarations ;
- des roles clairement attribues ;
- des statuts non ambigus ;
- des champs obligatoires stabilises ;
- des regles de validation documentees ;
- un historique des corrections et requalifications.

## Prerequis data

Le moteur ne doit consommer que des donnees qualifiees :

- declarations geolocalisees ;
- typologie source / rejet / support stabilisee ;
- horodatage fiable ;
- statut de validation present ;
- liens vers campagnes et mesures associees quand elles existent ;
- exclusions explicites des objets non fiables.

## Prerequis techniques

Le socle technique minimal attendu est :

- tables ou vues backend dediees au workflow `Declaration Pollution` ;
- contrat API stable pour lecture des declarations ;
- historisation des changements de statut ;
- referentiel geospatial de rattachement ;
- possibilite de rejouer un dataset d'apprentissage a date donnee.

## Verrous identifies

| Verrou | Impact | Decision actuelle |
| --- | --- | --- |
| Workflow metier non encore fige | impossible de definir la cible a predire | traiter d'abord le dossier `Declaration Pollution` |
| Donnees historiques heterogenes | risque de modele biaise | ne pas lancer de dataset officiel |
| Propagation encore en integration MVP | faiblesse des variables d'impact | garder la prediction au stade conception |
| Validation scientifique non terminee | prediction non defendable | interdire tout discours de mise en production |
| Qualite des statuts et labels pas totalement consolidee | bruit d'apprentissage | attendre la stabilisation metier |

## Regles de gouvernance

Toute future prediction devra respecter :

1. tracabilite des donnees sources ;
2. versionnement du dataset ;
3. separation `sandbox` / `metier` / `officiel` ;
4. explication minimale des scores ;
5. validation humaine obligatoire avant action.

## Conclusion operative

La bonne lecture n'est pas `modele a developper tout de suite`.

La bonne lecture est `moteur a concevoir maintenant, a implementer apres stabilisation du workflow, des donnees et des validations`.

