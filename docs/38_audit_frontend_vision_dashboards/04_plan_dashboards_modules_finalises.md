# Plan dashboards modules finalisés

## Objectif

Industrialiser les modules suffisamment prêts pour une lecture DG/métier sans masquer leurs limites réelles.

## Dashboards retenus

| Dashboard | Objectif | KPI | Carte | Graphique | API requise | Test attendu |
| --------- | -------- | --- | ----- | --------- | ----------- | ------------ |
| Qualité réglementaire | piloter la qualité classifiable par station et par paramètre | nombre de paramètres classifiables ; état qualité par station ; dépassements par paramètre ; classement qualité ; alertes réglementaires ; fraîcheur des données | oui, stations classées | oui, évolution temporelle par paramètre | `/api/v1/quality/thresholds`, `/regulatory-status`, `/stations`, `/timeseries`, `/classify` | chargement, filtres, classification, cas non classifiable, erreur API |
| Pollution | piloter les pollutions recensées et leurs impacts potentiels avec garde-fous DEV | sources de pollution recensées ; rejets par type ; points non rattachés ; zones sensibles ; sources à valider ; sites prioritaires ; IPP | oui, carte pollution et actifs exposés | oui, distribution des incidents, impacts, priorités | `/api/v1/pollution/sites.geojson`, `/api/v1/pollution/latest-results`, `/api/v1/propagation/*`, `/api/v1/recommendations` | chargement GeoJSON, sélection site, propagation, message de limite scientifique, erreurs |
| Données / QA | piloter la qualité des données et le backlog d'arbitrage | paramètres non mappés ; valeurs nulles ; valeurs extrêmes ; données non injectées ; entités ambiguës ; classes vides ; décisions métier restantes | optionnelle, focalisée sur entités spatiales ambiguës | oui, répartition des anomalies et santé par domaine | `/api/v1/data-admin/classes*`, `/api/v1/data-admin/validation-rules`, `/api/v1/admin/data-availability` | compteurs, classes, règles, affichage vide, droits insuffisants |
| Administration / RBAC | piloter les rôles, permissions et flux d'administration | rôles actifs ; permissions ; accès par profil ; statuts change requests ; tests droits critiques ; activité d'audit | non prioritaire | oui, tableaux de droits et de workflow | `/api/v1/data-admin/*`, `/api/v1/admin/users/*`, `/api/v1/security/*` | token, rôle, permission, refus 401/403, journaux |

## Dashboard Qualité réglementaire

- Statut recommandé : `FINI_A_DASHBOARDISER`
- Garde-fous :
  - afficher le statut du référentiel `DEV_PARTIAL`
  - rappeler `surface_generale` comme contrat officiel actuel
  - distinguer `MO` et `Mo`

## Dashboard Pollution

- Statut recommandé : `FINI_A_DASHBOARDISER` avec garde-fous
- Garde-fous :
  - afficher `GO_DEV__NOGO_PREPROD`
  - afficher `propagation topologique visuelle`
  - ne pas présenter le module comme moteur hydraulique scientifique

## Dashboard Données / QA

- Statut recommandé : `FINI_A_DASHBOARDISER`
- Positionnement :
  - lecture simplifiée DG/métier
  - accès expert vers les détails `data-admin`

## Dashboard Administration / RBAC

- Statut recommandé : `FINI_A_DASHBOARDISER`
- Positionnement :
  - ne pas exposer inutilement les détails techniques aux profils non concernés
  - montrer clairement les droits actifs et les garde-fous réels

## Décisions de conception

- Les dashboards finalisés doivent tous afficher :
  - un badge de statut
  - la source API principale
  - la fraîcheur des données
  - un état vide pédagogique
  - un état erreur explicite
  - un lien ou panneau vers les limites connues
