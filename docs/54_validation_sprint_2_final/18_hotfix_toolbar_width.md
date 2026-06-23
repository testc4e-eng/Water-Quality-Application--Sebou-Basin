# BUG C — TOOLBAR WORKSPACE TROP LARGE : Diagnostic et Correction

## Diagnostic
Le conteneur `AnalysisWorkspace` n'était pas dimensionné de manière stricte sur certains écrans. La div principale avait les classes CSS `w-full md:w-[60%]` combinées avec un positionnement parent fluctuant qui étirait la toolbar sur 100% de la largeur, provoquant une superposition indésirable sur la vue cartographique complète.

## Fichiers modifiés
- `frontend/src/components/analysis-workspace/AnalysisWorkspace.tsx`

## Corrections Appliquées
- La classe principale a été verrouillée à : `absolute top-0 right-0 w-[60%] h-full flex flex-col pointer-events-none z-10`.
- Cela contraint la div et, par héritage flexible, confine la barre d'outils analytique ("Workspace Analytique") strictement aux 60% alloués sur la partie droite de l'écran.

## Résultat
**Bug C corrigé (OUI) :** La toolbar ne dépasse plus la zone du Workspace de droite et n'entrave plus la vue MapLibre au-delà de sa délimitation.
