# 11 - Moteur de recommandation Declaration Pollution

## 1. Objectif

Le moteur de recommandation a pour objectif de transformer un resultat d'evaluation en actions exploitables.

Il intervient apres l'analyse topologique et matricielle pour proposer des options d'action, principalement des actions de dilution sur les axes `Sebou`, `Innaouen` et `Ouergha`.

Il ne remplace pas l'expert metier.

### Role exact

Le moteur de recommandation doit :
- interpreter un resultat insuffisant ;
- rechercher des scenarios correctifs dans le domaine valide ;
- proposer des actions classees ;
- expliciter les limites scientifiques et operationnelles.

Il ne doit pas :
- prendre une decision automatique engageante ;
- valider seul une action de barrage ;
- extrapoler hors domaine sans regle validee.

## 2. Positionnement architectural

La separation cible reste la suivante :
- topologie = parcours ;
- matrice = concentration / statut ;
- recommandation = actions proposees ;
- backend declaration = orchestration ;
- dashboard = restitution.

### Regle structurante

Le moteur de recommandation consomme un resultat d'analyse. Il ne recalcule ni le parcours ni la matrice source. Il transforme une evaluation en options d'action.

## 3. Cas declencheur

Le moteur est obligatoire si :
- statut global insuffisant ;
- ou statut insuffisant a `Sidi Allal Tazi` ;
- ou statut insuffisant au `Barrage de Garde`.

Il peut etre optionnel si le statut est suffisant.

### Lecture workflow

- `RISQUE_ELEVE` -> recommandations obligatoires si un scenario faisable existe ;
- `RISQUE_FAIBLE` -> recommandations optionnelles pour restitution ou anticipation ;
- absence de recommendation faisable -> alerte metier explicite.

## 4. Entrees du moteur

Le moteur de recommandation consomme :
- `MatrixEvaluationResult`
- `TopologyResult`
- `HydrologyInput`
- seuil `NH4`
- contraintes operationnelles connues
- niveau de confiance
- warnings scientifiques

### Lecture fonctionnelle des entrees

- `MatrixEvaluationResult` porte le resultat scientifique courant ;
- `TopologyResult` confirme que le parcours et les points de controle sont valides ;
- `HydrologyInput` rappelle les debits actuellement saisis ;
- le seuil `NH4` permet de savoir ce qui est considere suffisant ;
- les contraintes operationnelles pourront filtrer les recommandations futures ;
- le niveau de confiance et les warnings modulent le discours de recommandation.

## 5. Sorties du moteur

Le moteur doit retourner :
- une liste de recommandations ;
- l'axe concerne : `Sebou` / `Innaouen` / `Ouergha` / combine ;
- l'augmentation proposee en `m3/s` ;
- la priorite ;
- la justification ;
- le niveau de confiance ;
- la limite scientifique ;
- la methode utilisee.

### Intention

La sortie doit permettre :
- de proposer une action principale ;
- de classer des alternatives ;
- d'afficher le gain attendu ;
- de conserver une trace complete dans le snapshot et la reponse API.

## 6. Types de recommandations

Les types de recommandations MVP a couvrir sont :
- augmentation `QSebou` ;
- augmentation `QInnaouen` ;
- augmentation `QOuergha` ;
- augmentation combinee ;
- reduction du debit de rejet ;
- reduction de la concentration du rejet ;
- surveillance renforcee ;
- blocage / alerte metier si aucune solution realiste.

### Lecture pratique

- les recommandations hydrauliques sont prioritaires dans le MVP ;
- les reductions de rejet sont des alternatives si la bibliotheque de matrices permet de les comparer ;
- la surveillance renforcee doit apparaitre quand le niveau de confiance est moyen ou faible ;
- l'alerte metier doit apparaitre si aucun scenario suffisant faisable n'est trouve.

## 7. Strategie MVP

La strategie MVP recommandee est :
- rechercher dans la matrice les scenarios suffisants proches ;
- comparer l'effort hydraulique requis ;
- proposer l'effort minimal ;
- classer les alternatives ;
- ne pas extrapoler hors domaine.

### Principe directeur

Le moteur ne cherche pas la solution parfaite. Il cherche la meilleure option simple et tracable dans le domaine valide de la matrice.

## 8. Notion d'effort

