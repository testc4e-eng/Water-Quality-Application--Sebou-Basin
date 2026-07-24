# 15 - Carte Declaration Pollution

## 1. Objectif

La carte du Dashboard Declaration Pollution sert a afficher :
- le point declare ;
- le point snappe ;
- le parcours aval ;
- `Sidi Allal Tazi` ;
- le `Barrage de Garde` ;
- les avertissements topologiques ;
- le statut visuel des points de controle.

Elle constitue un support de lecture spatiale du dossier, pas un moteur de calcul.

## 2. Principe

La carte affiche le parcours, pas la concentration.

Elle consomme uniquement :
- `topology_result`
- `matrix_result`
- `risk_result`
- `warnings`

### Regle structurante

La carte ne doit produire aucun calcul local de :
- topologie ;
- concentration ;
- statut ;
- recommandation.

Elle projette visuellement ce que le backend a deja valide.

## 3. Couches cartographiques

Les couches cartographiques cibles sont :
- point declare ;
- point snappe ;
- parcours GeoJSON ;
- stations detectees ;
- stations de controle ;
- Barrage de Garde ;
- affluents `Sebou` / `Innaouen` / `Ouergha` ;
- alertes / `warnings`.

### Lecture recommandeee des couches

- couche 1 : fond hydrographique et contexte ;
- couche 2 : point declare ;
- couche 3 : point snappe ;
- couche 4 : parcours aval ;
- couche 5 : stations detectees ;
- couche 6 : stations de controle et Garde mis en evidence ;
- couche 7 : warnings et badges d'etat.

## 4. Reutilisation

### `PollutionIdpMap.tsx`

- Statut : reutilisable comme socle.
- Pourquoi : le composant sait deja afficher le reseau hydro, un point source, un `propagationPath`, des stations et des panneaux de legende.

### Patterns existants de `propagationPath`

- Statut : reutilisables.
- Pourquoi : la logique d'affichage d'un `FeatureCollection` de parcours existe deja dans `PollutionIdpMap.tsx` et `PollutionSignalMap.tsx`.

### Carte pollution existante

- Statut : a adapter.
- Pourquoi : elle porte deja des choix techniques de rendu utiles, mais elle est pensee pour des usages mixtes declaration / propagation / simulation et non pour un workflow declaration officiel.

### Ce qu'il faut eviter

- reutiliser directement `PollutionSimulationPanel.tsx` ou un ecran de simulation libre ;
- laisser le frontend appeler `propagation/*` pour reconstruire le parcours dans la carte ;
- injecter une semantique de concentration sur le parcours lui-meme.

## 5. Donnees consommees

Les entrees cartographiques principales sont :
- `point_declaration`
- `topology_result.snapped_point`
- `topology_result.parcours_geojson`
- `topology_result.stations_detectees`
- `topology_result.barrage_garde_atteint`
- `matrix_result`
- `recommendations`
- `warnings`

### Usage des donnees

- `point_declaration` : marker utilisateur source ;
- `snapped_point` : marker du point reseau retenu ;
- `parcours_geojson` : trace aval principale ;
- `stations_detectees` : points atteints ;
- `barrage_garde_atteint` : badge ou etat de controle ;
- `matrix_result` : statut visuel des stations de controle seulement ;
- `recommendations` : popup ou bloc contextualise, sans modifier le trace ;
- `warnings` : bandeaux ou badges.

## 6. Affichage UX

L'affichage UX doit prevoir :
- une legende ;
- des couleurs ;
- des badges ;
- des popups ;
- des messages d'alerte ;
- un zoom automatique ;
- un affichage avant / apres analyse.

### Recommandations visuelles

- point declare : couleur neutre ou ambree ;
- point snappe : couleur bleue ou cyan, distincte ;
- parcours aval : ligne bleue soutenue ;
- station de controle suffisante : vert ;
- station de controle insuffisante : rouge ;
- warnings topologiques : amber ;
- blocage topologique : rouge fort.

