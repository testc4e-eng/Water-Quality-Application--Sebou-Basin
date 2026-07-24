# Rapport de passation projet SAD/WQDSS avant congé chef de projet

## 1. Résumé exécutif

Le projet SAD/WQDSS n'est plus dans une phase de construction de modules. Le socle existe. Le travail critique pendant l'absence du chef de projet est désormais un travail de stabilisation runtime, d'assainissement métier des données exposées et de préparation à la validation préproduction.

Constat consolidé au 2026-06-23 :

- le backend SAD réel est actif sur `http://localhost:8010/api/v1` ;
- le frontend build correctement ;
- la Carte Métier, le Dashboard Qualité et le Dashboard DG existent, mais deux sujets restent bloquants pour une validation sereine :
  - `dashboard/home` est encore trop lent ;
  - l'alignement métier de la Carte Métier et du Workspace doit rester sous contrôle strict.

Format de pilotage officiel :

```text
PHASE_ACTUELLE = STABILISATION_PREPROD + ASSAINISSEMENT_DONNEES_METIER
PROCHAINE_PHASE = CORRECTION_RUNTIME_CARTE_METIER + CORRECTION_RUNTIME_DASHBOARD_QUALITE + SEPARATION_TIME_SERIES_POINT_MEASURE
PREPROD_READY = NON
DEMO_DG_READY = NON
VALIDATION_METIER_READY = NON
CONFIANCE_GLOBALE = MOYENNE_FORTE
```

Priorités pendant l'absence :

1. sécuriser le runtime de la Carte Métier ;
2. sécuriser le runtime du Dashboard Qualité ;
3. réduire la latence de `GET /api/v1/dashboard/home` ;
4. documenter proprement la séparation métier `QUALITE_ABH` / `POLLUTION_IDP` ;
5. documenter proprement la séparation `TIME_SERIES` / `POINT_MEASURE` ;
6. préparer les validations métier D1, D2, D3 sans lancer de nouveaux chantiers.

Ce qu'il est interdit de lancer :

- Sprint 3 Carte Métier ;
- SWAT/WASP officiel ;
- IA / prédiction officielle ;
- reporting autonome ;
- migration destructive BD ;
- refonte des tables sources qualité ;
- présentation des sorties pollution comme scientifiquement validées.

## 2. Pipeline global du projet

| Étape | Objectif | Statut | Livrables / preuves | Niveau de confiance | Rôle concerné | Prochaine action |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Socle plateforme | Base `abh_sad`, FastAPI, Vite/React, sécurité, API v1 | TERMINEE_AVEC_RESERVES | `docs/00_source_of_truth/01_source_of_truth_consolidee.md`, code `backend/app/api/api_v1.py` | FORTE | Dev backend/frontend | maintenance uniquement |
| 2. Migration données | Consolidation hydro, météo, qualité, pollution | TERMINEE_AVEC_RESERVES | source of truth consolidée, vues `api.*` | FORTE | DBA / data | pas de migration sans validation |
| 3. Référentiel réglementaire | Base du réglementaire qualité C3 | TERMINEE_AVEC_RESERVES | `docs/92_referentiel_reglementaire_qualite_SAD/` | MOYENNE | Métier qualité | validation D3 restante |
| 4. Dashboards P0 | Socle cockpit, qualité, pollution, QA, admin | TERMINEE_AVEC_RESERVES | `docs/38_*`, `docs/39_*`, `docs/40_*` | MOYENNE | Frontend/backend | stabilisation runtime |
| 5. Dashboard DG | Cockpit exécutif | TERMINEE_AVEC_RESERVES | `frontend/src/pages/DashboardHomeV2.tsx`, `GET /dashboard/home` | MOYENNE | DG / frontend / backend | performance |
| 6. Dashboard Qualité | Vue métier qualité connectée | TERMINEE_AVEC_RESERVES | `docs/46_refonte_dashboard_qualite_metier/` | MOYENNE | Métier qualité / frontend / backend | sécuriser runtime + D3 |
| 7. Dashboard Pollution | Vue pollution assistée avec garde-fous | TERMINEE_AVEC_RESERVES | `docs/pollution_dashboard/`, propagation docs | MOYENNE | Pollution / frontend / backend | conserver badges DEV |
| 8. Carte Métier Analytique | Carte multi-supports + filtres + popup | TERMINEE_AVEC_RESERVES | `docs/47_*` à `docs/55_*` | MOYENNE | SIG / frontend / backend | stabilisation runtime |
| 9. Workspace analytique | Widgets graphiques / tableaux | TERMINEE_AVEC_RESERVES | `frontend/src/components/analysis-workspace/`, `workspaceStore.ts` | MOYENNE | Frontend | verrouiller `POINT_MEASURE` vs `TIME_SERIES` |
| 10. Data Admin | Gouvernance et qualité de données | TERMINEE_AVEC_RESERVES | `docs/114_data_admin_ingestion/` | FORTE | Data admin / admin | usage démontrable |
| 11. Propagation pollution | Moteur topologique non scientifique | TERMINEE_AVEC_RESERVES | `docs/80_moteur_pollution/`, `docs/110_*` | FORTE | Backend / pollution | ne pas sur-promettre |
| 12. Qualification métier | D1/D2/D3/D4 | EN_COURS | `docs/108_qualification_metier_preproduction/` | MOYENNE | Métier / chef de projet | ateliers après stabilisation |
| 13. Préproduction | GO conditionnel | BLOQUEE | `docs/113_preproduction_readiness/` | MOYENNE | Projet / client | lever P1 runtime et métier |
| 14. SWAT/WASP | Intégration scientifique officielle | BLOQUEE | docs SWAT/WASP legacy | FAIBLE | Reda / Anas / métier | ne pas lancer maintenant |
| 15. IA / prédiction | IA pollution / recommandations | NON_DEMARREE | documents de spécification | FAIBLE | Data science | hors priorité |
| 16. Reporting | Reporting DG / exports | NON_DEMARREE | documentation partielle | FAIBLE | Projet / DG | hors priorité |

