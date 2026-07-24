# 16 - Tests & validation Declaration Pollution

## 1. Objectif

Ce document definit la strategie de test du MVP Declaration Pollution avant implementation controlee.

Il a pour objectif de :
- figer les scenarios de test ;
- definir les criteres d'acceptation ;
- expliciter les cas bloquants ;
- preparer la recette developpeur, chef de projet et expert metier.

## 2. Perimetre de validation

Le perimetre de validation couvre :
- le workflow ;
- l'API ;
- la topologie ;
- la matrice ;
- la recommandation ;
- l'orchestration ;
- le frontend ;
- la carte ;
- le rapport.

### Regle de validation

Le MVP n'est pas valide si une seule de ces briques critiques casse la chaine d'execution de bout en bout.

## 3. Scenario nominal MVP

Le scenario nominal de reference est :
- point source matrice NH4 : secteur Dar El Arssa, localisation exacte a valider ;
- polluant : `NH4` ;
- creation declaration ;
- saisie `Crejet` / `QRejet` ;
- saisie `QSebou` / `QInnaouen` / `QOuergha` ;
- `submit` ;
- `evaluate` ;
- parcours vers `Garde` ;
- concentrations `SAT` / `Garde` ;
- statut ;
- recommandations si insuffisant ;
- affichage carte ;
- rapport.

### Resultat attendu

Le resultat nominal attendu est :
- une declaration exploitable ;
- un parcours topologique coherent ;
- une evaluation matricielle retournee ;
- un statut lisible ;
- des recommandations si necessaires ;
- une explication ;
- un snapshot ;
- une restitution dashboard complete.

## 4. Tests workflow

Les tests workflow a couvrir sont :
- `BROUILLON` -> `PRET_A_ANALYSER`
- `PRET_A_ANALYSER` -> `ANALYSE_EN_COURS`
- `ANALYSE_EN_COURS` -> `ANALYSE_TERMINEE`
- `ANALYSE_TERMINEE` -> `RISQUE_FAIBLE` / `RISQUE_ELEVE`
- `RISQUE_ELEVE` -> `RECOMMANDATION_PROPOSEE`
- validation / rejet / cloture

### Cas attendus

- transition autorisee avec donnees completes ;
- transition refusee si preconditions non satisfaites ;
- historique des transitions present ;
- statut courant toujours coherent avec la derniere action.

## 5. Tests API

### `POST /api/v1/pollution/declarations`

- Cas succes : creation d'un brouillon minimal acceptable.
- Cas erreur : payload vide ou point absent si la politique create l'interdit.
- Payload minimal : declaration MVP avec entrees requises.
- Reponse attendue : `PollutionDeclarationResponse`.
- Statut workflow attendu : `BROUILLON`.

### `GET /api/v1/pollution/declarations`

- Cas succes : liste retournee.
- Cas erreur : erreur serveur si indisponibilite interne.
- Payload minimal : aucun.
- Reponse attendue : `PollutionDeclarationListResponse`.
- Statut workflow attendu : tous.

### `GET /api/v1/pollution/declarations/{id}`

- Cas succes : detail d'une declaration existante.
- Cas erreur : `DECLARATION_NOT_FOUND`.
- Payload minimal : `id`.
- Reponse attendue : `PollutionDeclarationResponse`.
- Statut workflow attendu : tous.

### `POST /api/v1/pollution/declarations/{id}/submit`

- Cas succes : passage a `PRET_A_ANALYSER`.
- Cas erreur : `INVALID_TRANSITION`, `DECLARATION_POINT_REQUIRED`, `DECLARATION_INPUT_REQUIRED`.
- Payload minimal : `reason` ou payload transition minimal.
- Reponse attendue : `PollutionDeclarationResponse`.
- Statut workflow attendu : `PRET_A_ANALYSER`.

### `POST /api/v1/pollution/declarations/{id}/evaluate`

- Cas succes : reponse unique d'evaluation avec `snapshot_id`.
- Cas erreur : erreurs topologie, matrice ou transition invalide.
- Payload minimal : `use_saved_values = true`.
- Reponse attendue : `PollutionDeclarationEvaluationResponse`.
- Statut workflow attendu : `RISQUE_FAIBLE`, `RISQUE_ELEVE`, `RECOMMANDATION_PROPOSEE` ou `ERREUR_ANALYSE`.

### `POST /api/v1/pollution/declarations/{id}/validate`

- Cas succes : validation metier.
- Cas erreur : `INVALID_TRANSITION`, `DECLARATION_NOT_FOUND`.
- Payload minimal : raison de validation.
- Reponse attendue : `PollutionDeclarationResponse`.
- Statut workflow attendu : `VALIDE_METIER`.

