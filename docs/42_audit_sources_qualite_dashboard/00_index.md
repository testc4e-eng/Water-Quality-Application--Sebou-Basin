# Audit Sources Qualité Dashboard

- **Objectif** : Identifier, classifier et séparer les sources de données qualité vs pollution pour la stabilisation du Dashboard Qualité des eaux.
- **Périmètre** : Audit DB `abh_sad` en lecture seule.
- **Schémas inspectés** : `qualite`, `staging`, `metadata`, `api`, `infra`.
- **Nombre de tables inspectées** : ~215 (dont 10 tables cibles principales de qualité).
- **Conclusion courte** : Le modèle de données est très riche mais mêle plusieurs concepts (qualité, pollution, nappes, barrages). Pour le Dashboard Qualité réglementaire des eaux de surface (temps réel), il est indispensable de se brancher exclusivement sur `qualite.mesure_qualite_sebou` (pour les 6 sentinelles) ou `qualite.mesure_qualite_riviere` (historique étendu) et d'exclure formellement toutes les tables liées à la pollution (ex: `qualite.source_pollution_*`).
