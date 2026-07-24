# 14 - Frontend Declaration Pollution

## 1. Objectif

Le frontend Declaration Pollution a pour role de :
- saisir la declaration ;
- guider l'utilisateur ;
- lancer l'evaluation ;
- afficher la carte ;
- afficher les resultats ;
- afficher les recommandations ;
- afficher l'explication decisionnelle ;
- generer ou consulter le rapport.

Le frontend ne doit pas recalculer :
- la topologie ;
- la concentration ;
- le statut ;
- la recommandation ;
- la decision.

## 2. Positionnement architectural

Les principes structurants sont :
- le backend est la source de verite ;
- le frontend est une interface de saisie et de restitution ;
- `POST /evaluate` est le contrat central ;
- la carte est une visualisation ;
- le dashboard n'est pas un moteur scientifique.

### Regle de conception

Le frontend doit consommer :
- les etats du workflow ;
- la reponse unifiee d'evaluation ;
- les erreurs explicites ;
- les recommandations ;
- le bloc `decision_reasoning` ou `explanation`.

Il ne doit pas :
- reconstituer la logique d'orchestration ;
- fusionner localement topologie et matrice ;
- reclasser lui-meme le risque.

## 3. Page cible

Deux options existent :
- nouvelle page `DashboardDeclarationPollution.tsx`
- evolution controlee de `DashboardPollution.tsx`

### Recommandation MVP

L'option recommandee est :
- nouvelle page `DashboardDeclarationPollution.tsx`

### Pourquoi

- `DashboardPollution.tsx` existe deja comme ecran hybride pollution / propagation / recommandations MVP ;
- il contient de la logique de visualisation et de consommation des endpoints existants mais pas un workflow declaration complet ;
- le futur dashboard declaration a un cycle de vie metier, des transitions, un bloc d'explication, un rapport et une timeline ;
- le surcharger augmenterait le risque de page monolithique et de confusion entre simulation libre et declaration officielle.

## 4. Structure UX cible

La structure UX cible doit comporter les blocs suivants :

1. en-tete dossier
2. formulaire declaration
3. bloc hydrologie
4. bouton lancer analyse
5. carte parcours pollution
6. resultats stations
7. statut global
8. recommandations
9. explication / `decision_reasoning`
10. rapport
11. historique / timeline

### Lecture d'ecran recommandee

- zone haute : contexte dossier et statut ;
- colonne gauche ou panneau haut : saisie declaration et hydrologie ;
- centre : carte et bouton d'analyse ;
- colonne droite ou panneau bas : resultats, recommandations, explication, rapport ;
- bandeau ou section secondaire : timeline et historique.

## 5. Composants frontend a creer

### `DeclarationPollutionPage`

- Role : page conteneur principale du dashboard declaration.
- Donnees consommees : declaration courante, evaluation courante, erreurs globales, timeline.
- API utilisee : `pollutionDeclarations.ts`
- Dependances : hook `usePollutionDeclarations`, layout, status banner, map panel.

### `DeclarationForm`

- Role : saisir les champs metier de la declaration.
- Donnees consommees : declaration courante, valeurs de formulaire, statut backend.
- API utilisee : `createDeclaration`, `getDeclaration`, futur update controle si ajoute.
- Dependances : composants de formulaire, map point picker, validation UI.

### `HydrologyInputPanel`

- Role : saisir les debits hydrologiques MVP.
- Donnees consommees : `QSebou_m3_s`, `QInnaouen_m3_s`, `QOuergha_m3_s`.
- API utilisee : incluse dans le payload declaration et `evaluate`.
- Dependances : formulaire, messages de confirmation hydrologique.

### `DeclarationWorkflowStatus`

- Role : afficher le statut courant et les transitions autorisees.
- Donnees consommees : statut backend, meta workflow, dernier update.
- API utilisee : `getDeclaration`, `submitDeclaration`, `validateDeclaration`, `rejectDeclaration`, `closeDeclaration`.
- Dependances : badge, CTA, timeline.

