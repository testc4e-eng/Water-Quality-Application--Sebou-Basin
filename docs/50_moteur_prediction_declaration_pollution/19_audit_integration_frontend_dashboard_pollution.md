# 19 - Audit integration frontend Dashboard Pollution

## 1. Objectif

Le MVP ne doit pas conserver durablement deux dashboards paralleles pour un meme geste metier.

L'etat actuel separe :
- `DashboardPollution`, qui possede deja la carte operationnelle, le reseau hydrographique, les sites pollution, les stations, le pointage carte et les outils de propagation ;
- `DashboardDeclarationPollution`, qui possede le workflow officiel `create -> submit -> evaluate -> report`, les resultats matriciels, les recommandations et l'explication decisionnelle.

Cette separation etait utile pour derisquer le backend/API Declaration Pollution, mais elle n'est pas coherente pour l'equipe metier. Une declaration de pollution doit devenir un mode de travail du cockpit pollution, pas une page concurrente.

Objectif cible :
- `DashboardPollution` devient l'ecran unique du MVP ;
- `DashboardDeclarationPollution` devient un reservoir temporaire de composants et de logique UI ;
- le backend/API Declaration Pollution reste inchange ;
- aucune logique metier ou scientifique n'est deplacee cote frontend.

## 2. Etat actuel des deux pages

### `DashboardPollution.tsx`

Role actuel :
- cockpit pollution existant ;
- consultation des sites pollution ;
- affichage des couches pollution et stations qualite ;
- pointage libre d'une source sur carte ;
- propagation indicative via endpoints existants ;
- affichage d'impacts potentiels et recommandations generiques.

Fonctionnalites :
- selection d'un site pollution existant ;
- affichage/masquage des sites pollution ;
- changement de symbologie ;
- mode `Pointer une source` ;
- appel a `simulatePropagation` depuis coordonnees ou site ;
- affichage du `propagationPath` ;
- consultation des stations, barrages, exutoires atteignables ;
- recommandations via `useDecisionRecommendations`.

Composants utilises :
- `PollutionIdpMap` ;
- `PageHeader` ;
- `Tabs` ;
- `Card`, `Badge`, `StatusBadge`, `Button` ;
- icones `lucide-react`.

Appels API :
- `usePollutionIdp` -> `/api/v1/pollution/sites.geojson` ;
- `usePollutionLatestResults` -> `/api/v1/pollution/latest-results` ;
- `simulatePropagation` -> `/api/v1/propagation/simulate` ;
- `useSnapDiagnostic` ;
- `usePropagationToGarde` ;
- `usePropagationToStations` ;
- `usePropagationToBarrages` ;
- `usePropagationToExutoires` ;
- `useDecisionRecommendations` -> `/api/v1/recommendations` ;
- `useBusinessMapFeatures` pour stations qualite/sentinelle.

Carte utilisee :
- `PollutionIdpMap`, basee sur `react-map-gl/maplibre` ;
- reseau hydrographique charge via `getPropagationNetworkGeoJSON` ;
- couches sites pollution, stations qualite, point source, parcours propagation et cibles impactees.

Limites :
- logique de simulation libre et workflow declaration officielle encore melanges conceptuellement ;
- `simulatePropagation` est utile au mode normal, mais ne doit pas devenir le moteur du workflow declaration ;
- `DashboardPollution.tsx` est deja volumineux et risque de devenir monolithique si le mode declaration est ajoute directement dans le fichier.

Elements reutilisables :
- carte `PollutionIdpMap` ;
- mode de pointage carte ;
- layout cockpit avec carte + panneau lateral ;
- onglets existants ;
- couches sites/stations/reseau ;
- patterns de warning, chargement et selection.

### `DashboardDeclarationPollution.tsx`

Role actuel :
- shell autonome pour le workflow Declaration Pollution ;
- validation du flux backend/API minimal ;
- saisie du preset Dar El Arssa ;
- creation, soumission, evaluation et chargement rapport ;
- restitution brute lisible.