Le moteur doit distinguer :
- effort total = somme des augmentations de debit ;
- effort par axe ;
- effort pondere futur selon faisabilite operationnelle ;
- distinction entre meilleure solution mathematique et meilleure solution operationnelle.

### Definition MVP

Dans le MVP :
- l'effort total est la somme des deltas positifs proposes ;
- un delta negatif incoherent ne doit pas etre retenu comme recommandation de dilution ;
- la meilleure solution est d'abord la solution d'effort minimal dans le domaine valide.

### Evolution future

Plus tard, l'effort pourra etre pondere par :
- disponibilite reelle des lachers ;
- temps de reaction ;
- priorites ABH ;
- cout operationnel ;
- contraintes de barrage.

## 9. Algorithme conceptuel MVP

L'algorithme conceptuel recommande est :

1. lire le scenario courant ;
2. verifier l'insuffisance ;
3. rechercher les scenarios suffisants dans le domaine ;
4. calculer `delta QSebou`, `delta QInnaouen`, `delta QOuergha` ;
5. exclure les scenarios avec valeurs inferieures incoherentes ;
6. classer par effort minimal ;
7. retourner le top 3 des recommandations ;
8. ajouter les avertissements.

### Regles de tri recommandees

- trier d'abord par `statut_global` suffisant ;
- puis par effort total croissant ;
- puis par nombre d'axes mobilises ;
- puis par niveau de confiance ;
- enfin par simplicite de mise en oeuvre si cette information devient disponible.

## 10. Recommandation combinee

Le moteur doit savoir proposer :
- une solution mono-axe ;
- une solution combinee equilibree ;
- une solution alternative si un axe est indisponible.

### Intention

- solution mono-axe : utile si une seule augmentation suffit ;
- solution combinee : utile si plusieurs petits deltas sont preferables a une forte hausse sur un seul axe ;
- solution alternative : utile si un axe est indisponible ou non souhaitable.

### Regle MVP

Une solution combinee ne doit etre proposee que si :
- elle reste dans le domaine valide ;
- elle est scientifiquement comparable ;
- elle apporte un effort total competitif ou une meilleure robustesse operationnelle.

## 11. Contraintes operationnelles futures

Les contraintes futures a prevoir sont :
- capacite de lacher barrage ;
- disponibilite reelle sur `Innaouen` ;
- disponibilite reelle sur `Ouergha` ;
- delais de reaction ;
- priorite metier ;
- contraintes `ABH`.

Dans le MVP, ces contraintes peuvent rester non renseignees.

### Consequence MVP

Le moteur peut proposer une recommandation mathematiquement pertinente mais operationnellement non arbitree. Cette limite doit etre explicite dans la reponse et dans le dashboard.

## 12. Contrat RecommendationResult

Le contrat cible recommande est :
- `recommendation_id`
- `type`
- `axis`
- `title`
- `description`
- `current_values`
- `proposed_values`
- `delta_values`
- `expected_matrix_result`
- `priority`
- `confidence`
- `method_used`
- `justification`
- `warnings`

### Intention du contrat

Ce contrat doit permettre :
- d'afficher la recommandation principale ;
- de comparer plusieurs options ;
- de montrer les deltas proposes ;
- d'afficher le resultat matriciel attendu ;
- de tracer la methode utilisee et les limites.

## 13. Erreurs et limites

| Erreur | Cause | Consequence workflow | Message utilisateur | Action recommandee |
|---|---|---|---|---|
| `RECOMMENDATION_NOT_REQUIRED` | statut deja suffisant et recommandation non demandee | pas de passage obligatoire vers `RECOMMANDATION_PROPOSEE` | Aucune recommandation obligatoire n'est necessaire pour ce dossier. | consulter le resultat ou demander une recommandation optionnelle |
| `RECOMMENDATION_NO_FEASIBLE_SCENARIO` | aucun scenario suffisant faisable dans le domaine | maintien du dossier en `RISQUE_ELEVE` ou passage vers `RECOMMANDATION_PROPOSEE` avec alerte | Aucun scenario suffisant realiste n'a ete trouve dans le domaine de la matrice. | demander validation metier ou expertise complementaire |
| `RECOMMENDATION_MATRIX_OUT_OF_DOMAIN` | recommandation impossible car scenario courant ou variantes hors domaine | blocage de recommandation exploitable | Le moteur de recommandation ne peut pas travailler hors du domaine valide de la matrice. | corriger les entrees ou revenir sur la matrice validee |
| `RECOMMENDATION_CONSTRAINTS_MISSING` | contraintes operationnelles requises mais absentes | recommandation degradee ou limitee | Les contraintes operationnelles ne sont pas renseignees ; la recommandation reste indicative. | faire valider par un expert metier |
| `RECOMMENDATION_ENGINE_FAILED` | echec interne du moteur de recommandation | pas de recommandation calculee | Le moteur de recommandation a echoue. | relancer puis verifier les donnees et le moteur |

