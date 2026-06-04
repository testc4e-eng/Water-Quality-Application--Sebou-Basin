# Évaluation LSTM Readiness

## 1. Objectif
Préparer les modèles de Deep Learning temporel (LSTM) basés sur l'architecture Model Build et Feature Store, sans dépendre de SWAT/WASP ni du Graph.

## 2. Évaluation des Données Disponibles
- **Volume global :** 519 236 lignes.
- **Historique :** 1956 - 2025.
- **Stations :** 38 stations hydro.
- **Complétude :** L'évaporation est le point faible (74% null). Le débit et la précipitation sont les signaux de base.

## 3. Fenêtres Possibles (Lookback Windows)
Pour un LSTM, la taille de la fenêtre d'entrée (Séquence) est critique. Configurations à préparer :
- **7 jours :** Dynamique rapide (crues soudaines).
- **14 jours :** Régime de base.
- **30 jours :** Inertie mensuelle et fonte/recharge.
- **60 jours :** Tendance saisonnière.
- **90 jours :** Historique long de saison sèche/humide.

## 4. Cibles de Prédiction (Forecast Horizons)
- `Q_J+1` : Débit le lendemain.
- `Q_J+3` : Débit à 3 jours.
- `Q_J+7` : Débit à 1 semaine.

## 5. Stations Candidates Idéales
Sélectionner dans un premier temps le Top 5 des stations ayant :
1. Le plus long historique continu sans trous majeurs.
2. Une bonne corrélation amont-aval évidente.
3. Des mesures météo locales (pluviométrie) robustes associées.