## 3. Phases clôturées

### Architecture plateforme

- Objectif : mettre en place le socle `backend + frontend + DB + API v1`.
- Travail réalisé : routes v1, sécurité, dashboards, modules business-map, analysis, quality, admin.
- Livrables produits : code `backend/app/api/api_v1.py`, `frontend/src/App.tsx`, documentation source of truth.
- Données utilisées : base `abh_sad`.
- APIs concernées : `/api/v1/*`.
- Frontend concerné : navigation principale et dashboards.
- Backend concerné : routeurs v1 et services associés.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : dette runtime sur certains écrans, dette de performance `dashboard/home`.
- Ce qu'il ne faut pas rouvrir sans validation : architecture globale des routeurs et structure du dépôt.

### Dashboard DG audit / implémentation

- Objectif : fournir un cockpit DG avec KPI, alertes, statut modules, carte métier.
- Travail réalisé : audit, implémentation, reconnexion à la vraie API SAD.
- Livrables produits : `docs/38_audit_frontend_vision_dashboards/`, `docs/39_implementation_dashboards_clotures/`, `docs/40_validation_runtime_dashboards/`.
- Données utilisées : `dashboard/home`, tendances, blocs qualité/QA/RBAC.
- APIs concernées : `GET /api/v1/dashboard/home`.
- Frontend concerné : `frontend/src/pages/DashboardHomeV2.tsx`.
- Backend concerné : `backend/app/api/v1/dashboard.py`, `backend/app/services/dashboard/`.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : temps réel mesuré à `41.6 s` sur l'instance locale au 2026-06-23.
- Ce qu'il ne faut pas rouvrir sans validation : structure DG globale et navigation cible à 6 entrées.

### Dashboard Qualité V1

- Objectif : fournir une lecture métier qualité connectée aux données réelles.
- Travail réalisé : refonte, onglets connectés, sources unifiées, écrans qualité.
- Livrables produits : `docs/42_*`, `docs/43_*`, `docs/45_*`, `docs/46_refonte_dashboard_qualite_metier/`.
- Données utilisées : vues unifiées qualité, référentiel réglementaire.
- APIs concernées : `/api/v1/quality/*`, `/api/v1/quality/unified/stations`.
- Frontend concerné : `frontend/src/pages/DashboardQualiteReglementaire.tsx`.
- Backend concerné : `backend/app/routers/quality.py`.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : classification réglementaire officielle complète toujours conditionnelle ; risque runtime historiquement observé.
- Ce qu'il ne faut pas rouvrir sans validation : fusion physique des tables qualité.

### Dashboard Pollution

