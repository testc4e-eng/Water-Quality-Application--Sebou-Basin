# 21 - Storyboard parcours utilisateur

## 1. Objectif

Ce document decrit le parcours utilisateur cible d'une declaration de pollution dans le cockpit unique `Dashboard Pollution`.

Il complete la maquette fonctionnelle en racontant le scenario complet : detection, localisation, analyse, decision, rapport.

Le storyboard ne modifie pas l'architecture backend validee. Il precise comment l'utilisateur doit vivre le workflow.

## 2. Acteurs

### Agent terrain ou declarant

Role :
- signale une pollution ;
- localise le point ;
- renseigne les donnees observees ou disponibles.

Limites :
- ne valide pas la decision finale ;
- ne corrige pas les resultats scientifiques.

### Expert metier

Role :
- relit le dossier ;
- interprete les limites ;
- valide ou rejette la decision ;
- decide des actions operationnelles.

Limites :
- ne modifie pas les calculs backend depuis l'interface.

### Systeme

Role :
- snappe le point ;
- calcule le parcours aval ;
- evalue la matrice ;
- propose les strategies ;
- trace le snapshot et le rapport.

Limites :
- ne remplace pas l'expert.

## 3. Scenario nominal

Contexte :
- polluant : `NH4` ;
- point source matrice NH4 : secteur Dar El Arssa, localisation exacte a valider ;
- matrice : NH4 v1 ;
- debits : saisis manuellement ;
- objectif : determiner si la dilution est suffisante jusqu'a `P29 Sidi Allal Tazi` et `Barrage de Garde`.

Resultat attendu :
- declaration creee ;
- analyse lancee ;
- parcours visible ;
- statut comprehensible ;
- strategies proposees si risque eleve ;
- rapport disponible.

## 4. Ecran 1 - Arrivee dans le cockpit Pollution

L'utilisateur ouvre :

```text
/dashboard-pollution
```

Il voit :

```text
+--------------------------------------------------------------------------------+
| DASHBOARD GESTION DES POLLUTIONS DECLAREES                                      |
| [Surveillance] [Declaration d'incident]                                         |
+--------------------------------------------------------------------------------+
| Carte operationnelle + sites + stations + reseau                                |
+--------------------------------------------------------------------------------+
```

Comportement attendu :
- `Surveillance` est active par defaut ;
- les outils existants restent disponibles ;
- aucune declaration n'est creee automatiquement.

Critere de validation :
- le mode normal actuel reste fonctionnel.

## 5. Ecran 2 - Passage en Declaration d'incident

L'utilisateur clique :

```text
Declaration d'incident
```

Il voit :

```text
+--------------------------------------------------------------------------------+
| [Surveillance] [Declaration d'incident actif]                                   |
+--------------------------------------------------------------------------------+
| Version MVP scientifique : NH4, matrice NH4 v1, debits manuels                 |
+-----------------------------------------------+--------------------------------+
| Carte                                         | Assistant declaration          |
|                                               | Etape 1 - Localiser            |
|                                               | Etape 2 - Rejet                |
|                                               | Etape 3 - Hydrologie           |
|                                               | Etape 4 - Analyse              |
+-----------------------------------------------+--------------------------------+
```

Comportement attendu :
- le cockpit ne change pas de route ;
- la carte reste la meme ;
- aucun appel declaration API n'est encore lance.

Critere de validation :
- le workspace declaration est visible et comprehensible.

## 6. Ecran 3 - Localiser la pollution

Deux options sont possibles.

### Option A - Clic carte

L'utilisateur clique :

```text
Pointer sur la carte
```

Puis clique sur le point de pollution.

Le systeme affiche :
- point declare ;
- longitude ;
- latitude ;
- message indiquant que le snap sera realise a l'analyse.

### Option B - Saisie X/Y

L'utilisateur saisit :
- longitude ;
- latitude.

Le systeme affiche :
- point declare ;
- carte recentree si possible ;
- bouton de confirmation.

Critere de validation :
- le point declare est visible ;
- aucune topologie n'est inventee cote frontend ;
- le point snappe n'apparait qu'apres retour backend.

## 7. Ecran 4 - Caracteriser le rejet

