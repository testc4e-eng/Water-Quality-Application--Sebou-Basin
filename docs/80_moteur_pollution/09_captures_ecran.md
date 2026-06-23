# 09 - Captures d'écran du MVP propagation

Ces captures seront prises après déploiement sur l'environnement de développement.

## Captures attendues

1. **Carte de signalisation** : réseau hydro + point de rejet positionné.
2. **Panneau de simulation** : formulaire avec polluant Cd, C0 = 5 mg/L, v = 10 km/h, λ = 0.05, 72 h.
3. **Résultats propagation** : chemin aval, métriques km/heures, stations impactées.
4. **Recommandations** : liste priorisée CRITICAL / WARNING.
5. **Export JSON** : confirmation du téléchargement.
6. **Avertissement modèle indicatif** : visible dans le panneau et les résultats.

## Emplacement des captures

À insérer dans `docs/80_moteur_pollution/assets/` :

- `01_signal_map.png`
- `02_simulation_panel.png`
- `03_propagation_results.png`
- `04_recommendations.png`
- `05_export_json.png`

## Notes

- Les captures doivent être prises sur `/dashboard-pollution-propagation`.
- Le réseau hydro doit apparaître en bleu clair (opacité 0.6).
- Le chemin de propagation doit apparaître en orange (#f59e0b).
