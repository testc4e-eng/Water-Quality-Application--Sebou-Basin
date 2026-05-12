# Bloc paramètres

## Problème racine

Paramètres non stabilisés

## Description simple

Le système contient déjà beaucoup de données de qualité, mais les paramètres ne sont pas encore totalement harmonisés. Le même indicateur peut apparaître sous plusieurs noms, certains codes restent ambigus, et une partie des paramètres n'est pas encore complètement rattachée au dictionnaire métier attendu.

Le risque n'est pas seulement documentaire. Sans cadrage officiel, deux personnes peuvent lire différemment la même donnée.

## Anomalies concernées

- A01 Paramètres non standardisés
- A02 Paramètres ambigus H_G et sat
- A11 Incohérence noms et unités
- A13 Paramètres non mappés

## Symptômes observés

- noms multiples pour un même paramètre
- ambiguïtés sur certains codes historiques
- unités non totalement stabilisées
- rattachement incomplet au dictionnaire métier

## Lecture stratégique

Ce bloc concentre un risque de compréhension métier. Tant que les paramètres ne sont pas stabilisés, la lecture qualité reste partiellement fragile, même si les volumes de données sont importants.

Le sujet le plus sensible concerne les paramètres ambigus à fort impact, notamment `H_G` et `sat`, mais le problème est plus large : il faut figer le dictionnaire officiel de lecture.

## Décision métier à prendre

- valider un dictionnaire officiel des paramètres
- confirmer la signification officielle des codes ambigus
- fixer les unités de référence
- décider du traitement des paramètres encore non validés

## Recommandation de pilotage

Traiter ce bloc en priorité absolue. Sans dictionnaire officiel validé par l'ABH, la lecture métier des analyses qualité reste exposée à des interprétations divergentes.
