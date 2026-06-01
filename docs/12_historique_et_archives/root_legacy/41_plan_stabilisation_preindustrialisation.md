# Plan de Stabilisation Pré-Industrialisation

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | plan opérationnel |
| Périmètre | fermeture des verrous avant industrialisation WQDSS / SAD Sebou |
| Source principale | [40_revue_critique_transversale_finale](./40_revue_critique_transversale_finale.md) |
| Documents liés | [00_SOURCE_OF_TRUTH_MASTER](../../00_SOURCE_OF_TRUTH_MASTER.md), [12_plan_execution_par_lots](./12_plan_execution_par_lots.md), [25_annexes_blocages_et_incoherences](./25_annexes_blocages_et_incoherences.md), [25_limites_audit_techniques](./25_limites_audit_techniques.md) |
| Date | 2026-04-22 |

## 1. Synthèse de pilotage

Le projet est en pré-industrialisation contrôlée. La base `abh_sad`, les dashboards principaux, les routeurs métier et la documentation maître existent, mais plusieurs verrous empêchent encore de traiter le système comme un produit stabilisé.

| Indicateur | État |
|---|---|
| Niveau de maturité global | Pré-industrialisation contrôlée |
| Verrous critiques restants | 8 |
| Verrous importants | 7 |
| Améliorations reportables | 5 |
| Verdict | Industrialisation possible sous conditions, impossible en l'état sans fermeture des verrous critiques |

Le blocage principal n'est plus la structuration initiale de la donnée. Il se situe désormais dans la stabilisation des contrats système : backend legacy, contrat station, QA, scripts, documentation post-refactor et décisions métier sur les lots bloqués.

## 2. Liste des verrous à fermer avant industrialisation