### `POST /api/v1/pollution/declarations/{id}/reject`

- Cas succes : rejet explicite.
- Cas erreur : `INVALID_TRANSITION`, `DECLARATION_NOT_FOUND`.
- Payload minimal : motif de rejet.
- Reponse attendue : `PollutionDeclarationResponse`.
- Statut workflow attendu : `REJETE`.

### `POST /api/v1/pollution/declarations/{id}/close`

- Cas succes : cloture.
- Cas erreur : `INVALID_TRANSITION`, `DECLARATION_NOT_FOUND`.
- Payload minimal : motif de cloture si requis.
- Reponse attendue : `PollutionDeclarationResponse`.
- Statut workflow attendu : `CLOTURE`.

### `GET /api/v1/pollution/declarations/{id}/report`

- Cas succes : rapport accessible apres analyse exploitable ou validation.
- Cas erreur : `DECLARATION_NOT_FOUND`, erreur de generation de rapport.
- Payload minimal : `id`.
- Reponse attendue : `PollutionDeclarationReportResponse`.
- Statut workflow attendu : `RISQUE_FAIBLE`, `RECOMMANDATION_PROPOSEE`, `VALIDE_METIER` ou `CLOTURE`.

## 6. Tests topologie

Les tests topologie a couvrir sont :
- point valide ;
- point hors reseau ;
- snap trop eloigne ;
- parcours non trouve ;
- Garde non atteint ;
- SAT non detectee ;
- GeoJSON non vide.

### Resultats attendus

- un point valide produit un `TopologyResult` exploitable ;
- un point hors reseau remonte `TOPOLOGY_POINT_OFF_NETWORK` ;
- un snap trop eloigne produit au minimum un warning ;
- un parcours non trouve bloque l'analyse ;
- Garde non atteint bloque le MVP ;
- SAT non detectee bloque ou impose validation metier selon arbitrage retenu ;
- un cas nominal produit un `parcours_geojson` non vide.

## 7. Tests matrice

Les tests matrice a couvrir sont :
- colonnes obligatoires ;
- scenario exact ;
- hors domaine ;
- matrice indisponible ;
- version matrice conservee ;
- `method_used` renseigne.

### Resultats attendus

- les colonnes critiques de la matrice sont reconnues ;
- un scenario exact renvoie des sorties stables ;
- un hors domaine remonte `MATRIX_OUT_OF_DOMAIN` ;
- une matrice absente remonte `MATRIX_UNAVAILABLE` ;
- `matrix_version` est toujours stocke dans le snapshot ;
- `method_used` est toujours disponible dans `MatrixEvaluationResult`.

## 8. Tests recommandation

Les tests recommandation a couvrir sont :
- cas suffisant : pas de recommandation obligatoire ;
- cas insuffisant : top 3 recommandations ;
- aucun scenario faisable ;
- pas d'extrapolation ;
- `snapshot` / `matrix_version` conserves.

### Resultats attendus

- un cas `RISQUE_FAIBLE` peut ne retourner aucune recommandation obligatoire ;
- un cas `RISQUE_ELEVE` retourne une recommandation principale et des alternatives si disponibles ;
- aucun scenario faisable remonte `RECOMMENDATION_NO_FEASIBLE_SCENARIO` ou une alerte metier equivalente ;
- aucune recommandation ne sort du domaine valide ;
- chaque recommandation est rattachee a un `snapshot_id` et une `matrix_version`.

## 9. Tests frontend

Les tests frontend a couvrir sont :
- page chargee ;
- formulaire utilisable ;
- erreurs visibles ;
- analyse lancable ;
- resultat affiche ;
- recommandation affichee ;
- `explanation` affichee ;
- rapport visible.

### Resultats attendus

- la page declaration s'ouvre sans logique metier locale cachee ;
- la saisie MVP est possible ;
- les erreurs sont lisibles et actionnables ;
- le clic `lancer analyse` appelle le backend declaration ;
- les panneaux resultats / recommandations / explication se synchronisent sur la reponse `evaluate`.

## 10. Tests carte

Les tests carte a couvrir sont :
- point declare visible ;
- point snappe visible ;
- parcours visible ;
- SAT visible ;
- Garde visible ;
- warnings visibles ;
- pas de couleur concentration sur parcours.

### Resultats attendus

- la carte distingue le point declare du point snappe ;
- le parcours est visible sans surcharger la vue ;
- les stations de controle sont identifiables ;
- les warnings topologiques sont visibles ;
- aucune couleur de ligne ne laisse croire a une concentration continue.

