Agis comme un expert senior en architecture PostgreSQL/PostGIS/TimescaleDB, en migration contrôlée de bases de données métier, en data engineering, en urbanisation SI, en refactoring de schémas legacy, et en architecture de plateformes web SIG / hydrologie / eau / environnement.

Je travaille sur une base de données de système d’aide à la décision (SAD) orientée eau, hydrologie, qualité des eaux, stations, barrages, nappes, rejets, précipitations, débits, réseaux hydrographiques, référentiels administratifs et objets spatiaux.

La Phase A d’assainissement structurel a déjà défini :
- la doctrine cible des schémas,
- la politique stricte sur le schéma public,
- les conventions de nommage,
- la standardisation UUID / colonnes techniques / PostGIS / TimescaleDB,
- le principe d’une couche `api` composée de vues consommées par la plateforme.

Je veux maintenant exécuter la **Phase B — migration contrôlée des tables restantes du schéma public vers les schémas métier**, sans casser l’application, sans perdre de données, et en préparant les vues finales consommées par ma plateforme web.

## Objectif principal
Produire un plan de migration détaillé, priorisé et exécutable pour :
1. identifier toutes les tables métier restantes dans `public`,
2. les affecter à leur schéma cible (`admin`, `geo`, `infra`, `hydro`, `meteo`, `qualite`, etc.),
3. définir pour chacune la bonne stratégie de migration,
4. produire le SQL de migration,
5. produire les contrôles avant/après,
6. produire la stratégie de compatibilité transitoire,
7. produire le pack initial de vues `api` à mettre en place pour la plateforme web.

## Contexte cible à prendre en compte
La doctrine cible est la suivante :
- `public` = technique / extensions / fonctions globales uniquement
- `admin` = référentiels administratifs
- `geo` = objets spatiaux et référentiels géographiques
- `infra` = stations, barrages, capteurs, STEP, sources de pollution, ouvrages
- `hydro` = mesures hydrologiques, niveaux, débits, bathymétrie
- `meteo` = précipitations, températures, évaporation
- `qualite` = qualité des eaux, campagnes, paramètres, résultats analytiques
- `api` = uniquement vues et vues matérialisées de consommation applicative

Le backend FastAPI et la plateforme web doivent progressivement cesser de lire directement `public` et basculer vers `api`.

## Ce que tu dois produire
Je veux une réponse structurée, actionnable, non théorique, avec du SQL commenté, des étapes opérationnelles, et une logique de migration sécurisée.

Ta réponse doit obligatoirement contenir les sections suivantes :

# 1. Diagnostic de départ Phase B
Analyse la situation de migration à partir des documents fournis et établis :
- quelles tables du schéma `public` semblent encore métier,
- quels objets paraissent prioritaires,
- quelles tables semblent pouvoir être simplement déplacées,
- quelles tables semblent nécessiter une refonte partielle,
- quelles tables dépendent encore de clés legacy texte,
- quels objets présentent un risque élevé de casse applicative.

Distingue clairement :
- faits observés,
- recommandations,
- hypothèses.

# 2. Inventaire complet des objets à migrer
Construis une matrice exhaustive avec au minimum les colonnes suivantes :
- schéma actuel
- nom actuel
- type d’objet (table, vue, mview, séquence, fonction liée, trigger lié)
- domaine métier
- schéma cible
- nom cible
- priorité (P1, P2, P3)
- complexité (faible, moyenne, forte)
- stratégie de migration
- dépendances applicatives probables
- remarques

Je veux un inventaire aussi complet que possible, en particulier pour :
- stations
- barrages
- bassins / sous-bassins
- réseau hydro
- nappes
- points d’eau
- décharges
- huileries
- rejets industriels
- rejets domestiques
- fosses septiques
- STEP
- bathymétrie
- tables de mesures encore en public
- vues historiques encore liées à public

# 3. Typologie officielle des migrations
Définis les types de migration à utiliser et leur protocole exact.

Je veux au minimum les catégories suivantes :
- Type A : déplacement simple de schéma
- Type B : déplacement + renommage
- Type C : déplacement + ajout de colonnes techniques
- Type D : reconstruction vers une nouvelle table cible avec transformation
- Type E : migration avec table de mapping legacy
- Type F : migration avec conservation d’une vue de compatibilité dans `public`
- Type G : remplacement d’une ancienne vue par une vue `api`
- Type H : migration vers hypertable TimescaleDB si pertinent

Pour chaque type, explique :
- quand l’utiliser,
- comment l’exécuter,
- les risques,
- les contrôles obligatoires,
- le rollback minimal.