| ID | Verrou | Couche | Gravité | Pourquoi c'est bloquant | Responsable | Dépendance | Action attendue | Preuve de clôture |
|---|---|---|---|---|---|---|---|---|
| `V-01` | Fichiers backend legacy `public.*` encore présents | backend | critique | Risque de réactivation de routes incompatibles avec `abh_sad`, où `public` ne contient plus de tables métier | Backend | Inventaire des routeurs montés dans `api_v1.py` | Archiver, neutraliser ou supprimer les fichiers non montés contenant `public.*` après validation | Scan `rg "public\\." backend/app` ne retourne plus que les usages PostGIS légitimes ou fichiers explicitement archivés |
| `V-02` | Contrat station non canonique | backend / base de données | critique | Mélange `station_id UUID`, `ire_station`, `legacy_station_id`, `legacy_code_station`, avec risque de résultats incohérents | Backend + Data | Référentiel `infra.stations_mesure`, vues `api.v_station_dimension` | Définir le contrat API station canonique et les règles de compatibilité legacy | Document de contrat station + endpoints retournant explicitement `station_id_uuid`, `code_station`, `legacy_id` |
| `V-03` | Badges QA UI pouvant afficher `VALID` sans preuve | frontend / gouvernance QA | critique | Peut donner un faux sentiment de donnée validée | Frontend + Backend | Mapping QA backend disponible | Ajouter un état `UNKNOWN` ou `NO_QA_DATA`, et n'afficher `VALID` que si une preuve QA est fournie | Popup/légende ne montrent plus `VALID` par défaut sans champ QA réel |
| `V-04` | Scripts read-only, dry-run et mutation non séparés | pipelines | critique | Risque humain d'exécuter une mutation en pensant lancer un audit | Data Engineering | Inventaire `backend/scripts` et `backend/sql` | Renommer/classer les scripts par niveau de risque et documenter l'usage | Arborescence ou registre distinguant `readonly`, `dryrun`, `mutate` avec consignes d'exécution |
| `V-05` | CRUD générique `/raw/*` trop puissant | backend / sécurité | critique | Mutation accidentelle possible en production | Backend + Admin | Politique de rôles et schémas autorisés | Restreindre schémas, permissions et audit, ou désactiver les mutations en prod | Test d'accès refusé pour utilisateur non autorisé + schémas autorisés documentés |
| `V-06` | Changements de schéma au runtime | backend / base de données | critique | Drift de schéma non versionné via routeurs/services | Backend + Data | Liste des `CREATE/ALTER TABLE` runtime | Déplacer les DDL vers migrations SQL versionnées | Aucun `ALTER TABLE` ou `CREATE TABLE` applicatif hors migrations, sauf exception documentée |
| `V-07` | Lot 4A-3 non arbitré | workflow métier | critique | Les `609` updates barrages et `251` `PARAM_UNMAPPED` restent bloqués | Métier + Data | Dossier Lot 4A-3 | Décider appliquer, refuser ou archiver les mutations | Décision signée + statut lot mis à jour dans `12_plan_execution_par_lots.md` |
| `V-08` | Lot 4A-4 IDP non arbitré | décision client / métier | critique | Dry-run final impossible sur IDP, pollution ponctuelle non stabilisée | Client / ABHS + SIG + Data | Topographie rejets et fusion 2024 | Trancher rattachement/création rejets, fusion/dédoublonnage des 4 tables 2024 | Décision client + règle SIG + dry-run final exécutable |
| `V-09` | Documentation frontend/SIG en retard | documentation | important | Source de vérité incomplète après refactor DSS | Frontend + Documentation | Refactor DSS réalisé | Mettre à jour `frontend_reference.md` et `visualization_strategy.md` | Documents alignés avec `App.tsx`, `Sidebar.tsx`, `Dashboard2.tsx`, `MapLegend`, `MapTooltip` |
| `V-10` | Routeur frontend alternatif `frontend/src/router.tsx` non utilisé | frontend | important | Deux vérités de routes dans le dépôt | Frontend | Vérification `main.tsx -> App.tsx` | Supprimer, archiver ou marquer comme obsolète | Un seul routeur officiel documenté |
| `V-11` | API qualité non unifiée | backend | important | `/quality/*` couvre surtout rivière et ne représente pas tous les domaines qualité | Backend + Data | Vues `api.v_qualite_*` | Définir contrat qualité unifié ou classer les limites actuelles | Contrat API qualité documenté par domaine |
| `V-12` | Matrice API/UI/DB/QA absente | documentation / QA | important | Difficile de prouver la traçabilité de chaque vue critique | Backend + Frontend + Data | Contrats API stabilisés | Produire matrice vue -> endpoint -> table/vue -> QA flags | Matrice validée dans documentation projet |
| `V-13` | Smoke tests métier non formalisés | workflow | important | Build OK mais parcours métier non prouvés | QA + Frontend + Backend | Stabilisation minimale UI/API | Exécuter et documenter les 5 smoke tests métier | Rapport de smoke test daté et signé |
| `V-14` | Statut réel de `Dashboard1` ambigu | frontend / documentation | important | Route `/dashboard` peut être perçue comme dashboard principal | Frontend + Documentation | Décision de conservation | Classer `Dashboard1` comme legacy, démo ou opérationnel | Statut documenté dans frontend reference |
| `V-15` | Gouvernance seuils QA SWAT/WASP insuffisante | gouvernance QA | important | Seuils discutables en audit externe | Métier + Data + Backend | Référentiel seuils actuel | Documenter origine, validation et override des seuils | Règles seuils validées et exposées |

## 3. Plan d'action séquencé

### Phase A — Sécurisation critique

