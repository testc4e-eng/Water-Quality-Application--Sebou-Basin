# Manques et incohérences frontend

### FE-001 — Le module Scénarios SWAT / WASP simule une disponibilité qui n'existe pas

**Quoi**  
La page `/dashboard-scenarios` affiche des cartes SWAT/WASP mais redirige vers des dashboards opérationnels non dédiés aux modèles.

**Où**  
`frontend/src/pages/DashboardScenarios.tsx`

**Pourquoi c’est un problème**  
DG et métier peuvent croire que SWAT et WASP sont prêts alors que la documentation les classe comme dépendances externes non validées.

**Correction recommandée**  
Remplacer par un écran de statut `en construction` avec runs, dépendances, validations attendues et limites actuelles.

**Priorité**  
Critique

### FE-002 — Le dashboard Pollution mélange module métier et démonstrateur DEV

**Quoi**  
Le module `Pollution` s'appuie sur des données `GO_DEV__NOGO_PREPROD` et sur une propagation topologique MVP non scientifique, sans statut visible assez fort dans la navigation.

**Où**  
`frontend/src/pages/DashboardPollution.tsx`, `frontend/src/pages/PollutionIdpDevPage.tsx`

**Pourquoi c’est un problème**  
Le niveau visuel très abouti peut être interprété comme un feu vert métier complet.

**Correction recommandée**  
Conserver le module pollution mais afficher explicitement `DEV`, `topologique`, `non hydraulique scientifique`, et retirer `pollution-idp-dev` des parcours DG.

**Priorité**  
Critique

### FE-003 — L’administration expose encore une ingestion legacy non alignée sur le module 114

**Quoi**  
La route `/admin/ingestion` consomme les endpoints `/api/v1/ingestion/*`, alors que la cible officielle documentée est le module `data-admin`.

**Où**  
`frontend/src/pages/admin/IngestionPage.tsx`, `frontend/src/services/ingestionService.ts`

**Pourquoi c’est un problème**  
Le frontend montre deux paradigmes d'administration concurrents : ingestion legacy et gouvernance data officielle.

**Correction recommandée**  
Masquer la page legacy pour DG/métier et recentrer l'administration sur `/admin/data-governance/audit` et les flux `data-admin`.

**Priorité**  
Critique

### FE-004 — Il n’existe pas de dashboard dédié pour les stations alors que les données sont stables

**Quoi**  
Les stations apparaissent dans plusieurs écrans mais sans parcours dédié ni lecture synthétique claire.

**Où**  
`frontend/src/pages/DashboardHomeV2.tsx`, `frontend/src/pages/DashboardCartoMetier.tsx`, `frontend/src/pages/Dashboard2.tsx`

**Pourquoi c’est un problème**  
Un socle métier stable reste invisible en tant que brique de pilotage autonome.

**Correction recommandée**  
Créer une lecture stationnelle dans les dashboards finalisés `Qualité` et `Carte Métier`.

**Priorité**  
Élevée

### FE-005 — Il n’existe pas de dashboard dédié pour les barrages alors que les APIs sont disponibles

**Quoi**  
Les barrages sont visibles par fragments mais sans synthèse DG/métier.

**Où**  
`frontend/src/pages/DashboardHomeV2.tsx`, `frontend/src/api/observatory.ts`, `frontend/src/pages/Dashboard2.tsx`

**Pourquoi c’est un problème**  
Les barrages sont un sujet fort pour la DG mais ne sont pas valorisés comme module lisible.

**Correction recommandée**  
Ajouter des cartes barrage dans l'accueil DG et une sous-vue barrage dans `Carte Métier` ou `Analyses`.

**Priorité**  
Élevée

### FE-006 — Les recommandations existent côté backend mais n’existent pas comme module frontend identifiable

**Quoi**  
Le moteur `/api/v1/recommendations` est consommé localement dans quelques écrans, sans module transversal.

**Où**  
`frontend/src/api/decisionIntelligence.ts`, `frontend/src/pages/DashboardHomeV2.tsx`, `frontend/src/pages/DashboardPollution.tsx`

**Pourquoi c’est un problème**  
La proposition de valeur “aide à la décision” reste peu visible.

**Correction recommandée**  
Exposer un bloc transversal recommandations dans l'accueil DG et les modules finalisés ; si module autonome, l'étiqueter `en construction`.

**Priorité**  
Élevée

### FE-007 — Le frontend n’a pas de module Reporting alors que des besoins de restitution existent

**Quoi**  
Les exports sont dispersés dans plusieurs pages, sans écran de restitution consolidé.

**Où**  
pages et composants legacy de qualité, hydro, data scan, ingestion

**Pourquoi c’est un problème**  
La restitution DG/métier n’a pas de parcours explicite.

**Correction recommandée**  
Prévoir un sous-module de reporting rattaché aux dashboards finalisés et au support de restitution.

**Priorité**  
Moyenne

### FE-008 — La hiérarchie documentaire cible et la structure frontend réelle ne sont pas totalement alignées

**Quoi**  
La documentation projet cite des zones `frontend/src/routes/` et `frontend/src/layouts/`, alors que le routage est centralisé dans `App.tsx` et que les layouts vivent dans `components/Layout`.

**Où**  
`frontend/src/App.tsx`, `frontend/src/components/Layout/*`

**Pourquoi c’est un problème**  
La lecture du code et la traçabilité architecture/documentation sont moins évidentes.

**Correction recommandée**  
Soit créer une vraie couche `routes/layouts`, soit documenter explicitement l'écart dans l'architecture frontend.

**Priorité**  
Moyenne

### FE-009 — Les écrans legacy restent visibles sans badges de statut

**Quoi**  
`Dashboard2`, `DashboardAnalytique`, `DecisionDashboardTest` et certains flux observatoire restent atteignables sans qualification claire.

**Où**  
`frontend/src/App.tsx`, `frontend/src/components/Layout/Sidebar.tsx`

**Pourquoi c’est un problème**  
L’utilisateur ne distingue pas clairement `officiel`, `pilote`, `test`, `legacy`, `DEV`.

**Correction recommandée**  
Ajouter un système uniforme de badges de statut aux pages et à la navigation.

**Priorité**  
Élevée

### FE-010 — L’accueil DG ne montre pas le statut projet ni les décisions métier en attente

**Quoi**  
L’accueil opérationnel V2 montre les données du bassin, mais pas l’avancement projet, les dépendances métier ni les arbitrages restants.

**Où**  
`frontend/src/pages/DashboardHomeV2.tsx`

**Pourquoi c’est un problème**  
Pour la DG, le projet n’est pas seulement un observatoire ; c’est aussi un programme à piloter.

**Correction recommandée**  
Ajouter un bandeau `statut projet`, `modules finalisés`, `modules en construction`, `décisions attendues`.

**Priorité**  
Élevée
