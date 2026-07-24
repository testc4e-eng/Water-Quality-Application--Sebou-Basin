# 08 - API Declaration Pollution

## 1. Objectif

L'API Declaration Pollution a pour role d'exposer au frontend :
- le workflow ;
- les transitions ;
- l'evaluation ;
- les recommandations ;
- le rapport.

L'API ne doit pas exposer un simple CRUD. Elle doit fournir un contrat metier stable pour que le Dashboard Declaration Pollution reste une couche de saisie, d'orchestration visuelle et de restitution.

## 2. Principes API

Les principes structurants sont :
- le backend est la source de verite ;
- le frontend est un simple consommateur ;
- aucun calcul metier ne doit vivre dans le frontend ;
- les endpoints doivent etre coherents avec le workflow ;
- les erreurs doivent etre explicites ;
- les snapshots ne doivent jamais etre ecrases ;
- les contrats JSON doivent etre stables.

### Consequences pratiques

- le frontend n'invente pas les statuts ;
- le frontend ne reconstruit pas le risque a partir de calculs locaux ;
- le backend retourne un contrat unique d'evaluation ;
- les transitions invalides doivent etre bloquees par l'API ;
- les resultats d'analyse doivent etre rattaches a un `snapshot_id`.

## 3. Endpoints MVP

### `POST /api/v1/pollution/declarations`

- Objectif : creer une declaration en `BROUILLON`.
- Methode : `POST`
- Payload d'entree : `PollutionDeclarationCreateRequest`
- Reponse attendue : `PollutionDeclarationResponse`
- Statuts workflow autorises : creation initiale uniquement
- Erreurs possibles :
  - `DECLARATION_INPUT_REQUIRED`
  - `DECLARATION_POINT_REQUIRED`

### `GET /api/v1/pollution/declarations`

- Objectif : lister les declarations avec leur statut courant et leurs metadonnees principales.
- Methode : `GET`
- Payload d'entree : aucun, hors filtres de requete futurs
- Reponse attendue : `PollutionDeclarationListResponse`
- Statuts workflow autorises : tous
- Erreurs possibles :
  - `DECLARATION_ANALYSIS_INTERNAL_ERROR` en cas d'erreur serveur inattendue

### `GET /api/v1/pollution/declarations/{id}`

- Objectif : recuperer le detail d'une declaration.
- Methode : `GET`
- Payload d'entree : identifiant dans le chemin
- Reponse attendue : `PollutionDeclarationResponse`
- Statuts workflow autorises : tous
- Erreurs possibles :
  - `DECLARATION_NOT_FOUND`

### `POST /api/v1/pollution/declarations/{id}/submit`

- Objectif : faire passer une declaration de `BROUILLON` a `PRET_A_ANALYSER`.
- Methode : `POST`
- Payload d'entree : `PollutionDeclarationTransitionRequest`
- Reponse attendue : `PollutionDeclarationResponse`
- Statuts workflow autorises : `BROUILLON`
- Erreurs possibles :
  - `DECLARATION_NOT_FOUND`
  - `INVALID_TRANSITION`
  - `DECLARATION_POINT_REQUIRED`
  - `DECLARATION_INPUT_REQUIRED`

### `POST /api/v1/pollution/declarations/{id}/evaluate`

- Objectif : lancer l'analyse backend complete et produire un resultat unique consommable par le dashboard.
- Methode : `POST`
- Payload d'entree : `PollutionDeclarationEvaluateRequest`
- Reponse attendue : `PollutionDeclarationEvaluationResponse`
- Statuts workflow autorises : `PRET_A_ANALYSER`, `RISQUE_FAIBLE`, `RISQUE_ELEVE`, `RECOMMANDATION_PROPOSEE`, `ERREUR_ANALYSE`
- Erreurs possibles :
  - `DECLARATION_NOT_FOUND`
  - `INVALID_TRANSITION`
  - `DECLARATION_POINT_REQUIRED`
  - `DECLARATION_INPUT_REQUIRED`
  - `TOPOLOGY_POINT_OFF_NETWORK`
  - `TOPOLOGY_PATH_NOT_FOUND`
  - `TOPOLOGY_GARDE_NOT_REACHED`
  - `TOPOLOGY_SAT_NOT_FOUND`
  - `MATRIX_UNAVAILABLE`
  - `MATRIX_OUT_OF_DOMAIN`
  - `TOPOLOGY_ENGINE_UNAVAILABLE`
  - `DECLARATION_ANALYSIS_INTERNAL_ERROR`