# 4. Matrice cible table par table
Pour chaque table restante du schéma `public`, donne :
- le schéma cible,
- le nom cible,
- la justification métier,
- la stratégie de migration retenue,
- le niveau de risque,
- l’ordre recommandé de traitement,
- les dépendances à traiter avant,
- les objets à recréer après migration (index, trigger, FK, vue, ORM).

Je veux une vraie feuille de route table par table.

# 5. Gestion des identifiants et mapping legacy
Définis précisément la stratégie de migration des anciennes clés métier vers les nouvelles clés techniques.

Traite explicitement :
- `code_station`
- `ire_station`
- anciens identifiants texte
- clés entières historiques
- correspondance station legacy -> `infra.station.id`
- correspondance barrage legacy -> `infra.barrage.id`
- cas des valeurs non appariées
- cas des doublons
- cas des lignes orphelines

Je veux :
- les règles métier,
- les requêtes SQL de mapping,
- les tables temporaires ou persistantes de correspondance,
- les règles de rejet / journalisation,
- la stratégie de validation.

# 6. Dépendances à contrôler avant toute migration
Je veux une checklist complète des dépendances à analyser avant chaque migration :
- vues dépendantes
- matérialisées dépendantes
- fonctions dépendantes
- triggers dépendants
- séquences
- index
- clés étrangères
- backend ORM / SQLAlchemy
- endpoints FastAPI
- requêtes frontend
- ETL / scripts Python / notebooks / exports BI

Pour chaque famille de dépendances, indique :
- comment la détecter,
- comment la sécuriser,
- comment la remettre en conformité après migration.

# 7. Pack SQL — pré-migration
Génère un pack SQL commenté pour préparer la migration :
- audit des tables encore présentes dans `public`
- audit des dépendances
- audit des PK/FK
- audit des colonnes legacy à mapper
- audit des colonnes géométriques
- audit des lignes orphelines
- audit des doublons potentiels
- audit des index manquants
- audit des triggers manquants
- audit des séquences associées
- audit des vues cassées ou fragiles

Je veux des requêtes SQL prêtes à exécuter.

# 8. Pack SQL — migration contrôlée
Génère le SQL détaillé pour les cas types de migration.

Je veux au minimum des exemples complets commentés pour :
- `public.stations_abhs` -> `infra.station`
- `public.barrages_abhs` -> `infra.barrage`
- `public.bassin_sebou` -> `geo.bassin`
- `public.sous_bassin_sebou` -> `geo.sous_bassin`
- `public.reseau_hydro_abhs` -> `geo.reseau_hydro`
- `public.nappes_abhs` -> `geo.nappe`
- `public.huileries_abhs` -> `infra.huilerie`
- `public.decharges_abhs` -> `infra.decharge`
- `public.rejets_ind_abhs` -> `infra.source_pollution`
- `public.bathymetries_barrages_abhs` -> `hydro.barrage_bathymetrie`

Pour chaque exemple, je veux :
- le SQL préparatoire,
- le SQL de migration,
- le SQL de renommage,
- le SQL de recréation des index,
- le SQL de recréation des triggers,
- le SQL de contrôle post-migration,
- le SQL de rollback minimal.

# 9. Gestion de la compatibilité transitoire
Je veux une stratégie explicite de compatibilité pour éviter de casser l’existant.

Tu dois préciser :
- quand conserver une vue de compatibilité dans `public`,
- combien de temps la garder,
- comment la nommer,
- quels objets doivent être basculés immédiatement côté backend,
- quels objets peuvent rester transitoirement derrière des vues proxy,
- comment documenter cette période de coexistence.

Je veux aussi le SQL type pour :
- remplacer une ancienne table déplacée par une vue de compatibilité,
- conserver temporairement l’ancien nom tout en lisant la nouvelle table cible.

# 10. Pack de vues `api` à construire en parallèle
La migration de la Phase B doit préparer la consommation par la plateforme web.

Je veux donc un premier pack structuré de vues `api` à créer en parallèle de la migration, avec :
- nom de la vue,
- rôle fonctionnel,
- schémas / tables sources,
- colonnes exposées,
- usage frontend/backend,
- niveau de priorité,
- intérêt performance.

Je veux au minimum des propositions pour :
- `api.v_station_dimension`
- `api.v_barrage_dimension`
- `api.v_source_pollution_dimension`
- `api.v_territoire_dimension`
- `api.v_hydro_mesures_enrichies`
- `api.v_meteo_mesures_enrichies`
- `api.v_qualite_mesures_enrichies`
- `api.v_station_status_geojson`
- `api.v_barrage_geojson`
- `api.v_sources_pollution_geojson`
- `api.v_reseau_hydro_geojson`
- `api.v_kpi_global`
- `api.v_kpi_hydro_meteo`
- `api.v_kpi_qualite`
- `api.mv_station_latest_status`
- `api.mv_qualite_month`

