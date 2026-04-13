# RAPPORT PROVISOIRE
## Mission IV
## Développement du Système d'Aide à la Décision (SAD)

**Projet :** Système d'Aide à la Décision pour la gestion de la qualité des eaux de surface du bassin du Sebou  
**Statut :** Provisoire  
**Date de démarrage du projet :** 07/2025  
**Date du document :** 10/04/2026  
**Version :** 0.1

---

## TABLE DES MATIERES

1. Introduction  
2. Rappel des exigences de la Mission IV  
3. Démarche de production et bases du présent rapport  
4. Présentation de l'architecture technique mise en place  
5. Etat d'avancement des modules de la Mission IV  
6. Etat détaillé de conformité au CPS  
7. Etat global d'avancement  
8. Eléments de valeur ajoutée technique du SAD  
9. Points en cours de finalisation et ajustements restants  
10. Prochaines étapes  
11. Conclusion  
Annexe 1 - Tableau détaillé de conformité CPS  
Annexe 2 - Schéma d'architecture textuel  
Annexe 3 - Inventaire synthétique des modules mis en place  
Annexe 4 - Synthèse exécutive  
Note finale - Hypothèses prudentes retenues

---

## 1. INTRODUCTION

Le présent document constitue le rapport provisoire de la Mission IV relative au développement du Système d'Aide à la Décision pour la gestion de la qualité des eaux de surface du bassin du Sebou. Il s'inscrit dans la continuité des travaux engagés depuis le démarrage global du projet en 07/2025 et rend compte, de manière structurée, de l'état réel d'avancement de la solution développée.

Le système mis en place répond à une ambition claire : disposer d'une plateforme full web capable d'intégrer des données environnementales hétérogènes, de restituer les résultats des traitements et des modèles, et d'offrir au maître d'ouvrage des interfaces décisionnelles adaptées à ses usages. Dans ce cadre, les développements réalisés ont permis de mettre en oeuvre une architecture cohérente, des modules fonctionnels complets, une base de données structurée, ainsi qu'un ensemble de tableaux de bord et de services d'administration déjà mobilisables.

Ce rapport doit être lu comme une **version provisoire avancée**, à un stade où le système est globalement finalisé sur le plan technique et fonctionnel. À ce stade du projet, les modules sont développés, les chaînes de traitement associées aux modèles sont en place, et la plateforme est fonctionnelle. Les travaux restant à conduire relèvent principalement de la phase de finalisation : adaptation aux besoins métier du client, optimisation des dashboards, organisation des menus, amélioration de la lisibilité des écrans et ajustements d'ergonomie conformément aux attentes du maître d'ouvrage.

En conséquence, l'avancement global traduit une situation de quasi-achèvement, dans laquelle l'ensemble des modules et exigences est en cours de finalisation, sans que cela remette en cause la disponibilité effective de la solution ni la maîtrise des travaux déjà réalisés.

---

## 2. RAPPEL DES EXIGENCES DE LA MISSION IV

### 2.1 Objectifs du SAD

Conformément au CPS et à la note méthodologique, la Mission IV a pour objet de doter le maître d'ouvrage d'un système capable de :

- centraliser et intégrer les données relatives à la qualité des eaux, à l'hydrologie, à la météorologie et, plus largement, aux informations nécessaires au suivi environnemental du bassin ;
- intégrer les résultats de modélisation et de simulation hydrologique et de qualité des eaux ;
- proposer des tableaux de bord interactifs, des cartes thématiques, des graphiques et des restitutions adaptées aux besoins des utilisateurs ;
- soutenir la décision à travers la consultation d'indicateurs, l'exploitation de scénarios et la comparaison de situations de gestion.

### 2.2 Exigences fonctionnelles

Les exigences fonctionnelles à couvrir dans le cadre de la Mission IV se structurent comme suit :

| Catégorie | Exigences structurantes |
|---|---|
| Collecte et intégration | intégration de fichiers divers, intégration de résultats de modèles, prise en compte de données issues de serveurs et de bases partenaires, centralisation de données multi-origines |
| Modélisation et scénarios | intégration de résultats de modèles hydrologiques et de qualité, gestion de scénarios, exploitation de simulations |
| Exploitation et visualisation | tableaux de bord interactifs, cartes thématiques, graphiques, indicateurs, filtres de consultation |
| Reporting | génération de rapports et d'exports adaptés aux besoins des utilisateurs |
| Aide à la décision | exploitation de scénarios et d'indicateurs pour appuyer les arbitrages |

### 2.3 Exigences techniques

Les exigences techniques de la mission portent notamment sur :

- une architecture full web compatible avec un déploiement en HTTPS ;
- le recours à des technologies modernes ;
- l'application des règles de l'art en matière de sécurité informatique ;
- une compatibilité mobile ;
- une structuration claire des modules, des interfaces et des bases de données ;
- une continuité maîtrisée entre collecte, traitement, restitution et exploitation décisionnelle.

### 2.4 Exigences de sécurité

Le CPS prévoit en particulier :

- une gestion détaillée des habilitations par rôles et fonctionnalités ;
- des droits d'accès nominatifs ;
- une traçabilité des opérations avec identification de l'utilisateur, de la nature de l'opération, ainsi que de sa date et de son heure ;
- le respect de la sécurité du système d'information existant lors de l'installation et du déploiement.

### 2.5 Exigences de déploiement

Les exigences de déploiement et d'exploitation comprennent :

- la communication des prérequis matériels et techniques ;
- des installations réalisées sans compromettre la sécurité du système d'information existant ;
- la réalisation des tests de fonctionnement nécessaires ;
- la mise à disposition des éléments nécessaires au bon fonctionnement de la solution.

### 2.6 Exigences d'exploitation et de maintenance

Le cadre contractuel prévoit :

- une maintenance d'un an ;
- la correction des anomalies ;
- l'assistance technique à l'utilisation et à l'administration ;
- la prise en charge des paramétrages nécessaires au bon fonctionnement du système.

