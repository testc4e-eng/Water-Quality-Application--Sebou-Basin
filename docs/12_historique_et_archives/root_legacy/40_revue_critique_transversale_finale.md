# Revue Critique Transversale Finale

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit critique |
| Périmètre | documentation, base `abh_sad`, backend FastAPI, frontend React, pipelines et workflows |
| Source de vérité | Non, rapport d'audit final avant industrialisation |
| Documents liés | [00_SOURCE_OF_TRUTH_MASTER](../../00_SOURCE_OF_TRUTH_MASTER.md), [12_plan_execution_par_lots](./12_plan_execution_par_lots.md), [25_annexes_blocages_et_incoherences](./25_annexes_blocages_et_incoherences.md), [25_limites_audit_techniques](./25_limites_audit_techniques.md) |
| Date de revue | 2026-04-22 |

## 1. Synthèse exécutive

### État réel du projet

Le projet WQDSS / SAD Sebou a dépassé le stade de prototype technique : la base `abh_sad` est structurée en schémas métier, le backend expose des familles API opérationnelles, le frontend couvre les parcours Observation / Analyse / Modèles / Administration, et la documentation dispose maintenant d'un référentiel maître.

Le système n'est cependant pas encore prêt pour une industrialisation sans réserve. Il est dans un état de pré-industrialisation contrôlée : exploitable pour démonstration métier, validation progressive et exploitation interne encadrée, mais encore fragile si on le traite comme un produit stabilisé.

### Niveau de maturité global

| Couche | Maturité estimée | Verdict |
|---|---|---|
| Documentation | Moyenne à bonne | Structure forte, mais plusieurs documents dérivés restent en retard sur le code récent. |
| Base de données | Bonne | Schémas métier réels, QA flags nombreux, vues `api` / `analytics` présentes. Les décisions IDP restent non closes. |
| Backend | Moyenne | Routeurs principaux alignés, mais coexistence de routeurs modernes, routeurs legacy et fichiers non montés. |
| Frontend | Moyenne à bonne | UX DSS améliorée, mais la lisibilité métier reste inégale et certaines vues restent trop techniques. |
| Pipelines | Moyenne | Audits et dry-runs riches, mais séparation insuffisante entre scripts d'audit, scripts de mutation et workflows industrialisés. |

### Top 10 faiblesses restantes

1. Le projet conserve des fichiers backend legacy avec références `public.*` alors que la DB réelle `abh_sad.public` ne contient que les objets PostGIS système (`geometry_columns`, `geography_columns`, `spatial_ref_sys`).
2. Certains routeurs actifs restent tolérants aux colonnes legacy (`ire_station`, `legacy_station_id`, `legacy_code_station`), ce qui maintient la compatibilité mais brouille le contrat canonique `station_id UUID`.
3. La documentation frontend n'intègre pas encore les dernières évolutions UX DSS : menu métier, hub scénarios, QA badges, légende enrichie.
4. `frontend/src/router.tsx` décrit un routeur non utilisé par `main.tsx`, différent de `App.tsx`, et constitue une source de confusion durable.
5. Le routeur SWAT analysis est corrigé dans le code courant sur `prefix="/swat/analysis"`, mais la documentation active signale encore un risque de double préfixe ; la doc est donc déjà en retard.
6. Les workflows d'ingestion créent ou modifient des tables de contrôle (`audit.*`, `qa.*`) depuis le backend au runtime, ce qui mélange logique applicative et migration de schéma.
7. Les routes `raw` exposent du CRUD générique, y compris `POST`, `PUT`, `DELETE`, ce qui est puissant mais risqué si l'encadrement d'accès et d'audit n'est pas strictement verrouillé.
8. Les QA flags sont présents en base et en backend, mais leur traduction UI reste partielle : les badges visuels existent, mais les dashboards ne permettent pas encore de filtrer et expliquer systématiquement les anomalies par type.
9. Les lots 4A-3 et 4A-4 restent bloqués par décisions métier / SIG / client ; le risque principal n'est plus technique mais organisationnel.
10. Les scripts de migration et d'audit ne sont pas clairement classés entre lecture seule, dry-run et mutation effective, ce qui augmente le risque d'erreur humaine avant industrialisation.