### `DeclarationMapPanel`

- Role : afficher la carte declaration + parcours topologique.
- Donnees consommees : point declare, point snappe, `topology_result`.
- API utilisee : indirectement `evaluateDeclaration` via `topology_result`.
- Dependances : `TopologyResultLayer`, fond cartographique, legende.

### `TopologyResultLayer`

- Role : projeter les donnees topologiques dans la carte.
- Donnees consommees : `snapped_point`, `parcours_geojson`, stations, garde, warnings.
- API utilisee : aucune directement ; consomme la reponse deja hydratee.
- Dependances : composant carte, symboles de couche.

### `MatrixResultPanel`

- Role : afficher concentrations, statuts par station et limites scientifiques.
- Donnees consommees : `matrix_result`.
- API utilisee : `evaluateDeclaration`.
- Dependances : cards resultat, panneau de details.

### `RiskStatusPanel`

- Role : afficher le statut global de risque et le niveau de confiance.
- Donnees consommees : `risk_result`, `matrix_result`, `warnings`.
- API utilisee : `evaluateDeclaration`.
- Dependances : badges, alertes, resume synthese.

### `RecommendationPanel`

- Role : afficher recommandation principale et alternatives.
- Donnees consommees : `recommendations`.
- API utilisee : `evaluateDeclaration`.
- Dependances : cards recommandations, classement top 3.

### `DecisionReasoningPanel`

- Role : afficher le bloc d'explication metier.
- Donnees consommees : `decision_reasoning` ou `explanation`.
- API utilisee : `evaluateDeclaration`.
- Dependances : texte structure, warning list, metadata de confiance.

### `DeclarationReportPanel`

- Role : consulter ou lancer la lecture du rapport.
- Donnees consommees : `report_available`, `report_id`, `report_payload`.
- API utilisee : `getDeclarationReport`.
- Dependances : bouton export / consultation, status panel.

### `DeclarationTimeline`

- Role : afficher l'historique des transitions et analyses.
- Donnees consommees : transitions, snapshots, acteur, horodatages.
- API utilisee : `getDeclaration` ou detail enrichi.
- Dependances : composant timeline, badges de statut.

## 6. Composants existants a reutiliser

### `DashboardPollution.tsx`

- Decision : adapter comme reference, ne pas reutiliser tel quel.
- Pourquoi : page utile pour comprendre les integrations actuelles `pollution` + `propagation`, mais trop hybride pour devenir le dashboard declaration officiel.

### `PollutionIdpMap.tsx`

- Decision : adapter.
- Pourquoi : composant carte deja capable d'afficher le reseau, un point source et un `propagationPath`, donc tres bon socle pour la carte declaration.

### `PollutionPropagationResults.tsx`

- Decision : eviter comme composant final, reutiliser eventuellement des patterns de restitution.
- Pourquoi : pense pour la simulation de propagation, pas pour un dossier declaration multi-blocs.

### `PollutionSimulationPanel.tsx`

- Decision : eviter.
- Pourquoi : oriente simulation libre et saisie propagation, alors que le dashboard declaration doit piloter un workflow officiel.

### `usePollutionIdp`

- Decision : adapter ponctuellement ou reutiliser comme source de contexte.
- Pourquoi : utile pour consulter des sites de pollution existants, pas comme hook principal du workflow declaration.

### `usePropagation`

- Decision : adapter indirectement ou prendre comme reference technique.
- Pourquoi : bon socle de consommation des endpoints topologiques existants, mais le workflow declaration doit consommer `evaluate` et non piloter ces appels directement depuis la page.

### `useDecisionIntelligence`

- Decision : eviter comme hook central, reutiliser des patterns si necessaire.
- Pourquoi : traite de recommandations plus globales, pas de recommandation declaration-centric.

### `usePollutionCampagnes`