### 2.7 Modules attendus

Le CPS identifie explicitement les modules suivants :

- module de collecte et d'intégration des données ;
- module d'intégration des résultats de modèles ;
- module d'exploitation et de visualisation ;
- module de reporting.

### 2.8 Livrables attendus

Les livrables attendus à l'échelle de la mission sont les suivants :

- rapport d'étude des besoins et de conception technique ;
- code applicatif, documentation technique, manuels d'installation et d'administration ;
- base de données intégrée, configurée et peuplée ;
- supports de formation ;
- rapport final et guide d'utilisation.

---

## 3. DEMARCHE DE PRODUCTION ET BASES DU PRESENT RAPPORT

### 3.1 Documents de référence mobilisés

Le présent rapport s'appuie sur l'ensemble du cadre documentaire et technique mobilisé pour la Mission IV, notamment :

- le CPS et la note méthodologique du projet ;
- la documentation technique du projet organisée dans le dépôt ;
- les fichiers `README` de la racine, du backend et du frontend ;
- les scripts SQL de structuration, de sécurité et de performance ;
- le code applicatif du backend et du frontend ;
- les jeux de données d'import et les éléments de paramétrage présents dans l'environnement de développement du projet.

### 3.2 Périmètre applicatif pris en compte

Le contenu du présent rapport couvre :

- le backend `FastAPI` sous `backend/app`, incluant les routes métier, les services de sécurité, les services d'intégration, les fonctions de traçabilité et les modules liés aux modèles ;
- le frontend `React + Vite + TypeScript` sous `frontend/src`, incluant les pages métier, les dashboards, les composants cartographiques, les vues d'administration et les services d'accès API ;
- les scripts SQL et schémas de base de données localisés sous `backend/sql`.

Le rapport a été construit dans une logique de restitution directe des travaux réalisés. Il vise à :

- rappeler les engagements de la Mission IV ;
- présenter l'architecture mise en place ;
- décrire les modules effectivement développés ;
- situer l'état d'avancement réel de chaque composante ;
- préciser les ajustements encore en cours avant stabilisation complète.

Cette approche permet de rendre compte, de manière claire et responsable, du système développé, de ses résultats, ainsi que des derniers points de finalisation à traiter avant clôture.

## 4. PRESENTATION DE L'ARCHITECTURE TECHNIQUE MISE EN PLACE

### 4.1 Vue d'ensemble

L'architecture mise en place repose sur une organisation web modulaire à séparation nette des couches applicatives :

- une couche base de données PostgreSQL, enrichie des mécanismes nécessaires à la gestion spatiale et à l'exploitation métier ;
- une couche backend `FastAPI` assurant l'exposition des services métier, cartographiques, analytiques, d'administration et de sécurité ;
- une couche frontend `React` dédiée à la restitution décisionnelle, à la cartographie interactive, à la consultation des données et à l'administration.

Cette architecture garantit une bonne lisibilité fonctionnelle, une maintenabilité satisfaisante et une capacité d'évolution progressive dans le temps.

### 4.2 Backend

Le backend développé repose sur `FastAPI`, avec un point d'entrée principal dans `backend/app/main.py` et une agrégation des routeurs dans `backend/app/api/api_v1.py`. Le dispositif mis en oeuvre comprend notamment :

- un paramétrage `CORS` configurable ;
- une compression `GZip` ;
- des routes système `/`, `/health` et `/docs` ;
- une organisation des services métier et administratifs sous `/api/v1`.

Les fonctionnalités implémentées couvrent en particulier :

- l'authentification et la gestion des mots de passe ;
- la gestion des utilisateurs, des rôles, des réinitialisations et des journaux de sécurité ;
- la restitution cartographique et les listes de noms ;
- les domaines climat, hydrologie, qualité, observatoire et analytics ;
- l'intégration des scénarios et le contrôle qualité ;
- les métadonnées, la consultation de données brutes et les services liés à SWAT.

### 4.3 Frontend

Le frontend mis en place repose sur `React`, `Vite` et `TypeScript`, avec `@tanstack/react-query` pour la gestion des appels de données. L'application propose une interface structurée autour de pages métier et de composants spécialisés, comprenant notamment :

- une page d'accueil ;
- un dashboard cartographique ;
- un dashboard analytique ;
- une page dédiée aux scénarios ;
- une interface de gestion des données ;
- des pages d'administration pour le scan des données, la gestion des utilisateurs, les réinitialisations, la traçabilité, l'intégration et les règles de popups ;
- les écrans d'authentification, d'inscription et de changement de mot de passe.

La solution frontend propose ainsi un environnement de consultation et d'administration déjà structuré, avec une restitution adaptée aux besoins opérationnels et décisionnels.

### 4.4 Base de données

L'architecture de données mise en place repose sur PostgreSQL, avec une organisation par schémas permettant de distinguer clairement les responsabilités fonctionnelles. Les schémas mobilisés comprennent notamment :

- `security` pour les rôles, permissions, utilisateurs, historiques et journaux ;
- `api` pour les vues et dimensions métier ;
- `analytics` pour les vues matérialisées alimentant les dashboards ;
- `metadata` pour certains paramétrages fonctionnels, notamment les règles de popups ;
- `swat_sebou` et `wasp_sebou` pour les scénarios de modèles ;
- `public` pour certaines tables de mesures de qualité ;
- `geo` pour les entités geographiques.

Cette structuration garantit une séparation lisible entre sécurité, restitution métier, performance analytique et gestion des résultats de modèles.

### 4.5 Structuration API

L'organisation des API suit une logique thématique et fonctionnelle, avec notamment :

- `auth`, `users`, `security/logs` pour la sécurité ;
- `layers`, `names`, `geojson` pour la composante cartographique ;
- `climate`, `hydro`, `quality`, `observatory`, `analytics` pour les usages métier ;
- `ingestion` pour l'intégration des résultats de modèles ;
- `meta` et `raw` pour la connaissance et l'administration des données.

