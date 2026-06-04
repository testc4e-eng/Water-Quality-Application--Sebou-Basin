# Phase 1 - Accueil SAD

## Objectif

Permettre à la DG de comprendre l'état du bassin en moins de 30 secondes.

## Statut Sprint 1

- `IMPLEMENTED_FRONTEND_MVP`
- page créée : `frontend/src/pages/AccueilSadPage.tsx`
- route active : `/` et `/accueil-sad`

## Composants réutilisés

- structure de navigation React existante
- patterns KPI déjà présents dans `DashboardQualiteReglementaire`
- données qualité déjà exposées côté backend
- données pollution déjà exposées côté backend

## Blocs à implémenter

### 1. État global du bassin

- carte KPI synthétique
- statut global :
  - `stable`
  - `sous surveillance`
  - `dégradation`
  - `critique`

### 2. Stations critiques

- top stations à traiter en priorité
- tri par sévérité puis fraîcheur

### 3. Pollutions prioritaires

- incidents actifs ou points à forte pression
- score métier lisible DG

### 4. Alertes ouvertes

- synthèse des alertes qualité, pollution, couverture

### 5. Confiance des données

- `IFD`
- `ICD`
- `ICH`

### 6. Recommandations immédiates

- maximum 3 à 5 recommandations
- format actionnable

## KPI visés

- `IQGB`
- `IFD`
- `ICD`
- `ICH`
- `IPP`
- `ISR`

## Dépendances immédiates

- `IQGB` : statut qualité station consolidé
- `IFD` : dates des dernières mesures utiles
- `ICD` : couverture, complétude, statuts non classifiables
- `ICH` : diagnostics réseau et propagation MVP
- `IPP` : pollution déclarée + résultats récents + propagation topologique
- `ISR` : agrégation par sous-bassin

## Implémentation UI recommandée

- hero KPI en haut
- colonne gauche : état global + recommandations
- colonne droite : stations critiques + pollutions prioritaires
- bandeau inférieur : alertes + confiance

## APIs cibles

- `/api/v1/quality/*`
- `/api/v1/qualite/*`
- `/api/v1/pollution/*`
- `/api/v1/propagation/*`
- `/api/v1/map/*`
- futurs endpoints KPI si agrégation serveur nécessaire

## Intégration réalisée

- KPI DG/Métier sous forme de cartes UI
- bloc stations critiques basé sur fraîcheur et volume de mesures
- bloc pollutions prioritaires basé sur `api.v_pollution_sites`
- bloc alertes ouvertes
- bloc confiance des données
- bloc recommandations immédiates

## Dépendances à documenter si non calculables immédiatement

- API KPI DG consolidée
- règles de criticité station
- règles de priorisation pollution
- score de confiance inter-domaines
