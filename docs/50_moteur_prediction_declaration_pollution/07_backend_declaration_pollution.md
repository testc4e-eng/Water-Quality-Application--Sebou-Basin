# 07 - Backend Declaration Pollution

## 1. Objectif

Le backend Declaration Pollution doit porter la verite du workflow.

Son role n'est pas seulement d'exposer des endpoints. Il doit :
- gerer les etats du dossier ;
- appliquer les transitions ;
- controler les preconditions metier ;
- orchestrer les moteurs existants ;
- historiser les decisions et les resultats ;
- preparer une restitution exploitable par le dashboard et le rapport.

Le backend est donc responsable :
- du workflow ;
- de l'orchestration ;
- de la tracabilite ;
- de la stabilite du contrat metier.

## 2. Perimetre LOT 2

### Inclus

Le LOT 2 couvre la conception cible de :
- modele declaration ;
- modele transition ;
- modele evaluation ;
- modele recommandation ;
- modele rapport ;
- service d'orchestration ;
- separation claire entre workflow, topologie, matrice et recommandation.

### Exclu

Le LOT 2 n'inclut pas :
- le developpement frontend ;
- une migration SQL immediate ;
- la connexion aux sentinelles ;
- une IA ou un ML officiel ;
- la stabilisation globale de la plateforme ;
- la reecriture des moteurs existants.

## 3. Correction des etats workflow

L'ambiguite du LOT 1 doit etre corrigee : l'etat `ANALYSE` ne doit plus couvrir a la fois l'execution et le resultat disponible.

La liste backend recommandee est :
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

### `BROUILLON`

- Role backend : etat initial editable.
- Condition d'entree : creation de declaration ou retour en edition.
- Condition de sortie : declaration complete et eligible a l'analyse.

### `PRET_A_ANALYSER`

- Role backend : declaration validee sur ses champs obligatoires mais non encore executee.
- Condition d'entree : point, polluant, debits et concentration obligatoires disponibles.
- Condition de sortie : lancement de l'analyse ou retour en brouillon suite a modification bloquante.

### `ANALYSE_EN_COURS`

- Role backend : verrouiller l'execution du pipeline d'analyse et marquer un traitement en cours.
- Condition d'entree : lancement effectif de l'analyse depuis `PRET_A_ANALYSER`.
- Condition de sortie : succes d'analyse vers `ANALYSE_TERMINEE` ou echec vers `ERREUR_ANALYSE`.

### `ANALYSE_TERMINEE`

- Role backend : marquer qu'un resultat technique exploitable a ete produit et historise.
- Condition d'entree : fin complete du pipeline topologie + matrice + evaluation.
- Condition de sortie : qualification de risque vers `RISQUE_FAIBLE` ou `RISQUE_ELEVE`.

### `RISQUE_FAIBLE`

- Role backend : porter une conclusion metier favorable issue de l'evaluation.
- Condition d'entree : statut suffisant aux deux stations de controle MVP.
- Condition de sortie : recommandations optionnelles, validation metier, recalcul ou rejet.

### `RISQUE_ELEVE`

- Role backend : porter une conclusion metier defavorable ou sensible.
- Condition d'entree : insuffisance constatee a au moins une station.
- Condition de sortie : recommandations, validation, recalcul ou rejet.

### `RECOMMANDATION_PROPOSEE`

- Role backend : figer une reponse d'aide a la decision associee a une evaluation donnee.
- Condition d'entree : recommandations generees a partir d'un resultat exploitable.
- Condition de sortie : validation metier, rejet ou recalcul.

### `VALIDE_METIER`

- Role backend : marquer l'acceptation du dossier par l'expertise metier.
- Condition d'entree : revue metier explicite d'un dossier analyse.
- Condition de sortie : cloture ou reouverture future hors MVP.

### `CLOTURE`

- Role backend : terminer le cycle de vie du dossier.
- Condition d'entree : validation metier et restitution finalisee.
- Condition de sortie : aucune dans le MVP.

### `REJETE`

- Role backend : marquer un dossier non retenu ou inexploitable.
- Condition d'entree : rejet explicite par un acteur habilite.
- Condition de sortie : aucune dans le MVP.

### `ERREUR_ANALYSE`

- Role backend : isoler proprement un echec d'execution sans confondre erreur technique et decision metier.
- Condition d'entree : echec du pipeline d'analyse ou indisponibilite d'un moteur requis.
- Condition de sortie : correction des donnees puis relance, ou rejet.

## 4. Objets backend cibles

### `PollutionDeclaration`