Cette structuration facilite la lisibilité de la solution, sa maintenance et l'évolution progressive des services.

### 4.6 Composants SIG et cartographie

La plateforme intègre un socle SIG complet reposant notamment sur :

- `maplibre-gl`, `react-map-gl`, `leaflet`, `proj4` et `@turf/turf` côté frontend ;
- les services `layers`, `geojson` et `observatory` côté backend ;
- la gestion de couches métier, de boîtes englobantes, de détails entité, de noms, de règles de popups et de légendes ;
- un dashboard cartographique structuré autour de thèmes, sous-menus et paramètres.

En pratique, ce dispositif permet une lecture territoriale immédiate des informations utiles à la décision.

### 4.7 Composants décisionnels

Les travaux réalisés ont permis de mettre en place des briques décisionnelles articulées autour :

- d'une hiérarchie thématique portée par l'observatoire ;
- de séries temporelles, KPI et timelines ;
- de vues analytiques dédiées au climat, à l'hydrologie et à la pollution ;
- de mécanismes de contrôle qualité et de gestion des anomalies sur les scénarios ;
- de fonctions d'export et de restitution adaptées aux usages métier.

Le système développé propose ainsi une restitution directement exploitable pour le suivi, la comparaison de situations et l'appui à la décision.

### 4.8 Filtres, tableaux, indicateurs et graphiques

Le frontend propose un ensemble avancé de composants de restitution :

- filtres thématiques, temporels, géographiques et paramétriques ;
- modes simple et multiple pour les dashboards analytiques ;
- graphiques temporels, comparatifs, multi-séries et KPI ;
- tableaux détaillés exportables ;
- cartes interactives avec couches, légendes, infobulles et panneaux latéraux.

L'intégration de `Recharts`, `Chart.js`, `Plotly`, `html2canvas`, `jsPDF` et `xlsx` conforte la vocation décisionnelle et opérationnelle de la solution.

### 4.9 Sécurité et traçabilité

Le dispositif mis en oeuvre comprend :

- une authentification avec jetons d'accès et de rafraîchissement ;
- un schéma `security` intégrant rôles, permissions, utilisateurs, historique des mots de passe, demandes de réinitialisation, journaux d'authentification et journaux d'activité ;
- des contrôles de rôle côté backend pour les fonctions sensibles ;
- des pages d'administration dédiées à la gestion des comptes et des réinitialisations ;
- une journalisation des accès API et des opérations liées à l'intégration des scénarios.

La sécurité fait ainsi partie intégrante de la conception de la plateforme et non d'un traitement secondaire.

### 4.10 Logique d'intégration des données

La solution développée intègre une chaîne de traitement complète reposant sur :

- la lecture de vues métier pour le climat, l'hydrologie, la qualité et les entités ;
- l'intégration de fichiers de scénarios SWAT/WASP ;
- une validation structurelle avant publication ;
- un rapport de mapping ;
- une détection de doublons ;
- une validation qualité par seuils et anomalies ;
- un historique des opérations d'intégration.

De manière opérationnelle, cette chaîne garantit une prise en charge structurée des données d'entrée et des résultats modèles avant restitution dans le SAD.

### 4.11 Logique de séparation des couches applicatives

L'architecture mise en place distingue clairement :

- la persistance et les schémas de données ;
- la logique de service et d'API ;
- l'interface utilisateur et les composants de visualisation ;
- les fonctions de sécurité et d'administration.

Cette organisation constitue un socle robuste pour la poursuite des ajustements métier et la préparation du déploiement.

---

## 5. ETAT D'AVANCEMENT DES MODULES DE LA MISSION IV

### 5.1 Module de collecte et d'intégration des données

#### Rôle du module

Ce module assure la centralisation des données d'entrée, leur contrôle, leur structuration et leur mise à disposition dans le SAD.

#### Eléments mis en place

Les travaux réalisés ont permis de mettre en place :

- les routes `ingestion/upload`, `validation/structure`, `validation/mapping`, `simulation/dry-run`, `validation/anomalies`, `qa/thresholds` et les fonctions d'historique associées ;
- la page d'administration `IngestionPage`, dédiée à l'import de fichiers, à la simulation d'intégration, à la consultation des anomalies, à l'export CSV critique et à la consultation de l'historique ;
- le module `DataViewer`, dédié à la consultation et à l'édition de données brutes via les services `raw` ;
- le module `DataScanPage`, dédié au contrôle de disponibilité des données ;
- les routes métier `climate`, `hydro`, `quality`, `entities`, `meta` et `raw` ;
- la prise en charge de fichiers de résultats `SWATOutput.mdb` et `Data_Results_WASP.xlsx`, cohérente avec l'intégration des résultats de modèles.

#### Niveau d'avancement

Le module est **développé, structuré et déjà opérationnel**. La chaîne d'import, de validation, de contrôle qualité et d'historisation est en place.

#### Etat de finalisation

À ce stade du projet, les derniers travaux portent principalement sur :

- l'industrialisation de la publication des scénarios après simulation ;
- l'harmonisation documentaire de la chaîne d'intégration ;
- l'adaptation de certains parcours d'administration et de restitution aux usages métier du client.

### 5.2 Module d'intégration des résultats de modélisation

#### Rôle du module

Ce module assure l'intégration des résultats de modélisation hydrologique et de qualité, ainsi que leur préparation en vue de leur exploitation dans le système.

#### Eléments mis en place

Le système intègre notamment :

- les routes SWAT et les fonctions de comparaison associées ;
- la récupération des scénarios dans `swat_sebou.swat_scenarios` et `wasp_sebou.wasp_scenarios` ;
- l'intégration de fichiers SWAT/WASP ;
- la validation qualité des scénarios ;
- l'export des anomalies critiques ;
- les fonctions de simulation avant publication ;
- une page dédiée aux scénarios, encore en cours d'ajustement sur son volet de restitution ;
- des vues matérialisées et des services `analytics` dédiés à l'exploitation des scénarios et séries.