| Action | Objectif | Responsable | Entrée requise | Sortie attendue | Condition de clôture |
|---|---|---|---|---|---|
| `A1` Neutraliser le legacy backend `public.*` | Éliminer le risque de routes incompatibles avec `abh_sad` | Backend | Liste des fichiers `public.*` et routeurs montés | Fichiers archivés, supprimés ou clairement exclus | Scan backend propre et revue `api_v1.py` validée |
| `A2` Verrouiller le contrat station | Stabiliser les échanges API/UI autour d'un identifiant canonique | Backend + Data | `infra.stations_mesure`, `api.v_station_dimension`, usages frontend | Contrat station canonique + mapping legacy | Endpoints critiques retournent les champs canoniques et legacy explicitement |
| `A3` Corriger la sémantique QA UI | Éviter les badges `VALID` non prouvés | Frontend + Backend | Liste des champs QA réellement disponibles | Statut `UNKNOWN` ou équivalent + mapping QA | `VALID` impossible sans preuve de validité backend |
| `A4` Séparer scripts audit/dry-run/mutation | Réduire le risque d'erreur humaine | Data Engineering | Inventaire `backend/scripts`, `backend/sql` | Registre et nommage par niveau de risque | Tout script de mutation est identifiable avant exécution |
| `A5` Encadrer `/raw/*` | Éviter mutations non contrôlées en production | Backend + Admin | Rôles, schémas autorisés, usage DataViewer | Politique d'accès et restrictions techniques | Test d'accès et audit d'action disponibles |
| `A6` Sortir les DDL du runtime | Stabiliser les migrations | Backend + Data | `ALTER/CREATE TABLE` dans routeurs/services | Migrations SQL versionnées | Routeurs/services ne modifient plus le schéma au démarrage ou à l'appel |

### Phase B — Stabilisation fonctionnelle

| Action | Objectif | Responsable | Entrée requise | Sortie attendue | Condition de clôture |
|---|---|---|---|---|---|
| `B1` Mettre à jour la documentation frontend | Aligner la doc avec le refactor DSS | Frontend + Documentation | Code `App.tsx`, `Sidebar.tsx`, `Dashboard2.tsx`, scénarios | `frontend_reference.md` à jour | Routes, navigation et composants DSS documentés |
| `B2` Mettre à jour la stratégie SIG | Aligner la stratégie avec `/layers/*` et les règles popup | SIG + Frontend + Documentation | `layerManager.ts`, `config.ts`, `MapLegend`, `MapTooltip` | `visualization_strategy.md` réaliste | Sources, symbologie, QA et popups décrites |
| `B3` Clarifier les dashboards actifs | Éviter les routes ambiguës | Frontend + Documentation | `App.tsx`, `router.tsx`, pages dashboards | Statut clair de `/dashboard`, `Dashboard1`, `DashboardClimate` | Un seul inventaire de routes fait foi |
| `B4` Produire la matrice API/UI/DB/QA | Tracer chaque vue critique | Backend + Frontend + Data | Endpoints et vues stabilisés | Matrice vue -> endpoint -> table/vue -> QA | Matrice revue par les leads |
| `B5` Exécuter smoke tests métier | Prouver que les parcours DSS fonctionnent | QA + Frontend + Backend | Application lancée, backend connecté | Rapport de smoke tests | Les 5 parcours critiques passent ou sont consignés |
| `B6` Stabiliser le contrat qualité | Couvrir rivière, nappe, barrage, Sebou, garde, pollution | Backend + Data | Vues `api.v_qualite_*`, `/quality/*` actuel | Contrat qualité cible ou limites documentées | Frontend sait quelles données qualité sont fiables |

### Phase C — Arbitrages métier et client

| Action | Objectif | Responsable | Entrée requise | Sortie attendue | Condition de clôture |
|---|---|---|---|---|---|
| `C1` Arbitrer Lot 4A-3 | Débloquer barrages / garde | Métier + Data | Dossiers `12_lot4a3_*`, `14_lot4a3_*` | Décision sur `609` updates et `251` `PARAM_UNMAPPED` | Statut passe à `READY_FOR_INGESTION`, `SYNCED_WITH_QA_FLAGS` ou décision d'archivage |
| `C2` Arbitrer Lot 4A-4 IDP | Rendre le dry-run IDP final possible | Client / ABHS + SIG + Data | Dossiers IDP, 5618 conflits, topographie rejets | Règle de rattachement/création et fusion 2024 | Dry-run final exécutable et statut mis à jour |
| `C3` Valider la gouvernance des seuils QA | Rendre les seuils défendables métier | Métier + Data + Backend | Seuils codés + `qa.variable_thresholds` | Règle d'origine, validation, override | Seuils documentés et validés |
| `C4` Clore les lots synchronisés | Réduire le bruit de pilotage | Data + Documentation | Lots 1, 2, 3B | Passage éventuel à `ARCHIVED` | Statut des lots clos validé |

