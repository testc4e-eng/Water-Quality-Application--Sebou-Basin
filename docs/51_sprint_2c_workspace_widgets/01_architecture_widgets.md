# Architecture des Widgets

Le système est conçu autour d'une architecture modulaire s'appuyant sur les états globaux gérés par Zustand.

## 1. Store Zustand (`workspaceStore.ts`)
- Maintient un tableau de `AnalysisWidgetState`.
- Chaque widget possède une taille, une position, un état minimisé et une liste de requêtes de données.
- Lorsqu'une série est ajoutée depuis la carte, un widget est instancié automatiquement avec des dimensions par défaut.

## 2. AnalysisWorkspace
- Remplace l'ancien `BusinessRightPanelV1`.
- S'affiche en superposition à droite (60% de l'écran).
- Contient une barre d'outils globale (Synchroniser temps, Réduire tout, Fermer tout).

## 3. AnalysisWidget
- Composant enveloppe utilisant `react-rnd`.
- Gère la barre de titre, les boutons d'action (minimize, close) et gère le drag & drop (glisser-déposer).
- Effectue le rendu de contenu dynamique selon la prop `type` (`chart`, `kpi`, `table`).

## 4. Contenus de Widget
- **WidgetChart** : Recharts avec configuration dynamique multi-axes Y et export PNG via `html2canvas`.
- **WidgetKPI** : Cartes compactes calculées dynamiquement pour une visualisation tabulaire simple.
- **WidgetTable** : Table de données avec pagination simple et génération de CSV via `Blob` javascript.