#### Niveau d'avancement

Le module apparaît **développé et quasiment finalisé**. Les chaînes de traitement associées aux modèles sont finalisées au plan technique et les mécanismes de contrôle sont en place.

#### Etat de finalisation

Les ajustements encore en cours concernent principalement la restitution métier :

- mise au point de l'écran dédié aux scénarios ;
- amélioration de la lisibilité des sélections et des comparaisons ;
- optimisation de l'organisation des informations pour une exploitation décisionnelle plus directe.

### 5.3 Module d'exploitation et de visualisation

#### Rôle du module

Ce module constitue le coeur de la restitution utilisateur. Il assure la consultation cartographique, la lecture des indicateurs, l'exploitation des séries et la présentation des résultats dans des interfaces décisionnelles adaptées.

#### Eléments mis en place

Les composants développés couvrent notamment :

- un dashboard cartographique avec gestion de couches, filtres, popups, légendes et détails entité ;
- un dashboard analytique structuré autour des volets climat, hydrologie et pollution ;
- des modes simple et multiple pour la lecture des séries ;
- des composants de graphiques et de KPI ;
- les services `observatory` pour la hiérarchie, les paramètres, les séries temporelles, les KPI et les timelines ;
- les services `analytics` pour les options, sites et séries climat, hydrologie et pollution ;
- des couches géographiques servies par `layers` et `geojson`.

#### Niveau d'avancement

Ce module est **très avancé**. Les dashboards sont développés, intégrés et déjà exploitables dans un cadre opérationnel.

#### Etat de finalisation

Les ajustements en cours relèvent principalement d'une optimisation de la restitution :

- optimisation de certains dashboards ;
- amélioration de l'organisation des menus ;
- renforcement de la lisibilité des écrans ;
- amélioration de l'ergonomie générale et du confort d'utilisation.

### 5.4 Module de reporting

#### Rôle du module

Ce module assure la restitution et l'export des données et résultats dans des formats exploitables par les utilisateurs.

#### Eléments mis en place

La solution propose déjà :

- l'export PDF et Excel dans `DataViewer` ;
- l'export PNG, PDF et CSV dans les dashboards analytiques multi-séries ;
- l'export Excel dans certains tableaux hydrologiques ;
- l'export PDF et Excel dans les composants qualité ;
- l'export JSON du contrôle de disponibilité des données ;
- l'export CSV des anomalies critiques d'intégration.

#### Niveau d'avancement

Le module de reporting est **développé et déjà exploitable**. Les mécanismes d'export couvrent plusieurs usages opérationnels.

#### Etat de finalisation

La phase résiduelle porte sur :

- la standardisation des formats de sortie ;
- l'homogénéisation des mécanismes d'export entre modules ;
- la consolidation d'un reporting personnalisé davantage orienté restitution institutionnelle ;
- la formalisation éventuelle de formats complémentaires non encore activés dans la version actuelle.

### 5.5 Fonctions transverses

#### Rôle des fonctions transverses

Les fonctions transverses assurent la cohérence générale du système : sécurité, navigation, filtrage, gestion des accès, traçabilité et administration.

#### Eléments mis en place

La plateforme intègre notamment :

- l'authentification, le changement de mot de passe, la réinitialisation et le rafraîchissement de jetons ;
- la gestion des utilisateurs et des rôles ;
- des contrôles d'accès admin et manager sur plusieurs pages ;
- les journaux d'authentification et d'activité ;
- l'historisation des opérations d'intégration ;
- une navigation structurée par profil ;
- des fonctions de métadonnées et de consultation de données brutes ;
- un comportement responsive sur la majorité des écrans.

#### Niveau d'avancement

Ces fonctions sont **développées, intégrées et globalement stabilisées**.

#### Etat de finalisation

Les derniers points à traiter portent surtout sur :

- le raffinement des habilitations fines ;
- l'exhaustivité de la traçabilité sur certaines opérations métier ;
- la consolidation finale de certains parcours d'administration ;
- quelques ajustements d'ergonomie sur les écrans les plus denses et sur les usages mobiles.

---

## 6. ETAT DETAILLE DE CONFORMITE AU CPS

### 6.1 Principes d'évaluation

L'état de conformité retenu dans le présent rapport s'appuie sur les niveaux suivants :

- **Conforme** : l'exigence est couverte de manière explicite par la solution mise en place ;
- **Largement couvert / en finalisation** : l'exigence est couverte sur l'essentiel, avec quelques ajustements encore en cours ;
- **Partiellement couvert** : des briques sont en place, mais une consolidation reste nécessaire ;
- **Structure préparée / intégration en cours** : le cadre technique est en place, avec une restitution ou une activation encore en cours d'achèvement ;
- **Non établi au présent stade** : le périmètre correspondant n'est pas formalisé de manière explicite dans la version actuelle.

### 6.2 Tableau de conformité détaillé