## 11. Tests rapport

Les tests rapport a couvrir sont :
- rapport disponible apres analyse ;
- contient les entrees ;
- contient la topologie ;
- contient les concentrations ;
- contient les recommandations ;
- contient les limites ;
- contient `snapshot_id`.

### Resultats attendus

- le rapport est coherent avec la derniere evaluation active ;
- il trace les entrees ayant servi au calcul ;
- il explicite les limites scientifiques et operationnelles.

## 12. Criteres d'acceptation metier

| Critere | Attendu | Statut |
|---|---|---|
| Creation declaration | Une declaration peut etre creee et retrouvee | A valider |
| Complétion donnees MVP | Les champs obligatoires sont saisis et controles | A valider |
| Analyse | L'utilisateur peut lancer une analyse complete | A valider |
| Topologie | Le parcours vers Garde est visible sur le cas nominal | A valider |
| Matrice | Les concentrations `SAT` et `Garde` sont retournees | A valider |
| Statut | Le statut global est comprehensible | A valider |
| Recommandation | Une recommandation apparait si le risque est eleve | A valider |
| Explication | Le moteur explique pourquoi le dossier est suffisant ou insuffisant | A valider |
| Rapport | Le rapport est consultable ou generable | A valider |
| Validation humaine | Le systeme distingue recommandation et decision | A valider |

## 13. Criteres techniques

Les criteres techniques obligatoires sont :
- aucun calcul metier dans le frontend ;
- snapshot obligatoire ;
- erreurs fonctionnelles ;
- contrats API stables ;
- separation des moteurs respectee.

### Lecture technique

- la topologie reste dans le moteur topologique ;
- la concentration reste dans la bibliotheque de matrices ;
- la recommandation reste dans le moteur de recommandation ;
- l'orchestrateur reste la colonne vertebrale du runtime.

## 14. Cas de non-validation

Les cas de non-validation sont :
- point invalide ;
- matrice absente ;
- hors domaine ;
- resultat incoherent ;
- recommandation absente alors que le risque est eleve ;
- carte non synchronisee avec le resultat.

### Effet

Si un de ces cas apparait sans gestion correcte :
- le MVP ne doit pas etre presente comme valide ;
- l'anomalie doit etre classee bloquante ou majeure ;
- la demonstration doit etre restreinte au perimetre fonctionnel encore fiable.

## 15. Plan de recette

### Recette developpeur

- verifier chaque endpoint ;
- verifier les transitions ;
- verifier les erreurs fonctionnelles ;
- verifier la persistance du snapshot ;
- verifier la cohérence carte / resultats / recommandations.

### Recette chef de projet

- rejouer le scenario nominal de bout en bout ;
- verifier la lisibilite du dashboard ;
- verifier que l'ecran reste demonstrable ;
- verifier que le rapport et l'explication sont compréhensibles.

### Recette expert metier

- verifier la coherence des statuts ;
- verifier les concentrations retournees ;
- verifier la qualite des recommandations ;
- verifier les limites scientifiques explicitees ;
- verifier la separation entre recommendation et decision.

### Demonstration MVP

- charger une declaration prototype ;
- lancer l'analyse ;
- montrer le parcours ;
- montrer les resultats stations ;
- montrer la recommendation et son explication ;
- montrer la validation metier et le rapport.

## 16. Sortie attendue

### Checklist MVP

- declaration creee
- donnees MVP saisies
- submit fonctionnel
- evaluate fonctionnel
- snapshot cree
- topologie affichee
- matrice retournee
- statut compris
- recommandations visibles si necessaire
- explication visible
- rapport accessible
- aucun calcul metier frontend

### Scenarios prioritaires

- scenario nominal Dar El Arssa / NH4
- point hors reseau
- Garde non atteint
- matrice hors domaine
- risque eleve avec recommandations
- risque eleve sans scenario faisable

### Anomalies bloquantes

- impossible de soumettre une declaration valide ;
- impossible de lancer `evaluate` ;
- absence de `snapshot_id` ;
- absence de parcours sur le cas nominal ;
- absence de resultats matrice ;
- incoherence entre recommandation et statut ;
- carte affichant une logique de concentration sur le parcours ;
- rapport absent alors que l'analyse est exploitable.

### Validation attendue

Le MVP est considere pret a entrer en implementation controlee si :
- les scenarios prioritaires sont compris et prepares ;
- les criteres metier sont acceptes ;
- les erreurs bloquantes sont connues ;
- le flux runtime de bout en bout est stabilise conceptuellement.
