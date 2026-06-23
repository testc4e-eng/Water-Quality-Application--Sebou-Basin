# Onglets Connectés

Les onglets suivants ont été implémentés et connectés de bout-en-bout à l'API unifiée :

1. **Vue d'ensemble (`QualityOverviewTab`)** : Indicateurs macro-scopiques.
2. **Temps réel / Sentinelles (`QualityRealtimeTab`)** : Restreint à 6 IRE métiers.
3. **Historique Rivières (`QualityHistoriqueTab`)** : `support_type='RIVIERE'`.
4. **Barrages (`QualityDamsTab`)** : `support_type='BARRAGE'`.
5. **Barrage de Garde (`QualityGuardDamsTab`)** : `support_type='BARRAGE_GARDE'` avec mention séparée de l'origine.
6. **Alertes & QA (`QualityAlertsQATab`)** : Règles rudimentaires (absence de mesure, dernière mesure > 1 an).
7. **Paramètres (`QualityParametersTab`)** : Référentiel unifié des paramètres avec recherche textuelle.