- Objectif : offrir une vue pollution assistée avec limites explicites.
- Travail réalisé : dashboard connecté, cartes et propagation reliées.
- Livrables produits : `docs/pollution_dashboard/`, `docs/70_dashboard_pollution/`, `docs/80_moteur_pollution/`.
- Données utilisées : sources pollution, propagation topologique, recommandations assistées.
- APIs concernées : `/api/v1/pollution/*`, `/api/v1/propagation/*`, `/api/v1/recommendations`.
- Frontend concerné : `frontend/src/pages/DashboardPollution.tsx`.
- Backend concerné : `backend/app/api/v1/propagation.py`, services propagation.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : module DEV, topologique, non hydraulique scientifique.
- Ce qu'il ne faut pas rouvrir sans validation : badges DEV et garde-fous scientifiques.

### Carte Métier Sprint 0

- Objectif : auditer les sources, supports, domaines et contrats.
- Travail réalisé : inventaire des sources et spécifications de base.
- Livrables produits : `docs/48_sprint0_audit_sources_carte_metier/`.
- Statut : `TERMINEE`.
- Réserves : aucune sur le cadrage.
- Ce qu'il ne faut pas rouvrir sans validation : matrice des supports et périmètre initial.

### Carte Métier Sprint 1

- Objectif : mettre en place le socle technique business-map.
- Travail réalisé : endpoints availability/features/series, route dédiée, écran carte.
- Livrables produits : `docs/49_business_map_backend_v1/`.
- APIs concernées : `/api/v1/business-map/availability`, `/features`, `/series`.
- Frontend concerné : écran carte V1.
- Backend concerné : `backend/app/routers/business_map.py`, `business_map_service.py`.
- Statut : `TERMINEE`.
- Réserves : pas de réserve structurelle.
- Ce qu'il ne faut pas rouvrir sans validation : contrat V1 des endpoints business-map.

### Carte Métier Sprint 1.5

- Objectif : stabiliser UX fonctionnelle.
- Travail réalisé : filtres, popup, sidebar, interactions.
- Livrables produits : `docs/50_sprint1_5_carte_metier_ux_fonctionnelle/`.
- Statut : `TERMINEE`.
- Réserves : stabilité runtime à revalider.
- Ce qu'il ne faut pas rouvrir sans validation : ergonomie de base validée.

### Carte Métier Sprint 2A

- Objectif : poser l'architecture analytique.
- Travail réalisé : architecture multi-support, batch series, modèles d'analyse.
- Livrables produits : `docs/51_sprint2_0_architecture_analytique/`, `docs/52_sprint2a_backend_batch_series/`.
- APIs concernées : `/api/v1/business-map/analysis/*`.
- Statut : `TERMINEE`.
- Réserves : dépend du bon usage métier des temporalités.
- Ce qu'il ne faut pas rouvrir sans validation : batch comme contrat d'analyse central.

### Workspace analytique Sprint 2B/2C/2D/2E

- Objectif : rendre la Carte Métier exploitable analytiquement.
- Travail réalisé : widgets, mode domaine, mode thématique, enrichissements popup et metadata.
- Livrables produits : `docs/51_sprint_2c_workspace_widgets/`, `docs/52_sprint_2d_mode_domaine/`, `docs/53_sprint_2e_cartes_thematiques_light/`, `docs/55_assainissement_donnees_carte_metier/09_cloture_sprint_2_checklist_e2e.md`.
- Frontend concerné : `components/DashboardMetier/V1/`, `components/analysis-workspace/`, `store/workspaceStore.ts`.
- Backend concerné : `analysis_service.py`, `business_map_service.py`.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : la documentation Sprint 2 dit `GO_SPRINT_3`, mais le pilotage actuel reporte Sprint 3 au profit de la stabilisation et de l'assainissement métier.
- Ce qu'il ne faut pas rouvrir sans validation : principe `TIME_SERIES -> chart`, `POINT_MEASURE -> table`.

### Data Admin module 114

- Objectif : gouvernance, qualité et administration des données.
- Travail réalisé : socle DB, API, UI, workflows de gouvernance.
- Livrables produits : `docs/114_data_admin_ingestion/`.
- APIs concernées : `/api/v1/data-admin/*`, `/api/v1/admin/*`.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : trajectoire opérateur / démonstration encore à finaliser.
- Ce qu'il ne faut pas rouvrir sans validation : ne pas remettre `/admin/ingestion` comme cible officielle.

### Propagation pollution MVP

