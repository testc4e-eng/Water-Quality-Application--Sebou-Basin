# Home V2 ultra compact report

## Modifications réalisées

- passage du Home d’un layout narratif à un cockpit opérationnel dense ;
- fusion de la ligne haute en un bloc `mini hero + 4 indicateurs + 3 KPI critiques` ;
- réduction forte des hauteurs du header, de la sidebar et des cartes ;
- remontée de la carte métier à la ligne 2 ;
- compactage du panneau alertes et du panneau recommandations ;
- réduction du bloc tendances à 3 mini séries uniquement.

## Sections fusionnées

### Ligne 1

- `HeroSection` en mode `ultra-compact`
- `SecondaryKpiPanel` compact sous forme de bande horizontale dense

### Ligne 2

- `OperationalMap`
- panneau droit fusionné :
  - `AlertsPanel`
  - `RecommendedActionsPanel`

### Ligne 3

- `BasinStatus`
- `Confiance données`
- `TrendPanel`

## Dimensions cibles appliquées

### Header

- hauteur utile visée : `44px à 52px`
- logo réduit
- slogan réduit
- sous-titre masqué hors très grands écrans

### Sidebar

- ouverte : `196px`
- compacte : `60px`
- blocs bas masqués si `height < 900px`

### Hero

- bloc mini hero compact
- cartes opérationnelles resserrées
- suppression des longues descriptions visibles

### KPI

- cartes KPI réduites à une lecture :
  - code
  - valeur
  - label
  - statut

### Carte métier

- chips horizontaux pour les couches
- hauteur carte :
  - `340px` à `390px`

### Alertes / recommandations

- limite compacte :
  - `3 alertes`
  - `3 recommandations`
- scroll interne conservé

## Résultat build

- `npm run build` : `OK`

## Limites restantes

- la visibilité “complète sans scroll” dépend encore du zoom navigateur et du rendu réel de la carte ;
- `BusinessMap` reste réutilisé tel quel, donc la densité cartographique dépend encore de son propre layout interne ;
- le backend lent au premier appel peut encore retarder la perception de compacité.

## Décision finale

- `GO_HOME_V2_ULTRA_COMPACT_READY`
