# 09 - Integration moteur topologique

## 1. Objectif

Le moteur topologique doit fournir au workflow Declaration Pollution :
- le snap du point de declaration ;
- le calcul du parcours aval ;
- l'identification des stations de controle ;
- la verification de l'atteinte du Barrage de Garde ;
- un GeoJSON exploitable pour l'affichage carte.

Le lot ne vise pas a reecrire le moteur existant. Il vise a definir comment le workflow Declaration Pollution le consomme proprement.

## 2. Principe d'architecture

La separation cible reste la suivante :
- Dashboard = saisie + restitution ;
- Backend declaration = orchestration ;
- Moteur topologique = parcours aval ;
- Bibliotheque matrice = concentrations ;
- Moteur recommandation = actions proposees.

### Regle structurante

Le dashboard ne doit jamais appeler directement le moteur topologique pour le workflow officiel. Le backend declaration encapsule les appels, interprete le resultat et le rattache a un snapshot d'analyse.

## 3. Cas MVP

Le cas MVP de reference est :
- polluant : `NH4` ;
- point source matrice NH4 : secteur Dar El Arssa, localisation exacte a valider ;
- stations de controle : `Sidi Allal Tazi`, `Barrage de Garde` ;
- exutoire attendu : `Barrage de Garde` dans le cadre du prototype MVP ;
- objectif carte : afficher le trajet depuis le point declare jusqu'a Garde.

### Lecture fonctionnelle

Le moteur topologique sert ici a repondre a trois questions :
- le point declare est-il correctement raccorde au reseau ;
- le parcours aval atteint-il bien les points de controle MVP ;
- le trajet cartographique est-il exploitable pour la restitution et le passage au moteur matrice.

## 4. Endpoints topologie existants a consommer

### `GET /api/v1/propagation/snap-diagnostic`

- Role probable : verifier le snap du point source sur le reseau et retourner les informations de distance et de confiance.
- Usage possible dans Declaration Pollution : controle preliminaire du point avant analyse complete ou diagnostic detaille en cas d'erreur de raccordement.
- Limites : ne retourne pas a lui seul le parcours aval complet.
- Decision recommandee : encapsuler.

### `GET /api/v1/propagation/source-to-garde`

- Role probable : calculer le parcours de la source vers le Barrage de Garde avec distance et GeoJSON.
- Usage possible dans Declaration Pollution : endpoint topologique principal pour verifier que le prototype atteint bien Garde et pour recuperer le trajet aval principal.
- Limites : centre sur Garde ; ne couvre pas seul toutes les stations de controle ou affluents utiles.
- Decision recommandee : reutiliser directement via encapsulation backend.

### `GET /api/v1/propagation/source-to-stations`

- Role probable : lister les stations atteignables depuis la source avec distances et qualite de snap des cibles.
- Usage possible dans Declaration Pollution : verifier la detection de Sidi Allal Tazi et enrichir le `TopologyResult`.
- Limites : resultat potentiellement plus large que le besoin MVP ; necessite filtrage ou interpretation backend.
- Decision recommandee : reutiliser directement via encapsulation backend.

### `GET /api/v1/propagation/source-to-barrages`

- Role probable : lister les barrages atteignables depuis la source.
- Usage possible dans Declaration Pollution : confirmer que Garde fait partie des barrages atteints et eventuellement qualifier des barrages supplementaires.
- Limites : ne garantit pas le trajet principal retenu pour le prototype.
- Decision recommandee : encapsuler comme endpoint de verification secondaire.

### `GET /api/v1/propagation/source-to-exutoires`

- Role probable : lister les exutoires aval accessibles depuis la source.
- Usage possible dans Declaration Pollution : diagnostic de completude aval ou verification de coherence hydrologique.
- Limites : plus exploratoire que necessaire pour le MVP Declaration Pollution.
- Decision recommandee : eviter dans le flux nominal MVP, garder pour diagnostic.

### `POST /api/v1/propagation/simulate`

- Role probable : produire une simulation downstream plus riche avec chemin, impacts, barrages, stations, exutoires et avertissements.
- Usage possible dans Declaration Pollution : source de donnees complementaires ou fallback analytique si l'on souhaite enrichir la restitution.
- Limites : plus couple a la logique de propagation que necessaire pour la simple qualification topologique ; risque de confusion entre topologie et propagation.
- Decision recommandee : encapsuler avec prudence, ne pas en faire la dependance nominale du workflow topologique MVP.

## 5. Service backend existant

Le service backend existant a consommer est :

- `backend/app/services/propagation/propagation_pollution_service.py`

### Role

Ce service porte deja :
- le snap de la source sur le reseau ;
- le calcul de parcours vers Garde ;
- la recherche de stations, barrages et exutoires atteints ;
- la production de GeoJSON ;
- des avertissements de confiance de snap ;
- une simulation downstream plus complete.

