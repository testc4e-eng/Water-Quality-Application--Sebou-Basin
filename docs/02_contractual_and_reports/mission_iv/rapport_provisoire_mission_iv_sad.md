# [Espace logo / identité graphique]

# MARCHE / PROJET
## Système d'Aide à la Décision pour la gestion de la qualité des eaux de surface du bassin du Sebou

# RAPPORT PROVISOIRE - VERSION AVANCEE
## Mission IV - Développement du Système d'Aide à la Décision (SAD)

**Mission concernée :** Mission IV  
**Nature du document :** Rapport provisoire finalisé - version avancée  
**Date du document :** 10/04/2026  
**Version :** 0.3  
**Diffusion :** Maître d'Ouvrage, comité de pilotage, commission de suivi, équipe projet  

---

# PAGE DE GARDE INTERIEURE

**Projet :** Développement d'un Système d'Aide à la Décision pour la gestion de la qualité des eaux de surface  
**Territoire concerné :** Bassin du Sebou  
**Maître d'Ouvrage :** ABHS Sebou  
**Prestataire :** C4E AFRICA  
**Statut du document :** Rapport provisoire avancé, destiné à la restitution de l'état d'avancement de la Mission IV  
**Usage :** Document de référence pour suivi de production, validation progressive et préparation de stabilisation finale  

---

# NOTE PRELIMINAIRE

Le présent rapport rend compte de la production effective de la Mission IV relative au développement du Système d'Aide à la Décision destiné à la gestion de la qualité des eaux de surface du bassin du Sebou. Il est rédigé dans une logique de restitution technique et fonctionnelle des travaux réalisés.

Le système développé est aujourd'hui structuré, opérationnel dans sa logique principale et avancé sur l'ensemble de ses composantes majeures. Les modules attendus sont développés, les chaînes de traitement des modèles sont en place, la base de données intégrée joue pleinement son rôle de socle du dispositif, et la plateforme met à disposition des fonctions de visualisation, de cartographie, d'administration, de contrôle qualité et de traçabilité déjà mobilisables.

À ce stade d'avancement, les derniers travaux portent principalement sur l'adaptation de certaines restitutions à la lecture métier du client, l'optimisation des dashboards, l'organisation des menus, l'amélioration de l'ergonomie et le raffinement de certaines restitutions graphiques, analytiques et cartographiques. Le présent document doit ainsi être lu comme un rapport provisoire avancé, proche d'une version quasi finale, sans préjuger de la clôture administrative définitive de la mission.

---

# SOMMAIRE SIMULE

*Pagination indicative pour mise en page Word/PDF*

- Liste des figures .................................................................. 4
- Liste des tableaux ................................................................. 5
- Liste des abréviations ........................................................... 6
- 1. Introduction générale ....................................................... 7
- 2. Contexte du projet et rappel du cadre contractuel .......... 9
- 3. Objet et périmètre de la Mission IV ............................. 12
- 4. Rappel des objectifs du SAD ...................................... 14
- 5. Rappel des exigences du CPS pour la Mission IV .......... 17
- 6. Démarche générale de développement du SAD ............ 22
- 7. Architecture générale de la solution ............................ 26
- 8. Architecture applicative détaillée ................................ 31
- 9. Architecture de données et structuration de la base ... 37
- 10. Présentation détaillée des modules fonctionnels ....... 46
- 11. Présentation détaillée des dashboards ...................... 54
- 12. Présentation détaillée du dashboard cartographique .. 61
- 13. Présentation détaillée du dashboard analytique .......... 69
- 14. Intégration des modèles hydrologiques et qualité ..... 77
- 15. Module d'ingestion, contrôle qualité et validation ..... 84
- 16. Gouvernance des données et exploration brute ......... 92
- 17. Sécurité, habilitations et traçabilité .......................... 100
- 18. Modules d'administration et paramétrage .................. 107
- 19. Fonctionnalités d'export, de reporting et de restitution . 113
- 20. Avancement global des travaux .................................. 118
- 21. Eléments finalisés et ajustements en cours ............... 121
- 22. Contribution du SAD à la prise de décision ............... 125
- 23. Analyse détaillée de conformité au CPS .................... 130
- 24. Forces de la solution développée .............................. 139
- 25. Limites actuelles et derniers ajustements ................. 143
- 26. Prochaines étapes avant stabilisation finale .............. 147
- 27. Conclusion générale .................................................... 151
- Annexes .............................................................................. 154
- Recommandations de mise en page Word/PDF ............... 171

---

# LISTE DES FIGURES

- Figure 1. Architecture générale du SAD
- Figure 2. Chaîne de circulation des données depuis les sources jusqu'à la restitution
- Figure 3. Organisation générale des dashboards et des parcours de consultation
- Figure 4. Flux d'intégration, de simulation et de validation des scénarios SWAT/WASP
- Figure 5. Schéma logique simplifié de la base de données intégrée
- Figure 6. Chaîne de gouvernance, sécurité et traçabilité

---

# LISTE DES TABLEAUX

- Tableau 1. Synthèse des exigences structurantes de la Mission IV
- Tableau 2. Modules fonctionnels du SAD
- Tableau 3. Répartition des schémas de la base de données par rôle métier
- Tableau 4. Dashboards et écrans de la plateforme
- Tableau 5. Composants d'administration et de gouvernance
- Tableau 6. Ajustements en cours et finalité associée
- Tableau 7. Synthèse de conformité CPS
- Tableau A1. Tableau détaillé de conformité CPS
- Tableau B1. Synthèse détaillée des dashboards et écrans
- Tableau D1. Inventaire synthétique des modules
- Tableau E1. Inventaire des schémas de la base
- Tableau F1. Objets liés à la sécurité, à l'audit et au contrôle qualité

---

# LISTE DES ABREVIATIONS

| Abréviation | Signification |
|---|---|
| ABHS | Agence du Bassin Hydraulique du Sebou |
| API | Application Programming Interface |
| CPS | Cahier des Prescriptions Spéciales |
| CSV | Comma-Separated Values |
| DBO5 | Demande Biologique en Oxygène sur 5 jours |
| DCO | Demande Chimique en Oxygène |
| ETL | Extract, Transform, Load |
| GeoJSON | Format JSON pour objets géographiques |
| HTTPS | HyperText Transfer Protocol Secure |
| KPI | Key Performance Indicator |
| MO | Maître d'Ouvrage |
| PDF | Portable Document Format |
| QA | Quality Assurance |
| RBAC | Role-Based Access Control |
| SAD | Système d'Aide à la Décision |
| SIG | Système d'Information Géographique |
| SQL | Structured Query Language |
| SWAT | Soil and Water Assessment Tool |
| WASP | Water Quality Analysis Simulation Program |
| XLSX | Format Excel Open XML |

---

# 1. INTRODUCTION GENERALE

## 1.1 Finalité du document

Le présent rapport a pour finalité de formaliser l'état d'avancement de la Mission IV consacrée au développement du Système d'Aide à la Décision pour la gestion de la qualité des eaux de surface du bassin du Sebou. Il constitue un document de restitution de niveau bureau d'étude, destiné à être exploité dans le cadre du suivi du marché, de la préparation de la stabilisation finale de la solution et de la communication avec le Maître d'Ouvrage.

Ce document s'inscrit dans une logique de production. Il ne vise pas à commenter le projet à distance, mais à rendre compte des travaux effectivement mis en oeuvre, de l'architecture retenue, des modules développés, des schémas de données structurés, des écrans disponibles et des mécanismes d'administration, de traçabilité et de contrôle qualité déjà intégrés dans la plateforme.

## 1.2 Positionnement du rapport

Le rapport est volontairement positionné comme une **version provisoire avancée**. Cette formulation correspond à l'état réel du projet :

- le système est développé dans sa logique principale ;
- la base de données intégrée est structurée et exploitée comme socle du SAD ;
- les modules attendus par la Mission IV sont en place ;
- les modèles sont finalisés et intégrés dans le dispositif de gestion des scénarios et des résultats ;
- la plateforme est fonctionnelle ;
- les derniers ajustements relèvent surtout de l'adaptation métier, de l'ergonomie et de l'optimisation de la restitution.

En pratique, cette situation correspond à un niveau d'avancement élevé et stabilisé sur le plan de la production technique, tout en laissant la place aux derniers affinements attendus avant stabilisation complète et clôture finale.

## 1.3 Lecture générale du document

Le rapport est construit pour répondre à quatre besoins simultanés :

- confirmer, de manière argumentée, la production des travaux de la Mission IV ;
- présenter la solution dans une logique institutionnelle compréhensible par la Direction Générale et le Maître d'Ouvrage ;
- apporter un niveau de détail technique suffisant pour les annexes, la traçabilité et les futurs livrables ;
- structurer les éléments utiles à la préparation de la phase finale de stabilisation.

Dans ce cadre, une place importante est donnée à la base de données intégrée, à l'architecture applicative, aux modules métiers, aux dashboards, à l'ingestion des modèles, à la sécurité et à la conformité au CPS.

## 1.4 Niveau d'avancement retenu dans le rapport

Le niveau global d'avancement retenu dans le présent rapport est de **95 %**. Ce taux traduit une situation de quasi-finalisation. Il ne signifie pas que tout arbitrage ergonomique ou documentaire est clos, mais il confirme que le noyau fonctionnel, technique, applicatif et décisionnel du SAD est développé et opérationnel.

À ce stade d'avancement, les derniers ajustements portent principalement sur :

- l'optimisation des dashboards et de leur lisibilité ;
- l'organisation des menus et des accès ;
- l'adaptation de certaines restitutions à la lecture métier du client ;
- le raffinement de certains parcours graphiques, cartographiques et analytiques ;
- la consolidation finale du dossier de recette, de déploiement et de guide d'exploitation.

---

# 2. CONTEXTE DU PROJET ET RAPPEL DU CADRE CONTRACTUEL

## 2.1 Contexte général

Le bassin du Sebou constitue un territoire à forts enjeux hydrologiques, environnementaux et de gestion publique. La conduite de l'action publique sur un tel périmètre suppose la mise à disposition d'un système capable de centraliser les données, de restituer des indicateurs lisibles, de croiser les informations spatiales et temporelles, et de mobiliser les résultats de la modélisation pour soutenir la décision.

Dans ce cadre, le projet de SAD vise à doter le Maître d'Ouvrage d'une plateforme unifiée, accessible en environnement web, en mesure de consolider des données de nature variée et d'en faire un instrument d'exploitation décisionnelle.

## 2.2 Place de la Mission IV dans le projet global

La Mission IV correspond au développement du Système d'Aide à la Décision lui-même. Elle prolonge les travaux préparatoires relatifs aux données, aux référentiels, aux modèles et aux besoins de restitution, afin d'aboutir à une plateforme exploitable dans un cadre métier et institutionnel.

Cette mission couvre ainsi le coeur de la chaîne applicative :

- structuration de la base de données intégrée ;
- mise en oeuvre de l'architecture backend et frontend ;
- exposition des données et des agrégats ;
- visualisation cartographique et analytique ;
- intégration des scénarios issus des modèles ;
- administration, gouvernance et sécurité.

## 2.3 Cadre contractuel rappelé

Le CPS et la note méthodologique fixent un cadre clair pour la Mission IV. La solution attendue doit permettre :

- la centralisation de données hydrologiques, chimiques, biologiques et météorologiques ;
- l'intégration des résultats de modélisation hydrologique et de qualité des eaux ;
- la visualisation au moyen de tableaux de bord interactifs, de cartes thématiques et de rapports ;
- l'aide à la décision sur la base de scénarios et d'indicateurs ;
- la mise à disposition d'une architecture full web sécurisée, maintenable et compatible avec une exploitation mobile.

Par ailleurs, le CPS insiste sur plusieurs obligations structurantes :

- gestion des habilitations et des droits nominatifs ;
- traçabilité des opérations ;
- extraction multiformat ;
- réalisation des tests de fonctionnement ;
- maintenance ;
- documentation technique, manuels d'installation et guide d'utilisation.

## 2.4 Portée de la restitution produite dans le présent rapport

Le présent rapport prend appui sur le cadre contractuel, sur l'architecture effectivement mise en oeuvre dans la plateforme, sur les modules backend et frontend développés, ainsi que sur l'introspection SQL réelle de la base `abh_sad` exécutée en lecture seule dans le cadre de cette restitution. Cette base de travail permet d'étayer les sections relatives à l'architecture de données, à la gouvernance, à la sécurité, à l'intégration des modèles et aux annexes techniques.

---

# 3. OBJET ET PERIMETRE DE LA MISSION IV

## 3.1 Objet principal

L'objet principal de la Mission IV est de mettre à disposition un système web décisionnel permettant de transformer un ensemble de données environnementales, spatiales, analytiques et de modélisation en informations utiles à la gestion de la qualité des eaux de surface.

Le système développé répond à cet objectif en articulant :

- une base de données métier structurée par schémas ;
- une couche backend `FastAPI` exposant des routes spécialisées ;
- une couche frontend `React` dédiée aux dashboards, à la cartographie et à l'administration ;
- une chaîne d'ingestion et de contrôle qualité pour les résultats de modèles ;
- une couche de sécurité et de gouvernance intégrée.

## 3.2 Périmètre fonctionnel couvert

Le périmètre fonctionnel de la Mission IV couvre les familles suivantes :

- collecte et intégration des données ;
- intégration des résultats de modèles ;
- visualisation analytique et cartographique ;
- reporting et extraction ;
- administration, sécurité et traçabilité ;
- exploration des données brutes et gouvernance des référentiels.

## 3.3 Périmètre technique couvert

Sur le plan technique, la mission couvre :

- l'architecture full web ;
- la structuration de la base PostgreSQL/PostGIS/TimescaleDB ;
- l'exposition des vues et services métiers ;
- les mécanismes de filtrage, d'agrégation et de restitution ;
- les parcours d'administration ;
- la gestion des rôles, permissions, journaux et audits.

## 3.4 Ce que le présent rapport ne surinterprète pas

Le rapport ne présente pas comme finalisé ce qui relève encore d'une phase de stabilisation. En particulier, les points suivants restent traités avec mesure :

- finalisation ergonomique du dashboard scénarios dédié ;
- industrialisation complète de certains formats d'export institutionnels ;
- stabilisation finale du dossier de recette et du guide d'exploitation ;
- individualisation explicite du volet biologique dans la restitution.

Cette prudence ne remet pas en cause le caractère avancé du système. Elle permet au contraire de positionner correctement la solution comme un produit déjà construit, en cours de finition sur ses derniers ajustements de restitution et d'usage.

---

# 4. RAPPEL DES OBJECTIFS DU SAD

## 4.1 Objectif stratégique

Le SAD vise à mettre à disposition du Maître d'Ouvrage un environnement unifié de consultation, de croisement et d'exploitation des données utiles à la gestion de la qualité des eaux de surface. L'enjeu n'est pas uniquement de stocker de la donnée, mais de la transformer en information lisible, comparable et utile à la décision.

## 4.2 Objectifs opérationnels

