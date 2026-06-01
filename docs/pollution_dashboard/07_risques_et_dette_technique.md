# Risques et Dette Technique du MVP Actuel

Lors de l'implémentation du MVP, des compromis nécessaires ont été réalisés pour assurer une démonstration rapide et visuelle. Il est crucial de bien comprendre cette dette technique avant de passer à l'échelle industrielle.

## 1. Risques Conceptuels
- **"L'Illusion Fonctionnelle"** : L'interface très aboutie (design soigné, icônes interactives, popups d'ETA) peut induire la Direction ou les Clients en erreur. Ils pourraient croire que le moteur hydrologique est déjà complet, ce qui peut générer des attentes irréalistes sur les délais de la Phase 1.
- **Faux Positifs/Négatifs** : La simulation actuelle basée sur la longitude peut désigner une station comme "impactée" alors qu'elle se trouve sur un affluent déconnecté du point d'impact.

## 2. Dette Technique à Résorber (Backend & Data)
- **Qualité des Données (SIG)** : La numérisation des oueds peut présenter des défauts critiques pour le routage (dangles, overshoots, directions inversées). *La préparation de la topologie risque d'exiger 80% du temps alloué à la Phase 1*.
- **Absence d'Indexation de Graphe** : Aucune structure de graphe n'existe. Les tables actuelles (`geo.reseau_hydrographique`) doivent subir une altération DDL (ajout de colonnes `source` et `target`).

## 3. Limites de l'Architecture Frontend
- La méthode consistant à télécharger *l'intégralité* du réseau hydrographique (`/geojson/reseau`) pour l'afficher côté client est viable pour 700 segments, mais s'effondrera (problème de performance RAM/Navigateur) si le réseau national complet est ingéré. À terme, il faudra passer sur un serveur de tuiles vectorielles (ex: Martin, ou pg_tileserv) et un moteur comme Deck.gl pour le rendu de grandes masses de données spatiales.
