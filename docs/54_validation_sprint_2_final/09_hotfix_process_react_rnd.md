# BUG 1 — CRASH "process is not defined" : Diagnostic et Correction

## Diagnostic
Lors du redimensionnement des widgets, la librairie `react-rnd` crashait systématiquement avec l'erreur `ReferenceError: process is not defined`. Ce crash corrompait l'état interne du composant et gelait l'interface. 
La cause profonde était que `react-rnd` fait appel à `process.env.NODE_ENV` pour gérer ses logs en interne. Or, l'environnement de build **Vite** (contrairement à Webpack ou Node.js standard) n'injecte pas l'objet global `process` dans le navigateur par défaut.

## Fichier modifié
- `frontend/vite.config.ts`

## Corrections Appliquées
J'ai configuré Vite pour injecter un polyfill de l'objet `process.env` directement à la compilation, résolvant l'erreur à la racine pour toutes les dépendances :
```typescript
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': 'window',
  },
// ...
```

## Résultat
**Bug 1 corrigé (OUI) :** Le crash a disparu de la console au moment du redimensionnement et l'application compile sans erreur.