Les objectifs opérationnels couverts par le système développé sont les suivants :

- réunir dans une même plateforme des données hydrologiques, météorologiques, qualité, pollution, spatiales et de modélisation ;
- exposer des séries temporelles, des indicateurs, des tableaux et des cartes ;
- permettre des parcours d'administration et de gouvernance ;
- sécuriser les accès et assurer la traçabilité ;
- intégrer les scénarios de modélisation dans une chaîne contrôlée ;
- faciliter l'extraction des résultats et leur partage.

## 4.3 Objectifs métier

Sur le plan métier, le système doit permettre de :

- suivre l'état des masses d'eau et des points de contrôle ;
- comparer des valeurs dans le temps ;
- identifier les évolutions, anomalies ou dépassements ;
- croiser les lectures analytiques et cartographiques ;
- mobiliser les résultats des modèles pour soutenir l'interprétation et les arbitrages.

## 4.4 Traduction concrète dans la plateforme développée

Les travaux réalisés ont permis de traduire ces objectifs dans une plateforme qui met à disposition :

- une page d'accueil institutionnelle et un accès unifié aux modules ;
- un dashboard cartographique interactif ;
- un dashboard analytique multi-domaines ;
- un centre d'ingestion SWAT/WASP ;
- un module de scan de disponibilité des données ;
- un explorateur de données brutes ;
- des pages de gestion utilisateurs, de réinitialisation, de journal d'audit et de règles popups.

---

# 5. RAPPEL DES EXIGENCES DU CPS POUR LA MISSION IV

## 5.1 Exigences fonctionnelles structurantes

Les exigences structurantes de la Mission IV peuvent être résumées dans le tableau suivant.

| Exigence | Contenu attendu | Réponse structurante du système |
|---|---|---|
| Centralisation des données | regrouper des données multi-sources | base sectorisée, staging, schémas métier, vues API, data scan |
| Intégration des modèles | intégrer SWAT, WASP et les scénarios | schémas dédiés, ingestion, simulation dry-run, QA, audit |
| Visualisation | tableaux de bord, graphiques, cartes | dashboards analytiques, dashboard cartographique, observatoire |
| Reporting | rapports et exports adaptés | PDF, CSV, XLSX, PNG, JSON, tableaux et exports locaux |
| Aide à la décision | lecture des indicateurs et scénarios | séries comparées, KPI, chroniques, filtres, couches cartographiques |
| Sécurité | rôles, droits, traçabilité | users, roles, permissions, activity logs, auth logs |
| Administration | pilotage et gouvernance | users, resets, popup rules, raw data viewer, scan, audit |

## 5.2 Exigences techniques majeures

Le CPS demande une solution :

- full web ;
- compatible HTTPS ;
- fondée sur des technologies modernes ;
- sécurisée ;
- mobile-responsive ;
- dotée d'une base intégrée ;
- capable de réaliser les extractions utiles ;
- apte à faire l'objet de tests et d'une maintenance.

La solution développée répond à cette logique à travers une architecture à trois niveaux - base, backend, frontend - appuyée sur PostgreSQL/PostGIS/TimescaleDB, FastAPI, React/Vite/TypeScript, et un ensemble de vues matérialisées, de services analytiques et de mécanismes de sécurité spécialisés.

## 5.3 Exigences relatives aux modules attendus

Le CPS attend explicitement quatre modules majeurs :

- module de collecte et d'intégration des données ;
- module d'intégration des résultats de modèles ;
- module d'analyse et de visualisation ;
- module de reporting.

Dans la solution mise en place, ces quatre modules existent, et ils sont complétés par une couche transversale d'administration, de gouvernance, de sécurité et de traçabilité.

## 5.4 Exigences relatives à la donnée

La donnée constitue une exigence centrale de la Mission IV. La plateforme doit en effet pouvoir accueillir des données de natures différentes, les structurer et les rendre exploitables. Dans la base intégrée, cette logique est aujourd'hui matérialisée par :

- 20 schémas actifs orientés par finalité métier ;
- une zone `staging` de 35 tables pour l'intégration intermédiaire ;
- des schémas métier dédiés à l'hydrologie, la météorologie, la qualité, les infrastructures, le spatial, les modèles, la sécurité et la gouvernance ;
- une couche `api` et `analytics` destinée à la restitution performante.

## 5.5 Exigences relatives à la traçabilité et aux habilitations

Le CPS impose une traçabilité nominative et une gestion détaillée des habilitations. La base et la plateforme mettent aujourd'hui à disposition :

- 3 rôles structurés : `viewer`, `manager`, `admin` ;
- 10 permissions explicites ;
- une table de jointure `security.role_permissions` ;
- 3 comptes utilisateurs nominatifs présents dans la base au 10/04/2026 ;
- 71 717 logs d'activité et 95 logs d'authentification ;
- un historique d'ingestion dédié comportant 14 enregistrements à date.

Ces éléments constituent déjà un socle robuste de conformité sur le plan de la gouvernance des accès et de la traçabilité technique.

---
# 6. DEMARCHE GENERALE DE DEVELOPPEMENT DU SAD

## 6.1 Principe directeur de développement

La démarche de développement retenue pour le SAD a consisté à construire une solution capable de relier, dans une même chaîne, les sources de données, les référentiels, les mécanismes d'exposition, les services métiers, les écrans de consultation et les fonctions d'administration. Cette logique a conduit à privilégier une architecture progressive, modulaire et fortement structurée.

Le travail réalisé a été organisé autour de cinq axes complémentaires :

- structuration de la base de données et des schémas métiers ;
- mise en place du backend et des routes spécialisées ;
- mise en oeuvre des écrans frontend et des dashboards ;
- intégration des modèles et du workflow d'ingestion ;
- sécurisation, traçabilité et gouvernance.

## 6.2 Construction progressive du socle de données

Sur le plan des données, la priorité a consisté à bâtir un référentiel suffisamment robuste pour accueillir des séries temporelles, des référentiels spatiaux, des inventaires, des dictionnaires et des résultats de modèles. La base `abh_sad` répond aujourd'hui à cette logique avec une sectorisation forte par schéma.

Cette organisation permet notamment de :

- distinguer la donnée source de la donnée exposée ;
- préserver une zone de staging pour l'intégration et les traitements ;
- rendre lisible la séparation entre tables métier, vues API, agrégats analytiques et objets de sécurité ;
- préparer l'évolutivité du système sans remettre en cause son architecture.

## 6.3 Développement applicatif et logique de services

La couche backend a été développée pour jouer le rôle d'interface entre la base et la restitution web. Plutôt que de laisser le frontend interroger directement des tables brutes, la solution repose sur des routes et services spécialisés qui exposent la donnée sous une forme métier, déjà filtrée, contrôlée et structurée.

Dans le même temps, le frontend a été organisé autour de pages et de composants cohérents avec les usages visés : cartographie, analytique, administration, sécurité, exploration brute, ingestion et audit.

## 6.4 Recherche de cohérence entre technique et métier

Une partie importante des travaux a consisté à faire converger des logiques différentes :

- logique de base de données et d'intégration ;
- logique de route et de service ;
- logique de restitution visuelle ;
- logique de gouvernance des accès ;
- logique de lecture métier attendue par le client.

Cette convergence se retrouve aujourd'hui dans la structuration de l'observatoire, dans l'organisation des thèmes et sous-thèmes, dans les filtres du dashboard analytique, dans le regroupement des couches cartographiques et dans la séparation nette entre fonctions de consultation et fonctions d'administration.

## 6.5 Situation en phase de finalisation avancée

À ce stade, le travail n'est plus centré sur la construction du socle principal. Il porte avant tout sur des ajustements ciblés :

- amélioration de la lecture métier de certaines vues ;
- optimisation de la navigation et des menus ;
- harmonisation de certaines restitutions ;
- formalisation finale des éléments de recette et d'exploitation.

Le système est ainsi entré dans une phase de finalisation avancée, ce qui correspond au positionnement retenu dans le présent rapport.

---

# 7. ARCHITECTURE GENERALE DE LA SOLUTION

## 7.1 Vue d'ensemble

L'architecture mise en oeuvre repose sur une organisation en couches, chacune ayant une responsabilité clairement identifiée :

- une couche de données et de persistance ;
- une couche d'exposition et de logique métier ;
- une couche de restitution web ;
- une couche transversale d'administration, de sécurité et de gouvernance.

Cette structuration permet de contenir la complexité, de sécuriser les performances, de faciliter la maintenance et de soutenir l'évolution progressive du SAD.

## 7.2 Stack structurante

| Couche | Technologies principales | Rôle dans le système |
|---|---|---|
| Base de données | PostgreSQL, PostGIS, TimescaleDB | stockage, spatial, séries temporelles, vues et agrégats |
| Backend | FastAPI, Python, SQLAlchemy | services métier, API, sécurité, ingestion, observatoire |
| Frontend | React, Vite, TypeScript, React Query | dashboards, cartographie, administration, authentification |
| Restitution | Recharts, Chart.js, Plotly, html2canvas, jsPDF, XLSX, MapLibre | graphiques, exports, cartes, comparaisons |

## 7.3 Architecture full web

La solution répond à l'exigence d'architecture full web du CPS. La plateforme est conçue pour être consommée au travers d'un navigateur, avec une séparation claire entre le backend applicatif et l'interface frontend. Ce choix facilite :

- l'administration centralisée ;
- la maintenance ;
- la gouvernance des accès ;
- la préparation d'un déploiement sécurisé en HTTPS ;
- la compatibilité avec des usages multi-profils.

## 7.4 Schéma textuel de l'architecture générale

**Figure 1. Architecture générale du SAD**

```text
Sources de données métier
(hydrologie, qualité, météo, pollution, référentiels SIG, résultats SWAT/WASP, inventaires)
        ↓
Base de données structurée et sectorisée
(staging, hydro, meteo, qualite, geo, infra, metadata, security, swat_output, wasp_output, api, analytics)
        ↓
Services backend / API métier
(authentification, analytics, observatory, layers, raw, ingestion, audit, administration)
        ↓
Couche de restitution web
(page d'accueil, dashboard cartographique, dashboard analytique, scénarios, administration, exploration brute)
        ↓
Fonctions décisionnelles
(visualisation, comparaison, suivi, contrôle qualité, export, gouvernance, aide à la décision)
```

## 7.5 Logique de découplage

Le découplage mis en place entre la base, le backend et le frontend apporte plusieurs bénéfices opérationnels :

- possibilité de faire évoluer les services de restitution sans dégrader la persistance ;
- stabilisation des contrats métiers via les routes et vues d'exposition ;
- encapsulation des mécanismes de contrôle qualité et de sécurité ;
- réduction du risque de dépendance entre interface et tables brutes.

## 7.6 Place de la base de données dans l'architecture globale

La base n'est pas utilisée comme un simple espace de stockage. Elle constitue le noyau du dispositif, avec :

- des schémas spécialisés ;
- des tables métier à forte volumétrie ;
- des vues d'exposition ;
- des vues matérialisées pour la performance ;
- des tables de sécurité, d'audit et de QA ;
- des objets liés aux scénarios et aux résultats de modèles.

Cette centralité de la base est déterminante pour la robustesse du SAD. Elle permet notamment de sécuriser les calculs, de mutualiser les référentiels et de rendre cohérente la restitution sur l'ensemble des modules.

---

# 8. ARCHITECTURE APPLICATIVE DETAILLEE

## 8.1 Couche backend

Le backend est structuré autour de `FastAPI` et d'un ensemble de routeurs métiers spécialisés. Les routes actuellement en service couvrent les familles suivantes :

- `auth` pour l'authentification ;
- `users` pour la gestion des comptes ;
- `security/logs` pour les journaux ;
- `analytics` pour les menus et séries des dashboards ;
- `observatory` pour la hiérarchie métier, les popups et les entités ;
- `layers` et `geojson` pour la cartographie ;
- `climate`, `hydro`, `quality`, `measurements`, `entities`, `stations` pour les domaines métier ;
- `ingestion` pour l'import, la validation et le QA ;
- `raw` et `meta` pour l'exploration technique et la gouvernance de données.

Cette organisation permet de distribuer clairement les responsabilités applicatives et de maintenir des contrats d'API lisibles.

## 8.2 Couche frontend

Le frontend est organisé autour d'un ensemble cohérent de pages et de composants. Les routes actives structurent les parcours suivants :

- page d'accueil institutionnelle ;
- dashboard cartographique ;
- dashboard analytique ;
- écran dédié aux scénarios ;
- explorateur de données brutes ;
- scan de disponibilité des données ;
- gestion des utilisateurs ;
- demandes de réinitialisation ;
- journaux d'audit ;
- centre d'ingestion des modèles ;
- administration des règles popups ;
- écrans d'authentification et de changement de mot de passe.

## 8.3 Couche de restitution et de composants

La couche de restitution s'appuie sur :

- des composants graphiques pour les séries et comparaisons ;
- des composants tabulaires pour l'historique détaillé et la synthèse ;
- un moteur cartographique `MapLibre` ;
- des composants de filtre unifiés pour les thèmes, sous-menus, variables, entités, scénarios et périodes ;
- des mécanismes d'export image, PDF, CSV, Excel et JSON selon les écrans.

## 8.4 Mécanismes de performance

L'architecture applicative intègre des mécanismes de performance à plusieurs niveaux :

- vues matérialisées dans `analytics` et `api` ;
- agrégats déjà calculés pour les dashboards ;
- cache mémoire côté observatoire avec durée de vie courte ;
- consommation frontend via `react-query` ;
- filtrage et bornage des requêtes sur les parcours volumineux.

## 8.5 Cohérence entre UI, API et base

La solution bénéficie d'un alignement fort entre les trois niveaux. Cet alignement se vérifie dans les mappings suivants :

- le dashboard cartographique consomme `layers`, `geojson` et `observatory`, eux-mêmes adossés à `api.viz_carto_layers`, `api.mv_*_geojson` et `metadata.popup_rules_config` ;
- le dashboard analytique consomme `analytics` et `observatory`, eux-mêmes adossés à `analytics.mv_dashboard_*` et `api.viz_*_timeseries` ;
- le centre d'ingestion consomme `ingestion/*`, adossé à `swat_sebou`, `wasp_sebou`, `qa.variable_thresholds` et `audit.ingestion_audit_logs` ;
- la sécurité et l'administration consomment `users`, `auth`, `security/logs`, adossés à `security.users`, `security.roles`, `security.permissions`, `security.activity_logs` et `security.auth_logs`.

## 8.6 Familles de routes backend et contribution fonctionnelle

La logique de routes mise en place contribue directement à la lisibilité du système. Elle peut être regroupée comme suit.