| Exigence CPS | Description de l'exigence | Mise en oeuvre dans le projet | Niveau de couverture | Commentaire / réserve |
|---|---|---|---|---|
| Centralisation multi-origines | centraliser et intégrer des données de diverses origines | services `raw`, `meta`, `climate`, `hydro`, `quality`, `entities`, `ingestion`, documentation data et vues API | Largement couvert / en finalisation | la chaîne de centralisation est en place ; l'extension à l'ensemble des origines prévues suit la logique de finalisation globale |
| Données hydrologiques | prise en charge des données hydrologiques | `hydro`, vues analytiques hydrologie, dashboards dédiés, couches cartographiques associées | Conforme | couverture assurée |
| Données chimiques / qualité | prise en charge des données de qualité des eaux | `quality`, `measurements`, composants qualité, pages analytiques, mesures de qualité en base | Conforme | couverture assurée |
| Données météorologiques | prise en charge des données climat et météo | `climate`, analytics climat-météo, dashboards climat, séries et KPI | Conforme | couverture assurée |
| Données biologiques | intégration de données biologiques | pas de module individualisé dans la version actuelle | Non établi au présent stade | point à préciser si ce périmètre doit être individualisé dans la suite du projet |
| Résultats de modèles | intégration hydrologique et qualité de l'eau | intégration SWAT/WASP, services `swat`, comparaisons, scénarios, contrôle qualité, fichiers d'import | Largement couvert / en finalisation | la chaîne technique est en place ; la restitution dédiée aux scénarios poursuit sa finalisation |
| Scénarios et arbitrages | exploitation de scénarios pour l'aide à la décision | scénarios SWAT/WASP, validation qualité, écran dédié en cours d'ajustement | Structure préparée / intégration en cours | le socle est en place ; la finition concerne surtout la restitution et l'ergonomie |
| Tableaux de bord interactifs | restitution interactive des données | dashboard analytique, dashboard cartographique, composants multi-modes, KPI, filtres | Conforme | couverture assurée |
| Cartes thématiques | cartographie métier | MapLibre, `layers`, `geojson`, `observatory`, styles et légendes | Conforme | couverture assurée |
| Graphiques interactifs | courbes, comparaisons, indicateurs | Recharts, Chart.js, Plotly, composants analytiques et qualité | Conforme | couverture assurée |
| Rapports personnalisés | production de restitutions adaptées aux besoins utilisateurs | exports PDF, Excel, CSV, JSON, image | Partiellement couvert | les mécanismes de restitution sont en place ; la personnalisation institutionnelle peut encore être renforcée |
| Architecture full web | solution accessible via architecture web | backend FastAPI + frontend React/Vite + APIs REST | Conforme | couverture assurée |
| Compatibilité HTTPS | compatibilité avec un déploiement sécurisé | architecture web découplée et paramétrable pour un déploiement sécurisé | Largement couvert / en finalisation | la base technique est prête ; la mise en oeuvre dépend du cadre de déploiement |
| Technologies modernes | usage de technologies actuelles | FastAPI, React, TypeScript, react-query, MapLibre, Recharts, PostgreSQL/PostGIS | Conforme | couverture assurée |
| Sécurité informatique | mise en oeuvre des contrôles de sécurité | JWT, refresh tokens, rôles, permissions, historique des mots de passe, réinitialisations, journaux sécurité | Largement couvert / en finalisation | le socle sécurité est en place ; certains volets de durcissement peuvent encore être affinés |
| Mobile responsive | usage optimisé sur téléphone mobile | frontend Tailwind, structures responsive, navigation mobile | Largement couvert / en finalisation | le comportement responsive est déjà intégré ; les derniers ajustements portent sur le confort d'usage |
| Habilitations détaillées | gestion par rôles et fonctionnalités | schéma `security`, rôles `viewer/manager/admin`, permissions, contrôles frontend et backend | Largement couvert / en finalisation | le socle RBAC est en place ; la granularité fine suit la phase de finalisation |
| Droits nominatifs | accès nominatif par utilisateur | comptes utilisateurs, email, username, gestion admin | Conforme | couverture assurée |
| Traçabilité des opérations | journaliser utilisateur, action, date, heure, données modifiées | journaux d'authentification, journaux d'activité, historique d'intégration, middleware de log | Partiellement couvert | le dispositif principal est en place ; l'exhaustivité métier peut encore être renforcée |
| Extraction multi-formats | Excel, Word, shp, jpg, etc. selon besoin | PDF, XLSX, CSV, JSON, PNG | Partiellement couvert | plusieurs formats sont déjà actifs ; des formats complémentaires peuvent être consolidés si requis |
| Prérequis matériels | communication des prérequis et installation | documentation de déploiement locale et paramétrage d'environnement | Partiellement couvert | le socle documentaire existe ; le volet matériel doit être arrêté dans le cadre du déploiement |
| Tests de fonctionnement | réalisation des tests nécessaires | procédures de validation et workflows de contrôle déjà en place | Partiellement couvert | les bases de validation sont acquises ; le dossier de recette complète reste à consolider |
| Maintenance un an | engagement de maintenance | prévu au cadre contractuel du projet | Structure préparée / intégration en cours | relève du cadre contractuel et de la phase d'exploitation |
| Module collecte | collecte et intégration de données | ingestion, scan, consultation des données, vues métier | Largement couvert / en finalisation | module en place |
| Module modèles | intégration des résultats de modèles | SWAT/WASP, contrôle qualité, scénarios, comparaisons | Largement couvert / en finalisation | restitution scénarios encore en finition |
| Module exploitation / visualisation | exploitation des résultats | observatory, analytics, dashboards | Conforme | module en place |
| Module reporting | exports et restitutions | DataViewer, dashboards, exports d'administration | Largement couvert / en finalisation | harmonisation finale en cours |
| Code applicatif et documentation technique | mise à disposition des livrables techniques | dépôt complet backend/frontend/docs/scripts SQL | Largement couvert / en finalisation | base documentaire déjà solide |
| Base de données intégrée | base centralisée configurée et peuplée | PostgreSQL/PostGIS, schémas, vues, routes métier | Largement couvert / en finalisation | fondation technique en place |
| Formation et support pédagogique | documentation de formation | non formalisé à ce stade dans le rapport présent | Non établi au présent stade | relève du calendrier global de finalisation |
| Guide d'utilisation final | guide utilisateur complet | documentation existante mais non encore consolidée en guide final unique | Partiellement couvert | consolidation éditoriale encore attendue |

### 6.3 Commentaire sur les points conformes

La conformité est globalement atteinte sur le noyau fonctionnel et technique de la Mission IV. Les travaux réalisés couvrent de manière explicite :

- l'architecture full web ;
- les technologies structurantes de la solution ;
- les modules de restitution et de visualisation ;
- les domaines hydrologie, qualité et climat-météo ;
- le socle SIG ;
- la sécurité applicative de base et l'administration des accès.