Pour chaque vue, précise si elle doit être :
- simple vue,
- vue matérialisée,
- continuous aggregate TimescaleDB.

# 11. Plan d’exécution opérationnel de la Phase B
Donne un plan concret en étapes.

Pour chaque étape, je veux :
- objectif
- objets concernés
- prérequis
- SQL à lancer
- vérifications
- risques
- critères de validation
- critères de rollback
- impact applicatif probable

Je veux un ordre réaliste, par lots, du plus sûr au plus risqué.

# 12. Stratégie de tests et validation
Définis le protocole de validation de la migration :
- tests structurels
- tests de volumétrie
- tests de comparaison avant/après
- tests géométriques
- tests de cohérence des FK
- tests de performance
- tests backend API
- tests frontend web
- tests des routes GeoJSON
- tests de dashboards/KPI

Je veux les requêtes SQL ou méthodes de contrôle associées.

# 13. Risques majeurs et garde-fous
Liste les principaux risques de la Phase B :
- perte de données
- rupture des vues
- rupture ORM
- mauvaises jointures legacy
- régression cartographique
- incohérence des géométries
- doublons / lignes orphelines
- blocage de performance
- erreurs sur hypertables TimescaleDB
- mauvaises permissions d’accès

Pour chaque risque, propose un garde-fou concret.

# 14. Livrables finaux attendus de la Phase B
Je veux que tu conclues avec la liste des livrables que la Phase B doit produire :
- matrice finale de migration
- scripts SQL versionnés
- tables de mapping
- journal de migration
- vues de compatibilité temporaires
- pack initial de vues `api`
- checklist backend
- checklist DBA
- plan de purge finale du schéma `public`

## Exigences de qualité
- Réponse très structurée.
- Niveau expert mais exploitable.
- Pas de théorie vague.
- SQL commenté.
- Toujours expliciter les hypothèses.
- Toujours séparer ce qui doit être fait immédiatement, ce qui peut être transitoire, et ce qui doit être reporté.
- Prioriser la sécurité, la traçabilité, la maintenabilité et la compatibilité applicative.

## Important
Tu ne dois pas seulement “déplacer des tables”.
Tu dois raisonner comme un architecte de migration contrôlée :
- structure,
- données,
- dépendances,
- compatibilité,
- vues d’exposition,
- backend,
- frontend,
- tests,
- rollback.

## Documents à exploiter
Base-toi explicitement sur :
- le document Phase A d’assainissement structurel,
- la synthèse de migration public -> métier,
- l’architecture BDD PostGIS,
- les métadonnées SQL,
- l’export brut système,
- le pack des vues,
- les sources de données,
- le README projet.

Le résultat doit être directement exploitable comme feuille de route Phase B.

# 15. Rapport de validation et audit post-migration

Après avoir défini et exécuté la stratégie de migration Phase B, tu dois produire un dispositif complet de validation, d’audit et de contrôle qualité.

L’objectif est de garantir :
- aucune perte de données,
- aucune régression fonctionnelle,
- aucune incohérence structurelle,
- aucune rupture applicative,
- une traçabilité complète de la migration.

Tu dois produire les éléments suivants :

## 15.1. Rapport de validation global
Génère un modèle de rapport structuré contenant :

- périmètre de la migration (tables migrées, schémas impactés),
- date et version de la migration,
- environnement (dev / test / prod),
- nombre de tables traitées,
- nombre de lignes migrées par table,
- nombre de lignes rejetées,
- anomalies détectées,
- statut global (OK / WARNING / KO),
- résumé exécutif (risques résiduels, points à corriger).

Je veux un format exploitable :
- Markdown
- ou JSON structuré
- ou tableau synthétique

## 15.2. Vérification de l’intégrité des données
Génère les requêtes SQL pour valider :

- nombre de lignes avant/après migration par table,
- correspondance des clés (PK / FK),
- absence de perte de données,
- absence de duplication,
- vérification des NULL inattendus,
- cohérence des types de données,
- cohérence des valeurs métiers critiques.

Inclure :
- requêtes COUNT(*)
- EXCEPT / MINUS
- FULL OUTER JOIN pour comparaison
- hash de lignes si pertinent

## 15.3. Vérification des relations et contraintes
Génère les requêtes pour contrôler :

