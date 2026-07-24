# Multi-graphes synchronisés

L'un des apports majeurs de la V2 est la capacité d'analyser les corrélations via la superposition et la synchronisation de multiples sources de données.

## 1. Superposition simultanée
L'utilisateur peut superposer sur un même graphique plusieurs séries. Exemple :
```text
Débit + Précipitation + Cadmium + Lâcher barrage
```

## 2. Gestion des axes
- **Multi-axes Y automatiques** : L'application gère automatiquement l'ajout d'axes Y supplémentaires et l'harmonisation des unités.
- La règle des unités validée lors du Sprint précédent est appliquée pour regrouper les séries de même unité.

## 3. Multi-cartes miniatures
Au-delà des graphiques classiques, il est possible d'avoir :
- Une **Carte principale**
- Des **cartes miniatures synchronisées** (ex: température / précipitation) en fenêtres flottantes qui suivent les déplacements (pan/zoom) de la carte principale.
