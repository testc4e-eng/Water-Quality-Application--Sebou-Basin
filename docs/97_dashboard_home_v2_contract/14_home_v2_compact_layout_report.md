# Home V2 compact layout report

## Problèmes constatés

- header institutionnel encore trop haut ;
- sidebar ouverte trop consommatrice de largeur ;
- hero opérationnel trop vertical ;
- cartes opérationnelles trop grandes ;
- bande `État global du bassin` trop haute ;
- la carte métier commençait trop bas ;
- scroll initial trop important sur `1600x900` et surtout `1366x768`.

## Fichiers modifiés

- `frontend/src/components/Layout/Layout.tsx`
- `frontend/src/components/Layout/Sidebar.tsx`
- `frontend/src/components/Layout/Header.tsx`
- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/components/home-v2/HeroSection.tsx`
- `frontend/src/components/home-v2/SecondaryKpiPanel.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`
- `frontend/src/components/home-v2/DataFreshnessBadge.tsx`

## Ajustements appliqués

### Header

- padding vertical réduit ;
- logo réduit ;
- slogan central compacté ;
- badges droite compactés ;
- hauteur cible rapprochée de `56–64px`.

### Sidebar

- largeur ouverte : `216px`
- largeur compacte : `72px`
- compactage automatique si :
  - `width < 1400`
  - ou `height < 900`
- blocs bas masqués sous `900px` de hauteur.

### Conteneur principal

- largeur utile : `max-w-[1440px]`
- padding page réduit ;
- `gap` vertical réduit à `4`.

### Hero

- bloc gauche resserré ;
- cartes droite compactées ;
- paddings réduits ;
- valeurs conservées lisibles ;
- descriptions limitées visuellement.

### KPI globaux

- description supprimée visuellement ;
- seules restent :
  - icône
  - code KPI
  - valeur
  - label
  - statut
- hauteur visuelle fortement réduite.

### Carte métier

- header de bloc compacté ;
- boutons réduits en `size="sm"` ;
- hauteur cible abaissée vers `340–390px`.

### Fraîcheur

- badge compact encore resserré :
  - icône plus petite
  - padding plus fin
  - label plus compact.

## Résultat build

- `npm run build` : `OK`

## Limites restantes

- la densité est meilleure, mais la visibilité exacte “sans scroll” dépend encore du contenu réel du bloc carte et du zoom navigateur ;
- une recette navigateur réelle reste nécessaire sur :
  - `1920x1080`
  - `1600x900`
  - `1366x768`
- le backend lent peut toujours donner une impression de lourdeur au premier chargement.

## Décision

- `GO_HOME_V2_COMPACT_LAYOUT_READY`