| Famille de routes | Contribution principale | Objets ou écrans concernés |
|---|---|---|
| `auth` | authentification, rafraîchissement, changement de mot de passe | login, register, change-password |
| `users` | gestion des comptes et habilitations | user management, password resets |
| `security/logs` | supervision et traçabilité | audit logs |
| `analytics` | options et séries des dashboards analytiques | dashboard analytique climat, hydrologie, pollution |
| `observatory` | hiérarchie métier, popups, entités, KPI, cache | observatoire, cartographie, analytics |
| `layers` / `geojson` | exposition cartographique et géométrique | dashboard cartographique |
| `climate`, `hydro`, `quality` | services métier spécialisés | séries, indicateurs, détails métier |
| `ingestion` | import, simulation, validation, QA, audit scénarios | centre d'ingestion |
| `raw` / `meta` | exploration technique et gouvernance | data viewer, catalogues, documentation |

Cette structuration apporte un double bénéfice. D'une part, elle simplifie la maintenance et l'extension future de la plateforme. D'autre part, elle rend immédiatement compréhensible la correspondance entre écran, service métier et objet de base de données.

## 8.7 Parcours applicatif type

Un parcours usuel dans la plateforme peut être résumé de la manière suivante :

- l'utilisateur accède à la page d'accueil et rejoint un écran métier ;
- l'écran frontend déclenche un appel vers un endpoint spécialisé ;
- l'endpoint interroge une vue ou une table métier déjà préparée ;
- la réponse est restituée dans un graphique, un tableau, un KPI ou une couche cartographique ;
- le même utilisateur peut ensuite exporter le résultat, ouvrir un détail, ou basculer vers un module d'administration selon son rôle.

Cette continuité entre accès, consultation, contrôle et extraction est l'un des marqueurs de maturité de la solution.

---

# 9. ARCHITECTURE DE DONNEES ET STRUCTURATION DE LA BASE

## 9.1 Positionnement de la base intégrée

La base de données intégrée constitue le pivot du SAD. Son rôle est multiple :

- stocker les données métier ;
- accueillir les référentiels spatiaux et administratifs ;
- héberger les résultats de modèles ;
- supporter les vues d'exposition ;
- centraliser la sécurité et la traçabilité ;
- fournir un socle fiable aux dashboards, aux exports et aux contrôles QA.

Le diagnostic SQL exécuté en lecture seule sur `abh_sad` confirme que cette base est largement structurée et déjà alimentée à des volumes significatifs.

## 9.2 Inventaire global des schémas actifs

Au 10/04/2026, la base comporte **20 schémas actifs** directement utiles au SAD.

| Schéma | Tables | Vues | Vues matérialisées | Rôle métier principal |
|---|---|---|---|---|
| `admin` | 5 | 0 | 0 | découpages administratifs et référentiels territoriaux |
| `analytics` | 0 | 0 | 3 | menus et agrégats des dashboards |
| `api` | 0 | 49 | 25 | couche d'exposition SQL consommée par la plateforme |
| `audit` | 1 | 0 | 0 | historique des imports et du workflow d'ingestion |
| `geo` | 13 | 0 | 0 | bassins, sous-bassins, nappes, réseau hydrographique, sources |
| `hydro` | 7 | 0 | 0 | débits, barrages, mesures hydrologiques |
| `infra` | 22 | 0 | 0 | stations, barrages, points d'eau, STEP, rejets, inventaires |
| `metadata` | 37 | 2 | 3 | catalogues, mappings, référentiels paramètre, popups, observatoire |
| `meteo` | 5 | 0 | 0 | précipitation, évaporation, température, mesures météo |
| `modeles` | 3 | 0 | 0 | référentiels structurants associés aux modèles |
| `monitoring` | 3 | 0 | 0 | supervision métier et technique |
| `public` | 1 | 2 | 0 | compatibilité résiduelle et support historique |
| `qa` | 1 | 0 | 0 | seuils et objets de contrôle qualité |
| `qualite` | 8 | 0 | 0 | mesures de qualité des eaux |
| `security` | 11 | 0 | 0 | utilisateurs, rôles, permissions, logs |
| `staging` | 35 | 0 | 0 | intégration intermédiaire et préparation des données |
| `swat_output` | 8 | 0 | 0 | sorties et référentiels techniques SWAT |
| `swat_sebou` | 4 | 0 | 0 | scénarios et tables consolidées SWAT |
| `wasp_output` | 5 | 0 | 0 | sorties et référentiels techniques WASP |
| `wasp_sebou` | 3 | 0 | 0 | scénarios et résultats consolidés WASP |

## 9.3 Volumétries structurantes

Les comptages extraits de la base montrent une plateforme déjà alimentée à des volumes compatibles avec un usage décisionnel réel.

| Objet | Nombre de lignes | Période couverte |
|---|---:|---|
| `hydro.mesure_debit` | 521 433 | 1956-09-01 à 2025-08-31 |
| `hydro.mesure_barrage` | 84 831 | 1996-12-01 à 2025-09-01 |
| `meteo.mesure_precipitation` | 546 007 | 1985-09-01 à 2024-08-31 |
| `meteo.mesure_evaporation` | 48 900 | 2013-07-06 à 2024-08-31 |
| `qualite.mesure_qualite_riviere` | 60 097 | 1988-09-20 à 2024-11-28 |
| `qualite.mesure_qualite_barrage` | 8 714 | 1988-10-14 à 2024-11-29 |
| `qualite.mesure_qualite_nappe` | 63 088 | 1988-10-03 à 2024-11-29 |
| `qualite.mesure_qualite_sebou` | 51 402 | 2023-12-07 à 2025-09-25 |
| `wasp_sebou.wasp_results` | 931 770 | 2015-09-01 à 2025-08-31 |
| `security.activity_logs` | 71 717 | journalisation en production applicative |

Ces ordres de grandeur confirment que la base intégrée soutient déjà des usages de restitution et de gouvernance à forte densité.

## 9.4 Objets les plus structurants pour la performance

La présence de vues matérialisées lourdes confirme l'orientation assumée vers la performance des dashboards. Les objets les plus volumineux incluent notamment :

- `analytics.mv_dashboard_hydrologie_menu` : 281 MB ;
- `swat_output.stg_swat_qualite_long` : 167 MB ;
- `api.mv_hydro_debit_day_qa` : 91 MB ;
- `api.ca_meteo_precip_day` : 87 MB ;
- `analytics.mv_dashboard_pollution_menu` : 81 MB ;
- `wasp_sebou.wasp_results` : 74 MB ;
- `analytics.mv_dashboard_climat_meteo_menu` : 53 MB.

Cette structuration montre que la base a été pensée pour absorber la volumétrie tout en fournissant une restitution exploitable par écran métier.

## 9.5 Relations métier structurantes

Les principales relations SQL confirmées dans la base sont les suivantes :

- `hydro.mesure_debit.station_id -> infra.stations_mesure.id` ;
- `meteo.mesure_precipitation.station_id -> infra.stations_mesure.id` ;
- `meteo.mesure_temperature.station_id -> infra.stations_mesure.id` ;
- `qualite.mesure_qualite_riviere.station_id -> infra.stations_mesure.id` ;
- `qualite.mesure_qualite_riviere.parametre_ref_id -> metadata.referentiel_parametre.id` ;
- `qualite.mesure_qualite_sebou.parametre_ref_id -> metadata.referentiel_parametre.id` ;
- `swat_sebou.swat_subbasin_results.scenario_id -> swat_sebou.swat_scenarios.id` ;
- `wasp_sebou.wasp_results.scenario_id -> wasp_sebou.wasp_scenarios.id` ;
- `wasp_sebou.wasp_results.variable_id -> wasp_sebou.wasp_variables.id` ;
- `security.users.role_id -> security.roles.id`.

Ces relations assurent la cohérence entre entités terrain, séries temporelles, référentiels paramètre, scénarios et gouvernance des accès.

## 9.6 Architecture logique de circulation des données

**Figure 2. Chaîne de circulation des données**

```text
Sources historiques, inventaires, couches SIG, fichiers modèles SWAT/WASP
        ↓
Zone staging et normalisation
        ↓
Tables métier hydro / meteo / qualite / infra / geo / modeles
        ↓
Mappings, catalogues et référentiels metadata
        ↓
Vues API et vues matérialisées analytics
        ↓
Routes FastAPI et services métier
        ↓
Dashboards, cartographie, administration, data viewer, exports
```

## 9.7 Observatoire, catalogues et gouvernance métier

Le schéma `metadata` joue un rôle majeur dans la gouvernance fonctionnelle du système. Il héberge notamment :

- `referentiel_parametre` avec 91 paramètres référencés ;
- `popup_rules_config` avec 11 règles actives ;
- `api_view_catalog` et `api_view_column_catalog` pour la gouvernance des vues ;
- les objets `mv_obs_*` supportant la structuration de l'observatoire.

Le référentiel actif de l'observatoire est aujourd'hui organisé en **4 thèmes principaux** et **18 paramètres actifs** répartis entre climat et météo, hydrologie, qualité de l'eau et pollution. Les sous-thèmes identifiés dans la base couvrent notamment la précipitation, la température, le niveau, le débit, l'évaporation, la charge organique, les nutriments, l'oxygénation, les paramètres physico-chimiques, l'inventaire et les matières en suspension.

## 9.8 Place de la base dans la conformité technique

L'existence d'une base intégrée, structurée par finalité et exploitée via des vues d'exposition et des routes spécialisées répond directement aux attentes du CPS sur plusieurs plans :

- centralisation des données ;
- structuration des modules ;
- robustesse de l'architecture ;
- traçabilité ;
- évolutivité ;
- capacité d'intégration des modèles et de restitution.

## 9.9 Lecture par familles de schémas

Pour apprécier correctement l'architecture de données, il est utile de regrouper les schémas par familles de responsabilité.

### Schémas de référentiels et de contexte

Les schémas `admin`, `geo` et `infra` portent le contexte spatial, territorial et physique du système. Ils décrivent les limites, les entités du bassin, les infrastructures, les points de mesure et les objets de pollution. Cette famille joue un rôle fondamental dans la cartographie et dans l'enrichissement des dimensions métier.

### Schémas de mesures métier

Les schémas `hydro`, `meteo` et `qualite` concentrent la matière chronologique du système. Ils portent les séries exploitées par les dashboards, les contrôles qualité, les tableaux détaillés et les KPI. Le fait de les séparer clairement renforce la lisibilité de la base et facilite le pilotage par domaine.

### Schémas de transformation et d'intégration

Le schéma `staging` et les objets `metadata.mapping_*` structurent la phase de préparation des données. Ils assurent la transition entre matière brute, normalisation, référentiel canonique et exposition. Cette couche intermédiaire est déterminante pour la fiabilisation globale de la chaîne.

### Schémas d'exposition et de performance

Les schémas `api` et `analytics` traduisent l'orientation très pratique retenue dans le projet. Les données n'y sont pas stockées pour elles-mêmes ; elles y sont préparées pour servir les interfaces. Cette séparation permet de protéger les tables métier tout en accélérant la restitution.

### Schémas transverses

Les schémas `security`, `audit`, `qa`, `monitoring` et `metadata` assurent la gouvernance transversale du système. Cette famille confirme que le SAD a été conçu comme une application gouvernée, et non comme une simple couche de visualisation.

## 9.10 Fonctions et routines structurantes

La base intègre également plusieurs fonctions métier ou techniques qui contribuent à la solidité du dispositif. Les plus structurantes concernent :

- le rafraîchissement des vues qualité ;
- l'application de contrôles QA sur les séries hydro et météo ;
- les traitements sur les inventaires de pollution ;
- les fonctions de normalisation et de parsing dans `metadata` ;
- le rafraîchissement des vues de performance.

Ce point mérite d'être souligné, car il montre que la base porte déjà une partie de l'intelligence de contrôle et d'industrialisation du système.

---

# 10. PRESENTATION DETAILLEE DES MODULES FONCTIONNELS

## 10.1 Vision d'ensemble

Le SAD s'appuie sur un ensemble de modules complémentaires, chacun couvrant une fonction métier ou transversale clairement identifiée. Ces modules sont déjà développés et articulés dans une même plateforme.

## 10.2 Tableau des modules fonctionnels

| Module | Objectif | Composants principaux | Apport métier | Etat d'avancement |
|---|---|---|---|---|
| Collecte et intégration | intégrer et préparer les données | `staging`, `raw`, scan, mappings, vues métier | centralisation et préparation des données | développé et opérationnel |
| Intégration des modèles | intégrer SWAT/WASP et leurs scénarios | `swat_output`, `swat_sebou`, `wasp_output`, `wasp_sebou`, ingestion | exploitation des résultats de modélisation | développé, finalisé dans sa logique principale |
| Analyse et visualisation | exposer graphiques, KPI, tableaux, cartes | dashboards analytiques, observatoire, cartographie | lecture métier et comparaison | développé et exploitable |
| Reporting | extraire et restituer les résultats | PDF, CSV, XLSX, PNG, JSON | diffusion et partage des résultats | développé, homogénéisation en cours |
| Administration | gérer comptes, popups, audit, scan, raw | users, password resets, audit, popup rules, data scan | pilotage et gouvernance applicative | développé et intégré |
| Sécurité et traçabilité | contrôler l'accès et journaliser les usages | auth, roles, permissions, logs, activity logs | conformité et maîtrise des opérations | développé et structuré |

## 10.3 Module de collecte et d'intégration des données

Ce module assure la prise en charge des données brutes et leur transformation en objets exploitables par la plateforme. Il s'appuie sur la zone `staging`, sur les routes `raw`, sur les catalogues `metadata`, ainsi que sur le scan de disponibilité des données.

De manière opérationnelle, il permet :

- d'exposer les tables consultables ;
- de charger et visualiser les colonnes ;
- de filtrer et rechercher dans les données ;
- de mettre à jour certaines tables autorisées ;
- d'exporter les jeux de données sélectionnés ;
- de contrôler la couverture des stations, bassins et variables disponibles.

## 10.4 Module d'intégration des modèles et résultats

Ce module couvre l'intégration des sorties SWAT et WASP, les scénarios, la validation structurelle, la simulation d'ingestion, le contrôle qualité et l'historisation des opérations. Il constitue la passerelle entre la production de modélisation et la restitution dans le SAD.

## 10.5 Module d'analyse et de visualisation

Le module d'analyse et de visualisation regroupe :

- le dashboard analytique ;
- le dashboard cartographique ;
- l'observatoire et ses hiérarchies métier ;
- les indicateurs KPI ;
- les courbes temporelles ;
- les tableaux détaillés.

Il s'agit du coeur visible de la plateforme pour les utilisateurs métiers.

## 10.6 Module de reporting

Le reporting est assuré au travers d'exports directement déclenchables dans plusieurs écrans. Cette logique couvre déjà les usages opérationnels courants, même si la formalisation de certains gabarits institutionnels fait encore partie des derniers raffinements.

## 10.7 Modules transverses

En complément des modules principaux, la plateforme intègre une couche transversale structurante :

- sécurité ;
- audit ;
- paramétrage des popups ;
- scan de données ;
- data viewer ;
- gestion des comptes et des mots de passe.

Cette couche transversale renforce la maturité du système et le positionne au-delà d'un simple visualiseur de données.

---
# 11. PRESENTATION DETAILLEE DES DASHBOARDS

## 11.1 Organisation générale des écrans de restitution

