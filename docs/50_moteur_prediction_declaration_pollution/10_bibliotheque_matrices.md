# 10 - Bibliotheque de matrices

## Mise a jour MATRIX_V1

Statut : `MATRIX_V1_READY_AVEC_RESERVES`

La matrice NH4 est desormais convertie en ressource backend versionnee :

```text
backend/app/resources/matrices/nh4_dar_el_arssa_v1.csv
```

Metadonnees :

```text
matrix_id = NH4_DAR_EL_ARSSA
matrix_version = 1.0.0
scenario_count = 1575
sufficient_count = 1188
insufficient_count = 387
```

Le moteur utilise d'abord `EXACT_MATCH`, puis un fallback `NEAREST_NEIGHBOR` controle si la valeur reste dans le domaine. L'interpolation scientifique multidimensionnelle reste a valider.

## 1. Objectif

La bibliotheque de matrices sert a transformer les entrees hydrologiques et de rejet en concentrations prevues aux stations de controle.

Dans le workflow Declaration Pollution, elle constitue la brique scientifique qui :
- recoit les variables d'entree du dossier ;
- applique la matrice metier appropriee ;
- retourne des concentrations de sortie ;
- produit un statut scientifique exploitable par le backend.

## 2. Positionnement architectural

La separation cible reste la suivante :
- dashboard = saisie et restitution ;
- backend declaration = orchestration ;
- moteur topologique = parcours ;
- bibliotheque matrices = concentration / statut ;
- moteur recommandation = actions.

### Regle structurante

Le dashboard ne porte aucune logique de matrice. Le backend declaration appelle une bibliotheque de matrices independante, versionnee et tracable.

## 3. Cas MVP couvert

Le cas MVP couvert est :
- polluant : `NH4` ;
- point source matrice NH4 : secteur Dar El Arssa, localisation exacte a valider ;
- stations de controle : `Sidi Allal Tazi`, `Barrage de Garde` ;
- entrees :
  - `Crejet_mg_L`
  - `QRejet_m3_s`
  - `QSebou_m3_s`
  - `QInnaouen_m3_s`
  - `QOuergha_m3_s`
- sorties :
  - `C_SidiAllalTazi_mg_L`
  - `C_BgGarde_mg_L`
  - `Statut`

### Limite MVP

Le MVP couvre une matrice declaration-centric unique. Les futures extensions multi-polluants ou multi-points doivent reutiliser la meme architecture, sans hardcoder `NH4` dans le dashboard.

## 4. Statut scientifique du document

Statut du present document : `PROVISOIRE`.

### Etat de validation

- la matrice est declaree par l'equipe metier ;
- la lecture Excel reste a confirmer ;
- le nombre de lignes, colonnes, min/max et valeurs manquantes sont a valider ;
- il ne faut pas extrapoler hors domaine sans regle validee.

### Consequence de conception

La structure de bibliotheque peut etre definie maintenant, mais :
- aucune statistique de couverture ne doit etre inventee ;
- aucun domaine de validite chiffre ne doit etre affirme sans lecture read-only de l'Excel ;
- toute logique de min/max ou d'interpolation reste provisoire tant que la matrice source n'est pas relue.

## 5. Concepts de donnees

### `MatrixDefinition`

- Role : decrire une matrice exploitable comme actif scientifique.
- Champs principaux :
  - `matrix_id`
  - `matrix_version`
  - `pollutant_code`
  - `source_point_id`
  - `source_point_label`
  - `model_source`
  - `input_variables`
  - `output_variables`
  - `validity_domain`
  - `validation_status`
- Lien avec les autres concepts :
  - contient plusieurs scenarios ;
  - reference une version ;
  - expose un domaine de validite.

### `MatrixScenario`

- Role : representer une ligne ou combinaison de reference dans la matrice.
- Champs principaux :
  - `scenario_id`
  - `matrix_id`
  - `input_vector`
  - `output_vector`
  - `scenario_metadata`
- Lien avec les autres concepts :
  - appartient a une `MatrixDefinition` ;
  - alimente la recherche de scenario ;
  - sert de base a l'evaluation.

### `MatrixInputVector`

- Role : encapsuler les entrees necessaires a l'evaluation.
- Champs principaux :
  - `Crejet_mg_L`
  - `QRejet_m3_s`
  - `QSebou_m3_s`
  - `QInnaouen_m3_s`
  - `QOuergha_m3_s`
- Lien avec les autres concepts :
  - compare au domaine de validite ;
  - utilise pour rechercher un scenario ;
  - historise dans le snapshot.

### `MatrixOutputVector`

- Role : encapsuler les sorties calculees par la matrice.
- Champs principaux :
  - `C_SidiAllalTazi_mg_L`
  - `C_BgGarde_mg_L`
  - `statut_sidi_allal_tazi`
  - `statut_bg_garde`
  - `statut_global`
