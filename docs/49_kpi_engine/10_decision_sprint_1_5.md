# Décision Sprint 1.5

## Ce qui est déjà disponible

- KPI Engine backend
- Alert Engine backend
- Recommendation Engine backend
- intégration frontend sur Accueil SAD, Carte Métier, Qualité, Pollution

## APIs créées

- `GET /api/v1/kpi/overview`
- `GET /api/v1/kpi/stations`
- `GET /api/v1/kpi/subbasins`
- `GET /api/v1/kpi/pollution`
- `GET /api/v1/alerts`
- `GET /api/v1/recommendations`

## Charge réalisée

- backend services métier
- exposition API
- migration frontend ciblée
- documentation Sprint 1.5

## Risques restants

- obsolescence réelle d'une partie des mesures
- `IPP` topologique non scientifique
- pas encore d'historisation versionnée des KPI
- nécessité future d'agrégats backend plus avancés pour les analyses temporelles multi-campagnes

## Backlog Sprint 1.5 restant

### P0

- recette métier DG sur valeurs `IQGB`, `IFD`, `ICD`, `ICH`, `IPP`, `ISR`
- calibration métier des seuils d'alertes

### P1

- enrichissement des alertes par contexte sous-bassin
- recommandations plus spécifiques par type d'actif

### P2

- historisation des KPI
- comparaison temporelle multi-campagnes
- version experte détaillée des moteurs

## Décision finale

`GO_SPRINT_1_5_KPI_AND_ALERT_ENGINE`