- Objectif : exposer le moteur topologique de propagation.
- Travail réalisé : endpoints `source-to-*`, tests E2E, MVP backend V1.
- Livrables produits : `docs/80_moteur_pollution/`, `docs/110_preparation_moteur_propagation_pollution/`.
- APIs concernées : `/api/v1/propagation/source-to-garde`, `/source-to-stations`, `/source-to-barrages`.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : non scientifique.
- Ce qu'il ne faut pas rouvrir sans validation : formulation métier des limites.

### Réorganisation dépôt

- Objectif : nettoyer la racine sans casser l'existant.
- Travail réalisé : réorganisation contrôlée et validation post-réorganisation.
- Livrables produits : `docs/99_reorganisation_projet/`.
- Statut : `TERMINEE_AVEC_RESERVES`.
- Réserves : réorganisation validée, mais a révélé des problèmes runtime préexistants.
- Ce qu'il ne faut pas rouvrir sans validation : structure documentaire stabilisée.

## 4. Phases en cours

### STABILISATION_PREPROD

- Problème actuel : socle techniquement avancé, mais pas encore acceptable comme préproduction robuste.
- Symptôme observé : écrans critiques non encore totalement fiables pour validation formelle.
- Cause probable : dettes runtime, performance et cohérence métier.
- Fichiers à inspecter : `DashboardHomeV2.tsx`, `DashboardQualiteReglementaire.tsx`, `DashboardCartoMetier.tsx`, `api_v1.py`.
- Endpoints à tester : `dashboard/home`, `quality/*`, `business-map/*`, `business-map/analysis/*`.
- Règles à respecter : aucun nouveau module, aucune migration destructive.
- Action recommandée : sécuriser runtime + documenter écarts restants.
- Critère de sortie : écrans critiques stables, temps de réponse acceptables, tests de base passants.

### ASSAINISSEMENT_DONNEES_METIER

- Problème actuel : le dernier vrai risque projet n'est plus le code, mais la lecture métier des données exposées.
- Symptôme observé : risque de confusion entre supports qualité, pollution et types de séries.
- Cause probable : historique hétérogène des sources et des vues.
- Fichiers à inspecter : `business_map_service.py`, `analysis_service.py`, `workspaceStore.ts`, `WidgetTable.tsx`, `MapV1.tsx`.
- Endpoints à tester : `business-map/availability`, `business-map/features`, `business-map/series`, `business-map/analysis/series/batch`.
- Règles à respecter : `QUALITE_ABH != POLLUTION_IDP`, `TIME_SERIES != POINT_MEASURE`.
- Action recommandée : auditer et figer la lecture métier actuelle sans relancer Sprint 3.
- Critère de sortie : comportements frontend alignés avec `data_family` et `data_temporality`.

### CORRECTION_RUNTIME_CARTE_METIER

- Problème actuel : sujet prioritaire identifié dans les derniers audits de stabilisation.
- Symptôme observé : historique récent `Erreur catalogue.` lors de la validation fonctionnelle.
- Cause probable : incohérence catalogue frontend/backend ou payload incomplet.
- Fichiers à inspecter : `frontend/src/pages/DashboardCartoMetier.tsx`, `frontend/src/api/businessMapV1.ts`, `frontend/src/components/DashboardMetier/V1/*`, `backend/app/routers/business_map.py`, `backend/app/services/business_map_service.py`.
- Endpoints à tester : `GET /api/v1/business-map/availability`, `GET /api/v1/business-map/features?limit=5`, `GET /api/v1/business-map/object/{support_type}/{object_id}`, `POST /api/v1/business-map/analysis/series/batch`.
- Règles à respecter : ne pas casser le workspace, ne pas réactiver des vues legacy.
- Action recommandée : diagnostic ciblé catalogue + popup + ajout au workspace.
- Critère de sortie : carte charge, popup exploitable, ajout au workspace OK, aucun blocage catalogue.

### CORRECTION_RUNTIME_DASHBOARD_QUALITE

- Problème actuel : écran historiquement connecté, mais sujet à erreur runtime dans les validations fonctionnelles.
- Symptôme observé : `Erreur API : Network Error` dans l'historique de validation.
- Cause probable : timeout, retry, payload volumineux ou écart de contrat UI/API.
- Fichiers à inspecter : `DashboardQualiteReglementaire.tsx`, `QualityOverviewTab.tsx`, `QualityRealtimeTab.tsx`, `QualityHistoriqueTab.tsx`, `frontend/src/hooks/useQualityRegulatory.ts`, `backend/app/routers/quality.py`.
- Endpoints à tester : `GET /api/v1/quality/regulatory-status`, `GET /api/v1/quality/unified/stations`, autres endpoints qualité actifs selon onglets.
- Règles à respecter : ne pas présenter la classification réglementaire V2 comme terminée.
- Action recommandée : sécuriser chargement, erreur, vide, timeout.
- Critère de sortie : chargement des onglets sans erreur réseau bloquante.