Fonctionnalites :
- formulaire longitude/latitude ;
- formulaire `Crejet`, `QRejet`, `QSebou`, `QInnaouen`, `QOuergha` ;
- bouton `Charger preset Dar El Arssa` ;
- boutons `Creer`, `Soumettre`, `Evaluer`, `Charger report` ;
- affichage statut, `snapshot_id`, `report_available` ;
- affichage topologie, matrice, risque, recommandations, `decision_reasoning`, report payload ;
- branchement de `DeclarationMapPanel`.

Composants utilises :
- `DeclarationMapPanel` ;
- `usePollutionDeclarations` ;
- `PageHeader` ;
- `Card`, `Button`, `Input`, `Label`, `Textarea`.

Appels API :
- `createDeclaration` ;
- `getDeclaration` ;
- `submitDeclaration` ;
- `evaluateDeclaration` ;
- `getDeclarationReport`.

Carte utilisee :
- `DeclarationMapPanel`, carte dediee qui consomme `topology_result.parcours_geojson`.

Limites :
- page autonome concurrente du cockpit pollution ;
- deuxieme carte et deuxieme experience utilisateur ;
- formulaire, resultats et rapport encore tres lies a la page shell ;
- pas d'integration naturelle avec la carte et les couches existantes de `DashboardPollution`.

Elements reutilisables :
- logique formulaire MVP ;
- preset Dar El Arssa ;
- hook `usePollutionDeclarations` ;
- client `pollutionDeclarations.ts` ;
- panneaux de resultats/recommandations/explication ;
- utilitaires `declarationMapPanel.utils.ts` ;
- logique de restitution `topology_result` sans calcul local.

## 3. Architecture cible

Architecture cible :

```text
DashboardPollution
  Mode normal
    consultation sites
    propagation indicative
    impacts potentiels
    recommandations existantes
  Mode declaration
    creation dossier
    localisation point
    snapping via evaluate
    saisie hydrologie/rejet
    evaluation officielle
    resultats
    recommandations declaration
    explication decisionnelle
    rapport
```

Structure recommandee :

```text
DashboardPollution.tsx
  PollutionDashboardModeSwitcher
  PollutionIdpMap
  DeclarationWorkspace
    DeclarationPointSelector
    DeclarationFormPanel
    DeclarationAnalysisPanel
    DeclarationResultsPanel
    DeclarationRecommendationPanel
    DeclarationDecisionReasoningPanel
    DeclarationReportPanel
```

Principe :
- `DashboardPollution.tsx` reste le conteneur principal ;
- `DeclarationWorkspace` porte tout le mode declaration ;
- `PollutionIdpMap` devient la carte partagee ;
- le mode declaration consomme `usePollutionDeclarations` et `pollutionDeclarations.ts` ;
- la carte affiche les donnees deja retournees par `evaluate`.

## 4. Gestion des modes

Options possibles :
- onglets globaux ;
- segmented control ;
- bouton `Nouvelle declaration` ;
- parametre de route `?mode=declaration`.

Recommandation MVP :
- utiliser un segmented control ou deux boutons d'etat en haut de `DashboardPollution` : `Mode normal` / `Mode declaration` ;
- ajouter un bouton explicite `Nouvelle declaration` qui bascule en mode declaration et initialise le workspace ;
- supporter ulterieurement `?mode=declaration` pour partager un lien direct, sans en faire une dependance du premier lot.

Raison :
- les onglets internes existent deja pour `declared`, `propagation`, `impacts`, `recommendations` ;
- ajouter un onglet global risque de confondre mode de travail et panneau de lecture ;
- un switch de mode rend visible le changement de comportement de la carte.

## 5. Carte unique

La carte existante doit devenir la seule carte du cockpit.

Mode normal :
- sites pollution ;
- stations qualite/sentinelle ;
- reseau hydrographique ;
- source pointee libre ;
- parcours de simulation ;
- cibles impactees ;
- popups de sites existants.