- Responsabilite : objet racine du dossier Declaration Pollution.
- Champs principaux :
  - `id`
  - `reference`
  - `status`
  - `declared_at`
  - `pollutant_code`
  - `discharge_point`
  - `crejet_mg_l`
  - `qrejet_m3_s`
  - `qsebou_m3_s`
  - `qinnaouen_m3_s`
  - `qouergha_m3_s`
  - `comment`
  - `created_by`
  - `updated_at`
- Liens :
  - 1 declaration -> plusieurs transitions
  - 1 declaration -> plusieurs snapshots
  - 1 declaration -> evaluation courante
  - 1 declaration -> recommandations
  - 1 declaration -> rapport courant ou versionne

### `PollutionDeclarationTransition`

- Responsabilite : historiser chaque changement de statut ou decision structurante.
- Champs principaux :
  - `id`
  - `declaration_id`
  - `from_status`
  - `to_status`
  - `trigger`
  - `reason`
  - `actor_type`
  - `actor_id`
  - `created_at`
- Liens :
  - plusieurs transitions rattachees a une declaration
  - peut referencer un snapshot ou une evaluation si la transition resulte d'une analyse

### `PollutionDeclarationEvaluation`

- Responsabilite : porter le resultat scientifique et reglementaire consolide.
- Champs principaux :
  - `id`
  - `declaration_id`
  - `analysis_snapshot_id`
  - `c_sidi_allal_tazi_mg_l`
  - `c_bg_garde_mg_l`
  - `station_statuses`
  - `global_status`
  - `risk_level`
  - `confidence_level`
  - `scientific_limit_flag`
  - `scientific_limit_message`
  - `evaluated_at`
- Liens :
  - 1 evaluation associee a une declaration
  - s'appuie sur 1 snapshot d'analyse
  - alimente recommandations et rapport

### `PollutionDeclarationRecommendation`

- Responsabilite : stocker la ou les recommandations produites pour une evaluation donnee.
- Champs principaux :
  - `id`
  - `declaration_id`
  - `evaluation_id`
  - `recommendation_code`
  - `title`
  - `description`
  - `priority`
  - `source_engine`
  - `generated_at`
- Liens :
  - plusieurs recommandations pour une declaration
  - rattachees a une evaluation precise

### `PollutionDeclarationReport`

- Responsabilite : porter la restitution partageable du dossier.
- Champs principaux :
  - `id`
  - `declaration_id`
  - `evaluation_id`
  - `report_status`
  - `report_payload`
  - `generated_at`
  - `generated_by`
- Liens :
  - 1 rapport depend d'une evaluation stabilisee
  - 1 declaration peut avoir plusieurs versions de rapport si versionnement retenu

### `PollutionDeclarationAnalysisSnapshot`

- Responsabilite : figer tous les parametres et resultats techniques d'une execution d'analyse.
- Champs principaux :
  - `id`
  - `declaration_id`
  - `input_payload`
  - `topology_payload`
  - `matrix_payload`
  - `recommendation_payload`
  - `matrix_version`
  - `topology_engine_version`
  - `recommendation_engine_version`
  - `executed_at`
  - `executed_by`
- Liens :
  - plusieurs snapshots possibles pour une declaration
  - 1 snapshot peut alimenter 1 evaluation
  - permet de ne jamais ecraser silencieusement un resultat precedent

## 5. Service backend cible

Le service central recommande est :

- `backend/app/services/declaration_pollution_service.py`

### Responsabilites

Ce service doit :
- creer une declaration ;
- valider les preconditions ;
- changer le statut ;
- lancer l'analyse ;
- appeler le moteur topologique ;
- appeler la bibliotheque matrice ;
- appeler le moteur recommandation ;
- historiser le resultat ;
- preparer la reponse dashboard ;
- preparer le rapport.

### Positionnement architectural

Ce service ne doit pas :
- contenir la logique algorithmique topologique ;
- embarquer la matrice en dur dans le controller ;
- calculer les recommandations directement dans la couche API ;
- deleguer la logique de workflow au frontend.

Il doit etre la couche d'orchestration metier backend entre :
- les endpoints API ;
- les modeles de workflow ;
- les moteurs existants ;
- les futurs objets de restitution.

## 6. Orchestration d'analyse

Le pipeline backend cible est :

1. charger la declaration ;
2. verifier le statut ;
3. valider les champs obligatoires ;
4. passer a `ANALYSE_EN_COURS` ;
5. appeler le moteur topologique ;
6. verifier le parcours jusqu'a Barrage de Garde ;
7. appeler le moteur matrice `NH4` ;
8. evaluer le risque ;
9. generer des recommandations si necessaire ;
10. enregistrer un snapshot ;
11. passer a `RISQUE_FAIBLE` ou `RISQUE_ELEVE` via `ANALYSE_TERMINEE` ;
12. retourner le resultat dashboard.