### 6.4 Commentaire sur les points en cours de finalisation

Les points encore en finalisation relèvent principalement :

- de l'adaptation de certaines interfaces aux usages métier du maître d'ouvrage ;
- de la restitution scénarios côté frontend ;
- de l'harmonisation complète du reporting ;
- de l'ajustement final de certaines habilitations ;
- du renforcement de la traçabilité sur quelques opérations ciblées ;
- de la formalisation complète de la recette.

### 6.5 Commentaire sur les points à consolider

Les réserves subsistantes ne remettent pas en cause le fonctionnement général du système. Elles appellent toutefois une consolidation avant stabilisation complète, notamment sur :

- la formalisation explicite d'un périmètre biologique si ce volet doit être individualisé ;
- l'extension éventuelle des formats d'export et import;
- la finalisation documentaire liée au déploiement, à l'exploitation, à la formation et au guide utilisateur.

---

## 7. ETAT GLOBAL D'AVANCEMENT

L'avancement global de la Mission IV couvre :

- le développement du socle backend ;
- la structuration du frontend ;
- l'intégration des principaux domaines métier ;
- la mise en place des dashboards cartographiques et analytiques ;
- la chaîne d'intégration et de contrôle qualité des résultats de modèles ;
- les fonctions de sécurité, d'administration et de traçabilité ;
- la structuration de la base et des vues analytiques.

À ce stade du projet, les modules du système sont développés, les traitements associés aux modèles sont finalisés au plan technique, et la plateforme est fonctionnelle. l'avancement globale traduit  ainsi une situation de **version provisoire avancée / quasi finale**, dans laquelle le socle applicatif est établi et exploitable, tandis que les derniers travaux portent encore sur la restitution métier, l'ergonomie et l'optimisation de certaines interfaces.

En pratique, ce niveau d'avancement peut être lu selon quatre dimensions :

- **développement** : les briques essentielles sont en place ;
- **intégration** : les modules communiquent à travers des routes et services structurés ;
- **optimisation** : les ajustements encore en cours concernent principalement l'adaptation aux besoins métier du client, l'optimisation des dashboards, l'organisation des menus et l'amélioration de la lisibilité ;
- **validation** : la consolidation du dossier de recette, de déploiement et de conformité complète au CPS suit son cours dans le cadre de la phase finale.

---

## 8. ELEMENTS DE VALEUR AJOUTEE TECHNIQUE DU SAD

### 8.1 Modularité

L'organisation en domaines fonctionnels et en services spécialisés facilite la maintenance, la lisibilité et les évolutions futures.

### 8.2 Architecture évolutive

La séparation frontend/backend/base de données et l'usage de schémas métiers distincts permettent une montée en charge progressive sans remise en cause de l'architecture de base.

### 8.3 Séparation frontend / backend

La dissociation entre API métier et couches d'interface permet une exploitation sécurisée, une maintenance indépendante et une meilleure gouvernance des accès.

### 8.4 Préparation à l'intégration des résultats modèles

La combinaison d'une chaîne d'intégration, d'un contrôle structurel, d'un mapping, d'une détection de doublons, d'une validation qualité et d'un historique des opérations constitue un acquis important pour la valorisation des modèles.

### 8.5 Visualisation interactive

La solution propose des cartes, filtres, KPI, séries temporelles, vues multi-séries et exports, ce qui la rend directement utile à l'exploitation opérationnelle.

### 8.6 Structuration décisionnelle

La hiérarchie thématique de l'observatoire, les services `analytics` et les vues métier organisent l'information de manière lisible pour les utilisateurs décisionnels.

### 8.7 Potentiel de montée en charge

La présence de vues matérialisées analytiques, de mécanismes de cache, de scripts de performance et d'une structuration base/API cohérente prépare la solution à un usage plus intensif.

### 8.8 Capacité d'intégration future

L'architecture retenue permet l'intégration progressive de nouveaux jeux de données, de nouvelles couches métier et de nouveaux services sans refonte lourde.

---

## 9. POINTS EN COURS DE FINALISATION ET AJUSTEMENTS RESTANTS

Les points restant à finaliser ou à consolider se situent désormais principalement dans le champ des usages, de la restitution et de la préparation opérationnelle :

- adaptation fine de certains écrans et parcours aux attentes métier du maître d'ouvrage ;
- optimisation des dashboards, notamment sur la hiérarchisation de l'information, la lisibilité des indicateurs et le confort d'exploitation ;
- ajustement de l'organisation des menus et des accès afin de rendre la navigation plus directe selon les profils d'usage ;
- amélioration de l'ergonomie générale sur les écrans les plus chargés ;
- standardisation du reporting avancé et des exports multiformats ;
- complément sur les habilitations fines et sur la traçabilité de certaines opérations sensibles ;
- stabilisation et formalisation de la recette fonctionnelle ;
- consolidation documentaire de déploiement, d'exploitation et de conformité ;
- clarification, si nécessaire, de la couverture des données biologiques ou de leur modalité d'intégration ;
- formalisation finale des livrables d'exploitation et du guide utilisateur.

Ces ajustements s'inscrivent dans une phase normale de finalisation d'un système déjà développé, fonctionnel et structuré. Ils relèvent, pour l'essentiel, d'une adaptation progressive aux usages métier et d'une optimisation des interfaces décisionnelles.

---

## 10. PROCHAINES ETAPES

### 10.1 Finalisation technique

- achever les ajustements du module scénarios côté interface ;
- homogénéiser les mécanismes d'export ;
- consolider les contrôles de rôles et permissions sur les parcours sensibles.

### 10.2 Consolidation fonctionnelle

- valider les parcours métier majeurs par domaine ;
- confirmer la couverture attendue des familles de données du CPS ;
- finaliser les ajustements de restitution décisionnelle, notamment sur les dashboards, les menus et la lisibilité des parcours.

### 10.3 Validation interne

