# Audit KPI existants

## Contexte

Avant Sprint 1.5, plusieurs indicateurs DG existaient déjà dans le frontend, mais sous forme :

- de proxys locaux
- de calculs provisoires
- ou de placeholders UI non industrialisés

L'audit a porté sur :

- `frontend/src/lib/decision-metrics.ts`
- `frontend/src/pages/AccueilSadPage.tsx`
- `frontend/src/pages/DashboardQualiteReglementaire.tsx`
- `frontend/src/pages/DashboardPollution.tsx`
- `frontend/src/components/DashboardMetier/PanneauActionMetier.tsx`

## Synthèse

| KPI | État avant Sprint 1.5 | Source | Limite |
|---|---|---|---|
| `IQGB` | non calculé | placeholder frontend | dépendance backend |
| `IFD` | calcul local provisoire | dernière date station connue | proxy mono-source |
| `ICD` | calcul local provisoire | part de paramètres classifiables | pas d'agrégat global métier |
| `ICH` | score fixe provisoire | constante frontend | non industrialisé |
| `IPP` | calcul local MVP | pollution + propagation | non consolidé côté backend |
| `ISR` | non calculé | placeholder frontend | dépendance backend |

## Détail des calculs déjà présents

### KPI réellement calculés localement

- `IFD`
  - calcul via `daysBetween()` puis `freshnessScore()`
  - basé sur la dernière date station connue
- `ICD`
  - calcul via `confidenceFromRegulatoryStatus()`
  - basé sur la proportion de paramètres classifiables
- `IPP`
  - calcul MVP local via `pollutionRiskIndex()`
  - basé sur sévérité pollution, confiance de snap, distance vers garde, actifs atteignables

### KPI simulés ou figés

- `ICH`
  - renvoyé par `hydraulicConfidenceScore()`
  - valeur fixe `80`
  - proxy DG seulement

### KPI placeholders

- `IQGB`
  - `N/D`
  - note explicite : agrégat bassin à industrialiser côté backend
- `ISR`
  - `N/D`
  - note explicite : agrégation sous-bassin à brancher via backend métier

## Écrans impactés avant migration

### Accueil SAD

- consommait des métriques locales et des placeholders
- construisait des recommandations immédiates localement

### Carte Métier

- `PanneauActionMetier` utilisait surtout la classification locale d'une entité
- les actions recommandées restaient majoritairement heuristiques UI

### Qualité des Eaux

- le centre d'alertes n'était pas encore alimenté par un moteur d'alertes industriel

### Pollution

- utilisait déjà le backend propagation MVP V1
- `IPP` restait construit côté frontend à partir des réponses propagation

## Conclusion d'audit

Avant Sprint 1.5 :

- le frontend exposait déjà la bonne grammaire métier DG
- mais la couche d'intelligence restait fragmentée, locale et partiellement simulée

Le Sprint 1.5 industrialise cette couche côté backend sans casser :

- l'architecture des écrans
- les endpoints propagation déjà validés
- la séparation DG / Expert / Administration
