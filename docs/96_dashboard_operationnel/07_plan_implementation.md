# Plan d'implémentation

## Synthèse

L'implémentation doit se faire par convergence et réutilisation.

## Sprint 1 — Refonte accueil

### Objectifs

- remplacer le home KPI-technique par un home opérationnel ;
- brancher les 4 familles vivantes ;
- conserver l'architecture existante.

### Livrables

- `DashboardHomeV2.tsx`
- `HeroSection.tsx`
- `OperationalMap.tsx`
- `BasinStatus.tsx`
- `AlertsPanel.tsx`
- `TrendPanel.tsx`
- `GET /api/v1/dashboard/home`

### Dépendances

- contrat barrages ;
- contrat hydro ;
- contrat pluvio ;
- contrat qualité journalière.

### Risques

- typologie pluvio non consolidée ;
- support qualité journalière non stabilisé dans `api.v_qualite_terrain`.

### Charge estimée

- `6 à 8 jours` pour 2 personnes

## Sprint 2 — Carte métier opérationnelle

### Objectifs

- faire de la carte le cœur du SAD ;
- garder `DashboardCartoMetier` comme base ;
- ajouter les couches opérationnelles par défaut.

### Livrables

- évolution de `BusinessMap`
- `LayerControl.tsx`
- symbologies métier par famille
- endpoint `GET /api/v1/dashboard/map`

### Risques

- surcharge de carte si l'historique n'est pas filtré ;
- confusion si les couches secondaires sont actives par défaut.

### Charge estimée

- `5 à 7 jours`

## Sprint 3 — Centre d'alertes

### Objectifs

- rendre les alertes visibles et actionnables ;
- démarrer sans recalcul scientifique lourd.

### Livrables

- `GET /api/v1/dashboard/alerts`
- règles `HYDRO`, `PLUVIO`, `QUALITE`, `BARRAGE`
- option de persistance `analytics.alerts`

### Risques

- seuils non calibrés métier ;
- faux positifs si fraîcheur non intégrée.

### Charge estimée

- `4 à 6 jours`

## Sprint 4 — Tendances

### Objectifs

- ajouter des graphes courts lisibles ;
- éviter les écrans analytiques complexes au home.

### Livrables

- `GET /api/v1/dashboard/trends`
- courbe débit 30 jours
- histogramme pluie
- courbe apports barrage
- indice qualité synthétique

### Risques

- séries hétérogènes ;
- agrégation incohérente si station / barrage / qualité ne partagent pas la même granularité.

### Charge estimée

- `4 à 5 jours`

## Sprint 5 — Prévisions

### Objectifs

- introduire la première valeur prédictive à faible complexité

### Livrables

- météo 7 jours
- pluie spatiale complémentaire
- note de confiance prévisionnelle

### Dépendances

- connecteur `Open-Meteo`
- stratégie `GPM IMERG`

### Risques

- confusion prévision météo vs prévision hydro ;
- dépendance externe.

### Charge estimée

- `5 à 8 jours`

## Recommandation globale équipe 2 personnes

### Profil 1

- backend / data / SQL / intégration API

### Profil 2

- frontend React / cartographie / UX métier

## Charge totale réaliste

- `24 à 34 jours` selon la qualité des contrats de données opérationnelles

## GO / NO GO

### GO immédiat

- architecture métier ;
- home opérationnel ;
- carte métier recentrée ;
- alertes de première génération.

### GO conditionnel

- qualité journalière home si contrat d'exposition dédié est stabilisé
- pluvio hero si typologie station est consolidée

### NO GO immédiat

- prévisions hydrologiques locales sophistiquées
- intégration SWAT/WASP dans le home
- tableaux historiques complexes en page d'accueil
