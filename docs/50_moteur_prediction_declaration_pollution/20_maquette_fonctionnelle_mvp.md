# 20 - Maquette fonctionnelle MVP

## 1. Objectif

Ce document fixe la maquette fonctionnelle cible du cockpit Pollution integre.

Il ne decrit pas une implementation technique. Il sert a aligner l'equipe projet, les developpeurs et les utilisateurs metier sur l'experience attendue avant les sous-lots d'implementation frontend.

Principes :
- un seul cockpit : `Dashboard Pollution` ;
- deux vues metier : `Surveillance` et `Declaration d'incident` ;
- la carte est le coeur du workflow ;
- le backend reste source de verite des calculs ;
- le frontend guide, restitue et explique.

## 2. Vocabulaire UX cible

Le vocabulaire doit etre oriente metier.

| Terme technique | Terme UX recommande | Raison |
|---|---|---|
| Mode normal | Surveillance | Lecture operationnelle du bassin |
| Mode declaration | Declaration d'incident | Geste metier explicite |
| Evaluate | Lancer l'analyse | Action comprehensible |
| Matrix result | Concentrations estimees | Sortie metier |
| Recommendation | Strategies de dilution | Decision actionnable |
| Decision reasoning | Explication metier | Confiance et transparence |
| Snapshot | Dossier d'analyse | Trace du calcul |

## 3. Structure generale du cockpit

```text
+--------------------------------------------------------------------------------+
| DASHBOARD GESTION DES POLLUTIONS DECLAREES                                      |
|                                                                                |
| [Surveillance] [Declaration d'incident]                         [Actions]       |
+--------------------------------------------------------------------------------+
| Bandeau qualite des donnees                                                     |
| NH4 | Matrice NH4 v1 | Debits manuels | Exact match / plus proche controle | MVP       |
+-----------------------------------------------+--------------------------------+
|                                               |                                |
| CARTE OPERATIONNELLE UNIQUE                   | PANNEAU CONTEXTE / ASSISTANT   |
|                                               |                                |
| - reseau hydrographique                       | selon la vue active            |
| - stations                                    |                                |
| - sites pollution                             |                                |
| - point declare                               |                                |
| - point snappe                                |                                |
| - parcours aval                               |                                |
|                                               |                                |
+-----------------------------------------------+--------------------------------+
| Panneaux de restitution : resultats, decision, strategies, rapport              |
+--------------------------------------------------------------------------------+
```

## 4. Vue Surveillance

Objectif :
- consulter les pollutions declarees existantes ;
- inspecter la propagation topologique indicative ;
- afficher les impacts potentiels ;
- conserver les outils deja disponibles.

Maquette :

```text
+--------------------------------------------------------------------------------+
| DASHBOARD POLLUTION                                                             |
| [Surveillance] [Declaration d'incident]                                         |
+--------------------------------------------------------------------------------+
| KPIs                                                                           |
| Sites recenses | Resultats recents | Types de rejets | Sources API             |
+-----------------------------------------------+--------------------------------+
| CARTE                                          | SELECTION DU SITE SOURCE       |
|                                               |                                |
| - reseau hydro                                | [select site]                  |
| - stations qualite                            |                                |
| - sites pollution                             | Details site                   |
| - source pointee libre                        | Propagation indicative         |
| - parcours propagation                        | Warnings                       |
|                                               |                                |
+-----------------------------------------------+--------------------------------+
| [Pollutions declarees] [Propagation] [Impacts potentiels] [Recommandations]     |
|                                                                                |
| Contenu existant conserve                                                       |
+--------------------------------------------------------------------------------+
```

Elements conserves :
- `PollutionIdpMap` ;
- sites pollution ;
- stations ;
- propagation indicative ;
- recommandations generiques ;
- onglets existants.

## 5. Vue Declaration d'incident

Objectif :
- guider l'utilisateur de la detection jusqu'a la decision ;
- garder la carte comme support principal ;
- separer clairement saisie, analyse, resultat, decision et rapport.

Maquette :