### Entrees attendues

Les entrees attendues sont probablement :
- coordonnees source ;
- contraintes de snap ;
- type de cible ;
- limites de distance ;
- parametres de simulation ou de vitesse de reference selon les cas.

### Sorties attendues

Les sorties exploitables par le workflow Declaration Pollution sont :
- point snappe ;
- distance au reseau ;
- confiance de snap ;
- parcours GeoJSON ;
- longueur du parcours ;
- stations detectees ;
- barrages atteints ;
- exutoires detectes ;
- warnings et messages de diagnostic.

### Limites

- service concu d'abord pour topologie et propagation, pas pour workflow declaration ;
- contrats de sortie potentiellement plus riches ou plus techniques que le besoin du dashboard ;
- logique de parcours utile mais non suffisante pour la decision scientifique ;
- risque de surcharge si l'on utilise `simulate` quand `source-to-garde` et `source-to-stations` suffisent.

### Precautions scientifiques

- un bon resultat topologique ne signifie pas que la concentration est validee ;
- le service ne doit jamais statuer sur la qualite ou l'insuffisance du polluant ;
- la topologie reste une precondition spatiale du calcul matrice, pas son substitut.

## 6. TopologyResult cible

Le contrat interne cible recommande est :

### `TopologyResult`

- `snapped_point`
- `snap_distance_m`
- `parcours_geojson`
- `longueur_km`
- `stations_detectees`
- `sidi_allal_tazi_detectee`
- `barrage_garde_atteint`
- `exutoire_atteint`
- `affluents_detectes`
- `diagnostic_messages`
- `confidence_level`
- `warnings`

### Intention de chaque champ

- `snapped_point` : point rete nu retenu par le moteur ;
- `snap_distance_m` : distance entre point declare et point rete nu ;
- `parcours_geojson` : trajectoire aval affichable sur la carte ;
- `longueur_km` : longueur du trajet retenu ;
- `stations_detectees` : liste des stations atteignables ou retenues ;
- `sidi_allal_tazi_detectee` : indicateur binaire pour la station cle MVP ;
- `barrage_garde_atteint` : indicateur binaire de succes topologique MVP ;
- `exutoire_atteint` : indicateur plus large de reachability aval ;
- `affluents_detectes` : affluents majeurs identifies si disponibles ;
- `diagnostic_messages` : messages lisibles de controle topologique ;
- `confidence_level` : confiance globale issue notamment du snap ;
- `warnings` : alertes non bloquantes.

## 7. Regles metier topologiques

- si point hors reseau : blocage ;
- si aucun parcours aval : blocage ;
- si Barrage de Garde non atteint : blocage MVP ;
- si Sidi Allal Tazi non detectee : blocage ou validation metier requise ;
- si snap trop eloigne : avertissement ou blocage selon seuil ;
- si parcours sort du perimetre prototype : limite scientifique ;
- le moteur topologique ne doit pas statuer sur la concentration.

### Interpretation recommandee

- `TOPOLOGY_POINT_OFF_NETWORK` : bloquant ;
- `TOPOLOGY_PATH_NOT_FOUND` : bloquant ;
- `TOPOLOGY_GARDE_NOT_REACHED` : bloquant pour le MVP Declaration Pollution ;
- `TOPOLOGY_SAT_NOT_FOUND` : bloquant par defaut, sauf arbitrage metier futur ;
- `TOPOLOGY_SNAP_TOO_FAR` : avertissement si seuil tolerance faible depasse legerement, blocage si depassement fort ;
- parcours hors prototype : resultat topologique exploitable eventuellement en diagnostic, mais non valide pour evaluation MVP.

## 8. Integration dans l'orchestration backend

Le flux backend recommande est :

1. declaration chargee ;
2. point recupere ;
3. appel topologique ;
4. controle qualite du resultat ;
5. stockage dans snapshot ;
6. transmission au moteur matrice ;
7. transmission au frontend via `evaluation response`.

### Sequence detaillee

- le `declaration_pollution_service` extrait le point de declaration ;
- il appelle le moteur topologique encapsule ;
- il verifie le snap, la presence d'un parcours, la detection de Sidi Allal Tazi et l'atteinte de Garde ;
- il convertit la reponse brute en `TopologyResult` ;
- il stocke le resultat dans `PollutionDeclarationAnalysisSnapshot.topology_payload` ;
- il transmet au moteur matrice uniquement les informations topologiques utiles ;
- il expose le bloc `topology_result` dans `PollutionDeclarationEvaluationResponse`.

## 9. Affichage cartographique attendu