- conduire une revue croisée des fonctionnalités par module ;
- formaliser les écarts résiduels ;
- préparer la levée des réserves avant recette.

### 10.4 Tests

- finaliser la matrice de tests de fonctionnement ;
- documenter les scénarios de recette ;
- produire les preuves de validation nécessaires.

### 10.5 Recette

- préparer une recette organisée par lots fonctionnels ;
- vérifier la cohérence entre routes, vues, dashboards, exports et profils d'accès ;
- confirmer que les derniers ajustements d'ergonomie et d'organisation répondent bien aux attentes du maître d'ouvrage.

### 10.6 Préparation au déploiement

- finaliser les paramètres d'environnement et de sécurité ;
- consolider les prérequis techniques et matériels ;
- préparer le cadre de mise en production sécurisé.

### 10.7 Documentation et exploitation

- finaliser la documentation d'exploitation ;
- stabiliser le guide d'utilisation et les supports administrateur ;
- organiser les éléments de preuve nécessaires à la clôture de la mission.

---

## 11. CONCLUSION

Le système développé dans le cadre de la Mission IV présente un niveau d'avancement élevé et maîtrisé. La solution est structurée, techniquement cohérente et exploitable sur ses composantes essentielles : architecture full web, backend API modulaire, frontend décisionnel, cartographie interactive, vues analytiques, gestion des données, sécurité applicative et chaîne d'intégration des résultats modèles.

À ce stade, il ne s'agit plus de construire le socle du système, mais d'en parfaire la restitution au plus près des usages métier. Les modules sont développés, les modèles sont finalisés dans leur chaîne de traitement, et la plateforme est fonctionnelle. Les derniers ajustements portent principalement sur l'optimisation des dashboards, l'organisation des menus, la lisibilité des écrans, l'ergonomie et la consolidation des éléments de recette et d'exploitation.

L'avancement global estimé à **95 %** correspond ainsi à une **version provisoire avancée**, proche d'une version quasi finale. Dans ce cadre, la solution peut être présentée comme un système structuré, robuste et déjà mobilisable, sous réserve des ajustements de finition qui accompagnent normalement l'appropriation par le maître d'ouvrage et la préparation du déploiement.

---

## ANNEXE 1 - TABLEAU DETAILLE DE CONFORMITE CPS

| Exigence CPS | Description de l'exigence | Mise en oeuvre dans le projet | Niveau de couverture | Commentaire / réserve |
|---|---|---|---|---|
| Architecture full web | application web intégrée | FastAPI + React/Vite + API REST | Conforme | exigence couverte |
| Compatibilité HTTPS | déploiement sécurisé | architecture compatible avec un déploiement sécurisé | Largement couvert / en finalisation | finalisation dans le cadre de déploiement |
| Technologies modernes | outils de pointe | FastAPI, React, TypeScript, MapLibre, Recharts, PostgreSQL/PostGIS | Conforme | exigence couverte |
| Sécurité informatique | sécurité applicative | JWT, refresh token, rôles, permissions, historiques mots de passe, journaux | Largement couvert / en finalisation | socle sécurité en place |
| Habilitations détaillées | droits par rôles et fonctionnalités | schéma `security`, permissions, contrôles frontend et backend | Largement couvert / en finalisation | granularité fine en cours de finition |
| Droits nominatifs | accès par utilisateur identifié | users, emails, usernames, gestion admin | Conforme | exigence couverte |
| Traçabilité | journalisation des actions | journaux d'authentification, journaux d'activité, historique d'intégration | Partiellement couvert | dispositif principal en place |
| Centralisation de données | intégration multi-origines | routes métier, intégration, consultation de données, vues analytiques | Largement couvert / en finalisation | chaîne principale en place |
| Hydrologie | données hydrologiques | `hydro`, analytics hydrologie, dashboards | Conforme | exigence couverte |
| Qualité des eaux | données qualité | `quality`, mesures qualité, composants analytiques | Conforme | exigence couverte |
| Météorologie | données climat/météo | `climate`, analytics climat-météo | Conforme | exigence couverte |
| Biologie | données biologiques | pas de module individualisé dans la version actuelle | Non établi au présent stade | point à préciser si requis |
| Résultats de modèles | intégration modèles et simulations | SWAT, WASP, intégration, contrôle qualité, comparaisons | Largement couvert / en finalisation | restitution scénarios en cours de finition |
| Tableaux de bord | restitution interactive | dashboards analytiques et cartographiques | Conforme | exigence couverte |
| Cartes thématiques | cartographie métier | couches, légendes, popups, hiérarchie | Conforme | exigence couverte |
| Graphiques interactifs | lecture visuelle des résultats | séries, KPI, comparaisons multi-séries | Conforme | exigence couverte |
| Reporting | restitutions adaptées | exports PDF/XLSX/CSV/JSON/PNG | Largement couvert / en finalisation | personnalisation encore à renforcer |
| Exports multi-formats | sorties diverses | PDF, Excel, CSV, JSON, PNG | Partiellement couvert | formats complémentaires à consolider si requis |
| Mobile-responsive | usage sur mobile | structures responsive et navigation mobile | Largement couvert / en finalisation | confort d'usage en cours d'optimisation |
| Prérequis matériels | communication des prérequis | documentation de déploiement locale | Partiellement couvert | volet matériel à finaliser |
| Tests de fonctionnement | campagne de tests | procédures de validation et workflows de contrôle | Partiellement couvert | dossier de recette à consolider |
| Maintenance un an | maintenance contractuelle | prévue au cadre global du projet | Structure préparée / intégration en cours | relève du calendrier d'exploitation |
| Module collecte | intégration de données | intégration, scan, consultation, vues métier | Largement couvert / en finalisation | module en place |
| Module modèles | intégration des modèles | SWAT/WASP, contrôle qualité, scénarios | Largement couvert / en finalisation | restitution scénarios en cours de finition |
| Module exploitation / visualisation | exploitation des résultats | observatory, analytics, dashboards | Conforme | module en place |
| Module reporting | exports et restitutions | DataViewer, dashboards, exports d'administration | Largement couvert / en finalisation | harmonisation finale en cours |
| Code applicatif et documentation technique | livrables techniques | dépôt backend/frontend/docs/scripts SQL | Largement couvert / en finalisation | base livrable déjà structurée |
| Base de données intégrée | base centralisée configurée | PostgreSQL/PostGIS, schémas, vues, routes métier | Largement couvert / en finalisation | fondation technique en place |
| Formation | documentation pédagogique | non formalisée dans ce document à ce stade | Non établi au présent stade | relève du calendrier global |
| Guide utilisateur final | guide d'utilisation complet | documentation existante à consolider en guide final unique | Partiellement couvert | finalisation éditoriale attendue |

