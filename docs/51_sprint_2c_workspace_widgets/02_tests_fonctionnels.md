# Tests Fonctionnels Validés

## Fonctionnalités vérifiées :
- [x] Ajout au workspace depuis le popup de la carte (Création dynamique).
- [x] Déplacement du widget dans l'espace parent (Drag via `react-rnd`).
- [x] Redimensionnement fluide par l'utilisateur (Resize).
- [x] Réduction (Minimize) du widget pour cacher le contenu, et fermeture définitive.
- [x] Export PNG fonctionnel (via l'icône de caméra).
- [x] Export CSV fonctionnel avec génération de fichier automatique.
- [x] Synchronisation temporelle (le popover de la toolbar force l'update dans Zustand qui déclenche le re-fetch).

## Isolation des Systèmes :
- **Dashboard DG** : Intact.
- **Dashboard Qualité** : Intact.
- **Backend Batch API** : Réutilisé intégralement sans modification SQL ou Python.
