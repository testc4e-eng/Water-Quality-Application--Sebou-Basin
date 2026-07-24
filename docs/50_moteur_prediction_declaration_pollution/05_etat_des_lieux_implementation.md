# Etat des lieux implementation

## Contexte

La phase active reste `PHASE 3 - FINALISATION DU MVP`.

Le chemin critique est borne :

- `P0` corriger `Dashboard Home` ;
- `P1` reprendre `Dashboard Declaration Pollution`.

Le dashboard cible ne doit pas recalculer lui-meme la topologie, la propagation, les matrices ou les recommandations. Il doit orchestrer des briques existantes.

## Conclusion executive

L'existant confirme que le projet possede deja un socle technique solide pour construire `Dashboard Declaration Pollution` par extension et non par reecriture :

- un dashboard pollution runtime existe deja ;
- un dashboard campagnes existe deja ;
- un moteur topologique runtime existe deja ;
- un moteur de propagation topologique existe deja ;
- un moteur de recommandations existe deja ;
- des APIs pollution, propagation, alertes, KPI et recommandations existent deja ;
- des couches cartographiques pollution et qualite existent deja ;
- des referentiels et vues backend pollution existent deja.

En revanche, il n'existe pas encore de vrai `workflow Declaration Pollution` implemente de bout en bout avec :

- creation de declaration ;
- statuts metier ;
- orchestration explicite topologie -> hydrologie/matrice -> evaluation -> recommandations -> rapport ;
- separation claire entre declaration, inventaire, campagnes et analyse topologique.

## 1. Ce qui est deja implemente

### Frontend runtime

#### Ecrans existants

- `frontend/src/pages/DashboardPollution.tsx`
  - routee via `/dashboard-pollution` et `/pollution`
  - ecran principal pollution deja branche au runtime.
- `frontend/src/pages/DashboardPollutionPropagation.tsx`
  - ecran dedie a la simulation ponctuelle de propagation.
- `frontend/src/pages/DashboardPollutionCampagnes.tsx`
  - ecran dedie aux prelevements et alertes de campagne.

#### Composants React existants

- `frontend/src/components/Pollution/PollutionIdpMap.tsx`
  - carte pollution IDP avec sites, stations qualite, reseau, chemin de propagation, pointage manuel.
- `frontend/src/components/Pollution/PollutionPropagationResults.tsx`
  - panneau de restitution de simulation.
- `frontend/src/components/Pollution/PollutionSimulationPanel.tsx`
  - panneau de parametrage de simulation ponctuelle.
- `frontend/src/components/Pollution/PollutionSignalMap.tsx`
  - carte de signalisation de source pour simulation.
- `frontend/src/components/Pollution/CampagneSidebar.tsx`
- `frontend/src/components/Pollution/CampagnePrelevementMap.tsx`
- `frontend/src/components/Pollution/CampagneList.tsx`
- `frontend/src/components/Pollution/PollutionAlertPanel.tsx`
- `frontend/src/components/Pollution/PrelevementDetail.tsx`
- `frontend/src/components/Pollution/PrelevementEntityLink.tsx`

#### Hooks et clients API existants

- `frontend/src/hooks/usePollutionIdp.ts`
- `frontend/src/hooks/usePropagation.ts`
- `frontend/src/hooks/useDecisionIntelligence.ts`
- `frontend/src/hooks/usePollutionCampagnes.ts`
- `frontend/src/api/pollutionIdp.ts`
- `frontend/src/api/propagation.ts`
- `frontend/src/api/decisionIntelligence.ts`
- `frontend/src/api/pollutionCampagnes.ts`

#### Logique de scoring/restitution deja presente

- `frontend/src/lib/decision-metrics.ts`
  - `pollutionSeverity`
  - `pollutionRiskIndex`
  - `buildPollutionSummary`

Cette logique est utile comme socle MVP de priorisation, mais elle reste un proxy frontend et non un moteur metier officiel.

### Backend runtime

#### Endpoints deja montes dans le runtime reel

Le runtime actif est assemble dans `backend/app/api/api_v1.py`, pas dans `backend/app/api/v1/api_router.py`.

Endpoints pollution / propagation / decision existants :