- validité des clés étrangères,
- absence de lignes orphelines,
- respect des contraintes CHECK,
- cohérence des relations station ↔ mesures,
- cohérence barrage ↔ mesures,
- cohérence territoire ↔ objets géographiques.

## 15.4. Audit des colonnes legacy et mapping
Vérifie spécifiquement :

- colonnes `code_station`, `ire_station`, anciens identifiants,
- taux de correspondance vers `UUID`,
- lignes non appariées,
- qualité du mapping,
- cas ambigus ou multiples correspondances.

Produis :
- requêtes SQL de détection,
- tableau de synthèse des anomalies,
- stratégie de correction.

## 15.5. Audit spatial PostGIS
Génère les contrôles pour :

- validité des géométries (ST_IsValid),
- cohérence SRID,
- géométries NULL inattendues,
- bounding box incohérentes,
- transformation correcte en 4326 pour les vues API,
- présence des index GIST.

Inclure :
- requêtes SQL
- indicateurs d’anomalie
- seuils de tolérance

## 15.6. Audit des performances
Propose des requêtes et méthodes pour vérifier :

- temps de réponse des vues `api`,
- performance des jointures principales,
- utilisation des index,
- analyse EXPLAIN / EXPLAIN ANALYZE,
- détection des scans séquentiels problématiques,
- coût des vues matérialisées.

## 15.7. Audit des dépendances applicatives
Définis comment vérifier que :

- le backend FastAPI ne dépend plus de `public`,
- toutes les routes utilisent `api.*`,
- les endpoints critiques fonctionnent,
- les requêtes ORM sont compatibles,
- les dashboards et cartes fonctionnent,
- les endpoints GeoJSON retournent des résultats valides.

Inclure :
- checklist backend
- checklist frontend
- tests API

## 15.8. Audit des vues `api`
Vérifie que :

- toutes les vues nécessaires existent,
- les vues ne dépendent plus de `public`,
- les colonnes exposées sont cohérentes,
- les types sont corrects,
- les données sont exploitables directement par le frontend.

## 15.9. Audit du schéma public (post-migration)
Génère les requêtes pour vérifier que :

- aucune table métier critique ne reste dans `public`,
- seules les exceptions transitoires existent,
- les vues de compatibilité sont identifiées,
- aucune nouvelle table n’a été recréée par erreur,
- les permissions sont correctes.

## 15.10. Journalisation de la migration
Propose un mécanisme pour tracer la migration :

- table `metadata.migration_log` ou équivalent,
- log des opérations effectuées,
- horodatage,
- nombre de lignes traitées,
- statut,
- erreurs,
- utilisateur ayant lancé la migration.

Fournis le SQL pour :
- créer cette table
- insérer des logs
- consulter les logs

## 15.11. Stratégie de rollback et reprise
Définis les mécanismes de sécurité :

- comment revenir à l’état précédent,
- sauvegardes nécessaires,
- snapshots,
- tables backup,
- stratégie de reprise après erreur,
- points de restauration.

## 15.12. Score de qualité post-migration
Propose un système de scoring simple :

- intégrité des données (0–100)
- cohérence structurelle
- conformité aux conventions
- performance
- couverture API

Avec :
- critères
- seuils
- interprétation

## 15.13. Checklist finale de validation
Génère une checklist opérationnelle à valider avant passage en production :

- migration exécutée
- tests OK
- vues API OK
- backend OK
- frontend OK
- données validées
- performances acceptables
- public nettoyé
- logs présents
- rollback prêt

## Exigences
- Tout doit être actionnable.
- Fournir du SQL réel.
- Fournir des checklists concrètes.
- Fournir des méthodes de validation automatisables.
- Ne rien laisser implicite.

## Important
Cette section est obligatoire :
la migration Phase B ne peut être considérée comme réussie que si ce rapport de validation est complet, vérifié et validé.

# 15. Rapport de validation et audit post-migration

Après avoir défini et exécuté la stratégie de migration Phase B, tu dois produire un dispositif complet de validation, d’audit et de contrôle qualité.

L’objectif est de garantir :
- aucune perte de données,
- aucune régression fonctionnelle,
- aucune incohérence structurelle,
- aucune rupture applicative,
- une traçabilité complète de la migration.

Tu dois produire les éléments suivants :

## 15.1. Rapport de validation global
Génère un modèle de rapport structuré contenant :

- périmètre de la migration (tables migrées, schémas impactés),
- date et version de la migration,
- environnement (dev / test / prod),
- nombre de tables traitées,
- nombre de lignes migrées par table,
- nombre de lignes rejetées,
- anomalies détectées,
- statut global (OK / WARNING / KO),
- résumé exécutif (risques résiduels, points à corriger).

