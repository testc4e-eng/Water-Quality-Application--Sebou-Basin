# Architecture des Modes d'Affichage

Le Sprint 2D introduit le mode "Domaine" pour l'analyse thématique.

## 1. Store Zustand (`workspaceStore.ts`)
- Ajout de `mode: 'support' | 'domain' | 'thematic'`.
- Ajout de `selectedDomain` et `selectedParameter` pour dissocier l'état du mode domaine des filtres du mode support.
- Formatage conditionnel du titre du widget selon le mode (ex: `[Paramètre] — [Station]`).

## 2. BusinessSidebarV1
- Ajout de trois boutons "toggle" pour sélectionner le mode.
- Rendu conditionnel des filtres (Accordéons) selon le mode choisi.
- Les paramètres sont filtrés en fonction du domaine sélectionné pour le mode Domaine.

## 3. MapV1 & Popup
- Utilisation des `activeFilters` qui pointent soit vers `filters` (mode support) soit vers les sélections du store (mode domaine).
- L'appel au endpoint `GET /api/v1/business-map/features` utilise nativement `parameter_code` pour le filtrage côté backend.
- La Popup n'affiche désormais que le paramètre sélectionné en mode Domaine, cachant le reste du bruit analytique.
