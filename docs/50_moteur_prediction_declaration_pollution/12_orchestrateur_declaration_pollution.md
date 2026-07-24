# 12 - Orchestrateur Declaration Pollution

## 1. Objectif

Ce document formalise la brique d'orchestration centrale du moteur Declaration Pollution.

Son objectif est de decrire, dans un seul cadre coherent :
- l'enchainement complet des traitements ;
- les responsabilites de chaque sous-moteur ;
- la gestion des etats ;
- la construction du snapshot ;
- la separation entre evaluation, recommandation, decision et rapport.

## 2. Pourquoi un lot d'orchestration

Les lots precedents ont defini les briques suivantes :
- workflow ;
- backend metier ;
- API ;
- topologie ;
- bibliotheque de matrices ;
- moteur de recommandation.

Mais la sequence complete restait distribuee dans plusieurs documents.

L'orchestrateur est donc la couche qui :
- appelle les briques dans le bon ordre ;
- applique les gardes-fous ;
- historise chaque execution ;
- construit la reponse unifiee pour le dashboard.

## 3. Positionnement architectural

L'architecture cible devient :

- Dashboard
- Backend Declaration Pollution
- Orchestrateur Declaration Pollution
- Moteur topologique
- Bibliotheque de matrices
- Moteur de recommandation
- Couche de decision metier
- Rapport

### Separation structurante

- topologie = qualification spatiale ;
- matrice = evaluation scientifique ;
- recommandation = actions proposees ;
- decision = validation ou rejet humain ;
- orchestrateur = pilotage de bout en bout.

## 4. Responsabilite de l'orchestrateur

L'orchestrateur doit :
- charger la declaration ;
- verifier l'etat courant ;
- valider les preconditions ;
- appeler la topologie ;
- appeler la matrice ;
- qualifier le risque ;
- appeler la recommandation si necessaire ;
- construire le snapshot ;
- historiser les transitions ;
- construire la reponse API ;
- alimenter le rapport.

Il ne doit pas :
- recalculer la topologie ;
- embarquer la logique scientifique de la matrice ;
- prendre a lui seul la decision metier finale.

## 5. Cycle d'execution cible

Le cycle d'execution cible est :

1. creation declaration ;
2. edition du brouillon ;
3. soumission ;
4. passage a `PRET_A_ANALYSER` ;
5. lancement de l'analyse ;
6. passage a `ANALYSE_EN_COURS` ;
7. appel topologie ;
8. appel matrice ;
9. qualification de risque ;
10. appel recommandation si necessaire ;
11. construction du snapshot ;
12. passage a `RISQUE_FAIBLE` ou `RISQUE_ELEVE` ;
13. passage eventuel a `RECOMMANDATION_PROPOSEE` ;
14. restitution API ;
15. validation metier ;
16. decision finale ;
17. rapport ;
18. cloture.

## 6. Couches de traitement

Le moteur complet doit etre lu en quatre couches :

### 1. Couche scientifique

- topologie ;
- matrice.

### 2. Couche technique

- orchestrateur ;
- gestion des erreurs ;
- snapshots ;
- reponses API.

### 3. Couche metier

- qualification du risque ;
- production de recommandations ;
- lecture des limitations ;
- preparation du rapport.

### 4. Couche decision

- validation expert ;
- rejet ;
- cloture ;
- historisation finale.

## 7. Recommandation versus decision

Une recommandation n'est jamais une decision.

### Recommendation

La recommandation :
- est generee par le systeme ;
- depend d'une evaluation ;
- peut comporter plusieurs alternatives ;
- reste conditionnee par des limites scientifiques et operationnelles.

### Decision

La decision :
- appartient a l'expert metier ou a l'acteur habilite ;
- peut accepter, rejeter ou ne pas suivre la recommandation principale ;
- doit etre historisee explicitement.

## 8. Objet central : AnalysisSnapshot