Mode declaration :
- selection point ;
- saisie X/Y ;
- click-to-place ;
- point declare ;
- point snappe ;
- parcours aval officiel depuis `topology_result.parcours_geojson` ;
- stations detectees ;
- stations de controle ;
- Barrage de Garde ;
- warnings.

Implication technique :
- `PollutionIdpMap` doit etre adapte pour accepter des props declaration officielles ;
- `DeclarationMapPanel` ne doit pas rester une deuxieme carte cible ;
- les couches declaration doivent devenir des couches optionnelles de `PollutionIdpMap` ou d'un sous-composant de couches.

Regle maintenue :
- la carte affiche le parcours, pas la concentration ;
- seuls les points de controle peuvent porter un statut visuel `SUFFISANT`, `INSUFFISANT` ou `INCONNU`.

## 6. Selection dynamique du point

Workflow cible :

1. utilisateur active `Mode declaration` ;
2. il clique `Pointer une source` ;
3. clic sur la carte ;
4. `DashboardPollution` stocke `longitude` / `latitude` comme point declare ;
5. `DeclarationWorkspace` pre-remplit le formulaire ;
6. l'utilisateur confirme ou ajuste les donnees ;
7. `createDeclaration` cree le dossier ;
8. `submitDeclaration` passe le statut a `PRET_A_ANALYSER` ;
9. `evaluateDeclaration` appelle le backend declaration ;
10. le backend retourne `snapped_point`, `parcours_geojson`, stations, matrice, recommandations ;
11. `PollutionIdpMap` affiche point declare, point snappe et parcours officiel.

Le point snappe devient le point officiel de depart topologique apres retour backend. Le frontend ne doit pas calculer lui-meme le snap, ni appeler `/propagation/*` pour reconstruire ce resultat dans le workflow officiel.

## 7. Saisie X/Y

La saisie alternative reste necessaire pour la demonstration et les cas terrain.

Champs :
- longitude ;
- latitude.

Workflow :
- saisie X/Y dans `DeclarationPointSelector` ;
- validation de format et bornes simples cote UI ;
- centrage carte sur le point declare ;
- creation/soumission/evaluation via API declaration ;
- affichage du point snappe retourne par le backend ;
- confirmation visuelle de l'ecart declare/snappe.

Regle :
- les validations frontend doivent rester ergonomiques et syntaxiques ;
- les validations topologiques restent backend.

## 8. Composants reutilisables

| Composant | Origine | Decision | Adaptation |
|---|---|---|---|
| `DashboardPollution.tsx` | Page pollution existante | Adapter | Devient conteneur cockpit et porte le mode courant |
| `DashboardDeclarationPollution.tsx` | Shell declaration | Garder temporairement | Reservoir de logique formulaire/resultats pendant migration |
| `PollutionIdpMap.tsx` | Carte pollution | Adapter | Ajouter couches declaration optionnelles et callbacks declaration |
| `DeclarationMapPanel.tsx` | Carte declaration shell | Fusionner | Extraire logique couches/legende vers `PollutionIdpMap`, puis retirer plus tard |
| `declarationMapPanel.utils.ts` | Utils carte declaration | Reutiliser | Garder normalisation SAT/Garde, statut station, bounds |
| `PollutionSignalMap.tsx` | Carte signalement simple | Garder temporairement | Reference secondaire, pas cible cockpit |
| `PollutionPropagationResults.tsx` | Resultats simulation | Garder temporairement | Mode normal uniquement, ne pas melanger avec resultats declaration |
| `PollutionSimulationPanel.tsx` | Simulation libre | Garder temporairement | Mode normal uniquement |
| `usePollutionDeclarations.ts` | Hook declaration | Reutiliser tel quel | Hook principal du `DeclarationWorkspace` |
| `usePropagation.ts` | Hooks propagation | Garder pour mode normal | Ne pas utiliser dans workflow declaration officiel |
| `useDecisionIntelligence.ts` | Recommendations generiques | Garder pour mode normal | Ne remplace pas recommandations declaration |
| `usePollutionIdp.ts` | Sites pollution | Reutiliser | Contexte sites/couches du cockpit |
| `pollutionDeclarations.ts` | API declaration | Reutiliser tel quel | Contrat officiel du mode declaration |
| `propagation.ts` | API propagation | Garder pour mode normal/carte reseau | Pas d'appel direct declaration |
| `decisionIntelligence.ts` | API recommendations generiques | Garder pour mode normal | Hors workflow declaration |
| `Header.tsx` | Navigation haute | Adapter plus tard | Retirer entree autonome apres recette |
| `Sidebar.tsx` | Navigation laterale | Adapter plus tard | Retirer entree autonome apres recette |
| `App.tsx` | Routes | Garder temporairement | Route declaration autonome maintenue pendant transition |

