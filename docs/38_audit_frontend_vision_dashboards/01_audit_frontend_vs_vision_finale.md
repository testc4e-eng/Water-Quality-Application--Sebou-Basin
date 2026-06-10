# Audit frontend vs vision finale

## Contexte

La vision finale du SAD impose une lecture par enjeux métier et décision, avec une séparation explicite entre :

- modules finalisés et exploitables ;
- modules partiels mais démontrables ;
- modules en construction ;
- modules externes ou à venir.

## Analyse

| Module | Vision attendue | Existant frontend | Écart | Priorité | Action |
| ------ | --------------- | ----------------- | ----- | -------- | ------ |
| Accueil / dashboard général | cockpit DG lisible en moins de 30 secondes, statut bassin, alertes, décisions, avancement projet | `/` et `/accueil-sad` pointent vers `DashboardHomeV2` | accueil opérationnel réel mais statut projet, modules finalisés/en construction et décisions métier restantes sont peu visibles | Élevée | compléter l'accueil par tuiles `statut projet`, `modules prêts`, `modules en construction`, `décisions attendues` |
| Qualité réglementaire | dashboard décisionnel qualité avec KPI, alertes, stations, historique, classification | `/dashboard-qualite-reglementaire` existe, connecté à `/api/v1/quality/*` | module bien avancé mais dépend d'un référentiel encore `DEV_PARTIAL` et reste centré surface générale | Élevée | industrialiser comme dashboard finalisé avec badge de statut réglementaire et garde-fous métier |
| Stations | vue stationnelle métier claire, accès par station, synthèse KPI et séries utiles | pas de page dédiée ; présence diffuse dans `Dashboard2`, `DashboardCartoMetier`, `DashboardHomeV2` | module stable côté données mais sous-valorisé, dilué dans des écrans legacy | Élevée | intégrer les stations dans un dashboard finalisé `Qualité` + `Carte Métier`, pas comme écran legacy autonome |
| Barrages | vue barrage métier, niveau, volume, apports, lâchers, alertes | pas de page dédiée ; données visibles dans `Dashboard2`, observatoire, home V2 et carte métier | données stables mais pas de dashboard barrage lisible DG/métier | Élevée | valoriser barrages dans `Accueil DG` et `Carte Métier`, puis prévoir sous-vue barrage |
| Pollution | inventaire pollution, carte, impacts prioritaires, risques, recommandations, limites explicites | `/dashboard-pollution` existe ; `/pollution-idp-dev` legacy DEV existe | confusion entre démonstrateur DEV, module métier et propagation MVP non scientifique | Critique | conserver le dashboard pollution mais afficher clairement `DEV / topologique / non hydraulique`, masquer `pollution-idp-dev` de la navigation DG |
| Analyses temporelles | écran d'analyse expert/métier avec filtres, séries, comparaisons, lecture claire | `/analyses` -> `DashboardAnalytique` legacy multi-thèmes | écran générique, encore organisé par widgets et non par questions métier | Élevée | refondre l'écran analyses comme espace expert/analyste, pas comme dashboard DG |
| SWAT | écran de statut, scénarios, données attendues, runs, résultats si validés | `/dashboard-scenarios` existe mais redirige l'utilisateur vers des écrans non SWAT | faux sentiment de disponibilité ; aucun dashboard SWAT dédié | Critique | remplacer la logique actuelle par un écran `en construction` |
| WASP | écran de statut, scénarios, segments, résultats attendus, validation métier | `/dashboard-scenarios` existe mais ne fournit pas de lecture WASP dédiée | même incohérence que SWAT ; aucun écran WASP réel | Critique | créer un écran `en construction` dédié WASP |
| Prédiction pollution | module explicitant objectif, readiness data, modèle et limites | absent | module documenté conceptuellement seulement | Critique | créer un écran `en construction` sans promettre de résultats |
| Recommandations | recommandations actionnables visibles comme module transverse ou panneaux dédiés | pas de route dédiée ; recommandations seulement embarquées dans Home, Pollution et Carte Métier | moteur backend existe mais aucun module frontend clairement identifié | Élevée | exposer un panneau transversal ou un bloc dans l'accueil DG, sans en faire un faux module finalisé |
| Anomalies / qualité données | dashboard QA data, anomalies, classes vides, non-mappés, ingestion, règles | `/admin/data-governance/audit` et `/admin/data-scan` existent | forte valeur réelle mais positionnée en administration ; pas de lecture métier synthétique | Élevée | industrialiser un dashboard `Données / QA` avec lecture DG/métier simplifiée |
| Administration / RBAC | rôles, permissions, audits, gestion users, gouvernance des données | routes admin présentes, RBAC réel partiellement visible | coexistence entre module 114 officiel et ancienne page ingestion legacy | Critique | recentrer l'administration sur `data-admin` et limiter l'exposition du legacy |
| Reporting | exports, restitutions, support DG, vues imprimables | pas de module dédié ; exports dispersés dans les écrans | manque de parcours restitution DG/métier | Moyenne | prévoir un module ou sous-module de restitution piloté par les dashboards finalisés |

## Synthèse

- Ce qui existe : accueil V2, qualité réglementaire, carte métier, pollution, analyses, administration, QA data, prototype expert.
- Ce qui manque : dashboards dédiés stations, barrages, reporting, prédiction pollution, statuts projet DG.
- Ce qui est incohérent : scénarios SWAT/WASP, ingestion legacy visible, coexistence de routes legacy et P0 sans hiérarchie explicite.
- Ce qui doit être masqué : `pollution-idp-dev` et les parcours ingestion legacy dans un contexte DG/métier.
- Ce qui doit être affiché en `en construction` : `SWAT`, `WASP`, `Prédiction pollution`, `Recommandations` si exposées comme module distinct.

## Solution

- Finaliser et assumer comme dashboards métier : `Qualité réglementaire`, `Pollution`, `Données / QA`, `Administration / RBAC`.
- Réorganiser la navigation pour mettre en avant : `Accueil`, `Qualité`, `Carte Métier`, `Pollution`, `Analyses`, `Administration`.
- Déclasser les modules non finalisés en écrans de statut et non en dashboards métier.

## Améliorations optionnelles

- Ajouter des badges globaux : `OPERATIONNEL`, `PARTIEL`, `EN CONSTRUCTION`, `NON VALIDÉ MÉTIER`.
- Ajouter une page `Avancement projet` destinée à la DG.
