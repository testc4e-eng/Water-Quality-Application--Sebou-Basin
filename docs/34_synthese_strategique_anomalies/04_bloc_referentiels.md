# Bloc référentiels

## Problème racine

Référentiels non alignés

## Description simple

Le projet repose sur plusieurs référentiels : stations, barrages, sources historiques et structures transverses. Aujourd'hui, ces référentiels ne sont pas encore totalement alignés, ce qui crée des écarts de lecture et des ambiguïtés sur l'objet métier de référence.

Le sujet n'est pas seulement celui des doublons. Il concerne la cohérence globale entre les différentes sources de référence.

## Anomalies concernées

- A04 Doublons stations et barrages
- A12 Incohérence entre sources de données
- A15 Structuration des données non unifiée

## Symptômes observés

- homonymes sur stations et barrages
- plusieurs sources possibles pour une même information
- cadre de référence non totalement unifié

## Lecture stratégique

Tant qu'un référentiel unique n'est pas officiellement reconnu pour chaque domaine, la lecture métier reste exposée à des discussions récurrentes sur "quelle est la bonne référence".

Ce bloc porte donc sur la gouvernance métier des références.

## Décision métier à prendre

- définir quel référentiel fait foi pour les stations
- définir quel référentiel fait foi pour les barrages
- préciser la hiérarchie des sources en cas de divergence
- stabiliser un cadre transverse commun

## Recommandation de pilotage

Faire valider un référentiel de référence par domaine, puis documenter explicitement la hiérarchie entre les sources pour éviter les arbitrages implicites.
