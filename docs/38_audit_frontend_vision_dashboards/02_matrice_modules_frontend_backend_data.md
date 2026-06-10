# Matrice modules frontend / backend / data

## Matrice

| Module | Frontend | API | Données BD | Statut métier | Dashboard | Décision |
| ------ | -------- | --- | ---------- | ------------- | --------- | -------- |
| Accueil / dashboard général | OK | OK | partiel | à valider métier | partiel | `PARTIEL_A_COMPLETER` |
| Qualité réglementaire | OK | OK | partiel | partiel | OK | `FINI_A_DASHBOARDISER` |
| Stations | partiel | OK | OK | OK | absent | `PARTIEL_A_COMPLETER` |
| Barrages | partiel | OK | OK | OK | absent | `PARTIEL_A_COMPLETER` |
| Pollution | OK | OK | partiel | partiel | partiel | `FINI_A_DASHBOARDISER` |
| Analyses temporelles | OK | partiel | OK | partiel | partiel | `PARTIEL_A_COMPLETER` |
| SWAT | partiel | partiel | modèle non finalisé | modèle non finalisé | absent | `EN_CONSTRUCTION` |
| WASP | partiel | partiel | modèle non finalisé | modèle non finalisé | absent | `EN_CONSTRUCTION` |
| Prédiction pollution | absent | absent | données manquantes | modèle non finalisé | absent | `MODELE_A_VENIR` |
| Recommandations | partiel | OK | partiel | à valider métier | absent | `EN_CONSTRUCTION` |
| Anomalies / qualité données | OK | OK | OK | OK | partiel | `FINI_A_DASHBOARDISER` |
| Administration / RBAC | OK | OK | OK | OK | partiel | `FINI_A_DASHBOARDISER` |
| Reporting | absent | absent | partiel | à valider métier | absent | `NON_PRIORITAIRE` |

## Détails de lecture

| Module | Frontend réel | API principale | Signal data / métier |
| ------ | ------------- | -------------- | -------------------- |
| Accueil | `/`, `/accueil-sad` -> `DashboardHomeV2` | `GET /api/v1/dashboard/home` | Home V2 opérationnel mais lecture projet/DG incomplète |
| Qualité réglementaire | `/dashboard-qualite-reglementaire` | `/api/v1/quality/thresholds`, `/classify`, `/regulatory-status`, `/stations`, `/timeseries` | référentiel réglementaire encore `DEV_PARTIAL` |
| Stations | pas de page dédiée ; usages dans home/carte/legacy | `/api/v1/stations`, `/api/v1/map/entities`, `/api/v1/quality/stations` | données stables, sous-valorisées |
| Barrages | pas de page dédiée ; usages observatoire/home/carte | `/api/v1/observatory/barrage/*`, `/api/v1/map/entities` | données stables, pas de dashboard dédié |
| Pollution | `/dashboard-pollution`, `/pollution-idp-dev` | `/api/v1/pollution/*`, `/api/v1/propagation/*`, `/api/v1/recommendations` | pollution IDP `GO_DEV__NOGO_PREPROD` |
| Analyses | `/analyses`, `/dashboard-analytique` | observatory, quality specialized, climate/hydro legacy | architecture encore legacy |
| SWAT | `/dashboard-scenarios` | `/api/v1/swat/*`, `/api/v1/swat/analysis/*` optionnel | sandbox legacy, non décisionnel |
| WASP | `/dashboard-scenarios` | `/api/v1/swat/*` et ingestion legacy | sandbox legacy, non décisionnel |
| Prédiction pollution | aucun écran | aucun endpoint métier officiel | dépend SWAT/WASP + data quality |
| Recommandations | blocs embarqués | `GET /api/v1/recommendations` | moteur backend actif, lecture UI insuffisante |
| Anomalies / QA data | `/admin/data-governance/audit`, `/admin/data-scan` | `/api/v1/data-admin/*`, `/api/v1/admin/data-availability` | module 114 actif, forte valeur |
| Administration / RBAC | `/admin/*` | `/api/v1/data-admin/*`, `/api/v1/admin/users/*`, `/api/v1/security/*` | RBAC réel actif |
| Reporting | exports dispersés | aucun contrat dédié | pas de parcours de restitution structuré |

## Conclusion

- `FINI_A_DASHBOARDISER` : `Qualité réglementaire`, `Pollution`, `Anomalies / QA data`, `Administration / RBAC`
- `PARTIEL_A_COMPLETER` : `Accueil`, `Stations`, `Barrages`, `Analyses`
- `EN_CONSTRUCTION` : `SWAT`, `WASP`, `Recommandations`
- `MODELE_A_VENIR` : `Prédiction pollution`
- `NON_PRIORITAIRE` : `Reporting` en tant que module autonome immédiat