## 9. Composants a fusionner

Elements du shell declaration a integrer dans `DashboardPollution` :
- formulaire de point et hydrologie ;
- bouton preset Dar El Arssa ;
- actions `Creer`, `Soumettre`, `Evaluer`, `Charger report` ;
- panneaux statut declaration ;
- panneaux resultats topologie/matrice ;
- panneaux recommandations ;
- panneau `decision_reasoning` ;
- panneau rapport.

Elements cartographiques a fusionner :
- affichage point declare ;
- affichage point snappe ;
- affichage `parcours_geojson` ;
- warnings topologiques ;
- statuts SAT/Garde ;
- fit bounds sur parcours officiel.

Logique a conserver :
- `usePollutionDeclarations` ;
- `pollutionDeclarations.ts` ;
- types `TopologyResult`, `MatrixResult`, `StationDetected` ;
- utilitaires de normalisation stations ;
- fallback textuel pour stations sans coordonnees.

## 10. Composants a supprimer ulterieurement

A ne rien supprimer maintenant.

Elements candidats apres validation metier :
- page autonome `DashboardDeclarationPollution.tsx` ;
- route `/dashboard-declaration-pollution` ;
- entree `Declaration Pollution` dans `Header.tsx` ;
- entree `Declaration Pollution` dans `Sidebar.tsx` ;
- carte dupliquee `DeclarationMapPanel.tsx` si ses couches ont ete absorbees dans `PollutionIdpMap` ;
- resume temporaire redondant du shell declaration.

Condition de suppression :
- recette navigateur du cockpit unique validee ;
- mode normal non regresse ;
- mode declaration complet ;
- accord metier sur le cockpit unique.

## 11. Nouveaux composants UI a creer

### `PollutionDashboardModeSwitcher`

Role :
- basculer entre mode normal et mode declaration.

Donnees :
- `mode: "normal" | "declaration"` ;
- callbacks de changement de mode.

Dependances :
- `Button`, eventuellement `Tabs` ou segmented control existant.

Emplacement :
- `frontend/src/components/Pollution/PollutionDashboardModeSwitcher.tsx`.

### `DeclarationWorkspace`

Role :
- porter toute l'experience declaration dans `DashboardPollution`.

Donnees :
- point selectionne ;
- declaration courante ;
- evaluation courante ;
- erreurs ;
- rapport ;
- statut workflow.

Dependances :
- `usePollutionDeclarations` ;
- `pollutionDeclarations.ts` ;
- sous-composants declaration.

Emplacement :
- `frontend/src/components/Pollution/DeclarationWorkspace.tsx`.

### `DeclarationPointSelector`

Role :
- gerer clic carte et saisie X/Y.

Donnees :
- longitude ;
- latitude ;
- mode de pointage ;
- point declare ;
- point snappe.

Dependances :
- callbacks de `DashboardPollution` vers `PollutionIdpMap`.

Emplacement :
- `frontend/src/components/Pollution/DeclarationPointSelector.tsx`.

### `DeclarationFormPanel`

