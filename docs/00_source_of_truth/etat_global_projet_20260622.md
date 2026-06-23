# État Global du Projet SAD

## Résumé exécutif

Le projet SAD/WQDSS n'est plus en phase de construction de socle. Le socle plateforme, les dashboards P0, le réseau hydrographique validé, le moteur topologique de propagation et la gouvernance `data-admin` existent déjà sous une forme exploitable en DEV avancé.

En revanche, la situation n'est pas celle d'un projet "terminé". Le vrai état actuel est :

- préproduction techniquement envisageable ;
- qualification métier encore conditionnelle ;
- qualité réglementaire encore partielle sur le plan officiel ;
- Carte Métier et Dashboard Qualité documentés comme avancés, mais avec réserves runtime récentes ;
- SWAT/WASP sortis du chemin critique technique court et reclassés en dépendances métier externes ;
- IA / prédiction encore au stade non officiel ou de spécification.

Le chemin critique réel n'est plus la construction du backend ou du frontend. Il est désormais :

1. stabiliser les écarts runtime et fonctionnels des écrans critiques ;
2. assainir la lecture métier des données exposées dans la Carte Métier et le Workspace ;
3. fermer les arbitrages métier restants sur référentiels, pollution IDP et réglementaire ;
4. seulement ensuite étendre vers SWAT/WASP, IA et reporting avancé.

PHASE_ACTUELLE = STABILISATION_PREPROD + ASSAINISSEMENT_DONNEES_METIER

PROCHAINE_PHASE = CORRECTION_RUNTIME_CARTE_METIER + CORRECTION_RUNTIME_DASHBOARD_QUALITE + SEPARATION_TIME_SERIES_POINT_MEASURE

PREPROD_READY = NON

DEMO_DG_READY = NON

VALIDATION_METIER_READY = NON

CONFIANCE_GLOBALE = MOYENNE_FORTE

## Phases terminées

| Phase | Description | Statut |
| --- | --- | --- |
| Architecture plateforme | Base `abh_sad`, FastAPI `/api/v1`, frontend Vite/React, socle dashboards, sécurité et analytics en place | TERMINEE_AVEC_RESERVES |
| Migration et assainissement historique | Migration historique clôturée avec backlog gouverné | TERMINEE_AVEC_RESERVES |
| Réseau hydrographique | Réseau final candidate validé pour routage topologique et propagation future | TERMINEE |
| Dashboard DG audit frontend | Audit vision/frontend/backend/UX documentaire livré | TERMINEE |
| Implémentation dashboards clôturés | Accueil DG, Qualité, Pollution, Données/QA, Administration implémentés | TERMINEE_AVEC_RESERVES |
| Validation runtime dashboards | Reconnexion à la vraie API SAD et validation des contrats runtime principaux | TERMINEE_AVEC_RESERVES |
| Réorganisation du dépôt | Nettoyage racine, regroupement artefacts/logs/scripts, validation post-réorganisation | TERMINEE_AVEC_RESERVES |
| Carte Métier Sprint 0 | Audit sources, matrices availability/features/series, recommandations Sprint 0 | TERMINEE |
| Carte Métier Sprint 1 | Socle technique carte plein écran et endpoints business-map V1 | TERMINEE |
| Carte Métier Sprint 1.5 | Corrections UX/filtres/features/popup/panneau | TERMINEE |
| Carte Métier Sprint 2A | Architecture analytique multi-support et batch series cadrés | TERMINEE |
| Carte Métier Sprint 2C | Workspace widgets détachables développé et documenté | TERMINEE |
| Carte Métier Sprint 2D | Mode d'affichage par domaine développé et documenté | TERMINEE |
| Carte Métier Sprint 2E Light | Mode thématique light développé et documenté | TERMINEE |
| Pollution propagation backend MVP V1 | Endpoints `source-to-*` clôturés, tests passés, statut `BACKEND_MVP_V1_READY` | TERMINEE_AVEC_RESERVES |
| Module 114 data-admin | DB, API, UI audit, canevas, staging, promotion contrôlée, rollback logique et RBAC réel actifs | TERMINEE_AVEC_RESERVES |

## Phases terminées avec réserves