### OPTIMISATION_DASHBOARD_HOME

- Problème actuel : le cockpit DG répond, mais trop lentement.
- Symptôme observé : `GET /api/v1/dashboard/home` mesuré à `41.6 s` le 2026-06-23.
- Cause probable : agrégation backend trop lourde, requêtes SQL coûteuses ou composition excessive.
- Fichiers à inspecter : `DashboardHomeV2.tsx`, `backend/app/api/v1/dashboard.py`, `backend/app/services/dashboard/`.
- Endpoints à tester : `GET /api/v1/dashboard/home`.
- Règles à respecter : ne pas dégrader les autres endpoints stables.
- Action recommandée : profiler le backend, isoler les blocs lents, viser `< 3 s`.
- Critère de sortie : réponse home DG compatible démonstration.

## 5. Phases bloquées

### Préproduction officielle

- Ce qui bloque : runtime non encore totalement stabilisé et arbitrages métier non clos.
- Qui doit arbitrer : chef de projet + équipe métier + client.
- Donnée / confirmation attendue : D1, D2, D3, temps de réponse acceptable, écrans sans erreur.
- Impact si non résolu : pas de GO PREPROD.

### Démonstration DG robuste

- Ce qui bloque : latence `dashboard/home` et besoin d'une fiabilité sans erreur visible.
- Qui doit arbitrer : chef de projet + DG côté validation finale.
- Donnée / confirmation attendue : wording validé, latence réduite, écrans stables.
- Impact si non résolu : démonstration fragile.

### Validation métier D1 / D2 / D3

- Ce qui bloque : la validation a besoin d'un runtime stable et d'une lecture métier propre.
- Qui doit arbitrer : équipe métier.
- Donnée / confirmation attendue : arbitrages pollution IDP, paramètres, réglementaire.
- Impact si non résolu : qualité conditionnelle, préprod retardée.

### IA / prédiction officielle

- Ce qui bloque : absence de socle validé et dépendance à SWAT/WASP.
- Qui doit arbitrer : projet + métier + data science.
- Donnée / confirmation attendue : préprod stable + données métier propres.
- Impact si non résolu : chantier non lançable.

### SWAT/WASP officiel

- Ce qui bloque : dépendance métier externe, validation scientifique non consolidée dans la plateforme.
- Qui doit arbitrer : Reda / Anas / métier.
- Donnée / confirmation attendue : résultats validés officiellement.
- Impact si non résolu : hors chemin critique court.

## 6. Défis majeurs rencontrés et solutions apportées

### Défi 1 — Mauvaise API runtime

- Problème : frontend initialement connecté à une mauvaise API / mauvais port.
- Solution : reconnexion au backend SAD réel sur `localhost:8010`.
- Règle : toujours vérifier `/health` ou, à défaut, les endpoints critiques avant validation UI.

### Défi 2 — Confusion Qualité ABH vs Pollution IDP

- Problème : risque de mélange métier entre stations qualité et points pollution.
- Solution / règle : classification par famille métier.
- Constante : `QUALITE_ABH != POLLUTION_IDP`.

### Défi 3 — Séries temporelles vs données ponctuelles

- Problème : un ajout au workspace pouvait ouvrir un graphique même quand les données étaient ponctuelles.
- Règle : classifier par `support + paramètre`.
- Constante : `TIME_SERIES != POINT_MEASURE`.
- Interdiction : jamais de graphique vide comme sortie par défaut.

### Défi 4 — Dashboard Qualité

- Problème : plusieurs sources qualité et référentiel réglementaire à faire coexister.
- Solution : vue unifiée + onglets + consommation API dédiée.
- Réserve : classification réglementaire complète reportée V2.

### Défi 5 — Carte Métier

- Problème : complexité forte de filtrage support/domaine/paramètre et synchronisation avec le workspace.
- Solution : `business-map API` + `availability / features / series` + `batch` + Zustand.

### Défi 6 — Performance

- Problème : `dashboard/home` lent et certaines requêtes business-map potentiellement coûteuses.
- Règles : préférer vues matérialisées, downsampling, pas de longues séries brutes, batch max 20 séries.

## 7. Règles et constantes à respecter

