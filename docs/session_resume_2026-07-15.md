# Synthese de session - WQDSS / SAD Sebou - 2026-07-15

## 1. Contexte general

Le projet WQDSS / SAD Sebou est en phase de finalisation MVP avec une priorite forte sur la demonstration client/DG.

La direction produit retenue est un cockpit unique centre sur les pollutions declarees :

- `DashboardPollution` devient le cockpit principal.
- `DashboardDeclarationPollution` reste un fallback temporaire.
- Le workflow Declaration Pollution est integre comme vue/metier dans le cockpit Pollution.
- Le backend reste la source de verite pour la topologie, les concentrations, les statuts, les recommandations et les rapports.
- Le frontend reste une couche de saisie, visualisation et restitution.

## 2. Etat actuel du MVP Declaration Pollution

Le scenario metier principal est ferme de bout en bout cote backend et frontend integre :

```text
Declaration
-> Soumission
-> Evaluation
-> Parcours topologique
-> Concentrations estimees
-> Statut de dilution
-> Recommandations
-> Rapport
```

Elements en place :

- API Declaration Pollution : `create -> submit -> evaluate -> report`.
- Adaptateur topologique : `topology_adapter.py`.
- Service declaration : `declaration_pollution_service.py`.
- Matrice NH4 reelle/provisoire integree au moteur selon les derniers jalons.
- Snap, parcours, P29 Sidi Allal Tazi et Amont Barrage de Garde pris en compte.
- Snapshot et `decision_reasoning` exposes.
- Cockpit Pollution avec vue `Surveillance` et vue `Declaration d'incident`.
- Point declare par saisie X/Y ou clic carte.
- Scenario de demonstration.
- Panneaux frontend pour rejet, hydrologie, analyse, resultats, decision, strategies et rapport.

Statut demo retenu :

```text
MVP_DEMO_READY_AVEC_RESERVES
```

Reserves a annoncer :

- matrice NH4 encore a stabiliser scientifiquement ;
- recommandations indicatives ;
- validation humaine obligatoire ;
- certaines donnees hydrologiques restent saisies manuellement ;
- warning Vite sur taille bundle non bloquant.

## 3. Decisions d'architecture validees

### Cockpit unique

Le dashboard Pollution est le point d'entree principal de la demonstration.

```text
/dashboard-pollution
  - Surveillance
  - Declaration d'incident
```

La page autonome :

```text
/dashboard-declaration-pollution
```

reste un fallback temporaire et ne doit pas etre supprimee avant recette finale.

### Separation des responsabilites

- Dashboard : saisie, orchestration visuelle, restitution.
- Backend Declaration : workflow, transitions, orchestration.
- Topologie : snap et parcours aval.
- Matrice : concentrations et statut scientifique.
- Recommandation : strategies de dilution.
- Rapport : restitution tracable.

Aucun calcul scientifique critique ne doit etre deplace cote frontend.

## 4. Corrections pre-demo deja appliquees

### Accueil DG

Corrections appliquees :

- suppression des cartes `IQGB / IFD / IPP / ISR` ;
- suppression du cadran `Confiance donnees` ;
- suppression de la carte tendance `Qualite / score` ;
- suppression du bandeau de couches secondaires optionnelles :
  - `Pollution Option`
  - `Campaigns Option`
  - `Swat Option`
  - `Wasp Option`
  - `Historical Option`

Fichiers concernes :

- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/components/home-v2/HeroSection.tsx`
- `frontend/src/components/home-v2/TrendPanel.tsx`
- `frontend/src/components/home-v2/LayerSummary.tsx`

### Dashboard Qualite des eaux

Corrections appliquees :

- periode par defaut : `Toutes les donnees` ;
- suppression de l'onglet redondant `Barrage de Garde` ;
- onglet `Barrages` renomme en `Barrages et lacs` ;
- `BARRAGE_GARDE` regroupe dans `BARRAGE` pour le donut de repartition par type de support ;
- suppression du cadran `Donnees valides / Donnee insuffisante` ;
- onglet `Historique Rivieres` : ajout d'un tableau des valeurs existantes pour le parametre selectionne ;
- onglet `Historique Rivieres` : ajout d'un selecteur de periode du graphique ;
- onglet `Barrages et lacs` : correction du crash `Cannot read properties of undefined (reading 'toLocaleString')` ;
- onglet `Barrages et lacs` : ajout d'un tableau des valeurs existantes ;
- la barre `Filtres globaux` s'affiche uniquement dans `Vue d'ensemble`.

Fichiers concernes :