### `POST /api/v1/pollution/declarations/{id}/validate`

- Objectif : valider metier un dossier analyse.
- Methode : `POST`
- Payload d'entree : `PollutionDeclarationTransitionRequest`
- Reponse attendue : `PollutionDeclarationResponse`
- Statuts workflow autorises : `RISQUE_FAIBLE`, `RECOMMANDATION_PROPOSEE`
- Erreurs possibles :
  - `DECLARATION_NOT_FOUND`
  - `INVALID_TRANSITION`

### `POST /api/v1/pollution/declarations/{id}/reject`

- Objectif : rejeter une declaration ou un resultat.
- Methode : `POST`
- Payload d'entree : `PollutionDeclarationTransitionRequest`
- Reponse attendue : `PollutionDeclarationResponse`
- Statuts workflow autorises : `BROUILLON`, `PRET_A_ANALYSER`, `RISQUE_ELEVE`, `RECOMMANDATION_PROPOSEE`, `ERREUR_ANALYSE`
- Erreurs possibles :
  - `DECLARATION_NOT_FOUND`
  - `INVALID_TRANSITION`

### `POST /api/v1/pollution/declarations/{id}/close`

- Objectif : cloturer un dossier valide.
- Methode : `POST`
- Payload d'entree : `PollutionDeclarationTransitionRequest`
- Reponse attendue : `PollutionDeclarationResponse`
- Statuts workflow autorises : `VALIDE_METIER`
- Erreurs possibles :
  - `DECLARATION_NOT_FOUND`
  - `INVALID_TRANSITION`

### `GET /api/v1/pollution/declarations/{id}/report`

- Objectif : recuperer le rapport associe a la declaration.
- Methode : `GET`
- Payload d'entree : identifiant dans le chemin
- Reponse attendue : `PollutionDeclarationReportResponse`
- Statuts workflow autorises : `RISQUE_FAIBLE`, `RECOMMANDATION_PROPOSEE`, `VALIDE_METIER`, `CLOTURE`
- Erreurs possibles :
  - `DECLARATION_NOT_FOUND`
  - `DECLARATION_ANALYSIS_INTERNAL_ERROR`

## 4. Contrats JSON principaux

### `PollutionDeclarationCreateRequest`

- Usage : creation d'une declaration en brouillon.
- Champs conceptuels :
  - `date_declaration`
  - `point_declaration`
  - `polluant`
  - `Crejet_mg_L`
  - `QRejet_m3_s`
  - `QSebou_m3_s`
  - `QInnaouen_m3_s`
  - `QOuergha_m3_s`
  - `commentaire`

### `PollutionDeclarationUpdateRequest`

- Usage : mise a jour d'un brouillon ou d'une declaration editable.
- Champs conceptuels :
  - tous les champs du create request
  - `status` non modifiable directement
  - `version` ou `updated_at` futur pour gestion de concurrence si besoin

### `PollutionDeclarationResponse`

- Usage : representation standard d'une declaration.
- Champs conceptuels :
  - `declaration_id`
  - `reference`
  - `status`
  - `date_declaration`
  - `point_declaration`
  - `polluant`
  - `Crejet_mg_L`
  - `QRejet_m3_s`
  - `QSebou_m3_s`
  - `QInnaouen_m3_s`
  - `QOuergha_m3_s`
  - `commentaire`
  - `current_snapshot_id`
  - `report_available`
  - `created_at`
  - `updated_at`

### `PollutionDeclarationListResponse`

- Usage : liste paginable de declarations.
- Champs conceptuels :
  - `items`
  - `total`
  - `page`
  - `page_size`

### `PollutionDeclarationEvaluateRequest`

- Usage : declencher une analyse depuis l'etat enregistre, avec overrides controles si necessaire.
- Champs conceptuels :
  - `use_saved_values`
  - `override_hydrology`
  - `override_discharge`
  - `commentaire_execution`
  - `requested_by`

### `PollutionDeclarationEvaluationResponse`

- Usage : contrat unique de resultat pour le dashboard.
- Champs conceptuels :
  - `declaration_id`
  - `status`
  - `topology_result`
  - `matrix_result`
  - `risk_result`
  - `recommendations`
  - `warnings`
  - `errors`
  - `snapshot_id`
  - `report_available`

### `PollutionDeclarationTransitionRequest`

- Usage : transition explicite de workflow.
- Champs conceptuels :
  - `reason`
  - `commentaire`
  - `requested_by`