### Lecture backend recommandee

- Les etapes `1` a `4` relevent du workflow et du controle metier.
- Les etapes `5` et `6` relevent de la consommation du moteur topologique existant.
- Les etapes `7` et `8` relevent de la bibliotheque matrice et de la qualification du resultat.
- L'etape `9` releve du moteur recommandation.
- Les etapes `10` a `12` relevent de la tracabilite et de la restitution.

### Sequence d'etats recommandee

- `PRET_A_ANALYSER` -> `ANALYSE_EN_COURS`
- `ANALYSE_EN_COURS` -> `ANALYSE_TERMINEE`
- `ANALYSE_TERMINEE` -> `RISQUE_FAIBLE` ou `RISQUE_ELEVE`
- `RISQUE_ELEVE` -> `RECOMMANDATION_PROPOSEE` si recommandations generees

En cas d'echec :

- `ANALYSE_EN_COURS` -> `ERREUR_ANALYSE`

## 7. Integration avec moteurs existants

Les moteurs suivants doivent etre consommes sans reecriture.

### `propagation_pollution_service.py`

- Role : moteur topologique et de propagation deja disponible.
- Entree attendue : point source, eventuellement rayon de snap, contraintes de parcours, parametres de simulation MVP.
- Sortie attendue : point snappe, parcours aval, longueur, stations et barrages atteints, diagnostic de connectivite.
- Limite : logique topologique utile mais non suffisante pour la matrice scientifique cible.

### `propagation_recommendations.py`

- Role : recommandations derivees d'un scenario de propagation.
- Entree attendue : resultat de propagation ou objets impacts.
- Sortie attendue : recommandations contextualisees par scenario.
- Limite : pas encore declaration-centric a lui seul.

### `recommendations/engine.py`

- Role : moteur de recommandations global du projet.
- Entree attendue : signaux de risque, KPI, alertes ou resultat consolide.
- Sortie attendue : recommandations metier de plus haut niveau.
- Limite : doit etre compose avec le workflow declaration, pas utilise comme substitut au moteur matrice.

### `pollution_campagnes_service.py`

- Role : acces aux campagnes et prelevements existants si besoin de contexte.
- Entree attendue : filtres par zone, site ou periode.
- Sortie attendue : donnees de campagnes et de prelevements.
- Limite : service de contexte, pas brique centrale du workflow declaration MVP.

### `map_business_service.py`

- Role : fourniture de couches ou d'objets cartographiques metier reutilisables.
- Entree attendue : filtres spatiaux ou objets metier.
- Sortie attendue : donnees de carte ou enrichissements geographiques.
- Limite : utile pour la restitution, pas pour la decision scientifique elle-meme.

## 8. Contrats internes

Les contrats internes conceptuels recommandes sont :

### `DeclarationInput`

- Contenu :
  - identite declaration
  - polluant
  - point
  - concentration rejet
  - debit rejet
  - commentaire
- Usage : entree principale de creation ou mise a jour du dossier.

### `HydrologyInput`

- Contenu :
  - `QSebou_m3_s`
  - `QInnaouen_m3_s`
  - `QOuergha_m3_s`
  - date de reference
  - mode de saisie ou confirmation
- Usage : bloc d'entree hydrologique transmis au moteur matrice.

### `TopologyResult`

- Contenu :
  - point snappe
  - parcours GeoJSON
  - longueur
  - stations detectees
  - barrage de garde atteint ou non
  - messages de diagnostic
- Usage : resultat du moteur topologique consomme par le service declaration.

### `MatrixEvaluationResult`

- Contenu :
  - concentrations de sortie
  - statut par station
  - statut global
  - indicateur hors domaine
  - niveau de confiance
  - version de matrice
- Usage : resultat scientifique porte par la bibliotheque matrice.

### `RecommendationResult`

- Contenu :
  - liste de recommandations
  - priorites
  - justification
  - version moteur
- Usage : bloc de restitution d'aide a la decision.

### `DeclarationEvaluationResponse`

- Contenu :
  - identite declaration
  - statut workflow
  - resultat topologique
  - resultat matrice
  - recommandations
  - liens rapport
  - avertissements et erreurs
- Usage : contrat backend principal du dashboard apres evaluation.

## 9. Gestion des erreurs backend