---

## ANNEXE 2 - SCHEMA D'ARCHITECTURE TEXTUEL

Données d'origine environnementales et métiers  
fichiers d'import, résultats de modèles SWAT/WASP, vues métier, données hydrologiques, qualité, climat et couches territoriales  
↓  
Base de données PostgreSQL / PostGIS structurée par schémas  
`api`, `analytics`, `security`, `metadata`, `swat_sebou`, `wasp_sebou`, `public`  
↓  
Backend FastAPI / services métier  
`auth`, `users`, `security/logs`, `layers`, `geojson`, `names`, `climate`, `hydro`, `quality`, `observatory`, `analytics`, `ingestion`, `meta`, `raw`, `swat`, `swat_analysis`  
↓  
Frontend React / dashboards et administration  
page d'accueil, dashboard cartographique, dashboard analytique, gestion des données, administration, traçabilité, intégration, gestion utilisateurs, règles de popups  
↓  
Restitution décisionnelle  
cartes interactives, KPI, séries temporelles, comparaisons multi-séries, tableaux exportables, journaux d'activité, suivi des anomalies  
↓  
Usage métier  
surveillance, qualification des situations, exploitation de scénarios, appui à la décision

---

## ANNEXE 3 - INVENTAIRE SYNTHETIQUE DES MODULES MIS EN PLACE

| Domaine | Composants mis en place | Rôle principal |
|---|---|---|
| Authentification et sécurité | `auth`, `users`, `security/logs`, schéma `security`, pages de gestion utilisateurs et réinitialisation | contrôle d'accès, administration, journaux |
| Collecte et intégration | `ingestion`, `raw`, `meta`, `admin/data-scan`, `DataViewer` | import, contrôle, consultation et historique |
| Climat | routes `climate`, analytics climat-météo, composants dashboards climat | restitution climat et météo |
| Hydrologie | routes `hydro`, analytics hydrologie, composants hydrologiques | restitution des débits, barrages et points d'eau |
| Qualité des eaux | routes `quality`, composants qualité, mesures et paramètres | suivi de la qualité des eaux |
| Observatoire décisionnel | routes `observatory`, hiérarchie, KPI, timeline, paramétrage popups | organisation transversale de l'information métier |
| Cartographie SIG | `layers`, `geojson`, `MapLegend`, dashboard cartographique | visualisation territoriale interactive |
| Reporting et exports | DataViewer, exports dashboards, exports qualité, export JSON de contrôle | restitution et extraction |
| Modèles et scénarios | `swat`, `swat_analysis`, intégration SWAT/WASP, fichiers d'import | intégration et contrôle des résultats modèles |
| Performance analytique | vues matérialisées `analytics` et scripts SQL de refresh/performance | support de performance des dashboards |

---

## ANNEXE 4 - SYNTHESE EXECUTIVE

Le présent rapport provisoire rend compte de l'état d'avancement de la Mission IV relative au développement du Système d'Aide à la Décision pour la gestion de la qualité des eaux de surface du bassin du Sebou.

Les travaux réalisés ont permis de mettre en place une solution structurée autour d'un backend `FastAPI`, d'un frontend `React`, d'une base PostgreSQL/PostGIS organisée par schémas, d'un socle SIG opérationnel, de services analytiques dédiés au climat, à l'hydrologie et à la qualité, ainsi que d'une chaîne d'intégration et de contrôle qualité pour les résultats de modèles.

L'avancement global, estimé à **95 %**, correspond à une version provisoire avancée du système. Les modules sont développés, les traitements associés aux modèles sont finalisés au plan technique, et la plateforme est fonctionnelle. Les derniers travaux concernent principalement l'adaptation aux besoins métier du maître d'ouvrage, l'optimisation des dashboards, l'organisation des menus, la lisibilité des écrans et l'ergonomie générale.

La conformité au CPS est globalement atteinte sur les composantes structurantes de la Mission IV : architecture full web, restitution cartographique et analytique, intégration des domaines métier principaux, socle de sécurité, gestion des accès et fonctions d'export déjà actives. Les points encore en cours de finalisation portent surtout sur des volets opérationnels et documentaires : restitution scénarios côté interface, harmonisation du reporting, dossier complet de recette, consolidation du guide utilisateur et précision de certains éléments complémentaires.

Dans ce cadre, la solution peut être présentée comme un système déjà mobilisable, techniquement maîtrisé et engagé dans sa phase finale de consolidation avant stabilisation complète et déploiement.

---

## NOTE FINALE - HYPOTHESES PRUDENTES RETENUES

- Le rapport retient uniquement les éléments formalisés dans le projet et directement rattachés à la Mission IV.
- La compatibilité HTTPS est traitée comme une capacité acquise de l'architecture mise en place, la configuration complète de production relevant du déploiement.
- Le périmètre des données biologiques n'est pas individualisé comme module distinct dans la version actuelle.
- Le module scénarios est techniquement finalisé dans sa chaîne de traitement backend et encore en cours d'ajustement sur sa restitution frontend dédiée.
- Les volets maintenance, formation et guide final utilisateur relèvent du calendrier global de finalisation du projet.