- `GET /api/v1/pollution/sites.geojson`
- `GET /api/v1/pollution/latest-results`
- `GET /api/v1/pollution/campagnes`
- `GET /api/v1/pollution/prelevements`
- `GET /api/v1/pollution/prelevements/{id}`
- `GET /api/v1/pollution/prelevements/{id}/mesures`
- `GET /api/v1/pollution/prelevements/{id}/liens`
- `GET /api/v1/pollution/alerts`
- `GET /api/v1/propagation/network.geojson`
- `POST /api/v1/propagation/simulate`
- `GET /api/v1/propagation/snap-diagnostic`
- `GET /api/v1/propagation/source-to-garde`
- `GET /api/v1/propagation/source-to-stations`
- `GET /api/v1/propagation/source-to-barrages`
- `GET /api/v1/propagation/source-to-exutoires`
- `GET /api/v1/recommendations`
- `GET /api/v1/alerts`
- `GET /api/v1/kpi/*`

#### Services backend existants

- `backend/app/services/propagation/propagation_pollution_service.py`
  - moteur topologique et propagation MVP.
- `backend/app/services/propagation/propagation_recommendations.py`
  - recommandations derivees de la simulation de propagation.
- `backend/app/services/recommendations/engine.py`
  - moteur de recommandations global base sur KPI et alertes.
- `backend/app/services/pollution_campagnes_service.py`
  - lecture metier des campagnes et alertes.
- `backend/app/services/kpi/engine.py`
  - KPI pollution/stations/overview.
- `backend/app/services/alerts/engine.py`
  - alertes transverses.
- `backend/app/services/map_business_service.py`
  - couche carte metier reutilisable.

#### Modeles backend existants

- `backend/app/models/propagation_models.py`
  - contrats Pydantic du endpoint `simulate`.
- `backend/app/models/pollution_campagnes_models.py`
  - contrats Pydantic des campagnes, prelevements, mesures, liens, alertes.

### Couche de donnees exploitable

Objets data cites explicitement dans le code et la doc :

- `geo.ref_site_pollution`
  - referentiel spatial maitre pollution.
- `api.v_pollution_sites`
  - vue source cartographique des sites pollution.
- `api.v_pollution_latest_results`
  - vue source des derniers resultats P0.
- `qualite.source_pollution_prelevement`
  - entete des prelevements.
- `qualite.source_pollution_prelevement_lien`
  - liens entre prelevement et entites.
- `api.v_station_dimension`
  - cibles stations pour propagation.
- `api.v_barrage_dimension`
  - cibles barrages pour propagation.

### Documentation directement reutilisable pour implementer

- `docs/39_audit_documentaire_stabilisation_dashboards/07_focus_dashboard_declaration_pollution.md`
- `docs/03_ai_knowledge_base/api_for_agents.md`
- `docs/03_ai_knowledge_base/architecture_for_agents.md`
- `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`

## 2. Ce qui est partiellement implemente

### Dashboard pollution actuel

`frontend/src/pages/DashboardPollution.tsx` est deja un orchestrateur partiel, mais pour un use case different :

- il sait selectionner un site pollution ;
- il sait appeler les endpoints de propagation existants ;
- il sait afficher une carte, des impacts et des recommandations ;
- il sait calculer un score `IPP` MVP.

Mais il ne gere pas :

- la creation d'une declaration ;
- le cycle de vie metier d'un dossier ;
- la collecte structuree des variables d'entree de matrice ;
- l'evaluation de concentration a partir d'une bibliotheque de matrices ;
- l'evaluation reglementaire finale d'une declaration ;
- la production d'un rapport metier de declaration.

### Moteur de recommandation

Deux briques existent deja :

- recommandations globales via `backend/app/services/recommendations/engine.py`
- recommandations de propagation via `backend/app/services/propagation/propagation_recommendations.py`

Mais aucune de ces deux briques n'est encore un `moteur de recommandation declaration pollution` pilote par workflow.

### Moteur de calcul

Le backend dispose deja d'un endpoint `POST /api/v1/propagation/simulate` qui calcule :

- snap ;
- parcours ;
- temps ;
- attenuation exponentielle ;
- cibles impactees ;
- recommandations associees.

Mais ce moteur reste :

- topologique ;
- indicatif ;
- non scientifique ;
- parametre pour une simulation libre par point.