L'affichage cartographique doit permettre de visualiser :
- le point de declaration ;
- le point snappe ;
- le parcours aval ;
- le sens d'ecoulement ;
- Sidi Allal Tazi ;
- le Barrage de Garde ;
- les affluents `Sebou` / `Innaouen` / `Ouergha` si disponibles ;
- les statuts visuels ;
- les messages d'avertissement.

### Principes d'affichage

- le point declare et le point snappe doivent etre distinguables ;
- le trajet principal doit etre lisible sans surcharge ;
- les points de controle doivent etre explicitement identifies ;
- les avertissements topologiques doivent etre visibles sans masquer le resultat ;
- la carte ne doit pas suggerer une concentration ; elle illustre un parcours.

## 10. Erreurs liees a la topologie

| Erreur | Cause | Consequence workflow | Message utilisateur | Action recommandee |
|---|---|---|---|---|
| `TOPOLOGY_POINT_OFF_NETWORK` | le point ne peut pas etre raccorde au reseau | passage en `ERREUR_ANALYSE` | Le point declare ne peut pas etre raccorde au reseau hydrologique. | repositionner le point |
| `TOPOLOGY_PATH_NOT_FOUND` | aucun parcours aval exploitable | passage en `ERREUR_ANALYSE` | Aucun parcours aval exploitable n'a ete trouve. | verifier le point puis relancer |
| `TOPOLOGY_GARDE_NOT_REACHED` | le trajet n'atteint pas Garde dans le perimetre MVP | passage en `ERREUR_ANALYSE` | Le parcours n'atteint pas le Barrage de Garde dans le perimetre MVP. | verifier le point ou sortir du prototype MVP |
| `TOPOLOGY_SAT_NOT_FOUND` | Sidi Allal Tazi non detectee | passage en `ERREUR_ANALYSE` ou validation metier requise | La station Sidi Allal Tazi n'a pas ete detectee sur le parcours. | verifier le point, la topologie ou le referentiel |
| `TOPOLOGY_ENGINE_UNAVAILABLE` | indisponibilite du moteur topologique | passage en `ERREUR_ANALYSE` | Le moteur topologique est indisponible. | reessayer plus tard |
| `TOPOLOGY_SNAP_TOO_FAR` | distance de snap trop elevee par rapport au seuil retenu | avertissement ou `ERREUR_ANALYSE` selon seuil | Le point est trop eloigne du reseau pour garantir un parcours fiable. | rapprocher le point du cours d'eau ou confirmer avec expertise |

## 11. Tests de validation

Les tests de validation attendus sont :
- point prototype Dar El Arssa ;
- parcours vers Sidi Allal Tazi ;
- parcours vers Barrage de Garde ;
- GeoJSON non vide ;
- longueur `> 0` ;
- stations detectees ;
- erreur propre si point invalide.

### Resultats attendus

- le point prototype doit snapper avec un niveau de confiance acceptable ;
- le parcours doit atteindre Sidi Allal Tazi et Garde dans le cadre MVP ;
- le GeoJSON doit etre exploitable par la carte sans reconstruction supplementaire ;
- les erreurs doivent etre fonctionnelles et non techniques pour l'utilisateur final.

## 12. Risques

Les principaux risques sont :
- mauvais snap ;
- sens d'ecoulement incorrect ;
- station non reconnue ;
- exutoire non atteint ;
- confusion topologie / concentration ;
- extrapolation hors matrice ;
- GeoJSON trop lourd.

### Lecture de risque

- un mauvais snap peut invalider toute la suite du workflow ;
- un sens d'ecoulement faux produit une carte trompeuse ;
- une station mal reconnue casse la logique MVP de controle ;
- un GeoJSON trop volumineux degrade l'experience frontend ;
- l'utilisation abusive de `simulate` peut melanger topologie et propagation.

## 13. Recommandations

Les recommandations de mise en oeuvre sont :
- encapsuler les endpoints existants dans `declaration_pollution_service` ;
- ne pas appeler directement `propagation` depuis le frontend pour le workflow officiel ;
- stocker le resultat topologique dans `AnalysisSnapshot` ;
- afficher clairement le niveau de confiance ;
- conserver le moteur topologique comme brique independante.

### Recommandations complementaires

- privilegier `source-to-garde` comme trajectoire MVP principale ;
- completer par `source-to-stations` pour verifier Sidi Allal Tazi ;
- utiliser `snap-diagnostic` en appui diagnostic ou pre-check ;
- reserver `simulate` a un enrichissement optionnel, pas a la verite topologique nominale.

## 14. Prochain lot

Le prochain lot recommande est :

- `LOT 7 - Bibliotheque de matrices`

Le moteur topologique doit alors devenir une entree stabilisee du calcul matrice, sans confusion entre qualification spatiale et evaluation de concentration.