### Règles métier

```text
QUALITE_ABH != POLLUTION_IDP
TIME_SERIES != POINT_MEASURE
MIXED = résumé objet, pas décision d’affichage
STATION_SENTINELLE = 6 IRE validés
Pollution propagation = topologique, non hydraulique scientifique
Dashboard Pollution = DEV / garde-fous obligatoires
```

### Règles techniques

```text
ne pas modifier les tables sources sans migration validée
ne pas supprimer mesure_qualite_sebou
ne pas fusionner physiquement les tables qualité
préférer vues unifiées / vues matérialisées
batch max 20 séries
downsampling obligatoire
source_table obligatoire dans metadata
```

### Règles frontend

```text
MapLibre / react-map-gl, pas React-Leaflet
Zustand = état utilisateur
TIME_SERIES -> chart
POINT_MEASURE -> table/fiche
pas de graphique vide
ne pas réexposer pollution-idp-dev dans la navigation DG
```

## 8. Données / confirmations attendues équipe métier

| Élément | Qui doit répondre | Pourquoi c'est nécessaire | Impact si non validé |
| --- | --- | --- | --- |
| D1 : arbitrages pollution IDP | Équipe métier pollution | isoler ce qui est affichable et ce qui reste DEV | pollution reste conditionnelle |
| D2 : validation paramètres et noms métier | Équipe métier qualité / hydro | éviter libellés techniques ou trompeurs | lecture écran non validée |
| D3 : validation réglementaire C3 | Équipe métier réglementaire | officialiser la lecture réglementaire | badge PREPROD reste conditionnel |
| D4 : cas résiduels | INFORMATION_NON_TROUVEE | fermer les exceptions et arbitrages restants | backlog métier flou |
| Validation 6 stations sentinelles | Équipe métier qualité | confirmer la sélection métier | bloc qualité DG reste discutable |
| Validation des libellés affichés | Métier + chef de projet | cohérence DG / métier | risque de mauvaise interprétation |
| Confirmation paramètres observationnels | Hydro / qualité / pollution | cohérence des cartes et widgets | mauvais widget possible |
| Validation des règles `TIME_SERIES / POINT_MEASURE` | Métier + projet | fiabiliser le workspace | graphiques non pertinents |

## 9. Données / confirmations attendues client

| Élément | Pourquoi | Impact si non confirmé |
| --- | --- | --- |
| Niveau acceptable d'exposition pollution | éviter toute confusion DG | garde-fous insuffisants |
| Validation DG du wording | stabiliser le discours exécutif | démonstration fragile |
| Validation de la navigation cible | figer le périmètre visible | rework frontend inutile |
| Confirmation PREPROD conditionnelle | arbitrage projet/client | pas de trajectoire officielle |
| Arbitrage sur modules non scientifiques | cadrer pollution / SWAT / WASP / IA | mauvais niveau de promesse |
| Priorisation reporting / SWAT / WASP / IA | éviter dispersion | l'équipe repart sur de faux sujets |

## 10. Plan de délégation pendant 5 jours ouvrables

### Jour 1

- Tâche : diagnostic runtime Carte Métier + Dashboard Qualité.
- Fichiers : `DashboardCartoMetier.tsx`, `DashboardQualiteReglementaire.tsx`, `businessMapV1.ts`, `quality.py`.
- Endpoints : `business-map/availability`, `business-map/features`, `quality/regulatory-status`, `quality/unified/stations`.
- Livrable : note de diagnostic runtime.
- Critère OK : erreurs reproduites ou infirmées proprement.
- Point de blocage possible : environnement local différent de l'instance documentée.

### Jour 2

- Tâche : correction ciblée `Erreur catalogue` + `Network Error` si reproductibles.
- Fichiers : ceux issus du diagnostic Jour 1.
- Endpoints : idem + payloads détaillés.
- Livrable : rapport de correction courte.
- Critère OK : pages chargeables sans erreur visible.
- Point de blocage possible : dette backend plus profonde qu'attendu.

### Jour 3

- Tâche : audit et préparation assainissement `QUALITE_ABH / POLLUTION_IDP`.
- Fichiers : `business_map_service.py`, `analysis_service.py`, `MapV1.tsx`, `WidgetTable.tsx`.
- Endpoints : `business-map/availability`, `business-map/features`, `business-map/analysis/series/batch`.
- Livrable : note d'assainissement métier.
- Critère OK : lecture claire des familles de données.
- Point de blocage possible : cas mixtes non arbitrés métier.

