# Intégration future avec moteur de prédiction pollution

## Chaîne cible

1. Pollution déclarée ou simulée.
2. Propagation hydrologique/topologique validée selon le niveau de maturité du modèle.
3. Concentration prédite par paramètre et horizon.
4. Application des seuils réglementaires Tableau n°1.
5. Classification future par paramètre.
6. Calcul du risque global par paramètre le plus pénalisant.
7. Alerte station/barrage et recommandation opérationnelle.

## Sorties attendues

| Sortie | Description |
|---|---|
| `predicted_concentration` | Concentration prévue |
| `future_class_code` | Classe réglementaire prévue |
| `risk_level` | Niveau de risque opérationnel |
| `alert_target` | Station, barrage ou tronçon concerné |
| `regulatory_trace` | Source, version, seuil et règle utilisée |
| `recommendation` | Action proposée : surveillance, prélèvement, alerte, investigation |

## Garde-fous

Une prédiction sans seuil réglementaire validé reste une information de tendance, pas une alerte réglementaire. Le moteur doit exposer cette différence explicitement.
