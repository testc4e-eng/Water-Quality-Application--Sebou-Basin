# UI bugfix and dashboard unification report

## Problèmes constatés

1. le Home V2 pouvait rester longtemps sur des skeletons gris alors que l’API backend finissait par répondre ;
2. la sidebar compacte laissait encore apparaître du texte dans une largeur trop faible ;
3. le shell institutionnel sombre n’était appliqué qu’au Home, pas aux autres dashboards principaux ;
4. l’expérience visuelle globale restait hétérogène entre Accueil, Carte Métier, Qualité, Pollution, Analyses et Administration.

## Cause racine du contenu non affiché

La cause principale n’était pas un bug de payload, mais un problème de stratégie de rendu frontend :

- `DashboardHomeV2` affichait un écran skeleton tant que la query était en état de chargement initial ;
- l’endpoint `/api/v1/dashboard/home` est lent en conditions réelles ;
- aucun cache local du dernier payload valide n’était utilisé ;
- le Home ne réaffichait donc rien d’utile avant la fin complète de la requête sur une première visite.

## Correction appliquée

### Home V2

- ajout d’un cache session du dernier payload valide dans :
  - `frontend/src/api/dashboardHome.ts`
- utilisation de ce cache comme `initialData` dans :
  - `frontend/src/hooks/useDashboardHome.ts`
- correction du rendu de `DashboardHomeV2.tsx` :
  - skeleton uniquement si `data` absente
  - si `data` présente, le contenu réel s’affiche même pendant un `refetch`
  - bannière discrète d’actualisation pendant `isFetching`
  - message de chargement prolongé si l’endpoint tarde
  - panneau debug discret en mode `DEV`

## Correction sidebar compacte

Fichier :

- `frontend/src/components/Layout/Sidebar.tsx`

Correction :

- largeur compacte conservée
- masquage complet des textes longs en mode compact
- remplacement par :
  - pastille refresh compacte
  - badge ABH compact
- suppression de tout texte long dans une largeur réduite

## Dashboards uniformisés

Shell institutionnel sombre désormais appliqué à :

- `/`
- `/accueil-sad`
- `/dashboard-carto-metier`
- `/dashboard-qualite-reglementaire`
- `/dashboard-pollution`
- `/analyses`
- `/expert`
- `/administration`
- `/admin/*`

Éléments unifiés :

- `Header`
- `Sidebar`
- `Footer` masqué sur ces routes
- fond principal `#EEF5FF`
- largeur utile cohérente sur les pages concernées

## Fichiers modifiés

- `frontend/src/api/dashboardHome.ts`
- `frontend/src/hooks/useDashboardHome.ts`
- `frontend/src/components/Layout/Layout.tsx`
- `frontend/src/components/Layout/Header.tsx`
- `frontend/src/components/Layout/Sidebar.tsx`
- `frontend/src/components/Layout/Footer.tsx`
- `frontend/src/components/Layout/PageHeader.tsx`
- `frontend/src/pages/DashboardHomeV2.tsx`
- `frontend/src/pages/DashboardCartoMetier.tsx`
- `frontend/src/pages/DashboardQualiteReglementaire.tsx`
- `frontend/src/pages/DashboardPollution.tsx`
- `frontend/src/pages/DashboardAnalytique.tsx`

## Résultat npm build

- `npm run build` : `OK`

## Limites restantes

- l’endpoint `/api/v1/dashboard/home` reste lent ; le cache améliore l’affichage après une première réponse valide, mais ne remplace pas une optimisation backend
- la recette navigateur multi-résolution reste nécessaire pour valider visuellement `1920x1080`, `1600x900` et `1366x768`
- l’uniformisation du shell est faite ; le raffinement fin de chaque dashboard métier peut encore être poursuivi indépendamment

## Captures recommandées

- Home V2 après premier chargement réussi
- Home V2 après refresh pour confirmer l’usage du cache
- sidebar ouverte
- sidebar compacte
- Carte Métier
- Qualité des Eaux
- Pollution
- Analyses

## Décision

`GO_UI_HOME_V2_CONTENT_AND_LAYOUT_FIXED`
