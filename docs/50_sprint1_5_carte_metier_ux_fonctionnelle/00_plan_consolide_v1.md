# Plan consolidé — Carte Métier Analytique V1 / V1.5

## 1. Statut général

La Carte Métier Analytique a été développée en deux temps :
- Sprint 1   = socle technique carte plein écran
- Sprint 1.5 = correction fonctionnelle UX métier

**Statut final :**
- SPRINT_1 = VALIDÉ TECHNIQUEMENT
- SPRINT_1_5 = VALIDÉ FONCTIONNELLEMENT
- CARTE_METIER_ANALYTIQUE_V1 = OPÉRATIONNELLE

---

## 2. Librairies validées

### Cartographie
**MapLibre GL JS / react-map-gl**
*(React-Leaflet n’est pas retenu).*
MapLibre est plus adapté pour :
- GeoJSON dynamique ;
- clustering ;
- styles par support ;
- futures cartes thématiques ;
- palettes, couches avancées, transparence ;
- interaction cartographique fine.

### Graphiques
**Recharts**
Utilisé pour :
- courbes temporelles ;
- statistiques d’objet ;
- futures comparaisons multi-séries.

---

## 3. Backend consommé

La carte consomme exclusivement les endpoints validés :
- `GET /api/v1/business-map/availability`
- `GET /api/v1/business-map/features`
- `GET /api/v1/business-map/series`
- `GET /api/v1/business-map/object/{support_type}/{object_id}`
- `GET /api/v1/business-map/layers`

Aucun endpoint Qualité ou DG n’est modifié.

---

## 4. Architecture frontend créée

### Couche API
`frontend/src/api/businessMapV1.ts`
Rôle : typage TypeScript des contrats backend ; fonctions axios vers `/business-map/*`.

### Hooks React Query
`frontend/src/hooks/useBusinessMapV1.ts`
Rôle : `useBusinessMapAvailability`, `useBusinessMapFeatures`, `useBusinessMapLayers`, `useBusinessMapSeries`, `useBusinessMapObject`.
Options de robustesse : `staleTime: 30000`, `retry: false`, `refetchOnWindowFocus: false`.

---

## 5. Page principale

`frontend/src/pages/DashboardCartoMetier.tsx`
La page est refondue comme un espace plein écran (`h-screen w-screen relative overflow-hidden`).
Elle contient : `MapV1`, `BusinessSidebarV1`, `BusinessRightPanelV1`.

---

## 6. Composants V1

Dossier : `frontend/src/components/DashboardMetier/V1/`

### MapV1.tsx
Rôle : rendu MapLibre ; chargement du GeoJSON via `/features` ; affichage des points ; clustering ; couleurs par support ; popup analytique ; contrôles MapLibre.

### BusinessSidebarV1.tsx
Rôle : filtres intelligents de base ; cascade (Support → Domaine → Sous-domaine → Paramètre) ; résumé des données disponibles.

### BusinessRightPanelV1.tsx
Rôle : détail objet via `/object`; chargement série via `/series`; affichage Recharts; KPI rapides (dernière valeur, date, min, max, moyenne, nombre de mesures).

---

## 7. Corrections Sprint 1.5

- **Correction 1 — Filtrage réel des features** : `/features` reçoit maintenant `support_type`, `domain`, `subdomain`, `parameter_code`. La carte affiche uniquement les objets qui possèdent réellement la donnée choisie.
- **Correction 2 — Symbologie par support** : Couleurs validées (Qualité=bleu, Hydro=bleu foncé, Météo=orange, Barrage=violet, Pollution=rouge). Légende flottante affichée.
- **Correction 3 — Popup analytique** : Au clic sur un objet, une popup MapLibre compacte affiche Nom, Code, Support, Bassin, Bouton “Analyser”.
- **Correction 4 — Panneau droit enrichi** : Affiche identité, série temporelle, Min, Max, Moyenne, Nombre de mesures. Messages clairs pour cas vides et erreurs API.
- **Correction 5 — Contrôles et performance** : `NavigationControl`, `FullscreenControl`, Clustering MapLibre, Cache React Query, blocage appels inutiles.

---

## 8. Limites restantes (À reporter Sprint 2 ou V2)
- analyse multi-support
- analyse multi-paramètres
- panneaux déplaçables
- cartes thématiques réglementaires
- export PDF/image
- dernière valeur directement dans toutes les popups
- classification qualité sur carte

---

## 9. Prochaine étape : Sprint 2.0 — Architecture analytique multi-support

Spécifications attendues pour le Sprint 2.0 :
- modèle AnalysisWorkspace
- modèle MultiSeries
- règles de comparaison d’unités
- gestion des axes multiples
- normalisation temporelle
- sélection multi-objets
