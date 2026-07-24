# 06 - Workflow metier Declaration Pollution

## 1. Objectif

Le workflow Declaration Pollution a pour objectif de transformer une declaration brute en dossier metier exploitable pour la decision.

Le dashboard cible ne doit pas devenir un moteur de calcul autonome. Il doit :
- collecter les donnees d'entree ;
- piloter les etapes du dossier ;
- orchestrer les appels vers les moteurs existants ;
- consolider les resultats ;
- restituer une analyse lisible sur la carte et dans un rapport.

Le dashboard ne recalcule pas lui-meme :
- la topologie ;
- la propagation ;
- les matrices ;
- les recommandations.

## 2. Perimetre MVP

### Inclus dans le MVP

Le MVP couvre :
- creation d'une declaration ;
- saisie du point de pollution ;
- saisie de la concentration de rejet ;
- saisie du debit de rejet ;
- saisie manuelle des debits `QSebou`, `QInnaouen`, `QOuergha` ;
- lancement de l'analyse ;
- parcours topologique aval ;
- evaluation via la matrice `NH4` ;
- determination d'un statut `suffisant` / `insuffisant` ;
- production de recommandations ;
- affichage cartographique du point et du parcours ;
- rapport simple de restitution.

### Exclu du MVP

Le MVP n'inclut pas :
- connexion automatique aux stations sentinelles ;
- multi-polluants avance ;
- IA officielle ou predictive opaque ;
- workflow administratif complexe multi-services ;
- notifications avancees ;
- optimisation globale de la plateforme ;
- refonte globale API, carte ou frontend hors blocage MVP.

## 3. Acteurs

| Acteur | Role | Actions possibles | Limites |
|---|---|---|---|
| Declarant | Cree et complete la declaration initiale | creer, modifier un brouillon, saisir le point, saisir les variables, lancer l'analyse si autorise | ne valide pas definitivement la doctrine metier |
| Expert metier | Analyse le dossier et decide de la suite metier | relire les resultats, demander un recalcul, valider, rejeter, cloturer | ne modifie pas les moteurs de calcul depuis le dashboard |
| Administrateur | Supervise le fonctionnement et les droits | consulter tous les dossiers, corriger certains metadonnees de gestion, administrer la disponibilite fonctionnelle | ne remplace pas l'expertise metier scientifique |
| Systeme | Orchestrateur technique du workflow | controler les preconditions, appeler les moteurs, historiser les transitions, produire le resultat dashboard et le rapport | ne decide pas seul d'une validation metier finale |
| Moteur topologique | Determine le snap, le parcours aval et les points de controle atteints | snap du point, calcul du parcours, identification des stations et barrage | n'evalue pas les concentrations ni les recommandations |
| Moteur matrice | Evalue les concentrations et le statut scientifique a partir des entrees | lire la matrice, interpoler ou appliquer les regles, renvoyer les concentrations et statuts | ne pilote pas le workflow ni la carte |
| Moteur recommandation | Produit des recommandations d'aide a la decision | transformer le resultat d'analyse en actions conseillees | ne remplace pas la validation humaine |

## 4. Objet metier principal : Declaration

La declaration est l'objet metier central du workflow. Elle represente un dossier de pollution exploitable par les briques du MVP.

### Informations minimales

- identifiant de declaration ;
- date de declaration ;
- point de declaration ;
- polluant ;
- concentration de rejet ;
- debit de rejet ;
- debits hydrologiques ;
- statut courant ;
- resultat d'evaluation ;
- recommandations ;
- rapport ;
- historique des transitions.

### Vue conceptuelle minimale

| Champ | Description |
|---|---|
| `declaration_id` | identifiant unique du dossier |
| `date_declaration` | date et heure de creation ou de saisie de la declaration |
| `point_declaration` | coordonnee ou geometrie du point de rejet declare |
| `polluant` | polluant analyse dans le workflow MVP, initialement `NH4` |
| `Crejet_mg_L` | concentration du rejet |
| `QRejet_m3_s` | debit du rejet |
| `QSebou_m3_s` | debit manuel du Sebou |
| `QInnaouen_m3_s` | debit manuel de l'Innaouen |
| `QOuergha_m3_s` | debit manuel de l'Ouergha |
| `statut` | etat courant du workflow |
| `evaluation_resultat` | concentrations, statuts et limites eventuelles |
| `recommandations` | liste de recommandations associees au dossier |
| `rapport` | restitution synthetique partageable |
| `historique` | trace des transitions et decisions |

## 5. Etats du workflow

### `BROUILLON`

