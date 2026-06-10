# Home V2 cockpit one screen report

## Ancienne disposition

- grand hero séparé ;
- bande KPI séparée ;
- carte métier plus basse ;
- alertes et recommandations trop descendues ;
- synthèse basse encore trop narrative.

## Nouvelle disposition

### Ligne A

- mini identité projet ;
- 4 indicateurs opérationnels horizontaux ;
- 4 KPI critiques compacts sur la même ligne.

### Ligne B

- carte métier à gauche ;
- panneau décision compact à droite :
  - alertes
  - recommandations

### Ligne C

- qualité sentinelle compacte ;
- confiance données ;
- tendances compactes.

## Sections fusionnées

- hero narratif remplacé par un cockpit horizontal compact ;
- anciennes cartes KPI verticales supprimées du parcours principal ;
- en-tête carte remplacé par une barre compacte ;
- couches carte transformées en chips horizontaux ;
- alertes et recommandations fusionnées dans la zone décision de droite.

## Dimensions appliquées

- header compacté vers un mode proche `44–50px`
- sidebar ouverte réduite à `188px`
- sidebar compacte réduite à `56px`
- ligne A condensée en bandeau unique
- carte métier relevée et ramenée à `360–430px`
- panneau décision droit limité à la hauteur de la carte avec scroll interne
- zone basse compactée et note métier réduite à une seule ligne
- paddings et gaps globaux réduits à `2 / 3`

## Fichiers modifiés

- `frontend/src/components/Layout/Header.tsx`
- `frontend/src/components/Layout/Sidebar.tsx`
- `frontend/src/components/Layout/Layout.tsx`
- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/components/home-v2/HeroSection.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`
- `frontend/src/components/home-v2/AlertsPanel.tsx`
- `frontend/src/components/home-v2/RecommendedActionsPanel.tsx`
- `frontend/src/components/home-v2/BasinStatus.tsx`
- `frontend/src/components/home-v2/TrendPanel.tsx`
- `frontend/src/components/home-v2/LayerSummary.tsx`
- `frontend/src/components/home-v2/DataFreshnessBadge.tsx`

## Résultat build

- `npm run build` : `OK`
- `http://localhost:5173/` : `200`
- `http://localhost:5173/accueil-sad` : `200`

## Limites restantes

- la promesse “one-screen” dépend encore du zoom navigateur réel et de la hauteur exacte d’écran ;
- `BusinessMap` reste réutilisé tel quel, donc sa propre composition interne limite le compactage maximal ;
- le premier chargement peut encore paraître lent si `/api/v1/dashboard/home` répond lentement.

## Captures recommandées

- `1920x1080`
- `1600x900`
- `1366x768`

## Décision finale

- `GO_HOME_V2_COCKPIT_ONE_SCREEN_READY`
