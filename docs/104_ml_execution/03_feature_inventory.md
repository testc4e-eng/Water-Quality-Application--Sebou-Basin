# Inventaire Réel des Features (Feature Inventory)

Basé sur le dataset hydro extrait (519 236 lignes), voici l'inventaire des features à implémenter pour les modèles tabulaires (XGBoost / LightGBM) en phase E1.2.

## 1. Features Hydrologiques
- `q_lag_1` : Débit à J-1
- `q_lag_3` : Débit à J-3
- `q_lag_7` : Débit à J-7
- `q_lag_14` : Débit à J-14
- `q_lag_30` : Débit à J-30
- `rolling_mean_7` : Moyenne glissante du débit sur 7 jours
- `rolling_mean_30` : Moyenne glissante du débit sur 30 jours
- `rolling_std_30` : Écart-type glissant du débit sur 30 jours

## 2. Features Météorologiques
- `rain_1d` : Précipitations cumulées à J-1
- `rain_3d` : Précipitations cumulées sur 3 jours
- `rain_7d` : Précipitations cumulées sur 7 jours
- `rain_30d` : Précipitations cumulées sur 30 jours
- `dry_days` : Nombre de jours consécutifs sans précipitation
- `wet_season_flag` : Indicateur binaire de la saison humide

## 3. Features d'Évaporation
**Attention :** Le taux d'évaporation est null à ≈ 74%.
- `evap_daily` : Valeur d'évaporation journalière
- `evap_availability_flag` : Indicateur de disponibilité (1 = disponible, 0 = null)
- `evap_imputed` : Valeur imputée selon la fraîcheur temporelle et la saisonnalité (application de la freshness-policy)
