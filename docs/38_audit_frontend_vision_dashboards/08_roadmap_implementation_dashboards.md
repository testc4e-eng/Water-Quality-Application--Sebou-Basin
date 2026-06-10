# Roadmap d’implémentation dashboards

## Phase 1 — Audit et sécurisation

| Phase | Tâche | Fichier concerné | Responsable | Priorité | Test |
| ----- | ----- | ---------------- | ----------- | -------- | ---- |
| Phase 1 | ajouter badges de statut frontend | `frontend/src/App.tsx`, `frontend/src/components/Layout/Sidebar.tsx` | Frontend | Critique | navigation et badges visibles |
| Phase 1 | masquer ou déclasser `pollution-idp-dev` du parcours DG | `frontend/src/App.tsx`, sidebar | Frontend | Critique | route non exposée DG |
| Phase 1 | remplacer `/dashboard-scenarios` par écran `en construction` | `frontend/src/pages/DashboardScenarios.tsx` | Frontend | Critique | aucun faux lien SWAT/WASP |
| Phase 1 | sécuriser la visibilité de `/admin/ingestion` legacy | `frontend/src/App.tsx`, sidebar | Frontend | Critique | page cachée ou badgée legacy |

## Phase 2 — Dashboards modules finalisés

| Phase | Tâche | Fichier concerné | Responsable | Priorité | Test |
| ----- | ----- | ---------------- | ----------- | -------- | ---- |
| Phase 2 | consolider dashboard qualité réglementaire | `frontend/src/pages/DashboardQualiteReglementaire.tsx` | Frontend + Métier | Élevée | seuils, stations, classification |
| Phase 2 | consolider dashboard pollution avec garde-fous | `frontend/src/pages/DashboardPollution.tsx` | Frontend + SIG + Métier | Élevée | GeoJSON, propagation, messages |
| Phase 2 | créer vue synthétique Données / QA | `frontend/src/pages/admin/DataGovernanceAuditPage.tsx` ou nouvelle page dédiée | Frontend + Data | Élevée | compteurs, classes, états vides |
| Phase 2 | créer vue Administration / RBAC | pages admin + synthèse | Frontend + Backend | Élevée | permissions, refus, audit |

## Phase 3 — Dashboards modules en construction

| Phase | Tâche | Fichier concerné | Responsable | Priorité | Test |
| ----- | ----- | ---------------- | ----------- | -------- | ---- |
| Phase 3 | créer écran SWAT en construction | `frontend/src/pages/DashboardScenarios.tsx` | Frontend + Modèles | Élevée | badge, dépendances, statut |
| Phase 3 | créer écran WASP en construction | `frontend/src/pages/DashboardScenarios.tsx` | Frontend + Modèles | Élevée | badge, dépendances, statut |
| Phase 3 | créer écran prédiction pollution | nouvelle page | Frontend + Data Science | Élevée | affichage sans faux score |
| Phase 3 | structurer recommandations en bloc transverse | Home / Pollution / Carte Métier | Frontend + Métier | Moyenne | recommandations visibles et qualifiées |

## Phase 4 — Vision DG

| Phase | Tâche | Fichier concerné | Responsable | Priorité | Test |
| ----- | ----- | ---------------- | ----------- | -------- | ---- |
| Phase 4 | enrichir l'accueil exécutif | `frontend/src/pages/DashboardHomeV2.tsx` | Frontend + DG + Métier | Élevée | tuiles projet et décisions |
| Phase 4 | ajouter résumé d’avancement | Home V2 ou page dédiée | Frontend + PMO | Élevée | lecture en moins de 30s |
| Phase 4 | ajouter indicateurs clés projet | Home V2 | Frontend + PMO | Moyenne | contenu conforme docs |
| Phase 4 | ajouter décisions attendues | Home V2 ou page dédiée | Frontend + Métier | Élevée | décisions visibles |

## Phase 5 — Tests et validation

| Phase | Tâche | Fichier concerné | Responsable | Priorité | Test |
| ----- | ----- | ---------------- | ----------- | -------- | ---- |
| Phase 5 | tests API des dashboards | backend + frontend | QA + Backend + Frontend | Critique | endpoints 200/4xx/5xx |
| Phase 5 | tests frontend | pages finalisées | QA + Frontend | Critique | états vide, erreur, chargement |
| Phase 5 | tests rôles | admin/data-admin/users | QA + Backend | Critique | 401/403/permissions |
| Phase 5 | validation métier | dashboards finalisés | Métier + DG | Critique | go/no-go par module |

## Ordre recommandé

1. Sécuriser la visibilité et les statuts.
2. Finaliser `Qualité`, `Pollution`, `Données / QA`, `Administration`.
3. Encadrer `SWAT`, `WASP`, `Prédiction`, `Recommandations`.
4. Finaliser l'accueil DG.