## 4. Tableau des responsabilités

| Sujet | Backend | Data | Frontend | SIG | Métier | Client / ABHS |
|---|---|---|---|---|---|---|
| Legacy backend `public.*` | Responsable | Support validation DB | Consulté si endpoint consommé | Non concerné | Non concerné | Non concerné |
| Contrat station canonique | Responsable API | Responsable mapping | Responsable consommation UI | Consulté pour objets géo | Consulté | Non concerné |
| QA badges UI | Responsable payload QA | Responsable règles QA | Responsable affichage | Consulté pour couches SIG | Valide signification | Informé si impact décisionnel |
| Scripts audit/dry-run/mutation | Consulté | Responsable | Non concerné | Consulté si géospatial | Consulté si mutation métier | Informé si décision requise |
| `/raw/*` et DataViewer | Responsable sécurité API | Consulté schémas | Responsable UX admin | Non concerné | Non concerné | Non concerné |
| DDL runtime / migrations | Responsable refactor | Responsable migration SQL | Non concerné | Non concerné | Non concerné | Non concerné |
| Documentation frontend | Consulté endpoints | Consulté données | Responsable | Consulté cartographie | Non concerné | Non concerné |
| Stratégie SIG | Consulté API couches | Consulté vues données | Responsable UI carte | Responsable métier SIG | Consulté | Consulté si arbitrage |
| Lot 4A-3 | Support compatibilité | Responsable analyse | Consulté exposition | Consulté si station | Responsable décision | Informé |
| Lot 4A-4 | Support API future | Responsable analyse | Consulté exposition | Responsable topographie | Responsable règles métier | Responsable décision finale |
| Seuils QA SWAT/WASP | Responsable implémentation | Responsable référentiel | Consommateur | Non concerné | Responsable validation | Valide si seuils contractuels |
| Smoke tests métier | Support API | Support données | Responsable parcours UI | Support carto | Valide lisibilité | Peut valider recette |

## 5. Tableau des dépendances critiques

| Élément à traiter | Dépend de | Empêche quoi si non traité |
|---|---|---|
| Neutralisation legacy backend | Inventaire des routeurs réellement montés | Stabilisation API et confiance dans `abh_sad` |
| Contrat station canonique | Référentiel `infra.stations_mesure` et vues station | Cohérence backend/frontend/carte/analytique |
| QA badges fiables | Mapping QA backend -> UI | Usage décisionnel sans risque de fausse validation |
| Scripts séparés par risque | Inventaire scripts et validation Data | Exploitation sécurisée des pipelines |
| Restriction `/raw/*` | Politique rôles/schémas | Déploiement production non encadré |
| DDL hors runtime | Migrations SQL versionnées | Reproductibilité environnement |
| Documentation frontend/SIG | Code frontend DSS stabilisé | Source de vérité documentaire |
| Matrice API/UI/DB/QA | Contrats API et QA stabilisés | Recette structurée et maintenance par nouveaux intervenants |
| Smoke tests métier | Backend + frontend lancés sur config stable | Passage de démonstration contrôlée à pré-industrialisation stabilisée |
| Lot 4A-3 | Décision métier overwrite | Ingestion / clôture barrages-garde |
| Lot 4A-4 | Décision client/SIG sur rejets et fusion 2024 | Dry-run final IDP et stabilisation pollution ponctuelle |
| Gouvernance seuils QA | Validation métier des seuils | Défense du système en audit externe |

## 6. Critères minimaux pour déclarer le projet pré-industrialisé stabilisé