La plateforme organise la restitution autour d'un noyau d'écrans cohérents entre eux :

- une page d'accueil jouant le rôle d'entrée institutionnelle ;
- un dashboard cartographique principal ;
- un dashboard analytique principal ;
- un écran dédié aux scénarios ;
- des écrans d'administration et de gouvernance ;
- un explorateur de données brutes.

Cette organisation permet de distinguer clairement :

- les usages de consultation métier ;
- les usages de pilotage et de paramétrage ;
- les usages de contrôle et de validation.

## 11.2 Tableau détaillé des dashboards et écrans

| Dashboard / écran | Domaine | Composants | Filtres disponibles | Indicateurs / graphiques | Valeur ajoutée métier |
|---|---|---|---|---|---|
| Page d'accueil | institutionnel | bannière, accès au dashboard, blocs de présentation | navigation directe | mise en contexte | point d'entrée unifié |
| Dashboard cartographique | cartographie métier | carte, filtres latéraux, légende, popups, emprises | couches, dates, entités, hiérarchie métier | vue spatiale, détails entité, couverture | lecture territoriale et navigation métier |
| Dashboard analytique - Climat | climat & météo | mode simple, mode multiple, KPI, tableau, courbes | scénario, sous-menu, variable, site, période | min, max, moyenne, séries temporelles | suivi climatique et comparaison |
| Dashboard analytique - Hydrologie | hydrologie & qualité | mode simple, mode multiple, KPI, tableau, courbes | scénario, sous-menu, variable, site, période | min, max, moyenne, chroniques | lecture des débits et niveaux |
| Dashboard analytique - Pollution | pollution / qualité | mode simple, mode multiple, KPI, tableau, courbes | scénario, variable, site, période | synthèse, séries, comparaisons | lecture des pressions et paramètres qualité |
| Dashboard scénarios | modélisation | écran dédié, route active, socle de restitution | selon paramétrage futur du module | restitution dédiée en finalisation | support final de lecture des scénarios |
| Data Scan | gouvernance des données | tableau de bord de disponibilité, synthèses, export JSON | option statistiques temporelles | total records, couverture, disponibilité | pilotage qualité des données |
| Data Viewer | exploration brute | table, recherche, affichage colonnes, CRUD, export | table, recherche texte, colonnes, pagination | jeu détaillé, export PDF/XLSX | transparence et gouvernance |
| Audit Logs | sécurité / audit | journaux API et auth, filtres utilisateur | limite, utilisateur, rafraîchissement | statut, méthode, durée, IP | traçabilité applicative |
| User Management | administration | création, édition, statut, reset, suppression | recherche, rôle, statut | comptes, rôles, activité récente | habilitations nominatives |
| Ingestion | modèles / QA | upload, simulation, anomalies, audit | modèle, scénario, variable, période, statut QA | score qualité, criticité, doublons | contrôle avant publication |
| Popup Rules | cartographie / paramétrage | liste des couches, édition des attributs popup | couche active, champs | activation, titre, champs affichés | personnalisation métier de la carte |

## 11.3 Articulation entre les dashboards

L'architecture des écrans n'a pas été conçue comme un ensemble de pages isolées. Les modules sont reliés entre eux par une logique de navigation continue :

- la page d'accueil oriente vers le dashboard cartographique ;
- le dashboard cartographique et le dashboard analytique se complètent ;
- les pages d'administration prolongent les usages de gouvernance ;
- l'observatoire et les routes analytiques fournissent un langage commun de thèmes, sous-thèmes, paramètres et entités.

## 11.4 Valeur de la structuration retenue

Cette organisation offre plusieurs bénéfices :

- lecture progressive du système, du plus visuel au plus détaillé ;
- capacité de passer d'un indicateur à un détail table ;
- articulation entre restitution métier, gouvernance et contrôle ;
- préparation naturelle à une exploitation de production.

---

# 12. PRESENTATION DETAILLEE DU DASHBOARD CARTOGRAPHIQUE

## 12.1 Rôle du dashboard cartographique

Le dashboard cartographique constitue la porte d'entrée territoriale du SAD. Il permet de visualiser les entités du bassin, de sélectionner les couches utiles, d'afficher les objets métiers, de consulter les attributs associés et de croiser l'information géographique avec la logique d'observatoire.

## 12.2 Moteur cartographique et couches principales

Le moteur repose sur `MapLibre`, complété par une couche de gestion des styles, des légendes et des interactions. Les familles de couches actuellement intégrées couvrent notamment :

- bassin versant ;
- sous-bassins ABH ;
- sous-bassins métier SWAT ;
- réseau hydrographique ;
- nappes ;
- sources ;
- stations ;
- points d'eau ;
- barrages ;
- STEP, STEP industrielles, STM ;
- fosses septiques, décharges, huileries, mines ;
- rejets industriels et rejets domestiques ;
- régions, provinces, cercles, communes, villes et douars.

Ces couches sont organisées dans un menu latéral structuré par blocs : géographie du bassin, stations de mesure, infrastructure, découpages administratifs et sources de pollution.

## 12.3 Logique de filtres et de navigation latérale

Le composant `SidebarFilters` propose une logique de navigation très utile pour le métier. Il permet :

- d'activer ou désactiver des couches ;
- de changer le mode de remplissage des polygones ;
- de zoomer sur une couche ;
- d'ouvrir un filtre sur certaines listes d'entités ;
- de rechercher dans les listes de stations, barrages, sous-bassins ou autres objets ;
- de piloter l'affichage à partir d'une hiérarchie métier et temporelle.

Cette structuration apporte une lecture fine de la carte et contribue directement à l'ergonomie de la plateforme.

## 12.4 Règles popups et restitution des attributs

Le dashboard cartographique s'appuie sur une logique de popups pilotée à la fois par des valeurs par défaut et par le paramétrage stocké dans `metadata.popup_rules_config`. La base contient actuellement **11 règles actives**, couvrant notamment les stations, points d'eau, barrages, réseau hydrographique, sources, sous-bassins SWAT et principaux découpages administratifs.

Concrètement, cette logique permet de définir par couche :

- le titre affiché ;
- les champs de nom ;
- les champs de type ;
- les champs de classe ;
- les champs de code ;
- le statut actif ou non de la règle.

La page d'administration des popups permet de modifier ces paramètres et de purger le cache observatoire afin d'appliquer immédiatement les ajustements.

## 12.5 Intégration à l'observatoire

Le dashboard cartographique ne se limite pas à des couches SIG statiques. Il est connecté à la logique d'observatoire au travers des routes `/observatory`, qui permettent notamment :

- de récupérer les thèmes ;
- de récupérer les sous-menus ;
- de récupérer les paramètres ;
- de récupérer les entités associées à un paramètre ;
- de récupérer les séries temporelles et les KPI liés aux entités.

Cette structuration permet notamment de passer d'une logique spatiale à une logique de lecture métier hiérarchisée.

## 12.6 Objets SQL mobilisés pour la cartographie

Le volet cartographique repose principalement sur :

- `api.viz_carto_layers` ;
- `api.mv_bassin_geojson` ;
- `api.mv_sous_bassin_geojson` ;
- `api.mv_reseau_hydrographique` ;
- `api.mv_station_dimension` ;
- `api.mv_barrage_dimension` ;
- `metadata.popup_rules_config`.

La vue `api.viz_carto_layers` centralise à elle seule **9 290 lignes de restitution cartographique**, ce qui confirme la densité réelle de l'exposition géographique utilisée par la plateforme.

## 12.7 Apport métier du dashboard cartographique

Le dashboard cartographique apporte une valeur métier directe sur plusieurs plans :

- compréhension rapide du territoire et des objets suivis ;
- rapprochement entre localisation, état des infrastructures et points de mesure ;
- repérage des sources de pollution et des éléments de contexte ;
- navigation transversale entre couches administratives, hydrauliques et environnementales ;
- support visuel à la prise de décision territoriale.

## 12.8 Ajustements encore en cours sur ce module

Les derniers ajustements portent principalement sur :

- l'optimisation de la lecture des menus et sous-menus ;
- le raffinement de certaines règles de popup ;
- l'amélioration du confort de navigation sur les écrans les plus denses ;
- l'harmonisation finale entre vue cartographique et vocabulaire métier.

## 12.9 Parcours utilisateur type sur le dashboard cartographique

Dans un usage courant, le dashboard cartographique permet à un utilisateur de :

- sélectionner une famille de couches dans le panneau latéral ;
- activer un objet géographique particulier, par exemple les stations, les barrages ou les sous-bassins ;
- filtrer visuellement le périmètre recherché ;
- consulter les attributs au travers d'une popup paramétrée ;
- recadrer la vue sur une couche ;
- prolonger ensuite la lecture par l'observatoire ou par le dashboard analytique.

Cette séquence d'usage est importante, car elle montre que la carte n'est pas conçue comme un simple support graphique. Elle agit comme un véritable point de navigation métier dans le système.

---

# 13. PRESENTATION DETAILLEE DU DASHBOARD ANALYTIQUE

## 13.1 Organisation générale

Le dashboard analytique constitue le coeur des usages temporels et comparatifs. Il est organisé autour de trois domaines :

- climat ;
- hydrologie & qualité ;
- pollution.

Chaque domaine est accessible au travers d'un onglet dédié et repose sur une vue unifiée comportant deux modes de lecture :

- **mode simple** pour une lecture ciblée d'une série ;
- **mode multiple** pour la comparaison de plusieurs séries.

## 13.2 Mode simple

Le mode simple combine dans un même écran :

- un panneau de filtres ;
- quatre cartes KPI ;
- un tableau historique ;
- un graphique temporel.

Les indicateurs calculés portent sur :

- le statut de disponibilité des données ;
- la valeur minimale ;
- la valeur maximale ;
- la moyenne.

Les filtres permettent de sélectionner :

- le scénario ;
- le sous-menu ;
- la variable ;
- le site ou l'entité ;
- la période, en particulier sur le domaine hydrologique.

## 13.3 Mode multiple

Le mode multiple a été conçu pour la comparaison de séries. Il permet de configurer plusieurs cartes de sélection en parallèle, chacune associée à une couleur, une entité, un paramètre et une période.

Les fonctions offertes comprennent :

- chargement de plusieurs séries ;
- fusion des points par date ;
- affichage en courbe ou en barres ;
- calcul des minimums, maximums et moyennes globales ;
- calcul d'une synthèse par série ;
- affichage d'un tableau détaillé ;
- export image ;
- export PDF ;
- export CSV.

Cette logique comparative constitue un apport fort pour l'exploitation métier, car elle permet de rapprocher plusieurs situations dans une même lecture.

## 13.4 Organisation par domaine métier

### Climat et météo

Le domaine climat s'appuie sur les séries de précipitation, d'évaporation et, côté structuration, sur la logique température intégrée à la plateforme. La base comporte actuellement :

- 546 007 lignes de précipitation ;
- 48 900 lignes d'évaporation ;
- une structure dédiée à la température, avec routage et filtres déjà en place.

Le climat analytique permet ainsi de restituer les variables météo selon une logique métier déjà lisible.

### Hydrologie et qualité

Le domaine hydrologique mobilise les mesures de débit, les données de barrage, les points d'eau et certains volets qualité. Il permet des lectures par période, avec des présélections rapides sur 30 jours, 3 mois, 1 an ou historique complet.

Les chroniques mobilisent principalement `hydro.mesure_debit`, `hydro.mesure_barrage`, `api.mv_hydro_debit_day_qa`, `api.mv_hydro_debit_mensuel` et les dimensions `api.v_station_dimension`.

### Pollution

Le domaine pollution permet de croiser des séries analytiques et des lectures liées à la qualité ou à l'inventaire. Les vues `analytics.mv_dashboard_pollution_menu`, `api.viz_pollution_timeseries`, `api.viz_qualite_timeseries` et les tables qualité ou résultats modèles participent à cette restitution.

## 13.5 Valeur métier des filtres

Le système de filtres constitue l'un des apports les plus significatifs du dashboard analytique. Il permet une lecture métier guidée, en évitant de placer l'utilisateur face à des tables brutes. Les sélections disponibles structurent la consultation autour de concepts compréhensibles : thème, sous-menu, variable, site, scénario, période.

## 13.6 Valeur métier des KPI et tableaux

Les KPI apportent une lecture immédiate des extrêmes et de la tendance moyenne. Les tableaux détaillés permettent ensuite de revenir à la chronologie fine. Ce double niveau de restitution - synthèse d'abord, détail ensuite - correspond précisément à l'usage attendu d'un SAD.

## 13.7 Objets SQL mobilisés pour le dashboard analytique

Les principaux objets SQL mobilisés sont :

- `analytics.mv_dashboard_climat_meteo_menu` ;
- `analytics.mv_dashboard_hydrologie_menu` ;
- `analytics.mv_dashboard_pollution_menu` ;
- `api.viz_climat_timeseries` ;
- `api.viz_hydro_timeseries` ;
- `api.viz_qualite_timeseries` ;
- `api.viz_pollution_timeseries` ;
- `api.ca_meteo_precip_day` ;
- `api.ca_meteo_evaporation_day` ;
- `api.mv_hydro_debit_day_qa` ;
- `api.mv_qualite_*_day`.

## 13.8 Ajustements encore en cours sur ce module

À ce stade du projet, les derniers ajustements sur le dashboard analytique portent sur :

- la hiérarchisation plus fine des filtres selon le domaine ;
- l'optimisation de certaines légendes et synthèses ;
- la lisibilité des tableaux en mode multiple ;
- l'amélioration de certains libellés et regroupements métier.

## 13.9 Lecture détaillée des filtres par domaine

La plateforme applique une logique de filtres adaptée à chaque famille métier.

### Domaine climat

Les filtres portent principalement sur le scénario, le sous-menu, la variable, le site et la période. Le système permet ainsi de passer d'une lecture large à une lecture ciblée sur une station ou un paramètre particulier.

### Domaine hydrologie

En hydrologie, la gestion de période est plus poussée avec des présélections rapides 30 jours, 3 mois, 1 an ou historique complet. Cette logique répond bien aux usages opérationnels de suivi des chroniques et des situations récentes.

### Domaine pollution

Dans le domaine pollution, les filtres soutiennent la comparaison de paramètres, d'entités et de périodes, en gardant une restitution orientée métier plutôt qu'une logique brute de colonnes ou de tables.

## 13.10 Valeur ajoutée du mode multiple

Le mode multiple mérite une attention particulière. Il constitue l'un des composants les plus utiles pour la prise de décision, car il permet de rapprocher plusieurs situations dans un même espace de lecture.

Sur le plan fonctionnel, ce mode permet :

- de comparer plusieurs sites ;
- de rapprocher plusieurs variables ;
- de lire différentes périodes ;
- de disposer d'un tableau détaillé consolidé ;
- de produire immédiatement un export de la comparaison.

Dans un contexte de pilotage, cette capacité à rapprocher des séries sans retraitement externe apporte un gain réel de temps et de lisibilité.

---

# 14. INTEGRATION DES MODELES HYDROLOGIQUES ET QUALITE DES EAUX