L'utilisateur renseigne :
- polluant : `NH4` ;
- `Crejet_mg_L` ;
- `QRejet_m3_s`.

Maquette :

```text
+----------------------------------------------+
| Etape 2 - Caracteriser le rejet              |
+----------------------------------------------+
| Polluant : NH4                               |
| Concentration rejet : [      ] mg/L          |
| Debit rejet : [      ] m3/s                  |
| Commentaire : [                          ]   |
+----------------------------------------------+
```

Comportement attendu :
- le selecteur polluant affiche `NH4` ;
- les polluants futurs peuvent etre visibles mais desactives ;
- les erreurs de saisie sont ergonomiques.

Critere de validation :
- l'utilisateur comprend que le MVP est limite a `NH4`.

## 8. Ecran 5 - Renseigner le contexte hydrologique

L'utilisateur renseigne :
- `QSebou_m3_s` ;
- `QInnaouen_m3_s` ;
- `QOuergha_m3_s`.

Maquette :

```text
+----------------------------------------------+
| Etape 3 - Conditions hydrologiques           |
+----------------------------------------------+
| Sebou    Debit [     ] m3/s  Source Manuel   |
| Innaouen Debit [     ] m3/s  Source Manuel   |
| Ouergha  Debit [     ] m3/s  Source Manuel   |
+----------------------------------------------+
| Les debits sont saisis manuellement dans le MVP.|
+----------------------------------------------+
```

Comportement attendu :
- les debits ne sont pas presentes comme donnees temps reel ;
- le futur mode sentinelle/temps reel est anticipe visuellement.

Critere de validation :
- la source des debits est explicite.

## 9. Ecran 6 - Lancer l'analyse

L'utilisateur clique :

```text
Lancer l'analyse
```

Le systeme execute le workflow officiel :

```text
create
submit
evaluate
snapshot
report_available
```

Pendant l'analyse :

```text
+----------------------------------------------+
| Analyse en cours                             |
| Snapping du point                            |
| Calcul du parcours aval                      |
| Evaluation matrice NH4                       |
| Generation des recommandations               |
+----------------------------------------------+
```

Comportement attendu :
- le frontend appelle uniquement l'API Declaration ;
- la carte n'appelle pas `/propagation/*` ;
- les erreurs fonctionnelles sont affichees sans masquer la carte.

Critere de validation :
- `snapshot_id` est produit si l'analyse reussit.

## 10. Ecran 7 - Voir le parcours

Apres evaluation, la carte affiche :
- point declare ;
- point snappe ;
- parcours aval ;
- stations de controle si coordonnees disponibles ;
- warnings topologiques.

Maquette :

```text
+-----------------------------------------------+
| CARTE                                         |
|                                               |
|  X point declare                              |
|  O point snappe                               |
|  ===== parcours aval vers Garde               |
|  P29 Sidi Allal Tazi                          |
|  Barrage de Garde                             |
+-----------------------------------------------+
```

Comportement attendu :
- le parcours vient de `topology_result.parcours_geojson` ;
- la ligne n'indique pas une concentration ;
- SAT et Garde restent visibles au moins dans le panneau si les coordonnees ne sont pas disponibles.

Critere de validation :
- le scenario visuel est coherent avec la reponse `evaluate`.

## 11. Ecran 8 - Lire les resultats

Le panneau resultats affiche :

```text
+--------------------------------------------------------------------------------+
| RESULTATS                                                                       |
+----------------------------+----------------------------+----------------------+
| P29 Sidi Allal Tazi        | Barrage de Garde           | Statut global        |
| C = ... mg/L               | C = ... mg/L               | Suffisant/Insuffisant|
| Statut station             | Statut station             | Confiance            |
+----------------------------+----------------------------+----------------------+
```

Comportement attendu :
- les concentrations viennent de `matrix_result` ;
- le statut vient du backend ;
- le frontend ne recalcule pas le risque.

Critere de validation :
- l'utilisateur comprend le resultat sans lire un JSON.

## 12. Ecran 9 - Comprendre la decision

Le panneau decision affiche :