```text
+--------------------------------------------------------------------------------+
| DASHBOARD POLLUTION                                                             |
| [Surveillance] [Declaration d'incident]                                         |
+--------------------------------------------------------------------------------+
| Donnees utilisees                                                               |
| Polluant: [NH4 v]  Matrice: NH4 v1  Debits: manuels  Statut: MVP scientifique|
+-----------------------------------------------+--------------------------------+
| CARTE                                          | ASSISTANT DECLARATION          |
|                                               |                                |
| 1. Localiser la pollution                     | Etape 1 - Point de detection   |
|    - clic carte                               | [Pointer sur la carte]         |
|    - saisie X/Y                               | Longitude / Latitude           |
|                                               |                                |
| 2. Visualiser                                | Etape 2 - Rejet                |
|    - point declare                            | Crejet                         |
|    - point snappe                             | QRejet                         |
|    - parcours aval                            |                                |
|                                               | Etape 3 - Hydrologie           |
|                                               | QSebou                         |
|                                               | QInnaouen                      |
|                                               | QOuergha                       |
|                                               |                                |
|                                               | [Lancer l'analyse]             |
+-----------------------------------------------+--------------------------------+
| RESULTATS                                                                      |
| P29 Sidi Allal Tazi | Barrage de Garde | Statut global | Confiance             |
+--------------------------------------------------------------------------------+
| DECISION                                                                       |
| Situation acceptable ou Risque eleve                                           |
| Pourquoi ? Points concernes ? Limites ? Validation humaine requise ?           |
+--------------------------------------------------------------------------------+
| STRATEGIES DE DILUTION                                                         |
| Strategie 1 Sebou | Strategie 2 Innaouen | Strategie 3 Ouergha                |
+--------------------------------------------------------------------------------+
| RAPPORT                                                                        |
| Dossier d'analyse | snapshot_id | rapport disponible                         |
+--------------------------------------------------------------------------------+
```

## 6. Assistant metier

Le workflow declaration doit etre presente comme un assistant en etapes.

```text
Etape 1 - Localiser la pollution
  Point carte ou saisie X/Y

Etape 2 - Caracteriser le rejet
  Polluant, concentration, debit rejet

Etape 3 - Conditions hydrologiques
  QSebou, QInnaouen, QOuergha

Etape 4 - Lancer l'analyse
  Creation, soumission, evaluation via API Declaration

Etape 5 - Lire les resultats
  Parcours, concentrations, statut, confiance

Etape 6 - Decider
  Explication, strategies, rapport, validation humaine
```

Regle :
- l'assistant guide l'utilisateur ;
- il ne calcule pas ;
- il ne remplace pas l'expert metier.

## 7. Carte comme centre du workflow

La carte doit piloter la declaration.

Avant analyse :
- reseau hydrographique visible ;
- stations visibles ;
- point declare visible ;
- message d'attente : analyse non lancee.

Apres analyse :
- point declare visible ;
- point snappe visible ;
- parcours aval visible ;
- stations de controle visibles si coordonnees disponibles ;
- SAT et Garde visibles au moins dans le panneau resultats ;
- warnings topologiques visibles.

Regles :
- pas de gradient de concentration sur le parcours ;
- pas de geometrie inventee ;
- pas d'appel direct aux endpoints `/propagation/*` pour le workflow officiel ;
- les donnees cartographiques officielles viennent de `evaluate`.

## 8. Panneau contexte hydrologique

Les debits ne doivent pas etre noyes dans un simple formulaire generique. Ils representent une condition du scenario.

Maquette :

```text
+----------------------------------------------+
| CONDITIONS HYDROLOGIQUES                     |
+----------------------------------------------+
| Sebou                                        |
| Debit: [15.0] m3/s                           |
| Source: Manuel                               |
| Date: maintenant                             |
| Qualite: A confirmer                         |
+----------------------------------------------+
| Innaouen                                     |
| Debit: [6.0] m3/s                            |
| Source: Manuel                               |
+----------------------------------------------+
| Ouergha                                      |
| Debit: [9.0] m3/s                            |
| Source: Manuel                               |
+----------------------------------------------+
| Future: Manuel / Sentinelle / Temps reel     |
+----------------------------------------------+
```

MVP :
- saisie manuelle uniquement ;
- source des donnees affichee ;
- avertissement si donnees a confirmer.

## 9. Panneau qualite des donnees

Ce bandeau doit etre visible en vue declaration.

```text
+--------------------------------------------------------------------------------+
| QUALITE DES DONNEES                                                             |
| Polluant: NH4 | Matrice: NH4 v1 | Version: 1.0.0 | Debits: manuels            |
| Point: secteur Dar El Arssa a valider | Methode: EXACT_MATCH / NEAREST_NEIGHBOR | Validation: MVP          |
+--------------------------------------------------------------------------------+
```

