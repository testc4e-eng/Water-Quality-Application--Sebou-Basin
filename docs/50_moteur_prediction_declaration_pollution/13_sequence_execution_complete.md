# 13 - Sequence execution complete

## 1. Objectif

Ce document decrit la sequence complete d'execution du moteur Declaration Pollution, du point de vue runtime.

Il sert de reference de lecture rapide pour :
- les developpeurs backend ;
- les developpeurs frontend ;
- les experts metier ;
- les tests d'integration.

## 2. Vue d'ensemble

La sequence nominale cible est :

- Dashboard
- API Declaration Pollution
- Orchestrateur Declaration Pollution
- Moteur topologique
- Bibliotheque de matrices
- Moteur de recommandation
- Snapshot
- Reponse API
- Dashboard

## 3. Sequence fonctionnelle

### Etapes

1. l'utilisateur cree ou ouvre une declaration ;
2. le dashboard enregistre ou charge le brouillon ;
3. l'utilisateur complete les entrees ;
4. l'utilisateur soumet la declaration ;
5. l'API la passe a `PRET_A_ANALYSER` ;
6. l'utilisateur lance `evaluate` ;
7. l'orchestrateur charge la declaration ;
8. l'orchestrateur valide les preconditions ;
9. l'orchestrateur passe a `ANALYSE_EN_COURS` ;
10. l'orchestrateur appelle la topologie ;
11. l'orchestrateur controle le resultat topologique ;
12. l'orchestrateur appelle la matrice ;
13. l'orchestrateur qualifie le risque ;
14. si necessaire, l'orchestrateur appelle la recommandation ;
15. l'orchestrateur construit le snapshot ;
16. l'orchestrateur historise les transitions ;
17. l'orchestrateur construit la reponse API ;
18. le dashboard affiche le resultat ;
19. l'expert metier valide, rejette ou cloture.

## 4. Diagramme textuel

```text
Dashboard
  |
  | POST /api/v1/pollution/declarations/{id}/evaluate
  v
API Declaration Pollution
  |
  v
Orchestrateur Declaration Pollution
  |
  | validation preconditions
  | status -> ANALYSE_EN_COURS
  |
  +--> Moteur topologique
  |      |
  |      +--> snap
  |      +--> parcours aval
  |      +--> stations / garde
  |
  +--> Bibliotheque de matrices
  |      |
  |      +--> concentrations
  |      +--> statuts
  |
  +--> Moteur de recommandation
  |      |
  |      +--> top 3 actions
  |      +--> explanation
  |
  +--> AnalysisSnapshot
  |      |
  |      +--> historisation
  |
  +--> API Response
         |
         +--> topology_result
         +--> matrix_result
         +--> risk_result
         +--> recommendations
         +--> decision_reasoning
         +--> warnings
         +--> snapshot_id
         |
         v
Dashboard
```

## 5. Sequence d'etats

La sequence d'etats nominale est :

- `BROUILLON`
- `PRET_A_ANALYSER`
- `ANALYSE_EN_COURS`
- `ANALYSE_TERMINEE`
- `RISQUE_FAIBLE` ou `RISQUE_ELEVE`
- `RECOMMANDATION_PROPOSEE` si necessaire
- `VALIDE_METIER`
- `CLOTURE`

### Sequence avec erreur

- `PRET_A_ANALYSER`
- `ANALYSE_EN_COURS`
- `ERREUR_ANALYSE`

### Sequence avec rejet

- `RISQUE_ELEVE`
- `RECOMMANDATION_PROPOSEE`
- `REJETE`

## 6. Points de controle critiques

Les points de controle critiques sont :
- validite des champs obligatoires ;
- point de declaration present ;
- snap acceptable ;
- parcours vers Garde ;
- detection de Sidi Allal Tazi ;
- evaluation matrice dans le domaine valide ;
- recommendation calculee sans extrapolation ;
- snapshot cree avant retour API final.

## 7. Sequence decisionnelle

La sequence decisionnelle doit etre lue ainsi :

### 1. Evaluation

- topologie ;
- matrice ;
- statut scientifique.

### 2. Recommendation

- proposition d'actions ;
- alternatives ;
- explication.

### 3. Decision

- validation expert ;
- rejet ;
- cloture.

Cette separation doit rester visible dans les ecrans, dans l'API et dans les snapshots.

## 8. Bloc d'explication attendu

Le resultat final doit pouvoir contenir un bloc d'explication lisible, par exemple :

```text
Pourquoi le scenario est insuffisant ?
- La concentration estimee en NH4 au niveau de Sidi Allal Tazi depasse le seuil retenu.
- Le debit actuel disponible ne permet pas une dilution suffisante dans le domaine de la matrice.
- L'augmentation proposee sur le Sebou est la solution de plus faible effort hydraulique parmi les scenarios valides.
```

### Intention

Ce bloc n'est pas un moteur d'IA. C'est une couche d'explication deterministe, basee sur :
- le resultat matrice ;
- le classement des recommandations ;
- les limites scientifiques explicites.

## 9. Implications frontend

Le frontend peut maintenant etre concu sans ambiguity :
- formulaire de declaration ;
- action `soumettre` ;
- action `lancer analyse` ;
- affichage carte ;
- affichage resultat ;
- affichage recommandations ;
- affichage explication ;
- validation metier ;
- export rapport.

## 10. Risques de la sequence

Les principaux risques sont :
- sequence non atomique ;
- snapshot absent ou cree trop tard ;
- recommendation calculee avant validation du resultat matrice ;
- confusion entre recommendation et decision ;
- reponse API partielle ou incoherente.

## 11. Usage du document

Ce document doit servir de reference pour :
- construire le frontend ;
- ecrire les tests d'integration ;
- verifier la coherence des endpoints ;
- relire les scenarios de demonstration MVP.

## 12. Prochaine etape

Apres cette sequence complete, la prochaine etape recommandee est :
- `LOT 4 - Frontend Declaration Pollution`

Le frontend pourra alors etre construit sur une execution de bout en bout deja stabilisee conceptuellement.
