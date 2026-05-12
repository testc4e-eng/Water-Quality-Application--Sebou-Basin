# Bloc données

## Problème racine

Données incomplètes ou non exploitables

## Description simple

Une partie des données existe, mais n'est pas directement exploitable en lecture métier. Certaines lignes sont incomplètes, certaines séries sont partielles, certaines variables sont totalement absentes, et certaines valeurs extrêmes doivent être qualifiées avant utilisation.

Ce bloc doit être lu avec une distinction claire entre :

- les anomalies sur des données présentes mais douteuses ;
- les manques de données, quand la donnée n'est pas disponible.

## Anomalies concernées

- A08 Données qualité nulles
- A09 Données météo manquantes
- A10 Température non disponible
- A14 Données extrêmes aberrantes

## Distinction importante

### Anomalies

- A08 : données présentes mais sans valeur exploitable
- A14 : données présentes mais incohérentes ou aberrantes

### Manques de données

- A09 : données météo partielles
- A10 : température absente de la base

## Symptômes observés

- lignes qualité sans résultat exploitable
- séries météo incomplètes
- absence totale de la température
- valeurs extrêmes nécessitant qualification

## Lecture stratégique

Ce bloc pose la question du niveau minimal de qualité nécessaire pour les analyses métier. Toutes les données présentes ne doivent pas être utilisées automatiquement, et toutes les données attendues ne sont pas encore disponibles.

Il faut donc décider :

- ce qui peut être utilisé immédiatement ;
- ce qui doit être signalé comme partiel ;
- ce qui doit être exclu ;
- ce qui doit être planifié comme manque à combler.

## Décision métier à prendre

- fixer la règle de traitement des lignes incomplètes
- fixer la règle de traitement des valeurs extrêmes
- définir le niveau minimal de complétude météo acceptable
- confirmer la priorité d'injection de la température

## Recommandation de pilotage

Présenter ce bloc comme un sujet de fiabilité de lecture. L'objectif n'est pas d'avoir tout immédiatement, mais de savoir clairement quelles données peuvent soutenir une décision métier sans ambiguïté.
