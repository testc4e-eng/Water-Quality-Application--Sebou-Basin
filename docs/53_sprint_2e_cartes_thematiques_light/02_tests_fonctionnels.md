# Tests Fonctionnels Validés

## Actions de Validation

- [x] Compilation du frontend (`npm run build`) : Succès (aucune erreur TS).
- [x] Toggle Thématique activé : Le panneau gauche réagit correctement et affiche les nouveaux sélecteurs Thème/Métrique/Période.
- [x] Masquage des layers standards : Le mode Thématique désactive les layers `business-points` et `clusters` pour afficher son propre layer épuré.
- [x] Légende flottante : La légende s'adapte conditionnellement (elle n'affiche la palette spécifique que lorsque la sous-thématique appropriée est sélectionnée).
- [x] Rendu de la carte (pastilles) : Les expressions MapLibre traduisent correctement la donnée (pH, Débit, Sources) sous forme de cercles colorés ou redimensionnés.
- [x] Popup fonctionnel : Le clic sur un point affiche la métrique thématique sélectionnée.
- [x] Workflow Workspace : Le bouton `Ajouter au Workspace` insère correctement une série de données avec le label Thématique adapté.
- [x] Intégrité globale : Les basculements Support -> Domaine -> Thématique n'entraînent aucun plantage et les filtres sont correctement mémorisés.