| Erreur | Code fonctionnel | Message utilisateur | Statut workflow resultant | Blocage ou avertissement |
|---|---|---|---|---|
| point manquant | `DECLARATION_POINT_REQUIRED` | Le point de declaration est obligatoire pour lancer l'analyse. | `BROUILLON` ou `PRET_A_ANALYSER` selon contexte | blocage |
| point hors reseau | `TOPOLOGY_POINT_OFF_NETWORK` | Le point declare ne peut pas etre raccorde au reseau hydrologique. | `ERREUR_ANALYSE` | blocage |
| parcours non trouve | `TOPOLOGY_PATH_NOT_FOUND` | Aucun parcours aval exploitable n'a ete trouve. | `ERREUR_ANALYSE` | blocage |
| Garde non atteint | `TOPOLOGY_GARDE_NOT_REACHED` | Le parcours n'atteint pas le Barrage de Garde dans le perimetre MVP. | `ERREUR_ANALYSE` | blocage |
| Sidi Allal Tazi non detecte | `TOPOLOGY_SAT_NOT_FOUND` | La station Sidi Allal Tazi n'a pas ete detectee sur le parcours. | `ERREUR_ANALYSE` | blocage |
| matrice indisponible | `MATRIX_UNAVAILABLE` | La matrice scientifique est indisponible. | `ERREUR_ANALYSE` | blocage |
| valeurs hors domaine | `MATRIX_OUT_OF_DOMAIN` | Les valeurs saisies sortent du domaine couvert par la matrice MVP. | `ANALYSE_TERMINEE` si resultat limite exploitable, sinon `ERREUR_ANALYSE` | avertissement ou blocage selon politique retenue |
| moteur topologique indisponible | `TOPOLOGY_ENGINE_UNAVAILABLE` | Le moteur topologique est indisponible. | `ERREUR_ANALYSE` | blocage |
| erreur interne | `DECLARATION_ANALYSIS_INTERNAL_ERROR` | Une erreur interne a empeche l'analyse de se terminer. | `ERREUR_ANALYSE` | blocage |

## 10. Tracabilite

Le backend doit historiser systematiquement :
- l'historique des transitions ;
- l'horodatage ;
- l'acteur ;
- la raison du changement ;
- les anciennes et nouvelles valeurs critiques ;
- le snapshot d'analyse ;
- la version de matrice ;
- la version du moteur topologique ;
- les parametres saisis.

### Niveau minimal de tracabilite

Chaque execution d'analyse doit conserver :
- les entrees declaration ;
- les entrees hydrologiques ;
- le point snappe ;
- le parcours retenu ;
- les stations detectees ;
- les sorties de matrice ;
- les recommandations produites ;
- les avertissements et limites scientifiques.

### Regle structurante

Un resultat d'analyse ne doit jamais etre ecrase sans :
- creation d'un nouveau snapshot ;
- conservation de l'historique de statut ;
- rattachement explicite a une nouvelle execution.

## 11. Preparation LOT 3 API

Les endpoints cibles a deriver directement de ce backend sont :
- `POST /api/v1/pollution/declarations`
- `GET /api/v1/pollution/declarations`
- `GET /api/v1/pollution/declarations/{id}`
- `POST /api/v1/pollution/declarations/{id}/evaluate`
- `POST /api/v1/pollution/declarations/{id}/submit`
- `POST /api/v1/pollution/declarations/{id}/validate`
- `POST /api/v1/pollution/declarations/{id}/reject`
- `POST /api/v1/pollution/declarations/{id}/close`
- `GET /api/v1/pollution/declarations/{id}/report`

### Intention de chaque endpoint

- `create` : creer un dossier en brouillon.
- `list` / `detail` : consulter les declarations et leur etat.
- `evaluate` : declencher le pipeline backend d'analyse.
- `submit` : figer un brouillon comme pret a analyser.
- `validate` : enregistrer la validation metier.
- `reject` : rejeter un dossier.
- `close` : cloturer le dossier.
- `report` : recuperer la restitution finale.

## 12. Criteres de validation LOT 2

Le LOT 2 est valide si :
- les objets backend sont clairs ;
- les etats sont non ambigus ;
- le pipeline d'orchestration est complet ;
- les moteurs existants sont reutilises ;
- les erreurs sont definies ;
- le LOT 3 API peut etre derive directement.

## 13. Risques

Les principaux risques sont :
- logique metier trop dispersee ;
- frontend trop intelligent ;
- absence de snapshot ;
- absence de version matrice ;
- mauvaise separation topologie / matrice / recommandation ;
- statuts trop nombreux ou mal maitrises.

## 14. Recommandations

Les recommandations structurantes sont :
- faire du backend la source de verite du workflow ;
- garder le frontend comme couche de saisie et de restitution ;
- rendre les snapshots obligatoires ;
- versionner les matrices ;
- ne jamais ecraser un resultat sans historiser ;
- garder le moteur matrice independant du dashboard ;
- conserver l'orchestration dans un service backend unique et explicite.
