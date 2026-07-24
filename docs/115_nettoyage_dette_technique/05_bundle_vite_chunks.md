# Item #5 — Découpage du bundle Vite (fin du monolithe ~3,5 Mo)

**Fichier** : `frontend/vite.config.ts`
**Risque** : Moyen (config build — build de vérification exécuté avant commit)
**Date** : 2026-07-24

## Constat vérifié

Le build de production produisait **4 chunks** dont un **monolithe** :

```
3542 Ko  index-CbO_La4f.js   <-- tout le code + toutes les dépendances
 154 Ko  index.es-*.js
  27 Ko  DecisionDashboardTest-*.js
  22 Ko  purify.es-*.js
```

Aucun `manualChunks` ni `chunkSizeWarningLimit` n'était configuré, d'où
l'avertissement Vite « chunks larger than 500 kB » et un bundle unique de
3,5 Mo (mauvaise mise en cache : le moindre changement applicatif invalide
tout le bundle, dépendances lourdes comprises).

## Correctif appliqué

Ajout d'un `build.rollupOptions.output.manualChunks` isolant les dépendances
**« feuilles » lourdes** (importées par l'app sans ré-importer l'app) en
chunks vendor dédiés : `vendor-maplibre`, `vendor-export` (jspdf /
html2canvas / file-saver), `vendor-charts` (chart.js / recharts),
`vendor-xlsx`, `vendor-geo` (turf / proj4), `vendor-leaflet`. React, Radix et
le router restent dans un `vendor` commun.

`chunkSizeWarningLimit` porté à **1000 kB** : après découpage, quelques chunks
vendor restent > 500 kB par nature (maplibre, export PDF, socle React+UI) ;
toute régression au-delà de 1 Mo reste signalée.

### Itération sur un chunk circulaire

La première version isolait aussi React / Radix / router en chunks séparés,
ce qui provoquait un avertissement Rollup :
`Circular chunk: vendor -> vendor-react -> vendor`. Corrigé en laissant ces
paquets dans le `vendor` commun (seules les libs feuilles sont isolées).

## Résultat (build de vérification, `npm run build`)

Avant → après (aucun avertissement, ni circulaire ni taille) :

```
AVANT : 1 monolithe de 3542 Ko
APRÈS :
   966 Ko  vendor            (react + radix + router + utilitaires)
   942 Ko  vendor-maplibre
   712 Ko  index             (code applicatif)
   573 Ko  vendor-export
   298 Ko  vendor-charts
   282 Ko  vendor-xlsx
     1 Ko  vendor-geo
    28 Ko  DecisionDashboardTest (déjà code-splitté par route)
```

- Plus de bundle monolithique ; plus gros chunk = 966 Ko (contre 3542 Ko).
- `✓ built in ~36s`, exit 0, **aucun avertissement**.

## Constat annexe (hors périmètre, à investiguer)

`plotly.js` / `react-plotly.js` sont importés par 4 composants
`frontend/src/components/Charts/*.jsx` (Gauge, Heatmap, ScatterPlot,
TimeSeries) mais **n'apparaissent dans aucun chunk du build** : ils sont donc
*tree-shakés*, ce qui suggère qu'aucune route vivante n'atteint ces
composants. Candidat **code mort** (composants + dépendances plotly) à traiter
dans un item ultérieur après vérification des imports.

## Docs mises à jour

- `docs/115_nettoyage_dette_technique/00_index.md` : item #5 marqué corrigé.
