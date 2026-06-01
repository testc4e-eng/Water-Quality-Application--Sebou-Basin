# Plan de nettoyage des dashboards

## Cibles immédiates

### 1. Dashboard qualité réglementaire

- Conserver comme dashboard métier officiel P0.
- Garder les `NON_CLASSIFIABLE` dans une section secondaire.
- Ne pas exposer `active_only=false`, `reason_code` ni les absents canoniques détaillés au métier.
- Ajouter plus tard un mode expert repliable pour couverture et exclusions.

### 2. Dashboard carto métier

- Conserver la hiérarchie métier comme navigation principale.
- Masquer à l’utilisateur métier :
  - endpoint appelé
  - payload d’erreur complet
  - `source_backend`
  - `data_status`
  - `legacy_support`
- Conserver ces éléments dans un panneau expert ou un drawer debug.

### 3. Dashboard pollution

- Remplacer le positionnement “simulation de propagation” par une lecture métier prudente.
- Garder visible seulement :
  - point déclaré
  - réseau atteint
  - stations/sites impactés
  - avertissement discret : validation hydraulique scientifique en cours
- Déporter le `QA Mode`, les composants topologiques, les micro-segments et cycles en version expert/admin.

### 4. Dashboard analytique

- Séparer visuellement :
  - climat/température
  - hydrologie
  - pollution/qualité
- Ne plus présenter “Hydrologie & Qualité” et “Pollution” dans la même logique de lecture métier sans contexte.
- Introduire une page ou des tabs métiers mieux nommés à terme.

### 5. Observatoire V2

- Conserver comme socle expert.
- Ne pas en faire l’entrée par défaut d’un utilisateur métier tant que les familles `a venir` et les modules exploratoires sont visibles.

## Composants à masquer côté métier

| Composant / motif | Action |
|---|---|
| `PollutionSidebar` toggle `QA Mode` | déplacer hors vue métier |
| `PollutionMap` légende QA complète | réserver expert/admin |
| `DashboardCartoMetier` bloc erreur API détaillé | transformer en message simple côté métier |
| `ObservatoryMenuV2` labels `a venir` | expert uniquement |
| `MetauxPage` filtre `qa_status` | expert/admin |
| `DataScanPage` endpoint et scan controls | admin uniquement |

## Composants à conserver pour expert

- statuts réglementaires.
- version active.
- périmètre `surface_generale`.
- couverture mesures/stations.
- paramètres observationnels.
- messages de limite scientifique.

## Composants à réserver admin/dev

- data scan complet.
- ingestion.
- logs et erreurs backend.
- validation hydraulique détaillée.
- arbitrage spatial QA.

## Nettoyage navigation

- Parcours métier principal :
  - `/dashboard-qualite-reglementaire`
  - `/dashboard-carto-metier`
  - `/dashboard-analytique` après simplification
- Parcours expert :
  - observatoire V2
  - pollution topologique avec disclaimer
  - écrans spécialisés qualité
- Parcours admin :
  - `/admin/*`