Il n'est pas encore aligne sur la matrice scientifique cible `NH4 / Dar El Arssa / Sidi Allal Tazi / Garde`.

### Donnees campagnes

Le dashboard campagnes est exploitable en lecture seule :

- filtres ;
- carte ;
- alertes ;
- detail de prelevement ;
- mesures parametrees ;
- liens vers entites.

Mais il n'est pas encore articule comme une sous-vue d'une declaration pollution.

### Scoring et priorisation

Le frontend calcule deja des scores provisoires dans `decision-metrics.ts`.

Cette logique est utile pour le MVP, mais elle doit etre consideree comme :

- une base de priorisation ;
- pas encore comme un moteur metier stable ;
- idealement a deplacer ensuite vers le backend si elle devient contractuelle.

## 3. Ce qui manque reellement

### Workflow declaration pollution

Il manque un vrai workflow metier implemente :

- creation de declaration ;
- mode brouillon ;
- soumission ;
- controle ;
- validation ;
- rejet ;
- archivage ;
- timeline et historique des actions.

### Orchestration explicite des moteurs

Le dashboard cible doit enchainer :

1. declaration ;
2. identification du point de rejet ;
3. appel moteur topologique ;
4. lecture conditions hydrologiques ;
5. appel bibliotheque de matrices ;
6. calcul concentrations ;
7. evaluation reglementaire ;
8. recommandations ;
9. visualisation ;
10. rapport.

Aujourd'hui, cette orchestration unifiee n'existe pas.

### Bibliotheque de matrices

Il manque un composant logiciel dedie pour :

- stocker la matrice MVP ;
- lire les entrees `Crejet_mg_L`, `QRejet_m3_s`, `QSebou_m3_s`, `QInnaouen_m3_s`, `QOuergha_m3_s` ;
- restituer `C_SidiAllalTazi_mg_L`, `C_BgGarde_mg_L`, `Statut` ;
- rester extensible a d'autres polluants et points de rejet.

### Moteur de decision declaration-centric

Il manque un service backend specialise declaration pollution pour :

- composer topologie + matrices + evaluation + recommandations ;
- fournir un contrat unique au frontend ;
- eviter que le frontend orchestre trop de calculs metier disperses.

### Contrat API unifie du dashboard declaration

Il manque au moins un endpoint agregateur de type :

- `POST /api/v1/pollution/declarations/evaluate`
- ou equivalent backend de preview/evaluation.

Il manque aussi les endpoints CRUD et workflow de declaration.

### Composants UI metier

Il manque les composants propres au dashboard declaration :

- formulaire de declaration ;
- liste des declarations ;
- fiche dossier ;
- timeline statutaire ;
- panneau variables hydrologiques ;
- panneau evaluation matrice ;
- panneau evaluation reglementaire ;
- panneau rapport exportable.

## 4. Ce qui doit etre supprime ou debranche du futur dashboard cible

### A sortir du coeur du futur dashboard

- l'usage principal de `DashboardPollutionPropagation.tsx`
  - utile comme ecran technique ou de demonstration moteur ;
  - ne doit pas devenir l'entree metier principale.
- le mode `simulation libre par clic` comme entree centrale
  - utile pour DEV et diagnostic ;
  - insuffisant pour une declaration officielle.

### A supprimer ou fusionner a terme

- la duplication locale de parsing/resultats entre `pollutionIdp.ts` et `PollutionIdpMap.tsx`
  - petit doublon frontend a simplifier.
- la logique de score purement frontend si un moteur backend declaration devient contractuel
  - `decision-metrics.ts` doit alors devenir une couche de presentation.

### A ne pas utiliser comme source de verite runtime

- `backend/app/api/v1/api_router.py`
  - fichier explicitement marque legacy/non-runtime.

## 5. Ce qui doit etre reutilise

### Composants reutilisables tels quels ou presque

- `DashboardPollution.tsx`
  - base de composition pollution.
- `PollutionIdpMap.tsx`
  - carte principale.
- `usePollutionIdp`
- `usePropagation`
- `useDecisionRecommendations`
- `usePollutionCampagnes`
- `PollutionAlertPanel`
- `PrelevementDetail`
- `PrelevementEntityLink`

### Services backend a reutiliser