Je veux un format exploitable :
- Markdown
- ou JSON structuré
- ou tableau synthétique

## 15.2. Vérification de l’intégrité des données
Génère les requêtes SQL pour valider :

- nombre de lignes avant/après migration par table,
- correspondance des clés (PK / FK),
- absence de perte de données,
- absence de duplication,
- vérification des NULL inattendus,
- cohérence des types de données,
- cohérence des valeurs métiers critiques.

Inclure :
- requêtes COUNT(*)
- EXCEPT / MINUS
- FULL OUTER JOIN pour comparaison
- hash de lignes si pertinent

## 15.3. Vérification des relations et contraintes
Génère les requêtes pour contrôler :

- validité des clés étrangères,
- absence de lignes orphelines,
- respect des contraintes CHECK,
- cohérence des relations station ↔ mesures,
- cohérence barrage ↔ mesures,
- cohérence territoire ↔ objets géographiques.

## 15.4. Audit des colonnes legacy et mapping
Vérifie spécifiquement :

- colonnes `code_station`, `ire_station`, anciens identifiants,
- taux de correspondance vers `UUID`,
- lignes non appariées,
- qualité du mapping,
- cas ambigus ou multiples correspondances.

Produis :
- requêtes SQL de détection,
- tableau de synthèse des anomalies,
- stratégie de correction.

## 15.5. Audit spatial PostGIS
Génère les contrôles pour :

- validité des géométries (ST_IsValid),
- cohérence SRID,
- géométries NULL inattendues,
- bounding box incohérentes,
- transformation correcte en 4326 pour les vues API,
- présence des index GIST.

Inclure :
- requêtes SQL
- indicateurs d’anomalie
- seuils de tolérance

## 15.6. Audit des performances
Propose des requêtes et méthodes pour vérifier :

- temps de réponse des vues `api`,
- performance des jointures principales,
- utilisation des index,
- analyse EXPLAIN / EXPLAIN ANALYZE,
- détection des scans séquentiels problématiques,
- coût des vues matérialisées.

## 15.7. Audit des dépendances applicatives
Définis comment vérifier que :

- le backend FastAPI ne dépend plus de `public`,
- toutes les routes utilisent `api.*`,
- les endpoints critiques fonctionnent,
- les requêtes ORM sont compatibles,
- les dashboards et cartes fonctionnent,
- les endpoints GeoJSON retournent des résultats valides.

Inclure :
- checklist backend
- checklist frontend
- tests API

## 15.8. Audit des vues `api`
Vérifie que :

- toutes les vues nécessaires existent,
- les vues ne dépendent plus de `public`,
- les colonnes exposées sont cohérentes,
- les types sont corrects,
- les données sont exploitables directement par le frontend.

## 15.9. Audit du schéma public (post-migration)
Génère les requêtes pour vérifier que :

- aucune table métier critique ne reste dans `public`,
- seules les exceptions transitoires existent,
- les vues de compatibilité sont identifiées,
- aucune nouvelle table n’a été recréée par erreur,
- les permissions sont correctes.

## 15.10. Journalisation de la migration
Propose un mécanisme pour tracer la migration :

- table `metadata.migration_log` ou équivalent,
- log des opérations effectuées,
- horodatage,
- nombre de lignes traitées,
- statut,
- erreurs,
- utilisateur ayant lancé la migration.

Fournis le SQL pour :
- créer cette table
- insérer des logs
- consulter les logs

## 15.11. Stratégie de rollback et reprise
Définis les mécanismes de sécurité :

- comment revenir à l’état précédent,
- sauvegardes nécessaires,
- snapshots,
- tables backup,
- stratégie de reprise après erreur,
- points de restauration.

## 15.12. Score de qualité post-migration
Propose un système de scoring simple :

- intégrité des données (0–100)
- cohérence structurelle
- conformité aux conventions
- performance
- couverture API

Avec :
- critères
- seuils
- interprétation

## 15.13. Checklist finale de validation
Génère une checklist opérationnelle à valider avant passage en production :

- migration exécutée
- tests OK
- vues API OK
- backend OK
- frontend OK
- données validées
- performances acceptables
- public nettoyé
- logs présents
- rollback prêt

## Exigences
- Tout doit être actionnable.
- Fournir du SQL réel.
- Fournir des checklists concrètes.
- Fournir des méthodes de validation automatisables.
- Ne rien laisser implicite.

## Important
Cette section est obligatoire :
la migration Phase B ne peut être considérée comme réussie que si ce rapport de validation est complet, vérifié et validé.