- Aucun routeur actif ou ambigu ne dépend de tables métier `public.*` absentes de `abh_sad`.
- Les fichiers legacy non montés sont archivés, supprimés ou explicitement exclus du périmètre actif.
- Le contrat station canonique est documenté et appliqué sur les endpoints critiques.
- Les badges QA frontend ne communiquent jamais `VALID` sans preuve backend.
- Les scripts read-only, dry-run et mutation sont séparés par nom, dossier ou registre.
- Les scripts de mutation exigent une validation explicite avant exécution.
- Les changements de schéma runtime sont sortis des routeurs/services ou documentés comme exceptions temporaires.
- `frontend_reference.md` et `visualization_strategy.md` reflètent l'état DSS réel.
- La matrice API/UI/DB/QA existe pour les vues critiques.
- Les cinq smoke tests métier sont exécutés et documentés : navigation sidebar, chargement Dashboard2, légende enrichie, popups QA, hub scénarios + comparaison hydro.
- Lot 4A-3 dispose d'une décision métier formelle.
- Lot 4A-4 dispose d'une décision client/SIG formelle ou d'un statut explicite de non-industrialisation IDP.
- La gouvernance des seuils QA SWAT/WASP est documentée.
- Le statut de `Dashboard1` et des routes historiques est clarifié.

## 7. Ce qui peut être reporté après industrialisation initiale

Ces éléments sont utiles mais ne doivent pas bloquer la stabilisation initiale si les verrous critiques sont fermés.

| Élément reportable | Catégorie | Condition de report |
|---|---|---|
| Lazy loading avancé des dashboards | optimisation performance | Acceptable si les parcours critiques restent utilisables et le warning bundle est documenté |
| Amélioration UX avancée des graphiques | confort / lisibilité | Acceptable si les KPI, séries et QA sont compréhensibles |
| Préselection intelligente depuis le hub scénarios | amélioration UX | Acceptable si les CTA actuels sont documentés |
| Contrat qualité totalement unifié | structurant mais phasable | Peut être phasé si les limites de `/quality/*` sont clairement documentées |
| Reporting client avancé | analytique | Peut suivre après stabilisation du socle API/UI/QA |
| Perfectionnement des seuils réglementaires par paramètre | métier | Peut suivre si une gouvernance minimale des seuils existe |
| Archivage formel des lots `SYNCED` | pilotage | Peut suivre après fermeture des verrous critiques 4A-3 / 4A-4 |

## 8. Verdict final et ordre recommandé

### 8.1 Ordre recommandé d'exécution

1. Neutraliser ou archiver les fichiers backend legacy `public.*`.
2. Verrouiller le contrat station canonique et les règles de compatibilité legacy.
3. Corriger la sémantique QA UI pour supprimer tout `VALID` non prouvé.
4. Séparer les scripts read-only, dry-run et mutation.
5. Encadrer `/raw/*` et sortir les DDL runtime vers migrations.
6. Mettre à jour `frontend_reference.md` et `visualization_strategy.md`.
7. Clarifier les dashboards actifs et supprimer ou neutraliser `frontend/src/router.tsx`.
8. Produire la matrice API/UI/DB/QA.
9. Exécuter les smoke tests métier.
10. Arbitrer Lot 4A-3.
11. Arbitrer Lot 4A-4.
12. Valider la gouvernance des seuils QA SWAT/WASP.

### 8.2 Point de passage obligatoire avant lot suivant

Avant d'ouvrir un nouveau lot fonctionnel ou une phase d'industrialisation externe, l'équipe doit valider au minimum :

- `V-01` fermé : plus de legacy backend ambigu autour de `public.*`.
- `V-02` fermé : contrat station canonique accepté.
- `V-03` fermé : QA UI non trompeuse.
- `V-04` fermé : scripts classés par niveau de risque.
- `V-07` et `V-08` arbitrés ou explicitement sortis du périmètre industrialisable initial.
- Smoke tests métier exécutés et documentés.

### 8.3 Risque principal si le plan n'est pas suivi

Le risque principal est de confondre une démonstration fonctionnelle avec un système industrialisé : le projet peut sembler stable en surface, mais produire des erreurs de décision, de maintenance ou d'exploitation dès qu'un utilisateur active une route legacy, interprète un badge QA comme preuve métier ou lance un script de mutation au mauvais moment.