- Definition simple : declaration creee mais incomplete ou non prete pour l'analyse.
- Condition d'entree : creation initiale du dossier ou retour en edition.
- Actions autorisees : saisir, modifier, completer, enregistrer.
- Condition de sortie : toutes les donnees minimales MVP sont renseignees.

### `PRET_A_ANALYSER`

- Definition simple : declaration complete et eligible au lancement d'analyse.
- Condition d'entree : point, polluant, `Crejet_mg_L`, `QRejet_m3_s`, `QSebou_m3_s`, `QInnaouen_m3_s`, `QOuergha_m3_s` disponibles et valides.
- Actions autorisees : lancer l'analyse, corriger des champs avant analyse.
- Condition de sortie : analyse demarree ou dossier repasse en brouillon suite a modification bloquante.

### `ANALYSE`

- Definition simple : etat technique transitoire pendant l'orchestration des moteurs.
- Condition d'entree : lancement effectif de l'analyse par l'utilisateur.
- Actions autorisees : consultation du statut d'avancement, annulation eventuelle selon arbitrage technique futur.
- Condition de sortie : resultat d'analyse produit ou erreur bloquante retournee.

### `ANALYSE`

- Definition simple : declaration traitee par les moteurs avec resultat disponible.
- Condition d'entree : succes de la chaine d'analyse complete.
- Actions autorisees : consulter le resultat, recalculer, valider, rejeter.
- Condition de sortie : qualification du risque puis eventuelle decision metier.

### `RISQUE_FAIBLE`

- Definition simple : resultat analyse indiquant un risque faible au regard des stations de controle MVP.
- Condition d'entree : statut suffisant aux deux stations de controle.
- Actions autorisees : consulter, generer rapport, valider, cloturer, recalculer.
- Condition de sortie : validation metier, cloture ou recalcul.

### `RISQUE_ELEVE`

- Definition simple : resultat analyse indiquant au moins une insuffisance aux points de controle.
- Condition d'entree : statut insuffisant a au moins une station.
- Actions autorisees : consulter, demander recommandations, recalculer, valider, rejeter.
- Condition de sortie : recommandations produites, validation, rejet ou recalcul.

### `RECOMMANDATION_PROPOSEE`

- Definition simple : recommandations generees et associees au dossier.
- Condition d'entree : moteur de recommandation execute apres une analyse exploitable.
- Actions autorisees : consulter, enrichir par avis metier, valider, rejeter, recalculer.
- Condition de sortie : validation metier, rejet ou cloture.

### `VALIDE_METIER`

- Definition simple : resultat relu et accepte par l'expert metier.
- Condition d'entree : validation explicite d'un dossier analyse.
- Actions autorisees : generer le rapport final, cloturer, reouvrir exceptionnellement selon regle future.
- Condition de sortie : cloture du dossier.

### `CLOTURE`

- Definition simple : dossier termine, plus d'action courante attendue.
- Condition d'entree : dossier valide et restitution terminee, ou cloture administrative justifiee.
- Actions autorisees : consultation et export du rapport.
- Condition de sortie : aucune dans le MVP.

### `REJETE`

- Definition simple : dossier invalide, inexploitable ou non retenu.
- Condition d'entree : rejet explicite par l'expert metier ou administrateur habilite.
- Actions autorisees : consultation de l'historique et du motif.
- Condition de sortie : aucune dans le MVP, sauf reouverture future hors perimetre.

## 6. Transitions

