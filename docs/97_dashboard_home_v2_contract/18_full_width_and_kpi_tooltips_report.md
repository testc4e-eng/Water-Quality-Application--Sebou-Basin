# Home V2 full width and KPI tooltips report

## Largeur avant / après

- avant : cockpit encore limité par un conteneur `max-w` trop serré ;
- après : conteneur Home élargi à `max-w-[1800px]` avec occupation visuelle plus large ;
- la carte métier prend maintenant un ratio plus favorable :
  - `xl` : environ `72 / 28`
  - `2xl` : environ `74 / 26`

## Composants modifiés

- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/components/home-v2/HeroSection.tsx`
- `frontend/src/components/home-v2/SecondaryKpiPanel.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`

## Fichiers créés

- `frontend/src/lib/kpi-definitions.ts`
- `frontend/src/components/home-v2/KpiTooltip.tsx`

## Catalogue KPI ajouté

Le frontend embarque désormais :

- `KPI_DEFINITIONS`
  - `iqgb`
  - `ifd`
  - `icd`
  - `ich`
  - `ipp`
  - `isr`
- `OPERATIONAL_INDICATOR_DEFINITIONS`
  - `barrages_suivis`
  - `donnees_pluie_disponibles`
  - `stations_hydro_actives`
  - `stations_sentinelles_qualite`

## Exemples de tooltips

Chaque tooltip expose :

- `Titre KPI`
- `Définition`
- `Calcul`
- `Interprétation` quand disponible

Exemple :

- `IQGB`
  - définition : score synthétique de qualité globale bassin
  - calcul : synthèse qualité, paramètres critiques, fraîcheur
  - interprétation : plus le score est élevé, plus la situation est favorable

## Résultat build

- `npm run build` : `OK`

## Routes testées

- `http://localhost:5173/` : `200`
- `http://localhost:5173/accueil-sad` : `200`
- `http://localhost:5173/dashboard-carto-metier` : `200`

## Limites restantes

- les tooltips sont présents sur les KPI critiques du cockpit et sur `SecondaryKpiPanel`, mais pas encore sur les jauges `IFD / ICD / ICH` de la zone confiance ;
- le chunk frontend principal reste volumineux ;
- la largeur visuelle optimale dépend encore du zoom navigateur et de la résolution réelle.

## Décision finale

- `GO_HOME_V2_FULL_WIDTH_AND_KPI_TOOLTIPS_READY`
