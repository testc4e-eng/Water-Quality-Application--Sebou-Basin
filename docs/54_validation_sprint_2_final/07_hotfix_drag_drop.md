# BUG B — Drag & Drop Mort : Diagnostic et Correction

## Diagnostic
Le drag & drop des widgets générés par `react-rnd` était figé. La librairie perdait l'accès aux événements de souris (`pointer events`) en raison de styles globaux sur l'overlay `AnalysisWorkspace.tsx` et `DashboardCartoMetier.tsx` qui captaient ou annulaient ces événements (`pointer-events-none`).

## Fichiers modifiés
- `frontend/src/components/analysis-workspace/AnalysisWidget.tsx`
- `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx`
- `frontend/src/pages/DashboardCartoMetier.tsx`

## Corrections Appliquées
1. **Container Principal (`DashboardCartoMetier.tsx`) :** 
   - Suppression du blocage `pointer-events-none` imbriqué inutilement sur de multiples niveaux. Le conteneur englobant prend bien tout l'écran (`absolute inset-0`) mais ne bloque pas la carte.
2. **Container d'espace de travail (`AnalysisWorkspace.tsx`) :**
   - L'espace de travail occupe désormais explicitement la section de droite (`right-0 md:w-[60%] flex flex-col pointer-events-none`) tout en laissant cliquer sur la carte en dessous. Les éléments enfants ont leurs propres comportements pointeurs.
3. **Propriétés Rnd explicitées (`AnalysisWidget.tsx`) :**
   - Ajout explicite du CSS in-line sur le composant Rnd : `style={{ position: 'absolute', pointerEvents: 'auto' }}` pour s'assurer que le composant capture la souris sans dépendre d'une classe Tailwind écrasée par la librairie elle-même.

## Résultat
**Bug B corrigé (OUI) :** Les widgets se déplacent désormais de manière fluide à l'intérieur du parent et peuvent être redimensionnés.