| Transition | Depuis | Vers | Declencheur | Condition | Acteur |
|---|---|---|---|---|---|
| creer declaration | aucun | `BROUILLON` | creation d'un nouveau dossier | identifiant et date crees | declarant |
| completer donnees | `BROUILLON` | `BROUILLON` | enregistrement des champs | dossier toujours incomplet | declarant |
| rendre pret a analyser | `BROUILLON` | `PRET_A_ANALYSER` | validation des champs obligatoires | point, polluant, `Crejet`, `QRejet`, `QSebou`, `QInnaouen`, `QOuergha` presents | systeme |
| corriger avant analyse | `PRET_A_ANALYSER` | `BROUILLON` | modification d'un champ critique | une donnee obligatoire redevient invalide ou absente | declarant |
| lancer analyse | `PRET_A_ANALYSER` | `ANALYSE` | clic lancer analyse | toutes les preconditions metier sont satisfaites | declarant |
| terminer analyse risque faible | `ANALYSE` | `RISQUE_FAIBLE` | fin de chaine d'analyse | statut suffisant aux deux stations | systeme |
| terminer analyse risque eleve | `ANALYSE` | `RISQUE_ELEVE` | fin de chaine d'analyse | statut insuffisant a au moins une station | systeme |
| recalculer analyse | `RISQUE_FAIBLE` | `ANALYSE` | demande de recalcul | modification des entrees ou reexecution demandee | declarant ou expert metier |
| recalculer analyse | `RISQUE_ELEVE` | `ANALYSE` | demande de recalcul | modification des entrees ou reexecution demandee | declarant ou expert metier |
| produire recommandations | `RISQUE_ELEVE` | `RECOMMANDATION_PROPOSEE` | generation des recommandations | analyse exploitable et moteur disponible | systeme |
| produire recommandations | `RISQUE_FAIBLE` | `RECOMMANDATION_PROPOSEE` | generation optionnelle des recommandations | besoin de restitution standardisee | systeme |
| valider resultat | `RISQUE_FAIBLE` | `VALIDE_METIER` | validation metier | dossier juge exploitable | expert metier |
| valider resultat | `RECOMMANDATION_PROPOSEE` | `VALIDE_METIER` | validation metier | analyse et recommandations jugees exploitables | expert metier |
| rejeter declaration | `BROUILLON` | `REJETE` | rejet du dossier | dossier invalide ou abandonne | expert metier ou administrateur |
| rejeter declaration | `PRET_A_ANALYSER` | `REJETE` | rejet du dossier | dossier incoherent ou hors perimetre | expert metier ou administrateur |
| rejeter declaration | `RISQUE_ELEVE` | `REJETE` | rejet du dossier | resultat inexploitable ou dossier invalide | expert metier ou administrateur |
| rejeter declaration | `RECOMMANDATION_PROPOSEE` | `REJETE` | rejet du dossier | conclusions non exploitables | expert metier ou administrateur |
| cloturer dossier | `VALIDE_METIER` | `CLOTURE` | cloture finale | rapport disponible ou decision de fin enregistree | expert metier |

## 7. Regles metier

- une declaration ne peut pas etre analysee sans point de rejet ;
- une declaration ne peut pas etre analysee sans `Crejet` et `QRejet` ;
- une declaration ne peut pas etre analysee sans `QSebou`, `QInnaouen`, `QOuergha` ;
- si les donnees hydrologiques futures datent de plus de 12h, l'utilisateur doit les confirmer ou les saisir ;
- dans le MVP, les debits sont saisis manuellement ;
- le polluant MVP est `NH4` ;
- le point source matrice NH4 est situe dans le secteur Dar El Arssa, localisation exacte a valider ;
- si aucun parcours aval n'est trouve, l'analyse est bloquee ;
- si la matrice ne couvre pas les valeurs saisies, l'analyse doit afficher une limite scientifique explicite ;
- si le statut est suffisant aux deux stations de controle, le risque est faible ;
- si le statut est insuffisant a une station, le moteur doit proposer des recommandations ;
- le dashboard ne calcule pas les concentrations lui-meme ; il consomme les resultats du moteur matrice ;
- le dashboard ne deduit pas seul le parcours ; il consomme le resultat du moteur topologique ;
- toute transition significative doit etre historisee dans le dossier.

## 8. Chaine d'analyse

La chaine d'analyse MVP est la suivante :

1. validation des champs obligatoires ;
2. snap du point au reseau ;
3. calcul du parcours aval ;
4. identification de Sidi Allal Tazi et du Barrage de Garde ;
5. lecture des variables hydrologiques ;
6. interrogation de la matrice ;
7. calcul des concentrations ;
8. evaluation du statut ;
9. generation des recommandations ;
10. generation du resultat dashboard.

### Lecture fonctionnelle de la chaine

- Etapes `1` a `4` : qualification spatiale du dossier par le moteur topologique.
- Etape `5` : consolidation des entrees hydrologiques saisies manuellement dans le MVP.
- Etapes `6` a `8` : evaluation scientifique via la matrice `NH4`.
- Etape `9` : aide a la decision via le moteur de recommandation.
- Etape `10` : restitution unifiee par le dashboard et le rapport.

## 9. Donnees d'entree

