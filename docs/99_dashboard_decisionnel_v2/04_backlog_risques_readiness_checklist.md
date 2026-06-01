# Backlog, risques, readiness et checklist

## Backlog

1. brancher pollution / IDP dans la carte décisionnelle ;
2. remplacer la carte synthétique test par couche MapLibre métier ;
3. intégrer timeline réelle et clustering ;
4. définir seuils et alertes métier ABH ;
5. brancher hydrologie et météo spécialisées.

## Risques

| Risque | Impact | Gravité | Réponse |
|---|---|---|---|
| carte trop dense | perte d'usage DG | élevée | clustering + priorité récent |
| historique trop visible | bruit décisionnel | élevée | historique volontaire |
| multi-support mal hiérarchisé | confusion métier | élevée | support explicite |
| appels automatiques | dégradation perf | élevée | action explicite obligatoire |

## Readiness

- UX cible : `READY_FOR_ABH_REVIEW`
- architecture technique : `READY_FOR_BACKLOG_TECHNIQUE`
- timeline / heatmap / cluster : `GO_CONCEPTION`

## Checklist validation

| Question | Oui/Non | Commentaire |
|---|---|---|
| L'essentiel apparaît-il avant le détail ? | | |
| Le récent est-il prioritaire ? | | |
| L'historique reste-t-il secondaire ? | | |
| Les anomalies et alertes sont-elles lisibles ? | | |
| La stratégie clustering/heatmap est-elle comprise ? | | |
