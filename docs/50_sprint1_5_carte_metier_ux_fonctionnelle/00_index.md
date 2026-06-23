# Sprint 1.5 - Carte Métier Analytique (UX Fonctionnelle)

Ce dossier documente les corrections et améliorations apportées à la Carte Métier Analytique lors du Sprint 1.5, afin de corriger les écarts UX et métier identifiés suite au Sprint 1.

## Objectifs du Sprint 1.5

1. **Correction des filtres `/features`** : S'assurer que seules les entités possédant des données pour les filtres sélectionnés (Domaine, Paramètre) sont affichées sur la carte.
2. **Symbologie & Contrôles** : Ajout de couleurs par support, d'une légende flottante, de clustering et de contrôles de navigation MapLibre.
3. **Popup Analytique** : Affichage d'un popup MapLibre au clic avec les infos clés et un bouton "Analyser" pour ouvrir le panneau.
4. **Panneau Droit Amélioré** : Affichage de KPIs statistiques sur les séries (Min, Max, Moyenne, etc.) et gestion propre des messages d'erreurs/vide.
5. **Performance & Robustesse** : Mise en place de cache React Query (`staleTime: 30000`), clustering et blocage des appels `/series` inutiles.

## Structure documentaire

- [01_corrections_filtres_features.md](01_corrections_filtres_features.md)
- [02_popup_et_panneau_analyse.md](02_popup_et_panneau_analyse.md)
- [03_symbologie_et_controles_carte.md](03_symbologie_et_controles_carte.md)
- [04_tests_api_frontend.md](04_tests_api_frontend.md)
- [05_limites_restantes.md](05_limites_restantes.md)