### Jour 4

- Tâche : audit et préparation `TIME_SERIES / POINT_MEASURE`.
- Fichiers : `analysis.ts`, `workspaceStore.ts`, `WidgetTable.tsx`, `analysis_service.py`.
- Endpoints : `business-map/series`, `business-map/analysis/series/batch`.
- Livrable : note de décision widget / temporalité.
- Critère OK : règles de rendu documentées par type.
- Point de blocage possible : support réellement `MIXED`.

### Jour 5

- Tâche : synthèse, tests, liste des décisions à remonter au chef de projet.
- Fichiers : documentation de synthèse uniquement.
- Endpoints : revalidation rapide des endpoints critiques.
- Livrable : rapport de reprise.
- Critère OK : décision claire sur ce qui est fait, bloqué, à arbitrer.
- Point de blocage possible : validations métier indisponibles pendant l'absence.

## 11. Ce qu'il ne faut pas faire pendant l'absence

```text
ne pas lancer Sprint 3
ne pas lancer SWAT/WASP officiel
ne pas lancer IA
ne pas supprimer ou fusionner mesure_qualite_sebou
ne pas modifier les tables sources
ne pas faire de migration destructive
ne pas changer les règles réglementaires
ne pas présenter les résultats pollution comme scientifiques
ne pas remettre /admin/ingestion en avant
ne pas réactiver pollution-idp-dev en navigation DG
```

## 12. Checklists de reprise au retour du chef de projet

### Checklist technique

- [ ] endpoints critiques testés et documentés
- [ ] build frontend `npm run build` OK
- [ ] erreurs runtime Carte Métier et Qualité corrigées ou qualifiées
- [ ] logs propres
- [ ] `git status` compris et maîtrisé

### Checklist métier

- [ ] décisions D1 / D2 / D3 collectées
- [ ] réserves documentées
- [ ] séparation données ponctuelles vs séries clarifiée
- [ ] pollution IDP bien isolée

### Checklist préproduction

- [ ] Dashboard DG stable
- [ ] Dashboard Qualité stable
- [ ] Carte Métier stable
- [ ] Data Admin stable
- [ ] rapport de validation prêt

## 13. Vérifications réelles effectuées pour cette passation

### Git

- Commande : `git -C C:\dev\WQDSS\repo_git status --short`
- Constat : dépôt très chargé, avec de nombreux fichiers modifiés et non suivis, sans suppression visible dans l'extrait contrôlé.
- Fichiers modifiés notables : `backend/app/api/api_v1.py`, `backend/app/routers/quality.py`, `frontend/src/App.tsx`, `frontend/src/pages/DashboardCartoMetier.tsx`, `frontend/src/pages/DashboardQualiteReglementaire.tsx`, `frontend/src/pages/DashboardPollution.tsx`, `frontend/src/components/Layout/*`, `frontend/src/api/client.ts`.
- Fichiers non suivis notables : `backend/app/routers/business_map.py`, `backend/app/routers/analysis.py`, `backend/app/services/business_map_service.py`, `backend/app/services/analysis_service.py`, `frontend/src/api/businessMapV1.ts`, `frontend/src/api/analysis.ts`, `frontend/src/components/DashboardMetier/V1/*`, `frontend/src/components/analysis-workspace/*`, nombreux dossiers `docs/*`.
- Lecture de risque : risque élevé de conflit ou de travail non commité ; ne pas mélanger un correctif de stabilisation avec un nettoyage large.

### Commits récents

- Commande : `git -C C:\dev\WQDSS\repo_git log -n 5 --oneline`
- Résultat :
  - `44d000a perf: Optimize unified quality API endpoints to resolve 49s lag`
  - `4d0e5d3 feat: Quality Dashboard - Add timeout fallback and disable retries for slow endpoints`
  - `ba5b56b fix: Quality Dashboard - Fix infinite loading blocking runtime in tabs`
  - `5bf737f feat: Quality Dashboard - Add Historique Rivières tab and fix realtime UI`
  - `537a5d5 feat: Quality Dashboard - Add Temps Réel / Sentinelles tab`

### Backend runtime

- `docker compose ps` :
  - `sad-backend` : Up, `0.0.0.0:8010->8000`
  - `sad-frontend` : Up, `0.0.0.0:5174->5173`

### Endpoints testés