- `propagation_pollution_service.py`
  - moteur topologique et propagation.
- `pollution_campagnes_service.py`
  - mesures et prelevements.
- `recommendations/engine.py`
  - recommandation globale de base.
- `propagation_recommendations.py`
  - recommandation issue d'un scenario de propagation.
- `kpi/engine.py`
  - KPI pollution reutilisables.

### Objets data a reutiliser

- `geo.ref_site_pollution`
- `api.v_pollution_sites`
- `api.v_pollution_latest_results`
- `qualite.source_pollution_prelevement`
- `qualite.source_pollution_prelevement_lien`
- `api.v_station_dimension`
- `api.v_barrage_dimension`

## 6. Ce qui doit etre developpe

### Backend

- service `declaration_pollution_service`
  - orchestration metier unifiee ;
- endpoints de declaration
  - creation, lecture, liste, transitions, evaluation, rapport ;
- bibliotheque de matrices
  - service ou table de regles versionnees ;
- service d'evaluation reglementaire de declaration ;
- endpoint agregateur de preview/evaluation.

### Frontend

- page `DashboardDeclarationPollution` ou refonte cible de `DashboardPollution.tsx` ;
- formulaire declaration ;
- liste dossiers ;
- fiche declaration ;
- timeline de workflow ;
- panneau resultats matrice ;
- panneau evaluation reglementaire ;
- panneau rapport.

### Data / schema

- stockage des declarations si absent du schema runtime ;
- stockage des statuts et historique ;
- eventuel stockage des evaluations et snapshots de calcul ;
- eventuel referentiel de matrices MVP.

## Endpoints existants

### Existant a reutiliser

- `GET /api/v1/pollution/sites.geojson`
- `GET /api/v1/pollution/latest-results`
- `GET /api/v1/pollution/campagnes`
- `GET /api/v1/pollution/prelevements`
- `GET /api/v1/pollution/prelevements/{id}`
- `GET /api/v1/pollution/prelevements/{id}/mesures`
- `GET /api/v1/pollution/prelevements/{id}/liens`
- `GET /api/v1/pollution/alerts`
- `GET /api/v1/propagation/snap-diagnostic`
- `GET /api/v1/propagation/source-to-garde`
- `GET /api/v1/propagation/source-to-stations`
- `GET /api/v1/propagation/source-to-barrages`
- `GET /api/v1/propagation/source-to-exutoires`
- `POST /api/v1/propagation/simulate`
- `GET /api/v1/recommendations`
- `GET /api/v1/alerts`
- `GET /api/v1/kpi/pollution`

## Endpoints a ajouter

- `POST /api/v1/pollution/declarations`
- `GET /api/v1/pollution/declarations`
- `GET /api/v1/pollution/declarations/{id}`
- `POST /api/v1/pollution/declarations/{id}/evaluate`
- `POST /api/v1/pollution/declarations/{id}/submit`
- `POST /api/v1/pollution/declarations/{id}/validate`
- `POST /api/v1/pollution/declarations/{id}/reject`
- `GET /api/v1/pollution/declarations/{id}/report`

Optionnellement :

- `GET /api/v1/pollution/matrix-library`
- `POST /api/v1/pollution/matrix-library/preview`

## Lots d'implementation

### LOT 1 - Workflow metier

- Objectifs
  - figer les etapes du workflow declaration.
  - definir les statuts et transitions.
- Fichiers concernes
  - nouveaux fichiers backend service/model/router declaration.
  - refonte de `frontend/src/pages/DashboardPollution.tsx` ou nouvelle page cible.
- Composants existants a reutiliser
  - `DashboardPollution.tsx`
  - `PollutionIdpMap.tsx`
  - `usePollutionIdp`
- Nouveaux composants
  - formulaire declaration
  - liste dossiers
  - timeline workflow
- Dependances
  - referentiel pollution existant
  - routes frontend existantes
- Criteres de validation
  - une declaration peut etre creee et relue.
  - les statuts sont explicites.
- Risques
  - flou metier sur statuts et roles.

### LOT 2 - Backend declaration

- Objectifs
  - introduire un service backend d'orchestration.
- Fichiers concernes
  - `backend/app/api/v1/`
  - `backend/app/services/`
  - `backend/app/models/`