Role :
- saisir `Crejet`, `QRejet`, `QSebou`, `QInnaouen`, `QOuergha`, commentaire.

Donnees :
- formulaire declaration ;
- statut workflow ;
- erreurs de saisie.

Dependances :
- UI forms existants.

Emplacement :
- `frontend/src/components/Pollution/DeclarationFormPanel.tsx`.

### `DeclarationAnalysisPanel`

Role :
- piloter `create`, `submit`, `evaluate`, `report`.

Donnees :
- declaration courante ;
- statut ;
- mutations du hook.

Dependances :
- `usePollutionDeclarations`.

Emplacement :
- `frontend/src/components/Pollution/DeclarationAnalysisPanel.tsx`.

### `DeclarationResultsPanel`

Role :
- restituer topologie, matrice, risque et limites.

Donnees :
- `topology_result` ;
- `matrix_result` ;
- `risk_result` ;
- `warnings`.

Dependances :
- `pollutionDeclarations.ts` types.

Emplacement :
- `frontend/src/components/Pollution/DeclarationResultsPanel.tsx`.

### `DeclarationRecommendationPanel`

Role :
- afficher recommandations declaration, scenario principal et alternatives.

Donnees :
- `recommendations`.

Dependances :
- `RecommendationResult`.

Emplacement :
- `frontend/src/components/Pollution/DeclarationRecommendationPanel.tsx`.

### `DeclarationDecisionReasoningPanel`

Role :
- afficher l'explication metier.

Donnees :
- `decision_reasoning`.

Dependances :
- aucune logique scientifique locale.

Emplacement :
- `frontend/src/components/Pollution/DeclarationDecisionReasoningPanel.tsx`.

### `DeclarationReportPanel`

Role :
- afficher disponibilite rapport et payload/report extrait.

Donnees :
- `report_available` ;
- `report_payload`.

Dependances :
- `getDeclarationReport`.

Emplacement :
- `frontend/src/components/Pollution/DeclarationReportPanel.tsx`.

## 12. Gestion de l'etat frontend

Etat dans `DashboardPollution.tsx` :
- mode courant `normal | declaration` ;
- visibility des sites pollution ;
- symbologie ;
- point carte courant ;
- selection de site existant ;
- activation du pointage.

Etat dans `DeclarationWorkspace` :
- formulaire declaration ;
- `currentDeclarationId` ;
- `apiError` ;
- evaluation courante ;
- rapport courant ;
- etat busy derive des mutations.

Etat dans `usePollutionDeclarations` :
- cache liste/detail ;
- mutations create/submit/evaluate ;
- query rapport ;
- invalidations React Query.

Regle :
- ne pas dupliquer `currentDeclaration` dans `DashboardPollution` si le hook le fournit ;
- ne faire remonter a `DashboardPollution` que ce qui impacte la carte : point declare, point snappe, parcours, stations, warnings, statut visuel.

## 13. Contrats API

Le frontend declaration continue de consommer :
- `frontend/src/api/pollutionDeclarations.ts`.

Contrat central :
- `POST /api/v1/pollution/declarations/{id}/evaluate`.

La carte ne doit pas appeler directement :
- `/api/v1/propagation/source-to-garde` ;
- `/api/v1/propagation/source-to-stations` ;
- `/api/v1/propagation/snap-diagnostic`.

Exception :
- ces endpoints restent utilisables dans le mode normal de `DashboardPollution` pour les outils existants de consultation/simulation.

Principe :
- `DashboardPollution` orchestre visuellement ;
- le backend declaration orchestre scientifiquement ;
- `PollutionIdpMap` affiche des couches deja validees par la reponse API.

## 14. Migration sans casse

### Etape 1 - Ajouter le mode declaration sans supprimer l'ancienne page

- ajouter `PollutionDashboardModeSwitcher` ;
- garder `/dashboard-declaration-pollution` ;
- garder entree navigation pendant transition.