| Endpoint | Résultat | Temps | Lecture |
| --- | --- | --- | --- |
| `GET /api/v1/dashboard/home` | `200` | `41.6 s` | trop lent pour démo / préprod |
| `GET /api/v1/quality/regulatory-status` | `200` | `0.055 s` | OK |
| `GET /api/v1/quality/unified/stations` | `200` | `3.489 s` | OK avec payload réel |
| `GET /api/v1/business-map/availability` | `200` | `0.033 s` | OK |
| `GET /api/v1/business-map/features?limit=5` | `200` | `0.142 s` | OK |
| `POST /api/v1/business-map/analysis/series/batch` | `200` | `3.945 s` | OK |

### Extraits payloads utiles

- `quality/unified/stations` renvoie des stations réelles, par exemple `brg de garde / sebou`, avec `support_type`, coordonnées, `measure_count`, `parameter_count`, `date_min`, `date_max`.
- `business-map/features?limit=1` renvoie un `FeatureCollection` avec attributs métier comme `support_type`, `data_family`, `source_table`, `data_temporality`, `measurement_context`.

### Base de données, lecture seule

- Connexion identifiée via `backend/.env` :
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=5432`
  - `DB_NAME=abh_sad`
  - `DB_USER=postgres`

#### `api.mv_business_map_availability`

| support_type | domain | count |
| --- | --- | ---: |
| `BARRAGE` | `HYDROLOGIE` | 5 |
| `POINT_PRELEVEMENT_POLLUTION` | `POLLUTION` | 51 |
| `SOURCE_POLLUTION` | `POLLUTION` | 5 |
| `STATION_HYDRO` | `HYDROLOGIE` | 1 |
| `STATION_METEO` | `CLIMATOLOGIE` | 1 |
| `STATION_QUALITE` | `QUALITE` | 83 |
| `STATION_SENTINELLE` | `QUALITE` | 13 |

#### `api.mv_business_map_features_v1`

| support_type | count |
| --- | ---: |
| `BARRAGE` | 11 |
| `POINT_PRELEVEMENT_POLLUTION` | 141 |
| `SOURCE_POLLUTION` | 2026 |
| `STATION_HYDRO` | 41 |
| `STATION_METEO` | 5 |
| `STATION_QUALITE` | 57 |
| `STATION_SENTINELLE` | 6 |

#### `api.mv_business_map_last_values`

| support_type | count |
| --- | ---: |
| `BARRAGE` | 32 |
| `POINT_PRELEVEMENT_POLLUTION` | 3744 |
| `SOURCE_POLLUTION` | 1254 |
| `STATION_HYDRO` | 39 |
| `STATION_METEO` | 47 |
| `STATION_QUALITE` | 2609 |
| `STATION_SENTINELLE` | 78 |

#### Séparation métier / temporalité

La séparation est déjà visible dans la vue :

| support_type | data_family | data_temporality | count |
| --- | --- | --- | ---: |
| `POINT_PRELEVEMENT_POLLUTION` | `POLLUTION_IDP` | `POINT_MEASURE` | 51 |
| `SOURCE_POLLUTION` | `POLLUTION_IDP` | `POINT_MEASURE` | 5 |
| `STATION_QUALITE` | `QUALITE_ABH` | `POINT_MEASURE` | 17 |
| `STATION_QUALITE` | `QUALITE_ABH` | `TIME_SERIES` | 66 |
| `STATION_SENTINELLE` | `QUALITE_ABH` | `TIME_SERIES` | 13 |

Constat :

- `STATION_QUALITE`, `STATION_SENTINELLE`, `POINT_PRELEVEMENT_POLLUTION`, `SOURCE_POLLUTION` existent ;
- `ASSAINISSEMENT_TEMPORALITE = IMPLEMENTE_DANS_LA_VUE`, mais la traduction frontend/workspace doit rester strictement vérifiée.

### Build frontend

- Commande : `npm run build`
- Résultat : `OK`
- Réserve : chunk `assets/index-hCf7ytD-.js` à `3.56 MB`, warning Vite > `500 kB`.

## 14. Décision de passation

La passation est exploitable. La délégation peut être faite à une développeuse de l'équipe, à condition de lui transmettre explicitement que :

1. le projet est dans une phase de stabilisation et non de création de fonctionnalités ;
2. toute action doit rester centrée sur P1 ;
3. aucune migration ou refonte métier lourde ne doit être lancée ;
4. toute ambiguïté métier doit être remontée, pas arbitrée seule.

Verdict :

```text
PRET_DELEGATION = OUI
```
