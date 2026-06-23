# BUG B — ERREUR CONSOLE `Expected value to be of type object, but found null instead` : Diagnostic et Correction

## Diagnostic
L'initialisation de l'état du store Zustand (`workspaceStore.ts`) assignait la valeur `null` à plusieurs variables métiers (comme `selectedDomain`, `selectedParameter`, etc.). 
Lorsqu'un composant essayait d'exploiter ou de formater une de ces propriétés en supposant qu'il s'agissait d'une chaîne de caractères (par exemple `activeFilters.domain?.toUpperCase()`), l'application générait une erreur silencieuse.

## Fichiers modifiés
- `frontend/src/store/workspaceStore.ts`

## Corrections Appliquées
Nous avons refactorisé les valeurs d'initialisation du store en les forçant en chaînes de caractères `''` ou valeurs par défaut :
- `selectedDomain: 'QUALITE'`
- `selectedParameter: ''`
- `selectedThematic: ''`
- `selectedSubThematic: ''`

## Résultat
**Bug B corrigé (OUI) :** Les composants peuvent extraire sans risque l'état du store et aucune erreur `null` n'apparaît dans la console.