### Etape 2 - Reutiliser la carte existante

- adapter `PollutionIdpMap` avec props declaration optionnelles ;
- afficher point declare, point snappe, parcours officiel ;
- conserver comportement mode normal.

### Etape 3 - Brancher formulaire et evaluate

- introduire `DeclarationWorkspace` dans le panneau lateral ou sous la carte ;
- reutiliser `usePollutionDeclarations` ;
- brancher le clic carte sur les champs X/Y.

### Etape 4 - Valider le scenario preset

- rejouer Dar El Arssa ;
- verifier `create`, `submit`, `evaluate`, `report` ;
- verifier carte unique.

### Etape 5 - Desactiver progressivement la route autonome

- retirer l'entree navigation visible ;
- garder la route en fallback interne temporaire ;
- rediriger eventuellement vers `/dashboard-pollution?mode=declaration` apres validation.

### Etape 6 - Supprimer seulement apres recette metier

- supprimer page autonome ;
- supprimer carte dupliquee si obsolete ;
- supprimer resume temporaire.

## 15. Criteres d'acceptation

- un seul cockpit visible pour le MVP ;
- mode normal intact ;
- mode declaration fonctionnel ;
- carte unique ;
- click-to-place operationnel ;
- saisie X/Y operationnelle ;
- snap visible ;
- parcours visible ;
- SAT et Garde visibles au moins en panneau, et en carte si coordonnees disponibles ;
- concentrations affichees ;
- recommandations affichees ;
- `decision_reasoning` lisible ;
- rapport disponible ;
- aucune logique metier locale ;
- aucune regression `DashboardPollution`.

## 16. Risques

- regression carte existante ;
- etat frontend trop complexe ;
- confusion entre mode normal et mode declaration ;
- duplication temporaire ;
- surcharge visuelle ;
- route ancienne utilisee pendant la transition ;
- tentation d'appeler `/propagation/*` depuis le mode declaration pour aller plus vite ;
- `DashboardPollution.tsx` devient monolithique si le workspace n'est pas extrait.

Mitigation :
- extraire `DeclarationWorkspace` des le premier lot d'implementation ;
- garder `PollutionIdpMap` compatible mode normal ;
- tester le mode normal avant/apres ;
- conserver route autonome jusqu'a recette ;
- faire transiter toutes les donnees declaration officielles par `evaluate`.

## 17. Plan d'implementation detaille

### A. Mode switcher

Fichiers concernes :
- `frontend/src/pages/DashboardPollution.tsx`
- `frontend/src/components/Pollution/PollutionDashboardModeSwitcher.tsx`

Modifications attendues :
- ajouter etat `dashboardMode` ;
- ajouter controle `Mode normal` / `Mode declaration` ;
- rendre visible le mode actif.

Dependances :
- aucune backend.

Criteres de sortie :
- mode normal reste identique ;
- mode declaration peut etre active sans lancer d'appel API.

### B. Point selector

Fichiers concernes :
- `DashboardPollution.tsx`
- `PollutionIdpMap.tsx`
- `DeclarationPointSelector.tsx`

Modifications attendues :
- reutiliser `drawMode` ;
- transmettre clic carte au workspace declaration ;
- synchroniser saisie X/Y et point carte.

Dependances :
- mode switcher.

Criteres de sortie :
- clic carte remplit longitude/latitude ;
- saisie X/Y centre ou prepare la carte ;
- aucune evaluation automatique non voulue.

### C. Formulaire declaration

Fichiers concernes :
- `DeclarationWorkspace.tsx`
- `DeclarationFormPanel.tsx`
- logique extraite de `DashboardDeclarationPollution.tsx`

Modifications attendues :
- extraire le formulaire actuel ;
- garder preset Dar El Arssa ;
- preparer payload `PollutionDeclarationCreateRequest`.

Dependances :
- point selector.

Criteres de sortie :
- formulaire MVP complet ;
- pas de duplication des champs dans `DashboardPollution.tsx`.

