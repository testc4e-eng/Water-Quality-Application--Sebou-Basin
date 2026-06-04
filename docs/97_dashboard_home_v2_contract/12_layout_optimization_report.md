# Layout optimization report

## Problèmes constatés

- sidebar ouverte trop large par rapport à la largeur utile
- header trop haut pour un écran de supervision
- hero encore trop vertical
- bande KPI trop aérée
- carte métier pas assez haute dans la lecture visuelle initiale
- alertes trop dominantes et trop hautes
- scroll global trop important sur résolution laptop
- équilibre perfectible entre qualité, recommandations et confiance

## Fichiers modifiés

- `frontend/src/components/Layout/Layout.tsx`
- `frontend/src/components/Layout/Sidebar.tsx`
- `frontend/src/components/Layout/Header.tsx`
- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/components/home-v2/HeroSection.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`
- `frontend/src/components/home-v2/SecondaryKpiPanel.tsx`
- `frontend/src/components/home-v2/AlertsPanel.tsx`
- `frontend/src/components/home-v2/BasinStatus.tsx`
- `frontend/src/components/home-v2/TrendPanel.tsx`

## Ajustements de proportions réalisés

### Sidebar

- largeur ouverte réduite de `288px` à `240px`
- largeur compacte ramenée à `80px`
- mode compact automatique sous `1400px`
- blocs bas raccourcis
- densité verticale des entrées augmentée

### Header

- padding vertical réduit
- logo, slogan et widgets droits compactés
- hauteur utile rapprochée de l’objectif `72–88px`

### Conteneur principal

- largeur utile portée à `max-w-[1560px]`
- espacement vertical réduit à `gap-5`
- padding page réduit pour faire apparaître plus vite la carte

### Hero

- bloc texte resserré
- cartes opérationnelles compactées
- descriptions limitées en hauteur
- visuel plus horizontal

### KPI globaux

- rendu plus compact
- grille adaptative :
  - `2` colonnes petites tailles
  - `3` colonnes desktop compact
  - `6` colonnes très grand écran

### Carte métier

- la carte est remontée plus tôt dans la page
- hauteur cible réduite à une plage plus utile :
  - `430px` mini
  - `480px` sur grand écran
- panneau droit regroupé :
  - alertes
  - stations critiques
  - pollutions prioritaires

### Alertes

- mode compact introduit
- scroll interne
- `maxVisible=4` dans le panneau carte
- cartes plus courtes et badges plus petits

### Ligne Qualité / Recommandations / Confiance

- grille `12 colonnes`
- qualité `5`
- recommandations `4`
- confiance `3`

### Tendances

- bloc prévisions resserré
- bloc historique réduit
- hauteur visuelle globale abaissée

## Règles responsive appliquées

### >= 1536 px

- sidebar ouverte possible
- KPI en 6 colonnes
- carte + panneau droit en 2 colonnes

### 1280 à 1535 px

- sidebar compacte automatique
- KPI en 3 colonnes
- layout dense conservé

### 1024 à 1279 px

- sidebar compacte
- empilement progressif
- carte priorisée avant les panneaux secondaires

### < 1024 px

- sections empilées
- cartes et KPI conservent une lecture compacte

## Résultat npm build

- `npm run build` : `OK`

## Limites restantes

- validation visuelle réelle multi-résolution encore nécessaire dans un vrai navigateur interactif
- la lenteur de `GET /api/v1/dashboard/home` reste le principal frein UX
- le détail nominal des stations sentinelles n’est toujours pas exposé par le contrat backend
- la carte Home V2 reste une réutilisation de `BusinessMap`, pas encore une orchestration multicouche home-native

## Captures recommandées

- `1920x1080`
- `1600x900`
- `1366x768`
- laptop avec sidebar compacte
- laptop après toggle manuel sidebar ouverte

## Décision

`GO_HOME_V2_LAYOUT_OPTIMIZED`