| Phase | Clôture technique | Clôture métier | Confiance |
| --- | --- | --- | --- |
| Architecture plateforme | Oui | Non applicable complète | FORTE |
| Migration et assainissement historique | Oui | Partielle | FORTE |
| Référentiel réglementaire qualité C3 | Partielle, moteur chargé et consommé | Non, validations métier restantes | MOYENNE |
| Dashboard DG | Oui, build/runtime/API OK | Non, validation DG finale non obtenue | MOYENNE |
| Dashboard Qualité V1 | Oui, V1 connectée aux données réelles et endpoints présents | Non, classification réglementaire complète reportée V2 et erreur runtime récente | MOYENNE |
| Dashboard Pollution | Oui, runtime validé avec réserves et garde-fous DEV | Non, module non scientifique officiel | MOYENNE |
| Carte Métier Sprint 2 | Oui, clôture Sprint 2 et validation métier documentées | Oui dans la documentation Sprint 2 | MOYENNE |
| Pollution propagation MVP | Oui, backend et E2E documentés | Non, pas de validation hydraulique scientifique | FORTE |
| Module 114 data-admin | Oui, MVPs actifs | Non, lot opérateurs / démonstration / extension encore ouverts | FORTE |
| Réorganisation du dépôt | Oui | Non applicable | FORTE |

## Phases en cours

| Phase | Description | Statut |
| --- | --- | --- |
| Connexion données réelles dashboards | Popups métier, 6 vraies stations, tendances réelles, compléments carte/home | EN_COURS |
| Stabilisation runtime Carte Métier | Correction `Erreur catalogue`, validation popup, paramètres, workspace | EN_COURS |
| Stabilisation runtime Dashboard Qualité | Correction `Erreur API : Network Error`, validation filtres/séries | EN_COURS |
| Consolidation réglementaire C3 | Passage de `DEV_PARTIAL` à `GO_PREPROD_CONDITIONNEL` réellement assumé métier | EN_COURS |
| Qualification préproduction métier | GO/NO-GO conditionnel sur D1 à D4 | EN_COURS |
| Gouvernance data-admin vers usage démonstrable | Stabilisation démonstration, contrats opérateurs, éventuelle extension `INFRA_BARRAGE` | EN_COURS |

## Phases bloquées

| Phase | Description | Statut |
| --- | --- | --- |
| Validation métier complète | Décisions D1 IDP, D2 paramètres, D3 réglementaire encore attendues | BLOQUEE |
| Préproduction officielle complète | Conditionnée par écarts runtime + décisions métier + C3 | BLOQUEE |
| Démonstration DG robuste | Latence `dashboard/home` + erreurs Qualité/Carte Métier à corriger | BLOQUEE |

## Phases non démarrées

| Phase | Description | Statut |
| --- | --- | --- |
| Reporting décisionnel officiel | Exports et rapports DG officiels | NON_DEMARREE |
| IA / prédiction pollution officielle | Dépend qualité/pollution/SWAT/WASP stabilisés et validés | NON_DEMARREE |
| Feature Store officiel | Spécification existante mais pas de DDL/gouvernance officielle active | EN_PREPARATION |
| Model Build officiel | Spécification, pas de chaîne validée | EN_PREPARATION |

## Analyse des chantiers en cours

### Carte Métier

| Sprint | État réel | Lecture |
| --- | --- | --- |
| Sprint 0 | terminé | audit et matrices sources disponibles |
| Sprint 1 | terminé | socle technique V1 validé |
| Sprint 1.5 | terminé | UX/filtres/popup/panneau validés fonctionnellement dans la documentation |
| Sprint 2A | terminé | architecture analytique et batch series cadrés puis utilisés |
| Sprint 2B | terminé implicitement via assainissement données | séparation `QUALITE_ABH` / `POLLUTION_IDP` et `TIME_SERIES` / `POINT_MEASURE` validées |
| Sprint 2C | terminé | workspace widgets documenté |
| Sprint 2D | terminé | mode domaine documenté |
| Sprint 2E | terminé | mode thématique light documenté |
| Post-Sprint 2 runtime | en cours | la documentation dit `GO_SPRINT_3`, mais la validation récente constate `Erreur catalogue.` et validation fonctionnelle KO |

Conclusion Carte Métier :

- chantier de construction Sprint 0 → 2 terminé ;
- chantier de stabilisation runtime et de démonstration non terminé ;
- dépendances restantes : API runtime stable, catalogue frontend/backend cohérent, validation fonctionnelle réelle.

### Dashboard Qualité

État réel :

- V1 auditée, connectée et documentée ;
- endpoints qualité présents et validés runtime historiquement ;
- classification réglementaire complète reportée en V2 ;
- dernière validation post-réorganisation : erreur visible `Erreur API : Network Error`.