## 14.1 Positionnement des modèles dans le SAD

Le SAD ne traite pas les modèles comme des objets externes. Les travaux réalisés ont permis de les intégrer dans la logique globale du système, au travers de schémas dédiés, d'un centre d'ingestion, de fonctions de validation et d'un mécanisme de restitution préparé pour les scénarios.

Les deux familles de modèles intégrées sont :

- SWAT pour la composante hydrologique et certains résultats qualité ;
- WASP pour la composante qualité des eaux.

## 14.2 Schémas et objets dédiés

La base met à disposition quatre ensembles complémentaires :

- `swat_output` pour les sorties techniques et longues SWAT ;
- `swat_sebou` pour les scénarios et tables consolidées SWAT ;
- `wasp_output` pour les sorties techniques WASP ;
- `wasp_sebou` pour les scénarios et résultats consolidés WASP.

## 14.3 Situation réelle des objets modèles en base

Le diagnostic SQL confirme les éléments suivants :

- `swat_sebou.swat_scenarios` contient 1 scénario ;
- `swat_sebou.swat_subbasin_results` est structuré mais non encore peuplé à date dans la table consolidée ;
- `swat_sebou.swat_reach_results` est structuré mais non encore peuplé à date dans la table consolidée ;
- `wasp_sebou.wasp_scenarios` contient 1 scénario ;
- `wasp_sebou.wasp_results` contient 931 770 lignes sur la période 2015-09-01 à 2025-08-31.

Ces éléments montrent que la logique de modèle est bien installée dans la base, avec une volumétrie déjà industrielle côté WASP et une structuration complète côté SWAT au travers de ses schémas de sortie et de ses objets de publication.

## 14.4 Logique d'intégration retenue

L'intégration des modèles repose sur les principes suivants :

- dépôt contrôlé des fichiers ;
- détection du format et du modèle ;
- validation structurelle ;
- rapport de mapping ;
- détection de doublons ;
- simulation dry-run ;
- validation QA ;
- publication ou rejet selon le bilan d'ingestion.

Cette logique apporte une maîtrise réelle du passage entre résultat de modèle et résultat restitué dans le système.

## 14.5 Relation entre sorties techniques et restitution métier

Les résultats de modèles n'ont pas vocation à rester cantonnés à des tables techniques. La chaîne mise en place organise leur circulation vers :

- les schémas consolidés ;
- les contrôles QA ;
- les vues d'exposition ;
- les dashboards analytiques et scénarios.

Cette structuration permet notamment d'assurer une séparation claire entre fichier brut, sortie technique, résultat consolidé et objet restitué.

## 14.6 Niveau de finalisation du volet modèles

Les modèles sont finalisés dans leur logique de production et d'intégration au sein du système. À ce stade, les derniers ajustements ne portent pas sur le coeur de l'intégration technique, mais principalement sur la restitution dédiée côté interface, en particulier sur l'écran scénarios et sa lecture métier.

---

# 15. MODULE D'INGESTION, CONTROLE QUALITE ET VALIDATION

## 15.1 Rôle du module d'ingestion

Le centre d'ingestion des modèles constitue l'un des modules les plus structurants du SAD. Il assure la réception des résultats SWAT/WASP, leur contrôle, leur simulation d'intégration, leur validation qualité et leur historisation.

## 15.2 Fonctionnalités disponibles dans le centre d'ingestion

La page `IngestionPage` met déjà à disposition les fonctions suivantes :

- chargement des scénarios SWAT et WASP présents en base ;
- import multi-fichiers ;
- simulation d'ingestion avant publication ;
- consultation des rapports structurels ;
- consultation des rapports de mapping ;
- détection des doublons exacts et partiels ;
- inspection des anomalies QA ;
- filtre par variable, entité, période et statut QA ;
- export CSV des erreurs critiques ;
- consultation de l'historique d'ingestion ;
- vidage du cache observatoire.

## 15.3 Contrôle structurel

Le contrôle structurel permet de détecter :

- le modèle détecté ;
- le format ;
- les colonnes détectées ;
- les colonnes manquantes ;
- les types inférés ;
- les lignes vides ;
- les colonnes mal nommées ;
- l'ordre incorrect ;
- les valeurs nulles ;
- le statut global du format (`VALIDE`, `INVALIDE`, `AVERTISSEMENT`).

Cette étape sécurise fortement la chaîne d'import avant toute publication en base.

## 15.4 Rapport de mapping

Le rapport de mapping indique :

- les champs source et cible ;
- la compatibilité ou l'incompatibilité ;
- le caractère transformable ;
- le taux de remplissage ;
- les colonnes orphelines ;
- les champs cibles non couverts ;
- un score de complétude ;
- un score de préparation à la migration.

Cette logique apporte une lecture fine de la qualité d'un fichier au-delà du simple contrôle de présence des colonnes.

## 15.5 Détection des doublons

Le contrôle de doublons distingue :

- `DOUBLON_EXACT` ;
- `DOUBLON_PARTIEL` ;
- `NOUVEAU`.

Il associe à cette lecture :

- le scénario existant concerné ;
- la date d'ingestion originale ;
- l'action requise (`BLOQUER`, `AVERTIR`, `PROCEDER`) ;
- les zones de chevauchement ;
- la signature technique du jeu de données.

Cette logique est un point fort du module, car elle réduit le risque de réintégration non maîtrisée.

## 15.6 Validation qualité et anomalies

Le module de QA restitue pour un scénario :

- le total de lignes ;
- le total d'erreurs ;
- le total de critiques ;
- le total d'avertissements ;
- le statut global ;
- la liste détaillée des anomalies.

Les anomalies peuvent être filtrées par variable, entité, période et niveau (`CRITIQUE`, `AVERTISSEMENT`, `INFO`). Le système peut également produire un export CSV spécifique aux erreurs critiques.

## 15.7 Historique d'ingestion et traçabilité métier

L'historique d'ingestion conserve notamment :

- l'action réalisée ;
- l'utilisateur ;
- l'horodatage ;
- le fichier ;
- le scénario concerné ;
- le résultat d'exécution ;
- un message lisible ;
- le nombre de doublons éventuels.

La base contient actuellement **14 entrées** dans `audit.ingestion_audit_logs`, ce qui confirme le rôle effectif du module dans le fonctionnement du système.

## 15.8 Valeur ajoutée du module

Le module d'ingestion répond directement à l'enjeu de fiabilisation des résultats de modèles avant restitution. Il transforme un simple dépôt de fichier en workflow contrôlé, explicable et historisé, ce qui constitue une composante essentielle d'un SAD exploitable par un organisme public.

---
# 16. GOUVERNANCE DES DONNEES ET EXPLORATION DES DONNEES BRUTES

## 16.1 Logique de gouvernance retenue

La gouvernance des données occupe une place centrale dans la solution. Elle ne se limite pas à la documentation ; elle est intégrée dans la base et dans les modules applicatifs au travers de catalogues, référentiels, mappings, règles popups, vues d'exposition et parcours de consultation brute.

## 16.2 Référentiels et catalogues structurants

Le schéma `metadata` joue un rôle clé dans cette gouvernance. Les objets les plus structurants sont :

- `referentiel_parametre` avec 91 paramètres ;
- `mapping_parametre_source` pour la normalisation des variables ;
- `api_view_catalog` et `api_view_column_catalog` pour la gouvernance des vues ;
- `popup_rules_config` pour la restitution cartographique ;
- les vues `mv_obs_*` pour la structuration de l'observatoire.

Cette couche permet de maintenir un langage commun entre source, base, API et interface.

## 16.3 Module Data Scan

Le module `DataScanPage` joue un rôle de pilotage de la disponibilité des données. Il permet de lancer un scan rapide ou enrichi avec statistiques temporelles, puis de produire une synthèse portant sur :

- le volume total d'enregistrements analysés ;
- la couverture des stations ;
- la couverture des bassins ;
- les variables et sources disponibles ;
- la complétude globale ;
- l'export du diagnostic au format JSON.

Ce module apporte une utilité concrète pour le suivi de la qualité des données et la préparation de la restitution.

## 16.4 Explorateur de données brutes

Le `DataViewer` constitue un module de transparence et de gouvernance. Il permet :

- de lister les tables consultables ;
- de sélectionner une table par schéma ;
- d'afficher les colonnes disponibles ;
- de masquer ou afficher des colonnes ;
- de rechercher dans le contenu ;
- de consulter jusqu'à plusieurs centaines de lignes ;
- d'éditer certaines lignes autorisées ;
- d'ajouter ou supprimer des enregistrements selon le périmètre autorisé ;
- d'exporter les résultats en PDF et Excel.

Ce module contribue à la fois à la gouvernance, à la transparence et à l'autonomie d'exploitation technique.

## 16.5 Place des métadonnées dans la restitution

Les métadonnées ne restent pas cantonnées à un rôle documentaire. Elles servent concrètement à :

- construire les listes de paramètres ;
- structurer les thèmes et sous-thèmes ;
- rendre cohérente la lecture des séries ;
- alimenter les règles popups ;
- stabiliser les dimensions exposées au frontend.

## 16.6 Gouvernance des vues d'exposition

La présence de `metadata.api_view_catalog` et `metadata.api_view_column_catalog` confirme une volonté de rendre la couche d'exposition elle-même gouvernable. Ce point est important pour la maintenabilité, car il facilite :

- l'inventaire des vues ;
- la lecture des domaines fonctionnels ;
- l'alignement entre base et API ;
- la préparation des annexes techniques.

## 16.7 Valeur ajoutée pour le Maître d'Ouvrage

Cette gouvernance des données apporte une valeur directe au Maître d'Ouvrage :

- meilleure compréhension des référentiels ;
- meilleure traçabilité des transformations ;
- plus grande lisibilité des paramètres exposés ;
- capacité à vérifier la disponibilité et la complétude des données ;
- capacité à relier les écrans aux objets réels de la base.

## 16.8 Continuité entre gouvernance, qualité et exploitation

L'un des apports les plus solides du dispositif réside dans la continuité entre gouvernance et exploitation. Les mêmes objets qui servent à documenter et structurer la donnée servent également à piloter les écrans, les règles d'affichage, les dictionnaires métier et les parcours de consultation.

Cette continuité produit plusieurs effets vertueux :

- réduction des divergences entre vocabulaire métier et implémentation technique ;
- simplification des futures évolutions ;
- meilleure robustesse des exports et des annexes techniques ;
- préparation d'un usage plus fluide par des agents IA ou des assistants de requêtage.

---

# 17. SECURITE, HABILITATIONS ET TRAÇABILITE

## 17.1 Socle de sécurité applicative

La solution intègre une couche de sécurité dédiée, structurée à la fois dans le backend et dans la base. Cette couche couvre :

- l'authentification ;
- les comptes utilisateurs ;
- les rôles ;
- les permissions ;
- les journaux d'activité ;
- les journaux d'authentification ;
- la traçabilité liée à l'ingestion.

## 17.2 Schéma `security` et objets structurants

Le schéma `security` contient **11 tables**. Les objets les plus structurants sont :

- `users` ;
- `roles` ;
- `permissions` ;
- `role_permissions` ;
- `activity_logs` ;
- `auth_logs` ;
- les objets associés à l'historique de mot de passe et aux demandes de réinitialisation.

## 17.3 Comptes, rôles et permissions

Le diagnostic SQL confirme actuellement :

- 3 comptes dans `security.users` ;
- 3 rôles dans `security.roles` ;
- 10 permissions dans `security.permissions`.

Les rôles présents sont :

- `viewer` ;
- `manager` ;
- `admin`.

Les permissions présentes sont :

- `dashboard.read` ;
- `data.read` ;
- `data.create` ;
- `data.update` ;
- `data.delete` ;
- `user.read` ;
- `user.create` ;
- `user.update` ;
- `user.delete` ;
- `security.logs`.

## 17.4 Matrice des habilitations réellement en base

| Rôle | Permissions associées | Lecture métier |
|---|---|---|
| `viewer` | `dashboard.read` | consultation des dashboards |
| `manager` | `dashboard.read`, `data.read`, `data.create`, `data.update`, `data.delete` | consultation et gestion des données |
| `admin` | toutes les permissions précédentes + `user.read`, `user.create`, `user.update`, `user.delete`, `security.logs` | administration complète, sécurité et supervision |

Cette structuration répond directement à l'exigence CPS de gestion détaillée des habilitations et de droits nominatifs.

## 17.5 Gestion nominative des comptes

La table `security.users` stocke notamment :

- le `username` ;
- l'email ;
- le nom complet ;
- le rôle ;
- le statut actif ;
- le mot de passe hashé ;
- les indicateurs d'échec de connexion ;
- la date de dernière connexion ;
- l'adresse IP de dernière connexion ;
- les champs de création et de mise à jour.

Cette structuration confirme que les comptes sont bien gérés de manière nominative.

## 17.6 Journal d'activité API

Le journal d'activité est matérialisé par `security.activity_logs`, qui contient actuellement **71 717 enregistrements**. Le module `AuditLogsPage` expose ces journaux avec les colonnes suivantes :

- date ;
- utilisateur ;
- méthode HTTP ;
- chemin ;
- statut ;
- durée ;
- IP.

Cette restitution répond très directement à l'exigence de traçabilité des opérations.

## 17.7 Journal d'authentification

Le journal d'authentification est matérialisé par `security.auth_logs`, qui contient actuellement **95 enregistrements**. L'écran de consultation restitue notamment :

- la date ;
- l'utilisateur tenté ;
- l'action ;
- le résultat succès/échec ;
- les détails ;
- l'IP.

## 17.8 Traçabilité liée à l'ingestion

En complément de la couche de sécurité, l'ingestion dispose de sa propre traçabilité via `audit.ingestion_audit_logs`. Cette séparation entre journal d'activité général et historique d'ingestion spécialisé est pertinente, car elle évite de mélanger les usages applicatifs et les opérations métier de contrôle de données.

## 17.9 Positionnement vis-à-vis du CPS

Le dispositif de sécurité et de traçabilité mis en place couvre déjà l'essentiel des attentes du CPS :

- rôles ;
- permissions ;
- comptes nominatifs ;
- journaux d'activité ;
- journaux d'authentification ;
- contrôle d'accès aux parcours sensibles.

La phase finale porte surtout sur la consolidation documentaire, le raffinement de certains contrôles fins et l'harmonisation complète de la traçabilité métier sur certains parcours spécialisés.

## 17.10 Chaîne d'authentification et contrôle d'accès

La chaîne d'authentification s'appuie sur une logique standard et robuste :

- ouverture de session via les routes d'authentification ;
- rattachement du compte à un rôle ;
- contrôle d'accès côté backend sur les endpoints sensibles ;
- filtrage ou masquage de certains écrans côté frontend selon le profil ;
- historisation des connexions et des actions applicatives.

Cette double protection - backend et frontend - est importante. Elle permet à la fois de sécuriser les opérations et de garder une interface cohérente pour chaque profil.

---

# 18. MODULES D'ADMINISTRATION ET PARAMETRAGE

## 18.1 Rôle de la couche d'administration