- Decision : eviter pour le coeur du MVP declaration.
- Pourquoi : concerne campagnes et prelevements, utile seulement comme contexte futur.

### `pollutionIdp.ts`

- Decision : reference utile, ne pas utiliser comme client principal.
- Pourquoi : API deja orientee inventaire pollution et resultats existants, pas workflow declaration.

### `propagation.ts`

- Decision : adapter partiellement ou reutiliser des types/calls internes si besoin.
- Pourquoi : tres utile pour comprendre la topologie existante, mais le frontend declaration doit preferer `pollutionDeclarations.ts`.

### `decisionIntelligence.ts`

- Decision : eviter comme contrat principal.
- Pourquoi : contrat existant de recommandations generiques, insuffisant pour le workflow declaration avec `snapshot_id`, `matrix_version` et `decision_reasoning`.

## 7. Client API frontend

Le nouveau client recommande est :

- `frontend/src/api/pollutionDeclarations.ts`

### Fonctions attendues

- `createDeclaration`
- `listDeclarations`
- `getDeclaration`
- `submitDeclaration`
- `evaluateDeclaration`
- `validateDeclaration`
- `rejectDeclaration`
- `closeDeclaration`
- `getDeclarationReport`

### Role du client

Ce client doit :
- centraliser tous les appels declaration ;
- exposer des types frontend alignes sur les contrats API ;
- eviter la dispersion des appels dans les composants ;
- devenir l'unique facade HTTP du dashboard declaration.

## 8. Hook frontend

Le hook recommande est :

- `frontend/src/hooks/usePollutionDeclarations.ts`

### Responsabilites

- gestion du `loading` ;
- gestion des erreurs ;
- declaration courante ;
- evaluation courante ;
- transitions ;
- `refresh` ;
- cache simple si necessaire.

### Intention

Le hook doit encapsuler :
- la page courante ;
- le cycle create -> submit -> evaluate -> validate/reject/close ;
- l'etat local d'affichage ;
- la synchro minimale avec le cache React Query ou equivalent deja utilise.

## 9. Flux utilisateur MVP

Le flux utilisateur MVP est :

1. ouvrir le dashboard ;
2. creer une declaration ;
3. placer un point ;
4. saisir `Crejet` / `QRejet` ;
5. saisir `QSebou` / `QInnaouen` / `QOuergha` ;
6. soumettre ;
7. lancer l'analyse ;
8. voir le parcours ;
9. voir les concentrations ;
10. voir le statut ;
11. voir les recommandations ;
12. valider ou rejeter ;
13. generer le rapport.

### Lecture UX

Le flux doit etre lineaire mais non rigide :
- la saisie guide ;
- les erreurs bloquent proprement ;
- le resultat apparait dans le meme ecran ;
- la validation metier reste un acte distinct de la recommendation.

## 10. Etats UI

Les etats UI recommandes sont :
- `empty`
- `draft`
- `ready_to_analyze`
- `analyzing`
- `analyzed`
- `risk_low`
- `risk_high`
- `recommendations_ready`
- `validated`
- `closed`
- `error`

### Mapping backend

- `empty` -> aucune declaration chargee
- `draft` -> `BROUILLON`
- `ready_to_analyze` -> `PRET_A_ANALYSER`
- `analyzing` -> `ANALYSE_EN_COURS`
- `analyzed` -> `ANALYSE_TERMINEE`
- `risk_low` -> `RISQUE_FAIBLE`
- `risk_high` -> `RISQUE_ELEVE`
- `recommendations_ready` -> `RECOMMANDATION_PROPOSEE`
- `validated` -> `VALIDE_METIER`
- `closed` -> `CLOTURE`
- `error` -> `ERREUR_ANALYSE` ou erreur API globale

## 11. Gestion des erreurs frontend

Le frontend doit afficher des messages UX clairs pour :
- point manquant ;
- champ obligatoire manquant ;
- point hors reseau ;
- parcours non trouve ;
- Garde non atteint ;
- SAT non detectee ;
- matrice indisponible ;
- hors domaine ;
- recommandation impossible ;
- erreur serveur.