### Zoom et viewport

- avant analyse : zoom sur la zone de declaration ;
- apres analyse : `fitBounds` sur point declare + point snappe + parcours + stations de controle ;
- en cas d'erreur : recentrer sur le point declare et afficher l'alerte.

## 7. Etats carte

Les etats carte cibles sont :
- carte vide ;
- point selectionne ;
- snap disponible ;
- analyse en cours ;
- parcours affiche ;
- risque faible ;
- risque eleve ;
- erreur topologique.

### Lecture etat -> rendu

- `carte vide` : reseau de fond + legende minimale ;
- `point selectionne` : point declare visible sans parcours ;
- `snap disponible` : point declare + point snappe + message de confiance ;
- `analyse en cours` : skeleton ou overlay de chargement ;
- `parcours affiche` : trajet + points de controle ;
- `risque faible` : badges verts sur stations ;
- `risque eleve` : badges rouges sur stations concernees ;
- `erreur topologique` : point visible, pas de parcours officiel, message bloqueur.

## 8. Regles metier carte

- ne pas afficher un parcours non valide ;
- distinguer point declare et point snappe ;
- alerter si le snap est trop loin ;
- bloquer si Garde n'est pas atteint ;
- ne pas colorer tout le parcours comme concentration reelle ;
- afficher les limites scientifiques.

### Lecture stricte

- la carte ne montre pas un panache ni un gradient de pollution ;
- le parcours n'est qu'un chemin topologique ;
- le statut par station peut etre colorise, mais pas la ligne entiere ;
- un resultat hors domaine ou a faible confiance doit etre explicitement signale.

## 9. Popups attendues

Les popups attendues sont :
- point declare ;
- point snappe ;
- `Sidi Allal Tazi` ;
- `Barrage de Garde` ;
- recommandation principale.

### Contenu minimal

- point declare : coordonnees, date, polluant ;
- point snappe : distance de snap, niveau de confiance ;
- `Sidi Allal Tazi` : statut, concentration estimee, warnings ;
- `Barrage de Garde` : statut, concentration estimee, atteinte aval ;
- recommandation principale : axe, delta debit, justification courte.

## 10. Criteres de validation

La carte est validee si :
- le point est visible ;
- le snap est visible ;
- le parcours est visible ;
- les stations sont visibles ;
- Garde est visible ;
- les `warnings` sont lisibles ;
- aucun calcul local n'est effectue ;
- le GeoJSON est affiche correctement.

## 11. Risques

Les principaux risques sont :
- carte trop chargee ;
- confusion parcours / concentration ;
- mauvais zoom ;
- GeoJSON lourd ;
- popup trop technique ;
- incoherence entre carte et panneaux resultats.

### Lecture de risque

- une carte surchargee degrade la demonstration ;
- une couleur de ligne mal interpretee peut faire croire a une concentration le long du parcours ;
- un GeoJSON trop lourd nuira a la fluidite ;
- des popups trop techniques casseront la lisibilite metier ;
- une station rouge sur la carte doit correspondre strictement au panneau resultat.

## 12. Plan d'implementation carte

Le plan d'implementation recommande est :
1. isoler le composant `DeclarationMapPanel` ;
2. creer `TopologyResultLayer` ;
3. adapter la logique `path` existante ;
4. ajouter les points de controle ;
5. ajouter les `warnings` ;
6. ajouter la legende ;
7. tester avec le cas `Dar El Arssa`.

### Ordre pratique

- reprendre `PollutionIdpMap.tsx` comme socle ;
- retirer la logique orientee simulation libre ;
- connecter uniquement la reponse `evaluateDeclaration` ;
- verrouiller la lecture visuelle du parcours et des stations ;
- ajouter ensuite les popups et les badges.

## 13. Prochain lot

Le prochain lot recommande est :
- `LOT 9 - Tests & validation`

Puis :
- implementation controlee.