La couche d'administration assure la gouvernance opérationnelle du SAD. Elle permet de piloter les comptes, de superviser les journaux, de contrôler l'ingestion, de paramétrer la cartographie et de surveiller la disponibilité des données.

## 18.2 Tableau des composants d'administration

| Fonction | Description | Rôle dans le système | Contribution à la conformité CPS |
|---|---|---|---|
| Gestion des utilisateurs | création, édition, désactivation, suppression, reset | habilitations et comptes nominatifs | gestion détaillée des droits |
| Demandes de réinitialisation | suivi des resets de mot de passe | continuité d'accès et sécurité | administration sécurisée |
| Journal d'audit | lecture des activités API et des connexions | traçabilité | conformité traçabilité |
| Ingestion modèles | import, simulation, validation, QA | contrôle des scénarios et modèles | intégration des modèles |
| Popup Rules | configuration des attributs cartographiques | personnalisation métier | amélioration de la restitution |
| Data Scan | diagnostic de disponibilité et de couverture | gouvernance qualité des données | maîtrise de la base intégrée |
| Data Viewer | consultation et édition contrôlée des tables | transparence et maintenance | support à l'exploitation |

## 18.3 Gestion des utilisateurs

La page `UserManagementPage` propose déjà un parcours complet comprenant :

- création de compte ;
- édition de compte ;
- changement de rôle ;
- activation / désactivation ;
- réinitialisation du mot de passe ;
- suppression ;
- force reset administrateur ;
- consultation de la dernière connexion.

## 18.4 Gestion des demandes de reset

Le système intègre un parcours de demandes de réinitialisation distinct, utile pour séparer la gestion courante du compte de la supervision des accès sensibles.

## 18.5 Audit et supervision

La page d'audit apporte une supervision directe sur :

- l'activité API ;
- les tentatives d'authentification ;
- les durées de réponse ;
- les chemins les plus sollicités ;
- les statuts de réponse.

## 18.6 Paramétrage cartographique

L'administration des règles popups constitue un atout particulier du système. Elle permet d'ajuster la restitution cartographique sans modifier le code frontend, ce qui répond à une logique de paramétrage métier particulièrement pertinente pour un projet évolutif.

## 18.7 Scan et gouvernance des données

Le scan de disponibilité et le data viewer viennent compléter la couche d'administration en offrant une visibilité sur la matière première du SAD. Cette combinaison entre sécurité, paramétrage, audit, scan et consultation brute renforce nettement la maturité opérationnelle de la plateforme.

---

# 19. FONCTIONNALITES D'EXPORT, DE REPORTING ET DE RESTITUTION

## 19.1 Positionnement du reporting dans la solution

Le reporting n'est pas traité comme une fonction isolée. Il s'insère dans les parcours de restitution et d'exploitation. Les écrans analytiques, les modules administratifs et le data viewer embarquent déjà des possibilités d'export qui répondent aux besoins opérationnels immédiats.

## 19.2 Exports déjà opérationnels

La plateforme permet actuellement les exports suivants :

- **PNG / image** à partir du dashboard analytique multi-séries ;
- **PDF** à partir du dashboard analytique multi-séries ;
- **CSV** à partir du dashboard analytique multi-séries ;
- **PDF** à partir du data viewer ;
- **XLSX** à partir du data viewer ;
- **JSON** à partir du data scan ;
- **CSV critique** à partir du module QA ingestion.

## 19.3 Rôle métier de ces exports

Ces exports répondent à plusieurs usages :

- partage rapide d'un constat ;
- transmission d'un tableau ou d'une courbe ;
- extraction de données pour reprise externe ;
- production d'éléments intermédiaires pour les rapports ;
- documentation des écarts et anomalies.

## 19.4 Reporting et besoins institutionnels

La plateforme couvre déjà le reporting opérationnel. La phase de finalisation porte surtout sur :

- l'harmonisation visuelle des sorties ;
- la standardisation des formats selon les écrans ;
- la préparation de gabarits plus institutionnels pour certains usages de diffusion ;
- la consolidation éventuelle de formats complémentaires lorsque requis.

## 19.5 Positionnement vis-à-vis du CPS

Le CPS demande l'extraction dans les formats nécessaires. La plateforme couvre déjà un ensemble significatif de formats courants. Les formats Word ou shapefile ne sont pas encore industrialisés comme parcours standard dédiés dans la version actuelle, ce qui relève des derniers ajustements de reporting et d'outillage documentaire, non du noyau de restitution déjà développé.

## 19.6 Utilité directe des exports pour les livrables et le pilotage

Les exports déjà en place ont une utilité immédiate dans la chaîne projet :

- préparation de notes de synthèse internes ;
- alimentation des rapports techniques et des annexes ;
- partage rapide d'un constat avec le Maître d'Ouvrage ;
- capitalisation d'un jeu de données ou d'une comparaison ;
- diffusion d'éléments visuels pour les comités de suivi.

Cette capacité est importante, car elle fait du SAD un outil non seulement de consultation, mais aussi de production documentaire.

---

# 20. AVANCEMENT GLOBAL DES TRAVAUX

## 20.1 Niveau global retenu

L'avancement global des travaux de la Mission IV est estimé à **95 %**.

Ce taux correspond à une situation où :

- les modules principaux sont développés ;
- la plateforme est fonctionnelle ;
- les modèles sont finalisés et intégrés dans la logique du système ;
- la base de données joue déjà son rôle central ;
- les parcours d'administration, de sécurité et de gouvernance sont en place ;
- les derniers travaux portent surtout sur la restitution et la stabilisation finale.

## 20.2 Ce que recouvre concrètement ce taux

Ce niveau d'avancement recouvre les éléments suivants :

- architecture full web structurée ;
- base intégrée sectorisée et alimentée ;
- backend métier développé ;
- frontend décisionnel opérationnel ;
- modules d'ingestion et QA installés ;
- sécurité, rôles et journaux intégrés ;
- dashboards analytiques et cartographiques disponibles ;
- administration et gouvernance déjà mobilisables.

## 20.3 Ce qui reste en phase de finalisation

Le reliquat de 5 % ne porte pas sur la construction du coeur du système. Il concerne principalement :

- l'adaptation de certaines restitutions à la lecture métier attendue par le client ;
- l'optimisation des dashboards ;
- l'organisation et la simplification des menus ;
- l'amélioration de l'ergonomie sur les parcours les plus denses ;
- le raffinement de certaines restitutions graphiques et cartographiques ;
- la formalisation finale du dossier de recette, de déploiement et du guide d'exploitation.

---

# 21. ELEMENTS FINALISES ET AJUSTEMENTS EN COURS

## 21.1 Eléments déjà finalisés dans leur logique principale

Les éléments suivants peuvent être considérés comme finalisés dans leur logique principale :

- structuration de la base de données intégrée ;
- couches backend métier et sécurité ;
- dashboard cartographique ;
- dashboard analytique et ses modes simple / multiple ;
- couche d'administration et de gouvernance ;
- chaîne d'ingestion SWAT/WASP avec contrôles et audit ;
- rôles, permissions et journaux ;
- principes de reporting opérationnel.

## 21.2 Tableau des ajustements en cours

| Composant | Type d'ajustement | Finalité | Impact attendu |
|---|---|---|---|
| Dashboard analytique | optimisation de filtres et libellés | lecture métier plus directe | amélioration de l'appropriation utilisateur |
| Dashboard cartographique | organisation des menus et lisibilité | navigation plus fluide | meilleure rapidité d'accès aux couches |
| Dashboard scénarios | finalisation de la restitution dédiée | lecture scénarios plus lisible | meilleure valorisation des modèles |
| Popup rules | ajustement des attributs affichés | qualité de lecture des entités | meilleure ergonomie métier |
| Reporting | harmonisation des sorties | cohérence documentaire | facilitation de diffusion institutionnelle |
| Parcours mobiles | optimisation de certains écrans denses | confort d'usage | amélioration responsive |
| Dossier de recette | formalisation finale | préparation de stabilisation | sécurisation de la clôture technique |
| Guide d'exploitation | consolidation éditoriale | transfert et maintenabilité | meilleure continuité opérationnelle |

## 21.3 Lecture d'ensemble

Ces ajustements ne remettent pas en cause le fonctionnement du système. Ils s'inscrivent dans une phase normale de finition, au cours de laquelle l'objectif n'est plus de construire le socle, mais d'en améliorer la lisibilité, la cohérence métier et le confort d'exploitation.

---
# 22. CONTRIBUTION DU SAD A LA PRISE DE DECISION

## 22.1 Passage de la donnée à la décision

Le rôle d'un SAD n'est pas seulement de consolider la donnée. Il est de permettre à un décideur, à un cadre technique ou à un gestionnaire métier de passer rapidement :

- d'une donnée brute à une information structurée ;
- d'un point de mesure à une lecture synthétique ;
- d'une localisation à une interprétation ;
- d'une série temporelle à un constat opérationnel ;
- d'un résultat de modèle à une mise en perspective de gestion.

Le système développé répond précisément à cette logique grâce à la combinaison de la base intégrée, des vues d'exposition, des dashboards et de la cartographie.

## 22.2 Appui à la lecture territoriale

Le dashboard cartographique permet d'inscrire les constats dans le territoire. Les entités observées - stations, barrages, sous-bassins, nappes, rejets, STEP, découpages administratifs - peuvent être lues de manière cohérente dans un même environnement. Cette mise en contexte est essentielle pour soutenir la décision publique.

## 22.3 Appui à la lecture temporelle

Le dashboard analytique permet de restituer des chroniques, des comparaisons, des minimums, des maximums, des moyennes et des tableaux détaillés. Cette lecture temporelle permet d'identifier :

- les tendances ;
- les ruptures ;
- les extrêmes ;
- les périodes sensibles ;
- les écarts entre plusieurs séries.

## 22.4 Appui à la lecture des scénarios

Le dispositif d'ingestion, de contrôle et de restitution préparé pour SWAT et WASP permet d'inscrire la modélisation dans une logique décisionnelle. La plateforme ne traite pas les scénarios comme des fichiers isolés ; elle prépare leur comparaison et leur mise en lecture métier dans le cadre du SAD.

## 22.5 Appui à la gouvernance et au pilotage

La présence des modules d'administration, de scan, de data viewer, de popups, de journaux et de rôles renforce la capacité du système à être gouverné dans la durée. Cet aspect contribue lui aussi à la décision, car un système fiable, traçable et gouverné produit une information plus crédible et plus exploitable.

## 22.6 Quelques usages décisionnels concrets permis par le système

Sans sortir du périmètre effectivement développé, la plateforme permet déjà de soutenir des situations de lecture telles que :

- comparer l'évolution d'un paramètre sur plusieurs sites ou périodes ;
- rapprocher un constat analytique d'une localisation géographique et de son contexte territorial ;
- contrôler la disponibilité des données avant diffusion d'une lecture ;
- vérifier la qualité d'un jeu de résultats modèle avant publication ;
- documenter une anomalie ou une critique QA avec un export dédié ;
- superviser les opérations sensibles au travers des journaux et de l'historique d'ingestion.

Ces usages illustrent la contribution réelle du SAD à la prise de décision et à la gouvernance du système d'information métier.

---

# 23. ANALYSE DETAILLEE DE CONFORMITE AU CPS

## 23.1 Principes de lecture du tableau de conformité

Le tableau ci-dessous distingue les situations suivantes :

- **Conforme** : exigence couverte dans la solution développée ;
- **Largement couvert / en finalisation** : exigence couverte dans son principe et son fonctionnement, avec quelques raffinements encore en cours ;
- **Partiellement couvert** : exigence déjà traitée sur une partie du besoin, avec un complément encore à stabiliser ou formaliser.

## 23.2 Tableau de conformité CPS - synthèse principale

| Exigence | Contenu attendu | Réponse apportée dans la plateforme | Statut | Observations |
|---|---|---|---|---|
| Architecture full web | application accessible en environnement web | backend FastAPI + frontend React/Vite + base PostgreSQL/PostGIS/TimescaleDB | Conforme | architecture web complètement structurée |
| Compatibilité HTTPS | solution compatible déploiement sécurisé | architecture découplée prête à être servie en HTTPS | Largement couvert / en finalisation | finalisation côté déploiement |
| Technologies modernes | outils de pointe | FastAPI, React, TypeScript, React Query, MapLibre, Recharts, jsPDF, XLSX | Conforme | pile moderne et cohérente |
| Base de données intégrée | base centralisée, configurée et peuplée | 20 schémas actifs, vues métier, agrégats, sécurité, staging, modèles | Conforme | socle fortement structuré |
| Collecte et intégration | intégration multi-sources et fichiers | staging, raw, data scan, ingestion, mappings, catalogues | Conforme | module pleinement installé |
| Intégration des modèles | résultats SWAT/WASP et scénarios | schémas dédiés, upload, dry-run, QA, audit, scénarios | Largement couvert / en finalisation | restitution scénarios dédiée encore en optimisation |
| Analyse et visualisation | tableaux de bord, graphiques, cartes | dashboard analytique, cartographique, observatoire, KPI, tableaux | Conforme | couverture fonctionnelle forte |
| Reporting | rapports et exports selon besoin | PDF, PNG, CSV, XLSX, JSON, exports QA | Largement couvert / en finalisation | homogénéisation finale en cours |
| Aide à la décision | support de comparaison et lecture métier | multi-séries, KPI, cartographie, scénarios, filtres | Conforme | logique décisionnelle déjà opérationnelle |
| Sécurité informatique | contrôle d'accès et sécurité | auth, users, roles, permissions, journaux, reset | Conforme | socle de sécurité en place |
| Habilitations détaillées | rôles et permissions | viewer / manager / admin + matrice de permissions | Conforme | granularité existante |
| Droits nominatifs | comptes utilisateurs nominatifs | `security.users`, profils actifs, historique de connexion | Conforme | exigence couverte |
| Traçabilité des opérations | journaliser utilisateur, action, date, heure | `activity_logs`, `auth_logs`, `ingestion_audit_logs` | Largement couvert / en finalisation | renforcement final de certaines traces métier possible |
| Extraction multiformat | Excel, Word, shapefile, image, etc. | CSV, XLSX, PDF, PNG, JSON déjà actifs | Partiellement couvert | Word et shp non industrialisés comme parcours standard |
| Responsive / mobile | usage mobile optimisé | composants responsive et navigation adaptative | Largement couvert / en finalisation | derniers ajustements sur écrans denses |
| Tests de fonctionnement | tests nécessaires | validations métier, QA, contrôles d'ingestion et parcours applicatifs | Largement couvert / en finalisation | dossier de recette finale à consolider |
| Maintenance | maintenance annuelle et assistance | architecture maintenable, administration intégrée, documentation en cours de finalisation | Largement couvert / en finalisation | volet contractuel d'exploitation à finaliser |
| Données hydrologiques | prise en compte hydrologie | schéma `hydro`, stations, barrages, débits, vues API | Conforme | forte volumétrie et restitution active |
| Données météorologiques | prise en compte météo | schéma `meteo`, précipitation, évaporation, structures température | Conforme | restitution climat en place |
| Données chimiques / qualité | prise en compte qualité | schéma `qualite`, référentiel paramètre, séries qualité | Conforme | restitution opérationnelle |
| Données biologiques | prise en compte biologique | structure extensible et référentiel paramètre | Partiellement couvert | volet non individualisé comme module distinct |
| Cartes thématiques | visualisation cartographique | cartes, couches, popups, légende, filtres | Conforme | couverture fonctionnelle claire |
| Rapports personnalisés | restitution selon besoin utilisateur | exports locaux et tableaux détaillés | Largement couvert / en finalisation | gabarits institutionnels à harmoniser |

