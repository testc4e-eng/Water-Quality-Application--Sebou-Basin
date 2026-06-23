# Panneaux flottants, Popups et Exports

La gestion de l'interface utilisateur repose sur une architecture sans contrainte de layout strict :

* **Carte MapLibre plein écran** : sert de canevas de base.
* **Panneaux latéraux flottants** : (Sidebar gauche, Barre droite analyse) semi-transparents et repliables, sans modifier les limites du canvas.
* **Popups d'objets** : Affichés au clic sur la carte, connectés dynamiquement au store Zustand.
* **Stratégie d'export (Dès la conception Sprint 0)** : Garantir la capture de l'état réel. Les exports PNG/PDF comprendront la carte, les couches visibles, la légende, les filtres appliqués et les panneaux sélectionnés par l'utilisateur.