### D. Integration carte

Fichiers concernes :
- `PollutionIdpMap.tsx`
- `declarationMapPanel.utils.ts`
- eventuellement `DeclarationTopologyLayers.tsx`

Modifications attendues :
- ajouter props declaration optionnelles ;
- afficher `declarationPoint`, `snappedPoint`, `parcours_geojson`, stations avec coordonnees ;
- garder fallback textuel pour stations sans coordonnees.

Dependances :
- point selector ;
- evaluation disponible.

Criteres de sortie :
- parcours officiel visible ;
- point declare et point snappe distincts ;
- mode normal non regresse.

### E. Branchement evaluate

Fichiers concernes :
- `DeclarationWorkspace.tsx`
- `usePollutionDeclarations.ts`

Modifications attendues :
- brancher `create`, `submit`, `evaluate` ;
- exposer a `DashboardPollution` les donnees cartographiques issues de l'evaluation.

Dependances :
- formulaire declaration.

Criteres de sortie :
- scenario `create -> submit -> evaluate` fonctionne depuis le cockpit unique ;
- `snapshot_id` present ;
- erreurs API lisibles.

### F. Resultats/recommandations

Fichiers concernes :
- `DeclarationResultsPanel.tsx`
- `DeclarationRecommendationPanel.tsx`
- `DeclarationDecisionReasoningPanel.tsx`

Modifications attendues :
- extraire les blocs actuels de `DashboardDeclarationPollution.tsx` ;
- afficher topologie, matrice, risque, recommandations, explication.

Dependances :
- evaluate.

Criteres de sortie :
- resultats synchronises avec la carte ;
- aucune reclassification locale du risque.

### G. Rapport

Fichiers concernes :
- `DeclarationReportPanel.tsx`
- `DeclarationWorkspace.tsx`

Modifications attendues :
- brancher `getDeclarationReport` ;
- afficher disponibilite et payload utile.

Dependances :
- evaluate.

Criteres de sortie :
- rapport consultable apres evaluation ;
- `snapshot_id` coherent.

### H. Migration route/navigation

Fichiers concernes :
- `frontend/src/App.tsx`
- `Header.tsx`
- `Sidebar.tsx`

Modifications attendues :
- conserver route au debut ;
- retirer entree navigation seulement apres recette ;
- option future : redirection vers `/dashboard-pollution?mode=declaration`.

Dependances :
- recette cockpit unique.

Criteres de sortie :
- un seul cockpit visible dans la navigation metier ;
- route autonome reste disponible temporairement si besoin de rollback.

### I. Tests et recette

Fichiers concernes :
- tests frontend existants ou nouveaux ;
- recette manuelle navigateur.

Modifications attendues :
- tester utilitaires carte ;
- tester rendu workspace si infrastructure disponible ;
- rejouer scenario preset.

Dependances :
- lots A a G.

Criteres de sortie :
- `npm run build` OK ;
- mode normal OK ;
- mode declaration OK ;
- preset Dar El Arssa OK ;
- aucune erreur console bloquante.

## 18. Recommandation finale

Il ne faut pas integrer directement tout le workflow dans `DashboardPollution.tsx`.

Structure recommandee :

```text
DashboardPollution.tsx
  reste le conteneur principal

DeclarationWorkspace
  porte tout le mode declaration

PollutionIdpMap
  devient la carte partagee
```

Cette structure limite le risque de page monolithique, conserve le cockpit unique pour l'equipe metier et permet de migrer progressivement sans casser le MVP deja executable.

Decision recommandee :
- `GO` pour integration progressive dans `DashboardPollution` ;
- `NO GO` pour suppression immediate de la page autonome ;
- `NO GO` pour deplacer des calculs ou appels topologiques directs dans la carte.

Prochaine action recommandee :
- sous-lot A : creer le mode switcher et le squelette `DeclarationWorkspace` dans `DashboardPollution`, sans supprimer la page autonome.