Objectif :
- rendre les limites visibles ;
- eviter une sur-interpretation scientifique ;
- preparer la validation Excel et les futures matrices.

## 10. Panneau decision

La decision doit etre plus lisible qu'un simple statut.

Cas suffisant :

```text
+----------------------------------------------+
| DECISION                                     |
| Situation acceptable                         |
+----------------------------------------------+
| Pourquoi ?                                   |
| Les concentrations estimees restent sous le  |
| seuil aux points de controle MVP.            |
|                                              |
| Points concernes                             |
| P29 Sidi Allal Tazi : suffisant              |
| Barrage de Garde : suffisant                 |
|                                              |
| Niveau de confiance                          |
| Moyen - matrice NH4 v1                       |
+----------------------------------------------+
```

Cas insuffisant :

```text
+----------------------------------------------+
| DECISION                                     |
| Risque eleve                                 |
+----------------------------------------------+
| Pourquoi ?                                   |
| Une concentration estimee depasse le seuil   |
| sur au moins un point de controle.           |
|                                              |
| Points concernes                             |
| P29 Sidi Allal Tazi : insuffisant            |
| Barrage de Garde : suffisant/insuffisant     |
|                                              |
| Validation humaine                           |
| Requise avant action terrain                 |
+----------------------------------------------+
```

## 11. Strategies de dilution

Les recommandations doivent etre presentees comme des strategies, pas comme des ordres.

```text
+--------------------------------------------------------------------------------+
| STRATEGIES DE DILUTION                                                          |
+-------------------------+-------------------------+----------------------------+
| Strategie 1             | Strategie 2             | Strategie 3                |
| Augmenter Sebou         | Augmenter Innaouen      | Augmenter Ouergha          |
| +X m3/s                 | +Y m3/s                 | +Z m3/s                    |
| Impact attendu          | Impact attendu          | Impact attendu             |
| Nouvelle concentration  | Nouvelle concentration  | Nouvelle concentration     |
| Statut estime           | Statut estime           | Statut estime              |
+-------------------------+-------------------------+----------------------------+
| Recommandation optimale : effort hydraulique minimal dans le domaine matrice     |
+--------------------------------------------------------------------------------+
```

MVP :
- trois strategies mono-axe ;
- pas de scenario combine ;
- pas d'action automatique ;
- validation humaine obligatoire.

## 12. Polluant MVP et multi-polluant futur

Le selecteur polluant doit etre prepare des maintenant, meme si seul `NH4` est actif.

```text
Polluant
[NH4 - Ammonium] (actif)
[NO3] desactive
[MES] desactive
[DBO5] desactive
```

Regle :
- le choix `NH4` est affiche clairement ;
- les autres polluants ne sont pas disponibles dans le MVP ;
- l'interface ne doit pas faire croire que le multi-polluant est deja valide.

## 13. Message MVP scientifique

Message a afficher dans la vue declaration :

```text
Version MVP scientifique.
Les resultats reposent sur la matrice NH4 v1, une recherche exacte ou plus proche controlee,
des debits saisis manuellement, un point de rejet prototype et le polluant NH4.
Toute decision operationnelle doit etre validee par un expert metier.
```

## 14. Maquette mobile / ecran etroit

Sur ecran etroit, la priorite est :

```text
1. Switch Surveillance / Declaration d'incident
2. Carte
3. Assistant declaration
4. Resultats
5. Decision
6. Strategies
7. Rapport
```

Regle :
- la carte reste au-dessus des resultats ;
- les panneaux se replient verticalement ;
- aucun tableau large indispensable au parcours MVP.

## 15. Impacts sur le sous-lot A

Le sous-lot A doit poser seulement :
- le switch `Surveillance` / `Declaration d'incident` ;
- le squelette `DeclarationWorkspace` ;
- les emplacements de l'assistant ;
- le bandeau MVP scientifique ;
- aucun branchement API.

Libelles recommandes pour le switcher :
- `Surveillance`
- `Declaration d'incident`

Ancien libelle acceptable temporairement :
- `Vue d'ensemble`
- `Declarer une pollution`

Decision recommandee :
- utiliser `Surveillance` / `Declaration d'incident` pour la demonstration metier.