Causes probables du blocage actuel :

- écart runtime/local entre contrat attendu et consommation UI ;
- dette de stabilisation autour des séries / filtres / chargement ;
- dépendance métier persistante sur le référentiel réglementaire officiel.

Dépendances :

- validation D3 réglementaire ;
- consolidation C3 ;
- correction runtime frontend/API ;
- validation utilisateur réelle.

### Pollution

#### Inventaire / IDP

- `C1-B` est clôturé en DEV avec backlog gouverné ;
- le résiduel global IDP reste ouvert et ne doit pas être confondu avec un lot clôturé ;
- la préproduction complète pollution reste conditionnelle.

#### Propagation

- backend MVP V1 clôturé ;
- logique strictement topologique ;
- non hydraulique scientifique ;
- utilisable comme moteur DEV assisté, pas comme vérité scientifique.

#### Dashboard pollution

- module implémenté et runtime historiquement validé avec réserves ;
- garde-fous scientifiques obligatoires ;
- campagne pollution constitue un chantier parallèle encore en plan/MVP, pas un socle clôturé complet.

### Modélisation

| Domaine | État réel |
| --- | --- |
| SWAT+ | sandbox legacy, dépendance métier externe, aucun résultat officiel validé |
| WASP | sandbox legacy, dépendance métier externe, aucun résultat officiel validé |
| Calibration | non validée officiellement dans la plateforme |
| IA / Prédiction | non officielle, encore dépendante de SWAT/WASP et de la stabilisation data |

## Chemin critique

### P1 = Bloquant

| Priorité | Élément | Pourquoi |
| --- | --- | --- |
| P1 | Corriger `Erreur catalogue` de la Carte Métier | bloque démonstration et validation fonctionnelle |
| P1 | Corriger `Erreur API : Network Error` du Dashboard Qualité | bloque validation fonctionnelle |
| P1 | Séparer `QUALITE_ABH` et `POLLUTION_IDP` | évite les mélanges métier dans la carte et le workspace |
| P1 | Séparer `TIME_SERIES` et `POINT_MEASURE` | conditionne le bon widget et la bonne lecture métier |
| P1 | Adapter le Workspace aux données ponctuelles | un graphique temporel n'a pas de sens pour une mesure isolée |
| P1 | Réduire la latence `GET /api/v1/dashboard/home` | impact direct sur cockpit DG |

### P2 = Important

| Priorité | Élément | Pourquoi |
| --- | --- | --- |
| P2 | Fermer les validations métier D1/D2/D3 | les ateliers seront utiles une fois le runtime et les données métier stabilisés |
| P2 | Consolider C3 réglementaire | reste conditionnant pour la lecture officielle PREPROD |
| P2 | Stabiliser la démonstration DG des dashboards P0 | crédibilité projet et validation utilisateur |
| P2 | Poursuivre la gouvernance `data-admin` vers usage opérateur | industrialisation du flux de données |
| P2 | Clarifier la lecture pollution DEV / topologique | éviter l'interprétation scientifique abusive |
| P2 | Finaliser les compteurs QA DG manquants | utile pour DG mais non bloquant absolu court terme |

### P3 = Amélioration

| Priorité | Élément | Pourquoi |
| --- | --- | --- |
| P3 | Exports PDF / reporting décisionnel | valeur métier, non bloquant court terme |
| P3 | Corrélations multi-domaines et widgets avancés | prolongement Sprint 3 |
| P3 | Intégration SWAT/WASP contractuelle | après préprod du socle |
| P3 | IA / prédiction pollution | après stabilisation scientifique et métier |

## Roadmap priorisée

### Phase actuelle

PHASE_ACTUELLE = STABILISATION_PREPROD + ASSAINISSEMENT_DONNEES_METIER

### Prochaine phase immédiate

1. Corriger l'erreur catalogue de la Carte Métier.
2. Corriger l'erreur API du Dashboard Qualité.
3. Profiler et réduire la latence de `GET /api/v1/dashboard/home`.
4. Séparer strictement `QUALITE_ABH` et `POLLUTION_IDP` dans availability, features, séries et workspace.
5. Séparer strictement `TIME_SERIES` et `POINT_MEASURE` et adapter les widgets.
6. Verrouiller la lecture métier réelle des 6 stations qualité, popups carte et tendances.
7. Organiser ensuite les arbitrages D1, D2 et D3 avec l'équipe métier.

### Priorité 1