### Intention UX

- traduire les erreurs API en messages metier lisibles ;
- garder le code technique accessible en detail si necessaire ;
- indiquer l'action recommandee ;
- separer les blocages, avertissements et simples informations.

## 12. Carte

L'integration cartographique doit afficher :
- le point declare ;
- le point snappe ;
- le parcours GeoJSON ;
- les stations de controle ;
- le Barrage de Garde ;
- les avertissements topologiques ;
- une legende simple.

### Regle de lecture

La carte affiche le parcours, pas la concentration.

### Usage

- validation visuelle du point et du parcours ;
- lecture du chemin jusqu'a Garde ;
- affichage des points de controle ;
- support de discussion metier.

## 13. Resultats

Le frontend doit afficher :
- `C_SidiAllalTazi_mg_L`
- `C_BgGarde_mg_L`
- statut par station
- statut global
- niveau de confiance
- limites scientifiques

### Presentation recommandee

- cartes de resultats par station ;
- badge de statut global ;
- bloc de confiance et avertissements ;
- lien clair entre sortie matrice et statut affiche.

## 14. Recommandations

Le frontend doit afficher :
- la recommandation principale ;
- le top 3 des alternatives ;
- l'axe concerne ;
- le delta debit ;
- la concentration attendue ;
- la justification ;
- les avertissements.

### Intention

- montrer la meilleure option ;
- montrer qu'il existe des alternatives ;
- montrer le cout hydraulique relatif ;
- ne jamais presenter la recommandation comme une decision deja prise.

## 15. Explication decisionnelle

Le bloc `decision_reasoning` / `explanation` doit expliquer :
- pourquoi le statut est suffisant ou insuffisant ;
- pourquoi telle recommandation est proposee ;
- quelles limites existent ;
- quelle validation humaine reste necessaire.

### Valeur MVP

Ce bloc transforme le dashboard en assistant d'aide a la decision plutot qu'en simple ecran de chiffres.

## 16. Criteres de validation frontend

Le lot est valide si :
- l'utilisateur peut creer une declaration ;
- saisir les donnees MVP ;
- lancer l'analyse ;
- voir la carte ;
- voir les resultats ;
- voir les recommandations ;
- voir l'explication ;
- consulter ou generer le rapport ;
- aucune logique metier critique n'est calculee localement.

## 17. Risques

Les principaux risques sont :
- page trop monolithique ;
- logique metier qui revient cote frontend ;
- confusion simulation libre / declaration officielle ;
- carte trop chargee ;
- messages d'erreur trop techniques ;
- absence de separation entre resultat et decision.

### Lecture de risque

- une page monolithique ralentira toute evolution future ;
- la confusion avec `DashboardPollution` degradera le MVP ;
- une carte trop dense nuira a la demonstration ;
- un frontend trop intelligent cassera la source de verite backend.

## 18. Plan d'implementation frontend

Le plan d'implementation recommande est :
- etape 1 : client API ;
- etape 2 : hook ;
- etape 3 : page shell ;
- etape 4 : formulaire ;
- etape 5 : flow `evaluate` ;
- etape 6 : carte ;
- etape 7 : resultats ;
- etape 8 : recommandations ;
- etape 9 : rapport ;
- etape 10 : tests.

### Ordre de construction

- poser d'abord le contrat avec l'API ;
- monter ensuite le flux utilisateur de bout en bout ;
- brancher ensuite les panneaux de restitution ;
- terminer par le raffinement visuel et les tests.

## 19. Prochain lot

Le prochain lot recommande est :
- `LOT 5 - Carte Declaration Pollution`
ou
- `LOT 9 - Tests & validation`

### Recommandation immediate

Le meilleur enchainement est :
- frontend shell + flux MVP ;
- approfondissement carte ;
- tests de validation.