### `PollutionDeclarationReportResponse`

- Usage : restitution de rapport.
- Champs conceptuels :
  - `declaration_id`
  - `status`
  - `report_id`
  - `generated_at`
  - `report_payload`
  - `snapshot_id`

### `ApiErrorResponse`

- Usage : format d'erreur stable pour tous les endpoints.
- Champs conceptuels :
  - `code`
  - `message`
  - `http_status`
  - `workflow_status`
  - `details`
  - `user_action`
  - `trace_id`

## 5. Payload creation declaration

Le payload de creation doit inclure :
- `date_declaration`
- `point_declaration`
- `polluant`
- `Crejet_mg_L`
- `QRejet_m3_s`
- `QSebou_m3_s`
- `QInnaouen_m3_s`
- `QOuergha_m3_s`
- `commentaire`

### Champs obligatoires MVP

Les champs obligatoires MVP recommandes sont :
- `date_declaration`
- `point_declaration`
- `polluant`
- `Crejet_mg_L`
- `QRejet_m3_s`
- `QSebou_m3_s`
- `QInnaouen_m3_s`
- `QOuergha_m3_s`

`commentaire` reste optionnel.

### Lecture metier recommandee

- le create endpoint peut accepter un brouillon partiel si la politique UX le demande ;
- le submit endpoint reste responsable du passage a `PRET_A_ANALYSER` ;
- l'API doit toutefois savoir refuser une creation totalement vide.

## 6. Payload evaluation

L'API doit pouvoir lancer l'analyse :
- soit depuis les donnees deja enregistrees ;
- soit avec un override controle des debits ou valeurs ;
- jamais sans snapshot.

### Regles d'evaluation

- si `use_saved_values = true`, l'analyse consomme les valeurs persistantes de la declaration ;
- si un override est fourni, il doit etre encapsule dans le snapshot d'analyse ;
- les overrides ne doivent pas ecraser silencieusement les valeurs du dossier source ;
- chaque execution doit produire un nouveau `snapshot_id`.

### Exemple conceptuel de structure

```json
{
  "use_saved_values": true,
  "override_hydrology": {
    "QSebou_m3_s": 120.0,
    "QInnaouen_m3_s": 15.0,
    "QOuergha_m3_s": 42.0
  },
  "override_discharge": {
    "Crejet_mg_L": 8.5,
    "QRejet_m3_s": 0.75
  },
  "commentaire_execution": "Recalcul avec debits confirmes",
  "requested_by": "expert_metier"
}
```

## 7. Reponse d'evaluation

La reponse d'evaluation doit inclure :
- `declaration_id`
- `statut workflow`
- `topology_result`
- `matrix_result`
- `risk_result`
- `recommendations`
- `warnings`
- `errors`
- `snapshot_id`
- `report_available`

### Intention

Le frontend doit pouvoir construire l'ecran de resultat sans recalcul metier local et sans recomposer lui-meme le workflow.

## 8. Topology result

Le bloc `topology_result` doit definir :
- `snapped_point`
- `parcours_geojson`
- `longueur_km`
- `stations_detectees`
- `sidi_allal_tazi_detectee`
- `barrage_garde_atteint`
- `diagnostic_messages`

### Usage frontend

Ce bloc alimente :
- la carte ;
- les verifications de parcours ;
- la restitution des points de controle atteints ;
- les avertissements de connectivite.

## 9. Matrix result

Le bloc `matrix_result` doit definir :
- `matrix_id`
- `matrix_version`
- `pollutant`
- `C_SidiAllalTazi_mg_L`
- `C_BgGarde_mg_L`
- `statut_sidi_allal_tazi`
- `statut_bg_garde`
- `statut_global`
- `out_of_domain`
- `confidence_level`

### Usage frontend

Ce bloc alimente :
- l'affichage des concentrations ;
- la lecture du statut par station ;
- le statut global ;
- la communication des limites scientifiques.

## 10. Recommendations

Chaque element du bloc `recommendations` doit definir :
- `recommendation_id`
- `type`
- `title`
- `description`
- `axis`
- `increase_m3_s`
- `priority`
- `confidence`
- `justification`

### Intention

Le contrat doit permettre de restituer :
- des recommandations quantitatives ou qualitatives ;
- leur priorite ;
- leur niveau de confiance ;
- leur justification tracable.

## 11. Erreurs API