| Champ | Description | Obligatoire MVP | Source MVP | Source future |
|---|---|---|---|---|
| `Crejet_mg_L` | concentration du rejet en mg/L | oui | saisie utilisateur | capteur, laboratoire, API qualite |
| `QRejet_m3_s` | debit du rejet en m3/s | oui | saisie utilisateur | capteur, estimation terrain, systeme tiers |
| `QSebou_m3_s` | debit du Sebou | oui | saisie utilisateur | station hydrologique ou service hydrometrie |
| `QInnaouen_m3_s` | debit de l'Innaouen | oui | saisie utilisateur | station hydrologique ou service hydrometrie |
| `QOuergha_m3_s` | debit de l'Ouergha | oui | saisie utilisateur | station hydrologique ou service hydrometrie |
| `polluant` | substance analysee | oui | valeur forcee `NH4` dans le MVP | referentiel multi-polluants |
| `point_declaration` | point de rejet declare | oui | saisie cartographique utilisateur | geolocalisation terrain, source tierce |
| `date_declaration` | date et heure de la declaration | oui | systeme ou saisie utilisateur | synchronisation SI metier |
| `commentaire` | commentaire libre de contexte | non | saisie utilisateur | enrichissement workflow |

## 10. Donnees de sortie

| Sortie | Description | Utilisation |
|---|---|---|
| `C_SidiAllalTazi_mg_L` | concentration estimee a Sidi Allal Tazi | evaluation locale et affichage dashboard |
| `C_BgGarde_mg_L` | concentration estimee au Barrage de Garde | evaluation aval et affichage dashboard |
| `statut_global` | synthese globale du dossier | pilotage du workflow et lecture rapide |
| `statut_par_station` | statut distinct par station de controle | diagnostic detaille |
| `parcours_geojson` | geometrie du parcours aval | affichage cartographique |
| `longueur_parcours` | longueur du trajet calcule | information de contexte et controle |
| `recommandations` | actions conseillees par le moteur | aide a la decision |
| `niveau_confiance` | niveau de confiance du resultat | transparence sur les limites MVP |
| `rapport` | restitution simple du dossier | partage, export, archivage |

## 11. Gestion des erreurs

| Cas | Message utilisateur | Action recommandee | Blocage ou avertissement |
|---|---|---|---|
| point hors reseau | Le point declare ne peut pas etre raccorde au reseau hydrologique. | repositionner le point ou verifier la zone de saisie | blocage |
| parcours aval non trouve | Aucun parcours aval exploitable n'a ete trouve pour ce point. | verifier le point et relancer l'analyse | blocage |
| Barrage de Garde non atteint | Le parcours calcule n'atteint pas le Barrage de Garde dans le perimetre MVP. | verifier le point ou classer le dossier hors prototype MVP | blocage |
| Sidi Allal Tazi non detecte | La station Sidi Allal Tazi n'a pas ete detectee sur le parcours. | verifier le point, la topologie ou le parametrage des stations | blocage |
| valeur manquante | Certaines donnees obligatoires sont absentes. | completer les champs obligatoires | blocage |
| valeur hors domaine de matrice | Les valeurs saisies sortent du domaine couvert par la matrice MVP. | corriger la saisie ou accepter la limite scientifique | avertissement bloquant pour l'evaluation |
| matrice indisponible | La matrice scientifique est indisponible pour le moment. | reessayer plus tard ou basculer en expertise manuelle | blocage |
| service topologique indisponible | Le service topologique est indisponible. | reessayer plus tard et signaler l'incident | blocage |

## 12. Criteres de validation metier

Le lot est considere comme fonctionnellement valide si :
- une declaration peut etre creee ;
- une analyse peut etre lancee avec les seules entrees MVP ;
- le parcours aval est affiche ou l'erreur est comprise ;
- les concentrations de sortie sont affichees ;
- le statut resultat est comprehensible pour le metier ;
- les recommandations sont visibles quand necessaire ;
- un rapport simple peut etre genere.

## 13. Decisions a valider

Les points suivants doivent etre arbitres avant implementation backend complete :
- liste definitive des statuts du workflow ;
- role exact et droits de chaque acteur ;
- seuil `NH4` utilise pour qualifier `suffisant` / `insuffisant` ;
- regles exactes du moteur de recommandation ;
- regles de cloture du dossier ;
- format et contenu minimaux du rapport ;
- definition du niveau de confiance ;
- gestion exacte du statut intermediaire `ANALYSE` en temps reel ;
- politique de recalcul et d'ecrasement des resultats precedents.

## 14. Prochain lot

Ce workflow alimente directement le `LOT 2 - Backend Declaration Pollution`.

Les objets a implementer ensuite sont :
- modele declaration ;
- modele transition ;
- modele evaluation ;
- modele recommandation ;
- modele rapport ;
- endpoint d'evaluation.

La logique a venir doit respecter strictement cette separation :
- le dashboard orchestre ;
- le backend porte le workflow ;
- le moteur topologique calcule le parcours ;
- la bibliotheque de matrices calcule les concentrations ;
- le moteur de recommandation produit l'aide a la decision ;
- le rapport consolide la restitution.