- Lien avec les autres concepts :
  - produit par un scenario ou une methode d'evaluation ;
  - alimente le contrat `MatrixEvaluationResult`.

### `MatrixEvaluationResult`

- Role : resultat scientifique consolide retourne au backend declaration.
- Champs principaux :
  - `matrix_id`
  - `matrix_version`
  - `pollutant`
  - `input_vector`
  - `output_vector`
  - `out_of_domain`
  - `confidence_level`
  - `method_used`
  - `warnings`
- Lien avec les autres concepts :
  - depend d'une `MatrixDefinition` ;
  - utilise un `MatrixInputVector` ;
  - produit un `MatrixOutputVector` ;
  - est historise dans `AnalysisSnapshot`.

### `MatrixVersion`

- Role : tracer les evolutions d'une matrice.
- Champs principaux :
  - `matrix_version`
  - `generated_at`
  - `validated_by`
  - `validation_status`
  - `change_note`
- Lien avec les autres concepts :
  - rattachee a une `MatrixDefinition` ;
  - referencee dans chaque evaluation et snapshot.

### `MatrixValidityDomain`

- Role : definir le domaine d'usage autorise de la matrice.
- Champs principaux :
  - `variable_ranges`
  - `allowed_values`
  - `boundary_rules`
  - `limitations`
- Lien avec les autres concepts :
  - rattache a `MatrixDefinition` ;
  - controle l'acceptation ou le rejet d'un `MatrixInputVector`.

## 6. Organisation de la bibliotheque

La bibliotheque doit pouvoir organiser plusieurs matrices futures :
- par polluant ;
- par point de rejet ;
- par version ;
- par modele source ;
- par date de generation ;
- par domaine de validite.

### Structure logique recommandee

- niveau 1 : `pollutant_code`
- niveau 2 : `source_point_id`
- niveau 3 : `matrix_version`
- niveau 4 : artefacts associes
  - definition
  - scenarios
  - metadonnees
  - domaine de validite
  - limitations

### Intention

Cette structure doit permettre :
- d'ajouter un autre polluant sans casser `NH4` ;
- d'ajouter un autre point de rejet sans dupliquer le code d'evaluation ;
- de versionner une correction scientifique sans ecraser les versions precedentes.

## 7. Metadonnees obligatoires

Les metadonnees obligatoires a porter par chaque matrice sont :
- `matrix_id`
- `matrix_version`
- `pollutant_code`
- `source_point_id`
- `source_point_label`
- `model_source`
- `scenario_count`
- `generated_at`
- `validated_by`
- `validation_status`
- `input_variables`
- `output_variables`
- `validity_domain`
- `limitations`

### Usage

Ces metadonnees servent a :
- tracer la source scientifique ;
- connaitre le perimetre d'usage ;
- exposer au dashboard et au rapport les limites de la matrice ;
- rattacher chaque evaluation a une version stable.

## 8. Domaine de validite

Le domaine de validite doit decrire :
- les plages min/max a calculer apres lecture Excel ;
- les valeurs autorisees ;
- les limites d'usage ;
- le comportement si une entree est hors domaine.

### Regle MVP

Si une entree est hors domaine, l'API doit retourner `MATRIX_OUT_OF_DOMAIN`.

### Statut provisoire

A ce stade :
- les min/max numeriques ne sont pas confirmes ;
- la liste exacte des valeurs ou pas de discretisation n'est pas confirmee ;
- le domaine de validite doit rester declaratif jusqu'a lecture read-only de la matrice source.

## 9. Recherche de scenario

La recherche de scenario doit pouvoir evoluer par niveaux :
- recherche exacte ;
- recherche du scenario le plus proche ;
- interpolation multidimensionnelle future ;
- interdiction d'extrapolation non controlee.

### Strategie MVP recommandee

- commencer par une recherche exacte si la matrice est discretisee ;
- ajouter ensuite un nearest-neighbor controle si la validation metier l'accepte ;
- ne pas extrapoler si la combinaison sort du domaine documente.

## 10. Interpolation

### Statut MVP

Le MVP peut commencer par :
- recherche exacte ;
ou
- nearest-neighbor controle.

### Evolution cible

L'evolution possible est :
- interpolation multidimensionnelle.

### Gardes-fous

- il faut tester la precision et la stabilite ;
- il ne faut pas presenter l'interpolation comme une verite scientifique sans validation ;
- toute methode d'interpolation doit etre versionnee et exposee dans `method_used`.

## 11. Evaluation du statut

L'evaluation doit distinguer :
- statut par station ;
- statut global ;
- relation avec le seuil `NH4` ;
- distinction entre statut de matrice et risque metier.

### Regle de lecture

- `statut_sidi_allal_tazi` et `statut_bg_garde` expriment une lecture scientifique locale ;
- `statut_global` synthétise la matrice ;
- le `risque metier` reste une couche d'orchestration backend et non un champ natif de la matrice ;
- le seuil `NH4` exact reste a valider par le metier.