- `frontend/src/pages/DashboardQualiteReglementaire.tsx`
- `frontend/src/components/quality-dashboard/types.ts`
- `frontend/src/components/quality-dashboard/QualityGlobalFilters.tsx`
- `frontend/src/components/quality-dashboard/QualityOverviewTab.tsx`
- `frontend/src/components/quality-dashboard/QualityHistoriqueTab.tsx`
- `frontend/src/components/quality-dashboard/QualityDamsTab.tsx`

### Dashboard Pollution - Campagnes

Corrections precedentes appliquees :

- cadrage carte corrige pour rester sur le bassin Sebou ;
- hauteur/layout de carte stabilise ;
- evite l'affichage de territoires hors bassin.

Fichiers concernes notamment :

- `frontend/src/pages/DashboardPollutionCampagnes.tsx`
- `frontend/src/components/Pollution/CampagnePrelevementMap.tsx`

### Acces Donnees / QA et Administration

Corrections appliquees :

- suppression des wrappers frontend `AdminOnly` et `PermissionOnly` sur les routes admin/data ;
- suppression de la redirection globale vers `/login` sur erreur API `401` ;
- les pages restent ouvertes et affichent leurs erreurs fonctionnelles au lieu de quitter le dashboard.

Fichiers concernes :

- `frontend/src/App.tsx`
- `frontend/src/api/client.ts`

## 5. Validation technique recente

Commandes executees avec succes :

```powershell
npm run test
npm run build
```

Resultats observes :

- Vitest : `30 passed`.
- Build Vite : OK.
- Warning bundle Vite toujours present, non bloquant pour la demonstration.

Note :

- certaines verifications navigateur dependent du backend runtime actif ;
- si une page reste en chargement, verifier que le backend expose bien les endpoints attendus et que le proxy Vite pointe vers le bon port.

## 6. Points metier importants pour la demo

### Points de la matrice NH4

Le scenario metier repose sur trois points :

1. point source de pollution detectee, en amont/avant Dar El Arssa ;
2. station de controle `P29 Sidi Allal Tazi` ;
3. station de controle `Amont Barrage de Garde`.

Le parcours de demonstration doit partir du point source de la matrice et tracer la propagation jusqu'au dernier point de controle `Amont Barrage de Garde`.

### Recommandations

Pour les scenarios a risque, afficher les meilleures strategies de dilution :

- Sebou ;
- Innaouen ;
- Ouergha.

Les recommandations restent indicatives et doivent etre presentees comme aide a la decision, pas comme decision automatique.

## 7. Recette manuelle conseillee avant reunion

### Accueil DG

Verifier :

- pas de cartes `IQGB / IFD / IPP / ISR` ;
- pas de cadran `Confiance donnees` ;
- pas de carte tendance `Qualite / score` ;
- pas de bandeau `Option` sous la carte.

### Qualite des eaux

Verifier :

- `Vue d'ensemble` affiche les filtres globaux ;
- les autres onglets n'affichent plus la barre de filtres globale ;
- le donut n'affiche plus `BARRAGE_GARDE`, mais integre ces donnees dans `BARRAGE` ;
- l'onglet s'appelle `Barrages et lacs` ;
- `Historique Rivieres` affiche le graphe et le tableau des valeurs quand une station et un parametre sont selectionnes ;
- `Barrages et lacs` ne crashe plus sur le premier barrage.

### Pollution

Verifier :

- `/dashboard-pollution` ;
- passer en `Declaration d'incident` ;
- charger le scenario de demonstration ;
- lancer analyse ;
- verifier point declare, point snappe, parcours, P29, Amont Barrage de Garde ;
- verifier concentrations, statut, recommandations et rapport ;
- revenir a `Surveillance` sans regression.

### Donnees / QA et Administration

Verifier :

- `/dashboard-data-qa` accessible sans login ;
- `/administration` accessible sans login ;
- sous-routes `/admin/*` accessibles sans redirection vers `/login`.

## 8. Risques residuels

- Certaines pages admin/data peuvent afficher des erreurs API si le backend exige encore une authentification cote serveur.
- Le frontend ne redirige plus vers login, mais les endpoints backend peuvent encore retourner `401/403`.
- Les donnees historiques dependent des contrats API qualite et du runtime local.
- Le warning Vite bundle reste a traiter apres demo par code splitting.
- La matrice NH4 doit rester presentee comme version scientifique encore a valider.

## 9. Suite recommandee apres demonstration

Ordre propose :

```text
1. Recette client/DG
2. Validation Excel/matrice NH4 finale
3. Validation scientifique interpolation
4. Persistance en base des declarations
5. Connexion Sentinelle / donnees temps reel
6. Stabilisation globale API qualite
7. Nettoyage routes fallback et anciennes pages
8. Optimisation frontend / code splitting
9. Recette metier complete
```

Priorite immediate avant reunion :

- rejouer la recette manuelle complete ;
- garder backend et frontend lances sur les ports valides ;
- eviter toute refonte avant la presentation.