## 23.3 Lecture générale de la conformité

La conformité au CPS est globalement atteinte sur le noyau technique et fonctionnel de la Mission IV. Les obligations les plus structurantes - architecture web, base intégrée, modules, sécurité, dashboards, cartographie, intégration des modèles, traçabilité et rôles - sont effectivement prises en charge dans la solution développée.

## 23.4 Points appelant encore un complément de finalisation

Les points qui relèvent encore d'une finalisation ciblée sont essentiellement de trois ordres :

- restitution et ergonomie ;
- homogénéisation documentaire et de reporting ;
- formalisation finale de certains livrables d'exploitation, de recette et de diffusion.

---

# 24. FORCES DE LA SOLUTION DEVELOPPEE

## 24.1 Centralité de la base de données

L'une des principales forces du système réside dans l'urbanisation de la base. La séparation par schémas, l'usage de vues d'exposition, les vues matérialisées et les objets de gouvernance apportent une robustesse rare pour un projet de ce type.

## 24.2 Cohérence entre couches

La cohérence entre base, API et interface constitue une autre force structurante. Le système évite les ruptures entre le niveau technique et le niveau métier. Cela se traduit par une meilleure maintenabilité et une lecture plus stable des données dans le temps.

## 24.3 Maturité de la gouvernance

La présence combinée de rôles, permissions, logs, audit ingestion, popup rules, scan de disponibilité et data viewer confère à la plateforme une maturité opérationnelle qui dépasse le strict affichage de graphiques.

## 24.4 Prise en charge des modèles

L'intégration de SWAT et WASP dans une chaîne spécifique d'ingestion, de validation et de traçabilité constitue un acquis important. Cette intégration renforce la dimension décisionnelle du système et sa capacité à accueillir des résultats complexes de manière contrôlée.

## 24.5 Qualité de la restitution

Les dashboards développés offrent déjà une lecture claire, structurée et exploitable des données. La présence des modes simple et multiple, des KPI, des tableaux détaillés, des exports et de la cartographie interactive apporte une vraie profondeur d'usage.

## 24.6 Evolutivité

La structuration actuelle prépare l'évolution future de la plateforme sans refonte majeure. La présence d'une zone de staging, de catalogues, de mappings et d'une base fortement sectorisée constitue une garantie importante pour la suite du projet.

---

# 25. LIMITES ACTUELLES ET DERNIERS AJUSTEMENTS

## 25.1 Nature des limites actuelles

Les limites actuelles ne remettent pas en cause la solidité du système. Elles correspondent principalement à une phase normale de finalisation sur un produit déjà construit.

## 25.2 Limites liées à la restitution

Les principaux points encore ouverts sur la restitution sont les suivants :

- l'écran dédié aux scénarios reste à finaliser dans sa lecture métier détaillée ;
- certains regroupements de menus et de sous-menus peuvent encore être simplifiés ;
- certains écrans analytiques demandent un dernier niveau d'harmonisation visuelle ;
- le confort mobile sur les écrans d'administration les plus denses peut encore être amélioré.

## 25.3 Limites liées à certaines couvertures documentaires ou fonctionnelles

Plusieurs éléments appellent encore un complément ou une formalisation plus poussée :

- les formats Word et shapefile ne sont pas encore industrialisés comme parcours standard de reporting ;
- le volet biologique n'est pas individualisé comme module autonome dans la restitution ;
- le dossier de recette final et le guide d'utilisation consolidé relèvent encore de la phase de stabilisation ;
- la restitution climat est principalement portée, à ce stade, par les données de précipitation et d'évaporation, la structure température étant en place mais non encore alimentée dans la table métier dédiée à la date du présent rapport.

## 25.4 Lecture correcte de ces limites

Ces limites doivent être interprétées comme des points d'achèvement ciblés. Elles n'affectent pas la réalité du système développé, ni son niveau d'avancement élevé. Elles identifient simplement les derniers points à stabiliser avant clôture complète du lot.

---

# 26. PROCHAINES ETAPES AVANT STABILISATION FINALE

## 26.1 Finalisation des restitutions métier

Les prochaines étapes portent d'abord sur la finalisation des restitutions :

- optimisation du dashboard scénarios ;
- harmonisation des menus ;
- amélioration de la lisibilité sur certains écrans analytiques et cartographiques ;
- finalisation des derniers ajustements de vocabulaire métier.

## 26.2 Stabilisation technique et documentaire

En parallèle, il convient de poursuivre :

- la consolidation du dossier de recette ;
- la finalisation du guide utilisateur et des supports d'exploitation ;
- l'harmonisation des formats d'export et de présentation ;
- la documentation finale liée au déploiement et à l'administration.

## 26.3 Préparation de la phase finale

Ces travaux doivent permettre de préparer la phase finale de stabilisation dans de bonnes conditions, avec une solution déjà fonctionnelle, dont les derniers raffinements portent sur l'appropriation, la présentation et la finition documentaire.

---

# 27. CONCLUSION GENERALE

Le système développé dans le cadre de la Mission IV présente un niveau d'avancement élevé, cohérent avec une version provisoire avancée proche d'une version quasi finale. Les travaux réalisés ont permis de mettre en place une plateforme full web structurée, une base de données intégrée sectorisée, un backend métier complet, une interface frontend décisionnelle, des dashboards analytiques et cartographiques, un centre d'ingestion SWAT/WASP, ainsi qu'une couche d'administration, de sécurité et de traçabilité déjà opérationnelle.

La base de données ne constitue pas un support théorique. Elle est réellement exploitée comme colonne vertébrale du SAD, avec 20 schémas actifs, des volumes significatifs sur les séries hydrologiques, météorologiques, qualité et modèles, des vues d'exposition, des agrégats analytiques, des catalogues métiers et une couche de sécurité complète. Cette structuration apporte à la fois robustesse, maintenabilité et évolutivité.

À ce stade, les modules du système sont développés, les modèles sont finalisés dans leur logique de production et d'intégration, et la plateforme est fonctionnelle. Les travaux restants concernent principalement l'adaptation de certaines restitutions à la lecture métier du client, l'optimisation des dashboards, l'organisation des menus, l'amélioration de l'ergonomie et le raffinement de certaines présentations graphiques, cartographiques et analytiques.

En conséquence, le niveau d'avancement de **95 %** retenu dans ce rapport est pleinement cohérent avec l'état réel de la solution. Le projet se situe dans une phase de finalisation avancée, avec un système déjà exploitable et des ajustements ciblés avant stabilisation complète.

---
# ANNEXES

---

# ANNEXE A. TABLEAU DETAILLE DE CONFORMITE CPS

| Exigence CPS | Contenu attendu | Réponse apportée dans la plateforme | Statut | Observations |
|---|---|---|---|---|
| Architecture full web | solution web complète | backend FastAPI, frontend React/Vite, navigation web complète | Conforme | architecture applicative cohérente |
| Compatibilité HTTPS | déploiement sécurisé | architecture compatible avec reverse proxy et exposition HTTPS | Largement couvert / en finalisation | finalisation dans le dossier de déploiement |
| Outils technologiques de pointe | technologies modernes | PostgreSQL/PostGIS/TimescaleDB, FastAPI, React, TypeScript, MapLibre, Recharts | Conforme | pile technologique adaptée au besoin |
| Mobile-responsive | usage optimisé sur mobile | composants responsive, navigation adaptative, layout flex et grilles | Largement couvert / en finalisation | optimisation finale sur vues denses |
| Habilitations détaillées | rôles et droits par fonctionnalités | `viewer`, `manager`, `admin` + permissions détaillées | Conforme | matrice d'accès active |
| Droits nominatifs | comptes nominatifs | `security.users` + email, username, rôle, statut | Conforme | comptes gérés nominativement |
| Traçabilité | utilisateur, opération, date, heure, données | `security.activity_logs`, `security.auth_logs`, `audit.ingestion_audit_logs` | Largement couvert / en finalisation | couverture forte, quelques compléments métier possibles |
| Extraction multiformat | Excel, Word, shp, jpg, etc. | PDF, PNG, CSV, XLSX, JSON | Partiellement couvert | Word et shp non encore industrialisés |
| Prérequis matériels | communication des prérequis | documentation d'exploitation et architecture prête au déploiement | Largement couvert / en finalisation | volet final lié au déploiement cible |
| Tests de fonctionnement | tests nécessaires | validations d'ingestion, QA, parcours métier, contrôles d'API | Largement couvert / en finalisation | formalisation du dossier de recette en cours |
| Maintenance | maintenance un an | architecture maintenable, parcours d'administration, documentation en cours | Largement couvert / en finalisation | volet contractuel d'exploitation à formaliser jusqu'au bout |
| Module collecte | collecte et intégration de données | staging, raw, scan, catalogues, scans de disponibilité | Conforme | module en place |
| Module modèles | intégration des modèles et résultats | SWAT/WASP, ingestion, dry-run, QA, audit | Conforme | restitution scénarios dédiée en finition |
| Module analyse / visualisation | dashboards, graphiques, cartes | dashboard analytique, cartographique, observatoire | Conforme | module en place |
| Module reporting | rapports personnalisés | exports locaux et structurés sur plusieurs écrans | Largement couvert / en finalisation | homogénéisation finale en cours |
| Centralisation hydrologique | données hydro | `hydro`, `infra`, `api.mv_hydro_*`, dashboards hydro | Conforme | forte volumétrie et restitution active |
| Centralisation chimique / qualité | données qualité | `qualite`, `metadata.referentiel_parametre`, `api.mv_qualite_*` | Conforme | restitution active |
| Centralisation biologique | données biologiques | extensibilité via référentiels paramètre | Partiellement couvert | non individualisé comme domaine autonome à ce stade |
| Centralisation météorologique | données météo | `meteo`, analytics climat, observatoire | Conforme | pluie et évaporation alimentées, structure température prête |
| Intégration des modèles hydrologiques | SWAT | schémas `swat_output`, `swat_sebou`, workflow d'ingestion | Conforme | chaîne d'intégration prête et scénarios déclarés |
| Intégration des modèles qualité | WASP | schémas `wasp_output`, `wasp_sebou`, résultats consolidés | Conforme | 931 770 lignes déjà en base consolidée |
| Tableaux de bord interactifs | dashboards dynamiques | mode simple, mode multiple, KPI, tableaux, exports | Conforme | restitution avancée |
| Cartes thématiques | cartographie métier | couches dynamiques, popups, légendes, filtres, zoom | Conforme | couverture cartographique forte |
| Rapports personnalisés | reporting utilisateur | exports par écran, tableaux détaillés, génération locale | Largement couvert / en finalisation | gabarits institutionnels à harmoniser |
| Aide à la décision | lecture des scénarios et compromis | multi-séries, KPI, cartographie, modèles, QA | Conforme | cœur décisionnel opérationnel |
| Base de données intégrée | base configurée et peuplée | 20 schémas actifs, vues API, analytics, sécurité, staging | Conforme | exigence fortement couverte |

---

# ANNEXE B. SYNTHESE DETAILLEE DES DASHBOARDS ET ECRANS

## B.1 Ecrans principaux de consultation

| Ecran | Rôle | Contenu principal | Utilité opérationnelle |
|---|---|---|---|
| Page d'accueil | accès institutionnel | présentation, accès au dashboard cartographique, parcours de navigation | porte d'entrée et contextualisation |
| Dashboard cartographique | lecture spatiale | carte interactive, filtres latéraux, couches, popups, légende | analyse territoriale |
| Dashboard analytique | lecture temporelle | onglets climat, hydrologie & qualité, pollution | suivi des séries et comparaisons |
| Dashboard scénarios | restitution dédiée modèles | écran routé dédié aux scénarios | finalisation avancée de la lecture métier |

## B.2 Ecrans d'administration

| Ecran | Fonction principale | Eléments visibles |
|---|---|---|
| Data Scan | diagnostic disponibilité des données | résumé, options du scan, export JSON, dashboard de disponibilité |
| User Management | gestion comptes et rôles | liste utilisateurs, création, édition, statut, reset, suppression |
| Password resets | suivi des demandes | traitement des demandes de réinitialisation |
| Audit logs | supervision sécurité et API | activité API, authentification, filtres, statuts, IP, durée |
| Ingestion | centre d'intégration SWAT/WASP | import, simulation, anomalies, audit, export CSV critique |
| Popup Rules | paramétrage cartographique | liste couches, titre, champs popup, activation, suppression |
| Data Viewer | exploration brute | sélection table, recherche, colonnes, édition, export PDF/XLSX |

## B.3 Composants majeurs du dashboard analytique

| Composant | Description |
|---|---|
| Sélecteur de domaine | climat, hydrologie & qualité, pollution |
| Sélecteur de mode | mode simple / mode multiple |
| Panneau de filtres | scénario, sous-menu, variable, site, période |
| KPI | statut, minimum, maximum, moyenne |
| Tableau historique | liste chronologique des points |
| Graphique temporel | visualisation des séries |
| Comparaison multi-séries | jusqu'à plusieurs cartes de sélection simultanées |
| Export image / PDF / CSV | restitution partageable |

## B.4 Composants majeurs du dashboard cartographique

| Composant | Description |
|---|---|
| Carte principale | moteur MapLibre |
| Panneau latéral | regroupement des couches par famille métier |
| Filtres de hiérarchie métier | thèmes, sous-thèmes, paramètres |
| Popups | restitution attributaire paramétrable |
| Légende | classes, symboles, lecture visuelle |
| Zoom couche | recentrage rapide sur une couche |
| Gestion du remplissage | mode plein / contour sur certaines couches |

---

# ANNEXE C. SCHEMA D'ARCHITECTURE TEXTUEL

**Figure 3. Schéma d'architecture textuel**

```text
Sources de données métier
- hydrologie
- qualité des eaux
- météorologie
- pollution et inventaires
- référentiels géographiques et administratifs
- résultats de modèles SWAT / WASP
        ↓
Base de données structurée et sectorisée
- staging
- hydro
- meteo
- qualite
- geo
- infra
- metadata
- security
- audit
- swat_output / swat_sebou
- wasp_output / wasp_sebou
- api
- analytics
        ↓
Services backend / API métier
- authentification et sécurité
- analytics
- observatory
- layers et geojson
- raw data
- ingestion / QA
- audit et administration
        ↓
Couche de restitution web
- page d'accueil
- dashboard cartographique
- dashboard analytique
- écran scénarios
- data viewer
- scan de données
- gestion utilisateurs
- journal d'audit
- popup rules
        ↓
Fonctions décisionnelles
- visualisation
- comparaison
- suivi d'indicateurs
- contrôle qualité
- export et reporting
- gouvernance
- aide à la décision
```

