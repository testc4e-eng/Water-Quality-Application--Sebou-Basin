# Popup compact sur la carte Accueil DG

## Objectif

Dans le **Dashboard Accueil DG**, la carte métier est un aperçu opérationnel. Le popup au clic sur une entité doit rester **compact** pour ne pas surcharger l’écran. La fiche complète détaillée reste réservée au module **Carte Métier** complet.

## Décision UX

| Contexte | Variante | Contenu |
|---|---|---|
| Accueil DG | `compact` | Mini-fiche : identité, statut, dernière mesure, 2-3 KPI courts, bouton vers la fiche complète |
| Carte Métier complète | `full` | Fiche métier contextuelle complète avec les 5 sections (identité, état, KPIs, qualité des données, actions) |

## Implémentation

### Props ajoutées

- `MetadataCard` accepte `variant?: "compact" | "full"`.
- `BusinessPopup` transmet `variant` à `MetadataCard`.
- `BusinessMap` accepte `popupVariant?: "compact" | "full"` et l’applique au `<Popup>` (largeur max ajustée).

### Utilisation

#### Accueil DG — compact

```tsx
// frontend/src/components/home-v2/OperationalMap.tsx
<BusinessMap
  data={combinedMapData}
  loading={mapLoading}
  error={criticalMapError ?? null}
  mode="home"
  popupVariant="compact"
  overlayTitle="CARTE MÉTIER - VUE BASSIN"
/>
```

#### Carte Métier complet — full (défaut)

```tsx
// Comportement par défaut de BusinessMap
<BusinessMap ... />
```

## Contenu du mode compact

- **Titre** : nom de l’entité
- **Sous-titre** : type métier + code si disponible
- **Badge** : statut opérationnel (Actif / Sans mesure récente / À valider)
- **Ligne info** : dernière mesure ou N/D
- **KPI courts** selon le type :
  - Station qualité : pH, DBO5, O2
  - Station hydro : Débit
  - Station pluvio : Pluie
  - Barrage : Oued / statut
  - Pollution : type de source / dernier contrôle
- **Action** : bouton "Voir la fiche complète" (désactivé si `detail_route` absent)

## Contenu masqué en mode compact

- Section "Qualité des données" détaillée (grille mesures / paramètres / période)
- Section "Calendrier"
- Historique
- Longues descriptions
- Blocs expansibles

## Taille cible

- Largeur max : 320 px (`w-[320px]`)
- Hauteur max : 260 px (`max-h-[260px]`)
- Pas de scroll par défaut (`overflow-hidden`)

## Fichiers concernés

- `frontend/src/components/DashboardMetier/MetadataCard.tsx`
- `frontend/src/components/DashboardMetier/BusinessPopup.tsx`
- `frontend/src/components/DashboardMetier/BusinessMap.tsx`
- `frontend/src/components/DashboardMetier/templates/*.tsx`
- `frontend/src/components/home-v2/OperationalMap.tsx`

## Validation

- `npm run build` ✅
- `python -m compileall -q backend/app` ✅