| Code | HTTP | Message | Statut workflow | Action utilisateur |
|---|---|---|---|---|
| `DECLARATION_POINT_REQUIRED` | `400` | Le point de declaration est obligatoire. | `BROUILLON` ou `PRET_A_ANALYSER` | saisir ou corriger le point |
| `DECLARATION_INPUT_REQUIRED` | `400` | Les donnees obligatoires de declaration sont incompletes. | `BROUILLON` ou `PRET_A_ANALYSER` | completer les champs requis |
| `TOPOLOGY_POINT_OFF_NETWORK` | `422` | Le point declare ne peut pas etre raccorde au reseau hydrologique. | `ERREUR_ANALYSE` | repositionner le point |
| `TOPOLOGY_PATH_NOT_FOUND` | `422` | Aucun parcours aval exploitable n'a ete trouve. | `ERREUR_ANALYSE` | verifier le point et relancer |
| `TOPOLOGY_GARDE_NOT_REACHED` | `422` | Le parcours n'atteint pas le Barrage de Garde dans le perimetre MVP. | `ERREUR_ANALYSE` | verifier le point ou sortir du prototype MVP |
| `TOPOLOGY_SAT_NOT_FOUND` | `422` | La station Sidi Allal Tazi n'a pas ete detectee sur le parcours. | `ERREUR_ANALYSE` | verifier le point ou le referentiel |
| `MATRIX_UNAVAILABLE` | `503` | La matrice scientifique est indisponible. | `ERREUR_ANALYSE` | reessayer plus tard |
| `MATRIX_OUT_OF_DOMAIN` | `422` | Les valeurs saisies sortent du domaine couvert par la matrice MVP. | `ANALYSE_TERMINEE` ou `ERREUR_ANALYSE` | corriger les valeurs ou accepter la limite scientifique |
| `TOPOLOGY_ENGINE_UNAVAILABLE` | `503` | Le moteur topologique est indisponible. | `ERREUR_ANALYSE` | reessayer plus tard |
| `DECLARATION_ANALYSIS_INTERNAL_ERROR` | `500` | Une erreur interne a empeche l'analyse de se terminer. | `ERREUR_ANALYSE` | relancer puis signaler l'incident si besoin |
| `INVALID_TRANSITION` | `409` | La transition demandee n'est pas autorisee dans l'etat courant. | statut courant conserve | revoir l'action proposee |
| `DECLARATION_NOT_FOUND` | `404` | La declaration demandee est introuvable. | aucun | verifier l'identifiant |

## 12. Securite et droits MVP

Le MVP doit prevoir un modele simple compatible avec un futur RBAC.

### Declarant

- creer une declaration ;
- modifier un brouillon ;
- lancer l'analyse si autorise par la politique metier.

### Expert metier

- valider ;
- rejeter ;
- cloturer.

### Administrateur

- consulter ;
- gerer ;
- superviser.

### Ligne directrice

- ne pas implementer encore un RBAC complexe ;
- preparer les endpoints pour porter plus tard des controles de role coherents.

## 13. Compatibilite avec les endpoints existants

Les nouveaux endpoints doivent consommer ou orchestrer les briques existantes :
- `/api/v1/propagation/*`
- `/api/v1/pollution/*`
- `/api/v1/recommendations`
- `/api/v1/kpi/*`

### Regle de compatibilite

- ne pas casser l'existant ;
- ne pas dupliquer les moteurs deja exposes ;
- utiliser les services existants comme dependances de l'orchestrateur declaration ;
- reserver les nouveaux endpoints au workflow Declaration Pollution.

## 14. Criteres de validation LOT 3

Le lot est valide si :
- tous les endpoints MVP sont definis ;
- les payloads sont coherents avec le workflow ;
- l'evaluation retourne un contrat unique ;
- les erreurs sont explicites ;
- le frontend peut etre developpe sans deviner la logique metier.

## 15. Prochain lot

Le prochain lot recommande est :
- `LOT 6 - Integration moteur topologique`
ou
- `LOT 7 - Bibliotheque de matrices`

avant le frontend.

La sequence recommandee reste :
- topologie ;
- matrice ;
- recommandations ;
- frontend.

## Decisions restantes

Les decisions encore a arbitrer sont :
- niveau exact de creation de brouillon partiel au `POST /declarations` ;
- politique definitive des overrides dans `evaluate` ;
- format final du `report_payload` ;
- granularite exacte du bloc `risk_result` ;
- comportement final de `MATRIX_OUT_OF_DOMAIN` en simple avertissement ou blocage ;
- presence ou non d'un endpoint `PATCH /declarations/{id}` dans un lot futur.