## 12. Contrat MatrixEvaluationResult

Le contrat cible recommande est :

- `matrix_id`
- `matrix_version`
- `pollutant`
- `input_vector`
- `output_vector`
- `C_SidiAllalTazi_mg_L`
- `C_BgGarde_mg_L`
- `statut_sidi_allal_tazi`
- `statut_bg_garde`
- `statut_global`
- `out_of_domain`
- `confidence_level`
- `method_used`
- `warnings`

### Intention du contrat

Ce contrat doit permettre :
- au backend de piloter la suite du workflow ;
- a l'API d'exposer un `matrix_result` stable ;
- au snapshot de conserver la version et la methode exactes ;
- au dashboard d'afficher concentrations, statuts et limites scientifiques.

## 13. Integration avec AnalysisSnapshot

Chaque evaluation de matrice doit stocker dans `AnalysisSnapshot` :
- `input_payload` ;
- `matrix_payload` ;
- `matrix_version` ;
- `method_used` ;
- `warnings` ;
- les limites scientifiques.

### Regle structurante

Une reevaluation ne doit jamais ecraser silencieusement :
- les entrees utilisees ;
- la version de matrice ;
- la methode employee ;
- les avertissements ou limites de validite.

## 14. Erreurs liees a la matrice

| Erreur | Cause | Consequence workflow | Message utilisateur | Action recommandee |
|---|---|---|---|---|
| `MATRIX_UNAVAILABLE` | matrice absente ou non chargeable | passage en `ERREUR_ANALYSE` | La matrice scientifique est indisponible. | reessayer plus tard ou verifier la source |
| `MATRIX_OUT_OF_DOMAIN` | entrees hors domaine de validite | `ANALYSE_TERMINEE` avec limite ou `ERREUR_ANALYSE` selon politique | Les valeurs saisies sortent du domaine couvert par la matrice MVP. | corriger les valeurs ou demander validation metier |
| `MATRIX_VARIABLE_MISSING` | une variable d'entree requise est absente | blocage avant evaluation | Une variable obligatoire pour l'evaluation de la matrice est manquante. | completer les donnees d'entree |
| `MATRIX_VERSION_NOT_FOUND` | version demandee introuvable | passage en `ERREUR_ANALYSE` | La version de matrice demandee est introuvable. | verifier la configuration ou utiliser une version valide |
| `MATRIX_INVALID_FORMAT` | structure de matrice invalide ou colonnes critiques absentes | passage en `ERREUR_ANALYSE` | La structure de la matrice est invalide. | verifier l'artefact source et son schema |
| `MATRIX_EVALUATION_FAILED` | echec de calcul ou de recherche de scenario | passage en `ERREUR_ANALYSE` | L'evaluation de la matrice a echoue. | relancer puis verifier la matrice et les entrees |

## 15. Tests de validation

Les tests de validation attendus sont :
- lecture matrice ;
- colonnes obligatoires presentes ;
- aucune colonne critique manquante ;
- recherche scenario exact ;
- comportement hors domaine ;
- calcul statut ;
- conservation `matrix_version` dans snapshot.

### Resultats attendus

- la matrice doit se charger dans un format controle ;
- les variables d'entree et de sortie doivent etre reconnues sans ambiguite ;
- une evaluation exacte doit produire un resultat stable ;
- un cas hors domaine doit remonter `MATRIX_OUT_OF_DOMAIN` ;
- chaque evaluation doit historiser sa version et sa methode.

## 16. Risques

Les principaux risques sont :
- Excel non stabilise ;
- colonnes renommees ;
- unites ambigues ;
- extrapolation abusive ;
- interpolation non validee ;
- versionnement absent ;
- confusion entre statut scientifique et decision metier.

### Lecture de risque

- un Excel non stabilise rend les resultats non reproductibles ;
- des colonnes renommees cassent silencieusement le mapping ;
- des unites floues invalident toute interpretation ;
- l'absence de versionning empeche l'audit des evaluations ;
- la confusion entre matrice et decision metier fausse le role du backend.

## 17. Recommandations

Les recommandations de mise en oeuvre sont :
- commencer simple ;
- charger la matrice dans un format controle `JSON` / `CSV` / `SQL` ;
- versionner chaque matrice ;
- separer lecture matrice et evaluation ;
- journaliser chaque evaluation ;
- afficher les limites scientifiques au dashboard.

### Recommandations complementaires

- ne pas lire directement un Excel brut a chaque appel d'evaluation ;
- isoler un composant de normalisation de la matrice source ;
- rattacher toute evaluation a une `matrix_version` immuable ;
- garder la bibliotheque de matrices independante du dashboard et du moteur topologique.

## 18. Prochain lot

Le prochain lot recommande est :

- `LOT 8 - Moteur de recommandation Declaration Pollution`

La bibliotheque de matrices doit alors devenir l'entree scientifique stabilisee du moteur de recommandation, sans confusion entre concentration calculee et action proposee.