## 2. Revue critique par couche

### Documentation

Ce qui est réussi :

- `docs/00_SOURCE_OF_TRUTH_MASTER.md` donne une règle de précédence claire : DB réelle, code monté, documentation corrigée.
- `docs/12_historique_et_archives/root_legacy/12_plan_execution_par_lots.md` a une taxonomie de statuts exploitable par humains et agents.
- `docs/12_historique_et_archives/root_legacy/25_annexes_blocages_et_incoherences.md` quantifie fortement les anomalies, notamment `ALIAS_UNMAPPED`, `NULL_VALUE`, `FORMAT_ERROR`, `NEGATIVE_VALUE`, `NON_NUMERIC`.
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md` est suffisamment opérationnel pour guider un agent dans les schémas prioritaires.

Faiblesses réelles :

- `docs/01_project_reference/frontend/frontend_reference.md` ne reflète pas encore les changements UX récents : sidebar regroupée par métier, hub scénarios, context bar, légende enrichie et QA badges.
- `docs/01_project_reference/gis_visualization/visualization_strategy.md` reste plus proche d'une cible conceptuelle que de la réalité du frontend actuel. Il mentionne une cible `api.v_station_geojson`, alors que le code utilise surtout `/layers/*`, `api.mv_*`, `api.v_*`, et les helpers de `layerManager.ts`.
- `docs/00_SOURCE_OF_TRUTH_MASTER.md` mentionne encore un risque SWAT analysis double préfixe, alors que le code observé déclare `backend/app/api/v1/swat_analysis.py:18` avec `prefix="/swat/analysis"`. La documentation est donc partiellement obsolète sur ce point précis.
- Les documents de lots sont riches mais nombreux. Sans index opérationnel strict, la charge cognitive reste élevée pour un nouvel intervenant.

Risque :

- Faux sentiment de source de vérité : la structure documentaire est bonne, mais certains documents dérivés sont déjà en retard sur les dernières modifications frontend/backend.

### Base de données

Ce qui est réussi :

- La DB réelle est bien `abh_sad`, confirmée par introspection en lecture seule.
- Les schémas métier principaux sont présents : `infra`, `hydro`, `meteo`, `qualite`, `geo`, `api`, `analytics`, `metadata`, `security`, `audit`, `qa`, `swat_*`, `wasp_*`.
- Les QA flags sont largement présents dans `hydro`, `meteo`, `qualite` et dans de nombreuses vues `api.*`.
- Le schéma `public` ne contient pas de tables métier actives, seulement les objets PostGIS système, ce qui confirme que `public.*` ne doit plus être considéré comme couche applicative.

Faiblesses réelles :

- La coexistence de colonnes canoniques (`station_id`) et legacy (`ire_station`, `legacy_station_id`, `legacy_code_station`) reste nécessaire mais mal encapsulée. Elle apparaît dans `backend/app/api/v1/measurements.py`, `backend/app/api/v1/stations.py`, `backend/app/routers/quality.py`, `frontend/src/layers/layerManager.ts`.
- Les QA flags ne sont pas encore regroupés en taxonomie unique côté API. On observe `qa_flag_negative`, `qa_flag_outlier`, `qa_flag_null_value`, `qa_flag_param_missing`, `qa_flag_station_unmapped`, `qa_flags`, `data_quality_flag`, etc.
- Les décisions IDP restent structurelles : la topographie des rejets et la fusion des sources 2024 ne sont pas arbitrées.

Risque :

- Une API peut afficher des données valides techniquement mais ambiguës métier si le pivot station/rejet n'est pas explicitement qualifié dans la réponse.

### Backend

Ce qui est réussi :

- Le backend principal est monté proprement sous `/api/v1` via `backend/app/main.py:174-175`.
- `backend/app/api/api_v1.py` centralise les routeurs réellement exposés.
- Les routeurs `analytics`, `observatory`, `layers`, `hydro`, `climate`, `ingestion`, `security`, `users` sont les plus cohérents avec la DB métier.
- `backend/app/api/v1/measurements.py` et `backend/app/api/v1/stations.py` ont été partiellement modernisés vers `hydro.*`, `meteo.*`, `qualite.*`, `api.v_station_dimension`.

Faiblesses réelles :

- Plusieurs fichiers backend non montés ou legacy contiennent encore des références `public.*` : `backend/app/routers/api.py`, `backend/app/routers/catalog.py`, `backend/app/routers/geojson.py`, `backend/app/routers/objects.py`, `backend/app/routers/stations.py`, `backend/app/routers/measurements.py`.
- Le fait qu'un fichier ne soit pas monté n'annule pas le risque : il peut être réimporté ultérieurement ou utilisé par erreur dans une correction rapide.
- `backend/app/routers/quality.py` est mieux aligné qu'avant mais reste focalisé sur `qualite.mesure_qualite_riviere`. Il ne couvre pas de manière unifiée nappes, barrages, Sebou, garde et IDP.
- `backend/app/routers/entities.py` expose des endpoints barrages qualité basés sur la liaison `mqb.ire_station = b.ire`, utile en compatibilité mais non canonique par rapport au modèle `station_id UUID`.
- `backend/app/api/v1/raw.py` expose un CRUD générique sur schéma/table. C'est fonctionnel, mais à fort risque si les permissions, l'audit et la limitation de schémas ne sont pas stricts.
- `backend/app/routers/observatory.py` exécute des `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` au runtime pour `metadata.popup_rules_config`. Cela dépanne, mais ce n'est pas une discipline d'industrialisation.

Risque :

- Le backend donne une impression de stabilité car les routeurs montent, mais la dette principale est dans les contrats implicites : station ID, QA flags, legacy fallback, routes non montées mais présentes.

### Frontend

Ce qui est réussi :

- `frontend/src/App.tsx` est le routeur réel ; `main.tsx` importe `App`, donc la vérité des routes est centralisée.
- La navigation a été réorganisée par logique métier : Observation, Analyse, Modèles, Administration.
- `Dashboard2` a été amélioré vers un parcours guidé plutôt qu'un bloc de filtres dense.
- `UnifiedSimpleDashboard` expose maintenant un contexte décisionnel avant les KPI.
- `DashboardScenarios` n'est plus un placeholder : il offre un hub SWAT / WASP / Comparaison sans toucher aux APIs.
- Les badges QA `VALID`, `FLAGGED`, `OUTLIER`, `MISSING` existent via `frontend/src/components/ui/qa-badge.tsx`.

Faiblesses réelles :

- `frontend/src/router.tsx` définit un routeur alternatif non utilisé, avec routes différentes (`dashboard-climate`, `admin/users` direct). C'est une dette de maintenance.
- `Dashboard2.tsx` reste un composant très volumineux et multifonction : carte, hiérarchie métier, time slider, popups, styles, filtres, couche business. L'amélioration UX ne résout pas encore la complexité structurelle.
- `MapTooltip.jsx` affiche un statut QA dérivé de propriétés éventuelles (`qa_status`, `qaStatus`, `qa_flag`, `qaFlag`), mais beaucoup de couches ne semblent pas fournir ces propriétés. Le badge peut donc afficher `VALID` par défaut sans preuve réelle.
- `MapLegend.jsx` affiche des seuils dérivés des classes de rendu, mais pas encore des seuils métier normatifs issus de `qa.variable_thresholds` ou d'un référentiel de qualité.
- `DashboardScenarios.tsx` est visuellement utile mais ne relie pas encore les cartes SWAT/WASP à des endpoints dédiés de comparaison métier ; il redirige vers dashboards existants.
- Les composants qualité consomment encore `/quality/*`, famille qui reste moins complète que les vues analytiques transverses.

Risque :

- L'interface paraît plus décisionnelle qu'avant, mais certains indicateurs visuels, notamment QA, peuvent être interprétés comme garanties métier alors qu'ils sont parfois des valeurs par défaut ou des conventions UI.

### Pipelines / workflows

Ce qui est réussi :

- Les scripts d'audit par lot sont nombreux et documentent les sources, cibles, anomalies et dry-runs.
- Les services d'ingestion couvrent contrôle structurel, mapping, déduplication, simulation dry-run, QA, export CSV et audit.
- Les lots ont une taxonomie de statut claire et exploitable.

Faiblesses réelles :

- Les scripts `backend/scripts/run_bloc3_execute.py` et `backend/scripts/run_bloc3_m2_m3.py` contiennent des `INSERT` réels. Leur nom et leur présence à côté de scripts d'audit peuvent provoquer une confusion dangereuse.
- Les scripts d'audit source utilisent massivement `abh_sebou_070426.public.*`, ce qui est normal pour le sandbox, mais doit être clairement isolé de la production `abh_sad`.
- Certains services applicatifs créent des tables ou modifient des schémas au runtime (`audit.ingestion_*`, `qa.variable_thresholds`, `metadata.popup_rules_config`). Ces opérations doivent basculer vers migrations SQL versionnées avant industrialisation.
- Le workflow métier des lots 4A-3 et 4A-4 reste dépendant d'arbitrages humains non tracés dans un outil transactionnel de validation.

Risque :

- Une erreur humaine peut lancer un script de mutation au mauvais moment ou considérer un dry-run comme une migration validée.

## 3. Revue critique par dashboard / vue

### Carte métier

Réussi :

- La carte est au centre de l'Observation, ce qui correspond au besoin DSS.
- Les couches métier sont structurées dans `frontend/src/layers/config.ts`.
- Les couches sont enrichies via `/layers/*` et `/observatory/*`, avec un début de symbologie métier.
- Les filtres ont été rendus plus guidés.

Manques :

- La carte ne distingue pas encore clairement données observées, données simulées, données incomplètes et données inférées.
- Les QA badges sont visuels mais pas toujours appuyés par des champs réels fournis par la couche.
- La légende ne dit pas encore si les seuils sont statistiques, réglementaires, QA ou simplement classes de rendu.
- Les popups ne donnent pas encore l'explication de la donnée : source, date de dernière mesure fiable, règle QA appliquée, nombre de mesures derrière l'indicateur.

Priorité :

- Critique pour les QA badges par défaut.
- Majeure pour la légende et l'explication des seuils.

### Analyses temporelles

Réussi :

- L'architecture analytique s'appuie sur `analytics.*`, `observatory.*`, `hydro`, `climate`, `quality`.
- La barre de contexte améliore la lecture métier.
- Les graphiques et KPI sont déjà exploitables pour un ingénieur.

Manques :

- Les analyses ne contextualisent pas assez les ruptures temporelles, valeurs manquantes, données remplies ou valeurs exclues.
- Les graphiques ne distinguent pas systématiquement valeur observée, valeur corrigée, valeur simulée et valeur flaggée.
- La terminologie reste mixte : `Climat`, `Hydrologie & Qualité`, `Pollution`. Pour un décideur, il manque une couche de synthèse : "situation", "tendance", "alerte", "confiance".

Priorité :

- Majeure pour la lisibilité QA.
- Mineure à majeure pour la hiérarchie décisionnelle selon public cible.

### Scénarios

Réussi :

- Le hub scénarios existe et réduit l'effet placeholder.
- La comparaison hydro ajoute un delta vs référence, utile pour DSS.
- La logique n'a pas cassé les endpoints existants.

Manques :

- Le hub ne consomme pas encore le statut réel `/swat/analysis/status` ou `/ingestion/scenarios`.
- Les CTA renvoient vers les dashboards existants sans préselection de contexte.
- Le périmètre est ambigu : l'écran dit SWAT / WASP, mais la comparaison active semble surtout WASP simulé vs hydro observé dans `swat_analysis.py`.
- Les scénarios ne sont pas encore reliés à un workflow de validation métier affiché clairement.

Priorité :

- Majeure avant présentation décisionnelle externe.

### Data / administration / ingestion

Réussi :

- L'administration couvre data-scan, users/audit, ingestion, popup rules.
- L'ingestion affiche validation structurelle, mapping, doublons, QA, dry-run et export.
- Les actions sont auditées via services dédiés.

Manques :

- Les pages admin mélangent encore diagnostic, correction, configuration et validation.
- L'utilisateur ne voit pas toujours clairement si une action est lecture seule, simulation, écriture de métadonnées ou mutation métier.
- La page `DataViewer` repose sur `/raw/*`, donc elle doit être considérée comme outil d'administration contrôlée, pas comme explorateur grand public.

Priorité :

- Critique pour le cloisonnement des permissions et des actions mutantes.

### Autres vues

- `Dashboard1` reste un dashboard historique actif sous `/dashboard`. Il doit être explicitement classé : legacy, démo ou support opérationnel.
- `DashboardClimate` existe mais n'est pas dans le routeur réel `App.tsx`, alors qu'il apparaît dans `router.tsx`. Ce décalage crée une dette de compréhension.
- Les pages institutionnelles sont utiles mais non critiques pour industrialisation.

## 4. Revue critique par logique métier

### Hydrologie

État :

- Lot 3A en `SYNCED_WITH_QA_FLAGS`, Lot 3B `SYNCED`.
- Les tables `hydro.mesure_debit` et `hydro.mesure_debit_mensuel` sont volumineuses et exposées par API.
- Les QA flags négatifs et outliers existent.

Faiblesses :

- Les valeurs négatives sont techniquement flaggées mais pas encore expliquées dans les vues métier.
- Le parsing mensuel a été traité côté documentation, mais la preuve UI/API de traitement des mois reste à stabiliser.
- La compatibilité `station_id` / legacy reste visible dans le backend.

### Météo

État :

- Le volume météo est conséquent et bien exposé (`meteo.mesure_precipitation`, `meteo.mesure_evaporation`).
- Les vues QA météo existent (`api.v_meteo_*_qa`).

Faiblesses :

- `meteo.mesure_temperature` est à 0 ligne selon la documentation et la DB, mais l'UI conserve un parcours température. Cela doit être expliqué explicitement à l'utilisateur pour éviter une lecture "panne applicative".
- Les données NASA/remplies/observées ne sont pas encore très lisibles dans l'interface.

### Qualité

État :

- Les tables qualité cibles existent : rivières, nappes, barrages, Sebou, garde, pollution.
- Les anomalies de mapping paramètre sont les plus structurantes.

Faiblesses :

- L'API `/quality/*` reste centrée sur rivière pour les séries classiques.
- Les nappes, barrages, Sebou, garde et IDP ne sont pas unifiés dans un contrat API qualité cohérent.
- La dette d'alias paramètre reste forte, malgré la documentation détaillée.

### Pollution / IDP

État :

- Lot 4A-4 en `BLOCKED_BY_INFRA`.
- Les conflits IDP sont quantifiés : `5618` conflits métier de duplication / fragmentation, plus décisions topographiques ouvertes.

Faiblesses :

- Le support géospatial des rejets n'est pas verrouillé.
- Le rattachement aux `infra.rejet_*` reste le risque métier principal.
- L'UI pollution peut afficher inventaire ou couches, mais ne porte pas encore une lecture claire "source validée / source orpheline / source à créer".

### Scénarios SWAT / WASP

État :

- Les schémas `swat_*` et `wasp_*` existent.
- WASP contient un volume fort (`wasp_sebou.wasp_results`).
- Les services QA scénarios sont présents.

Faiblesses :

- SWAT semble partiellement différé : le statut du routeur indique des tables SWAT legacy vides ou ETL non exécuté.
- Le vocabulaire frontend "SWAT / WASP" peut donner l'impression que les deux moteurs sont au même niveau de maturité, ce qui n'est pas démontré.
- Les seuils QA SWAT/WASP sont encore en partie codés dans les services, avec overrides DB possibles, mais la gouvernance métier des seuils n'est pas assez visible.

### QA / validation / ingestion

État :

- Les contrôles existent sur les scénarios et certaines tables métier.
- Les exports critiques existent.

Faiblesses :

- Les statuts QA backend (`CRITIQUE`, `AVERTISSEMENT`, `INFO`, `VALIDE`) et les statuts UI (`VALID`, `FLAGGED`, `OUTLIER`, `MISSING`) ne sont pas encore un mapping canonique unique.
- Les QA flags historiques, métiers, statistiques et de mapping sont mélangés.
- La validation client/métier reste documentée mais pas encore matérialisée comme workflow applicatif de décision.

## 5. Tableau des oublis et manques

| Élément | Niveau | Impact | Priorité | Action recommandée |
|---|---|---|---|---|
| Mise à jour `frontend_reference.md` post-refactor DSS | Manque documentaire | Documentation en retard sur l'UI réelle | Haute | Documenter menu métier, context bar, QA badges, hub scénarios, composants touchés. |
| Mise à jour `visualization_strategy.md` | Manque documentaire | Stratégie SIG encore trop cible / pas assez réelle | Haute | Aligner avec `/layers/*`, `layerManager.ts`, `metadata.popup_rules_config`, QA visuelle. |
| Classification des fichiers backend legacy non montés | Oubli technique | Risque de réactivation accidentelle | Haute | Ajouter un registre `legacy_backend_routes.md` ou supprimer après validation. |
| Mapping canonique QA backend -> UI | Manque métier / UX | Badges potentiellement trompeurs | Haute | Définir `VALID/FLAGGED/OUTLIER/MISSING` à partir des flags DB et des statuts QA backend. |
| Séparation scripts read-only / dry-run / mutation | Oubli workflow | Risque d'exécution destructrice ou prématurée | Critique | Renommer, classer et documenter les scripts par niveau de risque. |
| Workflow de décision Lot 4A-3 | Manque métier | 609 updates restent bloqués | Critique | Formaliser décision métier signée : appliquer, ignorer ou archiver. |
| Workflow de décision Lot 4A-4 | Manque métier / SIG | IDP non industrialisable | Critique | Trancher topographie, fusion 2024, règles de création/rattachement rejets. |
| Statut réel de `Dashboard1` | Oubli frontend | Confusion route `/dashboard` | Moyenne | Classer legacy, démo ou opérationnel. |
| Suppression ou synchronisation de `frontend/src/router.tsx` | Faiblesse frontend | Deux routeurs divergents dans le dépôt | Moyenne | Supprimer si inutilisé ou générer depuis `App.tsx`. |
| Gouvernance des seuils QA SWAT/WASP | Manque métier | Seuils discutables en audit externe | Haute | Documenter source métier des seuils et procédure d'override. |

## 6. Tableau des faiblesses et risques

| Élément | Faiblesse | Risque | Gravité | Recommandation |
|---|---|---|---|---|
| Routeurs legacy `public.*` | Fichiers non montés mais présents | Réintroduction d'endpoints cassés | Majeure | Isoler dans `legacy_archive` ou supprimer après revue. |
| `raw` CRUD générique | Puissant mais large | Mutation accidentelle en prod | Critique | Restreindre schémas, permissions, audit, et éventuellement désactiver en prod. |
| `observatory.py` migrations runtime | `ALTER TABLE` dans routeur | Drift de schéma non versionné | Majeure | Déplacer vers migrations SQL contrôlées. |
| QA badges UI | Statut par défaut `VALID` possible | Mauvaise interprétation métier | Critique | Ne jamais afficher `VALID` sans preuve ; utiliser `UNKNOWN` ou `MISSING`. |
| Station ID legacy | Multiples pivots acceptés | Résultats incohérents par station | Majeure | Exposer clairement `station_id_uuid`, `code_station`, `legacy_id`. |
| Qualité API | Couverture rivière dominante | Nappes/barrages/IDP sous-représentés | Majeure | Créer contrat qualité unifié basé sur vues `api.v_qualite_*`. |
| Scénarios SWAT/WASP | Maturité asymétrique | Décision fausse sur modèles disponibles | Majeure | Afficher statut de disponibilité par moteur. |
| Scripts `run_bloc*` | Mutations réelles dans scripts proches des audits | Erreur humaine | Critique | Ajouter préfixes `readonly_`, `dryrun_`, `mutate_` et garde-fous. |
| Documentation dérivée | Mise à jour non atomique | Agents IA mal guidés | Majeure | Mettre `00_SOURCE_OF_TRUTH_MASTER` + docs domaine dans une checklist obligatoire. |
| Bundle frontend | Warning Vite chunks > 500 kB | Performance mobile dégradée | Moyenne | Lazy-load dashboards lourds et librairies carto/scénarios. |

## 7. Recommandations priorisées

### Quick wins

- Mettre à jour `docs/01_project_reference/frontend/frontend_reference.md` avec l'état réel post-refactor DSS.
- Mettre à jour `docs/01_project_reference/gis_visualization/visualization_strategy.md` avec la réalité `/layers/*`, `MapLegend`, `MapTooltip`, `SidebarFilters`, `layerManager`.
- Marquer explicitement `frontend/src/router.tsx` comme inutilisé ou le supprimer après vérification.
- Ajouter un statut `UNKNOWN` ou `NO_QA_DATA` dans les badges QA UI pour éviter `VALID` par défaut.
- Ajouter dans les popups carte la date de dernière mesure et la source réelle de la valeur affichée.
- Documenter le statut réel de `/dashboard` et `Dashboard1`.

### Améliorations moyen terme

- Créer un contrat API qualité unifié : rivières, nappes, barrages, Sebou, garde, pollution, IDP.
- Normaliser le mapping QA backend -> frontend avec une table de correspondance unique.
- Déplacer les créations / altérations de tables hors routeurs vers migrations SQL versionnées.
- Ajouter des smoke tests métier sur les cinq parcours critiques : sidebar, Dashboard2, légende, popups QA, scénarios/comparaison.
- Introduire du lazy loading frontend par dashboard pour réduire les chunks.
- Écrire une matrice frontend `vue -> endpoint -> table/vues -> QA flags`.

### Chantiers structurants

- Finaliser la purge ou l'archivage des fichiers backend legacy `public.*`.
- Industrialiser les pipelines de lot avec trois niveaux stricts : audit read-only, simulation dry-run, mutation validée.
- Verrouiller les décisions Lot 4A-3 et Lot 4A-4 dans un workflow métier formel.
- Stabiliser l'exposition IDP : topographie, clé de fusion, dédoublonnage, rattachement SIG, affichage cartographique.
- Mettre en place des tests d'intégration API sur les routeurs `hydro`, `climate`, `quality`, `observatory`, `analytics`, `layers`, `ingestion`.
- Mettre sous gouvernance métier les seuils QA SWAT/WASP et les seuils qualité eau.

## 8. Verdict final

Le système n'est pas encore prêt pour une industrialisation complète sans réserve.

Il est prêt pour :

- démonstration métier contrôlée ;
- recette interne ;
- consolidation documentaire finale ;
- smoke tests métier ;
- préparation d'un lot de stabilisation backend/frontend ;
- arbitrage métier sur les lots bloqués.

Il n'est pas encore prêt pour :

- exposition production non encadrée ;
- ingestion IDP finale ;
- usage décisionnel externe sans avertissement sur les QA flags ;
- maintenance par une équipe nouvelle sans passation détaillée ;
- activation libre des scripts de migration.

Ce qui doit impérativement être verrouillé avant la phase suivante :

1. Fermer ou archiver les fichiers backend legacy `public.*` non montés.
2. Verrouiller le contrat canonique station : UUID, code station, legacy ID.
3. Corriger la documentation frontend et SIG après le refactor DSS.
4. Empêcher les badges QA de communiquer une validité non prouvée.
5. Séparer scripts read-only, dry-run et mutation.
6. Déplacer les changements de schéma runtime vers migrations.
7. Clore les décisions métier Lot 4A-3 et Lot 4A-4.
8. Exécuter une campagne de smoke tests métier documentée.
9. Créer une matrice API/UI/DB/QA pour les vues critiques.
10. Ne pas annoncer le projet comme industrialisé tant que ces points ne sont pas traités.