- Stabilisation runtime des écrans critiques.
- Assainissement métier des données Carte Métier et Workspace.
- Séparation `QUALITE_ABH` / `POLLUTION_IDP` à tous les niveaux SQL, vues, API, frontend et workspace.
- Séparation `TIME_SERIES` / `POINT_MEASURE` au niveau `support + paramètre` et prise en charge des cas `MIXED`.
- Qualification PREPROD réelle backend/frontend/API/DB.

### Priorité 2

- Validation métier ciblée sur pollution IDP, paramètres et réglementaire.
- Consolidation réglementaire C3.
- Industrialisation opérationnelle du module `114_data_admin_ingestion`.
- Sécurisation de la démonstration DG.
- Stabilisation des compteurs QA, badges et wording des modules P0.

### Ordre d'exécution recommandé

#### Semaine actuelle

1. Corriger `Erreur catalogue` Carte Métier.
2. Corriger `Erreur API : Network Error` Dashboard Qualité.
3. Corriger la latence `GET /api/v1/dashboard/home`.
4. Implémenter complètement `QUALITE_ABH`, `POLLUTION_IDP`, `TIME_SERIES`, `POINT_MEASURE`.
5. Adapter le Workspace : courbes/KPI pour `TIME_SERIES`, tableaux/fiches pour `POINT_MEASURE`, jamais de graphique vide.
6. Ouvrir ensuite les ateliers D1, D2, D3.
7. Préparer la démonstration DG après stabilisation.
8. Reporter Sprint 3, reporting, SWAT/WASP et IA après qualification PREPROD.

### Priorité 3

- Démonstration DG stabilisée.
- Sprint 3 Carte Métier : corrélations multi-domaines, exports, raffinements UX.
- Reporting décisionnel.
- Intégration SWAT/WASP par contrat validé.
- IA / prédiction pollution officielle.

## Recommandation du chef de projet

Le projet doit être piloté comme un socle décisionnel **techniquement avancé mais encore conditionnel métier**.

Décisions de pilotage recommandées :

1. ne pas rouvrir de chantier lourd SWAT/WASP/IA avant stabilisation du socle PREPROD ;
2. ne pas considérer la Carte Métier et le Dashboard Qualité comme "validés en exploitation" tant que les erreurs runtime récentes persistent ;
3. considérer l'assainissement métier `QUALITE_ABH ≠ POLLUTION_IDP` et `TIME_SERIES ≠ POINT_MEASURE` comme le dernier gros chantier fonctionnel avant qualification métier ;
4. concentrer l'effort court terme sur la démonstration fiable des modules déjà construits ;
5. utiliser `data-admin` comme levier d'industrialisation et de traçabilité, pas comme chantier latéral ;
6. traiter les validations métier D1/D2/D3 juste après stabilisation runtime et assainissement métier.

## Décision

Le projet est **avancé**, mais il n'est **ni PREPROD prêt**, ni **DG prêt**, ni **métier complètement validé** aujourd'hui.

La lecture officielle de pilotage devient :

```text
PHASE_ACTUELLE
=
STABILISATION_PREPROD
+
ASSAINISSEMENT_DONNEES_METIER

PRIORITE_1
=
RUNTIME
+
SEPARATION_QUALITE_POLLUTION
+
SEPARATION_TIME_SERIES_POINT_MEASURE

PRIORITE_2
=
VALIDATIONS_METIER_D1_D2_D3

PRIORITE_3
=
DEMO_DG
+
SPRINT_3

PREPROD_READY = NON
DEMO_DG_READY = NON
VALIDATION_METIER_READY = NON

CONFIANCE_GLOBALE = MOYENNE_FORTE
```

Décision consolidée :

- socle technique : avancé et majoritairement stable ;
- socle métier : conditionnel ;
- socle runtime : encore hétérogène ;
- phases scientifiques : hors chemin critique court ;
- prochaine priorité réelle : stabilisation fonctionnelle des écrans critiques et assainissement métier des données exposées.

Verdict synthétique :

```text
PHASE_ACTUELLE = STABILISATION_PREPROD + ASSAINISSEMENT_DONNEES_METIER
PROCHAINE_PHASE = CORRECTION_RUNTIME_CARTE_METIER + CORRECTION_RUNTIME_DASHBOARD_QUALITE + SEPARATION_TIME_SERIES_POINT_MEASURE
PREPROD_READY = NON
DEMO_DG_READY = NON
VALIDATION_METIER_READY = NON
CONFIANCE_GLOBALE = MOYENNE_FORTE
```