### Lecture

- ces erreurs ne doivent pas etre confondues avec les erreurs topologiques ou matricielles ;
- elles expriment l'incapacite a proposer une action exploitable, pas l'absence d'analyse.

## 14. Integration avec workflow

Le workflow recommande est :
- `RISQUE_ELEVE` -> `RECOMMANDATION_PROPOSEE` ;
- `RISQUE_FAIBLE` -> recommandation optionnelle ;
- toute recommandation doit etre liee a `snapshot_id` et `matrix_version` ;
- une nouvelle evaluation invalide les recommandations precedentes sans les supprimer.

### Regle structurante

Une recommandation est un produit d'une evaluation donnee. Si la matrice, les debits ou le point changent :
- les recommandations anterieures restent historisees ;
- elles ne doivent plus etre presentees comme la recommandation active.

## 15. Affichage dashboard attendu

Le dashboard doit pouvoir afficher :
- la recommandation principale ;
- les alternatives ;
- les gains attendus ;
- la nouvelle concentration estimee ;
- l'axe concerne ;
- les avertissements ;
- le niveau de confiance ;
- un bouton `tester un autre scenario`.

### Intention UX

- la recommandation principale doit etre lisible immediatement ;
- les alternatives doivent permettre une discussion metier ;
- les avertissements doivent expliciter les limites scientifiques et operationnelles ;
- le bouton de scenario alternatif doit rester une action de simulation, pas une validation automatique.

## 16. Tests de validation

Les tests de validation attendus sont :
- cas suffisant : pas de recommandation obligatoire ;
- cas insuffisant : top recommandations retournees ;
- aucun scenario suffisant : alerte metier ;
- recommandations liees a `matrix_version` ;
- pas d'extrapolation.

### Resultats attendus

- un cas `RISQUE_FAIBLE` peut vivre sans recommandation obligatoire ;
- un cas `RISQUE_ELEVE` doit produire soit des recommandations, soit une alerte metier claire ;
- toute recommandation doit etre tracable jusqu'au snapshot et a la version de matrice ;
- aucune recommandation ne doit etre issue d'une extrapolation non controlee.

## 17. Risques

Les principaux risques sont :
- recommandation scientifiquement fragile ;
- recommandation hydrauliquement irrealiste ;
- confusion entre conseil systeme et decision metier ;
- sur-promesse operationnelle ;
- absence de contraintes de barrage ;
- matrice trop limitee.

### Lecture de risque

- une matrice pauvre limite fortement la qualite des recommandations ;
- une recommandation mathematique peut etre inexecutable sur le terrain ;
- le dashboard ne doit jamais presenter la recommandation comme un ordre automatique.

## 18. Recommandations architecturales

Les recommandations de mise en oeuvre sont :
- commencer par un top 3 de recommandations simples ;
- afficher les limites ;
- ne jamais imposer automatiquement une action ;
- permettre une validation humaine ;
- historiser toutes les recommandations ;
- ajouter plus tard une ponderation operationnelle.

### Recommandations complementaires

- rattacher chaque recommandation a `snapshot_id` et `matrix_version` ;
- conserver `method_used` dans le resultat ;
- isoler le moteur de recommandation de la bibliotheque matrice tout en le nourrissant de ses sorties ;
- reutiliser les moteurs existants `propagation_recommendations.py` et `recommendations/engine.py` comme briques de contexte, sans leur deleguer seuls la logique declaration-centric.

## 19. Prochain lot

Le prochain lot recommande est :
- `LOT 4 - Frontend Declaration Pollution`
ou
- `LOT 5 - Carte Declaration Pollution`

Le chemin recommande est de commencer par le frontend du workflow, puisque les trois briques backend structurantes sont maintenant cadrees :
- topologie ;
- matrice ;
- recommandation.