- Composants existants a reutiliser
  - `propagation_pollution_service.py`
  - `pollution_campagnes_service.py`
  - `recommendations/engine.py`
- Nouveaux composants
  - `declaration_pollution_service.py`
  - `declaration_pollution_models.py`
  - `declaration_pollution.py`
- Dependances
  - pollution, campagnes, propagation
- Criteres de validation
  - un endpoint d'evaluation agrege fonctionne.
- Risques
  - trop de logique laissee au frontend si le service n'orchestre pas assez.

### LOT 3 - API declaration

- Objectifs
  - exposer CRUD + evaluation + transitions.
- Fichiers concernes
  - routeurs backend declaration.
- Composants existants a reutiliser
  - conventions de `pollution.py`, `pollution_campagnes.py`, `propagation.py`
- Nouveaux composants
  - endpoints declaration
- Dependances
  - modeles Pydantic
- Criteres de validation
  - contrats JSON stables.
- Risques
  - dispersion des payloads si pas de contrat unique.

### LOT 4 - Frontend declaration

- Objectifs
  - construire le dashboard cible comme orchestrateur metier.
- Fichiers concernes
  - `frontend/src/pages/DashboardPollution.tsx`
  - nouveaux composants `components/Pollution/*`
- Composants existants a reutiliser
  - carte pollution
  - hooks pollution
  - hooks propagation
  - hooks campagnes
- Nouveaux composants
  - `DeclarationForm`
  - `DeclarationList`
  - `DeclarationDetail`
  - `DeclarationWorkflowTimeline`
- Dependances
  - endpoints declaration
- Criteres de validation
  - un utilisateur peut creer, evaluer et consulter une declaration.
- Risques
  - surcharge de la page si tout reste monolithique.

### LOT 5 - Carte

- Objectifs
  - conserver la carte comme support central de visualisation.
- Fichiers concernes
  - `PollutionIdpMap.tsx`
- Composants existants a reutiliser
  - couches pollution
  - couches stations qualite
  - reseau propagation
- Nouveaux composants
  - couches dossier declaration
  - couches impacts declaration
- Dependances
  - georef declaration
- Criteres de validation
  - une declaration affiche source, parcours et cibles.
- Risques
  - confusion entre carte diagnostic DEV et carte metier.

### LOT 6 - Integration moteur topologique

- Objectifs
  - brancher la declaration au moteur topologique existant.
- Fichiers concernes
  - service declaration backend
  - hooks propagation frontend
- Composants existants a reutiliser
  - `GET /api/v1/propagation/snap-diagnostic`
  - `GET /api/v1/propagation/source-to-*`
- Nouveaux composants
  - aucun moteur nouveau
  - seulement orchestration
- Dependances
  - site_id ou point geolocalise declaration
- Criteres de validation
  - la declaration retourne le parcours vers garde/stations/barrages.
- Risques
  - confusion scientifique si le badge DEV disparait.

### LOT 7 - Bibliotheque de matrices

- Objectifs
  - encapsuler la matrice MVP dans un service versionne.
- Fichiers concernes
  - nouveaux services backend declaration/matrix
- Composants existants a reutiliser
  - aucun moteur matriçiel existant identifie en runtime
- Nouveaux composants
  - `matrix_library_service.py`
  - eventuel stockage SQL ou YAML/JSON gouverne
- Dependances
  - specification scientifique NH4
- Criteres de validation
  - pour les variables d'entree MVP, la concentration de sortie est calculee.
- Risques
  - sur-modelisation trop tot ; rester generic mais simple.

### LOT 8 - Moteur de recommandation declaration

- Objectifs
  - composer recommandations globales, topologiques et matrice/reglementaire.
- Fichiers concernes
  - service declaration backend
  - eventuelle extension `recommendations/engine.py`
- Composants existants a reutiliser
  - `recommendations/engine.py`
  - `propagation_recommendations.py`
- Nouveaux composants
  - adaptateur declaration-centric
- Dependances
  - evaluation matrice + statuts
- Criteres de validation
  - recommandations contextuelles et tracables.
- Risques
  - melange entre recommandations globales et recommandations declaration.

### LOT 9 - Tests

- Objectifs
  - couvrir orchestration et contrats.