```text
+----------------------------------------------+
| DECISION                                     |
| Situation acceptable / Risque eleve          |
+----------------------------------------------+
| Pourquoi ?                                   |
| - raison 1                                   |
| - raison 2                                   |
|                                              |
| Niveau de confiance                          |
| Limites scientifiques                         |
| Validation humaine requise                    |
+----------------------------------------------+
```

Comportement attendu :
- l'explication vient de `decision_reasoning` ;
- le systeme distingue resultat, recommandation et decision humaine ;
- le message MVP scientifique reste visible.

Critere de validation :
- l'expert peut expliquer pourquoi le systeme propose ce statut.

## 13. Ecran 10 - Examiner les strategies

Si le statut est insuffisant, le systeme affiche trois strategies.

```text
+--------------------------------------------------------------------------------+
| STRATEGIES PROPOSEES                                                            |
+-------------------------+-------------------------+----------------------------+
| Augmenter Sebou         | Augmenter Innaouen      | Augmenter Ouergha          |
| +X m3/s                 | +Y m3/s                 | +Z m3/s                    |
| C attendue SAT/Garde    | C attendue SAT/Garde    | C attendue SAT/Garde       |
| Statut estime           | Statut estime           | Statut estime              |
+-------------------------+-------------------------+----------------------------+
```

Comportement attendu :
- les strategies sont des recommandations ;
- aucune action n'est appliquee automatiquement ;
- la recommandation optimale est expliquee.

Critere de validation :
- l'utilisateur voit les alternatives sans les confondre avec une decision automatique.

## 14. Ecran 11 - Rapport

L'utilisateur clique :

```text
Consulter le rapport
```

Le rapport contient :
- identifiant declaration ;
- `snapshot_id` ;
- point declare ;
- point snappe ;
- parcours ;
- entrees hydrologiques ;
- concentrations ;
- statut ;
- strategies ;
- limites scientifiques.

Critere de validation :
- le rapport correspond a la derniere evaluation active.

## 15. Cas alternatif - Point invalide

Si le point est hors reseau ou sans parcours :

```text
+----------------------------------------------+
| Analyse bloquee                              |
| Le point ne permet pas de calculer un parcours|
| aval exploitable dans le perimetre MVP.      |
+----------------------------------------------+
| Action recommandee                           |
| Verifier le point ou saisir une coordonnee    |
| plus proche du reseau hydrographique.        |
+----------------------------------------------+
```

Comportement attendu :
- point declare reste visible ;
- aucun faux parcours n'est affiche ;
- le code fonctionnel backend peut etre visible en detail.

## 16. Cas alternatif - Matrice hors domaine

Si les valeurs sortent du domaine matrice :

```text
+----------------------------------------------+
| Limite scientifique                           |
| Les valeurs saisies ne sont pas couvertes par |
| la matrice NH4 v1.                            |
+----------------------------------------------+
| Action recommandee                            |
| Modifier le scenario ou demander validation   |
| scientifique.                                 |
+----------------------------------------------+
```

Comportement attendu :
- pas d'extrapolation masquee ;
- pas de decision automatique.

## 17. Recette metier du parcours

Checklist :
- l'utilisateur trouve la vue `Declaration d'incident` ;
- il comprend que la carte pilote le point ;
- il peut saisir X/Y ;
- il voit les limites MVP ;
- il lance l'analyse ;
- il voit le parcours ;
- il voit SAT et Garde ;
- il lit les concentrations ;
- il comprend le statut ;
- il voit les strategies si necessaire ;
- il comprend la validation humaine ;
- il consulte le rapport.

## 18. Impact sur la roadmap frontend

Ordre recommande :

```text
Sous-lot A - Switch Surveillance / Declaration d'incident + squelette workspace
Sous-lot B - DeclarationPointSelector + clic carte + saisie X/Y
Sous-lot C - Formulaire rejet + contexte hydrologique
Sous-lot D - Branchement create/submit/evaluate
Sous-lot E - Couches declaration dans PollutionIdpMap
Sous-lot F - Resultats + decision + strategies
Sous-lot G - Rapport
Sous-lot H - Recette et migration navigation
```

Decision :
- lancer le sous-lot A seulement apres validation de cette maquette et de ce storyboard.
