# Typologie des données et fraîcheur

## Contexte

Les sources SAD couvrent historiques, séries récentes, campagnes ponctuelles et futurs capteurs quasi temps réel.

## Analyse

La confusion entre ancien, récent et campagne dédiée crée une surcharge cognitive et des erreurs de lecture décisionnelle.

## Solution

| Classe | Définition | Usage |
|---|---|---|
| Temps réel | capteurs futurs | surveillance |
| Récent | 0-12 mois | décision actuelle |
| Moyen terme | 1-5 ans | tendance |
| Historique | >5 ans | comparaison |
| Archive / legacy | données anciennes ou remplacées | consultation |

## Règles de lecture

- `Récent` est la période par défaut en vue décisionnelle.
- `Moyen terme` sert à lire la tendance sans basculer dans l'archive.
- `Historique` et `Archive / legacy` doivent rester explicites et non mélangés à la carte décisionnelle par défaut.
- `Temps réel` est réservé au futur module capteurs.

## Traduction frontend test

- Filtre local de fraîcheur visible.
- Période recalculée automatiquement selon la classe choisie.
- Chargement API seulement après clic `Afficher`.