- Fichiers concernes
  - `backend/tests/*`
  - tests frontend ciblant la page declaration
- Composants existants a reutiliser
  - tests propagation existants si presents
- Nouveaux composants
  - tests API declaration
  - tests d'orchestration
- Dependances
  - endpoints declaration
- Criteres de validation
  - creation -> evaluation -> restitution testees.
- Risques
  - couverture insuffisante sur le chainage des moteurs.

### LOT 10 - Validation metier

- Objectifs
  - valider la lecture fonctionnelle du dashboard.
- Fichiers concernes
  - rapport de validation a produire ensuite
- Composants existants a reutiliser
  - donnees campagnes
  - sites pollution
  - propagation topologique
- Nouveaux composants
  - scenario de recette declaration
- Dependances
  - lots 1 a 9
- Criteres de validation
  - le dashboard sert reellement d'aide a la decision.
- Risques
  - ecart entre logique MVP et attentes metier.

## Ordre recommande de developpement

1. `LOT 1 - Workflow metier`
2. `LOT 2 - Backend declaration`
3. `LOT 3 - API declaration`
4. `LOT 6 - Integration moteur topologique`
5. `LOT 7 - Bibliotheque de matrices`
6. `LOT 8 - Moteur de recommandation declaration`
7. `LOT 4 - Frontend declaration`
8. `LOT 5 - Carte`
9. `LOT 9 - Tests`
10. `LOT 10 - Validation metier`

## Risques majeurs

- confusion entre `dashboard pollution existant` et `dashboard declaration cible` ;
- sur-utilisation du mode simulation libre au lieu d'un vrai dossier de declaration ;
- logique metier trop repartie dans le frontend ;
- absence de contrat unique d'evaluation ;
- presentation abusive du moteur topologique comme moteur scientifique ;
- matrice MVP non encapsulee proprement ;
- flou sur les statuts et les roles.

## Prochaines actions

1. Valider si la cible est une refonte de `DashboardPollution.tsx` ou une nouvelle page `DashboardDeclarationPollution`.
2. Ouvrir `LOT 1` en fixant les objets metier `declaration`, `statut`, `transition`, `evaluation`, `rapport`.
3. Ouvrir `LOT 2` avec un service backend d'orchestration unique.
4. Ne pas toucher au moteur topologique ni au moteur propagation sauf pour les consommer.
5. Implémenter la bibliotheque de matrices comme brique independante du dashboard.

## Synthese finale

### Composants reutilisables

- `DashboardPollution.tsx`
- `DashboardPollutionCampagnes.tsx`
- `PollutionIdpMap.tsx`
- hooks `usePollutionIdp`, `usePropagation`, `useDecisionIntelligence`, `usePollutionCampagnes`
- `propagation_pollution_service.py`
- `pollution_campagnes_service.py`
- `recommendations/engine.py`
- `propagation_recommendations.py`
- `geo.ref_site_pollution`
- `api.v_pollution_sites`
- `api.v_pollution_latest_results`

### Composants a modifier

- `frontend/src/pages/DashboardPollution.tsx`
- `frontend/src/components/Pollution/PollutionIdpMap.tsx`
- `frontend/src/lib/decision-metrics.ts`
- eventuellement `backend/app/services/recommendations/engine.py`

### Composants a creer

- service backend declaration
- modeles declaration
- endpoints declaration
- bibliotheque de matrices
- UI formulaire/liste/detail/timeline/rapport

### Endpoints existants

- pollution `sites.geojson`, `latest-results`, `campagnes`, `prelevements*`, `alerts`
- propagation `snap-diagnostic`, `source-to-*`, `simulate`
- `recommendations`
- `alerts`
- `kpi/pollution`

### Endpoints a ajouter

- CRUD declarations
- transitions de workflow
- endpoint d'evaluation
- endpoint de rapport

### Lots d'implementation

- workflow
- backend
- API
- frontend
- carte
- integration topologique
- bibliotheque matrices
- recommandation
- tests
- validation metier

### Ordre recommande de developpement

- workflow
- backend
- API
- integration topologique
- matrices
- recommandations
- frontend
- carte
- tests
- validation

### Risques

- dispersion metier
- sur-promesse scientifique
- confusion ecran existant / cible declaration
- contrat d'evaluation absent