---

# ANNEXE D. INVENTAIRE SYNTHETIQUE DES MODULES

| Domaine | Objets et modules clés | Rôle principal |
|---|---|---|
| Données | `staging`, `raw`, `data scan`, `metadata.*` | intégration, catalogue, gouvernance |
| Hydrologie | `hydro.*`, `api.mv_hydro_*`, dashboard hydro | chroniques de débit, barrages, niveaux |
| Météo | `meteo.*`, `analytics.mv_dashboard_climat_meteo_menu` | climat et météo |
| Qualité | `qualite.*`, `api.mv_qualite_*`, dashboard pollution | qualité des eaux et indicateurs |
| Cartographie | `geo.*`, `admin.*`, `infra.*`, `api.viz_carto_layers` | lecture spatiale et territoriale |
| Modèles | `swat_*`, `wasp_*`, ingestion, QA | scénarios et résultats modèles |
| Sécurité | `security.users`, `roles`, `permissions`, logs | contrôle d'accès et traçabilité |
| Administration | users, audit, popup rules, data viewer, scan | gouvernance opérationnelle |
| Reporting | exports PDF, CSV, XLSX, PNG, JSON | diffusion et partage |

---

# ANNEXE E. SYNTHESE BASE DE DONNEES / SCHEMAS METIER

## E.1 Inventaire des schémas de la base

| Schéma | Rôle métier | Objets majeurs |
|---|---|---|
| `admin` | découpages administratifs | `regions`, `provinces`, `communes`, `cercle`, `localite` |
| `analytics` | performance dashboards | `mv_dashboard_climat_meteo_menu`, `mv_dashboard_hydrologie_menu`, `mv_dashboard_pollution_menu` |
| `api` | exposition SQL métier | `viz_carto_layers`, `viz_*_timeseries`, `mv_*_geojson`, `mv_station_dimension`, `mv_barrage_dimension` |
| `audit` | audit d'ingestion | `ingestion_audit_logs` |
| `geo` | référentiels spatiaux | `bassin_versant`, `sous_bassin_abh`, `reseau_hydrographique`, `nappe`, `source`, tables SWAT par sous-bassin |
| `hydro` | mesures hydrologiques | `mesure_debit`, `mesure_barrage`, `mesure_debit_source`, tables QA et bathymétrie |
| `infra` | infrastructures et inventaires | `stations`, `stations_mesure`, `barrages`, `point_eau`, `step`, `stm`, `decharge`, `huilerie`, `mine`, `rejet_*` |
| `metadata` | gouvernance et référentiels | `referentiel_parametre`, `mapping_*`, `popup_rules_config`, `api_view_catalog`, `api_view_column_catalog`, `mv_obs_*` |
| `meteo` | météo et climat | `mesure_precipitation`, `mesure_evaporation`, `mesure_temperature` |
| `modeles` | référentiels modèles | tables de structuration modèle |
| `monitoring` | supervision | tables de monitoring |
| `public` | support résiduel | `spatial_ref_sys` et vues historiques |
| `qa` | seuils QA | `variable_thresholds` |
| `qualite` | qualité des eaux | `mesure_qualite_riviere`, `mesure_qualite_barrage`, `mesure_qualite_nappe`, `mesure_qualite_sebou` |
| `security` | sécurité et comptes | `users`, `roles`, `permissions`, `role_permissions`, `activity_logs`, `auth_logs` |
| `staging` | intégration intermédiaire | `mesures_debit_jr`, `mesures_precip`, `mesures_precipitations_jr_traitees`, `mesures_qualite_*` |
| `swat_output` | sorties SWAT techniques | `stg_swat_qualite_long` et référentiels SWAT |
| `swat_sebou` | scénarios SWAT consolidés | `swat_scenarios`, `swat_subbasin_results`, `swat_reach_results` |
| `wasp_output` | sorties WASP techniques | `stg_wasp_qualite_long`, référentiels WASP |
| `wasp_sebou` | scénarios WASP consolidés | `wasp_scenarios`, `wasp_results`, `wasp_variables` |

## E.2 Dictionnaire synthétique des tables majeures

| Table | Schéma | Description métier | Utilisation |
|---|---|---|---|
| `stations_mesure` | `infra` | référentiel principal des stations | filtres, dimensions, cartographie |
| `barrages` | `infra` | référentiel des barrages | cartographie, hydrologie, qualité |
| `mesure_debit` | `hydro` | chroniques de débit | dashboard analytique hydrologie |
| `mesure_barrage` | `hydro` | chroniques des barrages | lecture hydrologique et ouvrages |
| `mesure_precipitation` | `meteo` | chroniques de pluie | dashboard climat |
| `mesure_evaporation` | `meteo` | chroniques d'évaporation | dashboard climat |
| `mesure_qualite_riviere` | `qualite` | mesures qualité rivière | dashboard pollution / qualité |
| `mesure_qualite_barrage` | `qualite` | mesures qualité barrage | qualité et hydrologie |
| `mesure_qualite_nappe` | `qualite` | mesures qualité nappe | qualité et contexte territorial |
| `mesure_qualite_sebou` | `qualite` | mesures qualité Sebou récentes | restitution qualité consolidée |
| `referentiel_parametre` | `metadata` | dictionnaire des paramètres | filtres, hiérarchie, mappings |
| `popup_rules_config` | `metadata` | règles d'affichage popup | dashboard cartographique |
| `users` | `security` | comptes utilisateurs | authentification et habilitations |
| `activity_logs` | `security` | journaux d'activité API | audit et traçabilité |
| `auth_logs` | `security` | journaux d'authentification | supervision sécurité |
| `ingestion_audit_logs` | `audit` | historique des imports modèles | traçabilité d'ingestion |
| `swat_scenarios` | `swat_sebou` | référentiel scénarios SWAT | ingestion et restitution modèles |
| `wasp_results` | `wasp_sebou` | résultats consolidés WASP | QA, restitution, scénarios |

## E.3 Tables alimentant les dashboards

| Dashboard | Vues / tables principales |
|---|---|
| Climat | `analytics.mv_dashboard_climat_meteo_menu`, `api.viz_climat_timeseries`, `api.ca_meteo_precip_day`, `api.ca_meteo_evaporation_day`, `meteo.mesure_precipitation`, `meteo.mesure_evaporation` |
| Hydrologie | `analytics.mv_dashboard_hydrologie_menu`, `api.viz_hydro_timeseries`, `api.mv_hydro_debit_day_qa`, `api.mv_hydro_debit_mensuel`, `hydro.mesure_debit`, `hydro.mesure_barrage` |
| Pollution / qualité | `analytics.mv_dashboard_pollution_menu`, `api.viz_pollution_timeseries`, `api.viz_qualite_timeseries`, `api.mv_qualite_*_day`, `qualite.mesure_qualite_*`, `wasp_output.mesure_qualite_segment_ts`, `swat_output.mesure_qualite_subbasin_ts` |

## E.4 Tables et vues alimentant la cartographie

| Fonction cartographique | Objets SQL principaux |
|---|---|
| Catalogue de couches | `api.viz_carto_layers` |
| Bassin et sous-bassins | `geo.bassin_versant`, `geo.sous_bassin_abh`, `api.mv_bassin_geojson`, `api.mv_sous_bassin_geojson` |
| Réseau hydrographique | `geo.reseau_hydrographique`, `api.mv_reseau_hydrographique` |
| Stations et barrages | `infra.stations_mesure`, `infra.barrages`, `api.mv_station_dimension`, `api.mv_barrage_dimension` |
| Popups et restitution attributaire | `metadata.popup_rules_config` |
| Observatoire spatial | `metadata.mv_obs_*`, `api.mv_hierarchie_metier_listing` |

## E.5 Synthèse des statistiques de volumétrie

| Domaine | Volumétrie repère |
|---|---:|
| Stations de mesure | 390 |
| Barrages | 34 |
| Réseau hydrographique | 697 |
| Sous-bassins ABH | 15 |
| Nappes | 17 |
| Débits | 521 433 |
| Barrages - mesures | 84 831 |
| Précipitations | 546 007 |
| Evaporation | 48 900 |
| Qualité rivière | 60 097 |
| Qualité barrage | 8 714 |
| Qualité nappe | 63 088 |
| Qualité Sebou | 51 402 |
| Résultats WASP consolidés | 931 770 |
| Activity logs | 71 717 |

## E.6 Schéma logique simplifié de circulation des données

**Figure 4. Schéma logique simplifié de circulation des données**

```text
fichiers / mesures / inventaires / référentiels / résultats modèles
        ↓
staging et tables techniques
        ↓
tables métier hydro / meteo / qualite / infra / geo
        ↓
metadata et référentiels d'exposition
        ↓
api / analytics
        ↓
routes backend
        ↓
dashboards, administration, reporting
```

## E.7 Dépendances représentatives entre vues et tables

Le diagnostic SQL confirme plusieurs dépendances représentatives particulièrement utiles pour comprendre la structure logique du SAD :

- `api.v_station_dimension` s'appuie sur `infra.stations_mesure`, `metadata.mapping_station`, `geo.bassin_versant` et `geo.sous_bassin_abh` ;
- `api.v_barrage_dimension` s'appuie sur `infra.barrages` et `metadata.mapping_barrage` ;
- `api.v_hierarchie_metier_listing` s'appuie sur `metadata.mapping_parametre_source`, `metadata.referentiel_parametre`, `swat_output.mesure_qualite_subbasin_ts` et `wasp_output.mesure_qualite_segment_ts` ;
- `api.v_hydro_debit_journalier_qa` s'appuie sur `hydro.mesure_debit` et `metadata.mapping_station` ;
- `api.v_meteo_precipitation_journalier_qa` s'appuie sur `meteo.mesure_precipitation`, `infra.stations_mesure` et `metadata.mapping_station` ;
- `api.v_wasp_qualite_segment_consolide` s'appuie sur `wasp_output` et `geo.reseau_hydrographique`.

Ces dépendances montrent que la logique de restitution est solidement ancrée dans les tables métier et dans les mappings, et non sur des objets frontend isolés.

---

# ANNEXE F. SYNTHESE DES EXPORTS, CONTROLES, SECURITE ET AUDIT

## F.1 Objets liés à l'audit et à la sécurité

| Objet | Rôle | Volume / état |
|---|---|---|
| `security.users` | comptes utilisateurs | 3 comptes |
| `security.roles` | rôles | 3 rôles |
| `security.permissions` | permissions | 10 permissions |
| `security.role_permissions` | matrice d'habilitation | active |
| `security.activity_logs` | journaux activité API | 71 717 logs |
| `security.auth_logs` | journaux d'authentification | 95 logs |
| `audit.ingestion_audit_logs` | historique ingestion | 14 lignes |

## F.2 Objets liés à l'ingestion et aux scénarios

| Objet | Rôle |
|---|---|
| `swat_sebou.swat_scenarios` | scénarios SWAT consolidés |
| `swat_sebou.swat_subbasin_results` | résultats SWAT sous-bassins |
| `swat_sebou.swat_reach_results` | résultats SWAT tronçons |
| `wasp_sebou.wasp_scenarios` | scénarios WASP |
| `wasp_sebou.wasp_results` | résultats WASP consolidés |
| `wasp_sebou.wasp_variables` | variables WASP |
| `qa.variable_thresholds` | seuils de QA |
| `audit.ingestion_dataset_signatures` | signatures techniques d'import |
| `audit.ingestion_audit_logs` | historique de workflow d'ingestion |

## F.3 Export et restitution

| Ecran | Formats disponibles |
|---|---|
| Dashboard analytique multiple | PNG, PDF, CSV |
| Data Viewer | PDF, XLSX |
| Data Scan | JSON |
| Ingestion QA | CSV critique |

## F.4 Contrôles qualité intégrés

| Contrôle | Description |
|---|---|
| Validation structurelle | vérifie format, colonnes, types, lignes vides, statut |
| Mapping | score de complétude, compatibilité, orphelins |
| Doublons | exact, partiel, nouveau, action requise |
| QA métier | anomalies critiques, avertissements, informations |
| Historisation | audit d'ingestion, logs activité, logs auth |

---

# ANNEXE G. GLOSSAIRE METIER ET TECHNIQUE

| Terme | Définition |
|---|---|
| Activity log | journal d'activité des appels API et opérations applicatives |
| Dashboard analytique | écran de restitution temporelle et comparative des séries |
| Dashboard cartographique | écran de restitution spatiale des couches métier |
| Dry-run | simulation d'ingestion sans publication définitive |
| Observatoire | couche métier de structuration des thèmes, sous-thèmes, paramètres et entités |
| Paramètre | variable métier observée ou simulée, décrite dans le référentiel |
| Popup rule | règle d'affichage des attributs sur la carte |
| Scénario | jeu cohérent de résultats produit par un modèle |
| Staging | zone d'atterrissage et de préparation des données |
| Traçabilité | capacité à retrouver qui a fait quoi, quand et sur quel parcours |
| Vue matérialisée | vue persistée utilisée pour accélérer la restitution |
| WASP | modèle de simulation qualité des eaux |
| SWAT | modèle hydrologique et environnemental |

---

# RECOMMANDATIONS DE MISE EN PAGE WORD / PDF

## 1. Styles de titres

- **Titre 1** : 16 pt, gras, capitales, numérotation automatique type `1.`
- **Titre 2** : 14 pt, gras, numérotation type `1.1`
- **Titre 3** : 12 pt, gras, numérotation type `1.1.1`
- **Texte courant** : 11 pt, interligne 1,15 à 1,2

## 2. Police et présentation générale

- Police recommandée : `Calibri`, `Arial` ou `Cambria`
- Marges : 2,5 cm
- Alignement : justifié
- Espacement après paragraphe : 6 pt
- Pagination : en pied de page centré ou aligné à droite

## 3. En-tête et pied de page

- En-tête : intitulé court du projet + Mission IV
- Pied de page : numéro de page + version du document + date

## 4. Style des tableaux

- Ligne d'en-tête colorée sobre gris clair ou bleu très atténué
- Corps de tableau en 10 pt
- Bordures fines et homogènes
- Répétition automatique de l'en-tête sur chaque page en cas de tableau long

## 5. Légendes de figures et captures

- Style de légende : 10 pt italique
- Numérotation continue `Figure 1`, `Figure 2`, etc.
- Placer les légendes sous les figures et schémas

## 6. Sommaire et listes automatiques

- Générer un sommaire automatique à partir des styles Word
- Générer la liste des tableaux à partir des légendes si la mise en page finale la prévoit
- Générer la liste des figures si des captures d'écran sont ajoutées à la version bureautique

## 7. Recommandation de diffusion

- version de travail : `.docx` avec suivi éventuel des commentaires ;
- version de diffusion : `.pdf` verrouillé après validation interne.

---