L'orchestrateur doit produire un `AnalysisSnapshot` a chaque execution.

Ce snapshot doit contenir :
- les entrees declaration ;
- les entrees hydrologiques ;
- le resultat topologique ;
- le resultat matrice ;
- le resultat recommandation ;
- les warnings ;
- les limites scientifiques ;
- la version matrice ;
- la version moteur topologique ;
- la methode de recommandation ;
- l'horodatage ;
- l'acteur declencheur.

### Regle structurante

Une nouvelle execution :
- invalide la recommandation active precedente ;
- ne supprime jamais les snapshots anterieurs ;
- ne remplace jamais silencieusement un resultat existant.

## 9. Etats pilotes par l'orchestrateur

L'orchestrateur pilote explicitement :
- `BROUILLON`
- `PRET_A_ANALYSER`
- `ANALYSE_EN_COURS`
- `ANALYSE_TERMINEE`
- `RISQUE_FAIBLE`
- `RISQUE_ELEVE`
- `RECOMMANDATION_PROPOSEE`
- `VALIDE_METIER`
- `CLOTURE`
- `REJETE`
- `ERREUR_ANALYSE`

### Regles de transition majeures

- `PRET_A_ANALYSER` -> `ANALYSE_EN_COURS`
- `ANALYSE_EN_COURS` -> `ANALYSE_TERMINEE`
- `ANALYSE_TERMINEE` -> `RISQUE_FAIBLE` ou `RISQUE_ELEVE`
- `RISQUE_ELEVE` -> `RECOMMANDATION_PROPOSEE`
- `RISQUE_FAIBLE` -> recommandation optionnelle ou validation metier
- `RECOMMANDATION_PROPOSEE` -> `VALIDE_METIER` ou `REJETE`

## 10. Reponse API unifiee

L'orchestrateur doit construire une reponse API unique comprenant :
- identite declaration ;
- statut workflow ;
- `topology_result` ;
- `matrix_result` ;
- `risk_result` ;
- `recommendations` ;
- `decision_reasoning` ou `explanation` ;
- `warnings` ;
- `errors` ;
- `snapshot_id` ;
- `report_available`.

## 11. Couche d'explication

Le moteur doit produire une capacite d'explication explicite.

### Objectif

Expliquer :
- pourquoi le scenario est insuffisant ;
- sur quelle station le probleme apparait ;
- quelle variable contribue le plus a l'insuffisance ;
- pourquoi la recommandation principale est preferee.

### Contrat recommande

Un bloc `decision_reasoning` ou `explanation` doit pouvoir inclure :
- resume du diagnostic ;
- justification scientifique simplifiee ;
- justification de la recommandation principale ;
- limites et hypotheses ;
- alternatives importantes.

## 12. Responsabilite du backend declaration

Le backend declaration reste la source de verite.

L'orchestrateur doit y vivre comme couche centrale, idealement dans :
- `declaration_pollution_service.py`

Le frontend ne doit jamais :
- deduire seul l'ordre des appels ;
- fusionner lui-meme topologie, matrice et recommandation ;
- reconstruire une logique de decision locale.

## 13. Critiques de conception evitees

Ce lot evite :
- backend trop implicite ;
- logique dispersee dans plusieurs services ;
- frontend trop intelligent ;
- confusion entre evaluation et decision ;
- perte de tracabilite entre deux analyses ;
- recommendation presentee comme verite absolue.

## 14. Resultat attendu pour le MVP

Le MVP doit disposer, apres ce lot, d'une colonne vertebrale claire :
- une declaration entre ;
- une analyse complete s'execute ;
- un snapshot est construit ;
- une recommandation est produite si necessaire ;
- une explication est disponible ;
- une validation humaine termine le processus.

## 15. Prochaine articulation

Ce lot ouvre directement :
- la sequence d'execution complete ;
- puis le frontend ;
- puis la carte du dashboard.
