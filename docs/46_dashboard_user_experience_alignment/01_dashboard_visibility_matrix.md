# Matrice de visibilité des dashboards

## Règle directrice

`AFFICHAGE_METIER_POSITIF_PAR_DEFAUT`

- Métier : information utile, validée, orientée décision.
- Expert : même base, avec contexte réglementaire et qualité des données.
- Admin/Dev : transparence complète QA, lineage, batchs, logs, anomalies.

## Matrice par dashboard

| Dashboard | Route | Métier | Expert | Admin/Dev | Éléments à masquer côté métier |
|---|---|---|---|---|---|
| Qualité réglementaire P0 | `/dashboard-qualite-reglementaire` | Oui | Oui | Partiel | seuils inactifs détaillés, codes de raison internes, audit complet mappings |
| Carto métier P0 | `/dashboard-carto-metier` | Oui | Oui | Non prioritaire | `source_backend`, `data_status`, détails endpoint, erreurs JSON brutes |
| Cartographique legacy / Observatoire V2 | `/dashboard-cartographique` | Partiel | Oui | Partiel | états `a venir`, contrôles techniques, abstractions legacy non stabilisées |
| Analytique climat/hydro/pollution | `/dashboard-analytique` | Oui après simplification | Oui | Partiel | thèmes mélangés, vues “pollution” sans borne hydraulique explicite |
| Pollution topologique | `/dashboard-pollution` | Non en préprod métier | Oui avec avertissement | Oui | QA topology, fallback, composants réseau, risque scientifique non validé |
| Pollution IDP DEV | `/pollution-idp-dev` | Non | Oui | Oui | route DEV entière hors menu métier principal |
| Métaux pilote | `/qualite/metaux` | Non comme dashboard principal | Oui | Oui | filtres QA détaillés, codes d’exclusion, vue pilote brute |
| Decision dashboard test | `/decision-dashboard-test` | Non | Oui | Oui | statut test, composants exploratoires |
| Data scan | `/admin/data-scan` | Non | Non | Oui | endpoint, erreurs techniques, couverture brute, scan controls |
| Ingestion admin | `/admin/ingestion` | Non | Non | Oui | QA scénario, triggers, détails import |

## Matrice d’information

| Type d’information | Métier | Expert | Admin/Dev |
|---|---|---|---|
| KPI métier | Oui | Oui | Oui |
| Tendances | Oui | Oui | Oui |
| Classe qualité réglementaire | Oui | Oui | Oui |
| Paramètres classifiables | Oui | Oui | Oui |
| Paramètres non classifiables | Section secondaire | Oui | Oui |
| Périmètre réglementaire actif | Discret | Oui | Oui |
| Version réglementaire | Oui | Oui | Oui |
| QA internes | Non | Résumé | Oui |
| Staging / batch / lineage | Non | Non | Oui |
| Orphelins / anomalies spatiales | Non | Résumé si impact métier | Oui |
| Logs / erreurs backend | Non | Non | Oui |
| Segments hydrauliques suspects | Non | Oui | Oui |
| Seuils inactifs `A_VALIDER` / `REJECTED` | Non | Oui | Oui |

## Décision de façade

- Le menu principal métier doit privilégier : qualité réglementaire, carto métier, analytique, température/climat, consultation.
- Les routes DEV, test et admin restent accessibles mais hors parcours métier par défaut.
